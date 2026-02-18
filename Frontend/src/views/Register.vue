<template>
  <div>
    <h2>Register</h2>

    <AlertMessage :message="message" :type="messageType" />

    <form @submit.prevent="handleRegister">
      <div>
        <label>Name</label>
        <input v-model="name" required />
      </div>

      <div>
        <label>Email</label>
        <input v-model="email" type="email" required />
      </div>

      <div>
        <label>Country</label>
        <input v-model="country" required />
      </div>

      <div>
        <label>Zip</label>
        <input v-model="zip" required />
      </div>

      <div>
        <label>Password</label>
        <input v-model="password" type="password" required />
      </div>

      <div>
        <label>Confirm Password</label>
        <input v-model="confirmPassword" type="password" required />
      </div>

      <button type="submit">Register</button>
    </form>

    <p>
      Already have an account?
      <RouterLink to="/login">Login</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import AlertMessage from "../components/AlertMessage.vue";

const router = useRouter();

const name = ref("");
const email = ref("");
const country = ref("");
const zip = ref("");
const password = ref("");
const confirmPassword = ref("");

const message = ref("");
const messageType = ref("");

async function handleRegister() {
  message.value = "";

  if (password.value.length < 6) {
    messageType.value = "error";
    message.value = "Password must be at least 6 characters";
    return;
  }

  if (password.value !== confirmPassword.value) {
    messageType.value = "error";
    message.value = "Passwords do not match";
    return;
  }

  try {
    const res = await api.register({
      name: name.value,
      email: email.value,
      country: country.value,
      zip: zip.value,
      password: password.value,
    });

    if (res.data?.token) {
      localStorage.setItem("token", res.data.token);
    }

    messageType.value = "success";
    message.value = "Account created";

    router.push(res.data?.token ? "/preferences" : "/login");
  } catch (err) {
    messageType.value = "error";
    message.value = err.response?.data?.message || "Registration failed";
  }
}
</script>
