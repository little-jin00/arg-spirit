<template>
  <div class="forum">
    <header class="f-head">
      <router-link
        to="/forum"
        class="f-logo"
      >暮色论坛 · 都市怪谈讨论区</router-link>
      <ForumSearchBox
        v-model="keyword"
        :year="year"
        @search="onSearch"
      />
    </header>

    <div class="f-stats">
      只读归档检索 · 本区共 {{ ARCHIVE_TOTAL }} 帖 · 可检索 {{ SEARCHABLE_COUNT }} 帖（2017 年换服务器后仅部分恢复）
    </div>

    <div class="year-filter">
      <span
        v-for="opt in yearOptions"
        :key="opt.key"
        :class="['y-chip', { active: year === opt.key }]"
        @click="setYear(opt.key)"
      >{{ opt.label }}</span>
    </div>

    <div
      v-if="!hasQuery"
      class="s-hint"
    >
      输入关键词检索归档。可以试试：
      <span
        v-for="s in SUGGESTIONS"
        :key="s"
        class="s-sug"
        @click="useSuggestion(s)"
      >{{ s }}</span>
    </div>

    <template v-else>
      <div class="s-count">
        {{ countText }}
      </div>

      <div
        v-if="!results.length"
        class="s-empty"
      >
        没有找到匹配的帖子。<br />
        2017 年换服务器后，大部分旧帖没有恢复；换一个说法，或试试上面的词。
      </div>

      <table
        v-else
        class="f-table"
      >
        <thead>
          <tr>
            <th class="col-topic">主题</th>
            <th class="col-author">作者</th>
            <th class="col-last">发布时间</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="p in visible"
            :key="p.slug"
            class="row-old row-click"
            @click="openPost(p)"
          >
            <td class="col-topic">
              <span
                class="tag"
                :class="p.tagClass"
              >{{ p.tag }}</span> {{ p.title }}
              <span
                v-if="isSearchOnly(p)"
                class="s-sealed"
              >已封存</span>
              <div class="s-ex">
                {{ excerpt(p) }}
              </div>
            </td>
            <td class="col-author">{{ p.author }}</td>
            <td class="col-last">{{ p.date }}</td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="results.length > 20"
        class="s-more"
      >
        结果较多，只显示前 20 条。加一个词，或按年份筛选。
      </div>
    </template>

    <footer class="f-foot">
      <router-link to="/forum">‹ 返回帖子列表</router-link> · 本论坛已于 2019-08-11 停止运营 · 数据只读归档
    </footer>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchPosts, SEARCHABLE_COUNT, ARCHIVE_TOTAL, SUGGESTIONS } from '../utils/forumSearch'
import { isSearchOnly } from '../data/forumPosts'
import ForumSearchBox from '../components/ForumSearchBox.vue'
import { recordSearch } from '../utils/searchHistory'

const route = useRoute()
const router = useRouter()

const keyword = ref(String(route.query.q || ''))
const year = ref(String(route.query.year || 'all'))

const yearOptions = [
  { key: 'all', label: '全部' },
  { key: '2018', label: '2018' },
  { key: '2019', label: '2019' },
  { key: 'earlier', label: '更早' }
]

const query = computed(() => String(route.query.q || '').trim())
const hasQuery = computed(() => query.value.length > 0)
const results = computed(() => searchPosts(query.value, year.value))
const visible = computed(() => results.value.slice(0, 20))

const countText = computed(() => {
  const n = results.value.length
  if (!n) return '找到 0 条。'
  if (n <= 3) return `找到 ${n} 条。归档不完整，可能还有没恢复的帖子。`
  if (n <= 20) return `找到 ${n} 条。`
  return `找到 ${n} 条。`
})

watch(() => route.query.q, (v) => { keyword.value = String(v || '') })
watch(() => route.query.year, (v) => { year.value = String(v || 'all') })

const SCROLL_PREFIX = 'forum_search_scroll:'

function scrollKey () {
  return SCROLL_PREFIX + year.value + '|' + query.value
}

function openPost (post) {
  try {
    sessionStorage.setItem(scrollKey(), String(window.scrollY))
  } catch (e) {}
  const q = { from: 'search' }
  if (query.value) q.q = query.value
  if (year.value !== 'all') q.year = year.value
  router.push({ path: `/forum/thread/${post.slug}`, query: q })
}

