// 结局环境音 + 陈默醒来配音（无音频资产时的现场合成替身）
// 总开关关闭时：不创建 AudioContext、不播、不抛错，剧情推进不受影响。

let enabled = true
let ctx = null
let master = null
let noiseBuffer = null
let ambientNodes = []
let ambientTimers = []
let currentEnding = ''

export function setAudioEnabled (value) {
  enabled = !!value
  if (!enabled) stopAllAudio()
}

export function isAudioEnabled () {
  return enabled
}

// 必须在用户交互（点击 / 回车）里调用一次，浏览器才允许 AudioContext 启动
export function unlockAudio () {
  if (!enabled) return
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      ctx = new AC()
      master = ctx.createGain()
      master.gain.value = 0.9
      master.connect(ctx.destination)
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  } catch (e) {
    // 没有音频设备 / 被浏览器拒绝时静默
  }
}

function getNoise () {
  if (!ctx) return null
  if (noiseBuffer) return noiseBuffer
  const len = ctx.sampleRate * 2
  noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  return noiseBuffer
}

function track (...nodes) {
  ambientNodes.push(...nodes)
}

function startHum (p) {
  const gain = ctx.createGain()
  gain.gain.value = p.gain
  gain.connect(master)

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = p.cutoff || 420
  lp.Q.value = 0.7
  lp.connect(gain)

  const o1 = ctx.createOscillator()
  o1.type = 'sawtooth'
  o1.frequency.value = p.base
  o1.connect(lp)

  const o2 = ctx.createOscillator()
  o2.type = 'sawtooth'
  o2.frequency.value = p.base * 1.2 + 0.7
  o2.connect(lp)

  const lfo = ctx.createOscillator()
  lfo.frequency.value = p.lfo || 6
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = p.gain * 0.35
  lfo.connect(lfoGain)
  lfoGain.connect(gain.gain)

  o1.start()
  o2.start()
  lfo.start()
  track(o1, o2, lfo, gain, lp, lfoGain)
}

function startRain (p) {
  const src = ctx.createBufferSource()
  src.buffer = getNoise()
  src.loop = true

  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = p.highpass || 700

  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = p.cutoff || 5200

  const gain = ctx.createGain()
  gain.gain.value = p.gain
  src.connect(hp)
  hp.connect(lp)
  lp.connect(gain)
  gain.connect(master)
  src.start()
  track(src, hp, lp, gain)

  // 雨滴：随机带通噪声短脉冲
  const timer = setInterval(() => {
    if (!enabled || !ctx) return
    try {
      const t = ctx.currentTime
      const burst = ctx.createBufferSource()
      burst.buffer = getNoise()
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 1200 + Math.random() * 2600
      bp.Q.value = 6
      const eg = ctx.createGain()
      eg.gain.setValueAtTime(0.0001, t)
      eg.gain.linearRampToValueAtTime(p.dropGain || 0.03, t + 0.005)
      eg.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
      burst.connect(bp)
      bp.connect(eg)
      eg.connect(master)
      burst.start(t)
      burst.stop(t + 0.12)
    } catch (e) {
      // 单次脉冲失败不影响整体
    }
  }, p.dropInterval || 900)
  ambientTimers.push(timer)
}

