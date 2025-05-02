<template>
    <div class="space-y-6">
      <h2 class="text-3xl font-semibold text-center text-sky-700">Iniciar Sesión</h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <input v-model="form.email" type="email" placeholder="Correo electrónico" required
               class="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"/>
        <input v-model="form.password" type="password" placeholder="Contraseña" required
               class="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-300"/>
        <button type="submit" class="w-full bg-sky-600 text-white py-3 rounded-lg shadow hover:bg-sky-500 transition">
          Entrar
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import { useAuthStore } from '@/store/auth'
  import { useRouter } from 'vue-router'
  
  const form = reactive({ email: '', password: '' })
  const auth = useAuthStore()
  const router = useRouter()
  
  async function onSubmit() {
    try {
      await auth.login(form)
      router.push({ name: 'dashboard' })
    } catch {
      alert('Correo o contraseña incorrectos')
    }
  }
  </script>
  