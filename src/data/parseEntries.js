// 「解析」独立数据表：按伪文件系统绝对路径索引
// 文案来源：剧情文案总集.md 18.6（20 份文件、87 条）
// 门槛映射：— → 无门槛；read:<path> → file；ev:<id> → evidence；flag:<key> → choice
// 三段结构：what / notes / related，均为列表，每条可单独带门槛
// target 只写在「和什么有关」条目上：文件路径 → type: 'file'，证据 id → type: 'evidence'
// 文案原话未改，只去掉了 Markdown 行内代码的反引号；{{FP}} 由组件替换为当前指纹

export const PARSE_ENTRIES = {
  '/subjects/e-12/vitals.log': {
    what: [
      { text: 'E-12 在 B-4 舱内的生命体征记录，逐日一条。' }
    ],
    notes: [
      { text: '10-08 02:41 一条 motion detected；同条注记 no external stimulus logged。' },
      {
        text: 'NEURAL 由 4% 降至 1%；末行 subject not scheduled for review。',
        evidence: 'ev_e13_brain_log'
      }
    ],
    related: [
      {
        text: '/system/e-13/brain',
        evidence: 'ev_e13_brain_log',
        target: { type: 'file', path: '/system/e-13/brain' }
      }
    ]
  },

  '/subjects/e-07/vitals.log': {
    what: [
      { text: 'E-07 在 B-2 的维生记录，入舱 2019-07-19。' }
    ],
    notes: [
      { text: '持续维生第 1,915 天；镇静 2.1 mg/kg/h；家属探视 0 次。' },
      {
        text: '床旁 console 为单向文本输入，用途写「探视留言」。',
        choice: 'c4_entered'
      }
    ],
    related: [
      {
        text: '/subjects/e-07/console',
        choice: 'c4_entered',
        target: { type: 'file', path: '/subjects/e-07/console' }
      }
    ]
  },

  '/subjects/e-05/vitals.log': {
    what: [
      { text: 'E-05 的完整性记录，可读 512 字节。' }
    ],
    notes: [
      { text: '意识完整性 0%；入组 2021-02-19；最后同步 2023-04-11。' }
    ],
    related: [
      {
        text: '/logs/storage_errors.log',
        choice: 'c4_entered',
        target: { type: 'file', path: '/logs/storage_errors.log' }
      }
    ]
  },

  '/subjects/e-11/trace.dat': {
    what: [
      { text: 'E-11 的轨迹缓冲区。' }
    ],
    notes: [
      { text: '首行 ASCII 为 E-11 trace buffer corrupted；其后为重复损坏字节。' }
    ],
    related: [
      {
        text: '/logs/storage_errors.log',
        choice: 'c4_entered',
        target: { type: 'file', path: '/logs/storage_errors.log' }
      }
    ]
  },

  '/system/maya/reset.log': {
    what: [
      { text: 'Maya-13-7-19 的重置计数表。' }
    ],
    notes: [
      { text: '#001–#116 归并为稳定性不足、情绪溢出、记忆污染三类。' },
      { text: '#117 原因栏为空；操作人 k.s；备注「先别删」。' }
    ],
    related: [
      {
        text: '/system/maya/console',
        file: '/system/maya/console',
        target: { type: 'file', path: '/system/maya/console' }
      }
    ]
  },

  '/system/maya/mourning.txt': {
    what: [
      { text: '哀悼协议条款页，共五条。' }
    ],
    notes: [
      { text: '48 小时锁窗；锁窗期间只读；锁窗结束不自动删除。' },
      { text: '执行人「未指定」；受益人 Maya-13-7-19。' }
    ],
    related: [
      {
        text: '/system/maya/reset.log',
        file: '/system/maya/reset.log',
        target: { type: 'file', path: '/system/maya/reset.log' }
      }
    ]
  },

  '/system/maya/console': {
    what: [
      { text: 'Maya 节点的删除队列与控制台信息。' }
    ],
    notes: [
      { text: 'E-07 已完成；E-10 待执行；Maya 暂停。' },
      { text: '操作人 k.s；最近访问 2024-09-30 02:14。' }
    ],
    related: [
      {
        text: '/system/maya/reset.log',
        evidence: 'ev_maya_reset_log',
        target: { type: 'file', path: '/system/maya/reset.log' }
      }
    ]
  },

  '/home/kessler/journal.txt': {
    what: [
      { text: 'Kessler 的私人日志，五条，2018–2021。' }
    ],
    notes: [
      { text: '2018-04-02 吉祥物方案附 maya-05.scan，来源写「家庭资料」。' },
      { text: '2019-11-04 记录「E-09（Lena Voss）处置完成。22:31」。' },
      { text: '2021-03-19「Thorne 不知情。Cross 只负责资金」。' }
    ],
    related: [
      {
        text: '/etc/memos/incident_2019.txt',
        file: '/etc/memos/incident_2019.txt',
        target: { type: 'file', path: '/etc/memos/incident_2019.txt' }
      },
      {
        text: '/home/kessler/maya-05.scan',
        file: '/home/kessler/maya-05.scan',
        target: { type: 'file', path: '/home/kessler/maya-05.scan' }
      }
    ]
  },

  '/home/kessler/maya_backup.enc': {
    what: [
      { text: '私人分区索引，需密码。' }
    ],
    notes: [
      { text: 'maya-13-7-19；type=mind.part；挂载状态「未挂载」。' },
      { text: '访问需 PERSEPHONE 控制台；最近重置 #117；备注「不要让她知道」。' }
    ],
    related: [
      {
        text: '/system/maya/reset.log',
        file: '/system/maya/reset.log',
        target: { type: 'file', path: '/system/maya/reset.log' }
      }
    ]
  },

  '/home/kessler/maya-05.scan': {
    what: [
      { text: '一份二进制扫描件。' }
    ],
    notes: [
      { text: '终端仅输出 __BINARY_SCAN__，无文本。' }
    ],
    related: [
      {
        text: '/home/kessler/journal.txt',
        file: '/home/kessler/journal.txt',
        target: { type: 'file', path: '/home/kessler/journal.txt' }
      }
    ]
  },

  '/logs/e-09_fragments.log': {
    what: [
      { text: 'E-09 节点的碎片输出日志。' }
    ],
    notes: [
      { text: '2024-07-12「我没有『昨天』。我没有『超市』」。' },
      { text: '2024-07-19「系统没有纠正我」；四号房间门牌无字；钢琴声中段停止。' },
      { text: '2024-07-26 记录 E-10 的呼吸为采样。' },
      { text: '2024-08-02 自述忘记母亲的声音与姓名。' }
    ],
    related: [
      {
        text: '/system/maya/mourning.txt',
        evidence: 'ev_mourning_protocol',
        target: { type: 'file', path: '/system/maya/mourning.txt' }
      }
    ]
  },

  '/system/e-13/brain': {
    what: [
      { text: 'E-13 节点的运行日志。' }
    ],
    notes: [
      { text: '2024-10-07 21:40 进园；22:06 搜索「陈默 / 余晖乐园 / 旋转木马」；23:47 会话中断。' },
      { text: '结论行「无外部接口。输入来源未知。」' }
    ],
    related: [
      {
        text: '/subjects/e-12/vitals.log',
        file: '/subjects/e-12/vitals.log',
        target: { type: 'file', path: '/subjects/e-12/vitals.log' }
      }
    ]
  },

  '/system/e-09/persona': {
    what: [
      { text: '未提交的人格覆盖草稿。' }
    ],
    notes: [
      { text: '保留项：气味、声音、情绪。' },
      { text: '已撤回：2024-10-03「他来找我……我没开门」。' },
      { text: '待覆盖：身份「调查记者（借用）」。' }
    ],
    related: [
      {
        text: '/system/e-13/brain',
        evidence: 'ev_e13_brain_log',
        target: { type: 'file', path: '/system/e-13/brain' }
      }
    ]
  },

  '/etc/memos/incident_2019.txt': {
    what: [
      { text: '2019-11-04 的内部事件报告，后半段损坏。' }
    ],
    notes: [
      { text: 'E-09 意识波动，22:17 起约 4 分钟。' },
      { text: '22:23 紧急冻结；处置人一栏之后不可读。' }
    ],
    related: [
      {
        text: '/home/kessler/journal.txt',
        file: '/home/kessler/journal.txt',
        target: { type: 'file', path: '/home/kessler/journal.txt' }
      }
    ]
  },

  '/etc/memos/bait_protocol.txt': {
    what: [
      { text: '内部备忘录 CR-SEC-2024-0817，V2.3。' }
    ],
    notes: [
      { text: 'E-09 出口通道不阻断；部署溯源脚本采集访客指纹。' },
      { text: '命中会话标记 P1，48 小时内复核；留存 24 个月。' },
      { text: '页尾登记本次读取的指纹 {{FP}}。' }
    ],
    related: [
      {
        text: '/logs/system.log',
        file: '/logs/system.log',
        target: { type: 'file', path: '/logs/system.log' }
      }
    ]
  },

  '/logs/park_ops_2018.enc': {
    what: [
      { text: '2018-05-20 开园日运营日志，加密存档。' }
    ],
    notes: [
      { text: '闭园时入园 31,207、出园 31,204，差额 3。' },
      { text: '22:10 复核结论「无滞留游客，监控回放正常」。' }
    ],
    related: [
      {
        text: '/home/kessler/journal.txt',
        file: '/home/kessler/journal.txt',
        target: { type: 'file', path: '/home/kessler/journal.txt' }
      }
    ]
  },

  '/temp/dusk_archive.enc': {
    what: [
      { text: '暮色论坛 2019-08-11 的归档清单。' }
    ],
    notes: [
      { text: '主题 46,213；回复 318,977；注册用户 12,084。' },
      { text: '2019-07-02《我知道旋转木马下面有什么》存活 4 小时 12 分；原因「应内容安全合作方要求」；作者账号 07-16 注销。' }
    ],
    related: [
      {
        text: '/system/e-09/persona',
        choice: 'c5_entry_ready',
        target: { type: 'file', path: '/system/e-09/persona' }
      }
    ]
  },

  '/logs/system.log': {
    what: [
      { text: 'CR-PARK-07 的系统事件流水。' }
    ],
    notes: [
      { text: '三条 user.session … REVOKE · reason=policy_violation。' },
      { text: '2024-10-05 23:46:58 session.grant 0x14F；operator=marcus.thorne；ttl=permanent。' },
      { text: '4 秒后 user.session 0x14F · src=ext · route=forum/dm。' }
    ],
    related: [
      {
        text: '/etc/memos/bait_protocol.txt',
        file: '/etc/memos/bait_protocol.txt',
        target: { type: 'file', path: '/etc/memos/bait_protocol.txt' }
      },
      {
        text: '/system/maya/mourning.txt',
        evidence: 'ev_mourning_protocol',
        target: { type: 'file', path: '/system/maya/mourning.txt' }
      }
    ]
  },

  '/logs/ops_schedule.log': {
    what: [
      { text: '园区四个设施的每日任务排期。' }
    ],
    notes: [
      { text: '旋转木马低频诱导场 2.3Hz；过山车心率采样 500Hz。' },
      { text: '剧场暗示语料库 v7，本周期 42 条；穹顶四个采集窗口。' },
      { text: '每场之间停 3 小时，备注「与维护窗口对齐」。' }
    ],
    related: [
      {
        text: '/logs/park_ops_2018.enc',
        choice: 'c4_entered',
        target: { type: 'file', path: '/logs/park_ops_2018.enc' }
      }
    ]
  },

  '/logs/storage_errors.log': {
    what: [
      { text: 'sdb3 的坏块与重建记录。' }
    ],
    notes: [
      { text: '坏块 1,284 → 1,349。' },
      { text: '04-06 重建搬移 1,349 块；41 处「不可校验区段」标记永久失效。' }
    ],
    related: [
      {
        text: '/subjects/e-05/vitals.log',
        choice: 'c4_entered',
        target: { type: 'file', path: '/subjects/e-05/vitals.log' }
      },
      {
        text: '/subjects/e-11/trace.dat',
        choice: 'c4_entered',
        target: { type: 'file', path: '/subjects/e-11/trace.dat' }
      }
    ]
  }
}

export function getParseEntry (path) {
  return PARSE_ENTRIES[path] || null
}

// 单条门槛：证据 / 状态标记 / 文件已读；都没写则视为无门槛
function gateOpen (item, { evidenceIds = [], choices = {}, readFiles = [] } = {}) {
  if (item.evidence) return evidenceIds.includes(item.evidence)
  if (item.choice) return !!choices[item.choice]
  if (item.file) return readFiles.includes(item.file)
  return true
}

// 每次调用都按当前进度重新过滤，不缓存结果
export function visibleItems (items, ctx) {
  return (items || []).filter((item) => gateOpen(item, ctx))
}
