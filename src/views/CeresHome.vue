<template>
  <div class="ceres-home">
    <CeresHeader active="home" />

    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <div class="eyebrow">
            PIONEERING THE FUTURE OF CONSCIOUSNESS
          </div>
          <h1>以科技之力<br>守护意识的边界</h1>
          <p>
            科赛雷诺科技是一家专注于神经科学与意识健康领域的全球化企业。
            我们通过突破性的神经信号解析技术，让人工智能理解情绪、守护记忆，
            改善人类的精神健康。
          </p>
          <div class="hero-actions">
            <a
              href="#about"
              class="btn-solid"
            >了解我们</a>
            <a
              href="#contact"
              class="btn-ghost"
            >联系我们</a>
          </div>
        </div>

        <router-link
          to="/inside/leadership"
          class="team-card"
        >
          <img
            :src="asset('images/ceres-team.webp')"
            alt="公司高层"
          >
          <div class="team-overlay">
            <div class="team-label">
              <span class="team-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="3.6"
                  />
                  <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
                </svg>
              </span>
              <span class="team-text">
                <b>公司高层介绍</b>
                <i>LEADERSHIP TEAM</i>
              </span>
            </div>
            <span class="team-arrow">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </span>
          </div>
        </router-link>
      </div>
    </section>

    <section class="features">
      <div class="wrap feature-grid">
        <div class="feature">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12M7 3v18M17 3v18" />
          </svg>
          <div>
            <b>创新驱动</b>
            <span>持续探索突破边界的神经科学技术</span>
          </div>
        </div>
        <div class="feature">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
            />
            <path d="M3 12h18M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18" />
          </svg>
          <div>
            <b>全球布局</b>
            <span>连接全球科研资源与临床合作伙伴</span>
          </div>
        </div>
        <div class="feature">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
          >
            <path d="M12 3l7 3v6c0 4.2-2.9 7.7-7 9-4.1-1.3-7-4.8-7-9V6l7-3z" />
            <path d="M8.8 12l2.2 2.2 4.2-4.4" />
          </svg>
          <div>
            <b>品质为先</b>
            <span>严格标准，安全可靠的全流程管理</span>
          </div>
        </div>
      </div>
    </section>

    <section
      id="about"
      class="section"
    >
      <div class="wrap about-grid">
        <div>
          <div class="eyebrow">
            ABOUT US
          </div>
          <h2>让每一个意识<br>都被温柔对待</h2>
          <p class="body">
            科赛雷诺科技成立于2015年，总部位于滨江科学城，在全球设有12个研发与服务机构。
            我们相信，精神的痛苦大多来自未被理解的神经信号——而理解，是治愈的开始。
          </p>
          <p class="body">
            我们将前沿神经科学、人工智能与临床医学结合，构建从情绪识别、神经信号解析
            到意识健康管理的完整技术体系，服务医疗机构、企业组织与千万个家庭。
          </p>
        </div>
        <div class="stats">
          <div class="stat">
            <b>2015</b><span>成立年份</span>
          </div>
          <div class="stat">
            <b>12</b><span>全球机构</span>
          </div>
          <div class="stat">
            <b>1,200+</b><span>科研人员</span>
          </div>
          <div class="stat">
            <b>800万+</b><span>累计服务用户</span>
          </div>
        </div>
      </div>
    </section>

    <section
      id="tech"
      class="section soft"
    >
      <div class="wrap">
        <div class="eyebrow">
          TECHNOLOGY PLATFORM
        </div>
        <h2>技术平台</h2>
        <div class="card-grid">
          <div class="card">
            <span class="tag">临床应用</span>
            <h3>情感AI辅助治疗</h3>
            <p>基于多模态情绪识别的辅助干预系统，为临床心理治疗提供可量化的过程支持。</p>
          </div>
          <div class="card">
            <span class="tag">核心技术</span>
            <h3>神经信号解析引擎</h3>
            <p>毫秒级解码神经活动模式，构建个体化的意识状态模型，让机器真正"读懂"情绪。</p>
          </div>
          <div class="card">
            <span class="tag">健康管理</span>
            <h3>意识健康档案</h3>
            <p>覆盖评估、干预与随访的全生命周期服务，为个人与企业提供连续的意识健康管理。</p>
          </div>
        </div>
      </div>
    </section>

    <section
      id="solutions"
      class="section"
    >
      <div class="wrap">
        <div class="eyebrow">
          SOLUTIONS
        </div>
        <h2>解决方案</h2>
        <div class="card-grid four">
          <div class="card">
            <h3>医疗康复</h3>
            <p>与三甲医院神经科合作，为术后与慢性疼痛患者提供情绪辅助干预方案。</p>
          </div>
          <div class="card">
            <h3>心理健康</h3>
            <p>面向学校、企业与社区的心理韧性训练体系，让支持触达每一个需要的人。</p>
          </div>
          <router-link
            to="/inside/rides/carousel"
            class="card link"
          >
            <h3>沉浸式体验</h3>
            <p>以余晖乐园为示范园区，探索情绪数据在沉浸式娱乐场景中的合规应用。</p>
            <span class="more">了解示范园区 →</span>
          </router-link>
          <div class="card">
            <h3>企业服务</h3>
            <p>一体化的员工意识健康福利计划，帮助组织识别并降低心理风险。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section soft">
      <div class="wrap">
        <div class="sec-head">
          <div>
            <div class="eyebrow">
              NEWSROOM
            </div>
            <h2>新闻中心</h2>
          </div>
          <router-link
            to="/inside/press"
            class="more"
          >查看全部 →</router-link>
        </div>
        <div class="news-list">
          <router-link
            v-for="n in news"
            :key="n.slug"
            :to="`/inside/press/${n.slug}`"
            class="news-item"
          >
            <span class="news-source">{{ n.source }}</span>
            <span class="news-title">{{ n.title }}</span>
            <span class="news-date">{{ n.date }}</span>
          </router-link>
        </div>
      </div>
    </section>

    <section
      id="contact"
      class="section"
    >
      <div class="wrap contact">
        <div>
          <div class="eyebrow">
            CONTACT US
          </div>
          <h2>联系我们</h2>
          <p class="body">
            无论是科研合作、临床共建还是媒体采访，我们期待与你对话。
          </p>
        </div>
        <div class="contact-info">
          <p><b>地址</b>滨江科学城云杉路 88 号 · 科赛雷诺大厦</p>
          <p><b>电话</b>021-6888-2015</p>
          <p><b>邮箱</b>contact@ceres-reynold.com</p>
          <p><b>招聘</b>hr@ceres-reynold.com</p>
          <div class="contact-btns">
            <router-link
              to="/inside/jobs"
              class="btn-solid"
            >加入我们</router-link>
            <router-link
              to="/inside/press"
              class="btn-ghost"
            >媒体合作</router-link>
          </div>
        </div>
      </div>
    </section>

    <footer class="foot">
      <div class="wrap foot-grid">
        <div class="foot-brand">
          <b>Ceres Reynold</b>
          <span>科赛雷诺科技</span>
          <p>让科技理解情绪，让意识被温柔对待。</p>
        </div>
        <div class="foot-col">
          <b>快速链接</b>
          <router-link to="/inside/leadership">管理团队</router-link>
          <router-link to="/inside/press">新闻中心</router-link>
          <router-link to="/inside/jobs">加入我们</router-link>
        </div>
        <div class="foot-col">
          <b>联系方式</b>
          <span>021-6888-2015</span>
          <span>contact@ceres-reynold.com</span>
          <span>滨江科学城云杉路 88 号</span>
        </div>
      </div>
      <div class="wrap foot-bottom">
        <span>© 2015–2024 科赛雷诺科技 · 沪ICP备20150815号</span>
        <span class="foot-links">
          <router-link to="/inside/legal/privacy">隐私政策</router-link>
          <!-- 追踪陷阱：点击即视为暴露 -->
          <a
            href="#"
            @click.prevent="report"
          >网站问题反馈</a>
          <router-link to="/inside/admin">员工入口</router-link>
        </span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import CeresHeader from '../components/CeresHeader.vue'
