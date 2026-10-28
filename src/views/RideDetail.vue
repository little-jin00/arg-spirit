<template>
  <div class="ride-page">
    <div class="rp-nav">
      <router-link
        to="/park"
        class="rp-logo"
      >
        <ShiningSun :size="28" /> 余晖乐园
      </router-link>
      <div class="rp-links">
        <router-link to="/park">首页</router-link>
        <router-link to="/news">新闻中心</router-link>
        <router-link to="/park/info/guide">游客指南</router-link>
      </div>
    </div>

    <div
      v-if="ride"
      class="rp-body"
    >
      <router-link
        to="/park"
        class="rp-back"
      >← 返回首页</router-link>

      <div class="rp-hero">
        <img
          :src="ride.img"
          :alt="ride.name"
        >
      </div>

      <div class="rp-title-row">
        <h1>{{ ride.name }}</h1>
        <span
          class="rp-tag"
          :class="ride.tagClass"
        >{{ ride.tag }}</span>
      </div>
      <p class="rp-slogan">{{ ride.slogan }}</p>

      <div class="rp-facts">
        <div class="rp-fact">
          <span class="f-label">刺激指数</span>
          <span class="f-value stars">{{ ride.stars }}</span>
        </div>
        <div class="rp-fact">
          <span class="f-label">身高要求</span>
          <span class="f-value">{{ ride.height }}</span>
        </div>
        <div class="rp-fact">
          <span class="f-label">开放时间</span>
          <span class="f-value">{{ ride.hours }}</span>
        </div>
        <div class="rp-fact">
          <span class="f-label">所在区域</span>
          <span class="f-value">{{ ride.zone }}</span>
        </div>
        <div class="rp-fact">
          <span class="f-label">参考排队</span>
          <span class="f-value">{{ ride.queue }}</span>
        </div>
      </div>

      <div
        v-for="(sec, i) in ride.sections"
        :key="i"
        class="rp-sec"
      >
        <h2>{{ sec.h }}</h2>
        <p
          v-for="(p, j) in sec.ps"
          :key="j"
        >
          {{ p }}
        </p>
      </div>

      <div class="rp-notice">
        <h2>注意事项</h2>
        <ul>
          <li
            v-for="(n, i) in ride.notices"
            :key="i"
          >
            {{ n }}
          </li>
        </ul>
      </div>

      <div class="rp-buy-row">
        <button
          class="rp-buy"
          @click="showTicketTip = true"
        >
          立即购票
        </button>
        <router-link
          to="/park/info/express"
          class="rp-express"
        >了解快速通行 →</router-link>
      </div>
    </div>

    <div
      v-else
      class="rp-body"
    >
      <p>页面不存在。</p>
      <router-link to="/park">返回首页</router-link>
    </div>

    <footer class="rp-foot">
      © 2018–2024 科赛雷诺科技 · 余晖乐园
    </footer>

    <div
      v-if="showTicketTip"
      class="rp-modal-mask"
      @click.self="showTicketTip = false"
    >
      <div class="rp-modal">
        <h3>购票提示</h3>
        <p>在线购票系统升级维护中，请至乐园正门售票处购票，或通过官方合作平台（悦程旅行、途乐票务）预订。</p>
        <button @click="showTicketTip = false">我知道了</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import ShiningSun from '../components/ShiningSun.vue'
import { asset } from '../utils/asset'

const route = useRoute()
const showTicketTip = ref(false)

