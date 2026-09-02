<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  Music,
  FolderOpen,
  Youtube,
  CloudRain,
  Sliders,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Activity,
  Maximize2,
  Plus,
  Repeat,
  Shuffle,
  Timer,
  Moon,
  Target,
  Keyboard,
  Tv,
  CheckSquare,
  StickyNote,
  PanelRightOpen,
  RotateCcw,
  X,
  Sparkles
} from 'lucide-vue-next'
import { useAppStore } from './stores/app'
import { usePlayerStore } from './stores/player'
import { useLibraryStore } from './stores/library'
import { useAmbientStore } from './stores/ambient'
import { useTimerStore } from './stores/timer'
import { useYouTubeStore } from './stores/youtube'
import { useTodoStore } from './stores/todo'
import { useNoteStore } from './stores/note'
import { youtubeService } from './services/youtubeService'
import { audioEngine } from './services/audioEngine'
import { setupKeyboardShortcuts } from './services/shortcutService'
import CustomTitlebar from './components/layout/CustomTitlebar.vue'
import MiniPlayer from './components/layout/MiniPlayer.vue'
import DockSidebar from './components/layout/DockSidebar.vue'
import VisualizerContainer from './components/visualizers/VisualizerContainer.vue'
import RightSidebarPanel from './components/layout/RightSidebarPanel.vue'
import MusicLibrary from './components/library/MusicLibrary.vue'
import AmbientMixer from './components/ambient/AmbientMixer.vue'
import YouTubePlayer from './components/youtube/YouTubePlayer.vue'
import TodoView from './components/todo/TodoView.vue'
import NoteView from './components/notes/NoteView.vue'
import TimerModal from './components/timers/TimerModal.vue'

const appStore = useAppStore()
const playerStore = usePlayerStore()
const libraryStore = useLibraryStore()
const ambientStore = useAmbientStore()
const timerStore = useTimerStore()
const ytStore = useYouTubeStore()
const todoStore = useTodoStore()
const noteStore = useNoteStore()

const isTimerModalOpen = ref(false)
const showShortcutsModal = ref(false)

