<template>
  <PortalLayout>
    <h1 class="pg-title">
      权限申请
    </h1>
    <p class="pg-sub">
      内部系统权限与区域访问须逐项申请，由对应节点审批人签署后生效
    </p>

    <section
      v-if="granted"
      class="slip"
    >
      <div class="slip-head">
        <span class="slip-code">{{ AUTH_SLIP.code }}</span>
        <span class="ok">已授权</span>
      </div>
      <h2>PERSEPHONE 控制台 · 只读权限</h2>
      <dl class="slip-meta">
        <div><dt>区域节点</dt><dd>{{ AUTH_SLIP.node }}（{{ AUTH_SLIP.zone }}）</dd></div>
        <div><dt>关联工单</dt><dd>{{ AUTH_SLIP.ticket }}</dd></div>
        <div><dt>审批人</dt><dd>{{ AUTH_SLIP.approver }}</dd></div>
        <div><dt>签发时间</dt><dd>{{ AUTH_SLIP.issued }}</dd></div>
        <div><dt>有效期</dt><dd>{{ AUTH_SLIP.valid }}</dd></div>
      </dl>
      <ul class="limits">
        <li
          v-for="l in AUTH_SLIP.limits"
          :key="l"
        >
          {{ l }}
        </li>
      </ul>
      <div class="slip-foot">
        <router-link to="/inside/portal/docs">
          前往文件中心查看交接单 →
        </router-link>
      </div>
    </section>

    <section
      v-else-if="submitted"
      class="pending"
    >
      <div class="pending-top">
        <span class="req-code">CR-REQ-2024-1017</span>
        <span class="wait">待签署</span>
      </div>
      <p class="pending-t">
        申请已提交，等待安全运营部值班主管签署。
      </p>
      <p class="pending-f">
        审批结果将在下次进入门户时更新。审批通过前，相关分区保持不可访问。
      </p>
    </section>

    <form
      v-else
      class="form"
      @submit.prevent="submit"
    >
      <div class="field">
        <label>事项类型</label>
        <select v-model="form.type">
          <option value="">
            请选择
          </option>
          <option
            v-for="t in REQUEST_TYPES"
            :key="t"
            :value="t"
          >
            {{ t }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>目标系统</label>
        <select v-model="form.system">
          <option value="">
            请选择
          </option>
          <option
            v-for="s in REQUEST_SYSTEMS"
            :key="s"
            :value="s"
          >
            {{ s }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>区域节点</label>
        <select v-model="form.node">
          <option value="">
            请选择
          </option>
          <option
            v-for="n in ASSET_NODES"
            :key="n.id"
            :value="n.id"
          >
            {{ n.id }} · {{ n.zone }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>关联工单</label>
        <select v-model="form.ticket">
          <option value="">
            请选择
          </option>
          <option
            v-for="t in REQUEST_TICKETS"
            :key="t"
            :value="t"
          >
            {{ t }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>审批人</label>
        <select v-model="form.approver">
          <option value="">
            请选择
          </option>
          <option
            v-for="a in APPROVERS"
            :key="a.name"
            :value="a.name"
          >
            {{ a.name }}
          </option>
        </select>
      </div>

      <div class="field full">
        <label>事由与访问范围</label>
        <textarea
          v-model="form.reason"
          rows="4"
          placeholder="说明交接事由、目标分区与访问方式"
        />
      </div>

      <div
        v-if="errors.length"
        class="errors"
      >
        <p
          v-for="e in errors"
          :key="e"
        >
          {{ e }}
        </p>
      </div>

      <div class="actions">
        <button
          type="submit"
          class="btn"
        >
          提交申请
        </button>
        <span class="note">提交后进入审批流，审批记录写入审计日志。</span>
      </div>
    </form>
  </PortalLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import PortalLayout from '../../components/PortalLayout.vue'
import { useGameStore } from '../../stores/game'
import {
  APPROVERS,
  ASSET_NODES,
  AUTH_SLIP,
  REQUEST_SYSTEMS,
  REQUEST_TICKETS,
  REQUEST_TYPES
} from '../../data/portalPuzzles'

const store = useGameStore()

const form = reactive({
  type: '',
  system: '',
  node: '',
  ticket: '',
  approver: '',
  reason: ''
})

const errors = ref([])
const submitted = ref(false)

const requested = computed(() => !!store.choices.c3_persephone_request)
const granted = computed(() => !!store.choices.c3_persephone_granted)

onMounted(() => {
  // 提交后刷新门户即视为审批完成：授权状态落在存档里
  if (requested.value && !granted.value) {
    store.setChoice('c3_persephone_granted', true)
    store.markEvent('ticket_permission_granted')
  }
  submitted.value = requested.value && !granted.value
})

function submit () {
  const errs = []

  if (form.type !== '权限开通') {
    errs.push('所选事项类型与工单性质不符。')
  }
  if (form.system !== 'PERSEPHONE 控制台') {
    errs.push('所选系统与工单指定的控制台不一致。')
  }
  if (form.node !== 'CR-PARK-07') {
    errs.push('所选节点与工单登记的区域不一致。')
  }
  if (form.ticket !== 'T-2293') {
    errs.push('该工单未登记待授权的分区处置事项。')
  }

  const approver = APPROVERS.find((a) => a.name === form.approver)
  if (!approver || !approver.scope.includes(form.node)) {
    errs.push('该审批人对此区域节点不具备签署权限。')
  }

  const hits = ['交接', '私人分区', '只读'].filter((k) => form.reason.includes(k)).length
  if (hits < 2) {
    errs.push('请说明交接事由、目标分区与访问方式。')
  }

  errors.value = errs
  if (errs.length) return

  store.setChoice('c3_persephone_request', Date.now())
  submitted.value = true
}
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
.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 16px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px 22px 22px;
  max-width: 760px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.field.full {
  grid-column: 1 / -1;
}
label {
  font-size: 12px;
  color: var(--muted);
}
select,
textarea {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 8px 10px;
  font-size: 13px;
  color: var(--text);
  font-family: inherit;
}
select:focus,
textarea:focus {
  outline: none;
  border-color: #b9cbdc;
}
textarea {
  resize: vertical;
  line-height: 1.7;
}
.errors {
  grid-column: 1 / -1;
  background: #fdf2f2;
  border: 1px solid #f0d4d4;
  border-radius: 5px;
  padding: 8px 12px;
}
.errors p {
  margin: 3px 0;
  font-size: 12.5px;
  color: #9b3b3b;
  line-height: 1.7;
}
.actions {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 2px;
}
.btn {
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 8px 18px;
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
}
.note {
  font-size: 11.5px;
  color: var(--muted);
}

.pending,
.slip {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 20px 22px;
  max-width: 760px;
}
.pending-top,
.slip-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.req-code,
.slip-code {
  font-size: 11.5px;
  color: var(--muted);
  letter-spacing: 0.3px;
}
.wait {
  font-size: 11px;
  color: #9a6a1f;
  background: #fbf3e2;
  border: 1px solid #ece0c4;
  border-radius: 10px;
  padding: 2px 9px;
}
.ok {
  font-size: 11px;
  color: #2f7d5b;
  background: #eaf4ee;
  border: 1px solid #cfe6d9;
  border-radius: 10px;
  padding: 2px 9px;
}
.pending-t {
  margin: 6px 0 6px;
  font-size: 14px;
  color: var(--text);
}
.pending-f {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.8;
  color: var(--muted);
}
.slip h2 {
  margin: 0 0 14px;
  font-size: 15px;
  font-weight: 600;
}
.slip-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 20px;
  margin: 0 0 14px;
  padding: 0;
}
.slip-meta div {
  display: flex;
  gap: 8px;
  font-size: 12.5px;
}
.slip-meta dt {
  color: var(--muted);
  flex: 0 0 64px;
}
.slip-meta dd {
  margin: 0;
  color: #33404d;
}
.limits {
  margin: 0 0 14px;
  padding: 10px 12px 10px 28px;
  background: #f8fafb;
  border-left: 2px solid #cdd9e4;
  font-size: 12.5px;
  line-height: 1.9;
  color: #3c4a58;
}
.slip-foot {
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 12.5px;
}
.slip-foot a {
  text-decoration: none;
}
@media (max-width: 720px) {
  .form {
    grid-template-columns: 1fr;
  }
  .slip-meta {
    grid-template-columns: 1fr;
  }
}
</style>
