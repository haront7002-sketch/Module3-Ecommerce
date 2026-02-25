<template>
  <div class="loader-wrap" :class="{ 'fade-out': isExiting }">
    <!-- gradient bg -->
    <div class="bg"></div>

    <!-- floating cards drifting away -->
    <div class="cards-bg">
      <div class="card" v-for="n in 6" :key="n"></div>
    </div>

    <!-- first act: goodbye message fades -->
    <div class="center" :class="{ 'hidden': showFarewell }">
      <div class="sos-badge">
        <span>SOS</span>
      </div>
      
      <div class="headline">
        <span class="line">South</span>
        <span class="line">Of</span>
        <span class="line">Somewhere</span>
      </div>
      
      <div class="goodbye">Signing you out…</div>
    </div>

    <!-- second act: farewell message -->
    <div class="farewell" :class="{ 'visible': showFarewell }">
      <span class="heart">♥</span>
      <div class="farewell-title">See you soon.</div>
      <div class="farewell-sub">The night's still out there</div>
      <div class="swipe-out">
        <span>Swipe again anytime</span>
        <span class="arrow">→</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'GoodbyeAnimation',
  emits: ['completed'],
  setup(props, { emit }) {
    const showFarewell = ref(false)
    const isExiting = ref(false)

    onMounted(() => {
      // Show farewell message after first act
      setTimeout(() => {
        showFarewell.value = true
      }, 3800)

      // Emit completion after full animation
      setTimeout(() => {
        isExiting.value = true
        setTimeout(() => {
          emit('completed')
        }, 500)
      }, 8000) // 8 seconds for full animation
    })

    return {
      showFarewell,
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

.hidden {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* gradient bg */
.bg {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  opacity: 0;
  animation: bgReveal 0.8s 0.2s ease forwards;
}

@keyframes bgReveal { to { opacity: 1; } }

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

/* floating cards drifting away */
.cards-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
}

.card {
  position: absolute;
  border-radius: 20px;
  background: rgba(255,255,255,0.10);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.2);
  opacity: 0;
  animation: driftIn var(--d) var(--delay) ease-out forwards;
}

.card:nth-child(1) { width: 140px; height: 200px; top: 8%;  left: 5%;  --d: 3s; --delay: 0.4s; }
.card:nth-child(2) { width: 110px; height: 160px; top: 15%; right: 8%; --d: 3s; --delay: 0.7s; }
.card:nth-child(3) { width: 90px;  height: 130px; bottom: 18%; left: 7%; --d: 3s; --delay: 1s;  }
.card:nth-child(4) { width: 120px; height: 170px; bottom: 10%; right: 6%; --d: 3s; --delay: 0.5s; }
.card:nth-child(5) { width: 70px;  height: 100px; top: 50%; left: 2%;  --d: 3s; --delay: 1.1s; }
.card:nth-child(6) { width: 80px;  height: 110px; top: 40%; right: 3%; --d: 3s; --delay: 0.9s; }

@keyframes driftIn {
  0%   { opacity: 0; transform: translateY(30px) rotate(0deg); }
  30%  { opacity: 1; }
  70%  { opacity: 1; transform: translateY(0px) rotate(0deg); }
  100% { opacity: 0.18; transform: translateY(-8px) rotate(2deg); }
}

/* center content */
.center {
  position: relative;
  z-index: 10;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.3s ease;
}

/* SOS badge — breaks apart on exit */
.sos-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: white;
  margin-bottom: 28px;
  opacity: 0;
  transform: scale(0.5);
  animation: popIn 0.6s 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards, badgeFade 0.8s 3.8s ease forwards;
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

@keyframes popIn   { to { opacity: 1; transform: scale(1); } }
@keyframes badgeFade { to { opacity: 0; transform: scale(0.7) translateY(-10px); } }

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

.headline .line:nth-child(1) { animation: slideUp 0.7s 1s   cubic-bezier(0.22,1,0.36,1) forwards, slideAway 0.6s 3.6s ease forwards; }
.headline .line:nth-child(2) { animation: slideUp 0.7s 1.15s cubic-bezier(0.22,1,0.36,1) forwards, slideAway 0.6s 3.7s ease forwards; }
.headline .line:nth-child(3) { animation: slideUp 0.7s 1.3s  cubic-bezier(0.22,1,0.36,1) forwards, slideAway 0.6s 3.8s ease forwards; }

@keyframes slideUp   { to { opacity: 1; transform: translateY(0); } }
@keyframes slideAway { to { opacity: 0; transform: translateY(-40px); } }

/* goodbye line */
.goodbye {
  color: rgba(255,255,255,0.9);
  font-size: clamp(13px, 3vw, 15px);
  font-weight: 300;
  letter-spacing: 5px;
  text-transform: uppercase;
  margin-top: 22px;
  opacity: 0;
  animation: fadeUp 0.6s 1.6s ease forwards, fadeOut 0.6s 3.5s ease forwards;
}

@keyframes fadeUp  { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeOut { to   { opacity: 0; transform: translateY(-8px); } }

/* second act: farewell message */
.farewell {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.farewell.visible {
  opacity: 1;
  animation: fadeUp 0.8s 4.2s ease forwards;
}

/* big heart */
.heart {
  font-size: 64px;
  display: block;
  opacity: 0;
  transform: scale(0.3);
  animation: heartPop 0.7s 4.4s cubic-bezier(0.34,1.56,0.64,1) forwards;
}

@keyframes heartPop { to { opacity: 1; transform: scale(1); } }

.farewell-title {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-style: italic;
  color: white;
  font-size: clamp(36px, 8vw, 64px);
  line-height: 1;
  letter-spacing: -1px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.6s 4.7s ease forwards;
}

.farewell-sub {
  color: rgba(255,255,255,0.75);
  font-size: 12px;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-weight: 300;
  opacity: 0;
  animation: fadeUp 0.5s 5s ease forwards;
}

/* swipe-away indicator */
.swipe-out {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  color: rgba(255,255,255,0.55);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0;
  animation: fadeUp 0.5s 5.3s ease forwards;
}

.arrow {
  display: inline-block;
  animation: arrowSlide 1.2s 5.5s ease-in-out infinite alternate;
}

@keyframes arrowSlide {
  from { transform: translateX(0); }
  to   { transform: translateX(6px); }
}
</style>