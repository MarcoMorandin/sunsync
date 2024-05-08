<script setup>
import { ref, onMounted } from 'vue'
import {
  mdiSolarPanel
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import LineChart from '@/components/Charts/LineChart.vue'

const chartData = ref({})


const fillChartData = async () => {
  chartData.value = await chartConfig.chartData('http://localhost:3000/api/v1/pvdata', '2012-10-23', '2013-11-24', 'ok')
}

onMounted(async () => {
  await fillChartData()
})

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>      
      <SectionTitleLineWithButton :icon="mdiSolarPanel" title="Produzione Energetica" main></SectionTitleLineWithButton>
      <CardBox class="mb-6">
          <line-chart :data="chartData" class="h-96" />
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiSolarPanel" title="Soldi Risparmiati" main></SectionTitleLineWithButton>

      <CardBox class="mb-6">
          <!-- <line-chart :data="chartData" class="h-80" /> -->
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>
@/stores/authStore