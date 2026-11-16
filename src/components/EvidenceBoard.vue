<template>
  <div class="ev-wrap">
    <button class="ev-btn" @click="open = !open">
      证据板 <b>{{ store.evidenceIds.length }}</b>
    </button>
    <div v-if="open" class="ev-drawer">
      <div class="ev-head">
        <h3>证据板</h3>
        <button class="ev-close" @click="open = false">×</button>
      </div>
      <p class="ev-count">已收集 {{ cards.length }} / 共 {{ total }}</p>
      <div class="ev-tabs">
        <button
          class="ev-tab"
          :class="{ on: tab === 'ev' }"
          @click="tab = 'ev'"
        >证据 {{ cards.length }}</button>
        <button
          class="ev-tab"
          :class="{ on: tab === 'visit' }"
          @click="tab = 'visit'"
        >到访 {{ store.visits.length }}</button>
        <button
          class="ev-tab"
          :class="{ on: tab === 'rec' }"
          @click="tab = 'rec'"
        >我的记录 {{ records.items.length }}</button>
      </div>

      <template v-if="tab === 'ev'">
        <p v-if="!cards.length" class="ev-empty">尚未收集任何证据。</p>
        <div v-for="c in cards" :key="c.key" class="ev-card">
          <div class="ev-title">{{ c.title }}</div>
          <div class="ev-meta">来源：{{ c.source }}<template v-if="c.time"> · {{ c.time }}</template></div>
          <div class="ev-desc">{{ c.desc }}</div>
          <pre
            v-if="c.body"
            class="ev-body"
          >{{ c.body }}</pre>
        </div>
      </template>

      <template v-else-if="tab === 'visit'">
        <p v-if="!visits.length" class="ev-empty">尚无访问记录。</p>
        <button
          v-for="v in visits"
          :key="v.site"
          class="visit-card"
          :title="`在新标签页打开 ${v.name}`"
          @click="openVisit(v)"
        >
          <span class="visit-title">{{ v.name }}</span>
          <span class="visit-meta">{{ v.layer }} · 最近 {{ fmtTime(v.time) }} ↗</span>
        </button>
      </template>

      <template v-else>
        <p class="rec-hint">
          上限 {{ MAX_RECORDS }} 条 · 存在本机，不随清档删除<template v-if="records.isFull"> · 已满，请删除后再添加</template>
        </p>
        <p v-if="!records.items.length" class="ev-empty">
          还没有保存的记录。在页面里选中文字后右键，可加入这里。
        </p>
        <article
          v-for="r in records.items"
          :key="r.id"
          class="rec-card"
        >
          <p
            class="rec-text"
            :class="{ open: expanded[r.id] }"
          >
            {{ r.text }}
          </p>
          <button
            v-if="isLong(r.text)"
            class="rec-toggle"
            @click="toggleExpand(r.id)"
          >
            {{ expanded[r.id] ? '收起' : '展开全文' }}
          </button>
          <div class="rec-meta">
            <span class="rec-title" :title="r.path">{{ r.title }}</span>
            <span class="rec-time">{{ fmtDateTime(r.time) }}</span>
          </div>
          <div class="rec-actions">
            <button class="rec-link" @click="goRecord(r)">回到原页 ↗</button>
            <button class="rec-del" @click="records.remove(r.id)">删除</button>
          </div>
        </article>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { MAX_RECORDS, useRecordsStore } from '../stores/records'
import { EVIDENCE } from '../data/evidence'
import { SITES } from '../data/sites'

const router = useRouter()
const store = useGameStore()
const records = useRecordsStore()
records.init()
const open = ref(false)
const tab = ref('ev')
const expanded = ref({})

// 附件首次解锁后自动展开一次，之后由玩家自己开关
onMounted(() => {
  if (store.boardFirstOpen) {
    open.value = true
    store.boardFirstOpen = false
  }
})
const cards = computed(() => store.evidenceIds.map((id) => ({ key: id, ...EVIDENCE[id] })).filter((c) => c.title))
// 分母取证据表实际键数，加卡自动跟随
const total = computed(() => Object.keys(EVIDENCE).length)
const visits = computed(() =>
  store.visits
    .filter((v) => SITES[v.site])
    .map((v) => ({ site: v.site, time: v.time, ...SITES[v.site] }))
)

