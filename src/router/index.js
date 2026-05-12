import { createRouter, createWebHistory } from 'vue-router'
import ColorGenerator from '../views/ColorGenerator.vue'
import PaletteGenerator from '../views/PaletteGenerator.vue'
import ColorInfo from '../views/ColorInfo.vue'

const routes = [
    { path: '/', component: ColorGenerator },
  {
    path: '/palette',
    component: PaletteGenerator,
    children: [
      {
        path: 'info/:hex', // Дочерний маршрут
        name: 'ColorInfo',
        component: ColorInfo,
        props: true
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router