<!-- src/views/errors/NotFound.vue -->
<template>
    <div class="not-found-page">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 text-center">
            <div class="error-content py-5">
              <h1 class="display-1 text-primary fw-bold mb-4">404</h1>
              <div class="error-icon mb-4">
                <i class="bi bi-map text-primary" style="font-size: 6rem; opacity: 0.2;"></i>
              </div>
              <h2 class="h3 mb-4">Página no encontrada</h2>
              <p class="text-muted mb-4">
                Lo sentimos, la página que estás buscando no existe o ha sido movida.
              </p>
              <div class="error-actions d-flex flex-column flex-md-row gap-3 justify-content-center">
                <router-link :to="{ name: 'home' }" class="btn btn-primary px-4">
                  <i class="bi bi-house-door me-2"></i>Volver al inicio
                </router-link>
                <button @click="goBack" class="btn btn-outline-secondary px-4">
                  <i class="bi bi-arrow-left me-2"></i>Volver atrás
                </button>
              </div>
              
              <div class="suggested-links mt-5" v-if="popularLinks.length > 0">
                <h3 class="h5 mb-3">Quizás estás buscando:</h3>
                <ul class="list-unstyled">
                  <li v-for="(link, index) in popularLinks" :key="index" class="mb-2">
                    <router-link :to="link.to" class="text-decoration-none">
                      <i class="bi bi-link-45deg me-1"></i>{{ link.label }}
                    </router-link>
                  </li>
                </ul>
              </div>
              
              <div class="search-box mt-5">
                <div class="card border shadow-sm">
                  <div class="card-body">
                    <form @submit.prevent="searchSite" class="d-flex">
                      <input 
                        type="text" 
                        v-model="searchQuery" 
                        class="form-control form-control-lg me-2" 
                        placeholder="Buscar en el sitio..."
                      >
                      <button type="submit" class="btn btn-primary px-4">
                        <i class="bi bi-search"></i>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const searchQuery = ref('');
  
  // Lista de enlaces populares o sugeridos
  const popularLinks = [
    { to: { name: 'rooms' }, label: 'Ver todas las habitaciones' },
    { to: { name: 'contact' }, label: 'Contactar con nosotros' },
    { to: { name: 'login' }, label: 'Iniciar sesión' },
    { to: { name: 'register' }, label: 'Crear una cuenta' }
  ];
  
  // Método para volver a la página anterior
  function goBack() {
    router.go(-1);
  }
  
  // Método para buscar en el sitio
  function searchSite() {
    if (searchQuery.value.trim()) {
      // Aquí podrías implementar una búsqueda real o redirigir a una página de búsqueda
      // Por ahora, simplemente redirigimos a la página de habitaciones con el término como query
      router.push({
        name: 'rooms',
        query: { search: searchQuery.value }
      });
    }
  }
  </script>
  
  <style scoped>
  .not-found-page {
    padding: 5rem 0;
    min-height: calc(100vh - 70px); /* Ajusta según la altura de tu header */
    display: flex;
    align-items: center;
  }
  
  .error-content {
    position: relative;
  }
  
  .error-icon {
    position: absolute;
    top: 20px;
    left: 0;
    right: 0;
    z-index: -1;
    display: flex;
    justify-content: center;
    opacity: 0.05;
    font-size: 15rem;
    color: var(--bs-primary);
  }
  
  @media (max-width: 767px) {
    .not-found-page {
      padding: 3rem 0;
    }
    
    .error-actions {
      flex-direction: column;
    }
  }
  </style>