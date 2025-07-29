<!-- DarkModeToggle.vue -->
<template>
    <button @click="toggleTheme" class="theme-toggle" :class="{ 'dark': isDark }"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <div class="toggle-track">
            <div class="toggle-thumb">
                <FontAwesomeIcon :icon="['fas', isDark ? 'moon' : 'sun']" class="toggle-icon" />
            </div>
        </div>
    </button>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const isDark = ref(false);

// Carica la preferenza salvata o usa la preferenza del sistema
onMounted(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        isDark.value = savedTheme === 'dark';
    } else {
        // Usa la preferenza del sistema operativo
        isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyTheme();
});

// Osserva i cambiamenti e applica il tema
watch(isDark, () => {
    applyTheme();
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
});

const toggleTheme = () => {
    isDark.value = !isDark.value;
};

const applyTheme = () => {
    if (isDark.value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
</script>

<style scoped>
.theme-toggle {
    position: relative;
    width: 64px;
    height: 32px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    border-radius: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toggle-track {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
    border-radius: 16px;
    position: relative;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle.dark .toggle-track {
    background: linear-gradient(135deg, #1e293b, #334155);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #ffffff, #f8fafc);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(0);
}

.theme-toggle.dark .toggle-thumb {
    background: linear-gradient(135deg, #1f2937, #374151);
    transform: translateX(32px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.toggle-icon {
    font-size: 12px;
    color: #f59e0b;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle.dark .toggle-icon {
    color: #60a5fa;
}

/* Hover effects */
.theme-toggle:hover .toggle-track {
    transform: scale(1.05);
}

.theme-toggle:hover .toggle-thumb {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.theme-toggle.dark:hover .toggle-thumb {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Active state */
.theme-toggle:active .toggle-thumb {
    transform: translateX(0) scale(0.95);
}

.theme-toggle.dark:active .toggle-thumb {
    transform: translateX(32px) scale(0.95);
}
</style>
