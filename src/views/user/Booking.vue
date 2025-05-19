<!-- src/views/user/Booking.vue -->
<template>
    <div class="booking-page py-5">
      <div class="container">
        <div class="row justify-content-center">
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
                            :src="room.image" 
                            :alt="room.name" 
                            class="img-thumbnail me-3" 
                            style="width: 100px; height: 100px; object-fit: cover;"
                          >
                          <div>
                            <h3 class="h5 mb-1">{{ room.name }}</h3>
                            <div class="small text-muted mb-1">
                              <i class="bi bi-geo-alt me-1"></i> Piso {{ room.floor }} • Vista {{ room.view }}
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
                                <div class="small">A partir de las 14:00h</div>
                              </div>
                            </div>
                            <div class="col-6">
                              <div class="date-card p-2 border rounded text-center">
                                <div class="small text-muted">Check-out</div>
                                <div class="fw-bold">{{ formatDisplayDate(bookingDetails.checkOut) }}</div>
                                <div class="small">Hasta las 12:00h</div>
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
                            <strong>Política de cancelación:</strong> Cancelación gratuita hasta 48 horas antes de la fecha de llegada. Después de este período, se cobrará la primera noche.
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
                        <div class="form-check mb-3">
                          <input 
                            class="form-check-input" 
                            type="radio" 
                            name="paymentMethod" 
                            id="creditCard" 
                            value="creditCard" 
                            v-model="paymentInfo.method"
                            checked
                          >
                          <label class="form-check-label w-100" for="creditCard">
                            <div class="d-flex align-items-center">
                              <div class="me-auto">Tarjeta de crédito/débito</div>
                              <div class="payment-icons">
                                <i class="bi bi-credit-card me-1"></i>
                                <i class="bi bi-credit-card-2-front me-1"></i>
                                <i class="bi bi-credit-card-2-back"></i>
                              </div>
                            </div>
                          </label>
                        </div>
                        
                        <div class="form-check">
                          <input 
                            class="form-check-input" 
                            type="radio" 
                            name="paymentMethod" 
                            id="paypal" 
                            value="paypal" 
                            v-model="paymentInfo.method"
                          >
                          <label class="form-check-label w-100" for="paypal">
                            <div class="d-flex align-items-center">
                              <div class="me-auto">PayPal</div>
                              <i class="bi bi-paypal"></i>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      <!-- Credit Card Form -->
                      <div v-if="paymentInfo.method === 'creditCard'" class="payment-form">
                        <div class="card-details">
                          <div class="mb-3">
                            <label for="cardName" class="form-label">Nombre en la tarjeta*</label>
                            <input 
                              type="text" 
                              id="cardName" 
                              v-model="paymentInfo.cardName" 
                              class="form-control"
                              :class="{ 'is-invalid': validationErrors.cardName }" 
                              required
                            >
                            <div class="invalid-feedback">{{ validationErrors.cardName }}</div>
                          </div>
                          
                          <div class="mb-3">
                            <label for="cardNumber" class="form-label">Número de tarjeta*</label>
                            <input 
                              type="text" 
                              id="cardNumber" 
                              v-model="paymentInfo.cardNumber" 
                              class="form-control"
                              :class="{ 'is-invalid': validationErrors.cardNumber }" 
                              placeholder="XXXX XXXX XXXX XXXX"
                              required
                            >
                            <div class="invalid-feedback">{{ validationErrors.cardNumber }}</div>
                          </div>
                          
                          <div class="row g-3 mb-3">
                            <div class="col-md-6">
                              <label for="expiryDate" class="form-label">Fecha de expiración*</label>
                              <input 
                                type="text" 
                                id="expiryDate" 
                                v-model="paymentInfo.expiryDate" 
                                class="form-control"
                                :class="{ 'is-invalid': validationErrors.expiryDate }" 
                                placeholder="MM/YY"
                                required
                              >
                              <div class="invalid-feedback">{{ validationErrors.expiryDate }}</div>
                            </div>
                            <div class="col-md-6">
                              <label for="cvv" class="form-label">CVV*</label>
                              <input 
                                type="text" 
                                id="cvv" 
                                v-model="paymentInfo.cvv" 
                                class="form-control"
                                :class="{ 'is-invalid': validationErrors.cvv }" 
                                placeholder="123"
                                required
                              >
                              <div class="invalid-feedback">{{ validationErrors.cvv }}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div class="billing-address mt-4">
                          <h3 class="h5 mb-3">Dirección de facturación</h3>
                          
                          <div class="mb-3">
                            <label for="address" class="form-label">Dirección*</label>
                            <input 
                              type="text" 
                              id="address" 
                              v-model="paymentInfo.address" 
                              class="form-control"
                              :class="{ 'is-invalid': validationErrors.address }" 
                              required
                            >
                            <div class="invalid-feedback">{{ validationErrors.address }}</div>
                          </div>
                          
                          <div class="row g-3 mb-3">
                            <div class="col-md-6">
                              <label for="city" class="form-label">Ciudad*</label>
                              <input 
                                type="text" 
                                id="city" 
                                v-model="paymentInfo.city" 
                                class="form-control"
                                :class="{ 'is-invalid': validationErrors.city }" 
                                required
                              >
                              <div class="invalid-feedback">{{ validationErrors.city }}</div>
                            </div>
                            <div class="col-md-6">
                              <label for="zipCode" class="form-label">Código postal*</label>
                              <input 
                                type="text" 
                                id="zipCode" 
                                v-model="paymentInfo.zipCode" 
                                class="form-control"
                                :class="{ 'is-invalid': validationErrors.zipCode }" 
                                required
                              >
                              <div class="invalid-feedback">{{ validationErrors.zipCode }}</div>
                            </div>
                          </div>
                          
                          <div class="mb-3">
                            <label for="country" class="form-label">País*</label>
                            <select 
                              id="country" 
                              v-model="paymentInfo.country" 
                              class="form-select"
                              :class="{ 'is-invalid': validationErrors.country }" 
                              required
                            >
                              <option value="">Seleccionar país</option>
                              <option value="ES">España</option>
                              <option value="BO">Bolivia</option>
                              <option value="US">Estados Unidos</option>
                              <option value="MX">México</option>
                              <option value="AR">Argentina</option>
                              <option value="CO">Colombia</option>
                              <option value="PE">Perú</option>
                              <option value="CL">Chile</option>
                              <!-- Más países -->
                            </select>
                            <div class="invalid-feedback">{{ validationErrors.country }}</div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- PayPal Form (simplified) -->
                      <div v-else-if="paymentInfo.method === 'paypal'" class="payment-form text-center p-4">
                        <div class="paypal-logo mb-3">
                          <i class="bi bi-paypal fs-1 text-primary"></i>
                        </div>
                        <p>Serás redirigido a PayPal para completar el pago de forma segura.</p>
                      </div>
                      
                      <div class="d-flex justify-content-between mt-4">
                        <button type="button" @click="prevStep" class="btn btn-outline-secondary">
                          Volver
                        </button>
                        <button type="button" @click="validateStep2" class="btn btn-primary px-4">
                          Confirmar y pagar
                        </button>
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
                            Pago seguro. Tus datos están protegidos.
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
                      <div class="fw-bold fs-5 mb-1">Referencia de reserva</div>
                      <div class="booking-code fs-4">{{ bookingReference }}</div>
                    </div>
                    
                    <div class="row justify-content-center">
                      <div class="col-md-8">
                        <div class="confirmation-details card mb-4">
                          <div class="card-body">
                            <div class="row mb-3">
                              <div class="col-md-6 mb-3 mb-md-0">
                                <div class="fw-bold mb-1">Fecha de check-in</div>
                                <div>{{ formatDisplayDate(bookingDetails.checkIn) }}</div>
                                <div class="small text-muted">A partir de las 14:00h</div>
                              </div>
                              <div class="col-md-6">
                                <div class="fw-bold mb-1">Fecha de check-out</div>
                                <div>{{ formatDisplayDate(bookingDetails.checkOut) }}</div>
                                <div class="small text-muted">Hasta las 12:00h</div>
                              </div>
                            </div>
                            
                            <div class="mb-3">
                              <div class="fw-bold mb-1">Huésped principal</div>
                              <div>{{ guestInfo.firstName }} {{ guestInfo.lastName }}</div>
                            </div>
                            
                            <div class="room-details-card d-flex p-2 bg-light rounded">
                              <img 
                                :src="room.image" 
                                :alt="room.name" 
                                class="img-thumbnail me-3" 
                                style="width: 80px; height: 80px; object-fit: cover;"
                              >
                              <div>
                                <div class="fw-bold">{{ room.name }}</div>
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
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@/store/auth';
  
  const route = useRoute();
  const router = useRouter();
  const auth = useAuthStore();
  
  // State
  const currentStep = ref(1);
  const room = ref({});
  const bookingDetails = ref({
    roomId: parseInt(route.query.roomId) || 0,
    checkIn: route.query.checkIn || '',
    checkOut: route.query.checkOut || '',
    guests: parseInt(route.query.guests) || 1
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
  
  // Payment information
  const paymentInfo = ref({
    method: 'creditCard',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    address: '',
    city: '',
    zipCode: '',
    country: ''
  });
  
  // Validation errors
  const validationErrors = ref({});
  
  // Booking reference
  const bookingReference = ref('');
  const showTermsModal = ref(false);
  
  // Computed
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
  function formatDisplayDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }
  
  function formatPrice(price) {
    /*return price.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });*/
    return `$100`;
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
  
  function validateStep2() {
    // Reset validation errors
    validationErrors.value = {};
    
    if (paymentInfo.value.method === 'creditCard') {
      // Validate credit card details
      if (!paymentInfo.value.cardName) {
        validationErrors.value.cardName = 'El nombre es obligatorio';
      }
      
      if (!paymentInfo.value.cardNumber) {
        validationErrors.value.cardNumber = 'El número de tarjeta es obligatorio';
      } else if (!isValidCardNumber(paymentInfo.value.cardNumber)) {
        validationErrors.value.cardNumber = 'Número de tarjeta no válido';
      }
      
      if (!paymentInfo.value.expiryDate) {
        validationErrors.value.expiryDate = 'La fecha de expiración es obligatoria';
      } else if (!isValidExpiryDate(paymentInfo.value.expiryDate)) {
        validationErrors.value.expiryDate = 'Fecha de expiración no válida (MM/YY)';
      }
      
      if (!paymentInfo.value.cvv) {
        validationErrors.value.cvv = 'El CVV es obligatorio';
      } else if (!isValidCVV(paymentInfo.value.cvv)) {
        validationErrors.value.cvv = 'CVV no válido';
      }
      
      // Validate billing address
      if (!paymentInfo.value.address) {
        validationErrors.value.address = 'La dirección es obligatoria';
      }
      
      if (!paymentInfo.value.city) {
        validationErrors.value.city = 'La ciudad es obligatoria';
      }
      
      if (!paymentInfo.value.zipCode) {
        validationErrors.value.zipCode = 'El código postal es obligatorio';
      }
      
      if (!paymentInfo.value.country) {
        validationErrors.value.country = 'El país es obligatorio';
      }
    }
    
    // If no errors, proceed to confirmation
    if (Object.keys(validationErrors.value).length === 0) {
      processPayment();
    }
  }
  
  function processPayment() {
    // In a real app, you would send the payment details to your server/payment processor
    // For demo purposes, we'll simulate a successful payment with a timeout
    setTimeout(() => {
      // Generate a random booking reference
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const numbers = '0123456789';
      let reference = '';
      
      for (let i = 0; i < 2; i++) {
        reference += letters.charAt(Math.floor(Math.random() * letters.length));
      }
      
      reference += '-';
      
      for (let i = 0; i < 6; i++) {
        reference += numbers.charAt(Math.floor(Math.random() * numbers.length));
      }
      
      bookingReference.value = reference;
      
      // Move to confirmation step
      currentStep.value = 3;
    }, 1500);
  }
  
  function downloadConfirmation() {
    // In a real app, this would generate a PDF or similar
    alert('En una aplicación real, esto generaría un PDF de confirmación para descargar.');
  }
  
  function goToHome() {
    // Navigate to home page
    router.push({ name: 'home' });
  }
  
  // Validation helpers
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
  
  function isValidCardNumber(cardNumber) {
    // Basic validation - remove spaces and check if it's 16 digits
    const cleaned = cardNumber.replace(/\s+/g, '');
    return /^\d{16}$/.test(cleaned);
  }
  
  function isValidExpiryDate(expiryDate) {
    // Check if format is MM/YY
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate);
  }
  
  function isValidCVV(cvv) {
    // Check if it's 3 or 4 digits
    return /^\d{3,4}$/.test(cvv);
  }
  
  // Lifecycle hooks
  onMounted(async () => {
    // Check if user is logged in
    /*if (!auth.isLogged) {
      // Redirect to login page
      router.push({ 
        name: 'login',
        query: { redirect: route.fullPath }
      });
      return;
    }*/
    
    // Fetch room details based on roomId
    // In a real app, this would be an API call
    setTimeout(() => {
      // Mock room data (similar to what we had in RoomDetail.vue)
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
          rating: 4.9,
          reviewCount: 112
        },
      ];
      
      // Find the room
      const foundRoom = mockRooms.find(r => r.id === bookingDetails.value.roomId);
      if (foundRoom) {
        room.value = foundRoom;
      } else {
        // If room not found, redirect to rooms list
        router.push({ name: 'rooms' });
      }
    }, 300);
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
  
  .payment-icons i {
    font-size: 1.5rem;
    color: #6c757d;
  }
  
  .paypal-logo i {
    color: #0070ba;
  }
  
  .booking-code {
    font-family: monospace;
    letter-spacing: 1px;
  }
  </style>