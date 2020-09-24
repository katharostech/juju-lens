//! Tauri plugin for opening websocket connections with extra optinos for
//! connections to untrusted certificates

use rsa::{PrivateKeyPemEncoding, PublicKeyParts};
use serde_json::Value;
use ssh2::Stream;
use tauri::{plugin::Plugin, Webview};
use tracing as trc;

use std::{
  collections::HashMap, io::Read, io::Write, sync::mpsc::SyncSender, sync::mpsc::TryRecvError,
  sync::Arc, sync::Mutex,
};

use crate::plugin_utils::run_js_callback;

/// A command to send to the SSH channel
enum ChannelCommand {
  SetPtySize { width: u32, height: u32 },
}

/// SSH Connection data
struct SshConnData {
  stream: Stream,
  // This shutdown sender will keep alive the SSH connection handler thread
  // until it is dropped, but it is not directly read ( thus the
  // allow(dead_code) )
  #[allow(dead_code)]
  command_sender: SyncSender<ChannelCommand>,
}

/// A Tauri plugin that adds an ssh client
#[derive(Default)]
pub struct SshPlugin {
  ssh_connections: Arc<Mutex<HashMap<String, SshConnData>>>,
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
  TauriSshSessionSetPtySize {
    id: String,
    width: u32,
    height: u32,
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
                  private: private.to_pem_pkcs1()?,
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

                // Create the shutdown signal channel
                let (command_sender, command_receiver) = std::sync::mpsc::sync_channel(1);

                // Register the stream
                ssh_connections.lock().unwrap().insert(
                  id.clone(),
                  SshConnData {
                    stream: stream1,
                    command_sender,
                  },
                );

                // Create a thread to handle incomming data from the SSH connection
                std::thread::spawn(move || {
                  trc::trace!("Staring handler thread");

                  let mut buf = [0u8; 1];
                  loop {
                    // Check for shutdown signal
                    match command_receiver.try_recv() {
                      // If we got the signal to resize the terminal
                      Ok(ChannelCommand::SetPtySize { width, height }) => {
                        if let Err(e) = channel.request_pty_size(width, height, None, None) {
                          trc::error!(id = id.as_str(), "Error resizing terminal PTY: {}", e);
                        }
                      }
                      // If we got the signal or the sender was dropped, shutdown the connection
                      Err(TryRecvError::Disconnected) => {
                        trc::debug!(id = id.as_str(), "Closing ssh connection");
                        // Set blocking so we don't have to handle async
                        session.set_blocking(true);

                        // Close the channel
                        if let Err(e) = channel.close() {
                          trc::error!(id = id.as_str(), "Error closing SSH connection: {}", e);
                        }

                        break;
                      }
                      // If the signal has not been sent but the channel is still open,
                      // keep looping
                      Err(TryRecvError::Empty) => (),
                    }

                    // If we get an error reading from the ssh stream
                    if let Err(e) = stream2.read_exact(&mut buf) {
                      if e.kind() != std::io::ErrorKind::WouldBlock {
                        // If the channel is closed
                        if channel.eof() {
                          trc::debug!(id = id.as_str(), "SSH channel closed, cleaning up");

                          // Remote the stream from the ssh connction list
                          ssh_connections.lock().unwrap().remove(&id);

                          // Run the connection close callback
                          run_js_callback(webview_mut, close_callback, "".into());

                          // Exit the loop
                          break;
                        } else {
                          trc::error!(id = id.as_str(), "Error reading ssh channel data: {}", e);

                          run_js_callback(
                            webview_mut.clone(),
                            error_callback.clone(),
                            Value::String(e.to_string()).to_string(),
                          )
                        }
                      } else {
                        // 17 milliseconds is about 60hz which is as fast as most screens refreshe
                        // ( so fast enough ) and it doesn't have a noticable impact on CPU usage.
                        std::thread::sleep(std::time::Duration::from_millis(17));
                      }

                    // If se successfully got data from the ssh connection
                    } else {
                      trc::trace!(
                        id = id.as_str(),
                        data = format!("{:?}", buf[0]).as_str(),
                        as_char = format!("{}", buf[0] as char).as_str(),
                        "Got data from SSH connection"
                      );

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
          Command::TauriSshSessionSetPtySize { id, width, height } => {
            trc::trace!(id = id.as_str(), width, height, "Resizing SSH terminal PTY");
            if let Some(conn) = self.ssh_connections.lock().unwrap().get_mut(&id) {
              if let Err(e) = conn
                .command_sender
                .send(ChannelCommand::SetPtySize { width, height })
              {
                trc::error!(
                  id = id.as_str(),
                  "Internal failure to send command to resize SSH terminal PTY: {}",
                  e
                );
              }
            }

            Ok(true)
          }
          Command::TauriSshSessionSend { id, data } => {
            if let Some(conn) = self.ssh_connections.lock().unwrap().get_mut(&id) {
              let decoded = base64::decode(&data).expect("Could not decode base64");
              trc::trace!(
                id = id.as_str(),
                data = data.as_str(),
                decoded = format!("{:?}", decoded).as_str(),
                "Sending data to SSH connection"
              );
              conn.stream.write_all(&decoded).expect("TODO:");
            }
            Ok(true)
          }
          Command::TauriSshSessionClose { id } => {
            // Remove the connection data which will shutdown the connection by
            // dropping the shutdown sender
            if let None = self.ssh_connections.lock().unwrap().remove(&id) {
              trc::warn!(
                id = id.as_str(),
                "Attempted to delete non-existant SSH session"
              );
            }

            Ok(true)
          }
        }
      }
    }
  }
}
