<!-- src/views/admin/Dashboard/AdminOverview.vue -->
<template>
    <div class="admin-overview">
      <!-- Page header -->
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="h3 mb-0">Dashboard</h1>
          <p class="text-muted">Bienvenido al panel de administración</p>
        </div>
        <div>
          <div class="btn-group">
            <button class="btn btn-outline-primary" @click="refreshData">
              <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
            </button>
            <button class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
              <i class="bi bi-calendar me-1"></i> {{ dateRangeLabel }}
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#" @click.prevent="setDateRange('today')">Hoy</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="setDateRange('week')">Esta semana</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="setDateRange('month')">Este mes</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="setDateRange('quarter')">Este trimestre</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="setDateRange('year')">Este año</a></li>
            </ul>
          </div>
        </div>
      </div>
  
      <!-- Stats cards row -->
      <div class="row g-4 mb-4">
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="stats-icon bg-primary bg-opacity-10 text-primary rounded p-3 me-3">
                  <i class="bi bi-calendar-check fs-4"></i>
                </div>
                <h6 class="card-title mb-0 text-muted">Reservas</h6>
              </div>
              <h2 class="mb-2">{{ stats.reservations.total }}</h2>
              <div class="d-flex align-items-center">
                <span :class="stats.reservations.trend > 0 ? 'text-success' : 'text-danger'">
                  <i class="bi" :class="stats.reservations.trend > 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                  {{ Math.abs(stats.reservations.trend) }}%
                </span>
                <span class="text-muted ms-2">vs periodo anterior</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="stats-icon bg-success bg-opacity-10 text-success rounded p-3 me-3">
                  <i class="bi bi-currency-euro fs-4"></i>
                </div>
                <h6 class="card-title mb-0 text-muted">Ingresos</h6>
              </div>
              <h2 class="mb-2">{{ formatPrice(stats.revenue.total) }}</h2>
              <div class="d-flex align-items-center">
                <span :class="stats.revenue.trend > 0 ? 'text-success' : 'text-danger'">
                  <i class="bi" :class="stats.revenue.trend > 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                  {{ Math.abs(stats.revenue.trend) }}%
                </span>
                <span class="text-muted ms-2">vs periodo anterior</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="stats-icon bg-info bg-opacity-10 text-info rounded p-3 me-3">
                  <i class="bi bi-people fs-4"></i>
                </div>
                <h6 class="card-title mb-0 text-muted">Huéspedes</h6>
              </div>
              <h2 class="mb-2">{{ stats.guests.total }}</h2>
              <div class="d-flex align-items-center">
                <span :class="stats.guests.trend > 0 ? 'text-success' : 'text-danger'">
                  <i class="bi" :class="stats.guests.trend > 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                  {{ Math.abs(stats.guests.trend) }}%
                </span>
                <span class="text-muted ms-2">vs periodo anterior</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6 col-xl-3">
          <div class="card h-100 border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex align-items-center mb-3">
                <div class="stats-icon bg-warning bg-opacity-10 text-warning rounded p-3 me-3">
                  <i class="bi bi-door-open fs-4"></i>
                </div>
                <h6 class="card-title mb-0 text-muted">Ocupación</h6>
              </div>
              <h2 class="mb-2">{{ stats.occupancy.total }}%</h2>
              <div class="d-flex align-items-center">
                <span :class="stats.occupancy.trend > 0 ? 'text-success' : 'text-danger'">
                  <i class="bi" :class="stats.occupancy.trend > 0 ? 'bi-arrow-up' : 'bi-arrow-down'"></i>
                  {{ Math.abs(stats.occupancy.trend) }}%
                </span>
                <span class="text-muted ms-2">vs periodo anterior</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts row -->
      <div class="row g-4 mb-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title">Ocupación e Ingresos</h5>
            </div>
            <div class="card-body">
              <div class="chart-placeholder bg-light rounded d-flex align-items-center justify-content-center" style="height: 300px;">
                <div class="text-center text-muted">
                  <i class="bi bi-bar-chart-line fs-1 mb-3 d-block"></i>
                  <p class="mb-0">Gráfico de ocupación e ingresos</p>
                  <small>(Implementación pendiente)</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title">Tipos de Habitaciones</h5>
            </div>
            <div class="card-body">
              <div class="chart-placeholder bg-light rounded d-flex align-items-center justify-content-center" style="height: 300px;">
                <div class="text-center text-muted">
                  <i class="bi bi-pie-chart fs-1 mb-3 d-block"></i>
                  <p class="mb-0">Gráfico de tipos de habitaciones</p>
                  <small>(Implementación pendiente)</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Recent bookings table -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
          <h5 class="card-title">Reservas Recientes</h5>
          <router-link :to="{ name: 'admin.reservations' }" class="btn btn-sm btn-outline-primary">
            Ver todas
          </router-link>
        </div>
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>ID</th>
                <th>Huésped</th>
                <th>Habitación</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="booking in recentBookings" :key="booking.id">
                <td>{{ formatBookingId(booking.id) }}</td>
                <td>
                  <div class="d-flex align-items-center">
                    <img 
                      :src="booking.guestAvatar || '/images/avatar-placeholder.png'" 
                      class="rounded-circle me-2" 
                      width="32" 
                      height="32"
                      alt="Guest"
                    >
                    <div>{{ booking.guestName }}</div>
                  </div>
                </td>
                <td>{{ booking.roomNumber }}</td>
                <td>
                  {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="getStatusBadgeClass(booking.status)"
                  >
                    {{ getStatusLabel(booking.status) }}
                  </span>
                </td>
                <td>{{ formatPrice(booking.total) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Quick actions row -->
      <div class="row g-4">
        <div class="col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title">Acciones Rápidas</h5>
            </div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2">
                <router-link :to="{ name: 'admin.reservations.create' }" class="btn btn-outline-primary">
                  <i class="bi bi-calendar-plus me-2"></i>Nueva Reserva
                </router-link>
                <router-link :to="{ name: 'admin.rooms.create' }" class="btn btn-outline-primary">
                  <i class="bi bi-door-open me-2"></i>Nueva Habitación
                </router-link>
                <router-link :to="{ name: 'admin.users.create' }" class="btn btn-outline-primary">
                  <i class="bi bi-person-plus me-2"></i>Nuevo Usuario
                </router-link>
                <button class="btn btn-outline-primary">
                  <i class="bi bi-file-earmark-text me-2"></i>Generar Informe
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="card-title">Notificaciones Recientes</h5>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex align-items-center">
                    <div class="notification-icon me-3 text-primary">
                      <i class="bi bi-calendar-check"></i>
                    </div>
                    <div>
                      <div>Nueva reserva creada</div>
                      <div class="text-muted small">Hace 5 minutos</div>
                    </div>
                  </div>
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex align-items-center">
                    <div class="notification-icon me-3 text-success">
                      <i class="bi bi-person-plus"></i>
                    </div>
                    <div>
                      <div>Nuevo usuario registrado</div>
                      <div class="text-muted small">Hace 2 horas</div>
                    </div>
                  </div>
                </a>
                <a href="#" class="list-group-item list-group-item-action">
                  <div class="d-flex align-items-center">
                    <div class="notification-icon me-3 text-warning">
                      <i class="bi bi-door-open"></i>
                    </div>
                    <div>
                      <div>Habitación 208 lista para limpieza</div>
                      <div class="text-muted small">Hace 3 horas</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div class="card-footer bg-transparent border-0 text-center">
              <a href="#" class="text-decoration-none">Ver todas las notificaciones</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  
  // State
  const dateRange = ref('month');
  const isLoading = ref(false);
  const stats = ref({
    reservations: { total: 245, trend: 12 },
    revenue: { total: 28750, trend: 8 },
    guests: { total: 352, trend: 5 },
    occupancy: { total: 78, trend: -3 }
  });
  
  const recentBookings = ref([
    {
      id: 1001,
      guestName: 'Carlos Rodríguez',
      guestEmail: 'carlos.rodriguez@email.com',
      guestAvatar: '/images/avatar-1.jpg',
      roomNumber: '101',
      checkIn: '2025-06-01',
      checkOut: '2025-06-05',
      total: 356.00,
      status: 'confirmed'
    },
    {
      id: 1002,
      guestName: 'María López',
      guestEmail: 'maria.lopez@email.com',
      guestAvatar: '/images/avatar-2.jpg',
      roomNumber: '205',
      checkIn: '2025-05-25',
      checkOut: '2025-05-28',
      total: 387.00,
      status: 'completed'
    },
    {
      id: 1003,
      guestName: 'Juan Martínez',
      guestEmail: 'juan.martinez@email.com',
      guestAvatar: '/images/avatar-3.jpg',
      roomNumber: '310',
      checkIn: '2025-06-10',
      checkOut: '2025-06-13',
      total: 477.00,
      status: 'pending'
    },
    {
      id: 1004,
      guestName: 'Ana García',
      guestEmail: 'ana.garcia@email.com',
      guestAvatar: '/images/avatar-4.jpg',
      roomNumber: '402',
      checkIn: '2025-05-20',
      checkOut: '2025-05-23',
      total: 657.00,
      status: 'cancelled'
    }
  ]);
  
  // Computed properties
  const dateRangeLabel = computed(() => {
    const labels = {
      'today': 'Hoy',
      'week': 'Esta semana',
      'month': 'Este mes',
      'quarter': 'Este trimestre',
      'year': 'Este año'
    };
    
    return labels[dateRange.value] || 'Periodo';
  });
  
  // Methods
  function refreshData() {
    // In a real app, this would fetch new data based on the selected date range
    isLoading.value = true;
    
    // Simulate API call
    setTimeout(() => {
      // Mock data update
      isLoading.value = false;
      
      // Notify the user
      alert('Datos actualizados correctamente');
    }, 800);
  }
  
  function setDateRange(range) {
    if (dateRange.value === range) return;
    
    dateRange.value = range;
    refreshData();
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }
  
  function formatPrice(price) {
    return price.toLocaleString('es-ES', {
      style: 'currency',
      currency: 'EUR'
    });
  }
  
  function formatBookingId(id) {
    return `RES-${id}`;
  }
  
  function getStatusLabel(status) {
    const statusLabels = {
      'confirmed': 'Confirmada',
      'pending': 'Pendiente',
      'cancelled': 'Cancelada',
      'completed': 'Completada'
    };
    
    return statusLabels[status] || status;
  }
  
  function getStatusBadgeClass(status) {
    const statusClasses = {
      'confirmed': 'bg-success',
      'pending': 'bg-warning text-dark',
      'cancelled': 'bg-danger',
      'completed': 'bg-info'
    };
    
    return statusClasses[status] || 'bg-secondary';
  }
  
  // Lifecycle
  onMounted(() => {
    // Initialize data
    refreshData();
  });
  </script>
  
  <style scoped>
  .card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
  }
  
  .stats-icon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .notification-icon {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .chart-placeholder {
    transition: background-color 0.2s ease;
  }
  
  .chart-placeholder:hover {
    background-color: #f0f0f0;
  }
  </style>