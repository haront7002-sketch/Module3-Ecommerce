<template>
  <div 
    class="card" 
    :class="{ dragging: isDragging, removing: isRemoving }"
    :style="cardStyle"
    @mousedown="handleDragStart"
    @touchstart="handleDragStart"
  >
    <div class="card-content">
      <img
        class="card-image"
        :src="eventData.image_url || 'https://placehold.co/280x180?text=Event'"
        alt="Event image"
      />
      <div class="card-title">{{ eventData.event_title || eventData.title }}</div>
      <div class="card-description">{{ eventData.description }}</div>
      <div class="card-category">{{ eventData.category || eventData.category_name }}</div>
    </div>
    <div class="swipe-indicator like-indicator" :style="{ opacity: likeOpacity }">LIKE</div>
    <div class="swipe-indicator nope-indicator" :style="{ opacity: nopeOpacity }">NOPE</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  eventData: {
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
})

const emit = defineEmits(['swipe-complete', 'drag-start', 'drag-end'])

// State
const isDragging = ref(false)
const isRemoving = ref(false)
const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const likeOpacity = ref(0)
const nopeOpacity = ref(0)
const position = ref({ x: 0, y: 0, rotation: 0 })

// Computed
const cardStyle = computed(() => {
  const stackPosition = props.index - props.currentIndex
  
  if (isRemoving.value) {
    return {
      transform: `translateX(${position.value.x}px) translateY(${position.value.y}px) rotate(${position.value.rotation}deg)`,
      opacity: Math.max(0, 1 - Math.abs(position.value.x) / 500),
      zIndex: 100 - stackPosition,
      transition: 'transform 0.5s ease, opacity 0.5s ease'
    }
  }
  
  if (isDragging.value) {
    return {
      transform: `translate(${currentX.value}px, ${currentY.value}px) rotate(${currentX.value / 10}deg)`,
      opacity: 1 - Math.abs(currentX.value) / 500,
      zIndex: 100 - stackPosition,
      transition: 'none'
    }
  }

  // Default stacked position
  const scale = 1 - stackPosition * 0.05
  const yOffset = stackPosition * 10
  
  return {
    transform: `scale(${scale}) translateY(${yOffset}px)`,
    zIndex: 100 - stackPosition,
    pointerEvents: props.isTopCard ? 'auto' : 'none',
    transition: 'transform 0.3s ease, opacity 0.3s ease'
  }
})

const handleDragStart = (e) => {
  if (!props.isTopCard) return
  
  isDragging.value = true
  emit('drag-start')
  
  e.preventDefault()
  
  if (e.type === 'mousedown') {
    startX.value = e.clientX
    startY.value = e.clientY
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
  } else {
    startX.value = e.touches[0].clientX
    startY.value = e.touches[0].clientY
    document.addEventListener('touchmove', handleDragMove, { passive: false })
    document.addEventListener('touchend', handleDragEnd)
    document.addEventListener('touchcancel', handleDragEnd)
  }
}

const handleDragMove = (e) => {
  if (!isDragging.value) return

  e.preventDefault()

  let clientX, clientY
  if (e.type === 'mousemove') {
    clientX = e.clientX
    clientY = e.clientY
  } else {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  }

  currentX.value = clientX - startX.value
  currentY.value = clientY - startY.value

  // Update indicators
  if (currentX.value > 50) {
    likeOpacity.value = Math.min(currentX.value / 100, 1)
    nopeOpacity.value = 0
  } else if (currentX.value < -50) {
    nopeOpacity.value = Math.min(Math.abs(currentX.value) / 100, 1)
    likeOpacity.value = 0
  } else {
    likeOpacity.value = 0
    nopeOpacity.value = 0
  }
}

const handleDragEnd = () => {
  if (!isDragging.value) return
  
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)
  document.removeEventListener('touchcancel', handleDragEnd)

  const swipeThreshold = 100
  const direction = currentX.value > 0 ? 'right' : 'left'

  if (Math.abs(currentX.value) > swipeThreshold) {
    swipeCard(direction)
  } else {
    resetPosition()
  }
  
  isDragging.value = false
  emit('drag-end')
}

const swipeCard = (direction) => {
  isRemoving.value = true
  const moveDistance = direction === 'right' ? 1000 : -1000
  position.value = {
    x: moveDistance,
    y: 0,
    rotation: moveDistance / 10
  }

  setTimeout(() => {
    emit('swipe-complete', direction, props.eventData)
  }, 500)
}

const resetPosition = () => {
  currentX.value = 0
  currentY.value = 0
  likeOpacity.value = 0
  nopeOpacity.value = 0
}

const programmaticSwipe = (direction) => {
  if (!props.isTopCard || isRemoving.value) return
  swipeCard(direction)
}

// Expose method to parent
defineExpose({
  programmaticSwipe
})

// Clean up event listeners
const cleanup = () => {
  document.removeEventListener('mousemove', handleDragMove)
  document.removeEventListener('mouseup', handleDragEnd)
  document.removeEventListener('touchmove', handleDragMove)
  document.removeEventListener('touchend', handleDragEnd)
  document.removeEventListener('touchcancel', handleDragEnd)
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
  padding: 40px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
}

.card-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 16px;
  margin-bottom: 20px;
}

.card-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.card-description {
  font-size: 16px;
  color: rgba(255,255,255,0.9);
  text-align: center;
  margin-bottom: 20px;
  line-height: 1.5;
}

.card-category {
  font-size: 14px;
  color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  align-self: center;
  font-weight: 600;
  margin-bottom: 16px;
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
