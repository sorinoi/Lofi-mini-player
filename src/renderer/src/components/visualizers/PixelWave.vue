<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { audioEngine } from '../../services/audioEngine'
import { usePlayerStore } from '../../stores/player'
import { useYouTubeStore } from '../../stores/youtube'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  alpha: number
  baseAlpha: number
}

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

const particles: Particle[] = []
const PARTICLE_COUNT = 40
let wavePhase = 0
let idlePhase = 0

// Smoothing buffers
const SAMPLE_POINTS = 64
const smoothedWave: number[] = new Array(SAMPLE_POINTS).fill(0)
const peakDots: number[] = new Array(SAMPLE_POINTS).fill(0)
const peakSpeed: number[] = new Array(SAMPLE_POINTS).fill(0)

function initParticles(width: number, height: number): void {
  particles.length = 0
  const colors = ['#f7768e', '#bb9af7', '#7aa2f7', '#7dcfff', '#9ece6a', '#ff9e64']
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const alpha = Math.random() * 0.5 + 0.25
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.2 - Math.random() * 0.4,
      size: Math.random() * 2.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha,
      baseAlpha: alpha
    })
  }
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
  const targetH = Math.max(150, (canvas.clientHeight || 260) * dpr)

  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW
    canvas.height = targetH
    if (particles.length === 0) {
      initParticles(canvas.width, canvas.height)
    }
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const sens = props.sensitivity || 1.2
  const isPlaying = playerStore.isPlaying || ytStore.isPlaying

  // Clear Canvas with subtle dark gradient backdrop
  ctx.clearRect(0, 0, width, height)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
  bgGrad.addColorStop(0, '#0e1017')
  bgGrad.addColorStop(0.5, '#121522')
  bgGrad.addColorStop(1, '#16192a')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // Audio Data Extraction
  const timeData = audioEngine.getTimeDomainData()
  const freqData = audioEngine.getFrequencyData()

  let beatEnergy = 0
  let bassEnergy = 0
  let midEnergy = 0

  if (isPlaying && freqData.length > 0) {
    const levels = audioEngine.getAudioLevels()
    beatEnergy = levels.rms * sens

    let bassSum = 0
    let midSum = 0
    for (let i = 0; i < 24; i++) bassSum += freqData[i] || 0
    for (let i = 24; i < 80; i++) midSum += freqData[i] || 0

    bassEnergy = (bassSum / (24 * 255)) * sens
    midEnergy = (midSum / (56 * 255)) * sens
  } else {
    beatEnergy = 0.08
    bassEnergy = 0.05
    midEnergy = 0.05
  }

  // Update Phases
  wavePhase += 0.035 * (1 + beatEnergy * 1.5)
  idlePhase += 0.025

  // 1. Update and Render Ambient Firefly Pixel Particles
  for (const p of particles) {
    p.x += p.vx * (1 + beatEnergy * 1.8)
    p.y += p.vy * (1 + beatEnergy * 1.8)

    if (p.y < 0) {
      p.y = height
      p.x = Math.random() * width
    }
    if (p.x < 0) p.x = width
    if (p.x > width) p.x = 0

    const currentAlpha = Math.min(1, p.baseAlpha * (0.8 + beatEnergy * 1.6))
    ctx.save()
    ctx.fillStyle = p.color
    ctx.globalAlpha = currentAlpha
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.ceil(p.size * dpr), Math.ceil(p.size * dpr))
    ctx.restore()
  }

  // 2. Compute Smoothed Wave Amplitudes
  const pixelSize = Math.max(4, Math.floor(6 * dpr))
  const sampleCount = Math.min(SAMPLE_POINTS, Math.floor(width / pixelSize))
  const centerY = height * 0.52
  const maxAmplitude = height * 0.36 * sens

  for (let i = 0; i < sampleCount; i++) {
    const normX = i / sampleCount
    let targetVal = 0

    if (isPlaying && (timeData.length > 0 || freqData.length > 0)) {
      // Blend frequency envelope with time-domain wave and harmonic oscillation
      const freqIdx = Math.floor(normX * Math.min(freqData.length, 120))
      const freqAmp = (freqData[freqIdx] || 0) / 255

      const timeIdx = Math.floor(normX * (timeData.length - 1))
      const rawOsc = (timeData[timeIdx] - 128) / 128

      // Harmonically blended wave with bass pulse
      const waveHarmonic =
        Math.sin(wavePhase * 2 + i * 0.18) * 0.45 +
        Math.cos(wavePhase * 1.3 - i * 0.12) * 0.35 +
        rawOsc * 0.4

      targetVal = waveHarmonic * (0.25 + freqAmp * 0.75 + bassEnergy * 0.4)
    } else {
      // Idle peaceful synth wave
      targetVal = Math.sin(idlePhase * 2 + i * 0.16) * 0.22 + Math.cos(idlePhase * 1.2 - i * 0.08) * 0.12
    }

    targetVal = Math.max(-1, Math.min(1, targetVal))

    // Exponential Smoothing (Attack & Decay)
    const prev = smoothedWave[i] || 0
    const smoothingFactor = Math.abs(targetVal) > Math.abs(prev) ? 0.32 : 0.16 // Fast attack, gentle decay
    smoothedWave[i] = prev + (targetVal - prev) * smoothingFactor

    // Peak Dot Physics (Gravity drop)
    const currentHeight = Math.abs(smoothedWave[i]) * maxAmplitude
    if (currentHeight >= (peakDots[i] || 0)) {
      peakDots[i] = currentHeight
      peakSpeed[i] = 0
    } else {
      peakSpeed[i] = (peakSpeed[i] || 0) + 0.35 * dpr
      peakDots[i] = Math.max(0, (peakDots[i] || 0) - peakSpeed[i])
    }
  }

  // 3. Render 8-Bit Pixelated Glowing Wave
  const startX = Math.floor((width - sampleCount * pixelSize) / 2)

  for (let i = 0; i < sampleCount; i++) {
    const val = smoothedWave[i]
    const x = startX + i * pixelSize
    const blockCount = Math.max(1, Math.floor((Math.abs(val) * maxAmplitude) / pixelSize))
    const isPositive = val >= 0

    // Color gradient across the spectrum: Pink -> Purple -> Cyan -> Emerald
    const ratio = i / sampleCount
    let blockColor = '#f7768e'
    let glowColor = 'rgba(247, 118, 142, 0.4)'

    if (ratio > 0.7) {
      blockColor = '#73daca'
      glowColor = 'rgba(115, 218, 202, 0.4)'
    } else if (ratio > 0.45) {
      blockColor = '#7aa2f7'
      glowColor = 'rgba(122, 162, 247, 0.4)'
    } else if (ratio > 0.2) {
      blockColor = '#bb9af7'
      glowColor = 'rgba(187, 154, 247, 0.4)'
    }

    // A. Main Wave Pixel Blocks
    ctx.fillStyle = blockColor
    for (let b = 0; b < blockCount; b++) {
      const y = isPositive
        ? centerY - (b + 1) * pixelSize
        : centerY + b * pixelSize

      // Main pixel square
      ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1)
    }

    // B. Mirrored Faint Water Reflection (Underwater Glow Effect)
    ctx.save()
    ctx.globalAlpha = 0.2
    ctx.fillStyle = glowColor
    const reflectBlocks = Math.max(1, Math.floor(blockCount * 0.6))
    for (let b = 0; b < reflectBlocks; b++) {
      const reflectY = isPositive
        ? centerY + (b + 1) * pixelSize
        : centerY - b * pixelSize
      ctx.fillRect(x, reflectY, pixelSize - 1, pixelSize - 1)
    }
    ctx.restore()

    // C. Peak Floating Dots (Retro Equalizer Caps)
    const peakH = peakDots[i] || 0
    if (peakH > pixelSize) {
      const peakY = isPositive
        ? centerY - peakH - pixelSize
        : centerY + peakH

      ctx.save()
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.85
      ctx.fillRect(x, peakY, pixelSize - 1, Math.max(2, Math.floor(pixelSize * 0.5)))
      ctx.restore()
    }

    // D. Center Baseline Pixel Strip
    ctx.fillStyle = '#c0caf5'
    ctx.fillRect(x, centerY, pixelSize - 1, Math.max(2, Math.floor(2 * dpr)))
  }

  // 4. Subtle Retro CRT Scanline Overlay
  ctx.fillStyle = 'rgba(10, 12, 20, 0.18)'
  for (let y = 0; y < height; y += 4 * dpr) {
    ctx.fillRect(0, y, width, 1.5 * dpr)
  }

  animFrameId = requestAnimationFrame(renderLoop)
}

onMounted(() => {
  if (canvasRef.value) {
    const dpr = window.devicePixelRatio || 1
    canvasRef.value.width = (canvasRef.value.clientWidth || 600) * dpr
    canvasRef.value.height = (canvasRef.value.clientHeight || 260) * dpr
    initParticles(canvasRef.value.width, canvasRef.value.height)
  }
  renderLoop()
})

onUnmounted(() => {
  if (animFrameId) {
    cancelAnimationFrame(animFrameId)
    animFrameId = null
  }
  particles.length = 0
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-2 relative overflow-hidden">
    <canvas ref="canvasRef" class="w-full h-full min-h-[260px]"></canvas>
  </div>
</template>
