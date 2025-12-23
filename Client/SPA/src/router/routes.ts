import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/Login.vue')
      },
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        name: 'home'
      },
      {
        path: '/database-error',
        name: 'DatabaseError',
        component: () => import('pages/DatabaseErrorPage.vue'),
        meta: {
          title: 'Ошибка соединения с БД'
        }
      },
      {
        path: '/edit-error',
        name: 'EditError',
        component: () => import('pages/EditError.vue'),
      },
      {
        path: '/data-error',
        name: 'DataError',
        component: () => import('pages/DataError.vue'),
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
