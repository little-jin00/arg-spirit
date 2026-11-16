<template>
  <PortalLayout>
    <h1 class="pg-title">
      访客与接待
    </h1>
    <p class="pg-sub">
      东侧门岗登记 · 由接待人全程陪同 · 按登记日期调阅
    </p>

    <section class="panel">
      <form
        class="query"
        @submit.prevent="lookup"
      >
        <label for="visit-date">登记日期</label>
        <input
          id="visit-date"
          v-model="queryDate"
          type="date"
          :min="ARCHIVE_START"
          :max="ARCHIVE_END"
        >
        <button type="submit">
          调阅
        </button>
      </form>
      <p class="scope">
        门岗访客登记自 2018 年起电子化归档并长期保留，可查 {{ ARCHIVE_START }} 至 {{ ARCHIVE_END }}。2017 年及以前的纸质记录已移交行政部档案室，需线下调阅；门禁通行记录按制度另行保存十二个月，不包含本页访客登记。
      </p>
      <p
        v-if="error"
        class="error"
      >
        {{ error }}
      </p>
    </section>

    <section
      v-if="searched"
      class="panel results"
    >
      <div class="ph">
        <h2>{{ searchedDate }} 的登记记录</h2>
        <span class="tag">{{ results.length }} 条</span>
      </div>

      <p
        v-if="!results.length"
        class="empty"
      >
        该日期没有访客登记记录。
      </p>

      <article
        v-for="r in results"
        :key="r.date + r.host + r.time"
        class="record"
      >
        <div class="rec-head">
          <span class="rec-date">{{ r.date }}</span>
          <span class="rec-gate">{{ r.gate }}</span>
        </div>
        <dl class="rec-meta">
          <div><dt>来访人</dt><dd>{{ r.visitor }}</dd></div>
          <div><dt>同行</dt><dd>{{ r.companions }}</dd></div>
          <div><dt>人数</dt><dd>{{ r.people }}</dd></div>
          <div><dt>接待人</dt><dd>{{ r.host }}</dd></div>
          <div><dt>事由</dt><dd>{{ r.purpose }}</dd></div>
          <div><dt>时间</dt><dd>{{ r.time }}</dd></div>
          <div v-if="r.special">
            <dt>备注</dt><dd>{{ r.special }}</dd>
          </div>
          <div v-if="r.handover">
            <dt>交接</dt><dd>{{ r.handover }}</dd>
          </div>
        </dl>
        <p
          v-if="r.note"
          class="rec-note"
        >
          {{ r.note }}
        </p>
      </article>
    </section>
  </PortalLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import PortalLayout from '../../components/PortalLayout.vue'
import { useGameStore } from '../../stores/game'
import { VISITOR_ARCHIVE } from '../../data/portalPuzzles'

const store = useGameStore()

const ARCHIVE_START = '2018-01-01'
const ARCHIVE_END = '2024-10-13'

const queryDate = ref('')
const searchedDate = ref('')
const searched = ref(false)
const error = ref('')

const results = computed(() =>
  searchedDate.value
    ? VISITOR_ARCHIVE.filter((r) => r.date === searchedDate.value)
    : []
)

// 读到他与女儿那天的登记记录后，E-07 的深层话题才解锁
watch(results, (list) => {
  if (list.some((r) => r.date === '2019-07-19')) {
    store.setChoice('portal_visit_seen', true)
  }
})

function lookup () {
  const date = queryDate.value
  if (!date) {
    searched.value = false
    error.value = '请先选择登记日期。'
    return
  }
  if (date < ARCHIVE_START || date > ARCHIVE_END) {
    searched.value = false
    error.value = `可查范围为 ${ARCHIVE_START} 至 ${ARCHIVE_END}；更早的纸质记录请线下调阅。`
    return
  }
  error.value = ''
  searchedDate.value = date
  searched.value = true
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
.panel {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px 18px 18px;
}
.query {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.query label {
  font-size: 12.5px;
  color: var(--muted);
}
.query input {
  min-width: 150px;
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 7px 10px;
  background: #fff;
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  color-scheme: light;
}
.query input:focus {
  outline: none;
  border-color: #b9cbdc;
}
.query button {
  border: none;
  border-radius: 5px;
  padding: 8px 18px;
  background: var(--accent);
  color: #fff;
  font-size: 12.5px;
  font-family: inherit;
  cursor: pointer;
}
.query button:hover {
  opacity: 0.9;
}
.scope {
  margin: 0;
  font-size: 11.5px;
  line-height: 1.8;
  color: var(--muted);
}
.error {
  margin: 8px 0 0;
  font-size: 12px;
  color: #9a3b3b;
}
.results {
  margin-top: 16px;
}
.ph {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 12px;
}
.ph h2 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}
.tag {
  font-size: 11.5px;
  color: var(--muted);
}
.empty {
  margin: 0;
  padding: 14px 0;
  font-size: 13px;
  color: var(--muted);
}
.record {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 14px 16px;
}
.record + .record {
  margin-top: 10px;
}
.rec-head {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 10px;
  padding-bottom: 9px;
  border-bottom: 1px solid var(--border);
}
.rec-date {
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.rec-gate {
  font-size: 11.5px;
  color: var(--muted);
}
.rec-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 7px 22px;
  margin: 0;
  padding: 0;
}
.rec-meta div {
  display: flex;
  gap: 8px;
  font-size: 12.5px;
}
.rec-meta dt {
  flex: 0 0 58px;
  color: var(--muted);
}
.rec-meta dd {
  margin: 0;
  color: #33404d;
}
.rec-note {
  margin: 10px 0 0;
  padding-top: 9px;
  border-top: 1px solid var(--border);
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--muted);
}
@media (max-width: 720px) {
  .rec-meta {
    grid-template-columns: 1fr;
  }
}
</style>
