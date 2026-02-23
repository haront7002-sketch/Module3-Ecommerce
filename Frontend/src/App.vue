<script setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'
import LoginSignup from './components/LoginSignup.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isAuthenticated, hasPreferences } = storeToRefs(authStore)

// Logout function
const logout = () => {
  authStore.logout()
  router.push('/')
}
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- Navigation menu - only show when authenticated and preferences completed -->
      <nav v-if="isAuthenticated && hasPreferences" class="main-nav">
        <router-link to="/" class="nav-link" :class="{ active: route.path === '/' }">
          <i class="uil uil-home"></i> Home
        </router-link>
        <router-link to="/profile" class="nav-link" :class="{ active: route.path === '/profile' }">
          <i class="uil uil-user"></i> Profile
        </router-link>
        <button @click="logout" class="nav-link logout-btn">
          <i class="uil uil-signout"></i> Logout
        </button>
      </nav>
    </div>
  </header>
  
  <!-- Show LoginSignup if not authenticated -->
  <LoginSignup v-if="!isAuthenticated" />
  
  <!-- Show the routed component if authenticated -->
  <RouterView v-else :key="$route.fullPath" />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 1rem;
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.main-nav {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 30px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.nav-link i {
  font-size: 18px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-link.active {
  background: linear-gradient(45deg, #EEAECA, #AEE994);
  color: #1f2029;
  box-shadow: 0 5px 15px rgba(174, 233, 148, 0.3);
}

.logout-btn {
  background: rgba(255, 99, 99, 0.2);
  color: #ff6b6b;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.logout-btn:hover {
  background: rgba(255, 99, 99, 0.3);
  color: #ff5252;
}

@media (max-width: 768px) {
  .main-nav {
    flex-direction: column;
    border-radius: 20px;
    padding: 10px;
  }
  
  .nav-link {
    width: 100%;
    justify-content: center;
  }
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>