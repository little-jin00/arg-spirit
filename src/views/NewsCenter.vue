<template>
  <div class="news">
    <header class="n-head">
      <router-link
        to="/"
        class="back"
      >← 返回首页</router-link>
      <span>新闻中心</span>
    </header>

    <div class="n-list">
      <router-link
        v-for="item in news"
        :key="item.title"
        :to="item.to || '#'"
        class="n-item"
        :class="{ clickable: item.to }"
        @click.prevent="!item.to && $event.preventDefault()"
      >
        <span class="n-date">{{ item.date }}</span>
        <span class="n-title">{{ item.title }}</span>
      </router-link>
    </div>

    <footer class="n-foot">© 2018–2024 科赛雷诺科技 · 余晖乐园</footer>
  </div>
</template>

<script setup>
const news = [
  { date: '2024-10-08', title: '万圣节夜场预告：惊魂古堡限时开放', to: '/park/news/halloween-2024' },
  { date: '2024-09-30', title: '国庆假期家庭套餐特惠', to: '/park/news/national-day-package' },
  { date: '2024-09-12', title: '【声明】关于网传失联记者曾到访本园的说明', to: '/news/reporter-statement' },
  { date: '2024-06-01', title: '儿童节活动回顾：千人亲子跑', to: '/park/news/children-day' },
  { date: '2024-03-15', title: '本园通过ISO27001信息安全认证', to: '/park/news/iso27001' }
]
</script>

<style scoped>
.news {
  max-width: 780px;
  margin: 0 auto;
  padding: 20px 20px 60px;
}
.n-head {
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
.n-list {
  margin-top: 20px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.n-item {
  display: flex;
  gap: 16px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: var(--text);
  font-size: 14px;
  cursor: default;
}
.n-item:last-child {
  border-bottom: none;
}
.n-item.clickable {
  cursor: pointer;
}
.n-item.clickable:hover {
  background: #f7f7f7;
}
.n-date {
  color: #999;
  font-family: Consolas, monospace;
  font-size: 13px;
  min-width: 90px;
}
.n-title {
  color: #333;
}
.n-foot {
  margin-top: 40px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
