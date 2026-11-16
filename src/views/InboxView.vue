<template>
  <div class="mail">
    <!-- 顶栏 -->
    <header class="m-head">
      <div class="m-brand">邮局<span>webmail</span></div>
      <div class="m-account">me@postbox.com</div>
    </header>

    <div class="m-body">
      <!-- 左侧栏 -->
      <aside class="m-side">
        <nav>
          <button
            class="nav-item"
            :class="{ active: folder === 'inbox' }"
            @click="setFolder('inbox')"
          >
            收件箱<span
              v-if="unreadCount"
              class="badge"
            >{{ unreadCount }}</span>
          </button>
          <button
            class="nav-item"
            :class="{ active: folder === 'sent' }"
            @click="setFolder('sent')"
          >
            已发送<span
              v-if="store.mail.sent.length"
              class="badge muted"
            >{{ store.mail.sent.length }}</span>
          </button>
          <button
            class="nav-item"
            :class="{ active: folder === 'drafts' }"
            @click="setFolder('drafts')"
          >
            草稿箱
          </button>
          <button
            class="nav-item"
            :class="{ active: folder === 'spam' }"
            @click="setFolder('spam')"
          >
            垃圾邮件<span class="badge muted">3</span>
          </button>
          <button
            class="nav-item"
            :class="{ active: folder === 'trash' }"
            @click="setFolder('trash')"
          >
            已删除
          </button>
          <router-link
            class="nav-item"
            to="/records"
          >
            记录
          </router-link>
          <button
            class="nav-item compose-entry"
            @click="startCompose"
          >
            写邮件
          </button>
        </nav>
        <p class="side-note">邮箱容量 12.4 GB / 15 GB</p>
      </aside>

      <!-- 邮件列表 -->
      <div class="m-list">
        <div class="list-head">
          <b>{{ folderName }}</b>
          <span>{{ folder === 'sent' ? sentItems.length : visibleMails.length }} 封</span>
          <button
            class="m-compose"
            @click="startCompose"
          >
            写邮件
          </button>
        </div>

        <template v-if="folder === 'inbox'">
          <button
            v-for="m in visibleMails"
            :key="m.id"
            class="mail-item"
            :class="{ active: current === m.id, unread: isUnread(m) }"
            @click="openMail(m.id)"
          >
            <div class="mi-top">
              <span class="mi-from">{{ m.from }}</span>
              <span class="mi-time">{{ m.time }}</span>
            </div>
            <div class="mi-subject">
              {{ m.subject || '（无主题）' }}
            </div>
            <div class="mi-preview">
              {{ m.preview }}
            </div>
          </button>
          <p
            v-if="!visibleMails.length"
            class="empty-side"
          >
            这里没有邮件。
          </p>
        </template>

        <template v-else-if="folder === 'sent'">
          <button
            v-for="m in sentItems"
            :key="m.id"
            class="mail-item"
            :class="{ active: currentSent && currentSent.id === m.id }"
            @click="openSent(m.id)"
          >
            <div class="mi-top">
              <span class="mi-from">发给 {{ m.from }}</span>
              <span class="mi-time">{{ m.time }}</span>
            </div>
            <div class="mi-subject">
              {{ m.subject }}
            </div>
            <div class="mi-preview">
              {{ m.preview }}
            </div>
          </button>
          <p
            v-if="!sentItems.length"
            class="empty-side"
          >
            还没有发出过邮件。
          </p>
        </template>

        <p
          v-else
          class="empty-side"
        >
          {{ emptyText }}
        </p>
      </div>

      <!-- 阅读区 -->
      <article class="m-read">
        <!-- 写信 / 回复 -->
        <div
          v-if="mode === 'compose'"
          class="compose"
        >
          <h1 class="rd-subject">
            {{ composeReply ? '回复' : '写邮件' }}
          </h1>
          <div class="cp-row">
            <label>收件人</label>
            <input
              v-model="composeTo"
              type="text"
              placeholder="name@postbox.com"
              spellcheck="false"
              autocomplete="off"
            >
          </div>
          <div class="cp-row">
            <label>标题</label>
            <input
              v-model="composeSubject"
              type="text"
              placeholder="（无主题）"
            >
          </div>
          <textarea
            v-model="composeBody"
            class="cp-body"
            rows="12"
          />
          <div class="cp-actions">
            <button
              class="cp-send"
              @click="sendCompose"
            >
              发送
            </button>
            <button
              class="cp-cancel"
              @click="cancelCompose"
            >
              取消
            </button>
            <span
              v-if="composeError"
              class="cp-err"
            >{{ composeError }}</span>
          </div>
          <div
            v-if="store.contacts.known.length"
            class="cp-contacts"
          >
            <span class="cp-label">通讯录</span>
            <button
              v-for="c in store.contacts.known"
              :key="c.addr"
              @click="fillTo(c.addr)"
            >
              {{ c.name }} &lt;{{ c.addr }}&gt;
            </button>
          </div>
        </div>

        <!-- 已发送 -->
        <template v-else-if="folder === 'sent'">
          <div v-if="currentSent">
            <h1 class="rd-subject">
              {{ currentSent.subject || '（无主题）' }}
            </h1>
            <div class="rd-meta">
              <div class="avatar muted-avatar">
                我
              </div>
              <div>
                <p class="rd-from">我 &lt;me@postbox.com&gt;</p>
                <p class="rd-to">收件人：{{ currentSent.to }}　｜　{{ currentSent.time }}</p>
              </div>
            </div>
            <div class="rd-body">
              <p
                v-for="(p, i) in sentBody"
                :key="i"
              >
                {{ p }}
              </p>
            </div>
          </div>
          <p
            v-else
            class="empty-read"
          >
            还没有发出过邮件。
          </p>
        </template>

        <template v-else-if="folder === 'inbox'">
          <!-- 陈默的定时邮件 -->
          <div v-if="currentMail && currentMail.id === 'chen'">
            <h1 class="rd-subject">（无主题）</h1>
            <div class="rd-meta">
              <div class="avatar">陈</div>
              <div>
                <p class="rd-from">陈默 &lt;chen.mo@postbox.com&gt;</p>
                <p class="rd-to">收件人：我　｜　2024-10-06 21:47（定时发送）</p>
                <p
                  v-if="currentMail.readAt"
                  class="rd-read"
                >
                  已读 · {{ currentMail.readAt }}
                </p>
              </div>
              <span class="tag-sched">定时发送</span>
            </div>

            <div class="rd-body">
              <p>这封邮件是定时发送的。如果你收到它，说明我三天没登录这个邮箱，也说明我没回来。</p>
              <p>四十一个收件人的名单是从一个旧论坛后台导出的，你可能不认识我。没关系，我总得把这些东西发出去。</p>
              <p>三个月前我接了个选题，跟城西那家余晖乐园有关，我以为是查账。</p>
              <p>10 月 3 号我在园区待到闭园，在旋转木马那一带的长椅上坐了一下午，旁边有人喂鸽子，饲料撒了一地。我带了录音笔，回放是空的。</p>
              <p>晚上回酒店，有人敲了很久的门，我问是谁，外面没人应；猫眼里走廊灯关着，黑得什么都看不清，我就没开。第二天早上才发现门把手上多了一道不深的划痕，像钥匙蹭的。</p>
              <p>我不知道自己是不是已经被跟上了。</p>
              <p>说正事。你去他们官网（<a
                href="#"
                class="rd-inline-link"
                @click.prevent="enterPark"
              >afterglow-park.com</a>），别只顺着首页看。有些页面没挂在导航上，得从站内搜索和归档里往下翻。你会碰到一份不太起眼、也不太像给外人看的东西，看完大概就明白我为什么要去那一趟。附件是我翻旧网页时用的小工具，不联网，只在本机跑；把页面上的句子摘出来对照，比手抄省事。</p>
              <p>如果这封邮件真的发出去了，这就是我能留下的全部。别找我。</p>
              <p class="rd-attach-row">
                <span class="rd-attach-file">证据板.html（本地工具，无需联网）</span>
                <span class="rd-attach-state">已保存到本机。</span>
              </p>
              <p class="rd-sign">陈默<br />10 月 3 日夜</p>
            </div>
          </div>

          <!-- 退信 -->
          <div v-else-if="currentMail && currentMail.id === 'bounce'">
            <h1 class="rd-subject">无法投递：chen.mo@postbox.com</h1>
            <div class="rd-meta">
              <div class="avatar muted-avatar">M</div>
              <div>
                <p class="rd-from">MAILER-DAEMON &lt;postmaster@postbox.com&gt;</p>
                <p class="rd-to">收件人：我　｜　2024-10-07 04:12</p>
              </div>
            </div>
            <div class="rd-body mono">
              <p>这是一封系统退信。</p>
              <p>您所在的群发列表（41 人）中，陈默 &lt;chen.mo@postbox.com&gt; 于 2024-10-06 21:47 发出的邮件，有 6 个收件地址无法投递：</p>
              <p>
                02****@qq.com　—— 邮箱已注销<br />
                13****@163.com　—— 收件人不存在<br />
                li****@gmail.com　—— 邮箱已停用<br />
                ……（其余 3 条略）
              </p>
              <p>其余 35 个地址已成功送达。</p>
              <p>本退信抄送列表全体成员。</p>
            </div>
          </div>

          <!-- 其余邮件 -->
          <div v-else-if="currentMail">
            <h1 class="rd-subject">
              {{ currentMail.subject || '（无主题）' }}
            </h1>
            <div class="rd-meta">
              <div
                class="avatar"
                :class="{ 'muted-avatar': currentMail.kind === 'bounce' }"
              >
                {{ avatarOf(currentMail) }}
              </div>
              <div>
                <p class="rd-from">{{ currentMail.from }} &lt;{{ currentMail.addr }}&gt;</p>
                <p class="rd-to">收件人：{{ currentMail.to || 'me@postbox.com' }}　｜　{{ currentMail.time }}</p>
              </div>
              <span
                v-if="currentMail.auto"
                class="tag-sched"
              >自动回复</span>
              <button
                v-if="currentMail.replyable"
                class="rd-reply"
                @click="startReply(currentMail)"
              >
                回复
              </button>
            </div>
            <div
              class="rd-body"
              :class="{ mono: currentMail.kind === 'bounce' }"
            >
              <p
                v-for="(p, i) in currentMail.body || []"
                :key="i"
              >
                {{ p }}
              </p>
              <p
                v-if="currentMail.link"
                class="rd-link"
              >
                <a
                  href="#"
                  @click.prevent="openInternalTab(currentMail.link)"
                >https://ceres-reynold.com/inside/</a>
              </p>
            </div>
          </div>

          <p
            v-else
            class="empty-read"
          >
            选择一封邮件阅读。
          </p>
        </template>

        <p
          v-else
          class="empty-read"
        >
          {{ emptyText }}
        </p>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const store = useGameStore()

