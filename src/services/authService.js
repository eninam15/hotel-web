import api from './api'; // Asegúrate que este archivo exporte tu instancia de Axios

/**
 * Servicio de autenticación para interactuar con la API.
 */
export const authService = {
  /**
   * Registra un nuevo usuario.
   * @param {object} userData - Datos del usuario para el registro.
   * @returns {Promise<object>} - La respuesta de la API.
   */
  async register(userData) {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error) {
      // Lanza el error para que sea manejado por el store o el componente.
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Inicia sesión de un usuario.
   * @param {object} credentials - Email y contraseña del usuario.
   * @returns {Promise<object>} - La respuesta con el token y los datos del usuario.
   */
  async login(credentials) {
    try {
      const response = await api.post('/login', credentials);
      const { token, user } = response.data;

      if (token) {
        // Guarda el token y el usuario en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        // Configura el header de autorización para futuras peticiones
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Cierra la sesión del usuario.
   */
  async logout() {
    try {
      // Intenta notificar al backend sobre el cierre de sesión.
      await api.post('/logout');
    } catch (error) {
      console.error('Error al notificar al backend sobre el logout:', error);
    } finally {
      // Limpia el estado local sin importar el resultado del backend.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  /**
   * Obtiene los datos del usuario autenticado actualmente.
   * @returns {Promise<object>} - Los datos del usuario.
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  }
};