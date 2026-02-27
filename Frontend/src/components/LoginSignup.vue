<template>
  <div class="section">
    <div class="container">
      <div class="row full-height justify-content-center">
        <div class="col-12 text-center align-self-center py-5">
          <div class="section pb-5 pt-5 pt-sm-2 text-center">
            <h6 class="mb-0 pb-3">
              <span>Log In </span><span> Sign Up</span>
            </h6>
            <input :id="checkboxId" class="checkbox" type="checkbox" v-model="isFlipped" />
            <label :for="checkboxId" class="checkbox"></label>
            <div class="card-3d-wrap mx-auto">
              <div class="card-3d-wrapper" :class="{ rotate: isFlipped }">
                <!-- Login Card -->
                <div class="card-front">
                  <div class="center-wrap">
                    <div class="section text-center">
                      <div class="logo" aria-label="South of Somewhere">
                        <span>SOS</span>
                      </div>
                      <h4 class="mb-4 pb-3">Log In</h4>
                      <div class="form-group mt-2">
                        <input 
                          type="email" 
                          class="form-style" 
                          placeholder="Your Email" 
                          v-model="loginForm.email"
                        />
                        <i class="input-icon uil uil-at"></i>
                      </div>
                      <div class="form-group mt-2">
                        <input 
                          type="password" 
                          class="form-style" 
                          placeholder="Your Password" 
                          v-model="loginForm.password"
                          @keyup.enter="handleLogin"
                        />
                        <i class="input-icon uil uil-lock-alt"></i>
                      </div>
                      <button class="btn mt-4" @click="handleLogin">submit</button>
                      <p class="mb-0 mt-4 text-center">
                        <a href="#" class="link" @click.prevent="forgotPassword">Forgot your password?</a>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Signup Card -->
                <div class="card-back">
                  <div class="center-wrap">
                    <div class="section text-center">
                      <h4 class="mb-4 pb-3">Sign Up</h4>
                      <div class="form-group mt-2">
                        <input 
                          type="text" 
                          class="form-style" 
                          placeholder="Your Name" 
                          v-model="signupForm.name"
                        />
                        <i class="input-icon uil uil-user"></i>
                      </div>
                      <div class="form-group mt-2">
                        <input 
                          type="text" 
                          class="form-style" 
                          placeholder="Your Surname" 
                          v-model="signupForm.surname"
                        />
                        <i class="input-icon uil uil-user-circle"></i>
                      </div>
                      <div class="form-group mt-2">
                        <input 
                          type="email" 
                          class="form-style" 
                          placeholder="Email" 
                          v-model="signupForm.email"
                        />
                        <i class="input-icon uil uil-at"></i>
                      </div>
                      <div class="form-group mt-2">
                        <input 
                          type="password" 
                          class="form-style" 
                          placeholder="Password (min 6 characters)" 
                          v-model="signupForm.password"
                        />
                        <i class="input-icon uil uil-lock-alt"></i>
                      </div>
                      <div class="form-group mt-2">
                        <select class="form-style select-style" v-model="signupForm.areaCode">
                          <option value="" disabled selected>Select Cape Town Area</option>
                          <option v-for="area in capeTownAreas" :key="area.code" :value="area.code">
                            {{ area.area }} ({{ area.code }})
                          </option>
                        </select>
                        <i class="input-icon uil uil-map-pin"></i>
                      </div>
                      <button class="btn mt-4" @click="handleSignup">submit</button>
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
import { useStore } from 'vuex'

