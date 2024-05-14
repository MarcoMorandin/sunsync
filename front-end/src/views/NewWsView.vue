<script setup>
import { reactive, ref } from 'vue'
import { mdiLightningBolt, mdiDatabaseArrowLeftOutline, mdiSolarPanelLarge, mdiLatitude, mdiLongitude, mdiImageFilterHdrOutline } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import NotificationBar from '@/components/NotificationBarInCard.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()

const router = useRouter()

const form = reactive({
  wsLat: '',
  wsLong: '',
  wsHeight: '',
  wsDescription: '',
  wsUrl: ''
})

const submit = async () => {
    await axios.post('http://localhost:3000/api/v1/wsinfo', {
            location: {
        lat: form.wsLat,
        long: form.wsLong,
        alt: form.wsHeight
        },
        description: form.wsDescription,
        url: form.wsUrl
        }, {
        headers: {
        "Authorization" : `Bearer ${authStore.getToken.value}`
        }
    }).then(async () => {
        formStatusCurrent.value = formStatusOptions[1]
        isVisible.value = false
        setTimeout(() => router.push('/dashboard'), 500)
	}).catch(() => {
        formStatusCurrent.value = formStatusOptions[2]
	});
}


const formStatusCurrent = ref(0)

const formStatusOptions = ['none', 'success', 'danger']
const isVisible = ref(true)

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain >
      <SectionTitleLineWithButton :icon="mdiSolarPanelLarge" title="Nuova Stazione Meteo" main></SectionTitleLineWithButton>
      <NotificationBar
          :color="formStatusCurrent"
        >
        <span v-if="formStatusCurrent == 'danger'"><b class="capitalize">ERRORE: </b> L'inserimento non è andato a buon fine!</span>
        <span v-if="formStatusCurrent == 'success'">Inserimento avvenuto con successo!</span>
      </NotificationBar>
      <CardBox v-if="isVisible" is-form @submit.prevent="submit">
        <FormField label="Posizione Stazione Meteo">
          <FormControl v-model="form.wsLat" type="number" :icon="mdiLatitude" placeholder="Latitudine"/>
          <FormControl v-model="form.wsLong" type="number" :icon="mdiLongitude" placeholder="Longintudine"/>
        </FormField>
        <FormField>
          <FormControl v-model="form.wsHeight" type="number" :icon="mdiImageFilterHdrOutline" placeholder="Altitudine"/>
        </FormField>

        <FormField label="Descrizione Stazione Meteo">
          <FormControl v-model="form.wsDescription" type="textarea" placeholder="Descrizione della stazione meteo" />
        </FormField>
        <FormField label="Url dati meteo">
          <FormControl v-model="form.wsUrl" type="url" :icon="mdiDatabaseArrowLeftOutline" />
        </FormField>
        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
