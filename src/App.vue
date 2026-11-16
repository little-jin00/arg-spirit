<script setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import EvidenceBoard from './components/EvidenceBoard.vue'
import TimerDot from './components/TimerDot.vue'
import AlertModal from './components/AlertModal.vue'
import DevNoticeModal from './components/DevNoticeModal.vue'
import TextClipMenu from './components/TextClipMenu.vue'
import { TRACE_ZERO_LINES, useGameStore } from './stores/game'
import { useRecordsStore } from './stores/records'

const route = useRoute()
const store = useGameStore()
store.init()
const records = useRecordsStore()
records.init()
const themeClass = computed(() => `theme-${route.meta.theme || 'forum'}`)
// 命令行/系统深层页面保持沉浸：不挂证据板与倒计时悬浮组件
const isSystem = computed(() => route.meta.theme === 'system')

// 跨标签页同步：站内链接会在新标签打开，各标签有自己的 Pinia 状态。
// 监听 storage 与窗口重新获得焦点，始终以 localStorage 里的最新存档为准。
const SYNC_KEYS = ['arg_save_v1', 'arg_evidence_board_v1', 'arg_my_records_v1']
function syncAcrossTabs (e) {
  if (e && e.key && !SYNC_KEYS.includes(e.key)) return
  store.syncFromStorage()
  records.syncFromStorage()
}
function onWindowFocus () {
  syncAcrossTabs(null)
}
function onVisibilityChange () {
  if (document.visibilityState === 'visible') syncAcrossTabs(null)
}

// 归零覆盖层是模态：回车关闭，捕获阶段拦下，避免同时触发底下的输入框
function onTraceKey (e) {
  if (!store.traceOverlay || e.key !== 'Enter') return
  e.preventDefault()
  e.stopPropagation()
  store.closeTraceOverlay()
}
onMounted(() => {
  window.addEventListener('keydown', onTraceKey, true)
  window.addEventListener('storage', syncAcrossTabs)
  window.addEventListener('focus', onWindowFocus)
  document.addEventListener('visibilitychange', onVisibilityChange)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onTraceKey, true)
  window.removeEventListener('storage', syncAcrossTabs)
  window.removeEventListener('focus', onWindowFocus)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<template>
  <div
    class="app"
    :class="themeClass"
  >
    <router-view />
    <!-- 系统页只隐藏、不卸载：展开状态、当前 tab 与滚动位置在切站后保持 -->
    <EvidenceBoard
      v-if="store.boardUnlocked"
      v-show="!isSystem"
    />
    <TimerDot :clock="!isSystem" />
    <TextClipMenu v-if="!isSystem && store.boardUnlocked" />
    <AlertModal />
    <DevNoticeModal />

    <div
      v-if="store.traceOverlay"
      class="trace-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="追踪时钟归零"
      @click="store.closeTraceOverlay()"
    >
      <div class="trace-box">
        <div
          v-for="(l, i) in TRACE_ZERO_LINES"
          :key="i"
          class="trace-line"
          :class="l.c"
          :style="{ animationDelay: (i * 0.26) + 's' }"
        >{{ l.t }}</div>
        <div class="trace-hint">点击任意处或按回车关闭</div>
      </div>
    </div>

    <div
      v-if="store.saveMismatch"
      class="save-gate"
    >
      <div class="save-dialog">
        <h2>旧存档与本版本不兼容</h2>
        <p>检测到的存档版本：{{ store.saveVersionSeen }}。当前版本：K-11。</p>
        <p>这份存档由旧版本写入，缺少当前版本所需的字段。为避免缺项或错位，本次没有载入它。</p>
        <p class="save-note">清除只删除 arg_save_v1；结局记录、通关标记与证据板解锁状态都会保留。不会自动清除。</p>
        <button
          class="save-clear"
          @click="store.clearIncompatibleSave()"
        >
          清除旧存档
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trace-overlay {
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(4, 8, 6, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  cursor: pointer;
}
.trace-box {
  width: min(680px, 100%);
  background: #0b1210;
  border: 1px solid #2a3d34;
  padding: 24px 28px 18px;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.6);
  font-family: Consolas, "Courier New", monospace;
}
.trace-line {
  font-size: 13px;
  line-height: 2;
  color: #9fb2a7;
  opacity: 0;
  animation: trace-line-in 0.3s ease forwards;
}
.trace-line.ac {
  color: #e07f6f;
}
.trace-hint {
  margin-top: 14px;
  text-align: right;
  font-size: 10.5px;
  letter-spacing: 0.5px;
  color: #4f6158;
}
@keyframes trace-line-in {
  from {
    opacity: 0;
    transform: translateY(3px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.save-gate {
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(4, 8, 6, 0.86);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.save-dialog {
  width: min(520px, 100%);
  background: #0b1210;
  border: 1px solid #2a3d34;
  padding: 26px 28px 24px;
  color: #c9d8ce;
  font-family: Consolas, "Courier New", monospace;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.55);
}
.save-dialog h2 {
  margin: 0 0 14px;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 1px;
  color: #e8f3ec;
}
.save-dialog p {
  margin: 0 0 10px;
  font-size: 12.5px;
  line-height: 1.85;
  color: #9fb2a7;
}
.save-dialog .save-note {
  color: #6f8479;
}
.save-clear {
  margin-top: 12px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #3f6a55;
  color: #a9d7bd;
  font-family: inherit;
  font-size: 12.5px;
  cursor: pointer;
}
.save-clear:hover {
  border-color: #6fbf95;
  color: #d7f2e3;
}
</style>
