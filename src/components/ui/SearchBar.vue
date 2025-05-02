<template>
    <div class="relative">
      <input
        v-model="query"
        @keyup.enter="$emit('search', query)"
        type="text"
        placeholder="Search"
        class="pl-10 pr-4 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition w-64"
      />
      <svg
        class="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"/>
      </svg>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const query = ref('')
  </script>
  