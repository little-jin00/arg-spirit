<template>
  <PortalLayout>
    <h1 class="pg-title">
      文件中心
    </h1>
    <p class="pg-sub">
      受控文件阅览 · 下载与打印须登记 · 版本以本页为准
    </p>

    <div class="split">
      <div class="list">
        <button
          v-for="f in files"
          :key="f.id"
          class="item"
          :class="{ on: f.id === selected }"
          @click="pick(f.id)"
        >
          <span class="code">{{ f.code }}</span>
          <span class="tt">{{ f.title }}</span>
          <span class="meta">{{ f.meta }}</span>
        </button>
      </div>

      <article class="doc">
        <div class="doc-head">
          <div class="code-line">
            文件编号 {{ cur.code }}
          </div>
          <h2>{{ cur.title }}</h2>
          <div class="doc-meta">
            {{ cur.meta }}
          </div>
        </div>

        <!-- CR-COMP-014：现行版与归档版 -->
        <template v-if="selected === 'comp' || selected === 'comp-old'">
          <div class="ver-bar">
            <button
              class="ver"
              :class="{ on: viewVersion === 'v32' && !showDiff }"
              @click="viewVersion = 'v32'; showDiff = false"
            >
              V3.2 · 现行
            </button>
            <button
              class="ver"
              :class="{ on: viewVersion === 'v26' && !showDiff }"
              @click="viewVersion = 'v26'; showDiff = false"
            >
              V2.6 · 归档
            </button>
            <button
              class="cmp"
              @click="showDiff = !showDiff"
            >
              {{ showDiff ? '收起差异摘要' : '查看差异摘要' }}
            </button>
          </div>

          <div
            v-if="showDiff"
            class="diff"
          >
            <div class="diff-h">
              版本差异摘要
              <span>与交接相关的三处改动</span>
            </div>
            <ol>
              <li>第 8.1 条：新版明确 B3 及以下区域为红区；通行证复核由每月改为每季度；临时只读权限改由安全运营部值班主管签署。</li>
              <li>第 9.2 条：新增“离职前三十日内不得进入 B3 及以下区域”。</li>
              <li>第 10 条：旧版“事件须在 24 小时内上报伦理委员会”整条删除。</li>
            </ol>
            <p class="diff-note">
              摘要只列与交接相关的改动，其余增补与措辞调整未列出。
            </p>
          </div>

          <div
            v-else
            class="doc-body"
          >
            <div class="ver-note">
              {{ singleVersion }}
            </div>
            <template
              v-for="(b, i) in singleBody"
              :key="i"
            >
              <h3 v-if="b.h">
                {{ b.h }}
              </h3>
              <p v-else-if="b.p">
                {{ b.p }}
              </p>
              <div
                v-else
                class="li"
              >
                {{ b.li }}
              </div>
            </template>
          </div>
        </template>

        <!-- 其他制度：节选 -->
        <div
          v-else-if="policyDoc"
          class="doc-body"
        >
          <div class="ver-note">
            {{ policyDoc.excerpt }}
          </div>
          <template
            v-for="(b, i) in policyDoc.body"
            :key="i"
          >
            <h3 v-if="b.h">
              {{ b.h }}
            </h3>
            <p v-else-if="b.p">
              {{ b.p }}
            </p>
            <div
              v-else
              class="li"
            >
              {{ b.li }}
            </div>
          </template>
        </div>

        <!-- 签署页打印件 -->
        <div
          v-else-if="selected === 'tpl'"
          class="doc-body"
        >
          <dl class="file-meta">
            <div><dt>文件名</dt><dd>CR-COMP-014_模板.pdf</dd></div>
            <div><dt>页数</dt><dd>148 页</dd></div>
            <div><dt>打印</dt><dd>2024-10-11 09:42 · 任务 2291 · m.thorne</dd></div>
            <div><dt>装订</dt><dd>双面 · 装订 2 份</dd></div>
            <div><dt>去向</dt><dd>1 份交行政部归档，1 份随员工签收</dd></div>
            <div><dt>关联</dt><dd>待签署：《保密与竞业限制协议》</dd></div>
          </dl>
          <p class="file-note">
            本页仅为打印件登记信息，正文不提供在线阅览。
          </p>
        </div>

        <!-- 授权后可见的交接单 -->
        <div
          v-else-if="selected === 'handover'"
          class="doc-body"
        >
          <div class="ver-note">
            {{ HANDOVER_DOC.code }} · 只读
          </div>
          <template
            v-for="(b, i) in HANDOVER_DOC.lines"
            :key="i"
          >
            <h3 v-if="b.h">
              {{ b.h }}
            </h3>
            <p v-else>
              {{ b.p }}
            </p>
          </template>
        </div>

        <div class="doc-foot">
          （受控文件，禁止复制、外传。）
        </div>
      </article>
    </div>
  </PortalLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import PortalLayout from '../../components/PortalLayout.vue'
import { useGameStore } from '../../stores/game'
import { POLICY_DOCS } from '../../data/portalData'
import { COMP_V26, HANDOVER_DOC } from '../../data/portalPuzzles'

