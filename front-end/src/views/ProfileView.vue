<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import UserCard from '@/components/UserCard.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import NotificationBar from '@/components/NotificationBar.vue'
import { meEndpoint } from '@/endpoints'

const authStore = useAuthStore()

const router = useRouter()

const showErrorNotification = ref(false)
const error = ref('')

const passwordForm = reactive({
    password: '',
    password_confirmation: ''
})

const submit = async () => {
    if (passwordForm.password === passwordForm.password_confirmation) {
        axios
            .patch(
                import.meta.env.VITE_BASE_URL_API + meEndpoint,
                { old_password: passwordForm.old_password, password: passwordForm.password },
                { headers: { Authorization: `Bearer ${authStore.getToken.value}` } }
            ).then(() =>  {
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
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiAccount"
                title="Profilo"
                main
            ></SectionTitleLineWithButton>

            <UserCard class="mb-6" />

            <div class="grid grid-cols-1 gap-6">
                <CardBox is-form @submit.prevent="submit">
                    <NotificationBar
                        v-if="showErrorNotification"
                        color="danger"
                        :icon="mdiMonitorCellphone"
                    >
                        <b>ERRORE: </b> {{ error }}
                    </NotificationBar>

                    <FormField label="Vecchia Password" help="Inserisci la tua vecchia password">
                        <FormControl
                            v-model="passwordForm.old_password"
                            :icon="mdiAsterisk"
                            type="password"
                            name="old_password"
                            autocomplete="old-password"
                        />
                    </FormField>

                    <FormField label="Nuova Password" help="Inserisci la tua nuova password">
                        <FormControl
                            v-model="passwordForm.password"
                            :icon="mdiAsterisk"
                            type="password"
                            name="password"
                            autocomplete="new-password"
                        />
                    </FormField>

                    <FormField label="Ripeti Nuova Password" help="Ripeti la tua nuova password">
                        <FormControl
                            v-model="passwordForm.password_confirmation"
                            :icon="mdiAsterisk"
                            type="password"
                            name="password_confirmation"
                            autocomplete="new-password"
                        />
                    </FormField>

                    <template #footer>
                        <BaseButtons>
                            <BaseButton type="submit" color="info" label="Cambia Password" />
                        </BaseButtons>
                    </template>
                </CardBox>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>
