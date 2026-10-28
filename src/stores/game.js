import { defineStore } from 'pinia'
import { generateFingerprintId } from '../utils/identity'

const STORAGE_KEY = 'arg_save_v1'
const INITIAL_DURATION = 72 * 3600 * 1000 // 72小时，真实时间

export const useGameStore = defineStore('game', {
  state: () => ({
    progress: 'ch1',
    evidenceIds: [],
    choices: {},
    timerStart: null,
    timerDuration: INITIAL_DURATION,
    terminalUnlocked: false,
    terminalLines: [], // 终端输出历史（持久化，重连时保留）
    termHist: [], // 终端命令历史（持久化）
    fingerprint: '',
    alert: null, // 弹窗邮件（不持久化）
    devNotice: false, // 试玩版提示（不持久化）
    _loaded: false
  }),
  actions: {
    init () {
      if (this._loaded) return
      this.fingerprint = generateFingerprintId()
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const save = JSON.parse(raw)
          this.progress = save.progress ?? this.progress
          this.evidenceIds = save.evidenceIds ?? []
          this.choices = save.choices ?? {}
          this.timerStart = save.timerStart ?? null
          this.timerDuration = save.timerDuration ?? INITIAL_DURATION
          this.terminalUnlocked = save.terminalUnlocked ?? false
          this.terminalLines = save.terminalLines ?? []
          this.termHist = save.termHist ?? []
        }
      } catch (e) {
        // 存档解析失败则当作新档
      }
      this._loaded = true
      this.$subscribe(() => this.persist())
      this.persist()
    },
    persist () {
      if (!this._loaded) return
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          progress: this.progress,
          evidenceIds: this.evidenceIds,
          choices: this.choices,
          timerStart: this.timerStart,
          timerDuration: this.timerDuration,
          terminalUnlocked: this.terminalUnlocked,
          terminalLines: this.terminalLines,
          termHist: this.termHist
        })
      )
    },
    addEvidence (id) {
      if (!this.evidenceIds.includes(id)) this.evidenceIds.push(id)
    },
    setChoice (key, value) {
      this.choices[key] = value
    },
    startTimer () {
      if (this.timerStart === null) this.timerStart = Date.now()
    },
    // 倒计时缩短 hours 小时
    shortenTimer (hours) {
      if (this.timerStart === null) return
      const remain = Math.max(0, this.timerDuration - (Date.now() - this.timerStart))
      const newRemain = Math.max(0, remain - hours * 3600 * 1000)
      this.timerDuration = (Date.now() - this.timerStart) + newRemain
    },
    showAlert (email) {
      this.alert = email
    },
    appendTermLines (batch) {
      this.terminalLines.push(...batch)
    },
    clearTermLines () {
      this.terminalLines = []
    },
    closeAlert () {
      this.alert = null
    },
    showDevNotice () {
      this.devNotice = true
    },
    closeDevNotice () {
      this.devNotice = false
    },
    resetAll () {
      localStorage.removeItem(STORAGE_KEY)
      this.progress = 'ch1'
      this.evidenceIds = []
      this.choices = {}
      this.timerStart = null
      this.timerDuration = INITIAL_DURATION
      this.terminalUnlocked = false
      this.terminalLines = []
      this.termHist = []
      this.devNotice = false
    }
  }
})
