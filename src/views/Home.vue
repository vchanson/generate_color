<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useColorGenerator } from '../composables/useColorGenerator'

// Импорт изображений
import vinylImg from '../assets/фон.png'
import polaroidImg from '../assets/полароид.png'
import closeIcon from '../assets/закрыть.png'
import generateButtonImg from '../assets/кнопка2.png'
import addButtonImg from '../assets/кнопка.png'

// Иконки для панели
import copyIcon from '../assets/copy.png'
import replaceIcon from '../assets/swap.png'
import editIcon from '../assets/edit.png'
import heartIcon from '../assets/heart.png'
import heartFilledIcon from '../assets/heart-filled.png'

const router = useRouter()
const currentUser = ref(null)
const showAuthModal = ref(false)
const pendingSlot = ref(null)

const {
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
} = useColorGenerator()

// Проверяем пользователя сразу при инициализации
const user = localStorage.getItem('currentUser')
if (user) {
  currentUser.value = JSON.parse(user)
}

const logout = () => {
  localStorage.removeItem('currentUser')
  currentUser.value = null
}

const goToLogin = () => {
  router.push({ name: 'Login'})
}

const goToRegister = () => {
  router.push({name: 'Register'})
}

const closeModal = () => {
  showAuthModal.value = false
  pendingSlot.value = null
}

const updateFavoriteInStorage = (color, isFavorite, colorName) => {
  if (!currentUser.value) return
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const userIndex = users.findIndex(u => u.id === currentUser.value.id)
  
  if (userIndex !== -1) {
    if (!users[userIndex].favorites) users[userIndex].favorites = []
    const favIndex = users[userIndex].favorites.findIndex(f => f.color === color)
    
    if (isFavorite && favIndex === -1) {
      users[userIndex].favorites.push({ color, name: colorName, date: new Date() })
    } else if (!isFavorite && favIndex !== -1) {
      users[userIndex].favorites.splice(favIndex, 1)
    }
    
    localStorage.setItem('users', JSON.stringify(users))
    currentUser.value = users[userIndex]
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
  }
}

const handleToggleFavorite = (slot) => {
  if (!currentUser.value) {
    pendingSlot.value = slot
    showAuthModal.value = true
  } else {
    toggleFavorite(slot, currentUser.value, updateFavoriteInStorage)
  }
}
</script>

