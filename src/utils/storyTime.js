// 剧情内时钟：2024-10-07 23:47:02（+08:00）为起点，按本次会话经过的真实时间推进
// 邮件时间统一取触发那一刻的剧情时间，且保证单调递增
export const STORY_BASE_MS = Date.UTC(2024, 9, 7, 15, 47, 2)
const SESSION_START = Date.now()

export function storyNow () {
  return STORY_BASE_MS + Math.max(0, Date.now() - SESSION_START)
}

export function formatStoryTime (ms) {
  const d = new Date(ms + 8 * 3600 * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(
    d.getUTCHours()
  )}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`
}
