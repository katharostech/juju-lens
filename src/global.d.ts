// Module declarations

// Allow importing yml files like we do through webpack
declare module '*.yml';
declare module '@canonical/jujulib*';

interface Window {
  __TAURI__: any;
  tauriLocalStorage: any;
  appLocalStorage: any;
  TauriWebSocketInsecure: any;
  TauriWebSocket: any;
  TauriSshSession: any;
  tauriSshKeyGen: () => Promise<{ private: string; public: string }>;
}
