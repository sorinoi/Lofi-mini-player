<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import {
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  Video,
  Radio,
  RadioTower,
  Search,
  Trash2,
  Tv,
  Loader2,
  AlertCircle,
  X,
  Film,
  Minimize2,
  Target,
  Moon,
  Volume2,
  VolumeX,
  FileJson,
  CheckSquare,
  StickyNote,
  PanelRightOpen
} from 'lucide-vue-next'
import { useAppStore } from '../../stores/app'
import { useYouTubeStore } from '../../stores/youtube'
import { usePlayerStore } from '../../stores/player'
import { useTimerStore } from '../../stores/timer'
import { useTodoStore } from '../../stores/todo'
import { useNoteStore } from '../../stores/note'
import { youtubeService, YOUTUBE_LOFI_PRESETS } from '../../services/youtubeService'
import { audioEngine } from '../../services/audioEngine'
import VisualizerContainer from '../visualizers/VisualizerContainer.vue'
import RightSidebarPanel from '../layout/RightSidebarPanel.vue'
import TodoView from '../todo/TodoView.vue'
import NoteView from '../notes/NoteView.vue'

const appStore = useAppStore()
const ytStore = useYouTubeStore()
const playerStore = usePlayerStore()
const timerStore = useTimerStore()
const todoStore = useTodoStore()
const noteStore = useNoteStore()

const rightPanelMode = ref<'playlist' | 'todo' | 'note'>('playlist')

const isPureVideoMode = computed(() => {
  return (
    ytStore.isCinemaMode ||
    (appStore.isMiniPlayer && appStore.miniPlayerView === 'video') ||
    (appStore.isDockMode && appStore.dockMiniPlayerView === 'video')
  )
})

const isDockVideoMode = computed(() => {
  return appStore.isDockMode && appStore.dockMiniPlayerView === 'video'
})

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function handleGlobalKeyDown(e: KeyboardEvent): void {
  if (e.key === 'Escape' && ytStore.isCinemaMode) {
    ytStore.isCinemaMode = false
  }
}

async function mountYouTubePlayer(): Promise<void> {
  try {
    await youtubeService.createPlayer(
      'youtube-player-element',
      ytStore.currentVideoId,
      playerStore.volume,
      playerStore.isMuted,
      false,
      (state: number) => {
        // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
        if (state === 1) {
          ytStore.isPlaying = true
          ytStore.isLoading = false
          ytStore.clearError()
          audioEngine.setExternalSourceState(true, playerStore.volume, playerStore.isMuted)
        } else if (state === 3) {
          ytStore.isLoading = true
        } else if (state === 2 || state === 0) {
          ytStore.isPlaying = false
          ytStore.isLoading = false
          audioEngine.setExternalSourceState(false, playerStore.volume, playerStore.isMuted)
        }
      },
      (code: number, message: string) => {
        ytStore.handlePlayerError(code, message)
      }
    )
  } catch (e) {
    console.warn('Failed to initialize YouTube IFrame Player:', e)
  }
}

watch(
  () => ytStore.currentVideoId,
  (newId, oldId) => {
    if (oldId && newId !== oldId) {
      youtubeService.loadVideo(newId)
    }
  }
)

async function handleLoadUrl(): Promise<void> {
  if (!ytStore.urlInput.trim() || ytStore.isLoading) return
  await ytStore.playUrl(ytStore.urlInput)
}

onMounted(() => {
  ytStore.initBookmarks()
  todoStore.initTodos()
  noteStore.initNotes()
  mountYouTubePlayer()
  window.addEventListener('keydown', handleGlobalKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeyDown)
})
</script>

