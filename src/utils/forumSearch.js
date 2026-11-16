import { POSTS } from '../data/forumPosts'

// 论坛归档检索：归一化 + 别名组 + 子串匹配，不引入分词依赖

const TOTAL_POSTS = 3847

export const SUGGESTIONS = ['日落乐园', '旋转木马', '7月19', '夜班']

// 每组：broad 为宽说法，narrow 为更具体的说法（命中 narrow 时只按该说法收窄）
const ALIASES = [
  {
    name: '余晖乐园',
    broad: ['余晖乐园', '余晖', '乐园', '游乐园', 'afterglow'],
    narrow: [['日落乐园'], ['西郊乐园']]
  },
  { name: '科赛雷诺', broad: ['科赛雷诺', '科赛', '赛雷诺', 'ceres', '公司'] },
  { name: '意识', broad: ['意识', '人格', '记忆', '上传', '备份', '情感计算'] },
  { name: '寻人', broad: ['寻人', '失踪', '失联', '找不到', '妈妈'] },
  { name: '7月19', broad: ['7月19', '0719', '719', '七月十九', '20190719'] },
  { name: '旋转木马', broad: ['旋转木马', '木马', 'carousel'] },
  { name: '邮箱', broad: ['邮箱', '邮件', 'postbox', '转发', 'relay'] },
  {
    name: '员工',
    broad: ['员工', '前员工', '培训'],
    narrow: [['安保', '保安']]
  },
  {
    name: '员工身份',
    broad: ['marcus', 'thorne', '工牌', '账号', '马库斯', '索恩', '工号'],
    narrow: [['马库斯', 'marcus'], ['索恩', 'thorne']]
  },
  { name: 'B区', broad: ['B区', 'b区', '地下', '园区地下'] },
  { name: '归档', broad: ['归档', '丢帖', '服务器', '搜不到'] }
]

function toHalfWidth (str) {
  return str.replace(/[\uFF01-\uFF5E]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
}

export function normalize (str) {
  return toHalfWidth(String(str || ''))
    .toLowerCase()
    .replace(/[\s，。、；：！？"'“”‘’（）()《》〈〉·,.!?;:'"[\]【】—\-_/\\]/g, '')
}

const INDEX = POSTS.map((post) => ({
  post,
  title: normalize(post.title),
  tag: normalize(post.tag),
  author: normalize(post.author),
  keywords: normalize((post.keywords || []).join(' ')),
  body: normalize((post.body || []).join(' ')),
  replies: normalize((post.replies || []).map((r) => r.text).join(' '))
}))

export const SEARCHABLE_COUNT = INDEX.length
export const ARCHIVE_TOTAL = TOTAL_POSTS

function matchBroad (form, t) {
  return form === t || form.includes(t) || t.includes(form)
}

function expand (term) {
  const t = normalize(term)
  if (!t) return []

  const group = ALIASES.find((g) => {
    if (g.broad.some((f) => matchBroad(normalize(f), t))) return true
    return (g.narrow || []).some((sub) => sub.some((f) => matchBroad(normalize(f), t)))
  })
  if (!group) return [t]

  // 具体说法优先收窄：玩家先见过“西郊乐园”，搜它时才会得到“对上了”的反馈
  for (const sub of group.narrow || []) {
    const forms = sub.map(normalize)
    if (forms.some((f) => t === f || t.includes(f))) return forms
  }

  return group.broad.map(normalize).filter(Boolean)
}

function scoreField (entry, forms) {
  let best = 0
  for (const f of forms) {
    if (!f) continue
    if (entry.title === f) best = Math.max(best, 120)
    else if (entry.title.includes(f)) best = Math.max(best, 100)
    if (entry.keywords.includes(f)) best = Math.max(best, 55)
    if (entry.tag.includes(f)) best = Math.max(best, 40)
    if (entry.author.includes(f)) best = Math.max(best, 35)
    if (entry.body.includes(f)) best = Math.max(best, 15)
    if (entry.replies.includes(f)) best = Math.max(best, 10)
  }
  return best
}

function matchYear (date, year) {
  if (year === 'all') return true
  const y = Number(String(date).slice(0, 4))
  if (year === 'earlier') return y < 2018
  return y === Number(year)
}

export function searchPosts (query, year = 'all') {
  const raw = String(query || '').trim()
  if (!raw) return []
  const terms = raw
    .split(/[\s,，、]+/)
    .filter(Boolean)
    .map((term) => {
      const t = normalize(term)
      // 单字不展开别名，避免 “P 系统” 里的 P 被 postbox 等词整组带走
      return t.length > 1 ? expand(t) : [t]
    })
    .filter((g) => g.length)
  if (!terms.length) return []

  const results = []
  for (const entry of INDEX) {
    if (!matchYear(entry.post.date, year)) continue
    let total = 0
    let ok = true
    for (const forms of terms) {
      const s = scoreField(entry, forms)
      if (!s) {
        ok = false
        break
      }
      total += s
    }
    if (ok) results.push({ post: entry.post, score: total })
  }

  results.sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
  return results.map((r) => r.post)
}
