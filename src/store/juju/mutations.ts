import { MutationTree } from 'vuex';
import {
  JujuStateInterface,
  Controller,
  CloudCredential,
  Cloud
} from './state';

export const mutationTypes = {
  setControllers: 'setControllers',
  addController: 'addController',
  updateController: 'updateController',
  deleteController: 'deleteController',
  setClouds: 'setClouds',
  setCloudCredentials: 'setCloudCredentials'
};

const mutation: MutationTree<JujuStateInterface> = {
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
      x.name == controller.name ? controller : x
    );
  },

  /** Delete controller */
  [mutationTypes.deleteController](state, controllerName: string) {
    state.controllers = state.controllers.filter(x => x.name != controllerName);
  },

  /** Set clouds */
  [mutationTypes.setClouds](state, clouds: Cloud[]) {
    state.clouds = clouds;
  },

  /** Set cloud credentials */
  [mutationTypes.setCloudCredentials](state, credentials: CloudCredential[]) {
    state.cloudCredentials = credentials;
  }
};

export default mutation;
