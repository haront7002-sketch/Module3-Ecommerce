<template>
  <div class="swipe-container">
    <div class="swipe-header">
      <div class="brand">
        <div class="logo">SOS</div>
        <div>
          <h1>Discover Events</h1>
          <p class="subtitle">Swipe right to like, left to pass</p>
        </div>
      </div>
      <div class="stats">
        <span class="stat-item">
          <i class="uil uil-heart" style="color: #ff6b6b;"></i> {{ likedCount }}
        </span>
        <span class="stat-item">
          <i class="uil uil-eye"></i> {{ cardsData.length - currentCardIndex }} left
        </span>
      </div>
    </div>
    
    <div class="card-container">
      <Card
        v-for="(card, index) in visibleCards"
        :key="card.id"
        :cardData="card"
        :index="currentCardIndex + index"
        :currentIndex="currentCardIndex"
        :isTopCard="index === 0"
        @swipe-complete="handleSwipeComplete"
        @drag-start="handleDragStart"
        @drag-end="handleDragEnd"
        ref="cards"
      />
    </div>

    <div class="no-cards" :class="{ active: noCardsLeft }">
      <i class="uil uil-frown"></i>
      <h2>No more events!</h2>
      <p>Check back later for new events or explore the map</p>
      <div class="empty-actions">
        <router-link to="/explore" class="btn btn-primary">
          <i class="uil uil-calendar-alt"></i> Explore Events
        </router-link>
        <router-link to="/map" class="btn btn-secondary">
          <i class="uil uil-map-marker"></i> View Map
        </router-link>
      </div>
    </div>

    <div class="action-buttons" v-if="!noCardsLeft">
      <button class="action-btn nope" @click="swipeCard('left')">
        <i class="uil uil-times"></i>
      </button>
      <button class="action-btn like" @click="swipeCard('right')">
        <i class="uil uil-heart"></i>
      </button>
    </div>
  </div>
</template>

<script>
import Card from '@/components/card.vue'

