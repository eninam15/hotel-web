<!-- src/components/layout/UserLayout.vue -->
<template>
  <div class="user-layout d-flex">
    <!-- Overlay para mobile cuando sidebar está abierto -->
    <div 
      v-if="!sidebarCollapsed && isMobile" 
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar -->
    <aside 
      class="user-sidebar bg-white shadow-lg" 
      :class="{ 
        'collapsed': sidebarCollapsed,
        'mobile-open': !sidebarCollapsed && isMobile
      }"
    >
      <!-- Sidebar Header -->
      <div class="sidebar-header p-4 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <span class="h5 text-primary mb-0 fw-bold" v-if="!sidebarCollapsed">Mi Panel</span>
          <span class="h6 text-primary mb-0 fw-bold" v-else>MP</span>
        </div>
        <button 
          class="btn btn-sm btn-outline-secondary border-0 sidebar-toggle" 
          @click="toggleSidebar"
          :title="sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'"
        >
          <i class="bi" :class="sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        </button>
      </div>
      
      <!-- User Profile Section -->
      <div class="user-profile p-4" v-if="!sidebarCollapsed">
        <div class="d-flex align-items-center mb-3">
          <img 
            :src="auth.user?.avatar || '/images/avatar-placeholder.png'" 
            class="rounded-circle me-3" 
            width="50" 
            height="50"
            alt="Avatar de usuario"
            @error="handleAvatarError"
          >
          <div class="flex-grow-1">
            <h6 class="mb-0">{{ displayName }}</h6>
            <small class="text-muted">{{ auth.user?.email }}</small>
          </div>
        </div>
        
        <!-- Current Reservation Status -->
        <div v-if="currentReservation" class="current-reservation">
          <div class="card border-primary">
            <div class="card-body p-3">
              <div class="d-flex align-items-center mb-2">
                <i class="bi bi-door-open text-primary me-2"></i>
                <strong>Habitación {{ currentReservation.roomNumber }}</strong>
              </div>
              <div class="small text-muted">
                <div>Check-out: {{ formatDate(currentReservation.checkOut) }}</div>
                <div class="mt-1">
                  <span class="badge" :class="getReservationStatusClass(currentReservation.status)">
                    {{ getReservationStatusLabel(currentReservation.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Sidebar Navigation -->
      <nav class="sidebar-menu px-3 pb-4">
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'user.dashboard' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('user.dashboard') }"
              @click="handleNavClick"
            >
              <i class="bi bi-house-door" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Dashboard</span>
            </router-link>
          </li>
          
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'user.reservation' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('user.reservation') }"
              @click="handleNavClick"
            >
              <i class="bi bi-calendar-check" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Mi Reserva</span>
              <span v-if="hasActiveReservation && !sidebarCollapsed" class="badge bg-light text-primary ms-auto">1</span>
            </router-link>
          </li>
          
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'user.room' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('user.room') }"
              @click="handleNavClick"
            >
              <i class="bi bi-door-open" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Mi Habitación</span>
            </router-link>
          </li>
          
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'user.services' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('user.services') }"
              @click="handleNavClick"
            >
              <i class="bi bi-shop" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Servicios</span>
              <span v-if="pendingOrders > 0 && !sidebarCollapsed" class="badge bg-warning text-dark ms-auto">{{ pendingOrders }}</span>
            </router-link>
          </li>
          
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'user.orders' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('user.orders') }"
              @click="handleNavClick"
            >
              <i class="bi bi-receipt" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Mis Pedidos</span>
            </router-link>
          </li>
          
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'user.profile' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('user.profile') }"
              @click="handleNavClick"
            >
              <i class="bi bi-person-gear" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Mi Perfil</span>
            </router-link>
          </li>
          
          <!-- Support Section -->
          <li class="nav-divider" v-if="!sidebarCollapsed">
            <hr class="my-3">
            <small class="text-muted px-3">Soporte</small>
          </li>
          
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'user.support' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('user.support') }"
              @click="handleNavClick"
            >
              <i class="bi bi-headset" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Ayuda</span>
            </router-link>
          </li>
          
          <li class="nav-item mb-2">
            <a 
              href="#" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center text-success" 
              @click.prevent="requestConcierge"
            >
              <i class="bi bi-bell" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Conserje</span>
            </a>
          </li>
        </ul>
      </nav>
      
      <!-- Sidebar Footer with Logout -->
      <div class="sidebar-footer mt-auto p-4">
        <button 
          class="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center" 
          @click="handleLogout"
          :disabled="isLoggingOut"
        >
          <div v-if="isLoggingOut" class="spinner-border spinner-border-sm me-2" role="status">
            <span class="visually-hidden">Cerrando sesión...</span>
          </div>
          <i v-else class="bi bi-box-arrow-right" :class="{ 'me-2': !sidebarCollapsed }"></i>
          <span v-if="!sidebarCollapsed">{{ isLoggingOut ? 'Cerrando...' : 'Cerrar sesión' }}</span>
        </button>
      </div>
    </aside>
    
    <!-- Main Content Area -->
    <div class="user-content bg-light" :class="{ 'expanded': sidebarCollapsed && !isMobile }">
      <!-- Header -->
      <header class="user-header bg-white shadow-sm d-flex align-items-center px-4 py-3">
        <button 
          class="btn btn-sm btn-light d-lg-none me-3"
          @click="toggleSidebar"
          :title="sidebarCollapsed ? 'Abrir menú' : 'Cerrar menú'"
        >
          <i class="bi bi-list"></i>
        </button>
        
        <h1 class="h5 m-0 text-primary d-none d-sm-block">{{ getPageTitle() }}</h1>
        
        <div class="ms-auto d-flex align-items-center">
          <!-- Notifications Dropdown -->
          <div class="dropdown me-3">
            <button 
              class="btn btn-light position-relative" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              title="Notificaciones"
            >
              <i class="bi bi-bell"></i>
              <span 
                v-if="unreadNotifications > 0"
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ unreadNotifications > 99 ? '99+' : unreadNotifications }}
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end notification-dropdown">
              <li><h6 class="dropdown-header">Notificaciones</h6></li>
              <li v-if="notifications.length === 0">
                <span class="dropdown-item text-muted">No hay notificaciones</span>
              </li>
              <li v-for="(notification, index) in notifications" :key="index">
                <a 
                  class="dropdown-item notification-item" 
                  href="#"
                  :class="{ 'unread': !notification.read }"
                  @click.prevent="markNotificationAsRead(index)"
                >
                  <div class="d-flex align-items-start">
                    <i :class="getNotificationIcon(notification.type)" class="me-2 mt-1"></i>
                    <div class="flex-grow-1">
                      <div class="notification-message">{{ notification.message }}</div>
                      <div class="text-muted small">{{ formatNotificationTime(notification.time) }}</div>
                    </div>
                  </div>
                </a>
              </li>
              <li v-if="notifications.length > 0"><hr class="dropdown-divider"></li>
              <li v-if="notifications.length > 0">
                <a class="dropdown-item text-center text-primary" href="#" @click.prevent="clearAllNotifications">
                  Marcar todas como leídas
                </a>
              </li>
            </ul>
          </div>
          
          <!-- Quick Actions -->
          <div class="btn-group me-3">
            <button 
              v-if="canRequestService" 
              class="btn btn-sm btn-outline-success" 
              @click="quickServiceRequest"
              title="Solicitar servicio"
            >
              <i class="bi bi-plus-circle"></i>
              <span class="d-none d-md-inline ms-1">Servicio</span>
            </button>
            <button 
              class="btn btn-sm btn-outline-info" 
              @click="quickSupport"
              title="Ayuda rápida"
            >
              <i class="bi bi-question-circle"></i>
              <span class="d-none d-md-inline ms-1">Ayuda</span>
            </button>
          </div>
          
          <!-- User menu (simplified) -->
          <div class="dropdown">
            <button class="btn btn-light d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
              <img 
                :src="auth.user?.avatar || '/images/avatar-placeholder.png'" 
                alt="Avatar de usuario" 
                class="avatar-sm rounded-circle me-2"
                @error="handleAvatarError"
              >
              <span class="d-none d-md-inline">{{ displayName }}</span>
              <i class="bi bi-chevron-down ms-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">{{ displayName }}</h6></li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'user.profile' }">
                  <i class="bi bi-person me-2"></i> Mi perfil
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'user.reservation' }">
                  <i class="bi bi-calendar-check me-2"></i> Mi reserva
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="handleLogout">
                  <i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
      
      <!-- Main Content -->
      <main class="user-main p-4">
        <router-view></router-view>
      </main>
      
      <!-- Footer -->
      <footer class="user-footer bg-white px-4 py-3 text-center text-muted small">
        <div class="row">
          <div class="col-md-6 text-md-start">
            &copy; {{ currentYear }} Hotel App. Todos los derechos reservados.
          </div>
          <div class="col-md-6 text-md-end">
            <a href="#" class="text-muted me-3">Política de privacidad</a>
            <a href="#" class="text-muted">Términos y condiciones</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Store and router setup
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

