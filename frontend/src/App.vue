<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router';
import auth from '@/stores/auth';

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
        <button v-if="isAuthenticated" @click="handleLogout">Logout</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>



<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a,
nav button {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  background: none;
  border: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
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
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
