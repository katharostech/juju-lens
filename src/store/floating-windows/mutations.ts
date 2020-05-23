import { MutationTree } from 'vuex';
import { WindowsStateInterface } from './state';

const mutation: MutationTree<WindowsStateInterface> = {
  toggleDebugWindow(state: WindowsStateInterface) {
    state.debugWindow.visible = !state.debugWindow.visible;
  },

  toggleDebugWindowMaximized(state: WindowsStateInterface) {
    state.debugWindow.maximized = !state.debugWindow.maximized;
  }
};

export default mutation;
