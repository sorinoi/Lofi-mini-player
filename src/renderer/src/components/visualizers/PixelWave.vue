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
const PARTICLE_COUNT = 45
let idlePhase = 0

function initParticles(width: number, height: number): void {
  particles.length = 0
  const colors = ['#ff9e64', '#bb9af7', '#7aa2f7', '#9ece6a', '#f7768e']
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -0.3 - Math.random() * 0.5,
      size: Math.random() * 2.5 + 1.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.7 + 0.3
    })
  }
}

function renderLoop(): void {
  const canvas = canvasRef.value
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  const targetW = Math.max(300, (canvas.clientWidth || 600) * dpr)
  const targetH = Math.max(150, (canvas.clientHeight || 220) * dpr)
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
  ctx.clearRect(0, 0, width, height)

  const timeData = audioEngine.getTimeDomainData()
  const freqData = audioEngine.getFrequencyData()
  const isPlaying = playerStore.isPlaying || ytStore.isPlaying

  if (!isPlaying) {
    idlePhase += 0.03
  }

  // Calculate general beat energy
  let beatEnergy = 0
  if (isPlaying && freqData.length > 0) {
    const levels = audioEngine.getAudioLevels()
    beatEnergy = levels.rms * props.sensitivity
  } else {
    beatEnergy = 0.1
  }

  // 1. Update and Render Floating Ambient Firefly Particles
  for (const p of particles) {
    // Energy boosts particle motion
    p.x += p.vx * (1 + beatEnergy * 2.5)
    p.y += p.vy * (1 + beatEnergy * 2.5)

    if (p.y < 0) {
      p.y = height
      p.x = Math.random() * width
    }
    if (p.x < 0) p.x = width
    if (p.x > width) p.x = 0

    ctx.save()
    ctx.fillStyle = p.color
    ctx.globalAlpha = Math.min(1, p.alpha * (0.8 + beatEnergy * 1.5))
    // Pixel square particle
    ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.ceil(p.size), Math.ceil(p.size))
    ctx.restore()
  }

  // 2. Render 8-Bit Pixelated Audio Waveform
  const pixelSize = 5 // Size of each pixel block
  const centerY = height * 0.55
  const waveHeight = height * 0.38 * props.sensitivity

  const sampleCount = Math.floor(width / pixelSize)
  const step = Math.max(1, Math.floor(timeData.length / sampleCount))

  for (let i = 0; i < sampleCount; i++) {
    let normalizedVal = 0

    if (isPlaying && timeData.length > 0) {
      const idx = Math.min(timeData.length - 1, i * step)
      normalizedVal = (timeData[idx] - 128) / 128
    } else {
      // Idle retro synth wave pattern
      normalizedVal = Math.sin(idlePhase * 2 + i * 0.15) * 0.2
    }

    const blockCount = Math.max(1, Math.floor(Math.abs(normalizedVal) * waveHeight / pixelSize))
    const isPositive = normalizedVal >= 0
    const x = i * pixelSize

    // Gradient color by x position
    const ratio = i / sampleCount
    let blockColor = '#ff9e64'
    if (ratio > 0.6) blockColor = '#7aa2f7'
    else if (ratio > 0.3) blockColor = '#bb9af7'

    ctx.fillStyle = blockColor

    for (let b = 0; b < blockCount; b++) {
      const y = isPositive
        ? centerY - (b + 1) * pixelSize
        : centerY + b * pixelSize
      ctx.fillRect(x, y, pixelSize - 1, pixelSize - 1)
    }

    // Baseline center pixel
    ctx.fillStyle = '#c0caf5'
    ctx.fillRect(x, centerY, pixelSize - 1, 2)
  }

  // 3. Subtle CRT Scanline Effect
  ctx.fillStyle = 'rgba(10, 12, 20, 0.15)'
  for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 1.5)
  }

  animFrameId = requestAnimationFrame(renderLoop)
}

onMounted(() => {
  if (canvasRef.value) {
    canvasRef.value.width = canvasRef.value.clientWidth * window.devicePixelRatio || 600
    canvasRef.value.height = canvasRef.value.clientHeight * window.devicePixelRatio || 220
    initParticles(canvasRef.value.width, canvasRef.value.height)
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
  <div class="w-full h-full flex flex-col items-center justify-center p-2 relative overflow-hidden rounded-xl">
    <canvas ref="canvasRef" class="w-full h-full max-h-56"></canvas>
  </div>
</template>
