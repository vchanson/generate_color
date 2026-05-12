<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const favorites = ref([])
const currentUser = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const toastTimeout = ref(null)

// Получаем данные сразу при инициализации
const user = localStorage.getItem('currentUser')
if (!user) {
  router.push({name: 'Login'})
} else {
  currentUser.value = JSON.parse(user)
  favorites.value = currentUser.value.favorites || []
}

const showToastMessage = (message) => {
  if (toastTimeout.value) clearTimeout(toastTimeout.value)
  toastMessage.value = message
  showToast.value = true
  toastTimeout.value = setTimeout(() => {
    showToast.value = false
  }, 2000)
}

const removeFavorite = (index) => {
  favorites.value.splice(index, 1)
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const userIndex = users.findIndex(u => u.id === currentUser.value.id)
  if (userIndex !== -1) {
    users[userIndex].favorites = favorites.value
    localStorage.setItem('users', JSON.stringify(users))
    currentUser.value = users[userIndex]
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  }
  showToastMessage('Цвет удален из избранного')
}

const copyColor = (color) => {
  navigator.clipboard.writeText(color).then(
    function() {
      showToastMessage('Скопировано!')
    },
    function(err) {
      console.error('Ошибка копирования:', err)
      showToastMessage('Не удалось скопировать')
    }
  )
}

const goToColorInfo = (color) => {
  router.push(`/color-info/${color.replace('#', '')}`)
}
</script>

<template>
  <div class="favorites-container">
    <nav class="navbar">
      <div class="nav-content">
        <RouterLink to="/" class="back-link">← На главную</RouterLink>
        <h1>Избранные цвета</h1>
        <div class="user-info">
          <span class="user-name">{{ currentUser?.username }}</span>
        </div>
      </div>
    </nav>

    <div class="favorites-content">
      <div v-if="favorites.length === 0" class="empty-state">
        <p>У вас пока нет избранных цветов</p>
        <RouterLink to="/" class="generate-link">Сгенерировать цвет</RouterLink>
      </div>
      
      <div v-else class="favorites-grid">
        <div v-for="(fav, index) in favorites" :key="index" class="favorite-card">
          <div class="color-preview" :style="{ backgroundColor: fav.color }"></div>
          <div class="color-info">
            <div class="color-code">{{ fav.color }}</div>
            <div class="color-name">{{ fav.name }}</div>
            <button @click="goToColorInfo(fav.color)" class="info-btn">Информация о цвете</button>
          </div>
          <div class="card-actions">
            <button @click="copyColor(fav.color)" class="copy-btn">Копировать</button>
            <button @click="removeFavorite(index)" class="remove-btn">Удалить</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Всплывающее уведомление -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.favorites-container {
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

.user-name {
  color: white;
  font-weight: bold;
}

.favorites-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255,255,255,0.9);
  border-radius: 20px;
}

.empty-state p {
  font-size: 20px;
  color: #241313;
  margin-bottom: 20px;
}

.generate-link {
  display: inline-block;
  padding: 12px 24px;
  background: #241313;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: transform 0.2s;
}

.generate-link:hover {
  transform: scale(1.05);
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.favorite-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.color-preview {
  height: 150px;
}

.color-info {
  padding: 15px;
  text-align: center;
}

.color-code {
  font-size: 16px;
  font-weight: bold;
  font-family: monospace;
  margin-bottom: 8px;
}

.color-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.info-btn {
  background: none;
  color: #4a2c2c;
  border: none;
  padding: 8px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  /* font-weight: bold; */
  transition: transform 0.2s;
  width: 100%;
}

.info-btn:hover {
  transform: scale(1.02);
}

.card-actions {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #eee;
}

.copy-btn, .remove-btn {
  flex: 1;
  padding: 8px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s;
}

.copy-btn {
  background: #4a2c2c;
  color: white;
}

.remove-btn {
  background: #ddd;
  color: #333;
}

.copy-btn:hover, .remove-btn:hover {
  transform: scale(1.02);
}

/* Всплывающее уведомление */
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
</style>