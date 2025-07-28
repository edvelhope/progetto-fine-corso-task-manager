<template>
    <div v-if="errorMsg" style="color:red">{{ errorMsg }}</div>
    <div>
        <TaskItem v-for="(task) in tasks" :key="task.id" :task="task" @taskDeleted="handleTaskDeleted" />
    </div>
</template>

<script setup lang="ts">

import type { Task } from '@/model/task';
import { onMounted, ref } from 'vue';
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

<style scoped></style>
