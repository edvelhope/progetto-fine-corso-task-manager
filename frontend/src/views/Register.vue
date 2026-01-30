<template>
    <div class="register">
        <div class="logo-wrapper">
            <TaskLineLogo />
        </div>
        <h2>Registrazione</h2>
        <form @submit.prevent="register">
            <label for="reg-email" class="sr-only">Email</label>
            <input id="reg-email" v-model="email" type="email" placeholder="Email" required />
            <label for="reg-password" class="sr-only">Password</label>
            <input id="reg-password" v-model="password" type="password" placeholder="Password (min 8 caratteri)" required minlength="8" />
            <label for="reg-confirm" class="sr-only">Conferma Password</label>
            <input id="reg-confirm" v-model="confirmPassword" type="password" placeholder="Conferma Password" required />
            <button type="submit" :disabled="loading">{{ loading ? 'Registrazione...' : 'Registrati' }}</button>
        </form>
        <p v-if="error" style="color:red">{{ error }}</p>
        <p v-if="success" style="color:green">{{ success }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TaskLineLogo from '../../src/components/TasklineLogo.vue'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const loading = ref(false)
const router = useRouter()

const register = async () => {
    error.value = ''
    success.value = ''

    if (password.value !== confirmPassword.value) {
        error.value = 'Le password non coincidono'
        return
    }

    if (password.value.length < 8) {
        error.value = 'La password deve avere almeno 8 caratteri'
        return
    }

    loading.value = true

    try {
        const res = await fetch(`${apiUrl}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        })

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            throw new Error(data?.error || 'Errore registrazione')
        }

        success.value = 'Registrazione completata! Ora puoi fare login.'
        setTimeout(() => router.push('/login'), 1500)
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
    background-color: #0e1525;
    font-family: 'Segoe UI', sans-serif;
    height: 100vh;
}

.register {
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

.register h2 {
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

.register input {
    width: 100%;
    padding: 12px;
    margin-bottom: 1rem;
    border-color: var(--border-color);
    border-radius: 5px;
    font-size: 1rem;
}

.register input::placeholder {
    color: #bbb;
}

/* Pulsante Registrati stile fancy */
.register button {
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

.register button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.register button::before {
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

.register button:hover:not(:disabled)::before {
    left: 100%;
}

.register button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.register button:active:not(:disabled) {
    transform: scale(0.98);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
