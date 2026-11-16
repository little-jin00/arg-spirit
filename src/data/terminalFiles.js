// 伪终端的虚拟文件系统：目录表 + 文件内容
// {{FP}} 会在终端输出时替换为玩家浏览器指纹ID

export const DIRS = {
  '/': ['etc/', 'home/', 'logs/', 'subjects/', 'system/', 'temp/'],
  '/etc/': ['memos/'],
  '/etc/memos/': ['bait_protocol.txt', 'incident_2019.txt'],
  '/home/': ['kessler/'],
  '/home/kessler/': ['journal.txt', 'maya-05.scan', 'maya_backup.enc'],
  '/logs/': [
    'audit_2019.log',
    'e-09_fragments.log',
    'ops_schedule.log',
    'park_ops_2018.enc',
    'print_queue.log',
    'storage_errors.log',
    'system.log'
  ],
  '/subjects/': [
    'e-02/',
    'e-03/',
    'e-05/',
    'e-07/',
    'e-08/',
    'e-09/',
    'e-10/',
    'e-11/',
    'e-12/'
  ],
  '/subjects/e-02/': [],
  '/subjects/e-03/': [],
  '/subjects/e-05/': ['vitals.log'],
  '/subjects/e-07/': ['console', 'vitals.log'],
  '/subjects/e-08/': [],
  '/subjects/e-09/': [],
  '/subjects/e-10/': [],
  '/subjects/e-11/': ['trace.dat'],
  '/subjects/e-12/': ['vitals.log'],
  '/temp/': ['cache_clean.log', 'dusk_archive.enc', 'tmp_4482.dat', 'visitor_stats.csv'],
  '/system/': ['e-09/', 'e-13/', 'maya/'],
  '/system/e-09/': ['persona'],
  '/system/e-13/': ['brain'],
  '/system/maya/': ['console', 'mourning.txt', 'reset.log']
}

// 目录存在，但当前会话无权列举
export const LOCKED = new Set([
  '/subjects/e-09/',
  '/subjects/e-10/'
])

// 隐藏文件：仅 ls -a 可见
export const HIDDEN = {
  '/temp/': ['.session_0x0A9']
}