// State
const sidebarCollapsed = ref(false);
const isMobile = ref(false);
const isLoggingOut = ref(false);
const pendingOrders = ref(2); // Mock data

// Mock current reservation
const currentReservation = ref({
  id: 1001,
  roomNumber: '205',
  checkIn: '2025-06-12',
  checkOut: '2025-06-15',
  status: 'checkedin'
});

// Mock notifications
const notifications = ref([
  {
    type: 'service',
    message: 'Tu pedido de cafetería está listo para recoger',
    time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false
  },
  {
    type: 'room',
    message: 'Servicio de limpieza completado en tu habitación',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false
  },
  {
    type: 'info',
    message: 'Recuerda que el check-out es a las 12:00 PM',
    time: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    read: true
  }
]);

// Computed properties
const displayName = computed(() => {
  return auth.user?.firstName || auth.user?.name || 'Usuario';
});

const currentYear = computed(() => {
  return new Date().getFullYear();
});

const hasActiveReservation = computed(() => {
  return currentReservation.value && ['confirmed', 'checkedin'].includes(currentReservation.value.status);
});

const canRequestService = computed(() => {
  return hasActiveReservation.value && currentReservation.value.status === 'checkedin';
});

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

// Methods
function initializeSidebar() {
  const savedState = localStorage.getItem('userSidebarCollapsed');
  const windowWidth = window.innerWidth;
  
  isMobile.value = windowWidth < 992;
  
  if (isMobile.value) {
    sidebarCollapsed.value = true;
  } else {
    sidebarCollapsed.value = savedState === 'true';
  }
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  
  if (!isMobile.value) {
    localStorage.setItem('userSidebarCollapsed', sidebarCollapsed.value.toString());
  }
}

