<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import auth from '@/stores/auth'
import logo from '@/assets/images/logo-taskline.png'  // Percorso corretto

const { isAuthenticated, logout } = auth
const router = useRouter()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-left">
        <img :src="logo" alt="Taskline Logo" class="logo" />
      </div>

      <div class="nav-center">
        <router-link to="/">Home</router-link>
        <button @click="handleLogout">Logout</button>
      </div>

      <div class="nav-right">
        <!-- vuoto per mantenere centratura -->
      </div>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
  height: 80px;
  background-color: #1a1f2f;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-left,
.nav-center,
.nav-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-left {
  justify-content: flex-start;
}

.nav-right {
  justify-content: flex-end;
}

.logo {
  height: 65px;
  margin-left: 10px;
}

.nav-center a,
.nav-center button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 120px;
  height: 45px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #7c8a9e, #4a5568);
  color: white;
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
  transition: all 0.3s ease;
  text-decoration: none;
}

.nav-center a:hover,
.nav-center button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #4a5568, #7c8a9e);
}
</style>
