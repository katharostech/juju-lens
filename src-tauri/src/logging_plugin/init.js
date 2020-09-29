// Logging init script

(function() {
  /** Return a random ID */
  function id() {
    return (Math.random() * 1e17).toString(36);
  }

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
    return window.__TAURI__.tauri.promisified({
      cmd: 'tauriLoggingSetFilter',
      filter
    });
  };

  window.tauriLoggingGetLogs = () => {
    return window.__TAURI__.tauri.promisified({
      cmd: 'tauriLoggingDumpLog'
    });
  };

  class TauriLoggingSubscriber {
    constructor() {
      this._id = id();

      this.onmessage = null;
      this._onmessage_listeners = [];

      window.__TAURI__.tauri.invoke({
        cmd: 'tauriLoggingRegisterSubscriber',
        id: this._id,
        message_callback: window.__TAURI__.tauri.transformCallback(x => {
          if (this.onmessage) {
            this.onmessage(x);
          }
          for (const handler in this._onerror_listeners) {
            handler(x);
          }
        })
      });
    }

    addMessageListener(listener) {
      this._onmessage_listeners.push(listener);
    }

    unregister() {
      window.__TAURI__.tauri.invoke({
        cmd: 'tauriLoggingUnregisterSubscriber',
        id: this._id
      });
    }
  }

  window.TauriLoggingSubscriber = TauriLoggingSubscriber;
})();
