use anyhow::Context;
use tauri::plugin::Plugin;
use tauri::Webview;
use tauri_api::config::get as get_config;
use tauri_api::path::config_dir;

use std::{
  collections::HashMap,
  fs::{File, OpenOptions},
  io::{Read, Seek, SeekFrom, Write},
};

pub struct LocalStorage;

/// Runs a closure passing in the config file path and returning an error if the
/// path can not be loaded.
fn run_with_config_file<F: FnOnce(File) -> anyhow::Result<T>, T>(f: F) -> anyhow::Result<T> {
  let config_dir =
    config_dir().ok_or_else(|| anyhow::format_err!("Could not find user config dir"))?;
  let app_identifier = &get_config()
    .context("Could not get Tauri config")?
    .tauri
    .bundle
    .identifier;

  let config_file = OpenOptions::new()
    .create(true)
    .write(true)
    .read(true)
    .open(config_dir.join(format!("{}.localStorage.json", app_identifier)))?;

  Ok(f(config_file).context("Error updating config")?)
}

#[derive(serde::Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
enum Command {
  TauriLocalStorageSetItem { key: String, value: String },
  TauriLocalStorageRemove { key: String },
  TauriLocalStorageClear,
}

impl Plugin for LocalStorage {
  fn init_script(&self) -> Option<String> {
    let data = run_with_config_file(|mut config_file| {
      let mut raw_data = String::new();

      config_file.read_to_string(&mut raw_data)?;

      if raw_data == "" {
        return Ok("{}".into());
      } else {
        return Ok(raw_data);
      }
    })
    .unwrap();

    Some(
      include_str!("./local_storage_plugin/init.tpl.js")
        .replace("'{{data}}'", &data)
        .into(),
    )
  }

  fn extend_api(&self, _webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
    use Command::*;
    match serde_json::from_str(payload) {
      Err(_) => Ok(false),
      Ok(command) => {
        // TODO: Make these commands asynchronous?
        match command {
          // Persist local storage
          TauriLocalStorageSetItem { key, value } => run_with_config_file(|mut config_file| {
            let mut raw_data = String::new();

            config_file.read_to_string(&mut raw_data)?;

            let mut data: HashMap<String, String>;
            if raw_data == "" {
              config_file.write_all(b"{}")?;
              data = HashMap::new();
            } else {
              data = serde_json::from_str(&raw_data).context("Could not parse local storage")?;
            }

            data.insert(key, value);

            config_file.set_len(0)?;

            config_file.seek(SeekFrom::Start(0))?;

            serde_json::to_writer(config_file, &data)?;

            Ok(true)
          }),
          TauriLocalStorageRemove { key } => run_with_config_file(|mut config_file| {
            let mut raw_data = String::new();

            config_file.read_to_string(&mut raw_data)?;

            let mut data: HashMap<String, String>;
            if raw_data == "" {
              config_file.write_all(b"{}")?;
              data = HashMap::new();
            } else {
              data = serde_json::from_str(&raw_data).context("Could not parse local storage")?;
            }

            data.remove(&key);

            config_file.set_len(0)?;

            config_file.seek(SeekFrom::Start(0))?;

            serde_json::to_writer(config_file, &data)?;

            Ok(true)
          }),
          TauriLocalStorageClear => run_with_config_file(|mut config_file| {
            config_file.set_len(0)?;

            config_file.seek(SeekFrom::Start(0))?;

            config_file.write_all(b"{}")?;

            Ok(true)
          }),
        }
      }
      .map_err(|e| {
        eprintln!("{:?}", e);
        e.to_string()
      }),
    }
  }
}
