import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { reactiveComputed } from '@vueuse/core'

const routes = [
    {
        meta: {
            title: 'home',
            role: 2
        },
        path: '/',
        name: 'home',
        component: () => import('@/views/BaseView.vue')
    },
    {
        meta: {
            title: 'Dashboard',
            role: 1
        },
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/HomeView.vue')
    },
    {
        meta: {
            title: 'Grafici',
            role: 1
        },
        path: '/grafici',
        name: 'charts',
        component: () => import('@/views/ChartsView.vue')
    },
    {
        meta: {
            title: 'Login',
            role: 2
        },
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue')
    },
    {
        meta: {
            title: 'Profile',
            role: 1
        },
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/ProfileView.vue')
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
    if (to.meta.role < 2) {
      if (authStore.getToken.value == null || authStore.getToken.value == '') {
          return { name: 'login' }
      } else if (authStore.getExpire.value < Date.now() / 1000) {
          authStore.setToken('')
          authStore.setExpire('')
          authStore.setUserId('')

          return { name: 'login' }
      }else if(authStore.getRole.value > to.meta.role){
        return { name: 'dashboard' }
      }
    }
})

export default router
