import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    meta: {
      title: 'home',
      authRequired: false,
    },
    path: '/',
    name: 'home',
    component: () => import('@/views/BaseView.vue')
  },
  {
    meta: {
      title: 'Dashboard',
      authRequired: true,
    },
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/HomeView.vue')
  },
  {
    meta: {
      title: 'Grafici',
      authRequired: true,
    },
    path: '/grafici',
    name: 'charts',
    component: () => import('@/views/ChartsView.vue')
  },
  {
    meta: {
      title: 'Login',
      authRequired: false,
    },
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  if(to.meta.authRequired){
    if(authStore.getToken.value == null || authStore.getToken.value == ''){
      return {name: 'login'}
    }else if(authStore.getExpire.value < Date.now()/1000){
      authStore.setToken('')
      authStore.setExpire('')
      authStore.setUserId('')

      return {name: 'login'}
    }
  }
})

export default router
