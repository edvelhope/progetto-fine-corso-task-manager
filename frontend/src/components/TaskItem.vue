<template>
    <div class="task-item">
        <input v-model="editedTask.title" @blur="updateTask" @keyup.enter="updateTask" />
        <input v-model="editedTask.description" @blur="updateTask" @keyup.enter="updateTask"></input>

        <div class="status-buttons">
            <button v-for="option in statusOptions" :key="option"
                :class="[statusClass(option), { active: editedTask.status === option }]" @click="changeStatus(option)">
                {{ option }}
            </button>
        </div>
        <button @click="deleteTask">Elimina</button>
    </div>
</template>

<script setup lang="ts">
import { TaskStatus, type Task } from '@/model/task';
import { ref } from 'vue';

const emit = defineEmits<{
    (e: 'taskDeleted', id: number): void;
    // (e: 'taskUpdated', updatedTask: Task): void;
}>();

const props = defineProps<{
    task: Task
}>();

const editedTask = ref({ ...props.task });

const statusOptions = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
];

const statusClass = (option: TaskStatus) => {
    switch (option) {
        case TaskStatus.TODO:
            return 'grey';
        case TaskStatus.IN_PROGRESS:
            return 'yellow';
        case TaskStatus.DONE:
            return 'green';
        default:
            return '';
    }
};


const updateTask = async () => {
    try {
        const response = await fetch(`http://localhost:8080/api/task/${editedTask.value.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedTask.value)
        });

        if (!response.ok) throw new Error('Errore aggiornamento');

        // const updated = await response.json();
        // emit('taskUpdated', updated);

    } catch (error) {
        console.error('Errore nel salvataggio automatico:', error);
    }
};

const changeStatus = (newStatus: TaskStatus) => {
    if (editedTask.value.status === newStatus) return;
    editedTask.value.status = newStatus;
    updateTask(); // salva subito al cambio
};

const deleteTask = async () => {
    try {

        const response = await fetch(`http://localhost:8080/api/task/${props.task.id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error("Errore nell'eliminazione della task");

        emit('taskDeleted', props.task.id); // Notifica al padre per rimuoverla dalla lista
    } catch (error) {
        console.error(error);
    }
};

</script>

<style scoped>
.task-item {
    border: 1px solid #ccc;
    padding: 1rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
}

.status {
    font-size: 0.9rem;
    color: #555;
}

.status-buttons button {
    margin-right: 0.5rem;
    padding: 0.4rem 0.8rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: white;
    opacity: 0.5;
    transition: 0.2s ease;
}

.status-buttons button.active {
    opacity: 1;
    font-weight: bold;
}

.status-buttons .grey {
    background-color: #6c757d;
}

.status-buttons .yellow {
    background-color: #ffc107;
}

.status-buttons .green {
    background-color: #28a745;
}
</style>
