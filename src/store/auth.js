import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user:  null
  }),
  getters: {
    isLogged: s => !!s.token,
    isAdmin:  s => s.user?.roles?.includes('admin')
  },
  actions: {
    async login(payload) {
      console.log("Payload de login:", payload);
      
      const { data } = await api.post('/login', payload);
      this.token = data.token;
      this.user  = data.user;
      localStorage.setItem('token', data.token);
      api.defaults.headers.common.Authorization = `Bearer ${data.token}`;
    },
    async register(payload) {
      await api.post('/register', payload);
      await this.login({ email: payload.email, password: payload.password });
    },
    async fetchUser() {
      const { data } = await api.get('/user');
      this.user = data;
    },
    logout() {
      this.token = '';
      this.user  = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common.Authorization;
    }
  }
});
