<template>
  <div class="page">
    <CeresHeader active="press" />

    <div class="p-hero">
      <div class="wrap">
        <div class="eyebrow">
          NEWSROOM
        </div>
        <h1>{{ article ? '新闻报道' : '媒体与新闻' }}</h1>
        <p>媒体眼中的科赛雷诺，以及我们想说给世界听的话。</p>
      </div>
    </div>

    <div class="wrap p-body">
      <template v-if="!article">
        <div
          v-for="a in articles"
          :key="a.slug"
          :class="['p-item', { clickable: !a.deleted, deleted: a.deleted }]"
          @click="!a.deleted && $router.push(`/inside/press/${a.slug}`)"
        >
          <div class="p-meta">
            <span class="p-source">{{ a.source }}</span>
            <span>{{ a.date }}</span>
          </div>
          <div class="p-title">{{ a.deleted ? '该内容应发布者要求删除' : a.title }}</div>
        </div>
      </template>

      <template v-else>
        <a
          class="back"
          href="#"
          @click.prevent="$router.push('/inside/press')"
        >← 返回列表</a>
        <div class="a-head">
          <div class="p-meta">
            <span class="p-source">{{ article.source }}</span>
            <span>{{ article.date }}</span>
          </div>
          <h1 class="a-title">{{ article.title }}</h1>
        </div>
        <div class="a-body">
          <p
            v-for="(para, i) in article.body"
            :key="i"
            v-html="para"
          />
        </div>
        <p class="a-reprint">本文系媒体约稿，经受访方确认后发布 · 转载请注明来源</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CeresHeader from '../components/CeresHeader.vue'

const route = useRoute()

const articles = [
  {
    slug: 'cross-interview',
    source: '财经周刊',
    date: '2023-06-12',
    title: 'Alexander Cross：快乐可以订阅',
    body: [
      '"未来的娱乐是订阅制的情绪。"科赛雷诺CEO Alexander Cross 坐在落地窗前，语速很快，"你付费，我们交付快乐。就这么简单。"',
      'Cross 上任两年，主导了公司历史上最大规模的融资。他口中的"Elysium"平台将于明年上线内测，据他描述，这将是一个"按需交付定制梦境与人格体验"的平台，"比任何流媒体都更懂你想要什么"。',
      '记者提到学界对"意识数据化"伦理边界的担忧，Cross 摆了摆手："所有新技术都被恐惧过。印刷术、电视、互联网。恐惧是旧世界的惯性。"',
      '采访最后，记者问他本人是否愿意上传自己的意识。Cross 笑了："当然。不过我的订阅费会很贵。"'
    ]
  },
  {
    slug: 'funding-report',
    source: '财经早报',
    date: '2022-08-15',
    title: '科赛雷诺完成新一轮融资 "意识健康计划"用户突破百万',
    body: [
      '科赛雷诺科技今日宣布完成新一轮融资，由多家国际投资机构联合领投。公司旗下"意识健康计划"订阅用户已突破一百万。',
      '据介绍，"意识健康计划"不仅面向公众开放，也是科赛雷诺员工福利体系的核心载体——员工的医疗保障与该计划深度绑定，实现"健康数据与企业关怀的一体化管理"。',
      '人力资源负责人在采访中表示："我们希望每一位员工都把这里当作一辈子的归宿。"据悉，该计划自推出以来，公司员工主动离职率显著低于行业平均水平。',
      '本轮融资将主要用于"Elysium"平台的研发与余晖乐园的设施升级。'
    ]
  },
  {
    slug: 'marcus-profile',
    source: '都市生活周刊',
    date: '2022-03-18',
    title: '旋转木马前的生日蛋糕——余晖乐园运营副总裁的一天',
    body: [
      '清晨六点半，Marcus Thorne 已经站在余晖乐园的正门口。作为分管园区运营与安全的副总裁，他保持着开园前两小时巡场的习惯，"开园六年，风雨无阻"。',
      '"安全是乐园的生命线。"他边走边说，"我们的巡检标准高于国标，尤其是地下机房和骑乘设备的基座部分，每天都有专人记录。"他弯下腰，用手背贴了贴旋转木马的围栏，"你听，设备状态好不好，声音是不一样的。"',
      '采访当天是3月17日。傍晚闭园后，运营部的同事们推着一只蛋糕出现在旋转木马前——这一天恰逢 Thorne 先生53岁生日。他愣了几秒，摆摆手说"搞这些干什么"，但还是接过纸盘，给在场每个人分了一块。',
      '一位员工告诉记者，副总裁"不太爱笑，但记得住每个班组长的名字"。',
      '采访结束已是晚上九点。Thorne 独自走回旋转木马，说是要"再检查一遍"。灯光下，他的影子和木马重叠在一起，像一个守着旋转城堡的国王。'
    ]
  },
  {
    slug: 'removed-piece',
    source: '棱镜观察',
    date: '2021-09-03',
    title: '',
    deleted: true
  },
  {
    slug: 'kessler-interview',
    source: '科技评论',
    date: '2020-11-05',
    title: 'Kessler博士：意识健康是下一个人权议题',
    body: [
      '11月2日傍晚，记者在科赛雷诺总部见到了 Dr. Sylvie Kessler。这一天是她58岁生日，但她没有任何庆生安排。"实验室不过生日，"她说，"数据不等任何人。"',
      '作为"情感AI辅助治疗"理念的提出者，Kessler 近年来很少公开露面。她将公司的日常管理交给了团队，自己则把几乎所有时间投入到一个她称之为"意识健康"的前沿项目。',
      '"人的痛苦大多来自记忆。"她说，"如果我们能够编辑记忆——"她停顿了一下，摇了摇头，"这是哲学问题，不是今天的主题。"',
      '记者问起家庭："您的家人支持您的工作吗？"Kessler 沉默了几秒，望向窗外园区方向的灯光，说："我的家人都在公司里。"',
      '采访结束时，她送给记者一句话，要求"原样刊登"：<i>"阳光之下，并无新事。"</i>她拒绝解释这句话的含义。'
    ]
  },
  {
    slug: 'park-opening',
    source: '城市晨报',
    date: '2018-05-21',
    title: '余晖乐园昨日开园 吉祥物"闪闪"正式亮相',
    body: [
      '经过两年的改造，原日落乐园地块昨日以"余晖乐园"之名重新开放。开园首日接待游客逾三万人次，创本市主题公园开业纪录。',
      '科赛雷诺创始人 Dr. Sylvie Kessler 出席开园仪式并简短致辞："让每一个家庭记住今天的阳光。"致辞全程不足一分钟，随后她提前离场，未参加后续的游园活动。',
      '当天最受孩子们欢迎的是乐园吉祥物"闪闪"——一个咧嘴微笑的橙色太阳。据园方介绍，吉祥物形象源自创始人家庭的一份珍贵礼物，"每一笔线条都保持原样，只是上了色"。园方未透露更多细节。',
      '有业内人士指出，一家神经科技企业重金运营主题乐园，在业内尚无先例。对此园方回应称，游乐园是"情感数据采集与公益研究的理想场景"。'
    ]
  }
]

