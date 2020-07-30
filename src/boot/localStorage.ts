/** Raw local storage can only store strings */
interface LocalStorageRaw {
  length: number;
  key: (n: number) => string;
  getItem: (key: string) => string;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

/** Local storage that can store any JSON object */
export interface LocalStorage {
  length: number;
  key: (n: number) => any;
  getItem: (key: string) => any;
  setItem: (key: string, value: any) => void;
  removeItem: (key: string) => void;
  clear: () => void;
}

declare module 'vue/types/vue' {
  interface Vue {
    $localStorage: LocalStorage;
  }
}

const realLocalStorage: LocalStorageRaw = window.__TAURI__
  ? window.tauriLocalStorage
  : window.localStorage;

const localStorage: LocalStorage = {
  get length() {
    return realLocalStorage.length;
  },
  key(n) {
    return realLocalStorage.key(n);
  },
  getItem(key) {
    const item = realLocalStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  setItem(key, value) {
    return realLocalStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    realLocalStorage.removeItem(key);
  },
  clear() {
    realLocalStorage.clear();
  }
};

window.appLocalStorage = localStorage;
