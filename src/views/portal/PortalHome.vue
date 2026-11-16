<template>
  <PortalLayout>
    <h1 class="pg-title">
      门户首页
    </h1>
    <p class="pg-sub">
      2024 年 10 月 · 园区运营与安全
    </p>

    <div class="cards">
      <router-link
        to="/inside/portal/tickets"
        class="card"
      >
        <span class="k">待处理工单</span>
        <span class="v">{{ pending }}</span>
        <span class="f">交接流程自动生成</span>
      </router-link>
      <router-link
        to="/inside/portal/policies"
        class="card"
      >
        <span class="k">待办</span>
        <span class="v">1</span>
        <span class="f">待签署：合规规范签署页</span>
      </router-link>
      <router-link
        to="/inside/portal/announcements"
        class="card"
      >
        <span class="k">公告</span>
        <span class="v">{{ ANNOUNCEMENTS.length }}</span>
        <span class="f">最新：{{ latest.date }}</span>
      </router-link>
      <router-link
        to="/inside/portal/ops"
        class="card"
      >
        <span class="k">上月售票</span>
        <span class="v">{{ monthSold }}</span>
        <span class="f">2024-09 · 票务系统</span>
      </router-link>
    </div>

    <section class="block">
      <div class="blk-head">
        <h2>最近公告</h2>
        <router-link to="/inside/portal/announcements">全部 →</router-link>
      </div>
      <router-link
        v-for="a in ANNOUNCEMENTS.slice(0, 3)"
        :key="a.id"
        :to="`/inside/portal/announcements?doc=${a.id}`"
        class="row"
      >
        <span class="date">{{ a.date }}</span>
        <span class="tt">{{ a.title }}</span>
        <span class="dp">{{ a.dept }}</span>
      </router-link>
    </section>

    <section class="block">
      <div class="blk-head">
        <h2>系统</h2>
      </div>
      <div class="sys">
        <div class="sys-row">
          <span>文档中心</span>
          <span class="sys-right">
            <span class="ok">正常</span>
            <router-link to="/inside/portal/docs">打开 →</router-link>
          </span>
        </div>
        <div class="sys-row">
          <span>运维终端</span>
          <router-link to="/inside/portal/it">打开 →</router-link>
        </div>
      </div>
    </section>
  </PortalLayout>
</template>

<script setup>
import PortalLayout from '../../components/PortalLayout.vue'
import { ANNOUNCEMENTS, OPS_MONTHLY, TICKETS } from '../../data/portalData'

const pending = TICKETS.filter((t) => t.status === '待处理').length
const latest = ANNOUNCEMENTS[0]
const monthSold = OPS_MONTHLY[OPS_MONTHLY.length - 1].sold.toLocaleString()
</script>

<style scoped>
.pg-title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
}
.pg-sub {
  margin: 0 0 20px;
  font-size: 12.5px;
  color: var(--muted);
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 26px;
}
.card {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 18px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.card:hover {
  border-color: #c9d6e2;
}
.k {
  font-size: 12px;
  color: var(--muted);
}
.v {
  font-size: 26px;
  font-weight: 600;
  color: var(--text);
  font-variant-numeric: tabular-nums;
}
.f {
  font-size: 11.5px;
  color: var(--muted);
}
.block {
  margin-bottom: 26px;
}
.blk-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}
.blk-head h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.blk-head a {
  font-size: 12px;
  text-decoration: none;
}
.row {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 11px 12px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 6px;
  text-decoration: none;
  color: var(--text);
  font-size: 13px;
}
.row:hover {
  border-color: #c9d6e2;
}
.date {
  color: var(--muted);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}
.tt {
  flex: 1;
}
.dp {
  color: var(--muted);
  font-size: 11.5px;
}
.sys {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 4px 14px;
}
.sys-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 13px;
  border-bottom: 1px solid var(--border);
}
.sys-row:last-child {
  border-bottom: none;
}
.sys-row a {
  font-size: 12.5px;
  text-decoration: none;
}
.sys-right {
  display: flex;
  align-items: center;
  gap: 14px;
}
.ok {
  color: #2f7d5b;
  font-size: 12.5px;
}
</style>
