import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// Import Font Awesome (for icons)
import '@fortawesome/fontawesome-free/css/all.css'


// Create Pinia instance
const pinia = createPinia()
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)

// Global error handler (optional)
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.log('Component:', instance)
  console.log('Info:', info)
}

// Mount app
app.mount('#app')