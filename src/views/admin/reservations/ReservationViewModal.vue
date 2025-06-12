<!-- src/components/admin/ReservationViewModal.vue -->
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
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center w-100">
            <div class="reservation-header me-3">
              <span class="badge bg-primary fs-6 px-3 py-2">{{ formatReservationId(reservation?.id) }}</span>
            </div>
            <div class="flex-grow-1">
              <h5 class="modal-title mb-0">Reserva de {{ reservation?.guestName }}</h5>
              <div class="text-muted">{{ reservation?.guestEmail }}</div>
            </div>
            <div class="me-3">
              <span 
                class="badge fs-6 px-3 py-2" 
                :class="getStatusBadgeClass(reservation?.status)"
              >
                <i class="bi me-2" :class="getStatusIcon(reservation?.status)"></i>
                {{ getStatusLabel(reservation?.status) }}
              </span>
            </div>
          </div>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
          ></button>
        </div>
        
        <div class="modal-body">
          <div class="row g-4">
            <!-- Guest Information -->
            <div class="col-md-6">
              <div class="info-card h-100">
                <h6 class="text-primary mb-3">
                  <i class="bi bi-person me-2"></i>Información del Huésped
                </h6>
                <div class="guest-info">
                  <div class="d-flex align-items-center mb-3">
                    <img 
                      :src="reservation?.guestAvatar || '/images/avatar-placeholder.png'" 
                      class="rounded-circle me-3" 
                      width="60" 
                      height="60"
                      alt="Guest Avatar"
                      @error="handleImageError"
                    >
                    <div>
                      <h6 class="mb-1">{{ reservation?.guestName }}</h6>
                      <div class="text-muted">Huésped principal</div>
                    </div>
                  </div>
                  
                  <div class="info-list">
                    <div class="info-item">
                      <span class="label">
                        <i class="bi bi-envelope me-2"></i>Email:
                      </span>
                      <span class="value">{{ reservation?.guestEmail }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">
                        <i class="bi bi-telephone me-2"></i>Teléfono:
                      </span>
                      <span class="value">{{ reservation?.guestPhone }}</span>
                    </div>
                    <div v-if="reservation?.guestDocument" class="info-item">
                      <span class="label">
                        <i class="bi bi-card-text me-2"></i>Documento:
                      </span>
                      <span class="value">{{ reservation?.guestDocument }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">
                        <i class="bi bi-people me-2"></i>Huéspedes:
                      </span>
                      <span class="value">
                        {{ reservation?.adults }} adulto{{ reservation?.adults !== 1 ? 's' : '' }}
                        <span v-if="reservation?.children > 0">
                          + {{ reservation?.children }} niño{{ reservation?.children !== 1 ? 's' : '' }}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Room Information -->
            <div class="col-md-6">
              <div class="info-card h-100">
                <h6 class="text-primary mb-3">
                  <i class="bi bi-door-open me-2"></i>Información de la Habitación
                </h6>
                <div class="room-info">
                  <div class="room-details mb-3">
                    <h6 class="mb-1">{{ reservation?.roomType }}</h6>
                    <div class="text-muted">Habitación {{ reservation?.roomNumber }}</div>
                  </div>
                  
                  <div class="info-list">
                    <div class="info-item">
                      <span class="label">Precio por noche:</span>
                      <span class="value fw-bold">{{ formatPrice(roomNightlyRate) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Noches:</span>
                      <span class="value">{{ reservation?.nights || calculateNights() }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Subtotal:</span>
                      <span class="value">{{ formatPrice(subtotal) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">Total:</span>
                      <span class="value text-success fw-bold fs-5">{{ formatPrice(reservation?.total) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dates and Stay Information -->
          <div class="row g-4 mt-2">
            <div class="col-12">
              <div class="info-card">
                <h6 class="text-primary mb-3">
                  <i class="bi bi-calendar-range me-2"></i>Fechas de Estancia
                </h6>
                <div class="stay-timeline">
                  <div class="row">
                    <div class="col-md-4 text-center">
                      <div class="date-card check-in">
                        <div class="date-icon">
                          <i class="bi bi-calendar-plus"></i>
                        </div>
                        <div class="date-info">
                          <div class="date-label">Check-in</div>
                          <div class="date-value">{{ formatFullDate(reservation?.checkIn) }}</div>
                          <div class="date-day">{{ getDayName(reservation?.checkIn) }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4 text-center">
                      <div class="stay-duration">
                        <div class="duration-icon">
                          <i class="bi bi-moon"></i>
                        </div>
                        <div class="duration-value">{{ reservation?.nights || calculateNights() }}</div>
                        <div class="duration-label">{{ (reservation?.nights || calculateNights()) === 1 ? 'noche' : 'noches' }}</div>
                      </div>
                    </div>
                    <div class="col-md-4 text-center">
                      <div class="date-card check-out">
                        <div class="date-icon">
                          <i class="bi bi-calendar-minus"></i>
                        </div>
                        <div class="date-info">
                          <div class="date-label">Check-out</div>
                          <div class="date-value">{{ formatFullDate(reservation?.checkOut) }}</div>
                          <div class="date-day">{{ getDayName(reservation?.checkOut) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="row g-4 mt-2">
            <div class="col-md-6">
              <div class="info-card">
                <h6 class="text-primary mb-3">
                  <i class="bi bi-credit-card me-2"></i>Información de Pago
                </h6>
                <div class="payment-info">
                  <div class="info-list">
                    <div class="info-item">
                      <span class="label">Método de pago:</span>
                      <span class="value">
                        <i class="bi me-2" :class="getPaymentIcon(reservation?.paymentMethod)"></i>
                        {{ reservation?.paymentMethod }}
                      </span>
                    </div>
                    <div class="info-item">
                      <span class="label">Estado del pago:</span>
                      <span class="value">
                        <span 
                          class="badge"
                          :class="getPaymentStatusBadgeClass(reservation?.paymentStatus)"
                        >
                          {{ getPaymentStatusLabel(reservation?.paymentStatus) }}
                        </span>
                      </span>
                    </div>
                    <div class="info-item">
                      <span class="label">Total pagado:</span>
                      <span class="value fw-bold">
                        {{ reservation?.paymentStatus === 'paid' ? formatPrice(reservation?.total) : '€0,00' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Reservation Timeline -->
            <div class="col-md-6">
              <div class="info-card">
                <h6 class="text-primary mb-3">
                  <i class="bi bi-clock-history me-2"></i>Historial de la Reserva
                </h6>
                <div class="timeline">
                  <div class="timeline-item">
                    <div class="timeline-marker bg-success"></div>
                    <div class="timeline-content">
                      <div class="timeline-title">Reserva creada</div>
                      <div class="timeline-date">{{ formatDateTime(reservation?.createdAt) }}</div>
                    </div>
                  </div>
                  <div v-if="reservation?.status !== 'pending'" class="timeline-item">
                    <div class="timeline-marker bg-primary"></div>
                    <div class="timeline-content">
                      <div class="timeline-title">Estado: {{ getStatusLabel(reservation?.status) }}</div>
                      <div class="timeline-date">{{ formatDateTime(reservation?.updatedAt) }}</div>
                    </div>
                  </div>
                  <div v-if="isUpcoming" class="timeline-item">
                    <div class="timeline-marker bg-warning"></div>
                    <div class="timeline-content">
                      <div class="timeline-title">Check-in programado</div>
                      <div class="timeline-date">{{ formatFullDate(reservation?.checkIn) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Special Requests -->
          <div v-if="reservation?.specialRequests" class="row g-4 mt-2">
            <div class="col-12">
              <div class="info-card">
                <h6 class="text-primary mb-3">
                  <i class="bi bi-chat-square-text me-2"></i>Solicitudes Especiales
                </h6>
                <div class="special-requests">
                  <p class="mb-0">{{ reservation?.specialRequests }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="row g-4 mt-2">
            <div class="col-12">
              <div class="quick-actions">
                <h6 class="text-primary mb-3">
                  <i class="bi bi-lightning me-2"></i>Acciones Rápidas
                </h6>
                <div class="d-flex flex-wrap gap-2">
                  <button 
                    v-if="reservation?.status === 'pending'"
                    class="btn btn-outline-success btn-sm"
                    @click="changeStatus('confirmed')"
                  >
                    <i class="bi bi-check-lg me-1"></i>Confirmar Reserva
                  </button>
                  
                  <button 
                    v-if="reservation?.status === 'confirmed' && canCheckin"
                    class="btn btn-outline-primary btn-sm"
                    @click="changeStatus('checkedin')"
                  >
                    <i class="bi bi-door-open me-1"></i>Realizar Check-in
                  </button>
                  
                  <button 
                    v-if="reservation?.status === 'checkedin'"
                    class="btn btn-outline-info btn-sm"
                    @click="changeStatus('completed')"
                  >
                    <i class="bi bi-door-closed me-1"></i>Realizar Check-out
                  </button>
                  
                  <button 
                    v-if="canCancel"
                    class="btn btn-outline-warning btn-sm"
                    @click="changeStatus('cancelled')"
                  >
                    <i class="bi bi-x-circle me-1"></i>Cancelar Reserva
                  </button>
                  
                  <button 
                    class="btn btn-outline-secondary btn-sm"
                    @click="sendConfirmationEmail"
                  >
                    <i class="bi bi-envelope me-1"></i>Enviar Confirmación
                  </button>
                  
                  <button 
                    class="btn btn-outline-secondary btn-sm"
                    @click="printReservation"
                  >
                    <i class="bi bi-printer me-1"></i>Imprimir
                  </button>
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
          >
            <i class="bi bi-x-lg me-2"></i>Cerrar
          </button>
          <div class="btn-group">
            <button 
              type="button" 
              class="btn btn-outline-primary" 
              @click="handleEdit"
            >
              <i class="bi bi-pencil me-2"></i>Editar
            </button>
            <button 
              type="button" 
              class="btn btn-outline-danger" 
              @click="handleDelete"
            >
              <i class="bi bi-trash me-2"></i>Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  reservation: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['close', 'edit', 'delete', 'status-change']);

// Computed
const roomNightlyRate = computed(() => {
  if (!props.reservation?.total || !props.reservation?.nights) return 0;
  return props.reservation.total / (props.reservation.nights * 1.21); // Remove tax
});

const subtotal = computed(() => {
  return props.reservation?.total ? props.reservation.total / 1.21 : 0;
});

const isUpcoming = computed(() => {
  if (!props.reservation?.checkIn) return false;
  const checkInDate = new Date(props.reservation.checkIn);
  const today = new Date();
  return checkInDate > today;
});

const canCheckin = computed(() => {
  if (!props.reservation?.checkIn) return false;
  const checkInDate = new Date(props.reservation.checkIn);
  const today = new Date();
  const daysDiff = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
  return daysDiff <= 1 && daysDiff >= 0;
});

const canCancel = computed(() => {
  return ['pending', 'confirmed'].includes(props.reservation?.status);
});

// Methods
function closeModal() {
  emit('close');
}

function handleEdit() {
  emit('edit', props.reservation);
}

function handleDelete() {
  emit('delete', props.reservation);
}

function changeStatus(newStatus) {
  const statusActions = {
    'confirmed': 'confirmar',
    'cancelled': 'cancelar',
    'checkedin': 'realizar check-in para',
    'completed': 'realizar check-out para'
  };
  
  const action = statusActions[newStatus];
  if (confirm(`¿Estás seguro de que deseas ${action} esta reserva?`)) {
    emit('status-change', newStatus);
  }
}

function sendConfirmationEmail() {
  // Mock action
  alert('Email de confirmación enviado a ' + props.reservation?.guestEmail);
}

function printReservation() {
  // Mock action
  window.print();
}

function calculateNights() {
  if (!props.reservation?.checkIn || !props.reservation?.checkOut) return 0;
  
  const checkIn = new Date(props.reservation.checkIn);
  const checkOut = new Date(props.reservation.checkOut);
  const diffTime = checkOut - checkIn;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

function formatReservationId(id) {
  if (!id) return '';
  return `RES-${id.toString().padStart(4, '0')}`;
}

function formatPrice(price) {
  if (!price) return '€0,00';
  return price.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  });
}

function formatFullDate(dateString) {
  if (!dateString) return 'No disponible';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatDateTime(dateString) {
  if (!dateString) return 'No disponible';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getDayName(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
}

function getStatusLabel(status) {
  const statusLabels = {
    'confirmed': 'Confirmada',
    'pending': 'Pendiente',
    'cancelled': 'Cancelada',
    'completed': 'Completada',
    'checkedin': 'Check-in realizado'
  };
  
  return statusLabels[status] || status;
}

function getStatusBadgeClass(status) {
  const statusClasses = {
    'confirmed': 'bg-success',
    'pending': 'bg-warning text-dark',
    'cancelled': 'bg-danger',
    'completed': 'bg-info',
    'checkedin': 'bg-primary'
  };
  
  return statusClasses[status] || 'bg-secondary';
}

function getStatusIcon(status) {
  const statusIcons = {
    'confirmed': 'bi-check-circle-fill',
    'pending': 'bi-clock-fill',
    'cancelled': 'bi-x-circle-fill',
    'completed': 'bi-check2-circle',
    'checkedin': 'bi-door-open-fill'
  };
  
  return statusIcons[status] || 'bi-question-circle';
}

function getPaymentIcon(method) {
  const icons = {
    'Tarjeta de crédito': 'bi-credit-card',
    'Tarjeta de débito': 'bi-credit-card-2-front',
    'PayPal': 'bi-paypal',
    'Transferencia bancaria': 'bi-bank',
    'Efectivo': 'bi-cash'
  };
  
  return icons[method] || 'bi-credit-card';
}

function getPaymentStatusLabel(status) {
  const labels = {
    'paid': 'Pagado',
    'pending': 'Pendiente',
    'partial': 'Pago parcial'
  };
  
  return labels[status] || status;
}

function getPaymentStatusBadgeClass(status) {
  const classes = {
    'paid': 'bg-success',
    'pending': 'bg-warning text-dark',
    'partial': 'bg-info'
  };
  
  return classes[status] || 'bg-secondary';
}

function handleImageError(event) {
  event.target.src = '/images/avatar-placeholder.png';
}
</script>

<style scoped>
.modal.show {
  display: block;
}

.reservation-header .badge {
  font-size: 1rem;
  font-weight: 600;
}

.info-card {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.25rem;
  border: 1px solid #e9ecef;
  height: 100%;
}

.guest-info .info-list,
.room-info .info-list,
.payment-info .info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #dee2e6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: 500;
  color: #6c757d;
  flex: 1;
}

.info-item .value {
  font-weight: 600;
  color: #212529;
  text-align: right;
}

/* Stay timeline */
.stay-timeline {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0.5rem;
  padding: 2rem;
  color: white;
}

.date-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 1rem;
  backdrop-filter: blur(10px);
}

.date-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.date-value {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0.5rem 0;
}

.date-label,
.date-day {
  font-size: 0.875rem;
  opacity: 0.9;
}

.stay-duration {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.duration-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.duration-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.duration-label {
  font-size: 1rem;
  opacity: 0.9;
}

/* Timeline */
.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 9px;
  top: 20px;
  width: 2px;
  height: calc(100% + 1rem);
  background: #dee2e6;
  z-index: 1;
}

.timeline-marker {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 1rem;
  position: relative;
  z-index: 2;
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-weight: 600;
  color: #212529;
}

.timeline-date {
  font-size: 0.875rem;
  color: #6c757d;
}

/* Special requests */
.special-requests {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 0.375rem;
  padding: 1rem;
  font-style: italic;
}

/* Quick actions */
.quick-actions {
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 0.5rem;
  padding: 1.25rem;
}

.btn-group .btn {
  margin-left: 0.5rem;
}

.btn-group .btn:first-child {
  margin-left: 0;
}

@media (max-width: 768px) {
  .modal-dialog {
    max-width: 95%;
    margin: 1rem auto;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .stay-timeline {
    padding: 1rem;
  }
  
  .stay-timeline .row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .duration-icon {
    font-size: 2rem;
  }
  
  .duration-value {
    font-size: 2rem;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    text-align: left;
  }
  
  .info-item .value {
    text-align: left;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn-group {
    width: 100%;
    display: flex;
  }
  
  .btn-group .btn {
    flex: 1;
    margin-left: 0;
    margin-right: 0.25rem;
  }
  
  .btn-group .btn:last-child {
    margin-right: 0;
  }
  
  .quick-actions .d-flex {
    flex-direction: column;
    align-items: stretch;
  }
  
  .quick-actions .btn {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 576px) {
  .modal-header .d-flex {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .reservation-header {
    margin-bottom: 0.5rem;
  }
  
  .date-icon {
    font-size: 1.5rem;
  }
  
  .date-value {
    font-size: 1rem;
  }
  
  .timeline-item {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .timeline-marker {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
}
</style>