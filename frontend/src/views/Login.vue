<template>
  <div class="login">
    <div class="logo-wrapper">
      <TaskLineLogo />
    </div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <label for="login-email" class="sr-only">Email</label>
      <input id="login-email" v-model="email" type="email" placeholder="Email" required />
      <label for="login-password" class="sr-only">Password</label>
      <input id="login-password" v-model="password" type="password" placeholder="Password" required />
      <button type="submit" :disabled="loading">{{ loading ? 'Accesso...' : 'Accedi' }}</button>
    </form>
    <p v-if="error" style="color:red">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/stores/auth'
import TaskLineLogo from '../../src/components/TasklineLogo.vue'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(`${apiUrl}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      throw new Error(data?.error || 'Credenziali errate')
    }

    const data = await res.json()

    auth.login(data.token, email.value)

    router.push('/')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
  height: 100vh;
}

.login {
  max-width: 400px;
  margin: 0 auto;
  margin-top: 10vh;
  background-color: var(--bg-primary);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  text-align: center;
  color: white;
}

.login h2 {
  color: var(--text-primary);
  font-weight: bold;
  opacity: 1;
  margin-bottom: 1rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.login input {
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border-color: var(--border-color);
  border-radius: 5px;
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

.login button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.login button:hover:not(:disabled)::before {
  left: 100%;
}

.login button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.login button:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
