<template>
    <button
      class="p-2 rounded-full hover:bg-gray-100 transition relative"
      @click="$emit('click')"
      aria-label="Notifications"
    >
      <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 
             6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 
             6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 
             3 0 11-6 0v-1m6 0H9"
        />
      </svg>
      <span v-if="count" class="absolute top-0 right-0 inline-flex items-center justify-center 
                                 px-1 text-xs font-bold leading-none text-white bg-red-600 
                                 rounded-full transform translate-x-1/2 -translate-y-1/2">
        {{ count }}
      </span>
    </button>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    count: { type: Number, default: 0 }
  })
  </script>
  