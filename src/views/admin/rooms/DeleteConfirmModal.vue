<!-- src/components/admin/DeleteConfirmModal.vue -->
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
            Confirmar Eliminación
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
            :disabled="isDeleting"
          ></button>
        </div>
        
        <div class="modal-body">
          <!-- Room Info Summary -->
          <div class="room-summary mb-4">
            <div class="d-flex align-items-center">
              <div class="room-image me-3">
                <img 
                  :src="room?.image || '/images/room-placeholder.jpg'" 
                  class="rounded" 
                  width="60" 
                  height="60"
                  style="object-fit: cover;"
                  :alt="room?.name"
                  @error="handleImageError"
                >
              </div>
              <div class="room-details">
                <h6 class="mb-1">
                  <span class="badge bg-primary me-2">{{ room?.number }}</span>
                  {{ room?.name }}
                </h6>
                <p class="text-muted mb-0 small">{{ room?.type }} • Piso {{ room?.floor }}</p>
              </div>
            </div>
          </div>

          <!-- Warning Message -->
          <div class="warning-section">
            <p class="mb-3">
              ¿Estás seguro de que deseas eliminar permanentemente esta habitación?
            </p>
            
            <div class="alert alert-danger">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>¡Esta acción no se puede deshacer!</strong>
              <ul class="mb-0 mt-2">
                <li>Se eliminará toda la información de la habitación</li>
                <li>Se perderán las estadísticas y el historial</li>
                <li>No podrá recuperarse una vez confirmada</li>
              </ul>
            </div>

            <!-- Status-specific warnings -->
            <div v-if="room?.status === 'occupied'" class="alert alert-warning">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Advertencia:</strong> Esta habitación está actualmente <strong>ocupada</strong>. 
              Eliminarla podría afectar a las reservas existentes y causar problemas con los huéspedes actuales.
            </div>

            <div v-if="hasActiveReservations" class="alert alert-danger">
              <i class="bi bi-calendar-x-fill me-2"></i>
              <strong>¡Atención!</strong> Esta habitación tiene <strong>{{ reservationsCount }}</strong> 
              {{ reservationsCount === 1 ? 'reserva activa' : 'reservas activas' }} que también 
              {{ reservationsCount === 1 ? 'será eliminada' : 'serán eliminadas' }}.
            </div>

            <div v-if="hasFutureReservations" class="alert alert-warning">
              <i class="bi bi-calendar-event-fill me-2"></i>
              <strong>Reservas futuras:</strong> Hay {{ futureReservationsCount }} 
              {{ futureReservationsCount === 1 ? 'reserva programada' : 'reservas programadas' }} 
              para esta habitación que también {{ futureReservationsCount === 1 ? 'será cancelada' : 'serán canceladas' }}.
            </div>
          </div>

          <!-- Confirmation Input -->
          <div class="confirmation-section mt-4">
            <label for="confirmText" class="form-label fw-bold">
              Para confirmar, escribe el número de habitación: <code>{{ room?.number }}</code>
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
              :placeholder="`Escribe ${room?.number} para confirmar`"
              :disabled="isDeleting"
              autocomplete="off"
            >
            <div v-if="confirmationText && !isConfirmationValid" class="invalid-feedback">
              El número de habitación no coincide
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
                Entiendo que esta acción es irreversible y eliminar permanentemente la habitación
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
            {{ isDeleting ? 'Eliminando...' : 'Eliminar Habitación' }}
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
  room: {
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

// Mock data for reservations (in a real app, this would come from props or API)
const hasActiveReservations = computed(() => {
  return props.room?.status === 'occupied';
});

const reservationsCount = computed(() => {
  return hasActiveReservations.value ? 1 : 0;
});

const hasFutureReservations = computed(() => {
  // Mock: randomly determine if there are future reservations
  return Math.random() > 0.7;
});

const futureReservationsCount = computed(() => {
  return hasFutureReservations.value ? Math.floor(Math.random() * 3) + 1 : 0;
});

// Computed
const isConfirmationValid = computed(() => {
  return confirmationText.value.trim() === props.room?.number?.trim();
});

const canDelete = computed(() => {
  return isConfirmationValid.value && finalConfirmation.value;
});

// Watchers
watch(() => props.show, (newShow) => {
  if (newShow) {
    // Reset form when modal opens
    confirmationText.value = '';
    finalConfirmation.value = false;
  }
});

watch(() => props.room, () => {
  // Reset form when room changes
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

function handleImageError(event) {
  event.target.src = '/images/room-placeholder.jpg';
}
</script>

<style scoped>
.modal.show {
  display: block;
}

.room-summary {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
}

.room-image img {
  border: 2px solid #dee2e6;
}

.warning-section .alert {
  margin-bottom: 1rem;
}

.warning-section .alert:last-child {
  margin-bottom: 0;
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
  border: 2px solid #ffc107;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
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
  
  .room-summary .d-flex {
    flex-direction: column;
    text-align: center;
  }
  
  .room-image {
    align-self: center;
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
}
</style>