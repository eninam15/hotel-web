<template>
    <aside class="bg-white p-6 space-y-4">
      <div class="text-center mb-6">
        <img src="/logo.svg" alt="Logo" class="mx-auto h-12 mb-2"/>
        <h3 class="text-lg font-semibold text-sky-700">Admin</h3>
      </div>
      <nav class="space-y-2">
        <router-link v-for="l in links" :key="l.to" :to="l.to"
                     class="block py-2 px-4 rounded hover:bg-sky-50 transition">
          {{ l.label }}
        </router-link>
      </nav>
    </aside>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  const props = defineProps({ links: Array })
  </script>
  