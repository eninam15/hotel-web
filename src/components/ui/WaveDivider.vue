<template>
    <div class="w-100 overflow-hidden" :style="{ lineHeight: 0 }">
      <svg
        :style="{ transform: flipped ? 'rotate(180deg)' : 'none' }"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        class="w-100"
      >
        <path
          :fill="color"
          fill-opacity="1"
          d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,69.3C1248,85,1344,107,1392,117.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
        ></path>
      </svg>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    color:   { type: String, default: '#FFD5C2' },
    flipped: { type: Boolean, default: false }
  })
  </script>
  
  <style scoped>
  svg { display: block; }
  </style>
  