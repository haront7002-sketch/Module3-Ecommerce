<template>
  <div class="payments-container">
    <!-- Header -->
    <div class="payments-header">
      <div class="brand">
        <div class="logo">SOS</div>
        <div>
          <h1>Payment</h1>
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

          <div class="order-item">
            <div class="item-details">
              <span class="item-label">Event</span>
              <span class="item-value">{{ order.title }}</span>
              <span class="item-ref">Ref: {{ order.eventId }}</span>
            </div>
            <div class="item-date">
              <span class="item-label">Date</span>
              <span class="item-value">{{ order.date }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="ticket-row">
            <div>
              <span class="item-label">Ticket Price</span>
              <span class="item-value">R {{ order.pricePerTicket }} each</span>
            </div>
            <div class="quantity-control">
              <button class="qty-btn" @click="qtyDown" :disabled="qty <= 1">-</button>
              <span class="qty-number">{{ qty }}</span>
              <button class="qty-btn" @click="qtyUp">+</button>
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
              <span>R {{ fee }}</span>
            </div>
            <div class="total-line final">
              <span>Total</span>
              <span>R {{ total }}</span>
            </div>
          </div>

          <p class="note">
            <i class="uil uil-info-circle"></i>
            Demo mode: this simulates payment success
          </p>
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

            <!-- Status Messages -->
            <div v-if="status === 'success'" class="success-message">
              <i class="uil uil-check-circle"></i>
              <div>
                <strong>Payment successful!</strong>
                <p v-if="reference">Reference: {{ reference }}</p>
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
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Order data from query params
const order = ref({
  eventId: route.query.eventId || "demo-001",
  title: route.query.title || "Cape Town Sunset Cruise",
  date: route.query.date || "Sat, 2 May 2026 • 18:00",
  pricePerTicket: Number(route.query.price || 250),
});

const qty = ref(1);
const method = ref("card");

const customer = reactive({
  name: "",
  email: "",
  phone: "",
});

const accepted = ref(false);
const submitted = ref(false);
const processing = ref(false);

const status = ref("");
const reference = ref("");

const banner = reactive({
  message: "",
  variant: "info",
});

const subtotal = computed(() => order.value.pricePerTicket * qty.value);
const fee = computed(() => Math.round(subtotal.value * 0.05));
const total = computed(() => subtotal.value + fee.value);

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

function makeRef() {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PAY-${code}`;
}

async function pay() {
  submitted.value = true;
  status.value = "";
  reference.value = "";
  banner.message = "";

  if (!customer.name || !validEmail.value || !accepted.value) {
    showBanner("Please complete all required fields", "warning");
    return;
  }

  processing.value = true;

  try {
    await new Promise((r) => setTimeout(r, 1500));
    reference.value = makeRef();
    status.value = "success";
    showBanner("Payment completed successfully!", "success");
  } catch (err) {
    console.error(err);
    status.value = "failed";
    showBanner("Payment failed. Please try again.", "error");
  } finally {
    processing.value = false;
  }
}
</script>

<style scoped>
.payments-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  padding: 20px;
}

/* Glass Card Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Header */
.payments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.brand {
  display: flex;
  gap: 15px;
  align-items: center;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 22px;
  color: #fff;
  background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

h1 {
  margin: 0;
  font-size: 26px;
  color: rgb(255, 255, 255);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: rgba(250, 250, 250, 0.9);
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

/* Content */
.payments-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 10px;
}

/* Banner */
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

.banner.info { background: rgba(64, 156, 255, 0.2); }
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

/* Grid Layout */
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

/* Order Summary */
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

.ticket-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.note {
  margin-top: 20px;
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 30px;
}

.note i {
  font-size: 16px;
  color: #AEE994;
}

/* Payment Form */
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

.success-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px;
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 30px;
  color: white;
}

.success-message i {
  font-size: 24px;
  color: #4caf50;
}

.success-message p {
  margin: 5px 0 0;
  font-size: 12px;
  color: rgba(255,255,255,0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .payments-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .order-item {
    flex-direction: column;
    gap: 15px;
  }
  
  .ticket-row {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .quantity-control {
    width: 100%;
    justify-content: center;
  }
}
</style>