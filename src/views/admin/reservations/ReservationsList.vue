<template>
    <div class="reservations-page">
      <!-- Page header with actions -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-0">Gestión de Reservas</h1>
          <p class="text-muted">Administra todas las reservas del hotel</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary" @click="refreshData">
            <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
          </button>
          <button class="btn btn-primary" @click="createReservation">
            <i class="bi bi-plus-lg me-1"></i> Nueva Reserva
          </button>
        </div>
      </div>
  
      <!-- Filters and search -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-3">
              <label for="dateRange" class="form-label">Rango de fechas</label>
              <div class="input-group">
                <span class="input-group-text bg-light">
                  <i class="bi bi-calendar-range"></i>
                </span>
                <input type="date" id="dateFrom" v-model="filters.dateFrom" class="form-control">
                <input type="date" id="dateTo" v-model="filters.dateTo" class="form-control">
              </div>
            </div>
            <div class="col-md-2">
              <label for="status" class="form-label">Estado</label>
              <select id="status" v-model="filters.status" class="form-select">
                <option value="">Todos</option>
                <option value="confirmed">Confirmadas</option>
                <option value="pending">Pendientes</option>
                <option value="cancelled">Canceladas</option>
                <option value="completed">Completadas</option>
              </select>
            </div>
            <div class="col-md-3">
              <label for="search" class="form-label">Buscar</label>
              <div class="input-group">
                <span class="input-group-text bg-light">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  id="search" 
                  v-model="filters.search" 
                  class="form-control" 
                  placeholder="Nombre, email, #reserva..."
                >
              </div>
            </div>
            <div class="col-md-2">
              <label for="roomType" class="form-label">Tipo de habitación</label>
              <select id="roomType" v-model="filters.roomType" class="form-select">
                <option value="">Todos</option>
                <option v-for="type in roomTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div class="col-md-2 d-flex align-items-end">
              <button class="btn btn-primary w-100" @click="applyFilters">
                <i class="bi bi-funnel me-1"></i> Filtrar
              </button>
            </div>
          </div>
        </div>
      </div>
  
      
  
      <!-- Empty state -->
      <div v-if="filteredReservations.length === 0" class="text-center my-5">
        <div class="empty-state">
          <i class="bi bi-calendar-x display-1 text-muted"></i>
          <h3 class="mt-3">No se encontraron reservas</h3>
          <p class="text-muted">No hay reservas que coincidan con los filtros seleccionados.</p>
          <button class="btn btn-outline-primary mt-2" @click="resetFilters">
            Limpiar filtros
          </button>
        </div>
      </div>
  
      <!-- Reservations table -->
      <div v-else class="card shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" class="sortable" @click="sortBy('id')">
                  ID
                  <i v-if="sortColumn === 'id'" class="bi" :class="getSortIconClass('id')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('guestName')">
                  Huésped
                  <i v-if="sortColumn === 'guestName'" class="bi" :class="getSortIconClass('guestName')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('roomNumber')">
                  Habitación
                  <i v-if="sortColumn === 'roomNumber'" class="bi" :class="getSortIconClass('roomNumber')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('checkIn')">
                  Check-in
                  <i v-if="sortColumn === 'checkIn'" class="bi" :class="getSortIconClass('checkIn')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('checkOut')">
                  Check-out
                  <i v-if="sortColumn === 'checkOut'" class="bi" :class="getSortIconClass('checkOut')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('total')">
                  Total
                  <i v-if="sortColumn === 'total'" class="bi" :class="getSortIconClass('total')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('status')">
                  Estado
                  <i v-if="sortColumn === 'status'" class="bi" :class="getSortIconClass('status')"></i>
                </th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="reservation in paginatedReservations" :key="reservation.id">
                <td>
                  <span class="badge bg-light text-dark">{{ formatReservationId(reservation.id) }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <img 
                      :src="reservation.guestAvatar || '/images/avatar-placeholder.png'" 
                      class="rounded-circle me-2" 
                      width="32" 
                      height="32"
                      alt="Guest"
                    >
                    <div>
                      <div>{{ reservation.guestName }}</div>
                      <div class="small text-muted">{{ reservation.guestEmail }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{{ reservation.roomNumber }}</div>
                  <div class="small text-muted">{{ reservation.roomType }}</div>
                </td>
                <td>
                  {{ formatDate(reservation.checkIn) }}
                  <div class="small text-muted">{{ getDayName(reservation.checkIn) }}</div>
                </td>
                <td>
                  {{ formatDate(reservation.checkOut) }}
                  <div class="small text-muted">{{ getDayName(reservation.checkOut) }}</div>
                </td>
                <td>
                  <div class="fw-bold">{{ formatPrice(reservation.total) }}</div>
                  <div class="small text-muted">{{ reservation.paymentMethod }}</div>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="getStatusBadgeClass(reservation.status)"
                  >
                    {{ getStatusLabel(reservation.status) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <button 
                      class="btn btn-sm btn-outline-primary" 
                      @click="viewReservation(reservation)"
                      title="Ver detalles"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-secondary" 
                      @click="editReservation(reservation)"
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="confirmDelete(reservation)"
                      title="Eliminar"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination controls -->
        <div class="card-footer d-flex justify-content-between align-items-center">
          <div class="pagination-info">
            Mostrando <b>{{ startIndex + 1 }}</b> a <b>{{ endIndex }}</b> de <b>{{ filteredReservations.length }}</b> reservas
          </div>
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(1)" aria-label="First">
                <i class="bi bi-chevron-double-left"></i>
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(currentPage - 1)" aria-label="Previous">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li v-for="page in paginationRange" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="goToPage(page)">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(currentPage + 1)" aria-label="Next">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(totalPages)" aria-label="Last">
                <i class="bi bi-chevron-double-right"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
  
      <!-- Delete confirmation modal -->
      <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-danger">Eliminar Reserva</h5>
              <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas eliminar la reserva <b>{{ selectedReservation?.id ? formatReservationId(selectedReservation.id) : '' }}</b>?</p>
              <p>Esta acción no se puede deshacer y se eliminará permanentemente la información de la reserva.</p>
              
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                Considera cambiar el estado a "Cancelada" en lugar de eliminar la reserva para mantener el historial.
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
              <button 
                type="button" 
                class="btn btn-danger" 
                @click="deleteReservation"
                :disabled="isDeleting"
              >
                <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isDeleting ? 'Eliminando...' : 'Sí, eliminar reserva' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// Router
const router = useRouter();

// State
const isLoading = ref(true);
const error = ref(null);
const reservations = ref([]);
const roomTypes = ref([
  { id: 1, name: 'Habitación Estándar' },
  { id: 2, name: 'Habitación Deluxe' },
  { id: 3, name: 'Suite Junior' },
  { id: 4, name: 'Suite Ejecutiva' }
]);

// Filter and sorting state
const filters = ref({
  dateFrom: '',
  dateTo: '',
  status: '',
  search: '',
  roomType: ''
});

const sortColumn = ref('id');
const sortDirection = ref('desc');
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Modal state
const showDeleteModal = ref(false);
const selectedReservation = ref(null);
const isDeleting = ref(false);

// Computed properties
const filteredReservations = computed(() => {
  let result = [...reservations.value];
  
  // Apply filters
  if (filters.value.dateFrom) {
    const fromDate = new Date(filters.value.dateFrom);
    result = result.filter(r => new Date(r.checkIn) >= fromDate);
  }
  
  if (filters.value.dateTo) {
    const toDate = new Date(filters.value.dateTo);
    toDate.setHours(23, 59, 59);
    result = result.filter(r => new Date(r.checkOut) <= toDate);
  }
  
  if (filters.value.status) {
    result = result.filter(r => r.status === filters.value.status);
  }
  
  if (filters.value.roomType) {
    result = result.filter(r => r.roomTypeId === parseInt(filters.value.roomType));
  }
  
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(r => 
      r.id.toString().includes(searchTerm) ||
      r.guestName.toLowerCase().includes(searchTerm) ||
      r.guestEmail.toLowerCase().includes(searchTerm) ||
      r.roomNumber.toLowerCase().includes(searchTerm)
    );
  }
  
  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0;
    
    if (sortColumn.value === 'id') {
      comparison = a.id - b.id;
    } else if (sortColumn.value === 'guestName') {
      comparison = a.guestName.localeCompare(b.guestName);
    } else if (sortColumn.value === 'roomNumber') {
      comparison = a.roomNumber.localeCompare(b.roomNumber);
    } else if (sortColumn.value === 'checkIn') {
      comparison = new Date(a.checkIn) - new Date(b.checkIn);
    } else if (sortColumn.value === 'checkOut') {
      comparison = new Date(a.checkOut) - new Date(b.checkOut);
    } else if (sortColumn.value === 'total') {
      comparison = a.total - b.total;
    } else if (sortColumn.value === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
  
  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredReservations.value.length / itemsPerPage.value);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, filteredReservations.value.length);
});

const paginatedReservations = computed(() => {
  return filteredReservations.value.slice(startIndex.value, endIndex.value);
});

const paginationRange = computed(() => {
  const range = [];
  const maxVisiblePages = 5;
  let startPage, endPage;
  
  if (totalPages.value <= maxVisiblePages) {
    // Show all pages
    startPage = 1;
    endPage = totalPages.value;
  } else {
    // Calculate start and end pages
    const leftOffset = Math.floor(maxVisiblePages / 2);
    const rightOffset = maxVisiblePages - leftOffset - 1;
    
    if (currentPage.value <= leftOffset + 1) {
      // Near the start
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage.value >= totalPages.value - rightOffset) {
      // Near the end
      startPage = totalPages.value - maxVisiblePages + 1;
      endPage = totalPages.value;
    } else {
      // In the middle
      startPage = currentPage.value - leftOffset;
      endPage = currentPage.value + rightOffset;
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }
  
  return range;
});

// Methods
function refreshData() {
  isLoading.value = true;
  error.value = null;
  
  // In a real app, this would be an API call
  setTimeout(() => {
    try {
      // Mock data - in a real app this would come from your API
      reservations.value = [
        {
          id: 1001,
          guestName: 'Carlos Rodríguez',
          guestEmail: 'carlos.rodriguez@email.com',
          guestAvatar: '/images/avatar-1.jpg',
          roomNumber: '101',
          roomType: 'Habitación Estándar',
          roomTypeId: 1,
          checkIn: '2025-06-01',
          checkOut: '2025-06-05',
          total: 356.00,
          paymentMethod: 'Tarjeta de crédito',
          status: 'confirmed',
          createdAt: '2024-05-15T14:30:22'
        },
        {
          id: 1002,
          guestName: 'María López',
          guestEmail: 'maria.lopez@email.com',
          guestAvatar: '/images/avatar-2.jpg',
          roomNumber: '205',
          roomType: 'Habitación Deluxe',
          roomTypeId: 2,
          checkIn: '2025-05-25',
          checkOut: '2025-05-28',
          total: 387.00,
          paymentMethod: 'PayPal',
          status: 'completed',
          createdAt: '2024-04-20T10:15:40'
        },
        {
          id: 1003,
          guestName: 'Juan Martínez',
          guestEmail: 'juan.martinez@email.com',
          guestAvatar: '/images/avatar-3.jpg',
          roomNumber: '310',
          roomType: 'Suite Junior',
          roomTypeId: 3,
          checkIn: '2025-06-10',
          checkOut: '2025-06-13',
          total: 477.00,
          paymentMethod: 'Tarjeta de crédito',
          status: 'pending',
          createdAt: '2024-05-18T09:45:12'
        },
        {
          id: 1004,
          guestName: 'Ana García',
          guestEmail: 'ana.garcia@email.com',
          guestAvatar: '/images/avatar-4.jpg',
          roomNumber: '402',
          roomType: 'Suite Ejecutiva',
          roomTypeId: 4,
          checkIn: '2025-05-20',
          checkOut: '2025-05-23',
          total: 657.00,
          paymentMethod: 'Transferencia bancaria',
          status: 'cancelled',
          createdAt: '2024-05-01T16:22:33'
        },
        {
          id: 1005,
          guestName: 'Pedro Sánchez',
          guestEmail: 'pedro.sanchez@email.com',
          guestAvatar: '/images/avatar-5.jpg',
          roomNumber: '102',
          roomType: 'Habitación Estándar',
          roomTypeId: 1,
          checkIn: '2025-06-15',
          checkOut: '2025-06-20',
          total: 445.00,
          paymentMethod: 'Tarjeta de crédito',
          status: 'confirmed',
          createdAt: '2024-05-12T11:18:45'
        },
        {
          id: 1006,
          guestName: 'Lucía Fernández',
          guestEmail: 'lucia.fernandez@email.com',
          guestAvatar: null,
          roomNumber: '207',
          roomType: 'Habitación Deluxe',
          roomTypeId: 2,
          checkIn: '2025-06-05',
          checkOut: '2025-06-08',
          total: 387.00,
          paymentMethod: 'PayPal',
          status: 'confirmed',
          createdAt: '2024-05-10T14:30:22'
        },
        {
          id: 1007,
          guestName: 'Miguel Ángel Torres',
          guestEmail: 'miguel.torres@email.com',
          guestAvatar: '/images/avatar-6.jpg',
          roomNumber: '311',
          roomType: 'Suite Junior',
          roomTypeId: 3,
          checkIn: '2025-06-20',
          checkOut: '2025-06-25',
          total: 795.00,
          paymentMethod: 'Tarjeta de crédito',
          status: 'pending',
          createdAt: '2024-05-19T09:45:12'
        },
        {
          id: 1008,
          guestName: 'Carmen Ruiz',
          guestEmail: 'carmen.ruiz@email.com',
          guestAvatar: null,
          roomNumber: '404',
          roomType: 'Suite Ejecutiva',
          roomTypeId: 4,
          checkIn: '2025-07-01',
          checkOut: '2025-07-05',
          total: 876.00,
          paymentMethod: 'Transferencia bancaria',
          status: 'confirmed',
          createdAt: '2024-05-17T16:22:33'
        },
        {
          id: 1009,
          guestName: 'Javier Moreno',
          guestEmail: 'javier.moreno@email.com',
          guestAvatar: '/images/avatar-7.jpg',
          roomNumber: '104',
          roomType: 'Habitación Estándar',
          roomTypeId: 1,
          checkIn: '2025-06-25',
          checkOut: '2025-06-28',
          total: 267.00,
          paymentMethod: 'Tarjeta de crédito',
          status: 'confirmed',
          createdAt: '2024-05-15T11:18:45'
        },
        {
          id: 1010,
          guestName: 'Isabel Díaz',
          guestEmail: 'isabel.diaz@email.com',
          guestAvatar: '/images/avatar-8.jpg',
          roomNumber: '209',
          roomType: 'Habitación Deluxe',
          roomTypeId: 2,
          checkIn: '2025-06-30',
          checkOut: '2025-07-03',
          total: 387.00,
          paymentMethod: 'PayPal',
          status: 'pending',
          createdAt: '2024-05-18T14:30:22'
        },
        {
          id: 1011,
          guestName: 'Roberto Gómez',
          guestEmail: 'roberto.gomez@email.com',
          guestAvatar: null,
          roomNumber: '313',
          roomType: 'Suite Junior',
          roomTypeId: 3,
          checkIn: '2025-07-05',
          checkOut: '2025-07-10',
          total: 795.00,
          paymentMethod: 'Tarjeta de crédito',
          status: 'confirmed',
          createdAt: '2024-05-16T09:45:12'
        },
        {
          id: 1012,
          guestName: 'Elena Castro',
          guestEmail: 'elena.castro@email.com',
          guestAvatar: '/images/avatar-9.jpg',
          roomNumber: '405',
          roomType: 'Suite Ejecutiva',
          roomTypeId: 4,
          checkIn: '2025-07-15',
          checkOut: '2025-07-20',
          total: 1095.00,
          paymentMethod: 'Transferencia bancaria',
          status: 'confirmed',
          createdAt: '2024-05-14T16:22:33'
        }
      ];
      isLoading.value = false;
    } catch (err) {
      console.error('Error fetching reservations:', err);
      error.value = 'No se pudieron cargar las reservas. Por favor, intenta de nuevo.';
      isLoading.value = false;
    }
  }, 800); // Simulating network delay
}

function applyFilters() {
  currentPage.value = 1; // Reset to first page when filtering
}

function resetFilters() {
  filters.value = {
    dateFrom: '',
    dateTo: '',
    status: '',
    search: '',
    roomType: ''
  };
  applyFilters();
}

function sortBy(column) {
  if (sortColumn.value === column) {
    // Toggle direction if the same column is clicked
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Set new column and default to ascending
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }
}

function getSortIconClass(column) {
  if (sortColumn.value !== column) return '';
  
  return sortDirection.value === 'asc' ? 'bi-sort-up' : 'bi-sort-down';
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  
  currentPage.value = page;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

function getDayName(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'long' });
}

function formatPrice(price) {
  return price.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR'
  });
}

