<!-- src/views/auth/Register.vue -->
<template>
  <div class="register-page py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-body p-4 p-md-5">
              <!-- Logo or brand image -->
              <div class="text-center mb-4">
                <img src="/images/logo.png" alt="Logo" class="img-fluid mb-3" style="max-height: 60px;">
                <h1 class="h3 fw-bold text-primary mb-0">Crear una cuenta</h1>
              </div>

              <!-- Alert for errors -->
              <div v-if="error" class="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ error }}
                <button @click="error = ''" type="button" class="btn-close" aria-label="Close"></button>
              </div>

              <!-- Registration form -->
              <form @submit.prevent="onSubmit">
                <!-- Personal Information -->
                <div class="mb-4">
                  <h5 class="mb-3 fs-6 text-uppercase text-muted">Información personal</h5>
                  <div class="row g-3">
                    <div class="col-md-6">
                      <label for="firstName" class="form-label">Nombre *</label>
                      <input 
                        type="text" 
                        id="firstName" 
                        v-model="form.firstName" 
                        class="form-control" 
                        placeholder="Tu nombre" 
                        required
                        :class="{ 'is-invalid': validationErrors.firstName }"
                      >
                      <div class="invalid-feedback">{{ validationErrors.firstName }}</div>
                    </div>
                    
                    <div class="col-md-6">
                      <label for="lastName" class="form-label">Apellidos *</label>
                      <input 
                        type="text" 
                        id="lastName" 
                        v-model="form.lastName" 
                        class="form-control" 
                        placeholder="Tus apellidos" 
                        required
                        :class="{ 'is-invalid': validationErrors.lastName }"
                      >
                      <div class="invalid-feedback">{{ validationErrors.lastName }}</div>
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="mb-4">
                  <h5 class="mb-3 fs-6 text-uppercase text-muted">Información de contacto</h5>
                  
                  <div class="mb-3">
                    <label for="email" class="form-label">Correo electrónico *</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-envelope"></i>
                      </span>
                      <input 
                        type="email" 
                        id="email" 
                        v-model="form.email" 
                        class="form-control" 
                        placeholder="tu@email.com" 
                        required
                        :class="{ 'is-invalid': validationErrors.email }"
                      >
                      <div class="invalid-feedback">{{ validationErrors.email }}</div>
                    </div>
                    <div class="form-text">Nunca compartiremos tu email con terceros.</div>
                  </div>
                  
                  <div class="mb-3">
                    <label for="phone" class="form-label">Teléfono (opcional)</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-telephone"></i>
                      </span>
                      <input 
                        type="tel" 
                        id="phone" 
                        v-model="form.phone" 
                        class="form-control" 
                        placeholder="+34 600 000 000"
                        :class="{ 'is-invalid': validationErrors.phone }"
                      >
                      <div class="invalid-feedback">{{ validationErrors.phone }}</div>
                    </div>
                  </div>
                </div>

                <!-- Account Information -->
                <div class="mb-4">
                  <h5 class="mb-3 fs-6 text-uppercase text-muted">Datos de cuenta</h5>
                  
                  <div class="mb-3">
                    <label for="password" class="form-label">Contraseña *</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-lock"></i>
                      </span>
                      <input 
                        :type="showPassword ? 'text' : 'password'" 
                        id="password" 
                        v-model="form.password" 
                        class="form-control" 
                        placeholder="Mínimo 8 caracteres" 
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
                  
                  <div class="mb-3">
                    <label for="passwordConfirmation" class="form-label">Confirmar contraseña *</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light">
                        <i class="bi bi-lock-fill"></i>
                      </span>
                      <input 
                        :type="showPasswordConfirm ? 'text' : 'password'" 
                        id="passwordConfirmation" 
                        v-model="form.passwordConfirmation" 
                        class="form-control" 
                        placeholder="Repite tu contraseña" 
                        required
                        :class="{ 'is-invalid': validationErrors.passwordConfirmation }"
                      >
                      <button 
                        class="input-group-text bg-light" 
                        type="button"
                        @click="showPasswordConfirm = !showPasswordConfirm"
                      >
                        <i class="bi" :class="showPasswordConfirm ? 'bi-eye-slash' : 'bi-eye'"></i>
                      </button>
                      <div class="invalid-feedback">{{ validationErrors.passwordConfirmation }}</div>
                    </div>
                  </div>
                </div>

                <!-- Password Strength Indicator -->
                <div class="mb-4">
                  <div class="password-strength">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="text-muted small">Seguridad de la contraseña</span>
                      <span class="text-muted small">{{ passwordStrengthText }}</span>
                    </div>
                    <div class="progress" style="height: 6px;">
                      <div 
                        class="progress-bar" 
                        :class="passwordStrengthClass" 
                        role="progressbar" 
                        :style="{ width: passwordStrength + '%' }" 
                        aria-valuenow="0" 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                    <ul class="password-requirements list-unstyled mt-2 small">
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

                <!-- Terms and Conditions -->
                <div class="mb-4">
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="termsCheck" 
                      v-model="form.termsAccepted"
                      :class="{ 'is-invalid': validationErrors.termsAccepted }"
                      required
                    >
                    <label class="form-check-label" for="termsCheck">
                      He leído y acepto los <a href="#" @click.prevent="showTerms">términos y condiciones</a> *
                    </label>
                    <div class="invalid-feedback">{{ validationErrors.termsAccepted }}</div>
                  </div>
                </div>

                <div class="mb-4">
                  <div class="form-check">
                    <input 
                      type="checkbox" 
                      class="form-check-input" 
                      id="marketingCheck" 
                      v-model="form.marketingAccepted"
                    >
                    <label class="form-check-label" for="marketingCheck">
                      Deseo recibir ofertas y novedades por email
                    </label>
                  </div>
                </div>

                <div class="d-grid">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'Procesando...' : 'Crear cuenta' }}
                  </button>
                </div>
              </form>

              <div class="mt-4 text-center">
                <p class="mb-0">¿Ya tienes una cuenta? <router-link :to="{ name: 'login' }" class="text-decoration-none fw-semibold">Inicia sesión</router-link></p>
              </div>

              <!-- Social Registration Section -->
              <div class="social-login mt-4">
                <div class="separator text-muted mb-3">
                  <span>O regístrate con</span>
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

    <!-- Terms and Conditions Modal -->
    <div v-if="showTermsModal" class="modal fade show d-block" tabindex="-1" role="dialog" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Términos y Condiciones</h5>
            <button type="button" class="btn-close" @click="showTermsModal = false"></button>
          </div>
          <div class="modal-body">
            <h4>Términos y Condiciones de Uso</h4>
            <p>Bienvenido a nuestra plataforma de reservas. Al registrarte y utilizar nuestros servicios, aceptas cumplir con los siguientes términos y condiciones:</p>
            
            <h5 class="mt-4">1. Registro de Cuenta</h5>
            <p>Para utilizar nuestros servicios, debes proporcionar información precisa y completa durante el proceso de registro. Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades que ocurran bajo tu cuenta.</p>
            
            <h5 class="mt-3">2. Privacidad</h5>
            <p>Tu privacidad es importante para nosotros. Nuestra Política de Privacidad describe cómo recopilamos, utilizamos y protegemos tu información personal.</p>
            
            <h5 class="mt-3">3. Reservas y Pagos</h5>
            <p>Al realizar una reserva, aceptas pagar el importe total indicado. Los precios pueden incluir impuestos y tasas según la legislación aplicable. Las políticas de cancelación se detallan durante el proceso de reserva.</p>
            
            <h5 class="mt-3">4. Comportamiento del Usuario</h5>
            <p>Te comprometes a utilizar nuestra plataforma de manera adecuada y legal. No puedes utilizar nuestros servicios para actividades fraudulentas, ilegales o que violen los derechos de terceros.</p>
            
            <h5 class="mt-3">5. Modificaciones</h5>
            <p>Podemos modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación. Te recomendamos revisar periódicamente los términos para estar informado de cualquier cambio.</p>
            
            <h5 class="mt-3">6. Limitación de Responsabilidad</h5>
            <p>No somos responsables de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la imposibilidad de usar nuestros servicios.</p>
            
            <h5 class="mt-3">7. Ley Aplicable</h5>
            <p>Estos términos se rigen por las leyes del país donde tenemos nuestra sede principal, sin tener en cuenta sus principios de conflicto de leyes.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="acceptTerms">Aceptar</button>
            <button type="button" class="btn btn-secondary" @click="showTermsModal = false">Cerrar</button>
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
  
  if (form.password.length >= 8) strength += 25;
  if (hasLowercase.value) strength += 25;
  if (hasUppercase.value) strength += 25;
  if (hasNumber.value) strength += 25;
  
  return strength;
});

