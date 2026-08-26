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

let rotationAngle = 0
let bassPulseRadius = 45
let pulseRings: Array<{ radius: number; opacity: number; color: string }> = []
let idlePhase = 0

function renderLoop(): void {
  const canvas = canvasRef.value
  if (!canvas) return

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

  const cx = width / 2
  const cy = height / 2
  const maxRadius = Math.min(cx, cy) - 20

  const freqData = audioEngine.getFrequencyData()
  const isPlaying = playerStore.isPlaying || ytStore.isPlaying

  // Rotation speed tied to playback
  if (isPlaying) {
    rotationAngle += 0.008
  } else {
    rotationAngle += 0.002
    idlePhase += 0.03
  }

  // Calculate Bass energy for central disc pulsing
  let currentBass = 0
  if (isPlaying && freqData.length > 0) {
    const levels = audioEngine.getAudioLevels()
    currentBass = levels.bass * props.sensitivity
  } else {
    currentBass = (Math.sin(idlePhase) * 0.5 + 0.5) * 0.25
  }

  const targetRadius = 45 + currentBass * 28
  bassPulseRadius += (targetRadius - bassPulseRadius) * 0.3

  // Spawn pulsing shockwaves on heavy bass beats
  if (currentBass > 0.65 && pulseRings.length < 5) {
    pulseRings.push({
      radius: bassPulseRadius,
      opacity: 0.8,
      color: pulseRings.length % 2 === 0 ? '#ff9e64' : '#bb9af7'
    })
  }

  // Draw expanding shockwaves
  for (let i = pulseRings.length - 1; i >= 0; i--) {
    const ring = pulseRings[i]
    ring.radius += 2.2
    ring.opacity -= 0.02

    if (ring.opacity <= 0 || ring.radius > maxRadius + 30) {
      pulseRings.splice(i, 1)
      continue
    }

    ctx.save()
    ctx.strokeStyle = ring.color
    ctx.globalAlpha = ring.opacity
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }

  // Draw 360-degree Radial Spectrum Rays
  const rayCount = 64
  const angleStep = (Math.PI * 2) / rayCount

  for (let i = 0; i < rayCount; i++) {
    const angle = rotationAngle + i * angleStep

    let val = 0
    if (isPlaying && freqData.length > 0) {
      // Map ray around frequency spectrum symmetrically
      const freqIdx = Math.floor(Math.abs(Math.sin(i * 0.15)) * (freqData.length * 0.6))
      val = (freqData[freqIdx] / 255) * props.sensitivity
    } else {
      val = (Math.sin(idlePhase * 2 + i * 0.3) * 0.5 + 0.5) * 0.3
    }

    const rayLength = 4 + val * (maxRadius - bassPulseRadius - 10)
    const innerR = bassPulseRadius + 6
    const outerR = innerR + rayLength

    const x1 = cx + Math.cos(angle) * innerR
    const y1 = cy + Math.sin(angle) * innerR
    const x2 = cx + Math.cos(angle) * outerR
    const y2 = cy + Math.sin(angle) * outerR

    // Color interpolation across circle
    const normAngle = (i / rayCount)
    let rayColor = '#ff9e64'
    if (normAngle > 0.66) rayColor = '#7aa2f7'
    else if (normAngle > 0.33) rayColor = '#bb9af7'

    ctx.strokeStyle = rayColor
    ctx.lineWidth = Math.max(1.8, (Math.PI * 2 * innerR) / rayCount - 2)
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  // Draw Central Vinyl / Disc Core
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, bassPulseRadius, 0, Math.PI * 2)
  const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, bassPulseRadius)
  coreGrad.addColorStop(0, '#2d3149')
  coreGrad.addColorStop(0.7, '#1c1f2e')
  coreGrad.addColorStop(1, '#ff9e64')
  ctx.fillStyle = coreGrad
  ctx.fill()

  ctx.strokeStyle = '#ff9e64'
  ctx.lineWidth = 2
  ctx.stroke()

  // Vinyl Grooves
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.arc(cx, cy, bassPulseRadius * 0.65, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, cy, bassPulseRadius * 0.4, 0, Math.PI * 2)
  ctx.stroke()

  // Center Spindle Hole
  ctx.beginPath()
  ctx.arc(cx, cy, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#ff9e64'
  ctx.fill()

  ctx.restore()

  animFrameId = requestAnimationFrame(renderLoop)
}

onMounted(() => {
  if (canvasRef.value) {
    canvasRef.value.width = canvasRef.value.clientWidth * window.devicePixelRatio || 600
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
    <canvas ref="canvasRef" class="w-full h-full max-h-56"></canvas>
  </div>
</template>
