<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Radio,
  CheckSquare,
  StickyNote,
  Bookmark,
  BookmarkCheck,
  Search,
  Trash2,
  Music,
  Play,
  Pause,
  Plus,
  Loader2,
  Sparkles,
  ListMusic,
  Disc,
  FolderOpen,
  PanelRightClose
} from 'lucide-vue-next'
import { useAppStore } from '../../stores/app'
import { useYouTubeStore } from '../../stores/youtube'
import { usePlayerStore } from '../../stores/player'
import { useTodoStore } from '../../stores/todo'
import { useNoteStore } from '../../stores/note'
import { useLibraryStore } from '../../stores/library'
import { youtubeService, YOUTUBE_LOFI_PRESETS, type YouTubeStreamPreset } from '../../services/youtubeService'
import TodoView from '../todo/TodoView.vue'
import NoteView from '../notes/NoteView.vue'

const appStore = useAppStore()
const ytStore = useYouTubeStore()
const playerStore = usePlayerStore()
const todoStore = useTodoStore()
const noteStore = useNoteStore()
const libraryStore = useLibraryStore()

const rightPanelMode = ref<'playlist' | 'todo' | 'note'>('playlist')
const playlistSubTab = ref<'youtube' | 'local'>('youtube')

// Automatically default playlist subtab based on active playback
const activePlaylistSubTab = computed(() => {
  if (ytStore.isPlaying || appStore.activeTab === 'youtube') {
    return 'youtube'
  }
  return playlistSubTab.value
})

function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

async function handleSelectPreset(preset: YouTubeStreamPreset): Promise<void> {
  if (playerStore.isPlaying) {
    playerStore.pause()
  }
  await ytStore.playPreset(preset)
}

function isCurrentLocalTrack(index: number): boolean {
  return playerStore.isPlaying && playerStore.currentIndex === index
}

function handlePlayLocalTrack(index: number): void {
  if (ytStore.isPlaying) {
    youtubeService.pauseVideo()
    ytStore.isPlaying = false
  }
  playerStore.playTrack(index)
}
</script>

