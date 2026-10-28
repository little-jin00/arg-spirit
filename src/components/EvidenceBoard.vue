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
      <p v-if="!cards.length" class="ev-empty">尚未收集任何证据。</p>
      <div v-for="c in cards" :key="c.key" class="ev-card">
        <div class="ev-title">{{ c.title }}</div>
        <div class="ev-meta">来源：{{ c.source }}<template v-if="c.time"> · {{ c.time }}</template></div>
        <div class="ev-desc">{{ c.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGameStore } from '../stores/game'
import { EVIDENCE } from '../data/evidence'

const store = useGameStore()
const open = ref(false)
const cards = computed(() => store.evidenceIds.map((id) => ({ key: id, ...EVIDENCE[id] })).filter((c) => c.title))
</script>

<style scoped>
.ev-wrap { position: fixed; left: 16px; bottom: 16px; z-index: 90; }
.ev-btn {
  background: #14161a; color: #cfd8dc;
  border: 1px solid #37474f; border-radius: 4px;
  padding: 8px 14px; font-size: 13px; cursor: pointer;
}
.ev-btn b { color: #ff7043; }
.ev-btn:hover { border-color: #ff7043; }
.ev-drawer {
  position: absolute; left: 0; bottom: 46px;
  width: 340px; max-height: 70vh; overflow-y: auto;
  background: #14161a; border: 1px solid #37474f; border-radius: 6px;
  padding: 14px; box-shadow: 0 8px 30px rgba(0,0,0,0.6);
}
.ev-head { display: flex; justify-content: space-between; align-items: center; }
.ev-head h3 { margin: 0 0 8px; color: #ffab91; font-size: 15px; }
.ev-close { background: none; border: none; color: #90a4ae; font-size: 20px; cursor: pointer; }
.ev-empty { color: #78909c; font-size: 12px; }
.ev-card {
  background: #1c1f24; border-left: 3px solid #ff7043;
  border-radius: 3px; padding: 10px; margin-bottom: 10px;
}
.ev-title { color: #ffccbc; font-size: 13px; font-weight: bold; }
.ev-meta { color: #78909c; font-size: 11px; margin: 4px 0; }
.ev-desc { color: #cfd8dc; font-size: 12px; line-height: 1.6; }
</style>
