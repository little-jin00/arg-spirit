// 邮箱数据：首批邮件、人物回信、通讯录与关键词规则
// 说明：邮件正文只写世界观内容，不写"线索/提示"之类的元信息。

export const INITIAL_MAILS = [
  {
    id: 'bounce',
    from: 'MAILER-DAEMON',
    addr: 'postmaster@postbox.com',
    subject: '无法投递：chen.mo@postbox.com',
    preview: '这是一封系统退信。您所在的群发列表中，陈默于 2024-10-06 21:47 发出的邮件有 6 个地址无法投递……',
    time: '10月7日',
    seedRead: true
  },
  {
    id: 'chen',
    from: '陈默',
    addr: 'chen.mo@postbox.com',
    subject: '（无主题）',
    preview: '这封邮件是定时发送的。如果你收到它……',
    time: '10月6日',
    seedRead: true,
    readAt: '2024-10-06 22:13'
  },
  {
    id: 'bill',
    from: '招商银行',
    addr: 'no-reply@cmbchina.com',
    subject: '您 9 月信用卡电子账单已生成',
    preview: '尊敬的客户，您 2024 年 9 月账单已生成，本期应还金额 1,286.40 元……',
    time: '10月5日',
    seedRead: true,
    body: [
      '尊敬的客户：您 2024 年 9 月的信用卡电子账单已生成。',
      '本期应还金额：1,286.40 元　｜　最后还款日：2024-10-25',
      '本邮件由系统自动发送，请勿直接回复。'
    ]
  },
  {
    id: 'promo',
    from: '山野装备',
    addr: 'service@shanye-outdoor.com',
    subject: '秋季特惠｜全场 5 折起，最后 48 小时',
    preview: '换季上新，冲锋衣、登山鞋低至 5 折，会员再减 50 元……',
    time: '10月4日',
    seedRead: true,
    body: [
      '换季上新，冲锋衣、登山鞋、头灯全场 5 折起。',
      '会员额外立减 50 元，活动截止 10 月 6 日 23:59。',
      '如不想再收到此类邮件，请点击此处退订。'
    ]
  },
  {
    id: 'code',
    from: 'Postbox 安全中心',
    addr: 'security@postbox.com',
    subject: '登录验证码',
    preview: '您的验证码是 482913，5 分钟内有效。如非本人操作请忽略。',
    time: '10月2日',
    seedRead: true,
    body: [
      '您的登录验证码是 482913，5 分钟内有效。',
      '如非本人操作，请忽略本邮件，并检查账号安全设置。',
      '请勿将验证码提供给任何人。'
    ]
  }
]

