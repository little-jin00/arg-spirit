<template>
  <PortalLayout>
    <h1 class="pg-title">
      我的工单
    </h1>
    <p class="pg-sub">
      账号交接流程自动生成 · 负责人 {{ owner }}
    </p>

    <div class="tabs">
      <button
        v-for="t in TABS"
        :key="t"
        class="tab"
        :class="{ on: tab === t }"
        @click="tab = t"
      >
        {{ t }} {{ count(t) }}
      </button>
    </div>

    <div
      v-for="t in shown"
      :key="t.id"
      class="ticket"
    >
      <div class="tk-head">
        <span class="id">{{ t.id }}</span>
        <span class="tt">{{ t.title }}</span>
        <span
          class="st"
          :class="stClass(t.status)"
        >{{ t.status }}</span>
      </div>
      <dl class="tk-meta">
        <div><dt>优先级</dt><dd>{{ t.priority }}</dd></div>
        <div><dt>负责人</dt><dd>{{ t.owner }}</dd></div>
        <div><dt>创建时间</dt><dd>{{ t.created }}</dd></div>
        <div v-if="t.due"><dt>期限</dt><dd>{{ t.due }}</dd></div>
        <div v-if="t.area"><dt>登记区域</dt><dd>{{ t.area }}</dd></div>
      </dl>
      <p class="tk-trigger">
        触发原因：{{ t.trigger }}
      </p>

      <ol
        v-if="t.flow"
        class="flow"
      >
        <li
          v-for="(f, i) in t.flow"
          :key="i"
          :class="{ done: f.done }"
        >
          <span class="dot" />
          <span class="ft">{{ f.t }}</span>
          <span class="fs">{{ f.s }}</span>
        </li>
      </ol>

      <p class="tk-note">
        {{ t.note }}
      </p>

      <p
        v-if="t.handover"
        class="tk-handover"
      >
        {{ t.handover }}
      </p>

      <div
        v-if="t.id === 'T-2293' && granted && !review"
        class="review"
      >
        <div class="rv-h">
          复核结论提交
          <span>只读复核完成后提交，记录写入审计日志</span>
        </div>
        <label class="rv-field">
          <span>结论</span>
          <select v-model="reviewConclusion">
            <option>未发现未登记的外部访问记录</option>
            <option>发现未登记的外部访问记录，已上报</option>
          </select>
        </label>
        <label class="rv-field">
          <span>复核说明</span>
          <textarea
            v-model="reviewNote"
            rows="3"
            placeholder="写明复核范围与发现（不少于 10 字）"
          />
        </label>
        <p
          v-if="reviewError"
          class="rv-err"
        >
          {{ reviewError }}
        </p>
        <button
          class="rv-btn"
          @click="submitReview"
        >
          提交复核结论
        </button>
      </div>

      <div
        v-if="t.id === 'T-2293' && review"
        class="review done"
      >
        <div class="rv-h">
          复核结论已提交
          <span>{{ review.at }}</span>
        </div>
        <p class="rv-line">
          {{ review.conclusion }}
        </p>
        <p class="rv-line dim">
          {{ review.note }}
        </p>
      </div>

      <p
        v-if="t.id === 'T-2293' && t.status !== '已授权'"
        class="tk-link"
      >
        <router-link to="/inside/portal/requests">
          发起权限申请 →
        </router-link>
      </p>
    </div>

    <p class="foot-note">
      工单中的文件操作需在运维终端中执行。
      <router-link to="/inside/portal/it">前往 IT 自助 →</router-link>
    </p>
  </PortalLayout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import PortalLayout from '../../components/PortalLayout.vue'
import { useGameStore } from '../../stores/game'
import { TICKETS } from '../../data/portalData'

const store = useGameStore()
const granted = computed(() => !!store.choices.c3_persephone_granted)
const review = computed(() => store.choices.c3_review_submitted || null)

// 打开工单页即算读到 T-2293 的交接记录，解锁 E-07 的许诺者话题
onMounted(() => {
  if (TICKETS.some((t) => t.id === 'T-2293')) {
    store.setChoice('ticket_seen', true)
  }
})

const reviewConclusion = ref('未发现未登记的外部访问记录')
const reviewNote = ref('')
const reviewError = ref('')

const tickets = computed(() =>
  TICKETS.map((t) => {
    if (t.id !== 'T-2293') return t
    const reviewed = review.value
    const flow = t.flow.map((f, i) => {
      if (i === 2 && granted.value) {
        return { t: '2024-10-17 09:12', s: '已授权（只读） · 待复核', done: true }
      }
      if (i === 3 && reviewed) {
        return { t: reviewed.at, s: '已复核 · 已提交安全运营部', done: true }
      }
      return f
    })
    if (!granted.value) return t
    return {
      ...t,
      status: '已授权',
      priority: '只读',
      note: reviewed
        ? `复核结论已提交（${reviewed.at}）。工单转入归档。`
        : '授权已签发（只读）。复核结论须于 10 月 25 日前书面提交安全运营部。',
      flow
    }
  })
)

