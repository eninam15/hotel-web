<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
    <div class="container-fluid px-4">
      <router-link class="navbar-brand fw-bold text-primary d-flex align-items-center" to="/">
        <img
          src="/images/logo-bermett.png"
          alt="Logo Hospedaje Bermett"
          class="d-inline-block align-text-top me-2"
          style="height: 80px; object-fit: cover;"
        />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="item in primaryNavItems" :key="item.to">
            <router-link
              class="nav-link"
              :class="{ 'active fw-bold text-primary': isActive(item.to) }"
              :to="item.to"
            >
              {{ item.label }}
            </router-link>
          </li>

          <li class="nav-item dropdown" v-if="userRole === 'admin' || userRole === 'employee'">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="adminDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              :class="{ 'active fw-bold text-primary': isAdminPathActive }"
            >
              Administración
            </a>
            <ul class="dropdown-menu" aria-labelledby="adminDropdown">
              <li>
                <router-link class="dropdown-item" to="/admin/dashboard">
                  <i class="bi bi-speedometer me-2"></i>Dashboard
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/rooms">
                  <i class="bi bi-door-open me-2"></i>Gestión de Habitaciones
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/admin/bookings">
                  <i class="bi bi-calendar-check me-2"></i>Gestión de Reservas
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link class="dropdown-item" to="/admin/users">
                  <i class="bi bi-people me-2"></i>Gestión de Usuarios
                </router-link>
              </li>
            </ul>
          </li>
        </ul>

        <ul class="navbar-nav mb-2 mb-lg-0 align-items-center">
          <li class="nav-item me-3" v-if="auth.isAuthenticated">
            <button
              class="btn position-relative p-0 text-secondary"
              @click="$emit('notifications')"
              aria-label="Notifications"
            >
              <i class="bi bi-bell fs-5"></i>
              <span
                v-if="unreadCount > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ unreadCount }}
                <span class="visually-hidden">notificaciones sin leer</span>
              </span>
            </button>
          </li>

          <li class="nav-item" v-if="!auth.isAuthenticated">
            <router-link to="/login" class="btn btn-outline-primary me-2">Iniciar Sesión</router-link>
          </li>
          <li class="nav-item" v-if="!auth.isAuthenticated">
            <router-link to="/register" class="btn btn-primary">Registrarse</router-link>
          </li>

          <li class="nav-item dropdown" v-if="auth.isAuthenticated">
            <a
              class="nav-link dropdown-toggle d-flex align-items-center p-0"
              href="#"
              id="userDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                :src="user.avatar || '/images/avatar.jpeg'"
                class="rounded-circle me-2"
                style="width: 38px; height: 38px; object-fit: cover; border: 2px solid var(--bs-primary);"
                alt="Avatar de usuario"
                @error="handleAvatarError"
              />
              <span class="d-none d-lg-inline text-dark fw-medium">{{ user.name || 'Usuario' }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
              <li>
                <h6 class="dropdown-header">
                  {{ user.name || 'Usuario' }} ({{ userRoleDisplay }})
                </h6>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <router-link class="dropdown-item" to="/profile">
                  <i class="bi bi-person-circle me-2"></i>Mi Perfil
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" to="/my-bookings" v-if="userRole === 'client'">
                  <i class="bi bi-journal-check me-2"></i>Mis Reservas
                </router-link>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item text-danger" @click="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Inicialización de Router
const route = useRoute();
const router = useRouter(); // Necesario para la redirección de logout

// Store de autenticación
const auth = useAuthStore();

// --- Estado Reactivo ---
const search = ref('');
const unreadCount = ref(3); // Ejemplo, esto vendría de tu API de notificaciones

// --- Datos Computados ---

// User data: usar el objeto user del store, con un fallback
const user = computed(() => auth.user || {
  name: 'Invitado',
  email: '',
  avatar: '/images/avatar.jpeg', // Ruta de imagen por defecto
  role: 'guest'
});

// Rol del usuario para controlar la visibilidad de enlaces
const userRole = computed(() => user.value.role);
const userRoleDisplay = computed(() => {
  switch (userRole.value) {
    case 'admin': return 'Administrador';
    case 'employee': return 'Empleado';
    case 'client': return 'Cliente';
    default: return 'Invitado';
  }
});

// Items de navegación principales (para todos o la mayoría)
const primaryNavItems = computed(() => [
  { label: 'Inicio', to: '/' },
  { label: 'Habitaciones', to: '/rooms' },
  { label: 'Servicios', to: '/services' },
  { label: 'Contacto', to: '/contact' },
  // Añadir más links aquí si son generales
]);

// Determinar si una ruta es activa
function isActive(path) {
  return route.path === path || (path !== '/' && route.path.startsWith(path));
}

// Determinar si alguna ruta de administración está activa (para el dropdown)
const isAdminPathActive = computed(() => {
  return route.path.startsWith('/admin');
});

// --- Métodos ---

// Manejar error de carga del avatar
function handleAvatarError(event) {
  event.target.src = '/images/avatar.jpeg'; // Carga la imagen por defecto si la original falla
}

// Manejar logout
async function handleLogout() {
  try {
    await auth.logout(); // Llama a la acción de logout de tu store
    router.push('/login'); // Redirige a la página de login
  } catch (err) {
    console.error('Error al cerrar sesión:', err);
    alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
  }
}

// Puedes añadir métodos para la búsqueda y notificaciones si emites esos eventos
// function handleSearchSubmit() {
//   emit('search', search.value);
// }
// function showNotifications() {
//   emit('notifications');
// }

// Para emitir eventos desde la Navbar, si es que el padre los usa
// const emit = defineEmits(['search', 'notifications']);

</script>

<style scoped>
.navbar {
  background-color: #ffffff !important; /* Blanco */
  border-bottom: 1px solid #f0f0f0;
  z-index: 1020; /* Asegura que la navbar esté sobre otros elementos */
}

.navbar-brand {
  font-size: 1.5rem;
  color: #9C27B0 !important; /* Morado primario */
}

.nav-link {
  color: #6c757d; /* Gris para links normales */
  font-weight: 500;
  transition: color 0.3s ease, border-bottom 0.3s ease;
  position: relative; /* Para el pseudo-elemento */
}

.nav-link:hover {
  color: #9C27B0; /* Morado primario al pasar el ratón */
}

.nav-link.active {
  color: #9C27B0 !important; /* Morado primario activo */
  font-weight: bold;
}

.nav-item .dropdown-toggle::after {
  margin-left: 0.5em; /* Espacio entre el texto y la flecha */
}

/* Subrayado animado para links activos */
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px; /* Ajusta la posición del subrayado */
  left: 0;
  width: 0;
  height: 2px; /* Grosor del subrayado */
  background-color: #9C27B0; /* Color del subrayado */
  transition: width 0.3s ease;
}

