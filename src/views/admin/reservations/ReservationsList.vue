<!-- src/views/admin/ReservationsManagement.vue -->
<template>
  <div class="reservations-page">
    <!-- Page header with actions -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-0">Gestión de Reservas</h1>
        <p class="text-muted">Administra todas las reservas del hotel</p>
      </div>
      <div class="d-flex gap-2">
        <button 
          class="btn btn-outline-primary" 
          @click="refreshData"
          :disabled="isLoading"
        >
          <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': isLoading }"></i> 
          {{ isLoading ? 'Actualizando...' : 'Actualizar' }}
        </button>
        <button class="btn btn-primary" @click="openCreateModal">
          <i class="bi bi-plus-lg me-1"></i> Nueva Reserva
        </button>
      </div>
    </div>

    <!-- Stats cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card border-0 bg-primary bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-calendar-check text-primary fs-1"></i>
            <h4 class="mt-2 mb-0 text-primary">{{ stats.confirmed }}</h4>
            <small class="text-muted">Confirmadas</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-warning bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-clock-history text-warning fs-1"></i>
            <h4 class="mt-2 mb-0 text-warning">{{ stats.pending }}</h4>
            <small class="text-muted">Pendientes</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-success bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-check-circle text-success fs-1"></i>
            <h4 class="mt-2 mb-0 text-success">{{ stats.completed }}</h4>
            <small class="text-muted">Completadas</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-info bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-currency-euro text-info fs-1"></i>
            <h4 class="mt-2 mb-0 text-info">{{ formatPrice(stats.revenue) }}</h4>
            <small class="text-muted">Ingresos del mes</small>
          </div>
        </div>
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
              <input 
                type="date" 
                id="dateFrom" 
                v-model="filters.dateFrom" 
                class="form-control"
                @change="applyFilters"
              >
              <input 
                type="date" 
                id="dateTo" 
                v-model="filters.dateTo" 
                class="form-control"
                @change="applyFilters"
              >
            </div>
          </div>
          <div class="col-md-2">
            <label for="status" class="form-label">Estado</label>
            <select 
              id="status" 
              v-model="filters.status" 
              class="form-select"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option value="confirmed">Confirmadas</option>
              <option value="pending">Pendientes</option>
              <option value="cancelled">Canceladas</option>
              <option value="completed">Completadas</option>
              <option value="checkedin">Check-in realizado</option>
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
                @input="debounceSearch"
              >
              <button 
                v-if="filters.search" 
                class="btn btn-outline-secondary" 
                type="button"
                @click="clearSearch"
              >
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
          <div class="col-md-2">
            <label for="roomType" class="form-label">Tipo de habitación</label>
            <select 
              id="roomType" 
              v-model="filters.roomType" 
              class="form-select"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option v-for="type in roomTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
          <div class="col-md-2 d-flex align-items-end">
            <button 
              class="btn btn-outline-secondary w-100" 
              @click="resetFilters"
              title="Limpiar filtros"
            >
              <i class="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Action buttons for bulk operations -->
    <div v-if="selectedReservations.length > 0" class="d-flex justify-content-between align-items-center mb-3">
      <div class="text-muted">
        {{ selectedReservations.length }} reserva{{ selectedReservations.length !== 1 ? 's' : '' }} seleccionada{{ selectedReservations.length !== 1 ? 's' : '' }}
      </div>
      <div class="btn-group">
        <button class="btn btn-outline-primary btn-sm" @click="bulkConfirm" :disabled="!canBulkConfirm">
          <i class="bi bi-check-lg me-1"></i>Confirmar seleccionadas
        </button>
        <button class="btn btn-outline-warning btn-sm" @click="bulkCancel" :disabled="!canBulkCancel">
          <i class="bi bi-x-lg me-1"></i>Cancelar seleccionadas
        </button>
      </div>
    </div>

    <!-- Results count -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="text-muted">
        {{ filteredReservations.length }} reserva{{ filteredReservations.length !== 1 ? 's' : '' }} encontrada{{ filteredReservations.length !== 1 ? 's' : '' }}
      </div>
      <div class="d-flex align-items-center gap-2">
        <label for="itemsPerPage" class="form-label mb-0 small">Mostrar:</label>
        <select 
          id="itemsPerPage" 
          v-model="itemsPerPage" 
          class="form-select form-select-sm" 
          style="width: auto;"
          @change="currentPage = 1"
        >
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando reservas...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ error }}
      <button class="btn btn-sm btn-outline-danger ms-2" @click="refreshData">
        Reintentar
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredReservations.length === 0" class="text-center my-5">
      <div class="empty-state">
        <i class="bi bi-calendar-x display-1 text-muted"></i>
        <h3 class="mt-3">No se encontraron reservas</h3>
        <p class="text-muted">
          {{ reservations.length === 0 ? 'No hay reservas registradas.' : 'No hay reservas que coincidan con los filtros seleccionados.' }}
        </p>
        <div class="mt-3">
          <button 
            v-if="reservations.length === 0" 
            class="btn btn-primary me-2" 
            @click="openCreateModal"
          >
            Crear primera reserva
          </button>
          <button 
            v-else 
            class="btn btn-outline-primary" 
            @click="resetFilters"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Reservations table -->
    <div v-else class="card shadow-sm">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" width="40">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  :checked="allSelected"
                  @change="toggleAllSelection"
                >
              </th>
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
            <tr 
              v-for="reservation in paginatedReservations" 
              :key="reservation.id"
              :class="{ 'table-active': isSelected(reservation.id) }"
            >
              <td>
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  :checked="isSelected(reservation.id)"
                  @change="toggleSelection(reservation.id)"
                >
              </td>
              <td>
                <span class="badge bg-light text-dark fw-normal">{{ formatReservationId(reservation.id) }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <img 
                    :src="reservation.guestAvatar || '/images/avatar-placeholder.png'" 
                    class="rounded-circle me-2" 
                    width="32" 
                    height="32"
                    alt="Guest"
                    @error="handleImageError"
                  >
                  <div>
                    <div class="fw-medium">{{ reservation.guestName }}</div>
                    <div class="small text-muted">{{ reservation.guestEmail }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="fw-medium">{{ reservation.roomNumber }}</div>
                <div class="small text-muted">{{ reservation.roomType }}</div>
              </td>
              <td>
                <div>{{ formatDate(reservation.checkIn) }}</div>
                <div class="small text-muted">{{ getDayName(reservation.checkIn) }}</div>
              </td>
              <td>
                <div>{{ formatDate(reservation.checkOut) }}</div>
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
                <div v-if="isUrgent(reservation)" class="small text-danger mt-1">
                  <i class="bi bi-exclamation-triangle-fill me-1"></i>Urgente
                </div>
              </td>
              <td>
                <div class="btn-group">
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
                  <div class="btn-group">
                    <button 
                      class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      title="Más acciones"
                    >
                      <i class="bi bi-three-dots"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li v-if="reservation.status === 'pending'">
                        <a class="dropdown-item" href="#" @click.prevent="confirmReservation(reservation)">
                          <i class="bi bi-check-lg me-2"></i>Confirmar
                        </a>
                      </li>
                      <li v-if="reservation.status === 'confirmed'">
                        <a class="dropdown-item" href="#" @click.prevent="checkinReservation(reservation)">
                          <i class="bi bi-door-open me-2"></i>Check-in
                        </a>
                      </li>
                      <li v-if="reservation.status === 'checkedin'">
                        <a class="dropdown-item" href="#" @click.prevent="checkoutReservation(reservation)">
                          <i class="bi bi-door-closed me-2"></i>Check-out
                        </a>
                      </li>
                      <li v-if="canCancel(reservation)">
                        <a class="dropdown-item text-warning" href="#" @click.prevent="cancelReservation(reservation)">
                          <i class="bi bi-x-circle me-2"></i>Cancelar
                        </a>
                      </li>
                      <li><hr class="dropdown-divider"></li>
                      <li>
                        <a class="dropdown-item text-danger" href="#" @click.prevent="confirmDelete(reservation)">
                          <i class="bi bi-trash me-2"></i>Eliminar
                        </a>
                      </li>
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
        <div class="pagination-info">
          Mostrando <strong>{{ startIndex + 1 }}</strong> a <strong>{{ endIndex }}</strong> de <strong>{{ filteredReservations.length }}</strong> reservas
        </div>
        <nav aria-label="Paginación de reservas">
          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(1)" :disabled="currentPage === 1" aria-label="Primera">
                <i class="bi bi-chevron-double-left"></i>
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <button class="page-link" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" aria-label="Anterior">
                <i class="bi bi-chevron-left"></i>
              </button>
            </li>
            <li v-for="page in paginationRange" :key="page" class="page-item" :class="{ active: currentPage === page }">
              <button class="page-link" @click="goToPage(page)" :aria-label="`Página ${page}`">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" aria-label="Siguiente">
                <i class="bi bi-chevron-right"></i>
              </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <button class="page-link" @click="goToPage(totalPages)" :disabled="currentPage === totalPages" aria-label="Última">
                <i class="bi bi-chevron-double-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Modals -->
    <ReservationFormModal
      v-if="showReservationModal"
      :show="showReservationModal"
      :reservation="selectedReservation"
      :room-types="roomTypes"
      :is-editing="isEditing"
      @close="closeReservationModal"
      @save="handleReservationSave"
    />

    <ReservationViewModal
      v-if="showViewModal"
      :show="showViewModal"
      :reservation="selectedReservation"
      @close="closeViewModal"
      @edit="editReservation"
      @delete="confirmDelete"
      @status-change="handleStatusChange"
    />

    <DeleteConfirmReservationModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :reservation="selectedReservation"
      :is-deleting="isDeleting"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import ReservationFormModal from './ReservationFormModal.vue';
import ReservationViewModal from './ReservationViewModal.vue';
import DeleteConfirmReservationModal from './DeleteConfirmReservationModal.vue';

// Router
const router = useRouter();

// State
const isLoading = ref(false);
const error = ref(null);
const reservations = ref([]);
const selectedReservations = ref([]);

// Search debounce
let searchTimeout = null;

// Modal state
const showReservationModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const selectedReservation = ref(null);
const isEditing = ref(false);
const isDeleting = ref(false);

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

// Computed properties
const stats = computed(() => {
  const confirmed = reservations.value.filter(r => r.status === 'confirmed').length;
  const pending = reservations.value.filter(r => r.status === 'pending').length;
  const completed = reservations.value.filter(r => r.status === 'completed').length;
  
  // Calculate monthly revenue (mock calculation)
  const currentMonth = new Date().getMonth();
  const revenue = reservations.value
    .filter(r => {
      const checkIn = new Date(r.checkIn);
      return checkIn.getMonth() === currentMonth && r.status !== 'cancelled';
    })
    .reduce((sum, r) => sum + r.total, 0);
  
  return { confirmed, pending, completed, revenue };
});

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
      r.roomNumber.toLowerCase().includes(searchTerm) ||
      formatReservationId(r.id).toLowerCase().includes(searchTerm)
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
    startPage = 1;
    endPage = totalPages.value;
  } else {
    const leftOffset = Math.floor(maxVisiblePages / 2);
    const rightOffset = maxVisiblePages - leftOffset - 1;
    
    if (currentPage.value <= leftOffset + 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage.value >= totalPages.value - rightOffset) {
      startPage = totalPages.value - maxVisiblePages + 1;
      endPage = totalPages.value;
    } else {
      startPage = currentPage.value - leftOffset;
      endPage = currentPage.value + rightOffset;
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }
  
  return range;
});