export default {
  name: 'LoginSignup',
  setup() {
    const router = useRouter()
    const store = useStore()

const handleLogin = async () => {
  if (!loginForm.email || !loginForm.password) {
    alert('Please fill in all fields')
    return
  }

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

    const handleLogin = async () => {
      if (!loginForm.email || !loginForm.password) {
        alert('Please fill in all fields')
        return
      }

      const result = await store.dispatch('login', {
        email: loginForm.email,
        password: loginForm.password
      })

      if (!result?.success) {
        alert(result?.error || 'Login failed')
        return
      }

      sessionStorage.setItem('justLoggedIn', 'true')
      window.location.reload()
    }

    const handleSignup = async () => {
      if (!signupForm.name || !signupForm.surname || !signupForm.email || !signupForm.password || !signupForm.areaCode) {
        alert('Please fill in all fields and select your area code')
        return
      }

      if (signupForm.password.length < 6) {
        alert('Password must be at least 6 characters long')
        return
      }

      const selectedArea = capeTownAreas.find((area) => area.code === signupForm.areaCode)
      const location = selectedArea ? `${selectedArea.area} (${selectedArea.code})` : signupForm.areaCode

      const result = await store.dispatch('register', {
        user_name: signupForm.name,
        user_surname: signupForm.surname,
        email: signupForm.email,
        password: signupForm.password,
        country: 'South Africa',
        zip_code: signupForm.areaCode,
        area: location
      })

      if (!result?.success) {
        alert(result?.error || 'Signup failed')
        return
      }

      router.push('/preferences')
    }

    const forgotPassword = () => {
      alert('Password reset functionality would be implemented here')
      router.push('/')
    }

    return {
      checkboxId,
      isFlipped,
      loginForm,
      signupForm,
      capeTownAreas,
      handleLogin,
      handleSignup,
      forgotPassword
    }
  }
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
    background: linear-gradient(90deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.checkbox:checked + label:before,
.checkbox:not(:checked) + label:before {
    position: absolute;
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: #ffffff;
    background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
    font-family: 'unicons';
    content: '\eb4f';
    z-index: 20;
    top: -14px;
    left: -5px;
    line-height: 40px;
    text-align: center;
    font-size: 24px;
    transition: all 0.5s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.5);
}

.checkbox:checked + label:before {
    transform: translateX(44px) rotate(-360deg);
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
    background: rgba(255, 255, 255, 0.1) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
    position: absolute;
    border-radius: 25px;
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

/* Match navbar logo style from App.vue */
.logo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 48px;
    background: white;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    margin: 0 auto 20px;
}

.logo span {
    background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: inline-block;
}

.form-group {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
}

.form-style {
    padding: 15px 20px;
    padding-left: 55px;
    height: 52px;
    width: 100%;
    font-weight: 500;
    border-radius: 50px;
    font-size: 14px;
    line-height: 22px;
    letter-spacing: 0.5px;
    outline: none;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.15);
    border: 2px solid rgba(255, 255, 255, 0.2);
    transition: all 300ms ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.select-style {
    padding-left: 55px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
}

.select-style option {
    background-color: #c01a62;
    color: #ffffff;
    padding: 10px;
}

.form-style:focus,
.form-style:active {
    border: 2px solid #AEE994;
    outline: none;
    box-shadow: 0 8px 25px rgba(174, 233, 148, 0.3);
    background: rgba(255, 255, 255, 0.2);
}

.input-icon {
    position: absolute;
    top: 0;
    left: 18px;
    height: 52px;
    font-size: 24px;
    line-height: 52px;
    text-align: left;
    color: #ffffff;
    transition: all 300ms ease;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.form-group:focus-within .input-icon {
    color: #AEE994;
    transform: scale(1.1);
}

.form-group input::placeholder {
    color: rgba(255, 255, 255, 0.7);
    opacity: 0.8;
    transition: all 300ms ease;
}

.form-group input:focus::placeholder {
    opacity: 0;
    transform: translateX(10px);
}

.btn {  
    border-radius: 50px;
    height: 48px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    transition: all 300ms ease;
    padding: 0 35px;
    letter-spacing: 1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    border: none;
    background: linear-gradient(45deg, #EEAECA, #ffb5d1);
    color: #ffffff;
    box-shadow: 0 10px 20px rgba(238, 174, 202, 0.3);
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
}

.btn:hover::before {
    left: 100%;
}

.btn:hover {  
    background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
    color: #ffffff;
    box-shadow: 0 15px 30px rgba(174, 233, 148, 0.5);
    transform: translateY(-3px);
}

h4 {
    font-weight: 600;
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(238, 174, 202, 0.3);
}

h6 {
    color: #ffffff;
    font-weight: 600;
}

h6 span {
    padding: 0 20px;
    text-transform: uppercase;
    font-weight: 700;
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(174, 233, 148, 0.3);
}

.link {
    color: #ffffff;
    opacity: 0.9;
}

.link:hover {
    color: #AEE994;
    opacity: 1;
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
    
    .btn {
        height: 44px;
        font-size: 13px;
        padding: 0 25px;
    }
}
</style>