const folder = ref('inbox')
const current = ref('')
const sentCurrentId = ref('')
const mode = ref('read')
const composeTo = ref('')
const composeSubject = ref('')
const composeBody = ref('')
const composeError = ref('')
const composeReply = ref(false)

const folderName = computed(() => ({
  inbox: '收件箱',
  sent: '已发送',
  drafts: '草稿箱',
  spam: '垃圾邮件',
  trash: '已删除'
}[folder.value]))
const visibleMails = computed(() =>
  store.mail.delivered.map((id) => store.mailById(id)).filter(Boolean)
)
const sentItems = computed(() =>
  store.mail.sent.map((s) => ({
    id: s.id,
    from: s.to,
    subject: s.subject || '（无主题）',
    preview: (s.body || '').split('\n')[0] || '',
    time: s.time
  }))
)
const currentMail = computed(() => (current.value ? store.mailById(current.value) : null))
const currentSent = computed(
  () => store.mail.sent.find((s) => s.id === sentCurrentId.value) || store.mail.sent[0] || null
)
const sentBody = computed(() => (currentSent.value?.body || '').split('\n'))
const unreadCount = computed(
  () => store.mail.delivered.filter((id) => !store.mail.read.includes(id)).length
)
const emptyText = computed(() => ({
  drafts: '草稿箱是空的。',
  spam: '没有新的垃圾邮件。',
  trash: '回收站是空的。'
}[folder.value] || ''))

