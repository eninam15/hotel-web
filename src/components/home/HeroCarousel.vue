<template>
  <div class="position-relative">
    <div
      id="carouselHero"
      class="carousel slide carousel-fade"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner">
        <div
          v-for="(slide, idx) in slides"
          :key="idx"
          :class="['carousel-item h-100', { active: idx === 0 }]"
          :style="{
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '80vh'
          }"
        >
          <div
            class="position-absolute top-0 start-0 w-100 h-100"
            :style="{
              background: 'linear-gradient(135deg, rgba(248,225,231,0.6), rgba(230,218,248,0.6))'
            }"
          ></div>
          <div class="container position-relative h-100 d-flex flex-column justify-content-center text-center text-white">
            <h1 class="display-4 fw-bold">{{ slide.title }}</h1>
            <p class="lead mb-4">{{ slide.subtitle }}</p>
            <button @click="$emit('cta', idx)" class="btn btn-lg" :class="btnClass">
              {{ slide.ctaText }}
            </button>
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
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#carouselHero"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon"></span>
      </button>
    </div>

    <!-- Wave al final -->
    <WaveDivider color="#F8E1E7" />
  </div>
</template>

<script setup>
import { defineProps, onMounted, onBeforeUnmount } from 'vue'
import * as bootstrap from 'bootstrap'
import WaveDivider from '@/components/ui/WaveDivider.vue'

const props = defineProps({
  slides: { type: Array, required: true },
  btnClass: { type: String, default: 'btn-primary' }
})

let carousel = null
onMounted(() => {
  const el = document.getElementById('carouselHero')
  carousel = new bootstrap.Carousel(el, {
    interval: 5000,
    ride: 'carousel',
    pause: 'hover',
    wrap: true
  })
})
onBeforeUnmount(() => carousel?.dispose())
</script>

<style scoped>
.carousel-item h1, .carousel-item p { text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
</style>
