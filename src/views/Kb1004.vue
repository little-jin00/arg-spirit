<template>
  <div class="page">
    <CeresHeader />

    <div class="wrap p-body">
      <nav class="crumb">
        <router-link to="/inside">首页</router-link>
        <span>/</span>
        <router-link to="/inside/help">IT 服务台</router-link>
        <span>/</span>
        <span class="cur">KB-1004</span>
      </nav>

      <div class="kb-meta">
        <span class="kb-id">KB-1004</span>
        <span>分类：账号与权限</span>
        <span class="archived">已归档 · 2021-04-01 停止维护</span>
      </div>
      <h1>账号找回（旧系统）</h1>

      <div class="qa">
        <h3>归档说明</h3>
        <p>
          本文档描述的本地账号找回流程已于 2021 年随节点 CR-PARK-01 下线停止使用。<br>
          CeresOS 4.7 起，口令重置与身份验证由安全运营部统一处理（见 CR-INF-002 第 7.3 条）。<br>
          如无法通过身份验证，请联系 IT 服务台（分机 8099）。
        </p>
      </div>

      <div class="qa">
        <h3>以下为归档时保留的原始内容</h3>
        <p>
          1. 在登录页输入员工账号，选择「找回口令」。<br>
          2. 若提示「账号不存在」，确认账号为邮箱前缀（名.姓）。<br>
          3. 系统将依次出示两项身份验证问题。问题与答案由员工在入职时自行设置，系统只保存答案摘要，不保存原文。<br>
          4. 验证通过后，可在原页面设置新口令。<br>
          5. 连续三次未通过，请填写《账号恢复申请表》，由直属主管签字后交至安全运营部。
        </p>
      </div>

      <p class="kb-foot">
        归档注记：节点 CR-PARK-01 的迁移记录未做备份。<br>
        末次编辑：k.s · 2021-03-19 04:02
      </p>

      <p class="stray">给他留的。他要是真回来，不会走这一页。</p>
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
.archived {
  color: #9a7b4f;
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
.kb-foot {
  margin-top: 34px;
  font-size: 12px;
  color: #a9b8cd;
  border-top: 1px solid #e6eef8;
  padding-top: 14px;
  line-height: 1.9;
}
.stray {
  margin-top: 12px;
  font-size: 12px;
  color: #cfd8e4;
}
</style>
