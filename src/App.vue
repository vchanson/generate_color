<script setup>
import { ref } from 'vue'
import vinylImg from '../src/assets/фон.png' // пластинка (фон)
import polaroidImg from '../src/assets/полароид.png' // полароид
import closeIcon from '../src/assets/закрыть.png' // иконка закрытия
import generateButtonImg from '../src/assets/кнопка2.png' // кнопка сгенерировать
import addButtonImg from '../src/assets/кнопка.png' // кнопка добавить

// Массив полароидов с фиксированными слотами
const polaroids = ref({
  slot1: null, // позиция 1 (верхняя)
  slot2: null, // позиция 2 (средняя)
  slot3: null  // позиция 3 (нижняя)
})

let nextId = 1

// Функция генерации случайного цвета
const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

// Функция первой генерации (когда нет ни одного полароида)
const generateFirst = () => {
  if (polaroids.value.slot1 === null && polaroids.value.slot2 === null && polaroids.value.slot3 === null) {
    polaroids.value.slot1 = {
      id: nextId++,
      color: generateRandomColor(),
      slot: 1
    }
  }
}

// Функция добавления полароида в первый свободный слот
const addPolaroid = () => {
  if (polaroids.value.slot1 === null) {
    polaroids.value.slot1 = {
      id: nextId++,
      color: generateRandomColor(),
      slot: 1
    }
  } 
  else if (polaroids.value.slot2 === null) {
    polaroids.value.slot2 = {
      id: nextId++,
      color: generateRandomColor(),
      slot: 2
    }
  } 
  else if (polaroids.value.slot3 === null) {
    polaroids.value.slot3 = {
      id: nextId++,
      color: generateRandomColor(),
      slot: 3
    }
  }
}

// Функция удаления полароида по слоту
const closePolaroid = (slot) => {
  if (slot === 1) polaroids.value.slot1 = null
  if (slot === 2) polaroids.value.slot2 = null
  if (slot === 3) polaroids.value.slot3 = null
}

// Проверка, есть ли хотя бы один полароид на экране
const hasAnyPolaroid = () => {
  return polaroids.value.slot1 !== null || polaroids.value.slot2 !== null || polaroids.value.slot3 !== null
}

// Проверка, можно ли добавить новый полароид
const canAdd = () => {
  return polaroids.value.slot1 === null || polaroids.value.slot2 === null || polaroids.value.slot3 === null
}

// Проверка, достигнут ли максимум
const isMaxReached = () => {
  return polaroids.value.slot1 && polaroids.value.slot2 && polaroids.value.slot3
}

// Можно ли сгенерировать первый полароид
const canGenerate = () => {
  return !hasAnyPolaroid()
}
</script>

<template>
  <div class="container">
    <div class="background-wrapper">
      <img :src="vinylImg" class="background-image" alt="Пластинка">
      
      <!-- Заголовок сверху по центру -->
      <h1 class="main-title">Генератор цветов</h1>
      
      <!-- Кнопка генерации -->
      <div class="generate-button-container">
        <button class="generate-button" @click="generateFirst" :disabled="!canGenerate()">
          <span>Сгенерировать</span>
        </button>
      </div>
      
      <!-- Кнопка добавления -->
      <div class="add-button-container" v-if="hasAnyPolaroid()">
        <button class="add-button" @click="addPolaroid" :disabled="isMaxReached()">
          <span>Добавить</span>
        </button>
      </div>
      
      <!-- Полароид 1 -->
      <div v-if="polaroids.slot1" class="polaroid-wrapper polaroid-slot-1">
        <div class="color-square" :style="{ backgroundColor: polaroids.slot1.color }"></div>
        <img :src="polaroidImg" class="polaroid" alt="Полароид">
        <button class="close-button" @click="closePolaroid(1)">
          <img :src="closeIcon" alt="Закрыть">
        </button>
      </div>
      
      <!-- Полароид 2 -->
      <div v-if="polaroids.slot2" class="polaroid-wrapper polaroid-slot-2">
        <div class="color-square" :style="{ backgroundColor: polaroids.slot2.color }"></div>
        <img :src="polaroidImg" class="polaroid" alt="Полароид">
        <button class="close-button" @click="closePolaroid(2)">
          <img :src="closeIcon" alt="Закрыть">
        </button>
      </div>
      
      <!-- Полароид 3 -->
      <div v-if="polaroids.slot3" class="polaroid-wrapper polaroid-slot-3">
        <div class="color-square" :style="{ backgroundColor: polaroids.slot3.color }"></div>
        <img :src="polaroidImg" class="polaroid" alt="Полароид">
        <button class="close-button" @click="closePolaroid(3)">
          <img :src="closeIcon" alt="Закрыть">
        </button>
      </div>
    </div>
    
    <!-- Информация о лимите -->
    <div class="info-wrapper" v-if="isMaxReached()">
      <p class="limit-info">Достигнут максимум (3 полароида)</p>
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