const store = useGameStore()

const selected = ref('comp')
const viewVersion = ref('v32')
const showDiff = ref(false)

const compV32 = POLICY_DOCS.find((d) => d.id === 'cr-comp-014')

const files = computed(() => {
  const list = [
    { id: 'comp', code: 'CR-COMP-014', title: '员工合规规范', meta: '现行版 · 2023-04-01 生效' },
    { id: 'comp-old', code: 'CR-COMP-014', title: '员工合规规范', meta: '归档版 · 2019-08-01 生效' },
    { id: 'inf', code: 'CR-INF-002', title: '信息安全管理规范', meta: '2024-02-01 生效' },
    { id: 'vis', code: 'CR-VIS-005', title: '访客与外包人员接待流程', meta: '2023-11-01 生效' },
    { id: 'tpl', code: 'CR-COMP-014_模板.pdf', title: '员工合规规范 · 签署页打印件', meta: '148 页 · 2024-10-11 打印' }
  ]
  if (store.choices.c3_persephone_granted) {
    list.push({
      id: 'handover',
      code: 'CR-INC-2019-1104',
      title: '事件处置交接单（节选）',
      meta: '只读 · 授权后可见'
    })
  }
  return list
})

const cur = computed(() => files.value.find((f) => f.id === selected.value) || files.value[0])

const singleBody = computed(() => (viewVersion.value === 'v32' ? compV32.body : COMP_V26))
const singleVersion = computed(() =>
  viewVersion.value === 'v32'
    ? 'V3.2 · 2023-04-01 · 现行 · 节选（与交接、权限相关的条款）'
    : 'V2.6 · 2019-08-01 · 归档'
)

const policyDoc = computed(() => {
  const map = { inf: 'cr-inf-002', vis: 'cr-vis-005' }
  return POLICY_DOCS.find((d) => d.id === map[selected.value])
})

function pick (id) {
  selected.value = id
  showDiff.value = false
  viewVersion.value = id === 'comp-old' ? 'v26' : 'v32'
}
</script>

<style scoped>
.pg-title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
}
.pg-sub {
  margin: 0 0 18px;
  font-size: 12.5px;
  color: var(--muted);
}
.split {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 16px;
  align-items: start;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.item {
  text-align: left;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  font-family: inherit;
}
.item:hover {
  border-color: #c9d6e2;
}
.item.on {
  border-color: #b9cbdc;
  background: #f7fafc;
}
.code {
  font-size: 10.5px;
  color: var(--muted);
  letter-spacing: 0.3px;
}
.tt {
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
}
.meta {
  font-size: 11.5px;
  color: var(--muted);
}
.doc {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 22px 26px 18px;
  min-height: 380px;
}
.code-line {
  font-size: 11px;
  color: var(--muted);
  letter-spacing: 0.4px;
  margin-bottom: 6px;
}
.doc h2 {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 600;
}
.doc-meta {
  font-size: 12px;
  color: var(--muted);
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 12px;
}
.ver-bar {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 14px;
}
.ver,
.cmp {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 5px 12px;
  font-size: 12px;
  color: #4a5764;
  cursor: pointer;
  font-family: inherit;
}
.ver.on {
  border-color: #b9cbdc;
  background: #eef4f9;
  color: var(--link);
}
.cmp {
  margin-left: auto;
}
.cmp:hover,
.ver:hover {
  border-color: #b9cbdc;
}
.doc-body {
  max-height: 60vh;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding-right: 6px;
}
.doc-body h3 {
  margin: 16px 0 6px;
  font-size: 13.5px;
  font-weight: 600;
}
.doc-body p,
.li {
  margin: 0 0 7px;
  font-size: 13.5px;
  line-height: 1.9;
  color: #33404d;
}
.li {
  padding-left: 18px;
}
.ver-note {
  font-size: 11.5px;
  color: var(--muted);
  margin-bottom: 10px;
}
.diff {
  background: #fbfcfd;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 16px 18px;
}
.diff-h {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
}
.diff-h span {
  font-size: 11.5px;
  font-weight: 400;
  color: var(--muted);
}
.diff ol {
  margin: 0;
  padding-left: 20px;
}
.diff li {
  margin-bottom: 6px;
  font-size: 13px;
  line-height: 1.9;
  color: #33404d;
}
.diff-note {
  margin: 10px 0 0;
  padding-top: 10px;
  border-top: 1px solid var(--border);
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--muted);
}
.file-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px 22px;
  margin: 4px 0 16px;
  padding: 0;
}
.file-meta div {
  display: flex;
  gap: 10px;
  font-size: 12.5px;
}
.file-meta dt {
  flex: 0 0 42px;
  color: var(--muted);
}
.file-meta dd {
  margin: 0;
  color: #33404d;
}
.file-note {
  margin: 0;
  font-size: 12px;
  color: var(--muted);
}
.doc-foot {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 11.5px;
  color: var(--muted);
}
@media (max-width: 900px) {
  .split {
    grid-template-columns: 1fr;
  }
}
</style>
