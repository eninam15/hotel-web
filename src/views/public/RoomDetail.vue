<!-- src/views/public/RoomDetail.vue -->
<template>
  <div class="room-detail-page">
    <!-- Hero section -->
    <div class="room-detail-hero position-relative mb-5">
      <div class="room-gallery">
        <div class="main-image-container">
          <img :src="room.image" :alt="room.name" class="main-image img-fluid" />
          <button @click="isGalleryOpen = true" class="view-all-photos btn btn-sm btn-light">
            <i class="bi bi-images me-1"></i> Ver todas las fotos
          </button>
        </div>
        <div class="thumbnail-row d-none d-md-flex">
          <div v-for="(image, index) in additionalImages" :key="index" class="thumbnail-container">
            <img :src="image" alt="Room view" class="thumbnail" @click="showFullImage(image)" />
          </div>
        </div>
      </div>
    </div>

    <div class="container mb-5">
      <div class="row">
        <!-- Room details column -->
        <div class="col-lg-8">
          <div class="room-header d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 class="room-title fw-bold mb-1">{{ room.name }}</h1>
              <div class="room-location d-flex align-items-center text-muted mb-2">
                <i class="bi bi-geo-alt me-1"></i>
                <span>Piso {{ room.floor }} • Vista {{ room.view }}</span>
              </div>
              <div class="room-rating d-flex align-items-center">
                <div class="stars me-2">
                  <i v-for="n in 5" :key="n" class="bi" :class="n <= room.rating ? 'bi-star-fill text-warning' : 'bi-star'"></i>
                </div>
                <span class="rating-value">{{ room.rating }}</span>
                <span class="rating-count text-muted">({{ room.reviewCount }} reseñas)</span>
              </div>
            </div>
            <div class="price-tag text-end">
              <div class="fs-3 fw-bold text-primary">{{ formatPrice(room.price) }}</div>
              <div class="text-muted">por noche</div>
            </div>
          </div>

          <div class="room-features mb-4">
            <div class="row g-3">
              <div class="col-6 col-md-3">
                <div class="feature-item text-center p-3 bg-light rounded-3">
                  <i class="bi bi-rulers fs-4 mb-2 d-block"></i>
                  <div class="feature-label small text-muted">Tamaño</div>
                  <div class="feature-value fw-semibold">{{ room.size }} m²</div>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="feature-item text-center p-3 bg-light rounded-3">
                  <i class="bi bi-people-fill fs-4 mb-2 d-block"></i>
                  <div class="feature-label small text-muted">Capacidad</div>
                  <div class="feature-value fw-semibold">{{ room.capacity }} personas</div>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="feature-item text-center p-3 bg-light rounded-3">
                  <i class="bi bi-door-open-fill fs-4 mb-2 d-block"></i>
                  <div class="feature-label small text-muted">Cama</div>
                  <div class="feature-value fw-semibold">{{ room.bedType }}</div>
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="feature-item text-center p-3 bg-light rounded-3">
                  <i class="bi bi-check-circle-fill fs-4 mb-2 d-block"></i>
                  <div class="feature-label small text-muted">Disponibilidad</div>
                  <div class="feature-value fw-semibold text-success">Disponible</div>
                </div>
              </div>
            </div>
          </div>

          <div class="room-description mb-4">
            <h2 class="section-title fw-bold mb-3">Acerca de esta habitación</h2>
            <div class="description-content">
              <p>{{ room.description }}</p>
              <p>Disfruta de esta moderna y elegante habitación diseñada para ofrecerte la máxima comodidad durante tu estancia. El espacio cuenta con todas las amenidades necesarias para que tu visita sea inolvidable.</p>
            </div>
          </div>

          <div class="room-amenities mb-4">
            <h2 class="section-title fw-bold mb-3">Lo que ofrece esta habitación</h2>
            <div class="row g-3">
              <div v-for="(amenity, index) in room.amenities" :key="index" class="col-6 col-md-4">
                <div class="d-flex align-items-center">
                  <i class="bi" :class="getAmenityIcon(amenity)"></i>
                  <span class="ms-2">{{ amenity }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="room-policies mb-4">
            <h2 class="section-title fw-bold mb-3">Políticas de la habitación</h2>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="policy-item">
                  <div class="fw-semibold mb-1"><i class="bi bi-clock me-2"></i>Check-in / Check-out</div>
                  <p class="text-muted mb-0">Check-in a partir de las 14:00h<br>Check-out hasta las 12:00h</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="policy-item">
                  <div class="fw-semibold mb-1"><i class="bi bi-cash me-2"></i>Política de cancelación</div>
                  <p class="text-muted mb-0">Cancelación gratuita hasta 48 horas antes de la fecha de llegada. Después de este período, se cobrará la primera noche.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="room-reviews">
            <h2 class="section-title fw-bold mb-3">Comentarios de huéspedes</h2>
            <div v-if="reviews.length" class="reviews-list">
              <div v-for="(review, index) in reviews" :key="index" class="review-item p-3 border-bottom">
                <div class="d-flex mb-2">
                  <img :src="review.userAvatar" alt="User" class="rounded-circle me-2" style="width: 40px; height: 40px; object-fit: cover;">
                  <div>
                    <div class="fw-semibold">{{ review.userName }}</div>
                    <div class="text-muted small">{{ review.date }}</div>
                  </div>
                  <div class="stars ms-auto">
                    <i v-for="n in 5" :key="n" class="bi" :class="n <= review.rating ? 'bi-star-fill text-warning' : 'bi-star'"></i>
                  </div>
                </div>
                <p class="mb-0">{{ review.comment }}</p>
              </div>
            </div>
            <div v-else class="text-center py-4">
              <p class="text-muted">No hay comentarios aún para esta habitación.</p>
            </div>
          </div>
        </div>

        <!-- Booking widget column -->
        <div class="col-lg-4">
          <div class="booking-widget card shadow-sm position-sticky" style="top: 20px;">
            <div class="card-body">
              <h3 class="card-title mb-3">Reservar esta habitación</h3>
              
              <div class="date-selection mb-3">
                <label class="form-label">Fechas de estancia</label>
                <div class="row g-2">
                  <div class="col">
                    <div class="input-group">
                      <span class="input-group-text bg-light"><i class="bi bi-calendar3"></i></span>
                      <input type="date" v-model="checkInDate" class="form-control" />
                    </div>
                  </div>
                  <div class="col">
                    <div class="input-group">
                      <span class="input-group-text bg-light"><i class="bi bi-calendar3"></i></span>
                      <input type="date" v-model="checkOutDate" class="form-control" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="guests-selection mb-3">
                <label class="form-label">Huéspedes</label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="bi bi-people"></i></span>
                  <select v-model="guestCount" class="form-select">
                    <option v-for="n in room.capacity" :key="n" :value="n">{{ n }} {{ n === 1 ? 'persona' : 'personas' }}</option>
                  </select>
                </div>
              </div>

              <div class="price-summary mb-3 p-3 bg-light rounded-3">
                <div class="d-flex justify-content-between mb-2">
                  <span>{{ formatPrice(room.price) }} x {{ nightCount }} noches</span>
                  <span>{{ formatPrice(room.price * nightCount) }}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                  <span>Impuestos y tasas</span>
                  <span>{{ formatPrice(getTaxAmount()) }}</span>
                </div>
                <div class="d-flex justify-content-between fw-bold pt-2 border-top mt-2">
                  <span>Total</span>
                  <span>{{ formatPrice(getTotalAmount()) }}</span>
                </div>
              </div>

              <button @click="proceedToBooking" class="btn btn-primary w-100 mb-2" :disabled="!isBookingFormValid">
                Reservar ahora aq
              </button>
              <button @click="addToFavorites" class="btn btn-outline-primary w-100">
                <i class="bi" :class="room.isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i> 
                {{ room.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Image gallery modal -->
    <div v-if="isGalleryOpen" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.9);">
      <div class="modal-dialog modal-fullscreen" role="document">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-header border-0">
            <h5 class="modal-title text-white">{{ room.name }} - Galería</h5>
            <button type="button" class="btn-close btn-close-white" @click="isGalleryOpen = false"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6 col-lg-4" v-for="(image, index) in [room.image, ...additionalImages]" :key="index">
                <img :src="image" alt="Room image" class="img-fluid rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// State
const room = ref({});
const additionalImages = ref([]);
const reviews = ref([]);
const isGalleryOpen = ref(false);
const selectedImage = ref(null);
const checkInDate = ref(getDefaultCheckInDate());
const checkOutDate = ref(getDefaultCheckOutDate());
const guestCount = ref(1);

const roomId = route.params.id;

// Computed
const nightCount = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 1;
  
  const start = new Date(checkInDate.value);
  const end = new Date(checkOutDate.value);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays || 1;
});

