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
          <div class="nav-item active">收件箱<span class="badge">1</span></div>
          <div class="nav-item">已发送</div>
          <div class="nav-item">草稿箱</div>
          <div class="nav-item">垃圾邮件<span class="badge muted">3</span></div>
          <div class="nav-item">已删除</div>
        </nav>
        <p class="side-note">邮箱容量 12.4 GB / 15 GB</p>
      </aside>

      <!-- 邮件列表 -->
      <div class="m-list">
        <div class="list-head">
          <b>收件箱</b>
          <span>共 {{ mails.length }} 封</span>
        </div>
        <button
          v-for="m in mails"
          :key="m.id"
          class="mail-item"
          :class="{ active: current === m.id, unread: m.unread }"
          @click="current = m.id"
        >
          <div class="mi-top">
            <span class="mi-from">{{ m.from }}</span>
            <span class="mi-time">{{ m.time }}</span>
          </div>
          <div class="mi-subject">{{ m.subject }}</div>
          <div class="mi-preview">{{ m.preview }}</div>
        </button>
      </div>

      <!-- 阅读区 -->
      <article class="m-read">
        <!-- 陈默的定时邮件 -->
        <div v-if="current === 'chen'">
          <h1 class="rd-subject">（无主题）</h1>
          <div class="rd-meta">
            <div class="avatar">陈</div>
            <div>
              <p class="rd-from">陈默 &lt;chen.mo@postbox.com&gt;</p>
              <p class="rd-to">收件人：我　｜　2024-10-06 21:47（定时发送）</p>
            </div>
            <span class="tag-sched">定时发送</span>
          </div>

          <div class="rd-body">
            <p>如果你在读这封信，说明我已经七十二小时没有登录这个邮箱了。</p>
            <p>这封信是定时发送的。收件地址是我从一个论坛后台导出的——这半年在那个版块留过言的，我都抄了一遍。很抱歉，我可能把你卷了进来。你是第 41 个。</p>
            <p>我叫陈默，在一家不太大的周报做调查。三个月前我开始查一件事，越查越不对劲。</p>
            <p>10 月 3 日我去了那家乐园。下午在旋转木马那边待了将近两个小时。有一段时间，我听到声音，不在任何游乐设施的音响里。我录下来了，但录音里什么都没有。当天晚上，我住的地方有人敲门，敲了很久，没有报名字，也没有走。</p>
            <p>我不敢在邮件里写更多。你先去他们官网看看——不是随便看看，是仔细看。看完你就知道该往哪里找。</p>
            <p>如果我能回来，我会用这个邮箱再发一次信。如果收不到，那就别找了。</p>
            <p class="rd-link">
              <a
                href="#"
                @click.prevent="enterPark"
              >afterglow-park.com</a>
            </p>
            <p class="rd-sign">—— 陈默<br />2024-10-03 21:40 写于城西</p>
          </div>
        </div>

        <!-- 退信 -->
        <div v-else-if="current === 'bounce'">
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
            <p>您于 2024-10-06 21:47 发出的邮件中，以下 6 个收件地址无法投递：</p>
            <p>
              02****@qq.com　—— 邮箱已注销<br />
              13****@163.com　—— 收件人不存在<br />
              li****@gmail.com　—— 邮箱已停用<br />
              ……（其余 3 条略）
            </p>
            <p>其余 35 个地址已成功送达。</p>
          </div>
        </div>

        <!-- 其余噪声邮件 -->
        <div v-else>
          <h1 class="rd-subject">{{ currentMail.subject }}</h1>
          <div class="rd-meta">
            <div class="avatar muted-avatar">{{ currentMail.from.slice(0, 1) }}</div>
            <div>
              <p class="rd-from">{{ currentMail.from }} &lt;{{ currentMail.addr }}&gt;</p>
              <p class="rd-to">收件人：我　｜　{{ currentMail.time }}</p>
            </div>
          </div>
          <div class="rd-body">
            <p
              v-for="(p, i) in currentMail.body"
              :key="i"
            >{{ p }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const store = useGameStore()

const mails = [
  {
    id: 'bounce',
    from: 'MAILER-DAEMON',
    addr: 'postmaster@postbox.com',
    subject: '无法投递：chen.mo@postbox.com',
    preview: '这是一封系统退信。您于 2024-10-06 21:47 发出的邮件中，以下 6 个收件地址无法投递……',
    time: '10月7日',
    unread: false
  },
  {
    id: 'chen',
    from: '陈默',
    addr: 'chen.mo@postbox.com',
    subject: '（无主题）',
    preview: '如果你在读这封信，说明我已经七十二小时没有登录这个邮箱了。',
    time: '10月6日',
    unread: true
  },
  {
    id: 'bill',
    from: '招商银行',
    addr: 'no-reply@cmbchina.com',
    subject: '您 9 月信用卡电子账单已生成',
    preview: '尊敬的客户，您 2024 年 9 月账单已生成，本期应还金额 1,286.40 元……',
    time: '10月5日',
    unread: false,
    body: [
      '尊敬的客户：您 2024 年 9 月的信用卡电子账单已生成。',
      '本期应还金额：1,286.40 元　｜　最后还款日：2024-10-25',
      '本邮件由系统自动发送，请勿直接回复。'
    ]
  },
  {
    id: 'promo',
    from: '山野装备',
    addr: 'service@shanye-outdoor.com',
    subject: '秋季特惠｜全场 5 折起，最后 48 小时',
    preview: '换季上新，冲锋衣、登山鞋低至 5 折，会员再减 50 元……',
    time: '10月4日',
    unread: false,
    body: [
      '换季上新，冲锋衣、登山鞋、头灯全场 5 折起。',
      '会员额外立减 50 元，活动截止 10 月 6 日 23:59。',
      '如不想再收到此类邮件，请点击此处退订。'
    ]
  },
  {
    id: 'code',
    from: 'Postbox 安全中心',
    addr: 'security@postbox.com',
    subject: '登录验证码',
    preview: '您的验证码是 482913，5 分钟内有效。如非本人操作请忽略。',
    time: '10月2日',
    unread: false,
    body: [
      '您的登录验证码是 482913，5 分钟内有效。',
      '如非本人操作，请忽略本邮件，并检查账号安全设置。',
      '请勿将验证码提供给任何人。'
    ]
  }
]

const current = ref('chen')
const currentMail = computed(() => mails.find((m) => m.id === current.value) || mails[0])

function enterPark () {
  store.introSeen = true
  router.push('/park')
}
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
.rd-sign {
  margin-top: 20px;
  color: #6b7684;
  font-size: 13.5px;
  line-height: 1.9;
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
