<template>
  <div
    class="terminal"
    :class="{ 'fx-repaint': switching, 'talk-mode': talkOpen }"
    @click="onRootClick"
  >
    <div class="workspace">
      <div
        class="left-pane"
        :class="{ 'talk-dim': talkOpen }"
        :inert="talkOpen ? '' : null"
      >
        <div class="stage">
      <div
        v-show="mode === 'cli'"
        class="term-out"
        :class="{ glitch: errorPulse }"
      >
        <div
          v-for="(l, i) in reversedLines"
          :key="i"
          class="line"
          :class="l.c"
        >{{ l.t }}</div>
      </div>

      <div
        v-if="mode === 'gui'"
        class="gui"
        :class="{ glitch: errorPulse }"
      >
        <div class="gui-bar">
          <nav class="crumbs">
            <button
              class="crumb"
              @click="goPath('/')"
            >/</button>
            <template
              v-for="seg in crumbs"
              :key="seg.path"
            >
              <span class="crumb-sep">/</span>
              <button
                class="crumb"
                @click="goPath(seg.path)"
              >{{ seg.name }}</button>
            </template>
          </nav>
          <button
            class="gui-tag"
            @click.stop="setMode('cli')"
          >GUI · 输入 cli 切回</button>
        </div>

        <div class="gui-main">
          <aside
            class="tree"
            :class="{ folded: treeFolded }"
          >
            <button
              class="tree-head"
              @click="treeFolded = !treeFolded"
            >
              <span>文件树</span>
              <span class="tree-caret">{{ treeFolded ? '▸' : '▾' }}</span>
            </button>
            <div
              v-if="!treeFolded"
              class="tree-body"
            >
              <button
                v-for="n in treeNodes"
                :key="n.path"
                class="tree-node"
                :class="{
                  dir: n.isDir,
                  locked: n.locked,
                  active: n.isDir ? dirKey(store.cwd) === n.path : selectedPath === n.path
                }"
                :style="{ paddingLeft: 10 + n.depth * 14 + 'px' }"
                @click="onTreeClick(n)"
              >
                <span class="tree-icon">{{ n.isDir ? (n.locked ? '▪' : '▸') : '·' }}</span>
                <span class="tree-name">{{ n.name }}</span>
              </button>
            </div>
          </aside>

          <section class="viewer">
            <template v-if="selectedPath">
              <div class="vf-head">
                <span class="vf-path">{{ selectedPath }}</span>
                <span
                  v-if="fileNote"
                  class="vf-note"
                  :class="{ err: fileErr }"
                >{{ fileNote }}</span>
              </div>
              <pre
                class="vf-body"
                @contextmenu.prevent.stop="openFileMenu"
              >{{ fileBody }}</pre>
            </template>
            <template v-else>
              <div class="vf-head">
                <span class="vf-path">{{ dirKey(store.cwd) }}</span>
                <span
                  v-if="dirNotice"
                  class="vf-note err"
                >{{ dirNotice }}</span>
              </div>
              <div class="vf-grid">
                <button
                  v-for="e in dirEntries"
                  :key="e.path"
                  class="vf-entry"
                  :class="{ locked: e.locked }"
                  @click="e.isDir ? onTreeClick(e) : openFile(e.path)"
                >
                  {{ e.isDir ? e.name + '/' : e.name }}
                </button>
                <span
                  v-if="!dirEntries.length"
                  class="vf-empty"
                >（空目录）</span>
              </div>
            </template>
          </section>
        </div>

        <div
          class="out-panel"
          :class="{ folded: outFolded }"
        >
          <button
            class="out-head"
            @click="outFolded = !outFolded"
          >
            <span>命令输出</span>
            <span class="out-count">{{ store.terminalLines.length }} 行 · {{ outFolded ? '展开' : '收起' }}</span>
          </button>
          <div
            v-if="!outFolded"
            class="out-scroll"
          >
            <div
              v-for="(l, i) in reversedLines"
              :key="i"
              class="line"
              :class="l.c"
            >{{ l.t }}</div>
          </div>
        </div>
      </div>

      <div
        v-if="mayaOpen"
        class="maya-layer"
      >
        <div
          class="maya-noise"
          aria-hidden="true"
        />
        <div class="maya-head">
          <span class="maya-tag">[MAYA] 通道</span>
          <button
            class="maya-x"
            @click="closeMaya"
          >继续 ›</button>
        </div>
        <div class="maya-body">
          <div
            v-for="(l, i) in mayaLines"
            :key="i"
            class="line"
            :class="l.c"
          >{{ l.t }}</div>
        </div>
      </div>
    </div>

        <LockWindowClock class="lock-row" />

        <div
          v-if="dialogueActive && talkCollapsed && talkOptions.length && !talkPending"
          class="maya-opts"
          @click.stop
        >
          <button
            v-for="(o, i) in talkOptions"
            :key="i + '-' + o.label"
            class="maya-opt"
            :class="{ disabled: o.disabled, asked: o.asked, 'reveal-reason': revealedReasons.has(i) }"
            :aria-disabled="o.disabled"
            @click="pickTalkOption(i)"
            @pointerdown="startReasonPress(i, o)"
            @pointerup="endReasonPress"
            @pointerleave="endReasonPress"
            @pointercancel="endReasonPress"
          >
            <span class="mo-idx">{{ i + 1 }}</span>{{ o.label }}
            <span
              v-if="o.disabled && o.reason"
              class="mo-reason"
            >{{ o.reason }}</span>
          </button>
          <div
            v-if="mayaScene.traceSuppressed"
            class="mo-same"
          >结果一样。</div>
        </div>

        <div class="term-in">
          <span class="prompt">{{ promptStr }}</span>
          <input
            ref="inputRef"
            v-model="input"
            class="term-input"
            spellcheck="false"
            autocomplete="off"
            :disabled="talkOpen"
            @keydown.enter="run"
            @keydown.up.prevent="histPrev"
            @keydown.down.prevent="histNext"
            @keydown.tab.prevent="onTab"
          />
        </div>
        <div class="term-status">
          <span class="st-path">{{ store.sessionUser }}@ceres:{{ store.cwd }}</span>
          <span class="st-hint">Tab 补全 · ↑↓ 历史 · F1 速查</span>
        </div>
      </div>

      <aside
        v-if="talkOpen"
        class="talk-pane"
        aria-label="对话"
        @click.stop
      >
        <div class="talk-head">
          <span class="talk-tag">{{ talkSpeaker }}</span>
          <button
            class="talk-exit"
            @click="closeTalkPane"
          >回到左侧 ×</button>
        </div>
        <div
          ref="talkBodyRef"
          class="talk-body"
        >
          <div
            v-for="(l, i) in talkLines"
            :key="i"
            class="line"
            :class="l.c"
          >{{ l.t }}</div>
          <div
            v-if="!talkLines.length"
            class="talk-empty"
          >（她还没有开口。）</div>
        </div>
        <div
          v-if="talkOptions.length && !talkPending"
          class="talk-opts"
        >
          <button
            v-for="(o, i) in talkOptions"
            :key="i + '-' + o.label"
            class="talk-opt"
            :class="{ disabled: o.disabled, asked: o.asked }"
            :disabled="o.disabled"
            @click="pickTalkOption(i)"
          >
            <span class="mo-idx">{{ i + 1 }}</span>{{ o.label }}
            <span
              v-if="o.disabled && o.reason"
              class="talk-reason"
            >{{ o.reason }}</span>
          </button>
          <div
            v-if="mayaScene.traceSuppressed"
            class="mo-same"
          >结果一样。</div>
        </div>
        <div class="talk-foot">
          <div class="talk-hint">{{ talkHint }}</div>
          <div
            v-if="talkPending"
            class="talk-continue"
          >
            <button
              ref="talkContinueRef"
              class="talk-continue-btn"
              @click="advanceTalk"
            >按任意键继续</button>
          </div>
          <div
            v-else
            class="talk-input-row"
            :class="{ secondary: talkOptions.length > 0 || e07.nlu }"
          >
            <span class="talk-prompt">›</span>
            <input
              ref="talkInputRef"
              v-model="talkInput"
              class="talk-input"
              :placeholder="talkPlaceholder"
              :disabled="talkBusy"
              spellcheck="false"
              autocomplete="off"
              @keydown.enter.stop.prevent="submitTalk"
              @keydown.esc.stop.prevent="closeTalkPane"
            />
            <button
              class="talk-send"
              :disabled="talkBusy"
              @click="submitTalk"
            >发送</button>
          </div>
        </div>
      </aside>
    </div>

    <button
      v-if="dialogueActive && talkCollapsed"
      class="talk-reopen"
      @click.stop="openTalkPane"
    >继续对话 ›</button>

    <div
      v-if="showCheat"
      class="cheat"
      @click.stop
    >
      <div class="cheat-head">
        <span>运维速查</span>
        <button
          class="cheat-x"
          @click="closeCheat"
        >✕</button>
      </div>
      <div class="cheat-body">
        <div
          v-for="row in CHEAT"
          :key="row[0]"
          class="cheat-row"
        >
          <code>{{ row[0] }}</code>
          <span>{{ row[1] }}</span>
        </div>
      </div>
      <div class="cheat-foot">F1 / Esc 关闭</div>
    </div>

    <div
      v-if="blackout"
      class="blackout"
    />

    <!-- 转移过程只报百分比，不画进度条 -->
    <div
      v-if="transferPct > 0"
      class="transfer-pct"
    >{{ transferPct }}%</div>

    <button
      v-if="creditsPlaying && creditsSkippable"
      class="credits-skip"
      @click.stop="skipCredits"
    >跳过片尾 ›</button>

    <!-- 文件详情右键菜单：与终端 a 命令走同一个解析弹层 -->
    <div
      v-if="fileMenu.open"
      class="file-menu"
      :style="{ left: fileMenu.x + 'px', top: fileMenu.y + 'px' }"
      @mousedown.stop
      @contextmenu.stop.prevent
    >
      <button
        class="file-menu-item"
        @click="parseSelectedFile"
      >解析这份文件</button>
    </div>

    <ParsePanel
      v-if="parsePath"
      :path="parsePath"
      @close="closeParse"
      @jump="jumpToParseTarget"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { DAMAGED, DIRS, ENCRYPTED, FILES, HIDDEN, LOCKED, resolveDir, resolveFile, resolvePath } from '../data/terminalFiles'
import { C4_HUB_OPTIONS, C4_NODES, matchC4Topic } from '../data/chapter4'
import { C5_NODES, C6_NODES, CREDITS, E7_NODES, matchLenaTopic } from '../data/chapters567'
import { E07_CONSOLE_SELF, E07_NODES } from '../data/e07'
import { playEndingAmbient, speakChenWake, stopAllAudio, unlockAudio } from '../utils/endingAudio'
import LockWindowClock from '../components/LockWindowClock.vue'
import ParsePanel from '../components/ParsePanel.vue'

const router = useRouter()
const store = useGameStore()

// 不要缓存 store.terminalLines 的数组引用：跨标签同步/重置会整份替换数组
const reversedLines = computed(() => [...store.terminalLines].reverse())
const input = ref('')
const inputRef = ref(null)
const histIdx = ref(-1)

// 会话态：visitor（默认）→ kessler（resume 0x0A9 后），与 cwd 一并持久化
const sessionUser = computed(() => store.sessionUser)
const promptStr = computed(() => `${store.sessionUser}@ceres:${store.cwd}$`)

// 视图态：只是同一份输出与目录的两种呈现，不进存档
const mode = ref('cli') // cli | gui
const switching = ref(false)
const errorPulse = ref(false)
let errorTimer = null
let switchTimer = null

// 图形视图的本地界面态（同样不进存档）
const treeFolded = ref(false)
const outFolded = ref(false)
const expanded = ref(new Set(['/']))
const selectedPath = ref(null)
const fileBody = ref('')
const fileNote = ref('')
const fileErr = ref(false)
const dirNotice = ref('')
const mayaOpen = ref(false)
const mayaLines = ref([])

// 对话右栏：E-07 与第四～六章共用同一块，不改变左栏视图
const talkLines = ref([])
const talkInput = ref('')
const talkInputRef = ref(null)
const talkBodyRef = ref(null)
const talkContinueRef = ref(null)
const talkCollapsed = ref(false)
// 自动输出播完后停住：等待玩家按键或点击「继续」才推进
const talkPending = ref(false)
let continueResolve = null
let talkScrollTimer = null

// 第四章白色房间：节点机只存在于终端会话内，不新增存档字段
const mayaScene = reactive({
  active: false,
  chapter: 4, // 4 白色房间 / 5 我是谁 / 6 留下来的人 / 7 余波
  mode: 'hub', // hub 意图槽 / choice 固定选项 / code 受控输入 / message 留言
  hub: null, // c5q = 莱娜提问 hub
  options: [],
  locked: false,
  failStreak: 0,
  endingFirst: false,
  visited: new Set(),
  hintedHubs: new Set(),
  traceSuppressed: false
})
const blackout = ref(false)
// 转移过程：只在右上角递增百分比，不画进度条
const transferPct = ref(0)
// 片尾：首次不可跳过，复玩时可跳过
const creditsPlaying = ref(false)
const creditsSkippable = ref(false)
let creditsAbort = false
// 灰显选项的理由默认隐藏：悬停 / 键盘聚焦 / 触屏长按才显示
const revealedReasons = reactive(new Set())
let reasonPressTimer = null
// Maya 段强制命令行：记住进入前的视图，段结束后恢复
const viewLocked = ref(false)
const viewReturn = ref('cli')

