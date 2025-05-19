<template>
    <div class="rooms-page">
      <!-- Page header with actions -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-0">Gestión de Habitaciones</h1>
          <p class="text-muted">Administra todas las habitaciones del hotel</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary" @click="refreshData">
            <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
          </button>
          <button class="btn btn-primary" @click="createRoom">
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
              <select id="roomType" v-model="filters.roomType" class="form-select">
                <option value="">Todos</option>
                <option v-for="type in roomTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <label for="floor" class="form-label">Piso</label>
              <select id="floor" v-model="filters.floor" class="form-select">
                <option value="">Todos</option>
                <option v-for="floor in floors" :key="floor" :value="floor">
                  {{ floor }}
                </option>
              </select>
            </div>
            <div class="col-md-2">
              <label for="capacity" class="form-label">Capacidad</label>
              <select id="capacity" v-model="filters.capacity" class="form-select">
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
              <select id="status" v-model="filters.status" class="form-select">
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
                >
              </div>
            </div>
            <div class="col-md-1 d-flex align-items-end">
              <button class="btn btn-primary w-100" @click="applyFilters">
                <i class="bi bi-funnel"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Toggle view buttons -->
      <div class="d-flex justify-content-end mb-3">
        <div class="btn-group">
          <button 
            class="btn" 
            :class="viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'" 
            @click="viewMode = 'grid'"
          >
            <i class="bi bi-grid-3x3-gap"></i>
          </button>
          <button 
            class="btn" 
            :class="viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'" 
            @click="viewMode = 'list'"
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
        <button class="btn btn-sm btn-outline-danger ms-2" @click="refreshData">Reintentar</button>
      </div>
  
      <!-- Empty state -->
      <div v-else-if="filteredRooms.length === 0" class="text-center my-5">
        <div class="empty-state">
          <i class="bi bi-door-closed display-1 text-muted"></i>
          <h3 class="mt-3">No se encontraron habitaciones</h3>
          <p class="text-muted">No hay habitaciones que coincidan con los filtros seleccionados.</p>
          <button class="btn btn-outline-primary mt-2" @click="resetFilters">
            Limpiar filtros
          </button>
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
                  Actualizada: {{ formatDate(room.updatedAt) }}
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
                  <td>{{ room.number }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <img 
                        :src="room.image" 
                        class="rounded me-2" 
                        width="40" 
                        height="40"
                        style="object-fit: cover;"
                        :alt="room.name"
                      >
                      <div>
                        <div>{{ room.name }}</div>
                        <div class="small text-muted">Piso {{ room.floor }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ room.type }}</td>
                  <td>{{ room.capacity }} personas</td>
                  <td>{{ formatPrice(room.price) }}/noche</td>
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
          Mostrando <b>{{ startIndex + 1 }}</b> a <b>{{ endIndex }}</b> de <b>{{ filteredRooms.length }}</b> habitaciones
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
  
      <!-- Delete confirmation modal -->
      <div v-if="showDeleteModal" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title text-danger">Eliminar Habitación</h5>
              <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas eliminar la habitación <b>{{ selectedRoom?.number }}</b>?</p>
              <p>Esta acción no se puede deshacer y se eliminará permanentemente la información de la habitación.</p>
              
              <div v-if="selectedRoom?.status === 'occupied'" class="alert alert-warning">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Advertencia:</strong> Esta habitación está actualmente ocupada. Eliminarla podría afectar a las reservas existentes.
              </div>
  
              <div v-if="hasReservations" class="alert alert-danger">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>¡Atención!</strong> Esta habitación tiene {{ reservationsCount }} reservas asociadas que también serán eliminadas.
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Cancelar</button>
              <button 
                type="button" 
                class="btn btn-danger" 
                @click="deleteRoom"
                :disabled="isDeleting"
              >
                <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isDeleting ? 'Eliminando...' : 'Sí, eliminar habitación' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  
  // Router
  const router = useRouter();
  
  // State
  const isLoading = ref(true);
  const error = ref(null);
  const rooms = ref([]);
  const viewMode = ref(localStorage.getItem('roomsViewMode') || 'grid');
  
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
  
  // Modal state
  const showDeleteModal = ref(false);
  const selectedRoom = ref(null);
  const isDeleting = ref(false);
  const hasReservations = ref(false);
  const reservationsCount = ref(0);
  
  // Watch for viewMode changes and save to localStorage
  watch(viewMode, (newVal) => {
    localStorage.setItem('roomsViewMode', newVal);
  });
  
  // Computed properties
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
        r.description.toLowerCase().includes(searchTerm) ||
        r.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortColumn.value === 'number') {
        // Custom sorting for room numbers (assuming format like "101", "201", etc.)
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
            updatedAt: '2024-05-10T14:30:22'
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
            updatedAt: '2024-05-10T14:30:22'
          },
          {
            id: 3,
            number: '103',
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
            status: 'cleaning',
            rating: 4.5,
            reviewCount: 128,
            updatedAt: '2024-05-10T14:30:22'
          },
          {
            id: 4,
            number: '104',
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
            status: 'maintenance',
            rating: 4.5,
            reviewCount: 128,
            updatedAt: '2024-05-10T14:30:22'
          },
          {
            id: 5,
            number: '201',
            name: 'Habitación Deluxe',
            type: 'Habitación Deluxe',
            typeId: 2,
            floor: 2,
            capacity: 2,
            size: 35,
            price: 129.00,
            description: 'Habitación espaciosa con vistas panorámicas. Equipada con minibar, escritorio y zona de estar. Perfecta para viajeros de negocios y placer.',
            image: '/images/room-deluxe.jpeg',
            amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado'],
            status: 'available',
            rating: 4.7,
            reviewCount: 95,
            updatedAt: '2024-05-05T10:15:40'
          },
          {
            id: 6,
            number: '202',
            name: 'Habitación Deluxe',
            type: 'Habitación Deluxe',
            typeId: 2,
            floor: 2,
            capacity: 2,
            size: 35,
            price: 129.00,
            description: 'Habitación espaciosa con vistas panorámicas. Equipada con minibar, escritorio y zona de estar. Perfecta para viajeros de negocios y placer.',
            image: '/images/room-deluxe.jpeg',
            amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado'],
            status: 'occupied',
            rating: 4.7,
            reviewCount: 95,
            updatedAt: '2024-05-05T10:15:40'
          },
          {
            id: 7,
            number: '301',
            name: 'Suite Junior',
            type: 'Suite Junior',
            typeId: 3,
            floor: 3,
            capacity: 3,
            size: 45,
            price: 159.00,
            description: 'Suite elegante con dormitorio y sala de estar separada. Ofrece un espacio perfecto para relajarse después de un día de turismo o negocios.',
            image: '/images/room-junior-suite.jpg',
            amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón'],
            status: 'available',
            rating: 4.8,
            reviewCount: 76,
            updatedAt: '2024-05-18T09:45:12'
          },
          {
            id: 8,
            number: '302',
            name: 'Suite Junior',
            type: 'Suite Junior',
            typeId: 3,
            floor: 3,
            capacity: 3,
            size: 45,
            price: 159.00,
            description: 'Suite elegante con dormitorio y sala de estar separada. Ofrece un espacio perfecto para relajarse después de un día de turismo o negocios.',
            image: '/images/room-junior-suite.jpg',
            amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón'],
            status: 'available',
            rating: 4.8,
            reviewCount: 76,
            updatedAt: '2024-05-18T09:45:12'
          },
          {
            id: 9,
            number: '401',
            name: 'Suite Ejecutiva',
            type: 'Suite Ejecutiva',
            typeId: 4,
            floor: 4,
            capacity: 4,
            size: 60,
            price: 219.00,
            description: 'Amplia suite con dormitorio separado, sala de estar y comedor. Ideal para familias o estadías prolongadas. Incluye servicio de mayordomo.',
            image: '/images/room-executive-suite.jpg',
            amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón', 'Vista al mar', 'Desayuno incluido', 'Servicio de habitaciones'],
            status: 'available',
            rating: 4.9,
            reviewCount: 112,
            updatedAt: '2024-05-01T16:22:33'
          },
          {
            id: 10,
            number: '402',
            name: 'Suite Ejecutiva',
            type: 'Suite Ejecutiva',
            typeId: 4,
            floor: 4,
            capacity: 4,
            size: 60,
            price: 219.00,
            description: 'Amplia suite con dormitorio separado, sala de estar y comedor. Ideal para familias o estadías prolongadas. Incluye servicio de mayordomo.',
            image: '/images/room-executive-suite.jpg',
            amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón', 'Vista al mar', 'Desayuno incluido', 'Servicio de habitaciones'],
            status: 'occupied',
            rating: 4.9,
            reviewCount: 112,
            updatedAt: '2024-05-01T16:22:33'
          },
          {
            id: 11,
            number: '501',
            name: 'Suite Presidencial',
            type: 'Suite Ejecutiva',
            typeId: 4,
            floor: 5,
            capacity: 6,
            size: 120,
            price: 459.00,
            description: 'Nuestra suite más lujosa con vistas panorámicas, múltiples dormitorios, comedor privado y todas las comodidades premium. Experiencia inigualable para los huéspedes más exigentes.',
            image: '/images/room-presidential-suite.jpg',
            amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baños privados', 'Balcón', 'Vista al mar', 'Desayuno incluido', 'Servicio de habitaciones', 'Servicio de mayordomo', 'Sala de reuniones privada', 'Jacuzzi', 'Cocina equipada'],
            status: 'available',
            rating: 5.0,
            reviewCount: 45,
            updatedAt: '2024-05-12T11:18:45'
          },
          {
            id: 12,
            number: '502',
            name: 'Suite Familiar',
            type: 'Suite Ejecutiva',
            typeId: 4,
            floor: 5,
            capacity: 5,
            size: 85,
            price: 289.00,
            description: 'Suite amplia diseñada para familias, con múltiples camas, zona de juegos para niños y comodidades orientadas a familias. Perfecta para unas vacaciones en familia.',
            image: '/images/room-family-suite.jpg',
            amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón', 'Desayuno incluido', 'Zona de juegos infantil', 'Nevera', 'Microondas'],
            status: 'available',
            rating: 4.8,
            reviewCount: 78,
            updatedAt: '2024-05-17T14:30:22'
          }
        ];
        
        isLoading.value = false;
      } catch (err) {
        console.error('Error fetching rooms:', err);
        error.value = 'No se pudieron cargar las habitaciones. Por favor, intenta de nuevo.';
        isLoading.value = false;
      }
    }, 800); // Simulating network delay
  }
  
  function applyFilters() {
    currentPage.value = 1; // Reset to first page when filtering
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
  
  function createRoom() {
    router.push({ name: 'admin.rooms.create' });
  }
  
  function viewRoom(room) {
    router.push({ 
      name: 'admin.rooms.view', 
      params: { id: room.id } 
    });
  }
  
  function editRoom(room) {
    router.push({ 
      name: 'admin.rooms.edit', 
      params: { id: room.id } 
    });
  }
  
  function confirmDelete(room) {
    selectedRoom.value = room;
    
    // In a real app, you would check if there are any reservations for this room
    hasReservations.value = room.status === 'occupied';
    reservationsCount.value = room.status === 'occupied' ? 1 : 0;
    
    showDeleteModal.value = true;
  }
  
  async function deleteRoom() {
    if (!selectedRoom.value) return;
    
    isDeleting.value = true;
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove room from the list
      rooms.value = rooms.value.filter(r => r.id !== selectedRoom.value.id);
      
      // Show success message (you might want to use a toast notification here)
      alert(`Habitación ${selectedRoom.value.number} eliminada correctamente`);
      
      // Close modal
      showDeleteModal.value = false;
      selectedRoom.value = null;
    } catch (err) {
      console.error('Error deleting room:', err);
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
  
  .room-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .room-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
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