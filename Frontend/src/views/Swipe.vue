<template>
  <div class="swipe-container">
    <div class="swipe-header">
      <div class="brand-left">
        <div class="title-group">
          <h1>Discover Events</h1>
          <p class="subtitle">Swipe right to like, left to pass</p>
        </div>
      </div>
      
      <!-- heart count -->
      <div class="stats-right">
        <span class="stat-item">
          <i class="uil uil-heart" style="color: #ff6b6b;"></i> {{ favouritesStore.favouritesCount }}
        </span>
      </div>
    </div>
    
    <div v-if="eventStore.loading" class="loading-state">
      <div class="loader"></div>
      <p>Loading events...</p>
    </div>
    
    <div v-else class="card-container">
      <Card
        v-for="(event, index) in visibleEvents"
        :key="event.id"
        :eventData="event"
        :index="currentEventIndex + index"
        :currentIndex="currentEventIndex"
        :isTopCard="index === 0"
        @swipe-complete="handleSwipeComplete"
        @drag-start="handleDragStart"
        @drag-end="handleDragEnd"
        ref="cards"
      />
    </div>

    <div class="no-cards" :class="{ active: noEventsLeft }">
      <i class="uil uil-frown"></i>
      <h2>No more events!</h2>
      <p>Check back later for new events or explore the map</p>
      <div class="empty-actions">
        <router-link to="/explore" class="btn btn-primary">
          <i class="uil uil-calendar-alt"></i> Explore Events
        </router-link>
        <router-link to="/map" class="btn btn-secondary">
          <i class="uil uil-map-marker"></i> View Map
        </router-link>
        <button @click="loadMoreEvents" class="btn btn-secondary" v-if="hasMoreEvents">
          <i class="uil uil-redo"></i> Load More
        </button>
      </div>
    </div>

    <div class="action-buttons" v-if="!noEventsLeft && !eventStore.loading">
      <button class="action-btn nope">
        <i class="uil uil-times"></i>
      </button>
      <button class="action-btn like">
        <i class="uil uil-heart"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import Card from '@/components/card.vue'

const store = useStore()
const loading = ref(false)
const categoryNameById = computed(() => {
  const categories = store.state.categories || []
  return categories.reduce((acc, category) => {
    const id = String(category.id ?? category.category_id)
    const name = category.name ?? category.category_name
    if (id && name) acc[id] = name
    return acc
  }, {})
})

const events = computed(() =>
  (store.state.events || []).map((event) => {
    const area = event.area ?? event.location?.area ?? event.location ?? 'Unknown'
    const startDate = event.startDate ?? event.start_date ?? (event.date && event.time ? `${event.date}T${event.time}` : event.date ?? null)
    const categoryId = event.category_id ?? event.categoryId
    const resolvedCategory = categoryNameById.value[String(categoryId)] || event.category_name || event.category || 'General'

    return {
      ...event,
      id: event.id ?? event.event_id,
      title: event.title ?? event.event_title ?? 'Untitled Event',
      description: event.description ?? '',
      area,
      location: typeof event.location === 'object' ? event.location : { area },
      category: resolvedCategory,
      price: Number(event.price ?? 0),
      image_url: event.image_url ?? event.image ?? '',
      emoji: event.emoji ?? '🎉',
      startDate
    }
  })
)
const favourites = computed(() => store.state.favourites || [])
const favouriteIds = computed(() => favourites.value.map((f) => String(f.id ?? f.event_id)))
const user = computed(() => store.state.me || JSON.parse(localStorage.getItem('user') || 'null'))

// Keep template usage stable while sourcing data/actions from Vuex index store.
const eventStore = {
  get loading() {
    return loading.value
  },
  get events() {
    return events.value
  },
  async fetchEvents() {
    loading.value = true
    try {
      await store.dispatch('getEvents')
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      loading.value = false
    }
  }
}

const favouritesStore = {
  get favouritesCount() {
    return favourites.value.length
  },
  async addToFavourites(event) {
    return store.dispatch('addFavourite', event)
  },
  async fetchFavourites() {
    return store.dispatch('fetchFavourites')
  }
}

const isFavourite = (eventId) => favouriteIds.value.includes(String(eventId))

// State
const currentEventIndex = ref(0)
const isDragging = ref(false)
const cards = ref([])
const page = ref(1)
const hasMoreEvents = ref(true)