// 速查卡（外壳层，不进输出流）
const CHEAT = [
  ['ls [-a] [目录]', '列出目录'],
  ['cd <目录>', '切换目录 · 支持相对路径与 ..'],
  ['pwd', '显示当前路径'],
  ['cat <文件>', '读取文件'],
  ['a <文件>', '解析已读文件（也接受完整路径）'],
  ['gui / cli', '切换图形视图 / 回到命令行'],
  ['decrypt <文件>', '解密加密文件'],
  ['echo <文本> > <文件>', '写入文件（多数路径只读）'],
  ['resume <会话ID>', '接管挂起会话'],
  ['connect /system/maya', '连接 Maya 通道（第四章）'],
  ['whoami / uname', '当前身份 / 系统版本'],
  ['clear / exit', '清屏 / 断开连接']
]
const showCheat = ref(false)
function openCheat () {
  showCheat.value = true
}
function closeCheat () {
  showCheat.value = false
  store.cheatSeen = true
}
function toggleCheat () {
  showCheat.value ? closeCheat() : openCheat()
}
function onKey (e) {
  // 右栏停住时，任意按键都算「继续」
  if (talkPending.value) {
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) return
    e.preventDefault()
    advanceTalk()
    return
  }
  if (e.key === 'F1') {
    e.preventDefault()
    toggleCheat()
  } else if (e.key === 'Escape') {
    if (showCheat.value) closeCheat()
    else if (fileMenu.open) closeFileMenu()
    else if (parsePath.value) closeParse()
    else if (talkOpen.value) closeTalkPane()
  }
}

// ---------- 解析：终端 a 命令与文件详情右键共用同一弹层 ----------
const parsePath = ref('')
const fileMenu = reactive({ open: false, x: 0, y: 0 })

function openFileMenu (e) {
  if (!selectedPath.value) return
  fileMenu.open = true
  fileMenu.x = Math.max(8, Math.min(e.clientX + 2, window.innerWidth - 168))
  fileMenu.y = Math.max(8, Math.min(e.clientY + 2, window.innerHeight - 46))
}
function closeFileMenu () {
  fileMenu.open = false
}
function parseSelectedFile () {
  const p = selectedPath.value
  fileMenu.open = false
  if (!p) return
  parsePath.value = p
  inputRef.value && inputRef.value.blur()
}
function openParse (path) {
  fileMenu.open = false
  parsePath.value = path
  inputRef.value && inputRef.value.blur()
}
function closeParse () {
  parsePath.value = ''
  focusInput()
}

// ---------- E-07 控制台对话（第三章） ----------
// 独立小节点机：不占用 Maya 通道，也不依赖后面章节
const e07 = reactive({ active: false, node: '', options: [], nlu: false, busy: false })
let e07Seq = 0

// 对话统一状态：两个节点机都从同一处驱动右栏
const dialogueActive = computed(() => e07.active || mayaScene.active)
const talkOpen = computed(() => dialogueActive.value && !talkCollapsed.value && !creditsPlaying.value)
const talkBusy = computed(() => talkPending.value || (e07.active && e07.busy) || creditsPlaying.value)
const talkOptions = computed(() => {
  if (e07.active) return e07OptionsWithExtras()
  if (mayaScene.active) return mayaScene.options
  return []
})
const talkSpeaker = computed(() => {
  if (e07.active) return 'E-07 · 探视终端 B-2'
  const names = { 4: '第四章 · 白色房间', 5: '第五章 · 我是谁', 6: '第六章 · 留下来的人', 7: '余波' }
  return names[mayaScene.chapter] || 'MAYA'
})
const talkHint = computed(() => {
  if (talkPending.value) return '按任意键继续。'
  if (e07.active) {
    if (e07.busy) return '通话处理中……'
    if (e07.nlu) return '可以直接对她说一句话；也可以点「先不问了」或「挂断」。'
    if (e07.options.length) return '点选上方选项；也可以在下面输入序号。'
    return ''
  }
  if (!mayaScene.active) return ''
  if (mayaScene.mode === 'code') return '输入激活码。'
  if (mayaScene.mode === 'message') return '选一条留言，或输入序号。'
  if (mayaScene.mode === 'choice') return '点选上方选项，或输入序号。'
  if (mayaScene.hub === 'c5q') {
    return '可以问：我是谁 · 我能出去吗 · 陈默是谁 · 我会不会消失 · 我能救谁 · 你记得我吗 · 我是不是 E-13；输入「不问了」继续。'
  }
  if (mayaScene.chapter === 4) return '输入 look / talk / touch / walk / wait / remember / exit，或直接问她。'
  if (mayaScene.chapter === 5) return '听她说。她停下来后，可以继续问。'
  if (mayaScene.chapter === 6) return '听她说，或在上方选择一个选项。'
  return ''
})
const talkPlaceholder = computed(() => {
  if (e07.active) return e07.nlu ? '直接说一句话（可选）……' : '或输入序号（可选）……'
  if (mayaScene.mode === 'code') return '输入激活码……'
  if (mayaScene.mode === 'message') return '输入序号……'
  if (mayaScene.mode === 'choice') return '输入序号……'
  return '说点什么，或输入命令……'
})

function e07CanEnter () {
  return store.readFiles.includes('/subjects/e-07/vitals.log')
}

// 终端入口维护令牌：30 分钟内有效、单次使用；同一浏览器会话内刷新不重复扣
function canEnterTerminal () {
  if (store.choices.c3_skip_gates || store.choices.c3_terminal_token_bypass) return true
  try {
    if (sessionStorage.getItem('arg_terminal_session') === '1') return true
  } catch (e) {
    // 隐私模式下忽略
  }
  const at = Number(store.choices.c3_terminal_token_at || 0)
  const used = !!store.choices.c3_terminal_token_used
  if (at > 0 && !used && Date.now() - at < 30 * 60 * 1000) {
    store.setChoice('c3_terminal_token_used', true)
    try {
      sessionStorage.setItem('arg_terminal_session', '1')
    } catch (e) {
      // 隐私模式下忽略
    }
    return true
  }
  return false
}

// [VOICE] 是 E-07 本人台词，[ARCHIVE] 是归档行，其余按系统行处理
function e07Class (t) {
  const s = String(t)
  if (s.startsWith('[VOICE]')) return 'voice'
  if (s.startsWith('[ARCHIVE]')) return 'dim'
  return 'sys'
}

function applyE07Set (set) {
  for (const [k, v] of Object.entries(set)) {
    if (typeof v === 'string' && v.startsWith('+')) {
      store.setChoice(k, Number(store.choices[k] || 0) + Number(v.slice(1)))
    } else {
      store.setChoice(k, v)
    }
    // 两条收束作为邮件事件触发点；证据卡只在照做分支发放
    if (k === 'e07_ended') {
      store.addEvidence('ev_marta')
      store.markEvent(k)
    } else if (k === 'e07_refused') {
      store.markEvent(k)
    }
  }
}

// ---------- 右栏「继续」：自动输出结束后停住，不自动推进 ----------
function focusTalkContinue () {
  nextTick(() => {
    if (talkPending.value && talkContinueRef.value) talkContinueRef.value.focus()
  })
}
function waitForContinue () {
  if (!dialogueActive.value) return Promise.resolve(true)
  talkPending.value = true
  focusTalkContinue()
  return new Promise((resolve) => {
    continueResolve = resolve
  })
}
function advanceTalk () {
  if (!talkPending.value || !continueResolve) return
  const resolve = continueResolve
  continueResolve = null
  talkPending.value = false
  resolve(true)
  nextTick(() => {
    if (talkOpen.value) focusTalkInput()
  })
}
function cancelContinue () {
  if (!continueResolve) return
  const resolve = continueResolve
  continueResolve = null
  talkPending.value = false
  resolve(false)
}

// 深层话题前置：只认脚本层给出的五种来源
function e07PrereqMet (prereq) {
  if (!prereq) return true
  if (Array.isArray(prereq)) return prereq.every(e07PrereqMet)
  if (prereq === 'portal_visit_seen') return !!store.choices.portal_visit_seen
  if (prereq === 'ticket_seen') return !!store.choices.ticket_seen
  if (prereq.startsWith('read:')) return store.readFiles.includes(prereq.slice(5))
  return true
}

// 她主动提出关掉维持：深层回答 >= 3，且必须包含「女儿」或「探视」
function e07CanRequest () {
  const deep = Number(store.choices.e07_deep_answered || 0)
  return deep >= 3 && (!!store.choices.e07_daughter || !!store.choices.e07_visitor)
}

// 深层话题菜单：前置不足也可以点，统一由 E07-06 回避
function e07MenuOptions () {
  const asked = (topic) => !!store.choices[`e07_${topic}`]
  const mark = (label, topic) => asked(topic) ? `${label}（问过了）` : label
  return [
    {
      label: mark('你女儿现在怎么样了', 'daughter'),
      to: 'E07-05a',
      prereq: 'portal_visit_seen',
      topic: 'daughter',
      asked: asked('daughter'),
      keys: ['女儿']
    },
    {
      label: mark('当年是谁答应过你', 'promiser'),
      to: 'E07-05b',
      prereq: 'ticket_seen',
      topic: 'promiser',
      asked: asked('promiser'),
      keys: ['答应', '许诺', '承诺', '姓k', '姓 K', 'kessler']
    },
    {
      label: mark('病房里的灯是怎么回事', 'light'),
      to: 'E07-05c',
      prereq: 'read:/logs/ops_schedule.log',
      topic: 'light',
      asked: asked('light'),
      keys: ['灯', '排期', '光照']
    },
    {
      label: mark('这些年有人来看过你吗', 'visitor'),
      to: 'E07-05d',
      prereq: 'read:/subjects/e-07/console',
      topic: 'visitor',
      asked: asked('visitor'),
      keys: ['来看', '探视', '访客']
    },
    {
      label: mark('你为什么会被留在这里', 'why'),
      to: 'E07-05e',
      prereq: 'read:/home/kessler/journal.txt',
      topic: 'why',
      asked: asked('why'),
      keys: ['留在这里', '为什么', '签字', '入园']
    },
    {
      label: mark('录音里的那个孩子是谁', 'child'),
      to: 'E07-05f',
      prereq: ['portal_visit_seen', 'read:/subjects/e-07/console'],
      topic: 'child',
      asked: asked('child'),
      keys: ['录音', '片段']
    },
    {
      label: e07CanRequest() ? '不问了，听她说完' : '先不问了，回到刚才的话题',
      to: 'E07-05:skip',
      keys: ['不问了', '先不问']
    }
  ]
}

// 自由输入里的深层意图：先分流到带门槛的深层节点
function e07DeepTopicFromText (t) {
  if (/录音|片段/.test(t)) return 'E07-05f'
  if (/女儿|孩子/.test(t)) return 'E07-05a'
  if (/答应|许诺|承诺|姓.?k|kessler|凯斯勒/i.test(t)) return 'E07-05b'
  if (/灯|排期|光照|照明/.test(t)) return 'E07-05c'
  if (/有人.*来|来看|探视|访客/.test(t)) return 'E07-05d'
  if (/为什么.*(这里|在这)|签|入园|处置|那天/.test(t)) return 'E07-05e'
  return ''
}

// 浅话题：随口问就回一句，不推进
function e07ShallowReply (t) {
  if (/留话|留言|带话|转告|告诉|说给/.test(t)) {
    return '[VOICE] 你放那儿吧。我听不清的时候，会自己念一遍。'
  }
  if (/安慰|别怕|放心|陪|抱|难过|心疼|不疼|辛苦/.test(t)) {
    return '[VOICE] 谢谢。你别急着走。'
  }
  if (/今天|现在|还好吗|好吗|怎么样|过得|日子|白天|晚上/.test(t)) {
    return '[VOICE] 今天和昨天一样。灯亮过两次。'
  }
  if (/名字|你是谁|自己|在这儿|你怎么样|还活着/.test(t)) {
    return '[VOICE] 我还在这儿。这句话说出来有点怪。'
  }
  return ''
}

function resumeE07Nlu () {
  e07.busy = false
  e07.nlu = true
  e07.options = []
  e07.node = 'E07-03'
  nextTick(focusTalkInput)
}

// 停住等玩家按键后，再执行下一步；挂断或结束会取消
function holdE07 (cb) {
  const seq = e07Seq
  e07.busy = false
  e07.nlu = false
  e07.options = []
  waitForContinue().then((ok) => {
    if (!ok || !e07.active || seq !== e07Seq) return
    cb()
  })
}

