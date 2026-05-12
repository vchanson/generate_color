<script setup>
import button1 from '../assets/пуговица.png'
import button2 from '../assets/пуговица звезда.png'
import button3 from '../assets/пуговица кролик.png'
import button4 from '../assets/пуговица тучка.png'
import button5 from '../assets/пуговица цветок.png'

const buttonIcons = [button1, button2, button3, button4, button5]

// Функция для получения случайной иконки
const getRandomButtonIcon = () => {
  const randomIndex = Math.floor(Math.random() * buttonIcons.length)
  return buttonIcons[randomIndex]
}

const getRandomStyle = () => {
  return {
    left: Math.random() * 100 + '%',
    top: Math.random() * 100 + '%',
    width: (Math.random() * 50 + 30) + 'px',
    height: (Math.random() * 50 + 30) + 'px',
    transform: `rotate(${Math.random() * 360}deg)`,
    animationDelay: Math.random() * 15 + 's',
    animationDuration: (Math.random() * 25 + 10) + 's',
    opacity: Math.random() * 0.5 + 0.15
  }
}
</script>

<template>
  <div class="buttons-background">
    <div v-for="i in 60" :key="i" class="button-float" :style="getRandomStyle()">
      <img :src="getRandomButtonIcon()" class="button-icon" alt="button">
    </div>
  </div>
</template>



<style scoped>
.buttons-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  background-color: #4a2c2c;
}

.button-float {
  position: absolute;
  pointer-events: none;
  animation: float 15s ease-in-out infinite;
  filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.2));
}

.button-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-30px) rotate(10deg);
  }
  50% {
    transform: translateY(10px) rotate(-5deg);
  }
  75% {
    transform: translateY(-15px) rotate(5deg);
  }
}
</style>