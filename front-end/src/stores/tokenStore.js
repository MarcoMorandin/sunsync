import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore('token', () => {
    const token = ref('')
    
    const getToken = computed(() => token)

    function setToken(tkn){
        token.value = tkn
    }

    return { token, getToken, setToken }
})