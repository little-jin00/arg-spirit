<template>
  <div class="portal">
    <aside class="side">
      <div class="brand">
        <span class="mark">CR</span>
        <span class="brand-txt">
          <b>园区内网 · 员工门户</b>
        </span>
      </div>

      <nav class="nav">
        <router-link
          v-for="n in NAV"
          :key="n.to"
          :to="n.to"
          class="nav-item"
          :class="{ on: isOn(n) }"
        >
          <span class="dot" />
          <span>{{ n.label }}</span>
          <span
            v-if="n.badge"
            class="badge"
          >{{ n.badge }}</span>
        </router-link>
      </nav>

      <div class="side-foot">
        <div>内部系统 · 仅限授权员工</div>
        <div>操作记录将写入审计日志</div>
      </div>
    </aside>

    <div class="main">
      <header class="top">
        <div class="crumb">
          {{ crumb }}
        </div>
        <div class="user">
          <span class="who">m.thorne</span>
          <span class="role">园区运营与安全</span>
          <router-link
            to="/inside"
            class="quit"
          >退出</router-link>
        </div>
      </header>

      <div class="body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { TICKETS } from '../data/portalData'

const route = useRoute()

const pending = TICKETS.filter((t) => t.status === '待处理').length

const NAV = [
  { to: '/inside/portal', label: '门户首页', key: 'home' },
  { to: '/inside/portal/announcements', label: '公告', key: 'ann' },
  { to: '/inside/portal/policies', label: '制度与合规', key: 'pol' },
  { to: '/inside/portal/docs', label: '文件中心', key: 'doc' },
  { to: '/inside/portal/ops', label: '运营看板', key: 'ops' },
  { to: '/inside/portal/visitors', label: '访客与接待', key: 'vis' },
  { to: '/inside/portal/tickets', label: '我的工单', key: 'tk', badge: pending ? String(pending) : '' },
  { to: '/inside/portal/requests', label: '权限申请', key: 'req' },
  { to: '/inside/portal/it', label: 'IT 自助', key: 'it' }
]

function isOn (n) {
  return route.path === n.to
}

const crumb = computed(() => {
  const hit = NAV.find((n) => n.to === route.path)
  return hit ? `门户 / ${hit.label}` : '门户'
})
</script>

<style scoped>
.portal {
  display: flex;
  min-height: 100vh;
  background: var(--bg);
}

.side {
  width: 208px;
  flex: 0 0 208px;
  background: var(--panel);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px 16px;
  border-bottom: 1px solid var(--border);
}
.mark {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: var(--accent);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-txt {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.brand-txt b {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.nav {
  padding: 10px 8px;
  flex: 1;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  border-radius: 6px;
  font-size: 13.5px;
  color: var(--text);
  text-decoration: none;
  margin-bottom: 2px;
}
.nav-item:hover {
  background: #f2f5f8;
}
.nav-item.on {
  background: #eaf0f6;
  color: var(--link);
  font-weight: 600;
}
.dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.35;
}
.nav-item.on .dot {
  opacity: 1;
  background: var(--link);
}
.badge {
  margin-left: auto;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #dbe6f0;
  color: var(--link);
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.side-foot {
  padding: 12px 16px 16px;
  border-top: 1px solid var(--border);
  font-size: 11px;
  line-height: 1.7;
  color: var(--muted);
}

.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.top {
  height: 52px;
  flex: 0 0 52px;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 5;
}
.crumb {
  font-size: 13px;
  color: var(--muted);
}
.user {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
}
.who {
  color: var(--text);
  font-weight: 600;
}
.role {
  color: var(--muted);
}
.quit {
  color: var(--muted);
  text-decoration: none;
  padding-left: 10px;
  border-left: 1px solid var(--border);
}
.quit:hover {
  color: var(--link);
}

.body {
  padding: 22px 24px 60px;
  max-width: 1000px;
  width: 100%;
}

@media (max-width: 760px) {
  .portal {
    flex-direction: column;
  }
  .side {
    width: 100%;
    flex: none;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  .nav {
    display: flex;
    overflow-x: auto;
    padding: 8px;
  }
  .nav-item {
    white-space: nowrap;
  }
  .side-foot {
    display: none;
  }
}
</style>
