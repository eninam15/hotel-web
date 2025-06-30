<!-- src/components/layout/AdminLayout.vue -->
<template>
  <div class="admin-layout d-flex">
    <!-- Overlay para mobile cuando sidebar está abierto -->
    <div 
      v-if="!sidebarCollapsed && isMobile" 
      class="sidebar-overlay"
      @click="closeSidebar"
    ></div>
    
    <!-- Sidebar -->
    <aside 
      class="admin-sidebar bg-white shadow-lg" 
      :class="{ 
        'collapsed': sidebarCollapsed,
        'mobile-open': !sidebarCollapsed && isMobile
      }"
    >
      <!-- Sidebar Header -->
      <div class="sidebar-header p-4 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <span class="h5 text-primary mb-0 fw-bold" v-if="!sidebarCollapsed">Panel Admin</span>
          <span class="h6 text-primary mb-0 fw-bold" v-else>PA</span>
        </div>
        <button 
          class="btn btn-sm btn-outline-secondary border-0 sidebar-toggle" 
          @click="toggleSidebar"
          :title="sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'"
        >
          <i class="bi" :class="sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        </button>
      </div>
      
      <!-- Sidebar Navigation -->
      <nav class="sidebar-menu px-3 pb-4">
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.dashboard' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('admin.dashboard') }"
              @click="handleNavClick"
            >
              <i class="bi bi-speedometer2" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.reservations' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('admin.reservations') }"
              @click="handleNavClick"
            >
              <i class="bi bi-calendar-check" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Reservas</span>
            </router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.rooms' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('admin.rooms') }"
              @click="handleNavClick"
            >
              <i class="bi bi-door-open" :class="{ 'me-3': !sidebarCollapped }"></i>
              <span v-if="!sidebarCollapsed">Habitaciones</span>
            </router-link>
          </li>
          <!-- Navegación comentada disponible para futuro uso -->
          <!--
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.users' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('admin.users') }"
              @click="handleNavClick"
            >
              <i class="bi bi-people" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Usuarios</span>
            </router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.settings' }" 
              class="nav-link px-3 py-2 rounded-3 d-flex align-items-center" 
              :class="{ 'active bg-primary text-white': isActive('admin.settings') }"
              @click="handleNavClick"
            >
              <i class="bi bi-gear" :class="{ 'me-3': !sidebarCollapsed }"></i>
              <span v-if="!sidebarCollapsed">Ajustes</span>
            </router-link>
          </li>
          -->
        </ul>
      </nav>
      
      <!-- Sidebar Footer with Logout -->
      <div class="sidebar-footer mt-auto p-4">
        <button 
          class="btn btn-primary w-100 d-flex align-items-center justify-content-center" 
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
    <div class="admin-content bg-light" :class="{ 'expanded': sidebarCollapsed && !isMobile }">
      <!-- Header -->
      <header class="admin-header bg-white shadow-sm d-flex align-items-center px-4 py-3">
        <button 
          class="btn btn-sm btn-light d-lg-none me-3"
          @click="toggleSidebar"
          :title="sidebarCollapsed ? 'Abrir menú' : 'Cerrar menú'"
        >
          <i class="bi bi-list"></i>
        </button>
        
        <h1 class="h5 m-0 text-primary d-none d-sm-block">Panel de Administración</h1>
        
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
                  @click.prevent="markAsRead(index)"
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
          
          <!-- User dropdown -->
          <div class="dropdown">
            <!--<button 
              class="btn btn-light d-flex align-items-center" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
            >
              <img 
                :src="userAvatar" 
                alt="Avatar de usuario" 
                class="avatar-sm rounded-circle me-2"
                @error="handleAvatarError"
              >
              <span class="d-none d-md-inline">{{ displayName }}</span>
              <i class="bi bi-chevron-down ms-2"></i>
            </button>-->
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">Hola, {{ displayName }}!</h6></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent>
                  <i class="bi bi-person me-2"></i> Mi perfil
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent>
                  <i class="bi bi-gear me-2"></i> Configuración
                </a>
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
      <main class="admin-main p-4">
        <router-view></router-view>
      </main>
      
      <!-- Footer -->
      <footer class="admin-footer bg-white px-4 py-3 text-center text-muted small">
        &copy; {{ currentYear }} Hotel App. Todos los derechos reservados.
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
const notifications = ref([
  {
    type: 'reservation',
    message: 'Nueva reserva creada - #RE2023056',
    time: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false
  },
  {
    type: 'user',
    message: 'Nuevo usuario registrado - Laura Martínez',
    time: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: false
  },
  {
    type: 'room',
    message: 'Habitación #208 mantenimiento completado',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: true
  }
]);

