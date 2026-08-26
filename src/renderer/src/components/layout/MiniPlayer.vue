<script setup lang="ts">
import { ref } from 'vue'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Maximize2,
  Minus,
  X,
  Clock,
  RotateCcw,
  Radio,
  BarChart3,
  Disc,
  Sparkles,
  Zap
} from 'lucide-vue-next'
import { useAppStore } from '../../stores/app'
import { usePlayerStore } from '../../stores/player'
import { useTimerStore } from '../../stores/timer'
import { useYouTubeStore } from '../../stores/youtube'
import { useQuotaStore } from '../../stores/quota'
import { youtubeService } from '../../services/youtubeService'
import { audioEngine } from '../../services/audioEngine'
import AnalogVuMeter from '../visualizers/AnalogVuMeter.vue'
import FrequencyBars from '../visualizers/FrequencyBars.vue'
import CircularPulse from '../visualizers/CircularPulse.vue'
import PixelWave from '../visualizers/PixelWave.vue'

const appStore = useAppStore()
const playerStore = usePlayerStore()
const timerStore = useTimerStore()
const ytStore = useYouTubeStore()
const quotaStore = useQuotaStore()

const currentMiniView = ref<'music' | 'vu' | 'timer'>('music')
const focusPresets = [25, 45, 60]

const visualizerModes = ['analog_vu', 'frequency_bars', 'circular_pulse', 'pixel_wave'] as const

