//! Tauri plugin for opening websocket connections with extra optinos for
//! connections to untrusted certificates

use async_channel::{unbounded, Sender};
use async_executor::{Executor, Spawner};

use tauri::{plugin::Plugin, Webview};
use tracing::{debug, trace};
use tungstenite::Message;

use std::{
    collections::HashMap,
    io::Write,
    sync::{Arc, Mutex},
};

/// A Tauri plugin that adds an ssh client
pub struct SshPlugin {}

impl SshPlugin {
    pub fn new() -> Self {
        Self::default()
    }
}

impl Default for SshPlugin {
    fn default() -> Self {
        debug!("Starting tauri ssh plugin");

        // Create the plugin
        SshPlugin {}
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
        open_callback: String,
        message_callback: String,
        close_callback: String,
    },
    /// Send a message over a websocket
    TauriSshSessionSend {
        id: String,
        data: Vec<u8>,
    },
    /// Close a websocket connection
    TauriSshSessionClose {
        id: String,
    },
}

// Implement Tauri plugin trait
impl Plugin for SshPlugin {
    // Add the init.js code that sets up the JavaScript classes and bindings to the Tauri commands
    fn init_script(&self) -> Option<String> {
        Some(include_str!("./ssh_plugin/init.js").into())
    }

    // Add the command handlers for the plugin
    fn extend_api(&self, webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
        use Command::*;

        // Parse the payload as json
        match serde_json::from_str::<Command>(payload) {
            // If the payload fails to parse, assume that it was not meant for this plugin
            Err(_) => Ok(false),
            // Match on the parsed command
            Ok(command) => match command {
                TauriSshKeyGen { callback, error } => {
                    tauri::execute_promise(
                        webview,
                        || {
                            let mut rng = rand::rngs::OsRng;
                            let private = rsa::RSAPrivateKey::new(&mut rng, 4096)?;
                            let public = rsa::RSAPublicKey::from(&private);

                            use rsa::PrivateKeyPemEncoding;
                            use rsa::PublicKeyPemEncoding;
                            Ok(KeyPair {
                                private: private.to_pem_pkcs8()?,
                                public: public.to_pem_pkcs8()?,
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
                    open_callback,
                    message_callback,
                    close_callback,
                } => {
                    let tcp_conn = std::net::TcpStream::connect(host).unwrap();
                    let mut session = ssh2::Session::new().unwrap();
                    session.set_tcp_stream(tcp_conn);
                    session.handshake().unwrap();

                    // Create temporary key files
                    let private_key_tmpfile = tempfile::NamedTempFile::new()?;
                    private_key_tmpfile.write_all(private_key.as_bytes())?;
                    let public_key_tmpfile = tempfile::NamedTempFile::new()?;
                    public_key_tmpfile.write_all(public_key.as_bytes())?;

                    // Crreate session
                    session
                        .userauth_pubkey_file(
                            &user,
                            public_key_tmpfile.path(),
                            public_key_tmpfile.path(),
                            None,
                        )
                        .unwrap();

                    if !session.authenticated() {
                        panic!("Not authenticated");
                    }

                    Ok(true)
                }
                Command::TauriSshKeyGen { callback, error } => Ok(true),
                Command::TauriSshSessionSend { id, data } => Ok(true),
                Command::TauriSshSessionClose { id } => Ok(true),
            },
        }
    }
}
