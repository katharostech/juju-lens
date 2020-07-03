import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    name: 'clear-data',
    path: '/clear-data',
    component: () => import('pages/ClearData.vue')
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        redirect: '/models'
      },
      {
        path: '/controllers',
        component: () => import('pages/Controllers.vue'),
        children: [
          {
            path: '',
            name: 'controllers'
          },
          {
            path: 'cloud-credentials',
            name: 'cloud-credentials'
          }
        ]
      },
      {
        path: '/models',
        component: () => import('pages/Models.vue'),
        children: [
          {
            path: '',
            name: 'models'
          },
          {
            path: 'machines',
            name: 'machines'
          }
        ]
      },
      {
        path: '/my-account',
        name: 'my-account',
        component: () => import('pages/Account.vue')
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