// 右栏分段：同一通电话里，段与段之间只隔一条统一分隔线
const E07_SEP = '──────────'
let e07HasOutput = false
let e07HintShown = false

function e07OptionsWithExtras () {
  const opts = e07.options.slice()
  if (!e07.active || e07.node === 'E07-00') return opts
  // 只有仍在等输入的节点才补通用入口；纯台词节点停在「继续」
  if (!opts.length && !e07.nlu) return opts
  const canSkip = e07.nlu || e07.node === 'E07-02' || e07.node === 'E07-04'
  if (canSkip && !opts.some((o) => o.label === '先不问了，换个话题')) {
    opts.push({ label: '先不问了，换个话题', to: e07.node === 'E07-05' ? 'E07-05:skip' : 'E07-05' })
  }
  if (!opts.some((o) => o.to === 'exit')) opts.push({ label: '挂断', to: 'exit' })
  return opts
}

function endE07 () {
  cancelContinue()
  e07Seq++
  e07.active = false
  e07.node = ''
  e07.options = []
  e07.nlu = false
  e07.busy = false
  talkCollapsed.value = false
  talkInput.value = ''
  nextTick(focusInput)
}

async function runE07 (id) {
  // 深层菜单里的「不问了」：满足条件才进入请求，否则回到日常
  if (id === 'E07-05:skip') {
    return runE07(e07CanRequest() ? 'E07-07' : 'E07-03')
  }
  // E07-03 在请求已提出后不再开放，直接回到话题菜单
  if (id === 'E07-03' && store.choices.e07_request_heard) id = 'E07-05'
  const node = E07_NODES[id]
  if (!node) return endE07()
  // 深层话题前置不足：统一走 E07-06，不出现「未解锁」，也不泄露答案
  if (node.prereq && !e07PrereqMet(node.prereq)) {
    return runE07('E07-06')
  }
  const seq = ++e07Seq
  e07.active = true
  e07.busy = true
  e07.options = []
  e07.nlu = false
  e07.node = id
  if (id === 'E07-05') store.setChoice('e07_shallow_hits', 0)
  const willShow = !!(
    (node.lines && node.lines.length) ||
    node.menu ||
    node.opts ||
    node.nlu ||
    node.footer ||
    node.avoid
  )
  if (e07HasOutput && willShow) print(E07_SEP, 'dim')
  if (willShow) e07HasOutput = true
  let lines = node.lines || []
  // 回避轮换三种说法：不连着原样重复，也不提具体文件
  if (node.avoid) {
    const count = Number(store.choices.e07_avoid_count || 0)
    store.setChoice('e07_avoid_count', count + 1)
    const variants = [
      ['[VOICE] 你连这个都还没弄清楚，就来问我。', '[VOICE] 我怎么说。'],
      ['[VOICE] 你问得太早了。', '[VOICE] 有些事，你得先知道，我才能往下说。'],
      ['[VOICE] 这个我解释不了。', '[VOICE] 你先把该知道的弄清楚，再来问。']
    ]
    lines = variants[count % variants.length]
  }
  // 同一段台词反复进入时换说法，避免连续三次一模一样
  if (id === 'E07-02') {
    const count = Number(store.choices.e07_02_count || 0)
    store.setChoice('e07_02_count', count + 1)
    if (count >= 1) {
      const variants = [
        ['[VOICE] 你问的这些，我都记得一点点。'],
        ['[VOICE] 再说下去，我怕自己会忘。'],
        ['[VOICE] 换个说法吧。我有点累了。']
      ]
      lines = variants[(count - 1) % variants.length]
    }
  }
  if (id === 'E07-03') {
    const count = Number(store.choices.e07_03_count || 0)
    store.setChoice('e07_03_count', count + 1)
    if (count >= 1) {
      const variants = [
        ['[VOICE] 嗯。你说。'],
        ['[VOICE] 我还听着。'],
        ['[VOICE] 别急。慢慢说。']
      ]
      lines = variants[(count - 1) % variants.length]
    }
  }
  if (lines.length) {
    await typeLines(lines.map((t) => [t, e07Class(t)]), 520, () => seq !== e07Seq)
  }
  if (seq !== e07Seq) return
  if (node.set) {
    let set = node.set
    // 同一个深层话题反复问，不重复累计深层回答数
    if (node.topic) {
      const flag = `e07_${node.topic}`
      if (store.choices[flag]) {
        set = { ...set }
        delete set.e07_deep_answered
      }
    }
    applyE07Set(set)
  }
  if (node.footer) {
    print(
      node.footer === 'ended'
        ? 'B-2 · 探视记录：1 · 22:41'
        : 'B-2 · 探视记录：1 · 她还在等',
      'subtitle'
    )
  }
  if (node.menu) {
    e07.busy = false
    e07.options = e07MenuOptions()
    return
  }
  if (node.to) {
    const ok = await waitForContinue()
    if (!ok || seq !== e07Seq) return
    if (node.to === 'exit') return endE07()
    return runE07(node.to)
  }
  if (node.opts) {
    e07.busy = false
    e07.options = node.opts
    return
  }
  if (node.nlu) {
    e07.busy = false
    e07.nlu = true
    // 这套示例提示一通电话只出现一次，不和编号选项重复摆在一起
    if (!e07HintShown) {
      e07HintShown = true
      print('[SYS] 可以直接对她说点什么（对象 / 动作 / 情绪都行）。例：今天怎么样？ / 你女儿呢？ / 别怕，我在这儿。', 'sys')
    }
  }
}

// 进入顺序：先看两条收束的复访，再看是否已接通
function triggerE07 () {
  if (!e07CanEnter() || e07.active) return false
  cancelContinue()
  store.setChoice('e07_nl_fail', 0)
  store.setChoice('e07_slot_fallback', false)
  store.setChoice('e07_02_count', 0)
  store.setChoice('e07_03_count', 0)
  store.setChoice('e07_shallow_hits', 0)
  store.setChoice('e07_avoid_count', 0)
  e07HasOutput = false
  e07HintShown = false
  talkLines.value = []
  talkInput.value = ''
  talkCollapsed.value = false
  if (store.choices.e07_ended) {
    runE07('E07-11')
  } else if (store.choices.e07_refused) {
    runE07('E07-12')
  } else if (!store.choices.e07_entered) {
    runE07('E07-00')
  } else {
    runE07('E07-03')
  }
  return true
}

function handleE07Input (raw) {
  if (talkPending.value) return
  if (e07.busy) {
    print('[SYS] 通话窗口处理中。', 'sys')
    return
  }
  const text = raw.trim()
  // 这两句在任何节点都可用，不依赖选项顺序
  if (/^不问了$|^先不问了/.test(text)) {
    if (e07.node === 'E07-00') return print('（请先接通或挂断。）', 'dim')
    if (e07.node === 'E07-05') return runE07('E07-05:skip')
    return runE07('E07-05')
  }
  if (/^挂断$|^退出$/.test(text)) return endE07()
  const opts = e07OptionsWithExtras()
  const idx = /^\d+$/.test(text) ? Number(text) - 1 : -1
  const picked = idx >= 0 && opts[idx]
    ? opts[idx]
    : opts.find((o) => {
      if (text === o.label) return true
      const base = o.label.replace(/（问过了）$/, '')
      return text.includes(base) || (o.keys || []).some((k) => text.includes(k))
    })
  if (e07.nlu) {
    if (!picked) return handleE07Slots(text)
    if (picked.to === 'exit') return endE07()
    return runE07(picked.to)
  }
  if (!picked) {
    print('（请从选项中选择。）', 'dim')
    return
  }
  if (picked.to === 'exit') return endE07()
  return runE07(picked.to)
}

// 意图槽：浅话题随口回一句；深层话题按前置判断走正面回答或回避
function handleE07Slots (raw) {
  const t = raw.trim()
  if (!t) return
  // 玩家主动收住浅话题：直接打开深层话题菜单
  if (/几个问题|有问题|想问|问点别的|问别的/.test(t)) {
    store.setChoice('e07_nl_fail', 0)
    return runE07('E07-05')
  }
  const deep = e07DeepTopicFromText(t)
  if (deep) {
    store.setChoice('e07_nl_fail', 0)
    store.setChoice('e07_shallow_hits', 0)
    return runE07(deep)
  }
  const reply = e07ShallowReply(t)
  if (!reply) {
    store.setChoice('e07_shallow_hits', 0)
    const n = Number(store.choices.e07_nl_fail || 0) + 1
    store.setChoice('e07_nl_fail', n)
    if (n >= 2) return runE07('E07-04')
    print('[VOICE] ……我没听懂。', 'voice')
    print('[SYS] 可以换成这些说法：', 'sys')
    print('· 今天怎么样？', 'dim')
    print('· 你女儿呢？', 'dim')
    print('· 那些灯是什么？', 'dim')
    print('· 别怕，我在这儿。', 'dim')
    holdE07(resumeE07Nlu)
    return
  }
  store.setChoice('e07_nl_fail', 0)
  const hits = Number(store.choices.e07_shallow_hits || 0) + 1
  store.setChoice('e07_shallow_hits', hits)
  print(reply, 'voice')
  // 连续三次浅话题：她主动把话头转向别处
  if (hits >= 3) {
    store.setChoice('e07_shallow_hits', 0)
    print('[VOICE] 你是不是想问别的。', 'voice')
    holdE07(() => runE07('E07-05'))
    return
  }
  holdE07(resumeE07Nlu)
}

// 解析里的文件跳转：能切图形视图就打开文件详情，被剧情锁在命令行时退回 cat
function jumpToParseTarget (target) {
  if (!target || target.type !== 'file' || !target.path) return
  const path = target.path
  closeParse()
  if (viewLocked.value) {
    print(`[SYS] ${path}`, 'dim')
    cmdCat(path)
    return
  }
  if (mode.value !== 'gui') setMode('gui')
  const dir = path.slice(0, path.lastIndexOf('/') + 1) || '/'
  expandTo(dir)
  openFile(path)
}

// decrypt 密码输入态：非空表示正在等待密码
const pendingDecrypt = ref(null)

function print (t, c = '') {
  store.appendTermLines([{ t, c }])
  if (c === 'err') pulseError()
  // 对话期间同一行也进右栏，左栏与右栏共用同一份输出，不会各记各的
  if (dialogueActive.value && !creditsPlaying.value) {
    talkLines.value.push({ t, c })
    if (talkLines.value.length > 400) {
      talkLines.value.splice(0, talkLines.value.length - 400)
    }
    clearTimeout(talkScrollTimer)
    talkScrollTimer = setTimeout(() => {
      if (talkBodyRef.value) talkBodyRef.value.scrollTop = talkBodyRef.value.scrollHeight
    }, 30)
  }
}

// 报错时整块字符错位一次（只播一次，不残留）
function pulseError () {
  errorPulse.value = true
  clearTimeout(errorTimer)
  errorTimer = setTimeout(() => {
    errorPulse.value = false
  }, 340)
}

// 输出节流：成块内容排队逐行打印，避免一次性刷屏
// 所有成块输出共用一条队列，多次命令之间也不会互相插队
let sink = Promise.resolve()
function sleep (ms) {
  return new Promise((r) => setTimeout(r, ms))
}
function enqueueLines (items, gap, shouldStop) {
  sink = sink
    .then(async () => {
      for (const { t, c } of items) {
        if (shouldStop && shouldStop()) return
        print(t, c)
        if (gap > 0) await sleep(gap)
      }
    })
    .catch(() => {})
  return sink
}
function printBlock (text, c = '') {
  const items = text.split('\n').map((t) => ({ t, c }))
  // 行间隔按文本长度自适应：总时长控制在 1.6 秒内，避免长文件让人等太久
  const gap = Math.min(45, 1600 / Math.max(items.length, 1))
  return enqueueLines(items, gap)
}
function typeLines (items, delay = 420, shouldStop) {
  return enqueueLines(items.map(([t, c]) => ({ t, c })), delay, shouldStop)
}

// 逐字写出：直接改写 store 里的行，保持与持久化输出同一条数据
async function typeOut (text, c = '', delay = 6) {
  const idx = store.terminalLines.length
  store.appendTermLines([{ t: '', c }])
  for (const ch of text) {
    const cur = store.terminalLines[idx]
    if (!cur) return
    cur.t += ch
    await sleep(delay)
  }
}

// 读取大文件时的进度条：同一行原地推进，结束后保留终态
async function readProgress (path, bytes) {
  const idx = store.terminalLines.length
  const width = 16
  store.appendTermLines([{ t: `读取 ${path} …`, c: 'dim' }])
  for (let i = 1; i <= width; i++) {
    const cur = store.terminalLines[idx]
    if (!cur) return
    const pct = String(Math.round((i / width) * 100)).padStart(3, ' ')
    cur.t = `读取 ${path}  ${'█'.repeat(i)}${'░'.repeat(width - i)}  ${pct}%`
    await sleep(38)
  }
  const cur = store.terminalLines[idx]
  if (cur) cur.t = `读取 ${path}  ${'█'.repeat(width)}  100% · ${bytes} 字节`
}

const BIG_FILE = 600

