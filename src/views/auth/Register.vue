<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// --- Dependencias ---
const router = useRouter();
const authStore = useAuthStore();

// --- Estado del Componente ---
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
  termsAccepted: false,
  marketingAccepted: false,
});

const isLoading = ref(false);
const error = ref(''); // Para errores generales de la API
const validationErrors = ref({}); // Para errores de validación por campo

const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const showTermsModal = ref(false);

// --- Lógica de Negocio ---

/**
 * Maneja el envío del formulario de registro.
 */
const onSubmit = async () => {
  clearAllErrors();
  if (!validateForm()) return; // Detener si la validación frontend falla

  isLoading.value = true;
  try {
    // Llama a la acción del store para registrar al usuario
    await authStore.register({
      name: form.value.firstName, // Asegúrate que el backend espera 'name' o 'firstName'
      last_name: form.value.lastName, // y 'last_name' o 'lastName'
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
      password_confirmation: form.value.passwordConfirmation
    });

    // Si el registro y login automático son exitosos, redirigir
    router.push({ name: 'home' }); // Cambia 'dashboard' por tu ruta de destino

  } catch (err) {
    // Manejo de errores devueltos por el backend
    if (err && err.errors) {
      // Si el backend devuelve un objeto de errores de validación
      validationErrors.value = err.errors;
      error.value = err.message || 'Por favor, corrige los errores en el formulario.';
    } else {
      // Para otros errores (ej. de red, 500, etc.)
      error.value = err.message || 'Ocurrió un error inesperado. Inténtalo de nuevo.';
    }
  } finally {
    isLoading.value = false;
  }
};

/**
 * Validación básica en el frontend antes de enviar.
 */
const validateForm = () => {
  let isValid = true;
  if (form.value.password !== form.value.passwordConfirmation) {
    validationErrors.value.passwordConfirmation = 'Las contraseñas no coinciden.';
    isValid = false;
  }
  if (!form.value.termsAccepted) {
    validationErrors.value.termsAccepted = 'Debes aceptar los términos y condiciones.';
    isValid = false;
  }
  return isValid;
};

// --- Helpers para la UI ---

const clearError = () => {
  error.value = '';
};

const clearValidationError = (field) => {
  if (validationErrors.value[field]) {
    delete validationErrors.value[field];
  }
};

const clearAllErrors = () => {
  error.value = '';
  validationErrors.value = {};
};

const showTerms = () => {
  showTermsModal.value = true;
};

const acceptTerms = () => {
  form.value.termsAccepted = true;
  clearValidationError('termsAccepted');
  showTermsModal.value = false;
};

// --- Propiedades Computadas para la Fortaleza de la Contraseña ---
// (Simplificado como pediste, pero manteniendo la UI que ya tienes)

const hasLowercase = computed(() => /[a-z]/.test(form.value.password));
const hasUppercase = computed(() => /[A-Z]/.test(form.value.password));
const hasNumber = computed(() => /[0-9]/.test(form.value.password));
const hasMinLength = computed(() => form.value.password.length >= 8);

const passwordStrength = computed(() => {
  let strength = 0;
  if (hasMinLength.value) strength += 25;
  if (hasLowercase.value) strength += 25;
  if (hasUppercase.value) strength += 25;
  if (hasNumber.value) strength += 25;
  return strength;
});

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value < 50) return 'bg-danger';
  if (passwordStrength.value < 75) return 'bg-warning';
  return 'bg-success';
});

const passwordStrengthText = computed(() => {
  if (passwordStrength.value < 50) return 'Débil';
  if (passwordStrength.value < 75) return 'Aceptable';
  if (passwordStrength.value < 100) return 'Fuerte';
  return 'Muy Fuerte';
});

</script>

