import { MutationTree } from 'vuex';
import { AppStateInterface } from './state';

const mutation: MutationTree<AppStateInterface> = {
  toggleDebugWindow(state: AppStateInterface) {
    state.debugWindow.visible = !state.debugWindow.visible;
  },

  toggleDebugWindowMaximized(state: AppStateInterface) {
    state.debugWindow.maximized = !state.debugWindow.maximized;
  }
};

export default mutation;
