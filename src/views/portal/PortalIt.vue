<template>
  <PortalLayout>
    <h1 class="pg-title">
      IT 自助
    </h1>
    <p class="pg-sub">
      工具与服务
    </p>
    <p
      v-if="needToken"
      class="need-note"
    >
      进入维护终端需要一个有效的维护令牌。请在下方申请后，再打开终端。
    </p>

    <div class="grid">
      <div class="svc">
        <div class="svc-top">
          <span class="name">运维终端</span>
        </div>
        <p class="desc">
          用于文件复核、归档与账号交接。终端内的全部操作写入审计日志。进入终端后按 F1 或输入 ? 可打开命令速查。
        </p>
        <router-link
          to="/inside/admin/terminal"
          class="btn"
        >打开终端</router-link>
      </div>

      <div class="svc">
        <div class="svc-top">
          <span class="name">账号与口令</span>
        </div>
        <p class="desc">
          口令重置、账号恢复与权限申请，请联系 IT 服务台。区域访问权限在门户内提交申请。
        </p>
        <div class="btns">
          <router-link
            to="/inside/help"
            class="btn ghost"
          >前往服务台</router-link>
          <router-link
            to="/inside/portal/requests"
            class="btn ghost"
          >权限申请</router-link>
        </div>
      </div>
    </div>

    <section class="mat">
      <h2>维护访问令牌（MAT）</h2>
      <div class="mat-cols">
        <div class="mat-copy">
          <h3>这是什么</h3>
          <p>IT 服务台在检测到账号连续验证失败后自动签发的一次性凭据。</p>

          <h3>用途</h3>
          <p>
            只用于从外部终端接入内网维护通道。<br>
            有效期 30 分钟，单次有效。<br>
            不能用于门户登录，也不能提升账号权限。
          </p>

          <h3>为什么会出现</h3>
          <p>本周计划维护名单内的账号，在连续失败后会自动签发，便于值班人员在维护窗口内排查。</p>
        </div>

        <div class="mat-card">
          <span class="mat-label">当前令牌</span>
          <code
            class="mat-code"
            :class="{ dim: !tokenValid }"
          >{{ tokenValid ? 'MAT-7F3C-2E91' : '—' }}</code>
          <span
            v-if="tokenValid"
            class="mat-left"
          >剩余 {{ countdown }}</span>
          <span
            v-else
            class="mat-left expired"
          >{{ tokenUsed ? '已使用' : '已过期' }}</span>
          <button
            class="mat-btn"
            @click="issueToken"
          >{{ tokenValid ? '重新签发' : '申请维护令牌' }}</button>
          <p class="mat-note">
            有效期 30 分钟，单次使用。进入终端后即消耗；同一标签页刷新不重复扣。
          </p>
          <div class="mat-state">
            <span class="mat-label">过期后</span>
            <p class="mat-expired">令牌已过期。请重新申请。</p>
          </div>
        </div>
      </div>
    </section>
  </PortalLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import PortalLayout from '../../components/PortalLayout.vue'
import { useGameStore } from '../../stores/game'

const route = useRoute()
const store = useGameStore()
const now = ref(Date.now())
let timer = null

const needToken = computed(() => route.query.need === 'token')
const tokenAt = computed(() => Number(store.choices.c3_terminal_token_at || 0))
const tokenUsed = computed(() => !!store.choices.c3_terminal_token_used)
const remaining = computed(() => Math.max(0, tokenAt.value + 30 * 60 * 1000 - now.value))
const tokenValid = computed(() => tokenAt.value > 0 && !tokenUsed.value && remaining.value > 0)
const countdown = computed(() => {
  const s = Math.ceil(remaining.value / 1000)
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
})

function issueToken () {
  store.setChoice('c3_terminal_token_at', Date.now())
  store.setChoice('c3_terminal_token_used', false)
  now.value = Date.now()
}

onMounted(() => {
  // 连续验证失败后自动签发一次；过期或用掉之后由玩家手动重新申请，不会死锁
  if (!tokenAt.value && store.events.auth_fail_3) issueToken()
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.pg-title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
}
.pg-sub {
  margin: 0 0 20px;
  font-size: 12.5px;
  color: var(--muted);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}
.svc {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.svc-top {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}
.name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
}
.desc {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.8;
  color: #4a5764;
  flex: 1;
}
.btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn {
  align-self: flex-start;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 14px;
  font-size: 12.5px;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
}
.btn.ghost {
  background: #fff;
  color: var(--link);
  border: 1px solid var(--border);
}
.btn.ghost:hover {
  border-color: #b9cbdc;
}
.mat {
  margin-top: 20px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 18px 20px 20px;
}
.mat h2 {
  margin: 0 0 14px;
  font-size: 14px;
  font-weight: 600;
}
.mat-cols {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(220px, 0.65fr);
  gap: 20px;
}
.mat-copy h3 {
  margin: 0 0 4px;
  font-size: 12.5px;
  font-weight: 600;
  color: #3d4a56;
}
.mat-copy p {
  margin: 0 0 12px;
  font-size: 12.5px;
  line-height: 1.8;
  color: #4a5764;
}
.mat-card {
  align-self: start;
  background: #f6f9fc;
  border: 1px dashed #b9cbdc;
  border-radius: 6px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.mat-label {
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--muted);
}
.mat-code {
  font-family: Consolas, monospace;
  font-size: 15px;
  color: #22313f;
  letter-spacing: 1px;
}
.mat-code.dim {
  color: #9aa9b8;
}
.mat-btn {
  align-self: flex-start;
  margin-top: 2px;
  padding: 5px 11px;
  border: 1px solid #b9cbdc;
  border-radius: 5px;
  background: #fff;
  color: #2f5f8a;
  font-family: inherit;
  font-size: 12px;
  cursor: pointer;
}
.mat-btn:hover {
  border-color: #7fa3c4;
}
.mat-note {
  margin: 2px 0 0;
  font-size: 11.5px;
  line-height: 1.6;
  color: var(--muted);
}
.mat-left.expired {
  color: #a2543f;
}
.need-note {
  margin: -8px 0 16px;
  padding: 8px 12px;
  border: 1px solid #e2c9a8;
  border-radius: 6px;
  background: #fdf6ec;
  font-size: 12.5px;
  line-height: 1.6;
  color: #8a5a2b;
}
.mat-left {
  font-size: 12px;
  color: #2f7a58;
}
.mat-state {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #dde7ef;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mat-expired {
  margin: 0;
  font-size: 12px;
  color: #a2543f;
}
@media (max-width: 720px) {
  .mat-cols {
    grid-template-columns: 1fr;
  }
}
</style>