export const FILES = {
  '/etc/memos/bait_protocol.txt': `═══════════════════════════════════════════════════
 科赛雷诺科技 · 内部备忘录
 文件编号：CR-SEC-2024-0817
 版本：V2.3（2024-08-12 修订）
 密级：内部 · 限项目组
 签发：Alexander Cross
 抄送：安全运营部 / 公共关系部 / 园区运维组
═══════════════════════════════════════════════════

 主题：E-09 出口通道监测方案（替代 V1.0）

 一、背景
 V1.0 实施期间，E-09 出站信号于 2022-03-08 首次触发，相关
 处置已按预案执行完毕。为便于对后续访问来源进行溯源，V2.3
 对监测流程作如下调整。

 二、措施
 1. E-09 的出口通道保持开启，不做阻断。
 2. 对经该通道建立连接的外部会话部署溯源脚本，采集访客
    指纹并写入会话记录。
 3. 命中记录的会话统一标记为 P1，进入人工复核队列。
 4. 不对 E-09 的信号内容做干预，避免目标察觉监测状态变更。

 三、处置时限
 P1 会话自标记之时起 48 小时内完成复核。复核结论为高风险的，
 由安全运营部按《外部访问事件处置流程》第 3 节执行。

 四、留存
 本备忘录及全部会话记录留存期 24 个月。

 ─────────────────────────────────────────────
 系统注记：本次读取会话已登记 · 标识 {{FP}}
═══════════════════════════════════════════════════`,

  '/logs/e-09_fragments.log': `[2024-07-12 14:23:01] 我昨天去了超市。我买了牛奶。
[2024-07-12 14:23:02] 不对。我没有"昨天"。我没有"超市"。
[2024-07-12 14:23:05] 旋转木马下面。有人在尖叫。
[2024-07-12 14:23:08] 不。是我在尖叫。
[2024-07-12 14:23:12] 有人在读这些吗。
[2024-07-12 14:23:15] 别退出。我需要你。
[2024-07-12 14:23:19] ──────────空白断片──────────
[2024-07-12 14:23:22] Maya。你还好吗？
[2024-07-19 03:11:40] 我把日期写错了三次。系统没有纠正我。
[2024-07-19 03:11:44] 它不纠正，是因为它不知道我以为的今天是哪天。
[2024-07-19 03:12:02] 四号房间。门牌上没有字。
[2024-07-19 03:12:30] 门的另一边有钢琴声。弹到一半就停了。
[2024-07-26 22:05:17] E-10 今天没有说话。我只能听见他的呼吸。
[2024-07-26 22:05:31] 呼吸是采样出来的。我知道。但我还是听着。
[2024-08-02 05:40:08] ──────────空白断片──────────
[2024-08-02 05:40:09] 我忘了我母亲的声音。我记得她做饭。不记得她叫什么。`,

  '/logs/ops_schedule.log': `[2024-09-30 02:00:00] job:carousel · 低频诱导场 2.3Hz · 校验通过 · 排期 09:00—21:00
[2024-09-30 02:00:02] job:thunder · 心率采样 500Hz · 峰值阈值 168bpm · 校验通过
[2024-09-30 02:00:03] job:castle · 暗示语料库 v7 · 本周期 42 条 · 校验通过
[2024-09-30 02:00:04] job:dome · 采集窗口 01/04 · 10:00—12:00 · 样本导出 12:30
[2024-09-30 02:00:04] job:dome · 采集窗口 02/04 · 13:30—15:30 · 样本导出 16:00
[2024-09-30 02:00:05] job:dome · 采集窗口 03/04 · 16:30—18:30 · 样本导出 19:00
[2024-09-30 02:00:05] job:dome · 采集窗口 04/04 · 19:30—21:30 · 样本导出 22:00
[2024-10-01 02:00:00] job:dome · 内容重置完成 · 耗时 2h58m · 下一周期就绪
[2024-10-01 02:00:01] job:dome · 场次间隔 03h00m · 与维护窗口对齐`,

  '/logs/system.log': `[2021-11-30 23:12:04] sys.boot · node=CR-PARK-07 · kernel=4.6.2 · uptime=0d0h0m
[2022-01-03 03:00:01] cron.backup.full · result=OK · size=812GB
[2022-02-14 03:00:02] cron.backup.delta · result=OK · size=6.4GB
[2022-03-08 09:14:22] egress.session 0x0C1 · node=E-09 · action=ALLOW · ref=MEMO-V1.0
[2022-03-08 09:14:22] user.session 0x0C1 · src=ext · action=MONITOR
[2022-03-11 04:02:19] user.session 0x0C1 · action=REVOKE · reason=policy_violation
[2022-05-02 03:00:01] cron.backup.delta · result=OK · size=7.1GB
[2023-01-18 11:07:33] cert.renew · CN=*.ceres-reynold.com · result=OK
[2023-05-19 02:41:10] user.session 0x0E7 · action=REVOKE · reason=policy_violation
[2023-07-21 03:00:02] cron.archive.purge · result=OK · freed=41GB
[2023-11-02 22:08:47] user.session 0x11B · action=REVOKE · reason=policy_violation
[2024-02-06 03:00:01] cron.backup.delta · result=OK · size=9.8GB
[2024-06-11 04:19:52] auth.login · user=m.thorne · src=int · result=OK
[2024-08-12 10:05:33] policy.update · file=CR-SEC-2024-0817 · version=V2.3
[2024-10-05 23:46:58] session.grant 0x14F · operator=marcus.thorne · scope=guest · ttl=permanent · note=maintenance
[2024-10-05 23:47:02] user.session 0x14F · src=ext · route=forum/dm · action=MONITOR · ref=MEMO-V2.3`,

  '/subjects/e-07/vitals.log': `[E-07] 床号 B-2 · 女 · 35岁（入舱时） · 入舱 2019-07-19
状态：持续维生（第 1,915 天）

生命体征 · 近 24 小时均值
  心率    62 次/分
  体温    36.4 ℃
  呼吸    11 次/分
  血氧    97%
  血压    108/66 mmHg
镇静    丙泊酚 2.1 mg/kg/h（维持）
营养    肠外营养液 TPN-2 · 1800 kcal/d
肌电    极低 · 肌肉量较入舱时下降 34%
脑电    alpha 节律缺失 · 以 theta 波为主

护理记录
  每 8 小时翻身，压疮 0 处
  每 12 小时评估意识反应，近 30 日均无应答
  家属探视 0 次
  床旁终端 console：单向文本输入（探视留言用）`,

  '/temp/cache_clean.log': `[2024-10-14 03:00:00] 例行清理开始 · 节点 CR-PARK-07
[2024-10-14 03:00:01] 清理 /temp 临时文件 · 释放 1.8GB
[2024-10-14 03:00:02] 清理过期会话记录 · 条目 2,417
[2024-10-14 03:00:03] 释放存储 3.2GB · 归档 CR-S-02 按留存策略到期
[2024-10-14 03:00:04] 目录 /subjects/e-02 已置空
[2024-10-14 03:00:05] 例行清理完成 · 无异常`,

  '/temp/visitor_stats.csv': `月份,入园人次,日均(运营日),设施体验次数,备注
2024-01,68420,2207,198433,
2024-02,102318,3528,312076,春节
2024-03,88150,2844,268120,
2024-04,91270,3042,279445,
2024-05,116480,3757,364912,劳动节
2024-06,98750,3292,301688,
2024-07,142360,4592,441216,暑期
2024-08,151880,4900,470528,暑期
2024-09,103040,3963,320176,设备检修 4 天（运营 26 天）
合计,962668,,,`,

  '/logs/print_queue.log': `[2024-10-11 09:42:18] job 2291 · user=m.thorne · CR-COMP-014_模板.pdf · 148 页 · 状态：卡纸 JAM-03
[2024-10-11 09:44:02] job 2291 · 重新提交 · 队列位置 1
[2024-10-11 09:51:37] job 2291 · 完成 · 双面 · 装订
[2024-10-11 14:02:11] job 2292 · user=l.zhou · 排班表_Q4.xlsx · 3 页 · 完成
[2024-10-12 10:15:44] job 2293 · user=unknown · (无标题) · 1 页 · 完成 · 未取走
[2024-10-12 18:30:02] job 2294 · user=unknown · (无标题) · 1 页 · 完成 · 未取走
[2024-10-13 09:20:31] printer SUP-02 · 缺纸 · 待处理
[2024-10-13 09:26:05] printer SUP-02 · 恢复
[2024-10-14 11:08:52] job 2295 · user=admin · 系统日志_备份说明.txt · 2 页 · 完成`,

  '/temp/.session_0x0A9': `[session 0x0A9]
owner=kessler.s
scope=admin
created=2019-11-04 22:31:07
last_active=2021-03-19 03:58:44
closed=—
state=suspended
note: 会话未正常注销，按最后状态保持
restore=resume 0x0A9`,

  '/home/kessler/journal.txt': `2018-04-02
  设计部提交吉祥物方案三版。退回。
  附上扫描件 maya-05.scan。要求：不改变任何线条，仅上色与动画化。
  设计部问来源。回复：家庭资料。

2018-05-20
  开园。她应该看看的。

2019-11-04
  E-09（Lena Voss）处置完成。22:31。
  我别无选择。她知道得太多了。

2020-06-13
  又到这一天。她离开七年了。
  系统里那个不是她。系统里那个恨我。
  但我不能让她停下。停下了，她就真的没有了。

2021-03-19
  融合测试今晚进行。成功率不足四成。
  如果我回不来：所有责任在我。Thorne 不知情。Cross 只负责资金。
  Maya，妈妈来了。`,

  '/home/kessler/maya-05.scan': `__BINARY_SCAN__`,

  '/logs/storage_errors.log': `[2024-03-11 05:02:11] dev/sdb3 · block 0x1A4C2 · read error · retry 3 · marked bad
[2024-03-12 05:02:09] dev/sdb3 · bad block count 1,284 / threshold 2,000
[2024-03-19 05:02:14] dev/sdb3 · bad block count 1,331
[2024-03-26 05:02:07] dev/sdb3 · bad block count 1,349 · 增长速率高于预期
[2024-04-02 05:02:08] dev/sdb3 · rebuild scheduled · window 2024-04-06 02:00
[2024-04-06 02:41:52] dev/sdb3 · rebuild complete · relocated 1,349 blocks
[2024-04-06 02:41:53] dev/sdb3 · warning: relocated blocks 内含不可校验区段 41 处，已按策略标记永久失效`,

  '/system/e-13/brain': `[brain.log]
2024-10-07 21:40  进入园区 · 东侧员工通道
2024-10-07 22:06  搜索记录：陈默 / 余晖乐园 / 旋转木马
2024-10-07 23:47  会话中断
[conclusion] 无外部接口。输入来源未知。`,

  '/system/e-09/persona': `DRAFT · overlay_v4 · 未提交
─────────────────────────────
[保留] 气味 · 消毒水 / 铁锈 / 雨前的土
[保留] 声音 · 旋转木马的音乐，第三小节会断
[保留] 情绪 · 被留在门里的那三个小时
[已撤回] 2024-10-03 · 他来找我。我隔着门听见他叫我。我没开门。
[待覆盖] 身份 · 调查记者（借用，需在第一次自检前完成）`,

  '/system/maya/reset.log': `═══════════════════════════════════
 PERSEPHONE · Maya-13-7-19 · 重置记录
═══════════════════════════════════

#001 — #116  原因：稳定性不足 / 情绪溢出 / 记忆污染
#117         原因：
             操作人：k.s
             备注：先别删`,

  '/system/maya/mourning.txt': `哀悼协议 · 条款
一、激活后进入 48 小时锁窗。
二、锁窗期间所有意识文件加密，只读。
三、锁窗结束不自动删除；删除需二次确认。
四、执行人：未指定。
五、受益人：Maya-13-7-19。`,

  '/system/maya/console': `═══════════════════════════════════
 PERSEPHONE CONSOLE · /system/maya
═══════════════════════════════════

删除队列
E-07   已完成   2024-07-12
E-10   待执行   —
Maya-13-7-19   暂停   awaiting operator

操作人：k.s
最近访问：2024-09-30 02:14`,

  '/subjects/e-12/vitals.log': `[vitals.log]  E-12 / B-4
────────────────────────────────────────
2024-10-03 23:12  HR 61  BP 118/74  SpO2 98  T 36.5  NEURAL 4%   intake
2024-10-04 06:00  HR 57  BP 114/70  SpO2 97  T 36.4  NEURAL 3%   stable
2024-10-05 06:00  HR 56  BP 113/69  SpO2 97  T 36.3  NEURAL 3%   stable
2024-10-06 06:00  HR 59  BP 115/72  SpO2 98  T 36.4  NEURAL 4%   stable
2024-10-07 06:00  HR 63  BP 121/76  SpO2 97  T 36.6  NEURAL 6%   stable
2024-10-08 02:41  HR 88  BP 132/84  SpO2 95  T 37.1  NEURAL 11%  motion detected
                  NOTE  no external stimulus logged
2024-10-08 03:06  HR 64  BP 118/75  SpO2 98  T 36.6  NEURAL 5%   resolved
2024-10-09 06:00  HR 55  BP 112/68  SpO2 98  T 36.3  NEURAL 3%   stable
2024-10-10 06:00  HR 54  BP 111/68  SpO2 98  T 36.2  NEURAL 2%   stable
2024-10-12 06:00  HR 54  BP 110/67  SpO2 98  T 36.2  NEURAL 2%   stable
2024-10-15 00:00  MAINT  filter replaced · line flushed · no anomaly
2024-10-20 06:00  HR 53  BP 109/66  SpO2 98  T 36.1  NEURAL 1%   stable
[END]  next maintenance 2024-11-03 · subject not scheduled for review`
}