import { useGameStore } from '../stores/game'
import { AC_EMAIL } from '../data/emails'
import { asset } from '../utils/asset'

const store = useGameStore()

const news = [
  { slug: 'cross-interview', source: '财经周刊', date: '2023-06-12', title: 'Alexander Cross：快乐可以订阅' },
  { slug: 'funding-report', source: '财经早报', date: '2022-08-15', title: '科赛雷诺完成新一轮融资，"意识健康计划"用户突破百万' },
  { slug: 'marcus-profile', source: '都市生活周刊', date: '2022-03-18', title: '旋转木马前的生日蛋糕——余晖乐园运营副总裁的一天' }
]

function report () {
  if (store.choices.c1_2_reported) return
  store.setChoice('c1_2_reported', true)
  store.startTimer()      // 若尚未开始则从现在起算
  store.shortenTimer(24)  // 72h → 48h
  store.showAlert(AC_EMAIL)
}
</script>

<style scoped>
.ceres-home {
  --navy: #0b2a5b;
  --blue: #1657c9;
  --text: #3d4b63;
  --muted: #7b8ba6;
  --line: #e6eef8;
  --soft: #f5f9ff;
}
.wrap {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 28px;
}
.eyebrow {
  font-size: 12px;
  letter-spacing: 2.4px;
  color: var(--blue);
  font-weight: 600;
  margin-bottom: 14px;
}
h1 {
  font-size: 48px;
  line-height: 1.24;
  color: var(--navy);
  margin: 0 0 22px;
  font-weight: 800;
  letter-spacing: 0.5px;
}
h2 {
  font-size: 30px;
  line-height: 1.4;
  color: var(--navy);
  margin: 0 0 18px;
  font-weight: 800;
}
.body {
  font-size: 15px;
  line-height: 2;
  color: var(--text);
  margin: 0 0 14px;
}

