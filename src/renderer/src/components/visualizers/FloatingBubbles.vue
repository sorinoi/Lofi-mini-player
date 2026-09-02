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

interface Bubble {
  id: number
  x: number
  y: number
  baseX: number
  radius: number
  baseRadius: number
  vy: number
  wobbleSpeed: number
  wobbleAmp: number
  wobblePhase: number
  colorScheme: 'cyan' | 'pink' | 'purple' | 'amber' | 'emerald'
  alpha: number
  maxAlpha: number
  isPopping: boolean
  popFrame: number
  freqBand: 'bass' | 'mid' | 'high'
}

interface PopParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
}

const bubbles: Bubble[] = []
const popParticles: PopParticle[] = []
let bubbleIdCounter = 0
let idleTimer = 0
let surfaceWavePhase = 0

const COLOR_PALETTES = {
  cyan: {
    stroke: 'rgba(122, 162, 247, 0.75)',
    glow: 'rgba(125, 207, 255, 0.25)',
    highlight: 'rgba(255, 255, 255, 0.85)',
    innerGrad: ['rgba(122, 162, 247, 0.08)', 'rgba(125, 207, 255, 0.35)']
  },
  pink: {
    stroke: 'rgba(247, 118, 142, 0.75)',
    glow: 'rgba(247, 118, 142, 0.25)',
    highlight: 'rgba(255, 255, 255, 0.85)',
    innerGrad: ['rgba(247, 118, 142, 0.08)', 'rgba(247, 118, 142, 0.35)']
  },
  purple: {
    stroke: 'rgba(187, 154, 247, 0.75)',
    glow: 'rgba(187, 154, 247, 0.25)',
    highlight: 'rgba(255, 255, 255, 0.85)',
    innerGrad: ['rgba(187, 154, 247, 0.08)', 'rgba(187, 154, 247, 0.35)']
  },
  amber: {
    stroke: 'rgba(255, 158, 100, 0.75)',
    glow: 'rgba(255, 158, 100, 0.25)',
    highlight: 'rgba(255, 255, 255, 0.85)',
    innerGrad: ['rgba(255, 158, 100, 0.08)', 'rgba(255, 158, 100, 0.35)']
  },
  emerald: {
    stroke: 'rgba(115, 218, 202, 0.75)',
    glow: 'rgba(115, 218, 202, 0.25)',
    highlight: 'rgba(255, 255, 255, 0.85)',
    innerGrad: ['rgba(115, 218, 202, 0.08)', 'rgba(115, 218, 202, 0.35)']
  }
}

function spawnBubble(
  width: number,
  height: number,
  freqBand: 'bass' | 'mid' | 'high',
  energy: number
): void {
  const sens = props.sensitivity || 1.2
  let radius = 12
  let colorScheme: 'cyan' | 'pink' | 'purple' | 'amber' | 'emerald' = 'cyan'
  let x = Math.random() * width
  let vy = 1.2 + Math.random() * 1.5

  if (freqBand === 'bass') {
    // Big deep bubbles, floating mostly left/mid-left
    radius = 18 + Math.random() * 18 * Math.min(2, energy * sens)
    colorScheme = Math.random() > 0.5 ? 'cyan' : 'purple'
    x = width * (0.1 + Math.random() * 0.45)
    vy = 0.9 + Math.random() * 1.2 + energy * 0.8
  } else if (freqBand === 'mid') {
    // Medium musical bubbles, center area
    radius = 10 + Math.random() * 12 * Math.min(2, energy * sens)
    colorScheme = Math.random() > 0.5 ? 'pink' : 'amber'
    x = width * (0.3 + Math.random() * 0.4)
    vy = 1.4 + Math.random() * 1.4 + energy * 1.0
  } else {
    // Micro shimmering treble bubbles, center-right to right
    radius = 5 + Math.random() * 7 * Math.min(2, energy * sens)
    colorScheme = Math.random() > 0.5 ? 'emerald' : 'cyan'
    x = width * (0.5 + Math.random() * 0.45)
    vy = 1.8 + Math.random() * 2.0 + energy * 1.4
  }

  bubbles.push({
    id: ++bubbleIdCounter,
    x,
    baseX: x,
    y: height + radius + Math.random() * 15,
    radius,
    baseRadius: radius,
    vy,
    wobbleSpeed: 0.02 + Math.random() * 0.04,
    wobbleAmp: 4 + Math.random() * 10,
    wobblePhase: Math.random() * Math.PI * 2,
    colorScheme,
    alpha: 0.1,
    maxAlpha: 0.45 + Math.random() * 0.45,
    isPopping: false,
    popFrame: 0,
    freqBand
  })
}

