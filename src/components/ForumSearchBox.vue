<template>
  <div
    ref="wrap"
    class="search-box"
  >
    <form
      class="sb-form"
      @submit.prevent="submit"
    >
      <input
        v-model="text"
        class="sb-input"
        :placeholder="placeholder"
        maxlength="30"
        @focus="openHistory"
        @click="openHistory"
        @keydown.esc="showHistory = false"
      />
      <button
        class="sb-btn"
        type="submit"
      >搜索</button>
    </form>

    <div
      v-if="showHistory && history.length"
      class="sb-history"
    >
      <div class="sb-head">最近检索</div>
      <div
        v-for="h in history"
        :key="h.q"
        class="sb-row"
      >
        <button
          type="button"
          class="sb-main"
          @click="useHistory(h)"
        >
          <span class="sb-q">{{ h.q }}</span>
          <span
            v-if="h.year !== 'all'"
            class="sb-year"
          >{{ formatYear(h.year) }}</span>
        </button>
        <button
          type="button"
          class="sb-del"
          title="删除"
          @click.stop="removeItem(h.q)"
        >×</button>
      </div>
      <div class="sb-foot">
        <span>仅保存在本机浏览器</span>
        <button
          type="button"
          class="sb-clear"
          @click="clearAll"
        >清空</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  getSearchHistory,
  recordSearch,
  removeSearch,
  clearSearchHistory,
  formatYear
} from '../utils/searchHistory'

const props = defineProps({
  modelValue: { type: String, default: '' },
  year: { type: String, default: 'all' },
  placeholder: { type: String, default: '搜索本帖区' }
})

const emit = defineEmits(['update:modelValue', 'search'])

const wrap = ref(null)
const showHistory = ref(false)
const history = ref(getSearchHistory())

const text = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

function refreshHistory () {
  history.value = getSearchHistory()
}

function openHistory () {
  refreshHistory()
  showHistory.value = true
}

function submit () {
  const q = text.value.trim()
  if (!q) return
  recordSearch(q, props.year)
  refreshHistory()
  showHistory.value = false
  emit('search', q, props.year)
}

function useHistory (h) {
  emit('update:modelValue', h.q)
  recordSearch(h.q, h.year)
  refreshHistory()
  showHistory.value = false
  emit('search', h.q, h.year)
}

function removeItem (q) {
  history.value = removeSearch(q)
}

function clearAll () {
  history.value = clearSearchHistory()
}

function handleDocClick (e) {
  if (wrap.value && !wrap.value.contains(e.target)) {
    showHistory.value = false
  }
}

onMounted(() => document.addEventListener('click', handleDocClick))
onUnmounted(() => document.removeEventListener('click', handleDocClick))
</script>

<style scoped>
.search-box {
  position: relative;
  display: inline-flex;
}
.sb-form {
  display: flex;
  align-items: center;
}
.sb-input {
  width: 140px;
  padding: 3px 6px;
  border: 1px solid var(--border);
  background: #fffdf7;
  color: #333;
  font-family: inherit;
  font-size: 12px;
  outline: none;
}
.sb-input:focus {
  border-color: #b9ae98;
}
.sb-btn {
  margin-left: 4px;
  padding: 3px 8px;
  border: 1px solid var(--border);
  background: #f2ede1;
  color: #4a3f35;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
}
.sb-btn:hover {
  background: #ebe4d4;
}
.sb-history {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 238px;
  background: #fffdf7;
  border: 1px solid var(--border);
  z-index: 30;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  font-size: 12px;
}
.sb-head {
  padding: 6px 9px;
  color: #a89c86;
  border-bottom: 1px dashed var(--border);
}
.sb-row {
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #ece6d8;
}
.sb-main {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  padding: 6px 9px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  color: #4a3f35;
}
.sb-main:hover {
  background: #f6f2e7;
}
.sb-q {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sb-year {
  flex: none;
  color: #8a7f6d;
  border: 1px solid #cfc6b4;
  padding: 0 3px;
  font-size: 10px;
}
.sb-del {
  flex: none;
  border: none;
  background: none;
  color: #b0a48e;
  cursor: pointer;
  padding: 0 8px;
  font-size: 14px;
  font-family: inherit;
}
.sb-del:hover {
  color: #8a5a44;
}
.sb-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 9px;
  color: #b0a48e;
  font-size: 11px;
}
.sb-clear {
  border: none;
  background: none;
  color: #8a7f6d;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
}
.sb-clear:hover {
  color: var(--accent);
}
</style>
