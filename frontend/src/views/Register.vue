<template>
    <div class="register">
        <div class="logo-wrapper">
            <TaskLineLogo />
        </div>
        <h2>Registrazione</h2>
        <form @submit.prevent="register">
            <input v-model="email" type="email" placeholder="Email" required />
            <input v-model="password" type="password" placeholder="Password" required />
            <input v-model="confirmPassword" type="password" placeholder="Conferma Password" required />
            <button type="submit">Registrati</button>
        </form>
        <p v-if="error" style="color:red">{{ error }}</p>
        <p v-if="success" style="color:green">{{ success }}</p>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TaskLineLogo from '../../src/components/TasklineLogo.vue'

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const success = ref('');
const router = useRouter();

const register = async () => {
    error.value = '';
    success.value = '';

    if (password.value !== confirmPassword.value) {
        error.value = 'Le password non coincidono';
        return;
    }

    try {
        const res = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Errore registrazione');
        }

        success.value = 'Registrazione completata! Ora puoi fare login.';
        setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
        error.value = err.message;
    }
};
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

/* Pulsante Accedi stile fancy */
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

.register button:hover::before {
    left: 100%;
}

.register button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.register button:active {
    transform: scale(0.98);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
