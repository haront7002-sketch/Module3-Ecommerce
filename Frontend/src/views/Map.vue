<template>
  <div class="map-container">
    <!-- Top bar -->
    <div class="map-header">
      <div class="brand">
        <div class="logo">SOS</div>
        <div>
          <h1>{{ userLocation || 'Cape Town' }} Events Map</h1>
          <p class="subtitle">Explore what's happening near you</p>
        </div>
      </div>

      <div class="stats">
        <span class="stat-item">
          <i class="uil uil-map-marker"></i> {{ eventStore.filteredEvents.length }} events
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
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- Main content -->
    <div class="map-main">
      <!-- Sidebar panel -->
      <aside class="panel glass-card">
        <div class="panel-header">
          <h2>Events</h2>
          <span class="pill">{{ eventStore.filteredEvents.length }}</span>
        </div>

        <div v-if="eventStore.loading" class="loading-state">
          <div class="loader"></div>
          <p>Loading events...</p>
        </div>

        <div v-else class="events-list">
          <button
            v-for="ev in eventStore.filteredEvents"
            :key="ev.id"
            class="event-item"
            @click="focusEvent(ev)"
          >
            <div class="event-item-top">
              <span class="event-emoji">{{ ev.emoji || '🎉' }}</span>
              <div class="event-item-text">
                <div class="event-title-row">
                  <span class="event-title">{{ ev.title }}</span>
                  <span class="event-price">R {{ ev.price }}</span>
                </div>
                <div class="event-area">{{ ev.location?.area || ev.area }}</div>
              </div>
            </div>
            <div class="event-desc">{{ ev.description }}</div>
            <div class="event-time">
              <i class="uil uil-calendar-alt"></i> {{ formatDate(ev.startDate) }}
            </div>
          </button>

          <div v-if="eventStore.filteredEvents.length === 0" class="empty-state">
            <i class="uil uil-map-marker-slash"></i>
            <p>No events match your search</p>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMoreEvents" class="load-more">
          <button @click="loadMoreEvents" class="load-more-btn" :disabled="eventStore.loading">
            <span v-if="eventStore.loading" class="loader-small"></span>
            <span v-else>Load More</span>
          </button>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue"
import { useRouter } from "vue-router"
import { useEventStore } from "@/stores/event"
import { useFavouritesStore } from "@/stores/favourites"
import { useAuthStore } from "@/stores/auth"

const router = useRouter()
const eventStore = useEventStore()
const favouritesStore = useFavouritesStore()
const authStore = useAuthStore()

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

const mapEl = ref(null);
let map = null;
let L = null;
const page = ref(1);
const hasMoreEvents = ref(true);
const query = ref("");
const userLocation = ref(authStore.user?.location || "Cape Town");

// Keep marker references
const markerById = new Map();

