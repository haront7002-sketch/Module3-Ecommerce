<template>
  <div class="map-container">
    <!-- Top bar -->
    <div class="map-header">
      <div class="brand">
        <div class="logo">SOS</div>
        <div>
          <h1>Cape Town Events Map</h1>
          <p class="subtitle">Explore what's happening near you</p>
        </div>
      </div>

      <div class="stats">
        <span class="stat-item">
          <i class="uil uil-map-marker"></i> {{ filteredEvents.length }} events
        </span>
      </div>
    </div>

    <!-- Search -->
    <div class="search-section">
      <div class="search-wrapper">
        <i class="uil uil-search search-icon"></i>
        <input
          v-model.trim="query"
          class="search-input"
          placeholder="Search events by title, location, or category..."
        />
      </div>
    </div>

    <!-- Main content -->
    <div class="map-main">
      <!-- Sidebar panel -->
      <aside class="panel glass-card">
        <div class="panel-header">
          <h2>Events</h2>
          <span class="pill">{{ filteredEvents.length }}</span>
        </div>

        <div class="events-list">
          <button
            v-for="ev in filteredEvents"
            :key="ev.id"
            class="event-item"
            @click="focusEvent(ev)"
          >
            <div class="event-item-top">
              <span class="event-emoji">{{ ev.emoji }}</span>
              <div class="event-item-text">
                <div class="event-title-row">
                  <span class="event-title">{{ ev.title }}</span>
                  <span class="event-price">R {{ ev.price }}</span>
                </div>
                <div class="event-area">{{ ev.area }}</div>
              </div>
            </div>
            <div class="event-desc">{{ ev.description }}</div>
          </button>

          <div v-if="filteredEvents.length === 0" class="empty-state">
            <i class="uil uil-map-marker-slash"></i>
            <p>No events match your search</p>
          </div>
        </div>
      </aside>

      <!-- Map -->
      <section class="map-card glass-card">
        <div ref="mapEl" class="map"></div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();
const mapEl = ref(null);
let map = null;
let L = null;
const markerById = new Map();
const query = ref("");

// Load Leaflet from CDN dynamically
const loadLeaflet = () => {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    
    document.head.appendChild(link);
    
    script.onload = () => {
      resolve(window.L);
    };
    
    document.body.appendChild(script);
  });
};

// Events from Vuex
const events = computed(() => store.state.events);

// Filtered events
const filteredEvents = computed(() => {
  const q = query.value.toLowerCase().trim();
  if (!q) return events.value;
  return events.value.filter((e) => {
    return (
      e.title.toLowerCase().includes(q) ||
      e.area.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    );
  });
});

// Popup HTML
const popupHtml = (ev) => {
  return `
    <div style="min-width:220px">
      <div style="display:flex; gap:10px; align-items:flex-start;">
        <div style="font-size:22px; line-height:1;">${ev.emoji}</div>
        <div>
          <h3 style="margin:0 0 6px; font-size:14px; color:#333;">${ev.title}</h3>
          <div style="margin:0 0 6px; color:#666; font-size:12px;">${ev.area || ''}</div>
          <div style="margin:0 0 8px; font-size:12px; color:#444;">${ev.description || ''}</div>
          <div style="margin:0 0 10px; font-size:12px;"><b style="color:#333;">Price:</b> <span style="color:#4caf50;">R ${ev.price || 0}</span></div>
          <button id="pay-${ev.id}" style="padding:8px 12px;border-radius:20px;border:0;background:#4caf50;color:#fff;cursor:pointer;width:100%;">
            Book Tickets
          </button>
        </div>
      </div>
    </div>
  `;
};

// Wire up pay button
const wirePayButton = (ev) => {
  const marker = markerById.get(ev.id);
  if (marker) {
    marker.off("popupopen");
    marker.on("popupopen", () => {
      setTimeout(() => {
        const btn = document.getElementById(`pay-${ev.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            router.push({
              name: "payments",
              query: {
                eventId: ev.id,
                title: ev.title,
                date: "Today",
                price: ev.price,
              },
            });
          };
        }
      }, 50);
    });
  }
};

// Focus on event
const focusEvent = (ev) => {
  if (!map) return;
  map.setView([ev.lat, ev.lng], 14, { animate: true });
  const marker = markerById.get(ev.id);
  if (marker) {
    marker.openPopup();
  }
};

// Update markers
const updateMarkers = (newEvents) => {
  if (!map || !L) return;

  // Remove all existing markers
  markerById.forEach((marker) => {
    map.removeLayer(marker);
  });
  markerById.clear();

  // Add new markers
  newEvents.forEach((ev) => {
    const marker = L.marker([ev.lat, ev.lng]).addTo(map);
    markerById.set(ev.id, marker);

    marker.bindPopup(popupHtml(ev));
    wirePayButton(ev);
  });

  // Fit bounds
  if (newEvents.length > 0) {
    const group = L.featureGroup(
      newEvents.map((ev) => L.marker([ev.lat, ev.lng]))
    );
    map.fitBounds(group.getBounds(), { padding: [50, 50] });
  }
};

// Watch filtered events
watch(filteredEvents, updateMarkers, { deep: true });

onMounted(async () => {
  L = await loadLeaflet();
  
  map = L.map(mapEl.value, { zoomControl: true }).setView([-33.9249, 18.4241], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  updateMarkers(events.value);
});

onBeforeUnmount(() => {
  markerById.clear();
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
.map-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  padding: 20px;
}

/* Glass Card Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Header */
.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.brand {
  display: flex;
  gap: 15px;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 22px;
  color: #fff;
  background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

h1 {
  margin: 0;
  font-size: 26px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: rgba(255,255,255,0.9);
}

.stats {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

/* Search Section */
.search-section {
  margin-bottom: 20px;
  padding: 0 10px;
}

.search-wrapper {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.8);
  font-size: 18px;
}

.search-input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  outline: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  font-size: 14px;
  color: white;
}

.search-input::placeholder {
  color: rgba(255,255,255,0.7);
}

.search-input:focus {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.25);
}

/* Main Layout */
.map-main {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 20px;
  padding: 0 10px;
}

@media (max-width: 980px) {
  .map-main {
    grid-template-columns: 1fr;
  }
}

/* Sidebar Panel */
.panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: fit-content;
  max-height: calc(100vh - 200px);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.panel-header h2 {
  margin: 0;
  font-size: 16px;
  color: white;
  font-weight: 600;
}

.pill {
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.events-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.events-list::-webkit-scrollbar {
  width: 8px;
}

.events-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.events-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.events-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.4);
}

.event-item {
  width: 100%;
  text-align: left;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.event-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.event-item-top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.event-emoji {
  font-size: 24px;
  line-height: 1;
}

.event-item-text {
  flex: 1;
}

.event-title-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: baseline;
  margin-bottom: 4px;
}

.event-title {
  font-weight: 600;
  font-size: 14px;
  color: white;
}

.event-price {
  font-weight: 600;
  font-size: 13px;
  color: #AEE994;
  white-space: nowrap;
}

.event-area {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

.event-desc {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  line-height: 1.4;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: rgba(255,255,255,0.7);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 15px;
  color: rgba(255,255,255,0.4);
}

/* Map Card */
.map-card {
  overflow: hidden;
  height: calc(100vh - 200px);
}

.map {
  height: 100%;
  width: 100%;
}

/* Leaflet popup customization */
:deep(.leaflet-popup-content-wrapper) {
  background: white;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

:deep(.leaflet-popup-content) {
  margin: 15px;
}

:deep(.leaflet-popup-tip) {
  background: white;
}
</style>