// 论坛检索历史：独立 localStorage key，不进存档，也不参与 resetAll
const KEY = 'forum_search_history_v1'
const MAX = 10

function read () {
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    if (!Array.isArray(arr)) return []
    return arr
      .filter((x) => x && typeof x.q === 'string' && x.q.trim())
      .map((x) => ({
        q: x.q.trim(),
        year: x.year || 'all'
      }))
      .slice(0, MAX)
  } catch (e) {
    return []
  }
}

function write (list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch (e) {}
}

export function getSearchHistory () {
  return read()
}

export function recordSearch (q, year = 'all') {
  const text = String(q || '').trim()
  if (!text) return read()
  const key = text.toLowerCase()
  const list = read().filter((x) => x.q.toLowerCase() !== key)
  list.unshift({ q: text, year: year || 'all' })
  const next = list.slice(0, MAX)
  write(next)
  return next
}

export function removeSearch (q) {
  const key = String(q || '').trim().toLowerCase()
  const next = read().filter((x) => x.q.toLowerCase() !== key)
  write(next)
  return next
}

export function clearSearchHistory () {
  write([])
  return []
}

export function formatYear (year) {
  if (!year || year === 'all') return ''
  return year === 'earlier' ? '更早' : year
}
