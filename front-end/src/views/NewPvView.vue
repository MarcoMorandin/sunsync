<script setup>
import { onMounted, reactive, ref } from 'vue'
import {
    mdiLightningBolt,
    mdiDatabaseArrowLeftOutline,
    mdiSolarPanelLarge,
    mdiLatitude,
    mdiLongitude,
    mdiImageFilterHdrOutline
} from '@mdi/js'
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
import { wsInfoEndpoint, pvInfoEndpoint } from '@/endpoints'
 
const authStore = useAuthStore()

const router = useRouter()

const form = reactive({
    pvLat: '',
    pvLong: '',
    pvHeight: '',
    pvDescription: '',
    power: '',
    pvUrl: '',
    wsId: ''
})

const selectOptions = ref([])

onMounted(() => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + wsInfoEndpoint, {
            headers: {
                Authorization: `Bearer ${authStore.getToken.value}`
            }
        })
        .then((response) => {
            response.data.forEach((ws) => {
				selectOptions.value.push({
					id: ws._id,
					label: ws.description
				})
			})
        })
})

const submit = async () => {
    await axios
        .post(
            import.meta.env.VITE_BASE_URL_API + pvInfoEndpoint,
            {
                location: {
                    lat: form.pvLat,
                    long: form.pvLong,
                    alt: form.pvHeight
                },
                description: form.pvDescription,
                url: form.pvUrl,
                installed_power: form.power,
                ws_id: form.wsId.id
            },
            {
                headers: {
                    Authorization: `Bearer ${authStore.getToken.value}`
                }
            }
        )
        .then(() => {
            formStatusCurrent.value = formStatusOptions[1]
            isVisible.value = false
            setTimeout(() => router.push('/dashboard'), 500)
        })
        .catch(() => {
            formStatusCurrent.value = formStatusOptions[2]
        })
}

const formStatusCurrent = ref(0)

const formStatusOptions = ['none', 'success', 'danger']
const isVisible = ref(true)
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiSolarPanelLarge"
                title="Nuovo Impianto"
                main
            ></SectionTitleLineWithButton>
            <NotificationBar :color="formStatusCurrent">
                <span v-if="formStatusCurrent == 'danger'"
                    ><b class="capitalize">ERRORE: </b> L'inserimento non è andato a buon
                    fine!</span
                >
                <span v-if="formStatusCurrent == 'success'"
                    >Inserimento avvenuto con successo!</span
                >
            </NotificationBar>
            <CardBox v-if="isVisible" is-form @submit.prevent="submit">
                <FormField label="Posizione Impianto Fotovoltaico">
                    <FormControl
                        v-model="form.pvLat"
                        type="number"
                        :icon="mdiLatitude"
                        placeholder="Latitudine"
                    />
                    <FormControl
                        v-model="form.pvLong"
                        type="number"
                        :icon="mdiLongitude"
                        placeholder="Longintudine"
                    />
                </FormField>
                <FormField>
                    <FormControl
                        v-model="form.pvHeight"
                        type="number"
                        :icon="mdiImageFilterHdrOutline"
                        placeholder="Altitudine"
                    />
                </FormField>

                <FormField label="Descrizione Impianto Fotovoltaico">
                    <FormControl
                        v-model="form.pvDescription"
                        type="textarea"
                        placeholder="Descrizione dell'impianto fotovoltaico"
                    />
                </FormField>
                <FormField label="Potenza Installata (kW)">
                    <FormControl v-model="form.power" type="number" :icon="mdiLightningBolt" />
                </FormField>
                <FormField label="Url dati fotovoltaico">
                    <FormControl
                        v-model="form.pvUrl"
                        type="url"
                        :icon="mdiDatabaseArrowLeftOutline"
                    />
                </FormField>
                <FormField label="Stazione Meteo">
                    <FormControl v-model="form.wsId" :options="selectOptions" />
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
