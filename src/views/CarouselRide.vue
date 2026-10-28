<template>
  <div
    class="page"
    @mouseup="checkSelection"
  >
    <CeresHeader active="solutions" />

    <div class="wrap p-body">
      <nav class="crumb">
        <router-link to="/inside">首页</router-link>
        <span>/</span>
        <router-link to="/inside#solutions">解决方案</router-link>
        <span>/</span>
        <span class="cur">沉浸式体验 · 余晖乐园</span>
      </nav>

      <h1>旋转木马</h1>
      <p class="sub">余晖乐园 · 家庭游乐设施（示范园区）</p>
      <p class="intro">
        经典双层旋转木马，落成于2018年开园之际。纯手工雕花木马 × 24匹，
        配以瑞士八音盒机芯，是余晖乐园最受欢迎的家庭游乐设施之一。
      </p>
      <ul class="info">
        <li>运营时间：09:30 – 18:00</li>
        <li>身高限制：1.1m 以上可独自乘坐</li>
        <li>票价：included in 通票</li>
        <li>建议游玩时长：8 分钟</li>
      </ul>
      <div class="quote">
        "当八音盒响起，孩子们会安静下来。这几乎是一种魔法。"
        —— 《旅游周刊》2019年6月刊
      </div>

      <!-- "档案"标题：正常字号 + 极浅灰，页面上若隐若现（诱饵）；
           正文 2px 透明，不选中完全不可见。 -->
      <div class="hidden-memo">
        <p class="memo-title">档案</p>
        ――――――――――
        © 2018 Ceres Reynold. 旋转木马下方为"员工维护通道"。
        维护记录请联系：marcus.thorne@ceres-reynold.com
        【内部】低频诱导场参数：2.3Hz alpha wave modulation
        【内部】潜意识采集模块：正常运行中
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '../stores/game'
import CeresHeader from '../components/CeresHeader.vue'

const store = useGameStore()
const found = ref(false)

function checkSelection () {
  const sel = window.getSelection().toString()
  if (!found.value && /低频诱导|marcus\.thorne|员工维护通道/.test(sel)) {
    found.value = true
    store.addEvidence('ev_carousel_memo')
    store.setChoice('c2_carousel_found', true)
  }
}

onMounted(() => document.addEventListener('selectionchange', checkSelection))
onUnmounted(() => document.removeEventListener('selectionchange', checkSelection))
</script>

<style scoped>
.wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 28px;
}
.p-body {
  padding-top: 26px;
  padding-bottom: 90px;
}
.crumb {
  font-size: 12px;
  color: #a9b8cd;
  display: flex;
  gap: 8px;
  margin-bottom: 22px;
}
.crumb a {
  color: #7b8ba6;
  text-decoration: none;
}
.crumb a:hover {
  color: #1657c9;
}
.crumb .cur {
  color: #1657c9;
}
h1 {
  color: #0b2a5b;
  margin: 0 0 6px;
  font-size: 34px;
  font-weight: 800;
}
.sub {
  font-size: 13px;
  color: #7b8ba6;
  margin: 0 0 22px;
}
.intro {
  font-size: 15px;
  line-height: 2;
  color: #3d4b63;
}
.info {
  font-size: 14px;
  line-height: 2.2;
  color: #5a6b85;
}
.quote {
  margin-top: 22px;
  padding: 16px 20px;
  background: #f5f9ff;
  border-left: 4px solid #1657c9;
  font-size: 13px;
  color: #7b8ba6;
  font-style: italic;
}

/* 全选才可见的隐藏文字 */
.hidden-memo {
  margin-top: 30px;
  font-size: 2px;
  color: transparent;
  user-select: text;
  line-height: 1.4;
}
.hidden-memo::selection {
  background: #000;
  color: #fff;
}
/* 标题是"明文的痕迹"：正常字号、极浅灰，若隐隐现 */
.memo-title {
  font-size: 8px;
  color: #eceff4C0;
  margin: 0 0 4px;
  letter-spacing: 2px;
}
.memo-title::selection {
  background: #000;
  color: #fff;
}
</style>
