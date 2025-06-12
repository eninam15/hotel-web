<!-- src/components/admin/ReservationFormModal.vue -->
<template>
  <div 
    class="modal fade show d-block" 
    tabindex="-1" 
    role="dialog" 
    style="background-color: rgba(0,0,0,0.5);"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-calendar-plus me-2"></i>
            {{ isEditing ? 'Editar Reserva' : 'Nueva Reserva' }}
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
            :disabled="isSaving"
          ></button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Progress Steps -->
            <div class="steps-container mb-4">
              <div class="d-flex justify-content-between">
                <div 
                  class="step" 
                  :class="{ 'active': currentStep >= 1, 'completed': currentStep > 1 }"
                >
                  <div class="step-number">1</div>
                  <div class="step-label">Huésped</div>
                </div>
                <div 
                  class="step" 
                  :class="{ 'active': currentStep >= 2, 'completed': currentStep > 2 }"
                >
                  <div class="step-number">2</div>
                  <div class="step-label">Fechas</div>
                </div>
                <div 
                  class="step" 
                  :class="{ 'active': currentStep >= 3, 'completed': currentStep > 3 }"
                >
                  <div class="step-number">3</div>
                  <div class="step-label">Habitación</div>
                </div>
                <div 
                  class="step" 
                  :class="{ 'active': currentStep >= 4 }"
                >
                  <div class="step-number">4</div>
                  <div class="step-label">Confirmación</div>
                </div>
              </div>
            </div>

            <!-- Step 1: Guest Information -->
            <div v-show="currentStep === 1" class="step-content">
              <h6 class="mb-3">
                <i class="bi bi-person me-2"></i>Información del Huésped
              </h6>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="guestName" class="form-label">
                    Nombre completo <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="text" 
                    id="guestName"
                    v-model="form.guestName" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.guestName }"
                    placeholder="Nombre y apellidos"
                    required
                    :disabled="isSaving"
                  >
                  <div v-if="errors.guestName" class="invalid-feedback">
                    {{ errors.guestName }}
                  </div>
                </div>
                
                <div class="col-md-6">
                  <label for="guestEmail" class="form-label">
                    Email <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="email" 
                    id="guestEmail"
                    v-model="form.guestEmail" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.guestEmail }"
                    placeholder="email@ejemplo.com"
                    required
                    :disabled="isSaving"
                  >
                  <div v-if="errors.guestEmail" class="invalid-feedback">
                    {{ errors.guestEmail }}
                  </div>
                </div>
                
                <div class="col-md-6">
                  <label for="guestPhone" class="form-label">
                    Teléfono <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="tel" 
                    id="guestPhone"
                    v-model="form.guestPhone" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.guestPhone }"
                    placeholder="+34 666 123 456"
                    required
                    :disabled="isSaving"
                  >
                  <div v-if="errors.guestPhone" class="invalid-feedback">
                    {{ errors.guestPhone }}
                  </div>
                </div>
                
                <div class="col-md-6">
                  <label for="guestDocument" class="form-label">
                    Documento de identidad
                  </label>
                  <input 
                    type="text" 
                    id="guestDocument"
                    v-model="form.guestDocument" 
                    class="form-control"
                    placeholder="DNI/NIE/Pasaporte"
                    :disabled="isSaving"
                  >
                </div>
                
                <div class="col-md-4">
                  <label for="adults" class="form-label">
                    Adultos <span class="text-danger">*</span>
                  </label>
                  <select 
                    id="adults"
                    v-model="form.adults" 
                    class="form-select"
                    :class="{ 'is-invalid': errors.adults }"
                    required
                    :disabled="isSaving"
                  >
                    <option value="1">1 adulto</option>
                    <option value="2">2 adultos</option>
                    <option value="3">3 adultos</option>
                    <option value="4">4 adultos</option>
                    <option value="5">5 adultos</option>
                    <option value="6">6 adultos</option>
                  </select>
                  <div v-if="errors.adults" class="invalid-feedback">
                    {{ errors.adults }}
                  </div>
                </div>
                
                <div class="col-md-4">
                  <label for="children" class="form-label">Niños</label>
                  <select 
                    id="children"
                    v-model="form.children" 
                    class="form-select"
                    :disabled="isSaving"
                  >
                    <option value="0">0 niños</option>
                    <option value="1">1 niño</option>
                    <option value="2">2 niños</option>
                    <option value="3">3 niños</option>
                  </select>
                </div>
                
                <div class="col-md-4">
                  <label for="totalGuests" class="form-label">Total huéspedes</label>
                  <input 
                    type="text" 
                    id="totalGuests"
                    :value="totalGuests" 
                    class="form-control bg-light"
                    readonly
                  >
                </div>
                
                <div class="col-12">
                  <label for="specialRequests" class="form-label">Solicitudes especiales</label>
                  <textarea 
                    id="specialRequests"
                    v-model="form.specialRequests" 
                    class="form-control"
                    rows="3"
                    placeholder="Cuna para bebé, cama extra, dieta especial, etc."
                    :disabled="isSaving"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Step 2: Dates -->
            <div v-show="currentStep === 2" class="step-content">
              <h6 class="mb-3">
                <i class="bi bi-calendar-range me-2"></i>Fechas de la Reserva
              </h6>
              
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="checkIn" class="form-label">
                    Fecha de entrada <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="date" 
                    id="checkIn"
                    v-model="form.checkIn" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.checkIn }"
                    :min="minDate"
                    required
                    :disabled="isSaving"
                    @change="calculateNights"
                  >
                  <div v-if="errors.checkIn" class="invalid-feedback">
                    {{ errors.checkIn }}
                  </div>
                </div>
                
                <div class="col-md-6">
                  <label for="checkOut" class="form-label">
                    Fecha de salida <span class="text-danger">*</span>
                  </label>
                  <input 
                    type="date" 
                    id="checkOut"
                    v-model="form.checkOut" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.checkOut }"
                    :min="minCheckOutDate"
                    required
                    :disabled="isSaving"
                    @change="calculateNights"
                  >
                  <div v-if="errors.checkOut" class="invalid-feedback">
                    {{ errors.checkOut }}
                  </div>
                </div>
                
                <div class="col-12">
                  <div class="stay-summary p-3 bg-light rounded">
                    <div class="row">
                      <div class="col-md-4 text-center">
                        <strong>{{ nights }}</strong>
                        <div class="text-muted small">
                          {{ nights === 1 ? 'noche' : 'noches' }}
                        </div>
                      </div>
                      <div class="col-md-4 text-center">
                        <strong>{{ formatDate(form.checkIn) }}</strong>
                        <div class="text-muted small">Entrada</div>
                      </div>
                      <div class="col-md-4 text-center">
                        <strong>{{ formatDate(form.checkOut) }}</strong>
                        <div class="text-muted small">Salida</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Room Selection -->
            <div v-show="currentStep === 3" class="step-content">
              <h6 class="mb-3">
                <i class="bi bi-door-open me-2"></i>Selección de Habitación
              </h6>
              
              <div class="row g-3 mb-4">
                <div class="col-md-6">
                  <label for="roomType" class="form-label">
                    Tipo de habitación <span class="text-danger">*</span>
                  </label>
                  <select 
                    id="roomType"
                    v-model="form.roomTypeId" 
                    class="form-select"
                    :class="{ 'is-invalid': errors.roomTypeId }"
                    required
                    :disabled="isSaving"
                    @change="loadAvailableRooms"
                  >
                    <option value="">Seleccionar tipo</option>
                    <option v-for="type in roomTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                  <div v-if="errors.roomTypeId" class="invalid-feedback">
                    {{ errors.roomTypeId }}
                  </div>
                </div>
                
                <div class="col-md-6">
                  <label for="roomNumber" class="form-label">
                    Habitación específica <span class="text-danger">*</span>
                  </label>
                  <select 
                    id="roomNumber"
                    v-model="form.roomNumber" 
                    class="form-select"
                    :class="{ 'is-invalid': errors.roomNumber }"
                    required
                    :disabled="isSaving || !availableRooms.length"
                    @change="updateRoomDetails"
                  >
                    <option value="">Seleccionar habitación</option>
                    <option v-for="room in availableRooms" :key="room.number" :value="room.number">
                      {{ room.number }} - {{ room.name }} (€{{ room.price }}/noche)
                    </option>
                  </select>
                  <div v-if="errors.roomNumber" class="invalid-feedback">
                    {{ errors.roomNumber }}
                  </div>
                  <div v-if="form.roomTypeId && !availableRooms.length" class="text-warning small mt-1">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    No hay habitaciones disponibles para las fechas seleccionadas
                  </div>
                </div>
              </div>

              <!-- Room Preview -->
              <div v-if="selectedRoomDetails" class="room-preview">
                <div class="card">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <img 
                        :src="selectedRoomDetails.image" 
                        class="img-fluid rounded-start h-100" 
                        style="object-fit: cover;"
                        :alt="selectedRoomDetails.name"
                        @error="handleImageError"
                      >
                    </div>
                    <div class="col-md-8">
                      <div class="card-body">
                        <h6 class="card-title">{{ selectedRoomDetails.name }}</h6>
                        <p class="card-text text-muted">{{ selectedRoomDetails.description }}</p>
                        <div class="room-features mb-3">
                          <span class="badge bg-light text-dark me-2">
                            <i class="bi bi-people"></i> {{ selectedRoomDetails.capacity }} personas
                          </span>
                          <span class="badge bg-light text-dark me-2">
                            <i class="bi bi-rulers"></i> {{ selectedRoomDetails.size }} m²
                          </span>
                          <span class="badge bg-light text-dark">
                            <i class="bi bi-building"></i> Piso {{ selectedRoomDetails.floor }}
                          </span>
                        </div>
                        <div class="amenities">
                          <strong>Servicios:</strong>
                          <div class="mt-1">
                            <span 
                              v-for="(amenity, index) in selectedRoomDetails.amenities" 
                              :key="index"
                              class="badge bg-primary bg-opacity-10 text-primary me-1 mb-1"
                            >
                              {{ amenity }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Confirmation -->
            <div v-show="currentStep === 4" class="step-content">
              <h6 class="mb-3">
                <i class="bi bi-check-circle me-2"></i>Confirmación y Pago
              </h6>
              
              <div class="row g-4">
                <!-- Reservation Summary -->
                <div class="col-md-8">
                  <div class="reservation-summary">
                    <h6>Resumen de la Reserva</h6>
                    
                    <div class="summary-section">
                      <h6 class="text-primary">Huésped</h6>
                      <p class="mb-1"><strong>{{ form.guestName }}</strong></p>
                      <p class="mb-1">{{ form.guestEmail }}</p>
                      <p class="mb-1">{{ form.guestPhone }}</p>
                      <p class="mb-0">{{ totalGuests }} {{ totalGuests === 1 ? 'huésped' : 'huéspedes' }}</p>
                    </div>
                    
                    <div class="summary-section">
                      <h6 class="text-primary">Fechas</h6>
                      <p class="mb-1"><strong>Entrada:</strong> {{ formatFullDate(form.checkIn) }}</p>
                      <p class="mb-1"><strong>Salida:</strong> {{ formatFullDate(form.checkOut) }}</p>
                      <p class="mb-0"><strong>Estancia:</strong> {{ nights }} {{ nights === 1 ? 'noche' : 'noches' }}</p>
                    </div>
                    
                    <div class="summary-section">
                      <h6 class="text-primary">Habitación</h6>
                      <p class="mb-1"><strong>{{ selectedRoomDetails?.name }}</strong></p>
                      <p class="mb-1">Habitación {{ form.roomNumber }}</p>
                      <p class="mb-0">{{ selectedRoomDetails?.capacity }} personas máximo</p>
                    </div>
                    
                    <div v-if="form.specialRequests" class="summary-section">
                      <h6 class="text-primary">Solicitudes Especiales</h6>
                      <p class="mb-0">{{ form.specialRequests }}</p>
                    </div>
                  </div>
                  
                  <div class="payment-section mt-4">
                    <h6>Información de Pago</h6>
                    
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label for="paymentMethod" class="form-label">
                          Método de pago <span class="text-danger">*</span>
                        </label>
                        <select 
                          id="paymentMethod"
                          v-model="form.paymentMethod" 
                          class="form-select"
                          :class="{ 'is-invalid': errors.paymentMethod }"
                          required
                          :disabled="isSaving"
                        >
                          <option value="">Seleccionar método</option>
                          <option value="Tarjeta de crédito">Tarjeta de crédito</option>
                          <option value="Tarjeta de débito">Tarjeta de débito</option>
                          <option value="PayPal">PayPal</option>
                          <option value="Transferencia bancaria">Transferencia bancaria</option>
                          <option value="Efectivo">Efectivo</option>
                        </select>
                        <div v-if="errors.paymentMethod" class="invalid-feedback">
                          {{ errors.paymentMethod }}
                        </div>
                      </div>
                      
                      <div class="col-md-6">
                        <label for="paymentStatus" class="form-label">
                          Estado del pago <span class="text-danger">*</span>
                        </label>
                        <select 
                          id="paymentStatus"
                          v-model="form.paymentStatus" 
                          class="form-select"
                          :class="{ 'is-invalid': errors.paymentStatus }"
                          required
                          :disabled="isSaving"
                        >
                          <option value="pending">Pendiente</option>
                          <option value="paid">Pagado</option>
                          <option value="partial">Pago parcial</option>
                        </select>
                        <div v-if="errors.paymentStatus" class="invalid-feedback">
                          {{ errors.paymentStatus }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Price Summary -->
                <div class="col-md-4">
                  <div class="price-summary">
                    <div class="card">
                      <div class="card-header">
                        <h6 class="mb-0">Desglose de Precios</h6>
                      </div>
                      <div class="card-body">
                        <div class="price-line">
                          <span>{{ selectedRoomDetails?.name }}</span>
                          <span>{{ formatPrice(roomBasePrice) }}</span>
                        </div>
                        <div class="price-line">
                          <span>{{ nights }} {{ nights === 1 ? 'noche' : 'noches' }}</span>
                          <span>{{ formatPrice(subtotal) }}</span>
                        </div>
                        <div class="price-line">
                          <span>IVA (21%)</span>
                          <span>{{ formatPrice(taxes) }}</span>
                        </div>
                        <hr>
                        <div class="price-line total">
                          <strong>Total</strong>
                          <strong>{{ formatPrice(total) }}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeModal"
              :disabled="isSaving"
            >
              Cancelar
            </button>
            
            <div class="step-navigation">
              <button 
                v-if="currentStep > 1"
                type="button" 
                class="btn btn-outline-primary me-2" 
                @click="previousStep"
                :disabled="isSaving"
              >
                <i class="bi bi-arrow-left me-1"></i>Anterior
              </button>
              
              <button 
                v-if="currentStep < 4"
                type="button" 
                class="btn btn-primary" 
                @click="nextStep"
                :disabled="!canContinue || isSaving"
              >
                Siguiente<i class="bi bi-arrow-right ms-1"></i>
              </button>
              
              <button 
                v-if="currentStep === 4"
                type="submit" 
                class="btn btn-success"
                :disabled="!isFormValid || isSaving"
              >
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <i v-else class="bi me-2" :class="isEditing ? 'bi-check-lg' : 'bi-plus-lg'"></i>
                {{ isSaving ? 'Guardando...' : (isEditing ? 'Actualizar Reserva' : 'Crear Reserva') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  reservation: {
    type: Object,
    default: null
  },
  roomTypes: {
    type: Array,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// State
const isSaving = ref(false);
const currentStep = ref(1);
const errors = ref({});
const availableRooms = ref([]);
const selectedRoomDetails = ref(null);

// Form data
const form = ref({
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  guestDocument: '',
  adults: 1,
  children: 0,
  checkIn: '',
  checkOut: '',
  roomTypeId: '',
  roomNumber: '',
  specialRequests: '',
  paymentMethod: 'Tarjeta de crédito',
  paymentStatus: 'pending',
  status: 'pending'
});

// Mock rooms data
const mockRooms = [
  {
    id: 1,
    number: '101',
    name: 'Habitación Estándar',
    typeId: 1,
    floor: 1,
    capacity: 2,
    size: 25,
    price: 89.00,
    description: 'Habitación acogedora con todas las comodidades necesarias.',
    image: '/images/room-standard.jpeg',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado']
  },
  {
    id: 2,
    number: '102',
    name: 'Habitación Estándar',
    typeId: 1,
    floor: 1,
    capacity: 2,
    size: 25,
    price: 89.00,
    description: 'Habitación acogedora con todas las comodidades necesarias.',
    image: '/images/room-standard.jpeg',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado']
  },
  {
    id: 3,
    number: '201',
    name: 'Habitación Deluxe',
    typeId: 2,
    floor: 2,
    capacity: 2,
    size: 35,
    price: 129.00,
    description: 'Habitación espaciosa con vistas panorámicas.',
    image: '/images/room-deluxe.jpeg',
    amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado']
  }
];

// Computed
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const minCheckOutDate = computed(() => {
  if (!form.value.checkIn) return minDate.value;
  
  const checkIn = new Date(form.value.checkIn);
  checkIn.setDate(checkIn.getDate() + 1);
  return checkIn.toISOString().split('T')[0];
});

const totalGuests = computed(() => {
  return parseInt(form.value.adults) + parseInt(form.value.children);
});

const nights = computed(() => {
  if (!form.value.checkIn || !form.value.checkOut) return 0;
  
  const checkIn = new Date(form.value.checkIn);
  const checkOut = new Date(form.value.checkOut);
  const diffTime = checkOut - checkIn;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

const roomBasePrice = computed(() => {
  return selectedRoomDetails.value?.price || 0;
});

const subtotal = computed(() => {
  return roomBasePrice.value * nights.value;
});

const taxes = computed(() => {
  return subtotal.value * 0.21; // 21% IVA
});

const total = computed(() => {
  return subtotal.value + taxes.value;
});

const canContinue = computed(() => {
  switch (currentStep.value) {
    case 1:
      return form.value.guestName && form.value.guestEmail && form.value.guestPhone && form.value.adults;
    case 2:
      return form.value.checkIn && form.value.checkOut && nights.value > 0;
    case 3:
      return form.value.roomTypeId && form.value.roomNumber;
    case 4:
      return form.value.paymentMethod && form.value.paymentStatus;
    default:
      return false;
  }
});

const isFormValid = computed(() => {
  return canContinue.value && currentStep.value === 4;
});

// Watchers
watch(() => props.reservation, (newReservation) => {
  if (newReservation && props.isEditing) {
    form.value = {
      id: newReservation.id,
      guestName: newReservation.guestName || '',
      guestEmail: newReservation.guestEmail || '',
      guestPhone: newReservation.guestPhone || '',
      guestDocument: newReservation.guestDocument || '',
      adults: newReservation.adults || 1,
      children: newReservation.children || 0,
      checkIn: newReservation.checkIn || '',
      checkOut: newReservation.checkOut || '',
      roomTypeId: newReservation.roomTypeId || '',
      roomNumber: newReservation.roomNumber || '',
      specialRequests: newReservation.specialRequests || '',
      paymentMethod: newReservation.paymentMethod || 'Tarjeta de crédito',
      paymentStatus: newReservation.paymentStatus || 'pending',
      status: newReservation.status || 'pending'
    };
    
    if (form.value.roomTypeId) {
      loadAvailableRooms();
      updateRoomDetails();
    }
  } else {
    resetForm();
  }
  errors.value = {};
}, { immediate: true });

watch(() => form.value.roomTypeId, (newTypeId) => {
  if (newTypeId && selectedRoomDetails.value) {
    if (!form.value.roomNumber || props.roomTypes.some(type => type.name === form.value.roomNumber)) {
      const roomType = props.roomTypes.find(type => type.id === parseInt(newTypeId));
      form.value.roomType = roomType?.name || '';
    }
  }
});

// Methods
function resetForm() {
  form.value = {
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    guestDocument: '',
    adults: 1,
    children: 0,
    checkIn: '',
    checkOut: '',
    roomTypeId: '',
    roomNumber: '',
    specialRequests: '',
    paymentMethod: 'Tarjeta de crédito',
    paymentStatus: 'pending',
    status: 'pending'
  };
  currentStep.value = 1;
  availableRooms.value = [];
  selectedRoomDetails.value = null;
}

function calculateNights() {
  nextTick(() => {
    if (form.value.checkIn && form.value.checkOut) {
      const checkIn = new Date(form.value.checkIn);
      const checkOut = new Date(form.value.checkOut);
      
      if (checkOut <= checkIn) {
        form.value.checkOut = '';
      }
    }
  });
}

function loadAvailableRooms() {
  if (!form.value.roomTypeId) {
    availableRooms.value = [];
    return;
  }
  
  // Mock: Filter rooms by type (in a real app, this would be an API call)
  availableRooms.value = mockRooms.filter(room => 
    room.typeId === parseInt(form.value.roomTypeId)
  );
}

function updateRoomDetails() {
  if (!form.value.roomNumber) {
    selectedRoomDetails.value = null;
    return;
  }
  
  selectedRoomDetails.value = availableRooms.value.find(room => 
    room.number === form.value.roomNumber
  );
  
  // Update room type name in form
  if (selectedRoomDetails.value) {
    const roomType = props.roomTypes.find(type => type.id === selectedRoomDetails.value.typeId);
    form.value.roomType = roomType?.name || '';
  }
}

function nextStep() {
  if (validateCurrentStep() && canContinue.value) {
    currentStep.value++;
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function validateCurrentStep() {
  errors.value = {};
  
  switch (currentStep.value) {
    case 1:
      if (!form.value.guestName.trim()) {
        errors.value.guestName = 'El nombre es requerido';
      }
      if (!form.value.guestEmail.trim()) {
        errors.value.guestEmail = 'El email es requerido';
      } else if (!isValidEmail(form.value.guestEmail)) {
        errors.value.guestEmail = 'El email no es válido';
      }
      if (!form.value.guestPhone.trim()) {
        errors.value.guestPhone = 'El teléfono es requerido';
      }
      if (!form.value.adults || form.value.adults < 1) {
        errors.value.adults = 'Debe haber al menos 1 adulto';
      }
      break;
      
    case 2:
      if (!form.value.checkIn) {
        errors.value.checkIn = 'La fecha de entrada es requerida';
      }
      if (!form.value.checkOut) {
        errors.value.checkOut = 'La fecha de salida es requerida';
      }
      if (form.value.checkIn && form.value.checkOut && nights.value <= 0) {
        errors.value.checkOut = 'La fecha de salida debe ser posterior a la entrada';
      }
      break;
      
    case 3:
      if (!form.value.roomTypeId) {
        errors.value.roomTypeId = 'El tipo de habitación es requerido';
      }
      if (!form.value.roomNumber) {
        errors.value.roomNumber = 'La habitación es requerida';
      }
      break;
      
    case 4:
      if (!form.value.paymentMethod) {
        errors.value.paymentMethod = 'El método de pago es requerido';
      }
      if (!form.value.paymentStatus) {
        errors.value.paymentStatus = 'El estado del pago es requerido';
      }
      break;
  }
  
  return Object.keys(errors.value).length === 0;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

function formatFullDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatPrice(price) {
  return price.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  });
}

function handleImageError(event) {
  event.target.src = '/images/room-placeholder.jpg';
}

async function handleSubmit() {
  if (!validateCurrentStep() || !isFormValid.value) {
    return;
  }
  
  isSaving.value = true;
  
  try {
    // Prepare data
    const reservationData = {
      ...form.value,
      nights: nights.value,
      total: total.value,
      roomType: selectedRoomDetails.value?.name || ''
    };
    
    // Emit save event
    emit('save', reservationData);
    
  } catch (error) {
    console.error('Error saving reservation:', error);
    errors.value.general = 'Error al guardar la reserva. Por favor, intenta de nuevo.';
  } finally {
    isSaving.value = false;
  }
}

function closeModal() {
  if (!isSaving.value) {
    emit('close');
  }
}
</script>

<style scoped>
.modal.show {
  display: block;
}

/* Steps styling */
.steps-container {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 15px;
  left: calc(50% + 20px);
  width: calc(100% - 40px);
  height: 2px;
  background: #dee2e6;
  z-index: 1;
}

.step.completed:not(:last-child)::after,
.step.active:not(:last-child)::after {
  background: #0d6efd;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #dee2e6;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  position: relative;
  z-index: 2;
}

.step.active .step-number {
  background: #0d6efd;
  color: white;
}

.step.completed .step-number {
  background: #198754;
  color: white;
}

.step-label {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6c757d;
}

.step.active .step-label,
.step.completed .step-label {
  color: #212529;
}

/* Step content */
.step-content {
  min-height: 400px;
}

/* Form styling */
.form-label {
  font-weight: 500;
}

.text-danger {
  font-weight: 600;
}

.invalid-feedback {
  display: block;
}

/* Stay summary */
.stay-summary {
  border: 1px solid #dee2e6;
}

/* Room preview */
.room-preview .card {
  border: 2px solid #0d6efd;
}

.room-features .badge {
  font-size: 0.75rem;
}

/* Summary sections */
.summary-section {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.summary-section h6 {
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Price summary */
.price-summary .card {
  border: 1px solid #dee2e6;
  position: sticky;
  top: 1rem;
}

.price-line {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.price-line.total {
  font-size: 1.125rem;
  margin-bottom: 0;
}

/* Navigation */
.step-navigation {
  display: flex;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .modal-dialog {
    max-width: 95%;
    margin: 1rem auto;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .steps-container {
    padding: 1rem;
  }
  
  .step-label {
    font-size: 0.75rem;
  }
  
  .step-content {
    min-height: 300px;
  }
  
  .col-md-6,
  .col-md-4,
  .col-md-8 {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .step-navigation {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 576px) {
  .steps-container .d-flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .step:not(:last-child)::after {
    display: none;
  }
  
  .room-preview .row {
    flex-direction: column;
  }
  
  .summary-section {
    padding: 0.75rem;
  }
}
</style>