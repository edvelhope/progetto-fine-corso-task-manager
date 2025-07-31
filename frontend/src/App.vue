<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import auth from '@/stores/auth';
import ModeToggle from './components/ModeToggle.vue';

const { isAuthenticated, logout } = auth;
const router = useRouter();

const handleLogout = () => {
  logout();       // sets isAuthenticated to false
  router.push('/login'); // handle navigation here
};
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/login">Login</RouterLink>
        <RouterLink v-if="!isAuthenticated" to="/register">Registrati</RouterLink>
      </nav>
    </div>
    <div class="logout-btn-box">

      <button v-if="isAuthenticated" @click="handleLogout" class="logout-btn">
        <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        <span class="logout-text">Logout</span>
        <div class="logout-bg"></div>
      </button>
    </div>
    <div>

      <ModeToggle class="toggle" />
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.toggle {
  margin-left: auto;
  margin-right: 1rem;
}

header {
  display: flex;
  place-items: center;
  padding-right: calc(var(--section-gap) / 2);
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 2px 10px var(--shadow-light);
  transition: all 0.3s ease;
}

header .wrapper {
  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
}

nav {
  font-size: 1rem;
  text-align: center;
  padding: 1rem 0;
  flex: 1;
}

nav a,
nav button {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--border-color);
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  text-decoration: none;
  color: var(--text-primary);
  position: relative;
  transition: color 0.3s ease;
}

.logout-btn-box {
  margin-right: 4rem;
}

/* Stili speciali per il logout button */
.logout-btn {
  position: relative;
  overflow: hidden;
  border-radius: 50px;
  width: 48px;
  height: 48px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  transform: translateY(0);
  border: none;
}

.logout-btn:hover {
  width: 120px;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5);
  transform: translateY(-2px);
}

.logout-icon {
  width: 20px;
  height: 20px;
  color: white;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  position: relative;
}

.logout-btn:hover .logout-icon {
  transform: translateX(-25px) rotate(15deg);
}

.logout-text {
  position: absolute;
  right: 16px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  white-space: nowrap;
}

.logout-btn:hover .logout-text {
  opacity: 1;
  transform: translateX(0);
}

.logout-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #ff8787, #ff6b6b);
  border-radius: 50px;
  transform: scale(0);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.logout-btn:hover .logout-bg {
  transform: scale(1);
}

.logout-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
  z-index: 3;
}

.logout-btn:hover::before {
  width: 200px;
  height: 200px;
}

.logout-btn:active {
  transform: translateY(0) scale(0.95);
  transition: transform 0.1s ease;
}

/* Effetto sottolineatura per gli altri elementi */
nav a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--text-primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

/* Hover effect per gli altri elementi */
nav a:hover {
  color: var(--text-primary);
}

nav a:hover::after {
  width: calc(100% - 2rem);
}

/* Link attivo - sempre sottolineato */
nav a.router-link-exact-active {
  color: var(--text-primary);
}

nav a.router-link-exact-active::after {
  width: calc(100% - 2rem);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
  }
}
</style>
