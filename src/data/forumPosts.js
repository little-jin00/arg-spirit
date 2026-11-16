// 暮色论坛归档数据：列表、详情、搜索共用一份数据源
// 说明：论坛自 2019-08-11 起只读归档；除 E-09 的 2024 新帖外，其余帖子均不晚于停运日。

export const POSTS = [
  // ---------- 原始 24 帖 ----------
  {
    slug: 'shutdown',
    tag: '公告',
    tagClass: 'tag-notice',
    title: '本论坛即将停止运营，感谢各位八年陪伴',
    author: '管理员',
    date: '2019-08-11',
    repliesTotal: 12,
    body: [
      '因服务器成本及运营原因，暮色论坛将于2019年8月11日24:00正式停止运营，届时全站转为只读归档。',
      '八年了，感谢每一位讲怪谈的人。愿大家半夜听到弹珠声时，都能想起这里。'
    ],
    replies: [
      { author: '旧客', date: '2019-08-11', text: '八年老用户报道。天下没有不散的筵席，祝好。' },
      { author: '考据癖', date: '2019-08-11', text: '数据会保留多久？我考据帖里的资料还没来得及备份。' }
    ],
    keywords: ['停运', '关站', '归档', '管理员'],
    serves: 'background',
    line: 'forum'
  },
  {
    slug: 'sunset-park-close',
    tag: '讨论',
    title: '日落乐园当年为什么关门？有人知道内幕吗',
    author: '旧客',
    date: '2019-08-11',
    repliesTotal: 47,
    body: [
      '就是现在余晖乐园的前身。小时候去过一次，记得挺好的，怎么说关就关了？'
    ],
    replies: [
      { author: '城南旧事', date: '2019-08-11', text: '经营不善吧，那几年实体乐园倒了一大批。' },
      { author: '考据癖', date: '2019-08-11', text: '听说原老板欠了一屁股债跑路了，地块低价转手。接手方算是捡了个大便宜。' }
    ],
    keywords: ['日落乐园', '余晖乐园', '前身', '关门', '内幕'],
    serves: 'background',
    line: 'park'
  },
  {
    slug: 'marble-sound',
    tag: '怪谈',
    title: '半夜听到楼上传来弹珠声，科学解释是什么',
    author: '夜半钟声',
    date: '2019-07-30',
    repliesTotal: 23,
    body: [
      '连续一个月了，每晚十一点左右，楼上就有弹珠掉地上的声音，哒、哒哒……可我家楼上根本没人住，空置两年了。'
    ],
    replies: [
      { author: '物理课代表', date: '2019-07-30', text: '钢筋热胀冷缩，老楼常见现象，别怕。' },
      { author: '夜半钟声', date: '2019-07-31', text: '谢谢楼上解释。但为什么是每晚十一点整？误差不超过五分钟。' }
    ],
    keywords: ['弹珠', '楼上', '怪声'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'found-tapes',
    tag: '求助',
    title: '租房里发现前租客留的一箱磁带，能听吗',
    author: '搬家中',
    date: '2019-07-22',
    repliesTotal: 9,
    body: [
      '搬新家，衣柜顶上放着一箱老式磁带，没有任何标签。房东说前租客失联了，东西随便处理。我能听吗？会不会有什么说法？'
    ],
    replies: [
      { author: '平安是福', date: '2019-07-22', text: '别听。不是迷信，是别人的隐私。交给房东或者扔了。' }
    ],
    keywords: ['磁带', '租房', '前租客'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'recurring-dream',
    tag: '怪谈',
    title: '你们有没有做过重复的梦？连续一周同一个场景',
    author: '梦游中',
    date: '2019-07-15',
    repliesTotal: 31,
    body: [
      '连续七天，同一个梦：一个白色的房间，房间里坐着一个人，看不清脸，一直在哭。我进不去，只能隔着墙听。'
    ],
    replies: [
      { author: '庄周', date: '2019-07-15', text: '压力大的时候会这样。换个枕头试试。' },
      { author: '平安是福', date: '2019-07-16', text: '最近是不是睡眠不好？睡前别看手机了。' }
    ],
    keywords: ['重复的梦', '白房间', '哭声'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'missing-cousin',
    tag: '求助',
    title: '寻人：表哥说去邻市出差，失联快三个月了',
    author: '风往北吹',
    date: '2019-07-08',
    repliesTotal: 14,
    body: [
      '表哥4月说去邻市谈个项目，之后就再也联系不上了。他一个人住，离了婚，家里也没什么走得近的亲戚。报警了，说成年人失联不构成案件，让我们自己找找。',
      '他最后一条朋友圈定位在客运南站。照片我放在三楼了，有没有人见过他？'
    ],
    replies: [
      { author: '平安是福', date: '2019-07-08', text: '客运南站那边监控盲区多，去问问客运站的调度员，他们对常客有印象。' },
      { author: '匿名', date: '2019-07-09', text: '我表哥前年也失联过半年，后来自己回来了，说是出去散心了。人回来就好……就是回来之后，总觉得他哪里不太一样了。' }
    ],
    keywords: ['寻人', '失联', '表哥', '客运南站'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'konbini-oden',
    tag: '闲聊',
    title: '凌晨三点便利店的关东煮，为什么总是刚煮的',
    author: '夜班出租车司机',
    date: '2019-06-28',
    repliesTotal: 15,
    body: [
      '跑夜班五年了，不管几点去，那家店的关东煮永远热气腾腾，永远刚煮好。店员小哥永远笑眯眯的。他们到底几点换汤？'
    ],
    replies: [
      { author: '一个人住', date: '2019-06-28', text: '你观察到的是幸存者偏差，凌晨还去买关东煮的人，本来就只有你们这种夜班司机。' }
    ],
    keywords: ['便利店', '关东煮', '夜班'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'lost-cartoon',
    tag: '求助',
    title: '小时候电视上那个动画片，怎么全网都搜不到了',
    author: '旧时光',
    date: '2019-06-19',
    repliesTotal: 27,
    body: [
      '大概2000年前后，少儿频道播过一个动画片，主角是个太阳，每天笑嘻嘻的，每集结尾它都会对镜头挥手。我记得很清楚，但问谁都说没印象，网上也搜不到任何信息。是我记错了吗？'
    ],
    replies: [
      { author: '庄周', date: '2019-06-19', text: '曼德拉效应经典案例。你记的可能是某个广告。' },
      { author: '旧时光', date: '2019-06-20', text: '不是广告。我连主题曲都会哼。算了，也许真的是我记错了。' }
    ],
    keywords: ['动画片', '太阳', '吉祥物', '曼德拉'],
    serves: 'noise',
    line: 'park'
  },
  {
    slug: 'carousel-music',
    tag: '游记',
    title: '带娃去了余晖乐园，旋转木马的音乐有点瘆人',
    author: '糖果妈妈',
    date: '2019-06-02',
    repliesTotal: 33,
    body: [
      '整体挺好的，就是旋转木马的八音盒音乐，调子特别慢，慢到有点忧伤。娃倒是玩得很开心，可能大人想多了。'
    ],
    replies: [
      { author: '奶爸日记', date: '2019-06-02', text: '那台八音盒是瑞士老机芯，音色本来就这样。' },
      { author: '夜行者', date: '2019-06-03', text: '我家孩子坐了三遍不肯下来，羡慕楼主娃的体力。' },
      { author: '糖果妈妈', date: '2019-06-03', text: '哈哈，可能真是我想多了。' }
    ],
    keywords: ['旋转木马', '八音盒', '音乐', '余晖乐园'],
    serves: 'plot',
    line: 'park'
  },
  {
    slug: 'delivery-guy',
    tag: '怪谈',
    title: '深夜外卖员说我家楼道里站着人，可我家没人',
    author: '一个人住',
    date: '2019-05-30',
    repliesTotal: 41,
    body: [
      '昨晚十一点多点了宵夜，外卖员送到后给我打电话，声音发抖，说"姐，你家门口站着个人，我放门口了啊"。我开门，只有外卖，没人。监控里，楼道也从来没人。'
    ],
    replies: [
      { author: '平安是福', date: '2019-05-30', text: '先别慌，查一下是不是外卖员看错了，比如楼道里的旧衣架。' },
      { author: '一个人住', date: '2019-05-31', text: '查了。楼道里什么都没有。问题是，这已经是这个月第二个外卖员这么说了。' }
    ],
    keywords: ['外卖', '楼道', '监控'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'park-staff',
    tag: '闲聊',
    title: '有人注意到乐园员工都不怎么笑吗',
    author: '夜行者',
    date: '2019-05-17',
    repliesTotal: 21,
    body: [
      '上周末去余晖乐园，发现一个细节：所有员工的标准笑容都只持续三秒，转头就没了。连卖气球的都是。是培训太严格了吗？'
    ],
    replies: [
      { author: '打工魂', date: '2019-05-17', text: '服务行业，笑一天脸会僵的，理解一下。' },
      { author: '糖果妈妈', date: '2019-05-18', text: '是不是快闭园的时候去的？换班前都累了。' }
    ],
    keywords: ['员工', '微笑', '培训', '余晖乐园'],
    serves: 'plot',
    line: 'park'
  },
  {
    slug: 'mandela-effect',
    tag: '讨论',
    title: '大家有没有记忆和现实对不上的经历',
    author: '庄周',
    date: '2019-05-12',
    repliesTotal: 56,
    body: [
      '我清楚地记得小学课本里那首诗是"大漠孤烟直，长河落日圆"，但昨天翻到孩子的课本，注释里说版本不同。我的记忆出错了吗？你们有类似经历吗？'
    ],
    replies: [
      { author: '考据癖', date: '2019-05-12', text: '记忆不是录像，是每次回忆时重新拼装的。拼错很正常。' },
      { author: '梦游中', date: '2019-05-13', text: '那如果……不是记错了，而是有人改了呢？' }
    ],
    keywords: ['记忆', '曼德拉', '课本'],
    serves: 'background',
    line: 'forum'
  },
  {
    slug: 'cat-corner',
    tag: '闲聊',
    title: '猫为什么总盯着墙角看',
    author: '有猫人士',
    date: '2019-04-26',
    repliesTotal: 38,
    body: [
      '我家猫最近总盯着卧室墙角看，一看就是半小时，喊都喊不动。墙角什么都没有，墙也敲过了，是空的……等等，空的是不是更不对？'
    ],
    replies: [
      { author: '物理课代表', date: '2019-04-26', text: '空鼓而已，找个师傅补补。猫能听到墙里面水管的声音。' }
    ],
    keywords: ['猫', '墙角'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'subway-cry',
    tag: '树洞',
    title: '连续加班一个月，今天在地铁上哭了',
    author: '匿名',
    date: '2019-04-18',
    repliesTotal: 64,
    body: [
      '没有什么大事，就是项目连续上线，一个月没休。今天地铁上看到一个小孩举着乐园的气球，突然就绷不住了。我小时候也去过乐园的。'
    ],
    replies: [
      { author: '平安是福', date: '2019-04-18', text: '抱抱楼主。撑不住就歇一歇，工作没了可以再找。' },
      { author: '匿名', date: '2019-04-18', text: '谢谢大家。哭完好多了，明天继续。' }
    ],
    keywords: ['加班', '地铁', '树洞'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'missing-mom',
    tag: '求助',
    title: '寻人：妈妈去余晖乐园后失联了，求7月19日当天的游客',
    author: '等妈妈回家',
    date: '2019-08-02',
    repliesTotal: 9,
    body: [
      '妈妈今年35岁，7月19日（周五）带我一起去了余晖乐园。她让我在入口里面的长椅上等，说去买个东西，十分钟就回来。她没有回来。天黑以后，是园区的一个保安把我送回家的。',
      '报警了。警方调了园区的闸机记录和监控，说入园记录里有她，出园记录里没有，但闭园清点也没有滞留人员。结论是"成年人可能自行离开，不愿联系家人"，不予立案。',
      '妈妈绝不可能自己走掉。她最怕黑，天黑了从不在外面待。那天她出门，是去给我买生日蛋糕的。我生日是7月20日。',
      '我今年11岁，记录上写我6岁。我不知道他们为什么要写错。有没有7月19日去过余晖乐园的人？见过一个米色连衣裙、短头发的阿姨吗？'
    ],
    replies: [
      { author: '平安是福', date: '2019-08-02', text: '抱抱楼主妹妹。不予立案可以申请复议，找法律援助，别放弃。' },
      { author: '考据癖', date: '2019-08-03', text: '"入园有记录、出园无记录、清点无滞留"——这三个放在一起，只有一种解释：记录被人动过。还有，她说自己11岁，记录写6岁。谁会在这种表上写错年龄？' },
      { author: '等妈妈回家', date: '2019-08-10', text: '谢谢楼上的哥哥姐姐。明天这里就要关了。妈妈，如果你哪天能看到这些，我还在找你。蛋糕我每年都会买一个，等你回来一起吃。' }
    ],
    keywords: ['寻人', '妈妈', '7月19', '0719', '失踪', '失联', '蛋糕', '米色连衣裙'],
    serves: 'plot',
    line: 'marta'
  },
  {
    slug: 'old-house',
    tag: '树洞',
    title: '老房子拆掉的最后一天，我回去看了一眼',
    author: '城南旧事',
    date: '2019-03-22',
    repliesTotal: 18,
    body: [
      '住了二十年的老房子，明天就要拆了。今天回去，在空荡荡的房间里站了很久。墙上的身高刻痕还在，阳台的绿萝早就枯了。',
      '走的时候锁了门。钥匙明天就作废了，但我还是锁了。好像这样，家就还在。'
    ],
    replies: [
      { author: '夜读者', date: '2019-03-22', text: '看哭了。我外婆家拆的时候我没敢回去。' }
    ],
    keywords: ['老房子', '拆迁'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'park-salary',
    tag: '求证',
    title: '余晖乐园招聘启事里的薪资是真的假的',
    author: '打工魂',
    date: '2019-03-04',
    repliesTotal: 8,
    body: [
      '看到他们招设施维护，开出的薪资是行业均价快三倍。乐园运营哪来这么高的利润？有没有去过的说说，是画饼吗？'
    ],
    replies: [
      { author: '平安是福', date: '2019-03-05', text: '大公司烧钱抢人吧，新开的乐园都缺人。' },
      { author: '匿名', date: '2019-03-05', text: '去过面试。薪资是真的，但签之前要过一轮背景审查，保密协议厚得像本书，离职条款写得特别重。我没敢签。' },
      { author: '打工魂', date: '2019-03-05', text: '保密协议？一个游乐园保什么密……' }
    ],
    keywords: ['招聘', '薪资', '保密协议', '背景审查', '余晖乐园'],
    serves: 'plot',
    line: 'park'
  },
  {
    slug: 'mom-call',
    tag: '怪谈',
    title: '凌晨接到妈妈的电话，可妈妈三年前就去世了',
    author: '不想长大',
    date: '2019-02-14',
    repliesTotal: 52,
    body: [
      '凌晨两点，手机响了，来电显示是"妈妈"。那个号码我一直没删，也没停机。我没敢接。响了七声，停了。再打过去，是空号。',
      '也许是串线吧。可我真的好想她。'
    ],
    replies: [
      { author: '平安是福', date: '2019-02-14', text: '抱抱。号码回收再放出，串线很常见的。妈妈会一直保佑你。' },
      { author: '不想长大', date: '2019-02-15', text: '谢谢。其实接电话之前我犹豫的那七秒，想的是——万一真是她呢。' }
    ],
    keywords: ['妈妈', '电话', '空号'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'live-alone',
    tag: '讨论',
    title: '独居的女孩子一定要看这个（经验分享）',
    author: '平安是福',
    date: '2019-01-30',
    repliesTotal: 73,
    body: [
      '整理了几条：1.门口放一双男士拖鞋；2.外卖写"先生收"；3.快递单撕碎再扔；4.阳台挂一件男式衬衫；5.手机设置一键报警。',
      '希望永远用不上，但必须有。'
    ],
    replies: [
      { author: '一个人住', date: '2019-01-30', text: '收藏了。补充一条：独居尽量别在深夜发"一个人在家"的朋友圈。' },
      { author: '匿名', date: '2019-01-31', text: '看完有点难过，我们为什么要活得这么小心。' }
    ],
    keywords: ['独居', '安全'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'elevator-mirror',
    tag: '怪谈',
    title: '电梯里的镜子，总觉得照出来的不是自己',
    author: '镜子里的我',
    date: '2018-12-15',
    repliesTotal: 19,
    body: [
      '我们写字楼的电梯里有一面镜子。每次加班到很晚，一个人坐电梯的时候，我都觉得镜子里的那个人反应比我慢半拍。'
    ],
    replies: [
      { author: '物理课代表', date: '2018-12-15', text: '灯光频闪加视觉暂留，别自己吓自己。' },
      { author: '镜子里的我', date: '2018-12-16', text: '但愿吧。我现在加班都走楼梯了。' }
    ],
    keywords: ['电梯', '镜子'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'mascot-nightmare',
    tag: '讨论',
    title: '余晖乐园那个太阳吉祥物，我家小孩看了做噩梦',
    author: '奶爸日记',
    date: '2018-12-03',
    repliesTotal: 6,
    body: [
      '周末带娃去了新开的余晖乐园，回来连续两晚做噩梦，说"太阳公公在看我"。一个卡通太阳而已，有那么吓人吗？'
    ],
    replies: [
      { author: '糖果妈妈', date: '2018-12-04', text: '小孩想象力丰富，过两天就好了。' },
      { author: '奶爸日记', date: '2018-12-05', text: '问了孩子怕什么，他说："它一直在笑，可是它从来不眨眼睛。"小孩的话，哈哈。' }
    ],
    keywords: ['吉祥物', '太阳', '噩梦', '眼睛', '余晖乐园'],
    serves: 'background',
    line: 'park'
  },
  {
    slug: 'red-raincoat',
    tag: '考据',
    title: '本市到底有没有发生过"红雨衣"事件',
    author: '考据癖',
    date: '2018-11-02',
    repliesTotal: 44,
    body: [
      '考据了一周：所谓2003年"红雨衣"事件，本市所有报纸数据库均无记录，最早来源是2011年一篇博客，而那篇博客引用的"目击者采访"链接已失效。结论：大概率是编造。',
      '但有个疑点：为什么2011年之后，每年都有人在同一时间"回忆"起这件事？'
    ],
    replies: [
      { author: '庄周', date: '2018-11-02', text: '集体记忆是可以被植入的。你考据得越细，信的人越多。' }
    ],
    keywords: ['红雨衣', '考据', '2003'],
    serves: 'background',
    line: 'forum'
  },
  {
    slug: 'elevator-button',
    tag: '求助',
    title: '新搬的小区，电梯按钮总有一层按不亮',
    author: '新住户',
    date: '2018-09-27',
    repliesTotal: 11,
    body: [
      '电梯里有个B2层的按钮，怎么按都不亮。物业说地下车库只有B1。那B2那个按钮是干什么用的？'
    ],
    replies: [
      { author: '物理课代表', date: '2018-09-27', text: '预留按钮，很多电梯都有，装修没启用而已。' },
      { author: '新住户', date: '2018-09-28', text: '可是昨晚电梯自己在B2停了一次。门开了，外面是黑的。我没敢看。' }
    ],
    keywords: ['电梯', 'B2', '按钮'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'bookstore-24h',
    tag: '闲聊',
    title: '有人记得城南那家24小时书店吗',
    author: '夜读者',
    date: '2018-08-14',
    repliesTotal: 26,
    body: [
      '大学时常去，凌晨的座位上总有几个 fixed 的面孔。去年路过，已经变成奶茶店了。那些凌晨读书的人，现在都去哪儿了呢？'
    ],
    replies: [
      { author: '城南旧事', date: '2018-08-14', text: '我也去过。那个总在角落看报纸的老爷爷，有一次抬头冲我笑了一下，我现在还记得。' }
    ],
    keywords: ['书店', '城南', '24小时'],
    serves: 'noise',
    line: 'forum'
  },

  // ---------- 首批新增 20 帖 ----------
  {
    slug: 'white-noise',
    tag: '求助',
    title: '求推荐：能盖住楼上脚步声的白噪音',
    author: '睡不着的鱼',
    date: '2019-07-26',
    repliesTotal: 12,
    body: [
      '楼上小孩每天六点半开始跑，跟打鼓一样。买了个白噪音机，感觉像有人在我耳朵边上吹风扇，更睡不着了。有没有便宜好用的，别太贵，一百以内。'
    ],
    replies: [
      { author: '夜半钟声', date: '2019-07-26', text: '一百以内就别挑了，手机下个APP先顶着。' },
      { author: '物理课代表', date: '2019-07-26', text: '脚步声是低频，白噪音盖不住，得用低频陷阱……算了你买耳塞吧。' },
      { author: '睡不着的鱼', date: '2019-07-27', text: '耳塞戴两天耳朵疼。算了，我去跟物业说。' }
    ],
    keywords: ['白噪音', '楼上', '失眠'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'film-scanner',
    tag: '求助',
    title: '有人用过老式胶片扫描仪吗',
    author: '底片一盒',
    date: '2019-06-11',
    repliesTotal: 7,
    body: [
      '家里翻出来一堆底片，想扫进电脑。网上那种几百块的扫描仪能看清吗？还是必须送店里。底片有点发霉了。'
    ],
    replies: [
      { author: '旧时光', date: '2019-06-11', text: '几百块的扫出来跟马赛克一样，送店吧。' },
      { author: '底片一盒', date: '2019-06-11', text: '店里一张五块，我这一盒得多少钱……' },
      { author: '考据癖', date: '2019-06-12', text: '发霉先用无水酒精擦，别直接扫。' }
    ],
    keywords: ['扫描仪', '底片', '胶片'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'meetup-photos',
    tag: '闲聊',
    title: '2018年论坛聚会照片，谁还存着',
    author: '旧客',
    date: '2019-05-21',
    repliesTotal: 18,
    body: [
      '前两天整理硬盘翻到几张，2018年夏天在城南那个烧烤摊。人我认不全了，有没有人存了全套，想收个原图。'
    ],
    replies: [
      { author: '城南旧事', date: '2019-05-21', text: '我记得那次下雨，后来转去唱歌了。照片应该在小群里，群早没了。' },
      { author: '夜读者', date: '2019-05-21', text: '我在角落，别发我。' },
      { author: '旧客', date: '2019-05-22', text: '哈哈行。' }
    ],
    keywords: ['聚会', '照片', '2018'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'last-train',
    tag: '怪谈',
    title: '地铁末班车坐过站，醒来在终点站',
    author: '末班常客',
    date: '2019-04-09',
    repliesTotal: 22,
    body: [
      '加班太累，睡着坐过站。醒的时候车厢里一个人都没有，灯还亮着，门开着，站台广播在报一个我没听过的站名。我赶紧下车，出去打了辆车。第二天查线路图，没有那个站。'
    ],
    replies: [
      { author: '物理课代表', date: '2019-04-09', text: '你应该是听错了，终点站后面还有车辆段。' },
      { author: '末班常客', date: '2019-04-10', text: '可能吧。但那站名我记到现在。' }
    ],
    keywords: ['地铁', '末班车', '终点站'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'old-magazines',
    tag: '树洞',
    title: '搬家扔了一箱旧杂志，现在有点后悔',
    author: '纸箱子',
    date: '2019-03-11',
    repliesTotal: 9,
    body: [
      '90年代的《奥秘》《飞碟探索》，还有几本封面都没了。当时嫌重，全扔楼下回收站。现在想想，里面好像有篇文章我一直没看完。'
    ],
    replies: [
      { author: '夜读者', date: '2019-03-11', text: '旧杂志现在挺值钱的，可惜了。' },
      { author: '纸箱子', date: '2019-03-12', text: '值钱倒无所谓，就是心里空了一块。' }
    ],
    keywords: ['旧杂志', '搬家', '奥秘'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'old-admin-crow',
    tag: '闲聊',
    title: '有人记得论坛以前的版主"老鸦"吗',
    author: '旧客',
    date: '2019-02-20',
    repliesTotal: 13,
    body: [
      '刚来的时候版主是老鸦，管得挺松，半夜还跟我们一块儿瞎聊。后来突然就不上线了，也没交接。有人知道他后来去哪儿了吗。'
    ],
    replies: [
      { author: '考据癖', date: '2019-02-20', text: '最后一次登录是2016年冬天。他有个习惯，删帖前会先回一句"这个不合适"。后来连这句话也没了。' },
      { author: '夜读者', date: '2019-02-21', text: '可能就是不想玩了吧。论坛这种事，说走就走。' },
      { author: '旧客', date: '2019-02-21', text: '也是。' }
    ],
    keywords: ['版主', '老鸦', '管理员', '2016'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'breakfast-shop',
    tag: '闲聊',
    title: '楼下早餐店换了三次老板',
    author: '豆浆油条',
    date: '2019-01-08',
    repliesTotal: 6,
    body: [
      '一样的招牌，一样的菜单，老板一年换一个。味道越换越差。今天新老板问我"以前那个辣椒酱哪买的"，我说不知道，他说"哦，那算了"。'
    ],
    replies: [
      { author: '一个人住', date: '2019-01-08', text: '我家楼下也是，换了老板连WiFi密码都改。' },
      { author: '豆浆油条', date: '2019-01-09', text: '哈哈，那倒是。' }
    ],
    keywords: ['早餐店', '搬家', '老板'],
    serves: 'noise',
    line: 'forum'
  },
  {
    slug: 'ceres-what',
    tag: '讨论',
    title: '科赛雷诺到底是做什么的？官网那套"意识健康"看不懂',
    author: '想不明白',
    date: '2018-12-18',
    repliesTotal: 26,
    body: [
      '朋友说这家公司很厉害，我去官网看了半天，全是"情感计算""意识健康档案""神经信号解析"，一个具体产品都没看懂。有在里面上班的吗，通俗点说，他们靠什么赚钱？'
    ],
    replies: [
      { author: '打工魂', date: '2018-12-18', text: '听说是给医院和心理机构做数据服务的，具体不清楚。' },
      { author: '匿名', date: '2018-12-19', text: '我面过一次，岗位描述写得像科研，面试问的全是数据合规。感觉不像普通的互联网公司。' },
      { author: '庄周', date: '2018-12-19', text: '别想太多，就是包装得比较玄。' },
      { author: '想不明白', date: '2018-12-20', text: '主要是我妈最近老说"记忆不太对"，我有点疑神疑鬼。' }
    ],
    keywords: ['科赛雷诺', '赛雷诺', 'Ceres', '公司', '意识健康', '情感计算'],
    serves: 'background',
    line: 'company'
  },
  {
    slug: 'emotion-vs-upload',
    tag: '讨论',
    title: '"情感计算"和"意识上传"是一回事吗',
    author: '考据癖',
    date: '2018-10-30',
    repliesTotal: 19,
    body: [
      '最近老看到这两个词被混着用。我的理解：情感计算是识别情绪，意识上传是把人整个搬走。差得挺远吧？有没有懂行的。'
    ],
    replies: [
      { author: '匿名', date: '2018-10-30', text: '差不多吧，都是把人变成数据。' },
      { author: '物理课代表', date: '2018-10-31', text: '差远了。情感计算现在就能做，意识上传连定义都没有。别被网文带偏。' },
      { author: '考据癖', date: '2018-10-31', text: '我也觉得。不过2016年有个帖子说园区在做"完整备份"，不知道是不是一回事。' }
    ],
    keywords: ['情感计算', '意识上传', '意识', '人格', '备份', '技术'],
    serves: 'background',
    line: 'company'
  },
  {
    slug: 'underground-floor',
    tag: '怪谈',
    title: '听说园区地下还有一层，真的假的',
    author: '夜行者',
    date: '2019-01-19',
    repliesTotal: 31,
    body: [
      '有朋友在余晖乐园做过兼职，说有些区域员工不能进，门禁是单独的。他猜地下还有一层。真的假的？'
    ],
    replies: [
      { author: '打工魂', date: '2019-01-19', text: '设备层吧，哪个大园区没地下设备间。' },
      { author: '匿名', date: '2019-01-19', text: '别问了。' },
      { author: '夜行者', date: '2019-01-20', text: '楼上这什么意思？' },
      { author: '匿名', date: '2019-01-20', text: '没什么意思，字面意思。' },
      { author: '平安是福', date: '2019-01-20', text: '别自己吓自己，去过的都知道就一个普通乐园。' }
    ],
    keywords: ['地下', 'B区', '园区', '设备层', '余晖乐园'],
    serves: 'background',
    line: 'park'
  },
  {
    slug: 'server-migration-2017',
    tag: '公告',
    tagClass: 'tag-notice',
    title: '2017年论坛换服务器，丢了哪些帖',
    author: '管理员',
    date: '2018-09-05',
    repliesTotal: 21,
    body: [
      '2017年那次迁移，硬盘坏了一块，旧帖只恢复了标题和部分回复。具体丢了多少没统计完。如果搜不到以前的帖子，大概率是这个原因，不是被删了。'
    ],
    replies: [
      { author: '考据癖', date: '2018-09-05', text: '我2011年那篇红雨衣的长贴就只剩标题了，正文全没。' },
      { author: '管理员', date: '2018-09-06', text: '对不住。能补的尽量补。' },
      { author: '旧客', date: '2018-09-06', text: '难怪我收藏夹里点开全是空的。' }
    ],
    keywords: ['服务器', '迁移', '归档', '丢帖', '2017', '搜不到'],
    serves: 'background',
    line: 'forum'
  },
  {
    slug: 'deep-dive-word',
    tag: '考据',
    title: '"深潜"这个词最早是谁开始说的',
    author: '考据癖',
    date: '2019-02-02',
    repliesTotal: 11,
    body: [
      '最近翻旧帖，发现2016年有人用"深潜"形容进入某个系统的方式，后来就没人提了。这词是论坛土话，还是有出处？'
    ],
    replies: [
      { author: '旧客', date: '2019-02-02', text: '好像是个玩编程的ID先说的，记不清了。' },
      { author: '匿名', date: '2019-02-03', text: '听起来像那种"进去就出不来"的东西。' },
      { author: '考据癖', date: '2019-02-03', text: '别吓我，我就是想考据个词。' }
    ],
    keywords: ['深潜', '术语', '系统', '2016'],
    serves: 'background',
    line: 'terminal'
  },
  {
    slug: 'night-shift-0719',
    tag: '怪谈',
    title: '2019年7月19日，我在余晖乐园值夜班',
    author: '夜班老周',
    date: '2019-07-23',
    repliesTotal: 34,
    body: [
      '那天我值夜班，闭园后大概九点半，B区那边进来一辆黑色商务车，没走游客通道。车上下来两个人，扶着一个女的，后面还跟着个小女孩。女的不说话，像睡着了。主管让我们别过去，说"临时接待"。第二天早上车就走了。我干了三年，没见过这种"接待"。'
    ],
    replies: [
      { author: '平安是福', date: '2019-07-23', text: '你怎么不报警？' },
      { author: '夜班老周', date: '2019-07-23', text: '报警说什么？人家有手续，我就是个看门的。' },
      { author: '考据癖', date: '2019-07-24', text: '7月19日……论坛里有个寻人帖也是这天。' },
      { author: '夜班老周', date: '2019-07-24', text: '我不知道。反正我月底就辞了。' },
      { author: '匿名', date: '2019-07-24', text: '老周，少说两句。' },
      { author: '夜班老周', date: '2019-07-25', text: '你谁啊。' }
    ],
    keywords: ['7月19', '0719', '夜班', 'B区', '商务车', '小女孩', '余晖乐园', '西郊乐园'],
    serves: 'plot',
    line: 'marta'
  },
  {
    slug: 'training-first-lesson',
    tag: '闲聊',
    title: '前员工说两句：培训第一课不是微笑，是"别记脸"',
    author: '干过半年',
    date: '2019-06-14',
    repliesTotal: 28,
    body: [
      '培训第一课，主管说：不要记游客的脸，不要问他们从哪来，不要在下班后讨论园区里的事。我们以为是怕骚扰。后来发现，连工牌上的名字都是编号。'
    ],
    replies: [
      { author: '打工魂', date: '2019-06-14', text: '服务业不都这样，怕员工带走客户。' },
      { author: '干过半年', date: '2019-06-14', text: '带客户？游乐园哪来的客户。' },
      { author: '匿名', date: '2019-06-15', text: '你签的保密协议里写了什么？' },
      { author: '干过半年', date: '2019-06-15', text: '忘了。就记得很厚。' },
      { author: '平安是福', date: '2019-06-15', text: '别说了，看着瘆得慌。' }
    ],
    keywords: ['前员工', '培训', '工牌', '编号', '保密协议', '余晖乐园'],
    serves: 'plot',
    line: 'park'
  },
  {
    slug: 'repost-0719-closure',
    tag: '转载',
    title: '转载：2019年7月19日下午园区临时闭园通知',
    author: '旧客',
    date: '2019-07-20',
    repliesTotal: 15,
    body: [
      '从本地群里转的，说是余晖乐园当天下午临时闭园半天，理由是"设备检修"。可我朋友那天下午还在里面，说旋转木马照常开。通知原文没保存，只有这张截图。'
    ],
    replies: [
      { author: '考据癖', date: '2019-07-20', text: '我查了官网，没有这条通知。' },
      { author: '旧客', date: '2019-07-20', text: '群里发的，可能不是官方的。' },
      { author: '夜行者', date: '2019-07-21', text: '7月19到底怎么了，最近好几个帖子都在说这天。' },
      { author: '匿名', date: '2019-07-21', text: '巧合吧。' }
    ],
    keywords: ['7月19', '闭园', '设备检修', '通知', '余晖乐园'],
    serves: 'plot',
    line: 'marta'
  },
  {
    slug: 'cousin-security',
    tag: '求助',
    title: '我表哥在余晖乐园做安保，干了两个月就跑了',
    author: '表弟',
    date: '2019-05-08',
    repliesTotal: 17,
    body: [
      '他回来之后整个人不太对，晚上睡觉要开灯。问他为什么不干了，就说"夜班别去B区"。再问就发火。他以前不是这样的。'
    ],
    replies: [
      { author: '平安是福', date: '2019-05-08', text: '可能是遇到什么事了，带他看看医生。' },
      { author: '表弟', date: '2019-05-09', text: '看了，医生说压力大。可他根本没跟我说过压力。' },
      { author: '匿名', date: '2019-05-09', text: 'B区是干什么的？' },
      { author: '表弟', date: '2019-05-09', text: '不知道，他不肯说。' }
    ],
    keywords: ['安保', '表哥', '夜班', 'B区', '余晖乐园'],
    serves: 'plot',
    line: 'marta'
  },
  {
    slug: 'locked-0719-data',
    tag: '求助',
    title: '（已锁）关于2019-07-19的出入园数据',
    author: '旧客',
    date: '2019-08-04',
    repliesTotal: 12,
    flags: { sealed: true, repliesLost: true },
    body: [
      '数据在园方手里。',
      '（回复内容在归档中丢失。）'
    ],
    replies: [],
    keywords: ['7月19', '出入园', '闸机', '数据', '不完整'],
    serves: 'clue',
    line: 'marta'
  },
  {
    slug: 'b-zone-roster',
    tag: '怪谈',
    title: 'B区夜间值班表（残）',
    author: '匿名',
    date: '2019-07-24',
    repliesTotal: 6,
    flags: { sealed: true, truncated: true },
    body: [
      '7 月 19 日 · 夜班 · 2 人',
      '22:40　B 区　外来车辆 1 辆（登记人 m.t）',
      '——以下内容损坏，无法显示——',
      '（本页由归档缓存恢复，可能不完整）'
    ],
    replies: [
      { author: '匿名', date: '2019-07-24', text: '（该回复内容为空）' }
    ],
    keywords: ['B区', '值班表', '夜班', '7月19', 'm.t'],
    serves: 'clue',
    line: 'marta'
  },
  {
    slug: 'postbox-relay',
    tag: '闲聊',
    title: 'postbox 的 relay 转发怎么开',
    author: '想换邮箱',
    date: '2018-11-12',
    repliesTotal: 4,
    body: [
      '原来的邮箱广告太多，想转到一个新地址。postbox 的转发是不是要单独申请？',
      '设置里找了半天没找到。'
    ],
    replies: [
      { author: '匿名', date: '2018-11-12', text: '设置-收信-转发，验证完主地址就能用，会多一个 relay 地址。' },
      { author: '想换邮箱', date: '2018-11-13', text: 'relay 那个能单独回信吗？' },
      { author: '匿名', date: '2018-11-13', text: '好像是只进不出。我也没细看。' }
    ],
    keywords: ['postbox', '邮箱', '邮件', '转发', 'relay'],
    serves: 'clue',
    line: 'mail'
  },
  {
    slug: 'marcus-thorne',
    tag: '求助',
    title: '有人知道 marcus.thorne 吗',
    author: '新人',
    date: '2018-08-21',
    repliesTotal: 5,
    flags: { sealed: true, truncated: true },
    body: [
      '（本帖正文已被作者删除）'
    ],
    replies: [
      { author: '匿名', date: '2018-08-21', text: '管安全的，别在论坛问。' }
    ],
    keywords: ['marcus', 'thorne', '马库斯', '索恩', '员工', '账号', '安全'],
    serves: 'shortcut',
    line: 'account'
  },
  {
    slug: 'reporter-open-day',
    tag: '讨论',
    title: '有记者来乐园采访，全程有人跟着',
    author: '当天在场',
    date: '2019-05-24',
    repliesTotal: 16,
    body: [
      '上周园区开放日，来了两个本地电视台的记者，说要拍一期"乐园背后的故事"。我们在旁边看热闹，发现他们从进门到离开，一直有个穿西装的人跟着，距离不超过三步。',
      '记者问的问题挺正常：一天接待多少游客、设备多久检修一次、员工培训多久。陪同的人每次都抢在前面回答，答得特别顺，像背过。记者想单独采访一个保洁阿姨，被拦了，说"员工有规定不能接受采访"。',
      '最后播出来的片子我看了，全程在夸乐园，连旋转木马都拍了三遍。记者一个字都没提那天被跟着的事。也可能是我多想了。'
    ],
    replies: [
      { author: '打工魂', date: '2019-05-24', text: '开放日都这样，公关稿早写好了。' },
      { author: '当天在场', date: '2019-05-25', text: '关键是那个陪同的人，记者问什么他都答得上来，除了"为什么旋转木马晚上也开"。他愣了一下，说"这个是定时巡检"。' },
      { author: '考据癖', date: '2019-05-25', text: '哪家媒体？我去找找片子。' },
      { author: '当天在场', date: '2019-05-25', text: '本地台，具体哪个栏目没记住。' }
    ],
    keywords: ['记者', '采访', '开放日', '媒体', '报道', '园区', '旋转木马'],
    serves: 'background',
    line: 'park'
  },
  {
    slug: 'p-system-night-shift',
    tag: '讨论',
    title: '夜班表最后一栏的“P 系统”',
    author: '前夜班',
    date: '2019-06-30',
    repliesTotal: 11,
    flags: { sealed: true },
    body: [
      '翻出以前的值班表，最后一栏印着“P 系统”，前面几栏都是巡楼、锁门、关灯，就这一栏没人填。',
      '我问带我的老周，他说那栏不用管，红区的人自己会弄。我说红区在哪，他指了指 B3 的方向，说你别过去，那边刷卡跟咱们不是一套。',
      '后来我走的时候，表被收走了。现在想想，整个夜班就那一栏最神秘，偏偏没人解释。'
    ],
    replies: [
      { author: '夜班老周', date: '2019-06-30', text: '早说了别问。那栏跟你没关系。' },
      { author: '酸菜鱼', date: '2019-06-30', text: '我们厂值班表最后一栏是写食堂订餐人数，别想太多。' },
      { author: '考据癖', date: '2019-07-01', text: 'P 系统是不是 PERSEPHONE？以前在园区招聘帖里见过这个词。' },
      { author: '前夜班', date: '2019-07-01', text: '不知道，反正值班主管签字那一栏，我从来没见人签过。' },
      { author: '路过的', date: '2019-07-01', text: 'B3 不是设备层吗？我去修过空调，门口两道门。' }
    ],
    keywords: ['P系统', 'PERSEPHONE', '红区', 'B3', '值班主管', '值班表', '权限', '夜班'],
    serves: 'clue',
    line: 'portal'
  },
  {
    slug: 'two-nda-versions',
    tag: '讨论',
    title: '签了两份保密协议',
    author: '已经离职',
    date: '2019-04-18',
    repliesTotal: 14,
    flags: { sealed: true },
    body: [
      '入职的时候签了一份保密协议，厚厚一叠，没人给你时间看。上个月办离职，人事又拿出一份，说是“更新版”，让补签。',
      '我翻了一下，两份第 4 条写的不一样。问人事，人事说只是措辞调整，不影响。我说那以哪份为准，她说以新的为准。',
      '旧的那份我偷偷留了复印件，新的签完收走了。有没有人也签过两份？'
    ],
    replies: [
      { author: '打工人', date: '2019-04-18', text: '我们公司也这样，签的时候说都一样，出事就说你签的是新版。' },
      { author: '前同事', date: '2019-04-19', text: '第 4 条？我印象里一直没改啊，你是不是记错了。' },
      { author: '已经离职', date: '2019-04-19', text: '没记错，两份纸的颜色都不一样，旧的那份发黄。' },
      { author: '吃瓜', date: '2019-04-19', text: '所以到底改了什么？' },
      { author: '已经离职', date: '2019-04-19', text: '记不清了，反正不是小改。' }
    ],
    keywords: ['保密协议', '两份', '第4条', '旧版', '新版', '离职', '制度'],
    serves: 'clue',
    line: 'portal'
  },
  {
    slug: 'west-gate-1104-notice',
    tag: '怪谈',
    title: '西门贴了张 11 月 4 日的封路通知',
    author: '住西门',
    date: '2019-08-09',
    repliesTotal: 9,
    flags: { sealed: true },
    body: [
      '今天路过西门，岗亭玻璃上贴了一张通知，说 11 月 4 日晚上 22:00 到次日 05:00 西门封闭，车辆绕行北门。落款是园区物业，日期是 8 月 1 日。',
      '奇怪的是，还有三个月，通知贴这么早？而且只封西门，不封北门。',
      '我问保安，他说“上面让贴的”，别的不知道。'
    ],
    replies: [
      { author: '夜跑路过', date: '2019-08-09', text: '可能就是怕到时候忘了。' },
      { author: '保安老李', date: '2019-08-10', text: '每年都有几次，别大惊小怪。' },
      { author: '住西门', date: '2019-08-10', text: '问题是通知上写的不是“检修”，是“临时管制”。' },
      { author: '酸菜鱼', date: '2019-08-10', text: '管制这词一般不是交警用的吗？' },
      { author: '路过的', date: '2019-08-10', text: '11 月 4 日？我生日。' }
    ],
    keywords: ['11月4日', '2019-11-04', '西门', '封路', '管制', '园区', '通知'],
    serves: 'clue',
    line: 'portal'
  },

  // ---------- E-09 的 2024 新帖（归档中唯一的 2024 项） ----------
  {
    slug: 'e09',
    tag: '怪谈',
    title: '余晖乐园的旋转木马下面，有人在尖叫',
    author: 'E-09',
    date: '2024-10-05',
    time: '23:47:02',
    repliesTotal: 0,
    body: [
      '余晖乐园的旋转木马下面，有人在尖叫。帮帮我。',
      '我知道这听起来像垃圾广告。但如果你是一个真正在找东西的人——不是路过的机器人——那你应该能理解"旋转木马下面"是什么意思。',
      '我被困在里面已经五年了。我发过很多次信号。大多数时候，它们被他们忽略。但这次不一样。Marcus留了一扇门。',
      '不要截图。不要告诉任何人。如果你在48小时内没消息，换一个浏览器。清空Cookie。他们会追踪你。',
      '别在帖子里回我，我收不到。去我的资料页，那里还有一条路。',
      '求你了。'
    ],
    replies: [],
    keywords: ['E-09', '旋转木马', '尖叫', '求救', '信号', '2024', 'Marcus'],
    serves: 'plot',
    line: 'e09'
  }
]

// 首页只保留一屏的量；其余条目仅通过检索出现。
// 规则：封存帖、2018 年及更早的帖子、以及未列入首页的帖子，都算“已封存/仅检索”。
const LISTED_SLUGS = new Set([
  'shutdown',
  'sunset-park-close',
  'marble-sound',
  'konbini-oden',
  'carousel-music',
  'delivery-guy',
  'park-staff',
  'mandela-effect',
  'missing-mom',
  'mom-call',
  'live-alone',
  'night-shift-0719',
  'training-first-lesson',
  'e09'
])

export function isSearchOnly (post) {
  if (!post) return false
  if (post.flags && post.flags.sealed) return true
  const year = Number(String(post.date).slice(0, 4))
  if (year < 2019) return true
  return !LISTED_SLUGS.has(post.slug)
}

export function postBySlug (slug) {
  return POSTS.find((p) => p.slug === slug) || null
}