function isUnread (m) {
  return !store.mail.read.includes(m.id)
}

function openMail (id) {
  folder.value = 'inbox'
  mode.value = 'read'
  current.value = id
  store.markMailRead(id)
  // 打开陈默的开场信即视为附件已装载，证据板随之解锁
  if (id === 'chen') store.unlockBoard()
}

function openSent (id) {
  folder.value = 'sent'
  mode.value = 'read'
  sentCurrentId.value = id
}

function setFolder (f) {
  folder.value = f
  mode.value = 'read'
  composeError.value = ''
  if (f === 'sent') sentCurrentId.value = store.mail.sent[0]?.id || ''
  if (f === 'inbox') store.openInbox()
}

function avatarOf (m) {
  return (m.from || '?').slice(0, 1)
}

function startCompose () {
  folder.value = 'inbox'
  mode.value = 'compose'
  composeReply.value = false
  composeTo.value = ''
  composeSubject.value = ''
  composeBody.value = ''
  composeError.value = ''
}

function startReply (m) {
  mode.value = 'compose'
  composeReply.value = true
  composeTo.value = m.addr
  composeSubject.value = /^re:/i.test(m.subject || '') ? m.subject : 'Re: ' + (m.subject || '')
  composeBody.value = ''
  composeError.value = ''
}

