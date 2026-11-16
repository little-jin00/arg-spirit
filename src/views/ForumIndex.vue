<template>
  <div class="forum">
    <header class="f-head">
      <div class="f-logo">暮色论坛 · 都市怪谈讨论区</div>
      <div class="f-right">
        <ForumSearchBox
          v-model="keyword"
          @search="onSearch"
        />
        <span class="f-dim">游客</span>
      </div>
    </header>

    <div class="f-banner">
      <!-- 2018年的置顶广告：点击永远404 -->
      <router-link
        to="/2018-ad"
        class="ad-link"
      >
        <ShiningSun :size="56" />
        <div class="ad-text">
          <b>余晖乐园 · 2018盛大开园</b>
          <span>家庭套票优惠中 → 让笑容照亮每一天</span>
        </div>
      </router-link>
    </div>

    <div class="f-stats">
      本月新帖 <b class="stat-red">1</b> · 总帖数 3847 · 今日浏览 12 次 · 数据归档于 2019-08-11
    </div>

    <div class="f-sort">
      <span
        :class="['sort-tab', { active: sortMode === 'reply' }]"
        @click="sortMode = 'reply'"
      >按回复数</span>
      <span
        :class="['sort-tab', { active: sortMode === 'time' }]"
        @click="sortMode = 'time'"
      >按发布时间</span>
    </div>

    <table class="f-table">
      <thead>
        <tr>
          <th class="col-topic">主题</th>
          <th class="col-author">作者</th>
          <th class="col-reply">回复</th>
          <th class="col-last">发布时间</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="t in sortedThreads"
          :key="t.slug"
          class="row-old row-click"
          @click="$router.push(`/forum/thread/${t.slug}`)"
        >
          <td class="col-topic">
            <span
              class="tag"
              :class="t.tagClass"
            >{{ t.tag }}</span> {{ t.title }}
          </td>
          <td class="col-author">{{ t.author }}</td>
          <td class="col-reply">{{ t.repliesTotal }}</td>
          <td class="col-last">{{ t.date }}</td>
        </tr>
      </tbody>
    </table>

    <div class="f-archive-note">更早的帖子未恢复，仅支持检索。</div>

    <div class="f-pages">‹ 上一页 · 1 · 下一页 ›</div>

    <footer class="f-foot">
      本论坛已于 2019-08-11 停止运营 · 数据只读归档
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ShiningSun from '../components/ShiningSun.vue'
import ForumSearchBox from '../components/ForumSearchBox.vue'
import { POSTS, isSearchOnly } from '../data/forumPosts'

const router = useRouter()
const sortMode = ref('reply')
const keyword = ref('')

function onSearch (q, year) {
  keyword.value = q
  const query = { q }
  if (year !== 'all') query.year = year
  router.push({ path: '/forum/search', query })
}

// 首页只列一屏的量；封存帖与更早的帖子只能检索
const allThreads = POSTS.filter((p) => !isSearchOnly(p))

const sortedThreads = computed(() => {
  const list = [...allThreads]
  if (sortMode.value === 'reply') {
    // 回复数降序，同数按时间新→旧
    list.sort((a, b) => b.repliesTotal - a.repliesTotal || b.date.localeCompare(a.date))
  } else {
    // 发布时间新→旧
    list.sort((a, b) => b.date.localeCompare(a.date))
  }
  return list
})
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
  border-bottom: 2px solid var(--border);
  padding-bottom: 10px;
}
.f-logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--accent);
}
.f-user {
  font-size: 13px;
}
.f-right {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}
.f-dim {
  color: #888;
}

.f-banner {
  margin: 14px 0;
}
.ad-link {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 12px 16px;
  text-decoration: none;
  color: var(--text);
}
.ad-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ad-text b {
  font-size: 16px;
  color: #e67e22;
}
.ad-text span {
  font-size: 13px;
  color: #666;
}

.f-stats {
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
  padding-left: 4px;
}
.stat-red {
  color: #c62828;
}

.f-sort {
  display: flex;
  gap: 0;
  margin-bottom: 6px;
  padding-left: 4px;
  font-size: 12px;
}
.sort-tab {
  padding: 3px 12px;
  border: 1px solid var(--border);
  background: var(--panel);
  color: #999;
  cursor: pointer;
}
.sort-tab:first-child {
  border-radius: 3px 0 0 3px;
}
.sort-tab:last-child {
  border-radius: 0 3px 3px 0;
  border-left: none;
}
.sort-tab.active {
  background: #eae6d8;
  color: #6a5f4a;
  font-weight: bold;
}

.f-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--panel);
  font-size: 14px;
}
.f-table th {
  background: #eae6d8;
  text-align: left;
  padding: 8px 10px;
  border-bottom: 2px solid var(--border);
  font-weight: normal;
  color: #666;
}
.f-table td {
  padding: 9px 10px;
  border-bottom: 1px solid var(--border);
}
.col-topic {
  width: 52%;
}
.col-author {
  width: 14%;
}
.col-reply {
  width: 10%;
}
.col-last {
  width: 24%;
}
.tag {
  display: inline-block;
  font-size: 11px;
  background: #9a8f7a;
  color: #fff;
  padding: 1px 6px;
  border-radius: 2px;
  margin-right: 6px;
}
.tag-notice {
  background: #8a2be2;
}

.row-old {
  color: #777;
}
.row-click {
  cursor: pointer;
}
.row-click:hover {
  background: #f2eee2;
}

.f-archive-note {
  margin-top: 12px;
  font-size: 12px;
  color: #a89c86;
  text-align: center;
  font-style: italic;
}

.f-pages {
  margin-top: 12px;
  text-align: center;
  font-size: 12px;
  color: #aaa;
  letter-spacing: 1px;
}

.f-foot {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
