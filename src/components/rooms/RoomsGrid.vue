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
        
        <!-- Grid de habitaciones -->
        <div class="row g-4">
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
        
        <!-- Mensaje cuando no hay resultados -->
        <div v-if="filteredRooms.length === 0" class="text-center py-5">
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
  import RoomCard from './RoomCard.vue'
  
  const props = defineProps({
    rooms: {
      type: Array,
      default: () => [
        {
          id: 1,
          name: 'Habitación Estándar',
          image: '/room-standard.jpg',
          price: 89.00,
          size: 25,
          capacity: 2,
          bedType: 'Cama doble',
          description: 'Habitación acogedora con todas las comodidades necesarias para una estancia agradable. Incluye baño privado y vistas a la ciudad.',
          amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño privado'],
          isPopular: true,
          isFavorite: false
        },
        {
          id: 2,
          name: 'Habitación Deluxe',
          image: '/room-deluxe.jpg',
          price: 129.00,
          size: 35,
          capacity: 2,
          bedType: 'Cama king',
          description: 'Habitación espaciosa con vistas panorámicas. Equipada con minibar, escritorio y zona de estar. Perfecta para viajeros de negocios y placer.',
          amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado'],
          isPopular: false,
          isFavorite: false
        },
        {
          id: 3,
          name: 'Suite Junior',
          image: '/room-junior-suite.jpg',
          price: 159.00,
          size: 45,
          capacity: 3,
          bedType: 'Cama king + sofá cama',
          description: 'Suite elegante con dormitorio y sala de estar separada. Ofrece un espacio perfecto para relajarse después de un día de turismo o negocios.',
          amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón'],
          isNew: true,
          isFavorite: false
        },
        {
          id: 4,
          name: 'Suite Ejecutiva',
          image: '/room-executive-suite.jpg',
          price: 219.00,
          size: 60,
          capacity: 4,
          bedType: 'Cama king + 2 camas individuales',
          description: 'Amplia suite con dormitorio separado, sala de estar y comedor. Ideal para familias o estadías prolongadas. Incluye servicio de mayordomo.',
          amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Caja fuerte', 'Baño privado', 'Balcón', 'Vista al mar', 'Desayuno incluido', 'Servicio de habitaciones'],
          isPopular: true,
          isFavorite: false
        },
        {
          id: 5,
          name: 'Habitación Familiar',
          image: '/room-family.jpg',
          price: 189.00,
          size: 50,
          capacity: 4,
          bedType: '2 camas dobles',
          description: 'Habitación espaciosa diseñada para familias. Incluye zona de juegos para niños y todas las comodidades para una estancia confortable.',
          amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Minibar', 'Baño privado', 'Parking'],
          isNew: false,
          isFavorite: false
        },
        {
          id: 6,
          name: 'Habitación Accesible',
          image: '/room-accessible.jpg',
          price: 89.00,
          size: 30,
          capacity: 2,
          bedType: 'Cama doble',
          description: 'Habitación diseñada para ofrecer accesibilidad total. Cuenta con baño adaptado y todas las facilidades para una estancia cómoda.',
          amenities: ['WiFi', 'TV', 'Aire acondicionado', 'Baño adaptado', 'Parking'],
          isNew: false,
          isFavorite: false
        }
      ]
    }
  })
  
  const router = useRouter()
  const searchTerm = ref('')
  const selectedCapacity = ref('')
  const selectedAmenity = ref('')
  const sortOption = ref('popular')
  
  // Extraer opciones únicas para los filtros
  const capacityOptions = computed(() => {
    const capacities = [...new Set(props.rooms.map(room => room.capacity))]
    return capacities.sort((a, b) => a - b)
  })
  
  const amenityOptions = computed(() => {
    const amenitiesList = props.rooms.flatMap(room => room.amenities)
    return [...new Set(amenitiesList)].sort()
  })
  
  // Filtrar y ordenar habitaciones
  const filteredRooms = computed(() => {
    let result = [...props.rooms]
    
    // Aplicar filtro de búsqueda
    if (searchTerm.value) {
      const term = searchTerm.value.toLowerCase()
      result = result.filter(room => 
        room.name.toLowerCase().includes(term) || 
        room.description.toLowerCase().includes(term)
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
    // Aquí se implementaría la lógica para guardar los favoritos en el estado global o localStorage
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
  
  // Opcional: Puede agregarse una función para cargar las habitaciones desde una API
  onMounted(() => {
    // fetchRooms()
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