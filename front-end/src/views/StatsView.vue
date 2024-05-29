<script setup>
import { ref, onMounted } from 'vue'
import { mdiSolarPanel } from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import { productionReportsEndpoint, moneyReportsEndpoint } from '@/endpoints'

const chartData = ref({})

const fillChartData = async () => {
    //TODO: Add filters
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
    await fillChartData()
})
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiSolarPanel"
                title="Produzione Energetica"
                main
            ></SectionTitleLineWithButton>
            <CardBox class="mb-6">
                <line-chart :data="chartData.production" type="pv" class="h-72" />
            </CardBox>

            <SectionTitleLineWithButton
                :icon="mdiSolarPanel"
                title="Soldi Risparmiati"
                main
            ></SectionTitleLineWithButton>

            <CardBox class="mb-6">
                <line-chart :data="chartData.money" class="h-72" />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
@/stores/authStore
