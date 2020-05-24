import { ActionTree } from 'vuex';
import { StoreInterface } from '../index';
import { JujuStateInterface } from './state';

const actions: ActionTree<JujuStateInterface, StoreInterface> = {
  someAction(/* context */) {
    // your code
  }
};

export default actions;
