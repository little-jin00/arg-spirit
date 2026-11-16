<template>
  <div class="profile">
    <header class="p-head">
      <router-link
        to="/forum"
        class="back"
      >← 返回论坛</router-link>
      <span>用户资料</span>
    </header>

    <template v-if="profile">
      <section class="p-card">
        <div class="p-avatar">
          {{ profile.avatar }}
        </div>
        <div class="p-main">
          <h1>{{ profile.name }}</h1>
          <p class="p-bio">{{ profile.bio }}</p>
          <p class="p-meta">
            注册于 {{ profile.registered }}　｜　最后访问 {{ profile.lastVisit }}　｜　帖子 {{ profile.posts }}
          </p>
        </div>
      </section>

      <section class="p-sec">
        <h2>个人资料</h2>
        <div class="p-row">
          <span class="p-label">注册邮箱</span>
          <span class="p-value">
            {{ profile.emailMasked }}<i>@{{ profile.emailDomain }}</i>
          </span>
        </div>
        <div class="p-row">
          <span class="p-label">签名</span>
          <span class="p-value">
            {{ profile.signature }}
            <button
              class="sig-his"
              @click="toggleHistory"
            >签名于 {{ profile.signatureEdited }} 编辑过（历史 {{ profile.signatureHistory.length }}）</button>
          </span>
        </div>
        <div
          v-if="showHistory"
          class="sig-box"
        >
          <div
            v-for="(h, i) in profile.signatureHistory"
            :key="i"
            class="sig-line"
          >
            <span class="sig-date">{{ h.date }}</span>
            <span class="sig-text">{{ h.text }}</span>
          </div>
        </div>
      </section>

      <section class="p-sec">
        <h2>收藏夹</h2>
        <div
          v-for="(f, i) in profile.favorites"
          :key="i"
          class="fav"
        >
          <div class="fav-top">
            <span class="fav-title">{{ f.title }}</span>
            <span class="fav-date">{{ f.date }}</span>
          </div>
          <p class="fav-ex">
            {{ f.excerpt }}
          </p>
        </div>
      </section>

      <section class="p-sec">
        <h2>留言板</h2>
        <div
          v-for="(g, i) in profile.guestbook"
          :key="i"
          class="gb"
        >
          <div class="gb-top">
            <span class="gb-name">{{ g.name }}</span>
            <span class="gb-date">{{ g.date }}</span>
          </div>
          <p>{{ g.text }}</p>
        </div>
        <p class="p-empty">
          留言仅保留最近 2 条。
        </p>
      </section>

      <section class="p-sec">
        <h2>访客记录</h2>
        <ul class="visitors">
          <li
            v-for="(v, i) in profile.visitors"
            :key="i"
          >
            <span>{{ v.name }}</span>
            <span class="v-date">{{ v.date }}</span>
          </li>
          <li class="me">
            <span>你</span>
            <span class="v-date">今天</span>
          </li>
        </ul>
      </section>
    </template>

    <div
      v-else
      class="p-missing"
    >
      <p>该用户不存在，或资料不完整。</p>
      <router-link to="/forum">
        返回论坛
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '../stores/game'
import { PROFILES } from '../data/forumProfiles'

const route = useRoute()
const store = useGameStore()

const profile = computed(() => PROFILES[route.params.slug] || null)
const showHistory = ref(false)

function toggleHistory () {
  showHistory.value = !showHistory.value
  if (showHistory.value) store.markEvent('e09_profile_solved')
}
</script>

<style scoped>
.profile {
  max-width: 860px; margin: 0 auto; padding: 20px 16px 60px;
  font-family: "SimSun", "Songti SC", serif;
}
.p-head {
  display: flex; justify-content: space-between; align-items: center;
  border-bottom: 2px solid var(--border); padding-bottom: 10px; font-size: 14px;
}
.back { color: var(--link); text-decoration: none; }

.p-card {
  display: flex; gap: 18px; align-items: flex-start;
  margin-top: 16px; background: var(--panel);
  border: 1px solid var(--border); padding: 20px 24px;
}
.p-avatar {
  width: 56px; height: 56px; flex: none;
  display: flex; align-items: center; justify-content: center;
  background: #e7dfcc; border: 1px solid var(--border);
  color: #7a6a55; font-size: 24px; font-family: Georgia, serif;
}
.p-main h1 { margin: 0 0 4px; font-size: 19px; color: #4a3f35; }
.p-bio { margin: 0 0 6px; font-size: 13px; color: #6b5f52; }
.p-meta { margin: 0; font-size: 12px; color: #999; }

.p-sec {
  margin-top: 16px; background: var(--panel);
  border: 1px solid var(--border); padding: 14px 24px 16px;
}
.p-sec h2 {
  margin: 0 0 10px; font-size: 14px; color: #4a3f35;
  border-bottom: 1px dashed var(--border); padding-bottom: 8px;
}
.p-row {
  display: flex; gap: 16px; font-size: 13px; line-height: 1.9; margin-bottom: 4px;
}
.p-label { flex: none; width: 68px; color: #999; }
.p-value { color: #4a3f35; }
.p-value i { font-style: normal; color: #8a7f6f; }
.sig-his {
  display: inline-block; margin-left: 8px; padding: 0;
  background: none; border: 0; font-family: inherit;
  font-size: 11.5px; color: #a09484; cursor: pointer;
  border-bottom: 1px dotted #c9bfae;
}
.sig-his:hover { color: var(--link); }
.sig-box {
  margin-top: 8px; border: 1px dashed var(--border);
  background: #fbf8f1; padding: 10px 12px;
}
.sig-line { display: flex; gap: 12px; font-size: 12.5px; line-height: 1.9; }
.sig-date { flex: none; color: #a09484; }
.sig-text { color: #4a3f35; }

.fav { padding: 6px 0; border-bottom: 1px dashed var(--border); }
.fav:last-child { border-bottom: 0; }
.fav-top { display: flex; justify-content: space-between; gap: 12px; }
.fav-title { font-size: 13px; color: var(--link); }
.fav-date { flex: none; font-size: 11.5px; color: #a09484; }
.fav-ex { margin: 4px 0 0; font-size: 12.5px; color: #6b5f52; line-height: 1.8; }

.gb { padding: 7px 0; border-bottom: 1px dashed var(--border); }
.gb:last-of-type { border-bottom: 0; }
.gb-top { display: flex; justify-content: space-between; gap: 12px; }
.gb-name { font-size: 12.5px; color: #6b5f52; }
.gb-date { font-size: 11.5px; color: #a09484; }
.gb p { margin: 3px 0 0; font-size: 13px; color: #4a3f35; line-height: 1.8; }
.p-empty { margin: 10px 0 0; font-size: 11.5px; color: #a09484; }

.visitors { list-style: none; margin: 0; padding: 0; }
.visitors li {
  display: flex; justify-content: space-between; gap: 12px;
  font-size: 12.5px; color: #6b5f52; line-height: 2;
  border-bottom: 1px dashed var(--border);
}
.visitors li:last-child { border-bottom: 0; }
.v-date { color: #a09484; }
.visitors .me { color: #8a7f6f; }

.p-missing {
  margin-top: 40px; text-align: center; font-size: 14px; color: #6b5f52;
}
.p-missing a { color: var(--link); }
</style>
