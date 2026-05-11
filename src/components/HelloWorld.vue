<script setup>
import photo1 from '../src/assets/фон.png'
</script>

<template>
  <div class="background-container">
    <img :src="photo1" class="photo" alt="Фото">
    <div class="content">
      <h1>Заголовок</h1>
      <p>Текст контента</p>
    </div>
  </div>
</template>

<style scoped>
.background-container {
  min-height: 100vh;
  background-color: #241313;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Фото покроет весь экран, сохраняя пропорции */
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  color: white;
  text-align: center;
  padding: 2rem;
}
</style>