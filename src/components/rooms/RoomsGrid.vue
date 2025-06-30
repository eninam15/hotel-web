<template>
    <section class="rooms-section py-5">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold display-5 mb-2">Nuestras Habitaciones</h2>
          <p class="text-muted mx-auto" style="max-width: 700px;">
            Descubre nuestras habitaciones diseñadas para ofrecerte la máxima comodidad y una estancia inolvidable.
          </p>
        </div>
        
        <!-- Filtros -->
        <div class="rooms-filters mb-4">
          <div class="row g-2 align-items-center">
            <div class="col-12 col-md-auto">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <i class="bi bi-search"></i>
                </span>
                <input 
                  type="text" 
                  class="form-control border-start-0" 
                  placeholder="Buscar habitaciones..." 
                  v-model="searchTerm"
                >
              </div>
            </div>
            <div class="col-6 col-md-auto">
              <select class="form-select" v-model="selectedCapacity">
                <option value="">Capacidad</option>
                <option v-for="option in capacityOptions" :key="option" :value="option">
                  {{ option }} {{ option === 1 ? 'persona' : 'personas' }}
                </option>
              </select>
            </div>
            <div class="col-6 col-md-auto">
              <select class="form-select" v-model="selectedAmenity">
                <option value="">Amenidades</option>
                <option v-for="amenity in amenityOptions" :key="amenity" :value="amenity">
                  {{ amenity }}
                </option>
              </select>
            </div>
            <div class="col-12 col-md-auto ms-md-auto">
              <select class="form-select" v-model="sortOption">
                <option value="price-asc">Precio: menor a mayor</option>
                <option value="price-desc">Precio: mayor a menor</option>
                <option value="name">Nombre</option>
                <option value="popular">Más populares</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando habitaciones...</span>
          </div>
          <p class="text-muted mt-3">Cargando habitaciones disponibles...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="alert alert-warning text-center">
          <i class="bi bi-exclamation-triangle fs-2 mb-3"></i>
          <h5>Error al cargar habitaciones</h5>
          <p class="mb-3">{{ error }}</p>
          <button class="btn btn-outline-primary" @click="loadRooms">
            <i class="bi bi-arrow-clockwise me-2"></i>Reintentar
          </button>
        </div>
        
        <!-- Grid de habitaciones -->
        <div v-else-if="rooms.length > 0" class="row g-4">
          <div 
            v-for="room in filteredRooms" 
            :key="room.id"
            class="col-sm-6 col-lg-4"
          >
            <RoomCard 
              :room="room" 
              @favorite="handleFavorite"
              @details="viewRoomDetails"
              @book="bookRoom"
            />
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-5">
          <i class="bi bi-house fs-1 text-muted mb-3"></i>
          <h4>No hay habitaciones disponibles</h4>
          <p class="text-muted">Actualmente no tenemos habitaciones para mostrar.</p>
        </div>
        
        <!-- Mensaje cuando no hay resultados -->
        <div v-if="!loading && !error && rooms.length > 0 && filteredRooms.length === 0" class="text-center py-5">
          <i class="bi bi-emoji-frown fs-1 text-muted mb-3"></i>
          <h4>No se encontraron habitaciones</h4>
          <p class="text-muted">Por favor, intenta con otros filtros.</p>
          <button class="btn btn-outline-primary mt-2" @click="resetFilters">
            <i class="bi bi-arrow-counterclockwise me-2"></i>Restablecer filtros
          </button>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { habitacionService } from '@/services'
  import RoomCard from './RoomCard.vue'
  
  const router = useRouter()
  
  // Estado reactivo
  const rooms = ref([])
  const loading = ref(true)
  const error = ref(null)
  const searchTerm = ref('')
  const selectedCapacity = ref('')
  const selectedAmenity = ref('')
  const sortOption = ref('popular')
  
  // Cargar habitaciones al montar el componente
  onMounted(async () => {
    await loadRooms()
  })
  
  // Función para cargar habitaciones
  async function loadRooms() {
    try {
      loading.value = true
      error.value = null
      
      const response = await habitacionService.getAllHabitaciones()
      console.log('Datos de habitaciones recibidos:', response)
      
      // Transformar los datos de la API al formato esperado por el componente
      rooms.value = response.map(habitacion => ({
        id: habitacion.id,
        name: habitacion.name,
        image: habitacion.image || '/images/room-default.jpg',
        price: parseFloat(habitacion.price),
        size: parseFloat(habitacion.size || 25),
        capacity: habitacion.capacity,
        adults: habitacion.capacity,
        children: 0,
        bedType: habitacion.type,
        description: habitacion.description || 'Habitación cómoda con todas las comodidades necesarias.',
        amenities: habitacion.amenities || ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
        status: habitacion.status,
        hotel: habitacion.hotel ? {
          id: habitacion.hotel.id,
          name: habitacion.hotel.nombre,
          city: habitacion.hotel.ciudad
        } : null,
        // Propiedades adicionales para la UI
        isPopular: Math.random() > 0.7,
        isFavorite: false,
        isNew: checkIfNew(habitacion.created_at),
        number: habitacion.number,
        floor: habitacion.floor
      }))
      
    } catch (err) {
      console.error('Error al cargar habitaciones:', err)
      error.value = err.message || 'No se pudieron cargar las habitaciones'
    } finally {
      loading.value = false
    }
  }
  
  // Función para verificar si una habitación es nueva
  function checkIfNew(createdAt) {
    if (!createdAt) return false
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now - created)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30
  }
  
  // Extraer opciones únicas para los filtros
  const capacityOptions = computed(() => {
    const capacities = [...new Set(rooms.value.map(room => room.capacity))]
    return capacities.sort((a, b) => a - b)
  })
  
  const amenityOptions = computed(() => {
    const amenitiesList = rooms.value.flatMap(room => room.amenities)
    return [...new Set(amenitiesList)].sort()
  })
  
  // Filtrar y ordenar habitaciones
  const filteredRooms = computed(() => {
    let result = [...rooms.value]
    
    // Aplicar filtro de búsqueda
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase()
      result = result.filter(room => 
        room.name.toLowerCase().includes(term) || 
        room.description.toLowerCase().includes(term) ||
        room.number.toLowerCase().includes(term) ||
        room.bedType.toLowerCase().includes(term)
      )
    }
    
    // Filtrar por capacidad
    if (selectedCapacity.value) {
      result = result.filter(room => room.capacity === selectedCapacity.value)
    }
    
    // Filtrar por amenidad
    if (selectedAmenity.value) {
      result = result.filter(room => 
        room.amenities.includes(selectedAmenity.value)
      )
    }
    
    // Aplicar ordenamiento
    switch (sortOption.value) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'popular':
        result.sort((a, b) => {
          if (a.isPopular === b.isPopular) return 0
          return a.isPopular ? -1 : 1
        })
        break
    }
    
    return result
  })
  
  // Funciones de manejo de eventos
  const handleFavorite = ({ roomId, isFavorite }) => {
    // Encontrar la habitación y actualizar su estado de favorito
    const room = rooms.value.find(r => r.id === roomId)
    if (room) {
      room.isFavorite = isFavorite
    }
    console.log(`Habitación ${roomId} ${isFavorite ? 'añadida a' : 'eliminada de'} favoritos`)
  }
  
  const viewRoomDetails = (roomId) => {
    router.push({ name: 'room-detail', params: { id: roomId } })
  } 
  
  const bookRoom = (roomId) => {
    router.push({ name: 'booking', query: { roomId } })
  }
  
  const resetFilters = () => {
    searchTerm.value = ''
    selectedCapacity.value = ''
    selectedAmenity.value = ''
    sortOption.value = 'popular'
  }

  // Exponer función para refrescar desde componentes padre
  defineExpose({
    loadRooms
  })
  </script>
  
  <style scoped>
  .rooms-section {
    background-color: #f8f9fa;
    position: relative;
  }
  
  .rooms-filters {
    background-color: white;
    border-radius: 10px;
    padding: 15px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.05);
    margin-bottom: 30px;
  }
  
  .form-select, .form-control {
    border-radius: 8px;
    padding: 10px 15px;
    font-size: 0.95rem;
  }
  
  .input-group-text {
    padding-left: 15px;
    padding-right: 5px;
    border-radius: 8px 0 0 8px;
  }
  
  .form-control:focus, .form-select:focus {
    box-shadow: 0 0 0 0.2rem rgba(156, 39, 176, 0.25);
    border-color: #9C27B0;
  }
  
  @media (max-width: 767px) {
    .rooms-filters .row {
      row-gap: 10px !important;
    }
  }
  </style>