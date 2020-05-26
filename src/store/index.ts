import { store } from 'quasar/wrappers';
import Vuex from 'vuex';

import app from './app';
import { AppStateInterface } from './app/state';
import juju from './juju'
import { JujuStateInterface } from './juju/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StoreInterface {
  // Define your own store structure, using submodules if needed
  app: AppStateInterface;
  juju: JujuStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  // example: unknown;
}

export default store(function({ Vue }) {
  Vue.use(Vuex);

  const Store = new Vuex.Store<StoreInterface>({
    modules: {
      app,
      juju
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  });

  return Store;
});
