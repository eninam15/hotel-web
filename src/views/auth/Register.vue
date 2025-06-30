<template>
  <div class="register-page d-flex align-items-center py-5 min-vh-100 bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-9 col-lg-7 col-xl-6">
          <div class="card shadow-lg border-0 rounded-4">
            <div class="card-body p-4 p-md-5">
              <div class="text-center mb-5">
                <img 
                  src="/images/logo.png" 
                  alt="Logo Hospedaje Bermett" 
                  class="img-fluid mb-3 animate__animated animate__fadeInDown" 
                  style="max-height: 80px;"
                >
                <h1 class="h2 fw-bold text-primary animate__animated animate__fadeInUp">
                  Crea tu cuenta en Hospedaje Bermett
                </h1>
                <p class="text-muted mt-2 animate__animated animate__fadeInUp animate__delay-0-2s">
                  Únete a nuestra comunidad y gestiona tus reservas fácilmente.
                </p>
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
                        :class="{ 'is-invalid': validationErrors.firstName }"
                        autocomplete="given-name"
                        aria-describedby="firstNameFeedback"
                        @input="clearValidationError('firstName')"
                      >
                      <div id="firstNameFeedback" class="invalid-feedback">{{ validationErrors.firstName }}</div>
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
                        :class="{ 'is-invalid': validationErrors.lastName }"
                        autocomplete="family-name"
                        aria-describedby="lastNameFeedback"
                        @input="clearValidationError('lastName')"
                      >
                      <div id="lastNameFeedback" class="invalid-feedback">{{ validationErrors.lastName }}</div>
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
                      <li :class="form.password.length >= 8 ? 'text-success' : 'text-muted'">
                        <i class="bi" :class="form.password.length >= 8 ? 'bi-check-circle-fill' : 'bi-circle'"></i>
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
            
            <h5 class="mt-4 fw-bold text-primary">4. Comportamiento del Usuario</h5>
            <p class="text-muted">Te comprometes a utilizar nuestra plataforma de manera adecuada, legal y ética. No puedes utilizar nuestros servicios para actividades fraudulentas, ilegales, difamatorias o que violen los derechos de terceros, incluyendo la publicación de contenido inapropiado.</p>
            
            <h5 class="mt-4 fw-bold text-primary">5. Propiedad Intelectual</h5>
            <p class="text-muted">Todo el contenido y materiales disponibles en la plataforma, incluyendo textos, gráficos, logos, imágenes y software, son propiedad de nuestra empresa o de nuestros licenciantes y están protegidos por leyes de propiedad intelectual.</p>
            
            <h5 class="mt-4 fw-bold text-primary">6. Modificaciones de los Términos</h5>
            <p class="text-muted">Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en la plataforma. Te recomendamos revisar periódicamente los términos para estar informado de cualquier cambio relevante.</p>
            
            <h5 class="mt-4 fw-bold text-primary">7. Limitación de Responsabilidad</h5>
            <p class="text-muted">Nuestra plataforma se proporciona "tal cual" y "según disponibilidad". No garantizamos que el servicio sea ininterrumpido o libre de errores. En la medida máxima permitida por la ley, no seremos responsables de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar nuestros servicios.</p>
            
            <h5 class="mt-4 fw-bold text-primary">8. Ley Aplicable y Jurisdicción</h5>
            <p class="text-muted">Estos términos se rigen e interpretan de acuerdo con las leyes de Bolivia. Cualquier disputa que surja en relación con estos términos o el uso de la plataforma será sometida a la jurisdicción exclusiva de los tribunales de La Paz, Bolivia.</p>
          </div>
          <div class="modal-footer d-flex justify-content-between p-3">
            <button type="button" class="btn btn-secondary rounded-pill px-4" @click="showTermsModal = false">Cerrar</button>
            <button type="button" class="btn btn-primary rounded-pill px-4" @click="acceptTerms">Aceptar y Continuar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

// State
const form = reactive({ 
  firstName: '', 
  lastName: '',
  email: '',
  phone: '',
  password: '',
  passwordConfirmation: '',
  termsAccepted: false,
  marketingAccepted: false
});

const validationErrors = ref({});
const error = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const showPasswordConfirm = ref(false);
const showTermsModal = ref(false);

// Composables
const auth = useAuthStore();
const router = useRouter();

// Password strength checker
const hasLowercase = computed(() => /[a-z]/.test(form.password));
const hasUppercase = computed(() => /[A-Z]/.test(form.password));
const hasNumber = computed(() => /[0-9]/.test(form.password));

