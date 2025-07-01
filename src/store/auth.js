import { defineStore } from 'pinia';
import { authService } from '@/services/authService';
import api from '@/services/api'; // Importa la instancia de Axios
import router from '@/router'; // Importa el router para redireccionar

/**
 * Función auxiliar para obtener datos del localStorage de forma segura.
 */
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    return { token: token || null, user: user || null };
  } catch (error) {
    console.error("Error al leer localStorage:", error);
    // En caso de datos corruptos, limpia el storage.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { token: null, user: null };
  }
};

export const useAuthStore = defineStore('auth', {
  state: () => getInitialState(),

  getters: {
    /**
     * Verifica si el usuario está autenticado.
     * @returns {boolean}
     */
    isLoggedIn: (state) => !!state.token && !!state.user,

    /**
     * Verifica si el usuario es administrador.
     * @returns {boolean}
     */
    isAdmin: (state) => state.user?.roles?.includes('admin'),
  },

  actions: {
    /**
     * Maneja el flujo de registro de usuario.
     * Después de un registro exitoso, intenta hacer login automáticamente.
     * @param {object} userData - Datos del formulario de registro.
     */
    async register(userData) {
      try {
        await authService.register(userData);
        // Después de un registro exitoso, se hace login para obtener el token.
        await this.login({ email: userData.email, password: userData.password });
      } catch (error) {
        console.error('Error en el registro:', error);
        throw error; // Lanza el error para que el componente lo maneje
      }
    },

    /**
     * Maneja el flujo de inicio de sesión.
     * @param {object} credentials - Email y contraseña.
     */
    async login(credentials) {
      try {
        const data = await authService.login(credentials);
        this.token = data.token;
        this.user = data.user;
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        this.logout(); // Limpia cualquier estado parcial
        throw error;
      }
    },

    /**
     * Cierra la sesión del usuario.
     */
    async logout() {
      await authService.logout();
      this.token = null;
      this.user = null;
      // Redirige a la página de login para una mejor experiencia.
      router.push({ name: 'login' });
    },

    /**
     * Inicializa el estado de autenticación al cargar la aplicación.
     * Es crucial para mantener al usuario logueado entre recargas de página.
     */
    initializeAuth() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
      }
    }
  }
});