function handleTogglePlayPause(): void {
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

function handleShowYouTubeVideo(): void {
  appStore.setActiveTab('youtube')
  ytStore.displayMode = 'video'
}
let cleanupShortcuts: (() => void) | null = null

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

async function handleSidebarImport(): Promise<void> {
  const newTracks = await libraryStore.importFiles()
  if (newTracks.length > 0 && playerStore.playlist.length === 0) {
    playerStore.playlist = [...libraryStore.tracks]
    playerStore.playTrack(0)
  }
}

async function handleSwitchToMini(): Promise<void> {
  await appStore.toggleMiniPlayer()
}

onMounted(async () => {
  cleanupShortcuts = setupKeyboardShortcuts()
  await libraryStore.initLibrary()
  await todoStore.initTodos()
  await noteStore.initNotes()
  await ytStore.initBookmarks()
  if (libraryStore.tracks.length > 0 && playerStore.playlist.length === 0) {
    playerStore.playlist = [...libraryStore.tracks]
  }
})

onUnmounted(() => {
  if (cleanupShortcuts) {
    cleanupShortcuts()
  }
})
</script>

<template>
  <div class="w-screen h-screen overflow-hidden bg-lofi-bg relative select-none font-sans">
    <!-- Mini Player Mode View (Active Overlay) -->
    <div
      v-show="appStore.isMiniPlayer"
      class="w-full h-full absolute inset-0 z-50 overflow-hidden"
      :class="[
        appStore.miniPlayerView === 'video' ? 'bg-transparent' : 'bg-lofi-bg'
      ]"
    >
      <MiniPlayer />
    </div>

    <!-- Right Sidebar Dock Mode View (Active Overlay) -->
    <div
      v-show="appStore.isDockMode"
      class="w-full h-full absolute inset-0 z-50 overflow-hidden"
    >
      <DockSidebar />
    </div>

    <!-- YouTube Stream Player (Persistent DOM, positioned adaptively) -->
    <div
      :class="[
        'overflow-hidden',
        ytStore.isCinemaMode && !appStore.isMiniPlayer && !appStore.isDockMode
          ? 'cinema-video-fullscreen'
          : appStore.isMiniPlayer && appStore.miniPlayerView === 'video'
          ? 'mini-video-fixed'
          : appStore.isDockMode && appStore.dockMiniPlayerView === 'video'
          ? 'dock-video-fixed'
          : appStore.isMiniPlayer || appStore.isDockMode
          ? 'invisible-player'
          : appStore.activeTab === 'youtube'
          ? 'desktop-youtube-active'
          : 'invisible-player'
      ]"
    >
      <YouTubePlayer />
    </div>

    <!-- Full Desktop Experience Mode View (Preserved in DOM to maintain continuous YouTube playback) -->
    <div
      :class="[
        'w-full h-full flex flex-col bg-lofi-bg text-lofi-text overflow-hidden',
        appStore.isMiniPlayer || appStore.isDockMode ? 'invisible-player' : 'relative z-10'
      ]"
    >
      <!-- Custom Frameless Titlebar -->
      <CustomTitlebar />

    <div class="flex-1 flex overflow-hidden">
      <!-- Sidebar Navigation -->
      <aside class="w-60 bg-lofi-surface border-r border-lofi-border flex flex-col justify-between p-3.5 flex-shrink-0 z-30">
        <div class="space-y-5">
          <!-- App Logo -->
          <div class="flex items-center gap-2.5 px-2">
            <div class="w-8 h-8 rounded-lg bg-lofi-primary/20 flex items-center justify-center text-lofi-primary shadow-sm">
              <Music class="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 class="text-sm font-bold text-lofi-text tracking-wide">LOFI PLAYER</h1>
              <p class="text-2xs text-lofi-muted">Cozy Chillout Station</p>
            </div>
          </div>

          <!-- Nav Items -->
          <nav class="space-y-1">
            <button
              @click="appStore.setActiveTab('player')"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                appStore.activeTab === 'player'
                  ? 'bg-lofi-card text-lofi-primary border border-lofi-border font-semibold shadow-sm'
                  : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-surface/60'
              ]"
            >
              <Activity class="w-4 h-4" />
              <span>Now Playing & VU</span>
            </button>

            <button
              @click="appStore.setActiveTab('library')"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                appStore.activeTab === 'library'
                  ? 'bg-lofi-card text-lofi-primary border border-lofi-border font-semibold shadow-sm'
                  : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-surface/60'
              ]"
            >
              <FolderOpen class="w-4 h-4" />
              <span>Music Library</span>
              <span
                v-if="libraryStore.tracks.length > 0"
                class="ml-auto px-1.5 py-0.2 text-2xs bg-lofi-surface rounded-full text-lofi-muted border border-lofi-border"
              >
                {{ libraryStore.tracks.length }}
              </span>
            </button>

            <button
              @click="appStore.setActiveTab('ambient')"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                appStore.activeTab === 'ambient'
                  ? 'bg-lofi-card text-lofi-primary border border-lofi-border font-semibold shadow-sm'
                  : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-surface/60'
              ]"
            >
              <CloudRain class="w-4 h-4 text-lofi-accent" />
              <span>Ambient Mixer</span>
              <span
                v-if="ambientStore.activeCount > 0"
                class="ml-auto px-1.5 py-0.2 text-2xs bg-lofi-accent/20 text-lofi-accent rounded-full font-bold border border-lofi-accent/30"
              >
                {{ ambientStore.activeCount }}
              </span>
            </button>

            <button
              @click="appStore.setActiveTab('youtube')"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                appStore.activeTab === 'youtube'
                  ? 'bg-lofi-card text-lofi-primary border border-lofi-border font-semibold shadow-sm'
                  : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-surface/60'
              ]"
            >
              <Youtube class="w-4 h-4 text-lofi-pink" />
              <span>YouTube Stream</span>
            </button>

            <button
              @click="appStore.setActiveTab('todo')"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                appStore.activeTab === 'todo'
                  ? 'bg-lofi-card text-lofi-primary border border-lofi-border font-semibold shadow-sm'
                  : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-surface/60'
              ]"
            >
              <CheckSquare class="w-4 h-4 text-emerald-400" />
              <span>Focus Tasks</span>
              <span
                v-if="todoStore.pendingCount > 0"
                class="ml-auto px-1.5 py-0.2 text-2xs bg-emerald-500/20 text-emerald-300 rounded-full font-bold border border-emerald-500/30"
              >
                {{ todoStore.pendingCount }}
              </span>
            </button>

            <button
              @click="appStore.setActiveTab('notes')"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                appStore.activeTab === 'notes'
                  ? 'bg-lofi-card text-amber-400 border border-lofi-border font-semibold shadow-sm'
                  : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-surface/60'
              ]"
            >
              <StickyNote class="w-4 h-4 text-amber-400" />
              <span>Note Record</span>
              <span
                v-if="noteStore.totalCount > 0"
                class="ml-auto px-1.5 py-0.2 text-2xs bg-amber-500/20 text-amber-300 rounded-full font-bold border border-amber-500/30"
              >
                {{ noteStore.totalCount }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Quick Actions: Timer, Import & Mini View -->
        <div class="space-y-2">
          <!-- 1. Large High-Visibility Digital Focus Clock Widget (Active when timer is running or in progress) -->
          <div
            v-if="timerStore.isPomodoroRunning || timerStore.isSleepTimerActive || (timerStore.pomodoroSecondsLeft < timerStore.focusMinutes * 60)"
            class="p-3 bg-lofi-card/95 border border-lofi-border rounded-2xl shadow-xl backdrop-blur-md relative overflow-hidden flex flex-col gap-1.5 animate-fadeIn select-none group"
          >
            <!-- Ambient Accent Glow -->
            <div
              :class="[
                'absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-40',
                timerStore.isSleepTimerActive
                  ? 'bg-lofi-purple'
                  : timerStore.pomodoroMode === 'focus'
                  ? 'bg-lofi-pink'
                  : 'bg-emerald-400'
              ]"
            ></div>

            <!-- Header Badge & Settings -->
            <div class="flex items-center justify-between z-10">
              <div class="flex items-center gap-1.5">
                <Target v-if="!timerStore.isSleepTimerActive && timerStore.pomodoroMode === 'focus'" class="w-3.5 h-3.5 text-lofi-pink animate-pulse" />
                <Sparkles v-else-if="!timerStore.isSleepTimerActive" class="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <Moon v-else class="w-3.5 h-3.5 text-lofi-purple animate-pulse" />

                <span
                  :class="[
                    'text-[10px] font-bold uppercase tracking-wider',
                    timerStore.isSleepTimerActive
                      ? 'text-lofi-purple'
                      : timerStore.pomodoroMode === 'focus'
                      ? 'text-lofi-pink'
                      : 'text-emerald-400'
                  ]"
                >
                  {{ timerStore.isSleepTimerActive ? 'Sleep Timer' : (timerStore.pomodoroMode === 'focus' ? 'Focus Session' : 'Break Time') }}
                </span>
              </div>

              <!-- Open Full Timer Modal -->
              <button
                @click="isTimerModalOpen = true"
                class="text-lofi-muted hover:text-lofi-text p-1 rounded-lg hover:bg-lofi-surface/60 transition-colors cursor-pointer"
                title="Timer Settings"
              >
                <Sliders class="w-3 h-3" />
              </button>
            </div>

            <!-- Large Digital Clock Display (High Contrast & Clear) -->
            <div
              @click="isTimerModalOpen = true"
              class="py-1 cursor-pointer flex flex-col items-center justify-center z-10 hover:opacity-90 transition-opacity"
              title="Click to configure timer"
            >
              <span
                :class="[
                  'font-mono font-black text-2xl tracking-widest text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] tabular-nums'
                ]"
              >
                {{ timerStore.isSleepTimerActive ? formatTime(timerStore.sleepSecondsLeft) : formatTime(timerStore.pomodoroSecondsLeft) }}
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full h-1.5 bg-lofi-bg/80 rounded-full overflow-hidden z-10 border border-white/5">
              <div
                :class="[
                  'h-full rounded-full transition-all duration-300',
                  timerStore.isSleepTimerActive
                    ? 'bg-lofi-purple'
                    : timerStore.pomodoroMode === 'focus'
                    ? 'bg-lofi-pink'
                    : 'bg-emerald-400'
                ]"
                :style="{ width: `${timerStore.isSleepTimerActive ? timerStore.sleepProgress : timerStore.pomodoroProgress}%` }"
              ></div>
            </div>

            <!-- Mini Controls Strip -->
            <div class="flex items-center justify-between pt-1 text-[10px] text-lofi-muted z-10">
              <button
                v-if="!timerStore.isSleepTimerActive"
                @click="timerStore.isPomodoroRunning ? timerStore.pausePomodoro() : timerStore.startPomodoro()"
                class="px-2 py-0.5 rounded-md bg-lofi-surface/80 hover:bg-lofi-surface hover:text-lofi-text border border-lofi-border/60 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Pause v-if="timerStore.isPomodoroRunning" class="w-2.5 h-2.5 fill-current text-amber-400" />
                <Play v-else class="w-2.5 h-2.5 fill-current text-emerald-400 ml-0.2" />
                <span>{{ timerStore.isPomodoroRunning ? 'Pause' : 'Resume' }}</span>
              </button>

              <button
                v-if="!timerStore.isSleepTimerActive"
                @click="timerStore.resetPomodoro()"
                class="px-2 py-0.5 rounded-md bg-lofi-surface/80 hover:bg-lofi-surface hover:text-red-300 border border-lofi-border/60 transition-all flex items-center gap-1 cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw class="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>

              <button
                v-if="timerStore.isSleepTimerActive"
                @click="timerStore.cancelSleepTimer()"
                class="w-full py-0.5 rounded-md bg-lofi-surface/80 hover:bg-lofi-surface hover:text-red-300 border border-lofi-border/60 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <X class="w-2.5 h-2.5" />
                <span>Cancel Sleep Timer</span>
              </button>
            </div>
          </div>

          <!-- 2. Compact Focus / Sleep Timer Trigger Button (When idle / not active) -->
          <button
            v-else
            @click="isTimerModalOpen = true"
            class="w-full flex items-center justify-between py-2 px-2.5 rounded-xl bg-lofi-card hover:bg-lofi-border/60 text-lofi-text text-xs font-semibold border border-lofi-border transition-all shadow-sm group cursor-pointer"
          >
            <div class="flex items-center gap-2">
              <Timer class="w-3.5 h-3.5 text-lofi-primary group-hover:rotate-12 transition-transform" />
              <span>Focus Timer</span>
            </div>

            <!-- Active Timer Pill (Fallback) -->
            <span
              v-if="timerStore.isPomodoroRunning"
              class="px-1.5 py-0.5 rounded-full bg-lofi-primary/20 text-lofi-primary text-2xs font-mono font-bold animate-pulse flex items-center gap-1"
            >
              <Target class="w-2.5 h-2.5" />
              {{ formatTime(timerStore.pomodoroSecondsLeft) }}
            </span>

            <span
              v-else-if="timerStore.isSleepTimerActive"
              class="px-1.5 py-0.5 rounded-full bg-lofi-purple/20 text-lofi-purple text-2xs font-mono font-bold animate-pulse flex items-center gap-1"
            >
              <Moon class="w-2.5 h-2.5" />
              {{ formatTime(timerStore.sleepSecondsLeft) }}
            </span>
          </button>

          <!-- Import Files Button -->
          <button
            @click="handleSidebarImport"
            :disabled="libraryStore.isLoading"
            class="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-lofi-primary/10 hover:bg-lofi-primary/20 text-lofi-primary text-xs font-semibold border border-lofi-primary/30 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Import Files</span>
          </button>

          <!-- Footer: Shortcuts & Mini View Trigger -->
          <div class="pt-2 border-t border-lofi-border/60 flex items-center justify-between text-2xs text-lofi-muted px-1">
            <button
              @click="showShortcutsModal = true"
              class="flex items-center gap-1 hover:text-lofi-text transition-colors"
              title="Keyboard Shortcuts"
            >
              <Keyboard class="w-3 h-3" />
              <span>Shortcuts</span>
            </button>

            <button
              @click="handleSwitchToMini"
              class="flex items-center gap-1 hover:text-lofi-primary transition-colors font-medium text-lofi-primary"
              title="Switch to Floating Mini Player"
            >
              <Maximize2 class="w-3 h-3" />
              <span>Mini View</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col justify-between overflow-hidden relative">
        <!-- Ambient Background Glow -->
        <div class="absolute -top-32 -right-32 w-96 h-96 bg-lofi-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -left-32 w-96 h-96 bg-lofi-purple/10 rounded-full blur-3xl pointer-events-none"></div>

        <!-- 2-Column Split Workspace (Full-Width Responsive Layout across all tabs) -->
        <div class="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-y-auto w-full min-h-0 z-10">
          <!-- LEFT COLUMN: Primary Dynamic Workspace (Switches based on activeTab) -->
          <div class="flex-1 flex flex-col min-w-0 h-full">
            <!-- Tab 1: Now Playing & VU Visualizer -->
            <div v-show="appStore.activeTab === 'player'" class="w-full h-full flex flex-col gap-4">
              <!-- Track Header Banner -->
              <div class="w-full bg-lofi-surface/80 border border-lofi-border rounded-3xl p-5 backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
                <div class="flex items-center gap-4 min-w-0 flex-1">
                  <div class="w-14 h-14 rounded-2xl bg-lofi-card border border-lofi-border flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                    <img
                      v-if="playerStore.currentTrack?.coverUrl"
                      :src="playerStore.currentTrack.coverUrl"
                      alt="Cover"
                      class="w-full h-full object-cover"
                    />
                    <Music v-else class="w-6 h-6 text-lofi-primary" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="px-2.5 py-0.5 rounded-full bg-lofi-primary/20 text-lofi-primary text-[10px] font-bold uppercase tracking-wider">
                        {{ ytStore.isPlaying ? 'YouTube Stream' : (playerStore.currentTrack?.genre || 'Lofi Chill') }}
                      </span>
                    </div>
                    <h2 class="text-lg font-bold text-lofi-text truncate">
                      {{ ytStore.isPlaying ? ytStore.currentTitle : (playerStore.currentTrack?.title || 'No Track Playing') }}
                    </h2>
                    <p class="text-xs text-lofi-muted truncate mt-0.5">
                      {{ ytStore.isPlaying ? ytStore.currentChannel : (playerStore.currentTrack?.artist || 'Select a track from the library or playlist on the right') }}
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                  <button
                    v-if="ytStore.isPlaying || appStore.activeTab === 'youtube'"
                    @click="handleShowYouTubeVideo"
                    class="px-3.5 py-2 rounded-xl bg-lofi-pink/20 hover:bg-lofi-pink/30 border border-lofi-pink/40 text-xs font-semibold text-lofi-pink flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Tv class="w-3.5 h-3.5" />
                    <span>Watch Video Stream</span>
                  </button>
                  <button
                    v-else
                    @click="appStore.setActiveTab('library')"
                    class="px-3.5 py-2 rounded-xl bg-lofi-primary/10 hover:bg-lofi-primary/20 border border-lofi-primary/30 text-xs font-semibold text-lofi-primary flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <FolderOpen class="w-3.5 h-3.5" />
                    <span>Browse Library</span>
                  </button>
                </div>
              </div>

              <!-- 4-Mode Dynamic Visualizer & VU Meter Container -->
              <div class="w-full flex-1 min-h-[360px] flex flex-col">
                <VisualizerContainer />
              </div>
            </div>

            <!-- Tab 2: Music Library -->
            <div v-show="appStore.activeTab === 'library'" class="w-full h-full bg-lofi-surface/80 border border-lofi-border rounded-3xl backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
              <MusicLibrary class="!p-5" />
            </div>

            <!-- Tab 3: Ambient Sound Mixer -->
            <div v-show="appStore.activeTab === 'ambient'" class="w-full h-full bg-lofi-surface/80 border border-lofi-border rounded-3xl backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
              <AmbientMixer class="!p-5" />
            </div>

            <!-- Tab 4: YouTube Stream Player (Layout placeholder for desktop view - rendered via persistent YouTubePlayer) -->
            <div
              v-show="appStore.activeTab === 'youtube'"
              class="w-full h-full flex flex-col pointer-events-none"
            ></div>

            <!-- Tab 5: To-Do / Focus Task Manager -->
            <div v-show="appStore.activeTab === 'todo'" class="w-full h-full bg-lofi-surface/80 border border-lofi-border rounded-3xl backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
              <TodoView class="!p-5" />
            </div>

            <!-- Tab 6: Note Record & Quick Memos -->
            <div v-show="appStore.activeTab === 'notes'" class="w-full h-full bg-lofi-surface/80 border border-lofi-border rounded-3xl backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
              <NoteView class="!p-5" />
            </div>
          </div>

          <!-- RIGHT COLUMN: Universal Multi-Mode Right Sidebar (Available across all tabs, toggleable) -->
          <RightSidebarPanel v-if="appStore.activeTab !== 'youtube' && appStore.showRightSidebar" />

          <!-- Floating Re-open Sidebar Button when hidden -->
          <button
            v-if="appStore.activeTab !== 'youtube' && !appStore.showRightSidebar"
            @click="appStore.toggleRightSidebar"
            class="fixed right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-lofi-surface/90 hover:bg-lofi-card border border-lofi-border text-lofi-muted hover:text-lofi-pink shadow-xl backdrop-blur-md transition-all active:scale-95 cursor-pointer z-30 group"
            title="Open Workspace Sidebar (Tasks / Stations / Notes)"
          >
            <PanelRightOpen class="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <!-- Bottom Audio Player Control Bar -->
        <footer class="h-20 bg-lofi-surface/90 backdrop-blur-md border-t border-lofi-border px-6 flex items-center justify-between z-20">
          <!-- Track Info -->
          <div class="w-1/4 flex items-center gap-3">
            <div class="w-11 h-11 rounded-lg bg-lofi-card border border-lofi-border flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
              <img
                v-if="playerStore.currentTrack?.coverUrl"
                :src="playerStore.currentTrack.coverUrl"
                alt="Cover"
                class="w-full h-full object-cover"
              />
              <Music v-else class="w-5 h-5 text-lofi-primary opacity-60" />
            </div>
            <div class="truncate">
              <p class="text-sm font-semibold text-lofi-text truncate">
                {{ ytStore.isPlaying ? ytStore.currentTitle : (playerStore.currentTrack?.title || 'Ready to Play') }}
              </p>
              <p class="text-xs text-lofi-muted truncate">
                {{ ytStore.isPlaying ? ytStore.currentChannel : (playerStore.currentTrack?.artist || 'Lofi Chill Station') }}
              </p>
            </div>
          </div>

          <!-- Center Controls -->
          <div class="w-2/4 flex flex-col items-center gap-1.5">
            <div class="flex items-center gap-4">
              <button
                @click="playerStore.toggleShuffle"
                :class="[
                  'transition-colors p-1.5 rounded-md',
                  playerStore.isShuffled ? 'text-lofi-primary bg-lofi-primary/10' : 'text-lofi-muted hover:text-lofi-text'
                ]"
                title="Shuffle (S)"
              >
                <Shuffle class="w-3.5 h-3.5" />
              </button>

              <button
                @click="playerStore.prevTrack"
                class="text-lofi-muted hover:text-lofi-text transition-colors p-1"
                title="Previous Track (P)"
              >
                <SkipBack class="w-4 h-4" />
              </button>

              <button
                @click="handleTogglePlayPause"
                class="w-10 h-10 rounded-full bg-lofi-primary text-lofi-bg flex items-center justify-center hover:opacity-90 transition-all shadow-lg active:scale-95"
                title="Play / Pause (Space)"
              >
                <Pause v-if="playerStore.isPlaying || ytStore.isPlaying" class="w-4 h-4 fill-current" />
                <Play v-else class="w-4 h-4 fill-current ml-0.5" />
              </button>

              <button
                @click="playerStore.nextTrack"
                class="text-lofi-muted hover:text-lofi-text transition-colors p-1"
                title="Next Track (N)"
              >
                <SkipForward class="w-4 h-4" />
              </button>

              <button
                @click="playerStore.toggleRepeat"
                :class="[
                  'transition-colors p-1.5 rounded-md',
                  playerStore.repeatMode !== 'off' ? 'text-lofi-primary bg-lofi-primary/10' : 'text-lofi-muted hover:text-lofi-text'
                ]"
                :title="`Repeat: ${playerStore.repeatMode}`"
              >
                <Repeat class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Progress Bar & Timestamps -->
            <div class="w-full max-w-md flex items-center gap-2.5 text-xs text-lofi-muted">
              <span class="font-mono text-2xs">{{ formatTime(playerStore.currentTime) }}</span>
              <input
                type="range"
                min="0"
                :max="playerStore.duration || 100"
                :value="playerStore.currentTime"
                @input="(e) => playerStore.seek(Number((e.target as HTMLInputElement).value))"
                class="flex-1 h-1 bg-lofi-card rounded-full appearance-none cursor-pointer accent-lofi-primary"
              />
              <span class="font-mono text-2xs">{{ formatTime(playerStore.duration) }}</span>
            </div>
          </div>

          <!-- Right Controls (Master Volume, Timer & Extras) -->
          <div class="w-1/4 flex items-center justify-end gap-3">
            <button
              @click="isTimerModalOpen = true"
              class="text-lofi-muted hover:text-lofi-text transition-colors p-1 relative"
              title="Focus & Sleep Timers"
            >
              <Timer class="w-4 h-4" />
              <span
                v-if="timerStore.isPomodoroRunning || timerStore.isSleepTimerActive"
                class="absolute top-0 right-0 w-2 h-2 rounded-full bg-lofi-primary animate-ping"
              ></span>
            </button>

            <!-- Master Volume & Master Mute Controls -->
            <div class="flex items-center gap-1.5" :title="`Master Volume: ${playerStore.isMuted ? 'Muted' : Math.round(playerStore.volume * 100) + '%'}`">
              <button
                @click="playerStore.toggleMute"
                :class="[
                  'transition-colors p-1 rounded-md',
                  playerStore.isMuted ? 'text-red-400 bg-red-500/10' : 'text-lofi-muted hover:text-lofi-text'
                ]"
                :title="playerStore.isMuted ? 'Unmute All Audio (M)' : 'Master Mute All Audio (M)'"
              >
                <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-4 h-4" />
                <Volume2 v-else class="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                :value="playerStore.isMuted ? 0 : playerStore.volume"
                @input="(e) => playerStore.setVolume(Number((e.target as HTMLInputElement).value))"
                class="w-20 h-1 bg-lofi-card rounded-full appearance-none cursor-pointer accent-lofi-primary"
              />
              <span class="font-mono text-[10px] text-lofi-muted w-6 text-right">
                {{ playerStore.isMuted ? '0%' : `${Math.round(playerStore.volume * 100)}%` }}
              </span>
            </div>

            <!-- Direct YouTube Video Screen Quick Button -->
            <button
              v-if="ytStore.isPlaying || appStore.activeTab === 'youtube'"
              @click="handleShowYouTubeVideo"
              :class="[
                'flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all mr-1 shadow-sm',
                appStore.activeTab === 'youtube' && ytStore.displayMode === 'video'
                  ? 'bg-lofi-pink/20 text-lofi-pink border-lofi-pink/40'
                  : 'bg-lofi-card text-lofi-muted hover:text-lofi-pink border-lofi-border hover:border-lofi-pink/40'
              ]"
              title="Show YouTube Video Screen"
            >
              <Tv class="w-3.5 h-3.5 text-lofi-pink" />
              <span class="text-2xs font-medium">Video Screen</span>
            </button>

            <button
              @click="appStore.setActiveTab('player')"
              class="text-lofi-muted hover:text-lofi-text ml-0.5 transition-colors p-1"
              title="Visualizer View"
            >
              <Sliders class="w-4 h-4" />
            </button>
          </div>
        </footer>
      </main>
    </div>
  </div>

    <!-- Focus / Sleep Timer Modal -->
    <TimerModal
      :is-open="isTimerModalOpen"
      @close="isTimerModalOpen = false"
    />

    <!-- Keyboard Shortcuts Modal -->
    <div
      v-if="showShortcutsModal"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="showShortcutsModal = false"
    >
      <div class="w-full max-w-sm bg-lofi-surface border border-lofi-border rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
        <div class="flex items-center justify-between border-b border-lofi-border/60 pb-3">
          <h3 class="text-sm font-bold text-lofi-text flex items-center gap-2">
            <Keyboard class="w-4 h-4 text-lofi-primary" />
            <span>Keyboard Shortcuts</span>
          </h3>
          <button @click="showShortcutsModal = false" class="text-lofi-muted hover:text-lofi-text text-xs">✕</button>
        </div>

        <div class="space-y-2 text-xs">
          <div class="flex items-center justify-between py-1 border-b border-lofi-border/30">
            <span class="text-lofi-muted">Play / Pause</span>
            <kbd class="px-2 py-0.5 rounded bg-lofi-card border border-lofi-border font-mono text-2xs">Space</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-lofi-border/30">
            <span class="text-lofi-muted">Seek -5s / +5s</span>
            <kbd class="px-2 py-0.5 rounded bg-lofi-card border border-lofi-border font-mono text-2xs">← / →</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-lofi-border/30">
            <span class="text-lofi-muted">Volume Up / Down</span>
            <kbd class="px-2 py-0.5 rounded bg-lofi-card border border-lofi-border font-mono text-2xs">↑ / ↓</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-lofi-border/30">
            <span class="text-lofi-muted">Next Track</span>
            <kbd class="px-2 py-0.5 rounded bg-lofi-card border border-lofi-border font-mono text-2xs">N</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-lofi-border/30">
            <span class="text-lofi-muted">Previous Track</span>
            <kbd class="px-2 py-0.5 rounded bg-lofi-card border border-lofi-border font-mono text-2xs">P</kbd>
          </div>
          <div class="flex items-center justify-between py-1 border-b border-lofi-border/30">
            <span class="text-lofi-muted">Mute / Unmute</span>
            <kbd class="px-2 py-0.5 rounded bg-lofi-card border border-lofi-border font-mono text-2xs">M</kbd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-2xs {
  font-size: 0.68rem;
}

