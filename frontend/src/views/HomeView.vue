<script setup lang="ts">
import AddTask from '@/components/AddTask.vue';
import TaskList from '@/components/TaskList.vue';

defineEmits(['routeChanged'])

</script>

<template>
    <AddTask />
    <TaskList />
</template>

<style scoped></style>
