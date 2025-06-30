// src/store/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => {
    let user = null;
    try {
      // Intentar parsear el usuario desde localStorage al inicio
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        user = JSON.parse(storedUser);
      }
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      // Limpiar si hay un error de parseo (datos corruptos)
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    return {
      token: localStorage.getItem('token') || '',
      user: user // Se inicializa con el usuario recuperado o null
    };
  },
  getters: {
    isLogged: s => !!s.token, // `!!s.token` es suficiente para verificar si hay un token
    // `s.user?.roles?.includes('admin')` es correcto, pero asegúrate que `roles` es un array
    isAdmin: s => s.user?.roles && s.user.roles.includes('admin')
  },
  actions: {
    async login(payload) {
      console.log("Payload de login:", payload);
      try {
        const { data } = await api.post('/login', payload);
        this.token = data.token;
        this.user = data.user; // Asigna el objeto user completo
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // <--- ¡Añadido!
        
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
      } catch (error) {
        // Mejor manejo de errores: re-lanzar para que el componente lo capture
        throw error; 
      }
    },
    async register(payload) {
      try {
        await api.post('/register', payload);
        // Después de registrarse, automáticamente loguear al usuario
        await this.login({ email: payload.email, password: payload.password });
      } catch (error) {
        throw error;
      }
    },
    async fetchUser() {
      // Esta acción es útil para refrescar los datos del usuario si cambian en el backend,
      // pero ya no es estrictamente necesaria para que la Navbar funcione después de un refresh.
      // Podrías llamarla en un `onMounted` de tu componente `App.vue` si quieres tener
      // los datos del usuario siempre actualizados al cargar la app.
      try {
        const { data } = await api.get('/user');
        this.user = data;
        localStorage.setItem('user', JSON.stringify(data)); // Actualizar user en localStorage también
      } catch (error) {
        // Si fetchUser falla (ej. token expirado), considera cerrar sesión
        console.error("Error fetching user data:", error);
        this.logout(); // Forzar cierre de sesión si no se puede obtener el usuario
        throw error;
      }
    },
    logout() {
      this.token = '';
      this.user = null; // Reinicia el usuario a null
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // <--- ¡Añadido!
      delete api.defaults.headers.common.Authorization; // Elimina el encabezado de autorización
    },
    // Inicializa el token de autorización en el API al cargar la app
    // Esto es crucial para que las peticiones subsiguientes estén autenticadas
    initializeAuth() {
      if (this.token) {
        api.defaults.headers.common.Authorization = `Bearer ${this.token}`;
      }
    }
  }
});