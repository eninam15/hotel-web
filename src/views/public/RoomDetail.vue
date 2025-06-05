<style scoped>
/* Hero Section */
.room-detail-hero {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 3rem 0;
}

.room-gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.main-image-container {
  position: relative;
  height: 500px;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  transition: transform 0.3s ease;
}

.main-image-container:hover {
  transform: translateY(-5px);
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
}

.room-badge .badge {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 50px;
}

/* Room Header */
.room-header {
  padding: 2rem 0;
}

.room-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.room-location i {
  font-size: 1.1rem;
}

.price-section {
  text-align: right;
}

.price-display {
  margin-bottom: 0.5rem;
}

.price-amount {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.price-period {
  font-size: 1.1rem;
  color: #6c757d;
  font-weight: 500;
}

.price-note {
  color: #28a745;
  font-weight: 500;
}

/* Feature Cards */
.room-features {
  padding: 2rem 0;
}

.feature-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  border-color: #007bff;
}

.feature-icon i {
  font-size: 2rem;
  color: #007bff;
}

.feature-value {
  font-size: 1.1rem;
  color: #2c3e50;
}

/* Content Sections */
.content-section {
  padding: 2rem 0;
  border-bottom: 1px solid #e9ecef;
}

.content-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.section-title i {
  font-size: 1.3rem;
}

.description-content .lead {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #495057;
}

/* Amenities Grid */
.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.amenity-item:hover {
  border-color: #007bff;
  transform: translateX(5px);
}

.amenity-item i {
  font-size: 1.2rem;
  color: #007bff;
  margin-right: 0.75rem;
  min-width: 20px;
}

/* Policy Cards */
.policy-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.policy-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.policy-header {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.policy-content {
  color: #6c757d;
}

/* Booking Widget */
.booking-widget {
  padding: 0 1rem;
}

.booking-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  overflow: hidden;
}

.booking-header {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.booking-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.booking-price .price-amount {
  font-size: 2rem;
  font-weight: 700;
}

.booking-price .price-period {
  font-size: 0.9rem;
  opacity: 0.9;
}

.booking-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
}

.form-label i {
  color: #007bff;
}

.date-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.date-input-group {
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.form-control, .form-select {
  border-radius: 12px;
  border: 2px solid #e9ecef;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus, .form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
}

/* Price Breakdown */
.price-breakdown {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #6c757d;
}

.price-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c3e50;
  padding-top: 0.75rem;
  border-top: 2px solid #dee2e6;
  margin-top: 0.75rem;
}

/* Booking Actions */
.booking-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-book {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-book:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40,167,69,0.3);
}

.btn-book:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-favorite {
  background: white;
  color: #007bff;
  border: 2px solid #007bff;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-favorite:hover {
  background: #007bff;
  color: white;
  transform: translateY(-2px);
}