// Computed properties
const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

const userAvatar = computed(() => {
  return auth.user?.avatar || '/images/avatar-placeholder.png';
});

const displayName = computed(() => {
  return auth.user?.firstName || auth.user?.name || 'Admin';
});

const currentYear = computed(() => {
  return new Date().getFullYear();
});

// Methods
function initializeSidebar() {
  const savedState = localStorage.getItem('adminSidebarCollapsed');
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
    localStorage.setItem('adminSidebarCollapsed', sidebarCollapsed.value.toString());
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
  if (routeName === 'admin.dashboard') return false;
  
  // Check if it's a child route
  return route.name?.startsWith(routeName);
}

function getNotificationIcon(type) {
  const icons = {
    'reservation': 'bi bi-calendar-check text-primary',
    'user': 'bi bi-person text-success',
    'room': 'bi bi-door-open text-warning',
    'system': 'bi bi-gear text-info',
    'alert': 'bi bi-exclamation-triangle text-danger'
  };
  
  return icons[type] || 'bi bi-bell text-secondary';
}

function formatNotificationTime(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000); // difference in seconds
  
  if (diff < 60) return 'hace un momento';
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} horas`;
  
  return date.toLocaleDateString('es-ES');
}

function markAsRead(index) {
  notifications.value[index].read = true;
}

function clearAllNotifications() {
  notifications.value.forEach(notification => {
    notification.read = true;
  });
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
    // Aquí podrías mostrar un mensaje de error al usuario
  } finally {
    isLoggingOut.value = false;
  }
}

// Handle resize events for responsive sidebar
function handleResize() {
  const wasMobile = isMobile.value;
  isMobile.value = window.innerWidth < 992;
  
  // Si cambió de móvil a escritorio o viceversa
  if (wasModal !== isMobile.value) {
    if (isMobile.value) {
      // Cambió a móvil - colapsar sidebar
      sidebarCollapsed.value = true;
    } else {
      // Cambió a escritorio - restaurar estado guardado
      const savedState = localStorage.getItem('adminSidebarCollapsed');
      sidebarCollapsed.value = savedState === 'true';
    }
  }
}

// Check admin permissions
function checkAdminAccess() {
  if (!auth.user) {
    router.push({ name: 'login' });
    return;
  }
  
  if (!auth.isAdmin) {
    router.push({ name: 'home' });
    return;
  }
}

// Lifecycle hooks
onMounted(() => {
  //checkAdminAccess();
  initializeSidebar();
  
  // Add resize event listener
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
/* Admin Layout styles */
.admin-layout {
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
.admin-sidebar {
  width: 280px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-sidebar.collapsed {
  width: 70px;
}

.admin-sidebar .nav-link {
  color: #495057;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  white-space: nowrap;
}

.admin-sidebar .nav-link:hover:not(.active) {
  background-color: #e9ecef;
  color: #0d6efd;
  transform: translateX(2px);
}

.admin-sidebar .nav-link.active {
  box-shadow: 0 2px 4px rgba(13, 110, 253, 0.15);
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
.admin-content {
  flex-grow: 1;
  margin-left: 280px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-content.expanded {
  margin-left: 70px;
}

.admin-header {
  height: 60px;
  border-bottom: 1px solid #dee2e6;
}

.admin-main {
  flex: 1;
  min-height: 0;
}

.admin-footer {
  margin-top: auto;
  border-top: 1px solid #dee2e6;
}

.avatar-sm {
  width: 30px;
  height: 30px;
  object-fit: cover;
}

/* Notification styles */
.notification-dropdown {
  width: 320px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 0.75rem 1rem;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.notification-item.unread {
  background-color: #f8f9fa;
  border-left-color: #0d6efd;
}

.notification-item:hover {
  background-color: #e9ecef;
}

.notification-message {
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Loading spinner */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .admin-sidebar {
    transform: translateX(-100%);
    width: 280px;
  }
  
  .admin-sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .admin-content {
    margin-left: 0;
  }
  
  .admin-content.expanded {
    margin-left: 0;
  }
}

@media (max-width: 575.98px) {
  .admin-header {
    padding: 0.75rem 1rem;
  }
  
  .admin-main {
    padding: 1rem;
  }
  
  .notification-dropdown {
    width: 280px;
  }
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .admin-sidebar,
  .admin-content,
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