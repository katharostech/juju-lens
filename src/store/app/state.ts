export interface AppStateInterface {
  debugWindow: DebugWindowState;
}

export interface DebugWindowState {
  visible: boolean;
  maximized: boolean;
}

const state: AppStateInterface = {
  debugWindow: {
    visible: false,
    maximized: false
  }
};

export default state;
