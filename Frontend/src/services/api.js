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
    return API.get("/auth/me");
  },

  savePreferences(data) {
    return API.post("/preferences", data);
  },

  getCart(user_id) {
    return API.get(`/cart/${user_id}`);
  },

  postCart(data) {
    return API.post("/cart", data);
  },

  patchCartQuantity(cart_id, data) {
    return API.patch(`/cart/${cart_id}`, data);
  },

  deleteCartItem(cart_id) {
    return API.delete(`/cart/${cart_id}`);
  },

  deleteUserCart(user_id) {
    return API.delete(`/cart/user/${user_id}`);
  },

  getFavourites(user_id) {
    return API.get(`/favourites/${user_id}`);
  },

  postFavourite(data) {
    return API.post("/favourites", data);
  },

  deleteFavourite(data) {
    return API.delete("/favourites", { data });
  },

  checkout(data) {
    return API.post("/checkout", data);
  },

  getOrder(order_id) {
    return API.get(`/orders/${order_id}`);
  },

  getUserOrders(user_id) {
    return API.get(`/users/${user_id}/orders`);
  },

  patchOrderStatus(order_id, data) {
    return API.patch(`/orders/${order_id}/status`, data);
  },

  getOrderTickets(order_id) {
    return API.get(`/orders/${order_id}/tickets`);
  },

  postOrderTickets(order_id, data) {
    return API.post(`/orders/${order_id}/tickets/issue`, data);
  },
};
