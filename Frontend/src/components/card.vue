<template>
  <div 
    class="card" 
    :class="{ dragging: isDragging, removing: isRemoving }"
    :style="cardStyle"
    @mousedown="handleDragStart"
    @touchstart="handleDragStart"
  >
    <div class="card-content">
      <div class="card-emoji">{{ cardData.emoji }}</div>
      <div class="card-title">{{ cardData.title }}</div>
      <div class="card-description">{{ cardData.description }}</div>
    </div>
    <div class="swipe-indicator like-indicator" :style="{ opacity: likeOpacity }">LIKE</div>
    <div class="swipe-indicator nope-indicator" :style="{ opacity: nopeOpacity }">NOPE</div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    cardData: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    currentIndex: {
      type: Number,
      required: true
    },
    isTopCard: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDragging: false,
      isRemoving: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      likeOpacity: 0,
      nopeOpacity: 0,
      position: { x: 0, y: 0, rotation: 0 }
    }
  },
  computed: {
    cardStyle() {
      const stackPosition = this.index - this.currentIndex;
      
      if (this.isRemoving) {
        return {
          transform: `translateX(${this.position.x}px) translateY(${this.position.y}px) rotate(${this.position.rotation}deg)`,
          opacity: Math.max(0, 1 - Math.abs(this.position.x) / 500),
          zIndex: 100 - stackPosition,
          transition: 'transform 0.5s ease, opacity 0.5s ease'
        };
      }
      
      if (this.isDragging) {
        return {
          transform: `translate(${this.currentX}px, ${this.currentY}px) rotate(${this.currentX / 10}deg)`,
          opacity: 1 - Math.abs(this.currentX) / 500,
          zIndex: 100 - stackPosition,
          transition: 'none'
        };
      }

      // Default stacked position
      const scale = 1 - stackPosition * 0.05;
      const yOffset = stackPosition * 10;
      
      return {
        transform: `scale(${scale}) translateY(${yOffset}px)`,
        zIndex: 100 - stackPosition,
        pointerEvents: this.isTopCard ? 'auto' : 'none',
        transition: 'transform 0.3s ease, opacity 0.3s ease'
      };
    }
  },
  methods: {
    handleDragStart(e) {
      if (!this.isTopCard) return;
      
      this.isDragging = true;
      this.$emit('drag-start');
      
      // Prevent default to avoid text selection while dragging
      e.preventDefault();
      
      if (e.type === 'mousedown') {
        this.startX = e.clientX;
        this.startY = e.clientY;
        document.addEventListener('mousemove', this.handleDragMove);
        document.addEventListener('mouseup', this.handleDragEnd);
      } else {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        document.addEventListener('touchmove', this.handleDragMove, { passive: false });
        document.addEventListener('touchend', this.handleDragEnd);
        document.addEventListener('touchcancel', this.handleDragEnd);
      }
    },
    
    handleDragMove(e) {
      if (!this.isDragging) return;

      // Prevent default to avoid page scroll while dragging
      e.preventDefault();

      let clientX, clientY;
      if (e.type === 'mousemove') {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }

      this.currentX = clientX - this.startX;
      this.currentY = clientY - this.startY;

      // Update indicators
      if (this.currentX > 50) {
        this.likeOpacity = Math.min(this.currentX / 100, 1);
        this.nopeOpacity = 0;
      } else if (this.currentX < -50) {
        this.nopeOpacity = Math.min(Math.abs(this.currentX) / 100, 1);
        this.likeOpacity = 0;
      } else {
        this.likeOpacity = 0;
        this.nopeOpacity = 0;
      }
    },
    
    handleDragEnd() {
      if (!this.isDragging) return;
      
      // Remove event listeners
      document.removeEventListener('mousemove', this.handleDragMove);
      document.removeEventListener('mouseup', this.handleDragEnd);
      document.removeEventListener('touchmove', this.handleDragMove);
      document.removeEventListener('touchend', this.handleDragEnd);
      document.removeEventListener('touchcancel', this.handleDragEnd);

      const swipeThreshold = 100;
      const direction = this.currentX > 0 ? 'right' : 'left';

      if (Math.abs(this.currentX) > swipeThreshold) {
        this.swipeCard(direction);
      } else {
        this.resetPosition();
      }
      
      this.isDragging = false;
      this.$emit('drag-end');
    },
    
    swipeCard(direction) {
      this.isRemoving = true;
      const moveDistance = direction === 'right' ? 1000 : -1000;
      this.position = {
        x: moveDistance,
        y: 0,
        rotation: moveDistance / 10
      };

      setTimeout(() => {
        this.$emit('swipe-complete', direction);
      }, 500);
    },
    
    resetPosition() {
      this.currentX = 0;
      this.currentY = 0;
      this.likeOpacity = 0;
      this.nopeOpacity = 0;
    },
    
    programmaticSwipe(direction) {
      if (!this.isTopCard || this.isRemoving) return;
      this.swipeCard(direction);
    }
  },
  beforeUnmount() {
    // Clean up event listeners
    document.removeEventListener('mousemove', this.handleDragMove);
    document.removeEventListener('mouseup', this.handleDragEnd);
    document.removeEventListener('touchmove', this.handleDragMove);
    document.removeEventListener('touchend', this.handleDragEnd);
    document.removeEventListener('touchcancel', this.handleDragEnd);
  }
}
</script>

<style scoped>
.card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  cursor: grab;
  user-select: none;
  top: 0;
  left: 0;
}

.card.dragging {
  cursor: grabbing;
}

.card-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
}

.card-emoji {
  font-size: 100px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
}

.card-description {
  font-size: 18px;
  color: rgba(255,255,255,0.9);
  text-align: center;
}

.swipe-indicator {
  position: absolute;
  top: 50px;
  font-size: 48px;
  font-weight: bold;
  padding: 10px 30px;
  border: 5px solid;
  border-radius: 10px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.1s ease;
}

.like-indicator {
  left: 50px;
  color: #4caf50;
  border-color: #4caf50;
  transform: rotate(-20deg);
}

.nope-indicator {
  right: 50px;
  color: #f44336;
  border-color: #f44336;
  transform: rotate(20deg);
}
</style>
