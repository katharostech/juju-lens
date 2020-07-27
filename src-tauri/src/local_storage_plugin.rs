use tauri::plugin::Plugin;
use tauri::Webview;

use serde_json::Value;

use std::collections::HashMap;

pub struct LocalStorage;

enum Command {
  LocalStorageSetAll { data: HashMap<String, Value> },
}

impl Plugin for LocalStorage {
  fn init_script(&self) -> Option<String> {
    // TODO: load local storage

    Some(format!(include_str!("./local_storage_plugin/init.js",)).into())
  }

  fn extend_api(&self, webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
    use Command::*;
    match serde_json::from_str(arg) {
      Err(e) => Ok(false),
      Ok(command) => {
        match command {
          // Persist local storage
          LocalStorageSetAll { data } => {
            println!("{:#?}", data);
          }
        }
        Ok(true)
      }
    }
  }
}
