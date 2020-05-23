export interface WindowsStateInterface {
  debugWindow: {
    visible: boolean;
    maximized: boolean;
  };
}

const state: WindowsStateInterface = {
  debugWindow: {
    visible: false,
    maximized: false
  }
};

export default state;
