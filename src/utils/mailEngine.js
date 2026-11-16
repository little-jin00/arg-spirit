// 邮件与回信规则：纯前端可预测的匹配逻辑，不做语义理解
import { AC_REPLY_LINES, REPLY_RULES } from '../data/mailbox'

export function normalizeText (text) {
  return String(text || '')
    .replace(/[\s，,。.！!？?、；;：:"'“”‘’()（）]/g, '')
    .toLowerCase()
}

export function routeEditorReply (text) {
  const t = normalizeText(text)
  for (const rule of REPLY_RULES.editor) {
    if (rule.match.some((k) => t.includes(normalizeText(k)))) return rule
  }
  return { id: 'neutral', mail: 'm01b_neutral' }
}

export function acTone (text) {
  const t = normalizeText(text)
  if (/不怕|继续|查下去|不会停|你们|滚|威胁/.test(t)) return 'defiant'
  if (/对不起|退出|不敢|不查|放过|求/.test(t)) return 'plead'
  return 'neutral'
}

export function acReplyLine (text) {
  return AC_REPLY_LINES[acTone(text)]
}

export function buildBounce (addr) {
  return {
    id: 'bounce-' + Date.now(),
    from: 'MAILER-DAEMON',
    addr: 'postmaster@postbox.com',
    subject: '无法投递：' + addr,
    preview: '这是一封系统退信。',
    time: '刚刚',
    kind: 'bounce',
    body: [
      '这是一封系统退信。',
      '收件人 ' + addr + ' 不存在或已注销（2019-08-11）。',
      '邮件未送达，原始内容已退回。'
    ]
  }
}

export function buildPressAck () {
  return {
    id: 'ack-press',
    from: '余晖乐园 · 公共关系部',
    addr: 'service@afterglow-park.com',
    subject: '自动回复：您的来信已收到',
    preview: '感谢您的来信。我们会在 3 个工作日内答复。',
    time: '刚刚',
    body: [
      '感谢您的来信。我们会在 3 个工作日内答复。',
      '本邮件为自动回复，请勿直接回复。'
    ]
  }
}

// 二周目钩子：按已解锁结局数分三档（1–2 / 3–5 / 6–7），放弃不计入
// 例外：D（让外面知道）解锁过，无论解锁数多少都用另一版措辞
export function buildPostCredit (endings = []) {
  const core = endings.filter((id) => id !== '放弃').length
  const line = endings.includes('D')
    ? '他们知道了。你呢。'
    : core >= 6
      ? '这次别一个人进去。'
      : core >= 3
        ? '你记得多少。'
        : '你回来过。'
  const body = [line]
  // 第三档（6–7）包含「被清理」时追加一句
  if (core >= 6 && endings.includes('被清理')) {
    body.push('这次别让他们先找到你。')
  }
  return {
    id: 'post_credit',
    from: 'unknown',
    addr: 'unknown@postbox.com',
    subject: '（无主题）',
    preview: line,
    time: '—',
    body
  }
}

export function buildRelayDeadNotice () {
  return {
    id: 'relay-dead-' + Date.now(),
    from: 'Mail Delivery System',
    addr: 'postmaster@postbox.com',
    subject: '退信：e09.relay@postbox.com',
    preview: '该地址已停用，邮件已转交管理员。',
    time: '刚刚',
    kind: 'bounce',
    body: [
      '该地址已停用，邮件已转交管理员。'
    ]
  }
}
