<template>
    <div class="section">
        <div class="container">
            <div class="row full-height justify-content-center">
                <div class="col-12 text-center align-self-center py-5">
                    <div class="section pb-5 pt-5 pt-sm-2 text-center">
                        <h6 class="mb-0 pb-3">
                            <span>Log In</span>
                            <span>Sign Up</span>
                        </h6>
                        
                        <input 
                            class="checkbox" 
                            type="checkbox" 
                            :id="checkboxId" 
                            v-model="isFlipped"
                        />
                        <label :for="checkboxId"></label>
                        
                        <div class="card-3d-wrap mx-auto">
                            <div class="card-3d-wrapper" :class="{ 'rotate': isFlipped }">
                                <!-- Login Form (Front) -->
                                <div class="card-front">
                                    <div class="center-wrap">
                                        <div class="section text-center">
                                            <h4 class="mb-4 pb-3">Log In</h4>
                                            
                                            <div class="form-group">
                                                <input 
                                                    type="email" 
                                                    v-model="loginForm.email"
                                                    class="form-style" 
                                                    placeholder="Your Email" 
                                                    :id="'logemail-' + uniqueId"
                                                    autocomplete="off"
                                                    @keyup.enter="handleLogin"
                                                >
                                                <i class="input-icon uil uil-at"></i>
                                            </div>
                                            
                                            <div class="form-group mt-2">
                                                <input 
                                                    type="password" 
                                                    v-model="loginForm.password"
                                                    class="form-style" 
                                                    placeholder="Your Password" 
                                                    :id="'logpass-' + uniqueId"
                                                    autocomplete="off"
                                                    @keyup.enter="handleLogin"
                                                >
                                                <i class="input-icon uil uil-lock-alt"></i>
                                            </div>
                                            
                                            <button @click="handleLogin" class="btn mt-4">submit</button>
                                            <p class="mb-0 mt-4 text-center">
                                                <a href="#" @click.prevent="forgotPassword" class="link">Forgot your password?</a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Signup Form (Back) -->
                                <div class="card-back">
                                    <div class="center-wrap">
                                        <div class="section text-center">
                                            <h4 class="mb-4 pb-3">Sign Up</h4>
                                            
                                            <div class="form-group">
                                                <input 
                                                    type="text" 
                                                    v-model="signupForm.name"
                                                    class="form-style" 
                                                    placeholder="Your Name" 
                                                    :id="'signup-name-' + uniqueId"
                                                    autocomplete="off"
                                                    @keyup.enter="handleSignup"
                                                >
                                                <i class="input-icon uil uil-user"></i>
                                            </div>
                                            
                                            <div class="form-group mt-2">
                                                <input 
                                                    type="text" 
                                                    v-model="signupForm.surname"
                                                    class="form-style" 
                                                    placeholder="Your Surname" 
                                                    :id="'signup-surname-' + uniqueId"
                                                    autocomplete="off"
                                                    @keyup.enter="handleSignup"
                                                >
                                                <i class="input-icon uil uil-user"></i>
                                            </div>
                                            
                                            <div class="form-group mt-2">
                                                <input 
                                                    type="email" 
                                                    v-model="signupForm.email"
                                                    class="form-style" 
                                                    placeholder="Your Email" 
                                                    :id="'signup-email-' + uniqueId"
                                                    autocomplete="off"
                                                    @keyup.enter="handleSignup"
                                                >
                                                <i class="input-icon uil uil-at"></i>
                                            </div>
                                            
                                            <div class="form-group mt-2">
                                                <input 
                                                    type="password" 
                                                    v-model="signupForm.password"
                                                    class="form-style" 
                                                    placeholder="Your Password" 
                                                    :id="'signup-pass-' + uniqueId"
                                                    autocomplete="off"
                                                    @keyup.enter="handleSignup"
                                                >
                                                <i class="input-icon uil uil-lock-alt"></i>
                                            </div>
                                            
                                            <div class="form-group mt-2">
                                                <select 
                                                    v-model="signupForm.areaCode"
                                                    class="form-style select-style"
                                                    :id="'signup-area-' + uniqueId"
                                                >
                                                    <option value="" disabled selected>Select Cape Town Area</option>
                                                    <option value="8001">Cape Town City Centre (8001)</option>
                                                    <option value="8005">Sea Point (8005)</option>
                                                    <option value="7700">Rondebosch (7700)</option>
                                                    <option value="7708">Claremont (7708)</option>
                                                    <option value="7800">Constantia (7800)</option>
                                                    <option value="7945">Tokai (7945)</option>
                                                    <option value="7806">Hout Bay (7806)</option>
                                                    <option value="7441">Blouberg (7441)</option>
                                                    <option value="7443">Parklands (7443)</option>
                                                    <option value="7530">Bellville (7530)</option>
                                                    <option value="7570">Durbanville (7570)</option>
                                                    <option value="7640">Milnerton (7640)</option>
                                                    <option value="7130">Somerset West (7130)</option>
                                                    <option value="7140">Strand (7140)</option>
                                                    <option value="7800">Kirstenhof (7800)</option>
                                                    <option value="7945">Bergvliet (7945)</option>
                                                    <option value="7800">Meadowridge (7800)</option>
                                                    <option value="7708">Kenilworth (7708)</option>
                                                    <option value="7945">Lakeside (7945)</option>
                                                    <option value="7800">Muizenberg (7800)</option>
                                                </select>
                                                <i class="input-icon uil uil-location-point"></i>
                                            </div>
                                            
                                            <button @click="handleSignup" class="btn mt-4">submit</button>
                                        </div>
                                    </div>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Generate unique ID for this component instance