// 大文件先走进度条，再吐正文；小文件保持原来的逐行打印
function readBlock (text, path) {
  const size = (text || '').length
  if (size < BIG_FILE) return printBlock(text)
  sink = sink.then(() => readProgress(path, size)).catch(() => {})
  return printBlock(text)
}

// 开机自检：逐字滚动，只在首次建立会话时播放
async function selfTest () {
  const rows = [
    'SELF-TEST · CERES-OS 4.7.1',
    '  mem ................ 65536K  OK',
    '  disk ............... /dev/sda1  OK',
    '  node ............... E-13/NODE-07  OK'
  ]
  for (const row of rows) {
    await typeOut(row, 'dim', 5)
    await sleep(80)
  }
}

function focusInput () {
  if (talkOpen.value) return
  inputRef.value && inputRef.value.focus()
}
function focusTalkInput () {
  nextTick(() => {
    if (talkOpen.value) talkInputRef.value && talkInputRef.value.focus()
  })
}
function onRootClick () {
  if (talkOpen.value) return
  focusInput()
}
function closeTalkPane () {
  if (!dialogueActive.value) return
  talkCollapsed.value = true
  nextTick(focusInput)
}
function openTalkPane () {
  talkCollapsed.value = false
  focusTalkInput()
}
function submitTalk () {
  if (talkBusy.value) return
  const raw = talkInput.value.trim()
  if (!raw) return
  unlockAudio()
  talkInput.value = ''
  if (e07.active) handleE07Input(raw)
  else if (mayaScene.active) handleStoryInput(raw)
  nextTick(() => {
    if (talkOpen.value) focusTalkInput()
  })
}
function pickTalkOption (i) {
  if (e07.active) {
    unlockAudio()
    const opt = e07OptionsWithExtras()[i]
    if (!opt) return
    if (opt.to === 'exit') return endE07()
    runE07(opt.to)
  } else {
    pickOption(i)
  }
  nextTick(() => {
    if (talkOpen.value) focusTalkInput()
  })
}
watch(talkOpen, (open) => {
  if (open) focusTalkInput()
})

onMounted(() => {
  window.addEventListener('keydown', onKey)
  document.addEventListener('mousedown', closeFileMenu)
  if (!store.terminalUnlocked) {
    router.replace('/inside/admin')
    return
  }
  if (!canEnterTerminal()) {
    router.replace({ path: '/inside/portal/it', query: { need: 'token' } })
    return
  }
  if (!store.cheatSeen) showCheat.value = true
  boot()
})

onBeforeUnmount(() => {
  cancelContinue()
  window.removeEventListener('keydown', onKey)
  document.removeEventListener('mousedown', closeFileMenu)
  clearTimeout(errorTimer)
  clearTimeout(switchTimer)
  clearTimeout(reasonPressTimer)
  clearTimeout(talkScrollTimer)
  stopAllAudio()
})

async function boot () {
  const isReconnect = store.terminalLines.length > 0
  if (isReconnect) {
    print('────────── 连接中断 · 会话重建 ──────────', 'dim')
  } else {
    await selfTest()
  }
  printBlock(
    `CERES-REYNOLD SECURE SHELL v2.3.1
连接建立 · 会话已加密 · 节点：E-13/NODE-07`,
    'dim'
  )
  if (isReconnect) {
    await typeLines([[`追踪标识：${store.fingerprint}`, 'warn']], 500)
  } else {
    await typeLines(
      [
        ['警告：您的访问行为正被记录。', 'warn'],
        [`追踪标识：${store.fingerprint}`, 'warn'],
        ['输入 help 查看可用命令。', 'dim']
      ],
      500
    )
  }
  focusInput()
}

// ---------- 命令处理 ----------
function run () {
  const raw = input.value
  input.value = ''
  // 解析弹层打开时吞掉输入，避免误触后台命令
  if (parsePath.value) return
  // 片尾播放中：回车直接跳过（仅复玩可跳）
  if (creditsPlaying.value) {
    skipCredits()
    return
  }
  if (!raw.trim()) return
  // 任意键入都算用户交互，借此解锁 AudioContext
  unlockAudio()
  // 玩家继续操作即视为离开 Maya 通道
  if (mayaOpen.value) closeMaya()
  // 密码输入态：不回显明文、不进历史
  if (pendingDecrypt.value) {
    print(`${promptStr.value} ******`, 'cmd')
    tryDecrypt(raw.trim())
    return
  }
  store.termHist.push(raw)
  histIdx.value = store.termHist.length
  print(`${promptStr.value} ${raw}`, 'cmd')
  if (mayaScene.active) return handleStoryInput(raw.trim())
  if (e07.active) return handleE07Input(raw.trim())
  handle(raw.trim())
}

function histPrev () {
  if (!store.termHist.length) return
  if (histIdx.value > 0) histIdx.value--
  input.value = store.termHist[histIdx.value] ?? ''
}
function histNext () {
  if (histIdx.value < store.termHist.length - 1) {
    histIdx.value++
    input.value = store.termHist[histIdx.value] ?? ''
  } else {
    histIdx.value = store.termHist.length
    input.value = ''
  }
}

// ---------- Tab 补全（bash 风格：只补当前层级的直接子项） ----------
const COMMANDS = [
  'help', 'ls', 'll', 'dir', 'cd', 'pwd', 'cat', 'type', 'more', 'open', 'a',
  'echo', 'whoami', 'sudo', 'clear', 'cls', 'uname', 'decrypt', 'resume', 'connect', 'gui', 'cli', 'exit', 'quit'
]

function onTab () {
  const value = input.value
  const m = value.match(/\S+$/)
  const prefix = m ? m[0] : ''
  const before = m ? value.slice(0, m.index) : value

  // 第一个词且不含斜杠 → 补全命令名
  if (!before.trim() && !prefix.includes('/')) {
    const cands = COMMANDS.filter((c) => c.startsWith(prefix))
    if (cands.length === 1) input.value = cands[0] + ' '
    else if (cands.length > 1) listCandidates(cands, value)
    return
  }

  // 路径补全：按 cwd 解析目录部分，只在该目录的直接子项里匹配
  const slashIdx = prefix.lastIndexOf('/')
  const dirText = slashIdx >= 0 ? prefix.slice(0, slashIdx + 1) : ''
  const frag = prefix.slice(slashIdx + 1)

  const dir = resolveDir(dirText || '.', store.cwd)
  if (!dir) return
  const items = DIRS[dir]
  const pool = frag.startsWith('.') ? [...items, ...(HIDDEN[dir] || [])] : items
  const matched = pool.filter((it) => it.startsWith(frag))
  if (!matched.length) return

  // 保持用户的输入风格（相对/绝对）
  const head = prefix.startsWith('/') ? dir : dirText
  const render = (name) => head + name

  if (matched.length === 1) {
    input.value = before + render(matched[0])
    return
  }
  // 多个候选：先补当前段的公共前缀；无新字符可补时列出候选（短名）
  let common = matched[0]
  for (const c of matched.slice(1)) {
    let i = 0
    while (i < common.length && common[i] === c[i]) i++
    common = common.slice(0, i)
  }
  if (common.length > frag.length) {
    input.value = before + render(common)
  } else {
    listCandidates(matched, value)
  }
}

function listCandidates (cands, echoInput) {
  print(`${promptStr.value} ${echoInput}`, 'cmd')
  print(cands.join('   '), 'dim')
}

// 常用别名：让不熟悉命令行的访客也能上手
const ALIASES = {
  dir: 'ls',
  ll: 'ls',
  type: 'cat',
  more: 'cat',
  open: 'cat',
  cls: 'clear',
  quit: 'exit',
  bye: 'exit'
}

function handle (raw) {
  const head = raw.split(/\s+/)[0]
  const arg = raw.slice(head.length).trim()

  if (head === '?') return openCheat()
  const cmd = ALIASES[head] || head

  switch (cmd) {
    case 'help': return cmdHelp()
    case 'ls': return cmdLs(head === 'll' ? `-a ${arg}`.trim() : arg)
    case 'cd': return cmdCd(arg)
    case 'pwd': return print(store.cwd, 'dim')
    case 'cat': return cmdCat(arg)
    case 'a': return cmdAnalyze(arg)
    case 'echo': return cmdEcho(arg)
    case 'whoami': return cmdWhoami()
    case 'sudo': return cmdSudo()
    case 'clear': return store.clearTermLines()
    case 'gui': return setMode('gui')
    case 'cli': return setMode('cli')
    case 'exit': return cmdExit()
    case 'resume': return cmdResume(arg)
    case 'connect': return cmdConnect(arg)
    case 'decrypt': return cmdDecrypt(arg)
    case 'uname':
      return print('CeresOS 4.7.1-persephone x86_64', 'dim')
    default:
      print(`bash: ${head}: command not found`, 'err')
      return print('· 输入 help 查看可用命令，问号（?）可打开速查卡', 'dim')
  }
}

// ---------- 视图切换：同一个 cwd、同一份输出，只换呈现 ----------
function setMode (next) {
  if (next === 'gui' && viewLocked.value) {
    print('（Maya 通道占用中，暂时不能切到图形视图。）', 'dim')
    return
  }
  if (mode.value === next) {
    print(next === 'gui' ? '当前已在图形视图。' : '当前已在命令行视图。', 'dim')
    return
  }
  mayaOpen.value = false
  dirNotice.value = ''
  mode.value = next
  switching.value = true
  clearTimeout(switchTimer)
  switchTimer = setTimeout(() => {
    switching.value = false
  }, 360)
  if (next === 'gui') {
    selectedPath.value = null
    expandTo(dirKey(store.cwd))
  }
  focusInput()
}

// 进入 Maya 段：记住原视图并切到命令行，期间禁止切回图形视图
function lockStoryToCli () {
  if (!viewLocked.value) viewReturn.value = mode.value
  viewLocked.value = true
  if (mode.value !== 'cli') setMode('cli')
}

// Maya 段结束：恢复玩家进入前的视图
function restoreStoryView () {
  viewLocked.value = false
  if (viewReturn.value === 'gui' && mode.value !== 'gui') setMode('gui')
  viewReturn.value = 'cli'
}

// ---------- 图形视图：文件树 / 面包屑 / 文件内容 ----------
function dirKey (p) {
  if (!p || p === '/') return '/'
  return p.endsWith('/') ? p : p + '/'
}

// 时钟 B 生效期间，意识文件只读
function lockWindowLeft () {
  if (store.lockStart === null) return 0
  return Math.max(0, store.lockDuration - (Date.now() - store.lockStart))
}
function lockedByWindow (path) {
  return lockWindowLeft() > 0 && path.startsWith('/system/maya/')
}

const crumbs = computed(() => {
  const segs = store.cwd === '/' ? [] : store.cwd.split('/').filter(Boolean)
  const out = []
  let acc = ''
  for (const s of segs) {
    acc += '/' + s
    out.push({ name: s, path: acc })
  }
  return out
})

function isLockedDir (dir) {
  if (LOCKED.has(dir)) return true
  // E-12 目录按剧情开门：第五章真相确认后才可列举
  if (dir === '/subjects/e-12/' && !store.choices.c5_entry_ready) return true
  return false
}

function lockReason (key) {
  if (isLockedDir(key)) return true
  return key === '/home/kessler/' && sessionUser.value !== 'kessler'
}

function entriesOf (dir) {
  return (DIRS[dir] || []).map((name) => {
    const isDir = name.endsWith('/')
    const path = dir + name
    return {
      name: isDir ? name.slice(0, -1) : name,
      path,
      isDir,
      locked: isDir && lockReason(path)
    }
  })
}

const dirEntries = computed(() => entriesOf(dirKey(store.cwd)))

const treeNodes = computed(() => {
  const out = []
  function walk (dir, depth) {
    for (const e of entriesOf(dir)) {
      out.push({ ...e, depth })
      if (e.isDir && !e.locked && expanded.value.has(e.path)) walk(e.path, depth + 1)
    }
  }
  walk('/', 0)
  return out
})

function expandTo (key) {
  expanded.value.add('/')
  if (key === '/') return
  let acc = ''
  for (const seg of key.split('/').filter(Boolean)) {
    acc += '/' + seg + '/'
    expanded.value.add(acc)
  }
}

function enterDir (dir) {
  const key = dirKey(dir)
  if (!DIRS[key]) return false
  if (lockReason(key)) {
    dirNotice.value = `权限不足：${key}`
    return false
  }
  store.cwd = key === '/' ? '/' : key.replace(/\/$/, '')
  selectedPath.value = null
  fileNote.value = ''
  fileErr.value = false
  dirNotice.value = ''
  expandTo(key)
  return true
}

function goPath (path) {
  enterDir(path)
}

function onTreeClick (n) {
  if (!n.isDir) {
    openFile(n.path)
    return
  }
  if (n.locked) {
    selectedPath.value = null
    dirNotice.value = `权限不足：${n.path}`
    return
  }
  // 点目录 = 进入；已经停在当前目录时，再点一次折叠/展开
  if (dirKey(store.cwd) === n.path) {
    if (expanded.value.has(n.path)) expanded.value.delete(n.path)
    else expanded.value.add(n.path)
    return
  }
  enterDir(n.path)
  expanded.value.add(n.path)
}

