<template>
  <div class="profile-container">
    <div class="profile-card">
      <!-- Header with cover photo -->
      <div class="profile-header">
        <div class="cover-photo" :style="{ backgroundImage: `url(${user.coverPhoto || defaultCover})` }">
          <button v-if="isEditing" class="edit-cover-btn" @click="editCoverPhoto">
            <i class="uil uil-camera"></i>
          </button>
        </div>
        
        <!-- Profile Picture -->
        <div class="profile-picture-wrapper">
          <div class="profile-picture">
            <img :src="user.profilePicture || defaultAvatar" alt="Profile Picture">
            <button v-if="isEditing" class="edit-profile-btn" @click="editProfilePicture">
              <i class="uil uil-camera"></i>
            </button>
          </div>
        </div>
        
        <!-- Profile Info -->
        <div class="profile-info">
          <div v-if="!isEditing" class="display-mode">
            <h1>{{ user.name || 'Your Name' }}</h1>
            <p class="username">@{{ user.username || user.email?.split('@')[0] || 'username' }}</p>
            <p class="bio">{{ user.bio || 'No bio yet' }}</p>
          </div>
          
          <div v-else class="edit-mode">
            <input type="text" v-model="editForm.name" class="edit-input" placeholder="Your Name">
            <input type="text" v-model="editForm.username" class="edit-input" placeholder="Username">
            <textarea v-model="editForm.bio" class="edit-textarea" placeholder="Tell us about yourself..."></textarea>
          </div>
          
          <div class="profile-stats">
            <div class="stat">
              <span class="stat-value">{{ matchesCount }}</span>
              <span class="stat-label">Matches</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ likesCount }}</span>
              <span class="stat-label">Likes</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ viewsCount }}</span>
              <span class="stat-label">Views</span>
            </div>
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
          :class="{ active: activeTab === 'photos' }" 
          @click="activeTab = 'photos'"
        >
          <i class="uil uil-images"></i> Photos
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
          :class="{ active: activeTab === 'preferences' }" 
          @click="activeTab = 'preferences'"
        >
          <i class="uil uil-sliders-v"></i> Preferences
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
                <span class="info-value">{{ user.age || 'Not set' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Gender:</span>
                <span class="info-value">{{ user.gender || 'Not set' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Location:</span>
                <span class="info-value">{{ user.location || 'Not set' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Occupation:</span>
                <span class="info-value">{{ user.occupation || 'Not set' }}</span>
              </div>
            </div>
          </div>

          <div class="info-section">
            <h3><i class="uil uil-comment"></i> About Me</h3>
            <p class="about-text">{{ user.about || 'No description yet.' }}</p>
          </div>
        </div>

        <!-- Photos Tab -->
        <div v-if="activeTab === 'photos'" class="photos-tab">
          <div class="photos-grid">
            <div v-for="(photo, index) in userPhotos" :key="index" class="photo-item">
              <img :src="photo" :alt="`Photo ${index + 1}`">
              <button v-if="isEditing" class="delete-photo-btn" @click="deletePhoto(index)">
                <i class="uil uil-times"></i>
              </button>
            </div>
            <div v-if="isEditing && userPhotos.length < 5" class="photo-item add-photo" @click="addPhoto">
              <i class="uil uil-plus"></i>
              <span>Add Photo</span>
            </div>
          </div>
        </div>

        <!-- Interests Tab -->
        <div v-if="activeTab === 'interests'" class="interests-tab">
          <h3>Your Interests</h3>
          <div class="interests-cloud">
            <span 
              v-for="(interest, index) in userInterests" 
              :key="index" 
              class="interest-tag"
            >
              {{ interest }}
              <i v-if="isEditing" class="uil uil-times" @click="removeInterest(index)"></i>
            </span>
            <button v-if="isEditing" class="add-interest-btn" @click="addInterest">
              <i class="uil uil-plus"></i> Add Interest
            </button>
          </div>
        </div>

        <!-- Preferences Tab -->
        <div v-if="activeTab === 'preferences'" class="preferences-tab">
          <div class="preferences-section">
            <h3>Dating Preferences</h3>
            
            <div class="pref-item">
              <span>Interested in:</span>
              <span class="pref-value">{{ user.interestedIn || 'Not set' }}</span>
            </div>
            
            <div class="pref-item">
              <span>Age range:</span>
              <span class="pref-value">{{ user.ageRange?.min || 18 }} - {{ user.ageRange?.max || 35 }}</span>
            </div>
            
            <div class="pref-item">
              <span>Maximum distance:</span>
              <span class="pref-value">{{ user.maxDistance || 50 }} km</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isEditing = ref(false)
const activeTab = ref('about')

const defaultAvatar = 'https://via.placeholder.com/150'
const defaultCover = 'https://via.placeholder.com/800x200'

// User data
const user = ref({})
const userPhotos = ref([])
const userInterests = ref([])
const matchesCount = ref(42)
const likesCount = ref(128)
const viewsCount = ref(1024)

// Edit form
const editForm = reactive({
  name: '',
  username: '',
  bio: '',
  age: '',
  gender: '',
  location: '',
  occupation: '',
  about: ''
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
    editForm.name = parsed.name || ''
    editForm.username = parsed.username || parsed.email?.split('@')[0] || ''
    editForm.bio = parsed.bio || ''
    editForm.age = parsed.age || ''
    editForm.gender = parsed.gender || ''
    editForm.location = parsed.location || ''
    editForm.occupation = parsed.occupation || ''
    editForm.about = parsed.about || ''
  }
  
  if (preferences) {
    const parsedPrefs = JSON.parse(preferences)
    user.value = { ...user.value, ...parsedPrefs }
    userInterests.value = parsedPrefs.interests || []
    userPhotos.value = parsedPrefs.photos || []
  }
}

const startEditing = () => {
  isEditing.value = true
}

const saveProfile = () => {
  // Update user data
  const updatedUser = {
    ...user.value,
    name: editForm.name,
    username: editForm.username,
    bio: editForm.bio,
    age: editForm.age,
    gender: editForm.gender,
    location: editForm.location,
    occupation: editForm.occupation,
    about: editForm.about,
    interests: userInterests.value,
    photos: userPhotos.value,
    profileComplete: true
  }
  
  // Save to localStorage
  localStorage.setItem('user', JSON.stringify(updatedUser))
  user.value = updatedUser
  
  isEditing.value = false
  alert('Profile updated successfully!')
}

const cancelEditing = () => {
  loadUserData() // Reload original data
  isEditing.value = false
}

const editCoverPhoto = () => {
  alert('Cover photo upload functionality')
}

const editProfilePicture = () => {
  alert('Profile picture upload functionality')
}

const deletePhoto = (index) => {
  userPhotos.value.splice(index, 1)
}

const addPhoto = () => {
  alert('Add photo functionality')
}

const addInterest = () => {
  const newInterest = prompt('Enter a new interest:')
  if (newInterest) {
    userInterests.value.push(newInterest)
  }
}

const removeInterest = (index) => {
  userInterests.value.splice(index, 1)
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  max-width: 1000px;
  width: 100%;
  background: white;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
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
  position: relative;
  background: linear-gradient(45deg, #667eea, #764ba2);
}

.cover-photo {
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.edit-cover-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-cover-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

.profile-picture-wrapper {
  position: absolute;
  bottom: -60px;
  left: 50px;
}

.profile-picture {
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-profile-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #667eea;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid white;
}

.edit-profile-btn:hover {
  background: #764ba2;
  transform: scale(1.1);
}

.profile-info {
  padding: 80px 50px 30px 220px;
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

.bio {
  opacity: 0.8;
  margin-bottom: 20px;
  font-size: 14px;
}

.edit-mode {
  margin-bottom: 20px;
}

.edit-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 16px;
}

.edit-input:focus {
  outline: none;
  border-color: white;
}

.edit-textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 14px;
  min-height: 80px;
  resize: vertical;
}

.edit-textarea:focus {
  outline: none;
  border-color: white;
}

.profile-stats {
  display: flex;
  gap: 40px;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  opacity: 0.8;
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
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.save-profile-btn {
  background: linear-gradient(45deg, #4CAF50, #45a049);
  color: white;
}

.cancel-edit-btn {
  background: #f44336;
  color: white;
}

.edit-profile-btn-main:hover,
.save-profile-btn:hover,
.cancel-edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.profile-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
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
  color: #667eea;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
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

.about-text {
  line-height: 1.8;
  color: #555;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
}

/* Photos Tab */
.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.photo-item:hover img {
  transform: scale(1.1);
}

.delete-photo-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-item:hover .delete-photo-btn {
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
  font-size: 40px;
  color: #667eea;
  margin-bottom: 10px;
}

.add-photo span {
  color: #666;
}

/* Interests Tab */
.interests-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 20px 0;
}

.interest-tag {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: popIn 0.3s ease;
}

.interest-tag i {
  font-size: 14px;
  cursor: pointer;
  opacity: 0.8;
}

.interest-tag i:hover {
  opacity: 1;
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

.add-interest-btn {
  background: white;
  border: 2px dashed #667eea;
  color: #667eea;
  padding: 10px 20px;
  border-radius: 30px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-interest-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

/* Preferences Tab */
.preferences-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 15px;
}

.preferences-section h3 {
  color: #333;
  margin-bottom: 20px;
}

.pref-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.pref-item:last-child {
  border-bottom: none;
}

.pref-value {
  font-weight: 600;
  color: #667eea;
}
</style>
