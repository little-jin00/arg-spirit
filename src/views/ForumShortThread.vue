<template>
  <div class="thread">
    <header class="t-head">
      <router-link
        to="/forum"
        class="t-logo"
      >暮色论坛 · 都市怪谈讨论区</router-link>
      <span class="t-dim">游客</span>
    </header>

    <div
      v-if="post"
      class="t-body"
    >
      <router-link
        to="/forum"
        class="t-back"
      >‹ 返回帖子列表</router-link>

      <h1 class="t-title">
        <span
          class="tag"
          :class="post.tagClass"
        >{{ post.tag }}</span>
        {{ post.title }}
      </h1>

      <!-- 楼主 -->
      <div class="t-post">
        <div class="t-post-head">
          <span class="t-author">{{ post.author }}</span>
          <span class="t-floor">楼主</span>
          <span class="t-date">{{ post.last }}</span>
        </div>
        <p
          v-for="(p, i) in post.body"
          :key="i"
          class="t-text"
        >
          {{ p }}
        </p>
      </div>

      <!-- 回复 -->
      <div
        v-for="(r, i) in post.replies"
        :key="i"
        class="t-post t-reply"
      >
        <div class="t-post-head">
          <span class="t-author">{{ r.author }}</span>
          <span class="t-floor">{{ i + 2 }}楼</span>
          <span class="t-date">{{ r.date }}</span>
        </div>
        <p class="t-text">{{ r.text }}</p>
      </div>

      <div class="t-archive-note">
        本帖共 {{ post.replies_total }} 条回复 · 归档数据不完整，部分回复已丢失
      </div>

      <div class="t-locked">本帖已锁定，无法回复（论坛已停止运营）</div>
    </div>

    <div
      v-else
      class="t-body"
    >
      <p>帖子不存在或已被删除。</p>
      <router-link to="/forum">返回列表</router-link>
    </div>

    <footer class="t-foot">本论坛已于 2019-08-11 停止运营 · 数据只读归档</footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const POSTS = {
  'shutdown': {
    tag: '公告', tagClass: 'tag-notice',
    title: '本论坛即将停止运营，感谢各位八年陪伴',
    author: '管理员', last: '2019-08-11', replies_total: 12,
    body: [
      '因服务器成本及运营原因，暮色论坛将于2019年8月11日24:00正式停止运营，届时全站转为只读归档。',
      '八年了，感谢每一位讲怪谈的人。愿大家半夜听到弹珠声时，都能想起这里。'
    ],
    replies: [
      { author: '旧客', date: '2019-08-11', text: '八年老用户报道。天下没有不散的筵席，祝好。' },
      { author: '考据癖', date: '2019-08-11', text: '数据会保留多久？我考据帖里的资料还没来得及备份。' }
    ]
  },
  'sunset-park-close': {
    tag: '讨论',
    title: '日落乐园当年为什么关门？有人知道内幕吗',
    author: '旧客', last: '2019-08-11', replies_total: 47,
    body: [
      '就是现在余晖乐园的前身。小时候去过一次，记得挺好的，怎么说关就关了？'
    ],
    replies: [
      { author: '城南旧事', date: '2019-08-11', text: '经营不善吧，那几年实体乐园倒了一大批。' },
      { author: '考据癖', date: '2019-08-11', text: '听说原老板欠了一屁股债跑路了，地块低价转手。接手方算是捡了个大便宜。' }
    ]
  },
  'marble-sound': {
    tag: '怪谈',
    title: '半夜听到楼上传来弹珠声，科学解释是什么',
    author: '夜半钟声', last: '2019-07-30', replies_total: 23,
    body: [
      '连续一个月了，每晚十一点左右，楼上就有弹珠掉地上的声音，哒、哒哒……可我家楼上根本没人住，空置两年了。'
    ],
    replies: [
      { author: '物理课代表', date: '2019-07-30', text: '钢筋热胀冷缩，老楼常见现象，别怕。' },
      { author: '夜半钟声', date: '2019-07-31', text: '谢谢楼上解释。但为什么是每晚十一点整？误差不超过五分钟。' }
    ]
  },
  'found-tapes': {
    tag: '求助',
    title: '租房里发现前租客留的一箱磁带，能听吗',
    author: '搬家中', last: '2019-07-22', replies_total: 9,
    body: [
      '搬新家，衣柜顶上放着一箱老式磁带，没有任何标签。房东说前租客失联了，东西随便处理。我能听吗？会不会有什么说法？'
    ],
    replies: [
      { author: '平安是福', date: '2019-07-22', text: '别听。不是迷信，是别人的隐私。交给房东或者扔了。' }
    ]
  },
  'recurring-dream': {
    tag: '怪谈',
    title: '你们有没有做过重复的梦？连续一周同一个场景',
    author: '梦游中', last: '2019-07-15', replies_total: 31,
    body: [
      '连续七天，同一个梦：一个白色的房间，房间里坐着一个人，看不清脸，一直在哭。我进不去，只能隔着墙听。'
    ],
    replies: [
      { author: '庄周', date: '2019-07-15', text: '压力大的时候会这样。换个枕头试试。' },
      { author: '平安是福', date: '2019-07-16', text: '最近是不是睡眠不好？睡前别看手机了。' }
    ]
  },
  'missing-cousin': {
    tag: '求助',
    title: '寻人：表哥说去邻市出差，失联快三个月了',
    author: '风往北吹', last: '2019-07-08', replies_total: 14,
    body: [
      '表哥4月说去邻市谈个项目，之后就再也联系不上了。他一个人住，离了婚，家里也没什么走得近的亲戚。报警了，说成年人失联不构成案件，让我们自己找找。',
      '他最后一条朋友圈定位在客运南站。照片我放在三楼了，有没有人见过他？'
    ],
    replies: [
      { author: '平安是福', date: '2019-07-08', text: '客运南站那边监控盲区多，去问问客运站的调度员，他们对常客有印象。' },
      { author: '匿名', date: '2019-07-09', text: '我表哥前年也失联过半年，后来自己回来了，说是出去散心了。人回来就好……就是回来之后，总觉得他哪里不太一样了。' }
    ]
  },
  'konbini-oden': {
    tag: '闲聊',
    title: '凌晨三点便利店的关东煮，为什么总是刚煮的',
    author: '夜班出租车司机', last: '2019-06-28', replies_total: 15,
    body: [
      '跑夜班五年了，不管几点去，那家店的关东煮永远热气腾腾，永远刚煮好。店员小哥永远笑眯眯的。他们到底几点换汤？'
    ],
    replies: [
      { author: '一个人住', date: '2019-06-28', text: '你观察到的是幸存者偏差，凌晨还去买关东煮的人，本来就只有你们这种夜班司机。' }
    ]
  },
  'lost-cartoon': {
    tag: '求助',
    title: '小时候电视上那个动画片，怎么全网都搜不到了',
    author: '旧时光', last: '2019-06-19', replies_total: 27,
    body: [
      '大概2000年前后，少儿频道播过一个动画片，主角是个太阳，每天笑嘻嘻的，每集结尾它都会对镜头挥手。我记得很清楚，但问谁都说没印象，网上也搜不到任何信息。是我记错了吗？'
    ],
    replies: [
      { author: '庄周', date: '2019-06-19', text: '曼德拉效应经典案例。你记的可能是某个广告。' },
      { author: '旧时光', date: '2019-06-20', text: '不是广告。我连主题曲都会哼。算了，也许真的是我记错了。' }
    ]
  },
  'carousel-music': {
    tag: '游记',
    title: '带娃去了余晖乐园，旋转木马的音乐有点瘆人',
    author: '糖果妈妈', last: '2019-06-02', replies_total: 33,
    body: [
      '整体挺好的，就是旋转木马的八音盒音乐，调子特别慢，慢到有点忧伤。娃倒是玩得很开心，可能大人想多了。'
    ],
    replies: [
      { author: '奶爸日记', date: '2019-06-02', text: '那台八音盒是瑞士老机芯，音色本来就这样。' },
      { author: '夜行者', date: '2019-06-03', text: '我家孩子坐了三遍不肯下来，羡慕楼主娃的体力。' },
      { author: '糖果妈妈', date: '2019-06-03', text: '哈哈，可能真是我想多了。' }
    ]
  },
  'delivery-guy': {
    tag: '怪谈',
    title: '深夜外卖员说我家楼道里站着人，可我家没人',
    author: '一个人住', last: '2019-05-30', replies_total: 41,
    body: [
      '昨晚十一点多点了宵夜，外卖员送到后给我打电话，声音发抖，说"姐，你家门口站着个人，我放门口了啊"。我开门，只有外卖，没人。监控里，楼道也从来没人。'
    ],
    replies: [
      { author: '平安是福', date: '2019-05-30', text: '先别慌，查一下是不是外卖员看错了，比如楼道里的旧衣架。' },
      { author: '一个人住', date: '2019-05-31', text: '查了。楼道里什么都没有。问题是，这已经是这个月第二个外卖员这么说了。' }
    ]
  },
  'park-staff': {
    tag: '闲聊',
    title: '有人注意到乐园员工都不怎么笑吗',
    author: '夜行者', last: '2019-05-17', replies_total: 21,
    body: [
      '上周末去余晖乐园，发现一个细节：所有员工的标准笑容都只持续三秒，转头就没了。连卖气球的都是。是培训太严格了吗？'
    ],
    replies: [
      { author: '打工魂', date: '2019-05-17', text: '服务行业，笑一天脸会僵的，理解一下。' },
      { author: '糖果妈妈', date: '2019-05-18', text: '是不是快闭园的时候去的？换班前都累了。' }
    ]
  },
  'mandela-effect': {
    tag: '讨论',
    title: '大家有没有记忆和现实对不上的经历',
    author: '庄周', last: '2019-05-12', replies_total: 56,
    body: [
      '我清楚地记得小学课本里那首诗是"大漠孤烟直，长河落日圆"，但昨天翻到孩子的课本，注释里说版本不同。我的记忆出错了吗？你们有类似经历吗？'
    ],
    replies: [
      { author: '考据癖', date: '2019-05-12', text: '记忆不是录像，是每次回忆时重新拼装的。拼错很正常。' },
      { author: '梦游中', date: '2019-05-13', text: '那如果……不是记错了，而是有人改了呢？' }
    ]
  },
  'cat-corner': {
    tag: '闲聊',
    title: '猫为什么总盯着墙角看',
    author: '有猫人士', last: '2019-04-26', replies_total: 38,
    body: [
      '我家猫最近总盯着卧室墙角看，一看就是半小时，喊都喊不动。墙角什么都没有，墙也敲过了，是空的……等等，空的是不是更不对？'
    ],
    replies: [
      { author: '物理课代表', date: '2019-04-26', text: '空鼓而已，找个师傅补补。猫能听到墙里面水管的声音。' }
    ]
  },
  'subway-cry': {
    tag: '树洞',
    title: '连续加班一个月，今天在地铁上哭了',
    author: '匿名', last: '2019-04-18', replies_total: 64,
    body: [
      '没有什么大事，就是项目连续上线，一个月没休。今天地铁上看到一个小孩举着乐园的气球，突然就绷不住了。我小时候也去过乐园的。'
    ],
    replies: [
      { author: '平安是福', date: '2019-04-18', text: '抱抱楼主。撑不住就歇一歇，工作没了可以再找。' },
      { author: '匿名', date: '2019-04-18', text: '谢谢大家。哭完好多了，明天继续。' }
    ]
  },
  'missing-mom': {
    tag: '求助',
    title: '寻人：妈妈去余晖乐园后失联了，求7月19日当天的游客',
    author: '等妈妈回家', last: '2019-08-02', replies_total: 9,
    body: [
      '妈妈今年35岁，7月19日（周五）一个人去了余晖乐园，晚上没有回家，手机一直关机到现在。',
      '报警了。警方调了园区的闸机记录和监控，说入园记录里有她，出园记录里没有，但闭园清点也没有滞留人员。结论是"成年人可能自行离开，不愿联系家人"，不予立案。',
      '妈妈绝不可能自己走掉。她最怕黑，天黑了从不在外面待。那天她出门，是去给我买生日蛋糕的。我生日是7月20日。',
      '我是在这个论坛看到有人说乐园员工不对劲、旋转木马的音乐不对劲，才想到来问的。有没有7月19日去过余晖乐园的人？见过一个米色连衣裙、短头发的阿姨吗？'
    ],
    replies: [
      { author: '平安是福', date: '2019-08-02', text: '抱抱楼主妹妹。不予立案可以申请复议，找法律援助，别放弃。' },
      { author: '考据癖', date: '2019-08-03', text: '"入园有记录、出园无记录、清点无滞留"——这三个放在一起，只有一种解释：记录被人动过。闸机数据在园方手里，警方看到的只是园方给的复印件。' },
      { author: '等妈妈回家', date: '2019-08-10', text: '谢谢楼上的哥哥姐姐。明天这里就要关了。妈妈，如果你哪天能看到这些，我还在找你。蛋糕我每年都会买一个，等你回来一起吃。' }
    ]
  },
  'old-house': {
    tag: '树洞',
    title: '老房子拆掉的最后一天，我回去看了一眼',
    author: '城南旧事', last: '2019-03-22', replies_total: 18,
    body: [
      '住了二十年的老房子，明天就要拆了。今天回去，在空荡荡的房间里站了很久。墙上的身高刻痕还在，阳台的绿萝早就枯了。',
      '走的时候锁了门。钥匙明天就作废了，但我还是锁了。好像这样，家就还在。'
    ],
    replies: [
      { author: '夜读者', date: '2019-03-22', text: '看哭了。我外婆家拆的时候我没敢回去。' }
    ]
  },
  'park-salary': {
    tag: '求证',
    title: '余晖乐园招聘启事里的薪资是真的假的',
    author: '打工魂', last: '2019-03-04', replies_total: 8,
    body: [
      '看到他们招设施维护，开出的薪资是行业均价快三倍。乐园运营哪来这么高的利润？有没有去过的说说，是画饼吗？'
    ],
    replies: [
      { author: '平安是福', date: '2019-03-05', text: '大公司烧钱抢人吧，新开的乐园都缺人。' },
      { author: '匿名', date: '2019-03-05', text: '去过面试。薪资是真的，但签之前要过一轮背景审查，保密协议厚得像本书，离职条款写得特别重。我没敢签。' },
      { author: '打工魂', date: '2019-03-05', text: '保密协议？一个游乐园保什么密……' }
    ]
  },
  'mom-call': {
    tag: '怪谈',
    title: '凌晨接到妈妈的电话，可妈妈三年前就去世了',
    author: '不想长大', last: '2019-02-14', replies_total: 52,
    body: [
      '凌晨两点，手机响了，来电显示是"妈妈"。那个号码我一直没删，也没停机。我没敢接。响了七声，停了。再打过去，是空号。',
      '也许是串线吧。可我真的好想她。'
    ],
    replies: [
      { author: '平安是福', date: '2019-02-14', text: '抱抱。号码回收再放出，串线很常见的。妈妈会一直保佑你。' },
      { author: '不想长大', date: '2019-02-15', text: '谢谢。其实接电话之前我犹豫的那七秒，想的是——万一真是她呢。' }
    ]
  },
  'live-alone': {
    tag: '讨论',
    title: '独居的女孩子一定要看这个（经验分享）',
    author: '平安是福', last: '2019-01-30', replies_total: 73,
    body: [
      '整理了几条：1.门口放一双男士拖鞋；2.外卖写"先生收"；3.快递单撕碎再扔；4.阳台挂一件男式衬衫；5.手机设置一键报警。',
      '希望永远用不上，但必须有。'
    ],
    replies: [
      { author: '一个人住', date: '2019-01-30', text: '收藏了。补充一条：独居尽量别在深夜发"一个人在家"的朋友圈。' },
      { author: '匿名', date: '2019-01-31', text: '看完有点难过，我们为什么要活得这么小心。' }
    ]
  },
  'elevator-mirror': {
    tag: '怪谈',
    title: '电梯里的镜子，总觉得照出来的不是自己',
    author: '镜子里的我', last: '2018-12-15', replies_total: 19,
    body: [
      '我们写字楼的电梯里有一面镜子。每次加班到很晚，一个人坐电梯的时候，我都觉得镜子里的那个人反应比我慢半拍。'
    ],
    replies: [
      { author: '物理课代表', date: '2018-12-15', text: '灯光频闪加视觉暂留，别自己吓自己。' },
      { author: '镜子里的我', date: '2018-12-16', text: '但愿吧。我现在加班都走楼梯了。' }
    ]
  },
  'mascot-nightmare': {
    tag: '讨论',
    title: '余晖乐园那个太阳吉祥物，我家小孩看了做噩梦',
    author: '奶爸日记', last: '2018-12-03', replies_total: 6,
    body: [
      '周末带娃去了新开的余晖乐园，回来连续两晚做噩梦，说"太阳公公在看我"。一个卡通太阳而已，有那么吓人吗？'
    ],
    replies: [
      { author: '糖果妈妈', date: '2018-12-04', text: '小孩想象力丰富，过两天就好了。' },
      { author: '奶爸日记', date: '2018-12-05', text: '问了孩子怕什么，他说："它一直在笑，可是它从来不眨眼睛。"小孩的话，哈哈。' }
    ]
  },
  'red-raincoat': {
    tag: '考据',
    title: '本市到底有没有发生过"红雨衣"事件',
    author: '考据癖', last: '2018-11-02', replies_total: 44,
    body: [
      '考据了一周：所谓2003年"红雨衣"事件，本市所有报纸数据库均无记录，最早来源是2011年一篇博客，而那篇博客引用的"目击者采访"链接已失效。结论：大概率是编造。',
      '但有个疑点：为什么2011年之后，每年都有人在同一时间"回忆"起这件事？'
    ],
    replies: [
      { author: '庄周', date: '2018-11-02', text: '集体记忆是可以被植入的。你考据得越细，信的人越多。' }
    ]
  },
  'elevator-button': {
    tag: '求助',
    title: '新搬的小区，电梯按钮总有一层按不亮',
    author: '新住户', last: '2018-09-27', replies_total: 11,
    body: [
      '电梯里有个B2层的按钮，怎么按都不亮。物业说地下车库只有B1。那B2那个按钮是干什么用的？'
    ],
    replies: [
      { author: '物理课代表', date: '2018-09-27', text: '预留按钮，很多电梯都有，装修没启用而已。' },
      { author: '新住户', date: '2018-09-28', text: '可是昨晚电梯自己在B2停了一次。门开了，外面是黑的。我没敢看。' }
    ]
  },
  'bookstore-24h': {
    tag: '闲聊',
    title: '有人记得城南那家24小时书店吗',
    author: '夜读者', last: '2018-08-14', replies_total: 26,
    body: [
      '大学时常去，凌晨的座位上总有几个 fixed 的面孔。去年路过，已经变成奶茶店了。那些凌晨读书的人，现在都去哪儿了呢？'
    ],
    replies: [
      { author: '城南旧事', date: '2018-08-14', text: '我也去过。那个总在角落看报纸的老爷爷，有一次抬头冲我笑了一下，我现在还记得。' }
    ]
  }
}

