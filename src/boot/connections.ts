import { boot } from 'quasar/wrappers';
import { uid } from 'quasar';

interface GlobalConnections {
  list: { [key: string]: any };
  newId: typeof uid;
}

declare module 'vue/types/vue' {
  interface Vue {
    $connections: GlobalConnections;
  }
}

export default boot(({ Vue }) => {
  Vue.prototype.$connections = {
    list: {},
    newId: uid
  };
});
