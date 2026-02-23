import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token'))
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const hasPreferences = computed(() => user.value?.profileComplete || false)
  const getUser = computed(() => user.value)

  // Actions
  function login(email) {
    // Mock login
    const userData = {
      email,
      name: email.split('@')[0],
      profileComplete: true
    }
    
    token.value = 'fake-jwt-token'
    user.value = userData
    
    // Update localStorage
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function signup(userData) {
    const newUser = {
      ...userData,
      profileComplete: false,
      joined: new Date().toISOString()
    }
    
    token.value = 'fake-jwt-token'
    user.value = newUser
    
    // Update localStorage
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function savePreferences(preferences) {
    if (!user.value) return
    
    const updatedUser = {
      ...user.value,
      ...preferences,
      profileComplete: true
    }
    
    user.value = updatedUser
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser))
    localStorage.setItem('preferences', JSON.stringify(preferences))
  }

  function updateProfile(profileData) {
    if (!user.value) return
    
    const updatedUser = {
      ...user.value,
      ...profileData
    }
    
    user.value = updatedUser
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  function logout() {
    token.value = null
    user.value = null
    
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('preferences')
  }

  return {
    token,
    user,
    isAuthenticated,
    hasPreferences,
    getUser,
    login,
    signup,
    savePreferences,
    updateProfile,
    logout
  }
})