const uniqueId = Math.random().toString(36).substring(2, 10)
const checkboxId = `reg-log-${uniqueId}`

// State
const isFlipped = ref(false)

const loginForm = reactive({
    email: '',
    password: ''
})

const signupForm = reactive({
    name: '',
    surname: '',
    email: '',
    password: '',
    areaCode: ''
})

// Cape Town area codes for reference
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

// Methods
const handleLogin = () => {
    console.log('Login attempt:', loginForm)
    
    // Basic validation
    if (!loginForm.email || !loginForm.password) {
        alert('Please fill in all fields')
        return
    }
    
    // Use auth store
    authStore.login(loginForm.email)
    
    alert(`Welcome back, ${loginForm.email}!`)
    router.push('/')
}

const handleSignup = () => {
    console.log('Signup attempt:', signupForm)
    
    // Basic validation
    if (!signupForm.name || !signupForm.surname || !signupForm.email || !signupForm.password || !signupForm.areaCode) {
        alert('Please fill in all fields and select your area code')
        return
    }
    
    if (signupForm.password.length < 6) {
        alert('Password must be at least 6 characters long')
        return
    }
    
    // Get area name from code
    const selectedArea = capeTownAreas.find(area => area.code === signupForm.areaCode)
    const location = selectedArea ? `${selectedArea.area} (${selectedArea.code})` : signupForm.areaCode
    
    // Use auth store
    authStore.signup({
        name: signupForm.name,
        surname: signupForm.surname,
        fullName: `${signupForm.name} ${signupForm.surname}`,
        email: signupForm.email,
        location: location
    })
    
    alert(`Welcome to the community, ${signupForm.name}! Let's set up your preferences.`)
    router.push('/preferences')
}

const forgotPassword = () => {
    console.log('Forgot password clicked')
    alert('Password reset functionality would be implemented here')
}
</script>

<style scoped>
[type="checkbox"]:checked,
[type="checkbox"]:not(:checked) {
    position: absolute;
    left: -9999px;
}

.checkbox:checked + label,
.checkbox:not(:checked) + label {
    position: relative;
    display: block;
    text-align: center;
    width: 60px;
    height: 16px;
    border-radius: 8px;
    padding: 0;
    margin: 10px auto;
    cursor: pointer;
    background-color: #ffeba7;
}

.checkbox:checked + label:before,
.checkbox:not(:checked) + label:before {
    position: absolute;
    display: block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    color: #ffeba7;
    background-color: #eef2ff;
    font-family: 'unicons';
    content: '\eb4f';
    z-index: 20;
    top: -10px;
    left: -10px;
    line-height: 36px;
    text-align: center;
    font-size: 24px;
    transition: all 0.5s ease;
}

.checkbox:checked + label:before {
    transform: translateX(44px) rotate(-270deg);
}

.card-3d-wrap {
    position: relative;
    width: 440px;
    max-width: 100%;
    height: 550px;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    perspective: 800px;
    margin-top: 60px;
}

.card-3d-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    transition: all 600ms ease-out;
}

.card-3d-wrapper.rotate {
    transform: rotateY(180deg);
}

.card-front,
.card-back {
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    background-image: url('/src/assets/bg.svg');
    background-position: bottom center;
    background-repeat: no-repeat;
    background-size: 300%;
    position: absolute;
    border-radius: 6px;
    left: 0;
    top: 0;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    -webkit-backface-visibility: hidden;
    -moz-backface-visibility: hidden;
    -o-backface-visibility: hidden;
    backface-visibility: hidden;
}

.card-back {
    transform: rotateY(180deg);
}

.center-wrap {
    position: absolute;
    width: 100%;
    padding: 0 35px;
    top: 50%;
    left: 0;
    transform: translate3d(0, -50%, 35px) perspective(100px);
    z-index: 20;
    display: block;
}

.form-group {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
}

.form-style {
    padding: 13px 20px;
    padding-left: 55px;
    height: 48px;
    width: 100%;
    font-weight: 500;
    border-radius: 4px;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.5px;
    outline: none;
    color: #c4c3ca;
    background-color: #989dbb;
    border: none;
    transition: all 200ms linear;
    box-shadow: 0 4px 8px 0 rgba(21,21,21,.2);
}

.select-style {
    padding-left: 55px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

.select-style option {
    background-color: #1f2029;
    color: #d1cee2;
    padding: 10px;
}

.form-style:focus,
.form-style:active {
    border: none;
    outline: none;
    box-shadow: 0 4px 8px 0 rgba(21,21,21,.2);
}

.input-icon {
    position: absolute;
    top: 0;
    left: 18px;
    height: 48px;
    font-size: 24px;
    line-height: 48px;
    text-align: left;
    color: #ffeba7;
    transition: all 200ms linear;
    z-index: 10;
}

.form-group input::placeholder {
    color: #fbfaff;
    opacity: 0.7;
    transition: all 200ms linear;
}

.form-group input:focus::placeholder {
    opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 576px) {
    .card-3d-wrap {
        width: 100%;
        height: 600px;
    }
    
    .center-wrap {
        padding: 0 20px;
    }
}
</style>