const RIDES = {
  carousel: {
    name: '旋转木马「星光回旋」',
    tag: '亲子首选', tagClass: 't-family',
    stars: '★★☆☆☆',
    height: '1.1m以上（1.1m以下需成人陪同）',
    hours: '9:00 – 21:30',
    zone: '欢乐时光区',
    queue: '约 10–20 分钟',
    slogan: '在八音盒的乐声里，回到童年。',
    img: asset('images/ride-carousel.webp'),
    sections: [
      {
        h: '项目介绍',
        ps: [
          '余晖乐园的标志性设施之一。双层雕花木马共68匹，由意大利工匠手工雕刻上色，搭配瑞士原装八音盒机芯，每晚整点奏响《余晖》主题曲。',
          '木马随音乐缓缓起伏旋转，穹顶星光灯随节拍明灭。这里是全园最受欢迎的合影点，也是许多家庭"每年必来"的约定之地。'
        ]
      },
      {
        h: '运营说明',
        ps: [
          '设施机房位于地下层，标有"设备重地"标识的区域谢绝游客进入，感谢配合。——设施运营部',
          '每晚21:00后，设施将进入降频运行模式，灯光亮度调低，请留意现场广播提示。'
        ]
      }
    ],
    notices: [
      '请勿在设施运行中将身体探出坐骑范围',
      '请勿在木马上饮食、打闹',
      '孕妇及有心脏疾病史的游客请谨慎乘坐',
      '设施暂停开放时，请关注官方公告或现场提示'
    ]
  },
  thunder: {
    name: '过山车「雷霆山」',
    tag: '刺激必玩', tagClass: 't-thrill',
    stars: '★★★★★',
    height: '1.4m以上',
    hours: '9:30 – 20:30',
    zone: '冒险峡谷区',
    queue: '约 60–120 分钟',
    slogan: '85km/h，三个回环，一次尖叫到底。',
    img: asset('images/ride-coaster.webp'),
    sections: [
      {
        h: '项目介绍',
        ps: [
          '全长1.2公里的钢制轨道，最高点42米，垂直俯冲角度达78°，连续三个360°回环。雷霆山是华东地区速度最快的过山车之一。',
          '列车采用电磁弹射起步，2.8秒内加速至85km/h。胆子小的游客，建议从后排开始挑战。'
        ]
      },
      {
        h: '安全监测系统',
        ps: [
          '本项目为游客提供自愿佩戴的"安心手环"，可实时监测心率变化，用于排队及乘坐过程中的安全预警。相关数据仅用于园内安全保障服务。',
          '手环可在排队区入口处领取，出园时归还。'
        ]
      }
    ],
    notices: [
      '身高不足1.4m的游客谢绝乘坐',
      '高血压、心脏病、颈椎疾病患者及孕妇谢绝乘坐',
      '请妥善存放眼镜、手机、帽子等易脱落物品',
      '乘坐过程中请全程握紧安全压杆'
    ]
  },
  haunted: {
    name: '鬼屋「惊魂古堡」',
    tag: '万圣限定', tagClass: 't-horror',
    stars: '★★★★☆',
    height: '建议12岁以上',
    hours: '夜场限定 18:00 – 24:00',
    zone: '惊悚之夜区',
    queue: '约 40–90 分钟',
    slogan: '古堡的地下室，从不对外开放。',
    img: asset('images/ride-haunted.webp'),
    sections: [
      {
        h: '项目介绍',
        ps: [
          '维多利亚风格古堡实景搭建，占地2800㎡，12个主题场景，真人NPC全程互动。从古堡大厅到藏书室，每一段走廊都有"居民"在等你。',
          '2024万圣季全新升级：新增"管家的日记"剧情线，集齐3枚印章可兑换限定徽章。'
        ]
      },
      {
        h: '特别提示',
        ps: [
          '古堡地下区域为演职人员工作区，不对外开放游览。',
          'NPC演员不会与游客发生肢体接触，请同样保持礼貌距离。'
        ]
      }
    ],
    notices: [
      '12岁以下儿童须由成人陪同，且不建议进入',
      '请勿殴打、辱骂、追逐NPC演员',
      '恐怖程度较高，请量力而行',
      '内部光线昏暗，请注意脚下台阶'
    ]
  },
  dome: {
    name: '梦境穹顶',
    tag: '沉浸光影', tagClass: 't-dream',
    stars: '★★★☆☆',
    height: '不限身高（6岁以下需成人陪同）',
    hours: '每日限定场次',
    zone: '未来之光区',
    queue: '预约制，现场不设排队',
    slogan: '闭上眼，你会看见更亮的光。',
    img: asset('images/ride-dome.webp'),
    sections: [
      {
        h: '项目介绍',
        ps: [
          '360°球幕全息剧场，配合园区独家研发的"沉浸头环"，带来前所未有的光影梦境体验。穹顶内部无座位，游客半躺于环形软垫上，全程约25分钟。',
          '每日限定8场，每场仅限12名体验者，需于当日开园后在"未来之光区"服务台预约取号，先到先得。'
        ]
      },
      {
        h: '体验须知',
        ps: [
          '体验前需签署《健康信息授权协议》，并佩戴园区提供的脑波舒缓头环。头环仅用于调节声光节奏，提升沉浸体验。',
          '体验过程中如出现短暂的记忆恍惚、似曾相识感或时间感模糊，属正常沉浸反应，请不必惊慌，工作人员会全程陪护。',
          '每两场之间间隔约3小时，为设备例行维护与内容重置时间，请合理安排行程。'
        ]
      }
    ],
    notices: [
      '有神经系统疾病史、癫痫史的游客请勿体验',
      '体验结束后如有持续不适，请立即前往游客服务中心',
      '体验内容不建议16岁以下游客单独观看',
      '每日预约名额有限，节假日建议开园后尽早取号'
    ]
  }
}

