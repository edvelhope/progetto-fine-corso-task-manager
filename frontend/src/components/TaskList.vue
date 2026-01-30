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

        <div v-if="loading" class="empty-state">
            <p>Caricamento...</p>
        </div>

        <div v-else-if="sortedTasks.length === 0" class="empty-state">
            <div class="icon">⌛</div>
            <p>Nessuna task al momento</p>
        </div>

        <div v-else class="task-table">
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
import type { Task } from '@/model/task'
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import auth from '@/stores/auth'
import TaskItem from './TaskItem.vue'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const router = useRouter()

const tasks = ref<Task[]>([])
const loading = ref(false)

// Stato per ordinamento
const sortBy = ref('default')

// Computed che restituisce la lista ordinata
const sortedTasks = computed(() => {
    const priorityOrder: Record<string, number> = {
        Alta: 1,
        Media: 2,
        Bassa: 3,
    }

    if (sortBy.value === 'week') {
        const now = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(now.getDate() + 7)

        // filtro task con scadenza tra oggi e 7 giorni dopo
        return tasks.value.filter((task: Task) => {
            if (!task.deadline) return false
            const deadline = new Date(task.deadline)
            return deadline >= now && deadline <= nextWeek
        })
    }

    return [...tasks.value].sort((a, b) => {
        if (sortBy.value === 'priority') {
            const aPriority = a.priority ?? ''
            const bPriority = b.priority ?? ''
            return (priorityOrder[aPriority] ?? 99) - (priorityOrder[bPriority] ?? 99)
        }

        if (sortBy.value === 'deadline') {
            const aDate = a.deadline ? new Date(a.deadline).getTime() : 0
            const bDate = b.deadline ? new Date(b.deadline).getTime() : 0
            return aDate - bDate
        }

        return a.id - b.id // default ordinamento per ID
    })
})



const handleTaskDeleted = (id: number) => {
    tasks.value = tasks.value.filter(task => task.id !== id)
}

const loadTasks = async () => {
    loading.value = true
    try {
        const token = localStorage.getItem('token')

        if (!token) {
            throw new Error('Utente non autenticato')
        }

        const response = await fetch(`${apiUrl}/api/task`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.status === 401 || response.status === 403) {
            auth.logout()
            router.push('/login')
            return
        }

        if (!response.ok) throw new Error(`Errore server: ${response.status}`)

        const data = await response.json()
        tasks.value = data.tasks ?? data
    } catch (err) {
        console.error('Errore nella fetch:', err)
    } finally {
        loading.value = false
    }
}

defineExpose({ loadTasks })

onMounted(loadTasks)
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

:global(.dark) .task-table {
    background: #1e293b;
    border-color: #334155;
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

:global(.dark) .task-table th,
:global(.dark) .task-table td {
    border-bottom-color: #334155;
}

.task-table thead {
    background-color: #f5f5f5;
    font-weight: bold;
    color: #333;
}

:global(.dark) .task-table thead {
    background-color: #0f172a;
    color: #e2e8f0;
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

:global(.dark) .task-table td:first-child,
:global(.dark) .task-table th:first-child {
    color: #94a3b8;
}

.task-table tbody tr:hover {
    background-color: #a3bbcf;
}

:global(.dark) .task-table tbody tr:hover {
    background-color: rgba(99, 102, 241, 0.15);
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 4rem 0;
    color: #ccc;
    animation: fadeIn 1s ease-in-out;
}

.empty-state .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    animation: bounce 1.5s infinite;
}

.empty-state p {
    font-size: 1.3rem;
    font-style: italic;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-6px);
    }
}
</style>
