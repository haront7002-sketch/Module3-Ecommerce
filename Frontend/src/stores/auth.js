import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token'))
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  const preferences = ref(JSON.parse(localStorage.getItem('preferences') || 'null'))

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const hasPreferences = computed(() => !!preferences.value)
  const getUser = computed(() => user.value)
  const getUserPreferences = computed(() => preferences.value)

  // Actions
  async function login(credentials) {
    try {
      // {{url}}/api/auth/login
      // const response = await fetch('{{url}}/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(credentials)
      // })
      // const data = await response.json()
      
      // Mock login
      const userData = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        email: credentials.email,
        name: credentials.email.split('@')[0],
        profileComplete: true
      }
      
      token.value = 'fake-jwt-token'
      user.value = userData
      
      // Update localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(userData))
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: error.message }
    }
  }

  async function signup(userData) {
    try {
      // {{url}}/api/auth/register
      // const response = await fetch('{{url}}/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData)
      // })
      // const data = await response.json()
      
      const newUser = {
        id: 'usr_' + Math.random().toString(36).substr(2, 9),
        ...userData,
        profileComplete: false,
        joined: new Date().toISOString()
      }
      
      token.value = 'fake-jwt-token'
      user.value = newUser
      
      // Update localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      return { success: true, user: newUser }
    } catch (error) {
      console.error('Signup failed:', error)
      return { success: false, error: error.message }
    }
  }

  async function savePreferences(preferencesData) {
    try {
      // {{url}}/api/users/${user.value.id}/preferences
      // const response = await fetch(`{{url}}/api/users/${user.value.id}/preferences`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token.value}`
      //   },
      //   body: JSON.stringify(preferencesData)
      // })
      // const data = await response.json()
      
      preferences.value = preferencesData
      
      if (user.value) {
        user.value = {
          ...user.value,
          ...preferencesData,
          profileComplete: true
        }
      }
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('preferences', JSON.stringify(preferencesData))
      
      return { success: true }
    } catch (error) {
      console.error('Failed to save preferences:', error)
      return { success: false, error: error.message }
    }
  }

  async function updateProfile(profileData) {
    try {
      // {{url}}/api/users/${user.value.id}
      // const response = await fetch(`{{url}}/api/users/${user.value.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token.value}`
      //   },
      //   body: JSON.stringify(profileData)
      // })
      // const data = await response.json()
      
      if (!user.value) return { success: false }
      
      const updatedUser = {
        ...user.value,
        ...profileData
      }
      
      user.value = updatedUser
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      return { success: true, user: updatedUser }
    } catch (error) {
      console.error('Failed to update profile:', error)
      return { success: false, error: error.message }
    }
  }

  async function fetchUserProfile() {
    if (!token.value) return null
    
    try {
      // {{url}}/api/users/profile
      // const response = await fetch('{{url}}/api/users/profile', {
      //   headers: { 'Authorization': `Bearer ${token.value}` }
      // })
      // const data = await response.json()
      // user.value = data.user
      
      return user.value
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      return null
    }
  }

  function logout() {
    token.value = null
    user.value = null
    preferences.value = null
    
    // Clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('preferences')
  }

  return {
    // State
    token,
    user,
    preferences,
    
    // Getters
    isAuthenticated,
    hasPreferences,
    getUser,
    getUserPreferences,
    
    // Actions
    login,
    signup,
    savePreferences,
    updateProfile,
    fetchUserProfile,
    logout
  }
})