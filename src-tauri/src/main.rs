#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod cmd;
mod local_storage_plugin;

fn main() {
  tauri::AppBuilder::new()
    .plugin(local_storage_plugin::LocalStorage)
    .build()
    .run();
}
