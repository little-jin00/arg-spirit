<template>
  <div class="park">
    <!-- 顶部实用信息条 -->
    <div class="topbar">
      <span>今日运营 09:30 – 21:00（夜场开放日）</span>
      <span class="tb-sep">|</span>
      <span>城西新区 · 晴 26°C</span>
      <span class="tb-sep">|</span>
      <span>客服热线 400-800-2018</span>
      <a
        href="#tickets"
        class="tb-cta"
      >快速购票</a>
    </div>

    <!-- 主导航 -->
    <header class="pk-head">
      <router-link
        to="/"
        class="pk-brand"
      >
        <ShiningSun :size="46" />
        <div class="pk-brand-text">
          <b>余晖乐园</b>
          <span>AFTERGLOW PARK</span>
        </div>
      </router-link>
      <nav class="pk-nav">
        <router-link to="/">首页</router-link>
        <a href="#rides">游乐设施</a>
        <a href="#tickets">门票年卡</a>
        <router-link to="/news">新闻中心</router-link>
        <router-link to="/park/info/guide">游客指南</router-link>
        <router-link to="/park/info/transport">交通住宿</router-link>
      </nav>
    </header>

    <!-- Hero 大图 -->
    <section class="hero">
      <img
        class="hero-img"
        :src="IMG.hero"
        alt="余晖乐园黄昏全景"
      />
      <div class="hero-mask">
        <h1>让笑容照亮每一天</h1>
        <p>2018年开业 · 全年无休 · 800万家庭的共同选择</p>
        <a
          href="#tickets"
          class="hero-cta"
        >立即购票 →</a>
      </div>
    </section>

    <!-- 快捷服务入口 -->
    <section class="quick">
      <router-link
        to="/park/info/map"
        class="q-item"
      ><i>🗺️</i>电子导览图</router-link>
      <router-link
        to="/park/info/schedule"
        class="q-item"
      ><i>⏱️</i>演出时刻表</router-link>
      <router-link
        to="/park/info/express"
        class="q-item"
      ><i>⚡</i>快速通行</router-link>
      <router-link
        to="/park/info/dining"
        class="q-item"
      ><i>🍔</i>餐饮美食</router-link>
      <router-link
        to="/park/info/hotel"
        class="q-item"
      ><i>🏨</i>主题酒店</router-link>
    </section>

    <!-- 万圣节活动横幅 -->
    <section class="event-banner">
      <img
        :src="IMG.event"
        alt="万圣奇妙夜"
      />
      <div class="event-text">
        <b>「万圣奇妙夜」10月限定</b>
        <span>惊魂古堡夜场首次开放 · 每晚18:00-22:00 · 需单独购票</span>
      </div>
    </section>

    <!-- 设施卡片（带图） -->
    <section
      class="rides"
      id="rides"
    >
      <h2>人气设施</h2>
      <div class="ride-grid">
        <router-link
          v-for="r in rides"
          :key="r.name"
          :to="`/park/rides/${r.slug}`"
          class="ride"
        >
          <div class="ride-img-wrap">
            <img
              :src="r.img"
              :alt="r.name"
              loading="lazy"
            />
            <span
              class="ride-tag"
              :class="r.tagClass"
            >{{ r.tag }}</span>
          </div>
          <div class="ride-info">
            <b>{{ r.name }}</b>
            <div class="ride-meta">
              <span class="stars">{{ r.stars }}</span>
              <span class="height">{{ r.height }}</span>
            </div>
            <p>{{ r.desc }}</p>
            <span class="ride-more">查看详情 →</span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- 门票 -->
    <section
      class="pk-tickets"
      id="tickets"
    >
      <h2>门票年卡</h2>
      <div class="ticket-row">
        <div class="ticket-card"><b>成人票</b><span class="price">¥180</span><span
            class="note"
          >16周岁以上</span><a
            href="#"
            @click.prevent="showTicketTip = true"
            class="buy"
          >预订</a></div>
        <div class="ticket-card"><b>儿童票</b><span class="price">¥120</span><span
            class="note"
          >1.1m–1.5m儿童</span><a
            href="#"
            @click.prevent="showTicketTip = true"
            class="buy"
          >预订</a></div>
        <div class="ticket-card hot"><b>家庭套餐</b><span
            class="price">¥399</span><span class="note">2大1小 · 含餐饮券</span><a
            href="#"
            @click.prevent="showTicketTip = true"
            class="buy"
          >预订</a></div>
        <div class="ticket-card"><b>尊享年卡</b><span class="price">¥888</span><span
            class="note"
          >全年无限次入园</span><a
            href="#"
            @click.prevent="showTicketTip = true"
            class="buy"
          >办理</a></div>
      </div>
    </section>

    <!-- 最新公告 -->
    <section class="home-news">
      <h2>最新公告</h2>
      <router-link
        v-for="n in news"
        :key="n.title"
        :to="n.to || '/news'"
        class="hn-item"
      >
        <span class="hn-date">{{ n.date }}</span>
        <span class="hn-title">{{ n.title }}</span>
        <span class="hn-arrow">›</span>
      </router-link>
      <router-link
        to="/news"
        class="hn-more"
      >查看全部公告 →</router-link>
    </section>

    <!-- 底部大footer -->
    <footer class="pk-foot">
      <div class="foot-cols">
        <div class="fc">
          <b>游客服务</b>
          <router-link to="/park/info/map">园区地图</router-link>
          <router-link to="/park/info/lost-and-found">失物招领</router-link>
          <router-link to="/park/info/guide">母婴/医疗点</router-link>
          <router-link to="/park/info/guide">行李寄存</router-link>
        </div>
        <div class="fc">
          <b>交通指南</b>
          <router-link to="/park/info/transport">地铁7号线 余晖乐园站 B口</router-link>
          <router-link to="/park/info/transport">公交 201/355/夜12 路</router-link>
          <router-link to="/park/info/transport">停车场收费标准</router-link>
        </div>
        <div class="fc">
          <b>联系我们</b>
          <router-link to="/park/info/contact">客服 400-800-2018</router-link>
          <router-link to="/park/info/contact">团体预约</router-link>
          <router-link
            to="/park/info/contact">service@afterglow-park.com</router-link>
        </div>
        <div class="fc">
          <b>关于</b>
          <router-link to="/news">新闻中心</router-link>
          <router-link to="/park/info/contact">招贤纳士</router-link>
          <router-link to="/park/info/contact">品牌合作</router-link>
        </div>
      </div>
      <div class="foot-base">
        © 2018–2024 科赛雷诺科技 · 余晖乐园 版权所有 ｜ 京ICP备20180888号-1 ｜ 京公网安备
        11010502099999号
      </div>
    </footer>

    <!-- 购票提示模态 -->
    <div
      v-if="showTicketTip"
      class="pk-modal-mask"
      @click.self="showTicketTip = false"
    >
      <div class="pk-modal">
        <h3>购票提示</h3>
        <p>在线购票系统升级维护中，请至乐园正门售票处购票，或通过官方合作平台（悦程旅行、途乐票务）预订。</p>
        <button @click="showTicketTip = false">我知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ShiningSun from '../components/ShiningSun.vue'
