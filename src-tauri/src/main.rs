#![recursion_limit = "96"]
// This somehow hides the terminal as the app runs on windows
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod local_storage_plugin;
mod logging_plugin;
mod plugin_utils;
mod ssh_plugin;
mod websocket_plugin;

fn main() {
  tauri::AppBuilder::new()
    .plugin(logging_plugin::Logging::new())
    .plugin(
      local_storage_plugin::LocalStorage::new().unwrap_or_else(|e| {
        eprintln!(
          "{} Error processing config file: {}",
          ansi_term::Colour::Red.paint("Error: "),
          e
        );
        std::process::exit(1);
      }),
    )
    .plugin(websocket_plugin::WebsocketPlugin::new())
    .plugin(ssh_plugin::SshPlugin::new())
    .build()
    .run();
}
