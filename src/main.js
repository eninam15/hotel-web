// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useAuthStore } from '@/store/auth'; // Importa tu store de autenticación

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as bootstrap from 'bootstrap'; // Asegúrate de que esto esté aquí para el JS de Bootstrap

// Si estás usando Animate.css
//import 'animate.css'; 

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// --- ¡IMPORTANTE! Inicializar el store de autenticación aquí ---
const authStore = useAuthStore();
authStore.initializeAuth(); // Esto configura el encabezado de autorización de Axios

// Opcional: Si quieres refrescar los datos completos del usuario desde el backend cada vez
// que la app carga, puedes llamar a fetchUser aquí también (maneja los errores si el token es viejo/inválido)
// authStore.fetchUser().catch(() => { /* Manejar si la sesión es inválida */ });

app.mount('#app');