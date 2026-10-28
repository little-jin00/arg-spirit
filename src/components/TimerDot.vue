<template>
  <div v-if="store.timerStart !== null" class="timer-dot" @click="open = !open" :title="titleText">
    <span v-if="open" class="timer-text">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const open = ref(false)
const now = ref(Date.now())
let timer = null

onMounted(() => { timer = setInterval(() => { now.value = Date.now() }, 1000) })
onUnmounted(() => clearInterval(timer))

const remaining = computed(() => {
  if (store.timerStart === null) return 0
  return Math.max(0, store.timerDuration - (now.value - store.timerStart))
})

function pad(n) { return String(n).padStart(2, '0') }

const text = computed(() => {
  const ms = remaining.value
  if (ms <= 0) return '00:00:00 · 已清除'
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${pad(h)}:${pad(m)}:${pad(s)}`
})

const titleText = computed(() => '追踪脚本 · 剩余响应时间 ' + text.value)
</script>

<style scoped>
.timer-dot {
  position: fixed; right: 16px; bottom: 20px; z-index: 90;
  display: flex; align-items: center; gap: 8px; cursor: pointer;
}
.timer-dot::before {
  content: '';
  width: 10px; height: 10px; border-radius: 50%;
  background: #e53935;
  animation: blink-red 1.6s infinite;
}
.timer-text {
  font-family: Consolas, monospace;
  font-size: 12px; color: #ef5350;
  background: #14161a; border: 1px solid #37474f;
  padding: 3px 8px; border-radius: 3px;
}
</style>
