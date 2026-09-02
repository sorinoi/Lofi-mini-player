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

const BAR_COUNT = 36
const barHeights: number[] = new Array(BAR_COUNT).fill(4)
const peakCaps: number[] = new Array(BAR_COUNT).fill(4)
const peakDropSpeed: number[] = new Array(BAR_COUNT).fill(0)
let idleTime = 0

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

  const freqData = audioEngine.getFrequencyData()
  const isPlaying = playerStore.isPlaying || ytStore.isPlaying

  if (!isPlaying) {
    idleTime += 0.04
  }

  // Calculate bar geometry
  const paddingX = 24
  const usableWidth = width - paddingX * 2
  const barGap = Math.max(3, usableWidth / (BAR_COUNT * 4))
  const barWidth = (usableWidth - barGap * (BAR_COUNT - 1)) / BAR_COUNT
  const baselineY = height * 0.72
  const maxBarHeight = height * 0.58

  // Frequency range step
  const binStep = Math.max(1, Math.floor(freqData.length / (BAR_COUNT * 1.5)))

  // Draw each spectrum bar
  for (let i = 0; i < BAR_COUNT; i++) {
    let targetHeight = 4

    if (isPlaying && freqData.length > 0) {
      const binIdx = Math.min(freqData.length - 1, i * binStep + 1)
      const rawVal = freqData[binIdx] / 255
      targetHeight = Math.max(4, rawVal * maxBarHeight * props.sensitivity)
    } else {
      // Gentle idle wave motion
      const wave = Math.sin(idleTime + i * 0.25) * 0.5 + 0.5
      targetHeight = 6 + wave * 18
    }

    // Smooth lerp for bar height
    barHeights[i] += (targetHeight - barHeights[i]) * 0.32

    // Peak Cap gravity physics
    if (barHeights[i] >= peakCaps[i]) {
      peakCaps[i] = barHeights[i]
      peakDropSpeed[i] = 0.5
    } else {
      peakDropSpeed[i] += 0.25
      peakCaps[i] = Math.max(4, peakCaps[i] - peakDropSpeed[i])
    }

    const currentH = barHeights[i]
    const x = paddingX + i * (barWidth + barGap)
    const y = baselineY - currentH

    // 1. Draw Main Equalizer Bar with Vertical Lofi Gradient
    const barGrad = ctx.createLinearGradient(0, baselineY, 0, baselineY - maxBarHeight)
    barGrad.addColorStop(0, '#ff9e64')   // Warm orange
    barGrad.addColorStop(0.4, '#f7768e') // Cozy pink
    barGrad.addColorStop(0.8, '#bb9af7') // Lofi purple
    barGrad.addColorStop(1, '#7aa2f7')   // Soft cyan

    ctx.fillStyle = barGrad
    ctx.beginPath()
    ctx.roundRect(x, y, barWidth, currentH, [barWidth / 2, barWidth / 2, 0, 0])
    ctx.fill()

    // 2. Draw Floating Peak Hold Cap
    const capY = baselineY - peakCaps[i] - 3
    ctx.fillStyle = '#c0caf5'
    ctx.beginPath()
    ctx.roundRect(x, capY, barWidth, 2.5, 1.5)
    ctx.fill()

    // 3. Draw Mirror Reflection below baseline
    const refH = currentH * 0.35
    const refGrad = ctx.createLinearGradient(0, baselineY, 0, baselineY + refH)
    refGrad.addColorStop(0, 'rgba(255, 158, 100, 0.35)')
    refGrad.addColorStop(1, 'rgba(122, 162, 247, 0.0)')

    ctx.fillStyle = refGrad
    ctx.beginPath()
    ctx.roundRect(x, baselineY + 2, barWidth, refH, [0, 0, barWidth / 2, barWidth / 2])
    ctx.fill()
  }

  // Draw Glowing Baseline
  const baseGrad = ctx.createLinearGradient(paddingX, 0, width - paddingX, 0)
  baseGrad.addColorStop(0, 'rgba(255, 158, 100, 0.1)')
  baseGrad.addColorStop(0.5, 'rgba(255, 158, 100, 0.8)')
  baseGrad.addColorStop(1, 'rgba(122, 162, 247, 0.1)')

  ctx.strokeStyle = baseGrad
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(paddingX, baselineY)
  ctx.lineTo(width - paddingX, baselineY)
  ctx.stroke()

  animFrameId = requestAnimationFrame(renderLoop)
}

onMounted(() => {
  if (canvasRef.value) {
    canvasRef.value.width = canvasRef.value.clientWidth * window.devicePixelRatio || 640
    canvasRef.value.height = canvasRef.value.clientHeight * window.devicePixelRatio || 220
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
