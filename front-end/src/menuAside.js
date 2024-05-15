import {
    mdiMonitor,
    mdiChartTimelineVariant,
    mdiAccountPlusOutline,
    mdiSolarPanelLarge,
    mdiWeatherPartlyCloudy,
    mdiHomeOutline
} from '@mdi/js'

export default [
    {
        to: '/',
        label: 'Home Page',
        icon: mdiHomeOutline,
        role: 0
    },
    {
        to: '/dashboard',
        icon: mdiMonitor,
        label: 'Dashboard',
        role: 1
    },
    {
        to: '/grafici',
        label: 'Grafici',
        icon: mdiChartTimelineVariant,
        role: 1
    },
    {
        to: '/newuser',
        label: 'Nuovo Utente',
        icon: mdiAccountPlusOutline,
        role: 0
    },
    {
        to: '/newpv',
        label: 'Nuovo Impianto',
        icon: mdiSolarPanelLarge,
        role: 0
    },
    {
        to: '/newws',
        label: 'Nuova Stazione',
        icon: mdiWeatherPartlyCloudy,
        role: 0
    }
]