const ride = computed(() => RIDES[route.params.slug])
</script>

<style scoped>
.ride-page {
  min-height: 100vh;
  background: #fff;
}
.rp-nav {
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
.rp-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 17px;
  color: #1a1a1a;
  text-decoration: none;
  letter-spacing: 0.5px;
}
.rp-links {
  display: flex;
  gap: 20px;
}
.rp-links a {
  color: #555;
  text-decoration: none;
  font-size: 14px;
}
.rp-links a:hover {
  color: var(--accent);
}
.rp-body {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 24px 60px;
}
.rp-back {
  display: inline-block;
  margin-bottom: 16px;
  color: #888;
  text-decoration: none;
  font-size: 13px;
}
.rp-back:hover {
  color: var(--accent);
}
.rp-hero {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #eee;
}
.rp-hero img {
  width: 100%;
  display: block;
}
.rp-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 24px;
}
.rp-title-row h1 {
  font-size: 30px;
  color: #1a1a1a;
  letter-spacing: 1px;
}
.rp-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}
.t-family { background: #4caf50; }
.t-thrill { background: #f44336; }
.t-horror { background: #7b1fa2; }
.t-dream  { background: #1e88e5; }
.rp-slogan {
  color: #999;
  font-size: 14px;
  margin-top: 8px;
  letter-spacing: 2px;
}
.rp-facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1px;
  background: #eee;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 24px;
}
.rp-fact {
  background: #fafbfc;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.f-label {
  font-size: 12px;
  color: #999;
}
.f-value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}
.f-value.stars {
  color: var(--accent);
}
.rp-sec {
  margin-top: 32px;
}
.rp-sec h2 {
  font-size: 18px;
  color: #1a1a1a;
  padding-left: 10px;
  border-left: 3px solid var(--accent);
  margin-bottom: 12px;
}
.rp-sec p {
  font-size: 14px;
  color: #444;
  line-height: 1.9;
  margin-bottom: 10px;
}
.rp-notice {
  margin-top: 32px;
  background: #fafbfc;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px 24px;
}
.rp-notice h2 {
  font-size: 16px;
  color: #1a1a1a;
  margin-bottom: 10px;
}
.rp-notice ul {
  padding-left: 20px;
}
.rp-notice li {
  font-size: 13px;
  color: #555;
  line-height: 2;
}
.rp-buy-row {
  margin-top: 36px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.rp-buy {
  padding: 14px 44px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 2px;
  cursor: pointer;
}
.rp-buy:hover {
  background: #e05a2b;
}
.rp-express {
  font-size: 13px;
  color: #888;
  text-decoration: none;
}
.rp-express:hover {
  color: var(--accent);
}
.rp-foot {
  border-top: 1px solid #eee;
  text-align: center;
  padding: 24px;
  font-size: 12px;
  color: #aaa;
}
.rp-modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.rp-modal {
  background: #fff;
  border-radius: 10px;
  padding: 28px 32px;
  max-width: 400px;
  text-align: center;
}
.rp-modal h3 {
  color: #1a1a1a;
  margin-bottom: 12px;
}
.rp-modal p {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
  margin-bottom: 20px;
}
.rp-modal button {
  padding: 10px 32px;
  background: var(--accent);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}
</style>
