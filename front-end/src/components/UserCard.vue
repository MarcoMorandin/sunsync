<script setup>
import { onMounted, ref } from 'vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { meEndpoint } from '@/endpoints'
import { mdiSend } from '@mdi/js'
import PillTag from '@/components/PillTag.vue'

const authStore = useAuthStore()

const username = ref('')
const token = ref('')

const fillUsername = () => {
    if (authStore.getToken.value != null || authStore.getToken.value != '') {
        axios
            .get(import.meta.env.VITE_BASE_URL_API + meEndpoint, {
                headers: { Authorization: `Bearer ${authStore.getToken.value}` }
            })
            .then((response) => {
                username.value = response.data.username
                token.value = response.data.bot_token
            })
    }
}

onMounted(() => {
    fillUsername()
})
</script>

<template>
    <CardBox>
        <BaseLevel type="justify-around lg:justify-center">
            <div class="space-y-3 text-center lg:mx-12">
                <h1 class="text-2xl">
                    Buongiorno, <strong>{{ username }}</strong
                    >!
                </h1>
                <h2 class="text-2l">
                    Il tuo token per accedere al <a class="font-medium text-blue-600 underline dark:text-blue-500 hover:no-underline" href="https://t.me/sunsync_alert_bot">Bot Telegram</a> è:<br />
                    <PillTag class="mt-2" :label="token" color="info" :icon="mdiSend" :small="false" />
                </h2>
            </div>
        </BaseLevel>
    </CardBox>
</template>
