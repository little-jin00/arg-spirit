<template>
  <PortalLayout>
    <h1 class="pg-title">
      运营看板
    </h1>
    <p class="pg-sub">
      数据来源：园区票务系统 · 售出票数 · 截至 {{ OPS_MONTHLY[OPS_MONTHLY.length - 1].month }}
    </p>

    <section class="panel">
      <div class="ph">
        <h2>月度售票人次</h2>
        <span class="ph-note">2024 年度</span>
      </div>
      <div class="chart">
        <div
          v-for="m in OPS_MONTHLY"
          :key="m.month"
          class="col"
        >
          <span class="num">{{ m.sold.toLocaleString() }}</span>
          <div
            class="bar"
            :style="{ height: h(m.sold) + 'px' }"
            :title="`${m.month} ${m.sold}`"
          />
          <span class="lb">{{ m.month.slice(5) }}</span>
        </div>
      </div>
    </section>

    <section class="panel">
      <div class="ph">
        <h2>明细</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>月份</th>
            <th class="r">
              售票人次
            </th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="m in OPS_MONTHLY"
            :key="m.month"
          >
            <td>{{ m.month }}</td>
            <td class="r">
              {{ m.sold.toLocaleString() }}
            </td>
            <td class="note">
              {{ m.note || '—' }}
            </td>
          </tr>
          <tr class="sum">
            <td>合计</td>
            <td class="r">
              {{ total.toLocaleString() }}
            </td>
            <td class="note">
              —
            </td>
          </tr>
        </tbody>
      </table>
      <p class="panel-note">
        入园人次以闸机计数为准，不在本表统计范围；两者差额为内部接待与赠票。内部接待记录见
        <router-link to="/inside/portal/visitors">
          访客与接待
        </router-link>。
      </p>
    </section>
  </PortalLayout>
</template>

<script setup>
import PortalLayout from '../../components/PortalLayout.vue'
import { OPS_MONTHLY } from '../../data/portalData'

const max = Math.max(...OPS_MONTHLY.map((m) => m.sold))
const total = OPS_MONTHLY.reduce((s, m) => s + m.sold, 0)

function h (v) {
  return Math.round((v / max) * 132)
}
</script>

<style scoped>
.pg-title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
}
.pg-sub {
  margin: 0 0 20px;
  font-size: 12.5px;
  color: var(--muted);
}
.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 18px 18px;
  margin-bottom: 16px;
}
.ph {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 14px;
}
.ph h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}
.ph-note {
  font-size: 11.5px;
  color: var(--muted);
}
.panel-note {
  margin: 12px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--muted);
}
.chart {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 190px;
  padding-top: 8px;
  border-bottom: 1px solid var(--border);
}
.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  height: 100%;
}
.num {
  font-size: 10.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.bar {
  width: 100%;
  max-width: 46px;
  background: linear-gradient(180deg, #6f93b4, #4a6b8a);
  border-radius: 3px 3px 0 0;
  min-height: 2px;
}
.lb {
  font-size: 11px;
  color: var(--muted);
  padding-top: 4px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;
}
th {
  text-align: left;
  font-weight: 500;
  color: var(--muted);
  font-size: 11.5px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
  background: #fafbfc;
}
td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
  color: #33404d;
}
tr:last-child td {
  border-bottom: none;
}
.r {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.note {
  color: var(--muted);
}
.panel-note a {
  text-decoration: none;
}
.sum td {
  font-weight: 600;
  background: #fafbfc;
}
</style>
