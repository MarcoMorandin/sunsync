<script setup>
import { ref, onMounted } from 'vue'
import { mdiSolarPowerVariantOutline, mdiCashMultiple, mdiChartTimelineVariant, mdiLightningBoltOutline, mdiSolarPanel, mdiWeatherPartlyCloudy } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import TablePv from '@/components/TablePv.vue'
import TableWs from '@/components/TableWs.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import NotificationBar from '@/components/NotificationBar.vue'
import { pvnumberReportsEndpoint, moneyReportsEndpoint, productionReportsEndpoint } from '@/endpoints'

const showErrorNotification = ref(false)
const error = ref('')
const authStore = useAuthStore()

const tile = ref({
    pvNumber: 0,
    money: 0.0
})

const fillTileNumber = () => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + pvnumberReportsEndpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then((response) => {
            tile.value.pvNumber = response.data.number_of_pv_systems
        })
        .catch(() => {
            showErrorNotification.value = true
            error.value = 'Errore nel caricamento del numero di impianti registrati'
        })
}

const fillTileMoney = () => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + moneyReportsEndpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` },
            params: { aggregation: 'all' }
        })
        .then((response) => {
            tile.value.money = Math.floor(response.data[0].total)
        })
        .catch(() => {
            showErrorNotification.value = true
            error.value = 'Errore nel caricamento del valore dei soldi risparmiati'
        })
}

const fillTileProduction = () => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + productionReportsEndpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` },
            params: { aggregation: 'all' }
        })
        .then((response) => {
            tile.value.production = Math.floor(response.data[0].total / 1000)
        })
        .catch(() => {
            showErrorNotification.value = true
            error.value = 'Errore nel caricamento del valore della quantità di energia prodotta'
        })
}

onMounted(() => {
    fillTileNumber()
    fillTileMoney()
    fillTileProduction()
})
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <NotificationBar v-if="showErrorNotification" color="danger" :icon="mdiMonitorCellphone"> <b>ERRORE: </b> {{ error }} </NotificationBar>
            <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main></SectionTitleLineWithButton>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
                <CardBoxWidget trend="" trend-type="up" color="text-blue-500" :icon="mdiSolarPowerVariantOutline" :number="tile.pvNumber" label="Impianti Fotovoltaici" />
                <CardBoxWidget trend="" trend-type="up" color="text-emerald-500" :icon="mdiCashMultiple" :number="tile.money" prefix="€ " label="Soldi Risparmiati" />
                <CardBoxWidget trend="" trend-type="up" color="text-orange-300" :icon="mdiLightningBoltOutline" :number="tile.production" suffix=" KW/h" label="Energia Prodotta" />
            </div>

            <SectionTitleLineWithButton :icon="mdiSolarPanel" title="Impianti Fotovoltaici" main></SectionTitleLineWithButton>
            <CardBox has-table>
                <TablePv />
            </CardBox>
            <SectionTitleLineWithButton />

            <SectionTitleLineWithButton :icon="mdiWeatherPartlyCloudy" title="Stazioni Metereologiche" main></SectionTitleLineWithButton>
            <CardBox has-table>
                <TableWs />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
