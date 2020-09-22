use serde_json::Value;
use tauri::WebviewMut;
use tracing as trc;

/// Log an error to the JavaScript console ( which will in turn log it to the
/// system console ) or otherwise just log it to the system console
pub fn log_error<E: std::fmt::Debug + 'static + Sync + Send>(e: E, mut webview: WebviewMut) {
  webview
    .dispatch(move |webview| {
      webview.eval(&format!(
        "console.error({});",
        Value::String(format!("{:?}", e))
      ))
    })
    .unwrap_or_else(|e| {
      trc::error!("Error: {:?}", e);
    });
}

/// Runs the specified javascript callback, passing it the given payload
pub fn run_js_callback(mut webview: WebviewMut, callback: String, payloadjs: String) {
  webview
    .dispatch(move |webview| {
      let code = format!(
        "window[{callback}]({payloadjs})",
        callback = Value::String(callback),
        payloadjs = payloadjs,
      );
      trc::trace!("Running JS: {}", code);
      webview.eval(&code)
    })
    .unwrap_or_else(|e| log_error(e, webview.clone()));
}
