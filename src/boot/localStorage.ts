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

const appLocalStorage: LocalStorage = {
  get length() {
    return window.localStorage.length;
  },
  key(n) {
    return window.localStorage.key(n);
  },
  getItem(key) {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  setItem(key, value) {
    return window.localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    window.localStorage.removeItem(key);
  },
  clear() {
    window.localStorage.clear();
  }
};

window.appLocalStorage = appLocalStorage;
