<script setup>

import { ref } from 'vue'
import vinylImg from '../src/assets/фон.png'
import polaroidImg from '../src/assets/полароид.png'
import closeIcon from '../src/assets/закрыть.png'
import generateButtonImg from '../src/assets/кнопка2.png'
import addButtonImg from '../src/assets/кнопка.png'
import ColorNamer from 'color-namer'
import HelloWorld from './components/HelloWorld.vue'
import popa from './components/popa.vue'

// Иконки для панели
import copyIcon from '../src/assets/copy.png'
import replaceIcon from '../src/assets/swap.png'
import editIcon from '../src/assets/edit.png'
import heartIcon from '../src/assets/heart.png'
import heartFilledIcon from '../src/assets/heart-filled.png'

// Массив полароидов
const polaroids = ref({
  slot1: null,
  slot2: null,
  slot3: null
})

// Состояния
const showToast = ref(false)
const toastMessage = ref('')
const toastTimeout = ref(null)

let nextId = 1

// Функция генерации случайного цвета
const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

// Функция получения названия цвета через библиотеку color-namer
const getColorName = (hex) => {
  try {
    const names = ColorNamer(hex)
    const name = names.ntc?.[0]?.name || 
                 names.basic?.[0]?.name || 
                 names.html?.[0]?.name ||
                 names.x11?.[0]?.name ||
                 'Unknown Color'
    return name
  } catch (error) {
    console.error('Ошибка определения цвета:', error)
    return 'Unknown Color'
  }
}