const post = computed(() => POSTS[route.params.slug])
</script>

<style scoped>
.thread {
  max-width: 860px;
  margin: 0 auto;
  padding: 20px 16px 60px;
  font-family: "SimSun", "Songti SC", serif;
}
.t-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--border);
  padding-bottom: 10px;
}
.t-logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--accent);
  text-decoration: none;
}
.t-dim {
  font-size: 13px;
  color: #888;
}

.t-body {
  margin-top: 16px;
}
.t-back {
  font-size: 13px;
  color: #888;
  text-decoration: none;
}
.t-back:hover {
  color: var(--accent);
}

.t-title {
  margin-top: 12px;
  font-size: 19px;
  color: #4a3f35;
  font-weight: bold;
  line-height: 1.5;
}
.tag {
  display: inline-block;
  font-size: 11px;
  vertical-align: 2px;
  background: #9a8f7a;
  color: #fff;
  padding: 1px 6px;
  border-radius: 2px;
  margin-right: 6px;
}
.tag-notice {
  background: #8a2be2;
}

.t-post {
  margin-top: 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 14px 16px;
}
.t-post-head {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px dashed var(--border);
  padding-bottom: 8px;
  margin-bottom: 10px;
  font-size: 12px;
}
.t-author {
  color: var(--accent);
  font-weight: bold;
}
.t-floor {
  color: #aaa;
}
.t-date {
  color: #aaa;
  margin-left: auto;
  font-family: Consolas, monospace;
}
.t-text {
  font-size: 14px;
  color: #4a3f35;
  line-height: 1.9;
  margin-bottom: 8px;
}
.t-reply {
  background: #faf8ef;
}

.t-archive-note {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: #b0a48e;
  font-style: italic;
}
.t-locked {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: #999;
  background: #f2eee2;
  border: 1px solid var(--border);
  padding: 8px;
}
.t-foot {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #999;
}
</style>
