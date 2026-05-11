import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Убедись, что путь правильный

const app = createApp(App)

app.use(router)
app.mount('#app')