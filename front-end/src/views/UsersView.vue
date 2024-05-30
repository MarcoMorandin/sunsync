<script setup>
import { mdiAccountGroupOutline } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'

import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'

import TableUser from '@/components/TableUser.vue'
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiAccountGroupOutline" title="Utenti" main></SectionTitleLineWithButton>
            <CardBox has-table>
                <TableUser />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
