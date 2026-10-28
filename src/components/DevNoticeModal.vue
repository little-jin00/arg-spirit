<template>
  <div v-if="store.devNotice" class="notice-mask" @click.self="store.closeDevNotice()">
    <div class="notice-card">
      <div class="n-head">
        <span class="n-badge">试玩版</span>
        <span class="n-title">当前可玩内容到此结束</span>
      </div>
      <div class="n-body">
        <p>你已走到本次试玩版本的末尾。后续章节仍在制作中：</p>
        <ul>
          <li>第四章「循环」</li>
          <li>第五章「我是谁」</li>
          <li>第六章「三重门」</li>
        </ul>
        <p>如果愿意，希望能听到你的反馈：</p>
        <ul>
          <li>卡在了哪一步、哪条线索没想明白</li>
          <li>哪段文字或哪个页面让你觉得出戏</li>
          <li>发现的任何问题</li>
        </ul>
        <p class="n-tip">进度保存在当前浏览器本地。清除网站数据会丢失存档。</p>
      </div>
      <div class="n-foot">
        <button class="n-reset" @click="restart">从头开始</button>
        <button class="n-ok" @click="store.closeDevNotice()">知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game'
const store = useGameStore()

function restart () {
  if (!window.confirm('确定要清除本地存档、从头开始吗？')) return
  store.resetAll()
  const base = import.meta.env.BASE_URL
  window.location.replace(base + 'park')
}
</script>

<style scoped>
.notice-mask {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.notice-card {
  width: 520px;
  max-width: 100%;
  max-height: 86vh;
  overflow-y: auto;
  background: #0b0f0c;
  border: 1px solid #1e3a24;
  border-radius: 8px;
  padding: 22px 26px;
  font-family: Consolas, 'Courier New', monospace;
  color: #b8d8b8;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.65);
}
.n-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid #1e3a24;
}
.n-badge {
  font-size: 11px;
  letter-spacing: 1px;
  color: #66bb6a;
  border: 1px solid #2f5a36;
  border-radius: 3px;
  padding: 2px 7px;
}
.n-title {
  font-size: 15px;
  color: #dcedc8;
}
.n-body {
  font-size: 13px;
  line-height: 1.9;
  padding: 14px 0 4px;
}
.n-body p {
  margin: 0 0 8px;
}
.n-body ul {
  margin: 0 0 10px;
  padding-left: 20px;
  color: #8fae8f;
}
.n-tip {
  color: #5f7a5f;
  font-size: 12px;
  margin-top: 12px !important;
}
.n-foot {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 14px;
  border-top: 1px solid #1e3a24;
}
.n-foot button {
  font-family: inherit;
  font-size: 12.5px;
  padding: 7px 18px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #2f5a36;
  background: transparent;
  color: #8fae8f;
}
.n-foot button:hover {
  border-color: #66bb6a;
  color: #b8d8b8;
}
.n-ok {
  background: #2f5a36 !important;
  color: #e8f5e9 !important;
}
.n-ok:hover {
  background: #3d7046 !important;
}
</style>
