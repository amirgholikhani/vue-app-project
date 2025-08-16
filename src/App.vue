<script setup lang="ts">
</script>

<template>
  <div class="flex flex-col h-screen w-full">
    <header>
      <h2 class="bg-yellow-700 text-gray-800 p-5">this is header</h2>
    </header>

    <main class="flex-1 overflow-y-auto">
      <div class="space-y-4">
        <div v-for="i in 30" :key="i" class="p-5 rounded">
          Current item {{ i }}
        </div>
      </div>
    </main>

    <footer>
      <h2 class="bg-green-800 text-white p-5">this is footer</h2>
    </footer>
  </div>
</template>

<style scoped>
</style>