const SCAN_TEXT = `PNG
IHDR
tEXtSoftwareCR-SCAN/3.0 600dpi 2018-04-02T09:14:33x
tEXtviewer.uri/inside/maya-05
IDATx^ÿÿ
IENDB\`
……（二进制流共 2.1MB，余下省略）`

function openFile (path) {
  selectedPath.value = path
  dirNotice.value = ''
  fileNote.value = ''
  fileErr.value = false
  const name = path.split('/').pop()

  // 按剧情上锁的目录：文件未解锁前不读取内容
  if (isLockedDir(path.slice(0, path.lastIndexOf('/') + 1))) {
    fileBody.value = `[locked] ${path}\n权限不足`
    fileNote.value = '权限不足'
    fileErr.value = true
    return
  }

  // console 是只写设备；读完 B-2 维生记录后，打开即接通 E-07
  if (path === '/subjects/e-07/console') {
    if (e07CanEnter()) {
      selectedPath.value = null
      if (mode.value !== 'cli') setMode('cli')
      triggerE07()
      return
    }
    fileBody.value = `[console] ${path}\n单向文本输入设备 · 不可读取`
    fileNote.value = '只写设备'
    fileErr.value = true
    pulseError()
    return
  }

  if (path in ENCRYPTED) {
    if (store.readFiles.includes(path)) {
      fileBody.value = ENCRYPTED[path].content
      fileNote.value = '已解密'
      return
    }
    fileBody.value = `[encrypted] ${path}\nAES-256-GCM · 内容不可直接查看\n\n解密：decrypt ${name}`
    fileNote.value = '已加密'
    return
  }

  // 锁窗期间：意识文件加密只读
  if (lockedByWindow(path)) {
    fileBody.value = `[locked] ${path}\n哀悼协议锁窗期间，意识文件加密只读。`
    fileNote.value = '锁窗中'
    fileErr.value = true
    return
  }

  if (path in DAMAGED) {
    const dmg = DAMAGED[path]
    fileBody.value = `${dmg.text || '（无可用内容）'}\n\n读取中断 · 数据块校验失败 · 已恢复 ${dmg.readable} 字节`
    fileNote.value = '读取中断'
    fileErr.value = true
    store.markFileRead(path)
    pulseError()
    return
  }

  // 二进制扫描件：走终端层，由 Maya 通道呈现
  if (path === '/home/kessler/maya-05.scan') {
    fileBody.value = SCAN_TEXT
    fileNote.value = '二进制扫描件'
    applyReadHooks(path)
    openMaya(SCAN_TEXT)
    return
  }

  fileBody.value = (FILES[path] || '').replace(/\{\{FP\}\}/g, store.fingerprint)
  applyReadHooks(path)
}

// Maya 只在终端层出现：图形视图里触发时整层浮上来盖住，看完可继续
function openMaya (text) {
  mayaLines.value = text.split('\n').map((t) => ({ t, c: '' }))
  mayaOpen.value = true
}

function closeMaya () {
  mayaOpen.value = false
  focusInput()
}

// 读取文件后的剧情钩子：命令行与图形视图共用同一套
function applyReadHooks (path) {
  // 读过才允许解析：这是「解析」唯一的门槛，不产生任何剧情状态
  store.markFileRead(path)
  if (path === '/etc/memos/bait_protocol.txt') {
    const alreadyRead = store.evidenceIds.includes('ev_bait_protocol')
    store.addEvidence('ev_bait_protocol')
    store.setChoice('c2_read_bait', true)
    if (!alreadyRead) {
      setTimeout(() => {
        store.startTimer()
        import('../data/emails').then((m) => store.showAlert(m.AC_EMAIL))
      }, 4000)
    }
  } else if (path === '/logs/e-09_fragments.log') {
    store.addEvidence('ev_e09_fragments')
  } else if (path === '/home/kessler/journal.txt') {
    store.addEvidence('ev_kessler_journal')
  } else if (path === '/home/kessler/maya-05.scan') {
    store.addEvidence('ev_maya05')
  } else if (path === '/system/maya/reset.log') {
    store.addEvidence('ev_maya_reset_log')
  } else if (path === '/system/maya/mourning.txt') {
    store.addEvidence('ev_mourning_protocol')
  } else if (path === '/system/maya/console') {
    // 打开控制台即可留证；不执行任何删除
    store.addEvidence('ev_kessler_queue')
  } else if (path === '/system/e-13/brain') {
    store.addEvidence('ev_e13_brain_log')
  }

  // E-12 生命体征日志：只留读后系统行，不入证据板
  if (path === '/subjects/e-12/vitals.log') {
    print('[SYS] 该文件未加入证据板。', 'sys')
  }
}

// ---------- 第四至七章：剧情节点机 ----------
const NODES = { ...C4_NODES, ...C5_NODES, ...C6_NODES, ...E7_NODES }

const C4_EVIDENCE = {
  11: 'ev_maya_reset_log',
  12: 'ev_mourning_protocol',
  13: 'ev_memory_seam_01',
  14: 'ev_kessler_queue',
  15: 'ev_memory_seam_02',
  16: 'ev_e13_brain_log'
}

function c4Class (t) {
  if (!t) return ''
  if (t.startsWith('[SYS]')) return 'sys'
  if (t.startsWith('（')) return 'dim'
  if (t.startsWith('"')) return 'maya'
  return ''
}

function applyC4Set (set) {
  if (!set) return
  for (const [key, value] of Object.entries(set)) {
    if (key === 'ev') {
      const id = C4_EVIDENCE[value]
      if (id) store.addEvidence(id)
      continue
    }
    if (key === 'arg_ng_plus') {
      store.markNgPlus()
      continue
    }
    if (typeof value === 'string' && value.startsWith('+')) {
      const step = Number(value.slice(1)) || 1
      store.setChoice(key, Number(store.choices[key] || 0) + step)
      continue
    }
    store.setChoice(key, value)
  }
}

function conditionMet (when) {
  if (!when) return true
  if (when === 'a2') {
    return store.evidenceIds.includes('ev_kessler_queue') ||
      store.evidenceIds.includes('ev_e13_brain_log')
  }
  if (when === 'b') return !!store.choices.c4_1_protocol_active
  if (when === 'd') return store.evidenceIds.length >= store.endingDThreshold
  if (when === 'lena') return !!store.choices.c5_entry_ready
  if (when === 'maya') return !!store.choices.c4_1_protocol_active
  return true
}

function normOption (o) {
  const ok = !o.disabled && conditionMet(o.when)
  return {
    label: o.label,
    to: o.to,
    disabled: !ok,
    reason: ok ? '' : (o.reason || '')
  }
}

function printHubHint () {
  print('（可用命令：help / look / talk / touch / walk / wait / remember / exit）', 'dim')
  print('（也可以直接问：你是谁 · 你被重置了多少次 · 你想让我做什么 · 你恨她吗 · 帮我出去）', 'dim')
}

function backToHub () {
  revealedReasons.clear()
  if (mayaScene.chapter >= 6) {
    mayaScene.mode = 'choice'
    return
  }
  if (mayaScene.hub === 'c5q') {
    mayaScene.mode = 'hub'
    mayaScene.options = mayaScene.locked
      ? [{ label: '继续问', to: 'C5-31' }, { label: '不问了', to: 'C5-90' }]
      : []
    return
  }
  mayaScene.mode = 'hub'
  mayaScene.options = mayaScene.locked ? C4_HUB_OPTIONS.map(normOption) : []
}

async function playCredits () {
  creditsPlaying.value = true
  creditsSkippable.value = !mayaScene.endingFirst
  creditsAbort = false
  for (const t of CREDITS) {
    if (creditsAbort) break
    print(t, t ? 'dim' : '')
    await sleep(t ? 1150 : 650)
  }
  creditsPlaying.value = false
  creditsSkippable.value = false
  return runNode('E7-02')
}

// 复玩时跳过片尾：按钮或直接输入都能触发
function skipCredits () {
  if (!creditsSkippable.value) return
  creditsAbort = true
}

async function finishEnding (node) {
  if (node.ending) playEndingAmbient(node.ending)
  // 先让字幕/片尾停留，再黑屏
  if (node.outro) {
    for (const t of node.outro) {
      print(t, 'subtitle')
      await sleep(520)
    }
    await sleep(1200)
  } else if (node.subtitle) {
    print(node.subtitle, 'subtitle')
    await sleep(1600)
  }
  // 所有结局先黑屏：放弃保留脚本层时长，其余约 1.2 秒
  blackout.value = true
  await sleep(node.blackout || 1200)
  blackout.value = false
  mayaScene.endingFirst = !!node.ending && !store.arg_endings_v1.includes(node.ending)
  if (node.ending) store.unlockEnding(node.ending)
  await runNode('E7-00')
}

function finishStory () {
  cancelContinue()
  stopAllAudio()
  transferPct.value = 0
  mayaScene.active = false
  mayaScene.options = []
  talkCollapsed.value = false
  talkInput.value = ''
  focusInput()
  router.push('/records')
}

// 转移过程：系统行照常逐行出现，右上角同步递增 12% / 64% / 100%
async function playTransferLines (lines) {
  for (const t of lines) {
    print(t, c4Class(t))
    const m = String(t).match(/(\d+)\s*%/)
    if (m) transferPct.value = Number(m[1])
    await sleep(780)
  }
  await sleep(260)
  transferPct.value = 0
}

async function runNode (id) {
  if (id === 'HUB') return backToHub()
  const node = NODES[id]
  if (!node) return backToHub()
  if (node.once && mayaScene.visited.has(id)) return backToHub()
  mayaScene.visited.add(id)
  if (node.chapter) mayaScene.chapter = node.chapter
  mayaScene.hub = node.hub || null
  mayaScene.options = []
  revealedReasons.clear()
  mayaScene.mode = 'hub'
  mayaScene.traceSuppressed = false

  if (node.pre) {
    await typeLines(node.pre.map((t) => [t, c4Class(t)]), 320)
    if (node.pause) await sleep(node.pause)
  }

  let lines = node.lines || []
  if (node.file) {
    const content = (FILES[node.file] || '').replace(/\{\{FP\}\}/g, store.fingerprint)
    lines = content.split('\n')
  }
  if (node.byCount) {
    const n = Number(store.choices[node.byCount.key] || 0)
    lines = node.byCount.lines[Math.min(n, node.byCount.lines.length - 1)]
  }
  if (lines.length) {
    if (node.transfer) await playTransferLines(lines)
    else await typeLines(lines.map((t) => [t, c4Class(t)]), node.gap || 300)
  }
  if (node.extras) {
    for (const ex of node.extras) {
      if (conditionMet(ex.when)) {
        await typeLines(ex.lines.map((t) => [t, c4Class(t)]), 300)
      }
    }
  }

  const wasActive = !!store.choices.c4_1_protocol_active
  applyC4Set(node.set)
  // 两个时钟只在这里改写：C4-14 启动锁窗，C4-15 扣追踪 12 小时
  if (node.clock === 'lock' && !wasActive) store.startLockWindow()
  if (node.clock === 'minus12') store.shortenTimer(12)

  // 追踪已归零：进入终局选择时先压两句，六个选项全部不可用
  if (node.traceSuppress && store.choices.trace_expired) {
    await typeLines(node.traceSuppress.lines.map((t) => [t, 'ac']), 420)
    mayaScene.traceSuppressed = true
  }

  if (node.hint && !mayaScene.hintedHubs.has(id)) {
    mayaScene.hintedHubs.add(id)
    for (const t of node.hint) print(t, 'dim')
  }

  if (node.restoreView) restoreStoryView()

  if (node.nextBy) {
    if (!(await waitForContinue())) return
    const v = store.choices[node.nextBy.key]
    return runNode(v ? node.nextBy.true : node.nextBy.false)
  }
  if (node.next) {
    if (!(await waitForContinue())) return
    return runNode(node.next)
  }
  if (node.type === 'end') {
    if (!(await waitForContinue())) return
    // 陈默醒来：文本照脚本打印，配音用浏览器语音合成顶替
    if (node.ending === 'A2') speakChenWake()
    return finishEnding(node)
  }
  if (node.credits) {
    if (!(await waitForContinue())) return
    return playCredits()
  }
  if (node.finish) {
    if (!(await waitForContinue())) return
    return finishStory()
  }
  if (node.type === 'input') {
    mayaScene.mode = node.inputKind === 'message' ? 'message' : 'code'
    mayaScene.options = (node.opts || []).map(normOption)
    if (mayaScene.mode === 'code') print('激活码：', 'dim')
    return
  }
  if (node.opts) {
    mayaScene.mode = 'choice'
    mayaScene.options = node.opts.map((o) => {
      const opt = normOption(o)
      return mayaScene.traceSuppressed
        ? { ...opt, disabled: true, reason: '' }
        : opt
    })
    return
  }
  if (node.hub === 'c5q' && mayaScene.locked) {
    mayaScene.mode = 'choice'
    mayaScene.options = [
      { label: '继续问', to: 'C5-31' },
      { label: '不问了', to: 'C5-90' }
    ]
    return
  }
  if (!(await waitForContinue())) return
  backToHub()
}

