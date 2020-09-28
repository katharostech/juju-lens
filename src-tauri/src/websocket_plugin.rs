//! Tauri plugin for opening websocket connections with extra optinos for
//! connections to untrusted certificates

use async_channel::{unbounded, RecvError, Sender};
use async_executor::{Executor, Spawner};
use async_native_tls::TlsConnector;
use futures::{select_biased, FutureExt, SinkExt, StreamExt};
use serde_json::Value;
use tauri::{plugin::Plugin, Webview, WebviewMut};
use tracing as trc;
use tungstenite::Message;

use std::{
  collections::HashMap,
  sync::{Arc, Mutex},
};

use crate::plugin_utils::{log_error, run_js_callback};

mod websocket_client;
use websocket_client::{connect, WsStream};

/// A Tauri plugin that adds a custom websocket implementation.
///
/// The most significant feature of this implementation over the browser's
/// built-in one is that this implementation has an `TauriWebsocketInsecure`
/// variant that allows you to connect to `wss://` endpoints that have untrusted
/// certificates.
pub struct WebsocketPlugin {
  /// The spawner used to spawn async tasks
  spawner: Spawner,
  /// The sender that when dropped will stop the async executor. We don't need
  /// to use it directly because when this plugin is dropped it will
  /// automatically stop the executors.
  #[allow(unused)]
  shutdown_signal: Sender<()>,
  /// The list of websocket connections
  websocket_conns: Arc<Mutex<HashMap<String, Sender<Message>>>>,
}

impl WebsocketPlugin {
  pub fn new() -> Self {
    Self::default()
  }
}

impl Default for WebsocketPlugin {
  fn default() -> Self {
    // Create a new async executor
    let ex = Executor::new();

    // Create a spanwer that will be used to run tasks on the executor
    let spawner = ex.spawner();

    // Create a signal that will be used to shutdown the executor
    let (shutdown_signal, shutdown_receiver) = unbounded::<()>();

    // Spawn 1 executor thread
    // TODO: maybe add more threads later
    std::thread::spawn(move || {
      ex.run(async {
        shutdown_receiver.recv().await.ok();
        trc::trace!("Shutting down executor");
      })
    });

    // Create the plugin
    WebsocketPlugin {
      spawner,
      shutdown_signal,
      websocket_conns: Arc::new(Mutex::new(HashMap::new())),
    }
  }
}

/// The commands that we can receive from the browser
#[derive(serde::Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
enum Command {
  /// Create a new websocket connection
  TauriWebsocketCreate {
    id: String,
    url: String,
    insecure: bool,
    error_callback: String,
    open_callback: String,
    message_callback: String,
    close_callback: String,
  },
  /// Send a message over a websocket
  TauriWebsocketSend { id: String, data: Value },
  /// Close a websocket connection
  TauriWebsocketClose { id: String },
}

// Implement Tauri plugin trait
impl Plugin for WebsocketPlugin {
  fn created(&self, _webview: &mut Webview<'_>) {
      trc::debug!("Initialized WebSocket plugin");
  }

  // Add the init.js code that sets up the JavaScript classes and bindings to the Tauri commands
  fn init_script(&self) -> Option<String> {
    Some(include_str!("./websocket_plugin/init.js").into())
  }

