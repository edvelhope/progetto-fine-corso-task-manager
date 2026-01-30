<!-- TaskItem.vue -->
<template>
    <tr>
        <td>{{ task.id }}</td>
        <td>
            <input v-model="editedTask.title" @blur="updateTask" />
        </td>
        <td>
            <input v-model="editedTask.description" @blur="updateTask" />
        </td>
        <td>
            {{ editedTask.deadline ? new Date(editedTask.deadline).toLocaleDateString() : 'Nessuna' }}
            <div v-if="isExpired" class="expired-warning">
                ⚠️Task scaduta!
            </div>
            <div :class="['priority-label', getPriorityClass(task.priority || '')]">

                Priorità: {{ task.priority }}
            </div>


        </td>




        <td>



            <!-- Desktop: pulsanti -->
            <div class="status-buttons desktop-only">
                <button v-for="option in statusOptions" :key="option"
                    :class="[statusClass(option), { active: editedTask.status === option }]"
                    @click="changeStatus(option)">
                    {{ option }}
                </button>
            </div>

            <!-- Mobile/tablet: select dropdown -->
            <div class="mobile-only">
                <select v-model="editedTask.status" @change="updateTask">
                    <option v-for="option in statusOptions" :key="option" :value="option">
                        {{ option }}
                    </option>
                </select>
            </div>

        </td>
        <td>
            <button class="delete-btn" @click="deleteTask">
                <FontAwesomeIcon :icon="['fas', 'trash-can']" />
            </button>
        </td>
    </tr>
</template>


<script setup lang="ts">
import { TaskStatus, type Task } from '@/model/task'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import auth from '@/stores/auth'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
const router = useRouter()

const isExpired = computed(() => {
    if (!props.task.deadline) return false;
    const today = new Date();
    const deadlineDate = new Date(props.task.deadline);
    // Confronta solo la data, non l'orario
    return deadlineDate < new Date(today.toDateString());
});


const emit = defineEmits<{
    (e: 'taskDeleted', id: number): void;
    // (e: 'taskUpdated', updatedTask: Task): void;
}>();

const props = defineProps<{
    task: Task
}>();
const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
        case 'alta':
            return 'priority-high';
        case 'media':
            return 'priority-medium';
        case 'bassa':
            return 'priority-low';
        default:
            return '';
    }
};


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
        const token = localStorage.getItem('token');

        const taskToSend = {
            id: editedTask.value.id,
            title: editedTask.value.title || '',
            description: editedTask.value.description || '',
            status: editedTask.value.status || 'Da fare',
            deadline: editedTask.value.deadline
                ? new Date(editedTask.value.deadline).toISOString().slice(0, 10)
                : null,
            priority: editedTask.value.priority || 'Media'
        };

        const response = await fetch(`${apiUrl}/api/task/${taskToSend.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(taskToSend)
        });

        if (response.status === 401 || response.status === 403) {
            auth.logout()
            router.push('/login')
            return
        }

        if (!response.ok) {
            const errText = await response.text()
            throw new Error(`Errore aggiornamento: ${errText}`)
        }

    } catch (error) {
        console.error('Errore nel salvataggio automatico:', error)
    }
};


const changeStatus = (newStatus: TaskStatus) => {
    if (editedTask.value.status === newStatus) return;
    editedTask.value.status = newStatus;
    updateTask(); // salva subito al cambio
};

const deleteTask = async () => {
    if (!confirm('Sei sicuro di voler eliminare questa task?')) return

    try {
        const token = localStorage.getItem('token')

        const response = await fetch(`${apiUrl}/api/task/${props.task.id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 401 || response.status === 403) {
            auth.logout()
            router.push('/login')
            return
        }

        if (!response.ok) throw new Error("Errore nell'eliminazione della task")

        emit('taskDeleted', props.task.id)
    } catch (error) {
        console.error(error)
    }
}

</script>

