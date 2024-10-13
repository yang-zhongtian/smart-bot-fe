import Admin from '@/pages/admin/Admin.vue'
import LoginView from '@/pages/Login.vue'
import RegisterView from '@/pages/Register.vue'
import ShopHomeView from '@/pages/shop/Home.vue'
import User from '@/pages/User.vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: ShopHomeView,
  },
  {
    path: '/login',
    component: LoginView,
  },
  {
    path: '/register',
    component: RegisterView,
  },
  {
    path: '/user',
    component: User,
  },
  {
    path: '/admin',
    component: Admin,
    children: [
      {
        path: 'user',
        component: () => import('@/pages/admin/User.vue'),
      },
      {
        path: 'bot-list',
        component: () => import('@/pages/admin/BotList.vue'),
      },
      {
        path: 'bot-remote/:id',
        component: () => import('@/pages/admin/BotRemote.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