.nav-link.active::after,
.nav-link:hover::after {
  width: 100%;
}

/* Dropdown styling */
.dropdown-menu {
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  border: none;
}

.dropdown-item {
  color: #343a40;
  transition: background-color 0.2s ease, color 0.2s ease;
  font-weight: 500;
}

.dropdown-item:hover,
.dropdown-item.active {
  background-color: #f0f0f0; /* Un gris más claro para hover/active */
  color: #9C27B0; /* Morado para el texto en hover/active */
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da; /* Rojo claro para el botón de salir */
  color: #dc3545 !important;
}

.btn-outline-primary {
  color: #9C27B0;
  border-color: #9C27B0;
}

.btn-outline-primary:hover {
  background-color: #9C27B0;
  color: #fff;
}

.btn-primary {
  background-color: #9C27B0;
  border-color: #9C27B0;
}

.btn-primary:hover {
  background-color: #7b1fa2; /* Un tono más oscuro de morado */
  border-color: #7b1fa2;
}

/* Avatar del usuario */
.nav-item .dropdown-toggle img {
  border: 2px solid #9C27B0; /* Borde más distintivo para el avatar */
  transition: border-color 0.3s ease;
}

.nav-item .dropdown-toggle:hover img {
  border-color: #7b1fa2;
}

.dropdown-header {
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 600;
  padding: 0.5rem 1rem;
}

/* Ajustes para pantallas pequeñas */
@media (max-width: 991.98px) {
  .navbar-nav {
    text-align: center; /* Centra los links en móvil */
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .navbar-nav .nav-item {
    margin-bottom: 0.5rem;
  }
  .navbar-nav .nav-link.active::after,
  .navbar-nav .nav-link:hover::after {
    left: 50%;
    transform: translateX(-50%); /* Centrar el subrayado en móvil */
  }
  .navbar-collapse {
    border-top: 1px solid #f0f0f0;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
  .btn.position-relative {
    display: block;
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .navbar-nav .dropdown-menu {
    text-align: center;
    width: 100%;
  }
  .navbar-nav .dropdown-item {
    justify-content: center; /* Centra el contenido del dropdown */
  }
}
</style>