<!-- src/components/admin/DeleteConfirmReservationModal.vue -->
<template>
  <div 
    class="modal fade show d-block" 
    tabindex="-1" 
    role="dialog" 
    style="background-color: rgba(0,0,0,0.5);"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header border-0 pb-2">
          <h5 class="modal-title text-danger">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            Confirmar Eliminación de Reserva
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
            :disabled="isDeleting"
          ></button>
        </div>
        
        <div class="modal-body">
          <!-- Reservation Summary -->
          <div class="reservation-summary mb-4">
            <div class="d-flex align-items-center">
              <div class="guest-avatar me-3">
                <img 
                  :src="reservation?.guestAvatar || '/images/avatar-placeholder.png'" 
                  class="rounded-circle" 
                  width="50" 
                  height="50"
                  style="object-fit: cover;"
                  :alt="reservation?.guestName"
                  @error="handleImageError"
                >
              </div>
              <div class="reservation-details flex-grow-1">
                <h6 class="mb-1">
                  <span class="badge bg-primary me-2">{{ formatReservationId(reservation?.id) }}</span>
                  {{ reservation?.guestName }}
                </h6>
                <div class="text-muted small">
                  <div>{{ reservation?.guestEmail }}</div>
                  <div>
                    Habitación {{ reservation?.roomNumber }} • {{ reservation?.roomType }}
                  </div>
                  <div>
                    {{ formatDate(reservation?.checkIn) }} - {{ formatDate(reservation?.checkOut) }}
                    ({{ calculateNights() }} {{ calculateNights() === 1 ? 'noche' : 'noches' }})
                  </div>
                </div>
              </div>
              <div class="reservation-status">
                <span 
                  class="badge" 
                  :class="getStatusBadgeClass(reservation?.status)"
                >
                  {{ getStatusLabel(reservation?.status) }}
                </span>
                <div class="text-end mt-1">
                  <strong>{{ formatPrice(reservation?.total) }}</strong>
                </div>
              </div>
            </div>
          </div>

          <!-- Warning Message -->
          <div class="warning-section">
            <p class="mb-3">
              ¿Estás seguro de que deseas eliminar permanentemente esta reserva?
            </p>
            
            <div class="alert alert-danger">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>¡Esta acción no se puede deshacer!</strong>
              <ul class="mb-0 mt-2">
                <li>Se eliminará toda la información de la reserva</li>
                <li>Se perderá el historial de pagos y comunicaciones</li>
                <li>No se podrá recuperar una vez confirmada</li>
              </ul>
            </div>

            <!-- Status-specific warnings -->
            <div v-if="reservation?.status === 'confirmed'" class="alert alert-warning">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Advertencia:</strong> Esta reserva está <strong>confirmada</strong>. 
              Eliminarla podría afectar al huésped que espera su estancia.
            </div>

            <div v-if="reservation?.status === 'checkedin'" class="alert alert-danger">
              <i class="bi bi-door-open-fill me-2"></i>
              <strong>¡Atención!</strong> El huésped ya ha realizado el <strong>check-in</strong>. 
              Eliminar esta reserva podría causar problemas graves con la facturación y el historial.
            </div>

            <div v-if="isUpcoming" class="alert alert-warning">
              <i class="bi bi-calendar-event-fill me-2"></i>
              <strong>Reserva próxima:</strong> El check-in está programado para 
              {{ formatDate(reservation?.checkIn) }} ({{ daysUntilCheckIn }} 
              {{ Math.abs(daysUntilCheckIn) === 1 ? 'día' : 'días' }}). 
              Considera cancelar en lugar de eliminar.
            </div>

            <div v-if="reservation?.paymentStatus === 'paid'" class="alert alert-info">
              <i class="bi bi-credit-card-fill me-2"></i>
              <strong>Pago realizado:</strong> Esta reserva ya ha sido pagada 
              ({{ formatPrice(reservation?.total) }}). Asegúrate de gestionar el reembolso si es necesario.
            </div>
          </div>

          <!-- Alternative Actions -->
          <div class="alternative-actions mt-4">
            <h6 class="text-primary mb-3">Alternativas recomendadas:</h6>
            <div class="d-grid gap-2">
              <button 
                v-if="canCancel"
                class="btn btn-outline-warning btn-sm text-start"
                @click="cancelInstead"
                :disabled="isDeleting"
              >
                <i class="bi bi-x-circle me-2"></i>
                <strong>Cancelar reserva</strong> en lugar de eliminar (recomendado)
                <div class="small text-muted">Mantiene el historial pero marca como cancelada</div>
              </button>
              
              <button 
                class="btn btn-outline-info btn-sm text-start"
                @click="contactGuest"
                :disabled="isDeleting"
              >
                <i class="bi bi-envelope me-2"></i>
                <strong>Contactar al huésped</strong> antes de eliminar
                <div class="small text-muted">Enviar email explicando la situación</div>
              </button>
            </div>
          </div>

          <!-- Confirmation Input -->
          <div class="confirmation-section mt-4">
            <label for="confirmText" class="form-label fw-bold">
              Para confirmar la eliminación, escribe: <code>ELIMINAR</code>
            </label>
            <input 
              type="text" 
              id="confirmText"
              v-model="confirmationText" 
              class="form-control"
              :class="{ 
                'is-valid': isConfirmationValid, 
                'is-invalid': confirmationText && !isConfirmationValid 
              }"
              placeholder="Escribe ELIMINAR para confirmar"
              :disabled="isDeleting"
              autocomplete="off"
            >
            <div v-if="confirmationText && !isConfirmationValid" class="invalid-feedback">
              Debes escribir exactamente "ELIMINAR"
            </div>
          </div>

          <!-- Final Warning -->
          <div class="final-warning mt-4 p-3 bg-light rounded">
            <div class="form-check">
              <input 
                class="form-check-input" 
                type="checkbox" 
                id="finalConfirm"
                v-model="finalConfirmation"
                :disabled="isDeleting"
              >
              <label class="form-check-label text-danger fw-bold" for="finalConfirm">
                Entiendo las consecuencias y confirmo que quiero eliminar permanentemente esta reserva
              </label>
            </div>
          </div>
        </div>
        
        <div class="modal-footer border-0 pt-2">
          <button 
            type="button" 
            class="btn btn-secondary" 
            @click="closeModal"
            :disabled="isDeleting"
          >
            <i class="bi bi-x-lg me-2"></i>Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-danger" 
            @click="confirmDelete"
            :disabled="!canDelete || isDeleting"
          >
            <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" role="status"></span>
            <i v-else class="bi bi-trash-fill me-2"></i>
            {{ isDeleting ? 'Eliminando...' : 'Eliminar Reserva Permanentemente' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

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
  isDeleting: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close', 'confirm']);

// State
const confirmationText = ref('');
const finalConfirmation = ref(false);

// Computed
const isConfirmationValid = computed(() => {
  return confirmationText.value.trim().toUpperCase() === 'ELIMINAR';
});

const canDelete = computed(() => {
  return isConfirmationValid.value && finalConfirmation.value;
});

const canCancel = computed(() => {
  return ['pending', 'confirmed'].includes(props.reservation?.status);
});

const isUpcoming = computed(() => {
  if (!props.reservation?.checkIn) return false;
  const checkInDate = new Date(props.reservation.checkIn);
  const today = new Date();
  return checkInDate >= today;
});

const daysUntilCheckIn = computed(() => {
  if (!props.reservation?.checkIn) return 0;
  const checkInDate = new Date(props.reservation.checkIn);
  const today = new Date();
  const diffTime = checkInDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Watchers
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Reset form when modal opens
    confirmationText.value = '';
    finalConfirmation.value = false;
  }
});

watch(() => props.reservation, () => {
  // Reset form when reservation changes
  confirmationText.value = '';
  finalConfirmation.value = false;
});

// Methods
function closeModal() {
  if (!props.isDeleting) {
    confirmationText.value = '';
    finalConfirmation.value = false;
    emit('close');
  }
}

function confirmDelete() {
  if (canDelete.value && !props.isDeleting) {
    emit('confirm');
  }
}

function cancelInstead() {
  // Close this modal and trigger cancel action
  closeModal();
  // In a real app, this would emit a cancel event or call a cancel method
  setTimeout(() => {
    if (confirm(`¿Cancelar la reserva ${formatReservationId(props.reservation?.id)} en lugar de eliminarla?`)) {
      alert('Reserva cancelada exitosamente');
    }
  }, 100);
}

function contactGuest() {
  // Mock action to contact guest
  const email = props.reservation?.guestEmail;
  const subject = `Regarding your reservation ${formatReservationId(props.reservation?.id)}`;
  const body = `Dear ${props.reservation?.guestName},\n\nWe need to discuss your upcoming reservation.\n\nBest regards,\nHotel Team`;
  
  const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailtoLink, '_blank');
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

function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

function formatPrice(price) {
  if (!price) return '€0,00';
  
  return price.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  });
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

