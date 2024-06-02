<script setup>
import { ref, onMounted } from 'vue'
import { mdiHeadSnowflakeOutline, mdiCogOutline } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import TableEvent from '@/components/TableEvent.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBar from '@/components/NotificationBar.vue'

const showErrorNotification = ref(false)
const error = ref('')
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <NotificationBar v-if="showErrorNotification" color="danger" :icon="mdiMonitorCellphone"> <b>ERRORE: </b> {{ error }} </NotificationBar>

            <SectionTitleLineWithButton :icon="mdiCogOutline" title="Manutenzione" main></SectionTitleLineWithButton>
            <CardBox has-table>
                <TableEvent type="warning" />
            </CardBox>
            <SectionTitleLineWithButton />

            <SectionTitleLineWithButton :icon="mdiHeadSnowflakeOutline" title="Previsione" main></SectionTitleLineWithButton>
            <CardBox has-table>
                <TableEvent type="peak" />
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
