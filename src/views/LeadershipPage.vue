<template>
  <div class="page">
    <CeresHeader active="leadership" />

    <div class="p-hero">
      <div class="wrap">
        <div class="eyebrow">
          LEADERSHIP TEAM
        </div>
        <h1>管理团队</h1>
        <p>科赛雷诺科技的核心领导层，引领"意识健康"事业不断向前。</p>
      </div>
    </div>

    <div class="wrap p-body">
      <div
        v-for="p in people"
        :key="p.name"
        class="person"
      >
        <div class="avatar">{{ p.initial }}</div>
        <div class="info">
          <div class="name-row">
            <b class="name">{{ p.name }}</b>
            <span class="role">{{ p.role }}</span>
          </div>
          <div class="birth">出生：{{ p.birth }}</div>
          <p class="bio">{{ p.bio }}</p>
        </div>
      </div>

      <p class="update-note">
        本页面信息最后更新于 2021-03 · <router-link
          to="/inside/press"
          class="press-link"
        >媒体报道</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import CeresHeader from '../components/CeresHeader.vue'

const people = [
  {
    initial: 'K',
    name: 'Dr. Sylvie Kessler',
    role: '创始人',
    birth: '1962年11月',
    bio: '神经科学博士。2013年荣获神经科学年度人物。提出"情感AI辅助治疗"理念，主导公司早期核心技术研发；同年起，研究重心由临床治疗转向"意识健康"前沿领域。2021年起不再担任公司任何职务。'
  },
  {
    initial: 'M',
    name: 'Marcus Thorne',
    role: '副总裁 · 园区运营与安全',
    birth: '1969年3月',
    bio: '创始团队成员，全程参与余晖乐园的改造与运营体系建设，是业内最早的"沉浸式体验管理"实践者之一。'
  },
  {
    initial: 'C',
    name: 'Alexander Cross',
    role: '首席执行官',
    birth: '1976年8月',
    bio: '2021年出任CEO，此前为国际投资集团合伙人。上任后启动全球化战略，主导"Elysium"平台的战略规划与融资工作。'
  }
]
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
  padding-top: 8px;
  padding-bottom: 90px;
}
.person {
  display: flex;
  gap: 24px;
  padding: 30px 0;
  border-bottom: 1px solid #e6eef8;
}
.avatar {
  width: 78px;
  height: 78px;
  border-radius: 50%;
  background: linear-gradient(135deg, #eaf2ff, #d7e6fb);
  color: #1657c9;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.name-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}
.name {
  font-size: 19px;
  color: #0b2a5b;
}
.role {
  font-size: 13px;
  color: #1657c9;
}
.birth {
  font-size: 13px;
  color: #7b8ba6;
  font-family: Consolas, monospace;
  margin: 6px 0 12px;
}
.bio {
  font-size: 14px;
  color: #3d4b63;
  line-height: 2;
  margin: 0;
}
.update-note {
  margin-top: 30px;
  font-size: 12px;
  color: #a9b8cd;
  text-align: right;
}
.press-link {
  color: #1657c9;
  text-decoration: none;
}
@media (max-width: 640px) {
  .person {
    flex-direction: column;
    gap: 14px;
  }
}
</style>
