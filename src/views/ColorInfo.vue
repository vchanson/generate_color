<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import btnGenImg from '../assets/кнопка2.png'

const router = useRouter()
const route = useRoute()

// Основной цвет (угол Hue)
const baseHue = ref(parseInt(route.params.hex, 16) || 0)
const currentHex = ref('#' + route.params.hex)
const wheelRef = ref(null)

// Выбранная схема сочетания
const selectedScheme = ref('analogous')

const schemes = {
    monochromatic: { label: 'Монохром', offsets: [0, 0, 0, 0] }, // Тут логика сложнее (меняем яркость)
    analogous: { label: 'Аналоговая', offsets: [-30, -15, 15, 30] },
    complementary: { label: 'Контраст', offsets: [180, 180, 0, 0] },
    triadic: { label: 'Триада', offsets: [120, 240, 0, 0] },
    tetradic: { label: 'Тетрада', offsets: [90, 180, 270, 0] }
}

// Автоматическое вычисление палитры по правилам
const computedPalette = computed(() => {
    const h = getHueFromHex(currentHex.value)
    const scheme = schemes[selectedScheme.value]

    // Создаем массив из 5 цветов (1 основной + 4 вычисленных)
    const palette = [currentHex.value]

    scheme.offsets.forEach(offset => {
        if (offset !== 0 || palette.length < 5) {
            let newHue = (h + offset) % 360
            if (newHue < 0) newHue += 360
            palette.push(hslToHex(newHue, 80, 50))
        }
    })

    return palette.slice(0, 5)
})

// --- ЛОГИКА КРУГА ---
const handleWheelClick = (event) => {
    if (!wheelRef.value) return
    const rect = wheelRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = event.clientX - centerX
    const y = event.clientY - centerY
    let angle = Math.atan2(y, x) * (180 / Math.PI)
    if (angle < 0) angle += 360
    currentHex.value = hslToHex(angle, 80, 50)
}

// Вспомогательные функции
function getHueFromHex(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255
    let g = parseInt(hex.slice(3, 5), 16) / 255
    let b = parseInt(hex.slice(5, 7), 16) / 255
    let max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h, d = max - min
    if (max === min) h = 0
    else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break
            case g: h = (b - r) / d + 2; break
            case b: h = (r - g) / d + 4; break
        }
        h /= 6
    }
    return h * 360
}

function hslToHex(h, s, l) {
    l /= 100; s /= 100
    const a = s * Math.min(l, 1 - l)
    const f = n => {
        const k = (n + h / 30) % 12
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
        return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
}
</script>

<template>
    <div class="color-details-page">

        <div class="interface-layer">
            <h1 class="title">ГАРМОНИЯ ЦВЕТА</h1>

            <div class="main-layout">
                <div class="info-side">
                    <div class="glass-card scheme-selector">
                        <label class="section-label">ПРАВИЛО СОЧЕТАНИЯ</label>
                        <div class="scheme-buttons">
                            <button v-for="(data, key) in schemes" :key="key"
                                :class="{ active: selectedScheme === key }" @click="selectedScheme = key">
                                {{ data.label }}
                            </button>
                        </div>
                    </div>

                    <div class="glass-card result-palette">
                        <label class="section-label">ВЫЧИСЛЕННАЯ ПАЛИТРА</label>
                        <div class="palette-display">
                            <div v-for="(color, i) in computedPalette" :key="i" class="palette-column">
                                <div class="color-pillar" :style="{ backgroundColor: color }">
                                    <span class="pillar-hex">{{ color }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button class="img-btn back-btn" @click="router.push('/palette')">
                        <img :src="btnGenImg" class="btn">
                        <span class="btn-label">НАЗАД</span>
                    </button>
                </div>

                <div class="wheel-side">
                    <div class="wheel-outer-frame">
                        <div class="color-wheel" ref="wheelRef" @mousedown="handleWheelClick"></div>
                        <div class="wheel-pointer main" :style="{ backgroundColor: currentHex }"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Базовые стили страницы */
.color-details-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #241313;
    background-image: repeating-linear-gradient(0deg, #241313, #241313 40px, #331a1a 40px, #331a1a 80px);
    z-index: 2000;
    overflow: hidden;
    color: white;
}


.interface-layer {
    position: relative;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 40px;
}

.main-layout {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    max-width: 1200px;
}

.glass-card {
    background: rgba(0, 0, 0, 0.6);
    padding: 20px;
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
}

/* Кнопки выбора схемы */
.scheme-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.scheme-buttons button {
    background: #1a0f0f;
    border: 1px solid #3d2525;
    color: #888;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
}

.scheme-buttons button.active {
    background: #3d2525;
    color: white;
    border-color: #666;
}

/* Отображение палитры столбиками */
.palette-display {
    display: flex;
    gap: 10px;
    height: 180px;
    margin-top: 10px;
}

.palette-column {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.color-pillar {
    height: 100%;
    width: 100%;
    border-radius: 8px;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.pillar-hex {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-family: monospace;
    background: rgba(0, 0, 0, 0.5);
    padding: 2px 4px;
}

.color-wheel {
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: conic-gradient(red, yellow, lime, cyan, blue, magenta, red);
    cursor: crosshair;
}

.wheel-outer-frame {
    position: relative;
    padding: 15px;
    background: #1a0f0f;
    border-radius: 50%;
    border: 4px solid #3d2525;
}

.wheel-pointer.main {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 24px;
    height: 24px;
    border: 4px solid white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
}

.img-btn {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    width: 220px;
}

.btn-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #241313;
    font-weight: bold;
}

.section-label {
    color: #666;
    font-size: 11px;
    font-weight: bold;
    display: block;
    margin-bottom: 12px;
    letter-spacing: 1px;
}

.btn {
    width: 90%;
}
</style>