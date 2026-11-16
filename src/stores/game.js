import { defineStore } from 'pinia'
import { generateFingerprintId } from '../utils/identity'
import { CONTACTS, INITIAL_MAILS, MAIL_SEQUENCE, REPLY_MAILS } from '../data/mailbox'
import { EVIDENCE } from '../data/evidence'
import { acReplyLine, acTone, buildBounce, buildPostCredit, buildPressAck, buildRelayDeadNotice, routeEditorReply } from '../utils/mailEngine'
import { STORY_BASE_MS, formatStoryTime, storyNow } from '../utils/storyTime'

const STORAGE_KEY = 'arg_save_v1'
const BOARD_KEY = 'arg_evidence_board_v1'
const SAVE_VERSION = 'K-11'
const INITIAL_DURATION = 72 * 3600 * 1000 // 时钟 A：追踪/清除，72小时
const LOCK_DURATION = 48 * 3600 * 1000 // 时钟 B：哀悼协议锁窗，48小时
// 跨标签页同步期间禁止回写，避免用本标签页的旧进度覆盖另一标签页刚写入的存档
let syncingFromStorage = false

// 归零那一刻的四行：终端历史与全屏覆盖层共用同一份原文
export const TRACE_ZERO_LINES = [
  { t: '[SYS] 追踪时钟归零。', c: 'sys' },
  { t: '[SYS] 会话标记 P1 · 身份确认：E-13 / 覆盖层来源 E-09。', c: 'sys' },
  { t: '[A.C.] 找到了。别再换浏览器了。', c: 'ac' },
  { t: '[SYS] 复核窗口：48 小时。窗口内不执行清理。', c: 'sys' }
]

