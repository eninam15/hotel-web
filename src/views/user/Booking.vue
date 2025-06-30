<template>
  <div class="booking-page py-5 bg-light">
    <div class="container">
      <div v-if="initialLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
        <p class="mt-3">Cargando datos de la reserva...</p>
      </div>
      <div v-else-if="error" class="alert alert-danger">
        <h4><i class="bi bi-exclamation-triangle-fill me-2"></i>Error</h4>
        <p>{{ error }}</p>
        <button @click="goBack" class="btn btn-secondary">Volver</button>
      </div>
      <div v-else class="row justify-content-center">
        <div class="col-lg-11">
          <div class="card shadow-sm">
            <div class="card-body p-4 p-md-5">
              <h1 class="card-title fw-bold mb-2">Completar tu reserva</h1>
              <p class="text-muted mb-4">Sigue los pasos para asegurar tu habitación.</p>

              <!-- Progress Stepper -->
              <div class="booking-progress mb-5">
                <div class="progress" style="height: 4px;">
                  <div class="progress-bar" role="progressbar" :style="{ width: progressPercentage + '%' }" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <div class="d-flex justify-content-between">
                  <div class="progress-step" :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }">
                    <div class="step-number">1</div>
                    <div class="step-label">Tus Datos</div>
                  </div>
                  <div class="progress-step" :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }">
                    <div class="step-number">2</div>
                    <div class="step-label">Pago</div>
                  </div>
                  <div class="progress-step" :class="{ 'active': currentStep >= 3, 'completed': currentStep > 3 }">
                    <div class="step-number">3</div>
                    <div class="step-label">Finalizado</div>
                  </div>
                </div>
              </div>

              <!-- Step 1: Guest Details -->
              <div v-if="currentStep === 1" class="booking-step-content">
                <div class="row g-4">
                  <!-- Form Column -->
                  <div class="col-lg-7">
                    <h2 class="h4 mb-3">Información del huésped principal</h2>
                    <form @submit.prevent="validateAndInitiateBooking" class="guest-form" novalidate>
                      <div class="row g-3">
                        <div class="col-md-6">
                          <label for="firstName" class="form-label">Nombre*</label>
                          <input type="text" id="firstName" v-model="guestInfo.firstName" class="form-control" :class="{'is-invalid': validationErrors.firstName}" required>
                          <div class="invalid-feedback">{{ validationErrors.firstName }}</div>
                        </div>
                        <div class="col-md-6">
                          <label for="lastName" class="form-label">Apellidos*</label>
                          <input type="text" id="lastName" v-model="guestInfo.lastName" class="form-control" :class="{'is-invalid': validationErrors.lastName}" required>
                           <div class="invalid-feedback">{{ validationErrors.lastName }}</div>
                        </div>
                        <div class="col-md-6">
                          <label for="email" class="form-label">Email*</label>
                          <input type="email" id="email" v-model="guestInfo.email" class="form-control" :class="{'is-invalid': validationErrors.email}" required>
                          <div class="invalid-feedback">{{ validationErrors.email }}</div>
                        </div>
                         <div class="col-md-6">
                          <label for="phone" class="form-label">Teléfono*</label>
                          <input type="tel" id="phone" v-model="guestInfo.phone" class="form-control" :class="{'is-invalid': validationErrors.phone}" placeholder="Ej: 76543210" required>
                          <div class="invalid-feedback">{{ validationErrors.phone }}</div>
                        </div>
                        <div class="col-12">
                           <label for="specialRequests" class="form-label">Solicitudes especiales (opcional)</label>
                           <textarea id="specialRequests" v-model="guestInfo.specialRequests" class="form-control" rows="3" placeholder="Ej: Piso alto, lejos del ascensor..."></textarea>
                        </div>
                      </div>
                      <div class="d-flex justify-content-end align-items-center mt-4 pt-3 border-top">
                        <button type="button" @click="goBack" class="btn btn-link text-secondary me-3">Volver</button>
                        <button type="submit" class="btn btn-primary btn-lg px-5" :disabled="isInitiatingBooking">
                          <span v-if="isInitiatingBooking" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                          {{ isInitiatingBooking ? 'Procesando...' : 'Continuar' }}
                        </button>
                      </div>
                    </form>
                  </div>
                  <!-- Summary Column -->
                  <div class="col-lg-5">
                     <div class="price-summary card sticky-top" style="top: 20px; border: 1px solid #dee2e6;">
                      <div class="card-header bg-light">
                        <h3 class="h5 mb-0">Resumen de tu estancia</h3>
                      </div>
                      <div class="card-body">
                         <div class="d-flex justify-content-between mb-2">
                           <span class="text-muted">Habitación:</span>
                           <strong class="text-end">{{ roomDetails.name }}</strong>
                         </div>
                         <div class="d-flex justify-content-between mb-2">
                           <span class="text-muted">Check-in:</span>
                           <strong class="text-end">{{ formatDisplayDate(bookingDetails.checkIn) }}</strong>
                         </div>
                         <div class="d-flex justify-content-between mb-3">
                           <span class="text-muted">Check-out:</span>
                           <strong class="text-end">{{ formatDisplayDate(bookingDetails.checkOut) }}</strong>
                         </div>
                         <div class="d-flex justify-content-between mb-2">
                           <span class="text-muted">Huéspedes:</span>
                           <strong class="text-end">{{ bookingDetails.guests }}</strong>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Manual Payment -->
              <div v-else-if="currentStep === 2" class="booking-step-content">
                <h2 class="h4 mb-4">Realiza el pago</h2>
                <div class="row">
                  <div class="col-md-7">
                    <div class="qr-container text-center p-4 border rounded bg-white">
                       <p class="lead">Para confirmar, paga <strong>{{ formatPrice(reserva.precio_total) }}</strong></p>
                       <p>Escanea el código QR con tu app bancaria:</p>
                       
                       <img :src="getStaticQrCode()" alt="Código QR de pago" class="img-fluid my-3 shadow-sm" style="max-width: 250px; border-radius: 8px;">
                       
                       <div class="alert alert-warning mt-3">
                         <h5 class="alert-heading"><i class="bi bi-exclamation-circle-fill me-2"></i>¡Acción requerida!</h5>
                         <p>Una vez realizado el pago, envía tu comprobante a nuestro WhatsApp <strong>+591 777 77777</strong> o al correo <strong>pagos@hotel.com</strong> para que un administrador confirme tu reserva.</p>
                         <hr>
                         <p class="mb-0 small">Tu reserva se mantendrá como 'pendiente' hasta que verifiquemos el pago.</p>
                       </div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-4">
                       <button @click="currentStep = 1" class="btn btn-link text-secondary">Volver atrás</button>
                       <button @click="finishFlow" class="btn btn-success px-4">
                         <i class="bi bi-check-lg me-2"></i>Entendido, he realizado el pago
                       </button>
                    </div>
                  </div>
                  <div class="col-md-5">
                    <div class="price-summary card sticky-top" style="top: 20px">
                      <div class="card-header bg-primary text-white">
                        <h3 class="h5 mb-0">Resumen de la pre-reserva</h3>
                      </div>
                      <div class="card-body">
                         <div class="d-flex justify-content-between mb-2">
                           <span>Habitación:</span>
                           <strong>{{ roomDetails.name }}</strong>
                         </div>
                         <div class="d-flex justify-content-between mb-3">
                           <span>Nro. de Noches:</span>
                           <strong>{{ reserva.nro_noches }}</strong>
                         </div>
                         <div class="d-flex justify-content-between fw-bold pt-2 border-top mt-2 fs-5">
                           <span>Total a pagar:</span>
                           <span>{{ formatPrice(reserva.precio_total) }}</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Pending Confirmation -->
              <div v-else-if="currentStep === 3" class="booking-step-content text-center py-5">
                <div class="pending-icon mb-3">
                  <i class="bi bi-hourglass-split text-primary" style="font-size: 5rem;"></i>
                </div>
                <h2 class="h3 mb-3">Reserva en estado pendiente</h2>
                <p class="lead mb-4">Hemos registrado tu solicitud con el número <strong>{{ reserva.nro_reserva }}</strong>.</p>
                <p>Recibirás un correo electrónico de confirmación tan pronto como nuestro equipo administrativo verifique tu pago. ¡Gracias por tu paciencia!</p>
                 <div class="mt-4">
                    <button @click="goToHome" class="btn btn-primary">Volver a inicio</button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { reservaService, habitacionService } from '@/services';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// State
