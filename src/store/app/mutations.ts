import { MutationTree } from 'vuex';
import { AppStateInterface, FloatingUnitWindow } from './state';

export const mutationTypes = {
  addFloatingUnitWindow: 'addFloatingUnitWindow',
  toggleFloatingUnitWindowMaximized: 'toggleFloatingUnitWindowMaximized',
  toggleFloatingUnitWindowVisible: 'toggleFloatingUnitWindowVisible',
  updateLensLogWindow: 'updateLensLogWindow',
  // TODO: Make all of the floating unit window functions merge into an
  // `updateFloatingUnitWindow` mutation like the `updateLensLogWindow`
  // function.
  hideFloatingWindow: 'hideFloatingWindow',
  focusFloatingUnitWindow: 'focusFloatingUnitWindow',
  removeFloatingUnitWindow: 'removeFloatingUnitWindow'
};

/**
 * Make a floating window the focused window. Extracted to a separate function
 * so that it can be used in multiple mutators.
 */
function focusFloatingUnitWindow(state: AppStateInterface, id: string): void {
  state.floatingUnitWindows.map(window => {
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
  [mutationTypes.updateLensLogWindow](
    state: AppStateInterface,
    options: { minimized?: boolean; maximized?: boolean; activated?: boolean }
  ) {
    if (options.minimized != undefined) {
      state.lensLogWindow.minimized = options.minimized;
    }
    if (options.maximized != undefined) {
      state.lensLogWindow.maximized = options.maximized;
    }
    if (options.activated != undefined) {
      state.lensLogWindow.activated = options.activated;
    }
  },

  /** Add floating window */
  [mutationTypes.addFloatingUnitWindow](state, window: FloatingUnitWindow) {
    state.floatingUnitWindows.push(window);
  },

  /** Toggle floating window maximize */
  [mutationTypes.toggleFloatingUnitWindowMaximized](state, id: string) {
    state.floatingUnitWindows.map(window => {
      if (window.id == id) {
        window.maximized = !window.maximized;
      }
    });
  },

  /** Toggle floating window visible */
  [mutationTypes.toggleFloatingUnitWindowVisible](state, id: string) {
    let newVisibleState = false;
    state.floatingUnitWindows.map(window => {
      if (window.id == id) {
        window.visible = !window.visible;
        newVisibleState = window.visible;
      }
    });

    // Focus the window if it is now visible
    if (newVisibleState) {
      focusFloatingUnitWindow(state, id);
    }
  },

  // TODO: Merge this and `toggle` into a setFloatingWindowVisible
  /** Hide floating window */
  [mutationTypes.hideFloatingWindow](state, id: string) {
    state.floatingUnitWindows.map(window => {
      if (window.id == id) {
        window.visible = false;
      }
    });
  },

  /**
   * Focus a floating window, bringing it to the front of other floating
   * windows.
   */
  [mutationTypes.focusFloatingUnitWindow](state, id: string) {
    focusFloatingUnitWindow(state, id);
  },

  /** Remove log window */
  [mutationTypes.removeFloatingUnitWindow](state, id: string) {
    state.floatingUnitWindows = state.floatingUnitWindows.filter(
      window => window.id != id
    );
  }
};

export default mutation;
