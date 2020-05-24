import { GetterTree } from 'vuex';
import { StoreInterface } from '../index';
import { JujuStateInterface } from './state';

const getters: GetterTree<JujuStateInterface, StoreInterface> = {
  someAction(/* context */) {
    // your code
  }
};

export default getters;
