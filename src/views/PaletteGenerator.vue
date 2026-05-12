<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import cameraImg from '../assets/camera.png'
import filmStripFrame from '../assets/film_strip.png'
import btnGenImg from '../assets/кнопка2.png'
import btnAddImg from '../assets/кнопка.png'
import pinIcon from '../assets/btn_close.png'

import copyIcon from '../assets/copy.png'
import replaceIcon from '../assets/swap.png'
import editIcon from '../assets/edit.png'

const palette = ref([])
const router = useRouter()

const generateRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')

onMounted(() => {
    generateInitial()
})

const generateInitial = () => {
    if (palette.value.length > 0) {
        palette.value.forEach(item => item.hex = generateRandomColor())
    } else {
        palette.value = Array.from({ length: 3 }, () => ({ hex: generateRandomColor(), id: Math.random() }))
    }
}

const addColor = () => {
    if (palette.value.length < 9) {
        palette.value.push({ hex: generateRandomColor(), id: Math.random() })
    }
}

const remove = (index) => {
    if (palette.value.length > 3) {
        palette.value.splice(index, 1)
    }
}

const editColor = (index) => {
    const input = document.createElement('input')
    input.type = 'color'
    input.value = palette.value[index].hex
    input.oninput = (e) => { palette.value[index].hex = e.target.value }
    input.click()
}

const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text)
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
                            <button class="pin" @click="remove(index)" :disabled="palette.length <= 3">
                                <img :src="pinIcon">
                            </button>
                            <div class="film-inner">
                                <div class="color-box" :style="{ backgroundColor: item.hex }">
                                    <div class="actions-overlay">
                                        <div class="action-buttons">
                                            <button @click.stop="copyToClipboard(item.hex)"><img
                                                    :src="copyIcon"></button>
                                            <button @click.stop="editColor(index)"><img :src="editIcon"></button>
                                            <button @click.stop="item.hex = generateRandomColor()"><img
                                                    :src="replaceIcon"></button>
                                        </div>
                                    </div>
                                    <div class="bottom-info">
                                        <div class="info-plate">
                                            <span class="hex-code">{{ item.hex }}</span>
                                            <router-link :to="`/palette/info/${item.hex.replace('#', '')}`"
                                                class="about-link">
                                                о цвете
                                            </router-link>
                                        </div>
                                    </div>
                                </div>
                                <img :src="filmStripFrame" class="film-frame-overlay">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="side-panel">
                    <button class="img-btn" @click="generateInitial"><img :src="btnGenImg"><span
                            class="btn-label">СГЕНЕРИРОВАТЬ</span></button>
                    <button class="img-btn" @click="addColor" :disabled="palette.length >= 9"><img
                            :src="btnAddImg"><span class="btn-label">ДОБАВИТЬ</span></button>
                </div>
            </div>
        </div>

        <router-view />
    </div>
</template>

<style scoped>
.palette-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: #241313;
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

.film-container {
    flex: 1;
    display: flex;
    justify-content: center;
}

.film-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0;
    padding: 5px;
}

.film-item {
    position: relative;
    width: 175px;
    height: 235px;
}

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
    justify-content: space-between;
    overflow: hidden;
    cursor: default;
}

.actions-overlay {
    width: 100%;
    padding-top: 10px;
    display: flex;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.color-box:hover .actions-overlay {
    opacity: 1;
}

.action-buttons {
    display: flex;
    gap: 5px;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 8px;
    border-radius: 6px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.action-buttons button {
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 2px;
}

.action-buttons img {
    width: 16px;
    height: 16px;
}

.bottom-info {
    width: 100%;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
}

.info-plate {
    background: rgba(255, 255, 255, 0.85);
    padding: 4px 10px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: auto;
}

.hex-code {
    color: #241313;
    font-weight: bold;
    font-size: 13px;
    font-family: monospace;
}

.about-link {
    color: #241313;
    font-size: 10px;
    text-decoration: underline;
    margin-top: 2px;
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
    transition: 0.1s;
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

.pin:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    filter: grayscale(1);
}

.pin-disabled img {
    transform: scale(0.8);
}
</style>
