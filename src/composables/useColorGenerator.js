// composables/useColorGenerator.js
import { ref } from 'vue'
import ColorNamer from 'color-namer'

export function useColorGenerator() {
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

  // Функция получения названия цвета
  const getColorName = (hex) => {
    const names = ColorNamer(hex)
    return names.ntc?.[0]?.name || 
           names.basic?.[0]?.name || 
           names.html?.[0]?.name ||
           'Unknown Color'
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
  const copyColor = (color) => {
    navigator.clipboard.writeText(color)
    showToastMessage('Скопировано!')
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
    
    if (slot === 1 && polaroids.value.slot1) input.value = polaroids.value.slot1.color
    if (slot === 2 && polaroids.value.slot2) input.value = polaroids.value.slot2.color
    if (slot === 3 && polaroids.value.slot3) input.value = polaroids.value.slot3.color
    
    input.addEventListener('input', (e) => {
      const newColor = e.target.value
      if (slot === 1 && polaroids.value.slot1) polaroids.value.slot1.color = newColor
      if (slot === 2 && polaroids.value.slot2) polaroids.value.slot2.color = newColor
      if (slot === 3 && polaroids.value.slot3) polaroids.value.slot3.color = newColor
    })
    
    input.click()
  }

  // Добавить/удалить из избранного
  const toggleFavorite = (slot, currentUser, updateUserCallback) => {
    const polaroid = getPolaroidBySlot(slot)
    if (polaroid) {
      polaroid.isFavorite = !polaroid.isFavorite
      if (currentUser && updateUserCallback) {
        updateUserCallback(polaroid.color, polaroid.isFavorite, getColorName(polaroid.color))
      }
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
    if (!polaroids.value.slot1 && !polaroids.value.slot2 && !polaroids.value.slot3) {
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
    if (!polaroids.value.slot1) {
      polaroids.value.slot1 = {
        id: nextId++,
        color: generateRandomColor(),
        slot: 1,
        isFavorite: false
      }
    } 
    else if (!polaroids.value.slot2) {
      polaroids.value.slot2 = {
        id: nextId++,
        color: generateRandomColor(),
        slot: 2,
        isFavorite: false
      }
    } 
    else if (!polaroids.value.slot3) {
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
    return !!(polaroids.value.slot1 || polaroids.value.slot2 || polaroids.value.slot3)
  }

  const isMaxReached = () => {
    return polaroids.value.slot1 && polaroids.value.slot2 && polaroids.value.slot3
  }

  const canGenerate = () => {
    return !hasAnyPolaroid()
  }

  return {
    polaroids,
    showToast,
    toastMessage,
    getColorName,
    copyColor,
    replaceColor,
    editColor,
    toggleFavorite,
    generateFirst,
    addPolaroid,
    closePolaroid,
    hasAnyPolaroid,
    isMaxReached,
    canGenerate
  }
}