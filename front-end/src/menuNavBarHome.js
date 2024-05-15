import {
    mdiCogOutline,
    mdiLogout,
    mdiThemeLightDark,
    mdiMonitor,
    mdiLogin,
} from '@mdi/js'

export default [
    {
        isCurrentUser: true,
        menu: [
            {
                icon: mdiMonitor,
                label: 'Dashboard',
                to: '/dashboard'
            },
            {
                icon: mdiCogOutline,
                label: 'Impostazioni',
                to: '/profile'
            }
        ],
        isAuth: true,
        bgColor: "dark:bg-slate-800 bg-slate-900"
    },
    {
        icon: mdiThemeLightDark,
        label: 'Light/Dark',
        isDesktopNoLabel: true,
        isToggleLightDark: true,
        bgColor: "dark:bg-slate-800 bg-slate-900"
    },
    {
        icon: mdiLogout,
        label: 'Logout',
        to: '/logout',
        isDesktopNoLabel: true,
        isLogout: true,
        isAuth: true,
        bgColor: "dark:bg-slate-800 bg-slate-900"
    },
    {
        icon: mdiLogin,
        label: 'Login',
        to: '/login',
        isDesktopNoLabel: true,
        isAuth: false,
        bgColor: "dark:bg-slate-800 bg-slate-900"
    }
]
