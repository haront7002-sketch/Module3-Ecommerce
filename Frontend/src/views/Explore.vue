<template>
  <div class="explore-container">
    <!-- Top bar with search and filter -->
    <div class="explore-header">
      <div class="brand">
        <div class="logo">SOS</div>
        <div>
          <h1>Explore Events</h1>
          <p class="subtitle">Discover what's happening in Cape Town</p>
        </div>
      </div>

      <div class="stats">
        <span class="stat-item">
          <i class="uil uil-calendar-alt"></i> {{ eventsThisMonth }} this month
        </span>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-section">
      <div class="search-wrapper">
        <i class="uil uil-search search-icon"></i>
        <input 
          v-model="searchQuery"
          type="text" 
          class="search-input" 
          placeholder="Search events by title, location, or category..."
        >
      </div>
      <button class="filter-btn" @click="showFilters = !showFilters">
        <i class="uil uil-filter"></i> Filter
      </button>
    </div>

    <!-- Filter panel -->
    <transition name="slide">
      <div v-if="showFilters" class="filter-panel">
        <div class="filter-group">
          <h4>Interest Categories</h4>
          <div class="filter-options">
            <button 
              v-for="category in interestCategories" 
              :key="category.id"
              class="filter-chip"
              :class="{ active: selectedCategories.includes(category.name) }"
              @click="toggleCategory(category.name)"
            >
              <span class="chip-emoji">{{ category.emoji }}</span>
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main content -->
    <div class="explore-main">
      <!-- Calendar Sidebar -->
      <div class="calendar-panel glass-card">
        <div class="calendar-header">
          <button @click="previousMonth" class="month-nav">
            <i class="uil uil-angle-left"></i>
          </button>
          <h3>{{ currentMonthName }} {{ currentYear }}</h3>
          <button @click="nextMonth" class="month-nav">
            <i class="uil uil-angle-right"></i>
          </button>
        </div>

        <!-- Calendar Grid -->
        <div class="calendar-grid">
          <div class="weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
          <div 
            v-for="(day, index) in calendarDays" 
            :key="index"
            class="calendar-day"
            :class="{
              'other-month': !day.isCurrentMonth,
              'today': isToday(day.date),
              'has-events': hasEventsOnDate(day.date),
              'selected': selectedDate === day.date
            }"
            @click="selectDate(day.date)"
          >
            <span class="day-number">{{ day.day }}</span>
            <div v-if="hasEventsOnDate(day.date)" class="event-indicator"></div>
          </div>
        </div>
      </div>

      <!-- Events List -->
      <div class="events-panel glass-card">
        <div class="events-header">
          <h2>{{ selectedDate ? formatDateHeader(selectedDate) : 'Select a date' }}</h2>
          <span class="event-count">{{ filteredEvents.length }} events</span>
        </div>

        <div v-if="loading" class="loading-state">
          <div class="loader"></div>
          <p>Loading events...</p>
        </div>

        <div v-else-if="filteredEvents.length === 0" class="empty-state">
          <i class="uil uil-calendar-slash"></i>
          <h3>No events found</h3>
          <p>Try selecting a different date or adjusting your filters</p>
        </div>

        <div v-else class="events-list">
          <div 
            v-for="event in filteredEvents" 
            :key="event.id"
            class="event-card glass-card"
            @click="viewEventDetails(event)"
          >
            <div class="event-time">
              <span class="time">{{ formatTime(event.time) }}</span>
            </div>
            <div class="event-content">
              <div class="event-header">
                <span class="event-emoji">{{ event.emoji }}</span>
                <h3 class="event-title">{{ event.title }}</h3>
              </div>
              <p class="event-description">{{ event.description }}</p>
              <div class="event-meta">
                <span class="meta-item">
                  <i class="uil uil-location-point"></i> {{ event.area }}
                </span>
                <span class="meta-item">
                  <i class="uil uil-tag"></i> {{ event.category }}
                </span>
                <span class="meta-item price">
                  <i class="uil uil-dollar-alt"></i> R {{ event.price }}
                </span>
              </div>
              <div class="event-actions">
                <button class="action-btn like" @click.stop="likeEvent(event)">
                  <i class="uil uil-heart"></i>
                </button>
                <button class="action-btn book" @click.stop="bookEvent(event)">
                  Book Now
                </button>
              </div>
            </div>
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
            <span class="modal-emoji">{{ selectedEvent.emoji }}</span>
            <h2>{{ selectedEvent.title }}</h2>
          </div>

          <div class="modal-body">
            <div class="modal-info">
              <div class="info-row">
                <i class="uil uil-calendar-alt"></i>
                <span>{{ formatDate(selectedEvent.date) }} at {{ formatTime(selectedEvent.time) }}</span>
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

            <p class="modal-description">{{ selectedEvent.description }}</p>

            <div class="modal-actions">
              <button class="modal-btn like" @click="likeEvent(selectedEvent)">
                <i class="uil uil-heart"></i> Add to Favourites
              </button>
              <button class="modal-btn book" @click="bookEvent(selectedEvent)">
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

