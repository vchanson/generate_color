import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Home from './views/Home.vue'
import Favorites from './views/Favorites.vue'
import ColorInfo from './views/ColorInfo.vue'

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home, name: 'home' },
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  {
    path: '/favorites',
    component: Favorites,
    name: 'favorites',
    meta: { requiresAuth: true }
  },
  {
    path: '/color-info/:color',
    component: ColorInfo,
    name: 'colorInfo'
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('currentUser')

  // Проверка на авторизацию для страницы избранного
  if (to.meta.requiresAuth && to.name === 'favorites') {
    if (!isAuthenticated) {
      next({ name: 'login' })
      return
    }
  }

  next()
})