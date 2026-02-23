import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  } 
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default {
  login(data) {
    return API.post("/auth/login", data);
  },

  register(data) {
    return API.post("/auth/register", data);
  },

  getMe() {
    return API.get("/me");
  },

  savePreferences(data) {
    return API.post("/preferences", data);
  },
};