export const useGameStore = defineStore('game', {
  state: () => ({
    progress: 'ch1',
    arg_endings_v1: [], // 已解锁结局（跨周目保留）
    arg_ng_plus: false, // 二周目标记
    evidenceIds: [],
    boardUnlocked: false, // 陈默邮件附件：证据板是否已保存到本机
    boardFirstOpen: false, // 本次解锁后是否还需要自动展开一次
    choices: {},
    timerStart: null,
    timerDuration: INITIAL_DURATION,
    lockStart: null,
    lockDuration: LOCK_DURATION,
    terminalUnlocked: false,
    staffAuth: false, // 已通过员工身份验证
    portalUnlocked: false, // 可进入员工门户
    terminalLines: [], // 终端输出历史（持久化，重连时保留）
    termHist: [], // 终端命令历史（持久化）
    sessionUser: 'visitor', // 终端会话身份（visitor / kessler）
    cwd: '/', // 终端当前目录
    cheatSeen: false, // 是否已看过运维速查卡
    visits: [], // 足迹：按站点去重，最近在前，上限 20
    fingerprint: '',
    alert: null, // 弹窗邮件（不持久化）
    devNotice: false, // 试玩版提示（不持久化）
    introSeen: false, // 是否已从开场邮箱进入乐园官网
    events: {}, // 进度事件：只记顺序，不做真实时间计算
    eventSeq: 0,
    mail: {
      queue: [], // [{ id, readyAfter }]
      delivered: [],
      read: [],
      sent: [], // { id, to, subject, body, time }
      threads: {},
      dynamic: [],
      times: {}, // 触发时算出的剧情时间：邮件 id → 时间字符串
      lastTime: 0 // 上一封触发邮件的剧情时间（毫秒），保证单调递增
    },
    contacts: { known: [] }, // [{ addr, name, source }]
    saveMismatch: false, // 旧档版本不匹配：等待玩家手动清除
    saveBlocked: false, // 不匹配期间禁止写入，避免静默覆盖旧档
    saveVersionSeen: '',
    traceOverlay: false, // 归零四行的全屏覆盖层：仅本次会话，不持久化
    audioEnabled: true, // 结局环境音与陈默语音的总开关（不进存档）
    readFiles: [], // 已读文件路径：解析功能的门槛，单独存放，不进存档
    _loaded: false
  }),
  getters: {
    // 证据总数取证据表实际键数，加卡自动跟随
    evidenceTotal: () => Object.keys(EVIDENCE).length,
    // 结局 D 门槛：证据完整度 75%，按比例算，不写死张数
    endingDThreshold () {
      return Math.ceil(this.evidenceTotal * 0.75)
    },
    endingDReached () {
      return this.evidenceIds.length >= this.endingDThreshold
    }
  },
  actions: {
    init () {
      if (this._loaded) return
      this.fingerprint = generateFingerprintId()
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const save = JSON.parse(raw)
          if (save.version !== SAVE_VERSION) {
            // 版本不一致：不读取旧档，也不自动清除，等玩家在说明窗里手动确认
            this.saveMismatch = true
            this.saveBlocked = true
            this.saveVersionSeen = save.version || '未标注'
          } else {
            this.progress = save.progress ?? this.progress
          this.evidenceIds = save.evidenceIds ?? []
          this.choices = save.choices ?? {}
          this.timerStart = save.timerStart ?? null
          this.timerDuration = save.timerDuration ?? INITIAL_DURATION
          this.lockStart = save.lockStart ?? null
          this.lockDuration = save.lockDuration ?? LOCK_DURATION
          this.terminalUnlocked = save.terminalUnlocked ?? false
          this.staffAuth = save.staffAuth ?? this.terminalUnlocked
          this.portalUnlocked = save.portalUnlocked ?? this.terminalUnlocked
          this.terminalLines = save.terminalLines ?? []
          this.termHist = save.termHist ?? []
          this.sessionUser = save.sessionUser ?? 'visitor'
          this.cwd = save.cwd ?? '/'
          this.cheatSeen = save.cheatSeen ?? false
          // 旧存档是逐页记录，结构不同，直接丢弃
          this.visits = (save.visits ?? []).filter((v) => v && typeof v.site === 'string')
          this.introSeen = save.introSeen ?? false
          this.events = save.events ?? {}
          this.eventSeq = save.eventSeq ?? Object.keys(this.events).length
            this.mail = {
              queue: [],
              delivered: [],
              read: [],
              sent: [],
              threads: {},
              dynamic: [],
              times: {},
              lastTime: 0,
              ...(save.mail ?? {})
            }
            this.contacts = { known: [], ...(save.contacts ?? {}) }
          }
        }
      } catch (e) {
        // 存档解析失败则当作新档
      }
      try {
        this.boardUnlocked = localStorage.getItem(BOARD_KEY) === '1'
      } catch (e) {
        this.boardUnlocked = false
      }
      // 结局记录与二周目标记单独存放：清档后仍保留，供回看与 post_credit 使用
      try {
        const endings = JSON.parse(localStorage.getItem('arg_endings_v1') || '[]')
        this.arg_endings_v1 = Array.isArray(endings) ? endings : []
      } catch (e) {
        this.arg_endings_v1 = []
      }
      try {
        this.arg_ng_plus = localStorage.getItem('arg_ng_plus') === '1'
      } catch (e) {
        this.arg_ng_plus = false
      }
      // 音频总开关单独存放：清档不影响，默认开
      try {
        this.audioEnabled = localStorage.getItem('arg_audio_v1') !== '0'
      } catch (e) {
        this.audioEnabled = true
      }
      // 已读文件单独存放：只服务于「解析」，不写剧情状态
      try {
        const read = JSON.parse(localStorage.getItem('arg_read_files_v1') || '[]')
        this.readFiles = Array.isArray(read) ? read : []
      } catch (e) {
        this.readFiles = []
      }
      // 开场信由 E-13 读过；旧存档也要补成已读
      if (this.mail.delivered.includes('chen') && !this.mail.read.includes('chen')) {
        this.mail.read.push('chen')
      }
      this.seedMail()
      // 老档补齐：已投递但没记过剧情时间的邮件，按当前剧情时间补一遍，避免继续显示写死日期
      this.backfillMailTimes()
      // 证据板随开场信附件装载：老档只要进过收件箱（boot_mail_read）就在启动时补上，无需清档
      if (this.events.boot_mail_read && this.mail.delivered.includes('chen')) {
        this.unlockBoard()
      }
      // 老档不追回：已经进过终端/已经走到第四章的存档，直接补一张“已越过令牌”标记
      if (
        !this.choices.c3_terminal_token_bypass &&
        this.terminalUnlocked &&
        (this.terminalLines.length > 0 ||
          this.termHist.length > 0 ||
          this.choices.c3_found_maya_partition ||
          this.choices.c4_entered)
      ) {
        this.choices.c3_terminal_token_bypass = true
      }
      this._loaded = true
      this.$subscribe(() => this.persist())
      this.persist()
    },
    // 跨标签页同步：站内链接会在新标签打开，各标签各有一份 Pinia 状态。
    // storage 事件触发时以 localStorage 里的最新存档为准，整份接过来，避免证据/足迹各存一份。
    syncFromStorage () {
      if (!this._loaded || this.saveBlocked) return
      try {
        if (localStorage.getItem(BOARD_KEY) === '1') this.boardUnlocked = true
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const save = JSON.parse(raw)
        if (save.version !== SAVE_VERSION) return
        syncingFromStorage = true
        this.progress = save.progress ?? this.progress
        this.evidenceIds = save.evidenceIds ?? this.evidenceIds
        this.choices = save.choices ?? this.choices
        this.timerStart = save.timerStart ?? null
        this.timerDuration = save.timerDuration ?? INITIAL_DURATION
        this.lockStart = save.lockStart ?? null
        this.lockDuration = save.lockDuration ?? LOCK_DURATION
        this.terminalUnlocked = save.terminalUnlocked ?? false
        this.staffAuth = save.staffAuth ?? this.terminalUnlocked
        this.portalUnlocked = save.portalUnlocked ?? this.terminalUnlocked
        this.terminalLines = save.terminalLines ?? []
        this.termHist = save.termHist ?? []
        this.sessionUser = save.sessionUser ?? 'visitor'
        this.cwd = save.cwd ?? '/'
        this.cheatSeen = save.cheatSeen ?? false
        this.visits = (save.visits ?? []).filter((v) => v && typeof v.site === 'string')
        this.introSeen = save.introSeen ?? false
        this.events = save.events ?? {}
        this.eventSeq = save.eventSeq ?? Object.keys(this.events).length
        this.mail = {
          queue: [],
          delivered: [],
          read: [],
          sent: [],
          threads: {},
          dynamic: [],
          times: {},
          lastTime: 0,
          ...(save.mail ?? {})
        }
        this.contacts = { known: [], ...(save.contacts ?? {}) }
        this.backfillMailTimes()
      } catch (e) {
        // 解析失败时保留当前内存状态
      }
      setTimeout(() => {
        syncingFromStorage = false
      }, 0)
    },
    persist () {
      if (!this._loaded || this.saveBlocked || syncingFromStorage) return
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: SAVE_VERSION,
          progress: this.progress,
          evidenceIds: this.evidenceIds,
          choices: this.choices,
          timerStart: this.timerStart,
          timerDuration: this.timerDuration,
          lockStart: this.lockStart,
          lockDuration: this.lockDuration,
          terminalUnlocked: this.terminalUnlocked,
          staffAuth: this.staffAuth,
          portalUnlocked: this.portalUnlocked,
          terminalLines: this.terminalLines,
          termHist: this.termHist,
          sessionUser: this.sessionUser,
          cwd: this.cwd,
          cheatSeen: this.cheatSeen,
          visits: this.visits,
          introSeen: this.introSeen,
          events: this.events,
          eventSeq: this.eventSeq,
          mail: this.mail,
          contacts: this.contacts
        })
      )
    },
    addEvidence (id) {
      if (!this.evidenceIds.includes(id)) this.evidenceIds.push(id)
    },
    // 结局解锁：去重写入，独立于 arg_save_v1
    unlockEnding (id) {
      if (!id || this.arg_endings_v1.includes(id)) return
      this.arg_endings_v1.push(id)
      try {
        localStorage.setItem('arg_endings_v1', JSON.stringify(this.arg_endings_v1))
      } catch (e) {
        // 存储不可用时只在本次会话内保留
      }
    },
    markNgPlus () {
      if (this.arg_ng_plus) return
      this.arg_ng_plus = true
      try {
        localStorage.setItem('arg_ng_plus', '1')
      } catch (e) {
        // 同上
      }
    },
    // 声音总开关：关闭后由调用方停止全部音频，不写入 arg_save_v1
    toggleAudio () {
      this.audioEnabled = !this.audioEnabled
      try {
        localStorage.setItem('arg_audio_v1', this.audioEnabled ? '1' : '0')
      } catch (e) {
        // 存储不可用时只在本次会话内生效
      }
    },
    // 记录已读文件：解析功能的唯一门槛，不产生证据、不写 choices
    markFileRead (path) {
      if (!path || this.readFiles.includes(path)) return
      this.readFiles.push(path)
      try {
        localStorage.setItem('arg_read_files_v1', JSON.stringify(this.readFiles))
      } catch (e) {
        // 存储不可用时只在本次会话内保留
      }
    },
    // 打开陈默开场信时附件自动装载：证据板保存到本机，独立于清档
    unlockBoard () {
      if (this.boardUnlocked) return
      this.boardUnlocked = true
      this.boardFirstOpen = true
      try {
        localStorage.setItem(BOARD_KEY, '1')
      } catch (e) {
        // 存储不可用时只在本次会话内解锁
      }
    },
    setChoice (key, value) {
      this.choices[key] = value
    },
    // 记录到访站点：同一站点只保留一条，更新为最近到访时间
    recordVisit (site) {
      if (!site) return
      const idx = this.visits.findIndex((v) => v.site === site)
      if (idx >= 0) this.visits.splice(idx, 1)
      this.visits.unshift({ site, time: Date.now() })
      if (this.visits.length > 20) this.visits.length = 20
    },
    startTimer () {
      if (this.timerStart === null) this.timerStart = Date.now()
    },
    // 调试：把追踪时钟剩余时间设为指定毫秒，之后照常倒数
    setTraceRemaining (ms) {
      const remain = Math.max(1000, Number(ms) || 0)
      delete this.choices.trace_expired
      this.traceOverlay = false
      this.timerDuration = remain
      this.timerStart = Date.now()
    },
    // 调试还原：剩余时间回到 72 小时，清除归零标记与覆盖层
    resetTraceState () {
      delete this.choices.trace_expired
      this.traceOverlay = false
      this.timerDuration = INITIAL_DURATION
      this.timerStart = Date.now()
    },
    // 时钟 B：哀悼协议锁窗，由第四章正确激活码启动，与时钟 A 互不影响
    startLockWindow () {
      this.lockStart = Date.now()
    },
    // 时钟 A 归零：标记只落一次；终端历史写一份，同时弹出全屏覆盖层
    markTraceExpired () {
      if (this.choices.trace_expired) return
      this.choices.trace_expired = true
      this.appendTermLines(TRACE_ZERO_LINES)
      this.traceOverlay = true
    },
    closeTraceOverlay () {
      this.traceOverlay = false
    },
    // 倒计时缩短 hours 小时
    shortenTimer (hours) {
      if (this.timerStart === null) return
      const remain = Math.max(0, this.timerDuration - (Date.now() - this.timerStart))
      const newRemain = Math.max(0, remain - hours * 3600 * 1000)
      this.timerDuration = (Date.now() - this.timerStart) + newRemain
    },
    // 员工身份通过（正常登录或开发调试后门共用）
    unlockStaffAccess () {
      this.terminalUnlocked = true
      this.staffAuth = true
      this.portalUnlocked = true
      this.startTimer()
      this.markEvent('portal_login')
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
    // ---------- 邮件与事件 ----------
    seedMail () {
      if (this.mail.delivered.length) return
      this.mail.delivered = INITIAL_MAILS.map((m) => m.id)
      this.mail.read = INITIAL_MAILS.filter((m) => m.seedRead).map((m) => m.id)
      // 二周目：任意结局后开新档，收件箱第一封多出一封 post_credit
      if (this.arg_endings_v1.length) {
        const mail = buildPostCredit(this.arg_endings_v1)
        this.mail.dynamic.unshift(mail)
        this.mail.delivered.unshift(mail.id)
      }
    },
    markEvent (key) {
      if (!key || this.events[key]) return
      this.events[key] = ++this.eventSeq
      this.scanMail()
      // 事件记录后立即投递一次：首次打开 E-09 帖等场景不必再进一次收件箱
      this.flushMail()
    },
    // 触发时刻的剧情时间：起点 + 本次会话经过时间，且不早于上一封、不早于起点
    nextMailTime (offsetMs = 0) {
      const t = Math.max(
        STORY_BASE_MS,
        storyNow() + offsetMs,
        (this.mail.lastTime || 0) + 1000
      )
      this.mail.lastTime = t
      return formatStoryTime(t)
    },
    scanMail () {
      for (const m of MAIL_SEQUENCE) {
        if (this.mail.delivered.includes(m.id)) continue
        if (this.mail.queue.some((q) => q.id === m.id)) continue
        const triggers = m.triggers || [m.trigger]
        if (!triggers.some((k) => this.events[k])) continue
        if (m.requires && !m.requires.every((k) => this.events[k])) continue
        if (m.excludes && m.excludes.some((k) => this.events[k])) continue
        this.mail.queue.push({
          id: m.id,
          readyAfter: this.eventSeq + (m.delay ? 1 : 0),
          // 自动回复给几秒延迟；其余取触发那一刻
          time: this.nextMailTime(m.auto ? 4000 : 0)
        })
      }
    },
    queueMail (id, delay = false) {
      if (!id) return
      if (this.mail.delivered.includes(id)) return
      if (this.mail.queue.some((q) => q.id === id)) return
      this.mail.queue.push({
        id,
        readyAfter: this.eventSeq + (delay ? 1 : 0),
        time: this.nextMailTime()
      })
    },
    // 打开邮箱时先扫描再投递；scanMail 仍保留，作为漏触发时的兜底
    openInbox () {
      this.scanMail()
      this.flushMail()
    },
    // 把所有已到期的邮件一次性投出，按到期的事件顺序排列
    flushMail () {
      const due = this.mail.queue
        .map((q, i) => ({ ...q, i }))
        .filter((q) => q.readyAfter <= this.eventSeq)
      if (!due.length) return
      due.sort((a, b) => a.readyAfter - b.readyAfter || a.i - b.i)
      this.mail.queue = this.mail.queue.filter((q) => q.readyAfter > this.eventSeq)
      for (const q of due) {
        if (this.mail.delivered.includes(q.id)) continue
        this.mail.delivered.unshift(q.id)
        this.mail.times[q.id] = q.time || this.nextMailTime()
        const m = this.mailById(q.id)
        if (m && m.addr) this.addContact(m.addr)
      }
    },
    markMailRead (id) {
      if (id && !this.mail.read.includes(id)) this.mail.read.push(id)
    },
    // 老档迁移：只给非初始邮件补时间，初始五封保留"10月x日"的相对历史
    backfillMailTimes () {
      if (!this.mail.times) this.mail.times = {}
      const seeded = new Set(INITIAL_MAILS.map((m) => m.id))
      const missing = this.mail.delivered
        .slice()
        .reverse()
        .filter((id) => !seeded.has(id) && !this.mail.times[id])
      for (const id of missing) this.mail.times[id] = this.nextMailTime()
    },
    mailById (id) {
      const mail =
        INITIAL_MAILS.find((m) => m.id === id) ||
        MAIL_SEQUENCE.find((m) => m.id === id) ||
        REPLY_MAILS[id] ||
        this.mail.dynamic.find((m) => m.id === id) ||
        null
      if (!mail) return null
      const t = this.mail.times?.[id] || mail.time
      return this.renderMail(mail, t)
    },
    // 把邮件正文里的时间占位符换成这封邮件触发时的剧情时间
    renderMail (mail, time) {
      const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(time || '')
      const date = m ? `${m[1]}-${m[2]}-${m[3]}` : ''
      const caseDate = m ? `${m[2]}${m[3]}` : ''
      const sent = this.mail.sent.find((s) => s.to === 'e09.relay@postbox.com')
      const e09SentTime = (sent?.time || time || '').slice(0, 16)
      const fill = (v) =>
        typeof v === 'string'
          ? v
              .replace(/\{\{date\}\}/g, date)
              .replace(/\{\{caseDate\}\}/g, caseDate)
              .replace(/\{\{e09SentTime\}\}/g, e09SentTime)
              .replace(/\{\{baseTime\}\}/g, formatStoryTime(STORY_BASE_MS))
          : v
      return {
        ...mail,
        time,
        subject: fill(mail.subject),
        preview: fill(mail.preview),
        body: Array.isArray(mail.body) ? mail.body.map(fill) : mail.body
      }
    },
    addContact (addr) {
      const key = String(addr || '').toLowerCase()
      const c = CONTACTS[key]
      if (!c) return
      if (this.contacts.known.some((k) => k.addr === key)) return
      this.contacts.known.push({ addr: key, name: c.name, source: c.source })
    },
    pushDynamic (mail) {
      if (mail && !this.mail.times?.[mail.id]) {
        const time = this.nextMailTime()
        mail.time = time
        this.mail.times[mail.id] = time
      }
      this.mail.dynamic.unshift(mail)
      if (!this.mail.delivered.includes(mail.id)) this.mail.delivered.unshift(mail.id)
    },
    sendMail ({ to, subject, body }) {
      const addr = String(to || '').trim().toLowerCase()
      if (!addr) return null
      const hadSent = this.mail.sent.some((s) => s.to === addr)
      const entry = {
        id: 'sent-' + Date.now(),
        to: addr,
        subject: String(subject || '').trim(),
        body: String(body || '').trim(),
        time: this.nextMailTime()
      }
      this.mail.sent.unshift(entry)

      if (addr === 'e09.relay@postbox.com') {
        this.addContact(addr)
        if (!hadSent) this.markEvent('e09_mail_sent')
        else this.pushDynamic(buildRelayDeadNotice())
      } else if (addr === 'zhouhan@nanan-weekly.com') {
        this.addContact(addr)
        if (!this.mail.threads.editor) {
          const rule = routeEditorReply(body)
          this.mail.threads.editor = rule.id
          this.queueMail(rule.mail, true)
        }
      } else if (addr === 'dengmama@postbox.com') {
        this.addContact(addr)
        if (this.mail.delivered.includes('m08a')) this.markEvent('m08a_replied')
      } else if (addr === 'ceo@ceres-reynold.com') {
        this.addContact(addr)
        this.setChoice('ac_reply_tone', acTone(body))
        this.showAlert({
          id: 'ac_reply',
          from: 'A.C.',
          subject: '（无标题）',
          time: '刚刚',
          body: acReplyLine(body)
        })
      } else if (addr === 'chen.mo@postbox.com') {
        this.pushDynamic(buildBounce(addr))
      } else if (addr === 'service@afterglow-park.com') {
        if (!this.mail.dynamic.some((m) => m.id === 'ack-press')) this.pushDynamic(buildPressAck())
      } else if (addr.endsWith('@ceres-reynold.com')) {
        // 公司地址存在，只是不回信
      } else {
        this.pushDynamic(buildBounce(addr))
      }
      return entry
    },
    // ---------- 调试控制台用的单点重置 ----------
    resetMailbox () {
      this.mail = { queue: [], delivered: [], read: [], sent: [], threads: {}, dynamic: [], times: {}, lastTime: 0 }
      this.contacts = { known: [] }
      this.seedMail()
    },
    resetTerminalState () {
      this.terminalLines = []
      this.termHist = []
      this.sessionUser = 'visitor'
      this.cwd = '/'
      this.cheatSeen = false
    },
    resetPortalPuzzles () {
      Object.keys(this.choices).forEach((k) => {
        if (k.startsWith('c3_')) delete this.choices[k]
      })
    },
    resetLoginState () {
      this.terminalUnlocked = false
      this.staffAuth = false
      this.portalUnlocked = false
      this.timerStart = null
      this.timerDuration = INITIAL_DURATION
      this.lockStart = null
      this.lockDuration = LOCK_DURATION
      // 倒计时一起还原时，归零标记与覆盖层也清掉
      delete this.choices.trace_expired
      this.traceOverlay = false
    },
    // 玩家在版本说明窗里手动确认：只清 arg_save_v1，不动结局与通关标记
    clearIncompatibleSave () {
      localStorage.removeItem(STORAGE_KEY)
      this.saveMismatch = false
      this.saveBlocked = false
      this.saveVersionSeen = ''
      this.persist()
    },
    resetAll () {
      localStorage.removeItem(STORAGE_KEY)
      this.saveMismatch = false
      this.saveBlocked = false
      this.saveVersionSeen = ''
      this.progress = 'ch1'
      this.evidenceIds = []
      this.choices = {}
      this.timerStart = null
      this.timerDuration = INITIAL_DURATION
      this.lockStart = null
      this.lockDuration = LOCK_DURATION
      this.terminalUnlocked = false
      this.staffAuth = false
      this.portalUnlocked = false
      this.terminalLines = []
      this.termHist = []
      this.sessionUser = 'visitor'
      this.cwd = '/'
      this.cheatSeen = false
      this.visits = []
      this.devNotice = false
      this.introSeen = false
      this.readFiles = []
      this.traceOverlay = false
      try {
        localStorage.removeItem('arg_read_files_v1')
      } catch (e) {
        // 忽略
      }
      this.events = {}
      this.eventSeq = 0
      this.mail = { queue: [], delivered: [], read: [], sent: [], threads: {}, dynamic: [], times: {}, lastTime: 0 }
      this.contacts = { known: [] }
      this.seedMail()
    }
  }
})
