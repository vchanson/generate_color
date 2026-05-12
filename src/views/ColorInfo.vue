<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Получаем HEX из URL (например, из /color-info/FF349E)
const mainHex = computed(() => route.params.hex.startsWith('#') ? route.params.hex : '#' + route.params.hex)

// Генерируем простые вариации цвета для палитры внизу
const palette = computed(() => {
    return [
        mainHex.value,
        adjustBrightness(mainHex.value, -20),
        adjustBrightness(mainHex.value, 20),
        adjustBrightness(mainHex.value, 40),
    ]
})

// Функция для изменения яркости (упрощенная)
function adjustBrightness(hex, percent) {
    let num = parseInt(hex.replace('#', ''), 16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        G = (num >> 8 & 0x00FF) + amt,
        B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
}

const goBack = () => router.back()
</script>

<template>
    <div class="details-wrapper">
        <button class="back-btn" @click="goBack">← Назад</button>

        <div class="content-container">
            <h1 class="main-title">Цветовой круг</h1>
            <p class="description">
                Подбирайте гармоничные цветовые палитры на цветовом круге.
                Здесь представлена детальная информация о выбранном оттенке.
            </p>

            <div class="main-grid">
                <div class="left-side">
                    <div class="input-group">
                        <label>Основной цвет</label>
                        <div class="hex-display">
                            <div class="color-preview" :style="{ backgroundColor: mainHex }"></div>
                            <input type="text" :value="mainHex.toUpperCase()" readonly>
                        </div>
                    </div>

                    <div class="palette-section">
                        <label>Палитра</label>
                        <div class="colors-row">
                            <div v-for="color in palette" :key="color" class="palette-card">
                                <div class="card-fill" :style="{ backgroundColor: color }">
                                    <span class="info-icon">i</span>
                                </div>
                                <span class="card-hex">{{ color.toUpperCase() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="right-side">
                    <div class="wheel-container">
                        <div class="color-wheel">
                            <div class="wheel-pointer" :style="{ backgroundColor: mainHex }"></div>
                        </div>
                    </div>
                    <div class="brightness-slider">
                        <div class="slider-track"
                            :style="{ background: `linear-gradient(to right, #000, ${mainHex}, #fff)` }"></div>
                        <div class="slider-thumb"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.details-wrapper {
    min-height: 100vh;
    background-color: #121212;
    color: white;
    padding: 40px;
    font-family: sans-serif;
}

.back-btn {
    background: none;
    border: 1px solid #444;
    color: #ccc;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
}

.content-container {
    max-width: 1100px;
    margin: 0 auto;
}

.main-title {
    font-size: 42px;
    margin-bottom: 10px;
}

.description {
    color: #888;
    margin-bottom: 40px;
    font-size: 16px;
}

.main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
}

label {
    display: block;
    margin-bottom: 15px;
    font-weight: bold;
    font-size: 18px;
}

/* Левая часть */
.hex-display {
    display: flex;
    align-items: center;
    background: #252525;
    padding: 10px;
    border-radius: 8px;
    width: fit-content;
    gap: 15px;
    border: 1px solid #333;
}

.color-preview {
    width: 40px;
    height: 40px;
    border-radius: 4px;
}

.hex-display input {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    font-family: monospace;
    width: 100px;
    outline: none;
}

.palette-section {
    margin-top: 50px;
}

.colors-row {
    display: flex;
    gap: 15px;
}

.palette-card {
    width: 100px;
}

.card-fill {
    height: 120px;
    border-radius: 8px;
    position: relative;
    margin-bottom: 10px;
}

.info-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.3);
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
}

.card-hex {
    font-family: monospace;
    font-size: 14px;
    color: #aaa;
}

/* Правая часть (Круг) */
.wheel-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
}

.color-wheel {
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red);
    position: relative;
}

.wheel-pointer {
    position: absolute;
    top: 20%;
    right: 20%;
    width: 15px;
    height: 15px;
    border: 3px solid white;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.brightness-slider {
    width: 100%;
    height: 12px;
    position: relative;
}

.slider-track {
    width: 100%;
    height: 100%;
    border-radius: 10px;
}

.slider-thumb {
    position: absolute;
    top: 50%;
    left: 70%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
}
</style>