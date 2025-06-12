<!-- src/components/admin/RoomFormModal.vue -->
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
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-door-open me-2"></i>
            {{ isEditing ? 'Editar Habitación' : 'Nueva Habitación' }}
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="closeModal"
            :disabled="isSaving"
          ></button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body">
            <!-- Basic Information -->
            <div class="row g-3">
              <div class="col-md-6">
                <label for="roomNumber" class="form-label">
                  Número de habitación <span class="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  id="roomNumber"
                  v-model="form.number" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.number }"
                  placeholder="Ej: 101, 201A"
                  required
                  :disabled="isSaving"
                >
                <div v-if="errors.number" class="invalid-feedback">
                  {{ errors.number }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="roomName" class="form-label">
                  Nombre de la habitación <span class="text-danger">*</span>
                </label>
                <input 
                  type="text" 
                  id="roomName"
                  v-model="form.name" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  placeholder="Ej: Suite Presidencial"
                  required
                  :disabled="isSaving"
                >
                <div v-if="errors.name" class="invalid-feedback">
                  {{ errors.name }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="roomType" class="form-label">
                  Tipo de habitación <span class="text-danger">*</span>
                </label>
                <select 
                  id="roomType"
                  v-model="form.typeId" 
                  class="form-select"
                  :class="{ 'is-invalid': errors.typeId }"
                  required
                  :disabled="isSaving"
                >
                  <option value="">Seleccionar tipo</option>
                  <option v-for="type in roomTypes" :key="type.id" :value="type.id">
                    {{ type.name }}
                  </option>
                </select>
                <div v-if="errors.typeId" class="invalid-feedback">
                  {{ errors.typeId }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="roomFloor" class="form-label">
                  Piso <span class="text-danger">*</span>
                </label>
                <select 
                  id="roomFloor"
                  v-model="form.floor" 
                  class="form-select"
                  :class="{ 'is-invalid': errors.floor }"
                  required
                  :disabled="isSaving"
                >
                  <option value="">Seleccionar piso</option>
                  <option v-for="floor in 10" :key="floor" :value="floor">
                    Piso {{ floor }}
                  </option>
                </select>
                <div v-if="errors.floor" class="invalid-feedback">
                  {{ errors.floor }}
                </div>
              </div>
              
              <div class="col-md-4">
                <label for="roomCapacity" class="form-label">
                  Capacidad <span class="text-danger">*</span>
                </label>
                <input 
                  type="number" 
                  id="roomCapacity"
                  v-model.number="form.capacity" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.capacity }"
                  min="1"
                  max="10"
                  placeholder="Personas"
                  required
                  :disabled="isSaving"
                >
                <div v-if="errors.capacity" class="invalid-feedback">
                  {{ errors.capacity }}
                </div>
              </div>
              
              <div class="col-md-4">
                <label for="roomSize" class="form-label">
                  Tamaño (m²) <span class="text-danger">*</span>
                </label>
                <input 
                  type="number" 
                  id="roomSize"
                  v-model.number="form.size" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.size }"
                  min="10"
                  max="500"
                  placeholder="Metros cuadrados"
                  required
                  :disabled="isSaving"
                >
                <div v-if="errors.size" class="invalid-feedback">
                  {{ errors.size }}
                </div>
              </div>
              
              <div class="col-md-4">
                <label for="roomPrice" class="form-label">
                  Precio por noche (€) <span class="text-danger">*</span>
                </label>
                <input 
                  type="number" 
                  id="roomPrice"
                  v-model.number="form.price" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.price }"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                  :disabled="isSaving"
                >
                <div v-if="errors.price" class="invalid-feedback">
                  {{ errors.price }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="roomStatus" class="form-label">
                  Estado <span class="text-danger">*</span>
                </label>
                <select 
                  id="roomStatus"
                  v-model="form.status" 
                  class="form-select"
                  :class="{ 'is-invalid': errors.status }"
                  required
                  :disabled="isSaving"
                >
                  <option value="available">Disponible</option>
                  <option value="occupied">Ocupada</option>
                  <option value="maintenance">Mantenimiento</option>
                  <option value="cleaning">Limpieza</option>
                </select>
                <div v-if="errors.status" class="invalid-feedback">
                  {{ errors.status }}
                </div>
              </div>
              
              <div class="col-md-6">
                <label for="roomImage" class="form-label">URL de imagen</label>
                <input 
                  type="url" 
                  id="roomImage"
                  v-model="form.image" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.image }"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  :disabled="isSaving"
                >
                <div v-if="errors.image" class="invalid-feedback">
                  {{ errors.image }}
                </div>
              </div>
              
              <div class="col-12">
                <label for="roomDescription" class="form-label">Descripción</label>
                <textarea 
                  id="roomDescription"
                  v-model="form.description" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.description }"
                  rows="3"
                  placeholder="Describe las características y comodidades de la habitación..."
                  :disabled="isSaving"
                ></textarea>
                <div v-if="errors.description" class="invalid-feedback">
                  {{ errors.description }}
                </div>
              </div>
            </div>

            <!-- Amenities Section -->
            <div class="mt-4">
              <h6 class="mb-3">
                <i class="bi bi-star me-2"></i>Servicios y comodidades
              </h6>
              <div class="row g-2">
                <div class="col-md-6">
                  <div class="input-group">
                    <input 
                      type="text" 
                      v-model="newAmenity" 
                      class="form-control" 
                      placeholder="Agregar servicio..."
                      :disabled="isSaving"
                      @keyup.enter="addAmenity"
                    >
                    <button 
                      class="btn btn-outline-secondary" 
                      type="button" 
                      @click="addAmenity"
                      :disabled="isSaving || !newAmenity.trim()"
                    >
                      <i class="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
                <div class="col-md-6">
                  <button 
                    type="button" 
                    class="btn btn-outline-primary btn-sm me-2" 
                    @click="addCommonAmenities"
                    :disabled="isSaving"
                  >
                    <i class="bi bi-magic me-1"></i>Agregar comunes
                  </button>
                </div>
              </div>
              
              <div class="mt-3" v-if="form.amenities.length > 0">
                <div class="d-flex flex-wrap gap-2">
                  <span 
                    v-for="(amenity, index) in form.amenities" 
                    :key="index"
                    class="badge bg-primary bg-opacity-10 text-primary px-3 py-2 fs-6"
                  >
                    {{ amenity }}
                    <button 
                      type="button" 
                      class="btn-close btn-close-sm ms-2" 
                      @click="removeAmenity(index)"
                      :disabled="isSaving"
                      style="font-size: 0.65em;"
                    ></button>
                  </span>
                </div>
              </div>
              
              <div v-else class="text-muted mt-2">
                <i class="bi bi-info-circle me-1"></i>
                No se han agregado servicios aún
              </div>
            </div>

            <!-- Image Preview -->
            <div v-if="form.image" class="mt-4">
              <h6 class="mb-3">
                <i class="bi bi-image me-2"></i>Vista previa
              </h6>
              <div class="text-center">
                <img 
                  :src="form.image" 
                  class="img-thumbnail" 
                  style="max-height: 200px; max-width: 100%;"
                  alt="Vista previa de la habitación"
                  @error="handleImageError"
                >
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="closeModal"
              :disabled="isSaving"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              :disabled="isSaving || !isFormValid"
            >
              <span v-if="isSaving" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i v-else class="bi me-2" :class="isEditing ? 'bi-check-lg' : 'bi-plus-lg'"></i>
              {{ isSaving ? 'Guardando...' : (isEditing ? 'Actualizar habitación' : 'Crear habitación') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

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
  roomTypes: {
    type: Array,
    required: true
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['close', 'save']);

// State
const isSaving = ref(false);
const newAmenity = ref('');
const errors = ref({});

// Form data
const form = ref({
  number: '',
  name: '',
  typeId: '',
  floor: '',
  capacity: 1,
  size: 25,
  price: 0,
  status: 'available',
  image: '',
  description: '',
  amenities: []
});

// Common amenities for quick adding
const commonAmenities = [
  'WiFi gratuito',
  'TV por cable',
  'Aire acondicionado',
  'Baño privado',
  'Minibar',
  'Caja fuerte',
  'Secador de pelo',
  'Teléfono',
  'Servicio de habitaciones',
  'Balcón',
  'Vista al mar',
  'Jacuzzi',
  'Escritorio',
  'Cafetera'
];

// Computed
const selectedRoomType = computed(() => {
  return props.roomTypes.find(type => type.id === form.value.typeId);
});

const isFormValid = computed(() => {
  return form.value.number.trim() && 
         form.value.name.trim() && 
         form.value.typeId && 
         form.value.floor && 
         form.value.capacity > 0 && 
         form.value.size > 0 && 
         form.value.price >= 0 && 
         form.value.status;
});

// Watchers
watch(() => props.room, (newRoom) => {
  if (newRoom && props.isEditing) {
    // Populate form with existing room data
    form.value = {
      id: newRoom.id,
      number: newRoom.number || '',
      name: newRoom.name || '',
      typeId: newRoom.typeId || '',
      floor: newRoom.floor || '',
      capacity: newRoom.capacity || 1,
      size: newRoom.size || 25,
      price: newRoom.price || 0,
      status: newRoom.status || 'available',
      image: newRoom.image || '',
      description: newRoom.description || '',
      amenities: [...(newRoom.amenities || [])]
    };
  } else {
    // Reset form for new room
    resetForm();
  }
  errors.value = {};
}, { immediate: true });

watch(() => form.value.typeId, (newTypeId) => {
  if (newTypeId && selectedRoomType.value) {
    // Auto-update name based on type if it's empty or matches old type
    if (!form.value.name || props.roomTypes.some(type => type.name === form.value.name)) {
      form.value.name = selectedRoomType.value.name;
    }
    
    // Set default price based on room type
    if (form.value.price === 0) {
      const defaultPrices = {
        1: 89, // Estándar
        2: 129, // Deluxe
        3: 159, // Suite Junior
        4: 219  // Suite Ejecutiva
      };
      form.value.price = defaultPrices[newTypeId] || 89;
    }
  }
});

// Methods
function resetForm() {
  form.value = {
    number: '',
    name: '',
    typeId: '',
    floor: '',
    capacity: 1,
    size: 25,
    price: 0,
    status: 'available',
    image: '',
    description: '',
    amenities: []
  };
}

function validateForm() {
  errors.value = {};
  
  // Required field validations
  if (!form.value.number.trim()) {
    errors.value.number = 'El número de habitación es requerido';
  }
  
  if (!form.value.name.trim()) {
    errors.value.name = 'El nombre de la habitación es requerido';
  }
  
  if (!form.value.typeId) {
    errors.value.typeId = 'El tipo de habitación es requerido';
  }
  
  if (!form.value.floor) {
    errors.value.floor = 'El piso es requerido';
  }
  
  if (form.value.capacity < 1 || form.value.capacity > 10) {
    errors.value.capacity = 'La capacidad debe estar entre 1 y 10 personas';
  }
  
  if (form.value.size < 10 || form.value.size > 500) {
    errors.value.size = 'El tamaño debe estar entre 10 y 500 m²';
  }
  
  if (form.value.price < 0) {
    errors.value.price = 'El precio no puede ser negativo';
  }
  
  // URL validation for image
  if (form.value.image && !isValidUrl(form.value.image)) {
    errors.value.image = 'La URL de la imagen no es válida';
  }
  
  return Object.keys(errors.value).length === 0;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function addAmenity() {
  const amenity = newAmenity.value.trim();
  if (amenity && !form.value.amenities.includes(amenity)) {
    form.value.amenities.push(amenity);
    newAmenity.value = '';
  }
}

function removeAmenity(index) {
  form.value.amenities.splice(index, 1);
}

function addCommonAmenities() {
  const amenitiesToAdd = commonAmenities.filter(amenity => 
    !form.value.amenities.includes(amenity)
  ).slice(0, 6); // Add first 6 that aren't already added
  
  form.value.amenities.push(...amenitiesToAdd);
}

function handleImageError(event) {
  errors.value.image = 'No se pudo cargar la imagen de la URL proporcionada';
}

async function handleSubmit() {
  if (!validateForm()) {
    return;
  }
  
  isSaving.value = true;
  
  try {
    // Prepare data
    const roomData = {
      ...form.value,
      type: selectedRoomType.value?.name || ''
    };
    
    // Emit save event
    emit('save', roomData);
    
  } catch (error) {
    console.error('Error saving room:', error);
    errors.value.general = 'Error al guardar la habitación. Por favor, intenta de nuevo.';
  } finally {
    isSaving.value = false;
  }
}

function closeModal() {
  if (!isSaving.value) {
    emit('close');
  }
}
</script>

<style scoped>
.modal.show {
  display: block;
}

.btn-close-sm {
  background-size: 0.75em;
}

.badge .btn-close {
  filter: invert(1);
}

.invalid-feedback {
  display: block;
}

.form-label {
  font-weight: 500;
}

.text-danger {
  font-weight: 600;
}

@media (max-width: 768px) {
  .modal-dialog {
    max-width: 95%;
    margin: 1rem auto;
  }
  
  .modal-body {
    padding: 1rem;
  }
  
  .row.g-3 > .col-md-6,
  .row.g-3 > .col-md-4 {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>