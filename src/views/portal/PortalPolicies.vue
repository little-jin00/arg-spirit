<template>
  <PortalLayout>
    <h1 class="pg-title">
      制度与合规
    </h1>
    <p class="pg-sub">
      受控文件 · 请勿复制、外传
    </p>

    <div class="sign-bar">
      <span>待签署：{{ PENDING_SIGN.doc }}</span>
      <span class="dim">{{ PENDING_SIGN.pages }} 页 · {{ PENDING_SIGN.printed }} 打印 · 状态：{{ PENDING_SIGN.status }}</span>
      <router-link
        to="/inside/portal/docs"
        class="sign-link"
      >
        打印件登记 →
      </router-link>
    </div>

    <div class="split">
      <div class="list">
        <button
          v-for="d in POLICY_DOCS"
          :key="d.id"
          class="item"
          :class="{ on: d.id === cur.id }"
          @click="cur = d"
        >
          <span class="tt">{{ d.title }}</span>
          <span class="meta">{{ d.effective }} 生效 · {{ d.controlled ? '受控文件' : '内部参考' }}</span>
        </button>
      </div>

      <article class="doc">
        <div class="doc-head">
          <h2>{{ cur.title }}</h2>
          <div class="doc-meta">
            生效日期：{{ cur.effective }}　适用范围：{{ cur.scope }}
          </div>
        </div>
        <div class="doc-body">
          <div
            v-if="cur.excerpt"
            class="excerpt"
          >
            {{ cur.excerpt }}
          </div>
          <template
            v-for="(b, i) in cur.body"
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
        <div class="doc-foot">
          {{ cur.controlled ? '（受控文件，禁止复制、外传。）' : '（内部参考文件。）' }}
        </div>
      </article>
    </div>
  </PortalLayout>
</template>

<script setup>
import { ref } from 'vue'
import PortalLayout from '../../components/PortalLayout.vue'
import { PENDING_SIGN, POLICY_DOCS } from '../../data/portalData'

const cur = ref(POLICY_DOCS[0])
</script>

<style scoped>
.pg-title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
}
.pg-sub {
  margin: 0 0 14px;
  font-size: 12.5px;
  color: var(--muted);
}
.sign-bar {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  background: #fbf7ec;
  border: 1px solid #ece0c4;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 12.5px;
  color: #7a5c22;
  margin-bottom: 18px;
}
.dim {
  color: #9a8250;
}
.sign-link {
  color: #7a5c22;
  font-size: 12px;
  text-decoration: none;
  border-bottom: 1px solid #d8c49a;
}
.split {
  display: grid;
  grid-template-columns: 260px 1fr;
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
  padding: 24px 28px 20px;
  min-height: 360px;
}
.doc h2 {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 600;
}
.doc-meta {
  font-size: 12px;
  color: var(--muted);
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 14px;
}
.doc-body h3 {
  margin: 18px 0 6px;
  font-size: 13.5px;
  font-weight: 600;
}
.excerpt {
  margin: 0 0 12px;
  padding: 8px 12px;
  background: #f8fafb;
  border-left: 2px solid #cdd9e4;
  font-size: 11.5px;
  line-height: 1.7;
  color: var(--muted);
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
.doc-foot {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
  font-size: 11.5px;
  color: var(--muted);
}
@media (max-width: 820px) {
  .split {
    grid-template-columns: 1fr;
  }
}
</style>
