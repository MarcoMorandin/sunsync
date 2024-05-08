<script setup>
import { ref, onMounted } from 'vue'
import {
  mdiSolarPowerVariantOutline,
  mdiCashMultiple,
  mdiChartTimelineVariant,
  mdiLightningBoltOutline,
  mdiSolarPanel
} from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import TablePv from '@/components/TablePv.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const tile = ref({
  pvNumber: 0,
  money: 0.0
})

const fillTileNumber = () => {
  axios.get('http://localhost:3000/api/v1/reports/pvnumber', { headers: {"Authorization" : `Bearer ${authStore.getToken.value}`}})
    .then((response) => {
      tile.value.pvNumber = response.data.number_of_pv_systems
    })
}

const fillTileMoney = () => {
  axios.get('http://localhost:3000/api/v1/reports/money', {
    headers: {"Authorization" : `Bearer ${authStore.getToken.value}`},
    params: {"aggregation": "all"}
  })
    .then((response) => {
      tile.value.money = Math.floor(response.data[0].total_money)
    })
}

const fillTileProduction = () => {
  axios.get('http://localhost:3000/api/v1/reports/production', { 
    headers: {"Authorization" : `Bearer ${authStore.getToken.value}`},
    params: {"aggregation": "all"}
  })
    .then((response) => {
      tile.value.production = Math.floor(response.data[0].total_power/1000)
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
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Overview" main></SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <CardBoxWidget
          trend=""
          trend-type="up"
          color="text-emerald-500"
          :icon="mdiSolarPowerVariantOutline"
          :number=tile.pvNumber
          label="Impianti Fotovoltaici"
        />
        <CardBoxWidget
          trend=""
          trend-type="up"
          color="text-blue-500"
          :icon="mdiCashMultiple"
          :number=tile.money
          prefix="€ "
          label="Soldi Risparmiati"
        />
        <CardBoxWidget
          trend=""
          trend-type="up"
          color="text-red-500"
          :icon="mdiLightningBoltOutline"
          :number=tile.production
          suffix=" KW/h"
          label="Energia Prodotta"
        />
      </div>
      
      <SectionTitleLineWithButton :icon="mdiSolarPanel" title="Solar panel system" main></SectionTitleLineWithButton>

      <CardBox has-table>
        <TablePv />
      </CardBox>

    </SectionMain>
  </LayoutAuthenticated>
</template>
