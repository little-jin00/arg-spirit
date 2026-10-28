<template>
  <div class="article-page">
    <div class="a-nav">
      <router-link
        to="/park"
        class="a-logo"
      >
        <ShiningSun :size="28" /> 余晖乐园
      </router-link>
      <div class="a-links">
        <router-link to="/park">首页</router-link>
        <router-link to="/news">新闻中心</router-link>
      </div>
    </div>

    <article
      v-if="article"
      class="a-body"
    >
      <router-link
        to="/news"
        class="a-back"
      >← 返回新闻中心</router-link>
      <h1>{{ article.title }}</h1>
      <div class="a-meta">
        <span>发布日期：{{ article.date }}</span>
        <span>来源：余晖乐园官方</span>
      </div>
      <div class="a-content">
        <p
          v-for="(p, i) in article.ps"
          :key="i"
        >
          {{ p }}
        </p>
      </div>
    </article>

    <div
      v-else
      class="a-body"
    >
      <p>文章不存在。</p>
      <router-link to="/news">返回新闻中心</router-link>
    </div>

    <footer class="a-foot">© 2018–2024 科赛雷诺科技 · 余晖乐园</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ShiningSun from '../components/ShiningSun.vue'

const route = useRoute()

const ARTICLES = {
  'halloween-2024': {
    title: '万圣节夜场预告：惊魂古堡限时开放',
    date: '2024-10-08',
    ps: [
      '一年一度的万圣季即将到来。10月31日至11月2日，余晖乐园将开启"万圣奇妙夜"特别夜场，运营时间延长至24:00。',
      '备受期待的鬼屋「惊魂古堡」将在夜场限时开放。今年古堡全新升级"管家的日记"剧情线：12个主题场景全部重制，真人NPC阵容扩充至40人，集齐3枚印章还可兑换万圣限定徽章。',
      '夜场期间，中央广场将有"闪闪万圣巡游"（每日19:00、21:30两场），南瓜灯海、不给糖就捣蛋等亲子活动同步开启。',
      '夜场门票现已开放预订：夜场单人票¥168（18:00后入园），持当日全日票的游客可直接留园参与。',
      '温馨提示：惊魂古堡恐怖程度较高，12岁以下儿童须由成人陪同进入。请游客量力而行，合理安排体验顺序。'
    ]
  },
  'national-day-package': {
    title: '国庆假期家庭套餐特惠',
    date: '2024-09-30',
    ps: [
      '金秋十月，举国同庆。余晖乐园推出国庆假期家庭特惠套餐，邀您与家人共度欢乐时光。',
      '【家庭三人套票】¥998（原价¥1095）：含2大1小全日门票三张、快速通行手环三条、闪闪主题餐厅家庭套餐一份。',
      '【亲子双人套票】¥668（原价¥730）：含1大1小全日门票两张、旋转木马优先体验券一张。',
      '活动时间：10月1日至10月7日。特惠套餐每日限量500套，售完即止。',
      '此外，国庆期间每晚20:30中央广场将上演"璀璨余晖"烟花秀，闪闪人偶将与游客互动合影。',
      '余晖乐园，让笑容照亮每一天。'
    ]
  },
  'children-day': {
    title: '儿童节活动回顾：千人亲子跑',
    date: '2024-06-01',
    ps: [
      '6月1日，余晖乐园"奔跑吧，小太阳"千人亲子跑活动圆满落幕。超过1200组家庭参与了本次3公里欢乐跑。',
      '清晨8:30，伴随着《余晖》主题曲，参赛家庭从中央广场出发，途经欢乐时光区、冒险峡谷区，最终回到中央广场。每位完赛小选手都获得了"小小勇士"奖牌及闪闪定制气球。',
      '活动现场，吉祥物闪闪与孩子们亲密互动，欢声笑语洒满乐园的每一个角落。',
      '感谢每一个家庭的参与。明年六一，我们不见不散。'
    ]
  },
  'iso27001': {
    title: '本园通过ISO27001信息安全认证',
    date: '2024-03-15',
    ps: [
      '近日，余晖乐园正式通过ISO/IEC 27001信息安全管理体系认证，标志着园区在游客个人信息保护方面达到国际标准。',
      '作为国内少数通过该认证的主题乐园，余晖乐园建立了覆盖门票预订、年卡会员、园内消费全链路的信息安全管理体系。游客的姓名、联系方式、消费记录等个人信息均加密存储，严格限制访问权限。',
      '乐园运营方表示："游客的信任是乐园最宝贵的资产。我们将持续投入信息安全建设，让每一位游客安心游园。"',
      '据了解，未来园区还将升级会员系统，为游客提供更便捷的数字化服务体验。'
    ]
  }
}

const article = computed(() => ARTICLES[route.params.slug])
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background: #fff;
}
.a-nav {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 24px;
  background: rgba(255,255,255,0.94);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #eee;
}
.a-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 17px;
  color: #1a1a1a;
  text-decoration: none;
  letter-spacing: 0.5px;
}
.a-links {
  display: flex;
  gap: 20px;
}
.a-links a {
  color: #555;
  text-decoration: none;
  font-size: 14px;
}
.a-links a:hover {
  color: var(--accent);
}
.a-body {
  max-width: 720px;
  margin: 0 auto;
  padding: 24px 24px 60px;
}
.a-back {
  display: inline-block;
  margin-bottom: 16px;
  color: #888;
  text-decoration: none;
  font-size: 13px;
}
.a-back:hover {
  color: var(--accent);
}
.a-body h1 {
  font-size: 26px;
  color: #1a1a1a;
  line-height: 1.4;
}
.a-meta {
  display: flex;
  gap: 24px;
  margin-top: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  color: #999;
}
.a-content {
  margin-top: 24px;
}
.a-content p {
  font-size: 15px;
  color: #333;
  line-height: 2;
  margin-bottom: 16px;
  text-indent: 2em;
}
.a-foot {
  border-top: 1px solid #eee;
  text-align: center;
  padding: 24px;
  font-size: 12px;
  color: #aaa;
}
</style>
