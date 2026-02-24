import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE_URL = 'http://localhost:3000'

export const useFavouriteStore = defineStore('favourite', () => {
  const favourites = ref([])

  async function getFavourites(userId) {
    const response = await fetch(`${API_BASE_URL}/favourites/${userId}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch favourites')

    favourites.value = data.favourites || []
    return favourites.value
  }

  async function addFavourite(userId, eventId) {
    const response = await fetch(`${API_BASE_URL}/favourites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, event_id: eventId })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to add favourite')
    return data
  }

  async function removeFavourite(userId, eventId) {
    const response = await fetch(`${API_BASE_URL}/favourites`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, event_id: eventId })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to remove favourite')

    favourites.value = favourites.value.filter((item) => item.event_id !== eventId)
    return data
  }

  return {
    favourites,
    getFavourites,
    addFavourite,
    removeFavourite
  }
})
