<template>
    <div class="task-table">
        <div class="search-container">
            <FontAwesomeIcon icon="search" class="search-icon" />
            <input type="text" v-model="searchQuery" placeholder="Cerca per titolo o descrizione..."
                class="search-input" />
        </div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Titolo</th>
                    <th>Descrizione</th>
                    <th>Status</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                <TaskItem v-for="task in filteredTasks" :key="task.id" :task="task" @taskDeleted="handleTaskDeleted" />
            </tbody>
        </table>
    </div>
</template>



<script setup lang="ts">

import type { Task } from '@/model/task';
import { onMounted, onUpdated, ref } from 'vue';
import TaskItem from './TaskItem.vue';
import { computed } from 'vue';


let errorMsg = ref('');
let tasks = ref<Task[]>([]);

const searchQuery = ref('');

const filteredTasks = computed(() =>
    tasks.value.filter(task => {
        const q = searchQuery.value.toLowerCase();
        return (
            task.title.toLowerCase().includes(q) ||
            task.description.toLowerCase().includes(q)
        );
    })
);


const handleTaskDeleted = (id: number) => {
    tasks.value = tasks.value.filter(task => task.id !== id);
};

const loadTasks = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/task');

        if (!response.ok) throw new Error(`Errore server: ${response.status}`);

        tasks.value = await response.json();

        errorMsg.value = '';

    } catch (err) {
        console.error('Errore nella fetch:', err);
        errorMsg.value = 'Errore nel caricamento delle tasks';
    }
};
onMounted(loadTasks);

</script>

<style scoped>
.search-container {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin-bottom: 1rem;
    margin-top: 1rem;
}

.search-input {
    width: 100%;
    padding: 10px 14px 10px 40px;
    /* padding a sinistra aumentato */
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    background-color: var(--bg-secondary);
    color: var(--text-primary);
}

.search-icon {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: #888;
    font-size: 16px;
    pointer-events: none;
}

.search-input::placeholder {
    color: var(--text-secondary);
}

.dark .search-input {
    border-color: rgba(255, 255, 255, 0.2);
}

.task-table {
    width: 100%;
    overflow-x: auto;
    margin-top: 1rem;
    border: 1px solid #ccc;
    border-radius: 6px;
}

.task-table table {
    width: 100%;
    border-collapse: collapse;
    font-family: sans-serif;
}

.task-table th,
.task-table td {
    padding: 16px 18px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
    vertical-align: middle;
}

.task-table thead {
    background-color: #f5f5f5;
    font-weight: bold;
    color: #333;
}

.task-table td:last-child,
.task-table th:last-child {
    width: 60px;
    /* o anche 60px, se vuoi più stretto */
    text-align: center;
}

.task-table td:first-child,
.task-table th:first-child {
    width: 60px;
    text-align: center;
    color: #666;
    font-weight: bold;
}

.task-table tbody tr:hover {
    background-color: #f0f8ff;
}
</style>
