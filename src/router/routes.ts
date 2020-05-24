import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        redirect: '/controllers'
      },
      {
        path: '/controllers',
        name: 'controllers',
        component: () => import('pages/Controllers.vue')
      },
      {
        path: '/models',
        name: 'models',
        component: () => import('pages/Models.vue')
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import('pages/Admin.vue')
      },
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('pages/Welcome.vue')
      }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  });
}

export default routes;
