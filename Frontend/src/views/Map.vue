<template>
  <div class="map-container">
    <!-- Top bar -->
    <div class="map-header">
      <div class="brand">
        <div>
          <h1>{{ userLocation || 'Cape Town' }} Events Map</h1>
          <p class="subtitle">Explore what's happening near you</p>
        </div>
      </div>

      <div class="stats">
        <span class="stat-item">
          <i class="uil uil-map-marker"></i> {{ visibleEventCount }} events
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
          <span class="pill">{{ visibleEventCount }}</span>
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
              <img class="event-emoji" :src="ev.image_url || 'https://placehold.co/56x56?text=Event'" alt="Event image" />
              <div class="event-item-text">
                <div class="event-title-row">
                  <span class="event-title">{{ ev.title }}</span>
                  <span class="event-price">R {{ ev.price }}</span>
                </div>
                <div class="event-area">{{ ev.location?.area || ev.area }}</div>
                <div class="event-distance">
                  <i class="uil uil-map-marker-distance"></i> {{ formatDistanceFromUser(ev) }}
                </div>
              </div>
            </div>
            <div class="event-desc">{{ ev.description }}</div>
            <div class="event-time">
              <i class="uil uil-calendar-alt"></i> {{ formatDate(ev.startDate) }}
            </div>
          </button>

          <div v-if="eventStore.filteredEvents.length === 0" class="empty-state">
            <i class="uil uil-map-marker-slash"></i>
            <p>No events in your {{ maxTravelDistance }} km radius</p>
          </div>
        </div>
        
        <!-- Load More by Radius -->
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const store = useStore()

const mapEl = ref(null)
let map = null
const markerById = new Map()
const query = ref('')
const loading = ref(false)
const fallbackEvents = ref([])
const visibleEventCount = ref(0)
const CAPE_TOWN_CENTER = { lat: -33.9249, lng: 18.4241 }
const currentDistanceLimit = ref(50)

const defaultMapEvents = [
  {
    id: 'map-1',
    title: 'Sunset Jazz on the Promenade',
    description: 'Live jazz and food trucks by the ocean.',
    area: 'Sea Point',
    category: 'Music & Nightlife',
    price: 180,
    image_url: 'https://placehold.co/120x120?text=Jazz',
    startDate: '2026-03-20T18:30:00',
    lat: -33.9075,
    lng: 18.3897
  },
  {
    id: 'map-2',
    title: 'Woodstock Artisan Market',
    description: 'Local stalls, craft coffee, and street food.',
    area: 'Woodstock',
    category: 'Food & Drink',
    price: 0,
    image_url: 'https://placehold.co/120x120?text=Market',
    startDate: '2026-03-21T10:00:00',
    lat: -33.9279,
    lng: 18.4448
  },
  {
    id: 'map-3',
    title: 'Rooftop Film Night',
    description: 'Outdoor cinema with city skyline views.',
    area: 'City Centre',
    category: 'Arts & Culture',
    price: 95,
    image_url: 'https://placehold.co/120x120?text=Film',
    startDate: '2026-03-22T19:00:00',
    lat: -33.9249,
    lng: 18.4241
  }
]

const AREA_COORDINATES = {
  'city centre': { lat: -33.9249, lng: 18.4241 },
  'cape town': { lat: -33.9249, lng: 18.4241 },
  'sea point': { lat: -33.9075, lng: 18.3897 },
  'blouberg': { lat: -33.8056, lng: 18.4694 },
  'parklands': { lat: -33.8278, lng: 18.5067 },
  'woodstock': { lat: -33.9279, lng: 18.4448 },
  'observatory': { lat: -33.9367, lng: 18.4642 },
  'green point': { lat: -33.9029, lng: 18.4106 },
  'claremont': { lat: -33.9806, lng: 18.4652 },
  'kenilworth': { lat: -33.9892, lng: 18.4916 },
  'rondebosch': { lat: -33.9608, lng: 18.4676 },
  'bellville': { lat: -33.9006, lng: 18.6292 },
  'durbanville': { lat: -33.8322, lng: 18.6491 },
  'milnerton': { lat: -33.8794, lng: 18.4951 },
  'somerset west': { lat: -34.0790, lng: 18.8433 },
  'strand': { lat: -34.1075, lng: 18.8271 },
  'constantia': { lat: -34.0314, lng: 18.4183 },
  'tokai': { lat: -34.0647, lng: 18.4414 },
  'kirstenhof': { lat: -34.0453, lng: 18.4319 },
  'bergvliet': { lat: -34.0470, lng: 18.4527 },
  'meadowridge': { lat: -34.0508, lng: 18.4521 },
  'lakeside': { lat: -34.0825, lng: 18.4354 },
  'muizenberg': { lat: -34.1076, lng: 18.4685 },
  'hout bay': { lat: -34.0431, lng: 18.3486 },
  'table mountain': { lat: -33.9628, lng: 18.4098 }
}

