<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import menuNavBar from '@/menuNavBarHome.js'
import { useDarkModeStore } from '@/stores/darkMode.js'
import NavBar from '@/components/NavBar.vue'
import NavBarItemPlain from '@/components/NavBarItemPlain.vue'

const darkModeStore = useDarkModeStore()

const router = useRouter()

const menuClick = (event, item) => {
    if (item.isToggleLightDark) {
        darkModeStore.set()
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
                :class="[layoutAsidePadding, { 'ml-60 lg:ml-0': isAsideMobileExpanded }]"
                @menu-click="menuClick"
            >
                <NavBarItemPlain use-margin>
                    <div class="justify-center items-center text-center flex pt-8 pl-4">
                        <img src="/logoOrizzontale.png" alt="" class="h-10">
                    </div>
                </NavBarItemPlain>
            </NavBar>
            <slot />
        </div>
    </div>
</template>
