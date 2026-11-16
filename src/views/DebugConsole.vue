<template>
  <div class="dbg">
    <header class="top">
      <div>
        <h1>ARG-SPIRIT // DEBUG CONSOLE</h1>
        <p class="sub">
          仅开发环境 · 生产构建不包含本页 · 入口 <code>/__debug</code>
        </p>
      </div>
      <div class="top-actions">
        <router-link
          to="/park"
          class="link"
        >返回游戏</router-link>
        <button
          class="btn"
          @click="refresh"
        >刷新状态</button>
      </div>
    </header>

    <p
      v-if="msg.global"
      class="msg global"
    >{{ msg.global }}</p>

    <!-- 当前状态 -->
    <section class="card">
      <h2>当前状态</h2>
      <div class="stat-grid">
        <div class="stat"><span>progress</span><b>{{ store.progress }}</b></div>
        <div class="stat"><span>倒计时</span><b>{{ remaining }}</b></div>
        <div class="stat"><span>事件</span><b>{{ eventCount }}</b></div>
        <div class="stat"><span>选择项</span><b>{{ choiceCount }}</b></div>
        <div class="stat"><span>证据</span><b>{{ store.evidenceIds.length }} / {{ evidenceTotal }}</b></div>
        <div class="stat"><span>结局 D</span><b>{{ store.endingDReached ? '已达成' : '未达成' }} · 门槛 {{ store.endingDThreshold }}</b></div>
        <div class="stat"><span>足迹</span><b>{{ store.visits.length }}</b></div>
        <div class="stat"><span>邮件队列</span><b>{{ store.mail.queue.length }}</b></div>
        <div class="stat"><span>已投递</span><b>{{ store.mail.delivered.length }}</b></div>
      </div>

      <div class="flag-row">
        <span
          class="flag"
          :class="{ on: store.introSeen }"
        >introSeen</span>
        <span
          class="flag"
          :class="{ on: store.staffAuth }"
        >staffAuth</span>
        <span
          class="flag"
          :class="{ on: store.portalUnlocked }"
        >portalUnlocked</span>
        <span
          class="flag"
          :class="{ on: store.terminalUnlocked }"
        >terminalUnlocked</span>
        <span
          class="flag"
          :class="{ on: store.cheatSeen }"
        >cheatSeen</span>
      </div>

      <div class="kv">
        <span>fingerprint</span><code>{{ store.fingerprint || '（未生成）' }}</code>
      </div>
      <div class="kv">
        <span>本地存储</span>
        <code>arg_save_v1: {{ hasSave ? '存在' : '不存在' }}</code>
        <code>forum_search_history_v1: {{ searchCount }} 条</code>
      </div>
      <div class="kv">
        <span>证据 ID</span><code>{{ store.evidenceIds.join(', ') || '（空）' }}</code>
      </div>
      <div class="kv">
        <span>邮件 threads</span><code>{{ Object.keys(store.mail.threads).join(', ') || '（空）' }}</code>
      </div>
    </section>

    <!-- 跳阶段 -->
    <section class="card">
      <h2>跳到阶段</h2>
      <div class="btn-row">
        <button
          v-for="s in stages"
          :key="s.id"
          class="btn"
          @click="jumpTo(s.id)"
        >{{ s.label }}</button>
      </div>
      <p class="hint">
        会先执行一次全部重置，再写入该阶段所需的最小状态。深层 = 门户谜题已解 + 终端已解锁；证据卡仍需在终端里自行收集。
      </p>
    </section>

    <!-- 门槛开关 -->
    <section class="card">
      <h2>门槛开关</h2>
      <div class="btn-row">
        <button
          class="btn"
          @click="toggleGateSkip"
        >{{ store.choices.c3_skip_gates ? '关闭：跳过三处门槛' : '开启：跳过三处门槛' }}</button>
        <button
          class="btn"
          @click="resetGates"
        >重置门槛状态</button>
      </div>
      <p class="hint">
        开启后：终端入口不校验维护令牌、connect /system/maya 不校验权限、maya_backup.enc 不校验口令。仅调试用。
      </p>
    </section>

    <!-- 追踪时钟 -->
    <section class="card">
      <h2>追踪时钟 <small>{{ store.choices.trace_expired ? '已归零' : '未归零' }}</small></h2>
      <div class="stat-grid small">
        <div class="stat"><span>剩余</span><b>{{ remaining }}</b></div>
        <div class="stat"><span>trace_expired</span><b>{{ store.choices.trace_expired ? 'true' : 'false' }}</b></div>
      </div>
      <div class="btn-row">
        <button
          class="btn"
          @click="setTrace(10000)"
        >10 秒</button>
        <button
          class="btn"
          @click="setTrace(60000)"
        >60 秒</button>
        <button
          class="btn"
          @click="setTrace(300000)"
        >5 分钟</button>
        <button
          class="btn"
          @click="markTraceNow"
        >直接标记为已归零</button>
        <button
          class="btn"
          @click="resetTrace"
        >还原追踪状态</button>
      </div>
      <p class="hint">
        改剩余时间后照常倒数，到点走真实的 <code>markTraceExpired()</code>：全屏覆盖层、终端四行、第六章压制都会实际触发；直接标记 = 跳过等待，走同一个入口。还原 = 剩余时间回到 72 小时并清除 <code>trace_expired</code>。调试写入的是正常存档字段，收尾请点「还原追踪状态」或「全部重置」。
      </p>
    </section>

    <!-- 事件 -->
    <section class="card">
      <h2>事件标记 <small>{{ eventCount }}</small></h2>
      <table class="tbl">
        <thead>
          <tr><th>key</th><th>seq</th><th /></tr>
        </thead>
        <tbody>
          <tr
            v-for="(v, k) in store.events"
            :key="k"
          >
            <td><code>{{ k }}</code></td>
            <td>{{ v }}</td>
            <td class="right">
              <button
                class="mini"
                @click="removeEvent(k)"
              >删除</button>
            </td>
          </tr>
          <tr v-if="eventCount === 0">
            <td
              colspan="3"
              class="empty"
            >（空）</td>
          </tr>
        </tbody>
      </table>

      <div class="input-row">
        <input
          v-model="newEvent"
          placeholder="新事件 key，例如 portal_login"
          @keyup.enter="addEvent"
        >
        <button
          class="btn"
          @click="addEvent"
        >添加</button>
      </div>

      <details>
        <summary>JSON 批量编辑</summary>
        <textarea
          v-model="eventsText"
          spellcheck="false"
        />
        <div class="btn-row">
          <button
            class="btn"
            @click="applyEvents"
          >应用事件 JSON</button>
        </div>
      </details>
      <p
        v-if="msg.events"
        class="msg"
      >{{ msg.events }}</p>
    </section>

    <!-- 选择项 -->
    <section class="card">
      <h2>选择项 <small>{{ choiceCount }}</small></h2>
      <table class="tbl">
        <thead>
          <tr><th>key</th><th>value</th><th /></tr>
        </thead>
        <tbody>
          <tr
            v-for="(v, k) in store.choices"
            :key="k"
          >
            <td><code>{{ k }}</code></td>
            <td><code>{{ formatValue(v) }}</code></td>
            <td class="right">
              <button
                class="mini"
                @click="removeChoice(k)"
              >删除</button>
            </td>
          </tr>
          <tr v-if="choiceCount === 0">
            <td
              colspan="3"
              class="empty"
            >（空）</td>
          </tr>
        </tbody>
      </table>

      <div class="input-row">
        <input
          v-model="newChoiceKey"
          placeholder="key"
        >
        <input
          v-model="newChoiceValue"
          placeholder="值（JSON 或字符串）"
        >
        <button
          class="btn"
          @click="addChoice"
        >添加</button>
      </div>

      <details>
        <summary>JSON 批量编辑</summary>
        <textarea
          v-model="choicesText"
          spellcheck="false"
        />
        <div class="btn-row">
          <button
            class="btn"
            @click="applyChoices"
          >应用选择项 JSON</button>
        </div>
      </details>
      <p
        v-if="msg.choices"
        class="msg"
      >{{ msg.choices }}</p>
    </section>

    <!-- 邮件 -->
    <section class="card">
      <h2>邮件队列 <small>{{ store.mail.queue.length }}</small></h2>
      <div class="stat-grid small">
        <div class="stat"><span>queue</span><b>{{ store.mail.queue.length }}</b></div>
        <div class="stat"><span>delivered</span><b>{{ store.mail.delivered.length }}</b></div>
        <div class="stat"><span>read</span><b>{{ store.mail.read.length }}</b></div>
        <div class="stat"><span>sent</span><b>{{ store.mail.sent.length }}</b></div>
        <div class="stat"><span>dynamic</span><b>{{ store.mail.dynamic.length }}</b></div>
      </div>

      <table class="tbl">
        <thead>
          <tr><th>id</th><th>readyAfter</th><th>状态</th><th /></tr>
        </thead>
        <tbody>
          <tr
            v-for="(q, i) in store.mail.queue"
            :key="q.id + '-' + i"
          >
            <td><code>{{ q.id }}</code></td>
            <td>{{ q.readyAfter }}</td>
            <td>{{ q.readyAfter <= store.eventSeq ? '到期' : '等待' }}</td>
            <td class="right">
              <button
                class="mini"
                @click="removeQueue(i)"
              >移除</button>
            </td>
          </tr>
          <tr v-if="!store.mail.queue.length">
            <td
              colspan="4"
              class="empty"
            >（空）</td>
          </tr>
        </tbody>
      </table>

      <div class="input-row">
        <select v-model="newMailId">
          <option
            v-for="m in allMails"
            :key="m.id"
            :value="m.id"
          >{{ m.label }}</option>
        </select>
        <label class="check"><input
          v-model="newMailDelay"
          type="checkbox"
        > 延后一个事件</label>
        <button
          class="btn"
          @click="addQueue"
        >加入队列</button>
      </div>

      <div class="btn-row">
        <button
          class="btn"
          @click="deliverDue"
        >投递到期邮件</button>
        <button
          class="btn"
          @click="rescan"
        >按事件重建队列</button>
        <button
          class="btn"
          @click="clearQueue"
        >清空队列</button>
        <button
          class="btn danger"
          @click="resetMailbox"
        >重置邮箱</button>
      </div>

      <details>
        <summary>JSON 批量编辑队列</summary>
        <textarea
          v-model="queueText"
          spellcheck="false"
        />
        <div class="btn-row">
          <button
            class="btn"
            @click="applyQueue"
          >应用队列 JSON</button>
        </div>
      </details>
      <p
        v-if="msg.queue"
        class="msg"
      >{{ msg.queue }}</p>
    </section>

    <!-- 单点重置 -->
    <section class="card">
      <h2>单点重置</h2>
      <div class="btn-row">
        <button
          class="btn"
          @click="resetMailbox"
        >邮箱</button>
        <button
          class="btn"
          @click="resetSearch"
        >搜索历史</button>
        <button
          class="btn"
          @click="resetTerminal"
        >终端</button>
        <button
          class="btn"
          @click="resetPortal"
        >门户谜题</button>
        <button
          class="btn"
          @click="resetLogin"
        >登录态</button>
      </div>
      <p class="hint">
        邮箱 = 恢复开场 5 封，保留进度事件；终端 = 清会话/输出/目录，不动登录态；门户谜题 = 清除 <code>c3_*</code> 选择项；登录态 = 关闭门户/终端权限并重置倒计时。
      </p>
    </section>

    <!-- 全部重置 -->
    <section class="card danger-card">
      <h2>全部重置</h2>
      <p class="hint">清空 <code>arg_save_v1</code> 与论坛搜索历史，回到开场邮箱。</p>
      <button
        class="btn danger"
        @click="resetAll"
      >全部重置</button>
    </section>

    <p class="foot">
      生产构建中本页与 <code>/__debug</code> 路由均不包含；调试后门 <code>?auth=off</code> 也只在开发环境生效。
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { INITIAL_MAILS, MAIL_SEQUENCE, REPLY_MAILS } from '../data/mailbox'
import { clearSearchHistory, getSearchHistory } from '../utils/searchHistory'