import { asset } from '../utils/asset'

const showTicketTip = ref(false)

// 本地生成图片（web/public/images/）
const IMG = {
  hero: asset('images/hero-park.webp'),
  event: asset('images/event-halloween.webp')
}

const rides = [
  {
    slug: 'carousel',
    name: '旋转木马',
    tag: '亲子首选', tagClass: 't-family',
    stars: '★★☆☆☆ 轻松', height: '1.1m以上',
    desc: '经典双层雕花木马，瑞士八音盒机芯，全家共游的温馨之选。',
    img: asset('images/ride-carousel.webp')
  },
  {
    slug: 'thunder',
    name: '过山车「雷霆山」',
    tag: '刺激必玩', tagClass: 't-thrill',
    stars: '★★★★★ 刺激', height: '1.4m以上',
    desc: '85km/h 极速俯冲，连续三个360°回环，勇者的终极试炼。',
    img: asset('images/ride-coaster.webp')
  },
  {
    slug: 'haunted',
    name: '鬼屋「惊魂古堡」',
    tag: '万圣限定', tagClass: 't-horror',
    stars: '★★★★☆ 惊悚', height: '建议12岁以上',
    desc: '维多利亚古堡沉浸式恐怖体验，真人NPC互动，胆小勿入。',
    img: asset('images/ride-haunted.webp')
  },
  {
    slug: 'dome',
    name: '梦境穹顶',
    tag: '沉浸光影', tagClass: 't-dream',
    stars: '★★★☆☆ 沉浸', height: '不限身高',
    desc: '360°全息光影剧场，每日限定场次，带你坠入光影之梦。',
    img: asset('images/ride-dome.webp')
  }
]

