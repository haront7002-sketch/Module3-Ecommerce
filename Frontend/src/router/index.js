import { createRouter, createWebHistory } from "vue-router";
import Swipe from "@/views/Swipe.vue";
import Profile from "@/views/Profile.vue";
import Preferences from "@/views/Preferences.vue";
import Explore from "@/views/Explore.vue";
import Favourites from "@/views/Favourites.vue";
import Map from "@/views/Map.vue";
import Payments from "@/views/Payments.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Swipe,
      meta: { requiresAuth: true }
    },
    {
      path: "/explore",
      name: "explore",
      component: Explore,
      meta: { requiresAuth: true }
    },
    {
      path: "/favourites",
      name: "favourites",
      component: Favourites,
      meta: { requiresAuth: true }
    },
    {
      path: "/map",
      name: "map",
      component: Map,
      meta: { requiresAuth: true }
    },
    {
      path: "/payments",
      name: "payments",
      component: Payments,
      meta: { requiresAuth: true }
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: "/preferences",
      name: "preferences",
      component: Preferences,
      meta: { requiresAuth: true }
    },
  ],
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user") || '{}');
  const hasPreferences = userData.profileComplete !== false;
  
  console.log('Navigation:', { to: to.path, token: !!token, hasPreferences });
  
  // If route requires auth and no token, redirect to root (shows login)
  if (to.meta.requiresAuth && !token) {
    next('/');
  } 
  // If user has token but no preferences and trying to go anywhere except preferences
  else if (token && !hasPreferences && to.path !== '/preferences') {
    next('/preferences');
  }
  // If user has token and preferences and trying to go to root, allow
  else if (token && hasPreferences && to.path === '/') {
    next();
  }
  // If user has token and is going to any other route, allow
  else if (token) {
    next();
  }
  else {
    next();
  }
});

export default router;