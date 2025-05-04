<template>
  <section class="services-section py-5">
    <div class="container position-relative">
      <div class="text-center mb-5">
        <h2 class="fw-bold display-5 mb-2">Nuestros Servicios</h2>
        <p class="text-muted mx-auto" style="max-width: 700px;">
          Ofrecemos una variedad de servicios diseñados para apoyarte en tu camino hacia el bienestar emocional y psicológico.
        </p>
      </div>
      
      <div class="row g-4">
        <div 
          v-for="service in services" 
          :key="service.title"
          class="col-sm-6 col-lg-3"
        >
          <div 
            class="service-card h-100"
            @mouseover="setActiveService(service.title)"
            @mouseleave="activeService = null"
          >
            <div class="service-image">
              <img :src="service.image" class="img-fluid" :alt="service.title" />
              <div class="service-overlay" :class="{'active': activeService === service.title}">
                <div class="service-content">
                  <h5 class="fw-bold mb-2">{{ service.title }}</h5>
                  <p class="mb-3">{{ service.text }}</p>
                  <router-link 
                    :to="{name: 'service-detail', params: {slug: slugify(service.title)}}" 
                    class="btn btn-sm btn-light"
                  >
                    Saber más
                    <i class="bi bi-arrow-right ms-1"></i>
                  </router-link>
                </div>
              </div>
            </div>
            <div class="service-title py-3 px-2 text-center">
              <h5 class="mb-0 fw-semibold">{{ service.title }}</h5>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botón Ver Todos -->
      <div class="text-center mt-5">
        <router-link :to="{name: 'home'}" class="btn btn-outline-primary">
          Ver todos los servicios
          <i class="bi bi-grid ms-2"></i>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import WaveDivider from '@/components/ui/WaveDivider.vue'

const props = defineProps({
  services: {
    type: Array,
    default: () => [
      { 
        image: '/svc1.jpg', 
        title: 'Terapia Individual', 
        text: 'Sesiones personalizadas enfocadas en tus necesidades específicas para promover tu bienestar.' 
      },
      { 
        image: '/svc2.jpg', 
        title: 'Terapia de Pareja', 
        text: 'Mejora la comunicación y resuelve conflictos para construir relaciones más saludables.' 
      },
      { 
        image: '/svc3.jpg', 
        title: 'Talleres Grupales', 
        text: 'Espacios de aprendizaje colaborativo para desarrollar habilidades emocionales.' 
      },
      { 
        image: '/svc4.jpg', 
        title: 'Servicios Corporativos', 
        text: 'Programas especializados para mejorar el bienestar en entornos laborales.' 
      }
    ]
  }
})

const activeService = ref(null)

const setActiveService = (title) => {
  activeService.value = title
}

const slugify = (text) => {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}
</script>

<style scoped>
.services-section {
  background-color: #FFFFFF;
  position: relative;
}

.service-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: white;
  position: relative;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.12);
}

.service-image {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.service-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.service-card:hover .service-image img {
  transform: scale(1.1);
}

.service-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(156, 39, 176, 0.8), rgba(123, 31, 162, 0.9));
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 20px;
}

.service-overlay.active {
  opacity: 1;
}

.service-content {
  color: white;
  text-align: center;
}

.service-title {
  background-color: #f8f9fa;
  border-top: 3px solid #9C27B0;
}

@media (max-width: 767px) {
  .service-image {
    height: 180px;
  }
}
</style>