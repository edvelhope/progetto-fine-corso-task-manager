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
        <button v-if="isAuthenticated" @click="handleLogout">Logout</button>
      </nav>
    </div>
    <ModeToggle class="toggle" />
  </header>

  <RouterView />
</template>
<!--
<template>
  <div id="app">
    <nav class="navbar">
  <router-link to="/">Home</router-link>
  <button @click="handleLogout">Logout</button>
</nav> -->



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

/* Effetto sottolineatura */
nav a::after,
nav button::after {
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

/* Hover effect */
nav a:hover,
nav button:hover {
  color: var(--text-primary);
}

nav a:hover::after,
nav button:hover::after {
  width: calc(100% - 2rem);
}

/* Link attivo - sempre sottolineato */
nav a.router-link-exact-active {
  color: var(--text-primary);
}

nav a.router-link-exact-active::after {
  width: calc(100% - 2rem);
}

nav a:first-of-type,
nav button:first-of-type {
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
