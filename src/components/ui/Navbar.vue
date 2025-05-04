<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div class="container-fluid">
        <!-- Marca -->
        <router-link class="navbar-brand fw-bold text-primary" to="/">
          <img
            src="/images/logo.png"
            alt="Logo"
            class="d-inline-block align-text-top me-2"
            style="width: 40px; height: 40px; object-fit: cover;"
          />
          Hotel
        </router-link>
  
        <!-- Toggle movil -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
  
        <!-- Links -->
        <div class="collapse navbar-collapse" id="mainNavbar">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item" v-for="item in navItems" :key="item.to">
              <router-link
                class="nav-link"
                :class="{ active: isActive(item.to) }"
                :to="item.to"
              >
                {{ item.label }}
              </router-link>
            </li>
          </ul>
  
          <!-- Buscador -->
          <!-- <form class="d-flex me-3" @submit.prevent="$emit('search', search)">
            <input
              v-model="search"
              class="form-control me-2"
              type="search"
              placeholder="Search"
            />
            <button class="btn btn-outline-primary" type="submit">
              <i class="bi bi-search"></i>
            </button>
          </form> -->
  
          <!-- Botones derecho -->
          <ul class="navbar-nav mb-2 mb-lg-0 align-items-center">
            <li class="nav-item me-3">
              <button
                class="btn position-relative p-0"
                @click="$emit('notifications')"
                aria-label="Notifications"
              >
                <i class="bi bi-bell fs-4 text-secondary"></i>
                <span
                  v-if="unread"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {{ unread }}
                </span>
              </button>
            </li>
            <li class="nav-item">
              <div class="dropdown">
                <button
                  class="btn p-0 border-0"
                  type="button"
                  id="avatarDropdown"
                  data-bs-toggle="dropdown"
                >
                  <img
                    :src="user.avatar"
                    class="rounded-circle"
                    style="width: 38px; height: 38px; object-fit:cover;"
                  />
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><router-link class="dropdown-item" to="/app/dashboard">Perfil</router-link></li>
                  <li><hr class="dropdown-divider"/></li>
                  <li><a class="dropdown-item" @click="$emit('logout')">Salir</a></li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { useAuthStore } from '@/store/auth'
  
  const navItems = [
    
  ]
  
  const search = ref('')
  const unread = ref(3)
  
  const auth = useAuthStore()
  const user  = auth.user || { avatar: '/images/avatar.jpeg' }
  
  const route = useRoute()
  function isActive(path) {
    return route.path.startsWith(path)
  }
  </script>
  