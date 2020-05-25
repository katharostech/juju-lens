import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import { JujuStateInterface, Controller, CloudCredential } from './state';
import { mutationTypes } from './mutations';

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
  // Controllers
  loadControllers: 'loadControllers',
  addController: 'addController',
  updateController: 'updateController',
  deleteController: 'deleteController',
  // Cloud credentials
  loadCloudCredentials: 'loadCloudCredentials',
  addCloudCredential: 'addCloudCredential',
  updateCloudCredential: 'updateCloudCredential',
  deleteCloudCredential: 'deleteCloudCredential'
};

const actions: ActionTree<JujuStateInterface, StoreInterface> = {
  //
  // Controllers
  //

  /**
   * Load controller data
   */
  [actionTypes.loadControllers](ctx) {
    return runWithRandomDelay(() => {
      ctx.commit(mutationTypes.setControllers, initialData.controllers);
    });
  },

  /**
   * Add a controller
   */
  [actionTypes.addController](ctx, controller: Controller) {
    return runWithRandomDelay(() => {
      ctx.commit(mutationTypes.addController, controller);
    });
  },

  /**
   * update a controller
   */
  [actionTypes.updateController](ctx, controller: Controller) {
    return runWithRandomDelay(() => {
      ctx.commit(mutationTypes.updateController, controller);
    });
  },

  /**
   * Delete a controller
   */
  [actionTypes.deleteController](ctx, controllerName: string) {
    return runWithRandomDelay(() => {
      ctx.commit(mutationTypes.deleteController, controllerName);
    });
  },

  //
  // Cloud Credentials
  //

  /**
   * Load cloudCredential data
   */
  [actionTypes.loadCloudCredentials](ctx) {
    return runWithRandomDelay(() => {
      ctx.commit(
        mutationTypes.setCloudCredentials,
        initialData.cloudCredentials
      );
    });
  },

  /**
   * Add a cloudCredential
   */
  [actionTypes.addCloudCredential](ctx, cloudCredential: CloudCredential) {
    return runWithRandomDelay(() => {
      ctx.commit(mutationTypes.addCloudCredential, cloudCredential);
    });
  },

  /**
   * update a cloudCredential
   */
  [actionTypes.updateCloudCredential](ctx, cloudCredential: CloudCredential) {
    return runWithRandomDelay(() => {
      ctx.commit(mutationTypes.updateCloudCredential, cloudCredential);
    });
  },

  /**
   * Delete a cloudCredential
   */
  [actionTypes.deleteCloudCredential](ctx, cloudCredentialId: string) {
    return runWithRandomDelay(() => {
      ctx.commit(mutationTypes.deleteCloudCredential, cloudCredentialId);
    });
  }
};

export default actions;
