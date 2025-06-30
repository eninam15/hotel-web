// src/services/habitacionService.js
import api from './api.js';

export const habitacionService = {
  // Obtener todas las habitaciones
  async getAllHabitaciones() {
    try {
      const response = await api.get('/habitaciones');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener habitaciones por hotel
  async getHabitacionesByHotel(hotelId) {
    try {
      const response = await api.get(`/habitaciones/hotel/${hotelId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener una habitación específica
  async getHabitacion(id) {
    try {
      const response = await api.get(`/habitaciones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crear nueva habitación
  async createHabitacion(habitacionData, imageFile = null) {
    try {
      if (imageFile) {
        const formData = new FormData();
        
        // Agregar todos los campos al FormData
        formData.append('hotel_id', habitacionData.hotel_id || 1);
        formData.append('number', habitacionData.number);
        formData.append('name', habitacionData.name);
        formData.append('typeId', habitacionData.typeId);
        formData.append('type', habitacionData.type);
        formData.append('floor', habitacionData.floor);
        formData.append('capacity', habitacionData.capacity);
        formData.append('size', habitacionData.size);
        formData.append('price', habitacionData.price);
        formData.append('status', habitacionData.status);
        formData.append('description', habitacionData.description || '');
        formData.append('image_file', imageFile);
        
        if (habitacionData.amenities && habitacionData.amenities.length > 0) {
          habitacionData.amenities.forEach((amenity, index) => {
            formData.append(`amenities[${index}]`, amenity);
          });
        }
        
        if (habitacionData.disponibilidad && habitacionData.disponibilidad.fecha_inicio) {
          formData.append('disponibilidad[fecha_inicio]', habitacionData.disponibilidad.fecha_inicio);
          formData.append('disponibilidad[fecha_fin]', habitacionData.disponibilidad.fecha_fin);
          formData.append('disponibilidad[cantidad]', habitacionData.disponibilidad.cantidad);
        }

        const response = await api.post('/habitaciones', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data;
        
      } else {
        // Sin archivo, usar JSON normal
        const dataToSend = {
          hotel_id: habitacionData.hotel_id || 1,
          number: habitacionData.number,
          name: habitacionData.name,
          typeId: habitacionData.typeId,
          type: habitacionData.type,
          floor: habitacionData.floor,
          capacity: habitacionData.capacity,
          size: habitacionData.size,
          price: habitacionData.price,
          status: habitacionData.status,
          image: habitacionData.image,
          description: habitacionData.description,
          amenities: habitacionData.amenities || [],
          ...(habitacionData.disponibilidad && {
            disponibilidad: habitacionData.disponibilidad
          })
        };

        const response = await api.post('/habitaciones', dataToSend);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar habitación
  async updateHabitacion(id, habitacionData) {
    try {
      const dataToSend = {
        ...(habitacionData.hotel_id && { hotel_id: habitacionData.hotel_id }),
        ...(habitacionData.number && { number: habitacionData.number }),
        ...(habitacionData.name && { name: habitacionData.name }),
        ...(habitacionData.typeId && { typeId: habitacionData.typeId }),
        ...(habitacionData.type && { type: habitacionData.type }),
        ...(habitacionData.floor && { floor: habitacionData.floor }),
        ...(habitacionData.capacity && { capacity: habitacionData.capacity }),
        ...(habitacionData.size && { size: habitacionData.size }),
        ...(habitacionData.price !== undefined && { price: habitacionData.price }),
        ...(habitacionData.status && { status: habitacionData.status }),
        ...(habitacionData.image !== undefined && { image: habitacionData.image }),
        ...(habitacionData.description !== undefined && { description: habitacionData.description }),
        ...(habitacionData.amenities && { amenities: habitacionData.amenities })
      };

      const response = await api.put(`/habitaciones/${id}`, dataToSend);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar habitación
  async deleteHabitacion(id) {
    try {
      const response = await api.delete(`/habitaciones/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Gestionar disponibilidad de habitación
  async setDisponibilidad(habitacionId, disponibilidadData) {
    try {
      const response = await api.post(`/habitaciones/${habitacionId}/disponibilidad`, disponibilidadData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * CORREGIDO: Renombrado de 'checkDisponibilidad' a 'getAvailable'.
   * Esta es la función que el modal de reservas necesita para buscar habitaciones.
   * Llama al endpoint de Laravel que verifica la disponibilidad.
   */
  async getAvailable(checkData) {
    try {
      const response = await api.post('/habitaciones/check-disponibilidad', checkData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Subir imagen de habitación
  async uploadImage(habitacionId, imageFile) {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post(`/habitaciones/${habitacionId}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener tipos de habitación (para el selector)
  async getRoomTypes() {
    try {
      const response = await api.get('/room-types');
      return response.data;
    } catch (error) {
      console.warn('Could not fetch room types from API, using default mock data.');
      return [
        { id: 1, name: 'Habitación Estándar' },
        { id: 2, name: 'Habitación Deluxe' },
        { id: 3, name: 'Suite Junior' },
        { id: 4, name: 'Suite Ejecutiva' },
        { id: 5, name: 'Suite Presidencial' }
      ];
    }
  },

  // Validar disponibilidad antes de crear/actualizar
  async validateAvailability(habitacionId, fechaInicio, fechaFin) {
    try {
      // Usa la función 'getAvailable' que ahora existe
      const response = await this.getAvailable({
        habitacion_id: habitacionId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        cantidad: 1
      });
      return response.disponible;
    } catch (error) {
      console.error('Error validating availability:', error);
      return false;
    }
  },

  // Obtener estadísticas de habitaciones
  async getHabitacionStats(hotelId = null) {
    try {
      const endpoint = hotelId ? `/habitaciones/stats/${hotelId}` : '/habitaciones/stats';
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar habitaciones con filtros
  async searchHabitaciones(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/habitaciones/search?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
