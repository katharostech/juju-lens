//! A Tauri plugin that provides a `window.localStorage`-like interface to an
//! app-specific file in the users config dir.

use anyhow::Context as _;
use tauri::plugin::Plugin;
use tauri::Webview;
use tauri_api::config::get as get_config;
use tauri_api::path::config_dir;

use std::{
  collections::HashMap,
  fs::{File, OpenOptions},
  io::{Read, Seek, SeekFrom, Write},
};

/// A Tauri plugin that provides a `window.localStorage`-like interface to an
/// app-specific file in the users config dir.
pub struct LocalStorage;

/// Runs a closure passing in the config file path and returning an error if the
/// path can not be loaded.
fn run_with_config_file<F: FnOnce(File) -> anyhow::Result<T>, T>(f: F) -> anyhow::Result<T> {
  // Obtain config dir for this user
  let config_dir =
    config_dir().ok_or_else(|| anyhow::format_err!("Could not find user config dir"))?;
  // Load the unique app identifier from the Tauri config
  let app_identifier = &get_config()
    .context("Could not get Tauri config")?
    .tauri
    .bundle
    .identifier;

  // Open the config file
  let config_file_path = config_dir.join(format!("{}.localStorage.json", app_identifier));
  let config_file = OpenOptions::new()
    .create(true)
    .write(true)
    .read(true)
    .open(&config_file_path)
    .context(format!(
      "Could not open config file: {:?}",
      &config_file_path
    ))?;

  // Run the passed in closure, giving it our opened config file
  Ok(f(config_file).context("Error updating config")?)
}

/// The commands that we can receive from the browser
#[derive(serde::Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
enum Command {
  TauriLocalStorageSetItem { key: String, value: String },
  TauriLocalStorageRemove { key: String },
  TauriLocalStorageClear,
}

impl Plugin for LocalStorage {
  fn init_script(&self) -> Option<String> {
    // Load the config file
    let data = run_with_config_file(|mut config_file| {
      // Read the contents of the config file
      let mut raw_data = String::new();
      config_file.read_to_string(&mut raw_data)?;

      // If the config file is empty, return an empty JSON object
      if raw_data == "" {
        return Ok("{}".into());
      // Otherwise, take the JSON data from the file
      } else {
        return Ok(raw_data);
      }
    })
    .unwrap_or_else(|e| {
      eprintln!("{:?}", e);
      String::new()
    });

    // Add our init script with the config data substituted into it
    Some(
      include_str!("./local_storage_plugin/init.tpl.js")
        .replace("'{{data}}'", &data)
        .into(),
    )
  }

  fn extend_api(&self, _webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
    use Command::*;
    // Parse the incomming payload as a command
    match serde_json::from_str::<Command>(payload) {
      Err(_) => Ok(false),
      Ok(command) => {
        match command {
          // Set an item in the local storage
          TauriLocalStorageSetItem { key, value } => run_with_config_file(|mut config_file| {
            // Read the file data
            let mut raw_data = String::new();
            config_file.read_to_string(&mut raw_data)?;

            // Parse the data or initialize it if empty
            let mut data: HashMap<String, String>;
            if raw_data == "" {
              config_file.write_all(b"{}")?;
              data = HashMap::new();
            } else {
              data = serde_json::from_str(&raw_data).context("Could not parse local storage")?;
            }

            // Add the item to the data
            data.insert(key, value);

            // Truncate the file and re-write it with our updated data
            config_file.set_len(0)?;
            config_file.seek(SeekFrom::Start(0))?;
            serde_json::to_writer(config_file, &data)?;

            Ok(true)
          }),
          TauriLocalStorageRemove { key } => run_with_config_file(|mut config_file| {
            // Read the config file
            let mut raw_data = String::new();
            config_file.read_to_string(&mut raw_data)?;

            // Parse the config file or initialize it if empty
            let mut data: HashMap<String, String>;
            if raw_data == "" {
              config_file.write_all(b"{}")?;
              data = HashMap::new();
            } else {
              data = serde_json::from_str(&raw_data).context("Could not parse local storage")?;
            }

            // Remove the item from the data
            data.remove(&key);

            // Truncate the file and re-write it with our updated data
            config_file.set_len(0)?;
            config_file.seek(SeekFrom::Start(0))?;
            serde_json::to_writer(config_file, &data)?;

            Ok(true)
          }),
          TauriLocalStorageClear => run_with_config_file(|mut config_file| {
            // Truncate the file and initialize it with an empty JSON object
            config_file.set_len(0)?;
            config_file.seek(SeekFrom::Start(0))?;
            config_file.write_all(b"{}")?;

            Ok(true)
          }),
        }
      }
      // Log any errors that occurr
      .map_err(|e| {
        eprintln!("{:?}", e);
        e.to_string()
      }),
    }
  }
}
