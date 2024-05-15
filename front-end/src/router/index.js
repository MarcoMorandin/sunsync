import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const routes = [
    {
        meta: {
            title: 'home',
            role: 2
        },
        path: '/',
        name: 'home',
        component: () => import('@/views/LandingView.vue')
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
        name: 'grafici',
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
            title: 'Change Password',
            role: 1
        },
        path: '/changepassword',
        name: 'changepassword',
        component: () => import('@/views/ChangeTempPassword.vue')
    },
    {
        meta: {
            title: 'Profile',
            role: 1
        },
        path: '/profile',
        name: 'profile',
        component: () => import('@/views/ProfileView.vue')
    },
    {
        meta: {
            title: 'Nuovo Utente',
            role: 0
        },
        path: '/newuser',
        name: 'newuser',
        component: () => import('@/views/NewUserView.vue')
    },
    {
        meta: {
            title: 'Nuovo impianto',
            role: 0
        },
        path: '/newpv',
        name: 'newpv',
        component: () => import('@/views/NewPvView.vue')
    },
    {
        meta: {
            title: 'Nuova Stazione',
            role: 0
        },
        path: '/newws',
        name: 'newws',
        component: () => import('@/views/NewWsView.vue')
    },
    {
        meta: {
            title: 'Errore',
            role: 2
        },
        path: '/:pathMatch(.*)*',
        name: 'error',
        component: () => import('@/views/ErrorView.vue')
    },

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
        } else if (authStore.getRole.value > to.meta.role) {
            return { name: 'dashboard' }
        }
    }
})

export default router
