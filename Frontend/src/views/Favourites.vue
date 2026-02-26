<template>
  <div class="favourites-container">
    <!-- Header -->
    <div class="favourites-header">
      <div class="brand">
        <div>
          <h1>My Favourites</h1>
          <p class="subtitle">Events you've liked and want to remember</p>
        </div>
      </div>
      <div class="stats">
        <span class="stat-item">
          <i class="uil uil-heart" style="color: #ff8787;"></i> {{ favourites.length }} favourites
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="favourites-content">
      <div v-if="loading" class="loading-state">
        <div class="loader"></div>
        <p>Loading your favourites...</p>
      </div>

      <div v-else-if="favourites.length === 0" class="empty-state glass-card">
        <i class="uil uil-heart-broken"></i>
        <h2>No favourites yet</h2>
        <p>When you like events while swiping or exploring, they'll appear here</p>
        <div class="empty-actions">
          <router-link to="/" class="btn btn-primary">
            <i class="uil uil-estate"></i> Start Swiping
          </router-link>
          <router-link to="/explore" class="btn btn-secondary">
            <i class="uil uil-calendar-alt"></i> Explore Events
          </router-link>
        </div>
      </div>

      <div v-else class="favourites-grid">
        <div 
          v-for="event in favourites" 
          :key="event.id"
          class="favourite-card glass-card"
          @click="viewEventDetails(event)"
        >
          <div class="card-header">
            <img class="event-emoji" :src="event.image_url || 'https://placehold.co/72x72?text=Event'" alt="Event image" />
            <button class="remove-btn" @click.stop="removeFromFavourites(event.id)">
              <i class="uil uil-times"></i>
            </button>
          </div>
          
          <div class="card-body">
            <h3 class="event-title">{{ event.title }}</h3>
            <p class="event-description">{{ event.description }}</p>
            
            <div class="event-meta">
              <span class="meta-item">
                <i class="uil uil-calendar-alt"></i> {{ formatDate(event.date) }}
              </span>
              <span class="meta-item">
                <i class="uil uil-clock"></i> {{ formatTime(event) }}
              </span>
              <span class="meta-item">
                <i class="uil uil-location-point"></i> {{ event.area }}
              </span>
              <span class="meta-item price">
                <i class="uil uil-tag"></i> R {{ event.price }}
              </span>
            </div>
          </div>
          
          <div class="card-footer">
            <button class="btn-book" :disabled="isFreeEvent(event)" @click.stop="bookEvent(event)">
              <i class="uil uil-shopping-cart"></i> {{ isFreeEvent(event) ? 'Free' : 'Book Now' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Event Details Modal -->
    <transition name="fade">
      <div v-if="selectedEvent" class="modal-overlay" @click="selectedEvent = null">
        <div class="modal-content glass-card" @click.stop>
          <button class="modal-close" @click="selectedEvent = null">
            <i class="uil uil-times"></i>
          </button>
          
          <div class="modal-header">
            <img class="modal-emoji" :src="selectedEvent.image_url || 'https://placehold.co/120x120?text=Event'" alt="Event image" />
            <h2>{{ selectedEvent.title }}</h2>
          </div>

          <div class="modal-body">
            <p class="modal-description">{{ selectedEvent.description }}</p>

            <div class="modal-info">
              <div class="info-row">
                <i class="uil uil-calendar-alt"></i>
                <span>{{ formatDate(selectedEvent.date) }} at {{ formatTime(selectedEvent) }}</span>
              </div>
              <div class="info-row">
                <i class="uil uil-location-point"></i>
                <span>{{ selectedEvent.location }}, {{ selectedEvent.area }}</span>
              </div>
              <div class="info-row">
                <i class="uil uil-tag"></i>
                <span>{{ selectedEvent.category }}</span>
              </div>
              <div class="info-row">
                <i class="uil uil-dollar-alt"></i>
                <span>R {{ selectedEvent.price }} per ticket</span>
              </div>
            </div>

            <div class="modal-actions">
              <button class="modal-btn remove" @click="removeFromFavourites(selectedEvent.id)">
                <i class="uil uil-heart-broken"></i> Remove
              </button>
              <button class="modal-btn book" :disabled="isFreeEvent(selectedEvent)" @click="bookEvent(selectedEvent)">
                <i class="uil uil-shopping-cart"></i> {{ isFreeEvent(selectedEvent) ? 'Free' : 'Book Now' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const selectedEvent = ref(null)
const loading = ref(true)
const categoryNameById = computed(() => {
  const categories = store.state.categories || []
  return categories.reduce((acc, category) => {
    const id = String(category.id ?? category.category_id)
    const name = category.name ?? category.category_name
    if (id && name) acc[id] = name
    return acc
  }, {})
})

// Computed
const favourites = computed(() =>
  (store.state.favourites || []).map((event) => ({
    ...event,
    id: event.id ?? event.event_id,
    title: event.title ?? event.event_title ?? 'Untitled Event',
    area: event.area ?? event.location ?? 'Unknown',
    time: event.time ?? '',
    date: event.date ?? null,
    category:
      categoryNameById.value[String(event.category_id ?? event.categoryId)] ??
      event.category ??
      event.category_name ??
      'General',
    image_url: event.image_url ?? event.image ?? ''
  }))
)

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (event) => {
  if (!event) return ''

  const candidate = event.startDate || event.start_date || (event.date && event.time ? `${event.date}T${event.time}` : event.time)
  if (!candidate) return ''

  if (typeof candidate === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(candidate)) {
    const [h, m] = candidate.split(':')
    const d = new Date()
    d.setHours(Number(h), Number(m), 0, 0)
    return d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const parsed = new Date(candidate)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

// Remove from favourites
const removeFromFavourites = async (eventId) => {
  try {
    await store.dispatch('removeFavourite', eventId)
    if (selectedEvent.value && selectedEvent.value.id === eventId) {
      selectedEvent.value = null
    }
    showNotification('Removed from favourites')
  } catch (error) {
    showNotification('Error removing from favourites', 'error')
  }
}

// View event details
const viewEventDetails = (event) => {
  selectedEvent.value = event
}
  
const isFreeEvent = (event) => Number(event?.price ?? 0) === 0

// Book event
const bookEvent = (event) => {
  if (isFreeEvent(event)) return
  router.push({
    name: 'payments',
    query: {
      eventId: event.id,
      title: event.title,
      date: formatDate(event.date) + ' • ' + formatTime(event),
      price: event.price
    }
  })
}

// Load favourites
const loadFavourites = async () => {
  loading.value = true
  try {
    await store.dispatch('fetchFavourites')
  } catch (error) {
    console.error('Error loading favourites:', error)
  } finally {
    loading.value = false
  }
}

// Show notification
const showNotification = (message, type = 'success') => {
  const notification = document.createElement('div')
  notification.className = 'notification'
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #4caf50, #45a049)' : 'linear-gradient(135deg, #ff6b6b, #ff5252)'};
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `
  document.body.appendChild(notification)
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease'
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 2000)
}

onMounted(() => {
  store.dispatch('getCategories')
  loadFavourites()
})
</script>

<style scoped>
.favourites-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  padding: 20px;
}

/* Glass Card Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Header */
.favourites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.brand {
  display: flex;
  gap: 15px;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 22px;
  color: #fff;
  background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

h1 {
  margin: 0;
  font-size: 26px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: rgba(255,255,255,0.9);
}

.stats {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

/* Content */
.favourites-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: white;
}

.loader {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #EEAECA;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 40px;
  max-width: 500px;
  margin: 40px auto;
}

.empty-state i {
  font-size: 80px;
  color: #ff8787;
  margin-bottom: 20px;
  animation: heartbeat 1.5s ease infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.empty-state h2 {
  color: white;
  margin-bottom: 10px;
  font-size: 24px;
}

.empty-state p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 30px;
}

.empty-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #4caf50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Favourites Grid */
.favourites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.favourite-card {
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.favourite-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.25);
}

.card-header {
  padding: 20px 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.event-emoji {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 14px;
}

.remove-btn {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #ff6b6b;
  border-color: #ff6b6b;
  transform: scale(1.1);
}

.card-body {
  padding: 10px 20px 20px;
}

.event-title {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.event-description {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  line-height: 1.5;
  margin-bottom: 15px;
}

.event-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-item i {
  color: #AEE994;
  width: 18px;
}

.meta-item.price {
  font-weight: 600;
  color: #AEE994;
}

.card-footer {
  padding: 15px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-book {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 30px;
  background: #4caf50;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-book:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
}

.btn-book:disabled {
  background: #9e9e9e;
  color: #f1f1f1;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.modal-header {
  padding: 30px 30px 20px;
  text-align: center;
  background: linear-gradient(135deg, rgba(238, 174, 202, 0.3), rgba(174, 233, 148, 0.3));
  border-radius: 20px 20px 0 0;
}

.modal-emoji {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 16px;
  margin: 0 auto 15px;
  display: block;
}

.modal-header h2 {
  color: white;
  margin: 0;
  font-size: 24px;
}

.modal-body {
  padding: 30px;
}

.modal-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 14px;
  color: white;
}

.info-row i {
  color: #AEE994;
  font-size: 18px;
  width: 20px;
}

.modal-description {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  line-height: 1.6;
  margin-bottom: 25px;
}

.modal-actions {
  display: flex;
  gap: 15px;
}

.modal-btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.modal-btn.remove {
  background: rgba(255, 255, 255, 0.2);
  color: #ff8787;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.modal-btn.remove:hover {
  background: #ff6b6b;
  color: white;
  transform: translateY(-2px);
}

.modal-btn.book {
  background: #4caf50;
  color: white;
}

.modal-btn.book:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(76, 175, 80, 0.3);
}

.modal-btn.book:disabled {
  background: #9e9e9e;
  color: #f1f1f1;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .favourites-grid {
    grid-template-columns: 1fr;
  }
  
  .favourites-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .empty-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
