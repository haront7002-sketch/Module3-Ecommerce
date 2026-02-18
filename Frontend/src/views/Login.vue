<template>
  <div>
    <h2>Login</h2>

    <AlertMessage :message="message" :type="messageType" />

    <form @submit.prevent="handleLogin">
      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>

      <button type="submit">Login</button>
    </form>

    <p>
      Don't have an account?
      <RouterLink to="/register">Register</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import AlertMessage from "../components/AlertMessage.vue";

const router = useRouter();

const email = ref("");
const password = ref("");

const message = ref("");
const messageType = ref("");

async function handleLogin() {
  message.value = "";

  try {
    const res = await api.login({
      email: email.value,
      password: password.value,
    });

    if (!res.data?.token) throw new Error("No token returned");

    localStorage.setItem("token", res.data.token);

    messageType.value = "success";
    message.value = "Login successful";

    router.push("/profile");
  } catch (err) {
    messageType.value = "error";
    message.value = err.response?.data?.message || err.message || "Login failed";
  }
}
</script>
