<script setup>
import { reactive, ref } from 'vue'
import { mdiEmailOutline, mdiFormTextboxPassword, mdiAccountPlusOutline, mdiAccount } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadioGroup from '@/components/FormCheckRadioGroup.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import NotificationBarInCard from '@/components/NotificationBarInCard.vue'
import { usersEndpoint } from '@/endpoints'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const selectOptions = { 0: 'Admin', 1: 'Dipendente' }

const form = reactive({
    username: '',
    email: '',
    pass: '',
    role: selectOptions[0]
})

const submit = async () => {
    console.log()
    await axios
        .post(
            import.meta.env.VITE_BASE_URL_API + usersEndpoint,
            {
                username: form.username,
                mail: form.email,
                password: form.pass,
                role: form.role
            },
            { headers: { Authorization: `Bearer ${authStore.getToken.value}` } }
        )
        .then(() => {
            formStatusCurrent.value = formStatusOptions[1]
            setTimeout(() => router.push('/dashboard'), 500)
        })
        .catch(() => {
            formStatusCurrent.value = formStatusOptions[2]
        })
}

const formStatusWithHeader = ref(true)

const formStatusCurrent = ref(0)

const formStatusOptions = ['none', 'success', 'danger']
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiAccountPlusOutline" title="Nuovo Utente" main></SectionTitleLineWithButton>
            <CardBox is-form @submit.prevent="submit">
                <NotificationBarInCard :color="formStatusCurrent" :is-placed-with-header="formStatusWithHeader">
                    <span v-if="formStatusCurrent == 'danger'"><b class="capitalize">ERRORE: </b> L'inserimento non è andato a buon fine!</span>
                    <span v-if="formStatusCurrent == 'success'">Inserimento avvenuto con successo!</span>
                </NotificationBarInCard>
                <FormField label="Username">
                    <FormControl v-model="form.username" :icon="mdiAccount" />
                </FormField>
                <FormField label="Email">
                    <FormControl v-model="form.email" type="email" :icon="mdiEmailOutline" />
                </FormField>
                <FormField label="Password">
                    <FormControl v-model="form.pass" type="password" :icon="mdiFormTextboxPassword" />
                </FormField>
                <FormField label="Ruolo">
                    <FormCheckRadioGroup v-model="form.role" name="role" type="radio" :options="selectOptions" />
                </FormField>
                <template #footer>
                    <BaseButtons>
                        <BaseButton type="submit" color="info" label="Invia" />
                        <BaseButton type="reset" color="info" outline label="Reset" />
                    </BaseButtons>
                </template>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