function fillTo (addr) {
  composeTo.value = addr
}

function cancelCompose () {
  mode.value = 'read'
  composeError.value = ''
  composeReply.value = false
  if (folder.value === 'sent') sentCurrentId.value = store.mail.sent[0]?.id || ''
}

function sendCompose () {
  const to = composeTo.value.trim()
  if (!to || !to.includes('@')) {
    composeError.value = '收件人地址格式不正确。'
    return
  }
  const entry = store.sendMail({
    to,
    subject: composeSubject.value,
    body: composeBody.value
  })
  if (!entry) {
    composeError.value = '请填写收件人。'
    return
  }
  composeError.value = ''
  mode.value = 'read'
  folder.value = 'sent'
  sentCurrentId.value = entry.id
}

function openInternalTab (path) {
  if (!path) return
  const { href } = router.resolve(path)
  window.open(href, '_blank', 'noopener,noreferrer')
}

function enterPark () {
  store.introSeen = true
  store.markEvent('park_entered')
  openInternalTab('/park')
}

onMounted(() => {
  // 先记事件再投递：避免"扫描跑在事件之前"的空档，openInbox 仍保留作兜底
  store.markEvent('boot_mail_read')
  store.openInbox()
  // 进入收件箱即视为开场信附件已装载；不依赖玩家点开那封已读邮件
  if (store.mail.delivered.includes('chen')) store.unlockBoard()
  if (!current.value || !store.mail.delivered.includes(current.value)) {
    current.value = store.mail.delivered[0] || ''
  }
})
</script>

<style scoped>
.mail {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
}

/* 顶栏 */
.m-head {
  height: 56px;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
}
.m-brand {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 2px;
}
.m-brand span {
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0;
  color: var(--muted);
  margin-left: 8px;
}
.m-account {
  font-size: 12.5px;
  color: var(--muted);
}

/* 三栏 */
.m-body {
  flex: 1;
  display: grid;
  grid-template-columns: 172px 320px 1fr;
  min-height: 0;
}

/* 左栏 */
.m-side {
  border-right: 1px solid var(--border);
  background: var(--panel);
  padding: 18px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.nav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 20px;
  font-size: 13.5px;
  color: #4a5666;
  cursor: default;
  text-decoration: none;
}
.nav-item.active {
  background: #eef3fa;
  color: var(--accent);
  font-weight: 600;
  border-left: 3px solid var(--accent);
  padding-left: 17px;
}
.badge {
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  padding: 0 5px;
}
.badge.muted {
  background: #dfe5ee;
  color: #7a8798;
}
.side-note {
  font-size: 11.5px;
  color: var(--muted);
  padding: 0 20px;
  margin: 0;
}