<template>
  <div
    :class="[
      'w-full h-full flex flex-col transition-all',
      isPureVideoMode
        ? 'p-0 overflow-hidden bg-black'
        : 'p-6 overflow-y-auto w-full space-y-6'
    ]"
  >
    <!-- Floating Minimalist Cinema Header (Only in Cinema Mode) -->
    <div
      v-if="ytStore.isCinemaMode && !appStore.isMiniPlayer && !appStore.isDockMode"
      class="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-auto select-none animate-fadeIn"
    >
      <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs shadow-2xl">
        <span class="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[8px] uppercase tracking-wider flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          LIVE
        </span>
        <span class="font-bold text-white truncate max-w-sm">{{ ytStore.currentTitle }}</span>
        <span class="text-white/40 text-[10px] hidden sm:inline">• {{ ytStore.currentChannel }}</span>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="ytStore.toggleCinemaMode"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-black/60 hover:bg-black/90 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all shadow-2xl active:scale-95 cursor-pointer"
          title="Exit Cinema Mode (Esc)"
        >
          <Minimize2 class="w-3.5 h-3.5 text-lofi-pink" />
          <span>Exit Cinema</span>
          <kbd class="px-1.5 py-0.2 rounded bg-white/10 font-mono text-[9px] text-white/60">Esc</kbd>
        </button>
      </div>
    </div>

    <!-- Header & URL Input (Hidden in Cinema / Mini Video / Dock Video mode) -->
    <div
      v-if="!isPureVideoMode"
      class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
    >
      <div>
        <h2 class="text-2xl font-bold text-lofi-text flex items-center gap-2.5">
          <Tv class="w-6 h-6 text-lofi-pink" />
          <span>YouTube Stream Player</span>
        </h2>
        <p class="text-xs text-lofi-muted mt-0.5">
          Stream 24/7 Lofi live channels and custom YouTube videos with video & visualizer sync
        </p>
      </div>

      <!-- Paste YouTube Link Bar -->
      <div class="w-full md:w-auto flex-1 max-w-xl flex flex-col gap-1">
        <form @submit.prevent="handleLoadUrl" class="flex items-center gap-2">
          <div class="relative flex-1">
            <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lofi-muted" />
            <input
              type="text"
              v-model="ytStore.urlInput"
              :disabled="ytStore.isLoading"
              placeholder="Paste YouTube link (Watch, Shorts, Live, @Channel)..."
              class="w-full pl-10 pr-3 py-2 bg-lofi-surface/80 border border-lofi-border rounded-xl text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-lofi-pink transition-colors disabled:opacity-60"
            />
          </div>
          <button
            type="submit"
            :disabled="ytStore.isLoading || !ytStore.urlInput.trim()"
            class="px-4 py-2 rounded-xl bg-lofi-pink hover:bg-lofi-pink/90 text-lofi-bg text-xs font-bold shadow-md transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="ytStore.isLoading" class="w-3.5 h-3.5 animate-spin" />
            <span>{{ ytStore.isLoading ? 'Resolving...' : 'Play Stream' }}</span>
          </button>
        </form>
      </div>
    </div>

    <!-- Error Alert Banner -->
    <div
      v-if="ytStore.errorMessage && !isPureVideoMode"
      class="p-3.5 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-center justify-between gap-3 text-xs text-red-300 backdrop-blur-sm shadow-md animate-fadeIn"
    >
      <div class="flex items-center gap-2.5 min-w-0">
        <AlertCircle class="w-4 h-4 text-red-400 flex-shrink-0" />
        <span class="truncate">{{ ytStore.errorMessage }}</span>
      </div>
      <button
        @click="ytStore.clearError"
        class="p-1 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors flex-shrink-0"
        title="Dismiss"
      >
        <X class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Main Content Area (2-Column Watch Layout when in Desktop View, Pure Video in Cinema/Mini/Dock) -->
    <div
      :class="[
        isPureVideoMode
          ? 'w-full h-full flex items-center justify-center'
          : 'w-full flex-1 flex flex-col lg:flex-row items-start gap-6 min-h-0'
      ]"
    >
      <!-- LEFT / PRIMARY COLUMN: Main Video Player & Metadata (Always visible, expands to fill available width) -->
      <div
        :class="[
          isPureVideoMode
            ? 'w-full h-full'
            : 'w-full lg:flex-1 flex flex-col gap-4 min-w-0'
        ]"
      >
        <!-- Main Player Container (Dual Mode: Video vs VU Visualizer) -->
        <div
          :class="[
            isPureVideoMode
              ? 'w-full h-full p-0 m-0 border-0 rounded-none bg-black flex items-center justify-center relative'
              : 'w-full bg-lofi-surface/80 border border-lofi-border rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-2xl flex flex-col gap-4 relative overflow-hidden'
          ]"
        >
          <!-- Ambient Glow Behind Player (Only in Visualizer Mode to avoid per-frame GPU redraw during video playback) -->
          <div
            v-if="!isPureVideoMode && ytStore.displayMode === 'visualizer'"
            class="absolute -top-24 -right-24 w-80 h-80 bg-lofi-pink/10 rounded-full blur-3xl pointer-events-none"
          ></div>

          <!-- Display Area: 16:9 Video Embed OR Visualizer (Using v-show to prevent reload) -->
          <div
            :class="[
              'w-full relative overflow-hidden flex items-center justify-center',
              isPureVideoMode
                ? 'w-full h-full rounded-none border-0'
                : 'rounded-2xl bg-black/60 border border-lofi-border min-h-[320px] aspect-video'
            ]"
          >
            <!-- 1. Video Mode Container (Protected with Non-Destructive Wrapper & Off-screen Preservation) -->
            <div
              :class="[
                'w-full h-full flex items-center justify-center',
                ytStore.displayMode === 'video' || isPureVideoMode ? 'absolute inset-0' : 'invisible-player'
              ]"
            >
              <div id="youtube-player-element-wrapper" class="w-full h-full relative">
                <div id="youtube-player-element" class="w-full h-full"></div>

                <!-- Loading / Buffering Overlay -->
                <div
                  v-if="ytStore.isLoading"
                  class="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 z-10 pointer-events-none"
                >
                  <Loader2 class="w-8 h-8 text-lofi-pink animate-spin" />
                  <p class="text-xs text-lofi-text font-medium">Connecting to stream...</p>
                </div>
              </div>
            </div>

            <!-- 2. VU Visualizer Mode -->
            <div
              v-if="ytStore.displayMode === 'visualizer' && !isPureVideoMode"
              class="w-full h-full p-4 flex items-center justify-center bg-lofi-bg/90"
            >
              <VisualizerContainer />
            </div>

            <!-- 3. Floating Ghost Timer Overlay (Desktop & Cinema Mode Video View) -->
            <div
              v-if="!appStore.isMiniPlayer && !isDockVideoMode && (timerStore.isPomodoroRunning || timerStore.isSleepTimerActive)"
              :class="[
                'absolute z-20 pointer-events-none select-none flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-black/35 backdrop-blur-xs border border-white/10 shadow-2xl transition-all animate-fadeIn',
                ytStore.isCinemaMode ? 'top-16 right-4' : 'top-4 right-4'
              ]"
            >
              <Target v-if="timerStore.isPomodoroRunning" class="w-4 h-4 text-lofi-pink/70 animate-pulse" />
              <Moon v-else-if="timerStore.isSleepTimerActive" class="w-4 h-4 text-lofi-purple/70 animate-pulse" />
              <div class="flex flex-col items-end">
                <span class="font-mono text-base font-bold tracking-widest text-white/50 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  {{ timerStore.isPomodoroRunning ? formatTime(timerStore.pomodoroSecondsLeft) : formatTime(timerStore.sleepSecondsLeft) }}
                </span>
                <span class="text-[8px] uppercase tracking-wider text-white/35 font-semibold">
                  {{ timerStore.isPomodoroRunning ? (timerStore.pomodoroMode === 'focus' ? 'Focus Session' : 'Break Time') : 'Sleep Countdown' }}
                </span>
              </div>
            </div>

            <!-- 4. Dock Sidebar Video Mode Overlays -->
            <template v-if="isDockVideoMode">
              <!-- Top Live Badge & Title -->
              <div class="absolute top-1.5 left-1.5 right-1.5 z-20 flex items-center gap-1.5 pointer-events-none select-none">
                <span class="px-1 py-0.2 rounded bg-red-600/90 text-white font-bold text-[7px] uppercase tracking-wider shadow-sm flex items-center gap-1">
                  <span class="w-1 h-1 rounded-full bg-white animate-ping"></span>
                  LIVE
                </span>
                <span class="text-[9px] font-semibold text-white drop-shadow-md truncate max-w-[200px]">
                  {{ ytStore.currentTitle || 'YouTube Stream' }}
                </span>
              </div>

              <!-- Ghost Timer in Dock Mode -->
              <div
                v-if="timerStore.isPomodoroRunning || timerStore.isSleepTimerActive"
                class="absolute inset-0 flex items-center justify-center pointer-events-none z-15 select-none"
              >
                <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-[2px] border border-white/10 shadow-xl">
                  <Target v-if="timerStore.isPomodoroRunning" class="w-3 h-3 text-lofi-pink/80 animate-pulse" />
                  <Moon v-else-if="timerStore.isSleepTimerActive" class="w-3 h-3 text-lofi-purple/80 animate-pulse" />
                  <span class="font-mono text-base font-bold tracking-wider text-white/70 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                    {{ timerStore.isPomodoroRunning ? formatTime(timerStore.pomodoroSecondsLeft) : formatTime(timerStore.sleepSecondsLeft) }}
                  </span>
                </div>
              </div>

              <!-- Bottom Minimal HUD -->
              <div class="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between p-1 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 text-[9px] z-20 shadow-md pointer-events-auto select-none">
                <div class="flex items-center gap-1.5 truncate flex-1 mr-2">
                  <button
                    @click="ytStore.togglePlayPause()"
                    class="w-4 h-4 rounded-full bg-lofi-pink text-lofi-bg flex items-center justify-center hover:opacity-90 active:scale-95 flex-shrink-0 shadow-sm cursor-pointer"
                    title="Play / Pause Stream"
                  >
                    <Pause v-if="ytStore.isPlaying" class="w-2 h-2 fill-current" />
                    <Play v-else class="w-2 h-2 fill-current ml-0.2" />
                  </button>
                  <span class="truncate text-white/90 font-medium">
                    {{ ytStore.currentChannel || 'YouTube Live' }}
                  </span>
                </div>

                <div class="flex items-center gap-1 flex-shrink-0">
                  <button @click="playerStore.toggleMute" class="text-white/80 hover:text-white cursor-pointer" :title="playerStore.isMuted ? 'Unmute' : 'Mute'">
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
                    class="w-12 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-lofi-pink"
                  />
                </div>
              </div>
            </template>
          </div>

          <!-- Player Controls & Metadata Bar (Title, Live Badge, View Mode Switcher, Cinema Mode, Bookmark) -->
          <div
            v-if="!isPureVideoMode"
            class="flex flex-wrap items-center justify-between gap-3 pt-1"
          >
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <span class="px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-2xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-red-500/30 flex-shrink-0">
                <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>LIVE STREAM</span>
              </span>
              <div class="truncate">
                <h3 class="text-sm font-bold text-lofi-text truncate">{{ ytStore.currentTitle }}</h3>
                <p class="text-2xs text-lofi-muted truncate">{{ ytStore.currentChannel }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <!-- Video / Visualizer Mode Switcher Toggle Button -->
              <button
                @click="ytStore.toggleDisplayMode"
                class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-lofi-card hover:bg-lofi-border text-lofi-text text-xs font-semibold border border-lofi-border transition-all shadow-sm cursor-pointer"
                title="Toggle between Video View and VU Meter Visualizer"
              >
                <component :is="ytStore.displayMode === 'video' ? Radio : Video" class="w-3.5 h-3.5 text-lofi-primary" />
                <span>{{ ytStore.displayMode === 'video' ? 'Switch to VU Visualizer' : 'Switch to Video View' }}</span>
              </button>

              <!-- Cinema / Pure Video Mode Button -->
              <button
                @click="ytStore.toggleCinemaMode"
                :class="[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                  ytStore.isCinemaMode
                    ? 'bg-lofi-pink/20 text-lofi-pink border-lofi-pink/40 shadow-sm'
                    : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
                ]"
                :title="ytStore.isCinemaMode ? 'Exit Cinema Mode (Esc)' : 'Cinema Mode (Pure Video Focus)'"
              >
                <component :is="ytStore.isCinemaMode ? Minimize2 : Film" class="w-3.5 h-3.5 text-lofi-pink" />
                <span>{{ ytStore.isCinemaMode ? 'Exit Cinema' : 'Cinema Mode' }}</span>
              </button>

              <!-- Bookmark Button -->
              <button
                @click="ytStore.toggleBookmark"
                :class="[
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                  ytStore.isBookmarked
                    ? 'bg-lofi-primary/20 text-lofi-primary border-lofi-primary/40'
                    : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
                ]"
                title="Bookmark this stream"
              >
                <BookmarkCheck v-if="ytStore.isBookmarked" class="w-3.5 h-3.5 text-lofi-primary" />
                <Bookmark v-else class="w-3.5 h-3.5" />
                <span>{{ ytStore.isBookmarked ? 'Bookmarked' : 'Save' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT SIDEBAR COLUMN: Universal Multi-Mode Sidebar (Playlists, Tasks, Notes, Toggleable) -->
      <RightSidebarPanel v-if="!isPureVideoMode && appStore.showRightSidebar" />

      <!-- Floating Re-open Sidebar Button on YouTube Screen when hidden -->
      <button
        v-if="!isPureVideoMode && !appStore.showRightSidebar"
        @click="appStore.toggleRightSidebar"
        class="fixed right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-lofi-surface/90 hover:bg-lofi-card border border-lofi-border text-lofi-muted hover:text-lofi-pink shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer z-30 group"
        title="Open Workspace Sidebar (Tasks / Stations / Notes)"
      >
        <PanelRightOpen class="w-4 h-4 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.text-2xs {
  font-size: 0.68rem;
}

#youtube-player-element-wrapper,
#youtube-player-element,
:deep(#youtube-player-element-wrapper iframe),
:deep(#youtube-player-element iframe) {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
  contain: strict;
  border: 0;
  outline: 0;
}

.invisible-player {
  position: absolute !important;
  left: -99999px !important;
  top: -99999px !important;
  width: 100% !important;
  height: 100% !important;
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: visible !important;
  contain: strict !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
