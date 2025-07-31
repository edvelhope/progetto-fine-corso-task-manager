import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: { requiresAuth: true }
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    { path: '/register', component: Register },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Protezione delle route
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else {
        next()
    }
})

export default router
