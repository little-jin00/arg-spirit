import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/park' },
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
    path: '/forum/thread/e09',
    component: () => import('../views/ForumThread.vue'),
    meta: { theme: 'forum', title: '余晖乐园的旋转木马下面，有人在尖叫 - 暮色论坛' }
  },
  {
    path: '/forum/thread/:slug',
    component: () => import('../views/ForumShortThread.vue'),
    meta: { theme: 'forum', title: '暮色论坛' }
  },
  {
    path: '/forum/message',
    component: () => import('../views/ForumMessage.vue'),
    meta: { theme: 'forum', title: '私信 · 暮色论坛' }
  },
  {
    // 2018 年的置顶广告——永远打不开
    path: '/2018-ad',
    component: () => import('../views/Nginx404.vue'),
    meta: { theme: 'forum', title: '404 Not Found' }
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
    path: '/inside/admin/terminal',
    component: () => import('../views/TerminalView.vue'),
    meta: { theme: 'system', title: 'CERES-SECURE-SHELL' }
  },
  {
    // 第三章及以后的占位
    path: '/system/:pathMatch(.*)*',
    component: () => import('../views/AccessDenied.vue'),
    meta: { theme: 'system', title: 'ACCESS DENIED' }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/Nginx404.vue'),
    meta: { theme: 'forum', title: '404 Not Found' }
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

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title
})

export default router
