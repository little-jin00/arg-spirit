<template>
  <div
    v-if="visible"
    ref="menuEl"
    class="clip-menu"
    :class="{ 'clip-forum': isForum }"
    :style="{ left: x + 'px', top: y + 'px' }"
    @mousedown.stop
    @contextmenu.stop.prevent
  >
    <button
      type="button"
      class="clip-item"
      :disabled="!canAdd"
      @click="addRecord"
    >
      {{ addLabel }}
    </button>
    <button
      type="button"
      class="clip-item"
      @click="copyText"
    >
      {{ copied ? '已复制' : '复制这段文本' }}
    </button>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MAX_RECORDS, useRecordsStore } from '../stores/records'

const route = useRoute()
const records = useRecordsStore()
records.init()

const visible = ref(false)
const menuEl = ref(null)
const x = ref(0)
const y = ref(0)
const selectedText = ref('')
const sourceTitle = ref('')
const sourcePath = ref('')
const status = ref('idle')
const copied = ref(false)

const isForum = computed(() => route.meta.theme === 'forum')
const isDuplicate = computed(() => records.hasText(selectedText.value))
const canAdd = computed(() =>
  status.value !== 'saved' && !isDuplicate.value && !records.isFull
)
const addLabel = computed(() => {
  if (status.value === 'saved') return '已加入「我的记录」'
  if (isDuplicate.value) return '已在「我的记录」中'
  if (records.isFull) return `记录已满（${MAX_RECORDS} 条）`
  return '加入「我的记录」'
})

function close () {
  visible.value = false
}

function onContextMenu (e) {
  if (route.meta.theme === 'system') return

  const selection = window.getSelection()
  const text = selection && !selection.isCollapsed
    ? selection.toString().trim()
    : ''
  if (!text) {
    close()
    return
  }

  const anchor = selection.anchorNode?.nodeType === 3
    ? selection.anchorNode.parentElement
    : selection.anchorNode
  if (anchor?.closest?.('input, textarea, [contenteditable="true"]')) return

  e.preventDefault()
  selectedText.value = text
  sourceTitle.value = route.meta.title || document.title || '未命名页面'
  sourcePath.value = route.fullPath
  status.value = 'idle'
  copied.value = false
  visible.value = true
  x.value = e.clientX + 2
  y.value = e.clientY + 2

  nextTick(() => {
    const rect = menuEl.value?.getBoundingClientRect()
    if (!rect) return
    const pad = 8
    x.value = Math.max(pad, Math.min(e.clientX + 2, window.innerWidth - rect.width - pad))
    y.value = Math.max(pad, Math.min(e.clientY + 2, window.innerHeight - rect.height - pad))
  })
}

function onDocMouseDown (e) {
  if (!visible.value) return
  if (menuEl.value?.contains(e.target)) return
  close()
}

function onKeyDown (e) {
  if (e.key === 'Escape') close()
}

function addRecord () {
  const result = records.add({
    text: selectedText.value,
    title: sourceTitle.value,
    path: sourcePath.value,
    time: Date.now()
  })
  if (result.ok) {
    status.value = 'saved'
    window.setTimeout(close, 650)
  } else if (result.reason === 'duplicate') {
    status.value = 'duplicate'
  } else if (result.reason === 'full') {
    status.value = 'full'
  }
}

function fallbackCopy (text) {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.left = '-9999px'
  area.style.top = '0'
  document.body.appendChild(area)
  area.select()
  try {
    document.execCommand('copy')
  } catch (e) {
    // 复制失败时保留菜单，让玩家可以手动选择
  }
  document.body.removeChild(area)
}

async function copyText () {
  const text = selectedText.value
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      fallbackCopy(text)
    }
  } catch (e) {
    fallbackCopy(text)
  }
  copied.value = true
  window.setTimeout(close, 500)
}

watch(() => route.fullPath, close)

onMounted(() => {
  document.addEventListener('contextmenu', onContextMenu)
  document.addEventListener('mousedown', onDocMouseDown)
  document.addEventListener('keydown', onKeyDown)
  window.addEventListener('scroll', close, true)
  window.addEventListener('resize', close)
})

onBeforeUnmount(() => {
  document.removeEventListener('contextmenu', onContextMenu)
  document.removeEventListener('mousedown', onDocMouseDown)
  document.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('scroll', close, true)
  window.removeEventListener('resize', close)
})
</script>

<style scoped>
.clip-menu {
  position: fixed;
  z-index: 300;
  min-width: 190px;
  max-width: 240px;
  padding: 4px;
  background: var(--panel);
  color: var(--text);
  border: 1px solid rgba(23, 33, 46, 0.14);
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(23, 33, 46, 0.12);
  font-size: 12.5px;
  user-select: none;
}
.clip-forum {
  font-family: "SimSun", "Songti SC", "STSong", serif;
}
.clip-item {
  display: block;
  width: 100%;
  padding: 8px 10px;
  background: transparent;
  border: none;
  border-radius: 3px;
  color: var(--text);
  font-size: inherit;
  font-family: inherit;
  line-height: 1.4;
  text-align: left;
  cursor: pointer;
}
.clip-item + .clip-item {
  border-top: 1px solid rgba(23, 33, 46, 0.08);
  border-radius: 0 0 3px 3px;
}
.clip-item:hover:not(:disabled) {
  background: rgba(23, 33, 46, 0.06);
}
.clip-item:disabled {
  color: #63707d;
  cursor: default;
}
</style>
