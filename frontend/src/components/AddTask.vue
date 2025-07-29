<template>
    <div class="input-aggiunta">
        <ModeToggle class="toggle" />
        <h3>Aggiungi Nuova Task</h3>
        <form @submit="addTask">
            <input v-model="title" name="title" placeholder="Titolo" required />
            <input v-model="description" name="description" placeholder="Descrizione" required />
            <button type="submit">Aggiungi Task</button>
        </form>
    </div>

</template>

<script setup lang="ts">
import { TaskStatus, type Task } from '@/model/task';
import { ref } from 'vue';
import ModeToggle from './ModeToggle.vue';

let title = ref('');
let description = ref('');
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
            },
            body: JSON.stringify({ title: title.value, description: description.value, status: TaskStatus.TODO })
        });

        if (!response.ok) throw new Error(`Errore server: ${response.status}`);

        const addedTask = await response.json();
        tasks.value.push(addedTask);

        // Reset del form
        title.value = '';
        description.value = '';
        errorMsg.value = '';

    } catch (err) {
        console.error('Errore nell\'aggiunta della task:', err);
        errorMsg.value = 'Errore durante l\'aggiunta della task';
    }
};


</script>

<style scoped>
.input-aggiunta {
    display: flex;
    flex-direction: column;
}

.toggle {
    margin-left: auto;
}
</style>
