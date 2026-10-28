<template>
  <div
    class="terminal"
    @click="focusInput"
  >
    <div class="term-out">
      <div
        v-for="(l, i) in reversedLines"
        :key="i"
        class="line"
        :class="l.c"
      >{{ l.t }}</div>
    </div>
    <div class="term-in">
      <span class="prompt">{{ promptStr }}</span>
      <input
        ref="inputRef"
        v-model="input"
        class="term-input"
        spellcheck="false"
        autocomplete="off"
        @keydown.enter="run"
        @keydown.up.prevent="histPrev"
        @keydown.down.prevent="histNext"
        @keydown.tab.prevent="onTab"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { DAMAGED, DIRS, ENCRYPTED, FILES, HIDDEN, LOCKED, resolveDir, resolveFile } from '../data/terminalFiles'

const router = useRouter()
const store = useGameStore()

const lines = store.terminalLines // 直接读写 store（持久化）
// column-reverse 渲染：最新行在视觉底部并天然锚底，无需 JS 滚动
const reversedLines = computed(() => [...lines].reverse())
const input = ref('')
const inputRef = ref(null)
const hist = store.termHist
const histIdx = ref(-1)

// 会话态：visitor（默认）→ kessler（resume 0x0A9 后）
const sessionUser = ref('visitor')
const promptStr = computed(() => `${sessionUser.value}@ceres:~$`)

// decrypt 密码输入态：非空表示正在等待密码
const pendingDecrypt = ref(null)

function print (t, c = '') {
  store.appendTermLines([{ t, c }])
}
function printBlock (text, c = '') {
  store.appendTermLines(text.split('\n').map((t) => ({ t, c })))
}
async function typeLines (items, delay = 420) {
  for (const [t, c] of items) {
    await new Promise((r) => setTimeout(r, delay))
    print(t, c)
  }
}

function focusInput () {
  inputRef.value && inputRef.value.focus()
}

onMounted(() => {
  if (!store.terminalUnlocked) {
    router.replace('/inside/admin')
    return
  }
  boot()
})

