<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import axios from 'axios'
import VueJwtDecode from 'vue-jwt-decode'
import NotificationBar from '@/components/NotificationBar.vue'

import { useAuthStore } from '@/stores/authStore'

const showErrorNotification = ref(false)
const error = ref('')

const authStore = useAuthStore()

const form = reactive({
    login: '',
    pass: '',
    remember: false
})

const router = useRouter()

const submit = async () => {

	axios.put('http://localhost:3000/api/v1/user', {
		username: form.login,
		password: form.pass
	})
	.then((response) => {
        authStore.setToken(response.data.token)
        let decoded_token = VueJwtDecode.decode(response.data.token)
        authStore.setUserId(decoded_token.user_id)
        authStore.setExpire(decoded_token.exp)
        authStore.setRole(decoded_token.role)
        router.push('/dashboard')
	})
	.catch((error) => {
		showErrorNotification.value = true
        error.value = "Errore nell'effettuare il login"
	});
}
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
            <NotificationBar v-if="showErrorNotification" color="danger" :icon="mdiMonitorCellphone">
                <b>ERRORE: </b> {{ error }}
            </NotificationBar>
            <CardBox :class="cardClass" is-form @submit.prevent="submit">
                <FormField label="Login" help="Please enter your login">
                    <FormControl
                        v-model="form.login"
                        :icon="mdiAccount"
                        name="login"
                        autocomplete="username"
                    />
                </FormField>

                <FormField label="Password" help="Please enter your password">
                    <FormControl
                        v-model="form.pass"
                        :icon="mdiAsterisk"
                        type="password"
                        name="password"
                        autocomplete="current-password"
                    />
                </FormField>

                <!-- <FormCheckRadio
                    v-model="form.remember"
                    name="remember"
                    label="Remember"
                    :input-value="true"
                /> -->

                <template #footer>
                    <BaseButtons>
                        <BaseButton type="submit" color="info" label="Login" />
                        <BaseButton to="/" color="info" outline label="Back" />
                    </BaseButtons>
                </template>
            </CardBox>
        </SectionFullScreen>@/stores/authStore
    </LayoutGuest>
</template>
@/stores/auth.store