<template>
  <HeroCarousel :slides="heroSlides" @cta="handleCtaClick" />

  <RoomsGrid :rooms="rooms" />

  <!-- <ServicesGrid :services="services" /> -->

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
import WhyUsCards from "@/components/home/WhyUsCards.vue";
import ServicesGrid from "@/components/home/ServicesGrid.vue";
import RoomsGrid from "@/components/rooms/RoomsGrid.vue";
import TestimonialCarousel from "@/components/home/TestimonialCarousel.vue";
import SecondaryCTA from "@/components/home/SecondaryCTA.vue";
import AboutSection from "@/components/home/AboutSection.vue";
import FooterSection from "@/components/home/FooterSection.vue";

const router = useRouter();

// Datos de habitaciones para mostrar en la grid
const rooms = [
  {
    id: 1,
    name: 'Habitación Estándar',
    image: '/images/room-standard.jpeg',
    price: 89.00,
    size: 25,
    capacity: 2,
    bedType: 'Cama doble',
    description: 'Habitación acogedora con todas las comodidades necesarias para una estancia agradable. Incluye baño privado y vistas a la ciudad.',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
    isPopular: true,
    isFavorite: false
  },
  {
    id: 2,
    name: 'Habitación Deluxe',
    image: '/images/room-deluxe.jpeg',
    price: 129.00,
    size: 35,
    capacity: 2,
    bedType: 'Cama king',
    description: 'Habitación espaciosa con vistas panorámicas. Equipada con minibar, escritorio y zona de estar. Perfecta para viajeros de negocios y placer.',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado'],
    isPopular: false,
    isFavorite: false
  },
  {
    id: 3,
    name: 'Suite Junior',
    image: '/images/room-junior-suite.jpg',
    price: 159.00,
    size: 45,
    capacity: 3,
    bedType: 'Cama king + sofá cama',
    description: 'Suite elegante con dormitorio y sala de estar separada. Ofrece un espacio perfecto para relajarse después de un día de turismo o negocios.',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón'],
    isNew: true,
    isFavorite: false
  },
  {
    id: 4,
    name: 'Suite Ejecutiva',
    image: '/images/room-executive-suite.jpg',
    price: 219.00,
    size: 60,
    capacity: 4,
    bedType: 'Cama king + 2 camas individuales',
    description: 'Amplia suite con dormitorio separado, sala de estar y comedor. Ideal para familias o estadías prolongadas. Incluye servicio de mayordomo.',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón', 'Vista al mar', 'Desayuno incluido', 'Servicio de habitaciones'],
    isPopular: true,
    isFavorite: false
  },
  {
    id: 5,
    name: 'Habitación Familiar',
    image: '/images/room-family.jpg',
    price: 189.00,
    size: 50,
    capacity: 4,
    bedType: '2 camas dobles',
    description: 'Habitación espaciosa diseñada para familias. Incluye zona de juegos para niños y todas las comodidades para una estancia confortable.',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Baño privado', 'Parking'],
    isNew: false,
    isFavorite: false
  },
  {
    id: 6,
    name: 'Habitación Accesible',
    image: '/images/room-accessible.jpg',
    price: 89.00,
    size: 30,
    capacity: 2,
    bedType: 'Cama doble',
    description: 'Habitación diseñada para ofrecer accesibilidad total. Cuenta con baño adaptado y todas las facilidades para una estancia cómoda.',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño adaptado', 'Parking'],
    isNew: false,
    isFavorite: false
  }
];

const heroSlides = [
  {
    image: "/images/hotel-lobby.jpg",
    title: "Bienvenido a Hotel Paraíso",
    subtitle: "Disfruta de una experiencia única en un entorno de lujo y confort",
    //ctaText: "Reserva ahora",
    //btnVariant: "btn-primary" 
  },
  {
    image: "/images/hotel-pool.jpg",
    title: "Relájate y disfruta",
    subtitle: "Instalaciones de primera clase para una estancia inolvidable",
    //ctaText: "Descubre más",
    alignment: "text-end",
    //btnVariant: "btn-light"
  },
  {
    image: "/images/hotel-restaurant.jpg",
    title: "Experiencia gastronómica",
    subtitle: "Sabores exquisitos en nuestros restaurantes de clase mundial",
    //ctaText: "Ver menús",
    alignment: "text-start",
    //btnVariant: "btn-outline-light"
  },
  {
    image: "/images/hotel-spa.jpg",
    title: "Relájate y rejuvenece",
    subtitle: "Disfruta de nuestros servicios de spa y bienestar",
    //ctaText: "Ver tratamientos",
    alignment: "text-center",
    //btnVariant: "btn-secondary"
  }
];  

// Datos para la sección de testimonios
const testimonials = [
  {
    name: "Juan Pérez",
    image: "/images/testimonial-juan.jpeg",
    text: "Una experiencia inolvidable. El servicio fue excelente y las instalaciones de primera clase.",
    rating: 5
  },
  {
    name: "María López",
    image: "/images/testimonial-maria.jpg",
    text: "El spa fue increíble, realmente me ayudó a relajarme. Definitivamente volveré.",
    rating: 4.5
  },
  {
    name: "Carlos García",
    image: "/images/testimonial-carlos.jpg",
    text: "La comida en el restaurante fue espectacular. Sabores únicos y un ambiente acogedor.",
    rating: 5
  }
];

// Datos para la sección de CTA secundaria
const secondaryCtaTitle = "¿Listo para tu próxima aventura?";
const secondaryCtaSubtitle = "Reserva ahora y obtén un descuento exclusivo.";
const secondaryCtaText = "Reserva ahora";

// Datos para la sección "Sobre nosotros"
const aboutImage = "/images/about-us.jpg";
const aboutTitle = "Acerca de nosotros";
const aboutText = "En Hotel Paraíso, nos esforzamos por ofrecer una experiencia única y memorable para cada uno de nuestros huéspedes.";
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