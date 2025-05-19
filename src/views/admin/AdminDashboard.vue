<template>
    <div class="admin-dashboard">
      <!-- Admin Sidebar and Header -->
      <div class="admin-sidebar bg-dark" :class="{ 'collapsed': sidebarCollapsed }">
        <div class="sidebar-header p-3 d-flex align-items-center justify-content-between">
          <div class="d-flex align-items-center">
            <!--<img src="/images/logo-white.png" alt="Logo" class="sidebar-logo me-2" v-if="!sidebarCollapsed">
            <img src="/images/logo-icon-white.png" alt="Logo" class="sidebar-icon" v-else>-->
          </div>
          <button 
            class="btn btn-link text-white p-0 sidebar-toggle" 
            @click="toggleSidebar"
          >
            <i class="bi" :class="sidebarCollapsed ? 'bi-chevron-right' : 'bi-chevron-left'"></i>
          </button>
        </div>
        
        <div class="sidebar-menu p-2">
          <ul class="nav flex-column">
            <li class="nav-item">
              <router-link 
                :to="{ name: 'admin.dashboard' }" 
                class="nav-link px-3 py-2 text-white" 
                :class="{ 'active': isActive('admin.dashboard') }"
              >
                <i class="bi bi-speedometer2 me-3"></i>
                <span v-if="!sidebarCollapsed">Dashboard</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                :to="{ name: 'admin.reservations' }" 
                class="nav-link px-3 py-2 text-white" 
                :class="{ 'active': isActive('admin.reservations') }"
              >
                <i class="bi bi-calendar-check me-3"></i>
                <span v-if="!sidebarCollapsed">Reservas</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                :to="{ name: 'admin.rooms' }" 
                class="nav-link px-3 py-2 text-white" 
                :class="{ 'active': isActive('admin.rooms') }"
              >
                <i class="bi bi-door-open me-3"></i>
                <span v-if="!sidebarCollapsed">Habitaciones</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                :to="{ name: 'admin.users' }" 
                class="nav-link px-3 py-2 text-white" 
                :class="{ 'active': isActive('admin.users') }"
              >
                <i class="bi bi-people me-3"></i>
                <span v-if="!sidebarCollapsed">Usuarios</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link 
                :to="{ name: 'admin.settings' }" 
                class="nav-link px-3 py-2 text-white" 
                :class="{ 'active': isActive('admin.settings') }"
              >
                <i class="bi bi-gear me-3"></i>
                <span v-if="!sidebarCollapsed">Configuración</span>
              </router-link>
            </li>
          </ul>
        </div>
        
        <div class="sidebar-footer mt-auto p-3">
          <div class="user-info d-flex align-items-center">
            <div class="user-avatar">
              <img :src="userAvatar" alt="User" class="rounded-circle">
            </div>
            <div class="user-details ms-2" v-if="!sidebarCollapsed">
              <div class="user-name text-white fw-semibold">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</div>
              <div class="user-role text-white-50 small">Administrador</div>
            </div>
            <div class="ms-auto">
              <button class="btn btn-link text-white p-0" @click="logout">
                <i class="bi bi-box-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content Area -->
      <div class="admin-content" :class="{ 'expanded': sidebarCollapsed }">
        <!-- Header -->
        <header class="admin-header bg-white shadow-sm d-flex align-items-center px-4 py-3">
          <h1 class="h5 m-0 text-primary">{{ pageTitle }}</h1>
          
          <div class="ms-auto d-flex align-items-center">
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
            
            <div class="dropdown">
              <button class="btn btn-light d-flex align-items-center" data-bs-toggle="dropdown" aria-expanded="false">
                <img :src="userAvatar" alt="User" class="avatar-sm rounded-circle me-2">
                <span>{{ auth.user?.firstName }}</span>
                <i class="bi bi-chevron-down ms-2"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><h6 class="dropdown-header">Hola, {{ auth.user?.firstName }}!</h6></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-person me-2"></i> Mi perfil</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i> Configuración</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" @click.prevent="logout"><i class="bi bi-box-arrow-right me-2"></i> Cerrar sesión</a></li>
              </ul>
            </div>
          </div>
        </header>
        
        <!-- Breadcrumb -->
        <div class="admin-breadcrumb bg-light px-4 py-2">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 small">
              <li class="breadcrumb-item"><router-link :to="{ name: 'admin.dashboard' }">Dashboard</router-link></li>
              <li v-for="(crumb, index) in breadcrumbs" :key="index" 
                  class="breadcrumb-item" :class="{ 'active': index === breadcrumbs.length - 1 }">
                <router-link v-if="index < breadcrumbs.length - 1" :to="crumb.path">{{ crumb.name }}</router-link>
                <span v-else>{{ crumb.name }}</span>
              </li>
            </ol>
          </nav>
        </div>
        
        <!-- Main Content -->
        <main class="admin-main p-4">
          <router-view></router-view>
        </main>
        
        <!-- Footer -->
        <footer class="admin-footer bg-light px-4 py-3 text-center text-muted small">
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
const sidebarCollapsed = ref(localStorage.getItem('adminSidebarCollapsed') === 'true');
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
const pageTitle = computed(() => {
  // Map route names to page titles
  const titles = {
    'admin.dashboard': 'Dashboard',
    'admin.reservations': 'Gestión de Reservas',
    'admin.rooms': 'Gestión de Habitaciones',
    'admin.rooms.create': 'Nueva Habitación',
    'admin.rooms.edit': 'Editar Habitación',
    'admin.users': 'Gestión de Usuarios',
    'admin.users.create': 'Nuevo Usuario',
    'admin.users.edit': 'Editar Usuario',
    'admin.settings': 'Configuración'
  };
  
  return titles[route.name] || 'Panel de Administración';
});

