import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedState from "pinia-plugin-persistedstate"

import App from './App.vue'
import router from './router'
import VueGoogleMaps from '@fawmi/vue-google-maps';

import './css/main.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

createApp(App).use(pinia).use(router).use(VueGoogleMaps, {
  load: {
    key: import.meta.env.VITE_GMAPS_API_KEY,
  },
}).mount('#app')