const news = [
  { date: '10-08', title: '万圣节夜场预告：惊魂古堡限时开放', to: '/park/news/halloween-2024' },
  { date: '09-30', title: '国庆假期家庭套餐特惠', to: '/park/news/national-day-package' },
  { date: '09-12', title: '【声明】关于网传失联记者曾到访本园的说明', to: '/news/reporter-statement' }
]
</script>

<style scoped>
.park {
  max-width: 1080px;
  margin: 0 auto;
}

/* 顶部信息条 */
.topbar {
  background: #fff3e8;
  color: #8a5a2b;
  font-size: 12px;
  padding: 6px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.tb-sep {
  opacity: 0.4;
}
.tb-cta {
  margin-left: auto;
  background: var(--accent);
  color: #fff;
  padding: 2px 14px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
}

/* 导航 */
.pk-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 20;
}
.pk-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.pk-brand-text {
  display: flex;
  flex-direction: column;
}
.pk-brand-text b {
  font-size: 21px;
  color: #1a1a1a;
  letter-spacing: 0.5px;
}
.pk-brand-text span {
  font-size: 9px;
  letter-spacing: 3px;
  color: var(--muted);
}
.pk-nav {
  display: flex;
  gap: 26px;
  font-size: 14px;
  flex-wrap: wrap;
}
.pk-nav a {
  color: #555;
  text-decoration: none;
  font-weight: 500;
}
.pk-nav a:hover,
.pk-nav a.router-link-exact-active {
  color: var(--accent);
}

/* Hero */
.hero {
  position: relative;
  height: 400px;
  overflow: hidden;
  background: #f5f5f5;
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.hero-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.38) 0%,
    rgba(0, 0, 0, 0.05) 55%,
    transparent 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 64px;
  color: #fff;
}
.hero-mask h1 {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0 0 12px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}
.hero-mask p {
  font-size: 15px;
  opacity: 0.9;
  margin: 0 0 26px;
  font-weight: 300;
  letter-spacing: 0.5px;
}
.hero-cta {
  width: fit-content;
  background: var(--accent);
  color: #fff;
  padding: 13px 36px;
  border-radius: 4px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
}
.hero-cta:hover {
  background: #e05a2b;
}

/* 快捷入口 */
.quick {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 16px 20px;
  background: var(--panel);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.q-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #555;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  background: #f7f7f7;
  border: 1px solid var(--border);
  font-weight: 500;
}
.q-item:hover {
  border-color: #ccc;
  color: #1a1a1a;
}
.q-item i {
  font-style: normal;
  font-size: 16px;
}

/* 活动横幅 */
.event-banner {
  position: relative;
  margin: 22px 20px 0;
  border-radius: 12px;
  overflow: hidden;
  height: 150px;
  background: #2d1b4e;
}
.event-banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.event-text {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(45, 27, 78, 0.85), transparent 65%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 34px;
  color: #fff;
  gap: 6px;
}
.event-text b {
  font-size: 22px;
}
.event-text span {
  font-size: 13px;
  opacity: 0.9;
}