function startSteps (p) {
  // 走廊底噪
  const src = ctx.createBufferSource()
  src.buffer = getNoise()
  src.loop = true
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = p.cutoff || 900
  const bed = ctx.createGain()
  bed.gain.value = p.gain * 0.35
  src.connect(lp)
  lp.connect(bed)
  bed.connect(master)
  src.start()
  track(src, lp, bed)

  const step = () => {
    if (!enabled || !ctx) return
    try {
      const t = ctx.currentTime
      // 脚步低频冲击
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.setValueAtTime(62, t)
      o.frequency.exponentialRampToValueAtTime(38, t + 0.18)
      const eg = ctx.createGain()
      eg.gain.setValueAtTime(0.0001, t)
      eg.gain.linearRampToValueAtTime(p.stepGain || 0.12, t + 0.008)
      eg.gain.exponentialRampToValueAtTime(0.0001, t + 0.22)
      o.connect(eg)
      eg.connect(master)
      o.start(t)
      o.stop(t + 0.24)

      // 鞋底摩擦：带通噪声
      const n = ctx.createBufferSource()
      n.buffer = getNoise()
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = 420
      bp.Q.value = 1.2
      const ng = ctx.createGain()
      ng.gain.setValueAtTime(0.0001, t)
      ng.gain.linearRampToValueAtTime(p.stepNoise || 0.05, t + 0.01)
      ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.16)
      n.connect(bp)
      bp.connect(ng)
      ng.connect(master)
      n.start(t)
      n.stop(t + 0.18)
    } catch (e) {
      // 单次脚步失败不影响整体
    }
  }
  step()
  ambientTimers.push(setInterval(step, p.interval || 1200))
}

// 每个结局一组参数：灯管电流 / 雨 / 走廊脚步
const PRESETS = {
  A1: { kind: 'hum', base: 100, gain: 0.022, lfo: 7.8, cutoff: 420 },
  A2: { kind: 'rain', gain: 0.05, cutoff: 5200, highpass: 700, dropInterval: 780 },
  B: { kind: 'steps', gain: 0.05, interval: 1250, stepGain: 0.13, stepNoise: 0.05, cutoff: 900 },
  'B-': { kind: 'hum', base: 86, gain: 0.016, lfo: 4.6, cutoff: 320 },
  C: { kind: 'rain', gain: 0.028, cutoff: 2600, highpass: 500, dropInterval: 1200 },
  D: { kind: 'steps', gain: 0.04, interval: 900, stepGain: 0.1, stepNoise: 0.04, cutoff: 760 },
  放弃: { kind: 'hum', base: 70, gain: 0.01, lfo: 2, cutoff: 240 }
}

export function playEndingAmbient (ending) {
  if (!enabled) return
  unlockAudio()
  if (!ctx) return
  stopAmbient()
  currentEnding = ending
  try {
    const p = PRESETS[ending] || PRESETS.A1
    if (p.kind === 'hum') startHum(p)
    else if (p.kind === 'rain') startRain(p)
    else if (p.kind === 'steps') startSteps(p)
  } catch (e) {
    // 合成失败时保持静音
  }
}

export function stopAmbient () {
  currentEnding = ''
  for (const timer of ambientTimers) clearInterval(timer)
  ambientTimers = []
  for (const node of ambientNodes) {
    try {
      if (typeof node.stop === 'function') node.stop()
    } catch (e) {
      // 已停止
    }
    try {
      if (typeof node.disconnect === 'function') node.disconnect()
    } catch (e) {
      // 已断开
    }
  }
  ambientNodes = []
}

// === 陈默醒来：唯一替换点 ===
// 以后接入真实录音时，只改 CHEN_WAKE_VOICE + speakChenWake 的实现，
// 用 new Audio(url).play() 替换 speechSynthesis 即可；调用方不用动。
export const CHEN_WAKE_VOICE = {
  text: '……有人吗。我记得有人敲门。我没开。',
  lang: 'zh-CN',
  rate: 0.85,
  pitch: 0.9
}

export function speakChenWake () {
  if (!enabled) return
  try {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    const u = new SpeechSynthesisUtterance(CHEN_WAKE_VOICE.text)
    u.lang = CHEN_WAKE_VOICE.lang
    u.rate = CHEN_WAKE_VOICE.rate
    u.pitch = CHEN_WAKE_VOICE.pitch
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  } catch (e) {
    // 浏览器不支持时只保留文本
  }
}

export function stopAllAudio () {
  stopAmbient()
  try {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
  } catch (e) {
    // 忽略
  }
  if (currentEnding) currentEnding = ''
}
