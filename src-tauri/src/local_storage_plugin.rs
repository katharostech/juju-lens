//! A Tauri plugin that provides a `window.localStorage`-like interface to an
//! app-specific file in the users config dir.

use anyhow::Context as _;
use tauri::plugin::Plugin;
use tauri::Webview;
use tauri_api::config::get as get_config;
use tauri_api::path::config_dir;
use tracing as trc;

use std::{
  collections::HashMap,
  fs::{File, OpenOptions},
  io::{Read, Seek, SeekFrom},
  sync::Arc,
  sync::Mutex,
};

/// Wrapper for the config file that handles actual file operations
struct Storage(Arc<Mutex<StorageInner>>);

struct StorageInner {
  file: File,
  data: HashMap<String, String>,
}

impl Storage {
  fn new(mut file: File) -> Result<Self, anyhow::Error> {
    let data = {
      // Start at the beginning of the file
      file.seek(SeekFrom::Start(0))?;

      // Get content
      let mut content = String::new();
      let byte_count = file.read_to_string(&mut content)?;

      // If the file is empty
      if byte_count == 0 {
        // Return an empty hash map
        HashMap::new()

      // If the file has data
      } else {
        // Parse the JSON
        serde_json::from_str(&content).context("Could not parse local storage file as JSON")?
      }
    };

    Ok(Storage(Arc::new(Mutex::new(StorageInner { file, data }))))
  }

  fn clone_data(&self) -> HashMap<String, String> {
    self.0.lock().unwrap().data.clone()
  }

  fn with_data<F: FnOnce(&mut HashMap<String, String>) -> T, T>(&self, modify_data: F) {
    // Lock memory
    let StorageInner {
      ref mut file,
      ref mut data,
    } = *self.0.lock().unwrap();

    // Modify the data
    modify_data(data);

    || -> Result<(), anyhow::Error> {
      {
        // Start at the beginning of the file
        file.seek(SeekFrom::Start(0))?;

        // Truncate the file
        file.set_len(0)?;

        // Write the data to the file
        serde_json::to_writer(file, &data)?;

        // Forward return value
        Ok(())
      }
    }()
    // If the file could not be written
    .unwrap_or_else(|e| {
      // Report an error
      trc::error!(
        "Could not load local storage data: '{}'. Continuing with empty local storage",
        e
      );
    })
  }
}

/// A Tauri plugin that provides a `window.localStorage`-like interface to an
/// app-specific file in the users config dir.
pub struct LocalStorage {
  config_storage: Storage,
}

impl LocalStorage {
  pub fn new() -> Result<Self, anyhow::Error> {
    trc::debug!("Loading local storage file");

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
    trc::debug!(
      config_file_path = config_file_path.to_string_lossy().into_owned().as_str(),
      "Using local storage file"
    );
    let config_file = OpenOptions::new()
      .create(true)
      .write(true)
      .read(true)
      .open(&config_file_path)
      .context(format!(
        "Could not open config file: {:?}",
        &config_file_path
      ))?;

    let config_storage = Storage::new(config_file)?;

    Ok(LocalStorage { config_storage })
  }
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
  fn created(&self, _webview: &mut Webview<'_>) {
    trc::debug!("Initialized local storage plugin");
  }

  fn init_script(&self) -> Option<String> {
    // Load the config data
    let data = { self.config_storage.clone_data() };

    // Add our init script with the config data substituted into it
    Some(
      include_str!("./local_storage_plugin/init.tpl.js")
        .replace(
          "'{{data}}'",
          &serde_json::to_string(&data).expect("Could not serialize hash map"),
        )
        .into(),
    )
  }

  fn extend_api(&self, _webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
    // Parse the incomming payload as a command
    match serde_json::from_str::<Command>(payload) {
      Err(_) => Ok(false),
      Ok(command) => {
        match command {
          // Set an item in the local storage
          Command::TauriLocalStorageSetItem { key, value } => {
            trc::trace!(
              key = key.as_str(),
              value = value.as_str(),
              "Setting local storage key"
            );

            // Insert the key
            self
              .config_storage
              .with_data(move |data| data.insert(key, value));

            Ok(true)
          }
          Command::TauriLocalStorageRemove { key } => {
            trc::trace!(key = key.as_str(), "Removing local storage key");

            // Remove the key
            self.config_storage.with_data(|data| data.remove(&key));

            Ok(true)
          }
          Command::TauriLocalStorageClear => {
            trc::trace!("Clearing local storage");

            // Clear the data
            self.config_storage.with_data(|data| *data = HashMap::new());

            Ok(true)
          }
        }
      }
    }
  }
}
