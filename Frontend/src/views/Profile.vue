<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- Header with profile info -->
      <div class="profile-header">
        <!-- Profile Info -->
        <div class="profile-info">
          <div v-if="!isEditing" class="display-mode">
            <h1>{{ displayName }}</h1>
            <p class="username">@{{ user.username || user.email?.split('@')[0] || 'username' }}</p>
          </div>
          
          <div v-else class="edit-mode">
            <input type="text" v-model="editForm.name" class="edit-input" placeholder="Your Name">
            <input type="text" v-model="editForm.username" class="edit-input" placeholder="Username">
          </div>
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
                <span class="info-value">{{ displayLocation }}</span>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isEditing = ref(false)
const activeTab = ref('about')
const distanceUnit = ref('km')
const customDistanceValue = ref(50)

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
  location: ''
})

// Load user data
onMounted(() => {
  loadUserData()
})

const loadUserData = () => {
  // Get user data from localStorage
  const userData = localStorage.getItem('user')
  const preferences = localStorage.getItem('preferences')
  
  if (userData) {
    const parsed = JSON.parse(userData)
    user.value = parsed
    
    // Set edit form values
    editForm.name = parsed.name || `${parsed.user_name || ''} ${parsed.user_surname || ''}`.trim()
    editForm.username = parsed.username || parsed.email?.split('@')[0] || ''
    editForm.gender = parsed.gender || ''
    editForm.location = parsed.location || parsed.area || ''
  }
  
  if (preferences) {
    const parsedPrefs = JSON.parse(preferences)
    user.value = { ...user.value, ...parsedPrefs }
    userInterests.value = parsedPrefs.interests || []
    userDistance.value = parsedPrefs.maxDistance || 50
    customDistanceValue.value = parsedPrefs.maxDistance || 50
  }
}

const startEditing = () => {
  isEditing.value = true
}

const saveProfile = () => {
  // Determine final distance value
  const finalDistance = userDistance.value === 'custom' ? customDistanceValue.value : userDistance.value
  
  // Update user data
  const computedAge = calculateAge(user.value?.birthDate)
  const updatedUser = {
    ...user.value,
    name: editForm.name,
    username: editForm.username,
    age: computedAge ?? user.value?.age ?? null,
    gender: editForm.gender,
    location: editForm.location,
    interests: userInterests.value,
    maxDistance: finalDistance,
    profileComplete: true
  }
  
  // Save to localStorage
  localStorage.setItem('user', JSON.stringify(updatedUser))
  
  // Also update preferences
  const preferences = JSON.parse(localStorage.getItem('preferences') || '{}')
  const updatedPrefs = {
    ...preferences,
    interests: userInterests.value,
    maxDistance: finalDistance
  }
  localStorage.setItem('preferences', JSON.stringify(updatedPrefs))
  
  user.value = updatedUser
  userDistance.value = finalDistance
  
  isEditing.value = false
}

const cancelEditing = () => {
  loadUserData() // Reload original data
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
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #EEAECA 0%, #ffc9e0 50%, #AEE994 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  max-width: 800px;
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

/* Interests Grid - Updated for new categories */
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
  line-height: 1.3;
}

.interest-btn:hover {
  border-color: #EEAECA;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(238, 174, 202, 0.2);
}

.interest-btn.selected {
  background: #EEAECA;
  color: white;
  border-color: #EEAECA;
}

/* Interests Cloud (View Mode) - Updated for new categories */
.interests-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 0;
}

.interest-tag {
  background: linear-gradient(135deg, #EEAECA, #ffb5d1);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: popIn 0.3s ease;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(238, 174, 202, 0.3);
}

.interest-tag:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 6px 15px rgba(238, 174, 202, 0.4);
}

@keyframes popIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
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
  background: linear-gradient(90deg, #EEAECA, #4caf50);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  margin-bottom: 15px;
}

.distance-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.distance-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.distance-slider:disabled::-webkit-slider-thumb {
  background: #ccc;
  cursor: default;
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
  transform: translateY(-2px);
}

/* Scrollbar styling */
.interests-grid::-webkit-scrollbar {
  width: 8px;
}

.interests-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.interests-grid::-webkit-scrollbar-thumb {
  background: #EEAECA;
  border-radius: 4px;
}

.interests-grid::-webkit-scrollbar-thumb:hover {
  background: #ffb5d1;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .profile-header {
    padding: 30px 20px 15px 20px;
  }
  
  .profile-tabs {
    padding: 0 15px;
  }
  
  .tab-btn {
    padding: 12px 15px;
    font-size: 13px;
  }
  
  .tab-content {
    padding: 20px;
  }
  
  .interests-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .distance-options {
    grid-template-columns: 1fr 1fr;
  }
  
  .interest-emoji {
    font-size: 24px;
  }
  
  .interest-name {
    font-size: 12px;
  }
}
</style>
