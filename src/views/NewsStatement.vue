<template>
  <div class="stmt">
    <header class="s-head">
      <router-link
        to="/news"
        class="back"
      >← 返回新闻中心</router-link>
      <span>官方声明</span>
    </header>

    <article class="s-body">
      <h1>关于网传失联记者曾到访本园的说明</h1>
      <p class="s-meta">科赛雷诺科技 · 余晖乐园运营部 ｜ 2024年9月12日</p>

      <p>近日，网络平台流传"某媒体实习记者在城西调查期间失联，疑与本园有关"的不实信息。本园郑重声明：</p>

      <p><b>一</b>、该记者（陈某，31岁）于2024年10月3日持有效门票到访本园，监控显示其于当日17:42正常离园。本园已全力配合警方调查。
      </p>

      <p><b>二</b>、网传"本园与多起失踪案有关"系恶意造谣。相关信息源自主流网络论坛<a
          href="#"
          class="forum-link"
          @click.prevent="showExitTip = true"
        >"暮色论坛"</a>（已停运）的历史帖子，本园法务部已完成证据固定，将依法追究造谣者责任。</p>

      <p><b>三</b>、本园开业六年来安全运营，累计接待游客超800万人次，敬请广大游客勿信谣、勿传谣。</p>

      <p class="s-sign">科赛雷诺科技 · 余晖乐园运营部<br />2024年9月12日</p>
    </article>

    <footer class="s-foot">© 2018–2024 科赛雷诺科技 · 余晖乐园</footer>

    <!-- 站外跳转提示 -->
    <div
      v-if="showExitTip"
      class="s-modal-mask"
      @click.self="showExitTip = false"
    >
      <div class="s-modal">
        <h3>您正在离开余晖乐园官网</h3>
        <p class="s-modal-url">即将访问：dusk-bbs.citygroup.net（第三方网站）</p>
        <p>本园不对第三方网站内容的真实性、安全性负责。请谨慎辨别网络信息，注意保护个人信息安全。</p>
        <div class="s-modal-btns">
          <button
            class="btn-cancel"
            @click="showExitTip = false"
          >取消</button>
          <button
            class="btn-go"
            @click="goForum"
          >继续访问</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showExitTip = ref(false)

function goForum () {
  showExitTip.value = false
  window.open('/forum', '_blank')
}
</script>

<style scoped>
.stmt {
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 20px 60px;
}
.s-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 3px solid var(--accent);
  font-size: 14px;
}
.back {
  color: var(--link);
  text-decoration: none;
}
.s-body {
  margin-top: 26px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 30px 36px;
}
h1 {
  font-size: 21px;
  color: #1a1a1a;
  margin: 0 0 8px;
}
.s-meta {
  font-size: 12px;
  color: #999;
  border-bottom: 1px dashed var(--border);
  padding-bottom: 14px;
}
.s-body p {
  font-size: 14.5px;
  line-height: 2.1;
  color: #333;
}
.s-body b {
  color: #1a1a1a;
}
.forum-link {
  color: var(--link);
}
.s-sign {
  text-align: right;
  color: #777;
  margin-top: 26px;
}
.s-foot {
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  color: #999;
}

/* 站外跳转提示 */
.s-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.s-modal {
  background: #fff;
  border-radius: 8px;
  padding: 26px 30px;
  max-width: 420px;
}
.s-modal h3 {
  font-size: 16px;
  color: #1a1a1a;
  margin-bottom: 12px;
}
.s-modal-url {
  font-family: Consolas, monospace;
  font-size: 13px;
  color: #888;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 8px 10px;
  margin-bottom: 12px;
}
.s-modal p {
  font-size: 13px;
  color: #666;
  line-height: 1.8;
}
.s-modal-btns {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
.s-modal-btns button {
  padding: 8px 22px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}
.btn-cancel {
  background: #fff;
  border: 1px solid #ddd;
  color: #666;
}
.btn-go {
  background: var(--accent);
  border: none;
  color: #fff;
}
</style>
