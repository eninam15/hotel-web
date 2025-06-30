<template>
  <div class="login-page d-flex align-items-center py-5 min-vh-100 bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-9 col-lg-7 col-xl-6">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-5">
                <img 
                  src="/images/logo-bermett.png" 
                  alt="Logo Hospedaje Bermett" 
                  class="img-fluid mb-3 animate__animated animate__fadeInDown" 
                  style="max-height: 80px;"
                >
                <h1 class="h2 fw-bold text-primary animate__animated animate__fadeInUp">
                  Bienvenido a Hospedaje Bermett
                </h1>
                <p class="text-muted mt-2 animate__animated animate__fadeInUp animate__delay-0-2s">
                  Inicia sesión para gestionar tus reservas
                </p>
              </div>

              <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-4 animate__animated animate__shakeX" role="alert">
                <i class="bi bi-exclamation-octagon-fill me-2"></i>
                {{ error }}
                <button @click="clearError" type="button" class="btn-close" aria-label="Cerrar alerta"></button>
              </div>

              <div v-if="redirectMessage" class="alert alert-info border-0 mb-4 animate__animated animate__fadeIn" role="alert">
                <i class="bi bi-info-circle-fill me-2"></i>
                {{ redirectMessage }}
              </div>

              <form @submit.prevent="onSubmit" class="needs-validation" novalidate>
                <div class="mb-4">
                  <label for="email" class="form-label text-muted fw-semibold">Correo electrónico</label>
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-white border-end-0">
                      <i class="bi bi-envelope text-primary"></i>
                    </span>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="form.email" 
                      class="form-control border-start-0" 
                      placeholder="ejemplo@email.com" 
                      required
                      :class="{ 'is-invalid': validationErrors.email }"
                      autocomplete="username"
                      aria-describedby="emailFeedback"
                      @input="clearValidationError('email')"
                    >
                    <div id="emailFeedback" class="invalid-feedback">{{ validationErrors.email }}</div>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <label for="password" class="form-label text-muted fw-semibold">Contraseña</label>
                    <!--<router-link :to="{ name: 'forgot-password' }" class="small text-decoration-none text-primary fw-semibold">
                      ¿Olvidaste tu contraseña?
                    </router-link>-->
                  </div>
                  <div class="input-group input-group-lg">
                    <span class="input-group-text bg-white border-end-0">
                      <i class="bi bi-lock text-primary"></i>
                    </span>
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      id="password" 
                      v-model="form.password" 
                      class="form-control border-start-0" 
                      placeholder="••••••••" 
                      required
                      :class="{ 'is-invalid': validationErrors.password }"
                      autocomplete="current-password"
                      aria-describedby="passwordFeedback"
                      @input="clearValidationError('password')"
                    >
                    <button 
                      class="input-group-text bg-white border-start-0" 
                      type="button"
                      @click="showPassword = !showPassword"
                      aria-label="Mostrar/ocultar contraseña"
                    >
                      <i class="bi" :class="showPassword ? 'bi-eye-slash text-secondary' : 'bi-eye text-secondary'"></i>
                    </button>
                    <div id="passwordFeedback" class="invalid-feedback">{{ validationErrors.password }}</div>
                  </div>
                </div>

                <div class="mb-4 form-check animate__animated animate__fadeInLeft">
                  <input type="checkbox" class="form-check-input" id="rememberMe" v-model="form.remember">
                  <label class="form-check-label text-muted" for="rememberMe">Recordar mi sesión</label>
                </div>

                <div class="d-grid gap-2 mb-4 animate__animated animate__fadeInUp animate__delay-0-4s">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg rounded-pill fw-bold"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
                  </button>
                  <router-link :to="{ name: 'register' }" class="btn btn-outline-secondary btn-lg rounded-pill fw-bold">
                    ¿No tienes una cuenta? Regístrate
                  </router-link>
                </div>
              </form>

              <!--<div class="social-login mt-5 animate__animated animate__fadeInUp animate__delay-0-6s">
                <div class="separator text-muted mb-4">
                  <span>O continúa con</span>
                </div>
                <div class="row g-3">
                  <div class="col-sm-6">
                    <button type="button" @click="socialLogin('google')" class="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-2 rounded-pill">
                      <i class="bi bi-google me-2 fs-5"></i>Google
                    </button>
                  </div>
                  <div class="col-sm-6">
                    <button type="button" @click="socialLogin('facebook')" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center py-2 rounded-pill">
                      <i class="bi bi-facebook me-2 fs-5"></i>Facebook
                    </button>
                  </div>
                </div>
              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter, useRoute } from 'vue-router';

// State
const form = reactive({ 
  email: '', 
  password: '',
  remember: false
});
const validationErrors = ref({});
const error = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const redirectMessage = ref('');

// Composables
const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

// Check for redirect params
onMounted(() => {
  if (route.query.redirect) {
    if (route.query.bookingIntent) {
      redirectMessage.value = 'Por favor, inicia sesión para completar tu reserva.';
    } else {
      redirectMessage.value = 'Por favor, inicia sesión para continuar.';
    }
  }
  
  // Pre-fill email if provided (e.g. from registration)
  if (route.query.email) {
    form.email = route.query.email;
  }
});

// Methods
function clearError() {
  error.value = '';
}

function clearValidationError(field) {
  if (validationErrors.value[field]) {
    validationErrors.value[field] = '';
  }
}