/* Контейнер для фоновой картинки */
.background-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background-color: #241313;
}

/* Фоновая картинка растянута на весь экран */
.background-image {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Заголовок сверху по центру */
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

/* Контейнер кнопки генерации */
.generate-button-container {
  position: absolute;
  top: 20%;
  right: 5%;
  z-index: 20;
}

/* Кнопка генерации */
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
  text-shadow: none;
  background: transparent;
}

.generate-button:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-2px);
}

.generate-button:active:not(:disabled) {
  transform: translateY(0);
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Контейнер кнопки добавления */
.add-button-container {
  position: absolute;
  top: 32%;
  right: 5%;
  z-index: 20;
}

/* Кнопка добавления */
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
  text-shadow: none;
  background: transparent;
}

.add-button:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-2px);
}

.add-button:active:not(:disabled) {
  transform: translateY(0);
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Уменьшенные размеры полароидов */
.polaroid-wrapper {
  position: absolute;
  width: 120px;
  height: 160px;
}

/* Первый полароид - верх */
.polaroid-slot-1 {
  top: 18%;
  left: 25%;
  transform: rotate(-12deg);
  z-index: 1;
}

/* Второй полароид - центр, наклон вправо */
.polaroid-slot-2 {
  top: 42%;
  left: 28%;
  transform: rotate(8deg);
  z-index: 10;
}

/* Третий полароид - низ */
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
  background-color: #ff6b6b;
  z-index: 1;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.polaroid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 2;
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

/* Информация о лимите */
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

/* Адаптация для разных экранов */
@media (max-width: 1200px) {
  .polaroid-wrapper {
    width: 100px;
    height: 133px;
  }
  .polaroid-slot-1 { top: 16%; left: 23%; }
  .polaroid-slot-2 { top: 40%; left: 26%; }
  .polaroid-slot-3 { top: 64%; left: 23%; }
  .main-title { font-size: 32px; }
  .generate-button, .add-button { width: 130px; height: 60px; font-size: 14px; }
  .add-button-container { top: 30%; }
}

@media (max-width: 768px) {
  .polaroid-wrapper {
    width: 85px;
    height: 113px;
  }
  .polaroid-slot-1 { top: 15%; left: 20%; }
  .polaroid-slot-2 { top: 38%; left: 23%; }
  .polaroid-slot-3 { top: 61%; left: 20%; }
  .main-title { font-size: 24px; white-space: normal; width: 90%; text-align: center; }
  .generate-button-container, .add-button-container { right: 3%; }
  .generate-button, .add-button { width: 110px; height: 50px; font-size: 12px; }
  .add-button-container { top: 28%; }
  .generate-button-container { top: 18%; }
}

@media (max-width: 480px) {
  .polaroid-wrapper {
    width: 70px;
    height: 93px;
  }
  .polaroid-slot-1 { top: 18%; left: 15%; }
  .polaroid-slot-2 { top: 40%; left: 18%; }
  .polaroid-slot-3 { top: 62%; left: 15%; }
  .main-title { font-size: 20px; }
  .generate-button, .add-button { width: 100px; height: 45px; font-size: 10px; }
  .add-button-container { top: 30%; }
}

@media (min-width: 1440px) {
  .polaroid-wrapper {
    width: 140px;
    height: 186px;
  }
  .polaroid-slot-1 { top: 18%; left: 27%; }
  .polaroid-slot-2 { top: 43%; left: 30%; }
  .polaroid-slot-3 { top: 68%; left: 27%; }
  .generate-button, .add-button { width: 170px; height: 80px; font-size: 18px; }
}
</style>