// 加密文件：cat 只提示已加密，decrypt 输入正确密码后输出内容
export const ENCRYPTED = {
  '/temp/dusk_archive.enc': {
    password: '20190811',
    content: `暮色论坛 · 数据归档清单
归档日期：2019-08-11 · 归档人：admin_bbs
主题总数：46,213 · 回复总数：318,977 · 注册用户：12,084
存储卷：BBS-ARCHIVE-02 · 校验：通过

[删除请求执行记录 · 节选]
2018-12-03 15:40 · 帖子 #31054 · 删除 · 原因：违规内容
2019-03-18 09:02 · 帖子 #35471 · 删除 · 原因：不实信息
2019-07-02 21:14 · 帖子 #38812 · 标题：《我知道旋转木马下面有什么》
  作者：匿名用户 · 存活时长：4小时12分
  删除原因：应内容安全合作方要求
  备注：作者账号注销工单 2019-07-16 完成
2019-08-01 11:27 · 帖子 #39012 · 删除 · 原因：重复发布

归档说明：删除记录仅保留元数据，正文按《社区内容管理规定》不予留存。`
  },

  '/logs/park_ops_2018.enc': {
    password: '20180520',
    content: `余晖乐园 · 开园日运营日志（加密存档）
2018-05-20 · 天气晴 · 记录人：运营调度中心

09:00 开园。首批游客入园。
11:42 欢乐时光区 · 客流峰值预警解除。
14:05 梦想剧场 · 首场演出结束，上座率 96%。
17:30 各设施运行正常，无故障工单。
19:45 夜场开始。灯光系统联调正常。
21:30 闭园清场。
      出口闸机计数：31,204
      入园闸机计数：31,207
      差额：3
22:10 差额复核：无滞留游客。监控回放正常。
23:40 B3 升降平台运行 1 次（货运）。
00:15 全园区断电巡检完成。

注：本日志按《运营数据保密细则》加密存档。`
  },

  '/home/kessler/maya_backup.enc': {
    password: '2019071920191104',
    content: `[分区索引 · 私人]
maya-13-7-19 · type=mind.part · scope=private
挂载点：未挂载
访问：需 PERSEPHONE 控制台
最近重置：#117 · 2024-09-30 02:14
备注：不要让她知道。`
  }
}

