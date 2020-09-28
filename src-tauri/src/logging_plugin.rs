use tauri::{plugin::Plugin, Webview};
use tracing::{Event, Subscriber};
use tracing_subscriber::{
  layer::Layered,
  layer::{Context, Layer},
  prelude::*,
  reload::Handle,
  EnvFilter, Registry,
};

/// The commands that we can receive from the browser
#[derive(serde::Deserialize)]
#[serde(tag = "cmd", rename_all = "camelCase")]
enum Command {}

struct TestLayer;

impl<S: Subscriber> Layer<S> for TestLayer {
  fn on_event(&self, event: &Event<'_>, _ctx: Context<'_, S>) {
    dbg!(event);
  }
}

/// Logging plugin for Tauri that allows access to the application logs through
/// the webview and also forwards the web logs to the application level
pub struct Logging {
  filter_handle: Handle<EnvFilter, Layered<tracing_subscriber::fmt::Layer<Registry>, Registry>>,
}

impl Logging {
  pub fn new() -> Self {
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
    let subscriber = builder.finish().with(TestLayer);

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
    Logging { filter_handle }
  }
}

impl Plugin for Logging {
  fn init_script(&self) -> Option<String> {
    // Add our init script with the config data substituted into it
    Some(include_str!("./logging_plugin/init.js").into())
  }

  fn extend_api(&self, _webview: &mut Webview<'_>, payload: &str) -> Result<bool, String> {
    // Parse the incomming payload as a command
    match serde_json::from_str::<Command>(payload) {
      Err(_) => Ok(false),
      Ok(command) => match command {},
      //   // Log any errors that occurr
      //   .map_err(|e| {
      //     eprintln!("{:?}", e);
      //     e.to_string()
      //   }),
    }
  }
}
