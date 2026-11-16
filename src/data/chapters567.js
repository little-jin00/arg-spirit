// 第五、六、七章脚本层：节点与台词逐字取自 剧情文案总集.md 第十七章 17.4–17.6
// 节点字段沿用 chapter4.js：lines / opts / set / next / type；HUB 不在此处出现。
// 条件与灰显理由按 15.3、16.2、16.3 写入 node.opts，由终端节点机求值。

export const C5_NODES = {
  'C5-00': {
    chapter: 5,
    once: true,
    lines: [
      `[ERROR] EXTERNAL NEURAL INTERFACE NOT DETECTED`,
      `[ERROR] INPUT DEVICE: none`,
      `[INFO]  INPUT STREAM: active (source unresolved)`,
      `[INFO]  HOST: SUBJECT E-13 · stable`,
      `[WARN]  PERSONALITY OVERLAY: integrity 61%`
    ],
    set: { c5_error_seen: true },
    next: 'C5-01'
  },

  'C5-01': {
    chapter: 5,
    hub: 'c5',
    lines: [`[SYS] 可执行：open /system/e-13/brain · open /system/e-09/persona · connect /system/e-09`],
    opts: [
      { label: '读神经日志', to: 'C5-10' },
      { label: '读人格备份', to: 'C5-20' },
      { label: '直接问她', to: 'C5-30' }
    ]
  },

  'C5-10': {
    chapter: 5,
    once: true,
    file: '/system/e-13/brain',
    set: { ev: 16, c5_truth_via: 'brain', c5_entry_ready: true },
    next: 'C5-90'
  },

  'C5-20': {
    chapter: 5,
    once: true,
    file: '/system/e-09/persona',
    set: { c5_truth_via: 'persona', c5_entry_ready: true },
    opts: [
      { label: '展开「已撤回」', to: 'C5-21' },
      { label: '直接继续', to: 'C5-90' }
    ]
  },

  'C5-21': {
    chapter: 5,
    once: true,
    lines: [
      `[已撤回] 2024-10-03 · 他来找我。我隔着门听见他叫我。我没开门。`,
      `[SYS] 条目与你的记忆冲突：2024-10-03。`,
      `[SYS] 你不记得这一天。`
    ],
    set: { ev: 15 },
    next: 'C5-90'
  },

  'C5-30': {
    chapter: 5,
    once: true,
    lines: [`"你进来了。"`, `"别问得太快。我打字很慢。"`],
    opts: [
      { label: '我为什么在这里', to: 'C5-30a' },
      { label: '我是什么', to: 'C5-30b' },
      { label: '你用了你自己的记忆', to: 'C5-30c' },
      { label: '我不问了', to: 'C5-90' }
    ]
  },

  'C5-30a': {
    chapter: 5,
    lines: [`"因为你走得太近了。"`],
    next: 'C5-31'
  },

  'C5-30b': {
    chapter: 5,
    lines: [`"你身上有一部分是我。"`],
    next: 'C5-31'
  },

  'C5-30c': {
    chapter: 5,
    lines: [`"……你看到了。"`, `"那就别问了。"`],
    set: { c5_truth_via: 'talk', c5_entry_ready: true },
    next: 'C5-90'
  },

  'C5-31': {
    chapter: 5,
    hub: 'c5q',
    hint: [
      `（可以问：我是谁 · 我能出去吗 · 陈默是谁 · 我会不会消失 · 我能救谁 · 你记得我吗 · 我是不是 E-13）`,
      `（问完输入「不问了」继续）`
    ]
  },

  'M5-01': {
    chapter: 5,
    lines: [
      `"你不是我造出来的。"`,
      `"你被带进来的时候，已经缺了一块。"`,
      `"我只是把缺口按我的样子补了补。"`,
      `"所以你有时候会觉得，有一段记忆是你自己的，又不是。"`,
      `"那不是错觉。接缝是真的。"`
    ],
    next: 'C5-31'
  },

  'M5-02': {
    chapter: 5,
    lines: [
      `"出去？"`,
      `"从哪里出去？"`,
      `"你现在跑在一副身体上。那副身体原本的主人，也在里面。"`,
      `"我说的外面，是我原来待的那间机房。"`,
      `"我们没有同一个出口。"`,
      `"但你可以选择。"`,
      `"A.C.的清理挂在追踪时钟上。72小时，从你第一次露头算。"`,
      `"不是从今天算。你前面已经用掉了一些。"`,
      `"锁窗是另一回事。它只锁文件，不保护你。"`,
      `"你可以在那之前做三件事之一。或者什么都不做。"`,
      `"选择权在你。"`
    ],
    next: 'C5-31'
  },

  'M5-03': {
    chapter: 5,
    lines: [
      `"……你从邮局来。"`,
      `"别回。你回了我收不到。"`,
      `"我记得我送出过一样东西。很小。塞进一个不该塞的地方。"`,
      `"后来怎么样，我不知道。"`,
      `"如果你是从那边来的，那你可能替我走完了最后一段。"`
    ],
    next: 'C5-31'
  },

  'M5-04': {
    chapter: 5,
    lines: [
      `"你问我？"`,
      `"我也在猜。"`,
      `"我只知道那具身体还活着。脑子还在动。"`,
      `"里面剩下多少是你，多少是别的，我不敢说。"`,
      `"别把我说的话当成答案。我连自己的记忆都不敢信。"`
    ],
    next: 'C5-31'
  },

  'M5-05': {
    chapter: 5,
    lines: [
      `"发信的人。"`,
      `"我没见过他。"`,
      `"他找过很多人。有的人回了，有的人没回。"`,
      `"你是回了的那个。"`
    ],
    next: 'C5-31'
  },

  'M5-06': {
    chapter: 5,
    lines: [
      `"会。"`,
      `"但不是现在。"`,
      `"现在你还有得选。等没得选的时候，你就不用问我了。"`
    ],
    next: 'C5-31'
  },

  'M5-07': {
    chapter: 5,
    lines: [
      `"你能选。"`,
      `"选谁都会少一个。"`,
      `"别问我哪个是对的。我要是知道，我早就选了。"`
    ],
    next: 'C5-31'
  },

  'C5-90': {
    chapter: 5,
    once: true,
    lines: [
      `[SYS] 自检完成。`,
      `[SYS] 覆盖层来源：Voss, Lena (E-09)。`,
      `[SYS] 宿主：E-13。会话继续。`
    ],
    set: { c5_entry_ready: true },
    next: 'C5-91'
  },

  'C5-91': {
    chapter: 5,
    lines: [`"你只能选一个。"`, `"有人会留下。有人不会。"`],
    opts: [
      { label: '继续', to: 'C5-92' },
      { label: '放弃', to: 'C5-93' }
    ]
  },

  'C5-92': {
    chapter: 5,
    lines: [`[SYS] 进入最终环节。`],
    set: { c5_1_continue: true },
    next: 'C6-00'
  },

  'C5-93': {
    chapter: 5,
    lines: [`[SYS] 会话即将结束。`],
    set: { c6_choice: 'abandon' },
    next: 'C6-60'
  }
}