// Selection computed properties
const allSelected = computed(() => {
  return paginatedReservations.value.length > 0 && 
         paginatedReservations.value.every(r => selectedReservations.value.includes(r.id));
});

const canBulkConfirm = computed(() => {
  return selectedReservations.value.some(id => {
    const reservation = reservations.value.find(r => r.id === id);
    return reservation && reservation.status === 'pending';
  });
});

const canBulkCancel = computed(() => {
  return selectedReservations.value.some(id => {
    const reservation = reservations.value.find(r => r.id === id);
    return reservation && canCancel(reservation);
  });
});

// Methods
async function refreshData() {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    reservations.value = [
      {
        id: 1001,
        guestName: 'Carlos Rodríguez',
        guestEmail: 'carlos.rodriguez@email.com',
        guestPhone: '+34 666 123 456',
        guestAvatar: '/images/avatar-1.jpg',
        roomNumber: '101',
        roomType: 'Habitación Estándar',
        roomTypeId: 1,
        checkIn: '2025-06-15',
        checkOut: '2025-06-18',
        nights: 3,
        adults: 2,
        children: 0,
        total: 267.00,
        paymentMethod: 'Tarjeta de crédito',
        paymentStatus: 'paid',
        status: 'confirmed',
        specialRequests: 'Cama matrimonial',
        createdAt: '2024-05-15T14:30:22',
        updatedAt: '2024-05-15T14:30:22'
      },
      {
        id: 1002,
        guestName: 'María López',
        guestEmail: 'maria.lopez@email.com',
        guestPhone: '+34 677 234 567',
        guestAvatar: '/images/avatar-2.jpg',
        roomNumber: '205',
        roomType: 'Habitación Deluxe',
        roomTypeId: 2,
        checkIn: '2025-06-20',
        checkOut: '2025-06-23',
        nights: 3,
        adults: 2,
        children: 1,
        total: 387.00,
        paymentMethod: 'PayPal',
        paymentStatus: 'paid',
        status: 'pending',
        specialRequests: 'Cuna para bebé',
        createdAt: '2024-04-20T10:15:40',
        updatedAt: '2024-04-20T10:15:40'
      },
      // ... más datos mock
    ];
    
  } catch (err) {
    console.error('Error fetching reservations:', err);
    error.value = 'No se pudieron cargar las reservas. Por favor, intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
}

