<template>
    <div class="add-task-wrapper">
        <h3 class="form-title">
            <FontAwesomeIcon :icon="['fas', 'file-pen']" />
            Aggiungi Nuova Task
        </h3>

        <form @submit="addTask" class="task-form">
            <div class="form-group">
                <input v-model="title" placeholder="Titolo" required />
            </div>

            <div class="form-group">
                <input v-model="description" placeholder="Descrizione" required />
            </div>

            <div class="form-group">
                <input type="date" v-model="deadline" placeholder="Data di scadenza" />
            </div>
            <div class="form-group">
                <select v-model="priority" required>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Bassa">Bassa</option>
                </select>
            </div>


            <button type="submit" class="fancy-button">
                Aggiungi task
                <FontAwesomeIcon :icon="['fas', 'circle-plus']" size="lg" />
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { TaskStatus, type Task } from '@/model/task';
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


let title = ref('');
let description = ref('');
let deadline = ref('');
let priority = ref('Media'); // Default priority

let tasks = ref<Task[]>([]);
let errorMsg = ref('');

const addTask = async () => {

    if (!title.value || !description.value) {
        errorMsg.value = 'Tutti i campi sono obbligatori';
        return;
    }

    try {

        const response = await fetch('http://localhost:8080/api/task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}` // 👈 Token usato per identificare l'utente
            },
            body: JSON.stringify({
                title: title.value,
                description: description.value,
                status: TaskStatus.TODO,
                deadline: deadline.value || null,
                priority: priority.value || 'Media'
            })
        });

        if (!response.ok) throw new Error(`Errore server: ${response.status}`);

        const addedTask = await response.json();
        tasks.value.push(addedTask);

        // Reset del form
        title.value = '';
        description.value = '';
        deadline.value = '';
        errorMsg.value = '';

    } catch (err) {
        console.error('Errore nell\'aggiunta della task:', err);
        errorMsg.value = 'Errore durante l\'aggiunta della task';
    }
};


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
}

.form-group input {
    padding: 0.6rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 200px;
}

.form-group select {
    padding: 0.6rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 200px;
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

.fancy-button:hover::before {
    left: 100%;
}

.fancy-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.fancy-button:active {
    transform: scale(0.98);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.sort-select {
    font-weight: 700;
    font-size: 1rem;
    color: #2c3e50;
    padding: 6px 12px;
    border: none;
    border-bottom: 2px solid #3498db;
    background: transparent;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    outline: none;
}

.sort-select:focus {
    outline: none;
    border-color: #1d4ed8;
    /* un blu più scuro al focus */
    background: #f0f9ff;
}

.sort-label {
    font-weight: 700;
    font-size: 1rem;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-right: 8px;
}

@media only screen and (max-width: 992px) {
    .task-form {
        display: flex;
        flex-direction: column;
    }

    .form-title {
        margin-left: auto;
        margin-right: auto;
    }

    .fancy-button {
        width: 200px;
    }
}
</style>