function closeSidebar() {
  if (isMobile.value) {
    sidebarCollapsed.value = true;
  }
}

function handleNavClick() {
  if (isMobile.value) {
    closeSidebar();
  }
}

function isActive(routeName) {
  if (route.name === routeName) return true;
  if (routeName === 'user.dashboard') return false;
  
  return route.name?.startsWith(routeName);
}

function getPageTitle() {
  const titles = {
    'user.dashboard': 'Dashboard',
    'user.reservation': 'Mi Reserva',
    'user.room': 'Mi Habitación',
    'user.services': 'Servicios',
    'user.orders': 'Mis Pedidos',
    'user.profile': 'Mi Perfil',
    'user.support': 'Ayuda y Soporte'
  };
  
  return titles[route.name] || 'Mi Panel';
}

function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
}

function getReservationStatusClass(status) {
  const classes = {
    'confirmed': 'bg-success',
    'checkedin': 'bg-primary',
    'pending': 'bg-warning text-dark'
  };
  
  return classes[status] || 'bg-secondary';
}

function getReservationStatusLabel(status) {
  const labels = {
    'confirmed': 'Confirmada',
    'checkedin': 'En habitación',
    'pending': 'Pendiente'
  };
  
  return labels[status] || status;
}

function getNotificationIcon(type) {
  const icons = {
    'service': 'bi bi-shop text-success',
    'room': 'bi bi-door-open text-primary',
    'info': 'bi bi-info-circle text-info',
    'warning': 'bi bi-exclamation-triangle text-warning',
    'success': 'bi bi-check-circle text-success'
  };
  
  return icons[type] || 'bi bi-bell text-secondary';
}

function formatNotificationTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} horas`;
  
  return date.toLocaleDateString('es-ES');
}

function markNotificationAsRead(index) {
  notifications.value[index].read = true;
}

function clearAllNotifications() {
  notifications.value.forEach(notification => {
    notification.read = true;
  });
}

function quickServiceRequest() {
  router.push({ name: 'user.services' });
}

function quickSupport() {
  router.push({ name: 'user.support' });
}

function requestConcierge() {
  // Mock concierge request
  alert('Solicitud enviada al conserje. Te contactaremos en breve.');
}

function handleAvatarError(event) {
  event.target.src = '/images/avatar-placeholder.png';
}

async function handleLogout() {
  if (isLoggingOut.value) return;
  
  try {
    isLoggingOut.value = true;
    await auth.logout();
    router.push({ name: 'login' });
  } catch (error) {
    console.error('Error durante el cierre de sesión:', error);
  } finally {
    isLoggingOut.value = false;
  }
}

function handleResize() {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < 992;
  
  if (wasMobile !== isMobile.value) {
    if (isMobile.value) {
      sidebarCollapsed.value = true;
    } else {
      const savedState = localStorage.getItem('userSidebarCollapsed');
      sidebarCollapsed.value = savedState === 'true';
    }
  }
}

function checkUserAccess() {
  if (!auth.user) {
    router.push({ name: 'login' });
    return;
  }
}

// Lifecycle hooks
onMounted(() => {
  //checkUserAccess();
  initializeSidebar();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// Watch for auth changes
/*watch(() => auth.user, (newUser) => {
  if (!newUser) {
    router.push({ name: 'login' });
  }
}, { immediate: true });*/
</script>

<style scoped>
/* User Layout styles - Similar to admin but with user-friendly colors */
.user-layout {
  min-height: 100vh;
  position: relative;
}

/* Overlay para mobile */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Sidebar styles */
.user-sidebar {
  width: 300px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid #e9ecef;
}

.user-sidebar.collapsed {
  width: 70px;
}

.user-profile {
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.current-reservation .card {
  border-width: 2px;
}

.user-sidebar .nav-link {
  color: #495057;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  white-space: nowrap;
  font-weight: 500;
}

.user-sidebar .nav-link:hover:not(.active) {
  background-color: #e3f2fd;
  color: #1976d2;
  transform: translateX(2px);
}

.user-sidebar .nav-link.active {
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.15);
}

.nav-divider {
  margin: 0.5rem 0;
}

.sidebar-toggle {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.sidebar-toggle:hover {
  background-color: #e9ecef;
}

/* Content area styles */
.user-content {
  flex-grow: 1;
  margin-left: 300px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-content.expanded {
  margin-left: 70px;
}

.user-header {
  height: 70px;
  border-bottom: 1px solid #dee2e6;
}

.user-main {
  flex: 1;
  min-height: 0;
}

.user-footer {
  margin-top: auto;
  border-top: 1px solid #dee2e6;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  object-fit: cover;
}

/* Notification styles */
.notification-dropdown {
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 0.75rem 1rem;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.notification-item.unread {
  background-color: #f0f8ff;
  border-left-color: #0d6efd;
}

.notification-item:hover {
  background-color: #e9ecef;
}

.notification-message {
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .user-sidebar {
    transform: translateX(-100%);
    width: 300px;
  }
  
  .user-sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .user-content {
    margin-left: 0;
  }
  
  .user-content.expanded {
    margin-left: 0;
  }
}

@media (max-width: 768px) {
  .user-header {
    padding: 0.75rem 1rem;
    height: 60px;
  }
  
  .user-main {
    padding: 1rem;
  }
  
  .notification-dropdown {
    width: 300px;
  }
  
  .user-footer .row {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }
}

@media (max-width: 576px) {
  .user-sidebar {
    width: 280px;
  }
  
  .user-profile {
    padding: 1rem;
  }
  
  .btn-group {
    flex-direction: column;
    width: auto;
  }
  
  .btn-group .btn {
    margin-bottom: 0.25rem;
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .user-sidebar,
  .user-content,
  .nav-link,
  .sidebar-toggle,
  .notification-item {
    transition: none;
  }
}

/* Focus states para accesibilidad */
.nav-link:focus,
.sidebar-toggle:focus,
.btn:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}
</style>