const isBookingFormValid = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return false;
  
  const start = new Date(checkInDate.value);
  const end = new Date(checkOutDate.value);
  
  return start < end && guestCount.value > 0 && guestCount.value <= room.value.capacity;
});

// Methods
function getDefaultCheckInDate() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return formatDateForInput(date);
}

function getDefaultCheckOutDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);
  return formatDateForInput(date);
}

function formatDateForInput(date) {
  return date.toISOString().split('T')[0];
}

function formatPrice(price) {
  return `$100`;
}

function getTaxAmount() {
  return room.value.price * nightCount.value * 0.10; // Assuming 10% tax
}

function getTotalAmount() {
  return room.value.price * nightCount.value + getTaxAmount();
}

function getAmenityIcon(amenity) {
  const icons = {
    'WiFi': 'bi-wifi',
    'TV': 'bi-tv',
    'Aire acondicionado': 'bi-thermometer-snow',
    'Minibar': 'bi-cup-straw',
    'Caja fuerte': 'bi-safe',
    'Baño privado': 'bi-droplet-fill',
    'Balcón': 'bi-door-open-fill',
    'Vista al mar': 'bi-water',
    'Desayuno incluido': 'bi-cup-hot',
    'Servicio de habitaciones': 'bi-bell',
    'Parking': 'bi-p-square-fill'
  };
  
  return icons[amenity] || 'bi-check-circle';
}

