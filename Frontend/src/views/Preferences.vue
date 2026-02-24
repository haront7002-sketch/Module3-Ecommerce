<template>
  <div class="preferences-container">
    <div class="preferences-card">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      
      <h1>Tell us about yourself</h1>
      <p class="subtitle">This helps us find better matches for you</p>
      
      <!-- Basic Info -->
      <div v-if="step === 1" class="step-content">
        <h2>Basic Information</h2>
        
        <div class="form-group">
          <label>Your Gender</label>
          <div class="options-grid">
            <button 
              v-for="gender in genders" 
              :key="gender"
              class="option-btn"
              :class="{ selected: preferences.gender === gender }"
              @click="preferences.gender = gender"
            >
              {{ gender }}
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label>Birth Date</label>
          <input type="date" v-model="preferences.birthDate" class="form-input">
        </div>
        
        <div class="form-group">
          <label>Street Address</label>
          <input 
            type="text" 
            v-model="preferences.streetAddress" 
            class="form-input" 
            placeholder="e.g., 16 Portobello Close"
          >
        </div>
        
        <div class="form-group">
          <label>Suburb / Area</label>
          <input 
            type="text" 
            v-model="preferences.suburb" 
            class="form-input" 
            placeholder="e.g., Portlands"
          >
        </div>
        
        <div class="form-group">
          <label>City / General Area</label>
          <input 
            type="text" 
            v-model="preferences.city" 
            class="form-input" 
            placeholder="e.g., Mitchells Plain"
          >
        </div>
      </div>
      
      <!-- Step 2: Interests (Updated with new categories) -->
      <div v-if="step === 2" class="step-content">
        <h2>Select Your Interest Categories</h2>
        <p>Choose at least 3 categories that interest you</p>
        
        <div class="interests-grid">
          <button 
            v-for="interest in availableInterests" 
            :key="interest.id"
            class="interest-btn"
            :class="{ selected: preferences.interests.includes(interest.name) }"
            @click="toggleInterest(interest.name)"
          >
            <span class="interest-emoji">{{ interest.emoji }}</span>
            <span class="interest-name">{{ interest.name }}</span>
          </button>
        </div>
      </div>
      
      <!-- Step 3: Looking For -->
      <div v-if="step === 3" class="step-content">
        <h2>Your Preferences</h2>
        
        <div class="form-group">
          <label>Maximum Distance</label>
          <div class="distance-slider">
            <input 
              type="range" 
              v-model.number="preferences.maxDistance" 
              min="1" 
              max="100"
              class="slider"
            >
            <div class="distance-value">
              <span>{{ preferences.maxDistance }} {{ distanceUnit }}</span>
              <button class="unit-toggle" @click="toggleDistanceUnit">
                Switch to {{ distanceUnit === 'km' ? 'miles' : 'km' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Navigation Buttons -->
      <div class="nav-buttons">
        <button 
          v-if="step > 1" 
          class="btn btn-secondary"
          @click="step--"
        >
          Back
        </button>
        
        <button 
          v-if="step < 3" 
          class="btn btn-primary"
          @click="nextStep"
          :disabled="!canProceed"
        >
          Continue
        </button>
        
        <button 
          v-if="step === 3" 
          class="btn btn-primary"
          @click="savePreferences"
          :disabled="!canComplete"
        >
          Complete Profile
        </button>
      </div>
      
      <!-- Step Indicators -->
      <div class="step-indicators">
        <span 
          v-for="n in 3" 
          :key="n"
          class="step-dot"
          :class="{ active: step >= n, completed: step > n }"
          @click="step = n"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const step = ref(1)
const distanceUnit = ref('km')

const genders = ['Male', 'Female', 'Non-binary', 'Other']

// Updated interests with new categories and emojis
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

const preferences = reactive({
  gender: '',
  birthDate: '',
  streetAddress: '',
  suburb: '',
  city: '',
  interests: [],
  maxDistance: 50
})

const progress = computed(() => {
  return (step.value / 3) * 100
})

const canProceed = computed(() => {
  switch(step.value) {
    case 1:
      return preferences.gender && 
             preferences.birthDate && 
             preferences.streetAddress && 
             preferences.suburb && 
             preferences.city
    case 2:
      return preferences.interests.length >= 3
    default:
      return false
  }
})

const canComplete = computed(() => {
  return preferences.maxDistance
})

const toggleInterest = (interest) => {
  const index = preferences.interests.indexOf(interest)
  if (index === -1) {
    if (preferences.interests.length < 10) {
      preferences.interests.push(interest)
    }
  } else {
    preferences.interests.splice(index, 1)
  }
}

const toggleDistanceUnit = () => {
  // Convert the value when switching units
  if (distanceUnit.value === 'km') {
    preferences.maxDistance = Math.round(preferences.maxDistance * 0.621371)
    distanceUnit.value = 'mi'
  } else {
    preferences.maxDistance = Math.round(preferences.maxDistance * 1.60934)
    distanceUnit.value = 'km'
  }
}

const nextStep = () => {
  if (canProceed.value) {
    step.value++
  }
}

const calculateAge = (birthDate) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const savePreferences = () => {
  // Calculate age
  const age = calculateAge(preferences.birthDate)
  
  // Format full location
  const fullLocation = `${preferences.streetAddress}, ${preferences.suburb}, ${preferences.city}`
  
  // Create complete preferences object
  const completePrefs = {
    gender: preferences.gender,
    age: age,
    birthDate: preferences.birthDate,
    streetAddress: preferences.streetAddress,
    suburb: preferences.suburb,
    city: preferences.city,
    location: fullLocation,
    interests: preferences.interests,
    maxDistance: preferences.maxDistance,
    distanceUnit: distanceUnit.value
  }
  
  // Use auth store to save
  authStore.savePreferences(completePrefs)
  
  alert('Profile completed! Redirecting to your profile...')
  router.push('/profile')
}
</script>

<style scoped>
.preferences-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #EEAECA 0%, #ffc9e0 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.preferences-card {
  background: white;
  border-radius: 30px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
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

.progress-bar {
  width: 100%;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  margin-bottom: 30px;
}

.progress {
  height: 100%;
  background: #4caf50;
  border-radius: 3px;
  transition: width 0.3s ease;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
}

.step-content {
  margin-bottom: 30px;
}

.step-content h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 22px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  color: #555;
  margin-bottom: 10px;
  font-weight: 600;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.option-btn {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.option-btn:hover {
  border-color: #4caf50;
  transform: translateY(-2px);
}

.option-btn.selected {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4caf50;
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
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
  gap: 5px;
}

.interest-emoji {
  font-size: 24px;
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

.distance-slider {
  position: relative;
  padding: 10px 0;
}

.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(90deg, #EEAECA, #4caf50);
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4caf50;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
}

.distance-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  color: #555;
  font-weight: 600;
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

.nav-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #4caf50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.4);
}

.btn-secondary {
  background: #f0f0f0;
  color: #555;
}

.btn-secondary:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

.step-indicators {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.step-dot.active {
  background: #4caf50;
  transform: scale(1.2);
}

.step-dot.completed {
  background: #EEAECA;
}
</style>