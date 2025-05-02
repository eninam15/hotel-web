<template>
  <div class="position-relative">
    <WaveDivider flipped color="#F8E1E7" />
    <section class="py-5" style="background-color:#F8E1E7;">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4" v-for="it in items" :key="it.title">
            <div class="card h-100 border-0 shadow-sm bg-white">
              <div class="card-body text-center">
                <i :class="it.icon" class="fs-1 text-secondary mb-3"></i>
                <h5 class="fw-bold">{{ it.title }}</h5>
                <p class="text-muted">{{ it.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import WaveDivider from '@/components/ui/WaveDivider.vue'
import { defineProps } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { icon:'bi bi-people-fill',    title:'Equipo Profesional',   text:'Psicólogos certificados, especializados en jóvenes.' },
      { icon:'bi bi-heart-fill',     title:'Terapias Personalizadas', text:'Sesiones online y presenciales adaptadas a ti.' },
      { icon:'bi bi-gear-fill',      title:'Innovación Tecnológica', text:'Herramientas digitales y seguimiento continuo.' }
    ]
  }
})
</script>

<style scoped>
.card:hover { transform: translateY(-5px); transition: transform 0.2s; }
</style>
