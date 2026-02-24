import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  login(data) {
    return API.post("/login", data);
  },

  register(data) {
    return API.post("/register", data);
  },

  getMe() {
    return API.get("/me");
  },

  savePreferences(data) {
    return API.post("/preferences", data);
  },
};
