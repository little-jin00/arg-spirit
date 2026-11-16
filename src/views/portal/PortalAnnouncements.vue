<template>
  <PortalLayout>
    <h1 class="pg-title">
      公告
    </h1>
    <p class="pg-sub">
      行政部发布 · 共 {{ ANNOUNCEMENTS.length }} 条
    </p>

    <div class="split">
      <div class="list">
        <button
          v-for="a in ANNOUNCEMENTS"
          :key="a.id"
          class="item"
          :class="{ on: a.id === cur.id }"
          @click="cur = a"
        >
          <span class="it-top">
            <span class="issue">{{ a.issue }}</span>
            <span
              v-if="a.pinned"
              class="pin"
            >置顶</span>
          </span>
          <span class="tt">{{ a.title }}</span>
          <span class="meta">{{ a.date }} · {{ a.dept }}</span>
        </button>
      </div>

      <article class="doc">
        <div class="doc-head">
          <div class="doc-issue">
            {{ cur.issue }}
          </div>
          <h2>{{ cur.title }}</h2>
          <div class="doc-meta">
            发布：{{ cur.dept }}　日期：{{ cur.date }}
          </div>
        </div>
        <div class="doc-body">
          <template
            v-for="(b, i) in cur.body"
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
          本公告由行政部发布，自发布日期起生效。
        </div>
      </article>
    </div>
  </PortalLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import PortalLayout from '../../components/PortalLayout.vue'
import { ANNOUNCEMENTS } from '../../data/portalData'

const route = useRoute()
const byId = ANNOUNCEMENTS.find((a) => a.id === route.query.doc)
const cur = ref(byId || ANNOUNCEMENTS[0])
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
  padding: 11px 13px;
  display: flex;
  flex-direction: column;
  gap: 5px;
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
.it-top {
  display: flex;
  gap: 8px;
  align-items: center;
}
.issue {
  font-size: 11px;
  color: var(--muted);
}
.pin {
  font-size: 10.5px;
  color: #9a6a1f;
  border: 1px solid #e7d4ad;
  border-radius: 3px;
  padding: 0 4px;
}
.tt {
  font-size: 13px;
  color: var(--text);
  font-weight: 500;
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
  min-height: 320px;
}
.doc-issue {
  font-size: 11.5px;
  color: var(--muted);
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
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}
.doc-body h3 {
  margin: 18px 0 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text);
}
.doc-body p {
  margin: 0 0 8px;
  font-size: 13.5px;
  line-height: 1.9;
  color: #33404d;
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
