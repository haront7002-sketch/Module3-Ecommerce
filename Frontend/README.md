# Frontend

Vue 3 + Vite + Vuex frontend for Module3-Ecommerce.

## Stack
- Vue 3 (`script setup` + Options where needed)
- Vue Router
- Vuex
- Leaflet (map)
- QRCode generation

## Install & Run
```sh
cd Frontend
npm install
npm run dev
```

App runs at:
- `http://localhost:5173`

## Build
```sh
npm run build
```

## Backend Dependency
The frontend expects the API at:
- `http://localhost:3000`

If backend is not running, requests will fail with `Failed to fetch`.

## Key Pages
- Home (`/`): swipe events and add to favourites
- Explore (`/explore`): search/filter/calendar + **Load All Events**
- Map (`/map`): radius map view + **Load All Events**
- Favourites (`/favourites`): saved events list + modal details
- Payments (`/payments`): checkout summary, **5% service fee**, ticket generation
- Profile (`/profile`): user info, interests, travel distance, tickets

## Notes
- Auth and user/session state are managed in `src/stores/index.js` (Vuex).
- The app uses localStorage fallbacks for some user/favourites flows when needed.
