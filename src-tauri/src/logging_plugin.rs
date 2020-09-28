use std::sync::{Arc, Mutex};

use tauri::{plugin::Plugin, Webview, WebviewMut};
use tracing::{self as trc, Event, Level, Subscriber};
use tracing_subscriber::{
  layer::Layered,
  layer::{Context, Layer},
  prelude::*,
  reload::Handle,
  EnvFilter, Registry,
};

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
enum BrowserLogLevel {
  Trace,
  Debug,
  Info,
  Warn,
  Error,
}

/// The commands that we can receive from the browser
#[derive(serde::Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
enum Command {
  TauriLoggingLog {
    level: BrowserLogLevel,
    args: Vec<String>,
  },
}

/// A visitor that can be used to print field values from a logged event
struct StringVisitor<'a> {
  string: &'a mut String,
}

impl<'a> StringVisitor<'a> {
  fn new(string: &'a mut String) -> Self {
    StringVisitor {
      string,
    }
  }
}

use std::fmt::{self, Write};
use tracing::field::{Visit, Field};
impl<'a> Visit for StringVisitor<'a> {
  fn record_debug(&mut self, field: &Field, value: &dyn fmt::Debug) {
    if field.name() == "message" {
      write!(self.string, "{:?};", value).unwrap();
    } else {
      write!(self.string, "{} = {:?}; ", field.name(), value).unwrap();
    }
  }
}

/// A layer that allows us to handle log messages on top of the default handling
/// provided by another subscriber
struct LoggingLayer {
  webview: Arc<Mutex<Option<WebviewMut>>>,
}

impl<S: Subscriber> Layer<S> for LoggingLayer {
  #[cfg(debug_assertions)]
  fn on_event(&self, event: &Event<'_>, _ctx: Context<'_, S>) {
    // On debug builds, log all events to the browser console for convenience
    #[cfg(debug_assertions)]
    if let Some(ref mut webview) = *self.webview.lock().unwrap() {
      let func_name = match *event.metadata().level() {
        Level::TRACE => "Trace",
        Level::DEBUG => "Debug",
        Level::INFO => "Log",
        Level::WARN => "Warn",
        Level::ERROR => "Error",
      }
      .to_string();

      // Format the message
      let mut message = String::new();
      let mut visitor = StringVisitor::new(&mut message);
      event.record(&mut visitor);

      if let Err(e) = webview.dispatch(move |webview| {
        webview.eval(&format!(
          "realConsole{}({})",
          func_name,
          serde_json::Value::String(message)
        ));
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
}

impl Logging {
  pub fn new() -> Self {
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

    // Build the subscriber
    let subscriber = builder.finish().with(LoggingLayer {
      webview: webview.clone(),
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

    // Return the logging plugin
    Logging {
      filter_handle,
      webview,
    }
  }
}

impl Plugin for Logging {
  fn created(&self, webview: &mut Webview<'_>) {
    // Get a webview handle that can be used to log to the browser console
    *self.webview.lock().unwrap() = Some(webview.as_mut());
  }

  fn init_script(&self) -> Option<String> {
    // Add our init script with the config data substituted into it
    Some(include_str!("./logging_plugin/init.js").into())
  }

  fn extend_api(&self, _webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
    // Parse the incomming payload as a command
    match serde_json::from_str::<Command>(payload) {
      Err(_) => Ok(false),
      Ok(command) => match command {
        Command::TauriLoggingLog { args, level } => {
          let message = args.join(" ");

          // Log the message at the desired level
          match level {
            BrowserLogLevel::Trace => trc::trace!(target: "juju_lens::webview_log", "{}", message),
            BrowserLogLevel::Debug => trc::debug!(target: "juju_lens::webview_log", "{}", message),
            BrowserLogLevel::Info => trc::info!(target: "juju_lens::webview_log", "{}", message),
            BrowserLogLevel::Warn => trc::warn!(target: "juju_lens::webview_log", "{}", message),
            BrowserLogLevel::Error => trc::error!(target: "juju_lens::webview_log", "{}", message),
          }

          Ok(true)
        }
      },
    }
  }
}
