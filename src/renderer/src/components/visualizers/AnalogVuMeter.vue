<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { audioEngine } from '../../services/audioEngine'
import { usePlayerStore } from '../../stores/player'
import { useYouTubeStore } from '../../stores/youtube'

const props = withDefaults(
  defineProps<{
    sensitivity?: number
  }>(),
  {
    sensitivity: 1.2
  }
)

const playerStore = usePlayerStore()
const ytStore = useYouTubeStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
let animFrameId: number | null = null

// Physics simulation states for dual needles
let leftNeedle = 0 // 0.0 to 1.0
let rightNeedle = 0
let leftPeakLed = false
let rightPeakLed = false
let peakDecayL = 0
let peakDecayR = 0

// Idle breathing oscillation when paused
let idlePhase = 0

function drawVuGauge(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  value: number,
  label: string,
  peakActive: boolean
): void {
  ctx.save()
  ctx.translate(x, y)

  // Outer bezel / housing
  const gradBezel = ctx.createLinearGradient(0, 0, 0, h)
  gradBezel.addColorStop(0, '#2d3149')
  gradBezel.addColorStop(0.5, '#1e2132')
  gradBezel.addColorStop(1, '#141622')

  ctx.fillStyle = gradBezel
  ctx.strokeStyle = '#3d4465'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(0, 0, w, h, 12)
  ctx.fill()
  ctx.stroke()

  // Inner meter face (Vintage Warm Cream with Amber Backlight)
  const pad = 8
  const faceW = w - pad * 2
  const faceH = h - pad * 2

  const gradFace = ctx.createRadialGradient(
    w / 2,
    h * 0.9,
    10,
    w / 2,
    h / 2,
    w * 0.7
  )
  gradFace.addColorStop(0, '#fff4db')
  gradFace.addColorStop(0.6, '#f3e5c8')
  gradFace.addColorStop(1, '#dfceab')

  ctx.fillStyle = gradFace
  ctx.beginPath()
  ctx.roundRect(pad, pad, faceW, faceH, 8)
  ctx.fill()

  // Subtle warm amber glow overlay
  ctx.fillStyle = 'rgba(255, 170, 70, 0.08)'
  ctx.fill()

  // Pivot point for needle (bottom center of gauge)
  const pivotX = w / 2
  const pivotY = h - pad - 6
  const radius = faceH * 0.88

  // Draw Arc scale
  const startAngle = -Math.PI * 0.75 // -135 deg
  const endAngle = -Math.PI * 0.25   // -45 deg
  const zeroAngle = startAngle + (endAngle - startAngle) * 0.75 // 0 VU point

  // Normal zone arc (Black)
  ctx.lineWidth = 2.5
  ctx.strokeStyle = '#2b2926'
  ctx.beginPath()
  ctx.arc(pivotX, pivotY, radius, startAngle, zeroAngle, false)
  ctx.stroke()

  // Red / Overload zone arc
  ctx.strokeStyle = '#e04040'
  ctx.lineWidth = 3.5
  ctx.beginPath()
  ctx.arc(pivotX, pivotY, radius, zeroAngle, endAngle, false)
  ctx.stroke()

  // Ticks and scale numbers
  const marks = [
    { pos: 0.0, text: '-20' },
    { pos: 0.2, text: '-10' },
    { pos: 0.38, text: '-7' },
    { pos: 0.52, text: '-5' },
    { pos: 0.65, text: '-3' },
    { pos: 0.75, text: '0', isRed: true },
    { pos: 0.88, text: '+2', isRed: true },
    { pos: 1.0, text: '+3', isRed: true }
  ]

  ctx.font = 'bold 9px monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  for (const m of marks) {
    const angle = startAngle + (endAngle - startAngle) * m.pos
    const tickInner = radius - 5
    const tickOuter = radius + 3
    const textRadius = radius - 13

    const x1 = pivotX + Math.cos(angle) * tickInner
    const y1 = pivotY + Math.sin(angle) * tickInner
    const x2 = pivotX + Math.cos(angle) * tickOuter
    const y2 = pivotY + Math.sin(angle) * tickOuter

    ctx.strokeStyle = m.isRed ? '#e04040' : '#2b2926'
    ctx.lineWidth = m.isRed ? 2 : 1.5
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    // Scale text
    const tx = pivotX + Math.cos(angle) * textRadius
    const ty = pivotY + Math.sin(angle) * textRadius
    ctx.fillStyle = m.isRed ? '#e04040' : '#3d3832'
    ctx.fillText(m.text, tx, ty)
  }

  // Label (LEFT / RIGHT & "VU")
  ctx.font = 'bold 11px sans-serif'
  ctx.fillStyle = '#4a433b'
  ctx.fillText(`VOLUME UNIT`, w / 2, pad + 24)
  ctx.font = 'bold 10px monospace'
  ctx.fillStyle = '#ff9e64'
  ctx.fillText(`CHANNEL ${label}`, w / 2, pad + 38)

  // Peak LED
  const ledX = w - pad - 18
  const ledY = pad + 16
  ctx.beginPath()
  ctx.arc(ledX, ledY, 4.5, 0, Math.PI * 2)
  if (peakActive) {
    ctx.fillStyle = '#ff3333'
    ctx.shadowColor = '#ff2222'
    ctx.shadowBlur = 10
    ctx.fill()
    ctx.shadowBlur = 0
  } else {
    ctx.fillStyle = '#552222'
    ctx.fill()
  }
  ctx.strokeStyle = '#2b2926'
  ctx.lineWidth = 1
  ctx.stroke()

  ctx.font = '7px sans-serif'
  ctx.fillStyle = '#5c5449'
  ctx.fillText('PEAK', ledX, ledY + 9)

  // Draw Needle
  const clampedVal = Math.max(0, Math.min(1.08, value))
  const needleAngle = startAngle + (endAngle - startAngle) * clampedVal
  const needleLen = radius + 8

  const tipX = pivotX + Math.cos(needleAngle) * needleLen
  const tipY = pivotY + Math.sin(needleAngle) * needleLen

  // Needle Shadow
  ctx.strokeStyle = 'rgba(60, 45, 25, 0.25)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(pivotX + 2, pivotY + 2)
  ctx.lineTo(tipX + 2, tipY + 2)
  ctx.stroke()

  // Needle Line
  ctx.strokeStyle = '#1b1a18'
  ctx.lineWidth = 1.8
  ctx.beginPath()
  ctx.moveTo(pivotX, pivotY)
  ctx.lineTo(tipX, tipY)
  ctx.stroke()

  // Needle Tip Highlight (Red tip)
  const tipSubX = pivotX + Math.cos(needleAngle) * (needleLen - 12)
  const tipSubY = pivotY + Math.sin(needleAngle) * (needleLen - 12)
  ctx.strokeStyle = '#e04040'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(tipSubX, tipSubY)
  ctx.lineTo(tipX, tipY)
  ctx.stroke()

  // Pivot Cap / Screw
  ctx.beginPath()
  ctx.arc(pivotX, pivotY, 9, 0, Math.PI * 2)
  ctx.fillStyle = '#1c1f2e'
  ctx.fill()
  ctx.strokeStyle = '#ff9e64'
  ctx.lineWidth = 1.5
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(pivotX, pivotY, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#ff9e64'
  ctx.fill()

  ctx.restore()
}

