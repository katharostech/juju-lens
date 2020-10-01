use std::{
  collections::HashMap,
  fmt,
  fs::File,
  io::Write,
  sync::{Arc, Mutex},
};

use chrono::{DateTime, Local};
use tauri::{plugin::Plugin, Webview, WebviewMut};
use tracing::{
  self as trc,
  field::{Field, Visit},
  Event, Level, Subscriber,
};
use tracing_subscriber::{
  layer::Layered,
  layer::{Context, Layer},
  prelude::*,
  reload::Handle,
  EnvFilter, Registry,
};

#[derive(Clone, Debug, serde::Deserialize, serde::Serialize)]
#[serde(rename_all = "camelCase")]
enum BrowserLogLevel {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
}

impl From<&trc::Level> for BrowserLogLevel {
  fn from(l: &trc::Level) -> Self {
    match *l {
      trc::Level::TRACE => Self::Trace,
      trc::Level::DEBUG => Self::Debug,
      trc::Level::INFO => Self::Info,
      trc::Level::WARN => Self::Warn,
      trc::Level::ERROR => Self::Error,
    }
  }
}

impl AsRef<str> for BrowserLogLevel {
  fn as_ref(&self) -> &str {
    match self {
      BrowserLogLevel::Trace => "TRACE",
      BrowserLogLevel::Debug => "DEBUG",
      BrowserLogLevel::Info => " INFO",
      BrowserLogLevel::Warn => " WARN",
      BrowserLogLevel::Error => "ERROR",
    }
  }
}

/// A log visitor that catalogs the log records for later retrieval
#[derive(Clone)]
struct LogCatalog {
  records: Arc<Mutex<Vec<CatalogRecord>>>,
  subscribers: Arc<Mutex<HashMap<String, String>>>,
}

/// A log record in the catalog
#[derive(Clone, serde::Serialize)]
struct CatalogRecord {
  message: String,
  fields: HashMap<String, serde_json::Value>,
  level: BrowserLogLevel,
  #[serde(serialize_with = "serialize_timestamp")]
  timestamp: DateTime<Local>,
}

impl CatalogRecord {
  fn new(level: BrowserLogLevel) -> Self {
    CatalogRecord {
      level,
      fields: HashMap::new(),
      message: String::new(),
      timestamp: Local::now(),
    }
  }
}

fn serialize_timestamp<S: serde::Serializer>(
  date: &DateTime<Local>,
  s: S,
) -> Result<S::Ok, S::Error> {
  s.serialize_i64(date.timestamp_millis())
}

// Display for catalog records prints just the message and the fields
impl fmt::Display for CatalogRecord {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(
      f,
      "{} {}",
      self.message,
      self
        .fields
        .iter()
        .map(|(k, v)| format!("{}={}", k, v))
        .collect::<Vec<_>>()
        .join(" ")
    )
  }
}

// Debug for catalog records prints the timestamp and the log level as well in a
// log file type of format
impl fmt::Debug for CatalogRecord {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    // Format the timestamp
    write!(f, "{} ", self.timestamp.format("%b %d %H:%M:%S"))?;

    // Write the log level
    write!(f, "{} ", self.level.as_ref())?;

    // Write the message
    write!(f, "{}", self)
  }
}

impl LogCatalog {
  fn add_new_record(&mut self, level: BrowserLogLevel) {
    let mut records = self.records.lock().unwrap();
    let record = CatalogRecord::new(level);

    records.push(record);
  }

  fn clone_last(&self) -> CatalogRecord {
    if let Some(record) = self.records.lock().unwrap().last() {
      record.clone()
    } else {
      panic!("There's not last record to display");
    }
  }

  fn clone_records(&self) -> Vec<CatalogRecord> {
    self.records.lock().unwrap().clone()
  }
}

impl Visit for LogCatalog {
  fn record_debug(&mut self, field: &Field, value: &dyn fmt::Debug) {
    let mut records = self.records.lock().unwrap();
    if let Some(record) = records.last_mut() {
      let name = field.name();
      if name == "message" {
        record.message = format!("{:?}", value);
      } else {
        record.fields.insert(
          name.into(),
          serde_json::Value::String(format!("{:?}", value)),
        );
      }
    } else {
      panic!("No records to record to!");
    }
  }

  fn record_i64(&mut self, field: &Field, value: i64) {
    let mut records = self.records.lock().unwrap();
    if let Some(record) = records.last_mut() {
      record.fields.insert(
        field.name().into(),
        serde_json::Value::Number(serde_json::Number::from(value)),
      );
    } else {
      panic!("No records to record to!");
    }
  }

