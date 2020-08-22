/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
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
        path: '/welcome',
        name: 'welcome',
        component: () => import('pages/Welcome.vue')
      }
    ]
  }
];

// Always leave this as last one
routes.push({
  path: '*',
  component: () => import('pages/Error404.vue')
});

export default routes;
