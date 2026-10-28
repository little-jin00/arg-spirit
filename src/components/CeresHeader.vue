<template>
  <header class="ch">
    <div class="ch-inner">
      <router-link
        to="/inside"
        class="ch-brand"
      >
        <svg
          class="ch-mark"
          viewBox="0 0 32 32"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle
            cx="16"
            cy="5.5"
            r="3"
          />
          <circle
            cx="6"
            cy="24"
            r="3"
          />
          <circle
            cx="26"
            cy="24"
            r="3"
          />
          <path d="M16 8.5 L7.8 21.2 M16 8.5 L24.2 21.2 M9 24 L23 24" />
        </svg>
        <span class="ch-name">
          <b>Ceres Reynold</b>
          <i>科赛雷诺科技</i>
        </span>
      </router-link>

      <nav class="ch-nav">
        <router-link
          to="/inside"
          :class="{ on: active === 'home' }"
        >首页</router-link>
        <router-link
          to="/inside#about"
          :class="{ on: active === 'about' }"
        >关于我们</router-link>
        <router-link
          to="/inside#tech"
          :class="{ on: active === 'tech' }"
        >技术平台</router-link>
        <router-link
          to="/inside#solutions"
          :class="{ on: active === 'solutions' }"
        >解决方案</router-link>
        <router-link
          to="/inside/leadership"
          :class="{ on: active === 'leadership' }"
        >管理团队</router-link>
        <router-link
          to="/inside/press"
          :class="{ on: active === 'press' }"
        >新闻中心</router-link>
        <router-link
          to="/inside/jobs"
          :class="{ on: active === 'jobs' }"
        >加入我们</router-link>
      </nav>

      <div class="ch-search">
        <input
          v-model="q"
          type="text"
          placeholder="搜索"
          @input="onInput"
          @keydown.enter.prevent="search"
          @focus="onFocus"
          @blur="onBlur"
        >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
          />
          <path d="M16.5 16.5 L21 21" />
        </svg>

        <!-- 无输入时的"最近搜索"（彩蛋：读完诱饵协议后出现玩家没搜过的记录） -->
        <div
          v-if="showHistory"
          class="ch-drop"
        >
          <div class="ch-drop-label">
            最近搜索
          </div>
          <button
            class="ch-history"
            @mousedown.prevent="pickHistory"
          >
            maya-05
          </button>
        </div>

        <!-- 搜索结果 -->
        <div
          v-else-if="dropOpen && q.trim()"
          class="ch-drop"
        >
          <template v-if="results.length">
            <button
              v-for="r in results"
              :key="r.to + r.title"
              class="ch-result"
              @mousedown.prevent="go(r)"
            >
              <b>{{ r.title }}</b>
              <i>{{ r.source }}</i>
            </button>
          </template>
          <div
            v-else
            class="ch-none"
          >
            未找到与「{{ q.trim() }}」相关的结果
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

defineProps({
  active: { type: String, default: '' }
})

const router = useRouter()
const store = useGameStore()

const q = ref('')
const dropOpen = ref(false)

/* 站内可检索内容索引 */
const SEARCH_INDEX = [
  { keys: ['生日', 'marcus', '副总裁', '蛋糕', 'thorne'], title: '旋转木马前的生日蛋糕——余晖乐园运营副总裁的一天', source: '都市生活周刊 · 2022-03-18', to: '/inside/press/marcus-profile' },
  { keys: ['融资', '离职', '意识健康计划', '用户'], title: '科赛雷诺完成新一轮融资 "意识健康计划"用户突破百万', source: '财经早报 · 2022-08-15', to: '/inside/press/funding-report' },
  { keys: ['kessler', '创始人', '人权', '意识健康是'], title: 'Kessler博士：意识健康是下一个人权议题', source: '科技评论 · 2020-11-05', to: '/inside/press/kessler-interview' },
  { keys: ['cross', 'ceo', 'elysium', '订阅', '快乐'], title: 'Alexander Cross：快乐可以订阅', source: '财经周刊 · 2023-06-12', to: '/inside/press/cross-interview' },
  { keys: ['开园', '闪闪', '吉祥物'], title: '余晖乐园昨日开园 吉祥物"闪闪"正式亮相', source: '城市晨报 · 2018-05-21', to: '/inside/press/park-opening' },
  { keys: ['团队', '管理', '高层', '领导'], title: '管理团队', source: '科赛雷诺科技', to: '/inside/leadership' },
  { keys: ['招聘', '加入', '职位', '福利', '工作'], title: '加入我们', source: '科赛雷诺科技', to: '/inside/jobs' },
  { keys: ['乐园', '旋转木马', '沉浸', '园区', '设施'], title: '解决方案 · 沉浸式体验（余晖乐园示范园区）', source: '科赛雷诺科技', to: '/inside#solutions' },
  { keys: ['技术', '情感ai', '神经', '平台'], title: '技术平台', source: '科赛雷诺科技', to: '/inside#tech' },
  { keys: ['联系', '地址', '电话', '邮箱'], title: '联系我们', source: '科赛雷诺科技', to: '/inside#contact' }
]

