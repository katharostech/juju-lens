import { boot } from 'quasar/wrappers';
import VueLazyLoad from 'vue-lazyload';

export default boot(({ Vue }) => {
  Vue.use(VueLazyLoad);
});
