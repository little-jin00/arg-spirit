<template>
  <div class="denied">
    <div class="box">
      <h1>ACCESS DENIED</h1>
      <div class="err-lines">
        <p>[ERROR] Insufficient clearance level. (L3 required, current: L1-VISITOR)</p>
        <p>[INFO] 存储分区已加密 · MAYA-05</p>
        <p>[WARN] 本次访问已记录 · {{ store.fingerprint }}</p>
      </div>
      <p class="note">—— 本区域尚未开放 ——</p>
      <router-link to="/inside/admin/terminal" class="back">← 返回终端</router-link>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game'
const store = useGameStore()
</script>

<style scoped>
.denied {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  background: #0a0a0a;
}
.box { width: 560px; max-width: 92vw; }
h1 {
  font-family: Consolas, monospace; font-size: 30px;
  color: #e74c3c; letter-spacing: 4px; margin: 0 0 22px;
}
.err-lines p {
  font-family: Consolas, monospace; font-size: 13px;
  color: #b8d8b8; line-height: 2; margin: 0;
}
.note { margin-top: 34px; color: #5f7a5f; font-size: 13px; }
.back { color: #00ff41; font-size: 13px; text-decoration: none; }
.back:hover { text-decoration: underline; }
</style>
