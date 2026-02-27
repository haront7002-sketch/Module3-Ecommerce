<template>
  <div class="payments-container">
    <!-- Header -->
    <div class="payments-header">
      <div class="brand">
        <div>
          <h1>Payment Process</h1>
          <p class="subtitle">Complete your booking securely</p>
        </div>
      </div>

      <div class="stats">
        <span class="stat-item">
          <i class="uil uil-credit-card"></i> Total: R {{ total }}
        </span>
      </div>
    </div>

    <div class="payments-content">
      <!-- Banner -->
      <div v-if="banner.message" class="banner" :class="banner.variant">
        <span>{{ banner.message }}</span>
        <button class="banner-close" @click="banner.message = ''">×</button>
      </div>

      <div class="payments-grid">
        <!-- Order Summary -->
        <section class="order-summary glass-card">
          <div class="summary-header">
            <h2>Order Summary</h2>
            <span class="badge">Secure Checkout</span>
          </div>

          <div v-if="cartItems.length > 0">
            <div class="order-item" v-for="item in cartItems" :key="item.cartId">
              <div class="item-details">
                <span class="item-label">Event</span>
                <span class="item-value">{{ item.title }}</span>
                <span class="item-ref">Ref: {{ item.eventId }}</span>
              </div>
              <div class="item-date">
                <span class="item-label">Date</span>
                <span class="item-value">{{ item.date }}</span>
              </div>
              <div class="quantity-control">
                <button class="qty-btn" @click="decrementItem(item)" :disabled="item.quantity <= 1 || updatingQty">-</button>
                <span class="qty-number">{{ item.quantity }}</span>
                <button class="qty-btn" @click="incrementItem(item)" :disabled="updatingQty">+</button>
              </div>
            </div>
          </div>
          <div v-else class="order-item">
            <div class="item-details">
              <span class="item-label">Event</span>
              <span class="item-value">{{ order.title }}</span>
              <span class="item-ref">Ref: {{ order.eventId }}</span>
            </div>
            <div class="item-date">
              <span class="item-label">Date</span>
              <span class="item-value">{{ order.date }}</span>
            </div>
            <div class="quantity-control">
              <button class="qty-btn" @click="qtyDown" :disabled="qty <= 1 || isCartEmpty">-</button>
              <span class="qty-number" :class="{ 'is-empty': isCartEmpty }">{{ isCartEmpty ? 0 : qty }}</span>
              <button class="qty-btn" @click="qtyUp" :disabled="isCartEmpty">+</button>
            </div>
          </div>

          <div class="divider"></div>

          <div class="totals">
            <div class="total-line">
              <span>Subtotal</span>
              <span>R {{ subtotal }}</span>
            </div>
            <div class="total-line">
              <span>Service Fee</span>
              <span>R 10</span>
            </div>
            <div class="total-line final">
              <span>Total</span>
              <span>R {{ total }}</span>
            </div>
          </div>

          <button
            class="clear-cart-btn"
            :disabled="clearingCart"
            @click="clearCart"
          >
            <span v-if="clearingCart">Clearing...</span>
            <span v-else>Clear Cart</span>
          </button>
        </section>

        <!-- Customer & Payment -->
        <section class="payment-form glass-card">
          <div class="form-header">
            <h2>Customer Details</h2>
            <span class="badge">{{ methodLabel }}</span>
          </div>

          <div class="form">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name</label>
                <input 
                  v-model.trim="customer.name" 
                  type="text" 
                  placeholder="e.g., Antonio Williams"
                  :class="{ error: submitted && !customer.name }"
                >
                <p v-if="submitted && !customer.name" class="error-message">Name is required</p>
              </div>

              <div class="form-group">
                <label>Email</label>
                <input 
                  v-model.trim="customer.email" 
                  type="email" 
                  placeholder="e.g., antonio@email.com"
                  :class="{ error: submitted && !validEmail }"
                >
                <p v-if="submitted && !validEmail" class="error-message">Enter a valid email</p>
              </div>
            </div>

            <div class="form-group">
              <label>Phone (optional)</label>
              <input v-model.trim="customer.phone" type="tel" placeholder="e.g., 071 234 5678">
            </div>

            <div class="divider"></div>

            <h3 class="section-title">Payment Method</h3>
            <div class="payment-methods">
              <label class="payment-method">
                <input type="radio" value="card" v-model="method">
                <div class="method-content">
                  <i class="uil uil-credit-card"></i>
                  <div>
                    <div class="method-title">Card</div>
                    <div class="method-subtitle">Visa / Mastercard</div>
                  </div>
                </div>
              </label>

              <label class="payment-method">
                <input type="radio" value="eft" v-model="method">
                <div class="method-content">
                  <i class="uil uil-bill"></i>
                  <div>
                    <div class="method-title">Instant EFT</div>
                    <div class="method-subtitle">Pay via your bank</div>
                  </div>
                </div>
              </label>
            </div>

            <div class="divider"></div>

            <label class="terms-checkbox">
              <input type="checkbox" v-model="accepted">
              <span>I agree to the terms & conditions</span>
            </label>
            <p v-if="submitted && !accepted" class="error-message">You must accept the terms</p>

            <button 
              class="pay-button" 
              :disabled="processing" 
              @click="pay"
            >
              <span v-if="processing" class="loading-spinner"></span>
              <span v-else>Pay R {{ total }}</span>
            </button>

            <!-- Success Message with Clear Profile Notification -->
            <div v-if="status === 'success'" class="success-section">
              <div class="success-message">
                <i class="uil uil-check-circle"></i>
                <div>
                  <strong>Payment Successful!</strong>
                  <p class="reference">Order #{{ reference }}</p>
                  
                  <!-- Clear Profile Notification -->
                  <div class="profile-notification-card">
                    <div class="notification-icon">
                      <i class="uil uil-ticket"></i>
                    </div>
                    <div class="notification-content">
                      <h4>✓ Ticket Saved to Your Profile</h4>
                      <p>Your ticket has been securely stored and is now available in your profile.</p>
                      <router-link to="/profile" class="notification-link">
                        Go to My Tickets <i class="uil uil-arrow-right"></i>
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="ticket" class="premium-ticket">
                <div class="ticket-ribbon">
                  <span>CONFIRMED</span>
                </div>
                
                <div class="ticket-header">
                  <div class="ticket-brand">
                    <div class="ticket-icon">🎟️</div>
                    <div>
                      <h3>{{ ticket.title }}</h3>
                      <p class="ticket-ref">#{{ ticket.reference }}</p>
                    </div>
                  </div>
                  <div class="ticket-price">R{{ ticket.total }}</div>
                </div>

                <div class="ticket-dashed-line">
                  <span class="dot-left"></span>
                  <span class="dot-right"></span>
                </div>

                <div class="ticket-content">
                  <div class="ticket-details">
                    <div class="detail-row">
                      <span class="detail-label">Event Date</span>
                      <span class="detail-value">{{ ticket.date }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Attendee</span>
                      <span class="detail-value">{{ ticket.customerName }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Email</span>
                      <span class="detail-value">{{ ticket.customerEmail }}</span>
                    </div>
                    <div class="detail-row">
                      <span class="detail-label">Quantity</span>
                      <span class="detail-value">{{ ticket.quantity }} ticket(s)</span>
                    </div>
                  </div>

                  <div class="ticket-qr-section">
                    <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Code" class="qr-code">
                    <p class="qr-text">Scan at entrance</p>
                  </div>
                </div>

                <div class="ticket-footer">
                  <button class="btn-download" @click="downloadTicket">
                    <i class="uil uil-download-alt"></i> Download Ticket
                  </button>
                  <router-link to="/profile" class="btn-profile">
                    <i class="uil uil-ticket"></i> View in Profile
                  </router-link>
                </div>
              </div>
            </div>

            <div v-if="status === 'failed'" class="error-message">
              <i class="uil uil-exclamation-circle"></i>
              Payment failed. Please try again.
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import QRCode from "qrcode";

const route = useRoute();
const router = useRouter();
const store = useStore();
const EMPTY_ORDER = {
  eventId: "",
  title: "No item in cart",
  date: "",
  pricePerTicket: 0
};

const hasRouteEvent = Number.isInteger(Number(route.query.eventId)) && Number(route.query.eventId) > 0;

// Order data from query params
const order = ref(
  hasRouteEvent
    ? {
        eventId: route.query.eventId,
        title: route.query.title || "Selected Event",
        date: route.query.date || "",
        pricePerTicket: Number(route.query.price || 0),
      }
    : { ...EMPTY_ORDER }
);
const qty = ref(1);
const cartItems = ref([]);
const method = ref("card");

const customer = reactive({
  name: "",
  email: "",
  phone: "",
});

const accepted = ref(false);
const submitted = ref(false);
const processing = ref(false);
const clearingCart = ref(false);
const updatingQty = ref(false);

const status = ref("");
const reference = ref("");
const ticket = ref(null);
const qrDataUrl = ref("");

const banner = reactive({
  message: "",
  variant: "info",
});

const subtotal = computed(() => {
  if (cartItems.value.length === 0) return order.value.pricePerTicket * qty.value;
  return cartItems.value.reduce(
    (sum, item) => sum + Number(item.pricePerTicket) * Number(item.quantity),
    0
  );
});
const isCartEmpty = computed(() => cartItems.value.length === 0 && !order.value.eventId);
const total = computed(() => subtotal.value + 10); // Flat R10 service fee

const validEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email));

