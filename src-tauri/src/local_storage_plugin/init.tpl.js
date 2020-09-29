// Local storage init script

// Override the built-in browser local storage object
Object.defineProperty(window, 'localStorage', {
  value: {
    // All of the storage read operations just read from the local _data field
    get length() {
      return Object.keys(this._data).length;
    },
    key(n) {
      return Object.keys(this._data)[n];
    },
    getItem(key) {
      return this._data[key];
    },
    // All of the writes to the storage update the local _data field and then
    // submit a command to Tarui to persist the changes assuming that everything
    // will go fine.
    setItem(key, value) {
      __TAURI__.tauri.invoke({
        cmd: 'tauriLocalStorageSetItem',
        key,
        value: value.toString()
      });
      this._data[key] = value.toString();
    },
    removeItem(key) {
      delete this._data[key];
      __TAURI__.tauri.invoke({
        cmd: 'tauriLocalStorageRemove',
        key
      });
    },
    clear() {
      this._data = {};
      __TAURI__.tauri.invoke({
        cmd: 'tauriLocalStorageClear'
      });
    },
    // Get the initial data ( substituted from Rust )
    _data: '{{data}}'
  }
});
