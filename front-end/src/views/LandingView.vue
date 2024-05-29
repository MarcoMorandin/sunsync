<script setup>
import { ref, onMounted } from 'vue'
import {
    mdiSolarPowerVariantOutline,
    mdiCashMultiple,
    mdiLightningBoltOutline,
    mdiChartTimelineVariant,
    mdiSolarPanel,
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import LayoutHome from '@/layouts/LayoutHome.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import LineChart from '@/components/Charts/LineChart.vue'
import CardBox from '@/components/CardBox.vue'
import * as chartConfig from '@/components/Charts/chart.config.js'
import { productionReportsEndpoint, moneyReportsEndpoint } from '@/endpoints'

const error = ref('')

const tile = ref({
    pvNumber: 0,
    money: 0.0
})

const fillTileNumber = () => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + '/api/v1/reports/pvnumber', {})
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
        .get(import.meta.env.VITE_BASE_URL_API + '/api/v1/reports/money', {
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
        .get(import.meta.env.VITE_BASE_URL_API + '/api/v1/reports/production', {
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

const chartData = ref({})

const fillChartData = async () => {
    chartData.value.production = await chartConfig.chartData(
        'info',
        import.meta.env.VITE_BASE_URL_API + productionReportsEndpoint,
        '',
        '',
        '',
        'total',
        'Energy (Wh)'
    )
    chartData.value.money = await chartConfig.chartData(
        'primary',
        import.meta.env.VITE_BASE_URL_API + moneyReportsEndpoint,
        '',
        '',
        '',
        'total',
        'Money (€)'
    )
}

onMounted(async () => {
    fillTileNumber()
    fillTileMoney()
    fillTileProduction()
    await fillChartData()
})

</script>

<template>
    <LayoutHome>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiChartTimelineVariant"
                title="Overview"
                main
                class="mt-6"
            ></SectionTitleLineWithButton>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
                <CardBoxWidget
                    trend=""
                    trend-type="up"
                    color="text-blue-500"
                    :icon="mdiSolarPowerVariantOutline"
                    :number="tile.pvNumber"
                    label="Impianti Fotovoltaici"
                />
                <CardBoxWidget
                    trend=""
                    trend-type="up"
                    color="text-emerald-500"
                    :icon="mdiCashMultiple"
                    :number="tile.money"
                    prefix="€ "
                    label="Soldi Risparmiati"
                />
                <CardBoxWidget
                    trend=""
                    trend-type="up"
                    color="text-orange-300"
                    :icon="mdiLightningBoltOutline"
                    :number="tile.production"
                    suffix=" KW/h"
                    label="Energia Prodotta"
                />
            </div>

            <SectionTitleLineWithButton
                :icon="mdiSolarPanel"
                title="Produzione Energetica"
                main
                class="mt-4"
            ></SectionTitleLineWithButton>
            <CardBox class="mb-6">
                <line-chart :data="chartData.production" class="h-72" />
            </CardBox>

            <SectionTitleLineWithButton
                :icon="mdiCashMultiple"
                title="Soldi Risparmiati"
                main
                class="mt-4"
            ></SectionTitleLineWithButton>

            <CardBox class="mb-6">
                <line-chart :data="chartData.money" class="h-72" />
            </CardBox>
        </SectionMain>
    </LayoutHome>
</template>