const store = useGameStore()
const router = useRouter()

const allMails = [
  ...INITIAL_MAILS.map((m) => ({ id: m.id, label: `${m.id} · ${m.subject}` })),
  ...MAIL_SEQUENCE.map((m) => ({ id: m.id, label: `${m.id} · ${m.subject}` })),
  ...Object.values(REPLY_MAILS).map((m) => ({ id: m.id, label: `${m.id} · ${m.subject}` }))
]

const stages = [
  { id: 'intro', label: '开场' },
  { id: 'forum', label: '论坛' },
  { id: 'staff', label: '员工入口' },
  { id: 'portal', label: '门户' },
  { id: 'terminal', label: '终端' },
  { id: 'deep', label: '深层' }
]

const eventsText = ref('')
const choicesText = ref('')
const queueText = ref('')
const newEvent = ref('')
const newChoiceKey = ref('')
const newChoiceValue = ref('true')
const newMailId = ref(allMails[0]?.id || '')
const newMailDelay = ref(false)
const hasSave = ref(false)
const searchCount = ref(0)
const tick = ref(Date.now())

const msg = reactive({ events: '', choices: '', queue: '', global: '' })

let clock = null

const eventCount = computed(() => Object.keys(store.events).length)
const choiceCount = computed(() => Object.keys(store.choices).length)
const evidenceTotal = computed(() => store.evidenceTotal)

