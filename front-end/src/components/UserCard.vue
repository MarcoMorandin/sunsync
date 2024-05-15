<script setup>
import { onMounted, ref } from 'vue'
import BaseLevel from '@/components/BaseLevel.vue'
import CardBox from '@/components/CardBox.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { meEndpoint } from '@/endpoints'

const authStore = useAuthStore()

const username = ref('')

const fillUsername = () => {
    if (authStore.getToken.value != null || authStore.getToken.value != "") {
        axios
            .get(import.meta.env.VITE_BASE_URL_API + meEndpoint, {
                headers: { Authorization: `Bearer ${authStore.getToken.value}` }
            })
            .then((response) => {
                username.value = response.data.username
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
            <div class="space-y-3 text-center md:text-left lg:mx-12">
                <h1 class="text-2xl">
                    Buongiorno, <strong>{{ username }}</strong
                    >!
                </h1>
            </div>
        </BaseLevel>
    </CardBox>
</template>