  // Add the command handlers for the plugin
  fn extend_api(&self, webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
    use Command::*;

    // Parse the payload as json
    match serde_json::from_str::<Command>(payload) {
      // If the payload fails to parse, assume that it was not meant for this plugin
      Err(_) => Ok(false),
      // Match on the parsed command
      Ok(command) => {
        match command {
          // Create a websocket
          TauriWebsocketCreate {
            id,
            url,
            insecure,
            error_callback,
            open_callback,
            message_callback,
            close_callback,
          } => {
            trc::trace!(id = id.as_str(), "Received command: tauriWebsocketCreate");

            // Create a channel that allows us to send messages to the websocket manager task
            let (channel_sender, channel_receiver) = unbounded();

            // Add the websocket connection's channel sender to the websocket connection list
            self
              .websocket_conns
              .lock()
              .unwrap()
              .insert(id.clone(), channel_sender);

            // Create a mutable webview that we can give to the websocket manager task
            let mut webview = webview.as_mut();

            // Create the websocket manager task.
            // This task will listen for messages on is channel and send them over the websocket.
            self
              .spawner
              .spawn(async move {
                // Create the TLS connection config
                let mut builder = native_tls::TlsConnector::builder();
                builder.danger_accept_invalid_certs(insecure);
                let tls = TlsConnector::from(builder);

                // Try to connect to the websocket endpoint
                match connect(&url, tls).await {
                  Ok((mut stream, _resp)) => {
                    trc::debug!("Connected to websocket: {}", url);

                    // Run the JS open callback
                    run_js_callback(webview.clone(), open_callback, format!("{}", Value::Null));

                    // Loop through incomming messages
                    loop {
                      select_biased! {
                        // Listen for channel messages, which are message we
                        // should *send* over the websocket
                        channel_message = channel_receiver.recv().fuse() =>
                          // This returns true if we should break out of the loop
                          if (channel_message_handler(
                            channel_message,
                            close_callback.clone(),
                            &mut stream,
                            &mut webview
                          ).await) {
                            break;
                          },
                        // Listen for websocket messages, which are messages we
                        // are *receiving* from the websocket
                        response = stream.next().fuse() =>
                          websocket_message_handler(
                            response,
                            message_callback.clone(),
                            error_callback.clone(),
                            &mut webview
                          ),
                      };
                    }
                  }
                  // If there is a connection error
                  Err(e) => {
                    // Send error to the error callback
                    run_js_callback(
                      webview.clone(),
                      error_callback,
                      Value::String(format!("{:?}", e)).to_string(),
                    );

                    // Log the error
                    log_error(e, webview.clone());
                  }
                }
              })
              .detach();

            Ok(true)
          }
          TauriWebsocketSend { id, data } => {
            trc::trace!(
              id = id.as_str(),
              data = format!("{:?}", data).as_str(),
              "Received command: tauriWebsocketSend"
            );
            // Get the message sender associated to the websocket connection
            if let Some(sender) = self.websocket_conns.lock().unwrap().get(&id) {
              let sender = sender.clone();
              let webview = webview.as_mut();

              self
                .spawner
                .spawn(async move {
                  // TODO: Allow sending data other than text
                  // Send strings unchnaged and send other objects as JSON strings
                  let message = Message::Text(match data {
                    Value::String(s) => s,
                    other_type => other_type.to_string(),
                  });

                  // Send the message over the channel to the thread handling the websocket connection
                  sender
                    .send(message)
                    .await
                    .unwrap_or_else(|e| log_error(e, webview.clone()));
                })
                .detach();
            }

            Ok(true)
          }
          TauriWebsocketClose { id } => {
            // Remove the message sender associated to the websocket connection.
            // This will cause the the connection handler thread to close the
            // connection.
            self.websocket_conns.lock().unwrap().remove(&id);

            Ok(true)
          }
        }
      }
    }
  }
}

//
// Utility functions
//

// Websocket message handler
fn websocket_message_handler(
  response: Option<Result<Message, tungstenite::Error>>,
  message_callback: String,
  error_callback: String,
  webview: &mut WebviewMut,
) {
  if let Some(message) = response {
    match message {
      // Handle received message
      Ok(message) => run_js_callback(webview.clone(), message_callback, {
        match message {
          Message::Text(m) => format!("{{ data: {} }}", Value::String(m)),
          _ => {
            // TODO: Implement other message types
            log_error("Message type not implemented", webview.clone());
            String::new()
          }
        }
      }),
      // Log error receiving message
      Err(e) => {
        run_js_callback(
          webview.clone(),
          error_callback,
          Value::String(format!("{:?}", e)).to_string(),
        );

        log_error(e, webview.clone())
      }
    }
  }
}

// Channel message handler
async fn channel_message_handler(
  channel_message: Result<Message, RecvError>,
  close_callback: String,
  stream: &mut WsStream,
  webview: &mut WebviewMut,
) -> bool {
  match channel_message {
    // If we received a message on the channel
    Ok(message) => {
      // Send the message over the websocket
      trc::trace!(
        sent_message = message.to_string().as_str(),
        "Sending message over websocket"
      );

      if let Err(e) = stream.send(message).await {
        log_error(e, webview.clone());
      }

      // Return false to indicate that we should not stop listening yet
      false
    }

    // If the sender was dropped, close the socket and return true to indicate
    // that we should break the listen loop.
    Err(_e) => {
      run_js_callback(webview.clone(), close_callback, String::new());
      true
    }
  }
}
