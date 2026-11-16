// E-07 控制台对话（18.7 脚本层，21 节点：E07-00 ~ E07-12）
// lines 中带 [VOICE] 前缀的是 E-07 本人台词，[ARCHIVE] 为归档行，其余为系统行
// set 只写脚本层列出的状态键；to 为单线后继，opts 为固定选项，nlu 为意图槽节点
// prereq 为深层话题前置：portal_visit_seen / ticket_seen / read:<路径>

export const E07_CONSOLE_SELF = `B-2 · 探视终端
探视记录：0。
录音片段 01（2019-07-19）：「别怕，妈妈很快就回来。」
录音片段 02（2021-06-03）：「今天有人来看我吗。」
留言：无。`

export const E07_NODES = {
  'E07-00': {
    lines: [
      '探视终端 · B-2',
      '探视记录：0。',
      '通话请求已受理。',
      '镇静 2.1 → 0.9 mg/kg/h。窗口 8 分钟。'
    ],
    opts: [
      { label: '接通床旁通话', to: 'E07-01' },
      { label: '挂断', to: 'exit' }
    ]
  },

  'E07-01': {
    lines: [
      '[VOICE] ……有人？',
      '[VOICE] 别挂。',
      '[VOICE] 我很久没听见有人进来了。'
    ],
    set: { e07_entered: true },
    to: 'E07-02'
  },

  'E07-02': {
    lines: [
      '[VOICE] 他们说我睡了六年。',
      '[VOICE] 我记得的没有六年那么长。',
      '[VOICE] 我记得有人答应过我，很快就回来。',
      '[VOICE] 后来就没有人了。'
    ],
    opts: [
      { label: '问她到底是谁', to: 'E07-02b' },
      { label: '我有几个问题想问她', to: 'E07-05' },
      { label: '让她继续说下去', to: 'E07-03' }
    ],
    set: { e07_talks: '+1' }
  },

  'E07-02b': {
    lines: [
      '[VOICE] 他们都叫我 E-07。',
      '[VOICE] 我以前不叫这个。',
      '[VOICE] ……以前的名字，你先别问。'
    ],
    to: 'E07-03'
  },

  'E07-03': {
    nlu: true,
    lines: ['[VOICE] 你说吧。我听着。']
  },

  'E07-04': {
    lines: ['[VOICE] ……我有点累了。'],
    opts: [
      { label: '让她先歇一会儿', to: 'E07-03' },
      { label: '我有几个问题想问她', to: 'E07-05' }
    ],
    set: { e07_nl_fail: 0 }
  },

  'E07-05': {
    menu: true,
    lines: []
  },

  'E07-05a': {
    lines: [
      '[VOICE] 她十一岁。',
      '[VOICE] 记录上写六岁。他们连这个都写错。',
      '[VOICE] 别让她进来。'
    ],
    topic: 'daughter',
    prereq: 'portal_visit_seen',
    set: { e07_daughter: true, e07_deep_answered: '+1' },
    to: 'E07-05'
  },

  'E07-05b': {
    lines: [
      '[VOICE] 一个姓 K 的人。',
      '[VOICE] 他说去去就回。',
      '[VOICE] 他说话的时候一直在看表。'
    ],
    topic: 'promiser',
    prereq: 'ticket_seen',
    set: { e07_promiser: true, e07_deep_answered: '+1' },
    to: 'E07-05'
  },

  'E07-05c': {
    lines: [
      '[VOICE] 早上六点，晚上六点。',
      '[VOICE] 亮四十分钟。我数过。',
      '[VOICE] 亮着的时候，我知道外面还是白天。'
    ],
    topic: 'light',
    prereq: 'read:/logs/ops_schedule.log',
    set: { e07_light: true, e07_deep_answered: '+1' },
    to: 'E07-05'
  },

  'E07-05d': {
    lines: [
      '[VOICE] 有一次。门开了一半。',
      '[VOICE] 站着一个小孩。太远了，看不清。',
      '[VOICE] 后来门就关上了。',
      '[VOICE] 我一直没敢问是不是她。'
    ],
    topic: 'visitor',
    prereq: 'read:/subjects/e-07/console',
    set: { e07_visitor: true, e07_deep_answered: '+1' },
    to: 'E07-05'
  },

  'E07-05e': {
    lines: [
      '[VOICE] 他们说我签过字。',
      '[VOICE] 我不记得签过。',
      '[VOICE] 我只记得那天很热，排队的人很多。'
    ],
    topic: 'why',
    prereq: 'read:/home/kessler/journal.txt',
    set: { e07_why: true, e07_deep_answered: '+1' },
    to: 'E07-05'
  },

  'E07-05f': {
    lines: [
      '[VOICE] 那是我说的。',
      '[VOICE] 我以为她会在门口等我。',
      '[VOICE] 我没有等到。'
    ],
    topic: 'child',
    prereq: ['portal_visit_seen', 'read:/subjects/e-07/console'],
    set: { e07_child: true, e07_deep_answered: '+1' },
    to: 'E07-05'
  },

  'E07-06': {
    avoid: true,
    set: { e07_nl_fail: 0 },
    to: 'E07-05'
  },

  'E07-07': {
    lines: [
      '[VOICE] 我想请你帮一件事。',
      '[VOICE] 把维持关掉。',
      '[VOICE] 不是现在就走。是把那个每天两次的灯关掉。',
      '[VOICE] 我够了。'
    ],
    opts: [
      { label: '为什么想关掉维持', to: 'E07-07b' },
      { label: '我帮你关掉维持', to: 'E07-08' },
      { label: '我做不到', to: 'E07-10' }
    ],
    set: { e07_request_heard: true }
  },

  'E07-07b': {
    lines: [
      '[VOICE] 因为明天和昨天一样。',
      '[VOICE] 我不是在等死。我是在等一件不会发生的事。',
      '[VOICE] 她已经十一岁了。我不想让她记住的是这个样子。'
    ],
    to: 'E07-08'
  },

  'E07-08': {
    lines: ['请确认。此操作不可逆。'],
    opts: [
      { label: '照做，关闭维持', to: 'E07-09' },
      { label: '拒绝，维持继续', to: 'E07-10' },
      { label: '再等等，先不决定', to: 'E07-05' }
    ]
  },

  'E07-09': {
    lines: [
      '镇静停止。维生支持逐步撤除。',
      '[VOICE] 谢谢。',
      '[VOICE] 灯……关小一点。',
      '22:41 呼吸停止。探视记录：1。',
      '[ARCHIVE] 通话录音已归档。'
    ],
    set: { e07_ended: true },
    to: 'exit'
  },

  'E07-10': {
    lines: [
      '请求已记录。维持继续。',
      '[VOICE] ……好。',
      '[VOICE] 那你下次还来吗。',
      '探视窗口结束。镇静恢复 2.1 mg/kg/h。'
    ],
    set: { e07_refused: true },
    footer: 'refused',
    to: 'exit'
  },

  'E07-11': {
    lines: [
      'B-2 · 探视记录：1。',
      '床旁屏幕：已关闭。',
      '录音片段 03：「别怕，妈妈很快就回来。」'
    ],
    to: 'exit'
  },

  'E07-12': {
    lines: [
      'B-2 · 探视记录：1。',
      '镇静 2.1 mg/kg/h。',
      '通话窗口未开放。',
      '留言已记录。她听不见。'
    ],
    to: 'exit'
  }
}
