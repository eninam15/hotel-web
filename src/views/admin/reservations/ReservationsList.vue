<!-- src/views/admin/ReservationsManagement.vue -->
<template>
  <div class="reservations-page p-3 p-md-4">
    <!-- Page header with actions -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
      <div>
        <h1 class="h3 mb-0">Gestión de Reservas</h1>
        <p class="text-muted mb-0">Administra todas las reservas del hotel.</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-primary" @click="fetchReservations" :disabled="isLoading">
          <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': isLoading }"></i>
          {{ isLoading ? 'Actualizando...' : 'Actualizar' }}
        </button>
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="bi bi-plus-lg me-1"></i> Nueva Reserva
        </button>
      </div>
    </div>

    <!-- Stats cards -->
    <div v-if="!isLoading && !error" class="row mb-4 g-3">
      <div class="col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm bg-primary bg-opacity-10">
          <div class="card-body text-center p-3">
            <i class="bi bi-calendar-check text-primary fs-2"></i>
            <h4 class="mt-2 mb-0 text-primary">{{ stats.confirmada }}</h4>
            <small class="text-muted">Confirmadas</small>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm bg-warning bg-opacity-10">
          <div class="card-body text-center p-3">
            <i class="bi bi-clock-history text-warning fs-2"></i>
            <h4 class="mt-2 mb-0 text-warning">{{ stats.pendiente }}</h4>
            <small class="text-muted">Pendientes</small>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm bg-success bg-opacity-10">
          <div class="card-body text-center p-3">
            <i class="bi bi-check-circle text-success fs-2"></i>
            <h4 class="mt-2 mb-0 text-success">{{ stats.completada }}</h4>
            <small class="text-muted">Completadas</small>
          </div>
        </div>
      </div>
      <div class="col-sm-6 col-lg-3">
        <div class="card border-0 shadow-sm bg-info bg-opacity-10">
          <div class="card-body text-center p-3">
            <i class="bi bi-cash-coin text-info fs-2"></i>
            <h4 class="mt-2 mb-0 text-info">{{ formatPrice(stats.revenue) }}</h4>
            <small class="text-muted">Ingresos Totales</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and search -->
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label for="search" class="form-label">Buscar</label>
            <input type="text" id="search" v-model="filters.search" class="form-control" placeholder="Nombre, email, #reserva...">
          </div>
          <div class="col-md-3">
            <label for="dateFrom" class="form-label">Desde</label>
            <input type="date" id="dateFrom" v-model="filters.dateFrom" class="form-control">
          </div>
           <div class="col-md-3">
            <label for="dateTo" class="form-label">Hasta</label>
            <input type="date" id="dateTo" v-model="filters.dateTo" class="form-control">
          </div>
          <div class="col-md-2">
            <label for="status" class="form-label">Estado</label>
            <select id="status" v-model="filters.status" class="form-select">
              <option value="">Todos</option>
              <option value="confirmada">Confirmada</option>
              <option value="pendiente">Pendiente</option>
              <option value="cancelada">Cancelada</option>
              <option value="completada">Completada</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
      <p class="mt-3 text-muted">Cargando reservas...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger">
      <h4 class="alert-heading"><i class="bi bi-exclamation-triangle-fill me-2"></i>¡Error de Conexión!</h4>
      <p>{{ error }}</p>
      <button class="btn btn-sm btn-outline-danger" @click="fetchReservations">Reintentar</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredReservations.length === 0" class="text-center my-5 py-5 bg-light rounded">
      <i class="bi bi-calendar-x display-1 text-muted"></i>
      <h3 class="mt-3">No se encontraron reservas</h3>
      <p class="text-muted">No hay reservas que coincidan con los filtros seleccionados.</p>
      <button class="btn btn-outline-primary" @click="resetFilters">Limpiar filtros</button>
    </div>

    <!-- Reservations table -->
    <div v-else class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Reserva #</th>
              <th>Huésped</th>
              <th>Habitación</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Total</th>
              <th>Estado</th>
              <th class="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="reservation in paginatedReservations" :key="reservation.id">
              <td><span class="badge bg-light text-dark fw-normal">{{ reservation.nro_reserva }}</span></td>
              <td>
                <div class="fw-medium">{{ reservation.user.name }}</div>
                <div class="small text-muted">{{ reservation.user.email }}</div>
              </td>
              <td>
                <div class="fw-medium">{{ reservation.detalles[0]?.habitacion.nombre }}</div>
                <div class="small text-muted">Hab. #{{ reservation.detalles[0]?.habitacion.numero }}</div>
              </td>
              <td>{{ formatDate(reservation.fec_checkin) }}</td>
              <td>{{ formatDate(reservation.fec_checkout) }}</td>
              <td><span class="fw-bold">{{ formatPrice(reservation.precio_total) }}</span></td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(reservation.estado)">
                  {{ getStatusLabel(reservation.estado) }}
                </span>
              </td>
              <td class="text-end">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-primary" @click="viewReservation(reservation)" title="Ver detalles"><i class="bi bi-eye"></i></button>
                  <button class="btn btn-sm btn-outline-secondary" @click="editReservation(reservation)" title="Editar"><i class="bi bi-pencil"></i></button>
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" title="Más acciones"><i class="bi bi-three-dots"></i></button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li v-if="reservation.estado === 'pendiente'"><a class="dropdown-item" href="#" @click.prevent="handleStatusChange(reservation, 'confirmada')"><i class="bi bi-check-lg me-2"></i>Confirmar Pago</a></li>
                      <li v-if="reservation.estado === 'confirmada'"><a class="dropdown-item" href="#" @click.prevent="handleStatusChange(reservation, 'cancelada')"><i class="bi bi-x-circle me-2"></i>Cancelar</a></li>
                      <li><hr class="dropdown-divider"></li>
                      <li><a class="dropdown-item text-danger" href="#" @click.prevent="confirmDelete(reservation)"><i class="bi bi-trash me-2"></i>Eliminar</a></li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination controls -->
      <div class="card-footer d-flex justify-content-between align-items-center">
        <div class="text-muted small">Mostrando {{ paginatedReservations.length }} de {{ filteredReservations.length }} reservas</div>
        <!-- Pagination Component would go here -->
      </div>
    </div>

    <!-- Modals -->
    <ReservationFormModal 
      v-if="showReservationModal" 
      :show="showReservationModal" 
      :reservation="selectedReservation" 
      :is-editing="isEditing"
      :room-types="roomTypes"
      @close="closeReservationModal" 
      @save="handleReservationSave"
    />
    <ReservationViewModal v-if="showViewModal" :show="showViewModal" :reservation="selectedReservation" @close="closeViewModal" @edit="editReservation" @delete="confirmDelete" @status-change="status => handleStatusChange(selectedReservation, status)"/>
    <DeleteConfirmReservationModal v-if="showDeleteModal" :show="showDeleteModal" :reservation="selectedReservation" :is-deleting="isDeleting" @close="closeDeleteModal" @confirm="handleDelete"/>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { reservaService, habitacionService } from '@/services';
