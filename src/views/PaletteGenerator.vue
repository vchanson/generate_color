<script setup>
import { ref } from 'vue'
// Замени пути на реальные ассеты!
import cameraImg from '../assets/camera.png'
import filmStripFrame from '../assets/film_strip.png' // Рамка плёнки
import btnGenImg from '../assets/кнопка2.png'
import btnAddImg from '../assets/кнопка.png'
import pinIcon from '../assets/btn_close.png'

// Иконки для меню при наведении
import copyIcon from '../assets/copy.png'
import replaceIcon from '../assets/swap.png'
import editIcon from '../assets/edit.png'

const palette = ref([])

const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')

// При генерации не сбрасываем количество, а обновляем существующие цвета
const generateInitial = () => {
    if (palette.value.length > 0) {
        palette.value.forEach(item => item.hex = generateRandomColor())
    } else {
        palette.value = Array.from({ length: 3 }, () => ({ hex: generateRandomColor(), id: Math.random() }))
    }
}

// Добавление до 9 цветов
const addColor = () => {
    if (palette.value.length < 9) {
        palette.value.push({ hex: generateRandomColor(), id: Math.random() })
    }
}

const remove = (index) => palette.value.splice(index, 1)

const editColor = (index) => {
    const input = document.createElement('input')
    input.type = 'color'
    input.value = palette.value[index].hex
    input.oninput = (e) => { palette.value[index].hex = e.target.value }
    input.click()
}
</script>

<template>
    <div class="palette-wrapper">
        <img :src="cameraImg" class="camera-bg" alt="Camera">

        <div class="interface-layer">
            <h1 class="title">ГЕНЕРАТОР ПАЛИТРЫ</h1>

            <div class="main-layout">
                <div class="film-container">
                    <div class="film-grid" v-if="palette.length > 0">
                        <div v-for="(item, index) in palette" :key="item.id" class="film-item">
                            <button class="pin" @click="remove(index)"><img :src="pinIcon"></button>

                            <div class="film-inner">
                                <div class="color-box" :style="{ backgroundColor: item.hex }">
                                    <div class="inner-info">
                                        <span class="hex-code">{{ item.hex }}</span>
                                        <a href="#" class="about-link" @click.stop.prevent>о цвете</a>
                                    </div>

                                    <div class="hover-actions">
                                        <button @click.stop="navigator.clipboard.writeText(item.hex)"><img
                                                :src="copyIcon"></button>
                                        <button @click.stop="editColor(index)"><img :src="editIcon"></button>
                                        <button @click.stop="item.hex = generateRandomColor()"><img
                                                :src="replaceIcon"></button>
                                    </div>
                                </div>
                                <img :src="filmStripFrame" class="film-frame-overlay">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="side-panel">
                    <button class="img-btn" @click="generateInitial">
                        <img :src="btnGenImg">
                        <span class="btn-label">СГЕНЕРИРОВАТЬ</span>
                    </button>
                    <button class="img-btn" @click="addColor" :disabled="palette.length >= 9">
                        <img :src="btnAddImg">
                        <span class="btn-label">ДОБАВИТЬ</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.palette-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #241313;
    /* Полосатый фон как на макете */
    background-image: repeating-linear-gradient(0deg, #241313, #241313 40px, #331a1a 40px, #331a1a 80px);
    overflow: hidden;
}

.camera-bg {
    position: absolute;
    left: -5%;
    bottom: 0;
    height: 90%;
    z-index: 1;
    pointer-events: none;
}

.interface-layer {
    position: relative;
    z-index: 10;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
}

.title {
    color: white;
    font-size: 2rem;
    margin-bottom: 20px;
    font-weight: bold;
}

.main-layout {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 95%;
}

/* Контейнер сетки, убирающий черное пространство */
.film-container {
    flex: 1;
    display: flex;
    justify-content: center;
    background: none;
}

.film-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    /* Убираем зазоры между кадрами плёнки */
    background: black;
    /* Чтобы стыки казались единой лентой */
    padding: 5px;
    border-radius: 4px;
}

.film-item {
    position: relative;
    width: 170px;
    height: 230px;
}

/* Увеличили блоки */

.film-inner {
    position: relative;
    width: 100%;
    height: 100%;
}

.color-box {
    position: absolute;
    top: 15%;
    left: 10%;
    width: 80%;
    height: 70%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.film-frame-overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
    object-fit: stretch;
    /* Растягиваем рамку */
}

/* Инфо внутри блока */
.inner-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 3;
    background: rgba(255, 255, 255, 0.85);
    /* Читабельный фон */
    padding: 5px 12px;
    border-radius: 4px;
}

.hex-code {
    color: #241313;
    font-weight: bold;
    font-size: 14px;
    font-family: monospace;
}

.about-link {
    color: #241313;
    font-size: 10px;
    text-decoration: underline;
}

.hover-actions {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    opacity: 0;
    transition: 0.2s;
    z-index: 10;
}

.color-box:hover .hover-actions {
    opacity: 1;
}

.hover-actions button {
    background: white;
    border: none;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
}

.hover-actions img {
    width: 18px;
    height: 18px;
}

.pin {
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 20;
}

.pin img {
    width: 28px;
}

/* Фиксированная панель справа */
.side-panel {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-left: 50px;
    flex-shrink: 0;
    align-items: center;
}

.img-btn {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    width: 200px;
    transition: transform 0.1s;
}

.img-btn img {
    width: 100%;
}

.btn-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #241313;
    font-weight: bold;
    font-size: 14px;
}

.img-btn:active {
    transform: scale(0.95);
}

.img-btn:disabled {
    opacity: 0.5;
    filter: grayscale(1);
    cursor: not-allowed;
}

.decor-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
}

.decor-buttons img {
    width: 60px;
    height: 60px;
    object-fit: contain;
}
</style>