function restoreScroll () {
  try {
    const key = scrollKey()
    const saved = sessionStorage.getItem(key)
    if (saved === null) return
    sessionStorage.removeItem(key)
    requestAnimationFrame(() => window.scrollTo(0, Number(saved)))
  } catch (e) {}
}

onMounted(() => {
  nextTick(restoreScroll)
})

watch(() => [route.query.q, route.query.year], () => {
  nextTick(restoreScroll)
})

function apply (q, y) {
  const next = {}
  if (q) next.q = q
  if (y && y !== 'all') next.year = y
  router.push({ path: '/forum/search', query: next })
}

function onSearch (q, y) {
  keyword.value = q
  year.value = y
  apply(q, y)
}

function setYear (y) {
  year.value = y
  const q = keyword.value.trim() || query.value
  if (q) recordSearch(q, y)
  apply(q, y)
}

function useSuggestion (s) {
  keyword.value = s
  recordSearch(s, year.value)
  apply(s, year.value)
}

function excerpt (post) {
  const text = (post.body && post.body[0]) || (post.replies && post.replies[0] && post.replies[0].text) || ''
  return text.length > 72 ? text.slice(0, 72) + '…' : text
}
</script>

<style scoped>
.forum {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 16px 60px;
  font-family: "SimSun", "Songti SC", serif;
}
.f-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  border-bottom: 2px solid var(--border);
  padding-bottom: 10px;
}
.f-logo {
  font-size: 18px;
  font-weight: bold;
  color: var(--accent);
  text-decoration: none;
  white-space: nowrap;
}
.f-stats {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 6px 10px;
}
.year-filter {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  font-size: 12px;
}
.y-chip {
  color: #8a7f6d;
  cursor: pointer;
  padding: 1px 6px;
  border: 1px solid transparent;
}
.y-chip:hover {
  color: var(--accent);
}
.y-chip.active {
  border-color: var(--border);
  background: var(--panel);
  color: #4a3f35;
}
.s-hint {
  margin-top: 22px;
  font-size: 13px;
  color: #8a7f6d;
  line-height: 2;
}
.s-sug {
  color: var(--link);
  cursor: pointer;
  margin-right: 8px;
  text-decoration: underline;
}
.s-count {
  margin-top: 14px;
  font-size: 12px;
  color: #999;
}
.s-empty {
  margin-top: 14px;
  border: 1px dashed var(--border);
  background: var(--panel);
  padding: 20px 16px;
  font-size: 13px;
  color: #8a7f6d;
  line-height: 2;
}
.f-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 13px;
}
.f-table th {
  text-align: left;
  color: #999;
  font-weight: normal;
  border-bottom: 1px solid var(--border);
  padding: 6px;
  font-size: 12px;
}
.f-table td {
  border-bottom: 1px dashed var(--border);
  padding: 8px 6px;
  vertical-align: top;
}
.row-click {
  cursor: pointer;
}
.row-click:hover td {
  background: #faf8ef;
}
.col-topic {
  width: 62%;
}
.col-author {
  width: 18%;
  color: #8a7f6d;
}
.col-last {
  width: 20%;
  color: #aaa;
  font-family: Consolas, monospace;
  font-size: 12px;
}
.tag {
  display: inline-block;
  font-size: 11px;
  background: #9a8f7a;
  color: #fff;
  padding: 1px 6px;
  border-radius: 2px;
  margin-right: 4px;
}
.tag-notice {
  background: #8a2be2;
}
.s-sealed {
  display: inline-block;
  margin-left: 4px;
  padding: 0 4px;
  font-size: 11px;
  font-family: "SimSun", "Songti SC", serif;
  color: #9a8f7a;
  background: #f6f2e7;
  border: 1px solid #cfc6b4;
  vertical-align: 1px;
}
.s-ex {
  margin-top: 3px;
  font-size: 12px;
  color: #a89c86;
  line-height: 1.7;
}
.s-more {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  text-align: center;
}
.f-foot {
  margin-top: 26px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
.f-foot a {
  color: #8a7f6d;
  text-decoration: none;
}
</style>
