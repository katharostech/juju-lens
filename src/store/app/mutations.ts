import { MutationTree } from 'vuex';
import { AppStateInterface, FloatingWindow } from './state';

export const mutationTypes = {
  addFloatingWindow: 'addFloatingWindow',
  toggleFloatingWindowMaximized: 'toggleFloatingWindowMaximized',
  toggleFloatingWindowVisible: 'toggleFloatingWindowVisible',
  // TODO: Merge this and `toggle` into a setFloatingWindowVisible
  hideFloatingWindow: 'hideFloatingWindow',
  focusFloatingWindow: 'focusFloatingWindow',
  removeFloatingWindow: 'removeFloatingWindow'
};

/**
 * Make a floating window the focused window. Extracted to a separate function
 * so that it can be used in multiple mutators.
 */
function focusFloatingWindow(state: AppStateInterface, id: string): void {
  state.floatingWindows.map(window => {
    if (window.id == id) {
      window.zIndex = 1;
    } else {
      window.zIndex = 0;
    }
  });
}

const mutation: MutationTree<AppStateInterface> = {
  // The debug window is not something we are planning on using anymore.
  // Leaving this around just in case.
  toggleDebugWindow(state: AppStateInterface) {
    state.debugWindow.visible = !state.debugWindow.visible;
  },

  toggleDebugWindowMaximized(state: AppStateInterface) {
    state.debugWindow.maximized = !state.debugWindow.maximized;
  },

  /** Add floating window */
  [mutationTypes.addFloatingWindow](state, window: FloatingWindow) {
    state.floatingWindows.push(window);
  },

  /** Toggle floating window maximize */
  [mutationTypes.toggleFloatingWindowMaximized](state, id: string) {
    state.floatingWindows.map(window => {
      if (window.id == id) {
        window.maximized = !window.maximized;
      }
    });
  },

  /** Toggle floating window visible */
  [mutationTypes.toggleFloatingWindowVisible](state, id: string) {
    let newVisibleState = false;
    state.floatingWindows.map(window => {
      if (window.id == id) {
        window.visible = !window.visible;
        newVisibleState = window.visible;
      }
    });

    // Focus the window if it is now visible
    if (newVisibleState) {
      focusFloatingWindow(state, id);
    }
  },

  // TODO: Merge this and `toggle` into a setFloatingWindowVisible
  /** Hide floating window */
  [mutationTypes.hideFloatingWindow](state, id: string) {
    state.floatingWindows.map(window => {
      if (window.id == id) {
        window.visible = false;
      }
    });
  },

  /**
   * Focus a floating window, bringing it to the front of other floating
   * windows.
   */
  [mutationTypes.focusFloatingWindow](state, id: string) {
    focusFloatingWindow(state, id);
  },

  /** Remove log window */
  [mutationTypes.removeFloatingWindow](state, id: string) {
    state.floatingWindows = state.floatingWindows.filter(
      window => window.id != id
    );
  }
};

export default mutation;
