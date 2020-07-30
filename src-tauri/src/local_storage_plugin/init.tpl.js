// Local storage init script

const tauriLocalStorageInit = () => {
  /**
   * Create the fake local storage object. This is designed to act essentially
   * the same as the browsers localStorage object, but it's not perfect, just
   * good enough.
   */
  window.tauriLocalStorage = {
    get length() {
      return Object.keys(this._data).length;
    },
    key(n) {
      return Object.keys(this._data)[n];
    },
    getItem(key) {
      return this._data[key];
    },
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
    // Get the data ( substituted from Rust )
    _data: '{{data}}'
  };
};

tauriLocalStorageInit();
delete tauriLocalStorageInit;
