<!-- src/App.vue -->
<template>
  <router-view />
</template>

<script setup>
// No necesitas importar nada aquí,
// el router inyecta el layout adecuado.
</script>

<style>
/* Si quieres estilos globales muy básicos, aquí van */
html, body, #app {
  height: 100%;
  margin: 0;
}
#app {
  font-family: 'Montserrat', sans-serif;
}
</style>
