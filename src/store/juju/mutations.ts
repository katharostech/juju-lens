import { MutationTree } from 'vuex';
import {
  JujuStateInterface,
  Controller,
  CloudCredential,
  Cloud
} from './state';

export const mutationTypes = {
  setControllers: 'setControllers',
  setClouds: 'setClouds',
  setCloudCredentials: 'setCloudCredentials'
};

const mutation: MutationTree<JujuStateInterface> = {
  [mutationTypes.setControllers](state, controllers: Controller[]) {
    state.controllers = controllers;
  },

  [mutationTypes.setClouds](state, clouds: { [key: string]: Cloud }) {
    state.clouds = clouds;
  },

  [mutationTypes.setCloudCredentials](state, credentials: CloudCredential[]) {
    state.cloudCredentials = credentials;
  }
};

export default mutation;
