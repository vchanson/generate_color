import { createRouter, createWebHistory } from 'vue-router'
// Импортируй свои компоненты
import ColorGenerator from '../views/ColorGenerator.vue' // Тот, что с винилом/полароидами
import PaletteGenerator from '../views/PaletteGenerator.vue' // Тот, что с пленкой

const routes = [
  {
    path: '/',
    name: 'Home',
    component: ColorGenerator
  },
  {
    path: '/palette',
    name: 'Palette',
    component: PaletteGenerator
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ОБЯЗАТЕЛЬНО: экспорт по умолчанию
export default router