const passwordStrength = computed(() => {
  let strength = 0;
  
  // Base length requirement
  if (form.password.length >= 8) {
    strength += 25;
  } else if (form.password.length > 0) { // Give some credit for partial length
    strength += (form.password.length / 8) * 20; // Up to 20% for length less than 8
  }

  // Character type checks
  if (hasLowercase.value) strength += 20; // Reduced from 25 to balance for length
  if (hasUppercase.value) strength += 20;
  if (hasNumber.value) strength += 20;
  
  // Bonus for mixed characters and length over 12 for "Strong"
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(form.password);
  if (hasSpecial) strength += 15;
  if (form.password.length >= 12 && strength >= 80) strength += 5; // Small bonus for very long strong passwords

  return Math.min(100, Math.floor(strength)); // Cap at 100
});

const passwordStrengthText = computed(() => {
  if (form.password.length === 0) return 'Sin contraseña';
  if (passwordStrength.value < 40) return 'Débil'; // Adjusted thresholds
  if (passwordStrength.value < 60) return 'Moderada';
  if (passwordStrength.value < 80) return 'Buena';
  return 'Muy fuerte';
});

const passwordStrengthClass = computed(() => {
  if (form.password.length === 0) return 'bg-secondary';
  if (passwordStrength.value < 40) return 'bg-danger';
  if (passwordStrength.value < 60) return 'bg-warning';
  if (passwordStrength.value < 80) return 'bg-info';
  return 'bg-success';
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

  if (!form.firstName.trim()) {
    validationErrors.value.firstName = 'El nombre es obligatorio.';
    hasErrors = true;
  }
  
  if (!form.lastName.trim()) {
    validationErrors.value.lastName = 'Los apellidos son obligatorios.';
    hasErrors = true;
  }
  
  if (!form.email.trim()) {
    validationErrors.value.email = 'El correo electrónico es obligatorio.';
    hasErrors = true;
  } else if (!isValidEmail(form.email)) {
    validationErrors.value.email = 'Por favor, ingresa un correo electrónico válido.';
    hasErrors = true;
  }
  
  if (form.phone.trim() && !isValidPhone(form.phone)) {
    validationErrors.value.phone = 'Formato de teléfono inválido.';
    hasErrors = true;
  }
  
  if (!form.password.trim()) {
    validationErrors.value.password = 'La contraseña es obligatoria.';
    hasErrors = true;
  } else if (form.password.length < 8) {
    validationErrors.value.password = 'La contraseña debe tener al menos 8 caracteres.';
    hasErrors = true;
  } else if (passwordStrength.value < 60) { // Require at least 'Moderada' strength
    validationErrors.value.password = 'La contraseña no es suficientemente segura. Intenta combinar letras mayúsculas, minúsculas y números.';
    hasErrors = true;
  }
  
  if (!form.passwordConfirmation.trim()) {
    validationErrors.value.passwordConfirmation = 'Debes confirmar tu contraseña.';
    hasErrors = true;
  } else if (form.password !== form.passwordConfirmation) {
    validationErrors.value.passwordConfirmation = 'Las contraseñas no coinciden.';
    hasErrors = true;
  }
  
  if (!form.termsAccepted) {
    validationErrors.value.termsAccepted = 'Debes aceptar los términos y condiciones para continuar.';
    hasErrors = true;
  }
  
  // Check if there are any client-side validation errors
  if (hasErrors) {
    return;
  }
  
  // Submit form
  try {
    isLoading.value = true;
    
    // Llamar a la acción de registro del store de autenticación
    await auth.register({
      name: `${form.firstName} ${form.lastName}`, // Concatenar para 'name' si tu backend lo espera así
      firstName: form.firstName, // Enviar también si tu backend los espera separados
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      password_confirmation: form.passwordConfirmation, // Laravel espera `password_confirmation`
      marketingAccepted: form.marketingAccepted // Asegúrate de que tu API maneje esto
    });
    
    // Redirige al login con el email pre-cargado y un mensaje de éxito
    router.push({ 
      name: 'login',
      query: { email: form.email, registered: 'success' } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Manejo de errores de la API
    // Si tu API devuelve un objeto de errores de validación, puedes mapearlos
    if (err.errors) { // Suponiendo que el backend devuelve { errors: { email: ['ya existe'] } }
      if (err.errors.email) {
        validationErrors.value.email = err.errors.email[0];
      }
      // Puedes añadir más manejo de errores para otros campos si los devuelve el backend
      error.value = 'Por favor, corrige los errores en el formulario.';
    } else {
      // Mensaje de error general
      error.value = err.message || 'Ha ocurrido un error durante el registro. Por favor, intenta de nuevo.';
    }
  } finally {
    isLoading.value = false;
  }
}

function showTerms() {
  showTermsModal.value = true;
}

function acceptTerms() {
  form.termsAccepted = true;
  showTermsModal.value = false;
  clearValidationError('termsAccepted'); // Limpia el error de validación del checkbox
}

function socialLogin(provider) {
  alert(`Iniciando registro con ${provider}... (Funcionalidad pendiente)`);
  // Aquí se iniciaría la redirección a OAuth o una ventana emergente.
}

// Validation helpers
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPhone(phone) {
  // Ajustada para un formato más flexible para Bolivia (+591 XXXXXXXX)
  // Permite opcionalmente el +, y luego solo números
  // Esto es una validación básica, para producción se recomienda una librería más robusta.
  return /^\+?(\d[\d\s-()]){7,14}\d$/.test(phone.trim()); // Ajustado para ser más permisivo
}
</script>

<style scoped>
/* Colores y Variables de Bootstrap (replicados para consistencia) */
:root {
  --bs-primary: #9C27B0; /* Tu morado principal */
  --bs-secondary: #6c757d; /* Gris de Bootstrap */
  --bs-info: #0dcaf0; /* Azul claro de Bootstrap */
  --bs-danger: #dc3545; /* Rojo de Bootstrap */
  --bs-warning: #ffc107; /* Amarillo de Bootstrap */
  --bs-success: #198754; /* Verde de Bootstrap */
  --bs-light: #f8f9fa; /* Gris muy claro de Bootstrap */
  --bs-dark: #212529; /* Negro/Gris oscuro de Bootstrap */
}

/* Estilos Generales de la Página de Registro */
.register-page {
  background-image: linear-gradient(to bottom left, #f8f9fa, #e9ecef); /* Fondo suave */
  background-size: cover;
  background-position: center;
}

/* Estilos de la Tarjeta */
.card {
  border: none;
  border-radius: 1rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeIn 0.8s ease-out;
}

/* Encabezado y Logo */
.text-center h1 {
  color: var(--bs-primary);
}

/* Títulos de Sección */
h5.text-uppercase.text-muted {
  letter-spacing: 0.05em; /* Espaciado entre letras para los títulos de sección */
  font-size: 0.9rem !important; /* Ligeramente más pequeños */
}

/* Inputs y Grupos de Inputs */
.input-group-lg > .form-control,
.input-group-lg > .input-group-text {
  padding: 0.75rem 1.25rem;
  font-size: 1.1rem;
}

.input-group-text {
  background-color: var(--bs-white);
  border-color: #dee2e6;
  color: var(--bs-primary); /* Íconos primarios */
}

.input-group-text i {
  transition: color 0.3s ease;
}

.form-control:focus + .input-group-text i {
  color: var(--bs-primary);
}

.form-control.is-invalid {
  border-color: var(--bs-danger);
}

.invalid-feedback {
  font-size: 0.875rem;
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
  transform: translateY(-2px);
}

.btn-primary.rounded-pill:active {
  transform: translateY(0);
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
.btn-outline-danger {
  color: var(--bs-danger);
  border-color: var(--bs-danger);
  transition: all 0.3s ease;
}

.btn-outline-danger:hover {
  background-color: var(--bs-danger);
  color: var(--bs-white);
}

.btn-outline-primary { /* Para Facebook, usando tu color primario del tema */
  color: var(--bs-primary);
  border-color: var(--bs-primary);
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: var(--bs-primary);
  color: var(--bs-white);
}

.social-login .btn i {
  font-size: 1.25rem;
}

/* Separador "O continúa con" */
.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin-top: 2.5rem;
  margin-bottom: 2.5rem;
  font-size: 0.95rem;
}

.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.separator span {
  padding: 0 1rem;
  background-color: var(--bs-white);
  color: var(--bs-secondary);
  position: relative;
  z-index: 1;
}

/* Indicador de Fuerza de Contraseña */
.password-strength {
  background-color: var(--bs-light); /* Un fondo suave para la caja */
  border-radius: 0.5rem;
  padding: 1rem;
}

.password-strength .progress {
  border-radius: 50px; /* Barras de progreso más redondeadas */
  background-color: #e9ecef; /* Fondo de la barra de progreso */
}

.password-requirements li {
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
}

.password-requirements li i {
  margin-right: 0.5rem;
  font-size: 0.9rem; /* Icono un poco más pequeño */
}

.text-success {
  color: var(--bs-success) !important;
}

/* Checkboxes */
.form-check-input.is-invalid ~ .form-check-label {
  color: var(--bs-danger);
}

/* Enlaces */
a.text-primary.fw-semibold:hover {
  color: #7b1fa2 !important;
}

/* Modal de Términos y Condiciones */
.modal-header.bg-primary {
  background-color: var(--bs-primary) !important;
}

.modal-header .btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%); /* Asegura que el botón cerrar sea blanco en fondo oscuro */
}

.modal-body p.lead {
  font-size: 1.1rem;
  color: var(--bs-dark);
}

.modal-body h5.text-primary {
  color: var(--bs-primary) !important;
}

.modal-body p.text-muted {
  font-size: 0.95rem;
}

.modal-footer .btn.rounded-pill {
  min-width: 120px;
}

/* Animaciones (Animate.css) */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Media Queries para Responsividad */
@media (max-width: 768px) {
  .register-page {
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
  .register-page {
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
  .col-sm-6 { /* Asegura que los botones sociales se apilen en pantallas muy pequeñas si es necesario */
    width: 100%;
  }
}
</style>