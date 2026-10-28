<template>
  <div
    class="viewer"
    @mouseup="onSelect"
  >
    <div class="v-bar">
      <span class="v-title">CR VIEWER v2.1</span>
      <span class="v-file">maya-05.scan · 2.1MB · 只读</span>
      <router-link
        to="/inside"
        class="v-back"
      >关闭</router-link>
    </div>

    <div class="v-body">
      <div class="scan-wrap">
        <img
          :src="asset('images/maya-05-crayon.webp')"
          alt="maya-05 扫描件"
          class="scan-img"
          draggable="false"
        >
        <div class="scan-meta">
          <span>扫描时间：2018-04-02 09:14</span>
          <span>扫描设备：CR-SCAN-03</span>
          <span>分辨率：600dpi</span>
        </div>
      </div>

      <div class="annotation">
        <div class="a-head">
          <span class="a-tag">文件附言</span>
          <span class="a-meta">kessler.s · 2018-04-02 09:31</span>
        </div>
        <p class="a-text">
          她画出这个太阳的那天，我告诉她：只要太阳还在笑，妈妈就永远在你身边。
          她死了之后，我意识到——我骗了她。我不会永远在她身边。
          但如果这个太阳一直在笑，所有看到它的人都会想起她。
          这不够。但这是我仅有的。
        </p>
        <p class="a-text a-sub">
          设计部按原稿执行。不改变任何线条。
        </p>
      </div>

      <!-- 碎片：选中可见。标题极浅灰若隐若现，正文 2px 透明 -->
      <div class="frag">
        <div class="frag-title">页边注记</div>
        <p class="frag-body">
          她不喜欢豌豆汤。我记得。也许这是真的记忆。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '../stores/game'
import { asset } from '../utils/asset'

const store = useGameStore()

function onSelect () {
  const sel = window.getSelection()?.toString() || ''
  if (sel.includes('豌豆汤')) {
    store.addEvidence('ev_maya05')
  }
}
</script>

<style scoped>
.viewer {
  min-height: 100vh;
  background: #2b2f36;
  display: flex;
  flex-direction: column;
}
.v-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #1f2329;
  color: #9aa3ad;
  padding: 10px 20px;
  font-family: Consolas, monospace;
  font-size: 12px;
  border-bottom: 1px solid #14171b;
}
.v-title {
  color: #d7dde3;
  font-weight: bold;
  letter-spacing: 1px;
}
.v-file {
  flex: 1;
  color: #7d8791;
}
.v-back {
  color: #9aa3ad;
  text-decoration: none;
  border: 1px solid #3a4149;
  padding: 3px 14px;
  border-radius: 4px;
}
.v-back:hover {
  background: #3a4149;
  color: #e4e9ee;
}

.v-body {
  flex: 1;
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding: 36px 24px 80px;
}
.scan-wrap {
  background: #f4f1e8;
  border-radius: 4px;
  padding: 28px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.45);
}
.scan-img {
  display: block;
  width: 100%;
  border-radius: 2px;
}
.scan-meta {
  display: flex;
  gap: 22px;
  margin-top: 14px;
  font-family: Consolas, monospace;
  font-size: 11px;
  color: #9a9284;
}

.annotation {
  margin-top: 26px;
  background: #f8f6f0;
  border-radius: 4px;
  padding: 22px 26px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}
.a-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.a-tag {
  font-size: 11px;
  background: #1657c9;
  color: #fff;
  padding: 2px 8px;
  border-radius: 3px;
  letter-spacing: 1px;
}
.a-meta {
  font-family: Consolas, monospace;
  font-size: 11px;
  color: #8b8577;
}
.a-text {
  font-size: 14px;
  line-height: 2;
  color: #4a453c;
  margin: 0 0 10px;
}
.a-sub {
  color: #8b8577;
  font-size: 12.5px;
}

/* 页边注记：与旋转木马页"档案"同手法 */
.frag {
  margin-top: 40px;
  user-select: text;
}
.frag-title {
  font-size: 13px;
  color: #4a5058;
  letter-spacing: 2px;
  margin-bottom: 4px;
}
.frag-title::selection {
  background: #000;
  color: #fff;
}
.frag-body {
  font-size: 2px;
  color: transparent;
  line-height: 1.4;
  margin: 0;
}
.frag-body::selection {
  background: #000;
  color: #fff;
}
</style>
