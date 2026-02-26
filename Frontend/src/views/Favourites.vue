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

      <div v-else-if="favourites.length === 0" class="no-cards active">
        <i class="uil uil-frown"></i>
        <h2>No favourites yet!</h2>
        <p>Like events while swiping or exploring to see them here</p>
        <div class="empty-actions">
          <router-link to="/explore" class="btn btn-primary">
            Explore Events
          </router-link>
          <router-link to="/map" class="btn btn-secondary">
            View Map
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
            
            <div class="event-meta">
              <span class="meta-item">
                <i class="uil uil-calendar-alt"></i> {{ formatDate(event.date) }}
              </span>
              <span class="meta-item">
                <i class="uil uil-puzzle-piece"></i> {{ event.category }}
              </span>
            </div>
            <p class="view-more-hint">Tap card to view full details</p>
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
            <img class="modal-image" :src="selectedEvent.image_url || 'https://placehold.co/280x160?text=Event'" alt="Event image" />
          </div>

          <div class="modal-body">
            <h2 class="modal-title">{{ selectedEvent.title }}</h2>
            <p class="modal-description">{{ selectedEvent.description }}</p>

            <div class="modal-info">
              <div class="info-row">
                <i class="uil uil-calendar-alt"></i>
                <span>{{ formatDate(selectedEvent.startDate || selectedEvent.date) }} at {{ formatEventTime(selectedEvent) }}</span>
              </div>
              <div class="info-row">
                <i class="uil uil-location-point"></i>
                <span>{{ formatEventLocation(selectedEvent) }}</span>
              </div>
              <div class="info-row">
                <i class="uil uil-puzzle-piece"></i>
                <span>{{ selectedEvent.category }}</span>
              </div>
              <div class="info-row">
                <i class="uil uil-tag"></i>
                <span>R {{ selectedEvent.price }} per ticket</span>
              </div>
              <div class="info-row">
                <i class="uil uil-users-alt"></i>
                <span>{{ selectedEvent.availableSpots }} spots left</span>
              </div>
            </div>

            <div class="modal-actions">
              <button class="modal-btn like" @click="removeFromFavourites(selectedEvent.id)">
                <i class="uil uil-heart-break"></i> Remove from Favourites
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

  const rawTime = event.time
  if (typeof rawTime === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(rawTime)) {
    const [h, m] = rawTime.split(':')
    const d = new Date()
    d.setHours(Number(h), Number(m), 0, 0)
    return d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const startCandidate = event.startDate || event.start_date
  if (startCandidate) {
    const parsed = new Date(startCandidate)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  if (event.date && event.time) {
    const datePart = String(event.date).split('T')[0]
    const combined = `${datePart}T${event.time}`
    const parsed = new Date(combined)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }
  }

  const candidate = rawTime || event.date
  if (!candidate) return ''
  const parsed = new Date(candidate)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const formatEventTime = (event) => {
  if (!event) return ''
  const candidate = event.startDate || event.start_date || (event.date && event.time ? `${event.date}T${event.time}` : event.time)
  return formatTime({ ...event, time: candidate })
}

const getEventArea = (event) => {
  const location = event?.location
  if (location && typeof location === 'object') {
    if (typeof location.area === 'string' && location.area.trim()) return location.area
    if (typeof location.address === 'string' && location.address.trim()) return location.address
  }
  if (typeof event?.area === 'string' && event.area.trim()) return event.area
  if (typeof location === 'string' && location.trim()) return location
  return 'Unknown'
}

const formatEventLocation = (event) => {
  const location = event?.location
  if (location && typeof location === 'object') {
    const parts = [location.address, location.area]
      .map((part) => (typeof part === 'string' ? part.trim() : ''))
      .filter(Boolean)
    if (parts.length > 0) return parts.join(', ')
  }

  const area = getEventArea(event)
  return area || 'Unknown'
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

/* Empty State (same style as Swipe "No more events") */
.no-cards {
  text-align: center;
  color: white;
  display: block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 40px;
  max-width: 400px;
  margin: 40px auto;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: fadeIn 0.5s ease;
}

.no-cards i {
  font-size: 60px;
  margin-bottom: 20px;
  color: rgba(255,255,255,0.9);
}

.no-cards h2 {
  color: white;
  font-size: 28px;
  margin-bottom: 10px;
}

.no-cards p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 25px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.empty-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
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
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.35);
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

.view-more-hint {
  margin: 12px 0 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
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
  padding: 0;
  background: transparent;
  border-radius: 20px 20px 0 0;
}

.modal-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 20px 20px 0 0;
  display: block;
}

.modal-title {
  color: white;
  margin: 0 0 12px;
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

.modal-btn.like {
  background: rgba(255, 255, 255, 0.2);
  color: #ff8787;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.modal-btn.like:hover {
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
