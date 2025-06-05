import api from './api.js';

export const reservaService = {
  // Obtener todas las reservas (admins ven todas, usuarios solo las suyas)
  async getAllReservas() {
    try {
      const response = await api.get('/reservas');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener una reserva específica
  async getReserva(id) {
    try {
      const response = await api.get(`/reservas/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crear nueva reserva
  async createReserva(reservaData) {
    try {
      const response = await api.post('/reservas', reservaData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar estado de reserva
  async updateReservaEstado(id, estado) {
    try {
      const response = await api.put(`/reservas/${id}`, { estado });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener reservas del usuario actual
  async getMisReservas() {
    try {
      const response = await api.get('/mis-reservas');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener reservas por hotel (solo operadores/admins)
  async getReservasByHotel(hotelId) {
    try {
      const response = await api.get(`/hoteles/${hotelId}/reservas`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Confirmar reserva
  async confirmarReserva(id) {
    try {
      const response = await this.updateReservaEstado(id, 'confirmada');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cancelar reserva
  async cancelarReserva(id) {
    try {
      const response = await this.updateReservaEstado(id, 'cancelada');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Completar reserva
  async completarReserva(id) {
    try {
      const response = await this.updateReservaEstado(id, 'completada');
      return response;
    } catch (error) {
      throw error;
    }
  }
};