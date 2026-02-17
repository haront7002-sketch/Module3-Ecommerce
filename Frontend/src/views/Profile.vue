<template>
  <div>
    <h2>Profile</h2>

    <AlertMessage :message="message" :type="messageType" />

    <div v-if="user">
      <p><strong>Name:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Country:</strong> {{ user.country }}</p>
      <p><strong>Zip:</strong> {{ user.zip }}</p>

      <div style="margin-top: 15px;">
        <RouterLink to="/preferences">
          <button>Update Preferences</button>
        </RouterLink>

        <button style="margin-left: 10px;" @click="editProfile">
          Edit Profile
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import AlertMessage from "../components/AlertMessage.vue";

const router = useRouter();

const user = ref(null);
const message = ref("");
const messageType = ref("");

function editProfile() {
  router.push("/register");
}

onMounted(async () => {
  try {
    const res = await api.getMe();
    user.value = res.data;
  } catch (err) {
    messageType.value = "error";
    message.value = "Please login again";
    localStorage.removeItem("token");
    router.push("/login");
  }
});
</script>
