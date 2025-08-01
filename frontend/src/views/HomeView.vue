<script setup lang="ts">
import AddTask from '@/components/AddTask.vue';
import TaskList from '@/components/TaskList.vue';
import TaskLineLogo from '@/components/TaskLineLogo.vue';

defineEmits(['routeChanged'])

</script>

<template>
    <AddTask />
    <TaskList />
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
}

.logo-wrapper {
  margin-bottom: 1rem;
}
</style>