const currentStep = ref(1);
const initialLoading = ref(true);
const error = ref(null);
const isInitiatingBooking = ref(false);
const validationErrors = ref({});

const reserva = ref({}); 
const roomDetails = ref({});
const bookingDetails = ref({
  roomId: parseInt(route.query.roomId),
  checkIn: route.query.checkIn,
  checkOut: route.query.checkOut,
  guests: parseInt(route.query.guests),
});

const guestInfo = ref({
  firstName: auth.user?.firstName || '',
  lastName: auth.user?.lastName || '',
  email: auth.user?.email || '',
  phone: '',
  specialRequests: '',
});

// Computed
const progressPercentage = computed(() => {
  return ((currentStep.value - 1) / 2) * 100;
});

// Methods
function validateStep1() {
  const errors = {};
  if (!guestInfo.value.firstName) errors.firstName = 'El nombre es obligatorio.';
  if (!guestInfo.value.lastName) errors.lastName = 'El apellido es obligatorio.';
  if (!guestInfo.value.email) {
    errors.email = 'El email es obligatorio.';
  } else if (!/^\S+@\S+\.\S+$/.test(guestInfo.value.email)) {
    errors.email = 'El formato del email no es válido.';
  }
  if (!guestInfo.value.phone) {
    errors.phone = 'El teléfono es obligatorio.';
  } else if (!/^\d{7,8}$/.test(guestInfo.value.phone)) {
    errors.phone = 'Introduce un número de teléfono válido (7-8 dígitos).';
  }
  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
}