<style scoped>
/* Container principale */
tr {
    transition: all 0.2s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.priority-label {
    font-weight: bold;
    color: #3b82f6;
    /* blu */
    margin-top: 0.3rem;
    text-transform: capitalize;
}


tr:hover {
    background-color: rgba(99, 102, 241, 0.02);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

:global(.dark) tr:hover {
    background-color: rgba(99, 102, 241, 0.1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

td {
    padding: 16px 12px;
    vertical-align: middle;
}

/* Input moderni */
input {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid transparent;
    background: rgba(248, 250, 252, 0.8);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
}

:global(.dark) input {
    background: rgba(30, 41, 59, 0.8);
    color: #e2e8f0;
}

.priority-high {
    color: red;
    font-weight: bold;
}

.priority-medium {
    color: orange;
}

.priority-low {
    color: green;
}


input:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    transform: translateY(-1px);
}

:global(.dark) input:focus {
    background: rgba(15, 23, 42, 0.95);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

input:hover {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(99, 102, 241, 0.3);
}

:global(.dark) input:hover {
    background: rgba(15, 23, 42, 0.9);
    border-color: rgba(99, 102, 241, 0.4);
}

/* Bottoni di stato - Design sofisticato */
.status-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
}

.status-buttons button {
    position: relative;
    padding: 10px 18px;
    font-size: 13px;
    font-weight: 600;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    overflow: hidden;
    backdrop-filter: blur(8px);
}

.status-buttons button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s;
}

.status-buttons button:hover::before {
    left: 100%;
}

.status-buttons button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Stili specifici per stato */
.status-buttons .grey {
    background: linear-gradient(135deg, #a8b2be, #64748a);
    color: white;
    box-shadow: 0 2px 8px rgba(100, 116, 139, 0.3);
}

.status-buttons .grey.active {
    background: linear-gradient(135deg, #334155, #1e293b);
    box-shadow: 0 4px 12px rgba(30, 41, 59, 0.6);
}

.status-buttons .yellow {
    background: linear-gradient(135deg, #f3dbb1, #f5ac59);
    color: white;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.status-buttons .yellow.active {
    background: linear-gradient(135deg, #c27f1c, #b4670f);
    box-shadow: 0 4px 12px rgba(146, 89, 14, 0.6);
}

.status-buttons .green {
    background: linear-gradient(135deg, #afecd0, #1ea75c);
    color: white;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.status-buttons .green.active {
    background: linear-gradient(135deg, #047842, #065f28);
    box-shadow: 0 4px 12px rgba(6, 95, 70, 0.6);
}

.status-buttons button.active {
    transform: translateY(-1px);
    font-weight: 700;
}

/* Bottone delete moderno con FontAwesome */
.delete-btn {
    position: relative;
    background: linear-gradient(135deg, #fee2e2, #fecaca);
    border: 2px solid transparent;
    color: #dc2626;
    font-size: 16px;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    overflow: hidden;
}

.delete-btn svg {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
}

.delete-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
}

.delete-btn:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.4);
    border-color: rgba(220, 38, 38, 0.3);
}

.delete-btn:hover::before {
    opacity: 1;
}

.delete-btn:hover svg {
    color: white;
    transform: scale(1.1) rotate(-5deg);
}

.delete-btn:active {
    transform: translateY(0) scale(0.98);
}

.delete-btn:active svg {
    transform: scale(0.9);
}

/* Responsive design migliorato */
.desktop-only {
    display: flex;
    gap: 8px;
    align-items: center;
}

.mobile-only {
    display: none;
}

.mobile-only select {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid transparent;
    background: rgba(248, 250, 252, 0.9);
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: #334155;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
}

:global(.dark) .mobile-only select {
    background: rgba(30, 41, 59, 0.9);
    color: #e2e8f0;
}

.mobile-only select:focus {
    outline: none;
    border-color: #6366f1;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

:global(.dark) .mobile-only select:focus {
    background: rgba(15, 23, 42, 0.95);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
}

@media (max-width: 768px) {
    .desktop-only {
        display: none;
    }

    .mobile-only {
        display: block;
        margin-top: 8px;
    }

    td {
        padding: 12px 8px;
    }

    input {
        padding: 10px 12px;
        font-size: 13px;
    }

    .delete-btn {
        width: 40px;
        height: 40px;
        font-size: 14px;
    }

    tr:hover {
        transform: none;
    }
}

/* Micro animazioni per feedback */
@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.8;
    }
}

.status-buttons button:active {
    animation: pulse 0.2s ease-in-out;
}

/* Glassmorphism effect per un look più moderno */
tr {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.1);
}

:global(.dark) tr {
    background: rgba(15, 23, 42, 0.1);
}

.expired-warning {
    color: red;
    font-weight: bold;
    margin-top: 0.5rem;
}


/* Smooth scroll per mobile */
@media (max-width: 768px) {
    * {
        -webkit-overflow-scrolling: touch;
    }
}
</style>