// Computed
const userLatLng = computed(() => {
  return authStore.user?.preferences?.location?.coordinates || { lat: -33.9249, lng: 18.4241 }
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Popup HTML
const popupHtml = (ev) => {
  const isFav = favouritesStore.favouriteIds.includes(ev.id)
  return `
    <div style="min-width:220px">
      <div style="display:flex; gap:10px; align-items:flex-start;">
        <div style="font-size:22px; line-height:1;">${ev.emoji || '🎉'}</div>
        <div>
          <h3 style="margin:0 0 6px; font-size:14px; color:#333;">${ev.title}</h3>
          <div style="margin:0 0 6px; color:#666; font-size:12px;">${ev.location?.area || ev.area}</div>
          <div style="margin:0 0 6px; font-size:12px;">${formatDate(ev.startDate)}</div>
          <div style="margin:0 0 8px; font-size:12px; color:#444;">${ev.description.substring(0, 60)}${ev.description.length > 60 ? '...' : ''}</div>
          <div style="margin:0 0 10px; font-size:12px;"><b style="color:#333;">Price:</b> <span style="color:#4caf50;">R ${ev.price}</span></div>
          <div style="display:flex; gap:5px;">
            <button id="fav-${ev.id}" style="padding:8px;border-radius:20px;border:0;background:${isFav ? '#ff6b6b' : '#f0f0f0'};color:${isFav ? 'white' : '#333'};cursor:pointer;flex:1;">
              ${isFav ? '❤️ Saved' : '🤍 Save'}
            </button>
            <button id="pay-${ev.id}" style="padding:8px;border-radius:20px;border:0;background:#4caf50;color:#fff;cursor:pointer;flex:1;">
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

// Wire up buttons
const wirePopupButtons = (ev) => {
  const marker = markerById.get(ev.id);
  if (marker) {
    marker.off("popupopen");
    marker.on("popupopen", () => {
      setTimeout(() => {
        const favBtn = document.getElementById(`fav-${ev.id}`);
        const payBtn = document.getElementById(`pay-${ev.id}`);
        
        if (favBtn) {
          favBtn.onclick = async (e) => {
            e.stopPropagation();
            if (favouritesStore.favouriteIds.includes(ev.id)) {
              await favouritesStore.removeFromFavourites(ev.id);
              marker.closePopup();
              marker.openPopup(); // Refresh popup
            } else {
              await favouritesStore.addToFavourites(ev);
              marker.closePopup();
              marker.openPopup(); // Refresh popup
            }
          };
        }
        
        if (payBtn) {
          payBtn.onclick = (e) => {
            e.stopPropagation();
            router.push({
              name: "payments",
              query: {
                eventId: ev.id,
                title: ev.title,
                date: formatDate(ev.startDate),
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
  const lat = ev.location?.coordinates?.lat || ev.lat
  const lng = ev.location?.coordinates?.lng || ev.lng
  map.setView([lat, lng], 14, { animate: true });
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
    const lat = ev.location?.coordinates?.lat || ev.lat
    const lng = ev.location?.coordinates?.lng || ev.lng
    
    if (lat && lng) {
      const marker = L.marker([lat, lng]).addTo(map);
      markerById.set(ev.id, marker);

      marker.bindPopup(popupHtml(ev));
      wirePopupButtons(ev);
    }
  });

  // Fit bounds
  if (newEvents.length > 0) {
    const validEvents = newEvents.filter(ev => ev.location?.coordinates?.lat || ev.lat)
    if (validEvents.length > 0) {
      const group = L.featureGroup(
        validEvents.map((ev) => {
          const lat = ev.location?.coordinates?.lat || ev.lat
          const lng = ev.location?.coordinates?.lng || ev.lng
          return L.marker([lat, lng])
        })
      );
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }
};

const handleSearch = async () => {
  await eventStore.searchEvents(query.value)
  updateMarkers(eventStore.filteredEvents)
}

const loadMoreEvents = async () => {
  page.value++
  await eventStore.fetchEvents({ 
    page: page.value,
    limit: 20,
    lat: userLatLng.value.lat,
    lng: userLatLng.value.lng,
    distance: authStore.user?.preferences?.maxDistance || 50
  })
  
  if (eventStore.events.length === 0) {
    hasMoreEvents.value = false
  }
}

// Watch filtered events
watch(() => eventStore.filteredEvents, updateMarkers, { deep: true })

onMounted(async () => {
  L = await loadLeaflet();
  
  map = L.map(mapEl.value, { zoomControl: true }).setView(
    [userLatLng.value.lat, userLatLng.value.lng], 
    12
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Load events near user location
  await eventStore.fetchEvents({
    lat: userLatLng.value.lat,
    lng: userLatLng.value.lng,
    distance: authStore.user?.preferences?.maxDistance || 50,
    page: 1,
    limit: 50
  })
  
  await favouritesStore.fetchFavourites()
  updateMarkers(eventStore.events)
});

onBeforeUnmount(() => {
  markerById.forEach((marker) => {
    if (map) map.removeLayer(marker);
  });
  markerById.clear();
  if (map) {
    map.remove();
    map = null;
  }
});
</script>

<style scoped>
/* Keep all existing styles from original Map.vue */
.map-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  padding: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

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

.event-time {
  margin-top: 8px;
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  display: flex;
  align-items: center;
  gap: 4px;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: white;
}

.loader {
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #EEAECA;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
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

.load-more {
  padding: 15px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.load-more-btn {
  padding: 10px 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.map-card {
  overflow: hidden;
  height: calc(100vh - 200px);
}

.map {
  height: 100%;
  width: 100%;
}

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