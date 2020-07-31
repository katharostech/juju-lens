// Local storage init script

const READYSTATE_CONNECTING = 0;
const READYSTATE_OPEN = 1;
const READYSTATE_CLOSING = 2;
const READYSTATE_CLOSED = 3;

/** Return a random ID */
function id() {
  return (Math.random() * 1e17).toString(36);
}

class TauriWebSocketBase {
  constructor(url, insecure) {
    this._url = url;
    this._id = id();
    this.onclose = null;
    this._onclose_listeners = [];
    this.onerror = null;
    this._onerror_listeners = [];
    this.onmessage = null;
    this._onmessage_listeners = [];
    this.onopen = null;
    this._onopen_listeners = [];
    this._readyState = READYSTATE_CONNECTING;

    window.__TAURI__.tauri.invoke({
      cmd: 'tauriWebsocketCreate',
      id: this._id,
      url: this._url,
      insecure,
      // Create callbacks
      error_callback: window.__TAURI__.tauri.transformCallback(x => {
        // Assume that erros mean the connection has been killed. Not the best
        // solution but should work well enough for now.
        this._readyState = READYSTATE_CLOSED;
        if (this.onerror) {
          this.onerror(x);
        }
        for (const handler in this._onerror_listeners) {
          handler(x);
        }
      }),
      open_callback: window.__TAURI__.tauri.transformCallback(x => {
        this._readyState = READYSTATE_OPEN;
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
        this._readyState = READYSTATE_CLOSED;
        if (this.onclose) {
          this.onclose(x);
        }
        for (const handler in this._onclose_listeners) {
          handler(x);
        }
      }, true /* once only callback */)
    });
  }

  get readyState() {
    return this._readyState;
  }

  get url() {
    return this._url;
  }

  send(data) {
    if (this.readyState == READYSTATE_OPEN) {
      window.__TAURI__.tauri.invoke({
        cmd: 'tauriWebsocketSend',
        id: this._id,
        data
      });
    } else if (this.readyState == READYSTATE_CONNECTING) {
      console.error('Could not send over websocket: connection not ready yet');
    } else if (
      this.readyState == READYSTATE_CLOSED ||
      this.readyState == READYSTATE_CLOSING
    ) {
      console.error(
        'Could not send over websocket: connection is closing or has been closed'
      );
    }
  }

  close(code, reason) {
    window.__TAURI__.tauri.invoke({
      cmd: 'tauriWebsocketClose',
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

class TauriWebSocketSecure extends TauriWebSocketBase {
  constructor(url) {
    super(url, false /* insecure = false */);
  }
}

class TauriWebsocketInsecure extends TauriWebSocketBase {
  constructor(url) {
    super(url, true /* insecure = true */);
  }
}

window.TauriWebSocketInsecure = TauriWebsocketInsecure;
window.TauriWebSocket = TauriWebSocketSecure;
