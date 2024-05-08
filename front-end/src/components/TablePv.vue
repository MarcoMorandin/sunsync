<script setup>
import { computed, ref, onMounted } from 'vue'
import { mdiEye } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import axios from 'axios'

import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

defineProps({
    checkable: Boolean
})

const perPage = ref(5)
const currentPage = ref(0)
const items = ref([])
onMounted(async () => {
    axios
        .get('http://localhost:3000/api/v1/pvinfo', {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then((response) => {
            items.value = response.data
        })
        .catch((error) => {
            console.log(error)
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

function showModal(i) {
    currentModal.value = items.value[i]
    isModalActive.value = true
}
</script>

<template>
    <CardBoxModal v-model="isModalActive" title="Dettagli">
        <p>
            Nome: <strong>{{ currentModal.description }}</strong>
        </p>
        <p>
            Potenza Installata: <strong>{{ currentModal.installed_power }} kW</strong>
        </p>
        <GMapMap
            v-if="isModalActive"
            :center="{ lat: currentModal.location.lat, lng: currentModal.location.long }"
            :zoom="13"
            :options="{
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: true,
              streetViewControl: false,
              rotateControl: false,
              fullscreenControl: true,
            }"
            map-type-id="terrain"
            class="w-full h-96"
        >
            <GMapMarker
                :position="{ lat: currentModal.location.lat, lng: currentModal.location.long }"
                :clickable="true"
                :draggable="false"
            />
        </GMapMap>
    </CardBoxModal>

    <table>
        <thead>
            <tr>
                <th v-if="checkable" />
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
                    {{ pvInfo.installed_power }}
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
            <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
        </BaseLevel>
    </div>
</template>