const article = computed(() => articles.find((a) => a.slug === route.params.slug) || null)
</script>

<style scoped>
.wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 28px;
}
.p-hero {
  background: radial-gradient(
      700px 300px at 82% 0%,
      #e8f2ff 0%,
      rgba(232, 242, 255, 0) 70%
    ),
    linear-gradient(180deg, #f7fbff 0%, #ffffff 100%);
  border-bottom: 1px solid #e6eef8;
  padding: 58px 0 44px;
}
.eyebrow {
  font-size: 12px;
  letter-spacing: 2.4px;
  color: #1657c9;
  font-weight: 600;
  margin-bottom: 12px;
}
.p-hero h1 {
  font-size: 38px;
  color: #0b2a5b;
  margin: 0 0 12px;
  font-weight: 800;
}
.p-hero p {
  font-size: 14.5px;
  color: #5a6b85;
  margin: 0;
}
.p-body {
  padding-top: 8px;
  padding-bottom: 90px;
}
.back {
  color: #1657c9;
  text-decoration: none;
  font-size: 13px;
  display: inline-block;
}
.p-item {
  padding: 20px 4px;
  border-bottom: 1px solid #e6eef8;
}
.clickable {
  cursor: pointer;
  transition: background 0.18s;
}
.p-item.clickable:hover {
  background: #f7fbff;
}
.clickable:hover .p-title {
  color: #1657c9;
}
.deleted {
  opacity: 0.5;
}
.deleted .p-title {
  color: #aaa;
  font-style: italic;
}
.p-meta {
  font-size: 12px;
  color: #a9b8cd;
  display: flex;
  gap: 14px;
  margin-bottom: 7px;
}
.p-source {
  color: #1657c9;
  font-weight: 600;
}
.p-title {
  font-size: 16.5px;
  color: #24344d;
  line-height: 1.6;
}
.a-head {
  margin: 14px 0 10px;
}
.a-title {
  font-size: 27px;
  line-height: 1.45;
  color: #0b2a5b;
  margin: 8px 0 0;
}
.a-body {
  margin-top: 22px;
}
.a-body p {
  font-size: 15px;
  line-height: 2.1;
  color: #3d4b63;
  margin-bottom: 16px;
}
.a-reprint {
  margin-top: 30px;
  font-size: 12px;
  color: #a9b8cd;
  border-top: 1px solid #e6eef8;
  padding-top: 14px;
}
</style>
