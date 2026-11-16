import { createRouter, createWebHistory } from 'vue-router'
import { useGameStore } from '../stores/game'
import { siteOfRoute } from '../data/sites'

// 调试控制台只在开发环境注册；生产构建中该分支会被静态移除。
const debugRoutes = import.meta.env.DEV
  ? [{
      path: '/__debug',
      component: () => import('../views/DebugConsole.vue'),
      meta: { theme: 'system', title: 'DEBUG · ARG-Spirit', skipVisit: true }
    }]
  : []

const routes = [
  { path: '/', redirect: '/park' },
  {
    // Layer 0：开场邮箱（纯前端模拟网页邮箱）
    path: '/inbox',
    component: () => import('../views/InboxView.vue'),
    meta: { theme: 'mail', title: '收件箱 - 邮局' }
  },
  {
    // Layer 1：乐园官网表层（完全乐园风）
    path: '/park',
    component: () => import('../views/ParkHome.vue'),
    meta: { theme: 'park', title: '余晖乐园 - 让笑容照亮每一天' }
  },
  {
    path: '/news',
    component: () => import('../views/NewsCenter.vue'),
    meta: { theme: 'park', title: '新闻中心 - 余晖乐园' }
  },
  {
    path: '/news/reporter-statement',
    component: () => import('../views/NewsStatement.vue'),
    meta: { theme: 'park', title: '官方声明 - 余晖乐园' }
  },
  {
    path: '/park/rides/:slug',
    component: () => import('../views/RideDetail.vue'),
    meta: { theme: 'park', title: '设施详情 - 余晖乐园' }
  },
  {
    path: '/park/news/:slug',
    component: () => import('../views/NewsArticle.vue'),
    meta: { theme: 'park', title: '新闻 - 余晖乐园' }
  },
  {
    path: '/park/info/:slug',
    component: () => import('../views/InfoPage.vue'),
    meta: { theme: 'park', title: '余晖乐园' }
  },
  {
    // Layer 2：暮色论坛
    path: '/forum',
    component: () => import('../views/ForumIndex.vue'),
    meta: { theme: 'forum', title: '暮色论坛 · 都市怪谈讨论区' }
  },
  {
    path: '/forum/search',
    component: () => import('../views/ForumSearch.vue'),
    meta: { theme: 'forum', title: '检索归档 - 暮色论坛' }
  },
  {
    path: '/forum/thread/e09',
    component: () => import('../views/ForumThread.vue'),
    meta: { theme: 'forum', title: '余晖乐园的旋转木马下面，有人在尖叫 - 暮色论坛' }
  },
  {
    path: '/forum/user/:slug',
    component: () => import('../views/ForumProfile.vue'),
    meta: { theme: 'forum', title: '用户资料 - 暮色论坛' }
  },
  {
    path: '/forum/thread/:slug',
    component: () => import('../views/ForumShortThread.vue'),
    meta: { theme: 'forum', title: '暮色论坛' }
  },
  {
    // 2018 年的置顶广告——永远打不开
    path: '/2018-ad',
    component: () => import('../views/Nginx404.vue'),
    meta: { theme: 'forum', title: '404 Not Found', skipVisit: true }
  },
  {
    path: '/inside',
    component: () => import('../views/CeresHome.vue'),
    meta: { theme: 'ceres', title: '科赛雷诺科技 - 让意识被温柔对待' }
  },
  {
    path: '/inside/rides/carousel',
    component: () => import('../views/CarouselRide.vue'),
    meta: { theme: 'ceres', title: '旋转木马 · 示范园区 - 科赛雷诺科技' }
  },
  {
    path: '/inside/jobs',
    component: () => import('../views/JobsPage.vue'),
    meta: { theme: 'ceres', title: '加入我们 - 科赛雷诺科技' }
  },
  {
    path: '/inside/leadership',
    component: () => import('../views/LeadershipPage.vue'),
    meta: { theme: 'ceres', title: '管理团队 - 科赛雷诺科技' }
  },
  {
    path: '/inside/press/:slug?',
    component: () => import('../views/PressCenter.vue'),
    meta: { theme: 'ceres', title: '媒体报道 - 科赛雷诺科技' }
  },
  {
    path: '/inside/help',
    component: () => import('../views/HelpDesk.vue'),
    meta: { theme: 'ceres', title: 'IT 服务台 - 科赛雷诺科技' }
  },
  {
    path: '/inside/help/kb-1004',
    component: () => import('../views/Kb1004.vue'),
    meta: { theme: 'ceres', title: 'KB-1004 · 账号找回（已归档）' }
  },
  {
    path: '/inside/legal/privacy',
    component: () => import('../views/PrivacyPage.vue'),
    meta: { theme: 'ceres', title: '隐私政策 - 科赛雷诺科技' }
  },
  {
    path: '/inside/maya-05',
    component: () => import('../views/Maya05Viewer.vue'),
    meta: { theme: 'ceres', title: 'maya-05.scan - CR VIEWER' }
  },
  {
    path: '/inside/admin',
    component: () => import('../views/AdminLogin.vue'),
    meta: { theme: 'ceres', title: '员工登录 - 科赛雷诺' }
  },
  {
    // Layer 3.5：员工门户（内部 OA，需身份验证）
    path: '/inside/portal',
    component: () => import('../views/portal/PortalHome.vue'),
    meta: { theme: 'portal', title: '门户首页 - 科赛雷诺员工门户' }
  },
  {
    path: '/inside/portal/announcements',
    component: () => import('../views/portal/PortalAnnouncements.vue'),
    meta: { theme: 'portal', title: '公告 - 员工门户' }
  },
  {
    path: '/inside/portal/policies',
    component: () => import('../views/portal/PortalPolicies.vue'),
    meta: { theme: 'portal', title: '制度与合规 - 员工门户' }
  },
  {
    path: '/inside/portal/docs',
    component: () => import('../views/portal/PortalDocs.vue'),
    meta: { theme: 'portal', title: '文件中心 - 员工门户' }
  },
  {
    path: '/inside/portal/visitors',
    component: () => import('../views/portal/PortalVisitors.vue'),
    meta: { theme: 'portal', title: '访客与接待 - 员工门户' }
  },
  {
    path: '/inside/portal/requests',
    component: () => import('../views/portal/PortalRequests.vue'),
    meta: { theme: 'portal', title: '权限申请 - 员工门户' }
  },
  {
    path: '/inside/portal/ops',
    component: () => import('../views/portal/PortalOps.vue'),
    meta: { theme: 'portal', title: '运营看板 - 员工门户' }
  },
  {
    path: '/inside/portal/tickets',
    component: () => import('../views/portal/PortalTickets.vue'),
    meta: { theme: 'portal', title: '我的工单 - 员工门户' }
  },
  {
    path: '/inside/portal/it',
    component: () => import('../views/portal/PortalIt.vue'),
    meta: { theme: 'portal', title: 'IT 自助 - 员工门户' }
  },
  {
    path: '/inside/admin/terminal',
    component: () => import('../views/TerminalView.vue'),
    meta: { theme: 'system', title: 'CERES-SECURE-SHELL' }
  },
  {
    // 第七章：结局回看（主菜单「记录」）
    path: '/records',
    component: () => import('../views/EndingsView.vue'),
    meta: { theme: 'system', title: '记录' }
  },
  ...debugRoutes,
  {
    // 第三章及以后的占位
    path: '/system/:pathMatch(.*)*',
    component: () => import('../views/AccessDenied.vue'),
    meta: { theme: 'system', title: 'ACCESS DENIED', skipVisit: true }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/Nginx404.vue'),
    meta: { theme: 'forum', title: '404 Not Found', skipVisit: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (to) => {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

// 只允许回到 /inside/ 下的内网页面，且不能回到登录页自身
function safeInternalFrom (value) {
  if (typeof value !== 'string') return ''
  if (!value.startsWith('/inside/')) return ''
  const path = value.split('?')[0].split('#')[0]
  if (path === '/inside/admin' || path === '/inside/admin/') return ''
  return value
}

// 新档先读开场邮件，再经官网进论坛；终端与内网路由分别校验登录态
router.beforeEach((to) => {
  const store = useGameStore()
  store.init()

  // 仅开发环境：?auth=off 是显式调试后门，生产构建中无效；只作用于 /inside/ 下
  const devBypass = import.meta.env.DEV &&
    to.path.startsWith('/inside/') && to.query.auth === 'off'
  if (devBypass) store.unlockStaffAccess()

  if (to.path === '/park' && !store.introSeen) return { path: '/inbox' }

  const inPortal = to.path === '/inside/portal' || to.path.startsWith('/inside/portal/')
  const inTerminal = to.path === '/inside/admin/terminal' ||
    to.path.startsWith('/inside/admin/terminal/') ||
    to.path === '/inside/maya-05' || to.path.startsWith('/inside/maya-05/')

  if (inPortal && !(store.staffAuth && store.portalUnlocked)) {
    return { path: '/inside/admin', query: { from: to.fullPath } }
  }
  if (inTerminal && !(store.staffAuth && store.terminalUnlocked)) {
    return { path: '/inside/admin', query: { from: to.fullPath } }
  }

  if (devBypass && to.path === '/inside/admin') {
    return { path: safeInternalFrom(to.query.from) || '/inside/portal' }
  }

  return true
})

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title
  // 足迹：按站点归并，跳过 404 / ACCESS DENIED
  if (to.meta.skipVisit) return
  const site = siteOfRoute(to)
  if (!site) return
  useGameStore().recordVisit(site)
})

export default router
