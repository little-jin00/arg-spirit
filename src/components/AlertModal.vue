<template>
  <div v-if="store.alert" class="modal-mask" @click.self="store.closeAlert()">
    <div class="email-card">
      <div class="email-head">
        <div><b>发件人：</b>{{ store.alert.from }}</div>
        <div><b>标题：</b>{{ store.alert.subject }}</div>
        <div><b>时间：</b>{{ store.alert.time }}</div>
      </div>
      <hr />
      <pre class="email-body">{{ store.alert.body }}</pre>
      <div class="email-foot">
        <button @click="store.closeAlert()">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game'
const store = useGameStore()
</script>

<style scoped>
.modal-mask {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(0, 0, 0, 0.55);
  display: flex; align-items: center; justify-content: center;
}
.email-card {
  width: 480px; max-width: 92vw;
  background: #f7f7f7; color: #222;
  border-radius: 6px; padding: 18px 22px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}
.email-head { font-size: 13px; line-height: 1.9; color: #444; }
.email-head b { color: #111; }
hr { border: none; border-top: 1px solid #ddd; margin: 10px 0; }
.email-body {
  font-family: inherit; white-space: pre-wrap;
  font-size: 14px; line-height: 1.8; margin: 0;
  color: #333;
}
.email-foot { text-align: right; margin-top: 14px; }
.email-foot button {
  background: #37474f; color: #fff; border: none;
  padding: 7px 22px; border-radius: 4px; cursor: pointer; font-size: 13px;
}
.email-foot button:hover { background: #455a64; }
</style>