/* 列表 */
.m-list {
  border-right: 1px solid var(--border);
  background: var(--panel);
  overflow-y: auto;
}
.list-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 14px 18px 10px;
  font-size: 13px;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
}
.list-head b {
  font-size: 14.5px;
  color: var(--text);
}
.mail-item {
  display: block;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  border-bottom: 1px solid #f0f3f7;
  padding: 12px 18px 13px;
  cursor: pointer;
  font-family: inherit;
}
.mail-item:hover {
  background: #f7f9fc;
}
.mail-item.active {
  background: #eef3fa;
}
.mi-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}
.mi-from {
  font-size: 13px;
  color: var(--text);
}
.mail-item.unread .mi-from {
  font-weight: 700;
}
.mail-item.unread .mi-subject::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  margin-right: 6px;
  vertical-align: 2px;
}
.mi-time {
  font-size: 11.5px;
  color: var(--muted);
  flex: 0 0 auto;
}
.mi-subject {
  font-size: 12.5px;
  color: #3d4855;
  margin-top: 4px;
}
.mail-item.unread .mi-subject {
  color: var(--text);
  font-weight: 600;
}
.mi-preview {
  font-size: 11.5px;
  color: #97a2b1;
  margin-top: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 阅读区 */
.m-read {
  overflow-y: auto;
  padding: 30px 40px 60px;
  background: var(--panel);
}
.rd-subject {
  font-size: 19px;
  font-weight: 600;
  margin: 0 0 18px;
}
.rd-meta {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #dce6f4;
  color: #33506e;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}
.muted-avatar {
  background: #eef1f5;
  color: #8a94a3;
}
.rd-from {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
}
.rd-to {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--muted);
}
.rd-read {
  margin: 3px 0 0;
  font-size: 11.5px;
  color: #9aa5b3;
}
.rd-attach-row {
  margin: 0 0 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #f7f9fc;
}
.rd-attach-file {
  font-size: 13.5px;
  color: #2c3742;
}
.rd-attach-state {
  margin-left: auto;
  flex: 0 0 auto;
  font-size: 11.5px;
  color: #8a94a3;
}
.tag-sched {
  margin-left: auto;
  font-size: 11.5px;
  color: var(--accent);
  border: 1px solid #c9dcf3;
  background: #f1f6fd;
  border-radius: 3px;
  padding: 2px 7px;
  flex: 0 0 auto;
}
.rd-body {
  margin-top: 22px;
  max-width: 640px;
}
.rd-body p {
  font-size: 14.5px;
  line-height: 2.05;
  color: #2c3742;
  margin: 0 0 15px;
}
.rd-body.mono p {
  font-family: Consolas, monospace;
  font-size: 13px;
  color: #5b6675;
}
.rd-body strong {
  color: #111;
}
.rd-link {
  margin-top: 22px;
}
.rd-link a {
  font-family: Consolas, monospace;
  font-size: 14px;
  color: var(--link);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.rd-inline-link {
  color: var(--link);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.rd-inline-link:hover {
  color: #1b4f9c;
}
.rd-sign {
  margin-top: 20px;
  color: #6b7684;
  font-size: 13.5px;
  line-height: 1.9;
}

/* 左侧按钮化 */
button.nav-item {
  width: 100%;
  background: none;
  border: 0;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}
button.nav-item:hover {
  background: #f5f8fc;
}
button.nav-item.active:hover {
  background: #eef3fa;
}
.compose-entry {
  color: var(--accent);
  font-weight: 600;
  margin-top: 6px;
}
.m-compose {
  margin-left: 8px;
  padding: 0;
  background: none;
  border: 0;
  font-family: inherit;
  font-size: 12px;
  color: var(--link);
  cursor: pointer;
}
.m-compose:hover {
  text-decoration: underline;
}
.empty-side {
  margin: 0;
  padding: 24px 18px;
  font-size: 12.5px;
  color: var(--muted);
}
.empty-read {
  margin-top: 30px;
  font-size: 13px;
  color: var(--muted);
}
.rd-reply {
  margin-left: auto;
  flex: 0 0 auto;
  padding: 4px 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: inherit;
  font-size: 12px;
  color: #4a5666;
  cursor: pointer;
}
.rd-reply:hover {
  border-color: #b9cbdc;
  color: var(--link);
}

/* 写信 */
.compose {
  max-width: 680px;
}
.cp-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px solid var(--border);
}
.cp-row label {
  flex: 0 0 52px;
  font-size: 12.5px;
  color: var(--muted);
}
.cp-row input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: none;
  font-family: inherit;
  font-size: 13.5px;
  color: var(--text);
}
.cp-body {
  width: 100%;
  box-sizing: border-box;
  margin-top: 16px;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: #fff;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.9;
  color: var(--text);
  resize: vertical;
}
.cp-body:focus {
  outline: none;
  border-color: #b9cbdc;
}
.cp-actions {
  margin-top: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.cp-send {
  padding: 6px 20px;
  background: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 4px;
  font-family: inherit;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
}
.cp-send:hover {
  opacity: 0.92;
}
.cp-cancel {
  padding: 6px 14px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: inherit;
  font-size: 13px;
  color: #4a5666;
  cursor: pointer;
}
.cp-cancel:hover {
  border-color: #b9cbdc;
}
.cp-err {
  font-size: 12px;
  color: #b4534b;
}
.cp-contacts {
  margin-top: 22px;
  padding-top: 12px;
  border-top: 1px dashed var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.cp-label {
  font-size: 11.5px;
  color: var(--muted);
  margin-right: 2px;
}
.cp-contacts button {
  padding: 4px 9px;
  background: #f4f7fb;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: inherit;
  font-size: 11.5px;
  color: #4a5666;
  cursor: pointer;
}
.cp-contacts button:hover {
  border-color: #b9cbdc;
  color: var(--link);
}

/* 窄屏 */
@media (max-width: 900px) {
  .m-body {
    grid-template-columns: 1fr;
  }
  .m-side {
    display: none;
  }
  .m-list {
    max-height: 240px;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  .m-read {
    padding: 22px 20px 50px;
  }
}
</style>
