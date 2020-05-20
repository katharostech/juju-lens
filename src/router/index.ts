import { route } from 'quasar/wrappers';
import VueRouter from 'vue-router';
import { StoreInterface } from '../store';
import routes from './routes';
import { Cookies } from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default route<StoreInterface>(function({ Vue }) {
  Vue.use(VueRouter);

  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, _from, next) => {
    const seenJujuGui = 'seen-juju-lens-before';

    // If this is the first time the user has visited the site
    if (!Cookies.get(seenJujuGui) && to.name != 'welcome') {
      // Go to the welcome page
      next({ name: 'welcome' });

      // Set the cookie indicating that they have been here before
      Cookies.set(seenJujuGui, 'true');
      
    // If the user has been here before
    } else {
      // Send them along
      next();
    }
  });

  return Router;
});
