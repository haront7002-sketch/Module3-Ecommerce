<template>
  <div id="app">
    <!-- Welcome Animation (shown after login/signup) -->
    <WelcomeAnimation 
      v-if="showWelcomeAnimation" 
      @completed="onWelcomeCompleted"
    />
    
    <!-- Goodbye Animation (shown after logout) -->
    <GoodbyeAnimation 
      v-if="showGoodbyeAnimation" 
      @completed="onGoodbyeCompleted"
    />
    
    <!-- Main App Content (hidden during animations) -->
    <div v-if="!showWelcomeAnimation && !showGoodbyeAnimation" class="main-app">
      <!-- Show header only when authenticated -->
      <header v-if="isAuthenticated">
        <div class="wrapper">
          <nav class="main-nav">
            <RouterLink to="/" class="nav-link" active-class="active">
              <i class="fas fa-home"></i> Home
            </RouterLink>
            <RouterLink to="/explore" class="nav-link" active-class="active">
              <i class="fas fa-compass"></i> Explore
            </RouterLink>
            <RouterLink to="/map" class="nav-link" active-class="active">
              <i class="fas fa-map"></i> Map
            </RouterLink>
            <RouterLink to="/favourites" class="nav-link" active-class="active">
              <i class="fas fa-heart"></i> Favourites
            </RouterLink>
            <RouterLink to="/payments" class="nav-link" active-class="active">
              <i class="fas fa-credit-card"></i> Payment
            </RouterLink>
            <RouterLink to="/profile" class="nav-link" active-class="active">
              <i class="fas fa-user"></i> Profile
            </RouterLink>
            <button @click="handleLogout" class="nav-link logout-btn">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </nav>
        </div>
      </header>
      
      <main>
        <!-- Show LoginSignup when not authenticated, otherwise show the routed component -->
        <RouterView v-if="isAuthenticated" />
        <LoginSignup v-else />
      </main>
    </div>
  </div>
</template>

<script>
import { RouterView, RouterLink } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from './stores/auth'
import LoginSignup from './components/LoginSignup.vue'
import WelcomeAnimation from './components/WelcomeAnimation.vue'
import GoodbyeAnimation from './components/GoodbyeAnimation.vue'

export default {
  name: 'App',
  components: {
    LoginSignup,
    WelcomeAnimation,
    GoodbyeAnimation
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const { isAuthenticated, hasPreferences } = storeToRefs(authStore)
    
    // Animation states
    const showWelcomeAnimation = ref(false)
    const showGoodbyeAnimation = ref(false)

    // Check for just logged in flag on mount
    onMounted(() => {
      const justLoggedIn = sessionStorage.getItem('justLoggedIn')
      if (justLoggedIn === 'true') {
        showWelcomeAnimation.value = true
        sessionStorage.removeItem('justLoggedIn')
      }
    })

    // Watch for authentication changes
    watch(isAuthenticated, (newVal) => {
      if (!newVal) {
        // If not authenticated, ensure we're showing login
        router.push('/')
      }
    })

    // Handle logout with animation
    const handleLogout = () => {
      showGoodbyeAnimation.value = true
    }

    // Welcome animation completed
    const onWelcomeCompleted = () => {
      showWelcomeAnimation.value = false
      // Navigate based on user state
      if (!hasPreferences.value) {
        router.push('/preferences')
      } else {
        router.push('/')
      }
    }

    // Goodbye animation completed
    const onGoodbyeCompleted = () => {
      authStore.logout()
      showGoodbyeAnimation.value = false
      // Force a hard reload to reset everything
      window.location.href = '/'
    }

    return {
      isAuthenticated,
      hasPreferences,
      showWelcomeAnimation,
      showGoodbyeAnimation,
      handleLogout,
      onWelcomeCompleted,
      onGoodbyeCompleted
    }
  }
}
</script>

<style>
@import './style.css';

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
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 30px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.nav-link i {
  font-size: 16px;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-link.active {
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  color: #2d3436;
  box-shadow: 0 5px 15px rgba(174, 233, 148, 0.3);
}

.logout-btn {
  background: rgba(255, 99, 99, 0.15);
  color: #e6e6e6;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

.logout-btn:hover {
  background: rgba(255, 99, 99, 0.25);
  color: #ff0000;
}

@media (max-width: 768px) {
  .main-nav {
    flex-direction: column;
    border-radius: 20px;
    padding: 15px;
  }
  
  .nav-link {
    width: 100%;
    justify-content: center;
  }
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

main {
  min-height: calc(100vh - 100px);
}
</style>
