import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore(
    'auth',
    () => {
        const token = ref('')
        const userId = ref('')
        const expire = ref('')
        const role = ref('')
        const disabled = ref('')

        const getToken = computed(() => token)
        const getUserId = computed(() => userId)
        const getExpire = computed(() => expire)
        const getRole = computed(() => role)
        const getDisabled = computed(() => disabled)

        function setToken(tkn) {
            token.value = tkn
        }

        function setUserId(uId) {
            userId.value = uId
        }

        function setExpire(exp) {
            expire.value = exp
        }

        function setRole(r) {
            role.value = r
        }

        function setDisabled(d) {
            disabled.value = d
        }

        return {
            token,
            userId,
            role,
            expire,
            getToken,
            getUserId,
            getExpire,
            getRole,
            getDisabled,
            setToken,
            setUserId,
            setExpire,
            setRole,
            setDisabled,
        }
    },
    { persist: true }
)
