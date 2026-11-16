// 员工门户内的表层谜题数据
// 全部为"公司整理后"的门户记录，与终端原始日志互相印证，但不直接给答案

// ---------- A. 权限申请 ----------
export const REQUEST_TYPES = ['权限开通', '资产借用', '设备借用', '访客通行证']

export const REQUEST_SYSTEMS = [
  'PERSEPHONE 控制台',
  '园区运营系统',
  '邮件服务',
  '门禁与通行证系统'
]

export const ASSET_NODES = [
  { id: 'CR-PARK-01', zone: 'A 区 · 游客服务' },
  { id: 'CR-PARK-03', zone: 'B1 · 设备间' },
  { id: 'CR-PARK-05', zone: 'B2 · 档案库' },
  { id: 'CR-PARK-07', zone: 'B3 · 受试者安置区' },
  { id: 'CR-PARK-09', zone: 'C 区 · 后勤' }
]

export const APPROVERS = [
  { name: '安全运营部值班主管', scope: ['CR-PARK-05', 'CR-PARK-07'] },
  { name: '运维主管', scope: ['CR-PARK-03', 'CR-PARK-09'] },
  { name: '行政部主管', scope: ['CR-PARK-01'] },
  { name: '公共关系部主管', scope: [] }
]

export const REQUEST_TICKETS = ['T-2291', 'T-2292', 'T-2293']

export const AUTH_SLIP = {
  code: 'CR-AUTH-2024-1017',
  node: 'CR-PARK-07',
  zone: 'B3 · 受试者安置区',
  system: 'PERSEPHONE 控制台',
  scope: '只读',
  approver: '安全运营部值班主管',
  ticket: 'T-2293',
  issued: '2024-10-17 09:12',
  valid: '至交接复核完成',
  limits: [
    '不得将分区挂载为可写',
    '不得复制、导出或转存分区内容',
    '全部操作写入审计日志'
  ]
}

export const HANDOVER_DOC = {
  code: 'CR-INC-2019-1104-A',
  title: '事件处置交接单（节选）',
  lines: [
    { h: '基本信息' },
    { p: '关联事件：CR-INC-2019-1104（2019-11-04）' },
    { p: '交接原因：原责任人账号休眠满 5 年，按交接规范转入资产交接流程' },
    { p: '原责任人：kessler.s　接收人：m.thorne' },
    { p: '涉及资产：maya-13-7-19（私人分区 · mind.part）' },
    { p: '所在节点：CR-PARK-07（B3 · 受试者安置区）' },
    { p: '访问方式：PERSEPHONE 控制台 · 只读' },
    { h: '一、交接范围' },
    { p: '分区索引、挂载记录与审计日志，不含分区内容本身。' },
    { h: '二、处置要求' },
    { p: '1. 仅做只读复核，不得挂载、复制或导出。' },
    { p: '2. 复核结论于 10 月 25 日前书面提交安全运营部。' },
    { p: '3. 如发现未登记的外部访问记录，立即上报。' },
    { h: '三、状态' },
    { p: '已授权（只读） · 待复核' }
  ]
}

