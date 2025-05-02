<template>
    <router-link
      :to="to"
      class="px-3 py-2 font-medium text-gray-600 hover:text-gray-900 transition"
      :class="active ? 'text-gray-900 border-b-2 border-blue-600' : ''"
      @click="$emit('click')"
    >
      <slot />
    </router-link>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import { computed, defineProps } from 'vue'
  
  const props = defineProps({
    to: { type: [String, Object], required: true }
  })
  
  const route = useRoute()
  const active = computed(() => {
    // marca activo si coincide con el path base
    const match = typeof props.to === 'string'
      ? props.to
      : props.to.path
    return route.path.startsWith(match)
  })
  </script>
  