function triggerPop(bubble: Bubble): void {
  const particleCount = Math.max(4, Math.floor(bubble.radius * 0.4))
  const palette = COLOR_PALETTES[bubble.colorScheme]

  for (let i = 0; i < particleCount; i++) {
    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.5 - 0.25)
    const speed = 1.5 + Math.random() * 3.0
    popParticles.push({
      x: bubble.x,
      y: bubble.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.5,
      radius: 1.5 + Math.random() * 2.5,
      alpha: 0.85,
      color: palette.stroke
    })
  }
}

function drawBubble(ctx: CanvasRenderingContext2D, bubble: Bubble, energyFactor: number): void {
  const palette = COLOR_PALETTES[bubble.colorScheme]
  const currentR = Math.max(3, bubble.radius * (1 + energyFactor * 0.25))

  ctx.save()
  ctx.globalAlpha = bubble.alpha

  // 1. Soft Ambient Outer Glow
  const glowGrad = ctx.createRadialGradient(
    bubble.x,
    bubble.y,
    currentR * 0.5,
    bubble.x,
    bubble.y,
    currentR * 1.4
  )
  glowGrad.addColorStop(0, 'rgba(0,0,0,0)')
  glowGrad.addColorStop(0.7, palette.glow)
  glowGrad.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = glowGrad
  ctx.beginPath()
  ctx.arc(bubble.x, bubble.y, currentR * 1.4, 0, Math.PI * 2)
  ctx.fill()

  // 2. Glass Water Bubble Core Shading
  const coreGrad = ctx.createRadialGradient(
    bubble.x - currentR * 0.3,
    bubble.y - currentR * 0.3,
    currentR * 0.1,
    bubble.x,
    bubble.y,
    currentR
  )
  coreGrad.addColorStop(0, palette.innerGrad[0])
  coreGrad.addColorStop(0.75, palette.innerGrad[1])
  coreGrad.addColorStop(1, palette.stroke)

  ctx.fillStyle = coreGrad
  ctx.strokeStyle = palette.stroke
  ctx.lineWidth = Math.max(1.2, currentR * 0.08)

  ctx.beginPath()
  ctx.arc(bubble.x, bubble.y, currentR, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  // 3. Crescent Specular Highlight (Top-Left)
  ctx.fillStyle = palette.highlight
  ctx.beginPath()
  ctx.ellipse(
    bubble.x - currentR * 0.35,
    bubble.y - currentR * 0.35,
    currentR * 0.32,
    currentR * 0.16,
    -Math.PI / 4,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // 4. Secondary Bottom-Right Reflection Dot
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)'
  ctx.beginPath()
  ctx.arc(
    bubble.x + currentR * 0.38,
    bubble.y + currentR * 0.38,
    Math.max(1, currentR * 0.12),
    0,
    Math.PI * 2
  )
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
  const targetH = Math.max(150, (canvas.clientHeight || 260) * dpr)

  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW
    canvas.height = targetH
  }

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const width = canvas.width
  const height = canvas.height
  const sens = props.sensitivity || 1.2
  const isPlaying = playerStore.isPlaying || ytStore.isPlaying

  // Clear Canvas
  ctx.clearRect(0, 0, width, height)

  // Subtle Water Atmosphere Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
  bgGrad.addColorStop(0, '#0f111a')
  bgGrad.addColorStop(0.5, '#131624')
  bgGrad.addColorStop(1, '#181b2e')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, width, height)

  // Water Surface Ripple Wave at Top
  surfaceWavePhase += 0.03
  ctx.save()
  ctx.strokeStyle = 'rgba(125, 207, 255, 0.25)'
  ctx.lineWidth = 2
  ctx.beginPath()
  const surfaceY = 22 * dpr
  for (let x = 0; x <= width; x += 10) {
    const wave = Math.sin(surfaceWavePhase + x * 0.02) * 3 * dpr
    if (x === 0) ctx.moveTo(x, surfaceY + wave)
    else ctx.lineTo(x, surfaceY + wave)
  }
  ctx.stroke()
  ctx.restore()

  // Calculate Frequency Metrics
  const freqData = audioEngine.getFrequencyData()
  let bassSum = 0
  let midSum = 0
  let highSum = 0

  const len = freqData.length || 256
  for (let i = 0; i < len; i++) {
    const val = freqData[i]
    if (i < 18) bassSum += val
    else if (i < 80) midSum += val
    else if (i < 200) highSum += val
  }

  const bassEnergy = isPlaying ? (bassSum / (18 * 255)) * sens : 0.05
  const midEnergy = isPlaying ? (midSum / (62 * 255)) * sens : 0.05
  const highEnergy = isPlaying ? (highSum / (120 * 255)) * sens : 0.05

  // Spawner Logic
  if (isPlaying) {
    // Dynamic music-reactive spawn chances
    if (Math.random() < 0.28 * Math.min(2.5, bassEnergy * 1.5) && bubbles.length < 110) {
      spawnBubble(width, height, 'bass', bassEnergy)
    }
    if (Math.random() < 0.35 * Math.min(2.5, midEnergy * 1.5) && bubbles.length < 110) {
      spawnBubble(width, height, 'mid', midEnergy)
    }
    if (Math.random() < 0.45 * Math.min(2.5, highEnergy * 1.5) && bubbles.length < 110) {
      spawnBubble(width, height, 'high', highEnergy)
    }
  } else {
    // Calm Idle Ambient Spawn
    idleTimer++
    if (idleTimer % 28 === 0 && bubbles.length < 40) {
      const band: 'bass' | 'mid' | 'high' = Math.random() > 0.6 ? 'bass' : Math.random() > 0.3 ? 'mid' : 'high'
      spawnBubble(width, height, band, 0.2)
    }
  }

  // Update & Draw Bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i]

    // Movement & Physics
    b.y -= b.vy * (1 + (b.freqBand === 'bass' ? bassEnergy : b.freqBand === 'mid' ? midEnergy : highEnergy) * 0.4)
    b.wobblePhase += b.wobbleSpeed
    b.x = b.baseX + Math.sin(b.wobblePhase) * b.wobbleAmp

    // Fade-in as it rises from bottom
    if (b.alpha < b.maxAlpha) {
      b.alpha = Math.min(b.maxAlpha, b.alpha + 0.03)
    }

    // Expansion as it nears lower surface pressure
    const progress = Math.max(0, 1 - b.y / height)
    b.radius = b.baseRadius * (1 + progress * 0.25)

    // Check Surface Reach or Pop
    const targetSurfaceY = 22 * dpr
    if (b.y <= targetSurfaceY + b.radius * 0.5) {
      triggerPop(b)
      bubbles.splice(i, 1)
      continue
    }

    const energy = b.freqBand === 'bass' ? bassEnergy : b.freqBand === 'mid' ? midEnergy : highEnergy
    drawBubble(ctx, b, energy)
  }

  // Update & Draw Pop Splash Particles
  for (let i = popParticles.length - 1; i >= 0; i--) {
    const p = popParticles[i]
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.08 // slight gravity
    p.alpha -= 0.05
    p.radius = Math.max(0.2, p.radius * 0.94)

    if (p.alpha <= 0.01) {
      popParticles.splice(i, 1)
      continue
    }

    ctx.save()
    ctx.globalAlpha = p.alpha
    ctx.fillStyle = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

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
    animFrameId = null
  }
  bubbles.length = 0
  popParticles.length = 0
})
</script>

<template>
  <div class="w-full h-full flex flex-col items-center justify-center p-2 relative">
    <canvas ref="canvasRef" class="w-full h-full min-h-[260px]"></canvas>
  </div>
</template>
