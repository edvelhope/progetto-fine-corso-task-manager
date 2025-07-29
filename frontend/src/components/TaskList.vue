<template>
    <div class="task-table">
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
                <TaskItem v-for="task in tasks" :key="task.id" :task="task" @taskDeleted="handleTaskDeleted" />
            </tbody>
        </table>
    </div>
</template>


<script setup lang="ts">

import type { Task } from '@/model/task';
import { onMounted, onUpdated, ref } from 'vue';
import TaskItem from './TaskItem.vue';

let errorMsg = ref('');
let tasks = ref<Task[]>([]);

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
