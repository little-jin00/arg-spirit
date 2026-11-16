<template>
  <div
    v-if="store.lockStart !== null"
    class="lock-clock"
    :class="{ done }"
    tabindex="0"
    :aria-label="tipText"
  >
    <span class="lc-dot" />
    <span class="lc-value">{{ done ? '已解除' : text }}</span>
    <span
      class="lc-tip"
      :class="{ brief: briefed }"
    >{{ tipText }}</span>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useGameStore } from '../stores/game'

const store = useGameStore()
const now = ref(Date.now())
let timer = null

// 名称只在首次出现时短暂带出，之后靠悬停/聚焦
const briefed = ref(false)
let briefTimer = null

onMounted(() => { timer = setInterval(() => { now.value = Date.now() }, 1000) })
onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(briefTimer)
})

const remaining = computed(() => {
  if (store.lockStart === null) return 0
  return Math.max(0, store.lockDuration - (now.value - store.lockStart))
})

const done = computed(() => store.lockStart !== null && remaining.value <= 0)

watch(() => store.lockStart, (v, old) => {
  if (v === null || v === old) return
  briefed.value = true
  clearTimeout(briefTimer)
  briefTimer = setTimeout(() => { briefed.value = false }, 4500)
}, { immediate: true })

function pad (n) { return String(n).padStart(2, '0') }

// 锁窗只在文件页出现，跳分钟
const text = computed(() => {
  const ms = remaining.value
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  return `${pad(h)}:${pad(m)}`
})

const tipText = computed(() => (done.value ? '哀悼协议锁窗 · 文件恢复可读' : '哀悼协议锁窗'))
</script>

<style scoped>
/* 时钟 B：哀悼协议锁窗。与追踪时钟同规格，只换琥珀色 */
.lock-clock {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  background: none;
  border: 0;
  font-family: Consolas, "Courier New", monospace;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.4px;
  color: #a8863f;
  font-variant-numeric: tabular-nums;
  user-select: none;
  cursor: default;
  outline: none;
}
.lock-clock:focus-visible {
  outline: 1px dotted #a8863f;
  outline-offset: 2px;
}
.lc-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #a8863f;
  opacity: 0.9;
}
.lc-value {
  font-size: 9px;
  font-variant-numeric: tabular-nums;
}
.lc-tip {
  display: none;
  font-size: 9px;
  color: #c0a35e;
  white-space: nowrap;
}
.lock-clock:hover .lc-tip,
.lock-clock:focus .lc-tip,
.lc-tip.brief {
  display: inline;
}
.lock-clock.done {
  color: #7f8a5f;
  opacity: 0.85;
}
.lock-clock.done .lc-dot {
  background: #7f8a5f;
}
</style>
