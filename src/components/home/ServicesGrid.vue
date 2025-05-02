<template>
  <section class="py-5" style="background-color:#FFFFFF;">
    <div class="container position-relative">
      <h2 class="text-center fw-semibold mb-5">Nuestros Servicios</h2>
      <div class="row g-4">
        <div class="col-sm-6 col-lg-3" v-for="s in services" :key="s.title">
          <div class="position-relative overflow-hidden rounded shadow-sm">
            <img :src="s.image" class="img-fluid" />
            <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white"
                 style="background: rgba(16,185,129,0.6); opacity:0; transition: opacity 0.3s;"
                 @mouseover="hover=true" @mouseleave="hover=false"
                 :style="{ opacity: hoverMap[s.title] ? 1 : 0 }"
            >
              <h5 class="fw-bold">{{ s.title }}</h5>
              <p class="text-center">{{ s.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <WaveDivider color="#FFD5C2" flipped />
  </section>
</template>

<script setup>
import WaveDivider from '@/components/ui/WaveDivider.vue'
import { reactive, defineProps } from 'vue'

const props = defineProps({
  services: {
    type: Array,
    default: () => [
      { image:'/svc1.jpg', title:'Autoevaluación', text:'Cuestionarios y seguimiento' },
      { image:'/svc2.jpg', title:'Comunidad',      text:'Foros y apoyo mutuo' },
      { image:'/svc3.jpg', title:'Gamificación',   text:'Retos e insignias' },
      { image:'/svc4.jpg', title:'Talleres',       text:'Solidarios y corporativos' }
    ]
  }
})

const hoverMap = reactive({})
</script>
