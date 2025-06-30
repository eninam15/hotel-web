<template>
  <HeroCarousel :slides="heroSlides" @cta="handleCtaClick" />

  <RoomsGrid />

  <AboutSection
    :image="aboutImage"
    :title="aboutTitle"
    :text="aboutText"
    :values="aboutValues"
  />

  <TestimonialCarousel :testimonials="testimonials" />

  <FooterSection @subscribe="onSubscribe" />
</template>

<script setup>
import { useRouter } from "vue-router";
import HeroCarousel from "@/components/home/HeroCarousel.vue";
import RoomsGrid from "@/components/rooms/RoomsGrid.vue";
import TestimonialCarousel from "@/components/home/TestimonialCarousel.vue";
import AboutSection from "@/components/home/AboutSection.vue";
import FooterSection from "@/components/home/FooterSection.vue";

const router = useRouter();

const heroSlides = [
  {
    image: "/images/hotel-lobby.jpg",
    title: "Bienvenido a Hotel Paraíso",
    subtitle: "Disfruta de una experiencia única en un entorno de lujo y confort",
  },
  {
    image: "/images/hotel-pool.jpg",
    title: "Relájate y disfruta",
    subtitle: "Instalaciones de primera clase para una estancia inolvidable",
    alignment: "text-end",
  },
  {
    image: "/images/hotel-restaurant.jpg",
    title: "Experiencia gastronómica",
    subtitle: "Sabores exquisitos en nuestros restaurantes de clase mundial",
    alignment: "text-start",
  },
  {
    image: "/images/hotel-spa.jpg",
    title: "Relájate y rejuvenece",
    subtitle: "Disfruta de nuestros servicios de spa y bienestar",
    alignment: "text-center",
  }
];  

// Datos para la sección de testimonios
const testimonials = [
  {
    name: "Sucursal 1",
    image: "/images/WhatsApp Image 2025-05-30 at 19.46.20.jpeg",
    text: "Dir: Villa Caluyo D #784 Entre Calle 5 y 6.",
    rating: 5
  },
  {
    name: "Sucursal 2",
    image: "/images/WhatsApp Image 2025-05-30 at 19.45.49.jpeg",
    text: "Zona Cruce Villa Adela, Av. Ladislao Cabrera, calle 1 N.º 2094 .",
    rating: 4.5
  },
  {
    name: "Orlando Quispe (propietario)",
    image: "/images/WhatsApp Image 2025-05-30 at 19.41.13.jpeg",
    text: "comunicate con los numeros en pantalla 70165207-65138908.",
    rating: 8
  }
];

// Datos para la sección "Sobre nosotros"
const aboutImage = "/images/about.jpeg";
const aboutTitle = "Acerca de nosotros";
const aboutText = "En el HOSTAL BERNETT, ofrecemos un servicio de calidad, accesible y disponible las 24 horas en El Alto en nuestras dos sucursales con parqueo gratis, con atención respetuosa y culturalmente inclusiva, enfocada en el bienestar del huésped, y con proyección de crecimiento mediante nuevas sucursales.";
const aboutValues = [
  { icon: "fa-solid fa-star", text: "Calidad excepcional" },
  { icon: "fa-solid fa-heart", text: "Atención personalizada" },
  { icon: "fa-solid fa-leaf", text: "Sostenibilidad" }
];

// Métodos
function handleCtaClick(slide) {
  if (slide.ctaText === "Reserva ahora") {
    goRegister();
  } else if (slide.ctaText === "Descubre más") {
    router.push("/services");
  } else if (slide.ctaText === "Ver menús") {
    router.push("/restaurant");
  } else if (slide.ctaText === "Ver tratamientos") {
    router.push("/spa");
  }
}

function goRegister() {
  router.push("/register");
}

function onSubscribe(email) {
  console.log(`Usuario suscrito con el correo: ${email}`);
}
</script>