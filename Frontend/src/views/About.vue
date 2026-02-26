<template>
  <div class="about-container">
    <!-- Header -->
    <div class="about-header">
      <div class="brand-left">
        <div class="title-group">
          <h1>About & Contact</h1>
          <p class="subtitle">Get to know South of Somewhere</p>
        </div>
      </div>
    </div>

    <div class="about-content">
      <!-- About Section -->
      <section class="about-section glass-card">
        <h2><i class="uil uil-info-circle"></i> About Us</h2>
        <p class="about-text">
          South of Somewhere was born from a simple observation: Cape Town's most exciting events were happening all around us, but they were scattered across different platforms with no single place to find them.
        </p>
        <p class="about-text">
          What started as a personal quest to discover exclusive spaces and experiences evolved into something bigger — a platform that brings together the city's best events, from intimate networking nights to glamorous galas. Whether you're looking to expand your social circle, find professional opportunities, or simply experience something new, SOS is your gateway to what's happening in Cape Town.
        </p>
        <p class="about-text highlight">
          Because sometimes, the real glow-up isn't who you find — it's what you create.
        </p>
      </section>

      <!-- Team Section with Working Animated Avatars -->
      <section class="team-section glass-card">
        <h2><i class="uil uil-users-alt"></i> Our Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar emoji-avatar princess">
              👸🏽
            </div>
            <h3>Taaraa Haron</h3>
            <div class="sparkles">✨</div>
          </div>
          <div class="team-member">
            <div class="member-avatar emoji-avatar princess">
              👸🏽
            </div>
            <h3>Nina Lewis</h3>
            <div class="sparkles">✨</div>
          </div>
          <div class="team-member">
            <div class="member-avatar emoji-avatar prince">
              🤴🏽
            </div>
            <h3>Antonio Williams</h3>
            <div class="sparkles">👑</div>
          </div>
          <div class="team-member">
            <div class="member-avatar emoji-avatar princess">
              👸🏽
            </div>
            <h3>Sisonke Jada</h3>
            <div class="sparkles">✨</div>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section glass-card">
        <h2><i class="uil uil-envelope"></i> Get in Touch</h2>
        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-item">
              <i class="uil uil-map-marker"></i>
              <div>
                <h4>Visit Us</h4>
                <p>63 Shortmarket Street</p>
                <p>Cape Town, 8001</p>
              </div>
            </div>
            <div class="info-item">
              <i class="uil uil-phone"></i>
              <div>
                <h4>Call Us</h4>
                <p>+27 (0)21 123 4567</p>
                <p class="small">Mon-Fri, 9am-5pm</p>
              </div>
            </div>
            <div class="info-item">
              <i class="uil uil-envelope"></i>
              <div>
                <h4>Email Us</h4>
                <p>hello@sos.co.za</p>
                <p>support@sos.co.za</p>
              </div>
            </div>
          </div>

          <form class="contact-form" @submit.prevent="handleSubmit">
            <h3>Send us a message</h3>
            
            <div class="form-group">
              <input 
                type="text" 
                v-model="contactForm.name"
                placeholder="Your Name"
                class="form-input"
                :class="{ error: submitted && !contactForm.name }"
              >
            </div>

            <div class="form-group">
              <input 
                type="email" 
                v-model="contactForm.email"
                placeholder="Your Email"
                class="form-input"
                :class="{ error: submitted && !validEmail }"
              >
            </div>

            <div class="form-group">
              <select v-model="contactForm.subject" class="form-input">
                <option value="" disabled selected>Select Subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="event">List an Event</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>

            <div class="form-group">
              <textarea 
                v-model="contactForm.message"
                placeholder="Your Message"
                class="form-input textarea"
                rows="5"
                :class="{ error: submitted && !contactForm.message }"
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary" :disabled="sending">
              <span v-if="sending" class="loading-spinner"></span>
              <span v-else><i class="uil uil-message"></i> Send Message</span>
            </button>

            <div v-if="submitStatus === 'success'" class="success-message">
              <i class="uil uil-check-circle"></i>
              Message sent successfully! We'll get back to you soon.
            </div>

            <div v-if="submitStatus === 'error'" class="error-message">
              <i class="uil uil-exclamation-circle"></i>
              Something went wrong. Please try again.
            </div>
          </form>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section glass-card">
        <h2><i class="uil uil-question-circle"></i> Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h4>How do I discover events?</h4>
            <p>Swipe through events on our home page, or use the Explore page to search by date, category, or location.</p>
          </div>
          <div class="faq-item">
            <h4>Is SOS free to use?</h4>
            <p>Yes! Discovering events is completely free. You only pay when booking tickets to events.</p>
          </div>
          <div class="faq-item">
            <h4>How do I get my tickets?</h4>
            <p>After booking, you'll receive a digital ticket with a QR code that can be scanned at the venue.</p>
          </div>
          <div class="faq-item">
            <h4>Can I list my own event?</h4>
            <p>Absolutely! Contact us through the form above or email partnerships@sos.co.za to list your event.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const contactForm = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitted = ref(false)
