import { createStore } from 'vuex'

const API_BASE_URL = 'http://localhost:3000'

export default createStore({
  state: {
    events: [],
    event: null,
    favourites: [],
    cart: [],
    categories: [],
    category: null,
    order: null,
    orders: [],
    tickets: [],
    me: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token')
  },
  mutations: {
    setEvents(state, payload) {
      state.events = payload
    },
    setEvent(state, payload) {
      state.event = payload
    },
    setFavourites(state, payload) {
      state.favourites = payload
    },
    setCart(state, payload) {
      state.cart = payload
    },
    setCategories(state, payload) {
      state.categories = payload
    },
    setCategory(state, payload) {
      state.category = payload
    },
    setOrder(state, payload) {
      state.order = payload
    },
    setOrders(state, payload) {
      state.orders = payload
    },
    setTickets(state, payload) {
      state.tickets = payload
    },
    setMe(state, payload) {
      state.me = payload
    },
    setToken(state, token) {
      state.token = token
      state.isAuthenticated = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    clearAuth(state) {
      state.token = null
      state.isAuthenticated = false
      state.me = null
      localStorage.removeItem('token')
    },
    addToFavourites(state, event) {
      if (!state.favourites.some(f => f.id === event.id)) {
        state.favourites.push(event)
      }
    },
    removeFromFavourites(state, eventId) {
      state.favourites = state.favourites.filter(f => f.id !== eventId)
    }
  },
  actions: {
    async getEvents({ commit }) {
      const { events } = await (await fetch(`${API_BASE_URL}/events`)).json()
      commit('setEvents', events)
    },
    async getEventById({ commit }, payload) {
      const { event } = await (await fetch(`${API_BASE_URL}/events/${payload.eventId}`)).json()
      commit('setEvent', event)
    },
    async getEventsByCategory({ commit }, payload) {
      const { events } = await (await fetch(`${API_BASE_URL}/categories/${payload.categoryId}/events`)).json()
      commit('setEvents', events)
    },
    async getCategories({ commit }) {
      const { categories } = await (await fetch(`${API_BASE_URL}/categories`)).json()
      commit('setCategories', categories)
    },
    async getCategoryById({ commit }, payload) {
      const { category } = await (await fetch(`${API_BASE_URL}/categories/${payload.categoryId}`)).json()
      commit('setCategory', category)
    },
    async getFavourites({ commit }, payload) {
      const { favourites } = await (await fetch(`${API_BASE_URL}/favourites/${payload.userId}`)).json()
      commit('setFavourites', favourites)
    },
    async getCart({ commit }, payload) {
      const { cart } = await (await fetch(`${API_BASE_URL}/cart/${payload.userId}`)).json()
      commit('setCart', cart)
    },
    async getOrderById({ commit }, payload) {
      const { order } = await (await fetch(`${API_BASE_URL}/orders/${payload.orderId}`)).json()
      commit('setOrder', order)
    },
    async getUserOrders({ commit }, payload) {
      const { orders } = await (await fetch(`${API_BASE_URL}/users/${payload.userId}/orders`)).json()
      commit('setOrders', orders)
    },
    async getOrderTickets({ commit }, payload) {
      const { tickets } = await (await fetch(`${API_BASE_URL}/orders/${payload.orderId}/tickets`)).json()
      commit('setTickets', tickets)
    },
    async getMe({ commit }, token) {
      const me = await (
        await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ).json()
      commit('setMe', me)
    },
    async postRegister({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async postLogin({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async postFavourite({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/favourites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async postCart({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async postCheckout({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async postOrder({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async postOrderItems({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/orders/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async postIssueTickets({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/orders/${payload.orderId}/tickets/issue`, {
        method: 'POST'
      })
      return response.json()
    },
    async postCategory({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async postEvent({ commit } , payload) {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async patchCartQuantity({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/cart/${payload.cartId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.body)
      })
      return response.json()
    },
    async patchOrderStatus({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/orders/${payload.orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.body)
      })
      return response.json()
    },
    async patchCategory({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/categories/${payload.categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.body)
      })
      return response.json()
    },
    async patchEvent({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/events/${payload.eventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload.body)
      })
      return response.json()
    },
    async deleteCartItem({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/cart/${payload.cartId}`, {
        method: 'DELETE'
      })
      return response.json()
    },
    async deleteUserCart({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/cart/user/${payload.userId}`, {
        method: 'DELETE'
      })
      return response.json()
    },
    async deleteFavourite({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/favourites`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      return response.json()
    },
    async deleteCategory({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/categories/${payload.categoryId}`, {
        method: 'DELETE'
      })
      return response.json()
    },
    async deleteEvent({ commit }, payload) {
      const response = await fetch(`${API_BASE_URL}/events/${payload.eventId}`, {
        method: 'DELETE'
      })
      return response.json()
    },
     async login({ commit }, credentials) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        })
        const data = await response.json()
        if (data.token) {
          commit('setToken', data.token)
          commit('setMe', data.user)
        }
        return data
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },
    
    async register({ commit }, userData) {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        })
        const data = await response.json()
        if (data.token) {
          commit('setToken', data.token)
          commit('setMe', data.user)
        }
        return data
      } catch (error) {
        console.error('Register error:', error)
        throw error
      }
    },
    
    logout({ commit }) {
      commit('clearAuth')
    },
    
    async fetchMe({ commit, state }) {
      if (!state.token) return
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        const data = await response.json()
        commit('setMe', data)
        return data
      } catch (error) {
        console.error('Fetch me error:', error)
        commit('clearAuth')
        throw error
      }
    },
    
    // Favourites actions
    async fetchFavourites({ commit, state }) {
      if (!state.me?.id) return
      try {
        const response = await fetch(`${API_BASE_URL}/favourites/${state.me.id}`, {
          headers: { Authorization: `Bearer ${state.token}` }
        })
        const { favourites } = await response.json()
        commit('setFavourites', favourites)
      } catch (error) {
        console.error('Fetch favourites error:', error)
      }
    },
    
    async addFavourite({ commit, state }, event) {
      if (!state.me?.id) throw new Error('User not authenticated')
      try {
        const response = await fetch(`${API_BASE_URL}/favourites`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.token}`
          },
          body: JSON.stringify({ userId: state.me.id, eventId: event.id })
        })
        const data = await response.json()
        if (data.success) {
          commit('addToFavourites', event)
        }
        return data
      } catch (error) {
        console.error('Add favourite error:', error)
        throw error
      }
    },
    
    async removeFavourite({ commit, state }, eventId) {
      if (!state.me?.id) throw new Error('User not authenticated')
      try {
        const response = await fetch(`${API_BASE_URL}/favourites`, {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${state.token}`
          },
          body: JSON.stringify({ userId: state.me.id, eventId })
        })
        const data = await response.json()
        if (data.success) {
          commit('removeFromFavourites', eventId)
        }
        return data
      } catch (error) {
        console.error('Remove favourite error:', error)
        throw error
      }
    }
  },
  modules: {}
})