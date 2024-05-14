import {
    mdiCogOutline,
    mdiLogout,
    mdiThemeLightDark,
    mdiMonitor,
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
        ]
    },
    {
        icon: mdiThemeLightDark,
        label: 'Light/Dark',
        isDesktopNoLabel: true,
        isToggleLightDark: true
    },
    {
        icon: mdiLogout,
        label: 'Log out',
        isDesktopNoLabel: true,
        isLogout: true
    }
]
