<template>
    <div class="room-card h-100">
      <div class="room-image position-relative">
        <img :src="roomImage" class="img-fluid" :alt="room.name" @error="handleImageError" />
        <div class="room-tags">
          <span v-if="room.isNew" class="badge bg-success me-2">Nuevo</span>
          <span v-if="room.isPopular" class="badge bg-danger">Popular</span>
          <span v-if="room.status && room.status !== 'available'" 
                class="badge me-2" 
                :class="getStatusBadgeClass(room.status)">
            {{ getStatusText(room.status) }}
          </span>
        </div>
        <button 
          class="favorite-btn" 
          @click.prevent="toggleFavorite"
          :class="{'active': isFavorite}"
          :aria-label="isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
        >
          <i class="bi" :class="isFavorite ? 'bi-heart-fill' : 'bi-heart'"></i>
        </button>
      </div>
      
      <div class="room-info p-3">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h5 class="fw-bold mb-0">{{ room.name }}</h5>
            <small class="text-muted" v-if="room.number">
              <i class="bi bi-door-closed me-1"></i>Habitación {{ room.number }}
              <span v-if="room.floor" class="ms-2">
                <i class="bi bi-building me-1"></i>Piso {{ room.floor }}
              </span>
            </small>
          </div>
          <div class="price-tag">
            <span class="fs-5 fw-bold text-primary">{{ formatPrice(room.price) }}</span>
            <span class="text-muted small">/noche</span>
          </div>
        </div>
        
        <div class="room-features mb-3">
          <span class="room-feature">
            <i class="bi bi-rulers"></i> {{ room.size }}m²
          </span>
          <span class="room-feature">
            <i class="bi bi-people-fill"></i> {{ room.capacity }} {{ room.capacity === 1 ? 'persona' : 'personas' }}
          </span>
          <span class="room-feature">
            <i class="bi bi-door-open"></i> {{ room.bedType }}
          </span>
        </div>

        <!-- Hotel info if available -->
        <div v-if="room.hotel" class="hotel-info mb-3">
          <small class="text-muted">
            <i class="bi bi-building me-1"></i>{{ room.hotel.name }} - {{ room.hotel.city }}
          </small>
        </div>
        
        <p class="room-description text-muted mb-3">{{ truncateText(room.description, 100) }}</p>
        
        <div class="room-amenities mb-3">
          <span 
            v-for="(amenity, index) in visibleAmenities" 
            :key="index" 
            class="amenity-badge"
          >
            <i :class="getAmenityIcon(amenity)"></i> {{ amenity }}
          </span>
          <span v-if="room.amenities.length > 4" class="amenity-badge more">
            +{{ room.amenities.length - 4 }}
          </span>
        </div>
        
        <div class="d-flex justify-content-between align-items-center">
          <button 
            class="btn btn-outline-secondary btn-sm"
            @click="$emit('details', room.id)"
          >
            Ver detalles <i class="bi bi-info-circle ms-1"></i>
          </button>
          <button 
            class="btn btn-primary"
            @click="$emit('book', room.id)"
            :disabled="room.status !== 'available'"
          >
            {{ room.status === 'available' ? 'Reservar' : 'No disponible' }}
            <i class="bi bi-calendar-check ms-1" v-if="room.status === 'available'"></i>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, defineProps, defineEmits } from 'vue'
  
  const props = defineProps({
    room: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['favorite', 'details', 'book'])
  
  const isFavorite = ref(props.room.isFavorite || false)
  const imageError = ref(false)
  
  // Computed
  const roomImage = computed(() => {
    if (imageError.value) {
      return '/images/room-default.jpg'
    }
    return props.room.image || '/images/room-default.jpg'
  })

  const visibleAmenities = computed(() => {
    return props.room.amenities?.slice(0, 4) || []
  })
  
  // Methods
  const toggleFavorite = () => {
    isFavorite.value = !isFavorite.value
    emit('favorite', {
      roomId: props.room.id,
      isFavorite: isFavorite.value
    })
  }

  const handleImageError = () => {
    imageError.value = true
  }
  
  const truncateText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-BO', {
      style: 'currency',
      currency: 'BOB'
    }).format(price)
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      available: 'bg-success',
      occupied: 'bg-danger',
      maintenance: 'bg-warning text-dark',
      cleaning: 'bg-info'
    }
    return classes[status] || 'bg-secondary'
  }

  const getStatusText = (status) => {
    const texts = {
      available: 'Disponible',
      occupied: 'Ocupada',
      maintenance: 'Mantenimiento',
      cleaning: 'Limpieza'
    }
    return texts[status] || status
  }
  
  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi gratuito': 'bi-wifi',
      'WiFi': 'bi-wifi',
      'TV por cable': 'bi-tv',
      'TV': 'bi-tv',
      'Aire acondicionado': 'bi-thermometer-snow',
      'Minibar': 'bi-cup-straw',
      'Caja fuerte': 'bi-safe',
      'Baño privado': 'bi-droplet-fill',
      'Secador de pelo': 'bi-wind',
      'Teléfono': 'bi-telephone',
      'Servicio de habitaciones': 'bi-bell',
      'Balcón': 'bi-door-open-fill',
      'Vista al mar': 'bi-water',
      'Jacuzzi': 'bi-droplet-half',
      'Escritorio': 'bi-desk',
      'Cafetera': 'bi-cup-hot',
      'Desayuno incluido': 'bi-cup-hot',
      'Parking': 'bi-p-square-fill'
    }
    
    return icons[amenity] || 'bi-check-circle'
  }
  </script>
  
  <style scoped>
  .room-card {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    background-color: white;
  }
  
  .room-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0,0,0,0.15);
  }
  
  .room-image {
    height: 220px;
    overflow: hidden;
  }
  
  .room-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  
  .room-card:hover .room-image img {
    transform: scale(1.05);
  }
  
  .room-tags {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  
  .favorite-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: white;
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    transition: all 0.3s;
    cursor: pointer;
  }
  
  .favorite-btn i {
    color: #6c757d;
    font-size: 1.2rem;
    transition: all 0.3s;
  }
  
  .favorite-btn.active i {
    color: #dc3545;
  }
  
  .favorite-btn:hover {
    transform: scale(1.1);
  }
  
  .room-features {
    display: flex;
    gap: 15px;
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  .room-feature i {
    margin-right: 3px;
  }
  
  .hotel-info {
    background-color: #f8f9fa;
    padding: 0.5rem;
    border-radius: 8px;
  }
  
  .room-amenities {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .amenity-badge {
    background-color: #f8f9fa;
    color: #6c757d;
    font-size: 0.8rem;
    padding: 4px 10px;
    border-radius: 30px;
    display: inline-flex;
    align-items: center;
  }
  
  .amenity-badge i {
    margin-right: 4px;
    font-size: 0.9rem;
  }
  
  .amenity-badge.more {
    background-color: #e9ecef;
    font-weight: 600;
  }
  
  .price-tag {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  
  @media (max-width: 767px) {
    .room-image {
      height: 180px;
    }
  }
  </style>