const sending = ref(false)
const submitStatus = ref('')

const validEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.value.email)
})

const handleSubmit = async () => {
  submitted.value = true
  
  if (!contactForm.value.name || !validEmail.value || !contactForm.value.subject || !contactForm.value.message) {
    submitStatus.value = 'error'
    return
  }

  sending.value = true
  submitStatus.value = ''

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Success
    submitStatus.value = 'success'
    contactForm.value = { name: '', email: '', subject: '', message: '' }
    submitted.value = false
  } catch (error) {
    submitStatus.value = 'error'
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  padding: 20px;
}

/* Header */
.about-header {
  width: 100%;
  margin-bottom: 30px;
  padding: 0;
}

.brand-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.title-group {
  display: flex;
  flex-direction: column;
}

h1 {
  margin: 0;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  line-height: 1.2;
}

.subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: rgba(255,255,255,0.9);
}

/* Glass Card Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 24px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.about-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Section Headers */
section h2 {
  color: white;
  font-size: 22px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
}

section h2 i {
  font-size: 24px;
  color: #EEAECA;
}

/* About Section */
.about-text {
  color: white;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 15px;
  opacity: 0.95;
}

.about-text.highlight {
  font-style: italic;
  font-weight: 500;
  color: #fff5e6;
  margin-top: 20px;
  padding: 10px 0;
  border-top: 1px solid rgba(255,255,255,0.2);
}

/* Team Section */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
}

.team-member {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 25px 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.team-member:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.member-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 15px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  position: relative;
  z-index: 2;
}

/* Emoji Avatar Styles */
.emoji-avatar {
  display: flex !important;
  align-items: center;
  justify-content: center;
  font-size: 70px;
  background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1));
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

/* Background colors for each team member */
.team-member:nth-child(1) .emoji-avatar {
  background: linear-gradient(135deg, #c01a62, #fe6bab);
}

.team-member:nth-child(2) .emoji-avatar {
  background: linear-gradient(135deg, #9fef7d, #7acf5a);
}

.team-member:nth-child(3) .emoji-avatar {
  background: linear-gradient(135deg, #fe6bab, #c01a62);
}

.team-member:nth-child(4) .emoji-avatar {
  background: linear-gradient(135deg, #c01a62, #9fef7d);
}

.team-member h3 {
  color: white;
  margin-bottom: 5px;
  font-size: 18px;
}

.member-role {
  color: #EEAECA;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 14px;
}

/* Animation Styles */
@keyframes princessGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.3),
                0 10px 20px rgba(0,0,0,0.2),
                0 0 0 3px rgba(255,255,255,0.5);
  }
  50% {
    box-shadow: 0 0 30px 10px rgba(255, 215, 0, 0.6),
                0 15px 25px rgba(0,0,0,0.3),
                0 0 0 5px rgba(255,255,255,0.8);
  }
}

@keyframes princeGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(100, 149, 237, 0.3),
                0 10px 20px rgba(0,0,0,0.2),
                0 0 0 3px rgba(255,255,255,0.5);
  }
  50% {
    box-shadow: 0 0 30px 10px rgba(100, 149, 237, 0.6),
                0 15px 25px rgba(0,0,0,0.3),
                0 0 0 5px rgba(255,255,255,0.8);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spinSparkle {
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 0;
  }
  50% {
    transform: rotate(180deg) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 0;
  }
}

