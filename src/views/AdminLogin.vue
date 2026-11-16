<template>
  <div class="page">
    <header class="p-head">
      <router-link
        to="/inside"
        class="back"
      >← 返回官网</router-link>
      <span>员工登录 · 内部系统</span>
    </header>

    <!-- 1. 登录 -->
    <form
      v-if="step === 'login'"
      class="login-box"
      @submit.prevent="submitLogin"
    >
      <h2>科赛雷诺内部系统</h2>
      <label>
        <span>账号（邮箱前缀）</span>
        <input
          v-model="user"
          type="text"
          autocomplete="off"
          placeholder="san.zhang"
        />
      </label>
      <label>
        <span>密码</span>
        <input
          v-model="pass"
          type="password"
          autocomplete="off"
          placeholder="••••••••"
        />
      </label>
      <p
        v-if="error"
        class="err"
      >{{ error }}</p>
      <button type="submit">登 录</button>
      <p class="forgot">
        <a
          href="#"
          @click.prevent="startReset"
        >走身份验证，重置口令 →</a>
      </p>
      <p class="forgot">
        <router-link to="/inside/help">忘记密码？查看 IT 帮助台</router-link>
      </p>
      <p class="hint">仅限授权员工访问。所有登录行为均被记录。</p>
    </form>

    <!-- 2. 账号确认 -->
    <form
      v-else-if="step === 'account'"
      class="login-box"
      @submit.prevent="submitAccount"
    >
      <h2>身份验证</h2>
      <p class="step-note">
        口令被重置的账号，需先确认员工身份，由系统重置为初始口令。
      </p>
      <label>
        <span>员工账号</span>
        <input
          v-model="user"
          type="text"
          autocomplete="off"
          placeholder="名.姓"
        />
      </label>
      <p
        v-if="error"
        class="err"
      >{{ error }}</p>
      <button type="submit">下一步</button>
      <p class="forgot">
        <a
          href="#"
          @click.prevent="backToLogin"
        >返回登录</a>
      </p>
    </form>

    <!-- 3/4. 密保问题（分两屏） -->
    <form
      v-else-if="step === 'q1' || step === 'q2'"
      class="login-box"
      @submit.prevent="submitAnswer"
    >
      <h2>身份验证</h2>
      <p class="step-mark">
        <span>账号 {{ user }}</span>
        <span>第 {{ step === 'q1' ? 1 : 2 }} / 2 题</span>
      </p>
      <p
        v-if="notice && step === 'q1'"
        class="notice"
      >{{ notice }}</p>
      <label>
        <span>{{ question.text }}</span>
        <input
          v-model="answer"
          type="text"
          autocomplete="off"
        />
      </label>
      <p
        v-if="error"
        class="err"
      >{{ error }}</p>
      <p
        v-if="hint"
        class="tip"
      >{{ hint }}</p>
      <button type="submit">提交</button>
      <p class="forgot">
        <a
          href="#"
          @click.prevent="toArchived"
        >无法回答？</a>
      </p>
    </form>

    <!-- 5. 重置完成 -->
    <form
      v-else
      class="login-box"
      @submit.prevent="backToLogin"
    >
      <h2>口令已重置</h2>
      <p class="done-main">
        账号 {{ user }} 的口令已重置为初始口令。
      </p>
      <p class="done-kb">
        初始口令规则见 IT 服务台 KB-1002。
      </p>
      <button type="submit">返回登录</button>
    </form>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { AC_EMAIL } from '../data/emails'

const route = useRoute()
const router = useRouter()
const store = useGameStore()

const step = ref('login') // login | account | q1 | q2 | done
const user = ref('')
const pass = ref('')
const answer = ref('')
const error = ref('')
const hint = ref('')
const notice = ref('')
const attempts = ref(0) // 当前这题的失败次数
let fails = 0 // 本次流程累计失败，用于第 5 次触发告警

// 重置后回落的初始口令（名字首字母大写 + 完整出生日期），规则见 KB-1002
const INITIAL_PASSWORD = 'marcus19690317'

const QUESTIONS = {
  q1: {
    text: '你入职时，公司的总部位于哪里？',
    answers: ['滨江', '滨江科学城', 'binjiang'],
    hint1: '方向：答案是一处地点，和公司总部有关。',
    hint2: '方向：官网首页的「关于我们」正文里写着总部的位置。'
  },
  q2: {
    text: '你的入职年份是哪一年？',
    answers: ['2015'],
    hint1: '方向：答案是一个四位数的年份。',
    hint2: '方向：你属于创始团队成员；公司成立的年份在官网首页有标注。'
  }
}

const question = computed(() => QUESTIONS[step.value] || QUESTIONS.q1)

function normalize (v) {
  return v
    .replace(/[\s，,。.]/g, '')
    .replace(/年$/, '')
    .toLowerCase()
}

function unlock () {
  store.unlockStaffAccess()
  const from = typeof route.query.from === 'string' ? route.query.from : ''
  const path = from.split('?')[0].split('#')[0]
  const safe = from.startsWith('/inside/') && path !== '/inside/admin' && path !== '/inside/admin/'
    ? from
    : '/inside/portal'
  router.push(safe)
}