function resetSceneState (chapter) {
  cancelContinue()
  // 不再为对话强制切到命令行：左栏保持玩家进来前的视图
  mayaScene.active = true
  mayaScene.chapter = chapter
  mayaScene.mode = 'hub'
  mayaScene.hub = null
  mayaScene.options = []
  mayaScene.locked = false
  mayaScene.failStreak = 0
  mayaScene.endingFirst = false
  mayaScene.visited.clear()
  mayaScene.hintedHubs.clear()
  revealedReasons.clear()
  transferPct.value = 0
  talkLines.value = []
  talkInput.value = ''
  talkCollapsed.value = false
}

async function enterMayaScene () {
  resetSceneState(4)
  store.markEvent('chapter4_entered')
  if (store.choices.c4_entered) {
    print('[SYS] 已连接 /system/maya', 'sys')
    printHubHint()
    return
  }
  await runNode('C4-00')
  printHubHint()
}

// 第四、五、六章的断点续接：只读脚本层已有的状态键
async function enterChapter5 () {
  resetSceneState(5)
  if (!store.choices.c5_error_seen) return runNode('C5-00')
  if (!store.choices.c5_entry_ready) return runNode('C5-01')
  if (!store.choices.c5_1_continue) return runNode('C5-91')
  if (!store.choices.c6_ending) return runNode('C6-02')
}

function pickOption (i) {
  unlockAudio()
  const opt = mayaScene.options[i]
  if (!opt) return
  // 追踪已归零：第六章任何终局选项都先被 A.C. 收走
  if (mayaScene.chapter === 6 && store.choices.trace_expired) {
    mayaScene.options = []
    mayaScene.traceSuppressed = false
    runNode('C6-70')
    focusInput()
    return
  }
  if (opt.disabled) {
    if (opt.reason) print(opt.reason, 'dim')
    return
  }
  if (mayaScene.mode === 'message') store.setChoice('c6_left_message', true)
  mayaScene.options = []
  runNode(opt.to)
  if (talkOpen.value) focusTalkInput()
  else focusInput()
}

// 触屏长按：按住 420ms 显示灰显选项的理由；悬停与键盘聚焦由 CSS 负责
function startReasonPress (i, opt) {
  if (!opt || !opt.disabled || !opt.reason) return
  clearTimeout(reasonPressTimer)
  reasonPressTimer = setTimeout(() => {
    revealedReasons.add(i)
  }, 420)
}

function endReasonPress () {
  clearTimeout(reasonPressTimer)
  reasonPressTimer = null
}

function handleActivationInput (raw) {
  const t = raw.toLowerCase().replace(/\s+/g, '')
  // 受控输入始终留一个稳定出口：再想想 / 取消 / 退出 / 0
  if (/再想想|取消|退出|exit|^0$/.test(t)) return runNode('C4-17')

  // 三类词各自接受同义说法；「这个 / 这碗」在上下文中按汤处理
  const pea = /(豌豆|豆子|pea)/.test(t)
  const soup = /(汤|羹|soup)/.test(t)
  const dislike = /(不喜欢|讨厌|不爱|不喝|不吃|难喝|恶心|受不了|hate)/.test(t)
  const anaphora = /(这个|那个|它|这碗|那碗)/.test(t)
  const ok = /pea_?soup_?hate/.test(t) ||
    (pea && soup && dislike) ||
    (soup && dislike) ||
    (dislike && anaphora)
  return runNode(ok ? 'C4-14' : 'C4-15')
}

function handleC4Input (raw) {
  const head = raw.toLowerCase().split(/\s+/)[0]
  if (head === 'look') return runNode('C4-01')
  if (head === 'talk') return runNode('C4-02')
  if (head === 'touch') return runNode('C4-09')
  if (head === 'walk') return runNode('C4-10')
  if (head === 'wait') return runNode('C4-11')
  if (head === 'remember') return runNode('C4-12')
  if (head === 'help') return runNode('C4-08')

  if (mayaScene.locked) {
    print('（她没有回应。选项还在。）', 'dim')
    return
  }

  // 意图槽：命中即答，未命中累计两次后锁成固定选项
  const id = matchC4Topic(raw, {
    talkCount: Number(store.choices.talk_count || 0),
    touchCount: Number(store.choices.touch_count || 0)
  })
  if (id) {
    mayaScene.failStreak = 0
    return runNode(id)
  }
  mayaScene.failStreak += 1
  if (mayaScene.failStreak >= 2) {
    mayaScene.locked = true
    print('"我不想猜了。你选。"', 'maya')
    mayaScene.mode = 'choice'
    revealedReasons.clear()
    mayaScene.options = C4_HUB_OPTIONS.map(normOption)
    return
  }
  print('"……我没听懂。"', 'maya')
}

function handleC5Input (raw) {
  const head = raw.toLowerCase().split(/\s+/)[0]

  // C5-01：三条入口既可用选项，也可直接敲脚本层里的命令
  if (mayaScene.hub === 'c5') {
    if (head === 'open' || head === 'cat') {
      const p = resolvePath(raw.slice(head.length).trim(), '/')
      if (p === '/system/e-13/brain') return runNode('C5-10')
      if (p === '/system/e-09/persona') return runNode('C5-20')
    }
    if (head === 'connect') {
      const p = resolvePath(raw.slice(head.length).trim(), '/')
      if (p === '/system/e-09') return runNode('C5-30')
    }
    print('[SYS] 可用：open /system/e-13/brain · open /system/e-09/persona · connect /system/e-09', 'dim')
    return
  }

  // C5-31：莱娜提问 hub
  if (mayaScene.hub === 'c5q') {
    if (mayaScene.locked) {
      print('（她没有回应。选项还在。）', 'dim')
      return
    }
    if (/不问了|退出|exit/.test(raw)) return runNode('C5-90')
    const id = matchLenaTopic(raw)
    if (id) {
      mayaScene.failStreak = 0
      return runNode(id)
    }
    mayaScene.failStreak += 1
    if (mayaScene.failStreak >= 2) {
      mayaScene.locked = true
      print('"你在绕。说清楚。"', 'lena')
      mayaScene.mode = 'choice'
      revealedReasons.clear()
      mayaScene.options = [
        { label: '继续问', to: 'C5-31' },
        { label: '不问了', to: 'C5-90' }
      ]
      return
    }
    print('"你在问什么。"', 'lena')
    return
  }

  print('（请从选项中选择。）', 'dim')
}

function handleStoryInput (text) {
  const raw = text.trim()
  if (!raw) return
  const head = raw.toLowerCase().split(/\s+/)[0]

  if (mayaScene.chapter === 4 && (head === 'exit' || head === 'quit')) {
    store.markEvent('exit_attempted')
    return runNode('C4-18')
  }
  if (mayaScene.mode === 'code') return handleActivationInput(raw)

  // 固定选项：数字或选项原文
  if (mayaScene.options.length) {
    const idx = /^\d+$/.test(raw) ? Number(raw) - 1 : -1
    if (idx >= 0 && idx < mayaScene.options.length) return pickOption(idx)
    const hit = mayaScene.options.findIndex((o) => raw.includes(o.label) || o.label.includes(raw))
    if (hit >= 0) return pickOption(hit)
  }
  if (mayaScene.mode === 'message') {
    print('（选一条。）', 'dim')
    return
  }

  if (mayaScene.chapter === 4) return handleC4Input(raw)
  if (mayaScene.chapter === 5) return handleC5Input(raw)
  print('（请从选项中选择。）', 'dim')
}

function cmdCd (arg) {
  const target = arg.trim()
  if (target === '~') {
    store.cwd = '/'
    return
  }
  const dir = resolveDir(target || '.', store.cwd)
  if (!dir) {
    if (resolveFile(target, store.cwd)) {
      print(`cd: ${target}: 不是目录`, 'err')
    } else {
      print(`cd: ${target}: 没有那个文件或目录`, 'err')
      print('· 使用 ls 查看当前目录内容', 'dim')
    }
    return
  }
  if (isLockedDir(dir)) {
    print(`cd: ${target}: 权限不足`, 'err')
    return
  }
  store.cwd = dir === '/' ? '/' : dir.replace(/\/$/, '')
}

function cmdHelp () {
  printBlock(
    `可用命令：
  ls [-a] [路径]         列出目录（ll = ls -a）
  cd <路径>              切换目录（支持相对路径与 ..）
  pwd                    显示当前路径
  cat <文件>             读取文件（type / more / open 同义）
  a <文件>               解析已读文件（也接受完整路径）
  gui / cli              图形视图 / 回到命令行
  decrypt <文件>         解密加密文件
  echo <文本> > <文件>   写入文件（部分路径受限）
  resume <会话ID>        接管挂起会话
  connect /system/maya   连接 Maya 通道
  whoami                 当前身份
  clear                  清屏（cls 同义）
  exit                   断开连接`,
    'dim'
  )
}

function cmdLs (arg) {
  let showAll = false
  let target = arg.trim()
  if (target === '-a' || target === '-la' || target === '-al') {
    showAll = true
    target = ''
  } else if (target.startsWith('-a ') || target.startsWith('-la ') || target.startsWith('-al ')) {
    showAll = true
    target = target.replace(/^-\w+\s+/, '')
  }
  const dir = resolveDir(target, store.cwd)
  if (!dir) {
    const file = resolveFile(target, store.cwd)
    if (file) {
      const fdir = file.slice(0, file.lastIndexOf('/') + 1)
      if (isLockedDir(fdir)) {
        print(`ls: 无法访问 '${target}': 权限不足`, 'err')
        return
      }
      print(file.split('/').pop())
      return
    }
    print(`ls: 无法访问 '${target}': 没有那个文件或目录`, 'err')
    print('· 使用 ls 查看当前目录内容', 'dim')
    return
  }
  if (isLockedDir(dir) || (dir === '/home/kessler/' && sessionUser.value !== 'kessler')) {
    print(`ls: 无法打开目录 '${target}': 权限不足`, 'err')
    return
  }
  const visible = DIRS[dir].length ? [...DIRS[dir]] : []
  if (showAll) {
    const hidden = HIDDEN[dir] || []
    visible.unshift('.', '..', ...hidden)
  }
  if (visible.length) print(visible.join('   '))
}

function cmdDecrypt (arg) {
  if (!arg) {
    print('用法: decrypt <文件>', 'dim')
    print('· 加密存档的口令由门户里的两处日期记录拼合，不在终端直接给出', 'dim')
    return
  }
  const path = resolveFile(arg, store.cwd)
  if (!path || !(path in ENCRYPTED)) {
    print(`decrypt: ${arg}: 不是加密文件或不存在`, 'err')
    if (resolveFile(arg, store.cwd)) print('· 该文件未加密，可用 cat 直接读取', 'dim')
    return
  }
  if (path.startsWith('/home/kessler/') && sessionUser.value !== 'kessler') {
    print(`decrypt: ${arg}: 权限不足`, 'err')
    return
  }
  // 老档兼容：已经解过的文件不再重复拦
  if (store.readFiles.includes(path)) {
    print('[OK] 该文件在存档中已解密。', 'ok')
    printBlock(ENCRYPTED[path].content)
    return
  }
  pendingDecrypt.value = path
  print(`[decrypt] ${path} · AES-256-GCM`, 'dim')
  print('密码：', 'dim')
}

function tryDecrypt (pwd) {
  const path = pendingDecrypt.value
  if (pwd === 'exit') {
    pendingDecrypt.value = null
    print('已取消。', 'dim')
    return
  }
  const enc = ENCRYPTED[path]
  // 只比较数字：允许 2019-07-19 / 20190719 / 两个日期用空格或连字符分隔
  const digits = (s) => String(s).replace(/\D/g, '')
  if (digits(pwd) !== digits(enc.password)) {
    print('解密失败：密码错误', 'err')
    return
  }
  pendingDecrypt.value = null
  print('[OK] 解密成功。', 'ok')
  printBlock(enc.content)
  // 解密成功即视为读过一次，允许后续 a 解析
  store.markFileRead(path)

  // 剧情钩子
  if (path === '/temp/dusk_archive.enc') store.addEvidence('ev_dusk_archive')
  else if (path === '/logs/park_ops_2018.enc') store.addEvidence('ev_park_ops')
  else if (path === '/home/kessler/maya_backup.enc') {
    store.addEvidence('ev_maya_backup')
    store.setChoice('c3_found_maya_partition', true)
    store.markEvent('maya_partition_found')
    // 本次试玩的内容边界：maya-13-7-19 需通过 PERSEPHONE 控制台访问（第四、五章）
    setTimeout(() => store.showDevNotice(), 2500)
  }
}

