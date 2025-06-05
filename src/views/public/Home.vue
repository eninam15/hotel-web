<template>
  <HeroCarousel :slides="heroSlides" @cta="handleCtaClick" />

  <RoomsGrid :rooms="rooms" :loading="loadingRooms" />

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
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { habitacionService } from '@/services';
import HeroCarousel from "@/components/home/HeroCarousel.vue";
import WhyUsCards from "@/components/home/WhyUsCards.vue";
import ServicesGrid from "@/components/home/ServicesGrid.vue";
import RoomsGrid from "@/components/rooms/RoomsGrid.vue";
import TestimonialCarousel from "@/components/home/TestimonialCarousel.vue";
import SecondaryCTA from "@/components/home/SecondaryCTA.vue";
import AboutSection from "@/components/home/AboutSection.vue";
import FooterSection from "@/components/home/FooterSection.vue";

const router = useRouter();

// Estados reactivos
const rooms = ref([]);
const loadingRooms = ref(true);
const errorRooms = ref(null);

// Cargar habitaciones al montar el componente
onMounted(async () => {
  await loadRooms();
});

// Función para cargar habitaciones
async function loadRooms() {
  try {
    loadingRooms.value = true;
    errorRooms.value = null;
    
    const response = await habitacionService.getAllHabitaciones();
    
    // Transformar los datos de la API al formato esperado por el componente
    rooms.value = response.map(habitacion => ({
      id: habitacion.id,
      name: habitacion.nombre,
      image: habitacion.foto ? `/storage/${habitacion.foto}` : '/images/room-default.jpg',
      price: parseFloat(habitacion.precio),
      size: habitacion.size || 25, // Si no hay tamaño en la BD, usar valor por defecto
      capacity: habitacion.nro_adultos + habitacion.nro_ninos,
      adults: habitacion.nro_adultos,
      children: habitacion.nro_ninos,
      bedType: habitacion.tipo_habitacion,
      description: habitacion.descripcion || 'Habitación cómoda con todas las comodidades necesarias.',
      amenities: habitacion.amenidades || ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
      hotel: habitacion.hotel ? {
        id: habitacion.hotel.id,
        name: habitacion.hotel.nombre,
        city: habitacion.hotel.ciudad
      } : null,
      // Propiedades adicionales para la UI
      isPopular: Math.random() > 0.7, // Asignar aleatoriamente o basado en ranking
      isFavorite: false,
      isNew: checkIfNew(habitacion.created_at),
      // Disponibilidad (si viene en la respuesta)
      disponibilidades: habitacion.disponibilidades || [],
      ofertas: habitacion.ofertas || []
    }));
    
  } catch (error) {
    console.error('Error al cargar habitaciones:', error);
    errorRooms.value = 'No se pudieron cargar las habitaciones';
    
    // Mantener algunos datos de fallback si hay error
    rooms.value = getFallbackRooms();
  } finally {
    loadingRooms.value = false;
  }
}

// Función para verificar si una habitación es nueva (creada en los últimos 30 días)
function checkIfNew(createdAt) {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
}

// Datos de fallback en caso de error
function getFallbackRooms() {
  return [
    {
      id: 1,
      name: 'Habitación Estándar',
      image: '/images/room-standard.jpeg',
      price: 89.00,
      size: 25,
      capacity: 2,
      adults: 2,
      children: 0,
      bedType: 'Cama doble',
      description: 'Habitación acogedora con todas las comodidades necesarias para una estancia agradable.',
      amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
      isPopular: true,
      isFavorite: false,
      isNew: false
    }
  ];
}

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

// Método para refrescar habitaciones (útil para componentes padre)
function refreshRooms() {
  loadRooms();
}

// Exponer métodos para uso externo
defineExpose({
  refreshRooms
});
</script>