  fn record_u64(&mut self, field: &Field, value: u64) {
    let mut records = self.records.lock().unwrap();
    if let Some(record) = records.last_mut() {
      record.fields.insert(
        field.name().into(),
        serde_json::Value::Number(serde_json::Number::from(value)),
      );
    } else {
      panic!("No records to record to!");
    }
  }

  fn record_bool(&mut self, field: &Field, value: bool) {
    let mut records = self.records.lock().unwrap();
    if let Some(record) = records.last_mut() {
      record
        .fields
        .insert(field.name().into(), serde_json::Value::Bool(value));
    } else {
      panic!("No records to record to!");
    }
  }

  fn record_str(&mut self, field: &Field, value: &str) {
    let mut records = self.records.lock().unwrap();
    if let Some(record) = records.last_mut() {
      record
        .fields
        .insert(field.name().into(), serde_json::Value::String(value.into()));
    } else {
      panic!("No records to record to!");
    }
  }

  fn record_error(&mut self, field: &Field, value: &(dyn std::error::Error + 'static)) {
    self.record_debug(field, &value)
  }
}

/// A layer that allows us to handle log messages on top of the default handling
/// provided by another subscriber
struct LoggingLayer {
  webview: Arc<Mutex<Option<WebviewMut>>>,
  log_catalog: LogCatalog,
  subscribers: Arc<Mutex<HashMap<String, String>>>,
  log_file: Arc<Mutex<File>>,
}

impl<S: Subscriber> Layer<S> for LoggingLayer {
  fn on_event(&self, event: &Event<'_>, _ctx: Context<'_, S>) {
    // Format and record the message
    let mut catalog = self.log_catalog.clone();
    catalog.add_new_record(event.metadata().level().into());
    event.record(&mut catalog);
    let record = catalog.clone_last();

    // Log to the log file
    if let Err(e) = writeln!(self.log_file.lock().unwrap(), "{:?}", record) {
      trc::error!("Error logging to file: {}", e);
    }

    // Handle webviewlogging
    if let Some(ref mut webview) = *self.webview.lock().unwrap() {
      // Get the name of the browser console log suffix
      let browser_log_name = match *event.metadata().level() {
        Level::TRACE => "Trace",
        Level::DEBUG => "Debug",
        Level::INFO => "Log",
        Level::WARN => "Warn",
        Level::ERROR => "Error",
      }
      .to_string();

      // Lock our subscribers
      let subscribers = self.subscribers.clone();

      if let Err(e) = webview.dispatch(move |webview| {
        // Log to the browser console on debug builds for convenience
        #[cfg(debug_assertions)]
        webview.eval(&format!(
          "realConsole{}({})",
          browser_log_name,
          serde_json::Value::String(record.to_string())
        ));

        // Run callbacks for our subscribers
        for subscriber_callback in subscribers.lock().unwrap().values() {
          webview.eval(&format!(
            "window[{}]({})",
            serde_json::Value::String(subscriber_callback.into()),
            serde_json::to_string(&record).expect("Could not serialize record")
          ));
        }
      }) {
        eprintln!(
          "{} Problem eval-ing JavaScript: {}",
          ansi_term::Colour::Red.paint("Error:"),
          e
        );
      };
    }
  }
}

/// Logging plugin for Tauri that allows access to the application logs through
/// the webview and also forwards the web logs to the application level
pub struct Logging {
  filter_handle: Handle<EnvFilter, Layered<tracing_subscriber::fmt::Layer<Registry>, Registry>>,
  webview: Arc<Mutex<Option<WebviewMut>>>,
  log_catalog: LogCatalog,
  subscribers: Arc<Mutex<HashMap<String, String>>>,
}

impl Logging {
  pub fn new() -> anyhow::Result<Self> {
    // Create null webview
    let webview = Arc::new(Mutex::new(None));

    // Initialize the fmt subscriber for outputing logs to stdout
    let builder = tracing_subscriber::fmt()
      // Read the JUJU_LENS_LOG env var and default to debug logging for the `juju_lens` module
      .with_env_filter(
        EnvFilter::try_from_env("JUJU_LENS_LOG").unwrap_or(EnvFilter::new("juju_lens=debug")),
      )
      // Enable reloading the log level
      .with_filter_reloading();

    // Grab a handle to the log level so that we can change the log level at runtime
    let filter_handle = builder.reload_handle();

    // Initialize subscriber list
    let subscribers = Arc::new(Mutex::new(HashMap::new()));

    // Create a log catalog
    let log_catalog = LogCatalog {
      records: Default::default(),
      subscribers: subscribers.clone(),
    };

    // Open the log file
    let log_file_path = tauri_api::path::cache_dir()
      .ok_or_else(|| anyhow::format_err!("Could not determine user cache dir"))?
      .join("com.katharostech.juju.jujuLens.log");
    let log_file = std::fs::OpenOptions::new()
      .create(true)
      .write(true)
      .truncate(true)
      .open(log_file_path)?;
    let log_file = Arc::new(Mutex::new(log_file));

    // Build the subscriber
    let subscriber = builder.finish().with(LoggingLayer {
      webview: webview.clone(),
      log_catalog: log_catalog.clone(),
      subscribers: subscribers.clone(),
      log_file,
    });

    // Set the subscriber as the global log handler
    if let Err(e) = tracing::subscriber::set_global_default(subscriber) {
      eprintln!(
        "{} Could not initialize logging: {}",
        ansi_term::Colour::Red.paint("Error:"),
        e
      );
      std::process::exit(1);
    }

    trc::debug!("Logging initialized");

    // Return the logging plugin
    Ok(Logging {
      filter_handle,
      webview,
      log_catalog,
      subscribers,
    })
  }
}

/// The commands that we can receive from the browser
#[derive(serde::Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
enum Command {
  TauriLoggingLog {
    level: BrowserLogLevel,
    args: Vec<String>,
  },
  TauriLoggingSetFilter {
    filter: String,
    callback: String,
    error: String,
  },
  TauriLoggingDumpLog {
    callback: String,
    error: String,
  },
  TauriLoggingRegisterSubscriber {
    id: String,
    message_callback: String,
  },
  TauriLoggingUnregisterSubscriber {
    id: String,
  },
}

impl Plugin for Logging {
  fn created(&self, webview: &mut Webview<'_>) {
    trc::debug!("Initializing logging plugin");

    // Get a webview handle that can be used to log to the browser console
    *self.webview.lock().unwrap() = Some(webview.as_mut());
  }