function cmdConnect (arg) {
  const target = arg.trim()
  const abs = target
    ? resolvePath(target, store.cwd).replace(/\/$/, '')
    : (store.cwd === '/system/maya' ? '/system/maya' : '')
  if (abs !== '/system/maya') {
    print('用法: connect /system/maya', 'dim')
    return
  }
  // 第四道门：PERSEPHONE 控制台只读权限；老档已进入过 Maya 场景的直接放行
  if (!store.choices.c3_skip_gates && !store.choices.c3_persephone_granted &&
      !store.choices.c4_entered && !store.choices.c5_error_seen && !store.choices.c6_ending) {
    print('[SYS] 访问被拒绝：/system/maya 需要「PERSEPHONE 控制台 · 只读权限」。', 'err')
    print('· 打开员工门户 → 权限申请，提交一张权限开通工单：', 'dim')
    print('  系统 PERSEPHONE 控制台 · 节点 CR-PARK-07 · 工单 T-2293 · 审批人需具备该节点签署权限。', 'dim')
    print('· 提交后刷新权限申请页，拿到授权再回来执行 connect。', 'dim')
    return
  }
  if (store.choices.c5_error_seen && !store.choices.c6_ending) {
    enterChapter5()
    return
  }
  enterMayaScene()
}

function cmdResume (arg) {
  const id = (arg || '').trim().toLowerCase()
  if (!id) {
    print('用法: resume <会话-id>', 'dim')
    print('· 挂起会话编号可在交接记录的隐藏会话文件中查到', 'dim')
    return
  }
  if (id !== '0x0a9') {
    print(`resume: 会话 ${arg} 不存在或已关闭`, 'err')
    return
  }
  if (sessionUser.value === 'kessler') {
    print('resume: 会话 0x0A9 已是当前会话', 'dim')
    return
  }
  typeLines(
    [
      ['正在恢复挂起会话 0x0A9 …', 'dim'],
      ['owner=kessler.s · scope=admin · last_active=2021-03-19 03:58:44', 'dim'],
      ['[OK] 会话已恢复。', 'ok']
    ],
    500
  ).then(() => {
    store.sessionUser = 'kessler'
    store.setChoice('c3_resumed_kessler', true)
    store.markEvent('kessler_resumed')
  })
}

function cmdAnalyze (arg) {
  if (!arg) {
    print('用法: a <文件>', 'dim')
    return
  }
  const path = resolveFile(arg, store.cwd)
  if (!path) {
    print(`a: ${arg}: 没有那个文件或目录`, 'err')
    return
  }
  if (isLockedDir(path.slice(0, path.lastIndexOf('/') + 1))) {
    print(`a: ${arg}: 权限不足`, 'err')
    return
  }
  openParse(path)
}

function cmdCat (arg) {
  if (!arg) {
    print('用法: cat <文件>', 'dim')
    return
  }
  const path = resolveFile(arg, store.cwd)
  if (!path) {
    // console 是只写设备；通话前可读一次自述，写入留言才接通
    const norm = resolvePath(arg, store.cwd).replace(/\/$/, '')
    if (norm === '/subjects/e-07/console') {
      if (e07CanEnter()) {
        printBlock(E07_CONSOLE_SELF)
        store.markFileRead('/subjects/e-07/console')
        print('· 设备只写。写入一条留言可接通床旁通话。', 'dim')
        return
      }
      print(`cat: ${arg}: 只写设备，不可读取`, 'err')
      return
    }
    const dir = resolveDir(arg, store.cwd)
    if (dir) {
      print(
        isLockedDir(dir)
          ? `cat: ${arg}: 权限不足`
          : `cat: ${arg}: 是一个目录`,
        'err'
      )
      if (!isLockedDir(dir)) print('· 使用 ls 查看目录内容', 'dim')
    } else if (norm.startsWith('/subjects/')) {
      print(`cat: ${arg}: 权限不足`, 'err')
    } else {
      print(`cat: ${arg}: 没有那个文件或目录`, 'err')
      print('· 使用 ls 查看当前目录内容', 'dim')
    }
    return
  }

  if (isLockedDir(path.slice(0, path.lastIndexOf('/') + 1))) {
    print(`cat: ${arg}: 权限不足`, 'err')
    return
  }

  // 锁窗期间：意识文件加密只读
  if (lockedByWindow(path)) {
    print(`cat: ${arg}: 锁窗期间文件不可读`, 'err')
    print(`· 哀悼协议锁窗剩余 ${Math.ceil(lockWindowLeft() / 60000)} 分钟`, 'dim')
    return
  }

  // 加密文件：老档已解密的直接输出，否则提示用 decrypt
  if (path in ENCRYPTED) {
    if (store.readFiles.includes(path)) {
      printBlock(ENCRYPTED[path].content)
      return
    }
    print(`cat: ${arg}: 文件已加密（AES-256-GCM）· 无法直接读取`, 'err')
    print(`· 使用 decrypt ${arg} 解密`, 'dim')
    return
  }

  // 损坏文件：先输出可恢复片段，再报错
  if (path in DAMAGED) {
    const dmg = DAMAGED[path]
    if (dmg.text) printBlock(dmg.text)
    print(
      `cat: ${arg}: 读取中断 · 数据块校验失败 · 已恢复 ${dmg.readable} 字节`,
      'err'
    )
    // 恢复出的片段也算读过一次（E-07 通话的前置条件依赖这条）
    store.markFileRead(path)
    return
  }

  // Kessler 私人分区：需恢复其会话
  if (path.startsWith('/home/kessler/') && sessionUser.value !== 'kessler') {
    print(`cat: ${arg}: 权限不足`, 'err')
    return
  }

  // 二进制扫描件：cat 直接吐出乱码，文件头元数据里混着可读字符串
  if (path === '/home/kessler/maya-05.scan') {
    printBlock(SCAN_TEXT, 'dim')
    applyReadHooks(path)
    return
  }
  const content = FILES[path].replace(/\{\{FP\}\}/g, store.fingerprint)
  readBlock(content, path)

  // 文件读取的剧情钩子
  applyReadHooks(path)
}

function cmdEcho (arg) {
  const m = arg.match(/^([\s\S]+?)\s*>\s*(\S+)$/)
  if (!m) {
    print(arg.replace(/^["']|["']$/g, ''))
    return
  }
  const target = resolvePath(m[2], store.cwd)

  if (target === '/subjects/e-07/console') {
    // 读完 B-2 维生记录后，第一次写入触发 E-07 通话；之后写入走复访文本
    typeLines([['[OK] 消息已写入 E-07 控制台。', 'ok']], 650).then(() => {
      if (e07CanEnter()) triggerE07()
    })
    return
  }
  print('写入失败：文件系统只读', 'err')
}

function cmdWhoami () {
  if (sessionUser.value === 'kessler') {
    printBlock(
      `kessler.s
权限范围：admin
会话来源：已恢复的挂起会话 0x0A9`,
      'dim'
    )
    return
  }
  printBlock(
    `visitor
追踪标识：${store.fingerprint}
会话状态：已监控`,
    'dim'
  )
}

let sudoCount = 0
function cmdSudo () {
  sudoCount++
  print('[sudo] visitor 的密码：******', 'dim')
  print(`visitor 不在 sudoers 文件中。此事将被报告。（已记录 ×${sudoCount}）`, 'err')
}

function cmdExit () {
  store.markEvent('exit_attempted')
  // 第四章之后、任一结局之前，exit 都接到 C5-00 / 当前进度
  if (store.choices.c4_entered && !store.choices.c6_ending) {
    enterChapter5()
    return
  }
  if (sessionUser.value === 'kessler') {
    store.sessionUser = 'visitor'
    printBlock('会话 0x0A9 已挂起。', 'dim')
    return
  }
  printBlock('连接已断开。', 'dim')
  setTimeout(() => router.push('/inside/'), 600)
}
</script>

<style scoped>
.terminal {
  height: 100vh;
  overflow: hidden;
  background: #050805;
  padding: 24px;
  cursor: text;
  display: flex;
  flex-direction: column;
  position: relative;
}
.stage {
  flex: 1;
  min-height: 0;
  position: relative;
  display: flex;
}
/* 左栏保留玩家原视图；对话时压暗并整体失焦 */
.workspace {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 14px;
}
.left-pane {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  transition: opacity 0.2s ease, filter 0.2s ease;
}
.left-pane.talk-dim {
  opacity: 0.34;
  filter: grayscale(0.6);
  pointer-events: none;
}
/* 右栏：约 40% 宽，承载台词、系统行、选项与输入 */
.talk-pane {
  width: 40%;
  min-width: 280px;
  max-width: 560px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #1e3a2a;
  background: #070d0a;
  box-shadow: -8px 0 24px #0008;
}
.talk-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-bottom: 1px solid #14281c;
}
.talk-tag {
  font-family: Consolas, "Courier New", monospace;
  font-size: 11.5px;
  letter-spacing: 1.5px;
  color: #7ee8a2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.talk-exit {
  flex: 0 0 auto;
  padding: 3px 8px;
  border: 1px solid #2a3f30;
  background: transparent;
  font-family: Consolas, monospace;
  font-size: 11px;
  color: #7a9a80;
  cursor: pointer;
}
.talk-exit:hover,
.talk-exit:focus {
  border-color: #4a7a58;
  color: #c8e8d0;
}
.talk-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  scrollbar-width: thin;
  scrollbar-color: #1e3a24 transparent;
}
.talk-body::-webkit-scrollbar {
  width: 8px;
}
.talk-body::-webkit-scrollbar-thumb {
  background: #1e3a24;
  border-radius: 4px;
}
.talk-empty {
  font-family: Consolas, monospace;
  font-size: 12px;
  color: #3f5a42;
}
.talk-opts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-top: 1px solid #14281c;
}
.talk-opt {
  display: flex;
  align-items: baseline;
  gap: 7px;
  width: 100%;
  padding: 7px 9px;
  border: 1px solid #1e3a44;
  background: #0a1418;
  font-family: Consolas, monospace;
  font-size: 12.5px;
  line-height: 1.5;
  text-align: left;
  color: #9fd8e8;
  cursor: pointer;
}
.talk-opt:hover,
.talk-opt:focus {
  border-color: #3f7a8a;
  color: #d7f2fa;
  outline: none;
}
.talk-opt.asked,
.maya-opt.asked {
  color: #6f8f9a;
  border-color: #1a2f36;
}
.talk-opt.disabled {
  border-color: #1a2226;
  color: #4a5a60;
  cursor: not-allowed;
}
.talk-reason {
  margin-left: 4px;
  font-size: 11px;
  color: #6d5a3a;
}
.talk-foot {
  flex: 0 0 auto;
  padding: 10px 12px;
  border-top: 1px solid #14281c;
}
.talk-hint {
  margin-bottom: 6px;
  font-family: Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  color: #5f7a5f;
}
.talk-continue {
  display: flex;
}
.talk-continue-btn {
  flex: 1;
  padding: 7px 10px;
  border: 1px solid #2a4a32;
  background: #0a1410;
  font-family: Consolas, monospace;
  font-size: 12px;
  color: #7ecf92;
  cursor: pointer;
}
.talk-continue-btn:hover {
  border-color: #66bb6a;
}
.talk-continue-btn:focus {
  outline: none;
  border-color: #66bb6a;
  box-shadow: 0 0 0 1px #2a4a32 inset;
}
.talk-input-row {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 5px 8px;
  border: 1px solid #1e3a2a;
  background: #050805;
}
.talk-input-row.secondary {
  border-color: #14281c;
  background: #040704;
}
.talk-input-row.secondary .talk-input {
  color: #6f8a6f;
}
.talk-prompt {
  font-family: Consolas, monospace;
  font-size: 13px;
  color: #66bb6a;
}
.talk-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: Consolas, monospace;
  font-size: 13px;
  color: #b8d8b8;
  caret-color: #66bb6a;
}
.talk-input::placeholder {
  color: #3f5a42;
}
.talk-send {
  flex: 0 0 auto;
  padding: 3px 9px;
  border: 1px solid #2a4a32;
  background: #0a1410;
  font-family: Consolas, monospace;
  font-size: 11px;
  color: #7ecf92;
  cursor: pointer;
}
.talk-send:disabled {
  opacity: 0.4;
  cursor: default;
}
.talk-reopen {
  position: fixed;
  right: 28px;
  bottom: 74px;
  z-index: 130;
  padding: 7px 12px;
  border: 1px solid #2a4a32;
  background: #0a1410ee;
  font-family: Consolas, monospace;
  font-size: 12px;
  color: #7ecf92;
  cursor: pointer;
  box-shadow: 0 4px 16px #0008;
}
.talk-reopen:hover {
  border-color: #4a7a58;
  color: #c8e8d0;
}
@media (max-width: 820px) {
  .workspace {
    flex-direction: column;
    gap: 8px;
  }
  .talk-pane {
    width: 100%;
    max-width: none;
    min-width: 0;
    max-height: 48vh;
    border-left: none;
    border-top: 1px solid #1e3a2a;
    box-shadow: none;
  }
  .talk-reopen {
    right: 12px;
    bottom: 64px;
  }
}
.lock-row {
  align-self: flex-end;
  margin-top: 6px;
  flex: 0 0 auto;
}
.term-out {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  scrollbar-width: thin;
  scrollbar-color: #1e3a24 transparent;
}
.term-out::-webkit-scrollbar {
  width: 8px;
}
.term-out::-webkit-scrollbar-track {
  background: transparent;
}
.term-out::-webkit-scrollbar-thumb {
  background: #1e3a24;
  border-radius: 4px;
}
.term-out::-webkit-scrollbar-thumb:hover {
  background: #2f5a36;
}
.line {
  font-family: Consolas, "Courier New", monospace;
  font-size: 13.5px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-all;
  color: #b8d8b8;
}
.line.dim {
  color: #5f7a5f;
}
.line.warn {
  color: #e57373;
}
.line.err {
  color: #ef5350;
}
.line.ok {
  color: #66bb6a;
}
.line.e09 {
  color: #7ee8a2;
}
.line.marta {
  color: #c5a3ff;
}
.line.voice {
  color: #e0a8c0;
}
.line.ac {
  color: #e07f6f;
}
.line.maya {
  color: #8ecae6;
}
.line.lena {
  color: #7ee8a2;
}
.line.subtitle {
  color: #d9b25a;
  letter-spacing: 1px;
}
.line.sys {
  color: #78909c;
}
.line.cmd {
  color: #dcedc8;
}

