<template>
    <div class="flex min-h-screen bg-sky-50">
      <aside class="w-64 bg-white shadow-lg p-6">
        <div class="mb-8">
          <h2 class="text-xl font-bold text-sky-700">Panel Admin</h2>
        </div>
        <nav class="space-y-4">
          <router-link to="/admin/dashboard" class="block py-2 px-3 rounded hover:bg-sky-100 transition">Dashboard</router-link>
          <router-link to="/admin/users"     class="block py-2 px-3 rounded hover:bg-sky-100 transition">Usuarios</router-link>
          <router-link to="/admin/settings"  class="block py-2 px-3 rounded hover:bg-sky-100 transition">Ajustes</router-link>
        </nav>
        <button @click="logout" class="mt-auto w-full bg-sky-600 text-white py-2 rounded-full shadow hover:bg-sky-500 transition">Salir</button>
      </aside>
  
      <div class="flex-1 flex flex-col">
        <Navbar :links="[]"/>
        <main class="flex-1 p-8">
          <router-view/>
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import Navbar from '@/components/ui/Navbar.vue'
  import { useAuthStore } from '@/store/auth'
  
  const auth = useAuthStore()
  function logout() {
    auth.logout()
  }
  </script>
  