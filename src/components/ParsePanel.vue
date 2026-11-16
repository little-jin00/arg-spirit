<template>
  <div
    class="parse-gate"
    @click.self="$emit('close')"
  >
    <section
      class="parse-panel"
      role="dialog"
      aria-modal="true"
      aria-label="解析"
    >
      <header class="pp-head">
        <span class="pp-name">解析 · {{ name }}</span>
        <button
          class="pp-x"
          @click="$emit('close')"
        >
          ✕
        </button>
      </header>

      <p
        v-if="status === 'unread'"
        class="pp-note"
      >
        先读一遍
      </p>
      <p
        v-else-if="status === 'none'"
        class="pp-note"
      >
        这份没有可解析的内容
      </p>
      <template v-else>
        <template
          v-for="sec in sections"
          :key="sec.key"
        >
          <div
            v-if="sec.items.length"
            class="pp-sec"
          >
            <h3>{{ sec.title }}</h3>
            <ul>
              <li
                v-for="(item, i) in sec.items"
                :key="i"
              >
                <button
                  v-if="item.target && item.target.type === 'file' && canJump(item.target)"
                  class="pp-link"
                  @click="$emit('jump', item.target)"
                >
                  {{ display(item.text) }} <span class="pp-arrow">↗</span>
                </button>
                <template v-else-if="item.target && item.target.type === 'evidence' && evidenceOf(item.target.id)">
                  <button
                    class="pp-link"
                    @click="toggleEvidence(item.target.id)"
                  >
                    {{ display(item.text) }}
                  </button>
                  <div
                    v-if="expandedEvidence === item.target.id"
                    class="pp-ev"
                  >
                    <div class="pp-ev-title">{{ evidenceOf(item.target.id).title }}</div>
                    <div class="pp-ev-meta">来源：{{ evidenceOf(item.target.id).source }}</div>
                    <div class="pp-ev-desc">{{ evidenceOf(item.target.id).desc }}</div>
                  </div>
                </template>
                <template v-else>
                  {{ display(item.text) }}
                </template>
              </li>
            </ul>
          </div>
        </template>
        <p
          v-if="allEmpty"
          class="pp-note"
        >
          （暂无）
        </p>
      </template>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '../stores/game'
import { getParseEntry, visibleItems } from '../data/parseEntries'
import { EVIDENCE } from '../data/evidence'
import { ENCRYPTED, FILES } from '../data/terminalFiles'

const props = defineProps({
  path: { type: String, required: true }
})
defineEmits(['close', 'jump'])

const store = useGameStore()
const expandedEvidence = ref('')

const name = computed(() => props.path.split('/').pop() || props.path)

// 未读优先：没读过的文件不显示任何解析内容
const status = computed(() => {
  if (!store.readFiles.includes(props.path)) return 'unread'
  return getParseEntry(props.path) ? 'ok' : 'none'
})

const entry = computed(() => getParseEntry(props.path) || { what: [], notes: [], related: [] })

// 每次打开/进度变化都重新过滤；组件不缓存过滤结果
const sections = computed(() => {
  const ctx = {
    evidenceIds: store.evidenceIds,
    choices: store.choices,
    readFiles: store.readFiles
  }
  return [
    { key: 'what', title: '这是什么', items: visibleItems(entry.value.what, ctx) },
    { key: 'notes', title: '值得注意', items: visibleItems(entry.value.notes, ctx) },
    { key: 'related', title: '和什么有关', items: visibleItems(entry.value.related, ctx) }
  ]
})

const allEmpty = computed(() => sections.value.every((s) => !s.items.length))

function evidenceOf (id) {
  return EVIDENCE[id] || null
}

// 只有真实存在的目标才做成可点；否则保持纯文本
function canJump (target) {
  if (!target) return false
  if (target.type === 'file') {
    return Object.prototype.hasOwnProperty.call(FILES, target.path) ||
      Object.prototype.hasOwnProperty.call(ENCRYPTED, target.path)
  }
  if (target.type === 'evidence') return !!EVIDENCE[target.id]
  return false
}

// 数据里保留文案占位符 {{FP}}，显示时替换为当前指纹
function display (text) {
  return String(text).replace(/\{\{FP\}\}/g, store.fingerprint || '')
}

function toggleEvidence (id) {
  expandedEvidence.value = expandedEvidence.value === id ? '' : id
}
</script>

<style scoped>
.parse-gate {
  position: fixed;
  inset: 0;
  z-index: 360;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(3, 6, 4, 0.72);
}
.parse-panel {
  width: min(560px, 100%);
  max-height: 78vh;
  overflow-y: auto;
  padding: 22px 24px 20px;
  background: #070d09;
  border: 1px solid #1e3a2a;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.6);
  color: #b8d8b8;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
  line-height: 1.8;
}
.pp-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #12261a;
}
.pp-name {
  font-size: 12.5px;
  letter-spacing: 1px;
  color: #8ecae6;
  word-break: break-all;
}
.pp-x {
  flex: none;
  background: none;
  border: 0;
  padding: 0 2px;
  color: #5f7a5f;
  font-family: inherit;
  font-size: 12.5px;
  cursor: pointer;
}
.pp-x:hover {
  color: #b8d8b8;
}
.pp-note {
  margin: 18px 0 4px;
  color: #5f7a5f;
}
.pp-sec {
  margin-top: 16px;
}
.pp-sec h3 {
  margin: 0 0 4px;
  font-size: 11.5px;
  font-weight: 400;
  letter-spacing: 1px;
  color: #6f9a7a;
}
.pp-sec ul {
  margin: 0;
  padding-left: 18px;
}
.pp-sec li {
  color: #b8d8b8;
}
.pp-link {
  background: none;
  border: 0;
  padding: 0;
  color: #8ecae6;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  text-align: left;
  text-decoration: underline;
  text-decoration-color: #2f5a6a;
  text-underline-offset: 3px;
  cursor: pointer;
}
.pp-link:hover {
  color: #d7f2fa;
  text-decoration-color: #6fb3c9;
}
.pp-arrow {
  color: #5f8a9a;
}
.pp-ev {
  margin: 6px 0 4px;
  padding: 8px 10px;
  border-left: 2px solid #1e3a44;
  background: #0a1418;
}
.pp-ev-title {
  color: #cfe9f2;
}
.pp-ev-meta {
  margin-top: 2px;
  font-size: 11.5px;
  color: #5f7a7f;
}
.pp-ev-desc {
  margin-top: 6px;
  font-size: 12.5px;
  color: #9fb8bf;
  white-space: pre-wrap;
}
</style>
