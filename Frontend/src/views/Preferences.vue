<!-- src/views/Preferences.vue -->
<template>
  <div class="preferences-container">
    <h1>User Preferences</h1>
    <div class="preferences-form">
      <!-- Add your preferences form fields here -->
      <div class="form-group">
        <label for="theme">Theme:</label>
        <select id="theme" v-model="theme">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="notifications">
          <input type="checkbox" id="notifications" v-model="notifications">
          Enable Notifications
        </label>
      </div>
      
      <div class="form-group">
        <label for="language">Language:</label>
        <select id="language" v-model="language">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
      
      <button @click="savePreferences" class="save-btn">Save Preferences</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// State for preferences
const theme = ref('light')
const notifications = ref(true)
const language = ref('en')

// Save preferences function
const savePreferences = () => {
  // Add your save logic here
  console.log('Saving preferences:', {
    theme: theme.value,
    notifications: notifications.value,
    language: language.value
  })
  
  // You might want to save to localStorage or send to an API
  localStorage.setItem('userPreferences', JSON.stringify({
    theme: theme.value,
    notifications: notifications.value,
    language: language.value
  }))
  
  alert('Preferences saved successfully!')
}
</script>

<style scoped>
.preferences-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.preferences-form {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.form-group input[type="checkbox"] {
  margin-right: 8px;
}

select, input[type="checkbox"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

select {
  width: 100%;
  max-width: 300px;
}

.save-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
}

.save-btn:hover {
  background-color: #45a049;
}
</style>