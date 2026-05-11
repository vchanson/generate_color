<template>
  <div class="app-container">
    <nav class="navigation">
      <router-link to="/">Генератор Цветов</router-link>
      <router-link to="/palette">Генератор Пленки</router-link>
    </nav>

    <router-view />
  </div>
</template>

<style>
.app-container {
  font-family: sans-serif;
  background-color: #241313;
  min-height: 100vh;
}

.navigation {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.navigation a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}

.navigation a.router-link-active {
  color: #ff6b6b;
}
</style>