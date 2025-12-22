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
        path: '/student/:id',
        component: () => import('pages/StudentDetailPage.vue'),
        name: 'student-detail',
        props: true
      }
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
