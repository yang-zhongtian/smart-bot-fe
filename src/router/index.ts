import LoginView from '@/pages/Login.vue'

import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/test', component: () => import('@/components/BotUnityScene.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
