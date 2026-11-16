<template>
  <div class="thread">
    <header class="t-head">
      <router-link
        to="/forum"
        class="t-logo"
      >暮色论坛 · 都市怪谈讨论区</router-link>
      <span class="t-dim">游客</span>
    </header>

    <div
      v-if="post"
      class="t-body"
    >
      <a
        href="#"
        class="t-back"
        @click.prevent="goBack"
      >‹ {{ fromSearch ? '返回搜索结果' : '返回帖子列表' }}</a>
      <div class="t-path">
        <router-link to="/forum">论坛</router-link>
        <template v-if="fromSearch">
          / 搜索：{{ searchQuery }}<span v-if="year !== 'all'"> · {{ year }}</span>
        </template>
      </div>

      <h1 class="t-title">
        <span
          class="tag"
          :class="post.tagClass"
        >{{ post.tag }}</span>
        {{ post.title }}
      </h1>

      <!-- 楼主 -->
      <div class="t-post">
        <div class="t-post-head">
          <span class="t-author">{{ post.author }}</span>
          <span class="t-floor">楼主</span>
          <span class="t-date">{{ post.date }}</span>
        </div>
        <p
          v-if="!post.body || !post.body.length"
          class="t-text t-missing"
        >
          （正文在归档中缺失）
        </p>
        <p
          v-for="(p, i) in post.body"
          :key="i"
          class="t-text"
        >
          {{ p }}
        </p>
      </div>

      <!-- 回复 -->
      <div
        v-for="(r, i) in post.replies"
        :key="i"
        class="t-post t-reply"
      >
        <div class="t-post-head">
          <span class="t-author">{{ r.author }}</span>
          <span class="t-floor">{{ i + 2 }}楼</span>
          <span class="t-date">{{ r.date }}</span>
        </div>
        <p class="t-text">{{ r.text }}</p>
      </div>

      <div class="t-archive-note">
        本帖共 {{ post.repliesTotal }} 条回复 · 归档数据不完整，部分回复已丢失
      </div>

      <div
        v-if="archived"
        class="t-archived"
      >
        <div class="ta-head">归档状态</div>
        <div class="ta-line"><b>已封存</b> · 本条未收录于版块列表</div>
        <p>2017 年换服务器后仅恢复了部分旧帖。本页来自归档缓存，正文与回复可能不完整。</p>
      </div>

      <div class="t-locked">本帖已锁定，无法回复（论坛已停止运营）</div>
    </div>

    <div
      v-else
      class="t-body"
    >
      <p>帖子不存在或已被删除。</p>
      <router-link to="/forum">返回列表</router-link>
    </div>

    <footer class="t-foot">本论坛已于 2019-08-11 停止运营 · 数据只读归档</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { postBySlug, isSearchOnly } from '../data/forumPosts'

const route = useRoute()
const router = useRouter()

const post = computed(() => postBySlug(route.params.slug))
const archived = computed(() => isSearchOnly(post.value))

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
</script>

<style scoped>
.thread {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 16px 60px;
  font-family: "SimSun", "Songti SC", serif;
}
.t-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--border);
  padding-bottom: 10px;
}
.t-logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--accent);
  text-decoration: none;
}
.t-dim {
  font-size: 13px;
  color: #888;
}

.t-body {
  margin-top: 16px;
}
.t-back {
  font-size: 13px;
  color: #888;
  text-decoration: none;
}
.t-back:hover {
  color: var(--accent);
}
.t-path {
  margin-top: 4px;
  font-size: 12px;
  color: #a89c86;
}
.t-path a {
  color: #8a7f6d;
  text-decoration: none;
}
.t-path a:hover {
  color: var(--accent);
}

.t-title {
  margin-top: 12px;
  font-size: 19px;
  color: #4a3f35;
  font-weight: bold;
  line-height: 1.5;
}
.tag {
  display: inline-block;
  font-size: 11px;
  vertical-align: 2px;
  background: #9a8f7a;
  color: #fff;
  padding: 1px 6px;
  border-radius: 2px;
  margin-right: 6px;
}
.tag-notice {
  background: #8a2be2;
}

.t-post {
  margin-top: 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 14px 16px;
}
.t-post-head {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px dashed var(--border);
  padding-bottom: 8px;
  margin-bottom: 10px;
  font-size: 12px;
}
.t-author {
  color: var(--accent);
  font-weight: bold;
}
.t-floor {
  color: #aaa;
}
.t-date {
  color: #aaa;
  margin-left: auto;
  font-family: Consolas, monospace;
}
.t-text {
  font-size: 14px;
  color: #4a3f35;
  line-height: 1.9;
  margin-bottom: 8px;
}
.t-missing {
  color: #999;
  font-style: italic;
}
.t-reply {
  background: #faf8ef;
}

.t-archive-note {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: #b0a48e;
  font-style: italic;
}
.t-archived {
  margin-top: 12px;
  border: 1px solid var(--border);
  border-left: 3px solid #cfc6b4;
  background: #f6f2e7;
  padding: 10px 14px;
  font-size: 12px;
  color: #8a7f6d;
  line-height: 1.9;
}
.ta-head {
  font-size: 11px;
  color: #a89c86;
  letter-spacing: 1px;
  margin-bottom: 2px;
}
.ta-line b {
  color: #6b5f4e;
}
.t-archived p {
  margin: 4px 0 0;
  color: #9a8f7a;
}

.t-locked {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: #999;
  background: #f2eee2;
  border: 1px solid var(--border);
  padding: 8px;
}
.t-foot {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
