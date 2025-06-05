// Exportación centralizada de todos los servicios
export { authService } from './authService.js';
export { hotelService } from './hotelService.js';
export { habitacionService } from './habitacionService.js';
export { reservaService } from './reservaService.js';

// También exportar la instancia de api por si se necesita usar directamente
export { default as api } from './api.js';