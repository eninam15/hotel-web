<template>
  <div class="position-relative hero-wrapper">
    <div id="carouselHero" class="carousel slide carousel-fade" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button 
          v-for="(slide, idx) in slides" 
          :key="'indicator-'+idx"
          type="button"
          data-bs-target="#carouselHero" 
          :data-bs-slide-to="idx" 
          :class="{ active: idx === 0 }"
          :aria-label="`Slide ${idx + 1}`">
        </button>
      </div>
      
      <div class="carousel-inner">
        <div
          v-for="(slide, idx) in slides"
          :key="'slide-'+idx"
          :class="['carousel-item h-100', { active: idx === 0 }]"
        >
          <div class="hero-background" :style="{backgroundImage: `url(${slide.image})`}"></div>
          <div class="overlay"></div>
          <div class="container-fluid position-relative h-100 d-flex flex-column justify-content-center">
            <div class="hero-content" :class="slide.alignment || 'text-center'">
              <h1 class="display-4 fw-bold mb-3">{{ slide.title }}</h1>
              <p class="lead mb-4">{{ slide.subtitle }}</p>
              <!--<button 
                @click="$emit('cta', idx)" 
                class="btn btn-lg" 
                :class="slide.btnVariant || btnClass">
                {{ slide.ctaText }}
                <i class="bi bi-arrow-right-circle ms-2"></i>
              </button>-->
            </div>
          </div>
        </div>
      </div>

      <!-- Controles -->
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#carouselHero"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon"></span>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselHero"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon"></span>
        <span class="visually-hidden">Siguiente</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, onMounted, onBeforeUnmount, ref } from 'vue'
import * as bootstrap from 'bootstrap'
import WaveDivider from '@/components/ui/WaveDivider.vue'

const props = defineProps({
  slides: { type: Array, required: true },
  btnClass: { type: String, default: 'btn-primary' },
  autoplay: { type: Boolean, default: true },
  interval: { type: Number, default: 5000 }
})

let carousel = null
const animatedElements = ref([])

onMounted(() => {
  const el = document.getElementById('carouselHero')
  carousel = new bootstrap.Carousel(el, {
    interval: props.autoplay ? props.interval : false,
    ride: props.autoplay ? 'carousel' : false,
    pause: 'hover',
    wrap: true
  })
  
  // Añadir evento para animaciones cuando cambia el slide
  el.addEventListener('slide.bs.carousel', (e) => {
    const nextSlide = e.relatedTarget
    const heading = nextSlide.querySelector('h1')
    const paragraph = nextSlide.querySelector('p')
    const button = nextSlide.querySelector('button')
    
    // Restablecer las clases para la próxima animación
    if (heading) heading.classList.add('animate__animated', 'animate__fadeInDown')
    if (paragraph) paragraph.classList.add('animate__animated', 'animate__fadeInUp', 'animate__delay-1s')
    if (button) button.classList.add('animate__animated', 'animate__fadeIn', 'animate__delay-2s')
  })
})

onBeforeUnmount(() => {
  if (carousel) {
    carousel.dispose()
  }
})
</script>

<style scoped>
.hero-wrapper {
  width: 100%;
  overflow: hidden;
}

.carousel-item {
  height: 100vh; /* Aumentado a 100vh para ocupar toda la altura de la pantalla */
  position: relative;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 15s ease;
  transform: scale(1);
}

.carousel-item.active .hero-background {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(248,225,231,0.7), rgba(230,218,248,0.7));
}

.hero-content {
  width: 100%;
  padding: 0 5%; /* Añadido un padding en lugar de un ancho máximo limitado */
  color: #fff;
  z-index: 1;
}

.hero-content.text-start {
  text-align: left;
  padding-left: 10%;
}

.hero-content.text-end {
  text-align: right;
  padding-right: 10%;
}

.carousel-indicators {
  margin-bottom: 2rem;
}

.carousel-indicators button {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 6px;
  background-color: rgba(255, 255, 255, 0.6);
}

.carousel-indicators button.active {
  background-color: #fff;
}

h1, p { 
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .carousel-item {
    height: 80vh;
  }
}

@media (max-width: 768px) {
  .carousel-item {
    height: 70vh;
  }
  
  .hero-content {
    text-align: center !important;
    padding: 0 15px;
  }
  
  h1 {
    font-size: 2rem !important;
  }
}

/* Para las animaciones, añade la biblioteca animate.css en tu index.html o main.js */
</style>