function resetErrors () {
  error.value = ''
  hint.value = ''
  answer.value = ''
  attempts.value = 0
}

function startReset () {
  step.value = 'account'
  resetErrors()
}

function backToLogin () {
  step.value = 'login'
  resetErrors()
  notice.value = ''
  pass.value = ''
  if (store.choices.c3_password_reset) user.value = 'marcus.thorne'
}

function checkAccount (u) {
  return u === 'marcus.thorne'
}

function submitLogin () {
  const u = user.value.trim().toLowerCase().replace(/@.*$/, '')
  if (!u) {
    error.value = '请输入员工账号。'
    return
  }
  if (!checkAccount(u)) {
    pass.value = ''
    error.value = '账号不存在。员工账号为邮箱前缀（名.姓），格式见 IT 帮助台 KB-1002。'
    return
  }
  // 口令已重置：账号回落为初始口令
  if (store.choices.c3_password_reset) {
    if (pass.value.trim().toLowerCase() === INITIAL_PASSWORD) {
      error.value = ''
      notice.value = ''
      unlock()
      return
    }
    error.value = '口令不正确。初始口令规则见 IT 服务台 KB-1002。'
    return
  }
  pass.value = ''
  notice.value = '该账号的口令已于 2024-10-11 16:47 由安全运营部重置，账号处于待身份验证状态，验证通过前无法登录。'
  error.value = ''
  step.value = 'q1'
  resetErrors()
}

function submitAccount () {
  const u = user.value.trim().toLowerCase().replace(/@.*$/, '')
  if (!checkAccount(u)) {
    error.value = '系统中没有这个账号。员工账号为邮箱前缀（名.姓）。'
    return
  }
  step.value = 'q1'
  resetErrors()
}

function submitAnswer () {
  const q = QUESTIONS[step.value]
  if (!answer.value.trim()) {
    error.value = '请输入答案。'
    return
  }
  if (q.answers.includes(normalize(answer.value))) {
    if (step.value === 'q1') {
      step.value = 'q2'
      resetErrors()
    } else {
      store.setChoice('c3_password_reset', true)
      user.value = 'marcus.thorne'
      step.value = 'done'
      error.value = ''
      hint.value = ''
    }
    return
  }

  attempts.value++
  fails++
  error.value = attempts.value >= 2 ? '验证未通过。' : '验证未通过，请重新输入。'
  hint.value = attempts.value >= 2 ? q.hint2 : q.hint1
  answer.value = ''

  // 第 3 次失败：触发 IT 服务台的验证失败通知（M03）
  if (fails >= 3) store.markEvent('auth_fail_3')

  // 第 5 次失败：只触发安全告警邮件，不锁定账号，也不启动倒计时
  if (fails >= 5 && !store.choices.c3_login_flagged) {
    store.setChoice('c3_login_flagged', true)
    store.showAlert(AC_EMAIL)
  }
}

function toArchived () {
  router.push('/inside/help/kb-1004')
}
</script>

<style scoped>
.page {
  max-width: 780px;
  margin: 0 auto;
  padding: 20px 20px 80px;
}
.p-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}
.back {
  color: var(--link);
  text-decoration: none;
}

.login-box {
  margin: 60px auto 0;
  width: 360px;
  max-width: 90vw;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 26px 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}
h2 {
  margin: 0 0 20px;
  font-size: 18px;
  color: #1a1a1a;
  text-align: center;
}
.step-note {
  margin: -8px 0 18px;
  font-size: 12px;
  line-height: 1.7;
  color: #666;
}
.step-mark {
  display: flex;
  justify-content: space-between;
  margin: -8px 0 16px;
  font-size: 12px;
  color: #888;
}
label {
  display: block;
  margin-bottom: 14px;
}
label span {
  display: block;
  font-size: 12px;
  color: #777;
  margin-bottom: 4px;
}
input {
  width: 100%;
  padding: 9px 12px;
  font-size: 14px;
  border: 1px solid var(--border);
  border-radius: 4px;
  outline: none;
  background: #fff;
  color: #1a1a1a;
}
input:focus {
  border-color: var(--accent);
}
.err {
  color: #c62828;
  font-size: 12px;
  margin: 4px 0 10px;
}
.notice {
  color: #8a5a00;
  background: #fff8e8;
  border: 1px solid #f2e0b8;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.6;
  margin: 0 0 12px;
}
.tip {
  color: #6b6b6b;
  font-size: 12px;
  margin: 0 0 10px;
}
.done-main {
  margin: 0 0 7px;
  font-size: 14px;
  color: #1a1a1a;
  text-align: center;
}
.done-kb {
  margin: 0 0 22px;
  font-size: 12px;
  color: #6b6b6b;
  text-align: center;
}
button {
  width: 100%;
  padding: 10px 0;
  font-size: 15px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background: #e05a2b;
}
.hint {
  margin-top: 16px;
  font-size: 11px;
  color: #aaa;
  text-align: center;
}
.forgot {
  margin: 10px 0 0;
  font-size: 12px;
  text-align: center;
}
.forgot a {
  color: #999;
  text-decoration: none;
}
.forgot a:hover {
  color: var(--accent);
}
</style>
