<script setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { mdiPencilOutline, mdiTrashCan, mdiAsterisk } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import NotificationBar from '@/components/NotificationBar.vue'
import { usersEndpoint } from '@/endpoints'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'

const authStore = useAuthStore()

const showErrorNotification = ref(false)
const error = ref('')

const showSuccessNotification = ref(false)
const message = ref('')

const perPage = ref(5)
const currentPage = ref(0)
const items = ref([])
onMounted(async () => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + usersEndpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then((response) => {
            let id = authStore.getUserId.value
            let found = false
            let i = 0
            while(i < response.data.length && !found) {
                if(response.data[i]._id == id) {
                    found = true
                } else {
                    i++
                }
            }
            response.data.splice(i, 1);
            items.value = response.data
        })
        .catch(() => {
            showErrorNotification.value = true
            error.value = 'Errore nel caricamento degli utenti'
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

async function showModal(i) {
    currentModal.value = items.value[i]
    isModalActive.value = true
}

const isWarningActive = ref(false)
const currentWarning = ref({})

async function showWarning(i) {
    currentWarning.value = items.value[i]
    isWarningActive.value = true
}

async function deleteUser() {
    await axios
        .delete(import.meta.env.VITE_BASE_URL_API + usersEndpoint + '/' + currentWarning.value._id, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then(() => {
            window.location.reload()
        })
        .catch((error) => {
            showErrorNotification.value = true
            error.value = "Errore nell'eliminazione dell'utente"
        })
}



async function modifyUser(){
    if(form.password != form.repeat){
        showErrorNotification.value = true
        error.value = 'Le password non coincidono!'
    }else{
        await axios
            .patch(import.meta.env.VITE_BASE_URL_API + usersEndpoint + '/' + currentWarning.value._id, 
            {
                password: form.password
            }, 
            {
                headers: { Authorization: `Bearer ${authStore.getToken.value}` }
            })
            .then(() => {
                showSuccessNotification.value = true
                message.value = "Modifica avvenuta con successo"
            })
            .catch((error) => {
                showErrorNotification.value = true
                error.value = "Errore nella modifica della password"
            })
    }
}

const form = reactive({
    password: '',
    repeat: ''
})
</script>

<template>
    <NotificationBar v-if="showErrorNotification" color="danger" :icon="mdiMonitorCellphone">
        <b>ERRORE: </b> {{ error }}
    </NotificationBar>
    <NotificationBar v-if="showSuccessNotification" color="success" :icon="mdiMonitorCellphone">
        {{ message }}
    </NotificationBar>
    <CardBoxModal
        v-model="isModalActive"
        title="Modifica"
        button="warning"
        button-label="Modifica"
        has-cancel
        @confirm="modifyUser(currentModal)"
    >
        <CardBox>
            <p class="text-xl mb-4"><b>Username:</b> {{ currentModal.username }}</p>
            <p class="text-xl mb-4"><b>Email:</b> {{ currentModal.mail }}</p>
            <FormField label="Nuova Password" help="Perfavore inserisci la nuova password">
                <FormControl
                    v-model="form.password"
                    :icon="mdiAsterisk"
                    type="password"
                    name="login"
                    autocomplete="new-password"
                />
            </FormField>

            <FormField label="Ripeti Password" help="Perfavore re-inserisci la nuova password">
                <FormControl
                    v-model="form.repeat"
                    :icon="mdiAsterisk"
                    type="password"
                    name="password"
                    autocomplete="repeat-password"
                />
            </FormField>
        </CardBox>
    </CardBoxModal>

    <CardBoxModal
        v-model="isWarningActive"
        title="Sei sicuro?"
        has-cancel
        button="danger"
        button-label="Conferma"
        @confirm="deleteUser()"
    >
        <p>
            Cliccando il pulsante 'Conferma' <strong>eliminerai definitivamente </strong>
            la stazione meteo e tutti i dati ad essa collegati
        </p>
    </CardBoxModal>

    <table>
        <thead>
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Ruolo</th>
                <th>Disabilitato</th>
                <th />
            </tr>
        </thead>
        <tbody>
            <tr v-for="(user, index) in itemsPaginated" :key="user._id">
                <td data-label="username">
                    {{ user.username }}
                </td>
                <td data-label="mail">
                    {{ user.mail }}
                </td>
                <td data-label="role">
                    {{ user.role == 0 ? 'Admin' : 'Dipendente' }}
                </td>
                <td data-label="disabled">
                    {{ user.disabled ? 'Sì' : 'No' }}
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="warning"
                            :icon="mdiPencilOutline"
                            small @click="showModal(index)"
                        />
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