const breadcrumbs = computed(() => {
  // Generate breadcrumb items based on current route
  const crumbs = [];
  
  if (route.name === 'admin.dashboard') {
    return crumbs;
  }
  
  if (route.name?.startsWith('admin.reservations')) {
    crumbs.push({ name: 'Reservas', path: { name: 'admin.reservations' } });
    
    if (route.name === 'admin.reservations.view') {
      crumbs.push({ name: `Reserva #${route.params.id}`, path: '#' });
    }
  }
  
  else if (route.name?.startsWith('admin.rooms')) {
    crumbs.push({ name: 'Habitaciones', path: { name: 'admin.rooms' } });
    
    if (route.name === 'admin.rooms.create') {
      crumbs.push({ name: 'Nueva Habitación', path: '#' });
    } 
    else if (route.name === 'admin.rooms.edit') {
      crumbs.push({ name: `Editar Habitación #${route.params.id}`, path: '#' });
    }
    else if (route.name === 'admin.rooms.view') {
      crumbs.push({ name: `Habitación #${route.params.id}`, path: '#' });
    }
  }
  
  else if (route.name?.startsWith('admin.users')) {
    crumbs.push({ name: 'Usuarios', path: { name: 'admin.users' } });
    
    if (route.name === 'admin.users.create') {
      crumbs.push({ name: 'Nuevo Usuario', path: '#' });
    } 
    else if (route.name === 'admin.users.edit') {
      crumbs.push({ name: `Editar Usuario #${route.params.id}`, path: '#' });
    }
  }
  
  else if (route.name === 'admin.settings') {
    crumbs.push({ name: 'Configuración', path: '#' });
  }
  
  return crumbs;
});

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

// Lifecycle hooks
onMounted(() => {
  // Check if user has admin role
  /*if (!auth.isAdmin) {
    router.push({ name: 'home' });
  }*/
});
</script>

<style scoped>
/* Admin Dashboard Layout */
.admin-dashboard {
  display: flex;
  min-height: 100vh;
}

/* Sidebar styles */
.admin-sidebar {
  width: 250px;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000;
  transition: width 0.3s ease;
}

.admin-sidebar.collapsed {
  width: 70px;
}

.sidebar-logo {
  height: 36px;
}

.sidebar-icon {
  height: 30px;
}

.sidebar-toggle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-menu .nav-link {
  border-radius: 4px;
  transition: all 0.2s ease;
}

.sidebar-menu .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.sidebar-menu .nav-link.active {
  background-color: #0d6efd;
}

.user-avatar img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

/* Content area styles */
.admin-content {
  flex-grow: 1;
  margin-left: 250px;
  transition: margin-left 0.3s ease;
}

.admin-content.expanded {
  margin-left: 70px;
}

.admin-header {
  height: 60px;
}

.admin-main {
  min-height: calc(100vh - 60px - 40px - 46px);
}

.avatar-sm {
  width: 30px;
  height: 30px;
  object-fit: cover;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .admin-sidebar {
    width: 70px;
  }
  
  .admin-sidebar.collapsed {
    width: 0;
    overflow: hidden;
  }
  
  .admin-content {
    margin-left: 70px;
  }
  
  .admin-content.expanded {
    margin-left: 0;
  }
}
</style>