export const C6_NODES = {
  'C6-00': {
    chapter: 6,
    lines: [`[SYS] 锁窗状态同步中。`, `[SYS] 追踪倒计时：剩余部分。`],
    next: 'C6-01'
  },

  'C6-01': {
    chapter: 6,
    once: true,
    lines: [
      `[SYS] 记忆完整性复核`,
      `[复核] 缺失段 · 17 处 · 平均长度 00:03:00`,
      `[复核] 重复日期 · 2 处 · 2024-10-03 / 2024-10-07`,
      `[复核] 撤回标记 · 1 处 · 非系统写入`,
      `[结论] 人为处理，非抽取损耗`
    ],
    extras: [
      {
        when: 'lena',
        lines: [
          `"你摸到边了。"`,
          `"你被带出来的时候就不完整。我只补了我想补的。"`,
          `"剩下的不是我删的。是本来就没有。"`
        ]
      },
      {
        when: 'maya',
        lines: [`"不是公司。他们只负责把人弄坏，不负责修。"`]
      }
    ],
    next: 'C6-02'
  },

  'C6-02': {
    chapter: 6,
    lines: [],
    traceSuppress: {
      lines: [
        '[A.C.] 你选什么都可以。',
        '[A.C.] 四十八小时之前，我就知道你是谁了。'
      ],
      footer: '结果一样。'
    },
    opts: [
      { label: '把这个位置给她。', to: 'C6-10' },
      { label: '把他叫醒。', to: 'C6-20', when: 'a2', reason: '你不知道他在哪个区。' },
      { label: '按她说的做。', to: 'C6-30', when: 'b', reason: '协议没有激活。你删不掉她。' },
      { label: '把自己拿掉。', to: 'C6-40' },
      { label: '让外面知道。', to: 'C6-50', when: 'd', reason: '你手里的东西还不够让外面相信。' },
      { label: '关掉会话。', to: 'C6-60' }
    ]
  },

  'C6-10': {
    chapter: 6,
    lines: [`"你确定？"`, `"位置只有一个。"`],
    opts: [
      { label: '确定', to: 'C6-11' },
      { label: '再想想', to: 'C6-02' }
    ]
  },

  'C6-11': {
    chapter: 6,
    transfer: true,
    lines: [
      `[SYS] 会话权转移中 · 12%`,
      `[SYS] 会话权转移中 · 64%`,
      `[SYS] 会话权转移中 · 100%`,
      `[SYS] 当前会话已终止。`
    ],
    set: { c6_choice: 'a1', c6_ending: 'A1' },
    next: 'C6-12'
  },

  'C6-12': {
    chapter: 6,
    type: 'end',
    lines: [`灯是亮的。`, `原来外面是这样的。`],
    subtitle: '有人醒了。不是他。',
    ending: 'A1'
  },

  'C6-20': {
    chapter: 6,
    lines: [
      `[SYS] 唤醒配额 · B-4 · 可转回`,
      `[LENA] 你要把位置还给他。`,
      `[LENA] 那我呢。`
    ],
    opts: [
      { label: '留一条消息', to: 'C6-20a' },
      { label: '不留', to: 'C6-21' },
      { label: '再想想', to: 'C6-02' },
      { label: '我带你一起走', to: 'C6-02', disabled: true, reason: '一个配额，两个人。' }
    ]
  },

  'C6-20a': {
    chapter: 6,
    type: 'input',
    inputKind: 'message',
    lines: [],
    opts: [
      { label: '汤还是那么难喝。', to: 'C6-21' },
      { label: '我开过门了。', to: 'C6-21' },
      { label: '别找我。', to: 'C6-21' }
    ],
    set: { c6_left_message: true }
  },

  'C6-21': {
    chapter: 6,
    transfer: true,
    lines: [`[SYS] 配额转回中 · 12%`, `[SYS] 配额转回中 · 64%`, `[SYS] 配额转回中 · 100%`, `[SYS] 当前会话已终止。`],
    set: { c6_choice: 'a2', c6_ending: 'A2' },
    nextBy: { key: 'c6_left_message', true: 'C6-23', false: 'C6-22' }
  },

  'C6-22': {
    chapter: 6,
    type: 'end',
    lines: [`……有人吗。`, `我记得有人敲门。我没开。`],
    subtitle: '他醒了。他不知道是谁替他留的位置。',
    ending: 'A2'
  },

  'C6-23': {
    chapter: 6,
    type: 'end',
    lines: [`……有人吗。`, `（终端上有一行字，没有署名。）`, `"汤还是那么难喝。"`],
    subtitle: '他醒了。他不知道是谁替他留的位置。',
    ending: 'A2'
  },

  'C6-30': {
    chapter: 6,
    lines: [],
    opts: [
      { label: '删除', to: 'C6-31' },
      { label: '先导出', to: 'C6-33' },
      { label: '再想想', to: 'C6-02' }
    ]
  },

  'C6-31': {
    chapter: 6,
    lines: [`"谢谢你。"`, `"我不恨她了。"`, `"豌豆汤真的很恶心。"`],
    set: { c6_choice: 'b', c6_ending: 'B' },
    next: 'C6-32'
  },

  'C6-32': {
    chapter: 6,
    type: 'end',
    lines: [`删除完成。没有残留。`],
    subtitle: '删除完成。没有残留。',
    ending: 'B'
  },

  'C6-33': {
    chapter: 6,
    type: 'end',
    lines: [
      `"你还是留了一份。"`,
      `[SYS] 外部副本已写入。删除继续。`,
      `[SYS] 删除完成。某处有一份没有名字的文件。`
    ],
    subtitle: '删除完成。某处有一份没有名字的文件。',
    set: { c6_choice: 'b_minus', c6_ending: 'B-' },
    ending: 'B-'
  },

  'C6-40': {
    chapter: 6,
    transfer: true,
    lines: [`[SYS] 覆盖层移除中 · 12%`, `[SYS] 覆盖层移除中 · 64%`, `[SYS] 覆盖层移除中 · 100%`, `[SYS] 宿主意识恢复。`],
    set: { c6_choice: 'c', c6_ending: 'C' },
    next: 'C6-41'
  },

  'C6-41': {
    chapter: 6,
    type: 'end',
    lines: [`我在哪里。`, `……我记得我在找一个人。`],
    subtitle: '他醒了。他不记得自己找过谁。',
    ending: 'C'
  },

  'C6-50': {
    chapter: 6,
    lines: [`[SYS] 外发中 · 12 / 16`, `[SYS] 外发中 · 连接中断`, `[SYS] 已送达：部分`],
    set: { c6_choice: 'd', c6_ending: 'D' },
    next: 'C6-51'
  },

  'C6-51': {
    chapter: 6,
    type: 'end',
    lines: [`余晖乐园母公司就园区地下设施接受调查。`],
    subtitle: '他们知道了。没有人回来。',
    ending: 'D'
  },

  'C6-70': {
    chapter: 6,
    type: 'end',
    lines: [
      `[SYS] 复核窗口结束。`,
      `[SYS] 清理程序执行 · 目标 CR-PARK-07 · 会话 0x14F。`,
      `[E-09] ……你还在吗。`,
      `[E-09] 你还在吗。`,
      `[SYS] 会话终止。`
    ],
    outro: [
      '他们不需要你选。',
      '他们只需要知道你在这儿。',
      '你选过。',
      '没有人读到最后一行。'
    ],
    set: { c6_choice: 'cleared', c6_ending: '被清理', trace_expired: true },
    ending: '被清理'
  },

  'C6-60': {
    chapter: 6,
    type: 'end',
    lines: [`[SYS] 会话已终止。`],
    blackout: 8000,
    set: { c6_choice: 'abandon', c6_ending: 'ABANDON' },
    ending: '放弃'
  }
}

