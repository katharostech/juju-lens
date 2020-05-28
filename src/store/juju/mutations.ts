import { MutationTree } from 'vuex';
import {
  JujuStateInterface,
  PartialJujuState,
  Controller,
  CloudCredential,
  Cloud
} from './state';

import defaultState from './state';

export const mutationTypes = {
  // Global ( maybe replace this later )
  setAllState: 'setAllState',
  clearAllState: 'clearAllState',
  // Controller
  setCurrentController: 'setCurrentController',
  setControllers: 'setControllers',
  addController: 'addController',
  updateController: 'updateController',
  deleteController: 'deleteController',
  // Cloud credentials
  setCloudCredentials: 'setCloudCredentials',
  addCloudCredential: 'addCloudCredential',
  updateCloudCredential: 'updateCloudCredential',
  deleteCloudCredential: 'deleteCloudCredential',
  // Clouds
  setClouds: 'setClouds'
};

const mutation: MutationTree<JujuStateInterface> = {
  //
  // Global
  //

  /**
   * Set the entire state, or any subset of correct. This may be kind of a stand
   * in for doing this with more targeted mutations later. Put here to shortcut
   * the effort required to implement to help release faster.
   */
  [mutationTypes.setAllState](state, newstate: PartialJujuState) {
    // Transfer any set keys from the new state to the current state
    for (const key of Object.keys(newstate)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state as any)[key] = (newstate as any)[key];
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [mutationTypes.clearAllState](state) {
    state = defaultState;
  },

  //
  // Controller
  //

  /** Set the current controller */
  [mutationTypes.setCurrentController](state, controller: Controller | null) {
    state.currentController = controller;
  },

  /** Set controllers */
  [mutationTypes.setControllers](state, controllers: Controller[]) {
    state.controllers = controllers;
  },

  /** Add controller */
  [mutationTypes.addController](state, controller: Controller) {
    state.controllers.push(controller);
  },

  /** Update controller */
  [mutationTypes.updateController](state, controller: Controller) {
    state.controllers = state.controllers.map(x =>
      x.id == controller.id ? controller : x
    );

    // Update the current controller info
    if (
      state.currentController &&
      state.currentController.id == controller.id
    ) {
      state.currentController = controller;
    }
  },

  /** Delete controller */
  [mutationTypes.deleteController](state, controllerId: string) {
    state.controllers = state.controllers.filter(x => x.id != controllerId);
    if (state.currentController && state.currentController.id == controllerId) {
      state.currentController = null;
    }
  },

  //
  // Cloud Credentials
  //

  /** Set cloud credentials */
  [mutationTypes.setCloudCredentials](
    state,
    cloudCredentials: CloudCredential[]
  ) {
    state.cloudCredentials = cloudCredentials;
  },

  /** Add cloudCredential */
  [mutationTypes.addCloudCredential](state, cloudCredential: CloudCredential) {
    state.cloudCredentials.push(cloudCredential);
  },

  /** Update cloudCredential */
  [mutationTypes.updateCloudCredential](
    state,
    cloudCredential: CloudCredential
  ) {
    state.cloudCredentials = state.cloudCredentials.map(x =>
      x.id == cloudCredential.id ? cloudCredential : x
    );
  },

  /** Delete cloudCredential */
  [mutationTypes.deleteCloudCredential](state, cloudCredentialId: string) {
    state.cloudCredentials = state.cloudCredentials.filter(
      x => x.id != cloudCredentialId
    );
  },

  /** Set clouds */
  [mutationTypes.setClouds](state, clouds: Cloud[]) {
    state.clouds = clouds;
  }
};

export default mutation;