<template>
  <div class="app-container">
    <!-- Навигация -->
    <nav class="navbar">
      <div class="nav-content">
        <div class="nav-actions">
          <router-link v-if="currentUser" to="/favorites" class="favorites-link">Избранное</router-link>
          <span v-if="currentUser" class="user-name">{{ currentUser.username }}</span>
          <button v-if="currentUser" @click="logout" class="logout-btn">Выйти</button>
          <button v-else @click="goToLogin" class="login-btn">Войти</button>
        </div>
      </div>
    </nav>

    <!-- Основной контент -->
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
              <button class="action-btn" @click="handleToggleFavorite(1)" :title="polaroids.slot1.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'">
                <img :src="polaroids.slot1.isFavorite ? heartFilledIcon : heartIcon" alt="Избранное">
              </button>
            </div>
            <!-- НОМЕР ЦВЕТА (HEX) - СВЕРХУ -->
            <div class="color-code-top">{{ polaroids.slot1.color }}</div>
            <!-- НАЗВАНИЕ ЦВЕТА - СНИЗУ -->
            <div class="color-name-bottom">{{ getColorName(polaroids.slot1.color) }}</div>
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
              <button class="action-btn" @click="handleToggleFavorite(2)" :title="polaroids.slot2.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'">
                <img :src="polaroids.slot2.isFavorite ? heartFilledIcon : heartIcon" alt="Избранное">
              </button>
            </div>
            <!-- НОМЕР ЦВЕТА (HEX) - СВЕРХУ -->
            <div class="color-code-top">{{ polaroids.slot2.color }}</div>
            <!-- НАЗВАНИЕ ЦВЕТА - СНИЗУ -->
            <div class="color-name-bottom">{{ getColorName(polaroids.slot2.color) }}</div>
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
              <button class="action-btn" @click="handleToggleFavorite(3)" :title="polaroids.slot3.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'">
                <img :src="polaroids.slot3.isFavorite ? heartFilledIcon : heartIcon" alt="Избранное">
              </button>
            </div>
            <!-- НОМЕР ЦВЕТА (HEX) - СВЕРХУ -->
            <div class="color-code-top">{{ polaroids.slot3.color }}</div>
            <!-- НАЗВАНИЕ ЦВЕТА - СНИЗУ -->
            <div class="color-name-bottom">{{ getColorName(polaroids.slot3.color) }}</div>
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

    <!-- Модальное окно для неавторизованных пользователей -->
    <div v-if="showAuthModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h3>Требуется авторизация</h3>
        <p>Чтобы добавлять цвета в избранное, пожалуйста, войдите или зарегистрируйтесь</p>
        <div class="modal-buttons">
          <button @click="goToLogin" class="modal-btn login-modal">Войти</button>
          <button @click="goToRegister" class="modal-btn register-modal">Зарегистрироваться</button>
          <button @click="closeModal" class="modal-btn cancel-modal">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Навигация */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(200, 99, 135, 0.45);
  backdrop-filter: blur(10px);
  padding: 15px 30px;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.nav-content {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-name, .favorites-link {
  color: #4a2c2c;
  font-weight: bold;
  text-shadow: none;
}

.favorites-link {
  text-decoration: none;
  transition: transform 0.2s;
}

.favorites-link:hover {
  transform: scale(1.05);
}

.logout-btn, .login-btn {
  padding: 8px 20px;
  background-image: url('../assets/кнопка.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  color: #4a2c2c;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  background-color: transparent;
}

.logout-btn:hover, .login-btn:hover {
  transform: scale(1.05);
}

/* Основной контент */
.container {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  padding-top: 70px;
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
  background-image: url('../assets/кнопка2.png');
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
  background-image: url('../assets/кнопка.png');
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

/* Номер цвета (HEX) - сверху */
.color-code-top {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-weight: bold;
  font-size: 11px;
  background: rgba(0,0,0,0.6);
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  font-family: monospace;
  width: fit-content;
  margin: 0 auto;
  z-index: 10;
}

/* Название цвета - снизу */
.color-name-bottom {
  position: absolute;
  bottom: 55%;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
  z-index: 10;
  background: rgba(0,0,0,0.6);
  padding: 4px 8px;
  margin: 0 auto;
  width: fit-content;
  border-radius: 4px;
  white-space: nowrap;
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
  top: -10px;
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

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.modal-content h3 {
  margin-bottom: 15px;
  color: #4a2c2c;
  font-size: 24px;
}

.modal-content p {
  margin-bottom: 25px;
  color: #666;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.modal-btn {
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  border: none;
  font-size: 14px;
}

.modal-btn:hover {
  transform: scale(1.05);
}

.login-modal {
  background: #4a2c2c;
  color: white;
}

.register-modal {
  background: #4a2c2c;
  color: white;
}

.cancel-modal {
  background: #ccc;
  color: #333;
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
  .color-code-top { font-size: 9px; top: 10px; padding: 3px 6px; }
  .color-name-bottom { font-size: 9px; bottom: 10px; padding: 3px 6px; white-space: nowrap; }
  .main-title { font-size: 24px; top: 8%; white-space: normal; width: 90%; }
}

@media (max-width: 480px) {
  .polaroid-wrapper {
    width: 80px;
    height: 106px;
  }
  .polaroid-slot-1 { top: 18%; left: 15%; }
  .polaroid-slot-2 { top: 40%; left: 18%; }
  .polaroid-slot-3 { top: 62%; left: 15%; }
  .color-code-top { font-size: 8px; top: 8px; padding: 2px 4px; }
  .color-name-bottom { font-size: 8px; bottom: 8px; padding: 2px 4px; }
  .main-title { font-size: 20px; top: 10%; }
}
</style>