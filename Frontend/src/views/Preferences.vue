<template>
  <div class="preferences-container">
    <div class="preferences-card">
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
      
      <h1>Tell us about yourself</h1>
      <p class="subtitle">This helps us find better matches for you</p>
      
      <!-- Step 1: Basic Info -->
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
          <label>Interested In</label>
          <div class="options-grid">
            <button 
              v-for="interest in interests" 
              :key="interest"
              class="option-btn"
              :class="{ selected: preferences.interestedIn === interest }"
              @click="preferences.interestedIn = interest"
            >
              {{ interest }}
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label>Birth Date</label>
          <input type="date" v-model="preferences.birthDate" class="form-input">
        </div>
        
        <div class="form-group">
          <label>Location</label>
          <input type="text" v-model="preferences.location" class="form-input" placeholder="City, Country">
        </div>
      </div>
      
      <!-- Step 2: Interests -->
      <div v-if="step === 2" class="step-content">
        <h2>Select Your Interests</h2>
        <p>Choose at least 3 interests</p>
        
        <div class="interests-grid">
          <button 
            v-for="interest in availableInterests" 
            :key="interest"
            class="interest-btn"
            :class="{ selected: preferences.interests.includes(interest) }"
            @click="toggleInterest(interest)"
          >
            {{ interest }}
          </button>
        </div>
      </div>
      
      <!-- Step 3: Photos -->
      <div v-if="step === 3" class="step-content">
        <h2>Add Photos</h2>
        <p>Upload at least 1 photo to continue</p>
        
        <div class="photos-grid">
          <div 
            v-for="(photo, index) in photoPreviews" 
            :key="index"
            class="photo-item"
          >
            <img :src="photo" :alt="'Photo ' + (index + 1)">
            <button class="remove-photo" @click="removePhoto(index)">
              <i class="uil uil-times"></i>
            </button>
          </div>
          
          <label v-if="preferences.photos.length < 5" class="photo-item add-photo">
            <input 
              type="file" 
              accept="image/*" 
              @change="handlePhotoUpload" 
              multiple
              hidden
            >
            <i class="uil uil-plus"></i>
            <span>Add Photo</span>
          </label>
        </div>
      </div>
      
      <!-- Step 4: Looking For -->
      <div v-if="step === 4" class="step-content">
        <h2>Who are you looking for?</h2>
        
        <div class="form-group">
          <label>Age Range</label>
          <div class="range-slider">
            <input 
              type="range" 
              v-model.number="preferences.ageRange.min" 
              min="18" 
              max="60"
              @input="updateRange"
            >
            <input 
              type="range" 
              v-model.number="preferences.ageRange.max" 
              min="18" 
              max="60"
              @input="updateRange"
            >
            <div class="range-values">
              <span>{{ preferences.ageRange.min }} years</span>
              <span>{{ preferences.ageRange.max }} years</span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label>Maximum Distance</label>
          <div class="distance-slider">
            <input 
              type="range" 
              v-model.number="preferences.maxDistance" 
              min="1" 
              max="100"
            >
            <div class="distance-value">{{ preferences.maxDistance }} km</div>
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
          v-if="step < 4" 
          class="btn btn-primary"
          @click="nextStep"
          :disabled="!canProceed"
        >
          Continue
        </button>
        
        <button 
          v-if="step === 4" 
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
          v-for="n in 4" 
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

const genders = ['Male', 'Female', 'Non-binary', 'Other']
const interests = ['Men', 'Women', 'Everyone']

const availableInterests = [
  'Travel', 'Music', 'Food', 'Fitness', 'Art', 'Photography',
  'Hiking', 'Movies', 'Reading', 'Gaming', 'Sports', 'Cooking',
  'Dancing', 'Yoga', 'Coffee', 'Wine', 'Beach', 'Mountains'
]

const preferences = reactive({
  gender: '',
  interestedIn: '',
  birthDate: '',
  location: '',
  interests: [],
  photos: [],
  ageRange: { min: 18, max: 35 },
  maxDistance: 50
})

const photoPreviews = ref([])

const progress = computed(() => {
  return (step.value / 4) * 100
})

const canProceed = computed(() => {
  switch(step.value) {
    case 1:
      return preferences.gender && preferences.interestedIn && preferences.birthDate && preferences.location
    case 2:
      return preferences.interests.length >= 3
    case 3:
      return preferences.photos.length >= 1
    case 4:
      return true
    default:
      return false
  }
})

const canComplete = computed(() => {
  return preferences.ageRange.min && preferences.ageRange.max && preferences.maxDistance
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

const handlePhotoUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (preferences.photos.length < 5) {
      const reader = new FileReader()
      reader.onload = (e) => {
        photoPreviews.value.push(e.target.result)
        preferences.photos.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  })
}

const removePhoto = (index) => {
  photoPreviews.value.splice(index, 1)
  preferences.photos.splice(index, 1)
}

const nextStep = () => {
  if (canProceed.value) {
    step.value++
  }
}

const updateRange = () => {
  if (preferences.ageRange.min > preferences.ageRange.max) {
    preferences.ageRange.max = preferences.ageRange.min
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
  
  // Create complete preferences object
  const completePrefs = {
    ...preferences,
    age
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 30px 60px rgba(0,0,0,0.3);
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
  background: linear-gradient(90deg, #667eea, #764ba2);
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
  border-color: #667eea;
  transform: translateY(-2px);
}

.option-btn.selected {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
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
  border-color: #667eea;
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.interest-btn {
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #555;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
}

.interest-btn:hover {
  border-color: #667eea;
  transform: translateY(-2px);
}

.interest-btn.selected {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: rgba(255, 99, 99, 0.9);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-item:hover .remove-photo {
  opacity: 1;
}

.add-photo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 2px dashed #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-photo:hover {
  border-color: #667eea;
  background: #f0f2f5;
}

.add-photo i {
  font-size: 30px;
  color: #667eea;
  margin-bottom: 5px;
}

.add-photo span {
  font-size: 12px;
  color: #666;
}

.range-slider {
  position: relative;
  height: 60px;
  padding-top: 20px;
}

.range-slider input[type=range] {
  position: absolute;
  width: 100%;
  pointer-events: none;
  -webkit-appearance: none;
  background: transparent;
}

.range-slider input[type=range]::-webkit-slider-thumb {
  pointer-events: auto;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  cursor: pointer;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  color: #555;
}

.distance-slider {
  position: relative;
}

.distance-value {
  text-align: center;
  margin-top: 10px;
  font-weight: 600;
  color: #667eea;
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
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
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
  background: #667eea;
  transform: scale(1.2);
}

.step-dot.completed {
  background: #764ba2;
}
</style>