async function boot () {
  const isReconnect = lines.length > 0
  if (isReconnect) {
    print('────────── 连接中断 · 会话重建 ──────────', 'dim')
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
  if (!raw.trim()) return
  // 密码输入态：不回显明文、不进历史
  if (pendingDecrypt.value) {
    print(`${promptStr.value} ******`, 'cmd')
    tryDecrypt(raw.trim())
    return
  }
  hist.push(raw)
  histIdx.value = hist.length
  print(`${promptStr.value} ${raw}`, 'cmd')
  handle(raw.trim())
}

function histPrev () {
  if (!hist.length) return
  if (histIdx.value > 0) histIdx.value--
  input.value = hist[histIdx.value] ?? ''
}
function histNext () {
  if (histIdx.value < hist.length - 1) {
    histIdx.value++
    input.value = hist[histIdx.value] ?? ''
  } else {
    histIdx.value = hist.length
    input.value = ''
  }
}

// ---------- Tab 补全（bash 风格：只补当前层级的直接子项） ----------
const COMMANDS = ['help', 'ls', 'cat', 'echo', 'whoami', 'sudo', 'clear', 'exit', 'uname', 'decrypt']

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

  // 路径补全：拆成"目录部分 + 未完成段"，只在该目录的直接子项里匹配
  const isAbs = prefix.startsWith('/')
  const norm = isAbs ? prefix : '/' + prefix
  const slashIdx = norm.lastIndexOf('/')
  const dirPart = norm.slice(0, slashIdx + 1)
  const frag = norm.slice(slashIdx + 1)

  const items = DIRS[dirPart]
  if (!items) return
  const pool = frag.startsWith('.') ? [...items, ...(HIDDEN[dirPart] || [])] : items
  const matched = pool.filter((it) => it.startsWith(frag))
  if (!matched.length) return

  // 保持用户的输入风格（相对/绝对）
  const render = (name) => (isAbs ? dirPart + name : (dirPart + name).slice(1))

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

function handle (raw) {
  const [cmd, ...rest] = raw.split(/\s+/)
  const arg = raw.slice(cmd.length).trim()
  switch (cmd) {
    case 'help': return cmdHelp()
    case 'ls': return cmdLs(arg)
    case 'cat': return cmdCat(arg)
    case 'echo': return cmdEcho(arg)
    case 'whoami': return cmdWhoami()
    case 'sudo': return cmdSudo()
    case 'clear': return store.clearTermLines()
    case 'exit': return cmdExit()
    case 'resume': return cmdResume(arg)
    case 'decrypt': return cmdDecrypt(arg)
    case 'uname':
      return print('CeresOS 4.7.1-persephone x86_64', 'dim')
    default:
      return print(`bash: ${cmd}: command not found`, 'err')
  }
}

function cmdHelp () {
  printBlock(
    `可用命令：
  ls [-a] [路径]         列出目录
  cat <文件>             读取文件
  decrypt <文件>         解密加密文件
  echo <文本> > <文件>   写入文件（部分路径受限）
  whoami                 当前身份
  clear                  清屏
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
  const dir = resolveDir(target)
  if (!dir) {
    print(`ls: 无法访问 '${target}': 没有那个文件或目录`, 'err')
    return
  }
  if (LOCKED.has(dir) || (dir === '/home/kessler/' && sessionUser.value !== 'kessler')) {
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
    return
  }
  const path = resolveFile(arg)
  if (!path || !(path in ENCRYPTED)) {
    print(`decrypt: ${arg}: 不是加密文件或不存在`, 'err')
    return
  }
  if (path.startsWith('/home/kessler/') && sessionUser.value !== 'kessler') {
    print(`decrypt: ${arg}: 权限不足`, 'err')
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
  if (pwd !== enc.password) {
    print('解密失败：密码错误', 'err')
    return
  }
  pendingDecrypt.value = null
  print('[OK] 解密成功。', 'ok')
  printBlock(enc.content)

  // 剧情钩子
  if (path === '/temp/dusk_archive.enc') store.addEvidence('ev_dusk_archive')
  else if (path === '/logs/park_ops_2018.enc') store.addEvidence('ev_park_ops')
  else if (path === '/home/kessler/maya_backup.enc') {
    store.addEvidence('ev_maya_backup')
    store.setChoice('c3_found_maya_partition', true)
    // 本次试玩的内容边界：maya-13-7-19 需通过 PERSEPHONE 控制台访问（第四、五章）
    setTimeout(() => store.showDevNotice(), 2500)
  }
}

function cmdResume (arg) {
  const id = (arg || '').trim().toLowerCase()
  if (!id) {
    print('用法: resume <session-id>', 'dim')
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
    sessionUser.value = 'kessler'
    store.setChoice('c3_resumed_kessler', true)
  })
}

function cmdCat (arg) {
  if (!arg) {
    print('用法: cat <文件>', 'dim')
    return
  }
  const path = resolveFile(arg)
  if (!path) {
    const dir = resolveDir(arg)
    if (dir) {
      print(
        LOCKED.has(dir)
          ? `cat: ${arg}: 权限不足`
          : `cat: ${arg}: 是一个目录`,
        'err'
      )
    } else if (arg.startsWith('/subjects/')) {
      print(`cat: ${arg}: 权限不足`, 'err')
    } else {
      print(`cat: ${arg}: 没有那个文件或目录`, 'err')
    }
    return
  }

  // 加密文件：不输出内容
  if (path in ENCRYPTED) {
    print(`cat: ${arg}: 文件已加密（AES-256-GCM）· 无法直接读取`, 'err')
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
    return
  }

  // Kessler 私人分区：需恢复其会话
  if (path.startsWith('/home/kessler/') && sessionUser.value !== 'kessler') {
    print(`cat: ${arg}: 权限不足`, 'err')
    return
  }

  // 二进制扫描件：cat 直接吐出乱码，文件头元数据里混着可读字符串
  if (path === '/home/kessler/maya-05.scan') {
    printBlock(
      `PNG
IHDR
tEXtSoftwareCR-SCAN/3.0 600dpi 2018-04-02T09:14:33x
tEXtviewer.uri/inside/maya-05
IDATx^ÿÿ
IENDB\`
……（二进制流共 2.1MB，余下省略）`,
      'dim'
    )
    store.addEvidence('ev_maya05')
    return
  }
  const content = FILES[path].replace(/\{\{FP\}\}/g, store.fingerprint)
  printBlock(content)

  // 文件读取的剧情钩子
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
  }
}

function cmdEcho (arg) {
  const m = arg.match(/^([\s\S]+?)\s*>\s*(\S+)$/)
  if (!m) {
    print(arg.replace(/^["']|["']$/g, ''))
    return
  }
  const text = m[1].trim().replace(/^["']|["']$/g, '')
  let target = m[2]
  if (!target.startsWith('/')) target = '/' + target

  if (target === '/subjects/e-07/console') {
    if (store.choices.c2_2_helped_marta) {
      // 她已经消散了——再写入，只有静默
      typeLines([
        ['[OK] 消息已写入 E-07 控制台。', 'ok'],
        ['[SYS] 无回应。信号源已不存在。', 'dim']
      ], 650)
      return
    }
    // 帮助 E-07（Marta）——选择点 C2-2
    store.setChoice('c2_2_helped_marta', true)
    typeLines(
      [
        ['[OK] 消息已写入 E-07 控制台。', 'ok'],
        ['[E-07] ……这是……谁在说话？', 'marta'],
        ['[E-07] ……告诉我的女儿……妈妈爱她。', 'marta'],
        ['[SYS] 信号强度归零。E-07 已安然消散。未生成有效样本。', 'dim'],
        ['[E-09] 谢谢你。她现在走了。安然地。', 'e09']
      ],
      650
    ).then(() => store.addEvidence('ev_marta'))
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
  if (sessionUser.value === 'kessler') {
    sessionUser.value = 'visitor'
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
.line.sys {
  color: #78909c;
}
.line.cmd {
  color: #dcedc8;
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
</style>
