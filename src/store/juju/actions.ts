import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import { JujuStateInterface } from './state';
import { mutationTypes } from './mutations';

import d from './initialData.yml';
const initialData = d as JujuStateInterface;

export const actionTypes = {
  loadControllers: 'loadControllers'
};

function randomDelay() {
  const delays = [100, 200, 500, 1000, 1500, 2000];

  return delays[Math.floor(Math.random() * delays.length)];
}

function runWithRandomDelay<T>(f: () => T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => resolve(f()), randomDelay());
  });
}

const actions: ActionTree<JujuStateInterface, StoreInterface> = {
  /**
   * Load controller data
   */
  [actionTypes.loadControllers](ctx) {
    return runWithRandomDelay(() => {
      ctx.commit(mutationTypes.setControllers, initialData.controllers);
    });
  }
};

export default actions;
