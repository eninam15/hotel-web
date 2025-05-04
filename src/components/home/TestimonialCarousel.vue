<template>
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center fw-semibold mb-4">Testimonios</h2>
        <div id="testimonialCarousel" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div
              v-for="(t,i) in testimonials"
              :key="i"
              :class="['carousel-item', { active: i === 0 }]"
            >
              <div class="d-flex flex-column align-items-center">
                <img :src="t.image" class="rounded-circle mb-3" style="width:80px;height:80px;object-fit:cover;">
                <blockquote class="blockquote text-center">
                  <p class="mb-3">“{{ t.text }}”</p>
                  <footer class="blockquote-footer">{{ t.name }}, {{ t.role }}</footer>
                </blockquote>
              </div>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#testimonialCarousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    testimonials: {
      type: Array,
      default: () => [
        {
          photo: '/avatars/user1.jpg',
          quote: 'Gracias a Psicomorfosis, aprendí a manejar mi ansiedad.',
          name:  'Ana Pérez',
          role:  'Estudiante'
        },
        {
          photo: '/avatars/user2.jpg',
          quote: 'Sus talleres mejoraron la comunicación de mi equipo.',
          name:  'Carlos Gómez',
          role:  'Gerente de RRHH'
        }
      ]
    }
  })
  </script>
  