/* 设施 */
.rides {
  padding: 44px 20px 0;
}
.rides h2,
.pk-tickets h2,
.home-news h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  border-left: 4px solid var(--accent);
  padding-left: 12px;
  margin-bottom: 20px;
}
.ride-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}
@media (max-width: 700px) {
  .ride-grid {
    grid-template-columns: 1fr;
  }
}
.ride {
  background: var(--panel);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--border);
  text-decoration: none;
  color: inherit;
  display: block;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.ride:hover {
  border-color: #d8d8d8;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
}
.ride-more {
  display: inline-block;
  margin-top: 8px;
  font-size: 12px;
  color: var(--accent);
}
.ride-img-wrap {
  position: relative;
  height: 170px;
  background: #f0f0f0;
}
.ride-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.ride-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 12px;
  color: #fff;
  padding: 3px 10px;
  border-radius: 4px;
  font-weight: 500;
}
.t-family {
  background: #43a047;
}
.t-thrill {
  background: #e53935;
}
.t-horror {
  background: #5e35b1;
}
.t-dream {
  background: #1e88e5;
}
.ride-info {
  padding: 16px 18px 18px;
}
.ride-info b {
  font-size: 17px;
  color: #1a1a1a;
  font-weight: 600;
}
.ride-meta {
  display: flex;
  gap: 14px;
  font-size: 12px;
  margin: 6px 0 8px;
}
.stars {
  color: var(--accent);
}
.height {
  color: var(--muted);
}
.ride-info p {
  font-size: 13px;
  color: #777;
  line-height: 1.7;
  margin: 0;
}

/* 门票 */
.pk-tickets {
  padding: 44px 20px 0;
}
.ticket-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.ticket-card {
  flex: 1;
  min-width: 150px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.ticket-card.hot {
  border-color: var(--accent);
}
.ticket-card b {
  font-size: 15px;
  color: #1a1a1a;
  font-weight: 600;
}
.price {
  font-size: 27px;
  font-weight: 700;
  color: var(--accent);
}
.note {
  font-size: 12px;
  color: var(--muted);
}
.buy {
  margin-top: 12px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  padding: 7px 28px;
  border-radius: 4px;
  font-weight: 500;
}
.buy:hover {
  background: #e05a2b;
}

/* 最新公告 */
.home-news {
  padding: 44px 20px 0;
}
.hn-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 16px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 6px;
  margin-bottom: 8px;
  text-decoration: none;
  font-size: 14px;
}
.hn-item:hover {
  border-color: #d0d0d0;
}
.hn-date {
  color: var(--muted);
  font-family: Consolas, monospace;
  font-size: 13px;
}
.hn-title {
  color: #333;
  flex: 1;
}
.hn-arrow {
  color: #ccc;
  font-size: 18px;
}
.hn-more {
  display: inline-block;
  margin-top: 8px;
  font-size: 13px;
  color: var(--link);
  text-decoration: none;
  font-weight: 500;
}

/* Footer */
.pk-foot {
  margin-top: 56px;
  background: #fff7ee;
  color: #8a7a6a;
  border-top: 1px solid #f3e3d0;
}
.foot-cols {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 38px 40px 26px;
}
@media (max-width: 700px) {
  .foot-cols {
    grid-template-columns: repeat(2, 1fr);
  }
}
.fc {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}
.fc b {
  color: #4a3826;
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 600;
}
.fc a {
  color: #8a7a6a;
  text-decoration: none;
}
.fc a:hover {
  color: var(--accent);
}
.fc span {
  color: #a89888;
}
.foot-base {
  border-top: 1px solid #f3e3d0;
  padding: 14px 40px;
  font-size: 12px;
  color: #b0a090;
  text-align: center;
}

/* 购票提示模态 */
.pk-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.pk-modal {
  background: #fff;
  border-radius: 10px;
  padding: 28px 32px;
  max-width: 400px;
  text-align: center;
}
.pk-modal h3 {
  color: #1a1a1a;
  margin-bottom: 12px;
}
.pk-modal p {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  margin-bottom: 20px;
}
.pk-modal button {
  padding: 10px 32px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
</style>
