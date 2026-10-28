// 生成匿名访客标识（纯前端，无需后端，不上传任何数据）
// 用 UA + 分辨率 + 时区 + 语言 + 色深 做简单 hash，输出形如 FP-3K7M2N9Q
export function generateFingerprintId() {
  const components = [
    navigator.userAgent,
    screen.width + 'x' + screen.height,
    String(new Date().getTimezoneOffset()),
    navigator.language,
    String(screen.colorDepth)
  ]
  const raw = components.join('|')
  let hash = 0
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) - hash) + raw.charCodeAt(i)
    hash |= 0
  }
  return 'FP-' + Math.abs(hash).toString(36).toUpperCase().padStart(8, '0').slice(0, 8)
}
