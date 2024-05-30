<script setup>
import { ref, onMounted } from 'vue'
import { mdiHeadSnowflakeOutline } from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import LineChart from '@/components/Charts/LineChart.vue'
import { pvInfoEndpoint, pvDataEndpoint } from '@/endpoints'
import TableForecast from '@/components/TableForecast.vue'
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
            'pvInfo': pv_infos[p],
            'predicted': await chartConfig.chartData(
                'info',
                import.meta.env.VITE_BASE_URL_API + pvDataEndpoint,
                '',
                '',
                pv_infos[p]._id,
                'tomorrow_predicted_power',
                'Energy (Wh)'
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
                    :icon="mdiHeadSnowflakeOutline"
                    :title="p.name"
                    main
                    class="mt-6"
                ></SectionTitleLineWithButton>
                <CardBox class="mb-6">
                    <line-chart :data="p.power" type="pv" class="h-72" />
                </CardBox>

                <CardBox has-table>
                    <TableForecast :pvInfo="p.pvInfo" />
                </CardBox>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>
@/stores/authStore