function cycleVisualizerMode(): void {
  const currentIdx = visualizerModes.indexOf(appStore.visualizerMode as any)
  const nextIdx = (currentIdx + 1) % visualizerModes.length
  appStore.setVisualizerMode(visualizerModes[nextIdx])
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function togglePlayPause(): void {
  if (ytStore.isPlaying) {
    ytStore.togglePlayPause()
  } else if (playerStore.isPlaying) {
    playerStore.togglePlay()
  } else if (appStore.activeTab === 'youtube') {
    ytStore.togglePlayPause()
  } else {
    playerStore.togglePlay()
  }
}

async function openQuotaModal(): Promise<void> {
  await handleExpand()
  quotaStore.isModalOpen = true
}

async function handleExpand(): Promise<void> {
  appStore.isMiniPlayer = false
  if (window.api?.exitMiniMode) {
    await window.api.exitMiniMode()
  }
}

async function handleMinimize(): Promise<void> {
  if (window.api?.minimizeWindow) {
    await window.api.minimizeWindow()
  }
}

async function handleClose(): Promise<void> {
  if (window.api?.closeWindow) {
    await window.api.closeWindow()
  }
}
</script>

<template>
  <div class="w-full h-full bg-lofi-bg text-lofi-text flex flex-col justify-between p-3 select-none overflow-hidden border border-lofi-border rounded-2xl shadow-2xl relative font-sans">
    <!-- Mini Drag Header -->
    <div class="h-6 w-full flex items-center justify-between drag-region pb-1 border-b border-lofi-border/50">
      <div class="flex items-center gap-1.5 text-2xs font-bold text-lofi-primary">
        <span class="tracking-wider uppercase font-bold text-[10px]">Lofi</span>
        <button
          @click="openQuotaModal"
          class="no-drag flex items-center gap-0.5 px-1 py-0.2 rounded text-[9px] font-mono border transition-all"
          :class="[
            quotaStore.statusColor === 'green'
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              : quotaStore.statusColor === 'amber'
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse'
          ]"
          :title="`Codex Quota: ${quotaStore.usedPercentage}% Used (Resets in ${quotaStore.formattedCountdown}) - Click to configure`"
        >
          <Zap class="w-2.5 h-2.5" />
          <span>{{ quotaStore.usedPercentage }}%</span>
        </button>
      </div>

      <!-- Center: 3-Mode View Switcher (Music / VU / Timer) -->
      <div class="no-drag flex items-center gap-0.5 bg-lofi-card/90 p-0.5 rounded-lg border border-lofi-border/70">
        <!-- 1. Music View -->
        <button
          @click="currentMiniView = 'music'"
          :class="[
            'px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all',
            currentMiniView === 'music'
              ? 'bg-lofi-primary text-lofi-bg shadow-sm font-bold'
              : 'text-lofi-muted hover:text-lofi-text'
          ]"
          title="Music Player View"
        >
          <Music class="w-2.5 h-2.5" />
          <span>Track</span>
        </button>

        <!-- 2. VU Visualizer View -->
        <button
          @click="currentMiniView = 'vu'"
          :class="[
            'px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 transition-all',
            currentMiniView === 'vu'
              ? 'bg-lofi-primary text-lofi-bg shadow-sm font-bold'
              : 'text-lofi-muted hover:text-lofi-text'
          ]"
          title="VU Visualizer View"
        >
          <Radio class="w-2.5 h-2.5" />
          <span>VU</span>
        </button>

        <!-- 3. Timer View -->
        <button
          @click="currentMiniView = 'timer'"
          :class="[
            'px-2 py-0.5 rounded text-[10px] font-mono font-semibold flex items-center gap-1 transition-all',
            currentMiniView === 'timer'
              ? 'bg-lofi-primary text-lofi-bg shadow-sm font-bold'
              : timerStore.isPomodoroRunning
              ? 'text-lofi-primary animate-pulse'
              : timerStore.isSleepTimerActive
              ? 'text-lofi-purple animate-pulse'
              : 'text-lofi-muted hover:text-lofi-text'
          ]"
          title="Focus Clock Widget"
        >
          <Clock class="w-2.5 h-2.5" />
          <span v-if="timerStore.isPomodoroRunning">{{ formatTime(timerStore.pomodoroSecondsLeft) }}</span>
          <span v-else-if="timerStore.isSleepTimerActive">{{ formatTime(timerStore.sleepSecondsLeft) }}</span>
          <span v-else>Timer</span>
        </button>
      </div>

      <!-- Right: Window Buttons -->
      <div class="flex items-center gap-1 no-drag text-lofi-muted">
        <button
          @click="handleExpand"
          class="p-1 rounded hover:text-lofi-text hover:bg-lofi-card transition-colors"
          title="Expand to Full Player"
        >
          <Maximize2 class="w-2.5 h-2.5 text-lofi-primary" />
        </button>

        <button
          @click="handleMinimize"
          class="p-1 rounded hover:text-lofi-text hover:bg-lofi-card transition-colors"
          title="Minimize"
        >
          <Minus class="w-2.5 h-2.5" />
        </button>

        <button
          @click="handleClose"
          class="p-1 rounded hover:text-white hover:bg-red-500 transition-colors"
          title="Close"
        >
          <X class="w-2.5 h-2.5" />
        </button>
      </div>
    </div>

    <!-- VIEW 1: MUSIC-CENTRIC VIEW -->
    <template v-if="currentMiniView === 'music'">
      <!-- Center Track Content -->
      <div class="flex items-center gap-3 py-2 px-1">
        <!-- Disc / Cover Art -->
        <div class="relative w-14 h-14 rounded-xl overflow-hidden bg-lofi-card border border-lofi-border flex-shrink-0 flex items-center justify-center shadow-md">
          <img
            v-if="(ytStore.isPlaying || appStore.activeTab === 'youtube') && ytStore.currentVideoId"
            :src="youtubeService.getThumbnailUrl(ytStore.currentVideoId)"
            alt="YouTube Thumb"
            class="w-full h-full object-cover"
          />
          <img
            v-else-if="playerStore.currentTrack?.coverUrl"
            :src="playerStore.currentTrack.coverUrl"
            alt="Cover"
            :class="['w-full h-full object-cover', playerStore.isPlaying ? 'animate-pulse' : '']"
          />
          <Music v-else class="w-6 h-6 text-lofi-primary opacity-60" />
        </div>

        <!-- Info -->
        <div class="min-w-0 flex-1">
          <p class="text-xs font-bold text-lofi-text truncate">
            {{ (ytStore.isPlaying || appStore.activeTab === 'youtube') ? ytStore.currentTitle : (playerStore.currentTrack?.title || 'No Track Selected') }}
          </p>
          <p class="text-2xs text-lofi-muted truncate mt-0.5">
            {{ (ytStore.isPlaying || appStore.activeTab === 'youtube') ? ytStore.currentChannel : (playerStore.currentTrack?.artist || 'Lofi Chill Station') }}
          </p>

          <!-- Mini Progress Bar -->
          <div class="mt-2 flex items-center gap-2 text-[10px] text-lofi-muted font-mono">
            <span>{{ formatTime(playerStore.currentTime) }}</span>
            <div class="flex-1 h-1 bg-lofi-card rounded-full overflow-hidden">
              <div
                class="h-full bg-lofi-primary rounded-full transition-all duration-300"
                :style="{ width: `${playerStore.duration ? (playerStore.currentTime / playerStore.duration) * 100 : 0}%` }"
              ></div>
            </div>
            <span>{{ formatTime(playerStore.duration) }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom Mini Controls -->
      <div class="flex items-center justify-between pt-1 border-t border-lofi-border/50">
        <!-- Playback Buttons -->
        <div class="flex items-center gap-2">
          <button
            @click="playerStore.prevTrack"
            class="p-1 text-lofi-muted hover:text-lofi-text transition-colors"
          >
            <SkipBack class="w-3.5 h-3.5" />
          </button>

          <button
            @click="togglePlayPause"
            class="w-7 h-7 rounded-full bg-lofi-primary text-lofi-bg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md"
          >
            <Pause v-if="playerStore.isPlaying || ytStore.isPlaying" class="w-3 h-3 fill-current" />
            <Play v-else class="w-3 h-3 fill-current ml-0.5" />
          </button>

          <button
            @click="playerStore.nextTrack"
            class="p-1 text-lofi-muted hover:text-lofi-text transition-colors"
          >
            <SkipForward class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Mini Master Volume Slider -->
        <div class="flex items-center gap-1.5" :title="`Master Volume: ${playerStore.isMuted ? 'Muted' : Math.round(playerStore.volume * 100) + '%'}`">
          <button
            @click="playerStore.toggleMute"
            :class="[
              'transition-colors p-1 rounded',
              playerStore.isMuted ? 'text-red-400' : 'text-lofi-muted hover:text-lofi-text'
            ]"
            :title="playerStore.isMuted ? 'Unmute All Audio' : 'Master Mute All Audio'"
          >
            <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-3 h-3" />
            <Volume2 v-else class="w-3 h-3" />
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="playerStore.isMuted ? 0 : playerStore.volume"
            @input="(e) => playerStore.setVolume(Number((e.target as HTMLInputElement).value))"
            class="w-14 h-1 bg-lofi-card rounded-full appearance-none cursor-pointer accent-lofi-primary"
          />
        </div>
      </div>
    </template>

    <!-- VIEW 2: VU VISUALIZER VIEW -->
    <template v-else-if="currentMiniView === 'vu'">
      <div class="flex-1 flex flex-col justify-between overflow-hidden py-1">
        <!-- Visualizer Canvas Container with Style Switcher -->
        <div class="w-full h-28 bg-lofi-card/60 rounded-xl border border-lofi-border/60 relative overflow-hidden flex items-center justify-center">
          <AnalogVuMeter v-if="appStore.visualizerMode === 'analog_vu'" :sensitivity="1.2" />
          <FrequencyBars v-else-if="appStore.visualizerMode === 'frequency_bars'" :sensitivity="1.2" />
          <CircularPulse v-else-if="appStore.visualizerMode === 'circular_pulse'" :sensitivity="1.2" />
          <PixelWave v-else-if="appStore.visualizerMode === 'pixel_wave'" :sensitivity="1.2" />

          <!-- Style Toggle Pill in top-right -->
          <div class="absolute top-1.5 right-1.5 flex items-center gap-1 bg-lofi-bg/85 backdrop-blur-sm px-2 py-0.5 rounded-md border border-lofi-border/70 no-drag z-20 shadow-sm">
            <button
              @click="cycleVisualizerMode"
              class="text-[9px] font-bold text-lofi-primary hover:text-lofi-text flex items-center gap-1 transition-colors"
              title="Click to switch Visualizer Style"
            >
              <Radio class="w-2.5 h-2.5" />
              <span class="capitalize">{{ appStore.visualizerMode.replace('_', ' ') }}</span>
            </button>
          </div>
        </div>

        <!-- Bottom Mini Audio Strip -->
        <div class="flex items-center justify-between pt-1 border-t border-lofi-border/50 text-[10px]">
          <div class="flex items-center gap-2 truncate flex-1 mr-2">
            <button
              @click="togglePlayPause"
              class="w-5 h-5 rounded-full bg-lofi-primary text-lofi-bg flex items-center justify-center hover:opacity-90 active:scale-95 flex-shrink-0 shadow-sm"
            >
              <Pause v-if="playerStore.isPlaying || ytStore.isPlaying" class="w-2.5 h-2.5 fill-current" />
              <Play v-else class="w-2.5 h-2.5 fill-current ml-0.2" />
            </button>
            <span class="truncate text-lofi-text font-medium">
              {{ (ytStore.isPlaying || appStore.activeTab === 'youtube') ? ytStore.currentTitle : (playerStore.currentTrack ? playerStore.currentTrack.title : 'Ready to play') }}
            </span>
          </div>

          <div class="flex items-center gap-1 flex-shrink-0">
            <button @click="playerStore.toggleMute" class="text-lofi-muted hover:text-lofi-text">
              <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-3 h-3 text-red-400" />
              <Volume2 v-else class="w-3 h-3" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="playerStore.isMuted ? 0 : playerStore.volume"
              @input="(e) => playerStore.setVolume(Number((e.target as HTMLInputElement).value))"
              class="w-12 h-1 bg-lofi-card rounded-full appearance-none cursor-pointer accent-lofi-primary"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- VIEW 3: FOCUS CLOCK WIDGET VIEW -->
    <template v-else>
      <div class="flex-1 flex flex-col justify-between py-1.5">
        <!-- Duration Presets & Mode -->
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-1">
            <button
              v-for="mins in focusPresets"
              :key="mins"
              @click="timerStore.setFocusMinutes(mins)"
              :class="[
                'px-2 py-0.5 rounded-md text-[10px] font-bold transition-all',
                timerStore.focusMinutes === mins
                  ? 'bg-lofi-primary text-lofi-bg shadow-sm'
                  : 'bg-lofi-card text-lofi-muted hover:text-lofi-text border border-lofi-border'
              ]"
            >
              {{ mins }}m
            </button>
          </div>

          <div class="text-[10px] text-lofi-muted font-mono flex items-center gap-1">
            <span>Sessions:</span>
            <span class="text-lofi-primary font-bold">{{ timerStore.completedSessions }}</span>
          </div>
        </div>

        <!-- Big Countdown Digits & Controls -->
        <div class="flex items-center justify-around py-1">
          <!-- Reset Button -->
          <button
            @click="timerStore.resetPomodoro"
            class="p-2 rounded-full bg-lofi-card border border-lofi-border text-lofi-muted hover:text-lofi-text transition-colors shadow-sm"
            title="Reset"
          >
            <RotateCcw class="w-3 h-3" />
          </button>

          <!-- Digital Clock Display -->
          <div class="flex flex-col items-center">
            <span class="text-3xl font-extrabold font-mono tracking-tight text-lofi-text">
              {{ formatTime(timerStore.pomodoroSecondsLeft) }}
            </span>
            <span class="text-[9px] text-lofi-muted uppercase tracking-widest">
              {{ timerStore.pomodoroMode === 'focus' ? `Focus (${timerStore.focusMinutes}m)` : 'Break' }}
            </span>
          </div>

          <!-- Play / Pause Focus -->
          <button
            @click="timerStore.isPomodoroRunning ? timerStore.pausePomodoro() : timerStore.startPomodoro()"
            class="w-10 h-10 rounded-2xl bg-lofi-primary text-lofi-bg flex items-center justify-center font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <Pause v-if="timerStore.isPomodoroRunning" class="w-4 h-4 fill-current" />
            <Play v-else class="w-4 h-4 fill-current ml-0.5" />
          </button>
        </div>

        <!-- Compact Bottom Strip: Audio Ticker & Quick Volume -->
        <div class="flex items-center justify-between pt-1 border-t border-lofi-border/50 text-[10px]">
          <div class="flex items-center gap-2 truncate flex-1 mr-2">
            <button
              @click="togglePlayPause"
              class="w-5 h-5 rounded-full bg-lofi-card border border-lofi-border flex items-center justify-center text-lofi-text hover:text-lofi-primary flex-shrink-0"
            >
              <Pause v-if="playerStore.isPlaying || ytStore.isPlaying" class="w-2.5 h-2.5 fill-current" />
              <Play v-else class="w-2.5 h-2.5 fill-current ml-0.2" />
            </button>
            <span class="truncate text-lofi-muted">
              {{ (ytStore.isPlaying || appStore.activeTab === 'youtube') ? ytStore.currentTitle : (playerStore.currentTrack ? playerStore.currentTrack.title : 'Ready to play') }}
            </span>
          </div>

          <div class="flex items-center gap-1 flex-shrink-0">
            <button @click="playerStore.toggleMute" class="text-lofi-muted hover:text-lofi-text">
              <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-3 h-3 text-red-400" />
              <Volume2 v-else class="w-3 h-3" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="playerStore.isMuted ? 0 : playerStore.volume"
              @input="(e) => playerStore.setVolume(Number((e.target as HTMLInputElement).value))"
              class="w-12 h-1 bg-lofi-card rounded-full appearance-none cursor-pointer accent-lofi-primary"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.drag-region {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
.text-2xs {
  font-size: 0.68rem;
}
</style>