/* Reviews Section */
.review-item {
  background: white;
  border-radius: 12px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.review-item:hover {
  transform: translateX(10px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* Responsive Design */
@media (max-width: 992px) {
  .room-title {
    font-size: 2rem;
  }
  
  .price-amount {
    font-size: 2rem;
  }
  
  .date-inputs {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-image-container {
    height: 300px;
    border-radius: 15px;
  }
  
  .room-header {
    text-align: center;
  }
  
  .price-section {
    text-align: center;
    margin-top: 1rem;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .room-detail-hero {
    padding: 1.5rem 0;
  }
  
  .booking-header,
  .booking-form {
    padding: 1.5rem;
  }
  
  .room-title {
    font-size: 1.75rem;
  }
}

/* Loading Animation */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Future: Thumbnail styles (commented out)
.thumbnail-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.thumbnail-container {
  width: calc(25% - 0.75rem);
  height: 120px;
  border-radius: 12px;
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
*/
</style><!-- src/views/public/RoomDetail.vue -->
<template>
  <div class="room-detail-page">
    <!-- Loading state -->
    <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="container mt-5">
      <div class="alert alert-danger text-center">
        <h4>Error al cargar la habitación</h4>
        <p>{{ error }}</p>
        <button @click="loadRoomData" class="btn btn-primary">Reintentar</button>
      </div>
    </div>

    <!-- Room content -->
    <div v-else-if="room.id">
      <!-- Hero section -->
      <div class="room-detail-hero position-relative mb-5">
        <div class="room-gallery">
          <div class="main-image-container">
            <img :src="roomImage" :alt="room.name" class="main-image img-fluid" />
            <div class="image-overlay">
              <div class="room-badge" v-if="room.isNew">
                <span class="badge bg-success">Nuevo</span>
              </div>
              <div class="room-badge" v-if="room.isPopular">
                <span class="badge bg-warning text-dark">Popular</span>
              </div>
            </div>
          </div>
          <!-- Future: Multiple images gallery
          <div class="thumbnail-row d-none d-md-flex">
            <div v-for="(image, index) in additionalImages" :key="index" class="thumbnail-container">
              <img :src="image" alt="Room view" class="thumbnail" @click="showFullImage(image)" />
            </div>
          </div>
          -->
        </div>
      </div>

      <div class="container mb-5">
        <div class="row">
          <!-- Room details column -->
          <div class="col-lg-8">
            <div class="room-header mb-4">
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-3">
                <div class="room-info">
                  <h1 class="room-title fw-bold mb-2">{{ room.name }}</h1>
                  <div class="room-location d-flex align-items-center text-muted mb-3">
                    <i class="bi bi-geo-alt-fill me-2 text-primary"></i>
                    <span class="me-3">{{ room.hotel?.nombre }}</span>
                    <i class="bi bi-building me-1"></i>
                    <span>{{ room.hotel?.ciudad }}</span>
                  </div>
                  <div class="room-rating d-flex align-items-center">
                    <div class="stars me-2">
                      <i v-for="n in 5" :key="n" class="bi" :class="n <= room.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"></i>
                    </div>
                    <span class="rating-value fw-semibold me-1">{{ room.rating }}</span>
                    <span class="rating-count text-muted">({{ room.reviewCount }} reseñas)</span>
                  </div>
                </div>
                <div class="price-section text-end">
                  <div class="price-display">
                    <span class="price-amount">{{ formatPrice(room.price) }}</span>
                    <span class="price-period">/ noche</span>
                  </div>
                  <div class="price-note text-muted small">Impuestos incluidos</div>
                </div>
              </div>
            </div>

            <div class="room-features mb-5">
              <div class="row g-4">
                <div class="col-6 col-lg-3">
                  <div class="feature-card text-center p-4 h-100">
                    <div class="feature-icon mb-3">
                      <i class="bi bi-rulers text-primary"></i>
                    </div>
                    <div class="feature-label text-muted small mb-1">Tamaño</div>
                    <div class="feature-value fw-bold">{{ room.size || '25' }} m²</div>
                  </div>
                </div>
                <div class="col-6 col-lg-3">
                  <div class="feature-card text-center p-4 h-100">
                    <div class="feature-icon mb-3">
                      <i class="bi bi-people-fill text-primary"></i>
                    </div>
                    <div class="feature-label text-muted small mb-1">Huéspedes</div>
                    <div class="feature-value fw-bold">{{ room.capacity }} personas</div>
                  </div>
                </div>
                <div class="col-6 col-lg-3">
                  <div class="feature-card text-center p-4 h-100">
                    <div class="feature-icon mb-3">
                      <i class="bi bi-door-open-fill text-primary"></i>
                    </div>
                    <div class="feature-label text-muted small mb-1">Tipo de cama</div>
                    <div class="feature-value fw-bold">{{ room.bedType }}</div>
                  </div>
                </div>
                <div class="col-6 col-lg-3">
                  <div class="feature-card text-center p-4 h-100">
                    <div class="feature-icon mb-3">
                      <i class="bi bi-check-circle-fill" :class="availabilityStatus.class"></i>
                    </div>
                    <div class="feature-label text-muted small mb-1">Estado</div>
                    <div class="feature-value fw-bold" :class="availabilityStatus.class">
                      {{ availabilityStatus.text }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-section mb-5">
              <h2 class="section-title mb-4">
                <i class="bi bi-info-circle me-2 text-primary"></i>
                Acerca de esta habitación
              </h2>
              <div class="description-content">
                <p class="lead mb-3">{{ room.description || 'Habitación cómoda con todas las amenidades necesarias para una estadía agradable.' }}</p>
                <p class="text-muted" v-if="room.hotel">
                  Ubicado en <strong>{{ room.hotel.nombre }}</strong>, este espacio ha sido diseñado para ofrecerte la máxima comodidad durante tu estancia en {{ room.hotel.ciudad }}.
                </p>
              </div>
            </div>

            <div class="content-section mb-5">
              <h2 class="section-title mb-4">
                <i class="bi bi-stars me-2 text-primary"></i>
                Servicios y comodidades
              </h2>
              <div class="amenities-grid">
                <div v-for="(amenity, index) in room.amenities" :key="index" class="amenity-item">
                  <i class="bi" :class="getAmenityIcon(amenity)"></i>
                  <span>{{ amenity }}</span>
                </div>
              </div>
            </div>

            <div class="content-section mb-5">
              <h2 class="section-title mb-4">
                <i class="bi bi-clipboard-check me-2 text-primary"></i>
                Políticas de la habitación
              </h2>
              <div class="row g-4">
                <div class="col-md-6">
                  <div class="policy-card p-4 h-100">
                    <div class="policy-header mb-3">
                      <i class="bi bi-clock text-primary me-2"></i>
                      <span class="fw-semibold">Horarios</span>
                    </div>
                    <div class="policy-content">
                      <div class="mb-2">
                        <small class="text-muted">Check-in:</small>
                        <span class="fw-medium ms-2">{{ formatTime(room.hotel?.hr_entrada) || '14:00' }}</span>
                      </div>
                      <div>
                        <small class="text-muted">Check-out:</small>
                        <span class="fw-medium ms-2">{{ formatTime(room.hotel?.hr_salida) || '12:00' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="policy-card p-4 h-100">
                    <div class="policy-header mb-3">
                      <i class="bi bi-shield-check text-primary me-2"></i>
                      <span class="fw-semibold">Cancelación</span>
                    </div>
                    <div class="policy-content">
                      <p class="mb-0 small text-muted">
                        Cancelación gratuita hasta <strong>48 horas</strong> antes de la fecha de llegada.
                      </p>
                    </div>
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
            <div class="booking-widget position-sticky" style="top: 20px;">
              <div class="booking-card">
                <div class="booking-header">
                  <h3 class="booking-title">Reservar habitación</h3>
                  <div class="booking-price">
                    <span class="price-amount">{{ formatPrice(room.price) }}</span>
                    <span class="price-period">/ noche</span>
                  </div>
                </div>
                
                <div class="booking-form">
                  <div class="form-section">
                    <label class="form-label">
                      <i class="bi bi-calendar3 me-2"></i>
                      Fechas de estancia
                    </label>
                    <div class="date-inputs">
                      <div class="date-input-group">
                        <label class="date-label">Entrada</label>
                        <input type="date" v-model="checkInDate" class="form-control" :min="minDate" />
                      </div>
                      <div class="date-input-group">
                        <label class="date-label">Salida</label>
                        <input type="date" v-model="checkOutDate" class="form-control" :min="checkInDate" />
                      </div>
                    </div>
                  </div>

                  <div class="form-section">
                    <label class="form-label">
                      <i class="bi bi-people me-2"></i>
                      Huéspedes
                    </label>
                    <select v-model="guestCount" class="form-select">
                      <option v-for="n in room.capacity" :key="n" :value="n">
                        {{ n }} {{ n === 1 ? 'huésped' : 'huéspedes' }}
                      </option>
                    </select>
                  </div>

                  <div class="price-breakdown">
                    <div class="price-row">
                      <span>{{ formatPrice(room.price) }} × {{ nightCount }} noches</span>
                      <span>{{ formatPrice(room.price * nightCount) }}</span>
                    </div>
                    <div class="price-row">
                      <span>Impuestos y tasas</span>
                      <span>{{ formatPrice(getTaxAmount()) }}</span>
                    </div>
                    <div class="price-total">
                      <span>Total</span>
                      <span>{{ formatPrice(getTotalAmount()) }}</span>
                    </div>
                  </div>

                  <div class="booking-actions">
                    <button @click="proceedToBooking" class="btn-book" :disabled="!isBookingFormValid">
                      <i class="bi bi-calendar-check me-2"></i>
                      Reservar ahora
                    </button>
                    <button @click="addToFavorites" class="btn-favorite">
                      <i class="bi" :class="room.isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i> 
                      {{ room.isFavorite ? 'En favoritos' : 'Añadir a favoritos' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Future: Image gallery modal
      <div v-if="isGalleryOpen" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.9);">
        <div class="modal-dialog modal-fullscreen" role="document">
          <div class="modal-content bg-transparent border-0">
            <div class="modal-header border-0">
              <h5 class="modal-title text-white">{{ room.name }} - Galería</h5>
              <button type="button" class="btn-close btn-close-white" @click="isGalleryOpen = false"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6 col-lg-4" v-for="(image, index) in [roomImage, ...additionalImages]" :key="index">
                  <img :src="image" alt="Room image" class="img-fluid rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { habitacionService } from '@/services';

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
const loading = ref(true);
const error = ref(null);

const roomId = route.params.id;

// Computed
const roomImage = computed(() => {
  if (room.value.foto) {
    return `/storage/${room.value.foto}`;
  }
  return room.value.foto_url || '/images/room-default.jpg';
});

const minDate = computed(() => {
  return formatDateForInput(new Date());
});

const availabilityStatus = computed(() => {
  if (room.value.disponibilidades && room.value.disponibilidades.length > 0) {
    return {
      text: 'Disponible',
      class: 'text-success'
    };
  }
  return {
    text: 'Consultar',
    class: 'text-warning'
  };
});

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
async function loadRoomData() {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await habitacionService.getHabitacion(roomId);
    
    // Transformar los datos de la API al formato esperado por el componente
    room.value = {
      id: response.id,
      name: response.nombre,
      price: parseFloat(response.precio),
      size: 25, // Campo no existe en BD, usar valor por defecto
      capacity: response.nro_adultos + response.nro_ninos,
      adults: response.nro_adultos,
      children: response.nro_ninos,
      bedType: response.tipo_habitacion,
      description: response.descripcion,
      foto: response.foto,
      foto_url: response.foto_url,
      hotel: response.hotel,
      disponibilidades: response.disponibilidades || [],
      ofertas: response.ofertas || [],
      
      // Campos adicionales para la UI (valores por defecto)
      amenities: getDefaultAmenities(),
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10,
      isFavorite: false,
      isPopular: Math.random() > 0.7,
      isNew: checkIfNew(response.created_at)
    };
    
    // Simular imágenes adicionales
    additionalImages.value = generateAdditionalImages();
    
    // Simular reseñas
    reviews.value = generateMockReviews();
    
  } catch (err) {
    console.error('Error al cargar habitación:', err);
    error.value = err.message || 'Error al cargar la habitación';
  } finally {
    loading.value = false;
  }
}

function getDefaultAmenities() {
  return ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado', 'Servicio de habitaciones'];
}

function checkIfNew(createdAt) {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
}

function generateAdditionalImages() {
  return [
    '/images/room-detail-1.jpg',
    '/images/room-detail-2.jpg',
    '/images/room-detail-3.jpg',
    '/images/room-detail-4.jpg'
  ];
}

function generateMockReviews() {
  return [
    {
      userName: 'Carlos Rodríguez',
      userAvatar: '/images/user-1.jpg',
      rating: 5,
      date: '10 de mayo, 2025',
      comment: 'Excelente habitación, muy cómoda y con todo lo necesario.'
    },
    {
      userName: 'María López',
      userAvatar: '/images/user-2.jpg',
      rating: 4,
      date: '28 de abril, 2025',
      comment: 'Muy buena habitación, amplia y luminosa.'
    }
  ];
}

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
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB'
  }).format(price);
}

function formatTime(time) {
  if (!time) return null;
  return time.substring(0, 5); // HH:MM
}

function getTaxAmount() {
  return room.value.price * nightCount.value * 0.10; // 10% impuestos
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
  // Aquí llamarías a una API para agregar/quitar de favoritos
}

function proceedToBooking() {
  router.push({
    name: 'booking',
    query: {
      roomId: room.value.id,
      checkIn: checkInDate.value,
      checkOut: checkOutDate.value,
      guests: guestCount.value,
      price: room.value.price
    }
  });
}

// Lifecycle
onMounted(() => {
  loadRoomData();
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