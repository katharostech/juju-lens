import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import { JujuStateInterface, Controller, CloudCredential } from './state';
import { mutationTypes } from './mutations';
import { LocalStorage } from 'quasar';

import d from './initialData.yml';
const initialData = d as JujuStateInterface;

function randomDelay() {
  const delays = [100, 500, 1000, 1500, 2000];

  return delays[Math.floor(Math.random() * delays.length)];
}

function runWithRandomDelay<T>(f: () => T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(f()), randomDelay());
  });
}

export const actionTypes = {
  // Global
  loadAllState: 'loadAllState',
  persistState: 'persistState',
  clearAllState: 'clearAllState',
  // Controllers
  // loadControllers: 'loadControllers',
  setCurrentController: 'setCurrentController',
  addController: 'addController',
  updateController: 'updateController',
  deleteController: 'deleteController',
  // Cloud credentials
  // loadCloudCredentials: 'loadCloudCredentials',
  addCloudCredential: 'addCloudCredential',
  updateCloudCredential: 'updateCloudCredential',
  deleteCloudCredential: 'deleteCloudCredential'
  // Clouds
  // loadCloudList: 'loadCloudList'
};

const JUJU_STATE_NAME = 'jujuState';

const actions: ActionTree<JujuStateInterface, StoreInterface> = {
  //
  // Global
  //

  // Load entire state from persted store
  [actionTypes.loadAllState](ctx) {
    return runWithRandomDelay(() => {
      const localStore = LocalStorage.getItem(JUJU_STATE_NAME);

      if (localStore) {
        ctx.commit(mutationTypes.setAllState, localStore);
      } else {
        ctx.commit(mutationTypes.setAllState, initialData);
      }
    });
  },

  // Persist whole state
  [actionTypes.persistState](ctx) {
    LocalStorage.set(JUJU_STATE_NAME, ctx.state);
  },

  [actionTypes.clearAllState](ctx) {
    LocalStorage.remove(JUJU_STATE_NAME);
    ctx.commit(mutationTypes.setAllState, {});
    ctx.commit(mutationTypes.setAllState, initialData);
  },

  //
  // Controllers
  //

  /**
   * Set the current controller
   */
  async [actionTypes.setCurrentController](ctx, controller: Controller | null) {
    ctx.commit(mutationTypes.setCurrentController, controller);
    await ctx.dispatch(actionTypes.persistState);
  },

  /**
   * Load controller data
   */
  // TODO: For now we are not doing partial state loads until we hook up to the real Juju API
  // [actionTypes.loadControllers](ctx) {
  //   return runWithRandomDelay(() => {
  //     ctx.commit(mutationTypes.setControllers, initialData.controllers);
  //   });
  // },

  /**
   * Add a controller
   */
  [actionTypes.addController](ctx, controller: Controller) {
    return runWithRandomDelay(async () => {
      ctx.commit(mutationTypes.addController, controller);
      await ctx.dispatch(actionTypes.persistState);
    });
  },

  /**
   * update a controller
   */
  [actionTypes.updateController](ctx, controller: Controller) {
    return runWithRandomDelay(async () => {
      ctx.commit(mutationTypes.updateController, controller);
      await ctx.dispatch(actionTypes.persistState);
    });
  },

  /**
   * Delete a controller
   */
  [actionTypes.deleteController](ctx, controllerName: string) {
    return runWithRandomDelay(async () => {
      ctx.commit(mutationTypes.deleteController, controllerName);
      await ctx.dispatch(actionTypes.persistState);
    });
  },

  //
  // Cloud Credentials
  //

  /**
   * Load cloudCredential data
   */
  // TODO: For now we are not doing partial state loads until we hook up to the real Juju API
  // [actionTypes.loadCloudCredentials](ctx) {
  //   return runWithRandomDelay(() => {
  //     ctx.commit(
  //       mutationTypes.setCloudCredentials,
  //       initialData.cloudCredentials
  //     );
  //   });
  // },

  /**
   * Add a cloudCredential
   */
  [actionTypes.addCloudCredential](ctx, cloudCredential: CloudCredential) {
    return runWithRandomDelay(async () => {
      ctx.commit(mutationTypes.addCloudCredential, cloudCredential);
      await ctx.dispatch(actionTypes.persistState);
    });
  },

  /**
   * update a cloudCredential
   */
  [actionTypes.updateCloudCredential](ctx, cloudCredential: CloudCredential) {
    return runWithRandomDelay(async () => {
      ctx.commit(mutationTypes.updateCloudCredential, cloudCredential);
      await ctx.dispatch(actionTypes.persistState);
    });
  },

  /**
   * Delete a cloudCredential
   */
  [actionTypes.deleteCloudCredential](ctx, cloudCredentialId: string) {
    return runWithRandomDelay(async () => {
      ctx.commit(mutationTypes.deleteCloudCredential, cloudCredentialId);
      await ctx.dispatch(actionTypes.persistState);
    });
  }

  /**
   * Load cloud list
   */
  // TODO: For now we are not doing partial state loads until we hook up to the real Juju API
  // [actionTypes.loadCloudList](ctx) {
  //   return runWithRandomDelay(() => {
  //     ctx.commit(mutationTypes.setClouds, initialData.clouds);
  //   });
  // }
};

export default actions;