/* 被"清理"的敏感词：无论怎么搜都未找到 */
const BLOCKED = [
  'maya', '玛雅', 'e-09', 'e09', 'e-07', 'e-13', '珀耳塞福涅', 'persephone',
  '诱饵', '实验体', '意识剥离', '囚笼', '回收流程', '删除意识'
]

const results = computed(() => {
  const key = q.value.trim().toLowerCase()
  if (!key) return []
  if (BLOCKED.some((b) => key.includes(b))) return []
  return SEARCH_INDEX.filter((item) =>
    item.keys.some((k) => key.includes(k) || k.includes(key))
  ).slice(0, 5)
})

/* 彩蛋：终端里读过诱饵协议后，搜索框出现一条玩家没搜过的历史记录 */
const showHistory = computed(
  () => dropOpen.value && !q.value.trim() && store.evidenceIds.includes('ev_bait_protocol')
)

function onInput () {
  dropOpen.value = true
}

function onFocus () {
  dropOpen.value = true
}

function search () {
  if (!q.value.trim()) return
  if (results.value.length) go(results.value[0])
}

function go (r) {
  dropOpen.value = false
  router.push(r.to)
}

function pickHistory () {
  q.value = 'maya-05'
  dropOpen.value = true
}

function onBlur () {
  setTimeout(() => { dropOpen.value = false }, 160)
}
</script>

<style scoped>
.ch {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eaf1fa;
}
.ch-inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 28px;
  height: 76px;
  display: flex;
  align-items: center;
  gap: 34px;
}
.ch-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.ch-mark {
  width: 34px;
  height: 34px;
  color: #1657c9;
}
.ch-name {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}
.ch-name b {
  font-size: 18px;
  color: #0b2a5b;
  letter-spacing: 0.2px;
}
.ch-name i {
  font-style: normal;
  font-size: 10px;
  color: #8fa3c0;
  letter-spacing: 3px;
}
.ch-nav {
  display: flex;
  align-items: center;
  gap: 28px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}
.ch-nav::-webkit-scrollbar {
  display: none;
}
.ch-nav a {
  position: relative;
  font-size: 14px;
  color: #33415c;
  text-decoration: none;
  white-space: nowrap;
  padding: 6px 0;
}
.ch-nav a:hover {
  color: #1657c9;
}
.ch-nav a.on {
  color: #1657c9;
  font-weight: 600;
}
.ch-nav a.on::after {
  content: "";
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -2px;
  width: 22px;
  height: 2px;
  background: #1657c9;
  border-radius: 2px;
}
.ch-search {
  position: relative;
  flex-shrink: 0;
  width: 190px;
  height: 38px;
  border-radius: 19px;
  background: #f5f9ff;
  border: 1px solid #e4ecf8;
  display: flex;
  align-items: center;
  padding: 0 14px;
}
.ch-search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 13px;
  color: #33415c;
}
.ch-search input::placeholder {
  color: #a9b8cd;
}
.ch-search svg {
  width: 17px;
  height: 17px;
  color: #93a6c2;
  flex-shrink: 0;
}
.ch-drop {
  position: absolute;
  top: 46px;
  right: 0;
  width: 340px;
  background: #fff;
  border: 1px solid #e4ecf8;
  border-radius: 10px;
  box-shadow: 0 12px 32px rgba(11, 42, 91, 0.14);
  padding: 6px;
  z-index: 50;
}
.ch-drop-label {
  font-size: 11px;
  color: #a9b8cd;
  padding: 8px 12px 4px;
  letter-spacing: 1px;
}
.ch-history {
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 9px 12px;
  font-size: 13px;
  color: #33415c;
  border-radius: 7px;
  cursor: pointer;
  font-family: Consolas, monospace;
}
.ch-history:hover {
  background: #f5f9ff;
}
.ch-result {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 10px 12px;
  border-radius: 7px;
  cursor: pointer;
}
.ch-result:hover {
  background: #f5f9ff;
}
.ch-result b {
  font-size: 13.5px;
  color: #24344d;
  font-weight: 600;
  line-height: 1.5;
}
.ch-result i {
  font-style: normal;
  font-size: 11px;
  color: #a9b8cd;
}
.ch-none {
  padding: 14px 12px;
  font-size: 13px;
  color: #a9b8cd;
}
@media (max-width: 900px) {
  .ch-inner {
    gap: 20px;
    padding: 0 18px;
  }
  .ch-search {
    display: none;
  }
  .ch-nav {
    gap: 18px;
  }
  .ch-name b {
    font-size: 16px;
  }
}
</style>