// Computed
const visibleEvents = computed(() => {
  // Show current event and next 2 events for stack effect
  return eventStore.events.slice(currentEventIndex.value, currentEventIndex.value + 3)
})

const noEventsLeft = computed(() => {
  return currentEventIndex.value >= eventStore.events.length
})

const remainingCount = computed(() => {
  return eventStore.events.length - currentEventIndex.value
})

// Methods
const handleSwipeComplete = async (direction, event) => {
  console.log(`Event swiped ${direction}:`, event?.title || event?.event_title || 'Untitled Event')
  
  // Handle like/nope actions
  if (direction === 'right') {
    if (!isFavourite(event.id)) {
      await favouritesStore.addToFavourites(event)
      await favouritesStore.fetchFavourites()
      showNotification('Added to favourites!')
    }
  }
  
  // Increment index to show next event
  currentEventIndex.value++
  
  // Check if we need to load more events
  if (currentEventIndex.value >= eventStore.events.length - 2 && hasMoreEvents.value) {
    await loadMoreEvents()
  }
}

const loadMoreEvents = async () => {
  const previousCount = eventStore.events.length
  page.value++
  await eventStore.fetchEvents()
  hasMoreEvents.value = eventStore.events.length > previousCount
}

const handleDragStart = () => {
  isDragging.value = true
}

const handleDragEnd = () => {
  isDragging.value = false
}

const swipeCard = (direction) => {
  if (noEventsLeft.value || isDragging.value) return
  
  const topCard = cards.value?.[0]
  if (topCard) {
    topCard.programmaticSwipe(direction)
  }
}

const showNotification = (message) => {
  const notification = document.createElement('div')
  notification.className = 'notification'
  notification.textContent = message
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4caf50, #45a049);
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
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

const resetEvents = () => {
  currentEventIndex.value = 0
  page.value = 1
  hasMoreEvents.value = true
  eventStore.fetchEvents()
}

// Lifecycle
onMounted(async () => {
  await store.dispatch('getCategories')
  await eventStore.fetchEvents()
  await favouritesStore.fetchFavourites()
})

// Watch for auth changes
watch(user, () => {
  resetEvents()
})
</script>

<style scoped>
.swipe-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
}

/* Updated Header - pushed to edges */
.swipe-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 0;
}

.brand-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 20px;
  background: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  flex-shrink: 0;
}

.logo span {
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.title-group {
  display: flex;
  flex-direction: column;
}

h1 {
  margin: 0;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  line-height: 1.2;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: rgba(255,255,255,0.9);
}

/* Stats - only heart count remains */
.stats-right {
  display: flex;
  padding: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 12px;
  border-radius: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-item i {
  font-size: 16px;
}

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

.card-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 550px;
  margin: 10px auto 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 20px;
  position: relative;
  z-index: 10;
}

.action-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: white; /* White background */
}

.action-btn.nope i {
  color: #ff6b6b; /* Red color for X */
  font-size: 36px;
  font-weight: bold;
}

.action-btn.like i {
  color: #4caf50; /* Green color for heart */
  font-size: 36px;
  font-weight: bold;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: scale(1.1) translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.3);
}

.action-btn:active {
  transform: scale(0.95);
}

.no-cards {
  text-align: center;
  color: white;
  display: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 40px;
  max-width: 400px;
  margin: 40px auto;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.no-cards.active {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
  width: min(400px, calc(100% - 40px));
  z-index: 20;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.no-cards i {
  font-size: 60px;
  margin-bottom: 20px;
  color: rgba(255,255,255,0.9);
}

.no-cards h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: white;
}

.no-cards p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 25px;
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

@media (max-width: 600px) {
  .swipe-container {
    padding: 15px;
  }
  
  .swipe-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .brand-left {
    width: 100%;
  }
  
  .stats-right {
    width: 100%;
    justify-content: flex-start;
    margin-left: 60px; /* Align with text under logo */
  }
  
  .card-container {
    height: 500px;
    margin-top: 0;
  }
  
  .action-btn {
    width: 60px;
    height: 60px;
  }
  
  .action-btn.nope i,
  .action-btn.like i {
    font-size: 30px;
  }
  
  .empty-actions {
    flex-direction: column;
  }
}
</style>