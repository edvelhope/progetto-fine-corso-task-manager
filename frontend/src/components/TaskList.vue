<template>
    <div>
        <!-- Dropdown per ordinamento -->
        <label for="sort">&nbsp;Ordina per:&nbsp;</label>
        <select id="sort" v-model="sortBy" style="margin-bottom: 1rem;">
            <option value="default">Inserimento (default)</option>
            <option value="priority">Priorità</option>
            <option value="deadline">Scadenza</option>
            <option value="week">Questa settimana</option>

        </select>

        <div class="task-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titolo</th>
                        <th>Descrizione</th>
                        <th>Data/Priorità</th>
                        <th>Status</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Ora uso sortedTasks -->
                    <TaskItem v-for="task in sortedTasks" :key="task.id" :task="task"
                        @taskDeleted="handleTaskDeleted" />
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Task } from '@/model/task';
import { onMounted, ref, computed } from 'vue';
import TaskItem from './TaskItem.vue';

let errorMsg = ref('');
let tasks = ref<Task[]>([]);

// Stato per ordinamento
const sortBy = ref('default');

const priorityOrder = { 'Alta': 1, 'Media': 2, 'Bassa': 3 };

// Computed che restituisce la lista ordinata
const sortedTasks = computed(() => {
    const priorityOrder: Record<string, number> = {
        Alta: 1,
        Media: 2,
        Bassa: 3,
    };

    if (sortBy.value === 'week') {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        // filtro task con scadenza tra oggi e 7 giorni dopo
        return tasks.value.filter((task: Task) => {
            if (!task.deadline) return false;
            const deadline = new Date(task.deadline);
            return deadline >= now && deadline <= nextWeek;
        });
    }

    return [...tasks.value].sort((a, b) => {
        if (sortBy.value === 'priority') {
            const aPriority = a.priority ?? '';
            const bPriority = b.priority ?? '';
            return (priorityOrder[aPriority] ?? 99) - (priorityOrder[bPriority] ?? 99);
        }

        if (sortBy.value === 'deadline') {
            const aDate = a.deadline ? new Date(a.deadline).getTime() : 0;
            const bDate = b.deadline ? new Date(b.deadline).getTime() : 0;
            return aDate - bDate;
        }

        return a.id - b.id; // default ordinamento per ID
    });
});



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
    width: 90%;
    max-width: 1200px;
    margin: 1.5rem auto;
    /* centra orizzontalmente e margine sopra e sotto */
    overflow-x: auto;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    background: white;
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
    background-color: #a3bbcf;
}
</style>