function submitReview () {
  const note = reviewNote.value.trim()
  if (note.length < 10) {
    reviewError.value = '复核说明不少于 10 字。'
    return
  }
  reviewError.value = ''
  store.setChoice('c3_review_submitted', {
    conclusion: reviewConclusion.value,
    note,
    at: '2024-10-18 10:26'
  })
}

const TABS = computed(() =>
  granted.value ? ['全部', '待处理', '挂起', '已授权'] : ['全部', '待处理', '挂起']
)
const tab = ref('全部')

const owner = TICKETS[0].owner

function count (t) {
  if (t === '全部') return tickets.value.length
  return tickets.value.filter((x) => x.status === t).length
}

const shown = computed(() =>
  tab.value === '全部'
    ? tickets.value
    : tickets.value.filter((t) => t.status === tab.value)
)

function stClass (s) {
  if (s === '待处理') return 'todo'
  if (s === '已授权') return 'ok'
  return 'hold'
}
</script>

<style scoped>
.pg-title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
}
.pg-sub {
  margin: 0 0 16px;
  font-size: 12.5px;
  color: var(--muted);
}
.tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 14px;
}
.tab {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 8px 12px;
  font-size: 12.5px;
  color: var(--muted);
  cursor: pointer;
  font-family: inherit;
}
.tab.on {
  color: var(--link);
  border-bottom-color: var(--link);
}
.ticket {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 10px;
}
.tk-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.id {
  font-size: 11.5px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}
.tt {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  flex: 1;
}
.st {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
}
.todo {
  background: #eaf1f7;
  color: #2d5f86;
}
.hold {
  background: #f3f4f6;
  color: #7c8794;
}
.ok {
  background: #eaf4ee;
  color: #2f7d5b;
}
.tk-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 26px;
  margin: 0 0 8px;
  padding: 0;
}
.tk-meta div {
  display: flex;
  gap: 6px;
}
.tk-meta dt {
  font-size: 11.5px;
  color: var(--muted);
}
.tk-meta dd {
  margin: 0;
  font-size: 11.5px;
  color: #33404d;
}
.tk-trigger {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.7;
}
.flow {
  list-style: none;
  margin: 0 0 10px;
  padding: 10px 12px;
  background: #fafbfc;
  border: 1px solid var(--border);
  border-radius: 5px;
}
.flow li {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 11.5px;
  color: var(--muted);
  padding: 3px 0;
}
.flow .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #c9d2db;
  flex: 0 0 5px;
}
.flow li.done {
  color: #3c4a58;
}
.flow li.done .dot {
  background: #5f86a8;
}
.ft {
  font-variant-numeric: tabular-nums;
}
.fs {
  flex: 1;
}
.tk-note {
  margin: 0;
  padding: 10px 12px;
  background: #f8fafb;
  border-left: 2px solid #cdd9e4;
  font-size: 12.5px;
  line-height: 1.8;
  color: #3c4a58;
}
.tk-handover {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.7;
  color: var(--muted);
}
.review {
  margin-top: 12px;
  padding: 12px 14px;
  background: #fbfcfd;
  border: 1px solid var(--border);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.review.done {
  background: #f4f9f6;
  border-color: #cfe6d9;
}
.rv-h {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
  font-size: 12.5px;
  font-weight: 600;
  color: #33404d;
}
.rv-h span {
  font-weight: 400;
  font-size: 11.5px;
  color: var(--muted);
}
.rv-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rv-field > span {
  font-size: 11.5px;
  color: var(--muted);
}
.rv-field select,
.rv-field textarea {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 7px 9px;
  font-size: 12.5px;
  color: var(--text);
  font-family: inherit;
}
.rv-field select:focus,
.rv-field textarea:focus {
  outline: none;
  border-color: #b9cbdc;
}
.rv-field textarea {
  resize: vertical;
  line-height: 1.7;
}
.rv-err {
  margin: 0;
  font-size: 12px;
  color: #9b3b3b;
}
.rv-btn {
  align-self: flex-start;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 7px 16px;
  font-size: 12.5px;
  cursor: pointer;
  font-family: inherit;
}
.rv-line {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.7;
  color: #33404d;
}
.rv-line.dim {
  color: var(--muted);
}
.tk-link {
  margin: 10px 0 0;
  font-size: 12.5px;
}
.tk-link a {
  text-decoration: none;
}
.foot-note {
  margin-top: 18px;
  font-size: 12px;
  color: var(--muted);
}
.foot-note a {
  text-decoration: none;
}
</style>
