<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import {
  Play,
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
  X
} from 'lucide-vue-next'
import { useYouTubeStore } from '../../stores/youtube'
import { usePlayerStore } from '../../stores/player'
import { youtubeService, YOUTUBE_LOFI_PRESETS } from '../../services/youtubeService'
import { audioEngine } from '../../services/audioEngine'
import VisualizerContainer from '../visualizers/VisualizerContainer.vue'

const ytStore = useYouTubeStore()
const playerStore = usePlayerStore()

async function mountYouTubePlayer(): Promise<void> {
  try {
    await youtubeService.createPlayer(
      'youtube-player-element',
      ytStore.currentVideoId,
      playerStore.volume,
      playerStore.isMuted,
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
  (newId) => {
    youtubeService.loadVideo(newId)
  }
)

async function handleLoadUrl(): Promise<void> {
  if (!ytStore.urlInput.trim() || ytStore.isLoading) return
  await ytStore.playUrl(ytStore.urlInput)
}

onMounted(() => {
  ytStore.initBookmarks()
  mountYouTubePlayer()
})

onUnmounted(() => {
  // Keep background audio unless switched
})
</script>

<template>
  <div class="w-full h-full flex flex-col p-6 overflow-y-auto max-w-6xl mx-auto space-y-6">
    <!-- Header & URL Input -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
      <div class="w-full md:w-auto flex-1 max-w-md flex flex-col gap-1">
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
      v-if="ytStore.errorMessage"
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

    <!-- Main Player Container (Dual Mode: Video vs VU Visualizer) -->
    <div class="w-full bg-lofi-surface/80 border border-lofi-border rounded-3xl p-5 backdrop-blur-md shadow-2xl flex flex-col gap-4 relative overflow-hidden">
      <!-- Ambient Glow Behind Player -->
      <div class="absolute -top-24 -right-24 w-80 h-80 bg-lofi-pink/10 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Player Controls Header (Title, Live Badge, View Mode Switcher, Bookmark) -->
      <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-lofi-border/50">
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
            class="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-lofi-card hover:bg-lofi-border text-lofi-text text-xs font-semibold border border-lofi-border transition-all shadow-sm"
            title="Toggle between Video View and VU Meter Visualizer"
          >
            <component :is="ytStore.displayMode === 'video' ? Radio : Video" class="w-3.5 h-3.5 text-lofi-primary" />
            <span>{{ ytStore.displayMode === 'video' ? 'Switch to VU Visualizer' : 'Switch to Video View' }}</span>
          </button>

          <!-- Bookmark Button -->
          <button
            @click="ytStore.toggleBookmark"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
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

      <!-- Display Area: 16:9 Video Embed OR Visualizer (Using v-show to prevent reload) -->
      <div class="w-full relative rounded-2xl overflow-hidden bg-black/60 border border-lofi-border flex items-center justify-center min-h-[360px] aspect-video">
        <!-- 1. Video Mode Container (Protected with Non-Destructive Wrapper & Off-screen Preservation) -->
        <div
          :class="[
            'w-full h-full flex items-center justify-center',
            ytStore.displayMode === 'video' ? 'absolute inset-0' : 'invisible-player'
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
          v-if="ytStore.displayMode === 'visualizer'"
          class="w-full h-full p-4 flex items-center justify-center bg-lofi-bg/90"
        >
          <VisualizerContainer />
        </div>
      </div>
    </div>

    <!-- Curated 24/7 Lofi Stream Stations -->
    <div class="space-y-3">
      <div class="flex items-center gap-2 text-xs font-semibold text-lofi-muted">
        <RadioTower class="w-4 h-4 text-lofi-pink" />
        <span>Curated 24/7 Lofi Stations:</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        <div
          v-for="station in YOUTUBE_LOFI_PRESETS"
          :key="station.id"
          @click="ytStore.playPreset(station)"
          :class="[
            'p-3 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer group backdrop-blur-sm',
            ytStore.currentVideoId === station.videoId
              ? 'bg-lofi-card border-lofi-pink/60 ring-1 ring-lofi-pink/30 shadow-lg'
              : 'bg-lofi-surface/50 border-lofi-border hover:bg-lofi-card/80 hover:border-lofi-border/80'
          ]"
        >
          <!-- Thumbnail with Play Hover -->
          <div class="w-20 h-14 rounded-xl overflow-hidden bg-lofi-bg flex-shrink-0 relative border border-lofi-border/60">
            <img :src="station.thumbnailUrl" alt="Thumb" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play class="w-5 h-5 text-white fill-current" />
            </div>
            <span v-if="station.isLive" class="absolute bottom-1 right-1 px-1 py-0.2 bg-red-600 text-white font-bold text-[9px] rounded">
              LIVE
            </span>
          </div>

          <!-- Station Metadata -->
          <div class="min-w-0 flex-1">
            <h4 class="text-xs font-bold text-lofi-text truncate group-hover:text-lofi-pink transition-colors">
              {{ station.title }}
            </h4>
            <p class="text-2xs text-lofi-muted truncate mt-0.5">{{ station.channel }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Saved YouTube Stream Bookmarks -->
    <div v-if="ytStore.bookmarks.length > 0" class="space-y-3 pt-2">
      <div class="flex items-center gap-2 text-xs font-semibold text-lofi-muted">
        <Bookmark class="w-4 h-4 text-lofi-primary" />
        <span>Your Saved Stream Bookmarks:</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div
          v-for="bm in ytStore.bookmarks"
          :key="bm.id"
          @click="ytStore.playUrl(bm.videoId, bm.title)"
          class="p-2.5 rounded-xl bg-lofi-surface/40 hover:bg-lofi-card border border-lofi-border flex items-center justify-between gap-3 cursor-pointer group transition-all"
        >
          <div class="flex items-center gap-2.5 min-w-0">
            <img :src="bm.thumbnailUrl" class="w-12 h-9 rounded-lg object-cover flex-shrink-0 border border-lofi-border" />
            <div class="min-w-0 truncate">
              <p class="text-xs font-semibold text-lofi-text truncate group-hover:text-lofi-primary">{{ bm.title }}</p>
              <p class="text-2xs text-lofi-muted truncate">{{ bm.channel }}</p>
            </div>
          </div>

          <button
            @click.stop="ytStore.deleteBookmark(bm.videoId)"
            class="p-1.5 rounded-lg text-lofi-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete Bookmark"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
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
  width: 100% !important;
  height: 100% !important;
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: visible !important;
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
