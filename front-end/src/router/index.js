import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { meEndpoint, refreshEndpoint } from '@/endpoints.js'
import VueJwtDecode from 'vue-jwt-decode'

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
            title: 'Statistiche',
            role: 1
        },
        path: '/statistiche',
        name: 'statistiches',
        component: () => import('@/views/StatsView.vue')
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
            title: 'Previsioni',
            role: 1
        },
        path: '/previsioni',
        name: 'previsioni',
        component: () => import('@/views/ForecastView.vue')
    },
    {
        meta: {
            title: 'Eventi',
            role: 1
        },
        path: '/eventi',
        name: 'eventi',
        component: () => import('@/views/EventsView.vue')
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
            title: 'Utenti',
            role: 0
        },
        path: '/users',
        name: 'users',
        component: () => import('@/views/UsersView.vue')
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
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 }
    }
})

router.beforeEach(async (to) => {
    const authStore = useAuthStore()

    if (to.meta.role < 2) {
        if (authStore.getToken.value == null || authStore.getToken.value == '') {
            return { name: 'login' }
        } else if (authStore.getExpire.value < Date.now() / 1000) {
            let resp = await axios
                .post(import.meta.env.VITE_BASE_URL_API + refreshEndpoint, {}, { withCredentials: true })
                .then(async (response) => {
                    authStore.setToken(response.data.token)
                    let decoded_token = VueJwtDecode.decode(response.data.token)
                    authStore.setUserId(decoded_token.user_id)
                    authStore.setExpire(decoded_token.exp)
                    authStore.setRole(decoded_token.role)

                    let disabled = await axios
                        .get(import.meta.env.VITE_BASE_URL_API + meEndpoint, {
                            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
                        })
                        .then((response) => {
                            return response.data.disabled
                        })
                    if (disabled) setTimeout(() => router.push('/changepassword'), 500)
                    return { refresh: 'ok' }
                })
                .catch(() => {
                    authStore.setToken('')
                    authStore.setExpire('')
                    authStore.setUserId('')
                    authStore.setRole('')
                    return { name: 'login' }
                })
            if (resp.hasOwnProperty('name')) {
                return resp
            }
        } else {
            let disabled = await axios
                .get(import.meta.env.VITE_BASE_URL_API + meEndpoint, {
                    headers: { Authorization: `Bearer ${authStore.getToken.value}` }
                })
                .then((response) => {
                    return response.data.disabled
                })

            if (disabled == true && to.name != 'changepassword') {
                return { name: 'changepassword' }
            } else if (authStore.getRole.value > to.meta.role) {
                return { name: 'dashboard' }
            }
        }
    } else if (to.name == 'login' && authStore.getToken.value != null && authStore.getToken.value != '' && authStore.getExpire.value >= Date.now() / 1000) {
        return { name: 'dashboard' }
    }
})

export default router