// ---------- B. 访客与接待 ----------
// 2018 年起电子化归档，按登记日期调阅；2017 年及以前为纸质件
export const VISITOR_ARCHIVE = [
  {
    date: '2018-03-14',
    gate: '东侧门岗',
    visitor: '男 · 51 岁（证件已核验）',
    companions: '无',
    people: '1 人',
    host: 'l.zhou',
    purpose: '设备维保（旋转木马）',
    special: '',
    time: '09:15 入园 · 11:05 离场',
    handover: '由接待人带至设备间。',
    note: '已通过票务系统登记。'
  },
  {
    date: '2018-05-12',
    gate: '东侧门岗',
    visitor: '男 · 46 岁（负责人，证件已核验）',
    companions: '同行 2 人',
    people: '3 人',
    host: '行政部',
    purpose: '绿化养护',
    special: '作业车辆从东侧通道进入。',
    time: '08:40 入园 · 10:20 离场',
    handover: '',
    note: '已通过票务系统登记。'
  },
  {
    date: '2018-07-19',
    gate: '东侧门岗',
    visitor: '女 · 38 岁（负责人，证件已核验）',
    companions: '同行 1 人',
    people: '2 人',
    host: '行政部',
    purpose: '餐饮供货',
    special: '',
    time: '06:50 入园 · 07:35 离场',
    handover: '',
    note: '已通过票务系统登记。'
  },
  {
    date: '2018-11-06',
    gate: '东侧门岗',
    visitor: '男 · 44 岁（证件已核验）',
    companions: '无',
    people: '1 人',
    host: 'm.thorne',
    purpose: '供应商送样',
    special: '',
    time: '14:20 入园 · 15:10 离场',
    handover: '由接待人带至采购部。',
    note: '访客证当日归还。'
  },
  {
    date: '2019-02-21',
    gate: '东侧门岗',
    visitor: '男 · 40 岁（负责人，证件已核验）',
    companions: '同行 1 人',
    people: '2 人',
    host: '安保队',
    purpose: '消防设施检查',
    special: '携带检测设备。',
    time: '10:00 入园 · 11:40 离场',
    handover: '',
    note: '已通过票务系统登记。'
  },
  {
    date: '2019-07-19',
    gate: '东侧门岗',
    visitor: '女 · 35 岁（证件已核验）',
    companions: '同行女童 1 名（6 岁）',
    people: '2 人',
    host: 'm.thorne',
    purpose: '长期照护方案咨询',
    special: '客人怕黑，安排靠灯位。',
    time: '19:40 入园 · 23:10 离场（闭园后）',
    handover: '由内部车辆送至 B 区，转交医疗合作方接待。',
    note: '未通过票务系统出票，计入内部接待。'
  },
  {
    date: '2019-09-03',
    gate: '东侧门岗',
    visitor: '男 · 29 岁（证件已核验）',
    companions: '无',
    people: '1 人',
    host: '行政部',
    purpose: '面试（运维岗）',
    special: '',
    time: '13:30 入园 · 14:15 离场',
    handover: '',
    note: '由接待人全程陪同。'
  },
  {
    date: '2020-01-16',
    gate: '东侧门岗',
    visitor: '男 · 33 岁（负责人，证件已核验）',
    companions: '同行 4 人',
    people: '5 人',
    host: '公共关系部',
    purpose: '演出彩排',
    special: '',
    time: '15:00 入园 · 18:20 离场',
    handover: '由工作人员带至穹顶剧场后台。',
    note: '已通过票务系统登记。'
  },
  {
    date: '2020-06-08',
    gate: '东侧门岗',
    visitor: '女 · 36 岁（证件已核验）',
    companions: '无',
    people: '1 人',
    host: '行政部',
    purpose: '保险查勘',
    special: '',
    time: '09:50 入园 · 10:30 离场',
    handover: '',
    note: '访客证当日归还。'
  },
  {
    date: '2021-03-09',
    gate: '东侧门岗',
    visitor: '男 · 54 岁（证件已核验）',
    companions: '无',
    people: '1 人',
    host: 'm.thorne',
    purpose: '设备维保（旋转木马）',
    special: '',
    time: '09:10 入园 · 11:00 离场',
    handover: '由接待人带至设备间。',
    note: '已通过票务系统登记。'
  },
  {
    date: '2021-08-24',
    gate: '东侧门岗',
    visitor: '女 · 41 岁（负责人，证件已核验）',
    companions: '同行 2 人',
    people: '3 人',
    host: 'l.zhou',
    purpose: '合作机构参观',
    special: '',
    time: '10:20 入园 · 12:05 离场',
    handover: '由工作人员带至员工餐厅。',
    note: '未通过票务系统出票，计入内部接待。'
  },
  {
    date: '2022-04-18',
    gate: '东侧门岗',
    visitor: '男 · 39 岁（证件已核验）',
    companions: '无',
    people: '1 人',
    host: '运维组',
    purpose: '装修测量（B1 设备间',
    special: '',
    time: '14:00 入园 · 15:20 离场',
    handover: '',
    note: '补登：访客证当日归还时未刷卡。'
  },
  {
    date: '2022-06-21',
    gate: '东侧门岗',
    visitor: '女 · 38 岁（负责人，证件已核验）',
    companions: '同行 1 人',
    people: '2 人',
    host: '行政部',
    purpose: '餐饮供货',
    special: '',
    time: '07:05 入园 · 07:45 离场',
    handover: '',
    note: '已通过票务系统登记。'
  },
  {
    date: '2023-02-27',
    gate: '东侧门岗',
    visitor: '男 · 31 岁（证件已核验）',
    companions: '无',
    people: '1 人',
    host: '行政部',
    purpose: '快递交接',
    special: '',
    time: '11:15 入园 · 11:25 离场',
    handover: '',
    note: '补登：访客证当日归还时未刷卡。'
  },
  {
    date: '2023-10-11',
    gate: '东侧门岗',
    visitor: '女 · 34 岁（证件已核验）',
    companions: '同行 1 人',
    people: '2 人',
    host: 'm.thorne',
    purpose: '媒体采访（预约）',
    special: '公共关系部陪同，全程佩戴访客证。',
    time: '14:30 入园 · 15:40 离场',
    handover: '',
    note: '已通过票务系统登记。'
  },
  {
    date: '2024-03-06',
    gate: '东侧门岗',
    visitor: '男 · 47 岁（证件已核验）',
    companions: '无',
    people: '1 人',
    host: 'l.zhou',
    purpose: '旧同事拜访',
    special: '',
    time: '16:00 入园 · 16:40 离场',
    handover: '',
    note: '由接待人全程陪同。'
  },
  {
    date: '2024-05-12',
    gate: '东侧门岗',
    visitor: '男 · 49 岁（负责人，证件已核验）',
    companions: '同行 2 人',
    people: '3 人',
    host: '行政部',
    purpose: '绿化养护',
    special: '作业车辆从东侧通道进入。',
    time: '08:35 入园 · 10:10 离场',
    handover: '',
    note: '已通过票务系统登记。'
  },
  {
    date: '2024-09-23',
    gate: '东侧门岗',
    visitor: '男 · 45 岁（负责人，证件已核验）',
    companions: '同行 1 人',
    people: '2 人',
    host: '运维组',
    purpose: '设备验收',
    special: '',
    time: '09:20 入园 · 10:50 离场',
    handover: '由接待人带至设备间。',
    note: '已通过票务系统登记。'
  }
]

