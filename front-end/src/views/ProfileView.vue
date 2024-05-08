<script setup>
import { reactive } from 'vue'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword, mdiGithub } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import UserCard from '@/components/UserCard.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const passwordForm = reactive({
  password: '',
  password_confirmation: ''
})

const submit = async () => {
  if(passwordForm.password === passwordForm.password_confirmation){
    axios.patch('http://localhost:3000/api/v1/user', 
     { "password" : passwordForm.password },
     { headers: {"Authorization" : `Bearer ${authStore.getToken.value}`}
    })
    .catch((error) => {
      console.error(error)
      //TODO: send error
    })
  }else{
    //TODO: send error
  }
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Profile" main></SectionTitleLineWithButton>

      <UserCard class="mb-6" />

      <div class="grid grid-cols-1 gap-6">
<!-- 
        <CardBox is-form @submit="submitPass">
          <p class="text-2xl"><strong>Cambia Password</strong></p>
          <SectionTitleLineWithButton icon="" title="" main></SectionTitleLineWithButton>

          <FormField label="Nuova password" help="Obbligatorio">
            <FormControl
              v-model="passwordForm.password"
              :icon="mdiFormTextboxPassword"
              name="password"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <FormField label="Conferma password" help="Obbligatorio">
            <FormControl
              v-model="passwordForm.password_confirmation"
              :icon="mdiFormTextboxPassword"
              name="password_confirmation"
              type="password"
              required
              autocomplete="new-password"
            />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Invia" />
            </BaseButtons>
          </template>
        </CardBox> -->
        <CardBox is-form @submit.prevent="submit">
          <FormField label="Password" help="Please enter your password">
                <FormControl
                    v-model="passwordForm.password"
                    :icon="mdiAsterisk"
                    type="password"
                    name="password"
                    autocomplete="current-password"
                />
            </FormField>

            <FormField label="Password" help="Please enter your password">
                <FormControl
                    v-model="passwordForm.password_confirmation"
                    :icon="mdiAsterisk"
                    type="password"
                    name="password_confirmation"
                    autocomplete="current-password"
                />
            </FormField>

            <!-- <FormCheckRadio
                v-model="form.remember"
                name="remember"
                label="Remember"
                :input-value="true"
            /> -->

            <template #footer>
                <BaseButtons>
                    <BaseButton type="submit" color="info" label="Cambia Password" />
                </BaseButtons>
            </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
