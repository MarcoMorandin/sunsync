<script setup>
import { ref, onMounted } from 'vue'
import { mdiSolarPanel } from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import { pvDataEndpoint, pvInfoEndpoint, wsDataEndpoint } from '@/endpoints'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'

const authStore = useAuthStore()

const chartData = ref([])

const fillChartData = async () => {
    let pv_infos = await axios   
        .get(import.meta.env.VITE_BASE_URL_API + pvInfoEndpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then((response) => {
            return response.data
        })
    
    for(let p in pv_infos) {
        //TODO: Add filters
        chartData.value.push({
            'name': pv_infos[p].description + ': ' + (pv_infos[p].installed_power/1000) + ' kW',
            'power': await chartConfig.chartDataArr(
                ['info', 'primary'],
                import.meta.env.VITE_BASE_URL_API + pvDataEndpoint,
                '',
                '',
                pv_infos[p]._id,
                ['power', 'predicted_power']
            ),
            'weather': await chartConfig.chartDataWsArr(
                ['warning', 'danger'],
                import.meta.env.VITE_BASE_URL_API + wsDataEndpoint,
                '',
                '',
                pv_infos[p].ws_id,
                ['temperature', 'solar_power']
            )
        })
    }
}

onMounted(async () => {
    await fillChartData()
})
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <div v-for="(p, index) in chartData">
                <SectionTitleLineWithButton
                    :icon="mdiSolarPanel"
                    :title="p.name"
                    main
                ></SectionTitleLineWithButton>
                <CardBox class="mb-6">
                    <line-chart :data="p.power" type="pv" class="h-72" />
                </CardBox>
                <CardBox class="mb-6">
                    <line-chart :data="p.weather" type="ws" class="h-72" />
                </CardBox>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>
@/stores/authStore
