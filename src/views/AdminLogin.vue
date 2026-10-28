<!-- TODO: 临时关闭登录验证（内部调试）：URL 后附加 ?auth=off 可绕过 -->
<template>
  <div class="page">
    <header class="p-head">
      <router-link
        to="/inside"
        class="back"
      >← 返回官网</router-link>
      <span>员工登录 · 内部系统</span>
    </header>

    <form
      class="login-box"
      @submit.prevent="submit"
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
        <router-link to="/inside/help">忘记密码？查看 IT 帮助台</router-link>
      </p>
      <p class="hint">仅限授权员工访问。所有登录行为均被记录。</p>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'
import { AC_EMAIL } from '../data/emails'

const route = useRoute()
const router = useRouter()
const store = useGameStore()

const user = ref('')
const pass = ref('')
const error = ref('')
let fails = 0

function unlock () {
  store.terminalUnlocked = true
  router.push('/inside/admin/terminal')
}

function submit () {
  const u = user.value.trim().toLowerCase()
  if (u === 'marcus.thorne' && pass.value === 'Marcus19690317') {
    unlock()
    return
  }
  fails++
  error.value = '账号或密码错误。'
  if (fails >= 5) {
    error.value = '账号或密码错误。本次失败已被上报。'
    store.startTimer()
    store.showAlert(AC_EMAIL)
  }
}

onMounted(() => {
  // 源码后门（对应源码注释里的 TODO）
  if (route.query.auth === 'off') unlock()
})
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