function debounceSearch() {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 300);
}

function clearSearch() {
  filters.value.search = '';
  applyFilters();
}

function applyFilters() {
  currentPage.value = 1;
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
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
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

// Selection methods
function isSelected(reservationId) {
  return selectedReservations.value.includes(reservationId);
}

function toggleSelection(reservationId) {
  const index = selectedReservations.value.indexOf(reservationId);
  if (index > -1) {
    selectedReservations.value.splice(index, 1);
  } else {
    selectedReservations.value.push(reservationId);
  }
}

function toggleAllSelection() {
  if (allSelected.value) {
    // Deselect all
    selectedReservations.value = selectedReservations.value.filter(id => 
      !paginatedReservations.value.some(r => r.id === id)
    );
  } else {
    // Select all on current page
    paginatedReservations.value.forEach(reservation => {
      if (!selectedReservations.value.includes(reservation.id)) {
        selectedReservations.value.push(reservation.id);
      }
    });
  }
}

// Formatting methods
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

function isUrgent(reservation) {
  const checkInDate = new Date(reservation.checkIn);
  const today = new Date();
  const daysDiff = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
  
  return reservation.status === 'pending' && daysDiff <= 1;
}

function canCancel(reservation) {
  return ['pending', 'confirmed'].includes(reservation.status);
}

function handleImageError(event) {
  event.target.src = '/images/avatar-placeholder.png';
}

// Modal methods
function openCreateModal() {
  selectedReservation.value = null;
  isEditing.value = false;
  showReservationModal.value = true;
}

function viewReservation(reservation) {
  selectedReservation.value = reservation;
  showViewModal.value = true;
}

function editReservation(reservation) {
  selectedReservation.value = { ...reservation };
  isEditing.value = true;
  showReservationModal.value = true;
  showViewModal.value = false;
}

function confirmDelete(reservation) {
  selectedReservation.value = reservation;
  showDeleteModal.value = true;
  showViewModal.value = false;
}

function closeReservationModal() {
  showReservationModal.value = false;
  selectedReservation.value = null;
  isEditing.value = false;
}

function closeViewModal() {
  showViewModal.value = false;
  selectedReservation.value = null;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  selectedReservation.value = null;
}

// Status change methods
async function confirmReservation(reservation) {
  try {
    const index = reservations.value.findIndex(r => r.id === reservation.id);
    if (index !== -1) {
      reservations.value[index].status = 'confirmed';
      reservations.value[index].updatedAt = new Date().toISOString();
    }
    alert(`Reserva ${formatReservationId(reservation.id)} confirmada`);
  } catch (error) {
    console.error('Error confirming reservation:', error);
    alert('Error al confirmar la reserva');
  }
}

async function cancelReservation(reservation) {
  if (!confirm(`¿Estás seguro de que deseas cancelar la reserva ${formatReservationId(reservation.id)}?`)) {
    return;
  }
  
  try {
    const index = reservations.value.findIndex(r => r.id === reservation.id);
    if (index !== -1) {
      reservations.value[index].status = 'cancelled';
      reservations.value[index].updatedAt = new Date().toISOString();
    }
    alert(`Reserva ${formatReservationId(reservation.id)} cancelada`);
  } catch (error) {
    console.error('Error canceling reservation:', error);
    alert('Error al cancelar la reserva');
  }
}

async function checkinReservation(reservation) {
  try {
    const index = reservations.value.findIndex(r => r.id === reservation.id);
    if (index !== -1) {
      reservations.value[index].status = 'checkedin';
      reservations.value[index].updatedAt = new Date().toISOString();
    }
    alert(`Check-in realizado para reserva ${formatReservationId(reservation.id)}`);
  } catch (error) {
    console.error('Error processing check-in:', error);
    alert('Error al realizar el check-in');
  }
}

async function checkoutReservation(reservation) {
  try {
    const index = reservations.value.findIndex(r => r.id === reservation.id);
    if (index !== -1) {
      reservations.value[index].status = 'completed';
      reservations.value[index].updatedAt = new Date().toISOString();
    }
    alert(`Check-out realizado para reserva ${formatReservationId(reservation.id)}`);
  } catch (error) {
    console.error('Error processing check-out:', error);
    alert('Error al realizar el check-out');
  }
}

// Bulk operations
async function bulkConfirm() {
  if (!confirm(`¿Confirmar ${selectedReservations.value.length} reservas seleccionadas?`)) {
    return;
  }
  
  try {
    selectedReservations.value.forEach(id => {
      const index = reservations.value.findIndex(r => r.id === id);
      if (index !== -1 && reservations.value[index].status === 'pending') {
        reservations.value[index].status = 'confirmed';
        reservations.value[index].updatedAt = new Date().toISOString();
      }
    });
    
    selectedReservations.value = [];
    alert('Reservas confirmadas exitosamente');
  } catch (error) {
    console.error('Error in bulk confirm:', error);
    alert('Error al confirmar las reservas');
  }
}

async function bulkCancel() {
  if (!confirm(`¿Cancelar ${selectedReservations.value.length} reservas seleccionadas?`)) {
    return;
  }
  
  try {
    selectedReservations.value.forEach(id => {
      const reservation = reservations.value.find(r => r.id === id);
      if (reservation && canCancel(reservation)) {
        const index = reservations.value.findIndex(r => r.id === id);
        if (index !== -1) {
          reservations.value[index].status = 'cancelled';
          reservations.value[index].updatedAt = new Date().toISOString();
        }
      }
    });
    
    selectedReservations.value = [];
    alert('Reservas canceladas exitosamente');
  } catch (error) {
    console.error('Error in bulk cancel:', error);
    alert('Error al cancelar las reservas');
  }
}

// Save/Delete handlers
async function handleReservationSave(reservationData) {
  try {
    if (isEditing.value) {
      // Update existing reservation
      const index = reservations.value.findIndex(r => r.id === reservationData.id);
      if (index !== -1) {
        reservations.value[index] = { 
          ...reservationData, 
          updatedAt: new Date().toISOString() 
        };
      }
    } else {
      // Create new reservation
      const newReservation = {
        ...reservationData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      reservations.value.unshift(newReservation);
    }
    
    closeReservationModal();
    
    const action = isEditing.value ? 'actualizada' : 'creada';
    alert(`Reserva ${formatReservationId(reservationData.id || Date.now())} ${action} exitosamente`);
    
  } catch (error) {
    console.error('Error saving reservation:', error);
    alert('Error al guardar la reserva. Por favor, intenta de nuevo.');
  }
}

async function handleDelete() {
  if (!selectedReservation.value) return;
  
  isDeleting.value = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    reservations.value = reservations.value.filter(r => r.id !== selectedReservation.value.id);
    
    closeDeleteModal();
    alert(`Reserva ${formatReservationId(selectedReservation.value.id)} eliminada correctamente`);
    
  } catch (error) {
    console.error('Error deleting reservation:', error);
    alert('Error al eliminar la reserva. Por favor, intenta de nuevo.');
  } finally {
    isDeleting.value = false;
  }
}

function handleStatusChange(newStatus) {
  if (!selectedReservation.value) return;
  
  const index = reservations.value.findIndex(r => r.id === selectedReservation.value.id);
  if (index !== -1) {
    reservations.value[index].status = newStatus;
    reservations.value[index].updatedAt = new Date().toISOString();
    selectedReservation.value.status = newStatus;
  }
}

// Initialize data
onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
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
  font-size: 0.875rem;
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

.table-active {
  background-color: rgba(13, 110, 253, 0.075);
}

.btn-group .btn {
  border-radius: 0.375rem;
}

.btn-group .btn:not(:last-child) {
  margin-right: 0.25rem;
}

.fw-medium {
  font-weight: 500;
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .d-flex.justify-content-between.align-items-center.mb-4 {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .btn-group {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-group .btn {
    margin-right: 0;
    margin-bottom: 0.25rem;
  }
}

@media (max-width: 576px) {
  .row.g-3 .col-md-3,
  .row.g-3 .col-md-2 {
    width: 100%;
    margin-bottom: 1rem;
  }
  
  .card-footer {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}
</style>