const methodLabel = computed(() => (method.value === "eft" ? "Instant EFT" : "Card"));

function qtyUp() {
  qty.value += 1;
}

function qtyDown() {
  if (qty.value > 1) qty.value -= 1;
}

function showBanner(msg, variant = "info") {
  banner.message = msg;
  banner.variant = variant;
}

function clearOrderSummary() {
  order.value = { ...EMPTY_ORDER };
  qty.value = 1;
  cartItems.value = [];
  status.value = "";
  reference.value = "";
  ticket.value = null;
  qrDataUrl.value = "";
}

function mapCartItems(raw = []) {
  return (raw || []).map((item) => {
    const datePart = item.date ? new Date(item.date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    }) : "";
    const timePart = item.time
      ? new Date(`1970-01-01T${item.time}`).toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        })
      : "";

    return {
      cartId: item.cart_id ?? item.cartId,
      eventId: item.event_id ?? item.eventId,
      title: item.event_title ?? item.title ?? "Untitled Event",
      date: [datePart, timePart].filter(Boolean).join(" • "),
      pricePerTicket: Number(item.price ?? 0),
      quantity: Number(item.quantity ?? 1)
    };
  });
}

async function loadCart() {
  const userId = getCurrentUserId();
  if (!userId) {
    cartItems.value = [];
    return;
  }
  await store.dispatch("getCart", { userId });
  cartItems.value = mapCartItems(store.state.cart || []);
}

