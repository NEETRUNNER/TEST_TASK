import { createApp } from 'vue'
import { createPinia } from 'pinia'

import piniaPluginPersistedstate  from 'pinia-plugin-persistedstate' // Установили библиотеку piniaPersist для сохранения стейта в localStorage

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia(); // Создали piniaPersist
pinia.use(piniaPluginPersistedstate ) // Используем piniaPersist

app.use(pinia) // Создали стейт-менеджер
app.use(router)

app.mount('#app')