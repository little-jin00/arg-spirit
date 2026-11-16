<template>
  <div class="top-hud">
    <div
      v-if="clock && store.timerStart !== null"
      class="trace-clock"
      :class="{ expired }"
      tabindex="0"
      :aria-label="tipText"
    >
      <span class="tc-dot" />
      <span class="tc-value">{{ expired ? '00:00:00' : text }}</span>
      <span
        class="tc-tip"
        :class="{ brief: briefed }"
      >{{ tipText }}</span>
    </div>

    <button
      class="audio-switch"
      :class="{ off: !store.audioEnabled }"
      :aria-pressed="store.audioEnabled"
      @click="toggleAudio"
    >
      声音 {{ store.audioEnabled ? '开' : '关' }}
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useGameStore } from '../stores/game'
import { setAudioEnabled } from '../utils/endingAudio'

defineProps({
  // 系统深层页面只保留声音开关，不挂追踪时钟
  clock: { type: Boolean, default: true }
})

const store = useGameStore()
const now = ref(Date.now())
let timer = null

// 「追踪脚本已部署」只在时钟首次出现时短暂显示，之后靠悬停/聚焦带出
const briefed = ref(false)
let briefTimer = null

onMounted(() => {
  timer = setInterval(() => { now.value = Date.now() }, 1000)
  setAudioEnabled(store.audioEnabled)
})
onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(briefTimer)
})

function toggleAudio () {
  store.toggleAudio()
  setAudioEnabled(store.audioEnabled)
}

const remaining = computed(() => {
  if (store.timerStart === null) return 0
  return Math.max(0, store.timerDuration - (now.value - store.timerStart))
})

const expired = computed(() => store.timerStart !== null && remaining.value <= 0)

// 归零即触发强制清理，标记只落一次
watch(expired, (v) => {
  if (v) store.markTraceExpired()
}, { immediate: true })

// 首次挂上时钟时把「追踪脚本已部署」说一次，约 4.5 秒后收起
watch(() => store.timerStart, (v, old) => {
  if (v === null || v === old) return
  briefed.value = true
  clearTimeout(briefTimer)
  briefTimer = setTimeout(() => { briefed.value = false }, 4500)
}, { immediate: true })

function pad (n) { return String(n).padStart(2, '0') }

// 只保留时间：小圆点 + 等宽数字
const text = computed(() => {
  const ms = remaining.value
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `剩余 ${pad(h)}:${pad(m)}:${pad(s)}`
})

// 悬停/聚焦时带出名称与状态句
const tipText = computed(() => (expired.value ? '追踪脚本 · 复核窗口 48 小时' : '追踪脚本 · 追踪脚本已部署'))
</script>

<style scoped>
/* 右上角只占一行：追踪时钟 + 声音文字开关 */
.top-hud {
  position: fixed;
  top: 14px;
  right: 16px;
  z-index: 90;
  display: flex;
  align-items: center;
  gap: 16px;
  font-family: Consolas, "Courier New", monospace;
}

/* 时钟 A：追踪/清除。去底色、去边框，压成一行暗砖红小字 */
.trace-clock {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 0;
  background: none;
  border: 0;
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.4px;
  color: #8f4a3d;
  font-variant-numeric: tabular-nums;
  cursor: default;
  outline: none;
}
.trace-clock:focus-visible {
  outline: 1px dotted #8f4a3d;
  outline-offset: 2px;
}
.tc-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #8f4a3d;
  opacity: 0.9;
  animation: trace-blink 2.8s infinite;
}
.tc-value {
  font-size: 9px;
  font-variant-numeric: tabular-nums;
}
.tc-tip {
  display: none;
  font-size: 9px;
  color: #a9705f;
  white-space: nowrap;
}
.trace-clock:hover .tc-tip,
.trace-clock:focus .tc-tip,
.tc-tip.brief {
  display: inline;
}
.trace-clock.expired {
  color: #9c4a3c;
}
.trace-clock.expired .tc-dot {
  animation: none;
  background: #9c4a3c;
}

/* 声音：无实心按钮，与时钟同一行，只靠间距和颜色提示可点 */
.audio-switch {
  background: none;
  border: 0;
  padding: 0;
  font-family: inherit;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.5px;
  color: #6f8479;
  cursor: pointer;
}
.audio-switch:hover,
.audio-switch:focus-visible {
  color: #a9c4b3;
  outline: none;
}
.audio-switch.off {
  color: #4a5a52;
}

@keyframes trace-blink {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.3; }
}
</style>
