<template>
  <main class="records">
    <header class="rec-head">
      <div>
        <h1>记录</h1>
        <p>已归档的会话。未解锁的条目不会显示内容。</p>
      </div>
      <nav class="rec-nav">
        <router-link to="/inbox">邮局</router-link>
        <router-link to="/park">乐园</router-link>
      </nav>
    </header>

    <ul class="rec-list">
      <li
        v-for="e in ENDINGS"
        :key="e.id"
        class="rec-item"
        :class="{ locked: !unlocked(e.id), active: openId === e.id }"
      >
        <button
          class="rec-row"
          :disabled="!unlocked(e.id)"
          @click="toggle(e.id)"
        >
          <span class="rec-id">{{ unlocked(e.id) ? `第 ${orderOf(e.id)} 个` : '—' }}</span>
          <span class="rec-line">{{ unlocked(e.id) ? e.line : '— 未记录 —' }}</span>
          <span class="rec-arrow">{{ unlocked(e.id) ? (openId === e.id ? '−' : '+') : '·' }}</span>
        </button>
        <div
          v-if="openId === e.id && unlocked(e.id)"
          class="rec-detail"
        >
          <div
            v-for="(line, i) in e.last"
            :key="i"
            class="rec-last"
          >{{ line }}</div>
          <div
            v-if="e.subtitle"
            class="rec-sub"
          >{{ e.subtitle }}</div>
        </div>
      </li>
    </ul>

    <footer class="rec-foot">
      <span v-if="store.arg_ng_plus">二周目记录已保留。</span>
      <span v-else>完成一次会话后，这里会留下记录。</span>
    </footer>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '../stores/game'
import { ENDINGS } from '../data/chapters567'

const store = useGameStore()
store.init()

const openId = ref('')

function unlocked (id) {
  return store.arg_endings_v1.includes(id)
}

// 回看只显示先后序号（第 1 个、第 2 个），不显示日期与时长
function orderOf (id) {
  return store.arg_endings_v1.indexOf(id) + 1
}

function toggle (id) {
  openId.value = openId.value === id ? '' : id
}
</script>

<style scoped>
.records {
  min-height: 100vh;
  background: #050805;
  color: #b7c8bd;
  font-family: Consolas, "Courier New", monospace;
  padding: 48px clamp(20px, 8vw, 120px) 64px;
}

.rec-head {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  border-bottom: 1px solid #1b2a22;
  padding-bottom: 20px;
}

.rec-head h1 {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 4px;
  color: #e6f2ea;
}

.rec-head p {
  margin: 0;
  font-size: 12.5px;
  color: #5f7268;
}

.rec-nav {
  display: flex;
  gap: 14px;
  font-size: 12.5px;
}

.rec-nav a {
  color: #7fbf9b;
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.rec-nav a:hover {
  border-bottom-color: #7fbf9b;
}

.rec-list {
  list-style: none;
  margin: 28px 0 0;
  padding: 0;
}

.rec-item {
  border-bottom: 1px solid #121d17;
}

.rec-row {
  width: 100%;
  display: flex;
  align-items: baseline;
  gap: 18px;
  padding: 16px 4px;
  background: none;
  border: 0;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.rec-item.locked .rec-row {
  cursor: default;
  color: #3b4a42;
}

.rec-item.active .rec-row {
  color: #d9b25a;
}

.rec-id {
  width: 70px;
  flex: none;
  font-size: 12px;
  letter-spacing: 1px;
  color: #5f7268;
}

.rec-line {
  flex: 1;
  font-size: 13.5px;
}

.rec-arrow {
  flex: none;
  color: #4d6156;
}

.rec-detail {
  padding: 4px 4px 22px 70px;
  border-left: 1px solid #1b2a22;
  margin-left: 22px;
}

.rec-last {
  font-size: 12.5px;
  line-height: 1.9;
  color: #8fa79a;
}

.rec-sub {
  margin-top: 12px;
  font-size: 13px;
  letter-spacing: 1px;
  color: #d9b25a;
}

.rec-foot {
  margin-top: 40px;
  font-size: 11.5px;
  color: #45564c;
}
</style>
