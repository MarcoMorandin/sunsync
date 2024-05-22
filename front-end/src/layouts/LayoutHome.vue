<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import menuNavBar from '@/menuNavBarHome.js'
import { useDarkModeStore } from '@/stores/darkMode.js'
import NavBar from '@/components/NavBar.vue'
import FooterBar from '@/components/FooterBar.vue'
import NavBarItemPlain from '@/components/NavBarItemPlain.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const darkModeStore = useDarkModeStore()

const router = useRouter()

const menuClick = (event, item) => {
    if (item.isToggleLightDark) {
        darkModeStore.set()
    }

    if (item.isLogout) {
        authStore.setToken('')
        authStore.setExpire('')
        authStore.setUserId('')
        authStore.setRole('')
        router.push({ name: 'home' })
        location.reload()
    }
}

</script>

<template>
    <div
        :class="{
            'overflow-hidden lg:overflow-visible': isAsideMobileExpanded
        }"
    >
        <div
            :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
            class="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
        >
            <NavBar
                :menu="menuNavBar"
                :isHome="true"
                :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
                @menu-click="menuClick"
                class="bg-slate-900 h-20"
            >
                <NavBarItemPlain use-margin>
                    <div class="justify-center items-center text-center flex pt-6 pl-4">
                        <img src="/logoOrizzontale.png" alt="" class="h-10">
                    </div>
                </NavBarItemPlain>
            </NavBar>
            <slot />
            <FooterBar/>
        </div>
    </div>
</template>
