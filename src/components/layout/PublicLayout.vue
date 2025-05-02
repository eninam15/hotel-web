<template>
    <Navbar @search="$emit('search',$event)" @logout="$emit('logout')"/>
    <div class="container py-5">
      <router-view/>
    </div>
  </template>
  
  <script setup>
  import Navbar from '@/components/ui/Navbar.vue'
  </script>
  