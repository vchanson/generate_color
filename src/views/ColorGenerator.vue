<script setup>
import { ref } from 'vue'
import vinylImg from '../assets/фон.png'
import polaroidImg from '../assets/film_frame.png'
import closeIcon from '../assets/btn_close.png'
import generateButtonImg from '../assets/кнопка2.png'
import addButtonImg from '../assets/кнопка.png'
import ColorNamer from 'color-namer'

import copyIcon from '../assets/copy.png'
import replaceIcon from '../assets/swap.png'
import editIcon from '../assets/edit.png'
import heartIcon from '../assets/heart.png'
import heartFilledIcon from '../assets/heart-filled.png'

const polaroids = ref({ slot1: null, slot2: null, slot3: null })
const showToast = ref(false)
const toastMessage = ref('')
const toastTimeout = ref(null)
let nextId = 1

const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')

const getColorName = (hex) => {
    try {
        const names = ColorNamer(hex)
        return names.ntc?.[0]?.name || names.basic?.[0]?.name || 'Unknown'
    } catch (e) { return 'Unknown' }
}

const showToastMessage = (message) => {
    if (toastTimeout.value) clearTimeout(toastTimeout.value)
    toastMessage.value = message
    showToast.value = true
    toastTimeout.value = setTimeout(() => { showToast.value = false }, 2000)
}

const copyColor = async (color) => {
    await navigator.clipboard.writeText(color)
    showToastMessage(`Скопировано!`)
}

const replaceColor = (slot) => {
    const newColor = generateRandomColor()
    polaroids.value[`slot${slot}`].color = newColor
}

const editColor = (slot) => {
    const input = document.createElement('input')
    input.type = 'color'
    input.value = polaroids.value[`slot${slot}`].color
    input.oninput = (e) => { polaroids.value[`slot${slot}`].color = e.target.value }
    input.click()
}

const toggleFavorite = (slot) => {
    polaroids.value[`slot${slot}`].isFavorite = !polaroids.value[`slot${slot}`].isFavorite
}

const addPolaroid = () => {
    const emptySlot = ['slot1', 'slot2', 'slot3'].find(s => !polaroids.value[s])
    if (emptySlot) {
        polaroids.value[emptySlot] = { id: nextId++, color: generateRandomColor(), isFavorite: false }
    }
}

const closePolaroid = (slot) => { polaroids.value[`slot${slot}`] = null }
const isMaxReached = () => !!(polaroids.value.slot1 && polaroids.value.slot2 && polaroids.value.slot3)
const hasAny = () => !!(polaroids.value.slot1 || polaroids.value.slot2 || polaroids.value.slot3)
</script>

<template>
    <div class="container">
        <div class="background-wrapper">
            <img :src="vinylImg" class="background-image" alt="Пластинка">
            <h1 class="main-title">ГЕНЕРАТОР ЦВЕТОВ</h1>

            <div class="side-controls">
                <button class="img-btn" @click="addPolaroid" :disabled="isMaxReached()">
                    <img :src="hasAny() ? addButtonImg : generateButtonImg">
                    <span class="btn-label">{{ hasAny() ? 'ДОБАВИТЬ' : 'СГЕНЕРИРОВАТЬ' }}</span>
                </button>
            </div>

            <div v-for="n in 3" :key="n">
                <div v-if="polaroids[`slot${n}`]" :class="['polaroid-wrapper', `slot-${n}`]">
                    <div class="polaroid-inner">
                        <div class="color-fill" :style="{ backgroundColor: polaroids[`slot${n}`].color }">
                            <div class="hover-menu">
                                <button @click="copyColor(polaroids[`slot${n}`].color)"><img :src="copyIcon"></button>
                                <button @click="replaceColor(n)"><img :src="replaceIcon"></button>
                                <button @click="editColor(n)"><img :src="editIcon"></button>
                                <button @click="toggleFavorite(n)">
                                    <img :src="polaroids[`slot${n}`].isFavorite ? heartFilledIcon : heartIcon">
                                </button>
                            </div>
                            <div class="color-name-label">{{ getColorName(polaroids[`slot${n}`].color) }}</div>
                        </div>

                        <img :src="polaroidImg" class="frame-img">

                        <div class="bottom-labels">
                            <span class="hex-text">{{ polaroids[`slot${n}`].color }}</span>
                            <a href="#" class="about-link" @click.prevent>о цвете</a>
                        </div>
                    </div>

                    <button class="btn-close" @click="closePolaroid(n)">
                        <img :src="closeIcon">
                    </button>
                </div>
            </div>
        </div>

        <transition name="toast">
            <div v-if="showToast" class="toast">{{ toastMessage }}</div>
        </transition>
    </div>
</template>

<style scoped>
.container {
    width: 100vw;
    height: 100vh;
    background: #241313;
    overflow: hidden;
}

.background-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.background-image {
    position: absolute;
    left: 0;
    height: 100%;
    object-fit: contain;
    z-index: 1;
}

.main-title {
    position: absolute;
    top: 40px;
    right: 10%;
    color: white;
    font-size: 24px;
    font-weight: bold;
    z-index: 10;
}

.side-controls {
    position: absolute;
    top: 130px;
    right: 8%;
    z-index: 20;
}

.img-btn {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    width: 160px;
    transition: 0.2s;
}

.img-btn img {
    width: 100%;
}

.btn-label {
    position: absolute;
    top: 48%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #241313;
    font-weight: bold;
    font-size: 11px;
}

.img-btn:hover {
    transform: scale(1.05);
}

/* Настройки полароидов */
.polaroid-wrapper {
    position: absolute;
    width: 170px;
    height: 220px;
    z-index: 5;
}

.slot-1 {
    top: 15%;
    left: 15%;
    transform: rotate(-8deg);
}

.slot-2 {
    top: 38%;
    left: 20%;
    transform: rotate(5deg);
}

.slot-3 {
    top: 62%;
    left: 16%;
    transform: rotate(-5deg);
}

.polaroid-inner {
    position: relative;
    width: 100%;
    height: 100%;
}

/* Цветной квадрат */
.color-fill {
    position: absolute;
    top: 7%;
    left: 8%;
    width: 84%;
    height: 68%;
    z-index: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 5px;
}

.frame-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
}

/* Текст внутри цвета */
.color-name-label {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 9px;
    padding: 2px 6px;
    border-radius: 3px;
    margin-bottom: 5px;
}

/* Текст на белой рамке полароида */
.bottom-labels {
    position: absolute;
    bottom: 12px;
    width: 100%;
    text-align: center;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.hex-text {
    color: #241313;
    font-weight: bold;
    font-size: 13px;
    font-family: monospace;
}

.about-link {
    color: #241313;
    font-size: 9px;
    text-decoration: underline;
    opacity: 0.7;
}

/* Кнопка закрытия */
.btn-close {
    position: absolute;
    top: -10px;
    left: -10px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 25;
}

.btn-close img {
    width: 40px;
}

/* Меню действий */
.hover-menu {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;
    opacity: 0;
    transition: 0.2s;
    z-index: 10;
}

.color-fill:hover .hover-menu {
    opacity: 1;
}

.hover-menu button {
    background: white;
    border: none;
    border-radius: 3px;
    padding: 3px;
    cursor: pointer;
    display: flex;
}

.hover-menu img {
    width: 14px;
    height: 14px;
}

.toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    color: #241313;
    padding: 10px 20px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    z-index: 100;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
</style>