<template>
  <div class="register-container py-5 bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-7 col-md-9">

          <div class="text-center mb-5 animate__animated animate__fadeInDown">
            <h1 class="display-5 fw-bold">Crea tu Cuenta</h1>
            <p class="text-muted fs-5">Únete a nuestra plataforma y empieza a reservar.</p>
          </div>

          <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-4 animate__animated animate__shakeX" role="alert">
            <i class="bi bi-exclamation-octagon-fill me-2"></i>
            {{ error }}
            <button @click="clearError" type="button" class="btn-close" aria-label="Cerrar alerta"></button>
          </div>

          <form @submit.prevent="onSubmit" class="needs-validation" novalidate>
            <div class="mb-4 animate__animated animate__fadeInUp animate__delay-0-4s">
              <h5 class="mb-3 fs-6 text-uppercase text-muted fw-bold">Información Personal</h5>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="firstName" class="form-label text-muted fw-semibold">Nombre *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    v-model.trim="form.firstName" 
                    class="form-control form-control-lg" 
                    placeholder="Tu nombre" 
                    required
                    :class="{ 'is-invalid': validationErrors.name }"
                    autocomplete="given-name"
                    aria-describedby="firstNameFeedback"
                    @input="clearValidationError('name')"
                  >
                  <div id="firstNameFeedback" class="invalid-feedback">{{ validationErrors.name }}</div>
                </div>
                
                <div class="col-md-6">
                  <label for="lastName" class="form-label text-muted fw-semibold">Apellidos *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    v-model.trim="form.lastName" 
                    class="form-control form-control-lg" 
                    placeholder="Tus apellidos" 
                    required
                    :class="{ 'is-invalid': validationErrors.last_name }"
                    autocomplete="family-name"
                    aria-describedby="lastNameFeedback"
                    @input="clearValidationError('last_name')"
                  >
                  <div id="lastNameFeedback" class="invalid-feedback">{{ validationErrors.last_name }}</div>
                </div>
              </div>
            </div>

            <div class="mb-4 animate__animated animate__fadeInUp animate__delay-0-5s">
              <h5 class="mb-3 fs-6 text-uppercase text-muted fw-bold">Información de Contacto</h5>
              
              <div class="mb-3">
                <label for="email" class="form-label text-muted fw-semibold">Correo electrónico *</label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-envelope text-primary"></i>
                  </span>
                  <input 
                    type="email" 
                    id="email" 
                    v-model.trim="form.email" 
                    class="form-control border-start-0" 
                    placeholder="tu@email.com" 
                    required
                    :class="{ 'is-invalid': validationErrors.email }"
                    autocomplete="email"
                    aria-describedby="emailFeedback"
                    @input="clearValidationError('email')"
                  >
                  <div id="emailFeedback" class="invalid-feedback">{{ validationErrors.email }}</div>
                </div>
                <div class="form-text text-muted mt-2">Nunca compartiremos tu email con terceros.</div>
              </div>
              
              <div class="mb-3">
                <label for="phone" class="form-label text-muted fw-semibold">Teléfono (opcional)</label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-telephone text-primary"></i>
                  </span>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model.trim="form.phone" 
                    class="form-control border-start-0" 
                    placeholder="+591 7XXXXXXXX"
                    :class="{ 'is-invalid': validationErrors.phone }"
                    autocomplete="tel"
                    aria-describedby="phoneFeedback"
                    @input="clearValidationError('phone')"
                  >
                  <div id="phoneFeedback" class="invalid-feedback">{{ validationErrors.phone }}</div>
                </div>
              </div>
            </div>

            <div class="mb-4 animate__animated animate__fadeInUp animate__delay-0-6s">
              <h5 class="mb-3 fs-6 text-uppercase text-muted fw-bold">Datos de Cuenta</h5>
              
              <div class="mb-3">
                <label for="password" class="form-label text-muted fw-semibold">Contraseña *</label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-lock text-primary"></i>
                  </span>
                  <input 
                    :type="showPassword ? 'text' : 'password'" 
                    id="password" 
                    v-model.trim="form.password" 
                    class="form-control border-start-0" 
                    placeholder="Mínimo 8 caracteres" 
                    required
                    :class="{ 'is-invalid': validationErrors.password }"
                    autocomplete="new-password"
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
              
              <div class="mb-3">
                <label for="passwordConfirmation" class="form-label text-muted fw-semibold">Confirmar contraseña *</label>
                <div class="input-group input-group-lg">
                  <span class="input-group-text bg-white border-end-0">
                    <i class="bi bi-lock-fill text-primary"></i>
                  </span>
                  <input 
                    :type="showPasswordConfirm ? 'text' : 'password'" 
                    id="passwordConfirmation" 
                    v-model.trim="form.passwordConfirmation" 
                    class="form-control border-start-0" 
                    placeholder="Repite tu contraseña" 
                    required
                    :class="{ 'is-invalid': validationErrors.passwordConfirmation }"
                    autocomplete="new-password"
                    aria-describedby="passwordConfirmationFeedback"
                    @input="clearValidationError('passwordConfirmation')"
                  >
                  <button 
                    class="input-group-text bg-white border-start-0" 
                    type="button"
                    @click="showPasswordConfirm = !showPasswordConfirm"
                    aria-label="Mostrar/ocultar confirmación de contraseña"
                  >
                    <i class="bi" :class="showPasswordConfirm ? 'bi-eye-slash text-secondary' : 'bi-eye text-secondary'"></i>
                  </button>
                  <div id="passwordConfirmationFeedback" class="invalid-feedback">{{ validationErrors.passwordConfirmation }}</div>
                </div>
              </div>
            </div>

            <div class="mb-4 animate__animated animate__fadeInUp animate__delay-0-7s">
              <div class="password-strength p-3 border rounded-3 bg-light">
                <div class="d-flex justify-content-between mb-2">
                  <span class="text-muted small fw-semibold">Seguridad de la contraseña</span>
                  <span class="text-muted small">{{ passwordStrengthText }}</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div 
                    class="progress-bar" 
                    :class="passwordStrengthClass" 
                    role="progressbar" 
                    :style="{ width: passwordStrength + '%' }" 
                    :aria-valuenow="passwordStrength" 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                <ul class="password-requirements list-unstyled mt-3 small">
                  <li :class="hasMinLength ? 'text-success' : 'text-muted'">
                    <i class="bi" :class="hasMinLength ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                    Mínimo 8 caracteres
                  </li>
                  <li :class="hasLowercase ? 'text-success' : 'text-muted'">
                    <i class="bi" :class="hasLowercase ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                    Al menos una letra minúscula
                  </li>
                  <li :class="hasUppercase ? 'text-success' : 'text-muted'">
                    <i class="bi" :class="hasUppercase ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                    Al menos una letra mayúscula
                  </li>
                  <li :class="hasNumber ? 'text-success' : 'text-muted'">
                    <i class="bi" :class="hasNumber ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                    Al menos un número
                  </li>
                </ul>
              </div>
            </div>

            <div class="mb-4 animate__animated animate__fadeInUp animate__delay-0-8s">
              <div class="form-check mb-3">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="termsCheck" 
                  v-model="form.termsAccepted"
                  :class="{ 'is-invalid': validationErrors.termsAccepted }"
                  required
                  aria-describedby="termsFeedback"
                  @change="clearValidationError('termsAccepted')"
                >
                <label class="form-check-label text-muted" for="termsCheck">
                  He leído y acepto los <a href="#" @click.prevent="showTerms" class="text-primary fw-semibold">términos y condiciones</a> *
                </label>
                <div id="termsFeedback" class="invalid-feedback">{{ validationErrors.termsAccepted }}</div>
              </div>
              
              <div class="form-check">
                <input 
                  type="checkbox" 
                  class="form-check-input" 
                  id="marketingCheck" 
                  v-model="form.marketingAccepted"
                >
                <label class="form-check-label text-muted" for="marketingCheck">
                  Deseo recibir ofertas y novedades por email
                </label>
              </div>
            </div>

            <div class="d-grid gap-2 mb-4 animate__animated animate__fadeInUp animate__delay-0-9s">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg rounded-pill fw-bold"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                {{ isLoading ? 'Creando cuenta...' : 'Crear cuenta' }}
              </button>
              <router-link :to="{ name: 'login' }" class="btn btn-outline-secondary btn-lg rounded-pill fw-bold">
                ¿Ya tienes una cuenta? Inicia sesión
              </router-link>
            </div>
          </form>

          <div class="social-login mt-5 animate__animated animate__fadeInUp animate__delay-1s">
            <div class="separator text-muted mb-4">
              <span>O regístrate con</span>
            </div>
            <div class="row g-3">
              <div class="col-sm-6">
                <button type="button" class="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center py-2 rounded-pill">
                  <i class="bi bi-google me-2 fs-5"></i>Google
                </button>
              </div>
              <div class="col-sm-6">
                <button type="button" class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center py-2 rounded-pill">
                  <i class="bi bi-facebook me-2 fs-5"></i>Facebook
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <div v-if="showTermsModal" class="modal fade show d-block" tabindex="-1" role="dialog" aria-labelledby="termsModalLabel" aria-modal="true" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg modal-dialog-scrollable" role="document">
      <div class="modal-content rounded-4 shadow-lg">
        <div class="modal-header bg-primary text-white border-0 rounded-top-4">
          <h5 class="modal-title fw-bold" id="termsModalLabel">Términos y Condiciones de Servicio</h5>
          <button type="button" class="btn-close btn-close-white" @click="showTermsModal = false" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body p-4 p-md-5">
          <p class="lead mb-4">Bienvenido a nuestra plataforma de reservas. Al registrarte y utilizar nuestros servicios, aceptas cumplir con los siguientes términos y condiciones:</p>
          <h5 class="mt-4 fw-bold text-primary">1. Registro de Cuenta</h5>
          <p class="text-muted">Para utilizar nuestros servicios, debes proporcionar información precisa y completa durante el proceso de registro. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.</p>
          <h5 class="mt-4 fw-bold text-primary">2. Privacidad y Datos Personales</h5>
          <p class="text-muted">Tu privacidad es importante para nosotros. Nuestra Política de Privacidad describe detalladamente cómo recopilamos, utilizamos, almacenamos y protegemos tu información personal, y tus derechos sobre ella.</p>
          <h5 class="mt-4 fw-bold text-primary">3. Reservas y Pagos</h5>
          <p class="text-muted">Al realizar una reserva, aceptas pagar el importe total indicado en el momento de la confirmación. Los precios pueden incluir impuestos y tasas según la legislación aplicable. Las políticas de cancelación, modificación y reembolso se detallan claramente durante el proceso de reserva y en tu confirmación.</p>
        </div>
        <div class="modal-footer d-flex justify-content-between p-3">
          <button type="button" class="btn btn-secondary rounded-pill px-4" @click="showTermsModal = false">Cerrar</button>
          <button type="button" class="btn btn-primary rounded-pill px-4" @click="acceptTerms">Aceptar y Continuar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para centrar y dar formato al contenedor del formulario */
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

/* Estilo para el separador "O regístrate con" */
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

.separator:not(:empty)::before {
  margin-right: .25em;
}

.separator:not(:empty)::after {
  margin-left: .25em;
}
</style>