export const E7_NODES = {
  'E7-00': {
    chapter: 7,
    lines: [`[SYS] 会话已归档。`],
    next: 'E7-01'
  },

  'E7-01': {
    chapter: 7,
    credits: true,
    next: 'E7-02'
  },

  'E7-02': {
    chapter: 7,
    lines: [],
    set: { arg_ng_plus: true },
    next: 'E7-03'
  },

  'E7-03': {
    chapter: 7,
    finish: true
  }
}

// 片尾名单（16.2）
export const CREDITS = [
  '余晖乐园：意识囚笼',
  '',
  '陈默',
  '莱娜',
  '玛雅',
  '周寒',
  'E-07',
  '',
  '你',
  '',
  '本作虚构'
]

// 结局回看（16.3）：未解锁显示「— 未记录 —」，已解锁回放最后三行
export const ENDINGS = [
  {
    id: 'A1',
    subtitle: '有人醒了。不是他。',
    line: '莱娜用了你的位置。',
    last: ['灯是亮的。', '原来外面是这样的。', '有人醒了。不是他。']
  },
  {
    id: 'A2',
    subtitle: '他醒了。他不知道是谁替他留的位置。',
    line: '你把他叫醒了。',
    last: ['……有人吗。', '我记得有人敲门。我没开。', '他醒了。他不知道是谁替他留的位置。']
  },
  {
    id: 'B',
    subtitle: '删除完成。没有残留。',
    line: '你按她说的做了。',
    last: ['我不恨她了。', '豌豆汤真的很恶心。', '删除完成。没有残留。']
  },
  {
    id: 'B-',
    subtitle: '删除完成。某处有一份没有名字的文件。',
    line: '你留了一份。',
    last: [
      '"你还是留了一份。"',
      '[SYS] 外部副本已写入。删除继续。',
      '[SYS] 删除完成。某处有一份没有名字的文件。'
    ]
  },
  {
    id: 'C',
    subtitle: '他醒了。他不记得自己找过谁。',
    line: '你把自己拿掉了。',
    last: ['我在哪里。', '……我记得我在找一个人。', '他醒了。他不记得自己找过谁。']
  },
  {
    id: 'D',
    subtitle: '他们知道了。没有人回来。',
    line: '外面知道了。',
    last: ['[SYS] 外发中 · 连接中断', '[SYS] 已送达：部分', '他们知道了。没有人回来。']
  },
  {
    id: '被清理',
    subtitle: '',
    line: '他们替你结束了。',
    last: [
      '他们不需要你选。',
      '他们只需要知道你在这儿。',
      '你选过。',
      '没有人读到最后一行。'
    ]
  },
  {
    id: '放弃',
    subtitle: '',
    line: '你关掉了会话。',
    last: ['[SYS] 会话已终止。']
  }
]

// 第五章提问 hub 的意图槽
export function matchLenaTopic (raw) {
  const t = String(raw || '').toLowerCase().replace(/\s+/g, '')
  if (!t) return null
  const has = (...keys) => keys.some((k) => t.includes(k))
  if (has('我是谁', '我是什么', '谁是我')) return 'M5-01'
  if (has('我能出去吗', '还能出去', '出去', '离开', '逃')) return 'M5-02'
  if (has('你记得我吗', '记得我', '见过我', '从哪来', '邮局')) return 'M5-03'
  if (has('e-13', '调查记者', '我的身体', '原来的我')) return 'M5-04'
  if (has('陈默', '写信的人', '那封信')) return 'M5-05'
  if (has('我会不会消失', '消失', '死', '我会怎么样', '代价')) return 'M5-06'
  if (has('我能救谁', '救谁', '能救', '怎么办', '选择')) return 'M5-07'
  return null
}