// ---------- C. 文件中心：CR-COMP-014 旧版 ----------
// 与现行 V3.2 对比用；文件中心以“查看差异摘要”直接列出三处差异
export const COMP_V26 = [
  { h: '第 4 条　数据分类' },
  { p: '4.1 本公司业务涉及以下三类数据：' },
  { li: '(a) 合成数据 —— 由算法生成，不含自然人信息；' },
  { li: '(b) 授权采集数据 —— 由签署《健康信息授权协议》的志愿者提供；' },
  { li: '(c) 受试者数据 —— 来源于合作医疗机构，仅限授权人员访问。' },
  { p: '4.2 员工不得自行判断数据类别，分类以数据管理系统中登记的标签为准。' },
  { h: '第 5 条　信息披露' },
  { p: '5.1 未经公共关系部书面授权，员工不得就公司业务、技术方案、合作项目接受任何形式的媒体采访，或在社交平台发表相关言论。' },
  { p: '5.2 涉及数据采集方式、设备参数、园区地下设施的询问，一律转交公共关系部。' },
  { p: '5.3 对外答复应使用公共关系部发布的《答复口径汇编》相应条目，不得自行表述。' },
  { h: '第 6 条　保密义务' },
  { p: '6.1 全体员工须签署《保密与竞业限制协议》。保密义务于离职后继续有效，期限五年。' },
  { p: '6.2 违反第 5 条、第 6 条者，公司有权解除劳动合同、追回已发放的激励，并保留追究法律责任的权利。' },
  { h: '第 7 条　健康与保障' },
  { p: '7.1 员工医疗保险与"意识健康计划"账户绑定，账户状态随在职状态变更。' },
  { p: '7.2 年度体检包含神经健康筛查，结果计入员工健康档案。' },
  { h: '第 8 条　区域通行' },
  { p: '8.1 园区地下层（B1—B4）实行分级授权。B3 及以下区域仅限持红区通行证人员进入。通行证每月复核一次，复核后的持证名单在行政部公告栏公示。' },
  { p: '8.2 设施维护人员不得在未授权情况下进入受试者安置区。相关巡检工单须由运维主管双人签署。' },
  { p: '8.3 通行记录保存十二个月。' },
  { h: '第 9 条　离职交接' },
  { p: '9.1 员工离职时应交回全部通行证、移动存储介质及纸质文件。' },
  { h: '第 10 条　事件上报' },
  { p: '10.1 涉及受试者的事件须在 24 小时内上报伦理委员会，上报材料由合规负责人归档。' },
  { p: '10.2 未经伦理委员会确认，不得对外说明事件经过。' }
]

export const COMP_VERSIONS = {
  v32: {
    key: 'v32',
    code: 'CR-COMP-014',
    version: 'V3.2',
    effective: '2023-04-01',
    state: '现行'
  },
  v26: {
    key: 'v26',
    code: 'CR-COMP-014',
    version: 'V2.6',
    effective: '2019-08-01',
    state: '归档'
  }
}
