//! Tauri plugin for opening websocket connections with extra optinos for
//! connections to untrusted certificates

use rsa::{PrivateKeyPemEncoding, PublicKeyParts};
use serde_json::Value;
use ssh2::{Session, Stream};
use tauri::{plugin::Plugin, Webview, WebviewMut};
use tracing as trc;

use std::{collections::HashMap, io::Read, io::Write, sync::mpsc::Sender, sync::Arc, sync::Mutex};

use crate::plugin_utils::run_js_callback;

/// A Tauri plugin that adds an ssh client
#[derive(Default)]
pub struct SshPlugin {
  ssh_connections: Arc<Mutex<HashMap<String, Stream>>>,
}

impl SshPlugin {
  pub fn new() -> Self {
    trc::trace!("Starting tauri ssh plugin");
    Self::default()
  }
}

/// A public and private key pair in PEM format
#[derive(serde::Serialize)]
struct KeyPair {
  private: String,
  public: String,
}

/// The commands that we can receive from the browser
#[derive(serde::Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
enum Command {
  TauriSshKeyGen {
    callback: String,
    error: String,
  },
  /// Create a new websocket connection
  TauriSshSessionCreate {
    id: String,
    user: String,
    host: String,
    public_key: String,
    private_key: String,
    host_key: Option<String>,
    error_callback: String,
    message_callback: String,
    close_callback: String,
    // These are from the Tauri JS `promisified` function
    callback: String,
    error: String,
  },
  /// Send a message over a websocket
  TauriSshSessionSend {
    id: String,
    data: String,
  },
  /// Close a websocket connection
  TauriSshSessionClose {
    id: String,
  },
}

trait ErrDisplay<T, E> {
  fn err_display(self) -> Result<T, String>;
}

impl<T, E: std::error::Error> ErrDisplay<T, E> for Result<T, E> {
  fn err_display(self) -> Result<T, String> {
    self.map_err(|e| format!("{}", e))
  }
}

// Implement Tauri plugin trait
impl Plugin for SshPlugin {
  // Add the init.js code that sets up the JavaScript classes and bindings to the Tauri commands
  fn init_script(&self) -> Option<String> {
    Some(include_str!("./ssh_plugin/init.js").into())
  }

  // Add the command handlers for the plugin
  fn extend_api(&self, webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
    // Parse the payload as json
    match serde_json::from_str::<Command>(payload) {
      // If the payload fails to parse, assume that it was not meant for this plugin
      Err(_) => return Ok(false),
      // Match on the parsed command
      Ok(command) => {
        match command {
          Command::TauriSshKeyGen { callback, error } => {
            tauri::execute_promise(
              webview,
              || {
                trc::debug!("Generating SSH key pair");
                let mut rng = rand::thread_rng();
                let private = rsa::RSAPrivateKey::new(&mut rng, 4096)?;
                let public = openssh_keys::PublicKey::from_rsa(
                  private.e().to_bytes_be(),
                  private.n().to_bytes_be(),
                );

                Ok(KeyPair {
                  private: private.to_pem_pkcs8()?,
                  public: public.to_key_format(),
                })
              },
              callback,
              error,
            );
            Ok(true)
          }
          Command::TauriSshSessionCreate {
            id,
            user,
            host,
            public_key,
            private_key,
            host_key,
            error_callback,
            message_callback,
            close_callback,
            // These are from the Tauri JS `promisified` function
            callback,
            error,
          } => {
            trc::debug!(id = id.as_str(), "Creating SSH session");
            let ssh_connections = self.ssh_connections.clone();
            let webview_mut = webview.as_mut();
            tauri::execute_promise(
              webview,
              move || {
                let tcp_conn = std::net::TcpStream::connect(host)?;
                let mut session = ssh2::Session::new()?;
                session.set_tcp_stream(tcp_conn);
                session.handshake()?;

                // Create temporary key files
                let mut private_key_tmpfile = tempfile::NamedTempFile::new()?;
                private_key_tmpfile.write_all(private_key.as_bytes())?;
                let mut public_key_tmpfile = tempfile::NamedTempFile::new()?;
                public_key_tmpfile.write_all(public_key.as_bytes())?;

                // Create session
                session.userauth_pubkey_file(
                  &user,
                  Some(public_key_tmpfile.path()),
                  private_key_tmpfile.path(),
                  None,
                )?;

                // Make sure we are authenticated
                if !session.authenticated() {
                  anyhow::bail!("Failed to authenticate SSH session");
                }

                // Create an SSH channel
                let mut channel = session.channel_session()?;
                // Tell it to merge stdout and stderr
                channel.handle_extended_data(ssh2::ExtendedData::Merge)?;
                // Request a psuedo terminal
                channel.request_pty("xterm", None, None)?;
                // Start a shell
                channel.shell()?;

                // Set nonblocking on the SSH connection
                session.set_blocking(false);

                // Create a ( ssh ) stream from the ( ssh ) channel
                // that can be used to write to the ( ssh ) channel
                let stream1 = channel.stream(0);
                // Create another stream that can be used to read
                // data from the SSH stream
                let mut stream2 = channel.stream(0);

                // Register the stream
                ssh_connections.lock().unwrap().insert(id, stream1);

                // Create a thread to handle incomming data from the SSH connection
                std::thread::spawn(move || {
                  trc::trace!("Staring handler thread");
                  let mut buf = [0u8; 1];
                  loop {
                    if let Err(e) = stream2.read_exact(&mut buf) {
                      if e.kind() != std::io::ErrorKind::WouldBlock {
                        panic!("Error [TODO]: {}", e);
                      }
                    } else {
                      run_js_callback(
                        webview_mut.clone(),
                        message_callback.clone(),
                        format!(
                          "(() => {{const a = new Uint8Array(1); a[0] = {}; return a; }})()",
                          buf[0]
                        ),
                      );
                    }
                  }
                });

                Ok(())
              },
              callback,
              error,
            );
            Ok(true)
          }
          Command::TauriSshSessionSend { id, data } => {
            if let Some(stream) = self.ssh_connections.lock().unwrap().get_mut(&id) {
              trc::trace!(
                id = id.as_str(),
                data = data.as_str(),
                "Sending data to SSH connection"
              );
              stream.write_all(&data.as_bytes()).expect("TODO:");
            }
            Ok(true)
          }
          Command::TauriSshSessionClose { id } => Ok(true),
        }
      }
    }
  }
}
