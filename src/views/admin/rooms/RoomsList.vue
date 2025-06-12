<!-- src/views/admin/RoomsManagement.vue -->
<template>
  <div class="rooms-page">
    <!-- Page header with actions -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-0">Gestión de Habitaciones</h1>
        <p class="text-muted">Administra todas las habitaciones del hotel</p>
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
          <i class="bi bi-plus-lg me-1"></i> Nueva Habitación
        </button>
      </div>
    </div>

    <!-- Filters and search -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
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
          <div class="col-md-2">
            <label for="floor" class="form-label">Piso</label>
            <select 
              id="floor" 
              v-model="filters.floor" 
              class="form-select"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option v-for="floor in floors" :key="floor" :value="floor">
                Piso {{ floor }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label for="capacity" class="form-label">Capacidad</label>
            <select 
              id="capacity" 
              v-model="filters.capacity" 
              class="form-select"
              @change="applyFilters"
            >
              <option value="">Todos</option>
              <option value="1">1 persona</option>
              <option value="2">2 personas</option>
              <option value="3">3 personas</option>
              <option value="4">4 personas</option>
              <option value="5+">5+ personas</option>
            </select>
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
              <option value="available">Disponible</option>
              <option value="occupied">Ocupada</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="cleaning">Limpieza</option>
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
                placeholder="Número, nombre, características..."
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
          <div class="col-md-1 d-flex align-items-end">
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

    <!-- Stats cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card border-0 bg-success bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-check-circle text-success fs-1"></i>
            <h4 class="mt-2 mb-0 text-success">{{ stats.available }}</h4>
            <small class="text-muted">Disponibles</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-primary bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-door-closed text-primary fs-1"></i>
            <h4 class="mt-2 mb-0 text-primary">{{ stats.occupied }}</h4>
            <small class="text-muted">Ocupadas</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-warning bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-tools text-warning fs-1"></i>
            <h4 class="mt-2 mb-0 text-warning">{{ stats.maintenance }}</h4>
            <small class="text-muted">Mantenimiento</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-info bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-droplet text-info fs-1"></i>
            <h4 class="mt-2 mb-0 text-info">{{ stats.cleaning }}</h4>
            <small class="text-muted">Limpieza</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Toggle view buttons -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="text-muted">
        {{ filteredRooms.length }} habitación{{ filteredRooms.length !== 1 ? 'es' : '' }} encontrada{{ filteredRooms.length !== 1 ? 's' : '' }}
      </div>
      <div class="btn-group">
        <button 
          class="btn" 
          :class="viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'" 
          @click="setViewMode('grid')"
        >
          <i class="bi bi-grid-3x3-gap"></i>
        </button>
        <button 
          class="btn" 
          :class="viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'" 
          @click="setViewMode('list')"
        >
          <i class="bi bi-list"></i>
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-2">Cargando habitaciones...</p>
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
    <div v-else-if="filteredRooms.length === 0" class="text-center my-5">
      <div class="empty-state">
        <i class="bi bi-door-closed display-1 text-muted"></i>
        <h3 class="mt-3">No se encontraron habitaciones</h3>
        <p class="text-muted">
          {{ rooms.length === 0 ? 'No hay habitaciones registradas.' : 'No hay habitaciones que coincidan con los filtros seleccionados.' }}
        </p>
        <div class="mt-3">
          <button 
            v-if="rooms.length === 0" 
            class="btn btn-primary me-2" 
            @click="openCreateModal"
          >
            Crear primera habitación
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

    <!-- Grid view -->
    <div v-else-if="viewMode === 'grid'" class="room-grid">
      <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
        <div class="col" v-for="room in paginatedRooms" :key="room.id">
          <div class="card h-100 room-card">
            <div class="position-relative">
              <img 
                :src="room.image" 
                class="card-img-top" 
                :alt="room.name"
                style="height: 180px; object-fit: cover;"
                @error="handleImageError"
              >
              <div class="position-absolute top-0 end-0 m-2">
                <span 
                  class="badge" 
                  :class="getStatusBadgeClass(room.status)"
                >
                  {{ getStatusLabel(room.status) }}
                </span>
              </div>
              <div class="position-absolute top-0 start-0 m-2">
                <span class="badge bg-dark">{{ room.number }}</span>
              </div>
            </div>
            <div class="card-body">
              <h5 class="card-title">{{ room.name }}</h5>
              <p class="card-text text-muted">{{ room.type }}</p>
              
              <div class="room-features d-flex flex-wrap gap-2 mb-3">
                <span class="badge bg-light text-dark">
                  <i class="bi bi-people"></i> {{ room.capacity }}
                </span>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-rulers"></i> {{ room.size }} m²
                </span>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-building"></i> Piso {{ room.floor }}
                </span>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-currency-euro"></i> {{ formatPrice(room.price) }}/noche
                </span>
              </div>
              
              <div class="amenities d-flex flex-wrap gap-1 mb-3">
                <span 
                  v-for="(amenity, index) in room.amenities.slice(0, 3)" 
                  :key="index" 
                  class="badge bg-primary bg-opacity-10 text-primary small"
                >
                  {{ amenity }}
                </span>
                <span 
                  v-if="room.amenities.length > 3" 
                  class="badge bg-primary bg-opacity-10 text-primary small"
                >
                  +{{ room.amenities.length - 3 }} más
                </span>
              </div>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
              <div class="last-updated small text-muted">
                {{ formatDate(room.updatedAt) }}
              </div>
              <div class="actions">
                <div class="btn-group">
                  <button 
                    class="btn btn-sm btn-outline-primary" 
                    @click="viewRoom(room)"
                    title="Ver detalles"
                  >
                    <i class="bi bi-eye"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-secondary" 
                    @click="editRoom(room)"
                    title="Editar"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger" 
                    @click="confirmDelete(room)"
                    title="Eliminar"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- List view -->
    <div v-else class="room-list">
      <div class="card shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th scope="col" class="sortable" @click="sortBy('number')">
                  Número
                  <i v-if="sortColumn === 'number'" class="bi" :class="getSortIconClass('number')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('name')">
                  Nombre
                  <i v-if="sortColumn === 'name'" class="bi" :class="getSortIconClass('name')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('type')">
                  Tipo
                  <i v-if="sortColumn === 'type'" class="bi" :class="getSortIconClass('type')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('capacity')">
                  Capacidad
                  <i v-if="sortColumn === 'capacity'" class="bi" :class="getSortIconClass('capacity')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('price')">
                  Precio
                  <i v-if="sortColumn === 'price'" class="bi" :class="getSortIconClass('price')"></i>
                </th>
                <th scope="col" class="sortable" @click="sortBy('status')">
                  Estado
                  <i v-if="sortColumn === 'status'" class="bi" :class="getSortIconClass('status')"></i>
                </th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="room in paginatedRooms" :key="room.id">
                <td><strong>{{ room.number }}</strong></td>
                <td>
                  <div class="d-flex align-items-center">
                    <img 
                      :src="room.image" 
                      class="rounded me-2" 
                      width="40" 
                      height="40"
                      style="object-fit: cover;"
                      :alt="room.name"
                      @error="handleImageError"
                    >
                    <div>
                      <div>{{ room.name }}</div>
                      <div class="small text-muted">Piso {{ room.floor }} • {{ room.size }} m²</div>
                    </div>
                  </div>
                </td>
                <td>{{ room.type }}</td>
                <td>
                  <i class="bi bi-people me-1"></i>{{ room.capacity }}
                </td>
                <td><strong>{{ formatPrice(room.price) }}</strong>/noche</td>
                <td>
                  <span 
                    class="badge" 
                    :class="getStatusBadgeClass(room.status)"
                  >
                    {{ getStatusLabel(room.status) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex gap-1">
                    <button 
                      class="btn btn-sm btn-outline-primary" 
                      @click="viewRoom(room)"
                      title="Ver detalles"
                    >
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-secondary" 
                      @click="editRoom(room)"
                      title="Editar"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-danger" 
                      @click="confirmDelete(room)"
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
      </div>
    </div>

    <!-- Pagination controls -->
    <div v-if="filteredRooms.length > 0" class="d-flex justify-content-between align-items-center mt-4">
      <div class="pagination-info">
        Mostrando <strong>{{ startIndex + 1 }}</strong> a <strong>{{ endIndex }}</strong> de <strong>{{ filteredRooms.length }}</strong> habitaciones
      </div>
      <nav aria-label="Paginación de habitaciones">
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

    <!-- Modals -->
    <RoomFormModal
      v-if="showRoomModal"
      :show="showRoomModal"
      :room="selectedRoom"
      :room-types="roomTypes"
      :is-editing="isEditing"
      @close="closeRoomModal"
      @save="handleRoomSave"
    />

    <RoomViewModal
      v-if="showViewModal"
      :show="showViewModal"
      :room="selectedRoom"
      @close="closeViewModal"
      @edit="editRoom"
      @delete="confirmDelete"
    />

    <DeleteConfirmModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :room="selectedRoom"
      :is-deleting="isDeleting"
      @close="closeDeleteModal"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import RoomFormModal from './RoomFormModal.vue';
import RoomViewModal from './RoomViewModal.vue';
import DeleteConfirmModal from './DeleteConfirmModal.vue';

// Router
const router = useRouter();

// State
const isLoading = ref(false);
const error = ref(null);
const rooms = ref([]);
const viewMode = ref(localStorage.getItem('roomsViewMode') || 'grid');

// Modal state
const showRoomModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const selectedRoom = ref(null);
const isEditing = ref(false);
const isDeleting = ref(false);

// Search debounce
let searchTimeout = null;

// Room types and floors
const roomTypes = ref([
  { id: 1, name: 'Habitación Estándar' },
  { id: 2, name: 'Habitación Deluxe' },
  { id: 3, name: 'Suite Junior' },
  { id: 4, name: 'Suite Ejecutiva' }
]);

const floors = ref([1, 2, 3, 4, 5]);

// Filter and sorting state
const filters = ref({
  roomType: '',
  floor: '',
  capacity: '',
  status: '',
  search: ''
});

const sortColumn = ref('number');
const sortDirection = ref('asc');
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Watch for viewMode changes and save to localStorage
watch(viewMode, (newVal) => {
  localStorage.setItem('roomsViewMode', newVal);
});

// Computed properties
const stats = computed(() => {
  const available = rooms.value.filter(r => r.status === 'available').length;
  const occupied = rooms.value.filter(r => r.status === 'occupied').length;
  const maintenance = rooms.value.filter(r => r.status === 'maintenance').length;
  const cleaning = rooms.value.filter(r => r.status === 'cleaning').length;
  
  return { available, occupied, maintenance, cleaning };
});

const filteredRooms = computed(() => {
  let result = [...rooms.value];
  
  // Apply filters
  if (filters.value.roomType) {
    const typeId = parseInt(filters.value.roomType);
    result = result.filter(r => r.typeId === typeId);
  }
  
  if (filters.value.floor) {
    result = result.filter(r => r.floor.toString() === filters.value.floor.toString());
  }
  
  if (filters.value.capacity) {
    if (filters.value.capacity === '5+') {
      result = result.filter(r => r.capacity >= 5);
    } else {
      const capacity = parseInt(filters.value.capacity);
      result = result.filter(r => r.capacity === capacity);
    }
  }
  
  if (filters.value.status) {
    result = result.filter(r => r.status === filters.value.status);
  }
  
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase();
    result = result.filter(r => 
      r.number.toLowerCase().includes(searchTerm) ||
      r.name.toLowerCase().includes(searchTerm) ||
      r.type.toLowerCase().includes(searchTerm) ||
      r.description?.toLowerCase().includes(searchTerm) ||
      r.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm))
    );
  }
  
  // Apply sorting
  result.sort((a, b) => {
    let comparison = 0;
    
    if (sortColumn.value === 'number') {
      comparison = a.number.localeCompare(b.number, undefined, { numeric: true });
    } else if (sortColumn.value === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortColumn.value === 'type') {
      comparison = a.type.localeCompare(b.type);
    } else if (sortColumn.value === 'capacity') {
      comparison = a.capacity - b.capacity;
    } else if (sortColumn.value === 'price') {
      comparison = a.price - b.price;
    } else if (sortColumn.value === 'status') {
      comparison = a.status.localeCompare(b.status);
    }
    
    return sortDirection.value === 'asc' ? comparison : -comparison;
  });
  
  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredRooms.value.length / itemsPerPage.value);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage.value, filteredRooms.value.length);
});

