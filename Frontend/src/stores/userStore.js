import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE_URL = 'http://localhost:3000'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  async function register(payload) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to register')

    token.value = data.token || ''
    localStorage.setItem('token', token.value)
    await getMe()
    return data
  }

  async function login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to login')

    token.value = data.token || ''
    localStorage.setItem('token', token.value)
    await getMe()
    return data
  }

  async function getMe() {
    if (!token.value) return null

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch user')

    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
    return data
  }

  function logout() {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    register,
    login,
    getMe,
    logout
  }
})
