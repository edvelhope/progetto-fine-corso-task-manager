<template>
    <div class="add-task-wrapper">
        <h3 class="form-title">
            <FontAwesomeIcon :icon="['fas', 'file-pen']" />
            Aggiungi Nuova Task
        </h3>

        <form @submit.prevent="addTask" class="task-form">
            <div class="form-group">
                <label for="task-title" class="sr-only">Titolo</label>
                <input id="task-title" v-model="title" placeholder="Titolo" required />
            </div>

            <div class="form-group">
                <label for="task-desc" class="sr-only">Descrizione</label>
                <input id="task-desc" v-model="description" placeholder="Descrizione" required />
            </div>

            <div class="form-group">
                <label for="task-deadline" class="sr-only">Data di scadenza</label>
                <input id="task-deadline" type="date" v-model="deadline" placeholder="Data di scadenza" />
            </div>
            <div class="form-group">
                <label for="task-priority" class="sr-only">Priorità</label>
                <select id="task-priority" v-model="priority" required>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Bassa">Bassa</option>
                </select>
            </div>


            <button type="submit" class="fancy-button" :disabled="loading">
                {{ loading ? 'Aggiunta...' : 'Aggiungi task' }}
                <FontAwesomeIcon v-if="!loading" :icon="['fas', 'circle-plus']" size="lg" />
            </button>
        </form>
        <p v-if="errorMsg" style="color: red; margin-top: 0.5rem;">{{ errorMsg }}</p>
    </div>
</template>

<script setup lang="ts">
import { TaskStatus } from '@/model/task'
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const emit = defineEmits<{
    (e: 'taskAdded'): void
}>()

const title = ref('')
const description = ref('')
const deadline = ref('')
const priority = ref('Media')
const errorMsg = ref('')
const loading = ref(false)

const addTask = async () => {
    if (!title.value || !description.value) {
        errorMsg.value = 'Tutti i campi sono obbligatori'
        return
    }

    loading.value = true
    errorMsg.value = ''

    try {
        const response = await fetch(`${apiUrl}/api/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                title: title.value,
                description: description.value,
                status: TaskStatus.TODO,
                deadline: deadline.value || null,
                priority: priority.value || 'Media'
            })
        })

        if (!response.ok) throw new Error(`Errore server: ${response.status}`)

        // Reset del form
        title.value = ''
        description.value = ''
        deadline.value = ''
        errorMsg.value = ''

        emit('taskAdded')
    } catch (err) {
        console.error('Errore nell\'aggiunta della task:', err)
        errorMsg.value = 'Errore durante l\'aggiunta della task'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.add-task-wrapper {
    display: flex;
    flex-direction: column;
    background-color: var(--bg-secondary);
    padding: 1.5rem;
    box-shadow: 0 0 8px var(--shadow-light);
}

:global(.dark) .add-task-wrapper {
    background-color: rgba(99, 102, 241, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.form-title {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    font-weight: bold;
}

:global(.dark) .form-title {
    color: #e2e8f0;
}

.task-form {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
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

.form-group {
    flex: 1;
    min-width: 150px;
}

.form-group input,
.form-group select {
    padding: 0.6rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 100%;
    box-sizing: border-box;
}


.fancy-button {
    position: relative;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    overflow: hidden;
    backdrop-filter: blur(8px);
    background: linear-gradient(135deg, #a8b2be, #64748a);
    color: white;
    box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
}

.fancy-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.fancy-button::before {
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

.fancy-button:hover:not(:disabled)::before {
    left: 100%;
}

.fancy-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.fancy-button:active:not(:disabled) {
    transform: scale(0.98);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

@media only screen and (max-width: 992px) {
    .task-form {
        display: flex;
        flex-direction: column;
    }

    .form-group {
        width: 100%;
    }

    .form-title {
        margin-left: auto;
        margin-right: auto;
    }

    .fancy-button {
        width: 100%;
    }
}
</style>
