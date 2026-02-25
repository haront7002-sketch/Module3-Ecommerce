import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'
import './style.css'

const app = createApp(App)
app.use(store)
app.use(router)

// Global error handler (optional)
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.log('Component:', instance)
  console.log('Info:', info)
}

// Mount app
app.mount('#app')
