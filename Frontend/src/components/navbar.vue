<template>
  <nav>
    <router-link to="/" class="logo">
      <div class="logo-mark">SOS</div>
      <div class="logo-name">
        <span class="logo-sub">South Of Somewhere</span>
      </div>
    </router-link>

    <ul class="nav-links">
      <li>
        <router-link to="/swipe" class="active" active-class="active">Swipe</router-link>
      </li>
      
      <!-- Add your dropdown items here if needed -->
    </ul>

    <!-- Log Out CTA -->
    <button class="cta-btn" @click="handleLogout">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Log Out
    </button>

    <button class="hamburger" :class="{ open: isMobileMenuOpen }" @click="toggleMobileMenu" aria-label="Toggle menu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
  </nav>

  <!-- Mobile Drawer -->
  <transition name="slide-down">
    <div class="mobile-drawer" :class="{ open: isMobileMenuOpen }" v-if="isMobileMenuOpen">
      <ul class="mobile-links">
        <li><router-link to="/swipe" @click="closeMobileMenu">Swipe</router-link></li>
        <li>
          <button class="mobile-expand-btn" @click="toggleMobileSubMenu('explore')">
            Explore
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="mobile-sub" :class="{ open: openMobileSub === 'explore' }">
            <a href="#">👟 Footwear</a>
            <a href="#">👜 Bags & Accessories</a>
            <a href="#">👕 Apparel</a>
            <a href="#">🌸 Summer Drops</a>
            <a href="#">⚡ Flash Sales</a>
          </div>
        </li>
        <li><router-link to="/favourites" @click="closeMobileMenu">Favourites</router-link></li>
        <li><router-link to="/about" @click="closeMobileMenu">About</router-link></li>
      </ul>
      <div class="mobile-cta">
        <button class="cta-btn" @click="handleLogout">Log Out</button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      isMobileMenuOpen: false,
      openMobileSub: null,
      openDropdown: null
    }
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
      // Prevent body scroll when menu is open
      document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : ''
    },
    closeMobileMenu() {
      this.isMobileMenuOpen = false
      document.body.style.overflow = ''
      this.openMobileSub = null
    },
    toggleMobileSubMenu(menu) {
      this.openMobileSub = this.openMobileSub === menu ? null : menu
    },
    toggleDropdown(dropdownId) {
      this.openDropdown = this.openDropdown === dropdownId ? null : dropdownId
    },
    handleLogout() {
      // Add your logout logic here
      console.log('Logging out...')
      this.closeMobileMenu()
    },
    handleClickOutside(event) {
      // Close dropdowns when clicking outside
      if (!event.target.closest('.dropdown-trigger') && !event.target.closest('.dropdown')) {
        this.openDropdown = null
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
/* Copy all your navbar styles here */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --pink:  #EEAECA;
  --green: #AEE994;
  --ink:   #0D0D0D;
  --white: #FAFAF7;
  --bg:    #FFFFFF;
  --text:  #1a1a1a;
  --nav-h: 72px;
  --grad:  linear-gradient(101deg, #EEAECA 0%, #AEE994 100%);
}

nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: var(--nav-h);
  display: flex;
  align-items: center;
  padding: 0 28px;
  background: #ffffff;
  border-bottom: 1.5px solid #ebebeb;
  z-index: 1000;
}

/* ── LOGO ── */
.logo {
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  flex-shrink: 0;
}
.logo-mark {
  width: 52px; height: 52px;
  border-radius: 13px;
  background: var(--grad);
  display: grid;
  place-items: center;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 14px;
  color: #fff;
  letter-spacing: 1.5px;
  transition: transform 0.28s cubic-bezier(.34,1.56,.64,1);
}
.logo:hover .logo-mark { transform: rotate(-8deg) scale(1.1); }
.logo-name { display: flex; flex-direction: column; line-height: 1; }
.logo-sub {
  font-family: 'Syne', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ── NAV LINKS ── */
.nav-links {
  display: flex;
  align-items: center;
  list-style: none;
  gap: 4px;
  margin-left: 40px;
}
.nav-links > li { position: relative; }
.nav-links a, .nav-links button.nav-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border-radius: 9px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14.5px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.18s, background 0.18s;
  white-space: nowrap;
}
.nav-links a:hover, .nav-links button.nav-btn:hover {
  color: var(--text);
  background: #f5f5f5;
}
.nav-links a.active {
  background: linear-gradient(101deg, rgba(238,174,202,0.18), rgba(174,233,148,0.18));
  color: #c97aaa;
}

/* ── DROPDOWN ── */
.caret {
  width: 14px; height: 14px;
  fill: none; stroke: currentColor;
  stroke-width: 2; stroke-linecap: round;
  transition: transform 0.25s;
}
.dropdown-trigger[aria-expanded="true"] .caret { transform: rotate(180deg); }

.dropdown {
  position: absolute;
  top: calc(100% + 12px);
  left: 50%;
  transform: translateX(-50%) translateY(-6px);
  background: #ffffff;
  border: 1.5px solid #ebebeb;
  border-radius: 16px;
  padding: 10px;
  min-width: 240px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s, transform 0.22s cubic-bezier(.34,1.4,.64,1);
  box-shadow: 0 16px 48px rgba(0,0,0,0.10);
}
.dropdown::before {
  content: '';
  position: absolute;
  top: -7px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 12px; height: 12px;
  background: #ffffff;
  border-top: 1.5px solid #ebebeb;
  border-left: 1.5px solid #ebebeb;
  border-radius: 3px 0 0 0;
}
.dropdown.open { opacity: 1; pointer-events: all; transform: translateX(-50%) translateY(0); }

.dropdown-section { margin-bottom: 4px; }
.dropdown-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #bbb;
  padding: 6px 10px 4px;
}
.dropdown a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  color: #555;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
}
.dropdown a:hover { background: #f5f5f5; color: var(--text); }
.dropdown-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  font-size: 15px;
  flex-shrink: 0;
}
.dd-badge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
}
.dropdown-divider { height: 1px; background: #f0f0f0; margin: 6px 4px; }

/* ── SPACER ── */
.spacer { flex: 1; }

/* ── ICON BUTTONS ── */
.icon-group { display: flex; align-items: center; gap: 4px; }
.icon-btn {
  position: relative;
  width: 40px; height: 40px;
  border-radius: 10px;
  border: none;
  background: none;
  color: #aaa;
  cursor: pointer;
  display: grid;
  place-items: center;
  transition: background 0.15s, color 0.15s;
}
.icon-btn:hover { background: #f5f5f5; color: var(--text); }
.icon-btn svg { width: 20px; height: 20px; }
.badge {
  position: absolute;
  top: 5px; right: 5px;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--pink);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
}

/* ── CTA BUTTON ── */
.cta-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  background: var(--grad);
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  margin-left: 10px;
  transition: transform 0.2s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s, filter 0.2s;
  white-space: nowrap;
}
.cta-btn:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 28px rgba(238,174,202,0.45);
  filter: brightness(1.06);
}
.cta-btn:active { transform: scale(0.97); }

