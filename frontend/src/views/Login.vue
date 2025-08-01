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

<style>
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

/* Pulsante Accedi stile fancy */
.login button {
  position: relative;
  width: 100%;
  padding: 12px 18px;
  font-size: 13px;
  font-weight: 600;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  overflow: hidden;
  backdrop-filter: blur(8px);
  background: linear-gradient(135deg, #a8b2be, #64748a);
  color: white;
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
  pointer-events: none;
}

.login button:hover::before {
  left: 100%;
}

.login button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.login button:active {
  transform: scale(0.98);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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