export const MAIL_SEQUENCE = [
  {
    id: 'm00_relay',
    from: 'E-09',
    addr: 'e09.relay@postbox.com',
    time: '—',
    subject: '（自动回复）你找到这里了',
    preview: '如果你收到这封，说明我没回来……',
    auto: true,
    trigger: 'e09_mail_sent',
    link: '/inside',
    body: [
      '如果你收到这封，说明我没回来。',
      '别在这里写第二封。这个地址不是我的，是论坛当年的转发邮箱。谁在看，我不知道。',
      '你要找的东西在 /inside/。从论坛点进去，他们以为你只是好奇；从邮局点，他们会知道你是谁。选一个。',
      '（这封是提前写好的自动回复。）',
      '—— E-09'
    ]
  },
  {
    id: 'm01_editor',
    from: '周寒',
    addr: 'zhouhan@nanan-weekly.com',
    time: '2024-10-08 01:12',
    subject: '陈默的东西在我这儿',
    preview: '你是不是也收到了他那封定时邮件……',
    trigger: 'forum_e09_opened',
    replyable: true,
    body: [
      '你是不是也收到了陈默那封定时邮件。',
      '我是他编辑。他三天没交稿，电话不接，我去他住的地方，房东说他 3 号晚上出去就没回来。警察做了笔录，说成年人失踪，先等等。',
      '他桌上那台笔记本还在。回收站里有个没写完的稿子，最后一段停在"乐园下面还有一家公司"。再往下就没了。',
      '我在他邮箱里看到一份名单，41 个地址。我不知道你是谁，也不知道他为什么把你们加进去。如果你知道什么，回我。',
      '周寒',
      '《南岸周刊》社会组'
    ]
  },
  {
    id: 'm02_compliance',
    from: '科赛雷诺 · 合规与审计部',
    addr: 'compliance@ceres-reynold.com',
    time: '2024-10-09 08:30',
    subject: '【合规提醒】关于内部链接的使用（案号 CE-2024-{{caseDate}}-37）',
    preview: '我们记录到一次内部链接访问……',
    trigger: 'portal_login',
    requires: ['e09_mail_sent'],
    body: [
      '您好：',
      '{{e09SentTime}}，您致信 e09.relay@postbox.com。该地址已于 2019 年停用，邮件由系统管理员代收。',
      '我们同时记录到，该发件地址随后访问了科赛雷诺内部系统入口。该入口未对公众开放，相关访问已登记在案，案号 CE-2024-{{caseDate}}-37。',
      '请您停止使用该链接，并删除从内部系统获取的任何资料。如您代表媒体或监管机构，请通过正式渠道联系我们。',
      '本部门本年度同类案件计数：本案为第 37 起。',
      '合规与审计部',
      '科赛雷诺科技'
    ]
  },
  {
    id: 'm03_it',
    from: '科赛雷诺 IT 服务台',
    addr: 'it-service@ceres-reynold.com',
    time: '2024-10-08 23:58',
    subject: '【工单 T-2294】身份验证连续失败通知',
    preview: '您的账号（工号 E-2317）在短时间内连续 3 次身份验证失败。',
    trigger: 'auth_fail_3',
    requires: ['e09_mail_sent'],
    body: [
      '您的账号（工号 E-2317）在短时间内连续 3 次身份验证失败。',
      '',
      '如为本人操作，请检查：',
      '· 大小写与输入法',
      '· 入职信息是否已同步（实习生账号需人事复核）',
      '',
      '如非本人操作，请忽略本邮件；第 5 次失败将升级至安全运营部。',
      '',
      '——',
      '附：维护访问令牌（MAT）',
      'MAT-7F3C-2E91',
      '有效期 30 分钟，单次使用。仅用于终端维护会话，不能用于门户登录。',
      '签发原因：账号已加入本周计划维护名单。'
    ]
  },
  {
    id: 'm04_security',
    from: '安全运营部',
    addr: 'security-ops@ceres-reynold.com',
    time: '2024-10-09 00:12',
    subject: '账号活动复核通知（员工号 E-2317）',
    preview: '我们在 {{date}} 的例行检查中发现，该账号的浏览器指纹与一份外部论坛侧记录一致。',
    trigger: 'portal_login',
    requires: ['e09_mail_sent'],
    body: [
      '我们在 {{date}} 的例行检查中发现，该账号的浏览器指纹与一份外部论坛侧记录一致。',
      '',
      '本次复核不阻断门户使用，也不要求您立即答复。',
      '',
      '如非本人操作，请联系值班主管。',
      '',
      '安全运营部 · 自动通知'
    ]
  },
  {
    id: 'm06_compliance2',
    from: '科赛雷诺 · 合规与审计部',
    addr: 'compliance@ceres-reynold.com',
    time: '2024-10-09 09:20',
    subject: '案号升级通知（原 T-2294 / 现 T-2294-R）',
    preview: '合规与审计部已将该工单并入复核流程。',
    triggers: ['ticket_permission_granted', 'kessler_resumed'],
    body: [
      '合规与审计部已将该工单并入复核流程。',
      '',
      '即日起，该账号的权限申请将进入「复核中」状态，签发时间不再保证。',
      '',
      '已签发的维护令牌不受影响，到期自动失效。'
    ]
  },
  {
    id: 'm09_postbox',
    from: 'Postbox 系统',
    addr: 'no-reply@postbox.com',
    time: '2024-10-08 23:47',
    subject: '邮箱归档策略通知',
    preview: '您的邮箱已触发容量归档：{{baseTime}}',
    trigger: 'maya_partition_found',
    body: [
      '您的邮箱已触发容量归档：{{baseTime}}',
      '归档范围：收件箱、已发送、草稿',
      '归档不影响读取；新邮件仍可正常接收。'
    ]
  },
  {
    id: 'm11_misdelivery',
    from: '未知发件人',
    addr: 'noreply@local',
    to: 'E-13@local',
    time: '—',
    subject: '',
    preview: '[E-0x14F] session not found',
    trigger: 'exit_attempted',
    body: ['[E-0x14F] session not found']
  },
  {
    id: 'm08a',
    from: '等妈妈回家',
    addr: 'dengmama@postbox.com',
    time: '2024-10-08 20:10',
    subject: '你能帮我看看这个吗',
    preview: '我看到你在论坛回过我妈妈的帖子。',
    triggers: ['e07_ended', 'e07_refused'],
    replyable: true,
    body: [
      '你好。',
      '我看到你在论坛回过我妈妈的帖子。',
      '你问的那几个问题，不像随便问的。',
      '我把那天的照片翻出来了，只有一张。你能帮我看看，后面那个穿灰衣服的人是谁吗。'
    ]
  },
  {
    id: 'm08b',
    from: '等妈妈回家',
    addr: 'dengmama@postbox.com',
    time: '2024-10-08 21:02',
    subject: '照片传不上来',
    preview: '照片我传不上来，论坛的附件功能坏了。',
    trigger: 'm08a_replied',
    body: [
      '照片我传不上来，论坛的附件功能坏了。',
      '我只能说：那天门口有个阿姨给我买了一支冰棍，让我坐在长椅上等。',
      '她说她认识我妈妈。'
    ]
  },
  {
    id: 'm08c',
    from: '等妈妈回家',
    addr: 'dengmama@postbox.com',
    time: '2024-10-09 22:40',
    subject: '最后一句',
    preview: '我今年 11 岁。',
    trigger: 'chapter4_entered',
    body: [
      '我今年 11 岁。',
      '记录上写我 6 岁。',
      '我不知道他们为什么要写错。',
      '如果你见到我妈妈，别告诉她我在等。'
    ]
  }
]

