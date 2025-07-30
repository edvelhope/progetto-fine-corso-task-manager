<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Accedi</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/stores/auth'  // <-- importa lo store auth

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const handleLogin = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    if (!res.ok) throw new Error('Credenziali errate')

    const data = await res.json()

    auth.login(data.token) // <-- aggiorna lo stato di login e salva il token

    router.push('/')
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  background-color: #0e1525;
  font-family: 'Segoe UI', sans-serif;
  height: 100vh;
}


.login {
  max-width: 400px;
  margin: 0 auto;
  margin-top: 10vh;
  background-color: #1a2238;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  text-align: center;
  color: white;
}

.login h2 {
  color: #ffffff;
  font-weight: bold;
  opacity: 1;
  margin-bottom: 1rem;
}


.login input {
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  background-color: #2a2f45;
  color: white;
  font-size: 1rem;
}


.login input::placeholder {
  color: #bbb;
}


.login button {
  width: 100%;
  padding: 12px;
  background-color: #3b5bfd;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s ease;
}

.login button:hover {
  background-color: #2e4de0;
}



a,
.router-link-active,
.router-link-exact-active {
  color: white !important;
  text-decoration: none;
  font-weight: bold;
}


a:hover {
  color: #3b5bfd;
}

</style>