function fmtTime (ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function openVisit (v) {
  const { href } = router.resolve(v.entry)
  window.open(href, '_blank', 'noopener,noreferrer')
}

function fmtDateTime (ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

function isLong (text) {
  const value = String(text)
  return value.length > 60 || value.split('\n').length > 3
}

function toggleExpand (id) {
  expanded.value[id] = !expanded.value[id]
}

function goRecord (r) {
  open.value = false
  const path = r.path || '/'
  if (path !== router.currentRoute.value.fullPath) router.push(path)
}
</script>

<style scoped>
.ev-wrap {
  position: fixed; left: 16px; bottom: 16px; z-index: 90;
  /* 跨站点工具层：只借用主题的浅底/深字，主色固定为中性深蓝灰，
     避免在橙色官网或暗红论坛上出现低对比的彩色小字 */
  --ev-panel: var(--panel);
  --ev-text: var(--text);
  --ev-muted: #63707d;
  --ev-accent: #35617f;
  --ev-danger: #a3403a;
  --ev-line: rgba(23, 33, 46, 0.14);
  --ev-line-soft: rgba(23, 33, 46, 0.08);
  --ev-fill: rgba(23, 33, 46, 0.035);
  --ev-fill-hover: rgba(23, 33, 46, 0.06);
}
.ev-btn {
  background: var(--ev-panel); color: var(--ev-text);
  border: 1px solid var(--ev-line); border-radius: 4px;
  padding: 8px 14px; font-size: 13px; font-family: inherit;
  cursor: pointer; box-shadow: 0 1px 2px rgba(23, 33, 46, 0.05);
}
.ev-btn b { color: var(--ev-accent); }
.ev-btn:hover { border-color: var(--ev-accent); }
.ev-drawer {
  position: absolute; left: 0; bottom: 46px;
  width: 340px; max-height: 70vh; overflow-y: auto;
  background: var(--ev-panel); color: var(--ev-text);
  border: 1px solid var(--ev-line); border-radius: 6px;
  padding: 14px; box-shadow: 0 8px 24px rgba(23, 33, 46, 0.12);
}
.ev-head { display: flex; justify-content: space-between; align-items: center; }
.ev-head h3 { margin: 0 0 8px; color: var(--ev-text); font-size: 15px; font-weight: 600; }
.ev-close { background: none; border: none; color: var(--ev-muted); font-size: 20px; line-height: 1; cursor: pointer; }
.ev-close:hover { color: var(--ev-text); }
.ev-count {
  margin: 0 0 10px;
  font-size: 11.5px;
  color: var(--ev-muted);
  letter-spacing: 0.5px;
}
.ev-tabs { display: flex; gap: 6px; margin-bottom: 10px; }
.ev-tab {
  flex: 1; background: var(--ev-fill); color: var(--ev-muted);
  border: 1px solid transparent; border-radius: 3px;
  padding: 5px 0; font-size: 12px; font-family: inherit; cursor: pointer;
}
.ev-tab:hover { color: var(--ev-text); }
.ev-tab.on {
  background: var(--ev-panel); color: var(--ev-accent);
  border-color: var(--ev-accent); font-weight: 600;
}
.ev-empty { color: var(--ev-muted); font-size: 12px; }
.ev-card {
  background: var(--ev-fill); border: 1px solid var(--ev-line-soft);
  border-left: 2px solid var(--ev-accent);
  border-radius: 4px; padding: 10px; margin-bottom: 10px;
}
.ev-title { color: var(--ev-text); font-size: 13px; font-weight: 600; }
.ev-meta { color: var(--ev-muted); font-size: 11px; margin: 4px 0; }
.ev-desc { color: var(--ev-text); font-size: 12px; line-height: 1.6; }
.ev-body {
  margin: 8px 0 0; padding: 8px 10px;
  background: var(--ev-panel); border-left: 2px solid var(--ev-line);
  color: var(--ev-text); font-family: Consolas, "Courier New", monospace;
  font-size: 11.5px; line-height: 1.7;
  white-space: pre-wrap; word-break: break-word;
}
.visit-card {
  display: block; width: 100%; text-align: left;
  background: var(--ev-fill); border: 1px solid var(--ev-line-soft);
  border-left: 2px solid var(--ev-line);
  border-radius: 4px; padding: 8px 10px; margin-bottom: 8px;
  cursor: pointer; font-family: inherit;
}
.visit-card:hover {
  background: var(--ev-fill-hover);
  border-color: var(--ev-line); border-left-color: var(--ev-accent);
}
.visit-title {
  display: block; color: var(--ev-text); font-size: 12.5px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.visit-meta { display: block; color: var(--ev-muted); font-size: 11px; margin-top: 3px; }
.rec-hint { margin: 0 0 8px; color: var(--ev-muted); font-size: 11px; line-height: 1.6; }
.rec-card {
  background: var(--ev-fill); border: 1px solid var(--ev-line-soft);
  border-left: 2px solid var(--ev-line);
  border-radius: 4px; padding: 10px; margin-bottom: 10px;
}
.rec-text {
  margin: 0; color: var(--ev-text); font-size: 12px; line-height: 1.7;
  white-space: pre-wrap; overflow-wrap: anywhere;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
  overflow: hidden;
}
.rec-text.open { display: block; -webkit-line-clamp: unset; }
.rec-toggle {
  margin: 4px 0 0; padding: 0; background: none; border: none;
  color: var(--ev-accent); font-size: 11.5px; cursor: pointer; font-family: inherit;
}
.rec-toggle:hover { text-decoration: underline; }
.rec-meta {
  display: flex; justify-content: space-between; gap: 8px;
  margin-top: 7px; padding-top: 7px; border-top: 1px solid var(--ev-line-soft);
  font-size: 11px; color: var(--ev-muted);
}
.rec-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rec-time { flex: 0 0 auto; }
.rec-actions { display: flex; gap: 12px; margin-top: 7px; }
.rec-link, .rec-del {
  padding: 0; background: none; border: none;
  font-size: 11.5px; cursor: pointer; font-family: inherit;
}
.rec-link { color: var(--ev-accent); }
.rec-link:hover { text-decoration: underline; }
.rec-del { color: var(--ev-muted); }
.rec-del:hover { color: var(--ev-danger); }
</style>