const ZIP_COORDINATES = {
  '8001': AREA_COORDINATES['city centre'],
  '8005': AREA_COORDINATES['sea point'],
  '7700': AREA_COORDINATES['rondebosch'],
  '7708': AREA_COORDINATES['claremont'],
  '7800': AREA_COORDINATES['constantia'],
  '7945': AREA_COORDINATES['tokai'],
  '7806': AREA_COORDINATES['hout bay'],
  '7441': AREA_COORDINATES['blouberg'],
  '7443': AREA_COORDINATES['parklands'],
  '7530': AREA_COORDINATES['bellville'],
  '7570': AREA_COORDINATES['durbanville'],
  '7640': AREA_COORDINATES['milnerton'],
  '7130': AREA_COORDINATES['somerset west'],
  '7140': AREA_COORDINATES['strand']
}

const EVENT_LOCATION_COORDINATES = {
  'workshop17, kloof street': { lat: -33.9284, lng: 18.4126 },
  'bree street / church street': { lat: -33.9238, lng: 18.4177 },
  'clifton 4th beach': { lat: -33.9419, lng: 18.3723 },
  'clay cafe, hout bay': { lat: -34.0434, lng: 18.3497 },
  'muizenberg beach': { lat: -34.1080, lng: 18.4699 },
  'the galileo, v&a waterfront': { lat: -33.9070, lng: 18.4208 },
  'the little sunshine centre, observatory': { lat: -33.9367, lng: 18.4642 },
  'kirstenbosch botanical gardens': { lat: -33.9883, lng: 18.4326 },
  'armchair theatre, obs': { lat: -33.9389, lng: 18.4669 },
  'cape town comedy club, v&a waterfront': { lat: -33.9054, lng: 18.4198 },
  'newlands forest': { lat: -33.9740, lng: 18.4472 },
  'signal hill, cape town': { lat: -33.9180, lng: 18.3958 },
  'the woodstock foundry': { lat: -33.9303, lng: 18.4476 },
  'grub & vine, bree street': { lat: -33.9228, lng: 18.4168 },
  'silo district, v&a waterfront, cape town': { lat: -33.9078, lng: 18.4181 }
}

const normalizeLocation = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

const deriveCoordinates = (event) => {
  const rawLat = Number(event.location?.coordinates?.lat ?? event.lat)
  const rawLng = Number(event.location?.coordinates?.lng ?? event.lng)
  if (Number.isFinite(rawLat) && Number.isFinite(rawLng)) {
    return { lat: rawLat, lng: rawLng }
  }

  const locationText = normalizeLocation(event.location ?? event.location?.address)
  const locationKey = Object.keys(EVENT_LOCATION_COORDINATES).find((key) => locationText.includes(key))
  if (locationKey) return EVENT_LOCATION_COORDINATES[locationKey]

  const areaText = normalizeLocation(
    event.area ??
    event.location?.area ??
    event.location?.address ??
    event.location
  )

  const matchedKey = Object.keys(AREA_COORDINATES).find((key) => areaText.includes(key))
  const base = matchedKey ? AREA_COORDINATES[matchedKey] : CAPE_TOWN_CENTER
  return base
}

const normalizedEvents = computed(() => {
  const mapped = (store.state.events || []).map((event) => {
    const { lat, lng } = deriveCoordinates(event)

    return {
      ...event,
      id: event.id ?? event.event_id,
      title: event.title ?? event.event_title ?? 'Untitled Event',
      description: event.description ?? '',
      area: event.area ?? event.location?.area ?? event.location ?? 'Unknown',
      category: event.category ?? event.category_name ?? 'General',
      price: Number(event.price ?? 0),
      image_url: event.image_url ?? event.image ?? '',
      startDate: event.startDate ?? event.start_date ?? event.date ?? null,
      lat,
      lng
    }
  })

  if (mapped.length > 0) return mapped
  return fallbackEvents.value
})

const filteredEvents = computed(() => {
  const visibleByLimit = eventsSortedByDistance.value.filter((ev) =>
    Number.isFinite(ev.distanceKm) && ev.distanceKm <= currentDistanceLimit.value
  )
  return visibleByLimit.map((ev) => ev.event)
})

const hasMoreEvents = computed(() =>
  eventsSortedByDistance.value.some((ev) =>
    Number.isFinite(ev.distanceKm) && ev.distanceKm > currentDistanceLimit.value
  )
)

