<!-- src/components/admin/RoomViewModal.vue -->
<template>
  <div 
    class="modal fade show d-block" 
    tabindex="-1" 
    role="dialog" 
    style="background-color: rgba(0,0,0,0.5);"
    @click.self="closeModal"
  >
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <div class="d-flex align-items-center">
            <div class="room-number-badge me-3">
              <span class="badge bg-primary fs-6 px-3 py-2">{{ room?.number }}</span>
            </div>
            <div>
              <h5 class="modal-title mb-0">{{ room?.name }}</h5>
              <div class="text-muted">{{ room?.type }}</div>
            </div>
          </div>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
          ></button>
        </div>
        
        <div class="modal-body">
          <!-- Room Image -->
          <div v-if="room?.image" class="text-center mb-4">
            <img 
              :src="room.image" 
              class="img-fluid rounded shadow-sm" 
              style="max-height: 300px; width: 100%; object-fit: cover;"
              :alt="room.name"
              @error="handleImageError"
            >
          </div>

          <!-- Status Badge -->
          <div class="text-center mb-4">
            <span 
              class="badge fs-6 px-3 py-2" 
              :class="getStatusBadgeClass(room?.status)"
            >
              <i class="bi me-2" :class="getStatusIcon(room?.status)"></i>
              {{ getStatusLabel(room?.status) }}
            </span>
          </div>

          <!-- Room Details Grid -->
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <div class="info-card h-100">
                <h6 class="text-primary mb-3">
                  <i class="bi bi-info-circle me-2"></i>Información General
                </h6>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">Piso:</span>
                    <span class="value">{{ room?.floor }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Capacidad:</span>
                    <span class="value">
                      <i class="bi bi-people me-1"></i>{{ room?.capacity }} persona{{ room?.capacity !== 1 ? 's' : '' }}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="label">Tamaño:</span>
                    <span class="value">
                      <i class="bi bi-rulers me-1"></i>{{ room?.size }} m²
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="label">Precio por noche:</span>
                    <span class="value text-success fw-bold">
                      <i class="bi bi-currency-euro me-1"></i>{{ formatPrice(room?.price) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="info-card h-100">
                <h6 class="text-primary mb-3">
                  <i class="bi bi-star me-2"></i>Calificación y Estadísticas
                </h6>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">Calificación:</span>
                    <span class="value">
                      <div class="rating">
                        <span class="stars me-2">
                          <i v-for="star in 5" :key="star" 
                             class="bi" 
                             :class="star <= Math.floor(room?.rating || 0) ? 'bi-star-fill text-warning' : 'bi-star text-muted'">
                          </i>
                        </span>
                        <span class="rating-value">{{ room?.rating || 0 }}/5</span>
                      </div>
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="label">Reseñas:</span>
                    <span class="value">{{ room?.reviewCount || 0 }} reseñas</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Creada:</span>
                    <span class="value">{{ formatDate(room?.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">Última actualización:</span>
                    <span class="value">{{ formatDate(room?.updatedAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="room?.description" class="mb-4">
            <h6 class="text-primary mb-3">
              <i class="bi bi-file-text me-2"></i>Descripción
            </h6>
            <div class="description-box">
              <p class="mb-0">{{ room.description }}</p>
            </div>
          </div>

          <!-- Amenities -->
          <div v-if="room?.amenities && room.amenities.length > 0" class="mb-4">
            <h6 class="text-primary mb-3">
              <i class="bi bi-check2-square me-2"></i>Servicios y Comodidades
            </h6>
            <div class="amenities-grid">
              <div 
                v-for="(amenity, index) in room.amenities" 
                :key="index"
                class="amenity-item"
              >
                <i class="bi bi-check-circle-fill text-success me-2"></i>
                {{ amenity }}
              </div>
            </div>
          </div>

          <!-- Reservations Summary (if available) -->
          <div v-if="room?.status === 'occupied'" class="mb-4">
            <h6 class="text-primary mb-3">
              <i class="bi bi-calendar-check me-2"></i>Estado de Ocupación
            </h6>
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              Esta habitación está actualmente ocupada. Para más detalles sobre la reserva, 
              consulta el módulo de reservas.
            </div>
          </div>

          <!-- Maintenance Info (if in maintenance) -->
          <div v-if="room?.status === 'maintenance'" class="mb-4">
            <h6 class="text-danger mb-3">
              <i class="bi bi-tools me-2"></i>Estado de Mantenimiento
            </h6>
            <div class="alert alert-warning">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Esta habitación está en mantenimiento y no está disponible para reservas.
            </div>
          </div>

          <!-- Quick Stats Cards -->
          <div class="row g-3">
            <div class="col-md-4">
              <div class="stat-card text-center">
                <div class="stat-icon">
                  <i class="bi bi-calendar-week text-primary"></i>
                </div>
                <div class="stat-value">{{ getRandomStat('bookings') }}</div>
                <div class="stat-label">Reservas este mes</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card text-center">
                <div class="stat-icon">
                  <i class="bi bi-graph-up text-success"></i>
                </div>
                <div class="stat-value">{{ getRandomStat('occupancy') }}%</div>
                <div class="stat-label">Ocupación promedio</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="stat-card text-center">
                <div class="stat-icon">
                  <i class="bi bi-currency-euro text-warning"></i>
                </div>
                <div class="stat-value">{{ formatPrice(getRandomStat('revenue')) }}</div>
                <div class="stat-label">Ingresos mensuales</div>
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
  room: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['close', 'edit', 'delete']);

// Computed
const formattedAmenities = computed(() => {
  if (!props.room?.amenities) return [];
  return props.room.amenities.map(amenity => amenity.trim()).filter(Boolean);
});

// Methods
function closeModal() {
  emit('close');
}

function handleEdit() {
  emit('edit', props.room);
}

function handleDelete() {
  emit('delete', props.room);
}

function formatDate(dateString) {
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

function formatPrice(price) {
  if (!price) return '€0,00';
  
  return price.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  });
}

function getStatusLabel(status) {
  const statusLabels = {
    'available': 'Disponible',
    'occupied': 'Ocupada',
    'maintenance': 'Mantenimiento',
    'cleaning': 'Limpieza'
  };
  
  return statusLabels[status] || status;
}

function getStatusBadgeClass(status) {
  const statusClasses = {
    'available': 'bg-success',
    'occupied': 'bg-primary',
    'maintenance': 'bg-danger',
    'cleaning': 'bg-warning text-dark'
  };
  
  return statusClasses[status] || 'bg-secondary';
}

function getStatusIcon(status) {
  const statusIcons = {
    'available': 'bi-check-circle-fill',
    'occupied': 'bi-door-closed-fill',
    'maintenance': 'bi-tools',
    'cleaning': 'bi-droplet-fill'
  };
  
  return statusIcons[status] || 'bi-question-circle';
}

function handleImageError(event) {
  event.target.src = '/images/room-placeholder.jpg';
  event.target.alt = 'Imagen no disponible';
}

function getRandomStat(type) {
  // Generate mock statistics for demonstration
  const stats = {
    bookings: Math.floor(Math.random() * 20) + 5,
    occupancy: Math.floor(Math.random() * 30) + 70,
    revenue: (Math.random() * 3000) + 1500
  };
  
  return stats[type] || 0;
}
</script>

<style scoped>
.modal.show {
  display: block;
}

.room-number-badge .badge {
  font-size: 1rem;
  font-weight: 600;
}

.info-card {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.25rem;
  border: 1px solid #e9ecef;
}

.info-list {
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

.rating {
  display: flex;
  align-items: center;
}

.stars {
  font-size: 0.9rem;
}

.rating-value {
  font-weight: 600;
  color: #495057;
}

.description-box {
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  border-left: 4px solid #0d6efd;
  font-style: italic;
  color: #495057;
}

.amenities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
}

.amenity-item {
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.stat-card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  padding: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
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
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .info-item .value {
    text-align: left;
  }
  
  .amenities-grid {
    grid-template-columns: 1fr;
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
}

@media (max-width: 576px) {
  .row.g-3 .col-md-4 {
    margin-bottom: 0.75rem;
  }
  
  .stat-card {
    padding: 0.75rem;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
}
</style>