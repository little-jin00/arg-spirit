<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EvidenceBoard from './components/EvidenceBoard.vue'
import TimerDot from './components/TimerDot.vue'
import AlertModal from './components/AlertModal.vue'
import DevNoticeModal from './components/DevNoticeModal.vue'
import { useGameStore } from './stores/game'

const route = useRoute()
const store = useGameStore()
store.init()
const themeClass = computed(() => `theme-${route.meta.theme || 'forum'}`)
// 命令行/系统深层页面保持沉浸：不挂证据板与倒计时悬浮组件
const isSystem = computed(() => route.meta.theme === 'system')
</script>

<template>
  <div
    class="app"
    :class="themeClass"
  >
    <router-view />
    <EvidenceBoard v-if="!isSystem" />
    <TimerDot v-if="!isSystem" />
    <AlertModal />
    <DevNoticeModal />
  </div>
</template>
