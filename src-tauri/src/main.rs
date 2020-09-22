#![recursion_limit = "96"]
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod local_storage_plugin;
mod plugin_utils;
mod ssh_plugin;
mod websocket_plugin;

fn main() {
  // Initialize the logger
  tracing_subscriber::fmt::init();

  tauri::AppBuilder::new()
    .plugin(local_storage_plugin::LocalStorage)
    .plugin(websocket_plugin::WebsocketPlugin::new())
    .plugin(ssh_plugin::SshPlugin::new())
    .build()
    .run();
}