  fn init_script(&self) -> Option<String> {
    // Add our init script with the config data substituted into it
    Some(include_str!("./logging_plugin/init.js").into())
  }

  fn extend_api(&self, webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
    // Parse the incomming payload as a command
    match serde_json::from_str::<Command>(payload) {
      Err(_) => Ok(false),
      Ok(command) => match command {
        // Log a message command
        Command::TauriLoggingLog { args, level } => {
          let message = args.join(" ");

          // Log the message at the desired level
          match level {
            BrowserLogLevel::Trace => trc::trace!(target: "juju_lens::webview", "{}", message),
            BrowserLogLevel::Debug => trc::debug!(target: "juju_lens::webview", "{}", message),
            BrowserLogLevel::Info => trc::info!(target: "juju_lens::webview", "{}", message),
            BrowserLogLevel::Warn => trc::warn!(target: "juju_lens::webview", "{}", message),
            BrowserLogLevel::Error => trc::error!(target: "juju_lens::webview", "{}", message),
          }

          Ok(true)
        }

        // Update logging filter command
        Command::TauriLoggingSetFilter {
          filter,
          callback,
          error,
        } => {
          trc::debug!(filter = filter.as_str(), "Setting logging filter");

          let filter_handle = self.filter_handle.clone();
          tauri::execute_promise(
            webview,
            move || {
              // Parse the filter
              let filter = filter.parse()?;

              // Use the filter handle to modify the env filter
              filter_handle
                .modify(|layer| {
                  *layer = filter;
                })
                .expect("Subscriber doesn't exist!");

              Ok(())
            },
            callback,
            error,
          );

          Ok(true)
        }

        // Dump all logs
        Command::TauriLoggingDumpLog { callback, error } => {
          trc::debug!("Dumping logs to JavaScript");

          let log_catalog = self.log_catalog.clone();
          tauri::execute_promise(
            webview,
            move || Ok(log_catalog.clone_records()),
            callback,
            error,
          );

          Ok(true)
        }

        // Register log subscriber
        Command::TauriLoggingRegisterSubscriber {
          id,
          message_callback,
        } => {
          self
            .subscribers
            .lock()
            .unwrap()
            .insert(id, message_callback);

          Ok(true)
        }

        // Unregister log subscriber
        Command::TauriLoggingUnregisterSubscriber { id } => {
          self.subscribers.lock().unwrap().remove(&id);

          Ok(true)
        }
      },
    }
  }
}