async function validateAndInitiateBooking() {
  if (!validateStep1()) {
    return;
  }
  
  isInitiatingBooking.value = true;
  error.value = null;

  try {
    const reservaData = {
      hotel_id: roomDetails.value.hotel_id,
      fec_checkin: bookingDetails.value.checkIn,
      fec_checkout: bookingDetails.value.checkOut,
      detalles: [{
        habitacion_id: bookingDetails.value.roomId,
        cantidad: 1
      }]
    };

    const response = await reservaService.createReserva(reservaData);
    reserva.value = response.reserva;
    currentStep.value = 2;

  } catch (err) {
    console.error('Error al iniciar la reserva:', err);
    error.value = err.message || 'No se pudo iniciar el proceso de reserva. La habitación podría no estar disponible.';
    currentStep.value = 1;
  } finally {
    isInitiatingBooking.value = false;
  }
}

function getStaticQrCode() {
  const price = reserva.value.precio_total;
  if (price > 1000) return '/images/qr-code-high-value.png';
  if (price > 500) return '/images/qr-code-mid-value.png';
  return '/images/qr-payment-example.png';
}

function finishFlow() {
  currentStep.value = 3;
}

function goBack() {
  router.push({ name: 'room-detail', params: { id: bookingDetails.value.roomId } });
}

function goToHome() {
  router.push({ name: 'home' });
}

function formatPrice(price) {
  if (typeof price !== 'number') return 'BOB 0.00';
  return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(price);
}

function formatDisplayDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00'); // Asegurar que se interprete como local
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// Lifecycle Hooks
onMounted(async () => {
  if (!bookingDetails.value.roomId || !bookingDetails.value.checkIn) {
    error.value = "Faltan datos para la reserva. Por favor, vuelve a la página de la habitación e inténtalo de nuevo.";
    initialLoading.value = false;
    return;
  }
  
  try {
    const roomData = await habitacionService.getHabitacion(bookingDetails.value.roomId);
    roomDetails.value = {
        name: roomData.nombre,
        hotel_id: roomData.hotel_id,
    };
  } catch(err) {
      error.value = "No se pudieron cargar los detalles de la habitación.";
  } finally {
      initialLoading.value = false;
  }
});
</script>

<style scoped>
.booking-page { background-color: #f8f9fa; }
.card { border: none; }
.guest-form .form-control { border-radius: 8px; padding: 0.75rem 1rem; }
.form-control.is-invalid {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.qr-container { background-color: #fff; }
.pending-icon i {
  background: linear-gradient(135deg, #007bff, #0dcaf0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.booking-code { font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; }

/* Progress Stepper */
.booking-progress {
  width: 100%;
  margin: 0 auto;
}
.progress-step {
  text-align: center;
  width: 100px;
  position: relative;
  color: #6c757d;
}
.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e9ecef;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  font-weight: bold;
  border: 3px solid #e9ecef;
  transition: all 0.3s ease;
}
.progress-step.active .step-number {
  border-color: #0d6efd;
  background-color: white;
  color: #0d6efd;
}
.progress-step.completed .step-number {
  border-color: #198754;
  background-color: #198754;
  color: white;
}
.step-label {
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s ease;
}
.progress-step.active .step-label {
  color: #0d6efd;
  font-weight: bold;
}
.progress-step.completed .step-label {
  color: #198754;
}
.progress-bar {
    transition: width 0.4s ease;
}
</style>