/* ── HAMBURGER ── */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px; height: 40px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 10px;
  padding: 8px;
  transition: background 0.15s;
}
.hamburger:hover { background: #f5f5f5; }
.bar {
  height: 2px;
  border-radius: 2px;
  background: #555;
  transition: transform 0.3s, opacity 0.3s, width 0.3s;
}
.bar:nth-child(1) { width: 100%; }
.bar:nth-child(2) { width: 70%; }
.bar:nth-child(3) { width: 100%; }
.hamburger.open .bar:nth-child(1) { transform: translateY(7px) rotate(45deg); width: 100%; }
.hamburger.open .bar:nth-child(2) { opacity: 0; transform: translateX(-6px); }
.hamburger.open .bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ── MOBILE DRAWER ── */
.mobile-drawer {
  position: fixed;
  top: var(--nav-h);
  left: 0; right: 0;
  background: #ffffff;
  border-bottom: 1.5px solid #ebebeb;
  padding: 16px 20px 24px;
  transform: translateY(-110%);
  transition: transform 0.35s cubic-bezier(.77,0,.175,1);
  z-index: 999;
}
.mobile-drawer.open { transform: translateY(0); }
.mobile-links { list-style: none; }
.mobile-links li { border-bottom: 1px solid #f0f0f0; }
.mobile-links a, .mobile-expand-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 4px;
  color: #aaa;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
}
.mobile-links a:hover, .mobile-expand-btn:hover { color: var(--text); }
.mobile-links a.active { color: #c97aaa; }
.mobile-sub {
  display: none;
  padding: 4px 0 10px 16px;
  flex-direction: column;
  gap: 2px;
}
.mobile-sub.open { display: flex; }
.mobile-sub a { padding: 9px 8px; color: #999; font-size: 14px; border-bottom: none; }
.mobile-sub a:hover { color: var(--text); }
.mobile-cta { margin-top: 16px; display: flex; gap: 10px; }
.mobile-cta .cta-btn { flex: 1; justify-content: center; margin: 0; }
.mobile-cta .ghost-btn {
  flex: 1;
  padding: 11px 20px;
  border-radius: 10px;
  border: 1.5px solid #ddd;
  background: none;
  color: #888;
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}
.mobile-cta .ghost-btn:hover { border-color: #aaa; color: var(--text); }

/* Transition for mobile drawer */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.35s cubic-bezier(.77,0,.175,1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-110%);
}
.slide-down-enter-to,
.slide-down-leave-from {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 820px) {
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .cta-btn { display: none; }
}
</style>