/* ---------- Hero ---------- */
.hero {
  background: radial-gradient(
      900px 420px at 78% 8%,
      #e8f2ff 0%,
      rgba(232, 242, 255, 0) 65%
    ),
    linear-gradient(180deg, #f7fbff 0%, #ffffff 78%);
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 460px;
  gap: 64px;
  align-items: center;
  padding-top: 66px;
  padding-bottom: 54px;
}
.hero-copy p {
  font-size: 15px;
  line-height: 2;
  color: var(--text);
  max-width: 480px;
  margin: 0 0 30px;
}
.hero-actions {
  display: flex;
  gap: 14px;
}
.btn-solid,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 28px;
  border-radius: 22px;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-solid {
  background: var(--blue);
  color: #fff;
  box-shadow: 0 8px 20px rgba(22, 87, 201, 0.22);
}
.btn-solid:hover {
  background: #0f47ad;
}
.btn-ghost {
  color: var(--navy);
  border: 1px solid #c9dcf6;
  background: #fff;
}
.btn-ghost:hover {
  border-color: var(--blue);
  color: var(--blue);
}

.team-card {
  position: relative;
  display: block;
  border-radius: 22px;
  overflow: hidden;
  text-decoration: none;
  box-shadow: 0 24px 60px rgba(11, 42, 91, 0.18);
  aspect-ratio: 4 / 5;
  background: #dfe9f7;
}
.team-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.5s;
}
.team-card:hover img {
  transform: scale(1.03);
}
.team-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 128px;
  padding: 0 22px 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(
    180deg,
    rgba(8, 30, 66, 0) 0%,
    rgba(8, 30, 66, 0.86) 42%,
    rgba(8, 30, 66, 0.96) 100%
  );
}
.team-label {
  display: flex;
  align-items: center;
  gap: 14px;
}
.team-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.34);
  display: flex;
  align-items: center;
  justify-content: center;
}
.team-icon svg {
  width: 22px;
  height: 22px;
  color: #fff;
}
.team-text {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}
.team-text b {
  color: #fff;
  font-size: 19px;
  letter-spacing: 1px;
}
.team-text i {
  font-style: normal;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.62);
  letter-spacing: 2.4px;
}
.team-arrow {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}
.team-arrow svg {
  width: 19px;
  height: 19px;
  color: var(--navy);
}

/* ---------- 优势条 ---------- */
.features {
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-top: 30px;
  padding-bottom: 30px;
}
.feature {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  padding: 0 30px;
  border-left: 1px solid var(--line);
}
.feature:first-child {
  border-left: none;
  padding-left: 0;
}
.feature svg {
  width: 26px;
  height: 26px;
  color: var(--blue);
  flex-shrink: 0;
  margin-top: 2px;
}
.feature b {
  display: block;
  font-size: 16px;
  color: var(--navy);
  margin-bottom: 4px;
}
.feature span {
  font-size: 13px;
  color: var(--muted);
}