// 人物回信：不靠事件触发，由发信内容决定，延迟到下一个事件后送达
export const REPLY_MAILS = {
  m01b_draft: {
    id: 'm01b_draft',
    from: '周寒',
    addr: 'zhouhan@nanan-weekly.com',
    time: '2024-10-08 23:06',
    subject: 'Re: 陈默的东西在我这儿',
    preview: '那篇稿子我翻出来了……',
    body: [
      '那篇稿子我翻出来了。最后改到 2019 年 7 月，后面全是空白。',
      '他标了一页，只有一行字：7 月 19 日，入园人数对不上。',
      '我不知道这算什么。你要继续，我不拦你。别用同一个浏览器。',
      '周寒'
    ]
  },
  m01b_warn: {
    id: 'm01b_warn',
    from: '周寒',
    addr: 'zhouhan@nanan-weekly.com',
    time: '2024-10-09 00:31',
    subject: 'Re: 陈默的东西在我这儿',
    preview: '你问的那两样，他稿子里也写了……',
    body: [
      '你问的那两样，他稿子里也写了。写到一半停了。',
      '我劝你一句：查可以，别去现场。他最后一次出门，就是去了现场。',
      '周寒'
    ]
  },
  m01b_quit: {
    id: 'm01b_quit',
    from: '周寒',
    addr: 'zhouhan@nanan-weekly.com',
    time: '2024-10-09 07:44',
    subject: 'Re: 陈默的东西在我这儿',
    preview: '我理解。',
    body: [
      '我理解。',
      '他东西我先留着。如果哪天你想说，我还在。',
      '周寒'
    ]
  },
  m01b_neutral: {
    id: 'm01b_neutral',
    from: '周寒',
    addr: 'zhouhan@nanan-weekly.com',
    time: '2024-10-09 01:19',
    subject: 'Re: 陈默的东西在我这儿',
    preview: '收到了。',
    body: [
      '收到了。',
      '这两天报社在换打印机，整层楼都是臭氧味。我一边等维修一边把他桌面又翻了一遍。',
      '有别的再说。',
      '周寒'
    ]
  }
}

export const CONTACTS = {
  'e09.relay@postbox.com': { name: 'E-09', source: '论坛主页', status: 'autoreply' },
  'zhouhan@nanan-weekly.com': { name: '周寒', source: '邮件签名', status: 'replyable' },
  'ceo@ceres-reynold.com': { name: 'A.C.', source: '警告邮件', status: 'screen' },
  'compliance@ceres-reynold.com': { name: '合规与审计部', source: '来信', status: 'noreply' },
  'security-ops@ceres-reynold.com': { name: '安全运营部', source: '来信', status: 'noreply' },
  'chen.mo@postbox.com': { name: '陈默', source: '开场邮件', status: 'bounce' },
  'it-service@ceres-reynold.com': { name: '科赛雷诺 IT 服务台', source: '来信', status: 'noreply' },
  'dengmama@postbox.com': { name: '等妈妈回家', source: '论坛私信', status: 'replyable' },
  'service@afterglow-park.com': { name: '乐园公共关系', source: '官网页脚', status: 'dead' }
}

export const REPLY_RULES = {
  editor: [
    { id: 'draft', match: ['陈默', '稿子', '备份', '最后'], mail: 'm01b_draft' },
    { id: 'warn', match: ['乐园', '旋转木马'], mail: 'm01b_warn' },
    { id: 'quit', match: ['对不起', '退出', '不查了', '放弃'], mail: 'm01b_quit' }
  ]
}

export const AC_REPLY_LINES = {
  defiant: '你比第 36 个有种。继续。',
  plead: '很好。继续做一个游客。',
  neutral: '我记住了。'
}
