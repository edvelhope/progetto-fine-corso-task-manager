<script setup lang="ts">
import { ref } from 'vue'
import AddTask from '@/components/AddTask.vue'
import TaskList from '@/components/TaskList.vue'

const taskListRef = ref<InstanceType<typeof TaskList> | null>(null)

const onTaskAdded = () => {
  taskListRef.value?.loadTasks()
}
</script>

<template>
    <AddTask @taskAdded="onTaskAdded" />
    <TaskList ref="taskListRef" />
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}
</style>
