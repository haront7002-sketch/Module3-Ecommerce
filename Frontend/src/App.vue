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
            <div class="nav-left">
              <div class="logo">
                <span>SOS</span>
              </div>
            </div>
            
            <!-- Desktop Navigation (visible on larger screens) -->
            <div class="nav-center desktop-nav">
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
              <RouterLink to="/about" class="nav-link" active-class="active">
                <i class="fas fa-info-circle"></i> About
              </RouterLink>
            </div>
            
            <!-- Desktop Logout Button -->
            <div class="nav-right desktop-nav">
              <button @click="handleLogout" class="nav-link logout-btn">
                <i class="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
            
            <!-- Mobile Hamburger Menu -->
            <div class="mobile-menu-container">
              <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ active: mobileMenuOpen }">
                <span></span>
                <span></span>
                <span></span>
              </button>
              
              <!-- Mobile Dropdown Menu -->
              <transition name="slide-down">
                <div v-if="mobileMenuOpen" class="mobile-dropdown">
                  <RouterLink to="/" class="mobile-nav-link" @click="closeMobileMenu">
                    <i class="fas fa-home"></i> Home
                  </RouterLink>
                  <RouterLink to="/explore" class="mobile-nav-link" @click="closeMobileMenu">
                    <i class="fas fa-compass"></i> Explore
                  </RouterLink>
                  <RouterLink to="/map" class="mobile-nav-link" @click="closeMobileMenu">
                    <i class="fas fa-map"></i> Map
                  </RouterLink>
                  <RouterLink to="/favourites" class="mobile-nav-link" @click="closeMobileMenu">
                    <i class="fas fa-heart"></i> Favourites
                  </RouterLink>
                  <RouterLink to="/payments" class="mobile-nav-link" @click="closeMobileMenu">
                    <i class="fas fa-credit-card"></i> Payment
                  </RouterLink>
                  <RouterLink to="/profile" class="mobile-nav-link" @click="closeMobileMenu">
                    <i class="fas fa-user"></i> Profile
                  </RouterLink>
                  <RouterLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">
                    <i class="fas fa-info-circle"></i> About
                  </RouterLink>
                  <div class="mobile-divider"></div>
                  <button @click="handleMobileLogout" class="mobile-nav-link logout-mobile">
                    <i class="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </transition>
            </div>
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
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
    const store = useStore()
    const isAuthenticated = computed(() => store.state.isAuthenticated)
    const hasPreferences = computed(() => store.state.me?.profileComplete !== false)
    
    // Animation states
    const showWelcomeAnimation = ref(false)
    const showGoodbyeAnimation = ref(false)
    
    // Mobile menu state
    const mobileMenuOpen = ref(false)

    // Check for just logged in flag on mount
    onMounted(async () => {
      if (isAuthenticated.value) {
        try {
          await store.dispatch('fetchMe')
        } catch {
          // clearAuth is handled in fetchMe when token is invalid/expired
        }
      }

      const justLoggedIn = sessionStorage.getItem('justLoggedIn')
      if (justLoggedIn === 'true') {
        showWelcomeAnimation.value = true
        sessionStorage.removeItem('justLoggedIn')
      }
      
      // Close mobile menu on window resize if going to desktop
      window.addEventListener('resize', handleResize)
    })

    // Cleanup event listener
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
    })

    // Handle resize
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen.value) {
        mobileMenuOpen.value = false
      }
    }

    // Toggle mobile menu
    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    // Close mobile menu
    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }

    // Handle mobile logout
    const handleMobileLogout = () => {
      closeMobileMenu()
      handleLogout()
    }

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
      store.dispatch('logout')
      showGoodbyeAnimation.value = false
      // Force a hard reload to reset everything
      window.location.href = '/'
    }

    return {
      isAuthenticated,
      hasPreferences,
      showWelcomeAnimation,
      showGoodbyeAnimation,
      mobileMenuOpen,
      handleLogout,
      onWelcomeCompleted,
      onGoodbyeCompleted,
      toggleMobileMenu,
      closeMobileMenu,
      handleMobileLogout
    }
  }
}
</script>

<style>
@import './style.css';

/* Add these z-index fixes at the top of your style section */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

.main-app {
  position: relative;
  z-index: 1;
}

header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 1rem;
  position: relative;
  z-index: 1000; /* Higher than main content */
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* Make sure the header has proper positioning context */
.main-nav {
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1000; /* Add z-index to header */
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
}

.nav-center {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

/* Desktop Navigation - visible by default */
.desktop-nav {
  display: flex;
}

/* Updated Logo Styles - White Circle with Gradient SOS */
.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 22px;
  background: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  margin-right: 10px;
}

.logo span {
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
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

/* Mobile Menu Styles */
.mobile-menu-container {
  display: none;
  position: relative;
  z-index: 1001; /* Even higher than header */
}

.mobile-menu-btn {
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  cursor: pointer;
  padding: 0;
  transition: all 0.3s ease;
}

.mobile-menu-btn span {
  width: 22px;
  height: 2px;
  background: white;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Fixed dropdown with high z-index */
.mobile-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 250px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 9999; /* Very high z-index to be above everything */
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #2d3436;
  text-decoration: none;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  text-align: left;
}

.mobile-nav-link i {
  width: 20px;
  color: #c01a62;
}

.mobile-nav-link:hover {
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  color: white;
  transform: translateX(5px);
}

.mobile-nav-link:hover i {
  color: white;
}

.mobile-nav-link.router-link-active {
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  color: white;
}

.mobile-nav-link.router-link-active i {
  color: white;
}

.mobile-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 10px 0;
}

.logout-mobile {
  color: #ff4757;
}

.logout-mobile i {
  color: #ff4757;
}

.logout-mobile:hover {
  background: #ff4757;
  color: white;
}

.logout-mobile:hover i {
  color: white;
}

/* Slide down animation for mobile menu */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  transform-origin: top;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: scaleY(0);
}

/* Ensure the main content doesn't block the dropdown */
main {
  min-height: calc(100vh - 100px);
  position: relative;
  z-index: 1; /* Lower z-index than dropdown */
}

/* Mobile Styles - Override desktop layout */
@media (max-width: 768px) {
  .main-nav {
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 15px;
    border-radius: 30px;
  }
  
  .desktop-nav {
    display: none;
  }
  
  .mobile-menu-container {
    display: block;
    z-index: 1001;
  }
  
  .nav-left {
    flex: 0 1 auto;
  }
  
  .nav-center, .nav-right {
    display: none; /* Hide the original nav-center and nav-right on mobile */
  }
}

@media (max-width: 480px) {
  .mobile-dropdown {
    width: 220px;
    right: -10px;
  }
}

/* These are already defined above, but keeping for completeness */
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

main {
  min-height: calc(100vh - 100px);
}
</style>