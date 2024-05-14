<script setup>
import { computed, ref, onMounted } from 'vue'
import { mdiEye, mdiWeatherPartlyCloudy, mdiSolarPanel, mdiTrashCan } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import axios from 'axios'
import SvgIcon from '@jamescoyle/vue-icon'
import { useAuthStore } from '@/stores/authStore'
import NotificationBar from '@/components/NotificationBar.vue'
import { pvInfoEndpoint, wsInfoEndpoint } from '@/endpoints.js'


const authStore = useAuthStore()

const showErrorNotification = ref(false)
const error = ref('')

const perPage = ref(5)
const currentPage = ref(0)
const items = ref([])
onMounted(async () => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + pvInfoEndpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then((response) => {
            items.value = response.data
        })
        .catch(() => {
            showErrorNotification.value = true
            error.value = 'Errore nel caricamento degli impianti fotovoltaici'
        })
})

const currentModal = ref({})

const isModalActive = ref(false)

const currentPageHuman = computed(() => currentPage.value + 1)

const itemsPaginated = computed(() =>
    items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const pagesList = computed(() => {
    const pagesList = []

    for (let i = 0; i < numPages.value; i++) {
        pagesList.push(i)
    }

    return pagesList
})

const wsInfo = ref({})

async function showModal(i) {
    currentModal.value = items.value[i]
    await axios
        .get(import.meta.env.VITE_BASE_URL_API + wsInfoEndpoint + '/' + currentModal.value.ws_id, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then((response) => {
            wsInfo.value = response.data
        })
        .catch((error) => {
            showErrorNotification.value = true
            error.value = 'Errore nel caricamento delle stazioni meteo'
        })
    isModalActive.value = true
}

const isWarningActive = ref(false)
const currentWarning = ref({})

async function showWarning(i) {
    currentWarning.value = items.value[i]
    isWarningActive.value = true
}

async function deletePv() {
    await axios
        .delete(import.meta.env.VITE_BASE_URL_API + pvInfoEndpoint + '/' + currentWarning.value._id, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then(async () => {
            window.location.reload()
        })
        .catch((error) => {
            showErrorNotification.value = true
            error.value = "Errore nell'eliminazione dell'impianto fotovoltaico"
        })
}
</script>

<template>
    <NotificationBar v-if="showErrorNotification" color="danger" :icon="mdiMonitorCellphone">
        <b>ERRORE: </b> {{ error }}
    </NotificationBar>
    <CardBoxModal v-model="isModalActive" title="Dettagli">
        <p>
            Nome: <strong>{{ currentModal.description }}</strong>
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
            <GMapMarker
                :position="{ lat: currentModal.location.lat, lng: currentModal.location.long }"
                :clickable="true"
                :draggable="false"
            >
                <GMapInfoWindow>
                    <svg-icon type="mdi" :path="mdiSolarPanel"></svg-icon>
                </GMapInfoWindow>
            </GMapMarker>
            <GMapMarker
                :position="{ lat: wsInfo.location.lat, lng: wsInfo.location.long }"
                :clickable="true"
                :draggable="false"
            >
                <GMapInfoWindow>
                    <svg-icon type="mdi" :path="mdiWeatherPartlyCloudy"></svg-icon>
                </GMapInfoWindow>
            </GMapMarker>
        </GMapMap>
    </CardBoxModal>

    <CardBoxModal
        v-model="isWarningActive"
        title="Sei sicuro?"
        button="danger"
        button-label="Conferma"
        has-cancel
        @confirm="deletePv()"
    >
        <p>
            Cliccando il pulsante 'Conferma' <strong>eliminerai definitivamente </strong>
            l'impianto fotovoltaico e tutti i dati ad esso collegati
        </p>
    </CardBoxModal>

    <table>
        <thead>
            <tr>
                <th>Descrizione</th>
                <th>Potenza Installata</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="(pvInfo, index) in itemsPaginated" :key="pvInfo._id">
                <td data-label="description">
                    {{ pvInfo.description }}
                </td>
                <td data-label="installed_power">
                    {{ (pvInfo.installed_power / 1000).toFixed(2) }} kW
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton color="info" :icon="mdiEye" small @click="showModal(index)" />
                        <BaseButton
                            v-if="authStore.getRole.value == 0"
                            color="danger"
                            :icon="mdiTrashCan"
                            small
                            @click="showWarning(index)"
                        />
                    </BaseButtons>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
            <BaseButtons>
                <BaseButton
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                    small
                    @click="currentPage = page"
                />
            </BaseButtons>
            <small>Pagina {{ currentPageHuman }} di {{ numPages }}</small>
        </BaseLevel>
    </div>
</template>