import ReservationFormModal from './ReservationFormModal.vue';
import ReservationViewModal from './ReservationViewModal.vue';
import DeleteConfirmReservationModal from './DeleteConfirmReservationModal.vue';

// --- STATE ---
const isLoading = ref(false);
const isDeleting = ref(false);
const error = ref(null);
const reservations = ref([]);
const roomTypes = ref([]);

const showReservationModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const selectedReservation = ref(null);
const isEditing = ref(false);

const filters = ref({ search: '', dateFrom: '', dateTo: '', status: '' });
const currentPage = ref(1);
const itemsPerPage = ref(10);

// --- COMPUTED ---
const stats = computed(() => {
  const initialStats = { pendiente: 0, confirmada: 0, completada: 0, cancelada: 0, revenue: 0 };
  return reservations.value.reduce((acc, r) => {
    if (acc[r.estado] !== undefined) acc[r.estado]++;
    if (r.estado !== 'cancelada') acc.revenue += parseFloat(r.precio_total);
    return acc;
  }, initialStats);
});

const filteredReservations = computed(() => {
  return reservations.value.filter(r => {
    const searchMatch = filters.value.search ? (r.nro_reserva.includes(filters.value.search) || r.user.name.toLowerCase().includes(filters.value.search.toLowerCase()) || r.user.email.toLowerCase().includes(filters.value.search.toLowerCase())) : true;
    const statusMatch = filters.value.status ? r.estado === filters.value.status : true;
    const dateFromMatch = filters.value.dateFrom ? new Date(r.fec_checkin) >= new Date(filters.value.dateFrom) : true;
    const dateToMatch = filters.value.dateTo ? new Date(r.fec_checkin) <= new Date(filters.value.dateTo) : true;
    return searchMatch && statusMatch && dateFromMatch && dateToMatch;
  });
});

const paginatedReservations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredReservations.value.slice(start, end);
});

