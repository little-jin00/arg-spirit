<template>
  <div class="page">
    <CeresHeader />

    <div class="wrap p-body">
      <nav class="crumb">
        <router-link to="/inside">首页</router-link>
        <span>/</span>
        <span class="cur">IT 服务台</span>
      </nav>

      <div class="kb-meta">
        <span class="kb-id">KB-1002</span>
        <span>分类：入职指引</span>
        <span>更新于 2023-04-11</span>
      </div>
      <h1>账号与密码常见问题</h1>

      <div class="qa">
        <h3>Q：我的员工账号是什么格式？</h3>
        <p>
          员工邮箱格式为：<b>名.姓@ceres-reynold.com</b>（全小写）。内部系统登录账号即为邮箱前缀。<br>
          例：张三 → 邮箱 san.zhang@ceres-reynold.com，登录账号 san.zhang
        </p>
      </div>

      <div class="qa">
        <h3>Q：初始密码是什么？</h3>
        <p>
          初始密码规则：<b>名字拼音（首字母大写）+ 完整出生日期（8位）</b>。<br>
          例：张三，1990年5月6日出生 → San19900506<br>
          首次登录后系统将强制要求修改密码。
        </p>
      </div>

      <div class="qa">
        <h3>Q：密码输错多次会怎样？</h3>
        <p>
          连续输错 5 次，账号将被锁定并<b>自动上报安全团队</b>。如需解锁，请联系 IT 服务台。
        </p>
      </div>

      <div class="qa">
        <h3>Q：如何联系 IT 服务台？</h3>
        <p>
          分机 8099 · it-support@ceres-reynold.com（工作日 9:00–18:00）
        </p>
      </div>

      <p class="kb-foot">
        本知识库条目面向全体员工公开 · 文档安全等级：内部公开
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
.p-body {
  padding-top: 26px;
  padding-bottom: 90px;
}
.crumb {
  font-size: 12px;
  color: #a9b8cd;
  display: flex;
  gap: 8px;
  margin-bottom: 26px;
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
.kb-meta {
  display: flex;
  gap: 18px;
  font-size: 12px;
  color: #7b8ba6;
  margin-bottom: 12px;
}
.kb-id {
  font-family: Consolas, monospace;
  background: #eaf2ff;
  color: #1657c9;
  padding: 2px 8px;
  border-radius: 4px;
}
h1 {
  font-size: 30px;
  color: #0b2a5b;
  margin: 0 0 30px;
  font-weight: 800;
}
.qa {
  background: #f5f9ff;
  border: 1px solid #e6eef8;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
}
.qa h3 {
  font-size: 15px;
  color: #0b2a5b;
  margin: 0 0 10px;
}
.qa p {
  font-size: 14px;
  line-height: 2;
  color: #3d4b63;
  margin: 0;
}
.qa b {
  color: #1657c9;
}
.kb-foot {
  margin-top: 34px;
  font-size: 12px;
  color: #a9b8cd;
  border-top: 1px solid #e6eef8;
  padding-top: 14px;
}
</style>