const eventsSortedByDistance = computed(() => {
  const q = query.value.toLowerCase().trim()
  const baseEvents = !q
    ? normalizedEvents.value
    : normalizedEvents.value.filter((e) =>
      String(e.title || '').toLowerCase().includes(q) ||
      String(e.area || '').toLowerCase().includes(q) ||
      String(e.description || '').toLowerCase().includes(q) ||
      String(e.category || '').toLowerCase().includes(q)
    )

  return baseEvents
    .map((event) => {
      if (!Number.isFinite(event?.lat) || !Number.isFinite(event?.lng)) {
        return { event, distanceKm: Number.POSITIVE_INFINITY }
      }
      return {
        event,
        distanceKm: distanceKm(userLatLng.value, { lat: event.lat, lng: event.lng })
      }
    })
    .sort((a, b) => {
      if (!Number.isFinite(a.distanceKm) && !Number.isFinite(b.distanceKm)) {
        return String(a.event?.title || '').localeCompare(String(b.event?.title || ''))
      }
      if (!Number.isFinite(a.distanceKm)) return 1
      if (!Number.isFinite(b.distanceKm)) return -1
      if (a.distanceKm === b.distanceKm) {
        return String(a.event?.title || '').localeCompare(String(b.event?.title || ''))
      }
      return a.distanceKm - b.distanceKm
    })
})

const eventStore = {
  get loading() {
    return loading.value
  },
  get filteredEvents() {
    return filteredEvents.value
  },
  get events() {
    return normalizedEvents.value
  },
  async fetchEvents() {
    loading.value = true
    try {
      await store.dispatch('getEvents')
      if ((store.state.events || []).length === 0) {
        fallbackEvents.value = defaultMapEvents
      } else {
        fallbackEvents.value = []
      }
    } catch (error) {
      console.error('Error loading map events:', error)
      fallbackEvents.value = defaultMapEvents
    } finally {
      loading.value = false
    }
  }
}

const userLocation = computed(() => {
  const location = store.state.me?.location
  if (typeof location === 'string') return location
  return location?.area || 'Cape Town'
})

const userLatLng = computed(() => {
  const me = store.state.me || {}
  const lat = Number(me?.location?.coordinates?.lat ?? me?.lat)
  const lng = Number(me?.location?.coordinates?.lng ?? me?.lng)
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { lat, lng }
  }

  const locationText = normalizeLocation(me?.location?.area ?? me?.location ?? me?.area)
  const areaKey = Object.keys(AREA_COORDINATES).find((key) => locationText.includes(key))
  if (areaKey) return AREA_COORDINATES[areaKey]

  const zip = String(me?.zip_code ?? '').trim()
  if (ZIP_COORDINATES[zip]) return ZIP_COORDINATES[zip]

  return CAPE_TOWN_CENTER
})

const maxTravelDistance = computed(() => {
  const fromMe = Number(store.state.me?.maxDistance)
  if (Number.isFinite(fromMe) && fromMe > 0) return fromMe

  try {
    const preferences = JSON.parse(localStorage.getItem('preferences') || '{}')
    const fromPreferences = Number(preferences?.maxDistance)
    if (Number.isFinite(fromPreferences) && fromPreferences > 0) return fromPreferences
  } catch {}

  return 50
})

const zoomForDistanceKm = (km) => {
  if (km <= 5) return 13
  if (km <= 10) return 12
  if (km <= 25) return 11
  if (km <= 50) return 10
  if (km <= 100) return 9
  return 8
}

const formatDate = (dateValue) => {
  if (!dateValue) return ''
  const d = new Date(dateValue)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  })
}

const toRadians = (deg) => (deg * Math.PI) / 180

const distanceKm = (from, to) => {
  const r = 6371
  const dLat = toRadians(to.lat - from.lat)
  const dLng = toRadians(to.lng - from.lng)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * r * Math.asin(Math.sqrt(a))
}

const formatDistanceFromUser = (ev) => {
  if (!Number.isFinite(ev?.lat) || !Number.isFinite(ev?.lng)) return 'Distance unavailable'
  const km = distanceKm(userLatLng.value, { lat: ev.lat, lng: ev.lng })
  if (!Number.isFinite(km)) return 'Distance unavailable'
  if (km < 10) return `${km.toFixed(1)} km away`
  return `${Math.round(km)} km away`
}

const isFreeEvent = (ev) => Number(ev?.price ?? 0) === 0

