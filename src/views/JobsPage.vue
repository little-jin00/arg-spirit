<template>
  <div class="page">
    <CeresHeader active="jobs" />

    <div class="p-hero">
      <div class="wrap">
        <div class="eyebrow">
          CAREERS
        </div>
        <h1>加入科赛雷诺</h1>
        <p>我们相信，科技让快乐更持久。加入我们，收获行业顶尖的回报。</p>
      </div>
    </div>

    <div class="wrap p-body">
      <h2>薪酬与福利</h2>
      <ul class="benefits">
        <li>薪资为行业平均的 <b>3倍</b></li>
        <li>医疗保险绑定"科赛雷诺意识健康计划"（离职即失去保障）</li>
        <li>员工入园无限量 · 家属半价</li>
        <li>六险一金 · 年终奖 4 个月起</li>
      </ul>

      <h2>公司大事记</h2>
      <ul class="timeline">
        <li><b>2013</b> —— 创始人 Dr. Sylvie Kessler 荣获神经科学年度人物</li>
        <li><b>2015</b> —— 科赛雷诺科技正式成立</li>
        <li><b>2018-05</b> —— 余晖乐园盛大开园</li>
        <li><b>2021</b> —— Alexander Cross 出任 CEO，开启全球化战略</li>
      </ul>
      <p class="more">
        <router-link to="/inside/leadership">了解管理团队 →</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import CeresHeader from '../components/CeresHeader.vue'
</script>

<style scoped>
.wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 28px;
}
.p-hero {
  background: radial-gradient(
      700px 300px at 82% 0%,
      #e8f2ff 0%,
      rgba(232, 242, 255, 0) 70%
    ),
    linear-gradient(180deg, #f7fbff 0%, #ffffff 100%);
  border-bottom: 1px solid #e6eef8;
  padding: 58px 0 44px;
}
.eyebrow {
  font-size: 12px;
  letter-spacing: 2.4px;
  color: #1657c9;
  font-weight: 600;
  margin-bottom: 12px;
}
.p-hero h1 {
  font-size: 38px;
  color: #0b2a5b;
  margin: 0 0 12px;
  font-weight: 800;
}
.p-hero p {
  font-size: 14.5px;
  color: #5a6b85;
  margin: 0;
}
.p-body {
  padding-top: 16px;
  padding-bottom: 90px;
}
h2 {
  font-size: 18px;
  color: #0b2a5b;
  margin-top: 38px;
  margin-bottom: 14px;
  padding-left: 0;
  border-left: none;
  position: relative;
}
h2::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #1657c9;
  border-radius: 2px;
  margin-right: 10px;
  vertical-align: -2px;
}
.benefits {
  font-size: 14px;
  line-height: 2.2;
  color: #3d4b63;
}
.benefits b {
  color: #c62828;
}
.timeline {
  font-size: 14px;
  line-height: 2.2;
  color: #3d4b63;
  list-style: none;
  padding-left: 6px;
}
.timeline b {
  color: #7b8ba6;
  margin-right: 8px;
  font-family: Consolas, monospace;
}
.more a {
  font-size: 13px;
  color: #1657c9;
  text-decoration: none;
}
.note {
  font-size: 13px;
  color: #5a6b85;
  background: #f5f9ff;
  border: 1px dashed #cfe0f8;
  padding: 14px 18px;
  border-radius: 8px;
  line-height: 1.95;
}
</style>
