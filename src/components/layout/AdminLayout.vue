<!-- src/components/layout/AdminLayout.vue -->
<template>
  <div class="admin-layout d-flex">
    <!-- Sidebar -->
    <aside 
      class="admin-sidebar bg-white shadow-lg" 
      :class="{ 'collapsed': sidebarCollapsed }"
    >
      <!-- Sidebar Header -->
      <div class="sidebar-header p-4 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <!--<img src="/images/logo.png" alt="Logo" class="logo me-2" height="36" v-if="!sidebarCollapsed">-->
          <span class="h5 text-primary mb-0 fw-bold" v-if="!sidebarCollapsed">Panel Admin</span>
          <!--<img src="/images/logo-icon.png" alt="Logo" height="28" v-else>-->
        </div>
        <button 
          class="btn btn-sm btn-outline-secondary border-0 sidebar-toggle" 
          @click="toggleSidebar"
          title="Colapsar menú"
        >
          <i class="bi" :class="sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
        </button>
      </div>
      
      <!-- Sidebar Navigation -->
      <nav class="sidebar-menu p-4">
        <ul class="nav flex-column">
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.dashboard' }" 
              class="nav-link px-3 py-2 rounded-3" 
              :class="{ 'active bg-primary text-white': isActive('admin.dashboard') }"
            >
              <i class="bi bi-speedometer2 me-3"></i>
              <span v-if="!sidebarCollapsed">Dashboard</span>
            </router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.reservations' }" 
              class="nav-link px-3 py-2 rounded-3" 
              :class="{ 'active bg-primary text-white': isActive('admin.reservations') }"
            >
              <i class="bi bi-calendar-check me-3"></i>
              <span v-if="!sidebarCollapsed">Reservas</span>
            </router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.rooms' }" 
              class="nav-link px-3 py-2 rounded-3" 
              :class="{ 'active bg-primary text-white': isActive('admin.rooms') }"
            >
              <i class="bi bi-door-open me-3"></i>
              <span v-if="!sidebarCollapsed">Habitaciones</span>
            </router-link>
          </li>
          <!--<li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.users' }" 
              class="nav-link px-3 py-2 rounded-3" 
              :class="{ 'active bg-primary text-white': isActive('admin.users') }"
            >
              <i class="bi bi-people me-3"></i>
              <span v-if="!sidebarCollapsed">Usuarios</span>
            </router-link>
          </li>
          <li class="nav-item mb-2">
            <router-link 
              :to="{ name: 'admin.settings' }" 
              class="nav-link px-3 py-2 rounded-3" 
              :class="{ 'active bg-primary text-white': isActive('admin.settings') }"
            >
              <i class="bi bi-gear me-3"></i>
              <span v-if="!sidebarCollapsed">Ajustes</span>
            </router-link>
          </li>-->
        </ul>
      </nav>
      
      <!-- Sidebar Footer with Logout -->
      <div class="sidebar-footer mt-auto p-4">
        <button 
          class="btn btn-primary w-100 d-flex align-items-center justify-content-center" 
          @click="logout"
        >
          <i class="bi bi-box-arrow-right me-2"></i>
          <span v-if="!sidebarCollapsed">Cerrar sesión</span>
        </button>
      </div>
    </aside>
    
    <!-- Main Content Area -->
    <div class="admin-content bg-light" :class="{ 'expanded': sidebarCollapsed }">
      <!-- Header -->
      <header class="admin-header bg-white shadow-sm d-flex align-items-center px-4 py-3">
        <button 
          class="btn btn-sm btn-light d-md-none me-3"
          @click="toggleSidebar"
        >
          <i class="bi bi-list"></i>
        </button>
        
        <h1 class="h5 m-0 text-primary d-none d-sm-block">Panel de Administración</h1>
        
        <div class="ms-auto d-flex align-items-center">
          <!-- Notifications Dropdown -->
          <div class="dropdown me-3">
            <button class="btn btn-light position-relative" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="bi bi-bell"></i>
              <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ unreadNotifications }}
              </span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">Notificaciones</h6></li>
              <li v-if="notifications.length === 0">
                <span class="dropdown-item text-muted">No hay notificaciones</span>
              </li>
              <li v-for="(notification, index) in notifications" :key="index">
                <a class="dropdown-item" href="#">
                  <div class="d-flex align-items-center">
                    <i :class="getNotificationIcon(notification.type)" class="me-2"></i>
                    <div>
                      <div>{{ notification.message }}</div>
                      <div class="text-muted small">{{ formatNotificationTime(notification.time) }}</div>
                    </div>
                  </div>
                </a>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item text-center" href="#">Ver todas</a></li>
            </ul>
          </div>
          
          <!-- User dropdown -->
          <div class="dropdown">
            <button class="btn btn-light d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
              <img :src="userAvatar" alt="User" class="avatar-sm rounded-circle me-2">
              <span>{{ auth.user?.firstName || 'Admin' }}</span>
              <i class="bi bi-chevron-down ms-2"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><h6 class="dropdown-header">Hola, {{ auth.user?.firstName || 'Admin' }}!</h6></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i> Mi perfil</a></li>
              <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i> Configuración</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" @click.prevent="logout"><i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión</a></li>
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
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Store and router setup
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();

// State
const sidebarCollapsed = ref(localStorage.getItem('adminSidebarCollapsed') === 'true' || window.innerWidth < 992);
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

const currentYear = computed(() => {
  return new Date().getFullYear();
});

// Methods
function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  localStorage.setItem('adminSidebarCollapsed', sidebarCollapsed.value);
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

async function logout() {
  try {
    await auth.logout();
    router.push({ name: 'login' });
  } catch (error) {
    console.error('Error during logout:', error);
  }
}

// Handle resize events for responsive sidebar
function handleResize() {
  if (window.innerWidth < 992 && !sidebarCollapsed.value) {
    sidebarCollapsed.value = true;
    localStorage.setItem('adminSidebarCollapsed', 'true');
  }
}

// Lifecycle hooks
onMounted(() => {
  // Check if user has admin role
  if (!auth.isAdmin) {
    router.push({ name: 'home' });
  }
  
  // Add resize event listener
  window.addEventListener('resize', handleResize);
  
  // Clean up event listener on unmount
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>

<style scoped>
/* Admin Layout styles */
.admin-layout {
  min-height: 100vh;
  position: relative;
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
  transition: all 0.3s ease;
}

.admin-sidebar.collapsed {
  width: 70px;
}

.admin-sidebar .nav-link {
  color: #495057;
  transition: all 0.2s ease;
}

.admin-sidebar .nav-link:hover:not(.active) {
  background-color: #e9ecef;
  color: #0d6efd;
}

.sidebar-toggle {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Content area styles */
.admin-content {
  flex-grow: 1;
  margin-left: 280px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s ease;
}

.admin-content.expanded {
  margin-left: 70px;
}

.admin-header {
  height: 60px;
}

.admin-main {
  flex: 1;
  min-height: 0;
}

.admin-footer {
  margin-top: auto;
}

.avatar-sm {
  width: 30px;
  height: 30px;
  object-fit: cover;
}

/* Responsive adjustments */
@media (max-width: 991.98px) {
  .admin-sidebar {
    transform: translateX(-100%);
    width: 280px;
  }
  
  .admin-sidebar.collapsed {
    transform: translateX(0);
    width: 280px;
  }
  
  .admin-content {
    margin-left: 0;
  }
  
  .admin-content.expanded {
    margin-left: 0;
  }
}
</style>