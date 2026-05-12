<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ColorNamer from 'color-namer'

const route = useRoute()
const router = useRouter()
const colorHex = ref('#' + route.params.color)
const colorName = ref('')
const complimentaryColors = ref([])

onMounted(() => {
  try {
    const names = ColorNamer(colorHex.value)
    colorName.value = names.ntc?.[0]?.name || 
                     names.basic?.[0]?.name || 
                     names.html?.[0]?.name ||
                     'Unknown Color'
    
    // Расчет дополнительных цветов
    const rgb = hexToRgb(colorHex.value)
    if (rgb) {
      complimentaryColors.value = [
        { name: 'Дополнительный', color: rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b) },
        { name: 'Аналоговый 1', color: rgbToHex(rgb.r + 30, rgb.g - 30, rgb.b - 30) },
        { name: 'Аналоговый 2', color: rgbToHex(rgb.r - 30, rgb.g + 30, rgb.b + 30) },
        { name: 'Триада 1', color: rgbToHex(rgb.r + 50, rgb.g - 20, rgb.b - 20) },
        { name: 'Триада 2', color: rgbToHex(rgb.r - 20, rgb.g + 50, rgb.b - 20) }
      ]
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
})

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

const rgbToHex = (r, g, b) => {
  const clamp = (num) => Math.min(255, Math.max(0, num))
  return '#' + [clamp(r), clamp(g), clamp(b)].map(x => {
    const hex = Math.round(x).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

const copyColor = async (color) => {
  try {
    await navigator.clipboard.writeText(color)
    alert(`Цвет ${color} скопирован!`)
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}
</script>

<template>
  <div class="color-info-container">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/favorites" class="back-link">← Назад к избранному</router-link>
        <h1>Информация о цвете</h1>
      </div>
    </nav>

    <div class="color-info-content">
      <div class="main-color-card">
        <div class="main-color-preview" :style="{ backgroundColor: colorHex }"></div>
        <div class="main-color-details">
          <h2>{{ colorName }}</h2>
          <div class="color-code">{{ colorHex }}</div>
          <button @click="copyColor(colorHex)" class="copy-main-btn">Копировать цвет</button>
        </div>
      </div>

      <div class="complimentary-section">
        <h3>Сочетания цветов</h3>
        <div class="complimentary-grid">
          <div v-for="(color, index) in complimentaryColors" :key="index" class="complimentary-card">
            <div class="complimentary-preview" :style="{ backgroundColor: color.color }"></div>
            <div class="complimentary-info">
              <div class="complimentary-name">{{ color.name }}</div>
              <div class="complimentary-code">{{ color.color }}</div>
              <button @click="copyColor(color.color)" class="copy-complimentary-btn">Копировать</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.color-info-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #4a2c2c 0%, #241313 100%);
}

.navbar {
  position: sticky;
  top: 0;
  background: rgba(200, 99, 135, 0.45);
  backdrop-filter: blur(10px);
  padding: 15px 30px;
  z-index: 100;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.back-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: transform 0.2s;
}

.back-link:hover {
  transform: scale(1.05);
}

.nav-content h1 {
  color: white;
  font-size: 24px;
}

.color-info-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.main-color-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 40px;
  display: flex;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.main-color-preview {
  width: 200px;
  height: 200px;
}

.main-color-details {
  flex: 1;
  padding: 30px;
  text-align: center;
}

.main-color-details h2 {
  font-size: 28px;
  color: #4a2c2c;
  margin-bottom: 10px;
}

.color-code {
  font-size: 20px;
  font-family: monospace;
  font-weight: bold;
  margin-bottom: 20px;
  color: #666;
}

.copy-main-btn {
  padding: 12px 24px;
  background: #4a2c2c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
}

.copy-main-btn:hover {
  transform: scale(1.05);
}

.complimentary-section {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
}

.complimentary-section h3 {
  text-align: center;
  font-size: 24px;
  color: #4a2c2c;
  margin-bottom: 30px;
}

.complimentary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.complimentary-card {
  background: #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s;
}

.complimentary-card:hover {
  transform: translateY(-5px);
}

.complimentary-preview {
  height: 120px;
}

.complimentary-info {
  padding: 15px;
}

.complimentary-name {
  font-weight: bold;
  color: #4a2c2c;
  margin-bottom: 5px;
}

.complimentary-code {
  font-family: monospace;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.copy-complimentary-btn {
  padding: 6px 12px;
  background: #4a2c2c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: transform 0.2s;
}

.copy-complimentary-btn:hover {
  transform: scale(1.05);
}
</style>