.invisible-player {
  position: absolute !important;
  left: -99999px !important;
  top: -99999px !important;
  width: 640px !important;
  height: 360px !important;
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: visible !important;
  contain: strict !important;
}

.mini-video-fixed {
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 20 !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  visibility: visible !important;
  overflow: hidden !important;
  background-color: #000 !important;
  transform: translate3d(0, 0, 0) !important;
  will-change: transform !important;
  backface-visibility: hidden !important;
}

.dock-video-fixed {
  position: absolute !important;
  left: 10px !important;
  right: 10px !important;
  bottom: 10px !important;
  height: 180px !important;
  border-radius: 12px !important;
  z-index: 55 !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  visibility: visible !important;
  overflow: hidden !important;
  background-color: #000 !important;
  transform: translate3d(0, 0, 0) !important;
  will-change: transform !important;
  backface-visibility: hidden !important;
}

.desktop-youtube-active {
  position: absolute !important;
  left: 240px !important;
  top: 36px !important;
  right: 0 !important;
  bottom: 80px !important;
  z-index: 15 !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  visibility: visible !important;
  overflow: hidden !important;
  transform: translateZ(0) !important;
  will-change: transform !important;
  backface-visibility: hidden !important;
}

.cinema-video-fullscreen {
  position: fixed !important;
  left: 0 !important;
  top: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  z-index: 60 !important;
  opacity: 1 !important;
  pointer-events: auto !important;
  visibility: visible !important;
  overflow: hidden !important;
  background-color: #000 !important;
  transform: translate3d(0, 0, 0) !important;
  will-change: transform !important;
  backface-visibility: hidden !important;
}

:fullscreen {
  z-index: 99999 !important;
}
</style>
