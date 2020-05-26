import { GetterTree } from 'vuex';
import { StoreInterface } from '../index';
import { AppStateInterface } from './state';

const getters: GetterTree<AppStateInterface, StoreInterface> = {
  // someAction(/* context */) {
  //   // your code
  // }
};

export default getters;
