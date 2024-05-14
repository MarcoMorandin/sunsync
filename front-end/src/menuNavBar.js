import { mdiCogOutline, mdiLogout, mdiThemeLightDark } from '@mdi/js'

export default [
    {
        isCurrentUser: true,
        menu: [
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