/* ---------- 通用区块 ---------- */
.section {
  padding: 76px 0;
}
.section.soft {
  background: var(--soft);
}
.about-grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 60px;
  align-items: center;
}
.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--line);
  border: 1px solid var(--line);
  border-radius: 16px;
  overflow: hidden;
}
.stat {
  background: #fff;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat b {
  font-size: 30px;
  color: var(--blue);
  letter-spacing: -0.5px;
}
.stat span {
  font-size: 13px;
  color: var(--muted);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 30px;
}
.card-grid.four {
  grid-template-columns: repeat(4, 1fr);
}
.card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 26px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  transition: all 0.22s;
}
.card h3 {
  font-size: 18px;
  color: var(--navy);
  margin: 0;
}
.card p {
  font-size: 13.5px;
  line-height: 1.95;
  color: var(--muted);
  margin: 0;
}
.card .tag {
  align-self: flex-start;
  font-size: 11px;
  color: var(--blue);
  background: #eaf2ff;
  border-radius: 4px;
  padding: 3px 9px;
  letter-spacing: 0.5px;
}
.card.link {
  border-color: #cfe0f8;
  background: linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  cursor: pointer;
}
.card.link:hover {
  border-color: var(--blue);
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(11, 42, 91, 0.09);
}
.card .more {
  margin-top: auto;
  font-size: 13px;
  color: var(--blue);
}

.sec-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.more {
  font-size: 13px;
  color: var(--blue);
  text-decoration: none;
}
.news-list {
  margin-top: 22px;
  border-top: 1px solid var(--line);
}
.news-item {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 18px 4px;
  border-bottom: 1px solid var(--line);
  text-decoration: none;
  transition: background 0.18s;
}
.news-item:hover {
  background: #fff;
}
.news-source {
  width: 110px;
  flex-shrink: 0;
  font-size: 12px;
  color: #8fa3c0;
}
.news-title {
  flex: 1;
  font-size: 15px;
  color: #24344d;
}
.news-item:hover .news-title {
  color: var(--blue);
}
.news-date {
  font-size: 12px;
  color: #a9b8cd;
  font-family: Consolas, monospace;
}

/* ---------- 联系 ---------- */
.contact {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 60px;
  align-items: start;
  padding-top: 64px;
  padding-bottom: 64px;
  border-top: 1px solid var(--line);
}
.contact-info p {
  font-size: 14px;
  color: var(--text);
  margin: 0 0 14px;
  display: flex;
  gap: 16px;
}
.contact-info p b {
  width: 44px;
  flex-shrink: 0;
  color: #9aa9c0;
  font-weight: normal;
  font-size: 13px;
}
.contact-btns {
  display: flex;
  gap: 12px;
  margin-top: 26px;
}

/* ---------- Footer ---------- */
.foot {
  background: #0b1f3a;
  color: #a9bcd6;
  font-size: 13px;
}
.foot-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.2fr;
  gap: 40px;
  padding-top: 48px;
  padding-bottom: 36px;
}
.foot-brand b {
  display: block;
  font-size: 18px;
  color: #fff;
}
.foot-brand span {
  display: block;
  font-size: 10px;
  letter-spacing: 3px;
  color: #5f7b9e;
}
.foot-brand p {
  margin: 14px 0 0;
  font-size: 12.5px;
  color: #7d93b3;
}
.foot-col {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.foot-col b {
  color: #fff;
  font-size: 13px;
  margin-bottom: 4px;
}
.foot-col a,
.foot-col span {
  color: #8ba2c0;
  text-decoration: none;
  font-size: 12.5px;
}
.foot-col a:hover {
  color: #fff;
}
.foot-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  padding-bottom: 22px;
  border-top: 1px solid #1b3253;
  font-size: 12px;
  color: #6b83a5;
  flex-wrap: wrap;
  gap: 10px;
}
.foot-links {
  display: flex;
  gap: 18px;
}
.foot-links a {
  color: #6b83a5;
  text-decoration: none;
}
.foot-links a:hover {
  color: #a9bcd6;
}

@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 34px;
  }
  .team-card {
    max-width: 460px;
  }
  .about-grid,
  .contact {
    grid-template-columns: 1fr;
    gap: 34px;
  }
  .card-grid,
  .card-grid.four {
    grid-template-columns: 1fr 1fr;
  }
  .feature-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .feature {
    border-left: none;
    padding: 0;
  }
  .foot-grid {
    grid-template-columns: 1fr;
  }
  h1 {
    font-size: 34px;
  }
  h2 {
    font-size: 24px;
  }
}
@media (max-width: 640px) {
  .card-grid,
  .card-grid.four,
  .stats {
    grid-template-columns: 1fr;
  }
  .news-source {
    display: none;
  }
}
</style>