<template>
  <div class="w-full lg:w-[420px] xl:w-[480px] 2xl:w-[540px] flex flex-col gap-4 flex-shrink-0 min-h-0 select-none">
    <!-- Right Panel Mode Switcher Tabs & Collapse Action -->
    <div class="flex items-center justify-between gap-1 p-1 bg-lofi-surface/80 border border-lofi-border rounded-2xl backdrop-blur-md shadow-md flex-shrink-0">
      <div class="flex items-center gap-1 flex-1 min-w-0">
        <!-- 1. Playlists / Stations / Queue Tab -->
        <button
          @click="rightPanelMode = 'playlist'"
          :class="[
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
            rightPanelMode === 'playlist'
              ? 'bg-lofi-pink text-lofi-bg shadow-sm font-bold'
              : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-card/50'
          ]"
        >
          <Radio class="w-3.5 h-3.5" />
          <span class="truncate">Playlists & Stations</span>
        </button>

        <!-- 2. Focus Tasks Tab -->
        <button
          @click="rightPanelMode = 'todo'"
          :class="[
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
            rightPanelMode === 'todo'
              ? 'bg-emerald-500 text-lofi-bg shadow-sm font-bold'
              : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-card/50'
          ]"
        >
          <CheckSquare class="w-3.5 h-3.5" />
          <span class="truncate">Focus Tasks</span>
          <span
            v-if="todoStore.pendingCount > 0"
            :class="[
              'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
              rightPanelMode === 'todo' ? 'bg-black/20 text-white' : 'bg-emerald-500/20 text-emerald-300'
            ]"
          >
            {{ todoStore.pendingCount }}
          </span>
        </button>

        <!-- 3. Notes & Memos Tab -->
        <button
          @click="rightPanelMode = 'note'"
          :class="[
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
            rightPanelMode === 'note'
              ? 'bg-amber-500 text-lofi-bg shadow-sm font-bold'
              : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-card/50'
          ]"
        >
          <StickyNote class="w-3.5 h-3.5" />
          <span class="truncate">Notes</span>
          <span
            v-if="noteStore.totalCount > 0"
            :class="[
              'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
              rightPanelMode === 'note' ? 'bg-black/20 text-white' : 'bg-amber-500/20 text-amber-300'
            ]"
          >
            {{ noteStore.totalCount }}
          </span>
        </button>
      </div>

      <!-- Quick Collapse Button -->
      <button
        @click="appStore.toggleRightSidebar"
        class="p-2 rounded-xl text-lofi-muted hover:text-lofi-text hover:bg-lofi-card/70 transition-all cursor-pointer flex-shrink-0"
        title="Hide Workspace Sidebar"
      >
        <PanelRightClose class="w-4 h-4" />
      </button>
    </div>

    <!-- Mode 1: Playlists & Stations / Queue View -->
    <div
      v-if="rightPanelMode === 'playlist'"
      class="w-full flex-1 bg-lofi-surface/80 border border-lofi-border rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-2xl flex flex-col gap-4 overflow-y-auto animate-fadeIn min-h-[400px]"
    >
      <!-- Sub-tabs: YouTube Live vs Local Queue -->
      <div class="flex items-center justify-between pb-2 border-b border-lofi-border/60 flex-shrink-0">
        <div class="flex items-center gap-2">
          <button
            @click="playlistSubTab = 'youtube'"
            :class="[
              'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              activePlaylistSubTab === 'youtube'
                ? 'bg-lofi-pink/20 text-lofi-pink border border-lofi-pink/30'
                : 'text-lofi-muted hover:text-lofi-text'
            ]"
          >
            <Radio class="w-3 h-3" />
            <span>YouTube Live ({{ YOUTUBE_LOFI_PRESETS.length + ytStore.bookmarks.length }})</span>
          </button>

          <button
            @click="playlistSubTab = 'local'"
            :class="[
              'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5',
              activePlaylistSubTab === 'local'
                ? 'bg-lofi-primary/20 text-lofi-primary border border-lofi-primary/30'
                : 'text-lofi-muted hover:text-lofi-text'
            ]"
          >
            <ListMusic class="w-3 h-3" />
            <span>Local Queue ({{ playerStore.playlist.length }})</span>
          </button>
        </div>
      </div>

      <!-- Content A: YouTube 24/7 Live Stations & Bookmarks -->
      <div v-if="activePlaylistSubTab === 'youtube'" class="space-y-5">
        <!-- Curated 24/7 Stations -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-lofi-muted flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-lofi-pink" />
              <span>Curated 24/7 Stations</span>
            </h3>
            <span class="text-[10px] text-lofi-muted">{{ YOUTUBE_LOFI_PRESETS.length }} channels</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="station in YOUTUBE_LOFI_PRESETS"
              :key="station.id"
              @click="handleSelectPreset(station)"
              :class="[
                'p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group relative overflow-hidden',
                ytStore.isPlaying && ytStore.currentVideoId === station.videoId
                  ? 'bg-lofi-card border-lofi-pink/60 shadow-lg ring-1 ring-lofi-pink/40'
                  : 'bg-lofi-surface/60 border-lofi-border hover:bg-lofi-card hover:border-lofi-border/80'
              ]"
            >
              <!-- Station Thumbnail -->
              <div class="w-14 h-10 rounded-xl overflow-hidden bg-black/60 flex-shrink-0 relative">
                <img :src="station.thumbnailUrl" alt="Thumbnail" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div class="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-red-600 text-white font-bold text-[7px] uppercase tracking-wider">
                  LIVE
                </div>
              </div>

              <!-- Station Details -->
              <div class="min-w-0 flex-1">
                <p class="text-xs font-bold text-lofi-text truncate group-hover:text-lofi-pink transition-colors">
                  {{ station.title }}
                </p>
                <p class="text-[10px] text-lofi-muted truncate mt-0.5">{{ station.channel }}</p>
              </div>

              <!-- Play Indicator -->
              <div
                v-if="ytStore.isPlaying && ytStore.currentVideoId === station.videoId"
                class="w-6 h-6 rounded-full bg-lofi-pink/20 text-lofi-pink flex items-center justify-center flex-shrink-0"
              >
                <span class="w-2 h-2 rounded-full bg-lofi-pink animate-ping"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Saved Bookmarks Section -->
        <div v-if="ytStore.bookmarks.length > 0">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-lofi-muted flex items-center gap-1.5">
              <BookmarkCheck class="w-3.5 h-3.5 text-lofi-primary" />
              <span>Saved Bookmarks</span>
            </h3>
            <span class="text-[10px] text-lofi-muted">{{ ytStore.bookmarks.length }} saved</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="bm in ytStore.bookmarks"
              :key="bm.videoId"
              @click="handleSelectPreset(bm as any)"
              :class="[
                'p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden',
                ytStore.isPlaying && ytStore.currentVideoId === bm.videoId
                  ? 'bg-lofi-card border-lofi-primary/60 shadow-lg ring-1 ring-lofi-primary/40'
                  : 'bg-lofi-surface/60 border-lofi-border hover:bg-lofi-card hover:border-lofi-border/80'
              ]"
            >
              <div class="flex items-center gap-3 min-w-0 flex-1">
                <div class="w-14 h-10 rounded-xl overflow-hidden bg-black/60 flex-shrink-0 relative">
                  <img :src="bm.thumbnailUrl" alt="Thumbnail" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div
                    v-if="(bm as any).isLive"
                    class="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-red-600 text-white font-bold text-[7px] uppercase tracking-wider"
                  >
                    LIVE
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold text-lofi-text truncate group-hover:text-lofi-primary transition-colors">
                    {{ bm.title }}
                  </p>
                  <p class="text-[10px] text-lofi-muted truncate mt-0.5">{{ bm.channel }}</p>
                </div>
              </div>

              <button
                @click.stop="ytStore.deleteBookmark(bm.videoId)"
                class="p-1.5 rounded-lg text-lofi-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Delete Bookmark"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content B: Local Music Playing Queue -->
      <div v-else-if="activePlaylistSubTab === 'local'" class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xs font-bold uppercase tracking-wider text-lofi-muted flex items-center gap-1.5">
            <Disc class="w-3.5 h-3.5 text-lofi-primary" />
            <span>Up Next & Queue</span>
          </h3>
          <span class="text-[10px] text-lofi-muted">{{ playerStore.playlist.length }} tracks</span>
        </div>

        <!-- Empty State -->
        <div
          v-if="playerStore.playlist.length === 0"
          class="p-8 rounded-2xl bg-lofi-surface/40 border border-lofi-border/60 text-center flex flex-col items-center justify-center gap-2"
        >
          <FolderOpen class="w-8 h-8 text-lofi-muted opacity-50" />
          <p class="text-xs text-lofi-muted">Your playback queue is currently empty</p>
          <button
            @click="appStore.setActiveTab('library')"
            class="mt-2 px-3 py-1.5 rounded-xl bg-lofi-primary/10 hover:bg-lofi-primary/20 text-lofi-primary text-xs font-semibold border border-lofi-primary/30 transition-all cursor-pointer"
          >
            Open Music Library
          </button>
        </div>

        <!-- Track List in Queue -->
        <div v-else class="space-y-1.5">
          <div
            v-for="(track, idx) in playerStore.playlist"
            :key="track.id || idx"
            @click="handlePlayLocalTrack(idx)"
            :class="[
              'p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group',
              isCurrentLocalTrack(idx)
                ? 'bg-lofi-card border-lofi-primary/60 shadow-md ring-1 ring-lofi-primary/30'
                : 'bg-lofi-surface/40 border-lofi-border/60 hover:bg-lofi-card/80 hover:border-lofi-border'
            ]"
          >
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <div class="w-8 h-8 rounded-lg bg-lofi-card border border-lofi-border flex items-center justify-center overflow-hidden flex-shrink-0">
                <img v-if="track.coverUrl" :src="track.coverUrl" alt="Cover" class="w-full h-full object-cover" />
                <Music v-else class="w-3.5 h-3.5 text-lofi-primary opacity-60" />
              </div>

              <div class="min-w-0 flex-1">
                <p
                  :class="[
                    'text-xs font-semibold truncate',
                    isCurrentLocalTrack(idx) ? 'text-lofi-primary' : 'text-lofi-text group-hover:text-lofi-primary'
                  ]"
                >
                  {{ track.title }}
                </p>
                <p class="text-[10px] text-lofi-muted truncate">{{ track.artist }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <span class="text-[10px] font-mono text-lofi-muted">{{ formatDuration(track.duration) }}</span>
              <div v-if="isCurrentLocalTrack(idx)" class="w-5 h-5 rounded-full bg-lofi-primary text-lofi-bg flex items-center justify-center">
                <Play class="w-2.5 h-2.5 fill-current ml-0.2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mode 2: Focus Tasks View (Embedded TodoView) -->
    <div
      v-if="rightPanelMode === 'todo'"
      class="w-full flex-1 bg-lofi-surface/80 border border-lofi-border rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-2xl overflow-hidden animate-fadeIn min-h-[400px]"
    >
      <TodoView class="!p-0 !max-w-none" />
    </div>

    <!-- Mode 3: Notes & Memos View (Embedded NoteView) -->
    <div
      v-if="rightPanelMode === 'note'"
      class="w-full flex-1 bg-lofi-surface/80 border border-lofi-border rounded-3xl p-4 md:p-5 backdrop-blur-md shadow-2xl overflow-hidden animate-fadeIn min-h-[400px]"
    >
      <NoteView class="!p-0 !max-w-none" />
    </div>
  </div>
</template>
