<template>
    <section class="py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <img :src="image" class="img-fluid rounded shadow" />
          </div>
          <div class="col-md-6">
            <h2 class="fw-bold mb-3">{{ title }}</h2>
            <p class="text-muted mb-4">{{ text }}</p>
            <div class="d-flex gap-3">
              <div v-for="v in values" :key="v.name" class="text-center">
                <i :class="v.icon" class="fs-2 text-primary mb-2"></i>
                <h6 class="fw-semibold">{{ v.name }}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    image: { type: String, default: '/team-photo.jpg' },
    title: { type: String, default: 'Conócenos' },
    text:  { type: String, default: 'Psicomorfosis es un centro dedicado a…' },
    values: {
      type: Array,
      default: () => [
        { icon: 'bi bi-heart-pulse', name: 'Empatía' },
        { icon: 'bi bi-shield-lock-fill', name: 'Confidencialidad' },
        { icon: 'bi bi-award-fill', name: 'Excelencia' }
      ]
    }
  })
  </script>
  