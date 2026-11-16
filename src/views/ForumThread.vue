<template>
  <div class="thread">
    <header class="t-head">
      <a
        href="#"
        class="back"
        @click.prevent="goBack"
      >{{ fromSearch ? '← 返回搜索结果' : '← 返回论坛' }}</a>
      <span>查看帖子</span>
    </header>

    <div class="t-crumb">
      <router-link to="/forum">论坛</router-link>
      <template v-if="fromSearch">
        / 搜索：{{ searchQuery }}<span v-if="year !== 'all'"> · {{ year }}</span>
      </template>
    </div>

    <div class="t-body">
      <h1>{{ post.title }}</h1>
      <div class="t-meta">
        <router-link
          to="/forum/user/e09"
          class="t-author"
        >{{ post.author }}</router-link>
        <span class="t-time">发表于 {{ post.date }} {{ post.time }}</span>
        <span class="t-floor">1楼</span>
      </div>
      <div class="t-text">
        <p
          v-for="(p, i) in post.body"
          :key="i"
        >
          {{ p }}
        </p>
      </div>
    </div>

    <div class="t-locked">
      本帖暂无回复 · 论坛已停运，无法回帖
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { postBySlug } from '../data/forumPosts'

const store = useGameStore()
const route = useRoute()
const router = useRouter()
const post = computed(() => postBySlug('e09'))

const fromSearch = computed(() => route.query.from === 'search')
const searchQuery = computed(() => String(route.query.q || ''))
const year = computed(() => String(route.query.year || 'all'))

function goBack () {
  const back = window.history.state && window.history.state.back
  if (fromSearch.value) {
    if (typeof back === 'string' && back.startsWith('/forum/search')) {
      router.back()
      return
    }
    const query = {}
    if (searchQuery.value) query.q = searchQuery.value
    if (year.value !== 'all') query.year = year.value
    router.push({ path: '/forum/search', query })
    return
  }
  if (back === '/forum') {
    router.back()
    return
  }
  router.push('/forum')
}

onMounted(() => {
  // 首次打开帖子：72小时真实倒计时开始；信号入证据板
  store.startTimer()
  store.addEvidence('ev_signal')
  store.setChoice('c1_1_opened', true)
  store.markEvent('forum_e09_opened')
})
</script>

<style scoped>
.thread {
  max-width: 860px; margin: 0 auto; padding: 20px 16px 60px;
  font-family: "SimSun", "Songti SC", serif;
}
.t-head {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid var(--border); padding-bottom: 10px; font-size: 14px;
}
.back { color: var(--link); text-decoration: none; }
.t-crumb {
  margin-top: 6px;
  font-size: 12px;
  color: #a89c86;
}
.t-crumb a {
  color: #8a7f6d;
  text-decoration: none;
}
.t-crumb a:hover {
  color: var(--accent);
}

.t-body {
  margin-top: 16px; background: var(--panel);
  border: 1px solid var(--border); padding: 20px 24px;
}
h1 { font-size: 19px; color: #4a3f35; margin: 0 0 10px; }
.t-meta { font-size: 12px; color: #999; display: flex; gap: 14px; border-bottom: 1px dashed var(--border); padding-bottom: 12px; }
.t-author { color: #c62828; font-weight: bold; text-decoration: none; }
.t-author:hover { text-decoration: underline; }
.t-text { font-size: 15px; line-height: 2.1; margin-top: 16px; color: #333; }
.t-text p { margin: 0 0 14px; }
.t-text p:last-child { margin-bottom: 0; }

.t-locked {
  margin-top: 14px; padding: 10px 16px;
  background: #e8e4d6; border: 1px dashed var(--border);
  font-size: 12px; color: #999; text-align: center;
}
</style>
