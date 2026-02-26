<template>
  <div class="about-container">
    <!-- Header -->
    <div class="about-header">
      <div class="brand-left">
        <div class="logo">
          <span>SOS</span>
        </div>
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
        I was on Tinder, half-serious, half-delusional, telling myself I was just “seeing what’s out there.” Translation? I was low-key looking for a rich man with a sharp suit and a sharper bank account.
        One night, after an exhausting scroll session, I switched over to Instagram to cleanse my eyes. That’s when I saw it — an Insta Reel. The woman in the video said confidently, “You won’t find wealthy men on dating apps. You find them in wealthy places. High-end events. Exclusive spaces.”
        I paused.
        High-end events? In Cape Town? I didn’t believe it. If there were glamorous galas, private launches, rooftop networking nights and fancy wine tastings happening around me, nobody sent me the invite.
        Still, the idea stuck.
        So I started searching. Instagram pages. Facebook events. Google. Everything was scattered. There were art exhibitions, tech meetups, food festivals, fashion pop-ups, business conferences — not just luxury events, but events of every kind. They were happening all the time… just hidden in different corners of the internet.
        And that’s when something clicked.
        Maybe the problem wasn’t that Cape Town lacked rich spaces. Maybe the problem was that there wasn’t one place to find them.
        So instead of chasing a rich man, I built a website.
        A platform that gathers events across the city — high-end galas, creative markets, music shows, networking nights, cultural festivals, everything. Not just for people looking for wealthy partners, but for anyone who wants to step outside their routine and experience what’s happening around them.
        Ironically, I stopped looking for a rich man and started building something richer.
        Because sometimes, the real glow-up isn’t who you find — it’s what you create.
        </p>
      </section>

      <!-- Team Section -->
      <section class="team-section glass-card">
        <h2><i class="uil uil-users-alt"></i> Our Team</h2>
        <div class="team-grid">
          <div class="team-member">
            <div class="member-avatar">
              <img src="https://placehold.co/120x120?text=Team" alt="Team member">
            </div>
            <h3>Taaraa Haron</h3>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <img src="https://placehold.co/120x120?text=Team" alt="Team member">
            </div>
            <h3>Nina Lewis</h3>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <img src="https://placehold.co/120x120?text=Team" alt="Team member">
            </div>
            <h3>Antonio Williams</h3>
          </div>
          <div class="team-member">
            <div class="member-avatar">
              <img src="https://placehold.co/120x120?text=Team" alt="Team member">
            </div>
            <h3>Sisonke Jada</h3>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="contact-section glass-card">
        <h2><i class="uil uil-envelope"></i> Get in Touch</h2>
        <div class="contact-grid">
          <div class="contact-info">
            <div class="info-item">
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

.logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 20px;
  background: white;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  flex-shrink: 0;
}

.logo span {
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
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
  margin-bottom: 30px;
  opacity: 0.95;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-card i {
  font-size: 32px;
  color: #EEAECA;
  margin-bottom: 10px;
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 5px;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

/* Team Section */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.team-member {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
  text-align: center;
  transition: all 0.3s ease;
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
}

.member-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.member-bio {
  color: rgba(255,255,255,0.9);
  font-size: 13px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.member-social {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-link:hover {
  background: #EEAECA;
  transform: scale(1.1);
  color: #2d3436;
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
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
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
  
  .stat-number {
    font-size: 22px;
  }
}
</style>