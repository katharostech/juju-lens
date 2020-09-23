// Local storage init script

/** Return a random ID */
function id() {
  return (Math.random() * 1e17).toString(36);
}

class TauriSshSession {
  constructor(options) {
    this._user = options.user;
    this._host = options.host;
    this._publicKey = options.publicKey;
    this._privateKey = options.privateKey;
    this._hostKey = options.hostKey;

    this._id = id();
    this.onclose = null;
    this._onclose_listeners = [];
    this.onerror = null;
    this._onerror_listeners = [];
    this.onmessage = null;
    this._onmessage_listeners = [];
    this.onopen = null;
    this._onopen_listeners = [];
  }

  async connect() {
    return window.__TAURI__.tauri.promisified({
      cmd: 'tauriSshSessionCreate',
      id: this._id,
      user: this._user,
      host: this._host,
      public_key: this._publicKey,
      private_key: this._privateKey,
      host_key: this._hostKey,
      // Create callbacks
      error_callback: window.__TAURI__.tauri.transformCallback(x => {
        if (this.onerror) {
          this.onerror(x);
        }
        for (const handler in this._onerror_listeners) {
          handler(x);
        }
      }),
      open_callback: window.__TAURI__.tauri.transformCallback(x => {
        if (this.onopen) {
          this.onopen(x);
        }
        for (const handler in this._onopen_listeners) {
          handler(x);
        }
      }, true /* once only callback */),
      message_callback: window.__TAURI__.tauri.transformCallback(x => {
        if (this.onmessage) {
          this.onmessage(x);
        }
        for (const handler in this._onmessage_listeners) {
          handler(x);
        }
      }),
      close_callback: window.__TAURI__.tauri.transformCallback(x => {
        if (this.onclose) {
          this.onclose(x);
        }
        for (const handler in this._onclose_listeners) {
          handler(x);
        }
      }, true /* once only callback */)
    });
  }

  get url() {
    return this._url;
  }

  send(data) {
    window.__TAURI__.tauri.invoke({
      cmd: 'tauriSshSessionSend',
      id: this._id,
      data: btoa(data),
    });
  }

  close(code, reason) {
    window.__TAURI__.tauri.invoke({
      cmd: 'tauriSshSessionClose',
      id: this._id,
      code: code || null,
      reason: reason || null
    });
  }

  addEventListener(event, listener) {
    switch (event) {
      case 'close':
        this._onclose_listeners.push(listener);
      case 'error':
        this._onerror_listeners.push(listener);
      case 'message':
        this._onmessage_listeners.push(listener);
      case 'open':
        this._onopen_listeners.push(listener);
    }
  }
}

window.TauriSshSession = TauriSshSession;
window.tauriSshKeyGen = () => {
  return window.__TAURI__.tauri.promisified({
    cmd: 'tauriSshKeyGen'
  });
};