// Показать всплывающее сообщение
const showToastMessage = (message) => {
  if (toastTimeout.value) clearTimeout(toastTimeout.value)
  toastMessage.value = message
  showToast.value = true
  toastTimeout.value = setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// Функция копирования цвета
const copyColor = async (color) => {
  try {
    await navigator.clipboard.writeText(color)
    showToastMessage(`Скопировано!`)
  } catch (err) {
    console.error('Ошибка копирования:', err)
  }
}

// Функция замены цвета
const replaceColor = (slot) => {
  const newColor = generateRandomColor()
  if (slot === 1) polaroids.value.slot1.color = newColor
  if (slot === 2) polaroids.value.slot2.color = newColor
  if (slot === 3) polaroids.value.slot3.color = newColor
}

// Редактирование цвета
const editColor = (slot) => {
  const input = document.createElement('input')
  input.type = 'color'
  input.value = slot === 1 ? polaroids.value.slot1?.color : 
                 slot === 2 ? polaroids.value.slot2?.color : 
                 polaroids.value.slot3?.color
  
  input.addEventListener('input', (e) => {
    const newColor = e.target.value
    if (slot === 1 && polaroids.value.slot1) polaroids.value.slot1.color = newColor
    if (slot === 2 && polaroids.value.slot2) polaroids.value.slot2.color = newColor
    if (slot === 3 && polaroids.value.slot3) polaroids.value.slot3.color = newColor
  })
  
  input.click()
}

// Добавить/удалить из избранного
const toggleFavorite = (slot) => {
  const polaroid = getPolaroidBySlot(slot)
  if (polaroid) {
    polaroid.isFavorite = !polaroid.isFavorite
  }
}

const getPolaroidBySlot = (slot) => {
  if (slot === 1) return polaroids.value.slot1
  if (slot === 2) return polaroids.value.slot2
  if (slot === 3) return polaroids.value.slot3
  return null
}

// Функция первой генерации
const generateFirst = () => {
  if (polaroids.value.slot1 === null && polaroids.value.slot2 === null && polaroids.value.slot3 === null) {
    polaroids.value.slot1 = {
      id: nextId++,
      color: generateRandomColor(),
      slot: 1,
      isFavorite: false
    }
  }
}

// Функция добавления полароида
const addPolaroid = () => {
  if (polaroids.value.slot1 === null) {
    polaroids.value.slot1 = {
      id: nextId++,
      color: generateRandomColor(),
      slot: 1,
      isFavorite: false
    }
  } 
  else if (polaroids.value.slot2 === null) {
    polaroids.value.slot2 = {
      id: nextId++,
      color: generateRandomColor(),
      slot: 2,
      isFavorite: false
    }
  } 
  else if (polaroids.value.slot3 === null) {
    polaroids.value.slot3 = {
      id: nextId++,
      color: generateRandomColor(),
      slot: 3,
      isFavorite: false
    }
  }
}

const closePolaroid = (slot) => {
  if (slot === 1) polaroids.value.slot1 = null
  if (slot === 2) polaroids.value.slot2 = null
  if (slot === 3) polaroids.value.slot3 = null
}

const hasAnyPolaroid = () => {
  return polaroids.value.slot1 !== null || polaroids.value.slot2 !== null || polaroids.value.slot3 !== null
}

const isMaxReached = () => {
  return polaroids.value.slot1 && polaroids.value.slot2 && polaroids.value.slot3
}

const canGenerate = () => {
  return !hasAnyPolaroid()
}



</script>

<template>
  <div class="container">
    <div class="background-wrapper">
      <img :src="vinylImg" class="background-image" alt="Пластинка">
      
      <h1 class="main-title">Генератор цветов</h1>
      
      <div class="generate-button-container">
        <button class="generate-button" @click="generateFirst" :disabled="!canGenerate()">
          <span>Сгенерировать</span>
        </button>
      </div>
      
      <div class="add-button-container" v-if="hasAnyPolaroid()">
        <button class="add-button" @click="addPolaroid" :disabled="isMaxReached()">
          <span>Добавить</span>
        </button>
      </div>
      
      <!-- Полароид 1 -->
      <div v-if="polaroids.slot1" class="polaroid-wrapper polaroid-slot-1">
        <div class="color-square" :style="{ backgroundColor: polaroids.slot1.color }">
          <div class="action-panel">
            <button class="action-btn" @click="copyColor(polaroids.slot1.color)" title="Копировать цвет">
              <img :src="copyIcon" alt="Копировать">
            </button>
            <button class="action-btn" @click="replaceColor(1)" title="Сгенерировать новый цвет">
              <img :src="replaceIcon" alt="Заменить">
            </button>
            <button class="action-btn" @click="editColor(1)" title="Редактировать цвет">
              <img :src="editIcon" alt="Редактировать">
            </button>
            <button class="action-btn" @click="toggleFavorite(1)" :title="polaroids.slot1.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'">
              <img :src="polaroids.slot1.isFavorite ? heartFilledIcon : heartIcon" alt="Избранное">
            </button>
          </div>
          <div class="color-name-top">{{ getColorName(polaroids.slot1.color) }}</div>
          <div class="color-info">
            <div class="color-code">{{ polaroids.slot1.color }}</div>
          </div>
        </div>
        <img :src="polaroidImg" class="polaroid" alt="Полароид">
        <button class="close-button" @click="closePolaroid(1)">
          <img :src="closeIcon" alt="Закрыть">
        </button>
      </div>
      
      <!-- Полароид 2 -->
      <div v-if="polaroids.slot2" class="polaroid-wrapper polaroid-slot-2">
        <div class="color-square" :style="{ backgroundColor: polaroids.slot2.color }">
          <div class="action-panel">
            <button class="action-btn" @click="copyColor(polaroids.slot2.color)" title="Копировать цвет">
              <img :src="copyIcon" alt="Копировать">
            </button>
            <button class="action-btn" @click="replaceColor(2)" title="Сгенерировать новый цвет">
              <img :src="replaceIcon" alt="Заменить">
            </button>
            <button class="action-btn" @click="editColor(2)" title="Редактировать цвет">
              <img :src="editIcon" alt="Редактировать">
            </button>
            <button class="action-btn" @click="toggleFavorite(2)" :title="polaroids.slot2.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'">
              <img :src="polaroids.slot2.isFavorite ? heartFilledIcon : heartIcon" alt="Избранное">
            </button>
          </div>
          <div class="color-name-top">{{ getColorName(polaroids.slot2.color) }}</div>
          <div class="color-info">
            <div class="color-code">{{ polaroids.slot2.color }}</div>
          </div>
        </div>
        <img :src="polaroidImg" class="polaroid" alt="Полароид">
        <button class="close-button" @click="closePolaroid(2)">
          <img :src="closeIcon" alt="Закрыть">
        </button>
      </div>
      
      <!-- Полароид 3 -->
      <div v-if="polaroids.slot3" class="polaroid-wrapper polaroid-slot-3">
        <div class="color-square" :style="{ backgroundColor: polaroids.slot3.color }">
          <div class="action-panel">
            <button class="action-btn" @click="copyColor(polaroids.slot3.color)" title="Копировать цвет">
              <img :src="copyIcon" alt="Копировать">
            </button>
            <button class="action-btn" @click="replaceColor(3)" title="Сгенерировать новый цвет">
              <img :src="replaceIcon" alt="Заменить">
            </button>
            <button class="action-btn" @click="editColor(3)" title="Редактировать цвет">
              <img :src="editIcon" alt="Редактировать">
            </button>
            <button class="action-btn" @click="toggleFavorite(3)" :title="polaroids.slot3.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'">
              <img :src="polaroids.slot3.isFavorite ? heartFilledIcon : heartIcon" alt="Избранное">
            </button>
          </div>
          <div class="color-name-top">{{ getColorName(polaroids.slot3.color) }}</div>
          <div class="color-info">
            <div class="color-code">{{ polaroids.slot3.color }}</div>
          </div>
        </div>
        <img :src="polaroidImg" class="polaroid" alt="Полароид">
        <button class="close-button" @click="closePolaroid(3)">
          <img :src="closeIcon" alt="Закрыть">
        </button>
      </div>
    </div>
    
    <!-- Всплывающее уведомление -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification">
        {{ toastMessage }}
      </div>
    </transition>
    
    <div class="info-wrapper" v-if="isMaxReached()">
      <p class="limit-info">Достигнут лимит (3 цвета)</p>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.background-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #241313;
}