const passwordStrengthText = computed(() => {
  if (passwordStrength.value === 0) return 'Sin contraseña';
  if (passwordStrength.value <= 25) return 'Débil';
  if (passwordStrength.value <= 50) return 'Regular';
  if (passwordStrength.value <= 75) return 'Buena';
  return 'Fuerte';
});

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value <= 25) return 'bg-danger';
  if (passwordStrength.value <= 50) return 'bg-warning';
  if (passwordStrength.value <= 75) return 'bg-info';
  return 'bg-success';
});

// Methods
async function onSubmit() {
  // Reset validation and errors
  validationErrors.value = {};
  error.value = '';
  
  // Validate form
  if (!form.firstName) {
    validationErrors.value.firstName = 'El nombre es obligatorio';
  }
  
  if (!form.lastName) {
    validationErrors.value.lastName = 'Los apellidos son obligatorios';
  }
  
  if (!form.email) {
    validationErrors.value.email = 'El correo electrónico es obligatorio';
  } else if (!isValidEmail(form.email)) {
    validationErrors.value.email = 'Por favor ingresa un correo electrónico válido';
  }
  
  if (form.phone && !isValidPhone(form.phone)) {
    validationErrors.value.phone = 'Formato de teléfono inválido';
  }
  
  if (!form.password) {
    validationErrors.value.password = 'La contraseña es obligatoria';
  } else if (form.password.length < 8) {
    validationErrors.value.password = 'La contraseña debe tener al menos 8 caracteres';
  } else if (passwordStrength.value < 75) {
    validationErrors.value.password = 'La contraseña no es suficientemente segura';
  }
  
  if (!form.passwordConfirmation) {
    validationErrors.value.passwordConfirmation = 'Debes confirmar tu contraseña';
  } else if (form.password !== form.passwordConfirmation) {
    validationErrors.value.passwordConfirmation = 'Las contraseñas no coinciden';
  }
  
  if (!form.termsAccepted) {
    validationErrors.value.termsAccepted = 'Debes aceptar los términos y condiciones';
  }
  
  // Check if there are validation errors
  if (Object.keys(validationErrors.value).length > 0) {
    return;
  }
  
  // Submit form
  try {
    isLoading.value = true;
    
    // In a real app, you would send this to your API
    // This is a simplified example
    await auth.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      marketingAccepted: form.marketingAccepted
    });
    
    // Redirect to login with email pre-filled
    router.push({ 
      name: 'login',
      query: { email: form.email, registered: 'success' } 
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle specific errors (in a real app, your API might return error codes)
    if (err.message && err.message.includes('email')) {
      error.value = 'Este correo electrónico ya está registrado.';
    } else {
      error.value = 'Ha ocurrido un error durante el registro. Por favor intenta de nuevo.';
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
}

function socialLogin(provider) {
  // In a real app, this would initiate OAuth flow with the provider
  alert(`En una aplicación real, esto iniciaría el registro con ${provider}.`);
}

// Validation helpers
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function isValidPhone(phone) {
  // This is a basic validation - in a real app, you might want to use a library for phone validation
  return /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone.trim());
}
</script>

<style scoped>
.register-page {
  padding: 3rem 0;
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

.password-requirements li {
  margin-bottom: 0.25rem;
}

/* Modal backdrop fix for Bootstrap Vue-like modal */
.modal.show {
  display: block;
}
</style>