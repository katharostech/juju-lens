// Module declarations

// Allow importing yml files like we do through webpack
declare module '*.yml';
declare module '@canonical/jujulib*';

// TODO: Type these stronger
interface Window {
  __TAURI__: any;
  tauriLocalStorage: any;
  appLocalStorage: any;
  TauriWebSocketInsecure: any;
  TauriWebSocket: any;
  TauriSshSession: any;
  tauriLoggingSetFilter(filter: string): void;
  tauriLoggingGetLogs(): any;
  TauriLoggingSubscriber: any;
  tauriSshKeyGen: () => Promise<{
    private: string;
    public: string;
    fingerprint: string;
  }>;
}