function formatReservationId(id) {
  return `RES-${id.toString().padStart(4, '0')}`;
}

function getStatusLabel(status) {
  const statusLabels = {
    'confirmed': 'Confirmada',
    'pending': 'Pendiente',
    'cancelled': 'Cancelada',
    'completed': 'Completada'
  };
  
  return statusLabels[status] || status;
}

function getStatusBadgeClass(status) {
  const statusClasses = {
    'confirmed': 'bg-success',
    'pending': 'bg-warning text-dark',
    'cancelled': 'bg-danger',
    'completed': 'bg-info'
  };
  
  return statusClasses[status] || 'bg-secondary';
}

function createReservation() {
  router.push({ name: 'admin.reservations.create' });
}

function viewReservation(reservation) {
  router.push({ 
    name: 'admin.reservations.view', 
    params: { id: reservation.id } 
  });
}

function editReservation(reservation) {
  router.push({ 
    name: 'admin.reservations.edit', 
    params: { id: reservation.id } 
  });
}

function confirmDelete(reservation) {
  selectedReservation.value = reservation;
  showDeleteModal.value = true;
}

async function deleteReservation() {
  if (!selectedReservation.value) return;
  
  isDeleting.value = true;
  
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove reservation from the list
    reservations.value = reservations.value.filter(r => r.id !== selectedReservation.value.id);
    
    // Show success message (you might want to use a toast notification here)
    alert(`Reserva ${formatReservationId(selectedReservation.value.id)} eliminada correctamente`);
    
    // Close modal
    showDeleteModal.value = false;
    selectedReservation.value = null;
  } catch (err) {
    console.error('Error deleting reservation:', err);
    alert('Error al eliminar la reserva. Por favor, intenta de nuevo.');
  } finally {
    isDeleting.value = false;
  }
}

// Initialize data
onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.sortable {
  cursor: pointer;
  user-select: none;
}

.sortable:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.empty-state {
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.pagination-info {
  color: #6c757d;
}

/* Make the modal backdrop work without Bootstrap's JS */
.modal.show {
  display: block;
}

thead th {
  position: relative;
  padding-right: 1.5rem;
}

thead th i {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>