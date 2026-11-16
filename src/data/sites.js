// 玩家足迹按"站点"归并：同一站点的不同路由只记一条

export const SITES = {
  mail: {
    name: '邮局邮箱',
    layer: 'Layer 0 · 邮箱',
    entry: '/inbox'
  },
  park: {
    name: '余晖乐园官网',
    layer: 'Layer 1 · 表层',
    entry: '/park'
  },
  forum: {
    name: '暮色论坛',
    layer: 'Layer 2 · 外部网络',
    entry: '/forum'
  },
  ceres: {
    name: '科赛雷诺官网',
    layer: 'Layer 3 · 深层官网',
    entry: '/inside'
  },
  portal: {
    name: '员工门户',
    layer: 'Layer 3.5 · 内部 OA',
    entry: '/inside/portal'
  },
  system: {
    name: '运维终端',
    layer: 'Layer 3.5 · 内部系统',
    entry: '/inside/admin/terminal'
  }
}

// 路由 → 站点 key。终端从门户进入，但它是独立审计系统、视觉与操作完全自成一层，
// 且证据板在终端内不可见，单列才能让玩家回跳。
export function siteOfRoute (to) {
  const p = to.path
  if (p === '/inbox') return 'mail'
  if (p.startsWith('/inside/portal')) return 'portal'
  if (p === '/inside/admin/terminal') return 'system'
  if (p.startsWith('/inside')) return 'ceres'
  if (p.startsWith('/forum') || p === '/2018-ad') return 'forum'
  if (p.startsWith('/park') || p.startsWith('/news')) return 'park'
  return null
}
