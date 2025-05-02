<template>
    <div class="relative">
      <button @click="$emit('click')" class="focus:outline-none">
        <img
          :src="src"
          alt="User avatar"
          class="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
        />
      </button>
      <!-- Aquí podrías agregar un dropdown si lo necesitas -->
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    src: { type: String, required: true }
  })
  </script>
  