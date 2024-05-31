<script setup>
import { computed, ref, onMounted, toRaw } from 'vue'
import { mdiEye, mdiWeatherPartlyCloudy, mdiSolarPanel, mdiTrashCan, mdiCircle } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import axios from 'axios'
import SvgIcon from '@jamescoyle/vue-icon'
import { useAuthStore } from '@/stores/authStore'
import NotificationBar from '@/components/NotificationBar.vue'
import { eventsEndpoint, wsInfoEndpoint } from '@/endpoints.js'

const props = defineProps({
    type: {
        type: String,
        required: true
    }
})

const authStore = useAuthStore()

const showErrorNotification = ref(false)
const error = ref('')

const perPage = ref(5)
const currentPage = ref(0)
const items = ref([])
onMounted(async () => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + eventsEndpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` },
            params: { type: props.type }
        })
        .then((response) => {
            items.value = response.data
        })
        .catch((error) => {
            if (error.response.status != 404) {
                showErrorNotification.value = true
                error.value = 'Errore nel caricamento degli eventi'
            }
        })
})

const currentModal = ref({})

const isModalActive = ref(false)

const currentPageHuman = computed(() => currentPage.value + 1)

const itemsPaginated = computed(() => items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1)))

const numPages = computed(() => Math.ceil(items.value.length != 0 ? items.value.length / perPage.value : 1))

const pagesList = computed(() => {
    const pagesList = []

    for (let i = 0; i < numPages.value; i++) {
        pagesList.push(i)
    }

    return pagesList
})

const wsInfo = ref({})

async function showModal(i) {
    currentModal.value = items.value[i].pv_info
    await axios
        .get(import.meta.env.VITE_BASE_URL_API + wsInfoEndpoint + '/' + currentModal.value.ws_id, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then((response) => {
            wsInfo.value = response.data
        })
        .catch((error) => {
            showErrorNotification.value = true
            error.value = 'Errore nel caricamento della stazione meteo'
        })
    isModalActive.value = true
}
</script>

<template>
    <NotificationBar v-if="showErrorNotification" color="danger" :icon="mdiMonitorCellphone"> <b>ERRORE: </b> {{ error }} </NotificationBar>
    <CardBoxModal v-model="isModalActive" title="Dettagli">
        <p>
            Nome: <strong>{{ currentModal.description }}</strong>
        </p>
        <p>
            Status: <strong>{{ currentModal.status }}</strong>
        </p>
        <p>
            Potenza Installata:
            <strong>{{ (currentModal.installed_power / 1000).toFixed(2) }} kW</strong>
        </p>
        <p>
            Stazione meteo: <strong> {{ wsInfo.description }} </strong>
        </p>
        <GMapMap
            v-if="isModalActive"
            :center="{ lat: currentModal.location.lat, lng: currentModal.location.long }"
            :zoom="12"
            :options="{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true
            }"
            map-type-id="terrain"
            class="w-full h-96"
        >
            <GMapMarker :position="{ lat: currentModal.location.lat, lng: currentModal.location.long }" :clickable="true" :draggable="false">
                <GMapInfoWindow>
                    <svg-icon type="mdi" :path="mdiSolarPanel"></svg-icon>
                </GMapInfoWindow>
            </GMapMarker>
            <GMapMarker :position="{ lat: wsInfo.location.lat, lng: wsInfo.location.long }" :clickable="true" :draggable="false">
                <GMapInfoWindow>
                    <svg-icon type="mdi" :path="mdiWeatherPartlyCloudy"></svg-icon>
                </GMapInfoWindow>
            </GMapMarker>
        </GMapMap>
    </CardBoxModal>

    <table>
        <thead>
            <tr>
                <th>Data</th>
                <th>Descrizione Evento</th>
                <th>Impianto</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="(event, index) in itemsPaginated" :key="event._id">
                <td data-label="date">
                    {{ new Date(event.time).toLocaleString('it-IT') }}
                </td>
                <td data-label="description">
                    {{ event.description.charAt(0).toUpperCase() + event.description.slice(1) + (event.description == 'peak'? ': ' + (event.value/1000).toFixed(2) + ' kWh': '') }}
                </td>
                <td data-label="pv_description">
                    {{ event.pv_info.description }}
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton color="info" :icon="mdiEye" small @click="showModal(index)" />
                    </BaseButtons>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
            <BaseButtons>
                <BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1" :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
            </BaseButtons>
            <small>Pagina {{ currentPageHuman }} di {{ numPages }}</small>
        </BaseLevel>
    </div>
</template>