// --- METHODS ---
async function fetchReservations() {
  isLoading.value = true;
  error.value = null;
  try {
    reservations.value = await reservaService.getAllReservas();
  } catch (err) {
    console.error('Error fetching reservations:', err);
    error.value = err.message || 'No se pudieron cargar las reservas. Verifica tu conexión e intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
}

async function fetchRoomTypes() {
    try {
        roomTypes.value = await habitacionService.getRoomTypes();
    } catch (err) {
        console.error('Error fetching room types:', err);
        error.value = 'No se pudieron cargar los tipos de habitación. El formulario de creación podría no funcionar correctamente.';
    }
}

function resetFilters() {
    filters.value = { search: '', dateFrom: '', dateTo: '', status: '' };
}

// Modal Handlers
function openCreateModal() {
  selectedReservation.value = null;
  isEditing.value = false;
  showReservationModal.value = true;
}

function editReservation(reservation) {
  selectedReservation.value = { ...reservation };
  isEditing.value = true;
  showReservationModal.value = true;
  showViewModal.value = false; 
}

function viewReservation(reservation) {
  selectedReservation.value = reservation;
  showViewModal.value = true;
}

function confirmDelete(reservation) {
  selectedReservation.value = reservation;
  showDeleteModal.value = true;
  showViewModal.value = false; 
}

function closeReservationModal() { showReservationModal.value = false; }
function closeViewModal() { showViewModal.value = false; }
function closeDeleteModal() { showDeleteModal.value = false; }

// CRUD Handlers
async function handleReservationSave(reservationDataFromModal) {
  const action = isEditing.value ? 'actualizar' : 'crear';
  
  // --- FIX: Restructure payload to match backend expectations ---
  const payload = {
    hotel_id: 1, // This should be dynamic, e.g., from the selected room's data
    fec_checkin: reservationDataFromModal.fec_checkin,
    fec_checkout: reservationDataFromModal.fec_checkout,
    estado: reservationDataFromModal.estado,
    // The backend expects guest info to be linked via an authenticated user.
    // For admin creation, the backend would need modification to accept a user_id or create a guest user.
    // For now, we send the essential data to pass validation.
    detalles: [{
      habitacion_id: reservationDataFromModal.habitacion_id,
      cantidad: 1 // Assuming the form handles one room at a time
    }]
  };

  try {
    if (isEditing.value) {
      await reservaService.updateReserva(reservationDataFromModal.id, payload);
    } else {
      await reservaService.createReserva(payload);
    }
    closeReservationModal();
    await fetchReservations();
    alert(`Reserva ${action}da con éxito.`);
  } catch (err) {
    console.error(`Error al ${action} la reserva:`, err);
    
    // --- FIX: Improved error message ---
    let errorMessage = `Error al ${action} la reserva.`;
    if (err && err.errors) {
      // If the server sends back validation errors, display them.
      const errorDetails = Object.values(err.errors).map(e => `- ${e[0]}`).join('\n');
      errorMessage += `\n\nPor favor, corrige los siguientes errores:\n${errorDetails}`;
    } else if (err.message) {
      errorMessage += `\n${err.message}`;
    }
    alert(errorMessage);
  }
}

async function handleStatusChange(reservation, newStatus) {
  if (!confirm(`¿Estás seguro de cambiar el estado a '${getStatusLabel(newStatus)}'?`)) return;
  try {
    await reservaService.updateReservaEstado(reservation.id, newStatus);
    await fetchReservations();
    alert('Estado de la reserva actualizado.');
    closeViewModal();
  } catch(err) {
    console.error('Error updating status:', err);
    alert(`Error al actualizar el estado: ${err.message}`);
  }
}

async function handleDelete() {
  if (!selectedReservation.value) return;
  isDeleting.value = true;
  try {
    await reservaService.deleteReserva(selectedReservation.value.id);
    closeDeleteModal();
    await fetchReservations();
    alert('Reserva eliminada con éxito.');
  } catch (err) {
    console.error('Error deleting reservation:', err);
    alert(`Error al eliminar la reserva: ${err.message}`);
  } finally {
    isDeleting.value = false;
  }
}

// Formatting Helpers
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}
function formatPrice(price) {
  if (typeof price !== 'number' && typeof price !== 'string') return 'BOB 0.00';
  return new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(parseFloat(price));
}
function getStatusLabel(status) {
  const labels = { pendiente: 'Pendiente', confirmada: 'Confirmada', cancelada: 'Cancelada', completada: 'Completada' };
  return labels[status] || status.charAt(0).toUpperCase() + status.slice(1);
}
function getStatusBadgeClass(status) {
  const classes = { pendiente: 'bg-warning text-dark', confirmada: 'bg-success', cancelada: 'bg-danger', completada: 'bg-info' };
  return classes[status] || 'bg-secondary';
}

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  fetchReservations();
  fetchRoomTypes();
});
</script>

<style scoped>
.reservations-page {
  background-color: #f8f9fa;
  min-height: 100vh;
}
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.table-hover tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.03);
}
.dropdown-menu {
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15);
    border: none;
}
</style>
