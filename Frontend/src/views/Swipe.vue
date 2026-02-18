<template>
  <div class="swipe-container">
    <h1>Swipeable Cards</h1>
    
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
      <h2>No more cards!</h2>
      <button class="reset-btn" @click="resetCards">Reset Cards</button>
    </div>

    <div class="buttons" v-if="!noCardsLeft">
      <button class="btn btn-nope" @click="swipeCard('left')">✕</button>
      <button class="btn btn-like" @click="swipeCard('right')">♥</button>
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
        { id: 1, emoji: '🎨', title: 'Card 1', description: 'First amazing card' },
        { id: 2, emoji: '🚀', title: 'Card 2', description: 'Second cool card' },
        { id: 3, emoji: '🌟', title: 'Card 3', description: 'Third stellar card' },
        { id: 4, emoji: '🎭', title: 'Card 4', description: 'Fourth creative card' },
        { id: 5, emoji: '🎪', title: 'Card 5', description: 'Fifth fun card' },
      ],
      currentCardIndex: 0,
      isDragging: false
    }
  },
  computed: {
    visibleCards() {
      // Show current card and next 2 cards for stack effect
      return this.cardsData.slice(this.currentCardIndex, this.currentCardIndex + 3);
    },
    noCardsLeft() {
      return this.currentCardIndex >= this.cardsData.length;
    }
  },
  methods: {
    handleSwipeComplete(direction) {
      console.log(`Card swiped ${direction}`);
      // Increment index to show next card
      this.currentCardIndex++;
      
      // Optional: Handle like/nope actions here
      if (direction === 'right') {
        // User liked the card - you can store likes, make API calls, etc.
        console.log('Liked card:', this.cardsData[this.currentCardIndex - 1]);
      } else if (direction === 'left') {
        // User passed on the card
        console.log('Passed on card:', this.cardsData[this.currentCardIndex - 1]);
      }
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
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #ffc3a0 0%, #ffafbd 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #fff;
  margin-bottom: 30px;
  font-size: 2.5em;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.card-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 500px;
  margin-bottom: 40px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
}

.btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:hover {
  transform: scale(1.1);
  box-shadow: 0 7px 25px rgba(0,0,0,0.4);
}

.btn:active {
  transform: scale(0.95);
}

.btn-nope {
  background: #f44336;
  color: white;
}

.btn-like {
  background: #4caf50;
  color: white;
}

.no-cards {
  text-align: center;
  color: white;
  display: none;
  margin-bottom: 40px;
}

.no-cards.active {
  display: block;
}

.no-cards h2 {
  font-size: 32px;
  margin-bottom: 20px;
}

.reset-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 18px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0,0,0,0.3);
  transition: transform 0.2s ease;
}

.reset-btn:hover {
  transform: scale(1.05);
}
</style>