// State
const searchQuery = ref('')
const showFilters = ref(false)
const selectedDate = ref(null)
const selectedEvent = ref(null)
const loading = ref(false)

// Date state
const currentDate = ref(new Date())
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Selected categories for filtering
const selectedCategories = ref([])

// Interest categories from preferences
const interestCategories = [
  { id: 1, name: 'Social Vibes', emoji: '🎉' },
  { id: 2, name: 'Intellectual & Skills', emoji: '🧠' },
  { id: 3, name: 'Arts & Culture', emoji: '🎨' },
  { id: 4, name: 'Wellness & Body', emoji: '🧘' },
  { id: 5, name: 'Creative Making', emoji: '✂️' },
  { id: 6, name: 'Community & Cause', emoji: '🤝' },
  { id: 7, name: 'Professional Networking', emoji: '💼' },
  { id: 8, name: 'Life Stages & Niches', emoji: '🌱' },
  { id: 9, name: 'Seasonal Annual', emoji: '🎪' },
  { id: 10, name: 'Weird & Hyperlocal', emoji: '🌀' },
  { id: 11, name: 'Food & Drink', emoji: '🍽️' },
  { id: 12, name: 'Music & Nightlife', emoji: '🎵' },
  { id: 13, name: 'Sports & Adventure', emoji: '⚽' },
  { id: 14, name: 'Family & Kids', emoji: '👨‍👩‍👧' },
  { id: 15, name: 'Spirituality & Mindfulness', emoji: '🕊️' }
]

// Computed properties from Vuex
const events = computed(() => store.state.events)
const favourites = computed(() => store.state.favourites)

const filteredEvents = computed(() => {
  let filtered = events.value
  
  // Filter by selected date
  if (selectedDate.value) {
    filtered = filtered.filter(event => event.date === selectedDate.value)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(event => 
      event.title.toLowerCase().includes(query) ||
      event.area?.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query) ||
      event.category?.toLowerCase().includes(query)
    )
  }

   return filtered.sort((a, b) => a.time?.localeCompare(b.time || ''))
})

const eventsThisMonth = computed(() => {
  const currentMonth = currentDate.value.getMonth()
  const currentYear = currentDate.value.getFullYear()
  return events.value.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
  }).length
})
// Computed
const currentYear = computed(() => currentDate.value.getFullYear())
const currentMonthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentDate.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  
  const days = []
  
  // Previous month days
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek; i > 0; i--) {
    const date = new Date(year, month, 1 - i)
    days.push({
      day: date.getDate(),
      date: formatDateForComparison(date),
      isCurrentMonth: false
    })
  }
  
  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i)
    days.push({
      day: i,
      date: formatDateForComparison(date),
      isCurrentMonth: true
    })
  }
  
  // Next month days (to fill 6 rows)
  const remainingDays = 42 - days.length
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i)
    days.push({
      day: date.getDate(),
      date: formatDateForComparison(date),
      isCurrentMonth: false
    })
  }
  
  return days
})

// Methods
const formatDateForComparison = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const isToday = (dateString) => {
  const today = formatDateForComparison(new Date())
  return dateString === today
}

const hasEventsOnDate = (dateString) => {
  return events.value.some(event => event.date === dateString)
}

const selectDate = (date) => {
  selectedDate.value = date
  loading.value = true
  // Simulate loading
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() - 1))
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.setMonth(currentDate.value.getMonth() + 1))
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatDateHeader = (dateString) => {
  const options = { weekday: 'long', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (timeString) => {
  return timeString
}

const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category)
  if (index === -1) {
    selectedCategories.value.push(category)
  } else {
    selectedCategories.value.splice(index, 1)
  }
}

const viewEventDetails = (event) => {
  selectedEvent.value = event
}

