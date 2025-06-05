import api from './api.js';

export const authService = {
  // Registrar nuevo usuario
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Iniciar sesión
  async login(credentials) {
    console.log("AQuis", credentials);
    
    try {
      const response = await api.post('/login', credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        api.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cerrar sesión
  async logout() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      delete api.defaults.headers.common.Authorization;
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener token actual
  getToken() {
    return localStorage.getItem('token');
  }
};