<!-- src/views/user/Booking.vue -->
<template>
  <div class="booking-page py-5">
    <div class="container">
      <!-- Loading state -->
      <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 400px;">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="row justify-content-center">
        <div class="col-lg-8">
          <div class="alert alert-danger text-center">
            <h4>Error al cargar los datos</h4>
            <p>{{ error }}</p>
            <button @click="loadRoomData" class="btn btn-primary">Reintentar</button>
          </div>
        </div>
      </div>

      <!-- Booking content -->
      <div v-else class="row justify-content-center">
        <div class="col-lg-10">
          <div class="card shadow-sm mb-4">
            <div class="card-body p-4">
              <h1 class="card-title fw-bold mb-4">Completar tu reserva</h1>

              <!-- Progress steps -->
              <div class="booking-progress mb-5">
                <div class="progress mb-3">
                  <div
                    class="progress-bar bg-primary"
                    role="progressbar"
                    :style="{ width: progressPercentage + '%' }"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <div class="d-flex justify-content-between">
                  <div 
                    class="progress-step" 
                    :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }"
                  >
                    <div class="step-number">1</div>
                    <div class="step-label">Detalles</div>
                  </div>
                  <div 
                    class="progress-step" 
                    :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }"
                  >
                    <div class="step-number">2</div>
                    <div class="step-label">Pago</div>
                  </div>
                  <div 
                    class="progress-step" 
                    :class="{ 'active': currentStep >= 3, 'completed': currentStep > 3 }"
                  >
                    <div class="step-number">3</div>
                    <div class="step-label">Confirmación</div>
                  </div>
                </div>
              </div>

              <!-- Step 1: Reservation Details -->
              <div v-if="currentStep === 1" class="booking-step-content">
                <div class="row">
                  <div class="col-md-7">
                    <h2 class="h4 mb-4">Información de reserva</h2>
                    
                    <div class="reservation-summary p-3 mb-4 bg-light rounded">
                      <div class="d-flex mb-3">
                        <img 
                          :src="roomImage" 
                          :alt="room.name" 
                          class="img-thumbnail me-3" 
                          style="width: 100px; height: 100px; object-fit: cover;"
                        >
                        <div>
                          <h3 class="h5 mb-1">{{ room.name }}</h3>
                          <div class="small text-muted mb-1">
                            <i class="bi bi-geo-alt me-1"></i> 
                            {{ room.hotel?.nombre }} • {{ room.hotel?.ciudad }}
                          </div>
                          <div class="small text-muted mb-1">
                            <i class="bi bi-door-open me-1"></i>
                            {{ room.bedType }} • {{ room.capacity }} huéspedes máx.
                          </div>
                          <div class="stars">
                            <i 
                              v-for="n in 5" 
                              :key="n" 
                              class="bi" 
                              :class="n <= room.rating ? 'bi-star-fill text-warning' : 'bi-star'"
                            ></i>
                            <span class="small text-muted ms-2">({{ room.reviewCount }} reseñas)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div class="reservation-dates mb-3">
                        <div class="row g-3">
                          <div class="col-6">
                            <div class="date-card p-2 border rounded text-center">
                              <div class="small text-muted">Check-in</div>
                              <div class="fw-bold">{{ formatDisplayDate(bookingDetails.checkIn) }}</div>
                              <div class="small">{{ formatTime(room.hotel?.hr_entrada) || '14:00' }}</div>
                            </div>
                          </div>
                          <div class="col-6">
                            <div class="date-card p-2 border rounded text-center">
                              <div class="small text-muted">Check-out</div>
                              <div class="fw-bold">{{ formatDisplayDate(bookingDetails.checkOut) }}</div>
                              <div class="small">{{ formatTime(room.hotel?.hr_salida) || '12:00' }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="reservation-details">
                        <div class="d-flex justify-content-between mb-2">
                          <div>Duración de la estancia:</div>
                          <div class="fw-semibold">{{ nightCount }} noche{{ nightCount > 1 ? 's' : '' }}</div>
                        </div>
                        <div class="d-flex justify-content-between">
                          <div>Huéspedes:</div>
                          <div class="fw-semibold">{{ bookingDetails.guests }} persona{{ bookingDetails.guests > 1 ? 's' : '' }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <h2 class="h4 mb-3">Información del huésped</h2>
                    <form @submit.prevent="validateStep1" class="guest-form">
                      <div class="row g-3 mb-3">
                        <div class="col-md-6">
                          <label for="firstName" class="form-label">Nombre*</label>
                          <input 
                            type="text" 
                            id="firstName" 
                            v-model="guestInfo.firstName" 
                            class="form-control" 
                            :class="{ 'is-invalid': validationErrors.firstName }"
                            required
                          >
                          <div class="invalid-feedback">{{ validationErrors.firstName }}</div>
                        </div>
                        <div class="col-md-6">
                          <label for="lastName" class="form-label">Apellidos*</label>
                          <input 
                            type="text" 
                            id="lastName" 
                            v-model="guestInfo.lastName" 
                            class="form-control"
                            :class="{ 'is-invalid': validationErrors.lastName }" 
                            required
                          >
                          <div class="invalid-feedback">{{ validationErrors.lastName }}</div>
                        </div>
                      </div>
                      
                      <div class="mb-3">
                        <label for="email" class="form-label">Email*</label>
                        <input 
                          type="email" 
                          id="email" 
                          v-model="guestInfo.email" 
                          class="form-control"
                          :class="{ 'is-invalid': validationErrors.email }" 
                          required
                        >
                        <div class="invalid-feedback">{{ validationErrors.email }}</div>
                      </div>
                      
                      <div class="mb-3">
                        <label for="phone" class="form-label">Teléfono*</label>
                        <input 
                          type="tel" 
                          id="phone" 
                          v-model="guestInfo.phone" 
                          class="form-control"
                          :class="{ 'is-invalid': validationErrors.phone }" 
                          required
                        >
                        <div class="invalid-feedback">{{ validationErrors.phone }}</div>
                      </div>
                      
                      <div class="mb-3">
                        <label for="specialRequests" class="form-label">Solicitudes especiales (opcional)</label>
                        <textarea 
                          id="specialRequests" 
                          v-model="guestInfo.specialRequests" 
                          class="form-control" 
                          rows="3"
                        ></textarea>
                        <div class="form-text">Indique cualquier solicitud especial (sujeta a disponibilidad)</div>
                      </div>
                      
                      <div class="mb-3 form-check">
                        <input 
                          type="checkbox" 
                          class="form-check-input" 
                          id="termsCheck" 
                          v-model="guestInfo.termsAccepted"
                          :class="{ 'is-invalid': validationErrors.termsAccepted }"
                          required
                        >
                        <label class="form-check-label" for="termsCheck">
                          He leído y acepto los <a href="#" @click.prevent="showTerms">términos y condiciones</a>*
                        </label>
                        <div class="invalid-feedback">{{ validationErrors.termsAccepted }}</div>
                      </div>
                      
                      <div class="d-flex justify-content-end mt-4">
                        <button type="button" @click="goBack" class="btn btn-outline-secondary me-2">
                          Volver
                        </button>
                        <button type="submit" class="btn btn-primary px-4">
                          Continuar al pago
                        </button>
                      </div>
                    </form>
                  </div>
                  
                  <div class="col-md-5">
                    <div class="price-summary card sticky-top" style="top: 20px">
                      <div class="card-header bg-primary text-white">
                        <h3 class="h5 mb-0">Resumen de precios</h3>
                      </div>
                      <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                          <span>{{ formatPrice(room.price) }} x {{ nightCount }} noches</span>
                          <span>{{ formatPrice(room.price * nightCount) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                          <span>Impuestos y tasas (10%)</span>
                          <span>{{ formatPrice(getTaxAmount()) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                          <span>Limpieza</span>
                          <span>{{ formatPrice(25) }}</span>
                        </div>
                        <div class="d-flex justify-content-between fw-bold pt-2 border-top mt-2">
                          <span>Total</span>
                          <span>{{ formatPrice(getTotalAmount()) }}</span>
                        </div>
                      </div>
                      <div class="card-footer bg-light">
                        <div class="cancellation-policy small">
                          <i class="bi bi-info-circle me-1"></i>
                          <strong>Política de cancelación:</strong> Cancelación gratuita hasta 48 horas antes de la fecha de llegada.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Payment -->
              <div v-else-if="currentStep === 2" class="booking-step-content">
                <div class="row">
                  <div class="col-md-7">
                    <h2 class="h4 mb-4">Método de pago</h2>
                    
                    <div class="payment-methods mb-4">
                      <div class="payment-method-card selected">
                        <div class="d-flex align-items-center mb-3">
                          <i class="bi bi-qr-code me-3 text-primary" style="font-size: 2rem;"></i>
                          <div>
                            <h3 class="h5 mb-1">Pago con QR</h3>
                            <p class="text-muted mb-0">Escanea el código QR con tu aplicación bancaria</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- QR Payment Display - Mostrar directamente -->
                    <div class="qr-payment-direct">
                      <div class="alert alert-info" role="alert">
                        <i class="bi bi-info-circle me-2"></i>
                        Escanea el código QR para completar tu pago de forma segura.
                      </div>
                    
                      <div class="qr-container text-center p-4 mb-4">
                        <h3 class="h5 mb-3">Escanea este código QR para pagar</h3>
                        
                        <!-- QR Code image example -->
                        <div class="qr-code-display mx-auto mb-3">
                          <img 
                            src="/images/qr-payment-example.png" 
                            alt="Código QR de pago"
                            class="qr-code-image"
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                          >
                          <!-- Fallback QR icon if image not found -->
                          <div class="qr-code-placeholder" style="display: none;">
                            <i class="bi bi-qr-code" style="font-size: 12rem; color: #333;"></i>
                          </div>
                        </div>
                        
                        <div class="payment-details-card p-3 bg-light rounded mb-3">
                          <div class="row g-2 small">
                            <div class="col-6 text-start">
                              <strong>Monto:</strong>
                            </div>
                            <div class="col-6 text-end">
                              {{ formatPrice(getTotalAmount()) }}
                            </div>
                            <div class="col-6 text-start">
                              <strong>Concepto:</strong>
                            </div>
                            <div class="col-6 text-end">
                              Reserva habitación
                            </div>
                            <div class="col-6 text-start">
                              <strong>Cliente:</strong>
                            </div>
                            <div class="col-6 text-end">
                              {{ guestInfo.firstName }} {{ guestInfo.lastName }}
                            </div>
                            <div class="col-6 text-start">
                              <strong>Email:</strong>
                            </div>
                            <div class="col-6 text-end">
                              {{ guestInfo.email }}
                            </div>
                          </div>
                        </div>
                        
                        <div class="alert alert-success small" role="alert">
                          <i class="bi bi-shield-check me-1"></i>
                          Pago 100% seguro. Todos los bancos aceptados.
                        </div>
                      </div>
                      
                      <div class="payment-instructions mb-4">
                        <h4 class="h6 mb-3">Instrucciones de pago:</h4>
                        <ol class="small">
                          <li>Abre tu aplicación bancaria móvil</li>
                          <li>Busca la opción de "Pagar con QR" o "Escanear QR"</li>
                          <li>Escanea el código QR mostrado arriba</li>
                          <li>Confirma el monto y los detalles del pago</li>
                          <li>Autoriza la transacción en tu aplicación</li>
                        </ol>
                      </div>
                      
                      <div class="payment-status-check text-center mb-4">
                        <div v-if="paymentInfo.status === 'completed'" class="status-completed text-success">
                          <i class="bi bi-check-circle me-2"></i>
                          <span>¡Pago confirmado!</span>
                        </div>
                      </div>
                      
                      <div class="d-flex justify-content-between mt-4">
                        <button type="button" @click="prevStep" class="btn btn-outline-secondary">
                          <i class="bi bi-arrow-left me-1"></i>
                          Volver
                        </button>
                        <button 
                          type="button" 
                          @click="proceedWithPayment" 
                          class="btn btn-primary px-4"
                        >
                          <i class="bi bi-check-circle me-1"></i>
                          He realizado el pago
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-5">
                    <div class="price-summary card sticky-top" style="top: 20px">
                      <div class="card-header bg-primary text-white">
                        <h3 class="h5 mb-0">Resumen de precios</h3>
                      </div>
                      <div class="card-body">
                        <div class="d-flex justify-content-between mb-2">
                          <span>{{ formatPrice(room.price) }} x {{ nightCount }} noches</span>
                          <span>{{ formatPrice(room.price * nightCount) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                          <span>Impuestos y tasas (10%)</span>
                          <span>{{ formatPrice(getTaxAmount()) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                          <span>Limpieza</span>
                          <span>{{ formatPrice(25) }}</span>
                        </div>
                        <div class="d-flex justify-content-between fw-bold pt-2 border-top mt-2">
                          <span>Total</span>
                          <span>{{ formatPrice(getTotalAmount()) }}</span>
                        </div>
                      </div>
                      <div class="card-footer bg-light">
                        <div class="reservation-details small mb-2">
                          <div><strong>Check-in:</strong> {{ formatDisplayDate(bookingDetails.checkIn) }}</div>
                          <div><strong>Check-out:</strong> {{ formatDisplayDate(bookingDetails.checkOut) }}</div>
                          <div><strong>Huéspedes:</strong> {{ bookingDetails.guests }}</div>
                        </div>
                        <div class="secure-payment small">
                          <i class="bi bi-shield-lock me-1"></i>
                          Pago seguro con QR. Tus datos están protegidos.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Confirmation -->
              <div v-else-if="currentStep === 3" class="booking-step-content">
                <div class="confirmation-message text-center py-4">
                  <div class="success-icon mb-3">
                    <i class="bi bi-check-circle text-success" style="font-size: 5rem;"></i>
                  </div>
                  <h2 class="h3 mb-3">¡Reserva confirmada!</h2>
                  <p class="lead mb-4">Tu reserva se ha completado con éxito. Hemos enviado los detalles a tu correo electrónico.</p>
                  
                  <div class="booking-reference p-3 bg-light rounded mb-4">
                    <div class="fw-bold fs-5 mb-1">Número de reserva</div>
                    <div class="booking-code fs-4">{{ createdReserva.nro_reserva }}</div>
                  </div>
                  
                  <div class="row justify-content-center">
                    <div class="col-md-8">
                      <div class="confirmation-details card mb-4">
                        <div class="card-body">
                          <div class="row mb-3">
                            <div class="col-md-6 mb-3 mb-md-0">
                              <div class="fw-bold mb-1">Fecha de check-in</div>
                              <div>{{ formatDisplayDate(bookingDetails.checkIn) }}</div>
                              <div class="small text-muted">{{ formatTime(room.hotel?.hr_entrada) || '14:00' }}</div>
                            </div>
                            <div class="col-md-6">
                              <div class="fw-bold mb-1">Fecha de check-out</div>
                              <div>{{ formatDisplayDate(bookingDetails.checkOut) }}</div>
                              <div class="small text-muted">{{ formatTime(room.hotel?.hr_salida) || '12:00' }}</div>
                            </div>
                          </div>
                          
                          <div class="mb-3">
                            <div class="fw-bold mb-1">Huésped principal</div>
                            <div>{{ guestInfo.firstName }} {{ guestInfo.lastName }}</div>
                            <div class="small text-muted">{{ guestInfo.email }}</div>
                          </div>
                          
                          <div class="room-details-card d-flex p-2 bg-light rounded">
                            <img 
                              :src="roomImage" 
                              :alt="room.name" 
                              class="img-thumbnail me-3" 
                              style="width: 80px; height: 80px; object-fit: cover;"
                            >
                            <div>
                              <div class="fw-bold">{{ room.name }}</div>
                              <div class="small text-muted">{{ room.hotel?.nombre }}</div>
                              <div class="small text-muted">{{ bookingDetails.guests }} huéspedes • {{ nightCount }} noche{{ nightCount > 1 ? 's' : '' }}</div>
                              <div class="price mt-1">{{ formatPrice(getTotalAmount()) }}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="alert alert-info" role="alert">
                        <i class="bi bi-info-circle me-2"></i>
                        Si necesitas modificar o cancelar tu reserva, por favor contacta con nuestro
                        servicio de atención al cliente o accede a tu perfil.
                      </div>
                      
                      <div class="d-flex justify-content-center mt-4">
                        <button @click="downloadConfirmation" class="btn btn-outline-primary me-2">
                          <i class="bi bi-download me-1"></i>
                          Descargar confirmación
                        </button>
                        <button @click="goToHome" class="btn btn-primary">
                          Volver a inicio
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Terms and Conditions Modal -->
    <div v-if="showTermsModal" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Términos y Condiciones</h5>
            <button type="button" class="btn-close" @click="showTermsModal = false"></button>
          </div>
          <div class="modal-body">
            <h4>Términos y Condiciones de Reserva</h4>
            <p>Estos términos y condiciones regulan la reserva y estancia en nuestras habitaciones. Al realizar una reserva, usted acepta los siguientes términos:</p>
            
            <h5>1. Reserva y pago</h5>
            <p>Para confirmar su reserva, se requiere el pago completo por adelantado. Los precios mostrados incluyen impuestos y tasas locales.</p>
            
            <h5>2. Política de cancelación</h5>
            <p>Las cancelaciones realizadas con al menos 48 horas de antelación a la fecha de llegada recibirán un reembolso completo. Para cancelaciones posteriores, se cobrará el importe de la primera noche.</p>
            
            <h5>3. Check-in y check-out</h5>
            <p>El check-in está disponible a partir de las 14:00h del día de llegada. El check-out debe realizarse antes de las 12:00h del día de salida. El check-in tardío o el check-out anticipado no dan derecho a ningún reembolso.</p>
            
            <h5>4. Normas del hotel</h5>
            <p>Los huéspedes deben cumplir con todas las normas del hotel durante su estancia. Está prohibido fumar en las habitaciones y se aplicará un cargo por limpieza adicional si se detecta que se ha fumado.</p>
            
            <h5>5. Responsabilidad</h5>
            <p>El hotel no se hace responsable de la pérdida, robo o daño de objetos personales en las habitaciones o áreas comunes. Se recomienda utilizar la caja fuerte de la habitación para objetos de valor.</p>
            
            <h5>6. Protección de datos</h5>
            <p>Los datos personales proporcionados durante la reserva se utilizarán únicamente para gestionar su estancia y cumplir con las obligaciones legales. No se compartirán con terceros sin su consentimiento explícito.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="acceptTerms">Aceptar</button>
            <button type="button" class="btn btn-secondary" @click="showTermsModal = false">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { habitacionService, reservaService } from '@/services';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// State
const currentStep = ref(1);
const loading = ref(true);
const error = ref(null);
const room = ref({});
const createdReserva = ref({});

const bookingDetails = ref({
  roomId: parseInt(route.query.roomId) || 0,
  checkIn: route.query.checkIn || '',
  checkOut: route.query.checkOut || '',
  guests: parseInt(route.query.guests) || 1,
  price: parseFloat(route.query.price) || 0
});

// Guest information
const guestInfo = ref({
  firstName: auth.user?.firstName || '',
  lastName: auth.user?.lastName || '',
  email: auth.user?.email || '',
  phone: '',
  specialRequests: '',
  termsAccepted: false
});

// Payment information (simplified for QR)
const paymentInfo = ref({
  method: 'qr',
  status: 'pending' // pending, completed, failed
});

// QR Timer - removed since we're not using expiration
// const qrTimeLeft = ref(0);
// let qrTimer = null;

// Validation errors
const validationErrors = ref({});
const showTermsModal = ref(false);

// Computed
const roomImage = computed(() => {
  if (room.value.foto) {
    return `/storage/${room.value.foto}`;
  }
  return room.value.foto_url || '/images/room-default.jpg';
});

const nightCount = computed(() => {
  if (!bookingDetails.value.checkIn || !bookingDetails.value.checkOut) return 1;
  
  const start = new Date(bookingDetails.value.checkIn);
  const end = new Date(bookingDetails.value.checkOut);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays || 1;
});

const progressPercentage = computed(() => {
  return ((currentStep.value - 1) / 2) * 100;
});

// Methods
async function loadRoomData() {
  try {
    loading.value = true;
    error.value = null;
    
    if (!bookingDetails.value.roomId) {
      throw new Error('ID de habitación no válido');
    }
    
    const response = await habitacionService.getHabitacion(bookingDetails.value.roomId);
    
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
      
      // Campos adicionales para la UI
      rating: 4.5,
      reviewCount: Math.floor(Math.random() * 100) + 10
    };
    
    // Si no se pasó el precio en la query, usar el de la habitación
    if (!bookingDetails.value.price) {
      bookingDetails.value.price = room.value.price;
    }
    
  } catch (err) {
    console.error('Error al cargar habitación:', err);
    error.value = err.message || 'Error al cargar la habitación';
  } finally {
    loading.value = false;
  }
}

function formatDisplayDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

function formatPrice(price) {
  return new Intl.NumberFormat('es-BO', {
    style: 'currency',
    currency: 'BOB'
  }).format(price);
}

function formatTime(timeString) {
  if (!timeString) return '';
  return timeString.substring(0, 5); // HH:MM
}

function formatTimeCountdown(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getTaxAmount() {
  return room.value.price * nightCount.value * 0.10; // 10% tax
}

function getTotalAmount() {
  return room.value.price * nightCount.value + getTaxAmount() + 25; // Room price + tax + cleaning fee
}

function showTerms() {
  showTermsModal.value = true;
}

function acceptTerms() {
  guestInfo.value.termsAccepted = true;
  showTermsModal.value = false;
}

function goBack() {
  // Navigate back to room detail page
  router.push({ 
    name: 'room-detail', 
    params: { id: bookingDetails.value.roomId } 
  });
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function validateStep1() {
  // Reset validation errors
  validationErrors.value = {};
  
  // Basic validation
  if (!guestInfo.value.firstName) {
    validationErrors.value.firstName = 'El nombre es obligatorio';
  }
  
  if (!guestInfo.value.lastName) {
    validationErrors.value.lastName = 'Los apellidos son obligatorios';
  }
  
  if (!guestInfo.value.email) {
    validationErrors.value.email = 'El email es obligatorio';
  } else if (!isValidEmail(guestInfo.value.email)) {
    validationErrors.value.email = 'Email no válido';
  }
  
  if (!guestInfo.value.phone) {
    validationErrors.value.phone = 'El teléfono es obligatorio';
  }
  
  if (!guestInfo.value.termsAccepted) {
    validationErrors.value.termsAccepted = 'Debes aceptar los términos y condiciones';
  }
  
  // If no errors, proceed to next step
  if (Object.keys(validationErrors.value).length === 0) {
    currentStep.value = 2;
  }
}

function proceedWithPayment() {
  // Simply proceed to create reservation without any payment verification
  paymentInfo.value.status = 'completed';
  createReservation();
}

async function createReservation() {
  try {
    // Preparar los datos de la reserva según el formato de la API
    const reservaData = {
      hotel_id: room.value.hotel.id,
      fec_checkin: bookingDetails.value.checkIn,
      fec_checkout: bookingDetails.value.checkOut,
      detalles: [
        {
          habitacion_id: room.value.id,
          cantidad: 1 // Por ahora, siempre 1 habitación
        }
      ]
    };
    
    // Crear la reserva
    const response = await reservaService.createReserva(reservaData);
    createdReserva.value = response.reserva;
    
    // Move to confirmation step
    currentStep.value = 3;
    
  } catch (err) {
    console.error('Error al crear reserva:', err);
    paymentInfo.value.status = 'failed';
    
    // Mostrar error específico si está disponible
    if (err.message) {
      alert(`Error al crear la reserva: ${err.message}`);
    } else {
      alert('Error al procesar la reserva. Por favor, intenta nuevamente.');
    }
  }
}

function downloadConfirmation() {
  // En una aplicación real, esto generaría un PDF
  const confirmationData = {
    reserva: createdReserva.value,
    habitacion: room.value,
    huesped: guestInfo.value,
    fechas: bookingDetails.value,
    total: getTotalAmount()
  };
  
  console.log('Datos de confirmación para PDF:', confirmationData);
  alert('En una aplicación real, esto generaría un PDF de confirmación para descargar.');
}

function goToHome() {
  router.push({ name: 'home' });
}

// Validation helpers
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Lifecycle hooks
onMounted(async () => {
  // Check if user is logged in (opcional - comentado para permitir reservas sin login)
  /*if (!auth.isLogged) {
    router.push({ 
      name: 'login',
      query: { redirect: route.fullPath }
    });
    return;
  }*/
  
  // Cargar datos de la habitación
  await loadRoomData();
});

onUnmounted(() => {
  // No cleanup needed since we removed the timer
});
</script>
  
<style scoped>
.booking-progress .progress {
  height: 8px;
}

.progress-step {
  text-align: center;
  width: 100px;
  position: relative;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-weight: bold;
}

.progress-step.active .step-number {
  background-color: #0d6efd;
  color: white;
}

.progress-step.completed .step-number {
  background-color: #198754;
  color: white;
}

.step-label {
  font-size: 0.875rem;
  color: #6c757d;
}

.progress-step.active .step-label,
.progress-step.completed .step-label {
  color: #212529;
  font-weight: 500;
}

.stars i {
  color: #e0e0e0;
}

.stars i.bi-star-fill {
  color: #ffc107;
}

/* QR Payment Styles */
.payment-method-card {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  background-color: #f8f9fa;
  transition: all 0.3s ease;
}

.payment-method-card.selected {
  border-color: #0d6efd;
  background-color: #f0f8ff;
}

.qr-code-image {
  width: 200px;
  height: 200px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  object-fit: contain;
  background-color: #fff;
}

.qr-code-placeholder {
  width: 200px;
  height: 200px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
}

.payment-details-card {
  max-width: 300px;
  margin: 0 auto;
}

.qr-container {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #fff;
}

.payment-instructions ol {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.status-pending {
  color: #0d6efd;
  font-weight: 500;
}

.status-completed {
  font-weight: 600;
  font-size: 1.1rem;
}

.status-failed {
  font-weight: 600;
}

.booking-code {
  font-family: monospace;
  letter-spacing: 1px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .qr-code-image,
  .qr-code-placeholder {
    width: 160px;
    height: 160px;
  }
  
  .qr-code-placeholder i {
    font-size: 8rem !important;
  }
  
  .payment-details-card {
    font-size: 0.875rem;
  }
}

/* Animation for spinner */
.spinner-border {
  width: 1rem;
  height: 1rem;
}

/* Timer styling */
.alert-warning strong {
  color: #856404;
}
</style>