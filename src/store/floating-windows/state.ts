export interface WindowsStateInterface {
  debugWindow: DebugWindowState;
}

export interface DebugWindowState {
  visible: boolean;
  maximized: boolean;
}

const state: WindowsStateInterface = {
  debugWindow: {
    visible: false,
    maximized: false
  }
};

export default state;