.background-image {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  object-position: center;
  display: block;
}

.main-title {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-size: 36px;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  z-index: 20;
  white-space: nowrap;
  font-weight: bold;
}

.generate-button-container {
  position: absolute;
  top: 20%;
  right: 5%;
  z-index: 20;
}

.generate-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background-image: url('../src/assets/кнопка2.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  background-color: transparent;
  color: #241313;
  transition: all 0.3s ease;
  width: 150px;
  height: 70px;
}

.generate-button span {
  display: block;
  color: #241313;
  font-weight: bold;
  background: transparent;
}

.generate-button:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-2px);
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-button-container {
  position: absolute;
  top: 32%;
  right: 5%;
  z-index: 20;
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  background-image: url('../src/assets/кнопка.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  background-color: transparent;
  color: #241313;
  transition: all 0.3s ease;
  width: 150px;
  height: 70px;
}

.add-button span {
  display: block;
  color: #241313;
  font-weight: bold;
  background: transparent;
}

.add-button:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-2px);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.polaroid-wrapper {
  position: absolute;
  width: 150px;
  height: 200px;
}

.polaroid-slot-1 {
  top: 18%;
  left: 25%;
  transform: rotate(-12deg);
  z-index: 1;
}

.polaroid-slot-2 {
  top: 42%;
  left: 28%;
  transform: rotate(8deg);
  z-index: 10;
}

.polaroid-slot-3 {
  top: 66%;
  left: 25%;
  transform: rotate(-12deg);
  z-index: 5;
}

.color-square {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.action-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  transform: translateY(-100%);
  transition: transform 0.5s ease-in-out;
  z-index: 10;
}

.color-square:hover .action-panel {
  transform: translateY(0);
}

.action-btn {
  background: white;
  border: none;
  border-radius: 4px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.action-btn:hover {
  background: #e0e0e0;
}

.action-btn img {
  width: 16px;
  height: 16px;
}

/* Название цвета - подвинуто ниже (было top: 20%, стало top: 35%) */
.color-name-top {
  position: absolute;
  top: 35%;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 10px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  z-index: 10;
  background: rgba(0,0,0,0.6);
  padding: 4px 8px;
  margin: 0 auto;
  width: fit-content;
  border-radius: 4px;
  pointer-events: none;
  white-space: nowrap;
}

/* HEX код снизу */
.color-info {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 10;
}

.color-code {
  color: white;
  font-weight: bold;
  font-size: 11px;
  background: rgba(0,0,0,0.7);
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  font-family: monospace;
}

.polaroid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 2;
  pointer-events: none;
}

.close-button {
  position: absolute;
  top: -18px;
  left: -11px;
  width: auto;
  height: auto;
  padding: 0;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  cursor: pointer;
}

.close-button img {
  width: 20px;
  height: 20px;
}

.close-button:hover img {
  transform: scale(1.1);
}

.toast-notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  pointer-events: none;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

.info-wrapper {
  position: absolute;
  bottom: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.limit-info {
  color: white;
  background: rgba(0,0,0,0.7);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  text-align: center;
}

/* Адаптация */
@media (max-width: 1200px) {
  .polaroid-wrapper {
    width: 130px;
    height: 173px;
  }
  .polaroid-slot-1 { top: 16%; left: 23%; }
  .polaroid-slot-2 { top: 40%; left: 26%; }
  .polaroid-slot-3 { top: 64%; left: 23%; }
  .color-name-top { top: 33%; font-size: 9px; }
}

@media (max-width: 768px) {
  .polaroid-wrapper {
    width: 100px;
    height: 133px;
  }
  .polaroid-slot-1 { top: 15%; left: 20%; }
  .polaroid-slot-2 { top: 38%; left: 23%; }
  .polaroid-slot-3 { top: 61%; left: 20%; }
  .action-panel { gap: 6px; padding: 6px; }
  .action-btn { width: 24px; height: 24px; }
  .action-btn img { width: 12px; height: 12px; }
  .color-name-top { top: 32%; font-size: 8px; padding: 3px 6px; white-space: nowrap; }
  .color-code { font-size: 9px; padding: 3px 6px; }
}

@media (max-width: 480px) {
  .polaroid-wrapper {
    width: 80px;
    height: 106px;
  }
  .polaroid-slot-1 { top: 18%; left: 15%; }
  .polaroid-slot-2 { top: 40%; left: 18%; }
  .polaroid-slot-3 { top: 62%; left: 15%; }
  .color-name-top { top: 30%; font-size: 7px; padding: 2px 4px; white-space: nowrap; }
  .color-code { font-size: 7px; padding: 2px 4px; }
}

@media (min-width: 1440px) {
  .polaroid-wrapper {
    width: 180px;
    height: 240px;
  }
  .polaroid-slot-1 { top: 18%; left: 27%; }
  .polaroid-slot-2 { top: 43%; left: 30%; }
  .polaroid-slot-3 { top: 68%; left: 27%; }
  .color-name-top { top: 38%; font-size: 12px; }
  .color-code { font-size: 13px; }
}
</style>