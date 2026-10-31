// 证据卡数据：玩家在各层发现的线索自动归档
export const EVIDENCE = {
  ev_signal: {
    title: 'E-09的求救私信',
    source: '暮色论坛 · 私信',
    time: '2024-10-15 23:47:02',
    desc: '发件人E-09。但论坛最后活跃时间是2019年——一个废弃五年的论坛，为什么还能收到私信？'
  },
  ev_carousel_memo: {
    title: '旋转木马隐藏维护记录',
    source: '官网 /inside/rides/carousel（全选页面可见）',
    time: '未知',
    desc: '隐藏文字提及"低频诱导场参数：2.3Hz alpha wave modulation"与"潜意识采集模块：正常运行中"。维护联系邮箱：marcus.thorne@ceres-reynold.com'
  },
  ev_bait_protocol: {
    title: '诱饵协议备忘录 V2.3',
    source: '终端 /etc/memos/bait_protocol.txt',
    time: '2024年8月更新',
    desc: '签署人Alexander Cross。E-09的求救信号被故意放行，用于标记"吹哨人风险"，清除团队响应时间≤48小时。备忘录末尾记录了本次读取者的追踪标识。'
  },
  ev_e09_fragments: {
    title: 'E-09日志（空白断片）',
    source: '终端 /logs/e-09_fragments.log',
    time: '2024-07-12',
    desc: '"我昨天去了超市。不对，我没有昨天。"日志中存在多处记忆矛盾与空白断片。最后一条："Maya。你还好吗？"'
  },
  ev_marta: {
    title: 'E-07的最后信号',
    source: '终端 /subjects/e-07/console',
    time: '刚刚',
    desc: '"告诉她：妈妈爱她。"在安慰信息送达后，E-07 的信号归零。系统记录：未生成有效样本。她叫 Marta——系统里只剩编号。'
  },
  ev_maya05: {
    title: '扫描件 maya-05',
    source: '终端 /home/kessler/maya-05.scan → 内网 viewer',
    time: '扫描于 2018-04',
    desc: '一幅儿童蜡笔画：一个歪歪扭扭的太阳。纸背有铅笔字"给妈妈"。文件属性显示该扫描件被指定为园区吉祥物"闪闪"的原始设计稿。'
  },
  ev_kessler_journal: {
    title: 'Kessler的工作日志',
    source: '终端 /home/kessler/journal.txt',
    time: '2018-04 至 2021-03',
    desc: '"她应该看看的。""系统里那个恨我。""Maya，妈妈来了。"最后一篇写于2021年3月19日——此后该会话再未活动，也未注销。'
  },
  ev_dusk_archive: {
    title: '暮色论坛归档清单',
    source: '终端 /temp/dusk_archive.enc（密码：论坛归档日期）',
    time: '2019-08-11',
    desc: '删除记录节选：2019-07-02 帖子《我知道旋转木马下面有什么》，存活4小时12分后"应内容安全合作方要求"删除；作者账号注销工单于两周后完成。'
  },
  ev_park_ops: {
    title: '开园日运营日志',
    source: '终端 /logs/park_ops_2018.enc（密码：开园日期）',
    time: '2018-05-20',
    desc: '闭园清场时出口计数 31,204，入园计数 31,207，差额 3。复核结论："无滞留游客"。当晚23:40，B3升降平台运行1次（货运）。'
  },
  ev_maya_backup: {
    title: '加密分区索引 maya-13-7-19',
    source: '终端 /home/kessler/maya_backup.enc（密码：Kessler日志中的日期）',
    time: '最近重置 #117 · 2024-09-30',
    desc: '一个 type=mind.part 的私人分区，未挂载，访问需 PERSEPHONE 控制台。备注只有四个字："不要让她知道。"'
  }
}
