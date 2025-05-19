<!-- src/views/auth/Login.vue -->
<template>
  <div class="login-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4 p-md-5">
              <!-- Logo or brand image -->
              <div class="text-center mb-4">
                <img src="/images/logo.png" alt="Logo" class="img-fluid mb-3" style="max-height: 60px;">
                <h1 class="h3 fw-bold text-primary mb-0">Iniciar sesión</h1>
              </div>

              <!-- Alert for errors -->
              <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ error }}
                <button @click="error = ''" type="button" class="btn-close" aria-label="Close"></button>
              </div>

              <!-- Redirect message (if exists) -->
              <div v-if="redirectMessage" class="alert alert-info mb-4">
                <i class="bi bi-info-circle-fill me-2"></i>
                {{ redirectMessage }}
              </div>

              <!-- Login form -->
              <form @submit.prevent="onSubmit">
                <div class="mb-4">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      id="email" 
                      v-model="form.email" 
                      class="form-control form-control-lg" 
                      placeholder="tu@email.com" 
                      required
                      :class="{ 'is-invalid': validationErrors.email }"
                    >
                    <div class="invalid-feedback">{{ validationErrors.email }}</div>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="d-flex justify-content-between align-items-center">
                    <label for="password" class="form-label">Contraseña</label>
                    <a href="#" class="small text-decoration-none" @click.prevent="forgotPassword">¿Olvidaste tu contraseña?</a>
                  </div>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      id="password" 
                      v-model="form.password" 
                      class="form-control form-control-lg" 
                      placeholder="Contraseña" 
                      required
                      :class="{ 'is-invalid': validationErrors.password }"
                    >
                    <button 
                      class="input-group-text bg-light" 
                      type="button"
                      @click="showPassword = !showPassword"
                    >
                      <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                    </button>
                    <div class="invalid-feedback">{{ validationErrors.password }}</div>
                  </div>
                </div>

                <div class="mb-4 form-check">
                  <input type="checkbox" class="form-check-input" id="rememberMe" v-model="form.remember">
                  <label class="form-check-label" for="rememberMe">Recordar mi sesión</label>
                </div>

                <div class="d-grid">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
                  </button>
                </div>
              </form>

              <div class="mt-4 text-center">
                <p class="mb-0">¿No tienes una cuenta? <router-link :to="{ name: 'register' }" class="text-decoration-none fw-semibold">Regístrate aquí</router-link></p>
              </div>

              <!-- Social Login Section -->
              <div class="social-login mt-4">
                <div class="separator text-muted mb-3">
                  <span>O continúa con</span>
                </div>
                <div class="row g-2">
                  <div class="col">
                    <button type="button" @click="socialLogin('google')" class="btn btn-outline-secondary w-100">
                      <i class="bi bi-google me-2"></i>Google
                    </button>
                  </div>
                  <div class="col">
                    <button type="button" @click="socialLogin('facebook')" class="btn btn-outline-secondary w-100">
                      <i class="bi bi-facebook me-2"></i>Facebook
                    </button>
                  </div>
                </div>
              </div>
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
  // Check if we have a redirect path
  if (route.query.redirect) {
    if (route.query.bookingIntent) {
      redirectMessage.value = 'Por favor inicia sesión para completar tu reserva';
    } else {
      redirectMessage.value = 'Por favor inicia sesión para continuar';
    }
  }
  
  // Pre-fill email if provided (e.g. from registration)
  if (route.query.email) {
    form.email = route.query.email;
  }
});

// Methods
async function onSubmit() {
  // Reset validation and errors
  validationErrors.value = {};
  error.value = '';
  
  // Basic validation
  if (!form.email) {
    validationErrors.value.email = 'El correo electrónico es obligatorio';
    return;
  }
  
  if (!isValidEmail(form.email)) {
    validationErrors.value.email = 'Por favor ingresa un correo electrónico válido';
    return;
  }
  
  if (!form.password) {
    validationErrors.value.password = 'La contraseña es obligatoria';
    return;
  }
  
  try {
    isLoading.value = true;
    await auth.login(form);
    
    // Redirect after successful login
    if (route.query.redirect) {
      router.push(route.query.redirect);
    } else {
      router.push({ name: 'dashboard' });
    }
  } catch (err) {
    console.error('Login error:', err);
    error.value = 'Credenciales incorrectas. Por favor intenta de nuevo.';
  } finally {
    isLoading.value = false;
  }
}

function forgotPassword() {
  // In a real app, this would navigate to a password reset page
  alert('En una aplicación real, esto te llevaría a la página de recuperación de contraseña.');
}

function socialLogin(provider) {
  // In a real app, this would initiate OAuth flow with the provider
  alert(`En una aplicación real, esto iniciaría el flujo de autenticación con ${provider}.`);
}

// Validation helpers
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dee2e6;
}

.separator span {
  padding: 0 1rem;
}

.social-login .btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

@media (max-width: 576px) {
  .login-page {
    min-height: auto;
    padding: 2rem 0;
  }
}
</style>