<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Minus,
  Square,
  Copy,
  X,
  Pin,
  PinOff,
  Maximize2,
  Music,
  Activity
} from 'lucide-vue-next'
import { useAppStore } from '../../stores/app'
import { usePlayerStore } from '../../stores/player'
import { useYouTubeStore } from '../../stores/youtube'

const appStore = useAppStore()
const playerStore = usePlayerStore()
const ytStore = useYouTubeStore()

const isMaximized = ref(false)
const isPinned = ref(false)

async function handleMinimize(): Promise<void> {
  if (window.api?.minimizeWindow) {
    await window.api.minimizeWindow()
  }
}

async function handleMaximize(): Promise<void> {
  if (window.api?.maximizeWindow) {
    isMaximized.value = await window.api.maximizeWindow()
  }
}

async function handleClose(): Promise<void> {
  if (window.api?.closeWindow) {
    await window.api.closeWindow()
  }
}

async function handleTogglePin(): Promise<void> {
  if (window.api?.toggleAlwaysOnTop) {
    isPinned.value = await window.api.toggleAlwaysOnTop()
  }
}

async function handleToggleMini(): Promise<void> {
  appStore.toggleMiniPlayer()
  if (appStore.isMiniPlayer) {
    if (window.api?.enterMiniMode) await window.api.enterMiniMode()
    isPinned.value = true
  } else {
    if (window.api?.exitMiniMode) await window.api.exitMiniMode()
    isPinned.value = false
  }
}

onMounted(async () => {
  if (window.api?.isWindowMaximized) {
    isMaximized.value = await window.api.isWindowMaximized()
  }
  if (window.api?.getAlwaysOnTop) {
    isPinned.value = await window.api.getAlwaysOnTop()
  }
})
</script>

<template>
  <header class="h-9 w-full bg-lofi-surface border-b border-lofi-border flex items-center justify-between px-3 select-none flex-shrink-0 drag-region z-50">
    <!-- Left: App Identity -->
    <div class="flex items-center gap-2 text-xs font-bold text-lofi-text no-drag">
      <div class="w-4 h-4 rounded bg-lofi-primary/20 flex items-center justify-center text-lofi-primary">
        <Music class="w-2.5 h-2.5" />
      </div>
      <span class="tracking-wider text-2xs text-lofi-text font-bold uppercase">Lofi Player</span>
    </div>

    <!-- Center: Playing Ticker -->
    <div class="flex items-center gap-2 text-2xs text-lofi-muted truncate max-w-sm px-4">
      <Activity v-if="playerStore.isPlaying || ytStore.isPlaying" class="w-3 h-3 text-lofi-primary animate-pulse flex-shrink-0" />
      <span class="truncate">
        {{ ytStore.isPlaying ? `🔴 ${ytStore.currentChannel} — ${ytStore.currentTitle}` : (playerStore.currentTrack ? `${playerStore.currentTrack.artist} — ${playerStore.currentTrack.title}` : 'Cozy Lofi Station') }}
      </span>
    </div>

    <!-- Right: Window Action Buttons -->
    <div class="flex items-center gap-1.5 no-drag text-lofi-muted">
      <!-- Always on Top Toggle -->
      <button
        @click="handleTogglePin"
        :class="[
          'p-1.5 rounded-md hover:text-lofi-text transition-colors',
          isPinned ? 'text-lofi-primary bg-lofi-primary/10' : 'hover:bg-lofi-card'
        ]"
        :title="isPinned ? 'Unpin Window' : 'Pin Always on Top'"
      >
        <Pin v-if="isPinned" class="w-3 h-3" />
        <PinOff v-else class="w-3 h-3" />
      </button>

      <!-- Mini Player Mode Toggle -->
      <button
        @click="handleToggleMini"
        class="p-1.5 rounded-md hover:text-lofi-text hover:bg-lofi-card transition-colors"
        title="Switch to Mini Player Mode"
      >
        <Maximize2 class="w-3 h-3" />
      </button>

      <div class="w-px h-3 bg-lofi-border mx-1"></div>

      <!-- Minimize Window -->
      <button
        @click="handleMinimize"
        class="p-1.5 rounded-md hover:text-lofi-text hover:bg-lofi-card transition-colors"
        title="Minimize"
      >
        <Minus class="w-3 h-3" />
      </button>

      <!-- Maximize / Restore Window -->
      <button
        @click="handleMaximize"
        class="p-1.5 rounded-md hover:text-lofi-text hover:bg-lofi-card transition-colors"
        :title="isMaximized ? 'Restore' : 'Maximize'"
      >
        <Copy v-if="isMaximized" class="w-3 h-3" />
        <Square v-else class="w-3 h-3" />
      </button>

      <!-- Close Window -->
      <button
        @click="handleClose"
        class="p-1.5 rounded-md hover:text-white hover:bg-red-500 transition-colors"
        title="Close"
      >
        <X class="w-3 h-3" />
      </button>
    </div>
  </header>
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