const paginatedRooms = computed(() => {
  return filteredRooms.value.slice(startIndex.value, endIndex.value);
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

// Methods
async function refreshData() {
  isLoading.value = true;
  error.value = null;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    rooms.value = [
      {
        id: 1,
        number: '101',
        name: 'Habitación Estándar',
        type: 'Habitación Estándar',
        typeId: 1,
        floor: 1,
        capacity: 2,
        size: 25,
        price: 89.00,
        description: 'Habitación acogedora con todas las comodidades necesarias para una estancia agradable. Incluye baño privado y vistas a la ciudad.',
        image: '/images/room-standard.jpeg',
        amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
        status: 'available',
        rating: 4.5,
        reviewCount: 128,
        updatedAt: '2024-05-10T14:30:22',
        createdAt: '2024-01-15T10:00:00'
      },
      {
        id: 2,
        number: '102',
        name: 'Habitación Estándar',
        type: 'Habitación Estándar',
        typeId: 1,
        floor: 1,
        capacity: 2,
        size: 25,
        price: 89.00,
        description: 'Habitación acogedora con todas las comodidades necesarias para una estancia agradable. Incluye baño privado y vistas a la ciudad.',
        image: '/images/room-standard.jpeg',
        amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
        status: 'occupied',
        rating: 4.5,
        reviewCount: 128,
        updatedAt: '2024-05-10T14:30:22',
        createdAt: '2024-01-15T10:00:00'
      },
      // ... más datos mock
    ];
    
  } catch (err) {
    console.error('Error fetching rooms:', err);
    error.value = 'No se pudieron cargar las habitaciones. Por favor, intenta de nuevo.';
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
    roomType: '',
    floor: '',
    capacity: '',
    status: '',
    search: ''
  };
  applyFilters();
}

function setViewMode(mode) {
  viewMode.value = mode;
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

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatPrice(price) {
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

function handleImageError(event) {
  event.target.src = '/images/room-placeholder.jpg';
}

// Modal methods
function openCreateModal() {
  selectedRoom.value = null;
  isEditing.value = false;
  showRoomModal.value = true;
}

function viewRoom(room) {
  selectedRoom.value = room;
  showViewModal.value = true;
}

function editRoom(room) {
  selectedRoom.value = { ...room };
  isEditing.value = true;
  showRoomModal.value = true;
  showViewModal.value = false;
}

function confirmDelete(room) {
  selectedRoom.value = room;
  showDeleteModal.value = true;
  showViewModal.value = false;
}

function closeRoomModal() {
  showRoomModal.value = false;
  selectedRoom.value = null;
  isEditing.value = false;
}

function closeViewModal() {
  showViewModal.value = false;
  selectedRoom.value = null;
}

function closeDeleteModal() {
  showDeleteModal.value = false;
  selectedRoom.value = null;
}

async function handleRoomSave(roomData) {
  try {
    if (isEditing.value) {
      // Update existing room
      const index = rooms.value.findIndex(r => r.id === roomData.id);
      if (index !== -1) {
        rooms.value[index] = { 
          ...roomData, 
          updatedAt: new Date().toISOString() 
        };
      }
    } else {
      // Create new room
      const newRoom = {
        ...roomData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      rooms.value.push(newRoom);
    }
    
    closeRoomModal();
    
    // Show success message (you might want to use a toast notification)
    const action = isEditing.value ? 'actualizada' : 'creada';
    alert(`Habitación ${roomData.number} ${action} exitosamente`);
    
  } catch (error) {
    console.error('Error saving room:', error);
    alert('Error al guardar la habitación. Por favor, intenta de nuevo.');
  }
}

async function handleDelete() {
  if (!selectedRoom.value) return;
  
  isDeleting.value = true;
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove room from the list
    rooms.value = rooms.value.filter(r => r.id !== selectedRoom.value.id);
    
    closeDeleteModal();
    
    // Show success message
    alert(`Habitación ${selectedRoom.value.number} eliminada correctamente`);
    
  } catch (error) {
    console.error('Error deleting room:', error);
    alert('Error al eliminar la habitación. Por favor, intenta de nuevo.');
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

.room-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.badge {
  font-size: 0.75rem;
}

.card-footer {
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125);
}

.btn-group .btn {
  border-radius: 0.375rem;
}

.btn-group .btn:not(:last-child) {
  margin-right: 0.25rem;
}

@media (max-width: 768px) {
  .table-responsive {
    overflow-x: auto;
  }
  
  .pagination {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .room-card .card-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .room-card .actions {
    align-self: stretch;
  }
  
  .room-card .btn-group {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .d-flex.justify-content-between.align-items-center.mb-4 {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .row.g-3 .col-md-2,
  .row.g-3 .col-md-3 {
    width: 100%;
  }
}
</style>