async function addRouteEventToCartIfPresent() {
  const userId = getCurrentUserId();
  const eventId = Number(route.query.eventId);
  if (!userId || !Number.isInteger(eventId) || eventId <= 0) return;

  await store.dispatch("postCart", {
    user_id: userId,
    event_id: eventId,
    quantity: 1
  });
}

async function incrementItem(item) {
  updatingQty.value = true;
  try {
    await store.dispatch("patchCartQuantity", {
      cartId: item.cartId,
      body: { quantity: Number(item.quantity) + 1 }
    });
    await loadCart();
  } catch (err) {
    console.error(err);
    showBanner("Failed to update quantity.", "error");
  } finally {
    updatingQty.value = false;
  }
}

async function decrementItem(item) {
  if (Number(item.quantity) <= 1) return;
  updatingQty.value = true;
  try {
    await store.dispatch("patchCartQuantity", {
      cartId: item.cartId,
      body: { quantity: Number(item.quantity) - 1 }
    });
    await loadCart();
  } catch (err) {
    console.error(err);
    showBanner("Failed to update quantity.", "error");
  } finally {
    updatingQty.value = false;
  }
}

function getCurrentUserId() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  return store.state.me?.user_id ?? store.state.me?.id ?? storedUser?.user_id ?? storedUser?.id;
}

