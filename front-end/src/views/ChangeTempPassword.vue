<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAsterisk, mdiLockReset } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import axios from 'axios'
import NotificationBar from '@/components/NotificationBar.vue'
import { meEndpoint } from '@/endpoints'
import { useAuthStore } from '@/stores/authStore'

const showErrorNotification = ref(false)

const authStore = useAuthStore()

const form = reactive({
    login: '',
    pass: '',
    oldPass: '',
    repeatPass: ''
})

const router = useRouter()

const submit = async () => {
    if (form.pass === form.repeatPass) {
        axios.patch(
                import.meta.env.VITE_BASE_URL_API + meEndpoint,
                { old_password: form.oldPass, password: form.pass },
                { headers: { Authorization: `Bearer ${authStore.getToken.value}` } }
        )
        .then(() =>  {
            router.push('/dashboard')
        })
        .catch((e) => {
            showErrorNotification.value = true
            error.value = e.response.data["400 Bad Request"]
            return;
        })
    } else {
        showErrorNotification.value = true
        error.value = 'Le password non coincidono'
    }
}
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
            
            <CardBox :class="cardClass" is-form @submit.prevent="submit">
                <NotificationBar
                    color="info"
                    :icon="mdiLockReset"
                >
                    Devi cambiare la password che ti è stata assegnata
                </NotificationBar>
                <NotificationBar
                    v-if="showErrorNotification"
                    color="danger"
                    :icon="mdiMonitorCellphone"
                >
                    <b>ERRORE: </b> Errore nell'effettuare il cambio della password
                </NotificationBar>

                <FormField label="Vecchia Password" help="Inserisci la tua vecchia password">
                    <FormControl
                        v-model="form.oldPass"
                        :icon="mdiAsterisk"
                        type="password"
                        name="old_password"
                        autocomplete="old-password"
                    />
                </FormField>

                <FormField label="Nuova Password" help="Inserisci la tua nuova password">
                    <FormControl
                        v-model="form.pass"
                        :icon="mdiAsterisk"
                        type="password"
                        name="password"
                        autocomplete="new-password"
                    />
                </FormField>

                <FormField label="Ripeti Nuova Password" help="Ripeti la tua nuova password">
                    <FormControl
                        v-model="form.repeatPass"
                        :icon="mdiAsterisk"
                        type="password"
                        name="password_confirmation"
                        autocomplete="new-password"
                    />
                </FormField>

                <template #footer>
                    <BaseButtons>
                        <BaseButton type="submit" color="info" label="Change password" />
                        <BaseButton to="/login" color="info" outline label="Back" />
                    </BaseButtons>
                </template>
            </CardBox> </SectionFullScreen
        >
    </LayoutGuest>
</template>

