import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const token = ref('')
    const userId = ref('')
    const expire = ref('')
    const role = ref('')

    const getToken = computed(() => token)
    const getUserId = computed(() => userId)
    const getExpire = computed(() => expire)
    const getRole = computed(() => role)


    function setToken(tkn){
        token.value = tkn
    }
    
    function setUserId(uId){
        userId.value = uId
    }

    function setExpire(exp){
        expire.value = exp
    }

    function setRole(r){
        role.value = r
    }

    return { token, userId, role, expire, getToken, getUserId, getExpire, getRole, setToken, setUserId, setExpire, setRole }
}, {persist: true})