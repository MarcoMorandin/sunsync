<script setup>
import { mdiChevronUp, mdiChevronDown } from '@mdi/js'
import { RouterLink } from 'vue-router'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import BaseIcon from '@/components/BaseIcon.vue'
import NavBarMenuList from '@/components/NavBarMenuList.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import { useAuthStore } from '@/stores/authStore'
import axios from 'axios'
import { meEndpoint } from '@/endpoints.js'

const authStore = useAuthStore()

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['menu-click'])

const is = computed(() => {
    if (props.item.href) {
        return 'a'
    }

    if (props.item.to) {
        return RouterLink
    }

    return 'div'
})

const componentClass = computed(() => {
    const base = [
        isDropdownActive.value
            ? `navbar-item-label-active dark:text-slate-400`
            : `navbar-item-label dark:text-white dark:hover:text-slate-400`,
        props.item.menu ? 'lg:py-2 lg:px-3' : 'py-2 px-3'
    ]

    if (props.item.isDesktopNoLabel) {
        base.push('lg:w-16', 'lg:justify-center')
    }

    if (props.item.bgColor) {
        base.push(props.item.bgColor)
    }

    return base
})

const iconClass = computed(() => {
    const base = []

    if (props.item.bgColor) {
        base.push("text-slate-300 hover:text-white")
    }

    return base
})

const username = ref('')

const fillUsername = () => {
    axios
        .get(import.meta.env.VITE_BASE_URL_API + meEndpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` }
        })
        .then((response) => {
            username.value = response.data.username
        })
}

onMounted(() => {
    fillUsername()
})

const itemLabel = computed(() => (props.item.isCurrentUser ? username.value : props.item.label))

const isDropdownActive = ref(false)

const menuClick = (event) => {
    emit('menu-click', event, props.item)

    if (props.item.menu) {
        isDropdownActive.value = !isDropdownActive.value
    }
}

const menuClickDropdown = (event, item) => {
    emit('menu-click', event, item)
}

const root = ref(null)

const forceClose = (event) => {
    if (root.value && !root.value.contains(event.target)) {
        isDropdownActive.value = false
    }
}

function displayFunc(isAuth) {
    if(isAuth != null) {
        if(isAuth == true && authStore.getToken.value) {
            return true
        } else if(isAuth == false && !authStore.getToken.value) {
            return true
        } else {
            return false
        }
    } else {
        return true
    }
}

onMounted(() => {
    if (props.item.menu) {
        window.addEventListener('click', forceClose)
    }
})

onBeforeUnmount(() => {
    if (props.item.menu) {
        window.removeEventListener('click', forceClose)
    }
})
</script>

<template>
    <BaseDivider v-if="item.isDivider" nav-bar />
    <component
        :is="is"
        v-else
        v-if="displayFunc(item.isAuth)"
        ref="root"
        class="block lg:flex items-center relative cursor-pointer"
        :class="componentClass"
        :to="item.to ?? null"
        :href="item.href ?? null"
        :target="item.target ?? null"
        @click="menuClick"
    >
        <div
            class="flex items-center"
            :class="{
                'bg-gray-100 dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-3 lg:p-0':
                    item.menu
            }"
        >
            <BaseIcon
                v-if="item.icon"
                :path="item.icon"
                class="transition-colors"
                h="h-16"
                :size="20"
                :class="iconClass"
            />
            <span
                class="px-2 transition-colors"
                :class="[{ 'lg:hidden': item.isDesktopNoLabel && item.icon }, iconClass]"
                >{{ itemLabel }}</span
            >
            <BaseIcon
                v-if="item.menu"
                :path="isDropdownActive ? mdiChevronUp : mdiChevronDown"
                class="hidden lg:inline-flex transition-colors"
                :class="iconClass"
            />
        </div>
        <div
            v-if="item.menu"
            class="text-sm border-b border-gray-100 lg:border lg:bg-white lg:absolute lg:top-full lg:left-0 lg:min-w-full lg:z-20 lg:rounded-lg lg:shadow-lg lg:dark:bg-slate-800 dark:border-slate-700"
            :class="{ 'lg:hidden': !isDropdownActive }"
        >
            <NavBarMenuList :menu="item.menu" @menu-click="menuClickDropdown" />
        </div>
    </component>
</template>
