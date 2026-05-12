<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Bgc from './bgc.vue'

const router = useRouter()
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Ошибки валидации
const usernameError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')

// Валидация имени пользователя (не пустое)
const validateUsername = () => {
  if (!form.value.username.trim()) {
    usernameError.value = 'Имя пользователя не может быть пустым'
    return false
  }
  usernameError.value = ''
  return true
}

// Валидация email
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email) {
    emailError.value = 'Email не может быть пустым'
    return false
  }
  if (!emailRegex.test(form.value.email)) {
    emailError.value = 'Введите корректный email'
    return false
  }
  emailError.value = ''
  return true
}

// Валидация пароля (минимум 4 символа)
const validatePassword = () => {
  if (!form.value.password) {
    passwordError.value = 'Пароль не может быть пустым'
    return false
  }
  if (form.value.password.length < 4) {
    passwordError.value = 'Пароль должен содержать минимум 4 символа'
    return false
  }
  passwordError.value = ''
  return true
}

// Валидация подтверждения пароля
const validateConfirmPassword = () => {
  if (form.value.confirmPassword !== form.value.password) {
    confirmPasswordError.value = 'Пароли не совпадают'
    return false
  }
  confirmPasswordError.value = ''
  return true
}

// Проверка всей формы
const isFormValid = computed(() => {
  return validateUsername() && 
         validateEmail() && 
         validatePassword() && 
         validateConfirmPassword() &&
         !usernameError.value &&
         !emailError.value &&
         !passwordError.value &&
         !confirmPasswordError.value
})

const handleRegister = () => {
  if (!isFormValid.value) return
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  
  if (users.some(u => u.username === form.value.username)) {
    alert('Пользователь с таким именем уже существует')
    return
  }
  
  if (users.some(u => u.email === form.value.email)) {
    alert('Пользователь с таким email уже существует')
    return
  }
  
  const newUser = {
    id: Date.now(),
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    favorites: []
  }
  
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  localStorage.setItem('currentUser', JSON.stringify(newUser))
  router.push({ name: 'Home' })
}
</script>

<template>
  <div class="auth-wrapper">
    <Bgc />
    
    <div class="auth-card">
      <h2>Регистрация</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Имя пользователя</label>
          <input type="text" v-model="form.username" @input="validateUsername">
          <span v-if="usernameError" class="error">{{ usernameError }}</span>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" @input="validateEmail">
          <span v-if="emailError" class="error">{{ emailError }}</span>
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input type="password" v-model="form.password" @input="validatePassword">
          <span v-if="passwordError" class="error">{{ passwordError }}</span>
        </div>
        <div class="form-group">
          <label>Подтверждение пароля</label>
          <input type="password" v-model="form.confirmPassword" @input="validateConfirmPassword">
          <span v-if="confirmPasswordError" class="error">{{ confirmPasswordError }}</span>
        </div>
        <button type="submit" class="auth-btn" :disabled="!isFormValid">Зарегистрироваться</button>
      </form>
      <p class="auth-link">
        Уже есть аккаунт? <router-link to="/login">Войти</router-link>
      </p>
    </div>
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
  background: rgba(255,255,255,0.6);
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
  font-size: 14px;
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
</style>