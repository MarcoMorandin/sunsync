<script setup>
import { containerMaxW } from '@/config.js'
import BaseLevel from '@/components/BaseLevel.vue'

const year = new Date().getFullYear()
</script>

<template>
    <footer
        class="justify-center text-center flex h-20 dark:bg-slate-800 bg-slate-900 text-slate-300"
    >
        <BaseLevel>
            <div class="">
                <p><strong>{{ year }} Made by Morandin Marco & Soldera Marco</strong> for University of Trento</p>
            </div>
        </BaseLevel>
    </footer>
</template>