const remaining = computed(() => {
  if (!store.timerStart) return '未启动'
  const ms = Math.max(0, store.timerDuration - (tick.value - store.timerStart))
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`
})

function sync () {
  eventsText.value = JSON.stringify(store.events, null, 2)
  choicesText.value = JSON.stringify(store.choices, null, 2)
  queueText.value = JSON.stringify(store.mail.queue, null, 2)
  hasSave.value = !!localStorage.getItem('arg_save_v1')
  searchCount.value = getSearchHistory().length
  tick.value = Date.now()
}

function refresh () {
  sync()
  msg.global = '状态已刷新'
}

function formatValue (v) {
  return typeof v === 'string' ? v : JSON.stringify(v)
}

// ---------- 事件 ----------
function addEvent () {
  const key = newEvent.value.trim()
  if (!key) return
  const seq = Math.max(store.eventSeq, 0, ...Object.values(store.events)) + 1
  store.events[key] = seq
  store.eventSeq = seq
  newEvent.value = ''
  msg.events = `已添加 ${key} = ${seq}`
  sync()
}

function removeEvent (key) {
  delete store.events[key]
  store.eventSeq = Math.max(0, ...Object.values(store.events))
  msg.events = `已删除 ${key}`
  sync()
}

function applyEvents () {
  try {
    const parsed = JSON.parse(eventsText.value || '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('事件必须是 JSON 对象')
    }
    const next = {}
    for (const [k, v] of Object.entries(parsed)) {
      if (typeof v !== 'number' || !Number.isFinite(v)) {
        throw new Error(`事件 ${k} 的值必须是数字`)
      }
      next[k] = v
    }
    store.events = next
    store.eventSeq = Math.max(0, ...Object.values(next))
    store.scanMail()
    msg.events = `已应用 ${Object.keys(next).length} 个事件`
    sync()
  } catch (e) {
    msg.events = e.message
  }
}

// ---------- 选择项 ----------
function addChoice () {
  const key = newChoiceKey.value.trim()
  if (!key) return
  const raw = newChoiceValue.value.trim()
  let value = true
  if (raw) {
    try {
      value = JSON.parse(raw)
    } catch (e) {
      value = raw
    }
  }
  store.choices[key] = value
  newChoiceKey.value = ''
  msg.choices = `已添加 ${key}`
  sync()
}

function removeChoice (key) {
  delete store.choices[key]
  msg.choices = `已删除 ${key}`
  sync()
}

function applyChoices () {
  try {
    const parsed = JSON.parse(choicesText.value || '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('选择项必须是 JSON 对象')
    }
    store.choices = parsed
    msg.choices = `已应用 ${Object.keys(parsed).length} 个选择项`
    sync()
  } catch (e) {
    msg.choices = e.message
  }
}

// ---------- 邮件队列 ----------
function addQueue () {
  if (!newMailId.value) return
  const before = store.mail.queue.length
  store.queueMail(newMailId.value, newMailDelay.value)
  msg.queue = store.mail.queue.length > before
    ? `已加入 ${newMailId.value}`
    : '该邮件已在队列或已投递'
  sync()
}

function removeQueue (index) {
  store.mail.queue.splice(index, 1)
  sync()
}

function deliverDue () {
  store.openInbox()
  msg.queue = '已投递到期邮件'
  sync()
}

function rescan () {
  store.scanMail()
  msg.queue = '已按当前事件重建队列'
  sync()
}

function clearQueue () {
  store.mail.queue = []
  msg.queue = '队列已清空'
  sync()
}

function applyQueue () {
  try {
    const parsed = JSON.parse(queueText.value || '[]')
    if (!Array.isArray(parsed)) throw new Error('邮件队列必须是 JSON 数组')
    const next = parsed.map((x) => {
      if (!x || typeof x.id !== 'string' || !Number.isFinite(x.readyAfter)) {
        throw new Error('每项需要 id 和数字 readyAfter')
      }
      return { id: x.id, readyAfter: x.readyAfter }
    })
    store.mail.queue = next
    msg.queue = `已应用 ${next.length} 项`
    sync()
  } catch (e) {
    msg.queue = e.message
  }
}

// ---------- 单点重置 ----------
function resetMailbox () {
  store.resetMailbox()
  msg.global = '邮箱已重置为开场 5 封（保留进度事件）'
  sync()
}

function resetSearch () {
  clearSearchHistory()
  msg.global = '论坛搜索历史已清空'
  sync()
}

function resetTerminal () {
  store.resetTerminalState()
  msg.global = '终端会话、输出、目录与速查状态已重置'
  sync()
}

function resetPortal () {
  store.resetPortalPuzzles()
  msg.global = '门户谜题选择项（c3_*）已清除'
  sync()
}

function resetLogin () {
  store.resetLoginState()
  msg.global = '登录态已关闭，倒计时已重置'
  sync()
}

function toggleGateSkip () {
  store.setChoice('c3_skip_gates', !store.choices.c3_skip_gates)
  msg.global = store.choices.c3_skip_gates ? '已跳过三处门槛' : '已恢复三处门槛'
  sync()
}

function resetGates () {
  store.choices.c3_skip_gates = false
  store.choices.c3_terminal_token_bypass = false
  store.choices.c3_terminal_token_at = 0
  store.choices.c3_terminal_token_used = false
  try {
    sessionStorage.removeItem('arg_terminal_session')
  } catch (e) {
    // 隐私模式下忽略
  }
  msg.global = '三处门槛状态已重置'
  store.persist()
  sync()
}

// ---------- 追踪时钟 ----------
function setTrace (ms) {
  store.setTraceRemaining(ms)
  msg.global = `追踪剩余时间已设为 ${ms >= 60000 ? `${ms / 60000} 分钟` : `${ms / 1000} 秒`}`
  sync()
}

function markTraceNow () {
  if (store.choices.trace_expired) {
    msg.global = '当前已处于归零状态'
  } else {
    store.markTraceExpired()
    msg.global = '已按真实归零流程标记：覆盖层与终端四行已触发'
  }
  sync()
}

function resetTrace () {
  store.resetTraceState()
  msg.global = '追踪时钟已还原为 72 小时，trace_expired 已清除'
  sync()
}

function resetAll () {
  store.resetAll()
  clearSearchHistory()
  sync()
  msg.global = '已全部重置，回到开场邮箱'
  router.push('/inbox')
}

// ---------- 跳阶段 ----------
function setEvents (map) {
  store.events = { ...map }
  store.eventSeq = Math.max(0, ...Object.values(map))
}

function jumpTo (id) {
  store.resetAll()
  msg.global = ''

  if (id === 'intro') {
    sync()
    router.push('/inbox')
    return
  }

  store.introSeen = true
  store.progress = 'ch2'

  if (id === 'forum') {
    sync()
    msg.global = '已跳到论坛阶段'
    router.push('/forum')
    return
  }

  setEvents({ e09_mail_sent: 1, forum_e09_opened: 2 })
  store.scanMail()
  store.progress = 'ch3'

  if (id === 'staff') {
    sync()
    msg.global = '已跳到员工入口阶段'
    router.push('/inside/admin')
    return
  }

  store.unlockStaffAccess()
  store.choices.c3_password_reset = true
  store.progress = 'ch4'

  if (id === 'portal') {
    sync()
    msg.global = '已跳到门户阶段'
    router.push('/inside/portal')
    return
  }

  store.progress = 'ch5'
  store.sessionUser = 'kessler'
  store.cwd = '/'
  // 跳阶段时自动跳过三处门槛，避免调试被入口校验挡住
  store.choices.c3_skip_gates = true
  try {
    sessionStorage.setItem('arg_terminal_session', '1')
  } catch (e) {
    // 隐私模式下忽略
  }

  if (id === 'terminal') {
    sync()
    msg.global = '已跳到终端阶段'
    router.push('/inside/admin/terminal')
    return
  }

  store.choices.c3_persephone_granted = true
  store.progress = 'ch6'
  sync()
  msg.global = '已跳到深层阶段：门户已授权、终端已解锁'
  router.push('/inside/admin/terminal')
}

onMounted(() => {
  store.init()
  sync()
  clock = setInterval(() => {
    tick.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (clock) clearInterval(clock)
})
</script>

<style scoped>
.dbg {
  min-height: 100vh;
  background: #0f1418;
  color: #c9d6df;
  padding: 20px 26px 60px;
  font-family: Consolas, "Courier New", "Microsoft YaHei", monospace;
  font-size: 12.5px;
  line-height: 1.6;
}
.top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid #26323b;
  padding-bottom: 14px;
  margin-bottom: 16px;
}
h1 {
  margin: 0 0 4px;
  font-size: 18px;
  letter-spacing: 1px;
  color: #e6eef4;
}
.sub {
  margin: 0;
  color: #6f7d88;
  font-size: 11.5px;
}
.sub code,
.foot code,
.kv code,
.tbl code,
.hint code {
  color: #9fc7e0;
}
.top-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.link {
  color: #7fb6d9;
  text-decoration: none;
  font-size: 12px;
  border: 1px solid #2b3945;
  border-radius: 4px;
  padding: 5px 10px;
}
.link:hover {
  border-color: #4d6b80;
}
.card {
  background: #151c22;
  border: 1px solid #26323b;
  border-radius: 6px;
  padding: 14px 16px;
  margin-bottom: 14px;
}
.card h2 {
  margin: 0 0 10px;
  font-size: 13.5px;
  color: #dbe7ef;
  letter-spacing: 0.5px;
}
.card h2 small {
  color: #6f7d88;
  font-weight: normal;
  margin-left: 4px;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px;
  margin-bottom: 10px;
}
.stat-grid.small {
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
}
.stat {
  background: #10161b;
  border: 1px solid #22303a;
  border-radius: 4px;
  padding: 6px 9px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.stat span {
  color: #6f7d88;
}
.stat b {
  color: #dbe7ef;
  font-weight: 600;
}
.flag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 8px 0 10px;
}
.flag {
  border: 1px solid #2b3945;
  border-radius: 3px;
  padding: 1px 7px;
  color: #66737d;
  font-size: 10.5px;
}
.flag.on {
  color: #7fd6a0;
  border-color: #2f6b4a;
  background: #12251b;
}
.kv {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  padding: 4px 0;
  border-top: 1px dashed #22303a;
}
.kv span {
  color: #6f7d88;
  min-width: 88px;
}
.kv code {
  word-break: break-all;
}
.tbl {
  width: 100%;
  border-collapse: collapse;
  margin: 6px 0 10px;
}
.tbl th,
.tbl td {
  text-align: left;
  border-bottom: 1px solid #22303a;
  padding: 4px 6px;
  vertical-align: top;
}
.tbl th {
  color: #6f7d88;
  font-weight: normal;
  font-size: 11px;
}
.tbl td {
  color: #b9c8d2;
}
.tbl .right {
  text-align: right;
  width: 60px;
}
.tbl .empty {
  color: #5f6b75;
  text-align: center;
}
.input-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 8px 0;
}
.input-row input[type="text"],
.input-row input:not([type]),
.input-row select {
  flex: 1 1 200px;
  min-width: 150px;
}
input,
select,
textarea {
  background: #0c1115;
  border: 1px solid #2b3945;
  border-radius: 3px;
  color: #d7e3ec;
  padding: 6px 8px;
  font-family: inherit;
  font-size: 12px;
  outline: none;
}
input:focus,
select:focus,
textarea:focus {
  border-color: #4d6b80;
}
textarea {
  display: block;
  width: 100%;
  min-height: 130px;
  margin: 8px 0;
  resize: vertical;
  line-height: 1.5;
}
.check {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #8b9aa5;
  white-space: nowrap;
}
.check input {
  width: auto;
}
.btn {
  background: #1c2933;
  border: 1px solid #334654;
  color: #cfe0eb;
  border-radius: 4px;
  padding: 5px 11px;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
}
.btn:hover {
  border-color: #4d6b80;
  background: #223340;
}
.btn.danger {
  border-color: #6b3a3a;
  color: #e8b0b0;
  background: #251618;
}
.btn.danger:hover {
  border-color: #9a4c4c;
  background: #321b1e;
}
.mini {
  background: transparent;
  border: 1px solid #334654;
  border-radius: 3px;
  color: #8b9aa5;
  padding: 1px 6px;
  cursor: pointer;
  font-family: inherit;
  font-size: 10.5px;
}
.mini:hover {
  color: #e8b0b0;
  border-color: #6b3a3a;
}
.btn-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0;
}
details {
  margin-top: 8px;
  border-top: 1px dashed #22303a;
  padding-top: 8px;
}
summary {
  cursor: pointer;
  color: #8b9aa5;
  font-size: 11.5px;
}
summary:hover {
  color: #cfe0eb;
}
.hint {
  margin: 8px 0 0;
  color: #6f7d88;
  font-size: 11px;
  line-height: 1.8;
}
.msg {
  margin: 8px 0 0;
  color: #e0b45c;
  font-size: 11.5px;
}
.msg.global {
  margin: 0 0 12px;
  padding: 6px 10px;
  background: #1d1a10;
  border: 1px solid #4a3d1c;
  border-radius: 4px;
}
.danger-card {
  border-color: #4a2a2a;
}
.foot {
  margin-top: 20px;
  color: #5f6b75;
  font-size: 10.5px;
  line-height: 1.8;
}
</style>
