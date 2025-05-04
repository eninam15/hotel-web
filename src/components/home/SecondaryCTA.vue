<template>
  <div class="position-relative">
    <section class="py-5 text-center" style="background-color:#FFD5C2;">
      <div class="container">
        <h3 class="fw-bold mb-3">{{ text }}</h3>
        <button @click="$emit('action')" class="btn btn-outline-light btn-lg">
          {{ buttonText }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import WaveDivider from '@/components/ui/WaveDivider.vue'
import { defineProps } from 'vue'

const props = defineProps({
  text:       { type:String, default:'¿Listo para empezar? Reserva tu primera sesión gratis.' },
  buttonText: { type:String, default:'Reserva ahora' }
})
</script>
