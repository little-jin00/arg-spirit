import { defineStore } from 'pinia'

// 「我的记录」独立于游戏存档，清档不会删除这里的记录
export const RECORDS_STORAGE_KEY = 'arg_my_records_v1'
export const MAX_RECORDS = 100

function normalizeText (text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim()
}

function makeId () {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

// 从同一份 localStorage 读取并清洗记录，init 与跨标签同步共用
function readItems () {
  try {
    const raw = localStorage.getItem(RECORDS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const seen = new Set()
    const items = []
    for (const item of parsed) {
      if (!item || typeof item.text !== 'string') continue
      const text = item.text.trim()
      if (!text) continue
      const key = normalizeText(text)
      if (seen.has(key)) continue
      seen.add(key)
      items.push({
        id: typeof item.id === 'string' ? item.id : makeId(),
        text,
        title: typeof item.title === 'string' ? item.title : '未命名页面',
        path: typeof item.path === 'string' ? item.path : '/',
        time: Number(item.time) || Date.now()
      })
      if (items.length >= MAX_RECORDS) break
    }
    return items
  } catch (e) {
    return []
  }
}

export const useRecordsStore = defineStore('records', {
  state: () => ({
    items: [],
    _loaded: false
  }),
  getters: {
    isFull: (state) => state.items.length >= MAX_RECORDS
  },
  actions: {
    init () {
      if (this._loaded) return
      this._loaded = true
      this.items = readItems()
    },

    // 另一个标签页写入「我的记录」后，本标签页以 localStorage 为准重新载入
    syncFromStorage () {
      if (!this._loaded) return
      this.items = readItems()
    },

    hasText (text) {
      const key = normalizeText(text)
      return this.items.some((item) => normalizeText(item.text) === key)
    },

    add ({ text, title, path, time }) {
      const clean = String(text ?? '').trim()
      const key = normalizeText(clean)
      if (!key) return { ok: false, reason: 'empty' }
      if (this.items.some((item) => normalizeText(item.text) === key)) {
        return { ok: false, reason: 'duplicate' }
      }
      if (this.items.length >= MAX_RECORDS) {
        return { ok: false, reason: 'full' }
      }
      const record = {
        id: makeId(),
        text: clean,
        title: title || '未命名页面',
        path: path || '/',
        time: time || Date.now()
      }
      this.items.unshift(record)
      this.persist()
      return { ok: true, record }
    },

    remove (id) {
      const index = this.items.findIndex((item) => item.id === id)
      if (index < 0) return
      this.items.splice(index, 1)
      this.persist()
    },

    persist () {
      try {
        localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(this.items))
      } catch (e) {
        // 本地存储不可用时保留内存中的记录，不阻断阅读
      }
    }
  }
})