/* 第四章固定选项：只在白色房间节点出现，不改命令行本身 */
.maya-opts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}
.maya-opt {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  padding: 4px 10px;
  background: #0a1418;
  border: 1px solid #1e3a44;
  font-family: Consolas, monospace;
  font-size: 12.5px;
  color: #9fd8e8;
  cursor: pointer;
}
.maya-opt:hover {
  border-color: #3f7a8a;
  color: #d7f2fa;
}
.maya-opt:focus {
  outline: 1px solid #3f7a8a;
  outline-offset: 1px;
}
.maya-opt.disabled {
  border-color: #1a2226;
  color: #4a5a60;
  cursor: not-allowed;
}
.mo-same {
  flex-basis: 100%;
  padding: 2px 2px 0;
  font-size: 11px;
  letter-spacing: 0.5px;
  color: #6f8479;
}
.maya-opt.disabled:hover {
  border-color: #1a2226;
  color: #4a5a60;
}
.mo-idx {
  font-size: 11px;
  color: #4b7d8c;
}
/* 理由默认不显示：悬停 / 键盘聚焦 / 触屏长按（.reveal-reason）才出现 */
.mo-reason {
  display: none;
  margin-left: 4px;
  font-size: 11px;
  color: #6d5a3a;
}
.maya-opt.disabled:hover .mo-reason,
.maya-opt.disabled:focus .mo-reason,
.maya-opt.disabled.reveal-reason .mo-reason {
  display: inline;
}
/* 转移过程：只在右上角报百分比 */
.transfer-pct {
  position: fixed;
  top: 40px;
  right: 16px;
  z-index: 210;
  padding: 4px 10px;
  background: #0a1410e6;
  border: 1px solid #1e3a44;
  font-family: Consolas, "Courier New", monospace;
  font-size: 13px;
  letter-spacing: 2px;
  color: #78909c;
  pointer-events: none;
}
.credits-skip {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 210;
  padding: 5px 12px;
  background: #0a1410e6;
  border: 1px solid #2f4a38;
  color: #8fbf94;
  font-family: Consolas, "Courier New", monospace;
  font-size: 11.5px;
  letter-spacing: 1px;
  cursor: pointer;
}
.credits-skip:hover {
  border-color: #4d7a54;
  color: #d7f2e3;
}
/* 文件详情右键菜单 */
.file-menu {
  position: fixed;
  z-index: 340;
  min-width: 150px;
  padding: 4px;
  background: #070d09;
  border: 1px solid #1e3a2a;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}
.file-menu-item {
  display: block;
  width: 100%;
  padding: 7px 10px;
  background: none;
  border: 0;
  color: #b8d8b8;
  font-family: Consolas, "Courier New", monospace;
  font-size: 12.5px;
  text-align: left;
  cursor: pointer;
}
.file-menu-item:hover {
  background: #0e1a11;
  color: #d7f2e3;
}
.blackout {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 200;
}

.term-in {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  background: #050805;
  padding: 6px 0;
}
.prompt {
  font-family: Consolas, monospace;
  font-size: 13.5px;
  color: #66bb6a;
  white-space: nowrap;
}
.term-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: Consolas, monospace;
  font-size: 13.5px;
  color: #b8d8b8;
  caret-color: #66bb6a;
}

.term-status {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 4px;
  padding-top: 6px;
  border-top: 1px solid #12261a;
  font-family: Consolas, monospace;
  font-size: 11.5px;
  color: #3f5a42;
  user-select: none;
}
.term-status .st-path {
  color: #4d7a54;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.term-status .st-hint {
  white-space: nowrap;
}

/* ---------- 图形视图 ---------- */
.gui {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: Consolas, "Courier New", monospace;
}
.gui-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #12261a;
}
.crumbs {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1px;
}
.crumb {
  background: none;
  border: 0;
  padding: 2px 3px;
  font-family: inherit;
  font-size: 12.5px;
  color: #8fbf94;
  cursor: pointer;
}
.crumb:hover {
  color: #dcedc8;
  text-decoration: underline;
}
.crumb-sep {
  font-size: 12px;
  color: #2f5a36;
}
.gui-tag {
  flex: 0 0 auto;
  background: none;
  border: 1px solid #1e3a24;
  padding: 3px 9px;
  font-family: inherit;
  font-size: 11.5px;
  color: #4d7a54;
  cursor: pointer;
}
.gui-tag:hover {
  border-color: #2f5a36;
  color: #8fbf94;
}
.gui-main {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 218px 1fr;
  gap: 12px;
}
.tree {
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid #12261a;
  background: #060b07;
}
.tree.folded {
  align-self: start;
}
.tree-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 10px;
  background: none;
  border: 0;
  border-bottom: 1px solid #12261a;
  font-family: inherit;
  font-size: 11.5px;
  letter-spacing: 1px;
  color: #5f7a5f;
  cursor: pointer;
}
.tree-head:hover {
  color: #8fbf94;
}
.tree-body {
  overflow: auto;
  padding: 6px 0;
  scrollbar-width: thin;
  scrollbar-color: #1e3a24 transparent;
}
.tree-body::-webkit-scrollbar {
  width: 6px;
}
.tree-body::-webkit-scrollbar-thumb {
  background: #1e3a24;
  border-radius: 3px;
}
.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 3px 10px;
  background: none;
  border: 0;
  text-align: left;
  font-family: inherit;
  font-size: 12.5px;
  color: #8fbf94;
  cursor: pointer;
}
.tree-node:hover {
  background: #0b140d;
  color: #dcedc8;
}
.tree-node.active {
  background: #0e1a11;
  color: #dcedc8;
}
.tree-node.locked {
  color: #3f5a42;
  cursor: not-allowed;
}
.tree-icon {
  width: 10px;
  flex: 0 0 auto;
  color: #2f5a36;
}
.tree-node.dir .tree-icon {
  color: #66bb6a;
}
.tree-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.viewer {
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #12261a;
  background: #060b07;
}
.vf-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 12px;
  border-bottom: 1px solid #12261a;
  font-size: 11.5px;
  color: #4d7a54;
}
.vf-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vf-note {
  flex: 0 0 auto;
  color: #8a7a4a;
}
.vf-note.err {
  color: #ef5350;
}
.vf-body {
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: 12px;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.8;
  color: #b8d8b8;
  white-space: pre-wrap;
  word-break: break-all;
  scrollbar-width: thin;
  scrollbar-color: #1e3a24 transparent;
}
.vf-body::-webkit-scrollbar {
  width: 8px;
}
.vf-body::-webkit-scrollbar-thumb {
  background: #1e3a24;
  border-radius: 4px;
}
.vf-grid {
  flex: 1;
  overflow: auto;
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
}
.vf-entry {
  padding: 5px 10px;
  background: #0a130c;
  border: 1px solid #12261a;
  font-family: inherit;
  font-size: 12.5px;
  color: #a9cfae;
  cursor: pointer;
}
.vf-entry:hover {
  border-color: #2f5a36;
  color: #dcedc8;
}
.vf-entry.locked {
  color: #3f5a42;
  cursor: not-allowed;
}
.vf-empty {
  font-size: 12px;
  color: #3f5a42;
}
.out-panel {
  flex: 0 0 auto;
  border: 1px solid #12261a;
  background: #060b07;
}
.out-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 6px 12px;
  background: none;
  border: 0;
  font-family: inherit;
  font-size: 11.5px;
  letter-spacing: 1px;
  color: #5f7a5f;
  cursor: pointer;
}
.out-head:hover {
  color: #8fbf94;
}
.out-count {
  color: #3f5a42;
  letter-spacing: 0;
}
.out-scroll {
  height: 168px;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 5px 12px 10px;
  scrollbar-width: thin;
  scrollbar-color: #1e3a24 transparent;
}
.out-scroll::-webkit-scrollbar {
  width: 8px;
}
.out-scroll::-webkit-scrollbar-thumb {
  background: #1e3a24;
  border-radius: 4px;
}

/* ---------- Maya 通道：整层浮上来盖住图形视图 ---------- */
.maya-layer {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #040705fa;
  border: 1px solid #2f5a36;
  box-shadow: inset 0 0 40px #000000cc;
}
.maya-noise {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.12;
  background-image: repeating-linear-gradient(
    0deg,
    #7ee8a2 0,
    #7ee8a2 1px,
    transparent 1px,
    transparent 3px
  );
  animation: noise-roll 0.32s steps(2) infinite;
}
.maya-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 12px;
  border-bottom: 1px solid #1e3a24;
  position: relative;
  z-index: 1;
}
.maya-tag {
  font-family: Consolas, monospace;
  font-size: 12px;
  letter-spacing: 2px;
  color: #7ee8a2;
  text-shadow: 1px 0 #2f5a36, -1px 0 #1b4f3a;
  animation: maya-flicker 2.6s steps(1) infinite;
}
.maya-x {
  background: none;
  border: 1px solid #2f5a36;
  padding: 3px 10px;
  font-family: Consolas, monospace;
  font-size: 11.5px;
  color: #8fbf94;
  cursor: pointer;
}
.maya-x:hover {
  border-color: #7ee8a2;
  color: #dcedc8;
}
.maya-body {
  flex: 1;
  overflow: auto;
  padding: 14px 16px;
  position: relative;
  z-index: 1;
  scrollbar-width: thin;
  scrollbar-color: #1e3a24 transparent;
}
.maya-body .line {
  animation: maya-jitter 1.8s steps(1) infinite;
}

/* ---------- ASCII 动效 ---------- */
.glitch {
  animation: block-shift 320ms steps(2) 1;
}
@keyframes block-shift {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-3px, 1px); }
  50% { transform: translate(2px, -1px); }
  75% { transform: translate(-1px, 2px); }
  100% { transform: translate(0, 0); }
}
.fx-repaint::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    transparent 0%,
    #2f5a3622 46%,
    #7ee8a21f 50%,
    #2f5a3622 54%,
    transparent 100%
  );
  animation: repaint-sweep 340ms ease-out both;
}
@keyframes repaint-sweep {
  0% { opacity: 0; transform: translateY(-6%); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translateY(6%); }
}
@keyframes noise-roll {
  0% { transform: translateY(0); }
  100% { transform: translateY(3px); }
}
@keyframes maya-flicker {
  0%, 92%, 100% { opacity: 1; }
  94% { opacity: 0.55; }
  96% { opacity: 1; }
}
@keyframes maya-jitter {
  0%, 86%, 100% { transform: none; }
  88% { transform: translateX(1px); }
  92% { transform: translateX(-1px); }
}

.cheat {
  position: absolute;
  right: 24px;
  bottom: 64px;
  width: 432px;
  max-width: calc(100% - 48px);
  background: #071009f2;
  border: 1px solid #2f5a36;
  box-shadow: 0 8px 32px #000000a6;
  font-family: Consolas, monospace;
  font-size: 12.5px;
  color: #b8d8b8;
  cursor: default;
}
.cheat-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #1e3a24;
  color: #dcedc8;
  letter-spacing: 1px;
}
.cheat-x {
  background: transparent;
  border: none;
  color: #5f7a5f;
  font-size: 13px;
  cursor: pointer;
  line-height: 1;
  padding: 2px 4px;
}
.cheat-x:hover {
  color: #b8d8b8;
}
.cheat-body {
  padding: 10px 12px;
  display: grid;
  grid-template-columns: 178px 1fr;
  gap: 6px 10px;
  align-items: baseline;
}
.cheat-row {
  display: contents;
}
.cheat-row code {
  color: #7ee8a2;
  white-space: nowrap;
}
.cheat-row span {
  color: #5f7a5f;
}
.cheat-foot {
  padding: 6px 12px 8px;
  color: #3f5a42;
  text-align: right;
}

/* 窄屏：树横到上方，主区仍占满 */
@media (max-width: 760px) {
  .gui-main {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  .tree {
    max-height: 168px;
  }
  .out-scroll {
    height: 132px;
  }
}
</style>