function showFullImage(image) {
  selectedImage.value = image;
  isGalleryOpen.value = true;
}

function addToFavorites() {
  room.value.isFavorite = !room.value.isFavorite;
  // Here you would call an API to add/remove from favorites
}

function proceedToBooking() {
  
  router.push({
    name: 'booking',
    query: {
      roomId: room.value.id,
      checkIn: checkInDate.value,
      checkOut: checkOutDate.value,
      guests: guestCount.value
    }
  });
}

// Lifecycle
onMounted(async () => {
  const roomId = parseInt(route.params.id);
  
  // In a real application, you would fetch this data from an API
  // For now, we'll simulate the fetch with a timeout
  setTimeout(() => {
    // Find the room from a mock database (you would get this from an API)
    const mockRooms = [
      {
        id: 1,
        name: 'Habitación Estándar',
        image: '/images/room-standard.jpeg',
        price: 89.00,
        size: 25,
        capacity: 2,
        bedType: 'Cama doble',
        floor: 2,
        view: 'Ciudad',
        description: 'Habitación acogedora con todas las comodidades necesarias para una estancia agradable. Incluye baño privado y vistas a la ciudad.',
        amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
        isPopular: true,
        isFavorite: false,
        rating: 4.5,
        reviewCount: 128
      },
      {
        id: 2,
        name: 'Habitación Deluxe',
        image: '/images/room-deluxe.jpeg',
        price: 129.00,
        size: 35,
        capacity: 2,
        bedType: 'Cama king',
        floor: 3,
        view: 'Ciudad',
        description: 'Habitación espaciosa con vistas panorámicas. Equipada con minibar, escritorio y zona de estar. Perfecta para viajeros de negocios y placer.',
        amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado'],
        isPopular: false,
        isFavorite: false,
        rating: 4.7,
        reviewCount: 95
      },
      {
        id: 3,
        name: 'Suite Junior',
        image: '/images/room-junior-suite.jpg',
        price: 159.00,
        size: 45,
        capacity: 3,
        bedType: 'Cama king + sofá cama',
        floor: 4,
        view: 'Jardín',
        description: 'Suite elegante con dormitorio y sala de estar separada. Ofrece un espacio perfecto para relajarse después de un día de turismo o negocios.',
        amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón'],
        isNew: true,
        isFavorite: false,
        rating: 4.8,
        reviewCount: 76
      },
      {
        id: 4,
        name: 'Suite Ejecutiva',
        image: '/images/room-executive-suite.jpg',
        price: 219.00,
        size: 60,
        capacity: 4,
        bedType: 'Cama king + 2 camas individuales',
        floor: 5,
        view: 'Mar',
        description: 'Amplia suite con dormitorio separado, sala de estar y comedor. Ideal para familias o estadías prolongadas. Incluye servicio de mayordomo.',
        amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón', 'Vista al mar', 'Desayuno incluido', 'Servicio de habitaciones'],
        isPopular: true,
        isFavorite: false,
        rating: 4.9,
        reviewCount: 112
      },
    ];
    
    const foundRoom = mockRooms.find(r => r.id === roomId);
    if (foundRoom) {
      room.value = foundRoom;
      
      // Mock additional images
      additionalImages.value = [
        `/images/room-detail-${roomId}-1.jpg`,
        `/images/room-detail-${roomId}-2.jpg`,
        `/images/room-detail-${roomId}-3.jpg`,
        `/images/room-detail-${roomId}-4.jpg`,
      ];
      
      // Mock reviews
      reviews.value = [
        {
          userName: 'Carlos Rodríguez',
          userAvatar: '/images/user-1.jpg',
          rating: 5,
          date: '10 de mayo, 2025',
          comment: 'Excelente habitación, muy cómoda y con todo lo necesario. El personal fue muy amable y atento. Sin duda volveré.'
        },
        {
          userName: 'María López',
          userAvatar: '/images/user-2.jpg',
          rating: 4,
          date: '28 de abril, 2025',
          comment: 'Muy buena habitación, amplia y luminosa. El único inconveniente fue el ruido de la calle, pero por lo demás todo perfecto.'
        },
        {
          userName: 'Juan Martínez',
          userAvatar: '/images/user-3.jpg',
          rating: 5,
          date: '15 de abril, 2025',
          comment: 'Una experiencia increíble. La habitación es tal como se muestra en las fotos, muy limpia y con una decoración exquisita.'
        }
      ];
    } else {
      // If room not found, redirect to rooms list
      router.push({ name: 'rooms' });
    }
  }, 300);
});
</script>

<style scoped>
.room-detail-hero {
  background-color: #f8f9fa;
  padding: 2rem 0;
}

.room-gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-image-container {
  position: relative;
  height: 450px;
  overflow: hidden;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.view-all-photos {
  position: absolute;
  bottom: 20px;
  right: 20px;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.thumbnail-row {
  display: flex;
  gap: 1rem;
}

.thumbnail-container {
  width: calc(25% - 0.75rem);
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.section-title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

.feature-item i {
  color: #6c757d;
}

@media (max-width: 767px) {
  .main-image-container {
    height: 300px;
  }
}
</style>