async function onSubmit() {
  // Reset validation and errors
  validationErrors.value = {};
  error.value = '';
  
  // Client-side validation
  let hasErrors = false;

  if (!form.email.trim()) {
    validationErrors.value.email = 'El correo electrónico es obligatorio.';
    hasErrors = true;
  } else if (!isValidEmail(form.email)) {
    validationErrors.value.email = 'Por favor, ingresa un correo electrónico válido.';
    hasErrors = true;
  }
  
  if (!form.password.trim()) {
    validationErrors.value.password = 'La contraseña es obligatoria.';
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }
  
  try {
    isLoading.value = true;
    await auth.login(form);
    
    // Redirect after successful login
    if (route.query.redirect) {
      router.push(route.query.redirect);
    } else {
      router.push({ name: 'home' }); // Asume que 'dashboard' es tu ruta principal post-login
    }
  } catch (err) {
    console.error('Error de inicio de sesión:', err);
    // Asumiendo que el error del backend es una cadena o un objeto con un mensaje
    error.value = err.message || 'Credenciales incorrectas. Por favor, intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
}

function socialLogin(provider) {
  // En una aplicación real, esto iniciaría el flujo de autenticación OAuth
  // Es crucial manejar la redirección y el manejo del token/sesión del proveedor aquí.
  alert(`Iniciando sesión con ${provider}... (Funcionalidad pendiente)`);
  // Ejemplo: router.push(`/auth/${provider}`);
}

// Validation helpers
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
</script>

<style scoped>
/* Colores y Variables de Bootstrap */
:root {
  --bs-primary: #9C27B0; /* Tu morado principal */
  --bs-secondary: #6c757d; /* Gris de Bootstrap */
  --bs-info: #0dcaf0; /* Azul claro de Bootstrap */
  --bs-danger: #dc3545; /* Rojo de Bootstrap */
  --bs-light: #f8f9fa; /* Gris muy claro de Bootstrap */
  --bs-dark: #212529; /* Negro/Gris oscuro de Bootstrap */
}

/* Estilos Generales de la Página de Login */
.login-page {
  background-image: linear-gradient(to bottom right, #f8f9fa, #e9ecef); /* Fondo suave */
  background-size: cover;
  background-position: center;
  /* min-height: 100vh; ya lo tienes con min-vh-100 */
}

/* Estilos de la Tarjeta */
.card {
  border: none;
  border-radius: 1rem; /* Bordes más redondeados */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08); /* Sombra más pronunciada pero suave */
  overflow: hidden; /* Asegura que el rounded-4 funcione bien con el contenido */
  animation: fadeIn 0.8s ease-out; /* Animación de entrada para la tarjeta */
}

/* Encabezado y Logo */
.text-center h1 {
  color: var(--bs-primary);
}

/* Inputs y Grupos de Inputs */
.input-group-lg > .form-control,
.input-group-lg > .input-group-text {
  padding: 0.75rem 1.25rem; /* Aumenta el padding para inputs más grandes */
  font-size: 1.1rem;
}

.input-group-text {
  background-color: var(--bs-white); /* Fondo blanco para los íconos */
  border-color: #dee2e6; /* Borde estándar de Bootstrap */
  color: var(--bs-primary); /* Color del ícono principal */
}

.input-group-text i {
  transition: color 0.3s ease; /* Transición para el color del ícono */
}

.form-control:focus + .input-group-text i,
.form-control.is-invalid + .input-group-text i {
  color: var(--bs-primary); /* Mantener el color primario o cambiar a rojo para error */
}

.form-control.is-invalid {
  border-color: var(--bs-danger);
}

.invalid-feedback {
  font-size: 0.875rem; /* Tamaño de fuente para mensajes de error */
}

/* Botones */
.btn-primary.rounded-pill {
  background-color: var(--bs-primary);
  border-color: var(--bs-primary);
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
}

.btn-primary.rounded-pill:hover {
  background-color: #7b1fa2; /* Tono más oscuro de tu morado */
  border-color: #7b1fa2;
  transform: translateY(-2px); /* Pequeño efecto hover */
}

.btn-primary.rounded-pill:active {
  transform: translateY(0); /* Quita el efecto al clickear */
}

.btn-outline-secondary.rounded-pill {
  color: var(--bs-secondary);
  border-color: var(--bs-secondary);
  transition: all 0.3s ease;
}

.btn-outline-secondary.rounded-pill:hover {
  background-color: var(--bs-secondary);
  color: var(--bs-white);
}

/* Botones de Redes Sociales */
.btn-outline-danger { /* Para Google */
  color: var(--bs-danger);
  border-color: var(--bs-danger);
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  background-color: var(--bs-danger);
  color: var(--bs-white);
}

.btn-outline-primary { /* Para Facebook, usa el color principal del tema */
  color: var(--bs-primary);
  border-color: var(--bs-primary);
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: var(--bs-primary);
  color: var(--bs-white);
}

.social-login .btn i {
  font-size: 1.25rem; /* Íconos de redes sociales ligeramente más grandes */
}

/* Separador "O continúa con" */
.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0; /* Un borde más suave */
}

.separator span {
  padding: 0 1rem;
  background-color: var(--bs-white); /* Fondo blanco para que el texto no se vea atravesado por la línea */
  color: var(--bs-secondary);
  position: relative;
  z-index: 1;
}

/* Enlace "¿Olvidaste tu contraseña?" */
.text-primary.fw-semibold:hover {
  color: #7b1fa2 !important; /* Tono más oscuro al pasar el ratón */
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Media Queries para Responsividad */
@media (max-width: 768px) {
  .login-page {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  .card-body {
    padding: 2.5rem;
  }
  .text-center h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 576px) {
  .login-page {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .card-body {
    padding: 1.5rem;
  }
  .input-group-lg > .form-control,
  .input-group-lg > .input-group-text {
    padding: 0.6rem 1rem;
    font-size: 1rem;
  }
  .d-grid .btn-lg {
    font-size: 1rem;
    padding: 0.75rem 1rem;
  }
  .social-login .btn {
    font-size: 0.9rem;
  }
}
</style>