async function clearCartForUser({ showErrors = true } = {}) {
  const userId = getCurrentUserId();

  if (!userId) {
    if (showErrors) showBanner("No user found to clear cart for.", "warning");
    return false;
  }

  try {
    const response = await store.dispatch("deleteUserCart", { userId });
    if (response?.message !== "User cart cleared successfully") {
      if (showErrors) showBanner(response?.message || "Failed to clear cart.", "error");
      return false;
    }
    await loadCart();
    if (cartItems.value.length > 0) {
      if (showErrors) showBanner("Failed to clear cart.", "error");
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    if (showErrors) showBanner("Failed to clear cart.", "error");
    return false;
  }
}

async function clearCart() {
  clearingCart.value = true;
  try {
    const cleared = await clearCartForUser({ showErrors: true });
    if (cleared) {
      clearOrderSummary();
      await router.replace({ name: "payments", query: {} });
    }
  } finally {
    clearingCart.value = false;
  }
}

function generateTicketReference() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TIX-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function formatDateTime() {
  const now = new Date();
  return now.toLocaleString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function createTicketWithQr() {
  const itemsForTicket = cartItems.value.length > 0
    ? cartItems.value
    : [{
        eventId: order.value.eventId,
        title: order.value.title,
        date: order.value.date,
        quantity: qty.value,
        pricePerTicket: order.value.pricePerTicket
      }];
  
  const totalQty = itemsForTicket.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const summaryTitle = itemsForTicket.length === 1 ? itemsForTicket[0].title : `${itemsForTicket.length} events`;

  const qrPayload = JSON.stringify({
    ref: reference.value,
    event: itemsForTicket.map((item) => item.eventId).join(", "),
    qty: totalQty
  });

  qrDataUrl.value = await QRCode.toDataURL(qrPayload, {
    width: 200,
    margin: 1
  });

  ticket.value = {
    id: `ticket-${Date.now()}`,
    reference: reference.value,
    eventId: itemsForTicket.map((item) => item.eventId).join(", "),
    title: summaryTitle,
    date: itemsForTicket.map((item) => item.date).filter(Boolean).join(" | "),
    quantity: totalQty,
    total: total.value,
    customerName: customer.name,
    customerEmail: customer.email,
    purchasedAt: formatDateTime(),
    status: 'active',
    qrCode: qrDataUrl.value
  };
}

function saveTicketToProfile() {
  if (!ticket.value) return;

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  if (!currentUser.tickets) currentUser.tickets = [];
  currentUser.tickets.push(ticket.value);
  localStorage.setItem('user', JSON.stringify(currentUser));
  localStorage.setItem('userTickets', JSON.stringify(currentUser.tickets));
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function downloadTicket() {
  if (!ticket.value || !qrDataUrl.value) return;

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#c01a62";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  ctx.fillStyle = "#333333";
  ctx.font = "bold 24px Arial";
  ctx.fillText("EVENT TICKET", 40, 60);

  ctx.font = "16px Arial";
  ctx.fillText(`Ref: ${ticket.value.reference}`, 40, 100);
  ctx.fillText(`Event: ${ticket.value.title}`, 40, 140);
  ctx.fillText(`Date: ${ticket.value.date}`, 40, 180);
  ctx.fillText(`Attendee: ${ticket.value.customerName}`, 40, 220);
  ctx.fillText(`Qty: ${ticket.value.quantity} | Total: R${ticket.value.total}`, 40, 260);

  const qrImage = await loadImage(qrDataUrl.value);
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(500, 80, 250, 250);
  ctx.drawImage(qrImage, 510, 90, 230, 230);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${ticket.value.reference}.png`;
  link.click();
}

async function pay() {
  submitted.value = true;
  status.value = "";
  reference.value = "";
  ticket.value = null;
  qrDataUrl.value = "";
  banner.message = "";

  if (!customer.name || !validEmail.value || !accepted.value) {
    showBanner("Please complete all required fields", "warning");
    return;
  }
  if (cartItems.value.length === 0 && !order.value.eventId) {
    showBanner("Your cart is empty.", "warning");
    return;
  }

  processing.value = true;

  try {
    const userId = getCurrentUserId();
    if (!userId) {
      showBanner("No user found for checkout.", "error");
      status.value = "failed";
      return;
    }

    await new Promise((r) => setTimeout(r, 1500));
    const checkoutResult = await store.dispatch("postCheckout", {
      user_id: userId,
      payment_method: method.value,
      status: "successful"
    });

    if (!checkoutResult?.order_id) {
      throw new Error(checkoutResult?.message || "Checkout failed");
    }

    reference.value = generateTicketReference();
    await createTicketWithQr();
    saveTicketToProfile();
    await loadCart();
    
    status.value = "success";
    showBanner("Payment successful! Your ticket has been saved.", "success");
  } catch (err) {
    console.error(err);
    status.value = "failed";
    showBanner("Payment failed. Please try again.", "error");
  } finally {
    processing.value = false;
  }
}

onMounted(async () => {
  try {
    if (hasRouteEvent) {
      await addRouteEventToCartIfPresent();
    }
  } catch (err) {
    console.error(err);
  }
  await loadCart();

  if (!hasRouteEvent && cartItems.value.length === 0) {
    clearOrderSummary();
  }
});
</script>

<style scoped>
.payments-container {
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

.payments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
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

.payments-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 10px;
}

.banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-radius: 30px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

.banner.success { background: rgba(76, 175, 80, 0.2); }
.banner.warning { background: rgba(255, 193, 7, 0.2); }
.banner.error { background: rgba(244, 67, 54, 0.2); }

.banner-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0 5px;
}

.payments-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .payments-grid {
    grid-template-columns: 1fr 1.2fr;
    align-items: start;
  }
}

.order-summary {
  padding: 25px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.summary-header h2 {
  margin: 0;
  font-size: 18px;
  color: white;
  font-weight: 600;
}

.badge {
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  align-items: center;
}

.item-details, .item-date {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-label {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-value {
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.item-ref {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 20px 0;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.qty-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.qty-btn:hover:not(:disabled) {
  background: #4caf50;
  transform: scale(1.1);
}

.qty-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.qty-number {
  font-size: 16px;
  font-weight: 600;
  color: white;
  min-width: 20px;
  text-align: center;
}

.totals {
  margin-top: 10px;
}

.total-line {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  color: white;
  font-size: 14px;
}

.total-line.final {
  font-weight: 700;
  font-size: 18px;
  border-top: 1px dashed rgba(255, 255, 255, 0.3);
  margin-top: 10px;
  padding-top: 15px;
}

.clear-cart-btn {
  margin-top: 20px;
  width: 100%;
  padding: 11px 14px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-cart-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.payment-form {
  padding: 25px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-header h2 {
  margin: 0;
  font-size: 18px;
  color: white;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  gap: 15px;
  grid-template-columns: 1fr;
}

@media (min-width: 700px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input::placeholder {
  color: rgba(255,255,255,0.5);
}

.form-group input:focus {
  outline: none;
  border-color: #AEE994;
  background: rgba(255, 255, 255, 0.15);
}

.form-group input.error {
  border-color: #ff6b6b;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
}

.section-title {
  color: white;
  font-size: 14px;
  margin: 0 0 10px;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.payment-method {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
}

.payment-method:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: #AEE994;
}

.payment-method input[type="radio"] {
  margin-right: 15px;
  accent-color: #4caf50;
  transform: scale(1.2);
}

.method-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.method-content i {
  font-size: 24px;
  color: #AEE994;
}

.method-title {
  font-weight: 600;
  color: white;
  font-size: 14px;
}

.method-subtitle {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  font-size: 14px;
  cursor: pointer;
}

.terms-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #4caf50;
}

.pay-button {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.pay-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
}

.pay-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-section {
  margin-top: 20px;
}

.success-message {
  padding: 20px;
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 20px;
  color: white;
  margin-bottom: 20px;
}

.success-message i {
  font-size: 28px;
  color: #4caf50;
  margin-right: 10px;
}

.reference {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  margin: 5px 0 15px;
}

/* Profile Notification Card */
.profile-notification-card {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 15px;
  margin-top: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.notification-icon {
  width: 50px;
  height: 50px;
  background: #4caf50;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.notification-content h4 {
  margin: 0 0 5px;
  color: #AEE994;
  font-size: 16px;
}

.notification-content p {
  margin: 0 0 8px;
  font-size: 13px;
  color: rgba(255,255,255,0.9);
}

.notification-link {
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.3);
}

.notification-link:hover {
  color: #AEE994;
  border-bottom-color: #AEE994;
}

/* Premium Ticket Design */
.premium-ticket {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ticket-ribbon {
  position: absolute;
  top: 20px;
  right: -30px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  padding: 8px 40px;
  transform: rotate(45deg);
  font-size: 12px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 1;
}

.ticket-header {
  padding: 25px;
  background: linear-gradient(135deg, #f8f9fa, #ffffff);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-brand {
  display: flex;
  gap: 15px;
  align-items: center;
}

.ticket-icon {
  font-size: 40px;
}

.ticket-brand h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
  font-weight: 600;
}

.ticket-ref {
  margin: 5px 0 0;
  font-size: 12px;
  color: #c01a62;
  font-weight: 600;
}

.ticket-price {
  font-size: 28px;
  font-weight: 700;
  color: #c01a62;
  background: rgba(192, 26, 98, 0.1);
  padding: 10px 20px;
  border-radius: 50px;
}

.ticket-dashed-line {
  position: relative;
  height: 2px;
  background: repeating-linear-gradient(90deg, #c01a62, #c01a62 10px, transparent 10px, transparent 20px);
  margin: 0 25px;
}

.dot-left, .dot-right {
  position: absolute;
  width: 16px;
  height: 16px;
  background: #c01a62;
  border-radius: 50%;
  top: -7px;
}

.dot-left {
  left: -8px;
}

.dot-right {
  right: -8px;
}

.ticket-content {
  padding: 25px;
  display: grid;
  grid-template-columns: 1fr 180px;
  gap: 20px;
  background: #ffffff;
}

.ticket-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px dashed #e0e0e0;
}

.detail-label {
  width: 100px;
  color: #666;
  font-size: 13px;
  font-weight: 500;
}

.detail-value {
  flex: 1;
  color: #333;
  font-weight: 600;
  font-size: 13px;
}

.ticket-qr-section {
  text-align: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 16px;
}

.qr-code {
  width: 150px;
  height: 150px;
  border-radius: 12px;
  padding: 8px;
  background: white;
  border: 2px solid #c01a62;
}

.qr-text {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  font-weight: 600;
}

.ticket-footer {
  display: flex;
  gap: 10px;
  padding: 20px 25px;
  background: #f8f9fa;
  border-top: 2px solid #f0f0f0;
}

.btn-download, .btn-profile {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-download {
  background: linear-gradient(135deg, #c01a62, #fe6bab);
  color: white;
}

.btn-profile {
  background: white;
  color: #c01a62;
  border: 2px solid #c01a62;
}

.btn-download:hover, .btn-profile:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(192, 26, 98, 0.2);
}

.btn-profile:hover {
  background: #c01a62;
  color: white;
}

@media (max-width: 768px) {
  .payments-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .order-item {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .ticket-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .detail-row {
    flex-direction: column;
    gap: 5px;
    text-align: left;
  }
  
  .detail-label {
    width: auto;
  }
  
  .ticket-footer {
    flex-direction: column;
  }
  
  .ticket-ribbon {
    right: -35px;
  }
  
  .profile-notification-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>