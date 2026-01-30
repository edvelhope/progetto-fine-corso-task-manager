import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import auth from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  { path: '/register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Protezione delle route
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    if (!localStorage.getItem('token') || auth.isTokenExpired()) {
      auth.logout()
      next('/login')
      return
    }
  }
  next()
})

export default router
