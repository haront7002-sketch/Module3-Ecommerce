import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE_URL = 'http://localhost:3000'

export const useCartStore = defineStore('cart', () => {
  const cart = ref([])

  async function getCart(userId) {
    const response = await fetch(`${API_BASE_URL}/cart/${userId}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to fetch cart')

    cart.value = data.cart || []
    return cart.value
  }

  async function addToCart(userId, eventId, quantity = 1) {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, event_id: eventId, quantity })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to add to cart')
    return data
  }

  async function updateCartQuantity(cartId, quantity) {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to update cart quantity')
    return data
  }

  async function removeCartItem(cartId) {
    const response = await fetch(`${API_BASE_URL}/cart/${cartId}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to remove cart item')

    cart.value = cart.value.filter((item) => item.cart_id !== cartId)
    return data
  }

  async function clearUserCart(userId) {
    const response = await fetch(`${API_BASE_URL}/cart/user/${userId}`, {
      method: 'DELETE'
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to clear cart')

    cart.value = []
    return data
  }

  return {
    cart,
    getCart,
    addToCart,
    updateCartQuantity,
    removeCartItem,
    clearUserCart
  }
})
