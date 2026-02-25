<template>
  <div class="loader-wrap" :class="{ 'fade-out': isExiting }">
    <!-- gradient bg -->
    <div class="bg"></div>

    <!-- floating cards (tinder vibe) -->
    <div class="cards-bg">
      <div class="card" v-for="n in 6" :key="n"></div>
    </div>

    <!-- center content -->
    <div class="center">
      <div class="sos-badge">
        <span>SOS</span>
      </div>
      
      <div class="headline">
        <span class="line">South</span>
        <span class="line">Of</span>
        <span class="line">Somewhere</span>
      </div>
      
      <div class="subtitle">Discover · Swipe · Explore</div>
      
      <div class="swipe-hints">
        <div class="hint left">
          <div class="hint-icon">✕</div>
          <span>Skip</span>
        </div>
        <div class="hint right">
          <div class="hint-icon">♥</div>
          <span>Going</span>
        </div>
      </div>
    </div>

    <!-- progress bar -->
    <div class="progress-wrap">
      <div class="progress-track">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-label">Finding events near you</div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'WelcomeAnimation',
  emits: ['completed'],
  setup(props, { emit }) {
    const router = useRouter()
    const isExiting = ref(false)

    onMounted(() => {
      // After animation completes, emit event to parent
      setTimeout(() => {
        isExiting.value = true
        setTimeout(() => {
          emit('completed')
        }, 500)
      }, 5600) // 5.6 seconds for animation
    })

    return {
      isExiting
    }
  }
}
</script>

<style scoped>
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --pink-deep: #c01a62;
  --pink-mid: #fe6bab;
  --green: #9fef7d;
  --white: #ffffff;
}

.loader-wrap {
  position: fixed;
  inset: 0;
  background: #0d0d0d;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
  z-index: 9999;
}

.loader-wrap.fade-out {
  animation: pageOut 0.5s ease forwards;
}

@keyframes pageOut {
  to { opacity: 0; pointer-events: none; }
}

/* gradient bg */
.bg {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  opacity: 0;
  animation: bgReveal 0.8s 0.2s ease forwards;
}

@keyframes bgReveal {
  to { opacity: 1; }
}

/* grain overlay */
.bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E");
  background-size: 180px;
  opacity: 0.35;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* floating cards (tinder vibe) */
.cards-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.card {
  position: absolute;
  border-radius: 20px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.25);
  animation: floatCard var(--d) var(--delay) ease-in-out infinite alternate;
}

.card:nth-child(1) { width: 140px; height: 200px; top: 8%; left: 5%; --d: 4s; --delay: 0s; transform: rotate(-12deg); }
.card:nth-child(2) { width: 110px; height: 160px; top: 15%; right: 8%; --d: 5s; --delay: 0.5s; transform: rotate(8deg); }
.card:nth-child(3) { width: 90px; height: 130px; bottom: 18%; left: 7%; --d: 3.5s; --delay: 1s; transform: rotate(5deg); }
.card:nth-child(4) { width: 120px; height: 170px; bottom: 10%; right: 6%; --d: 4.5s; --delay: 0.3s; transform: rotate(-7deg); }
.card:nth-child(5) { width: 70px; height: 100px; top: 50%; left: 2%; --d: 6s; --delay: 0.8s; transform: rotate(15deg); }
.card:nth-child(6) { width: 80px; height: 110px; top: 40%; right: 3%; --d: 5.5s; --delay: 1.2s; transform: rotate(-10deg); }

@keyframes floatCard {
  from { transform: translateY(0px) rotate(0deg); }
  to   { transform: translateY(-18px) rotate(3deg); }
}

/* center content */
.center {
  position: relative;
  z-index: 10;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

/* SOS badge */
.sos-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 0 0 0 rgba(255,255,255,0.5);
  margin-bottom: 28px;
  opacity: 0;
  transform: scale(0.5);
  animation: popIn 0.6s 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards, pulse 2.4s 1.4s ease-in-out infinite;
}

.sos-badge span {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-style: italic;
  font-size: 28px;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -1px;
}

@keyframes popIn {
  to { opacity: 1; transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
  50%       { box-shadow: 0 0 0 18px rgba(255,255,255,0); }
}

/* headline */
.headline {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-style: italic;
  color: white;
  font-size: clamp(52px, 12vw, 96px);
  line-height: 0.9;
  letter-spacing: -2px;
  overflow: hidden;
}

.headline .line {
  display: block;
  opacity: 0;
  transform: translateY(60px);
}

.headline .line:nth-child(1) { animation: slideUp 0.7s 1s cubic-bezier(0.22,1,0.36,1) forwards; }
.headline .line:nth-child(2) { animation: slideUp 0.7s 1.15s cubic-bezier(0.22,1,0.36,1) forwards; }
.headline .line:nth-child(3) { animation: slideUp 0.7s 1.3s cubic-bezier(0.22,1,0.36,1) forwards; }

@keyframes slideUp {
  to { opacity: 1; transform: translateY(0); }
}

/* subtitle */
.subtitle {
  color: rgba(255,255,255,0.85);
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-top: 20px;
  opacity: 0;
  animation: fadeUp 0.6s 1.6s ease forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* swipe icons */
.swipe-hints {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 40px;
  opacity: 0;
  animation: fadeUp 0.6s 1.9s ease forwards;
}

.hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.7);
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hint-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: transform 0.2s;
}

.hint.left .hint-icon  { background: rgba(192,26,98,0.3); }
.hint.right .hint-icon { background: rgba(159,239,125,0.25); color: #9fef7d; }

/* progress bar */
.progress-wrap {
  position: fixed;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  width: min(280px, 70vw);
  z-index: 20;
  opacity: 0;
  animation: fadeUp 0.5s 2.1s ease forwards;
}

.progress-track {
  height: 3px;
  background: rgba(255,255,255,0.25);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  width: 0%;
  border-radius: 2px;
  background: white;
  animation: loadBar 2.5s 2.3s cubic-bezier(0.4,0,0.2,1) forwards;
}

@keyframes loadBar {
  0%   { width: 0%; }
  60%  { width: 70%; }
  85%  { width: 88%; }
  100% { width: 100%; }
}

.progress-label {
  text-align: center;
  color: rgba(255,255,255,0.6);
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-top: 10px;
}
</style>