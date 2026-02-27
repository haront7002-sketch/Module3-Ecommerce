<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- Header with profile info -->
      <div class="profile-header">
        <div class="profile-info">
          <div v-if="!isEditing" class="display-mode">
            <h1>{{ displayName }}</h1>
            <p class="username">{{ user.email }}</p>
          </div>
          
          <div v-else class="edit-mode">
            <input type="text" v-model="editForm.name" class="edit-input" placeholder="Your Name">
            <input type="text" v-model="editForm.username" class="edit-input" placeholder="Username">
          </div>
        </div>

        <!-- Ticket Indicator -->
        <div v-if="userTickets.length > 0" class="ticket-indicator" @click="activeTab = 'tickets'">
          <i class="uil uil-ticket"></i>
          <span class="indicator-count">{{ userTickets.length }}</span>
          <span class="indicator-text">Tickets in Profile</span>
        </div>
      </div>

      <!-- Edit/Save Button -->
      <div class="action-buttons">
        <button v-if="!isEditing" class="edit-profile-btn-main" @click="startEditing">
          <i class="uil uil-edit"></i> Edit Profile
        </button>
        <button v-else class="save-profile-btn" @click="saveProfile">
          <i class="uil uil-check-circle"></i> Save Changes
        </button>
        <button v-if="isEditing" class="cancel-edit-btn" @click="cancelEditing">
          <i class="uil uil-times-circle"></i> Cancel
        </button>
      </div>

      <!-- Profile Tabs -->
      <div class="profile-tabs">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'about' }" 
          @click="activeTab = 'about'"
        >
          <i class="uil uil-info-circle"></i> About
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'interests' }" 
          @click="activeTab = 'interests'"
        >
          <i class="uil uil-heart"></i> Interests
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'tickets' }" 
          @click="activeTab = 'tickets'"
        >
          <i class="uil uil-ticket"></i> My Tickets
          <span v-if="userTickets.length" class="tab-badge">{{ userTickets.length }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- About Tab -->
        <div v-if="activeTab === 'about'" class="about-tab">
          <div class="info-section">
            <h3><i class="uil uil-user"></i> Basic Info</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Age:</span>
                <span class="info-value">{{ displayAge }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Gender:</span>
                <span class="info-value">{{ user.gender || 'Not set' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Location:</span>
                <span v-if="!isEditing" class="info-value">{{ displayLocation }}</span>
                <select
                  v-else
                  v-model="editForm.areaCode"
                  class="info-edit-select"
                >
                  <option value="" disabled>Select Cape Town Area</option>
                  <option
                    v-for="area in capeTownAreas"
                    :key="`profile-area-${area.code}-${area.area}`"
                    :value="area.code"
                  >
                    {{ area.area }} ({{ area.code }})
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Interests Tab -->
        <div v-if="activeTab === 'interests'" class="interests-tab">
          <div class="interests-section">
            <h3><i class="uil uil-heart"></i> Your Interests</h3>
            <p class="section-subtitle">Select your interests (at least 3)</p>
            
            <div v-if="isEditing" class="interests-grid">
              <button 
                v-for="interest in availableInterests" 
                :key="interest.id"
                class="interest-btn"
                :class="{ selected: userInterests.includes(interest.name) }"
                @click="toggleInterest(interest.name)"
              >
                <span class="interest-emoji">{{ interest.emoji }}</span>
                <span class="interest-name">{{ interest.name }}</span>
              </button>
            </div>
            
            <div v-else class="interests-cloud">
              <span 
                v-for="(interest, index) in userInterests" 
                :key="index" 
                class="interest-tag"
              >
                {{ interest }}
              </span>
            </div>
          </div>

          <div class="interests-section">
            <h3><i class="uil uil-compass"></i> Travel Distance</h3>
            <p class="section-subtitle">How far are you willing to travel for matches?</p>
            
            <div class="distance-preference">
              <div class="distance-options">
                <button 
                  v-for="option in distanceOptions" 
                  :key="option.value"
                  class="distance-btn"
                  :class="{ selected: userDistance === option.value }"
                  @click="isEditing ? userDistance = option.value : null"
                  :disabled="!isEditing"
                >
                  <span class="distance-value">{{ option.value }}</span>
                  <span class="distance-label">{{ option.label }}</span>
                </button>
              </div>
              
              <div v-if="userDistance === 'custom'" class="custom-distance">
                <input 
                  type="range" 
                  v-model.number="customDistanceValue" 
                  min="1" 
                  max="500"
                  :disabled="!isEditing"
                  class="distance-slider"
                >
                <div class="distance-display">
                  <span>{{ customDistanceValue }} km</span>
                  <button 
                    v-if="isEditing" 
                    class="unit-toggle" 
                    @click="toggleDistanceUnit"
                  >
                    Switch to miles
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- My Tickets Tab -->
        <div v-if="activeTab === 'tickets'" class="tickets-tab">
          <div class="tickets-header">
            <h3><i class="uil uil-ticket"></i> My Tickets</h3>
            <span class="tickets-count">{{ userTickets.length }} {{ userTickets.length === 1 ? 'Ticket' : 'Tickets' }}</span>
          </div>

          <div v-if="userTickets.length === 0" class="no-tickets">
            <div class="no-tickets-icon">
              <i class="uil uil-ticket"></i>
            </div>
            <h4>No Tickets Yet</h4>
            <p>Browse events and purchase tickets to see them here</p>
            <router-link to="/map" class="browse-btn">
              <i class="uil uil-map-marker"></i> Browse Events
            </router-link>
          </div>

          <div v-else class="tickets-grid">
            <div v-for="ticket in userTickets" :key="ticket.id" class="ticket-card">
              <div class="ticket-card-header">
                <div class="ticket-type-badge">{{ ticket.status }}</div>
                <span class="ticket-card-ref">#{{ ticket.reference }}</span>
              </div>
              
              <div class="ticket-card-body">
                <h4>{{ ticket.title }}</h4>
                
                <div class="ticket-info-grid">
                  <div class="ticket-info-item">
                    <i class="uil uil-calendar-alt"></i>
                    <span>{{ formatDate(ticket.date) }}</span>
                  </div>
                  <div class="ticket-info-item">
                    <i class="uil uil-user"></i>
                    <span>{{ ticket.customerName }}</span>
                  </div>
                  <div class="ticket-info-item">
                    <i class="uil uil-ticket"></i>
                    <span>{{ ticket.quantity }} ticket(s)</span>
                  </div>
                  <div class="ticket-info-item price">
                    <i class="uil uil-money-bill"></i>
                    <span>R{{ ticket.total }}</span>
                  </div>
                </div>

                <!-- View and Download Buttons -->
                <div class="ticket-actions">
                  <button class="view-ticket-btn" @click="viewTicket(ticket)">
                    <i class="uil uil-eye"></i> View
                  </button>
                  <button class="download-ticket-btn" @click="downloadTicket(ticket)">
                    <i class="uil uil-download-alt"></i> Download
                  </button>
                </div>
              </div>

              <div class="ticket-card-footer">
                <span class="purchase-date">Purchased: {{ formatDate(ticket.purchasedAt) }}</span>
                <span class="ticket-price-small">R{{ ticket.total }}</span>
              </div>

              <!-- QR Preview -->
              <div v-if="ticket.qrCode" class="qr-preview" @click="viewTicket(ticket)">
                <img :src="ticket.qrCode" alt="QR">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div v-if="selectedTicket" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">×</button>
        
        <div class="modal-ticket">
          <div class="modal-ticket-header">
            <div class="modal-ticket-brand">
              <div class="modal-ticket-icon">🎟️</div>
              <div>
                <h2>{{ selectedTicket.title }}</h2>
                <p class="modal-ticket-ref">Reference: {{ selectedTicket.reference }}</p>
              </div>
            </div>
            <div class="modal-ticket-status">{{ selectedTicket.status }}</div>
          </div>

          <div class="modal-ticket-divider"></div>

          <div class="modal-ticket-body">
            <div class="modal-ticket-info">
              <div class="modal-info-row">
                <span class="modal-info-label">Event Date</span>
                <span class="modal-info-value">{{ selectedTicket.date }}</span>
              </div>
              <div class="modal-info-row">
                <span class="modal-info-label">Attendee</span>
                <span class="modal-info-value">{{ selectedTicket.customerName }}</span>
              </div>
              <div class="modal-info-row">
                <span class="modal-info-label">Email</span>
                <span class="modal-info-value">{{ selectedTicket.customerEmail }}</span>
              </div>
              <div class="modal-info-row">
                <span class="modal-info-label">Quantity</span>
                <span class="modal-info-value">{{ selectedTicket.quantity }} ticket(s)</span>
              </div>
              <div class="modal-info-row total">
                <span class="modal-info-label">Total Paid</span>
                <span class="modal-info-value">R{{ selectedTicket.total }}</span>
              </div>
              <div class="modal-info-row">
                <span class="modal-info-label">Purchase Date</span>
                <span class="modal-info-value">{{ formatDate(selectedTicket.purchasedAt) }}</span>
              </div>
            </div>

            <div class="modal-ticket-qr">
              <div class="modal-qr-container">
                <img v-if="selectedTicket.qrCode" :src="selectedTicket.qrCode" alt="QR Code" class="modal-qr-code">
                <p class="modal-qr-text">Show this QR at the event entrance</p>
              </div>
            </div>
          </div>

          <div class="modal-ticket-footer">
            <button class="modal-download-btn" @click="downloadTicket(selectedTicket)">
              <i class="uil uil-download-alt"></i> Download Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const isEditing = ref(false)
const activeTab = ref('about')
const distanceUnit = ref('km')
const customDistanceValue = ref(50)

// Ticket refs
const userTickets = ref([])
const selectedTicket = ref(null)

// User data
const user = ref({})
const userInterests = ref([])
const userDistance = ref(50)

const calculateAge = (birthDate) => {
  if (!birthDate) return null
  const today = new Date()
  const birth = new Date(birthDate)
  if (Number.isNaN(birth.getTime())) return null

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age >= 0 ? age : null
}

const displayAge = computed(() => {
  const ageFromBirthDate = calculateAge(user.value?.birthDate)
  if (ageFromBirthDate !== null) return ageFromBirthDate
  return user.value?.age || 'Not set'
})

const displayName = computed(() => {
  if (user.value?.name) return user.value.name
  const first = (user.value?.user_name || '').trim()
  const last = (user.value?.user_surname || '').trim()
  const fullName = `${first} ${last}`.trim()
  return fullName || 'Your Name'
})

const displayLocation = computed(() => {
  return user.value?.location || user.value?.area || 'Not set'
})

// Updated interests with emojis
const availableInterests = [
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

const capeTownAreas = [
  { code: '8001', area: 'Cape Town City Centre' },
  { code: '8005', area: 'Sea Point' },
  { code: '7700', area: 'Rondebosch' },
  { code: '7708', area: 'Claremont' },
  { code: '7800', area: 'Constantia' },
  { code: '7945', area: 'Tokai' },
  { code: '7806', area: 'Hout Bay' },
  { code: '7441', area: 'Blouberg' },
  { code: '7443', area: 'Parklands' },
  { code: '7530', area: 'Bellville' },
  { code: '7570', area: 'Durbanville' },
  { code: '7640', area: 'Milnerton' },
  { code: '7130', area: 'Somerset West' },
  { code: '7140', area: 'Strand' },
  { code: '7800', area: 'Kirstenhof' },
  { code: '7945', area: 'Bergvliet' },
  { code: '7800', area: 'Meadowridge' },
  { code: '7708', area: 'Kenilworth' },
  { code: '7945', area: 'Lakeside' },
  { code: '7800', area: 'Muizenberg' }
]

// Distance options
const distanceOptions = [
  { value: 10, label: 'Local (10km)' },
  { value: 25, label: 'Nearby (25km)' },
  { value: 50, label: 'City (50km)' },
  { value: 100, label: 'Regional (100km)' },
  { value: 'custom', label: 'Custom' }
]

// Edit form
const editForm = reactive({
  name: '',
  username: '',
  gender: '',
  location: '',
  areaCode: ''
})

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

// Load user data
onMounted(() => {
  loadUserData()
  loadUserTickets()
})

const loadUserData = () => {
  const userData = localStorage.getItem('user')
  const preferences = localStorage.getItem('preferences')
  
  if (userData) {
    const parsed = JSON.parse(userData)
    user.value = parsed
    
    editForm.name = parsed.name || `${parsed.user_name || ''} ${parsed.user_surname || ''}`.trim()
    editForm.username = parsed.username || parsed.email?.split('@')[0] || ''
    editForm.gender = parsed.gender || ''
    editForm.location = parsed.location || parsed.area || ''
    editForm.areaCode = findAreaCodeByLocation(editForm.location) || parsed.zip_code || ''
  }
  
  if (preferences) {
    const parsedPrefs = JSON.parse(preferences)
    user.value = { ...user.value, ...parsedPrefs }
    userInterests.value = parsedPrefs.interests || []
    userDistance.value = parsedPrefs.maxDistance || 50
    customDistanceValue.value = parsedPrefs.maxDistance || 50
  }
}

const loadUserTickets = () => {
  const userData = JSON.parse(localStorage.getItem('user') || '{}')
  userTickets.value = userData.tickets || []
  
  if (userTickets.value.length === 0) {
    const savedTickets = JSON.parse(localStorage.getItem('userTickets') || '[]')
    userTickets.value = savedTickets
  }
}

const startEditing = () => {
  editForm.areaCode = findAreaCodeByLocation(editForm.location) || editForm.areaCode || ''
  isEditing.value = true
}

const saveProfile = async () => {
  const finalDistance = userDistance.value === 'custom' ? customDistanceValue.value : userDistance.value
  
  const selectedArea = capeTownAreas.find((area) => area.code === editForm.areaCode)
  const resolvedLocation = selectedArea
    ? `${selectedArea.area} (${selectedArea.code})`
    : (editForm.location || user.value?.location || user.value?.area || '')

  const computedAge = calculateAge(user.value?.birthDate)
  const updatedUser = {
    ...user.value,
    name: editForm.name,
    username: editForm.username,
    age: computedAge ?? user.value?.age ?? null,
    gender: editForm.gender,
    location: resolvedLocation,
    zip_code: selectedArea?.code || user.value?.zip_code || '',
    interests: userInterests.value,
    maxDistance: finalDistance,
    profileComplete: true,
    tickets: userTickets.value
  }
  
  localStorage.setItem('user', JSON.stringify(updatedUser))
  
  const preferences = JSON.parse(localStorage.getItem('preferences') || '{}')
  const updatedPrefs = {
    ...preferences,
    interests: userInterests.value,
    maxDistance: finalDistance
  }
  localStorage.setItem('preferences', JSON.stringify(updatedPrefs))

  const userId = Number(updatedUser.user_id ?? updatedUser.id)
  if (Number.isInteger(userId) && userId > 0) {
    try {
      await store.dispatch('updateUserProfile', {
        area: resolvedLocation,
        zip_code: selectedArea?.code || user.value?.zip_code || ''
      })
      await store.dispatch('savePreferences', {
        user_id: userId,
        interests: Array.isArray(userInterests.value) ? userInterests.value : []
      })
    } catch (error) {
      console.error('Failed to save profile preferences to backend:', error)
    }
  }
  
  store.commit('setMe', updatedUser)
  user.value = updatedUser
  userDistance.value = finalDistance
  
  isEditing.value = false
}

const cancelEditing = () => {
  loadUserData()
  isEditing.value = false
}

const toggleInterest = (interest) => {
  const index = userInterests.value.indexOf(interest)
  if (index === -1) {
    if (userInterests.value.length < 10) {
      userInterests.value.push(interest)
    } else {
      alert('You can only select up to 10 interests')
    }
  } else {
    userInterests.value.splice(index, 1)
  }
}

const toggleDistanceUnit = () => {
  if (distanceUnit.value === 'km') {
    customDistanceValue.value = Math.round(customDistanceValue.value * 0.621371)
    distanceUnit.value = 'mi'
  } else {
    customDistanceValue.value = Math.round(customDistanceValue.value * 1.60934)
    distanceUnit.value = 'km'
  }
}

const findAreaCodeByLocation = (locationValue) => {
  const location = String(locationValue || '').toLowerCase().trim()
  if (!location) return ''

  const codeMatch = location.match(/\((\d{4})\)/)
  if (codeMatch?.[1]) return codeMatch[1]

  const matched = capeTownAreas.find((area) =>
    location.includes(String(area.area).toLowerCase())
  )
  return matched?.code || ''
}

// Ticket functions
const viewTicket = (ticket) => {
  selectedTicket.value = ticket
}

const closeModal = () => {
  selectedTicket.value = null
}

const downloadTicket = (ticket) => {
  if (ticket.qrCode) {
    const link = document.createElement('a')
    link.href = ticket.qrCode
    link.download = `${ticket.reference}.png`
    link.click()
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  max-width: 900px;
  width: 100%;
  background: white;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(238, 174, 202, 0.3);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-header {
  padding: 40px 40px 20px 40px;
  background: linear-gradient(135deg, #EEAECA 0%, #ffc9e0 100%);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
}

.profile-info {
  color: white;
}

.display-mode h1 {
  font-size: 32px;
  margin-bottom: 5px;
}

.username {
  opacity: 0.9;
  margin-bottom: 10px;
  font-size: 16px;
}

.edit-mode {
  margin-bottom: 20px;
}

.edit-input {
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 10px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 10px;
  background: rgba(255,255,255,0.2);
  color: white;
  font-size: 16px;
}

.edit-input::placeholder {
  color: rgba(255,255,255,0.8);
}

.edit-input:focus {
  outline: none;
  border-color: white;
}

/* Ticket Indicator */
.ticket-indicator {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.ticket-indicator:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(1.05);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
}

.ticket-indicator i {
  font-size: 24px;
  color: white;
}

.indicator-count {
  background: #c01a62;
  color: white;
  font-size: 14px;
  font-weight: bold;
  min-width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.indicator-text {
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  padding: 20px 30px;
  background: white;
}

.edit-profile-btn-main,
.save-profile-btn,
.cancel-edit-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.edit-profile-btn-main {
  background: #4caf50;
  color: white;
}

.save-profile-btn {
  background: #4caf50;
  color: white;
}

.cancel-edit-btn {
  background: #ff6b6b;
  color: white;
}

.edit-profile-btn-main:hover,
.save-profile-btn:hover,
.cancel-edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
}

.cancel-edit-btn:hover {
  box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 30px;
  background: white;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 15px 25px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  border-bottom: 3px solid transparent;
}

.tab-btn i {
  font-size: 18px;
}

.tab-btn:hover {
  color: #4caf50;
}

.tab-btn.active {
  color: #4caf50;
  border-bottom-color: #4caf50;
}

.tab-badge {
  background: #c01a62;
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 20px;
  margin-left: 5px;
}

.tab-content {
  padding: 30px;
  background: white;
}

/* About Tab */
.info-section {
  margin-bottom: 30px;
}

.info-section h3 {
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.info-edit-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: #000000;
  background: #fff;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  transition: all 300ms ease;
}

.info-edit-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.2);
}

/* Interests Tab */
.interests-tab {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.interests-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
}

.interests-section h3 {
  color: #333;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
}

.interest-btn {
  padding: 15px 10px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.interest-emoji {
  font-size: 28px;
}

.interest-name {
  font-weight: 600;
  text-align: center;
}

.interest-btn:hover {
  border-color: #EEAECA;
  transform: translateY(-2px);
}

.interest-btn.selected {
  background: #EEAECA;
  color: white;
  border-color: #EEAECA;
}

.interests-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 0;
}

.interest-tag {
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(238, 174, 202, 0.3);
}

/* Distance Preference */
.distance-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.distance-btn {
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.distance-btn:not(:disabled):hover {
  border-color: #4caf50;
  transform: translateY(-2px);
}

.distance-btn.selected {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.distance-btn:disabled {
  opacity: 0.7;
  cursor: default;
}

.distance-value {
  font-size: 18px;
  font-weight: 700;
}

.distance-label {
  font-size: 12px;
}

.custom-distance {
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
}

.distance-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  outline: none;
  -webkit-appearance: none;
  margin-bottom: 15px;
}

.distance-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.distance-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #333;
}

.unit-toggle {
  background: none;
  border: 2px solid #EEAECA;
  color: #EEAECA;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.unit-toggle:hover {
  background: #EEAECA;
  color: white;
}

/* Tickets Tab */
.tickets-tab {
  min-height: 400px;
}

.tickets-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.tickets-header h3 {
  margin: 0;
  color: #333;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tickets-count {
  background: linear-gradient(135deg, #c01a62, #fe6bab);
  color: white;
  padding: 5px 15px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.ticket-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  position: relative;
}

.ticket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(192, 26, 98, 0.15);
  border-color: #c01a62;
}

.ticket-card-header {
  padding: 15px 20px;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  border-bottom: 2px dashed #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.ticket-card-header::before,
.ticket-card-header::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #c01a62;
  border-radius: 50%;
  bottom: -11px;
}

.ticket-card-header::before {
  left: -10px;
}

.ticket-card-header::after {
  right: -10px;
}

.ticket-type-badge {
  background: #4caf50;
  color: white;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.ticket-card-ref {
  color: #c01a62;
  font-weight: 600;
  font-size: 12px;
}

.ticket-card-body {
  padding: 20px;
  position: relative;
}

.ticket-card-body h4 {
  margin: 0 0 15px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  padding-right: 60px;
}

.ticket-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 15px;
}

.ticket-info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 13px;
}

.ticket-info-item i {
  color: #c01a62;
  font-size: 14px;
  width: 18px;
}

.ticket-info-item.price {
  color: #4caf50;
  font-weight: 600;
}

/* Ticket Actions */
.ticket-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.view-ticket-btn, .download-ticket-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.view-ticket-btn {
  background: #c01a62;
  color: white;
}

.view-ticket-btn:hover {
  background: #fe6bab;
  transform: translateY(-2px);
}

.download-ticket-btn {
  background: #4caf50;
  color: white;
}

.download-ticket-btn:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.qr-preview {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #c01a62;
  cursor: pointer;
  transition: all 0.3s ease;
}

.qr-preview:hover {
  transform: scale(1.1);
  box-shadow: 0 5px 15px rgba(192, 26, 98, 0.3);
}

.qr-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ticket-card-footer {
  padding: 12px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #999;
}

.ticket-price-small {
  color: #4caf50;
  font-weight: 600;
  font-size: 14px;
}

.no-tickets {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 20px;
}

.no-tickets-icon i {
  font-size: 60px;
  color: #ccc;
  margin-bottom: 15px;
}

.no-tickets h4 {
  color: #333;
  margin-bottom: 10px;
  font-size: 18px;
}

.no-tickets p {
  color: #666;
  margin-bottom: 20px;
}

.browse-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 30px;
  background: linear-gradient(135deg, #c01a62, #fe6bab);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.browse-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(192, 26, 98, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 30px;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
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
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-ticket {
  background: linear-gradient(135deg, #ffffff, #f8f9fa);
  border-radius: 20px;
  overflow: hidden;
}

.modal-ticket-header {
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px dashed #e0e0e0;
}

.modal-ticket-brand {
  display: flex;
  gap: 15px;
  align-items: center;
}

.modal-ticket-icon {
  font-size: 40px;
}

.modal-ticket-brand h2 {
  margin: 0 0 5px;
  font-size: 22px;
  color: #333;
}

.modal-ticket-ref {
  font-size: 13px;
  color: #666;
}

.modal-ticket-status {
  padding: 6px 15px;
  background: #4caf50;
  color: white;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.modal-ticket-divider {
  height: 2px;
  background: repeating-linear-gradient(90deg, #c01a62, #c01a62 10px, transparent 10px, transparent 20px);
  margin: 0 25px;
}

.modal-ticket-body {
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 30px;
}

.modal-ticket-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.modal-info-row {
  display: flex;
  flex-direction: column;
  padding: 10px 0;
  border-bottom: 1px dashed #f0f0f0;
}

.modal-info-row.total {
  border-top: 2px solid #c01a62;
  border-bottom: 2px solid #c01a62;
  padding: 15px 0;
  margin: 5px 0;
}

.modal-info-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 5px;
}

.modal-info-value {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.modal-info-row.total .modal-info-value {
  color: #c01a62;
  font-size: 18px;
}

.modal-ticket-qr {
  text-align: center;
}

.modal-qr-container {
  background: #f8f9fa;
  border-radius: 16px;
  padding: 20px;
}

.modal-qr-code {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  padding: 8px;
  background: white;
  border: 2px solid #c01a62;
  margin-bottom: 10px;
}

.modal-qr-text {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.modal-ticket-footer {
  padding: 20px 25px;
  background: #f8f9fa;
  border-top: 2px solid #f0f0f0;
}

.modal-download-btn {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(135deg, #c01a62, #fe6bab);
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.modal-download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(192, 26, 98, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .ticket-indicator {
    width: 100%;
    justify-content: center;
  }
  
  .tickets-grid {
    grid-template-columns: 1fr;
  }
  
  .ticket-info-grid {
    grid-template-columns: 1fr;
  }
  
  .tab-btn {
    padding: 12px 15px;
    font-size: 13px;
  }
  
  .modal-ticket-body {
    grid-template-columns: 1fr;
  }
  
  .modal-ticket-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .modal-qr-code {
    width: 150px;
    height: 150px;
  }
}
</style>
