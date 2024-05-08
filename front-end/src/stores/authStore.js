import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const token = ref('')
    const userId = ref('')
    const expire = ref('')

    const getToken = computed(() => token)
    const getUserId = computed(() => userId)
    const getExpire = computed(() => expire)


    function setToken(tkn){
        token.value = tkn
    }
    
    function setUserId(uId){
        userId.value = uId
    }

    function setExpire(exp){
        expire.value = exp
    }

    return { token, userId, expire, getToken, getUserId, getExpire, setToken, setUserId, setExpire }
}, {persist: true})