@keyframes bounceSparkle {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 1;
  }
}

/* Apply animations */
.princess {
  animation: princessGlow 3s ease-in-out infinite, float 4s ease-in-out infinite;
}

.prince {
  animation: princeGlow 3s ease-in-out infinite, float 4s ease-in-out infinite;
}

.sparkles {
  position: absolute;
  font-size: 20px;
  animation: spinSparkle 3s linear infinite;
  pointer-events: none;
  z-index: 3;
}

/* Position sparkles differently for each team member */
.team-member:nth-child(1) .sparkles {
  top: 10%;
  right: 10%;
  animation-delay: 0s;
}

.team-member:nth-child(2) .sparkles {
  bottom: 10%;
  left: 10%;
  animation-delay: 0.5s;
  animation: bounceSparkle 2.5s ease-in-out infinite;
}

.team-member:nth-child(3) .sparkles {
  top: 10%;
  left: 10%;
  animation-delay: 1s;
  font-size: 25px;
}

.team-member:nth-child(4) .sparkles {
  bottom: 10%;
  right: 10%;
  animation-delay: 1.5s;
  animation: bounceSparkle 3s ease-in-out infinite;
}

/* Add more sparkles on hover */
.team-member:hover .sparkles {
  animation-duration: 1.5s;
}

.team-member:hover .emoji-avatar {
  transform: scale(1.05);
}

/* Contact Section */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}

.contact-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
}

.info-item {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item i {
  font-size: 24px;
  color: #EEAECA;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-item h4 {
  color: white;
  margin-bottom: 5px;
  font-size: 16px;
}

.info-item p {
  color: rgba(255,255,255,0.9);
  margin: 0;
  line-height: 1.5;
}

.info-item .small {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

.contact-form {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
}

.contact-form h3 {
  color: white;
  margin-bottom: 20px;
  font-size: 18px;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input::placeholder {
  color: rgba(255,255,255,0.7);
}

.form-input:focus {
  outline: none;
  border-color: #EEAECA;
  background: rgba(255, 255, 255, 0.15);
}

.form-input.error {
  border-color: #ff6b6b;
}

.form-input.textarea {
  border-radius: 20px;
  resize: vertical;
}

select.form-input {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 16px;
}

select.form-input option {
  background: #c01a62;
  color: white;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 30px;
  background: linear-gradient(90deg, #EEAECA, #4caf50);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-message,
.error-message {
  margin-top: 20px;
  padding: 12px 18px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.success-message {
  background: rgba(76, 175, 80, 0.2);
  border: 1px solid rgba(76, 175, 80, 0.3);
  color: white;
}

.success-message i {
  color: #4caf50;
  font-size: 20px;
}

.error-message {
  background: rgba(255, 107, 107, 0.2);
  border: 1px solid rgba(255, 107, 107, 0.3);
  color: white;
}

.error-message i {
  color: #ff6b6b;
  font-size: 20px;
}

/* FAQ Section */
.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.faq-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.faq-item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.15);
}

.faq-item h4 {
  color: white;
  margin-bottom: 10px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.faq-item h4::before {
  content: '❓';
  font-size: 14px;
  color: #EEAECA;
}

.faq-item p {
  color: rgba(255,255,255,0.9);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

/* Responsive */
@media (max-width: 600px) {
  .about-container {
    padding: 15px;
  }
  
  .glass-card {
    padding: 20px;
  }
  
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 20px;
  }
  
  .emoji-avatar {
    font-size: 60px;
  }
}
</style>