function handleImageError(event) {
  event.target.src = '/images/avatar-placeholder.png';
}
</script>

<style scoped>
.modal.show {
  display: block;
}

.reservation-summary {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.guest-avatar img {
  border: 2px solid #dee2e6;
}

.warning-section .alert {
  margin-bottom: 1rem;
}

.warning-section .alert:last-child {
  margin-bottom: 0;
}

.alternative-actions {
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
}

.alternative-actions .btn {
  text-align: left;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  transition: all 0.2s ease;
}

.alternative-actions .btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.confirmation-section {
  border-top: 1px solid #dee2e6;
  padding-top: 1rem;
}

.confirmation-section code {
  background: #f8f9fa;
  color: #d63384;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

.final-warning {
  border: 2px solid #dc3545;
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
}

.final-warning .form-check-label {
  font-size: 0.9rem;
  line-height: 1.4;
}

.btn-danger:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.invalid-feedback {
  display: block;
}

.is-valid {
  border-color: #198754;
}

.is-valid:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}

.is-invalid {
  border-color: #dc3545;
}

.is-invalid:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.25rem rgba(220, 53, 69, 0.25);
}

@media (max-width: 576px) {
  .modal-dialog {
    max-width: 95%;
    margin: 1rem auto;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .reservation-summary .d-flex {
    flex-direction: column;
    text-align: center;
  }
  
  .guest-avatar {
    align-self: center;
    margin-bottom: 1rem;
  }
  
  .reservation-details {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .modal-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .modal-footer .btn {
    width: 100%;
  }
  
  .alert ul {
    padding-left: 1rem;
  }
  
  .confirmation-section code {
    display: block;
    margin-top: 0.25rem;
  }
  
  .alternative-actions .btn {
    padding: 1rem;
  }
}
</style>