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
import { pvDataEndpoint, wsInfoEndpoint } from '@/endpoints.js'

const props = defineProps({
    pvInfo: {
        type: Object,
        required: true
    }
})

const authStore = useAuthStore()

const showErrorNotification = ref(false)
const error = ref('')

const currentModal = ref({})

const perPage = ref(10)
const currentPage = ref(0)
const items = ref([])
onMounted(async () => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + pvDataEndpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` },
            params: { pvinfo_id: props.pvInfo._id }
        })
        .then((response) => {
            items.value = response.data
        })
        .catch((error) => {
            if (error.response.status != 404) {
                showErrorNotification.value = true
                error.value = 'Errore nel caricamento delle previsioni'
            }
        })

    currentModal.value = props.pvInfo
})

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
                <th>Produzione Prevista</th>
                <th>
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton color="info" :icon="mdiEye" small @click="showModal(index)" />
                    </BaseButtons>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, index) in itemsPaginated" :key="item._id">
                <td data-label="date">
                    {{ new Date(item.time).toLocaleString('it-IT') }}
                </td>
                <td data-label="description">
                    {{ item.tomorrow_predicted_power }}
                </td>
                <td />
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