const likeEvent = async (event) => {
   try {
    await store.dispatch('addFavourite', event)
    showNotification('Added to favourites!')
  } catch (error) {
    if (error.message === 'User not authenticated') {
      showNotification('Please log in to add favourites', 'error')
    } else {
      showNotification('Error adding to favourites', 'error')
    }
  }
}
  // Get existing favourites
  // const favourites = JSON.parse(localStorage.getItem('favourites') || '[]')
  
  // // Check if already in favourites
  // if (!favourites.some(fav => fav.id === event.id)) {
  //   favourites.push(event)
  //   localStorage.setItem('favourites', JSON.stringify(favourites))

  const bookEvent = (event) => {
  router.push({
    name: 'payments',
    query: {
      eventId: event.id,
      title: event.title,
      date: formatDate(event.date) + ' • ' + event.time,
      price: event.price
    }
  })
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

  // Load events from API
const loadEvents = async () => {
  loading.value = true
  try {
    await store.dispatch('getEvents')
  } catch (error) {
    console.error('Error loading events:', error)
  } finally {
    loading.value = false
  }
}

// Load user favourites if authenticated
const loadFavourites = async () => {
  if (store.state.isAuthenticated) {
    try {
         await store.dispatch('fetchFavourites')
    } catch (error) {
      console.error('Error loading favourites:', error)
    }
  }
}

// Load user preferences
onMounted(() => {
  selectedDate.value = formatDateForComparison(new Date())
  loadEvents()
  loadFavourites()
})
</script>

<style scoped>
.explore-container {
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
.explore-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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

/* Search Section */
.search-section {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  padding: 0 10px;
}

.search-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.8);
  font-size: 18px;
}

.search-input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  font-size: 14px;
  color: white;
}

.search-input::placeholder {
  color: rgba(255,255,255,0.7);
}

.search-input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.25);
}

.filter-btn {
  padding: 15px 25px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Filter Panel */
.filter-panel {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 20px;
  margin: 0 10px 20px;
}

.filter-group h4 {
  color: white;
  margin-bottom: 15px;
  font-size: 14px;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  padding: 8px 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.filter-chip:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.filter-chip.active {
  background: linear-gradient(135deg, #EEAECA, #AEE994);
  color: #2d3436;
  border-color: transparent;
}

/* Main Layout */
.explore-main {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
  padding: 0 10px;
}

@media (max-width: 980px) {
  .explore-main {
    grid-template-columns: 1fr;
  }
}

/* Calendar Panel */
.calendar-panel {
  padding: 20px;
  height: fit-content;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.calendar-header h3 {
  color: white;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.month-nav {
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

.month-nav:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.weekday {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  padding: 8px 0;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-size: 13px;
  font-weight: 500;
  color: white;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.calendar-day.other-month {
  color: rgba(255,255,255,0.4);
}

.calendar-day.today {
  background: #EEAECA;
  color: #2d3436;
  font-weight: 600;
}

.calendar-day.selected {
  background: #4caf50;
  color: white;
  transform: scale(1.1);
}

.event-indicator {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #AEE994;
  margin-top: 2px;
}

/* Events Panel */
.events-panel {
  padding: 20px;
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.events-header h2 {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.event-count {
  padding: 6px 15px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 13px;
  font-weight: 500;
}

/* Events List */
.events-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 10px;
}

.events-list::-webkit-scrollbar {
  width: 8px;
}

.events-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.events-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.events-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.event-card {
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.25);
}

.event-time {
  margin-bottom: 10px;
}

.time {
  font-weight: 600;
  color: #AEE994;
  font-size: 14px;
  background: rgba(174, 233, 148, 0.2);
  padding: 4px 12px;
  border-radius: 20px;
}

.event-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.event-emoji {
  font-size: 24px;
}

.event-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.event-description {
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  margin-bottom: 15px;
  line-height: 1.4;
}

.event-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item.price {
  font-weight: 600;
  color: #AEE994;
}

.event-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn.like {
  background: rgba(255, 255, 255, 0.2);
  color: #ff8787;
  border: 1px solid rgba(255, 107, 107, 0.3);
}

.action-btn.like:hover {
  background: #ff6b6b;
  color: white;
  transform: translateY(-2px);
}

.action-btn.book {
  background: #4caf50;
  color: white;
  flex: 1;
  justify-content: center;
}

.action-btn.book:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.loader {
  width: 40px;
  height: 40px;
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
  padding: 60px 20px;
  color: white;
}

.empty-state i {
  font-size: 60px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 20px;
}

.empty-state h3 {
  color: white;
  margin-bottom: 10px;
}

.empty-state p {
  color: rgba(255,255,255,0.8);
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
  font-size: 60px;
  margin-bottom: 15px;
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

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

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
</style>