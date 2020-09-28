// Logging init script

(function() {
  /**
   * Override the console logging methods to use Tauri instead
   */
  window.realConsoleTrace = console.trace;
  window.realConsoleDebug = console.debug;
  window.realConsoleLog = console.log;
  window.realConsoleWarn = console.warn;
  window.realConsoleError = console.error;

  console.trace = (...args) => {
    window.__TAURI__.tauri.invoke({
      cmd: 'tauriLoggingLog',
      level: 'trace',
      args: args.map(x => x.toString())
    });
  };
  console.debug = (...args) => {
    window.__TAURI__.tauri.invoke({
      cmd: 'tauriLoggingLog',
      level: 'debug',
      args: args.map(x => x.toString())
    });
  };
  console.log = (...args) => {
    window.__TAURI__.tauri.invoke({
      cmd: 'tauriLoggingLog',
      level: 'info',
      args: args.map(x => x.toString())
    });
  };
  console.warn = (...args) => {
    window.__TAURI__.tauri.invoke({
      cmd: 'tauriLoggingLog',
      level: 'warn',
      args: args.map(x => x.toString())
    });
  };
  console.error = (...args) => {
    window.__TAURI__.tauri.invoke({
      cmd: 'tauriLoggingLog',
      level: 'error',
      args: args.map(x => x.toString())
    });
  };

  window.tauriLoggingSetFilter = filter => {
    return window.__TAURI__.promisified({
      cmd: 'tauriLoggingSetFilter',
      filter,
    });
  }
})();