const popupHtml = (ev) => {
  const isFree = isFreeEvent(ev)
  const buttonText = isFree ? 'Free' : 'Book Now'
  const buttonStyle = isFree
    ? 'padding:8px 12px;border-radius:20px;border:1px solid #b8b8b8;background:#9e9e9e;color:#f1f1f1;cursor:not-allowed;width:100%;'
    : 'padding:8px 12px;border-radius:20px;border:0;background:#4caf50;color:#fff;cursor:pointer;width:100%;'

  return `
    <div style="min-width:220px">
      <div style="display:flex; gap:10px; align-items:flex-start;">
        <img src="${ev.image_url || 'https://placehold.co/56x56?text=Event'}" alt="Event image" style="width:56px;height:56px;border-radius:12px;object-fit:cover;flex-shrink:0;" />
        <div>
          <h3 style="margin:0 0 6px; font-size:14px; color:#333;">${ev.title}</h3>
          <div style="margin:0 0 6px; color:#666; font-size:12px;">${ev.area || ''}</div>
          <div style="margin:0 0 8px; font-size:12px; color:#444;">${ev.description || ''}</div>
          <div style="margin:0 0 10px; font-size:12px;"><b style="color:#333;">Price:</b> <span style="color:#4caf50;">R ${ev.price || 0}</span></div>
          <button id="pay-${ev.id}" ${isFree ? 'disabled' : ''} style="${buttonStyle}">
            <i class="uil uil-shopping-cart" aria-hidden="true" style="margin-right:6px;"></i>${buttonText}
          </button>
        </div>
      </div>
    </div>
  `
}

const wirePopupButtons = (ev) => {
  const marker = markerById.get(ev.id)
  if (!marker) return

  marker.off('popupopen')
  marker.on('popupopen', () => {
    setTimeout(() => {
      const payBtn = document.getElementById(`pay-${ev.id}`)
      if (payBtn) {
        if (isFreeEvent(ev)) return
        payBtn.onclick = (e) => {
          e.stopPropagation()
          router.push({
            name: 'payments',
            query: {
              eventId: ev.id,
              title: ev.title,
              date: formatDate(ev.startDate),
              price: ev.price
            }
          })
        }
      }
    }, 50)
  })
}

const focusEvent = (ev) => {
  if (!map) return
  if (!Number.isFinite(ev.lat) || !Number.isFinite(ev.lng)) return

  map.setView([ev.lat, ev.lng], 14, { animate: true })
  const marker = markerById.get(ev.id)
  if (marker) marker.openPopup()
}

const updateMarkers = (eventsToPlot) => {
  if (!map) return

  markerById.forEach((marker) => map.removeLayer(marker))
  markerById.clear()

  const validEvents = eventsToPlot.filter((ev) => Number.isFinite(ev.lat) && Number.isFinite(ev.lng))

  validEvents.forEach((ev) => {
    const marker = L.marker([ev.lat, ev.lng]).addTo(map)
    markerById.set(ev.id, marker)
    marker.bindPopup(popupHtml(ev))
    wirePopupButtons(ev)
  })

  map.setView(
    [userLatLng.value.lat, userLatLng.value.lng],
    zoomForDistanceKm(currentDistanceLimit.value),
    { animate: true }
  )

  updateVisibleEventCount()
}

const updateVisibleEventCount = () => {
  if (!map) {
    visibleEventCount.value = filteredEvents.value.length
    return
  }

  const bounds = map.getBounds()
  visibleEventCount.value = filteredEvents.value.filter((ev) =>
    Number.isFinite(ev.lat) &&
    Number.isFinite(ev.lng) &&
    bounds.contains([ev.lat, ev.lng])
  ).length
}

const handleSearch = () => {
  updateMarkers(filteredEvents.value)
}

const loadMoreEvents = () => {
  const fartherDistances = eventsSortedByDistance.value
    .map((ev) => ev.distanceKm)
    .filter((distance) => Number.isFinite(distance) && distance > currentDistanceLimit.value)

  if (fartherDistances.length === 0) return

  currentDistanceLimit.value += maxTravelDistance.value
  updateMarkers(filteredEvents.value)
}

watch(filteredEvents, (newEvents) => {
  updateMarkers(newEvents)
}, { deep: true })

onMounted(async () => {
  currentDistanceLimit.value = maxTravelDistance.value
  map = L.map(mapEl.value, { zoomControl: true }).setView(
    [userLatLng.value.lat, userLatLng.value.lng],
    zoomForDistanceKm(currentDistanceLimit.value)
  )

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  await eventStore.fetchEvents()
  updateMarkers(filteredEvents.value)
  map.on('moveend zoomend', updateVisibleEventCount)
  updateVisibleEventCount()
})

watch([maxTravelDistance, userLatLng], () => {
  if (!map) return
  currentDistanceLimit.value = maxTravelDistance.value
  updateMarkers(filteredEvents.value)
}, { deep: true })

onBeforeUnmount(() => {
  markerById.forEach((marker) => {
    if (map) map.removeLayer(marker)
  })
  markerById.clear()
  if (map) {
    map.off('moveend zoomend', updateVisibleEventCount)
    map.remove()
    map = null
  }
})
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
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
  flex-shrink: 0;
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

.event-distance {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(255,255,255,0.9);
  display: flex;
  align-items: center;
  gap: 6px;
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
