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
  async createHabitacion(habitacionData) {
    try {
      const response = await api.post('/habitaciones', habitacionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar habitación
  async updateHabitacion(id, habitacionData) {
    try {
      const response = await api.put(`/habitaciones/${id}`, habitacionData);
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

  // Verificar disponibilidad
  async checkDisponibilidad(checkData) {
    try {
      const response = await api.post('/habitaciones/check-disponibilidad', checkData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};