function renderLoop(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  // Skip rendering and heavy calculations when hidden in DOM to save CPU/GPU for video decoding
  if (canvas.offsetParent === null || canvas.clientWidth === 0) {
    animFrameId = requestAnimationFrame(renderLoop)
    return
  }

  const dpr = window.devicePixelRatio || 1
  const targetW = Math.max(300, (canvas.clientWidth || 600) * dpr)
  const targetH = Math.max(150, (canvas.clientHeight || 220) * dpr)
  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW
    canvas.height = targetH
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height

  ctx.clearRect(0, 0, width, height)

  // Fetch audio metrics
  let targetL = 0
  let targetR = 0

  if (playerStore.isPlaying || ytStore.isPlaying) {
    const levels = audioEngine.getAudioLevels()
    const sens = props.sensitivity

    // Simulate Left/Right stereo slight variance from frequencies
    const freq = audioEngine.getFrequencyData()
    let leftSum = 0
    let rightSum = 0
    const half = Math.floor(freq.length / 2)

    for (let i = 0; i < half; i++) leftSum += freq[i]
    for (let i = half; i < freq.length; i++) rightSum += freq[i]

    const leftNorm = (leftSum / (half * 255)) * 1.6 * sens
    const rightNorm = (rightSum / (half * 255)) * 1.8 * sens

    targetL = Math.min(1.05, Math.max(levels.rms * 1.8 * sens, leftNorm))
    targetR = Math.min(1.05, Math.max(levels.rms * 1.8 * sens, rightNorm))
  } else {
    // Idle gentle needle breathing
    idlePhase += 0.03
    targetL = 0.03 + Math.sin(idlePhase) * 0.02
    targetR = 0.03 + Math.cos(idlePhase) * 0.02
  }

  // Ballistics spring physics for authentic vintage needle inertia
  const attack = 0.38
  const release = 0.14

  const factorL = targetL > leftNeedle ? attack : release
  leftNeedle += (targetL - leftNeedle) * factorL

  const factorR = targetR > rightNeedle ? attack : release
  rightNeedle += (targetR - rightNeedle) * factorR

  // Peak LED trigger logic
  if (leftNeedle > 0.85) {
    leftPeakLed = true
    peakDecayL = 10
  } else if (peakDecayL > 0) {
    peakDecayL--
  } else {
    leftPeakLed = false
  }

  if (rightNeedle > 0.85) {
    rightPeakLed = true
    peakDecayR = 10
  } else if (peakDecayR > 0) {
    peakDecayR--
  } else {
    rightPeakLed = false
  }

  // Calculate meter dimensions (Dual gauges side by side with proportional scaling)
  const gap = Math.max(12, width * 0.025)
  const availableW = (width - gap - 32) / 2
  const availableH = height - 24
  const aspect = 270 / 160 // standard vintage ratio ~1.6875

  let meterW = availableW
  let meterH = meterW / aspect
  if (meterH > availableH) {
    meterH = availableH
    meterW = meterH * aspect
  }

  const totalW = meterW * 2 + gap
  const startX = (width - totalW) / 2
  const startY = (height - meterH) / 2

  // Draw Dual Gauges
  drawVuGauge(ctx, startX, startY, meterW, meterH, leftNeedle, 'L', leftPeakLed)
  drawVuGauge(ctx, startX + meterW + gap, startY, meterW, meterH, rightNeedle, 'R', rightPeakLed)

  animFrameId = requestAnimationFrame(renderLoop)
}

onMounted(() => {
  if (canvasRef.value) {
    const dpr = window.devicePixelRatio || 1
    canvasRef.value.width = (canvasRef.value.clientWidth || 600) * dpr
    canvasRef.value.height = (canvasRef.value.clientHeight || 260) * dpr
  }
  renderLoop()
})

onUnmounted(() => {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-2 relative">
    <canvas ref="canvasRef" class="w-full h-full min-h-[260px]"></canvas>
  </div>
</template>
