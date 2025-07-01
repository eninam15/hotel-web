<template>
  <div class="reports-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-0">Reportes del Sistema</h1>
        <p class="text-muted">Genera reportes detallados en formato PDF</p>
      </div>
      <div class="d-flex gap-2">
        <button 
          class="btn btn-outline-primary" 
          @click="refreshData"
          :disabled="isLoading"
        >
          <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': isLoading }"></i> 
          {{ isLoading ? 'Actualizando...' : 'Actualizar Datos' }}
        </button>
      </div>
    </div>

    <!-- Cards de resumen -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card border-0 bg-primary bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-door-closed text-primary fs-1"></i>
            <h4 class="mt-2 mb-0 text-primary">{{ stats.totalRooms }}</h4>
            <small class="text-muted">Total Habitaciones</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-success bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-calendar-check text-success fs-1"></i>
            <h4 class="mt-2 mb-0 text-success">{{ stats.totalReservations }}</h4>
            <small class="text-muted">Total Reservas</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-info bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-people text-info fs-1"></i>
            <h4 class="mt-2 mb-0 text-info">{{ stats.totalUsers }}</h4>
            <small class="text-muted">Total Usuarios</small>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card border-0 bg-warning bg-opacity-10">
          <div class="card-body text-center">
            <i class="bi bi-currency-euro text-warning fs-1"></i>
            <h4 class="mt-2 mb-0 text-warning">{{ formatPrice(stats.totalRevenue) }}</h4>
            <small class="text-muted">Ingresos Totales</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros de fecha -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Filtros de Reporte</h5>
        <div class="row g-3">
          <div class="col-md-3">
            <label for="startDate" class="form-label">Fecha Inicio</label>
            <input 
              type="date" 
              id="startDate" 
              v-model="filters.startDate" 
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label for="endDate" class="form-label">Fecha Fin</label>
            <input 
              type="date" 
              id="endDate" 
              v-model="filters.endDate" 
              class="form-control"
            >
          </div>
          <div class="col-md-3">
            <label for="roomStatus" class="form-label">Estado Habitaciones</label>
            <select 
              id="roomStatus" 
              v-model="filters.roomStatus" 
              class="form-select"
            >
              <option value="">Todos los estados</option>
              <option value="available">Disponibles</option>
              <option value="occupied">Ocupadas</option>
              <option value="maintenance">Mantenimiento</option>
              <option value="cleaning">Limpieza</option>
            </select>
          </div>
          <div class="col-md-3">
            <label for="reservationStatus" class="form-label">Estado Reservas</label>
            <select 
              id="reservationStatus" 
              v-model="filters.reservationStatus" 
              class="form-select"
            >
              <option value="">Todos los estados</option>
              <option value="confirmada">Confirmadas</option>
              <option value="pendiente">Pendientes</option>
              <option value="cancelada">Canceladas</option>
              <option value="completada">Completadas</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Opciones de reportes -->
    <div class="row">
      <!-- Reporte de Habitaciones -->
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="bg-primary bg-opacity-10 p-3 rounded me-3">
                <i class="bi bi-door-closed text-primary fs-4"></i>
              </div>
              <div>
                <h5 class="card-title mb-0">Reporte de Habitaciones</h5>
                <small class="text-muted">{{ filteredRooms.length }} habitaciones</small>
              </div>
            </div>
            <p class="card-text">
              Genera un reporte detallado de todas las habitaciones, incluyendo estado, 
              capacidad, precios y características.
            </p>
            <div class="mt-auto">
              <button 
                class="btn btn-primary w-100" 
                @click="generateRoomsReport"
                :disabled="isGeneratingReport || filteredRooms.length === 0"
              >
                <i class="bi bi-file-earmark-pdf me-1"></i>
                {{ isGeneratingReport ? 'Generando...' : 'Generar PDF' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reporte de Reservas -->
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="bg-success bg-opacity-10 p-3 rounded me-3">
                <i class="bi bi-calendar-check text-success fs-4"></i>
              </div>
              <div>
                <h5 class="card-title mb-0">Reporte de Reservas</h5>
                <small class="text-muted">{{ filteredReservations.length }} reservas</small>
              </div>
            </div>
            <p class="card-text">
              Reporte completo de reservas con fechas, huéspedes, habitaciones 
              asignadas e ingresos generados.
            </p>
            <div class="mt-auto">
              <button 
                class="btn btn-success w-100" 
                @click="generateReservationsReport"
                :disabled="isGeneratingReport || filteredReservations.length === 0"
              >
                <i class="bi bi-file-earmark-pdf me-1"></i>
                {{ isGeneratingReport ? 'Generando...' : 'Generar PDF' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reporte de Usuarios -->
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="bg-info bg-opacity-10 p-3 rounded me-3">
                <i class="bi bi-people text-info fs-4"></i>
              </div>
              <div>
                <h5 class="card-title mb-0">Reporte de Usuarios</h5>
                <small class="text-muted">{{ users.length }} usuarios</small>
              </div>
            </div>
            <p class="card-text">
              Lista detallada de usuarios registrados en el sistema con 
              información de contacto y estadísticas.
            </p>
            <div class="mt-auto">
              <button 
                class="btn btn-info w-100" 
                @click="generateUsersReport"
                :disabled="isGeneratingReport || users.length === 0"
              >
                <i class="bi bi-file-earmark-pdf me-1"></i>
                {{ isGeneratingReport ? 'Generando...' : 'Generar PDF' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reporte Completo -->
    <div class="card">
      <div class="card-body">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h5 class="card-title mb-1">Reporte Completo del Sistema</h5>
            <p class="card-text text-muted mb-0">
              Genera un reporte integral que incluye habitaciones, reservas y usuarios 
              con análisis estadísticos completos.
            </p>
          </div>
          <div class="col-md-4 text-end">
            <button 
              class="btn btn-outline-primary btn-lg" 
              @click="generateCompleteReport"
              :disabled="isGeneratingReport"
            >
              <i class="bi bi-file-earmark-pdf me-2"></i>
              {{ isGeneratingReport ? 'Generando Reporte...' : 'Reporte Completo' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de progreso -->
    <div v-if="isGeneratingReport" class="modal d-block" style="background: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center p-4">
            <div class="spinner-border text-primary mb-3" role="status">
              <span class="visually-hidden">Generando...</span>
            </div>
            <h5>Generando Reporte PDF</h5>
            <p class="text-muted mb-0">Por favor espera mientras se procesa la información...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Importa tus servicios reales
import { habitacionService } from '@/services/habitacionService';
import { reservaService } from '@/services/reservaService';
// Cuando tengas el servicio de usuarios, lo importarás aquí
// import { usuarioService } from '@/services/usuarioService';

// --- ESTADO ---
const isLoading = ref(false);
const isGeneratingReport = ref(false);
const rooms = ref([]);
const reservations = ref([]);
const users = ref([]); // Se mantendrán los datos de ejemplo por ahora

// --- FILTROS ---
const filters = ref({
  startDate: '',
  endDate: '',
  roomStatus: '',
  reservationStatus: ''
});

// --- PROPIEDADES COMPUTADAS ---
const stats = computed(() => ({
  totalRooms: rooms.value.length,
  totalReservations: reservations.value.length,
  totalUsers: users.value.length,
  // Asegúrate que el campo sea 'precio_total' como en tu API de reservas
  totalRevenue: reservations.value.reduce((sum, r) => sum + parseFloat(r.precio_total || 0), 0)
}));

const filteredRooms = computed(() => {
  let result = [...rooms.value];
  if (filters.value.roomStatus) {
    result = result.filter(r => r.status === filters.value.roomStatus);
  }
  return result;
});

const filteredReservations = computed(() => {
  let result = [...reservations.value];
  // Asegúrate que el campo sea 'fec_checkin' y 'fec_checkout' como en tu API
  if (filters.value.startDate) {
    result = result.filter(r => r.fec_checkin >= filters.value.startDate);
  }
  if (filters.value.endDate) {
    result = result.filter(r => r.fec_checkout <= filters.value.endDate);
  }
  if (filters.value.reservationStatus) {
    // Asegúrate que el campo sea 'estado' como en tu API
    result = result.filter(r => r.estado === filters.value.reservationStatus);
  }
  return result;
});

// --- MÉTODOS ---

// Método para cargar los datos reales desde los servicios
async function refreshData() {
  isLoading.value = true;
  try {
    // Carga los datos reales en paralelo
    const [roomsData, reservationsData] = await Promise.all([
      habitacionService.getAllHabitaciones(),
      reservaService.getAllReservas()
      // Cuando tengas el servicio de usuarios:
      // usuarioService.getAllUsuarios() 
    ]);

    rooms.value = roomsData;
    reservations.value = reservationsData;
    // Datos de ejemplo para usuarios hasta que tengas el servicio
    users.value = [
      { id: 1, name: 'Admin Usuario', email: 'admin@hotel.com', role: 'admin', createdAt: '2024-01-01', lastLogin: '2024-07-01' },
      { id: 2, name: 'Juan Pérez', email: 'juan@email.com', role: 'guest', createdAt: '2024-06-15', lastLogin: '2024-06-30' }
    ];

    // Establecer fechas por defecto en filtros
    if (!filters.value.startDate) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      filters.value.startDate = startOfMonth.toISOString().split('T')[0];
    }
    if (!filters.value.endDate) {
      filters.value.endDate = new Date().toISOString().split('T')[0];
    }
    
  } catch (error) {
    console.error('Error al cargar datos para reportes:', error);
    alert('No se pudieron cargar los datos para los reportes.');
  } finally {
    isLoading.value = false;
  }
}

// --- HELPERS DE FORMATO (iguales a los que ya tienes) ---
function formatPrice(price) {
  // Ajusta la moneda a 'BOB' para consistencia con tu componente de reservas
  return (price || 0).toLocaleString('es-BO', {
    style: 'currency',
    currency: 'BOB'
  });
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getStatusLabel(status, type = 'room') {
  const labels = {
    room: {
      'available': 'Disponible', 'occupied': 'Ocupada', 'maintenance': 'Mantenimiento', 'cleaning': 'Limpieza'
    },
    reservation: {
      'confirmada': 'Confirmada', 'pendiente': 'Pendiente', 'cancelada': 'Cancelada', 'completada': 'Completada'
    }
  };
  return labels[type][status] || status;
}

// --- LÓGICA DE GENERACIÓN DE PDF ---

// Configuración base del PDF (sin cambios)
function setupPDF(title) {
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('Hotel Management System', 14, 22);
  doc.setFontSize(12);
  doc.text(`Reporte: ${title}`, 14, 32);
  doc.text(`Fecha de generación: ${formatDate(new Date())}`, 14, 42);
  return doc;
}

// Generador de reporte de habitaciones
async function generateRoomsReport() {
  isGeneratingReport.value = true;
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const doc = setupPDF('Habitaciones');
    
    const tableData = filteredRooms.value.map(room => [
      room.numero || room.number || 'N/A',
      room.nombre || room.name || 'N/A',
      room.tipo || room.type || 'N/A',
      (room.capacidad || room.capacity || 0).toString(),
      formatPrice(room.precio || room.price || 0),
      getStatusLabel(room.estado || room.status || 'available', 'room')
    ]);
    
    autoTable(doc, {
      head: [['Número', 'Nombre', 'Tipo', 'Capacidad', 'Precio/Noche', 'Estado']],
      body: tableData,
      startY: 55,
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save(`Reporte_Habitaciones_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generando reporte de habitaciones:', error);
    alert('Error al generar el reporte de habitaciones. Revisa la consola para más detalles.');
  } finally {
    isGeneratingReport.value = false;
  }
}

// Generador de reporte de reservas
async function generateReservationsReport() {
  isGeneratingReport.value = true;
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const doc = setupPDF('Reservas');

    // Mapeo de datos ajustado a la estructura de tu API
    const tableData = filteredReservations.value.map(res => [
      res.nro_reserva || 'N/A',
      res.user?.name || res.usuario?.name || 'N/A',
      res.detalles?.[0]?.habitacion?.numero || res.habitacion?.numero || 'N/A',
      formatDate(res.fec_checkin),
      formatDate(res.fec_checkout),
      formatPrice(res.precio_total || 0),
      getStatusLabel(res.estado || 'pendiente', 'reservation')
    ]);
    
    autoTable(doc, {
      head: [['# Reserva', 'Huésped', 'Habitación', 'Check-in', 'Check-out', 'Total', 'Estado']],
      body: tableData,
      startY: 55,
      headStyles: { fillColor: [39, 174, 96] }
    });
    
    doc.save(`Reporte_Reservas_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generando reporte de reservas:', error);
    alert('Error al generar el reporte de reservas. Revisa la consola para más detalles.');
  } finally {
    isGeneratingReport.value = false;
  }
}

// Generador de reporte de usuarios
async function generateUsersReport() {
  isGeneratingReport.value = true;
  await new Promise(resolve => setTimeout(resolve, 100));

  try {
    const doc = setupPDF('Usuarios');
    
    const tableData = users.value.map(user => [
      user.name || user.nombre || 'N/A',
      user.email || 'N/A',
      user.role === 'admin' ? 'Administrador' : 'Huésped',
      formatDate(user.createdAt || user.created_at),
      formatDate(user.lastLogin || user.last_login)
    ]);
    
    autoTable(doc, {
      head: [['Nombre', 'Email', 'Rol', 'Fecha Registro', 'Último Acceso']],
      body: tableData,
      startY: 55,
      headStyles: { fillColor: [52, 152, 219] }
    });
    
    doc.save(`Reporte_Usuarios_${new Date().toISOString().split('T')[0]}.pdf`);
  } catch (error) {
    console.error('Error generando reporte de usuarios:', error);
    alert('Error al generar el reporte de usuarios. Revisa la consola para más detalles.');
  } finally {
    isGeneratingReport.value = false;
  }
}

// Generador de reporte completo
async function generateCompleteReport() {
    isGeneratingReport.value = true;
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        const doc = setupPDF('Completo del Sistema');
        doc.setFontSize(14);

        // Sección de Reservas
        doc.text('Resumen de Reservas', 14, 60);
        const reservationsTableData = filteredReservations.value.slice(0, 15).map(res => [
            res.nro_reserva || 'N/A',
            res.user?.name || res.usuario?.name || 'N/A',
            formatDate(res.fec_checkin),
            formatPrice(res.precio_total || 0),
            getStatusLabel(res.estado || 'pendiente', 'reservation')
        ]);
        
        autoTable(doc, {
            head: [['#', 'Huésped', 'Check-in', 'Total', 'Estado']],
            body: reservationsTableData,
            startY: 65,
            theme: 'striped',
            headStyles: { fillColor: [39, 174, 96] },
            styles: { fontSize: 8 }
        });

        // Sección de Habitaciones
        const finalY = doc.lastAutoTable.finalY + 15;
        doc.text('Resumen de Habitaciones', 14, finalY);
        const roomsTableData = filteredRooms.value.slice(0, 15).map(room => [
            room.numero || room.number || 'N/A',
            room.nombre || room.name || 'N/A',
            formatPrice(room.precio || room.price || 0),
            getStatusLabel(room.estado || room.status || 'available', 'room')
        ]);
        
        autoTable(doc, {
            head: [['Número', 'Nombre', 'Precio', 'Estado']],
            body: roomsTableData,
            startY: finalY + 5,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 8 }
        });

        doc.save(`Reporte_Completo_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch(error) {
        console.error('Error generando reporte completo:', error);
        alert('Error al generar el reporte completo. Revisa la consola para más detalles.');
    } finally {
        isGeneratingReport.value = false;
    }
}

// --- INICIALIZACIÓN ---
onMounted(() => {
  refreshData();
});
</script>

<style scoped>
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.modal {
  z-index: 1050;
}

@media (max-width: 768px) {
  .d-flex.justify-content-between.align-items-center.mb-4 {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .row.align-items-center .col-md-4 {
    text-align: center !important;
    margin-top: 1rem;
  }
}
</style>