<template>
  <svg :width="size" :height="size" viewBox="0 0 100 100" class="shining-sun">
    <g stroke="#ff9f43" stroke-width="5" stroke-linecap="round">
      <line
        v-for="i in 12"
        :key="i"
        :x1="50 + 34 * Math.cos((i * 30 * Math.PI) / 180)"
        :y1="50 + 34 * Math.sin((i * 30 * Math.PI) / 180)"
        :x2="50 + 44 * Math.cos((i * 30 * Math.PI) / 180)"
        :y2="50 + 44 * Math.sin((i * 30 * Math.PI) / 180)"
      />
    </g>
    <circle cx="50" cy="50" r="30" fill="#ffb142" stroke="#e67e22" stroke-width="2" />
    <circle cx="40" cy="45" r="4" fill="#5d3a00" />
    <circle cx="60" cy="45" r="4" fill="#5d3a00" />
    <path d="M 38 58 Q 50 70 62 58" stroke="#5d3a00" stroke-width="4" fill="none" stroke-linecap="round" />
  </svg>
</template>

<script setup>
defineProps({ size: { type: Number, default: 120 } })
</script>

<style scoped>
.shining-sun { display: block; }
</style>
