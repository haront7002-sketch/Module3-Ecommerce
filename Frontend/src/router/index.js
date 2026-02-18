import { createRouter, createWebHistory } from "vue-router";
import Swipe from "@/views/Swipe.vue";

import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Preferences from "@/views/Preferences.vue";
import Profile from "@/views/Profile.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Swipe,
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/preferences",
      name: "preferences",
      component: Preferences,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");
  if (to.meta.requiresAuth && !token) return "/login";
  return true;
});

export default router;
