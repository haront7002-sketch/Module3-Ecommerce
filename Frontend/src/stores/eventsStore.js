import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_BASE_URL = 'http://localhost:3000'

export default defineStoreStore({
  state: {
    events: []
  },
  mutations: {
    setEvents(state, payload) {
      state.events = payload
    }
  },
  actions: {
    async getEvents({ commit }) {
      const { events } = await (await fetch(`${API_BASE_URL}/events`)).json()
      commit('setEvents', events)
    },
    async getEventById(_, eventId) {
      const { event } = await (await fetch(`${API_BASE_URL}/events/${eventId}`)).json()
      return event
    },
    async getEventsByCategory({ commit }, categoryId) {
      const { events } = await (await fetch(`${API_BASE_URL}/categories/${categoryId}/events`)).json()
      commit('setEvents', events)
    }
  },
  modules: {
  }
});