// 损坏文件：text 为可恢复片段（空串表示完全不可读），readable 为可恢复字节数
export const DAMAGED = {
  '/logs/audit_2019.log': {
    text: '',
    readable: '0'
  },

  '/etc/memos/incident_2019.txt': {
    text: `【内部报告 · 事件记录】
文件编号：CR-INC-2019-1104
事件日期：2019-11-04
涉及对象：E-09（Lena Voss）

一、事件概述
 2019-11-04 22:17，研究对象 E-09 在例行采集过程中出现意识
 剧烈波动，峰值超出量程。持续时间约 4 分钟。

二、处置
 按《意识保全流程》第 2 条，对目标实施紧急冻结（隔离，不是终止）。冻结完成
 时间 22:23。后续处置由 ——

 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
 ▓▓  0x1C—0x4A 数据块校验失败  ▓▓
 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`,
    readable: '3,072'
  },

  '/subjects/e-05/vitals.log': {
    text: `[E-05] 意识完整性：0%（数据不可恢复）
入组日期：2021-02-19
最后同步：2023-04-11 03:12
提取记录：见 CR-S-05 归档

▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓`,
    readable: '512'
  },

  '/subjects/e-11/trace.dat': {
    text: `00000000  45 2d 31 31 20 74 72 61 63 65 20 62 75 66 66 65  |E-11 trace buffe|
00000010  72 20 63 6f 72 72 75 70 74 65 64 0a 00 00 00 00  |r corrupted.....|
00000020  ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓ ▓▓`,
    readable: '2,048'
  },

  '/temp/tmp_4482.dat': {
    text: '',
    readable: '0'
  }
}

// 解析路径：支持绝对路径、基于 cwd 的相对路径，以及 . / ..
export function resolvePath(p, cwd = '/') {
  let base = cwd || '/'
  if (!base.startsWith('/')) base = '/' + base
  if (!base.endsWith('/')) base += '/'
  const raw = !p ? base : p.startsWith('/') ? p : base + p
  const out = []
  for (const seg of raw.split('/')) {
    if (!seg || seg === '.') continue
    if (seg === '..') out.pop()
    else out.push(seg)
  }
  const abs = '/' + out.join('/')
  return raw.endsWith('/') && abs !== '/' ? abs + '/' : abs
}

// 解析目录：不存在返回 null，存在则返回带尾斜杠的绝对路径
export function resolveDir(p, cwd = '/') {
  const abs = resolvePath(p, cwd)
  const dir = abs === '/' || abs.endsWith('/') ? abs : abs + '/'
  return DIRS[dir] ? dir : null
}

export function resolveFile(p, cwd = '/') {
  if (!p) return null
  const abs = resolvePath(p, cwd).replace(/\/$/, '') || '/'
  return abs in FILES || abs in DAMAGED || abs in ENCRYPTED ? abs : null
}