export default {
  name: 'SwipeView',
  components: {
    Card
  },
  data() {
    return {
      cardsData: [
        { 
          id: 1, 
          emoji: '🎶', 
          title: 'V&A Waterfront Live Music', 
          description: 'Live performances and vibe near the harbor.',
          area: 'V&A Waterfront',
          location: 'Amphitheatre, V&A Waterfront',
          price: 120,
          category: 'Music & Nightlife',
          date: '2026-03-15',
          time: '18:00',
          lat: -33.9036,
          lng: 18.4219
        },
        { 
          id: 2, 
          emoji: '⛰️', 
          title: 'Table Mountain Sunrise Hike', 
          description: 'Guided hike with sunrise views.',
          area: 'Table Mountain',
          location: 'Table Mountain National Park',
          price: 250,
          category: 'Sports & Adventure',
          date: '2026-03-16',
          time: '05:30',
          lat: -33.9628,
          lng: 18.4098
        },
        { 
          id: 3, 
          emoji: '🌟', 
          title: 'Camps Bay Sunset Social', 
          description: 'Sunset vibes, food & DJs on the strip.',
          area: 'Camps Bay',
          location: 'Camps Bay Beach',
          price: 180,
          category: 'Social Vibes',
          date: '2026-03-16',
          time: '17:00',
          lat: -33.9519,
          lng: 18.3773
        },
        { 
          id: 4, 
          emoji: '🎭', 
          title: 'Old Biscuit Mill Market', 
          description: 'Food stalls, fashion and local crafts.',
          area: 'Woodstock',
          location: 'Old Biscuit Mill',
          price: 50,
          category: 'Food & Drink',
          date: '2026-03-17',
          time: '09:00',
          lat: -33.9273,
          lng: 18.4484
        },
        { 
          id: 5, 
          emoji: '🎪', 
          title: 'Beach Yoga Session', 
          description: 'Morning yoga with ocean views.',
          area: 'Clifton',
          location: 'Clifton 4th Beach',
          price: 150,
          category: 'Wellness & Body',
          date: '2026-03-18',
          time: '07:00',
          lat: -33.9398,
          lng: 18.3762
        },
      ],
      currentCardIndex: 0,
      isDragging: false,
      likedEvents: []
    }
  },
  computed: {
    visibleCards() {
      // Show current card and next 2 cards for stack effect
      return this.cardsData.slice(this.currentCardIndex, this.currentCardIndex + 3);
    },
    noCardsLeft() {
      return this.currentCardIndex >= this.cardsData.length;
    },
    likedCount() {
      return this.likedEvents.length;
    }
  },
  mounted() {
    // Load liked events from localStorage
    const stored = localStorage.getItem('favourites')
    if (stored) {
      this.likedEvents = JSON.parse(stored)
    }
  },
  methods: {
    handleSwipeComplete(direction) {
      console.log(`Card swiped ${direction}`);
      
      // Get the current card that was swiped
      const swipedCard = this.cardsData[this.currentCardIndex];
      
      // Handle like/nope actions
      if (direction === 'right') {
        // User liked the card - add to favourites
        this.addToFavourites(swipedCard);
      }
      
      // Increment index to show next card
      this.currentCardIndex++;
    },
    
    addToFavourites(event) {
      // Check if already in favourites
      if (!this.likedEvents.some(e => e.id === event.id)) {
        this.likedEvents.push(event);
        
        // Get existing favourites from localStorage
        const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
        
        // Add if not already there
        if (!favourites.some(fav => fav.id === event.id)) {
          favourites.push(event);
          localStorage.setItem('favourites', JSON.stringify(favourites));
        }
        
        // Show a subtle notification
        this.showNotification('Added to favourites!');
      }
    },
    
    showNotification(message) {
      // Create a temporary notification
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4caf50, #45a049);
        color: white;
        padding: 12px 24px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
      `;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    },
    
    handleDragStart() {
      this.isDragging = true;
    },
    
    handleDragEnd() {
      this.isDragging = false;
    },
    
    swipeCard(direction) {
      // Prevent swiping if no cards left or currently dragging
      if (this.noCardsLeft || this.isDragging) return;
      
      // Get the top card component (first in the refs array)
      const topCard = this.$refs.cards?.[0];
      if (topCard) {
        topCard.programmaticSwipe(direction);
      }
    },
    
    resetCards() {
      this.currentCardIndex = 0;
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.swipe-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #c01a62 0%, #fe6bab 50%, #9fef7d 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
}

.swipe-header {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-weight: 900;
  font-size: 20px;
  color: #fff;
  background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

h1 {
  margin: 0;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.subtitle {
  margin: 4px 0 0;
  font-size: 12px;
  color: rgba(255,255,255,0.9);
}

.stats {
  display: flex;
  gap: 15px;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 30px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.stat-item i {
  font-size: 16px;
}

.card-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 550px;
  margin: 20px auto 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 25px;
  margin-top: 20px;
  position: relative;
  z-index: 10;
}

.action-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: scale(1.1) translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.3);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.nope {
  background: #ff6b6b;
  color: white;
}

.action-btn.like {
  background: #4caf50;
  color: white;
}

.no-cards {
  text-align: center;
  color: white;
  display: none;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 40px;
  max-width: 400px;
  margin: 40px auto;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.no-cards.active {
  display: block;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.no-cards i {
  font-size: 60px;
  margin-bottom: 20px;
  color: rgba(255,255,255,0.9);
}

.no-cards h2 {
  font-size: 28px;
  margin-bottom: 10px;
  color: white;
}

.no-cards p {
  color: rgba(255,255,255,0.9);
  margin-bottom: 25px;
}

.empty-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #4caf50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(76, 175, 80, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-2px);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .swipe-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .card-container {
    height: 500px;
  }
  
  .action-btn {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }
  
  .empty-actions {
    flex-direction: column;
  }
}
</style>