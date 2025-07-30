<script setup lang="ts">
import AddTask from './components/AddTask.vue'
import TaskList from './components/TaskList.vue'
</script>

<template>
  <div>
    <AddTask />
    <TaskList />
  </div>
</template>

<style scoped>
button {
  padding: 6px 12px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

body {
  background-color: #0f172a;
  color: white;
  margin: 0;
  font-family: sans-serif;
}

button:hover {
  background-color: #666;
}
</style>
