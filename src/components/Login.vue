
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Bgc from './bgc.vue'

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

// Ошибки валидации
const usernameError = ref('')
const passwordError = ref('')

// Уведомление
const showToast = ref(false)
const toastMessage = ref('')
const toastTimeout = ref(null)

const showToastMessage = (message) => {
  if (toastTimeout.value) clearTimeout(toastTimeout.value)
  toastMessage.value = message
  showToast.value = true
  toastTimeout.value = setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// Валидация имени пользователя (не пустое)
const validateUsername = () => {
  if (!form.value.username.trim()) {
    usernameError.value = 'Введите имя пользователя'
    return false
  }
  usernameError.value = ''
  return true
}

// Валидация пароля (не пустой)
const validatePassword = () => {
  if (!form.value.password) {
    passwordError.value = 'Введите пароль'
    return false
  }
  passwordError.value = ''
  return true
}

// Проверка всей формы
const isFormValid = computed(() => {
  return validateUsername() && 
         validatePassword() &&
         !usernameError.value &&
         !passwordError.value
})

const handleLogin = () => {
  if (!isFormValid.value) return
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.username === form.value.username && u.password === form.value.password)
  
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    router.push({ name: 'Home' })
  } else {
    showToastMessage('Неверное имя пользователя или пароль')
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <Bgc />
    
    <div class="auth-card">
      <h2>Вход</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Имя пользователя</label>
          <input type="text" v-model="form.username" @input="validateUsername">
          <span v-if="usernameError" class="error">{{ usernameError }}</span>
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input type="password" v-model="form.password" @input="validatePassword">
          <span v-if="passwordError" class="error">{{ passwordError }}</span>
        </div>
        <button type="submit" class="auth-btn" :disabled="!isFormValid">Войти</button>
      </form>
      <p class="auth-link">
        Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
      </p>
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
.auth-wrapper {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.8);
  /* backdrop-filter: blur(10px); */
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

h2 {
  text-align: center;
  color: #4a2c2c;
  margin-bottom: 30px;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #4a2c2c;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  background: rgba(255,255,255,0.7);
}

input:focus {
  outline: none;
  border-color: #8b4513;
}

.error {
  color: #d32f2f;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.auth-btn {
  width: 100%;
  padding: 12px;
  background-image: url('../assets/кнопка.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  color: #4a2c2c;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: 20px;
}

.auth-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.auth-link {
  text-align: center;
  margin-top: 20px;
  color: #4a2c2c;
}

.auth-link a {
  color: #4a2c2c;
  text-decoration: none;
  font-weight: bold;
}

.auth-link a:hover {
  text-decoration: underline;
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