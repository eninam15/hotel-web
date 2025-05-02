<template>
  <HeroCarousel :slides="heroSlides" @cta="goRegister" />

  <WhyUsCards :items="whyItems" />

  <ServicesGrid :services="services" />

  <TestimonialCarousel :testimonials="testimonials" />

  <SecondaryCTA @action="goRegister" />

  <AboutSection :image="aboutImage" :title="aboutTitle" :text="aboutText" :values="aboutValues" />

  <FooterSection @subscribe="onSubscribe"/>
</template>

<script setup>
import { useRouter } from 'vue-router'
import HeroCarousel         from '@/components/home/HeroCarousel.vue'
import WhyUsCards           from '@/components/home/WhyUsCards.vue'
import ServicesGrid         from '@/components/home/ServicesGrid.vue'
import TestimonialCarousel  from '@/components/home/TestimonialCarousel.vue'
import SecondaryCTA         from '@/components/home/SecondaryCTA.vue'
import AboutSection         from '@/components/home/AboutSection.vue'
import FooterSection        from '@/components/home/FooterSection.vue'

const router = useRouter()

const heroSlides = [
  { image:'/hero1.jpg', title:'Bienestar integral', subtitle:'...', ctaText:'Comienza tu camino' },
  { image:'/hero2.jpg', title:'Conexión y apoyo', subtitle:'...', ctaText:'Únete ahora' },
  { image:'/hero3.jpg', title:'Crecimiento personal', subtitle:'...', ctaText:'Explora más' },
]

const whyItems = [ /* igual que antes */ ]
const services = [ /* igual que antes con image URLs */ ]
const testimonials = [ /* igual que antes */ ]

const aboutImage  = '/team-photo.jpg'
const aboutTitle  = 'Conócenos'
const aboutText   = 'Psicomorfosis es un centro dedicado a…'
const aboutValues = [ /* empatía, confidencialidad, excelencia */ ]

function goRegister() { router.push({ name:'register' }) }
function onSubscribe(email) { alert(`Gracias por suscribirte: ${email}`) }
</script>
