<script setup lang="ts">
import { ref } from 'vue'
import {
  Search,
  Plus,
  FolderPlus,
  Play,
  Pause,
  Trash2,
  Heart,
  Music,
  Clock,
  ArrowUpDown,
  Tag,
  Sparkles,
  Disc
} from 'lucide-vue-next'
import { useLibraryStore } from '../../stores/library'
import { usePlayerStore } from '../../stores/player'
import { LOFI_GENRE_PRESETS, type Track, type LofiGenre } from '../../types/track'

const libraryStore = useLibraryStore()
const playerStore = usePlayerStore()

const editingGenreTrackId = ref<string | null>(null)

function isCurrentTrack(track: Track): boolean {
  if (!playerStore.currentTrack) return false
  return playerStore.currentTrack.id === track.id || playerStore.currentTrack.src === track.src
}

function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '--:--'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function handlePlayTrack(track: Track, index: number): void {
  // If this track is already playing, toggle pause
  if (isCurrentTrack(track)) {
    playerStore.togglePlay()
    return
  }

  // Load current filtered view as current playlist
  playerStore.playlist = [...libraryStore.filteredTracks]
  playerStore.playTrack(index)
}

async function handleImportFiles(): Promise<void> {
  const newTracks = await libraryStore.importFiles()
  if (newTracks.length > 0 && playerStore.playlist.length === 0) {
    playerStore.playlist = [...libraryStore.tracks]
    playerStore.playTrack(0)
  }
}

async function handleImportFolder(): Promise<void> {
  const newTracks = await libraryStore.importFolder()
  if (newTracks.length > 0 && playerStore.playlist.length === 0) {
    playerStore.playlist = [...libraryStore.tracks]
    playerStore.playTrack(0)
  }
}

function selectTrackGenre(trackId: string, genre: LofiGenre): void {
  libraryStore.updateTrackGenre(trackId, genre)
  editingGenreTrackId.value = null
}
</script>

<template>
  <div class="w-full h-full flex flex-col p-6 overflow-hidden max-w-6xl mx-auto">
    <!-- Top Header: Title, Search & Import Actions -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <div>
        <h2 class="text-2xl font-bold text-lofi-text flex items-center gap-2.5">
          <Disc class="w-6 h-6 text-lofi-primary" />
          <span>Music Library</span>
        </h2>
        <p class="text-xs text-lofi-muted mt-0.5">
          {{ libraryStore.tracks.length }} tracks stored locally in your cozy collection
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5">
        <button
          @click="handleImportFiles"
          :disabled="libraryStore.isLoading"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lofi-primary/10 hover:bg-lofi-primary/20 text-lofi-primary text-xs font-semibold border border-lofi-primary/30 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <Plus class="w-4 h-4" />
          <span>Add Files</span>
        </button>

        <button
          @click="handleImportFolder"
          :disabled="libraryStore.isLoading"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lofi-card hover:bg-lofi-border text-lofi-text text-xs font-semibold border border-lofi-border transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <FolderPlus class="w-4 h-4 text-lofi-accent" />
          <span>Import Folder</span>
        </button>
      </div>
    </div>

    <!-- Search Bar & Filters -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-md">
        <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lofi-muted" />
        <input
          type="text"
          v-model="libraryStore.searchQuery"
          placeholder="Search by title, artist, or album..."
          class="w-full pl-10 pr-4 py-2 bg-lofi-surface/80 border border-lofi-border rounded-xl text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-lofi-primary transition-colors"
        />
      </div>

      <!-- Sort Selection -->
      <div class="flex items-center gap-2 text-xs">
        <span class="text-lofi-muted flex items-center gap-1">
          <ArrowUpDown class="w-3.5 h-3.5" />
          Sort:
        </span>
        <select
          v-model="libraryStore.sortBy"
          class="bg-lofi-surface border border-lofi-border rounded-lg px-2.5 py-1.5 text-xs text-lofi-text focus:outline-none focus:border-lofi-primary cursor-pointer"
        >
          <option value="addedAt">Date Added</option>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="duration">Duration</option>
        </select>
        <button
          @click="libraryStore.sortOrder = libraryStore.sortOrder === 'asc' ? 'desc' : 'asc'"
          class="p-1.5 rounded-lg bg-lofi-surface border border-lofi-border text-lofi-muted hover:text-lofi-text transition-colors"
          title="Toggle Sort Order"
        >
          <span>{{ libraryStore.sortOrder === 'asc' ? '▲' : '▼' }}</span>
        </button>
      </div>
    </div>

    <!-- Lofi Category Preset Filter Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
      <button
        v-for="preset in LOFI_GENRE_PRESETS"
        :key="preset.id"
        @click="libraryStore.selectedGenre = preset.id"
        :class="[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border',
          libraryStore.selectedGenre === preset.id
            ? 'bg-lofi-card text-lofi-primary border-lofi-primary shadow-sm font-semibold'
            : 'bg-lofi-surface/50 text-lofi-muted border-lofi-border hover:text-lofi-text hover:bg-lofi-surface'
        ]"
      >
        <span>{{ preset.icon }}</span>
        <span>{{ preset.name }}</span>
      </button>
    </div>

    <!-- Tracks Container / Table -->
    <div class="flex-1 bg-lofi-surface/40 border border-lofi-border rounded-2xl overflow-hidden flex flex-col shadow-inner">
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-4 px-5 py-3 border-b border-lofi-border/60 text-xs font-semibold text-lofi-muted bg-lofi-surface/60">
        <div class="col-span-1 text-center">#</div>
        <div class="col-span-5">Title / Artist</div>
        <div class="col-span-3">Genre Category</div>
        <div class="col-span-2 text-center flex items-center justify-center gap-1">
          <Clock class="w-3.5 h-3.5" />
          <span>Time</span>
        </div>
        <div class="col-span-1 text-right">Actions</div>
      </div>

      <!-- Loading State -->
      <div v-if="libraryStore.isLoading" class="flex-1 flex flex-col items-center justify-center p-8 text-center text-lofi-muted">
        <Sparkles class="w-8 h-8 text-lofi-primary animate-spin mb-2" />
        <p class="text-xs">Extracting metadata and parsing audio files...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="libraryStore.filteredTracks.length === 0"
        class="flex-1 flex flex-col items-center justify-center p-8 text-center"
      >
        <div class="w-16 h-16 rounded-2xl bg-lofi-card border border-lofi-border flex items-center justify-center text-lofi-primary mb-3 shadow-inner">
          <Music class="w-8 h-8 opacity-60" />
        </div>
        <h3 class="text-sm font-semibold text-lofi-text mb-1">No Music Found</h3>
        <p class="text-xs text-lofi-muted max-w-sm mb-4">
          {{ libraryStore.tracks.length === 0 ? 'Your library is currently empty. Import files or a music folder from your disk to begin.' : 'No tracks match your current filter or search criteria.' }}
        </p>
        <button
          v-if="libraryStore.tracks.length === 0"
          @click="handleImportFiles"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-lofi-primary text-lofi-bg text-xs font-bold shadow-lg hover:opacity-90 transition-all"
        >
          <Plus class="w-4 h-4" />
          <span>Import Your First Audio Files</span>
        </button>
      </div>

      <!-- Track Items List -->
      <div v-else class="flex-1 overflow-y-auto divide-y divide-lofi-border/30">
        <div
          v-for="(track, index) in libraryStore.filteredTracks"
          :key="track.id"
          :class="[
            'grid grid-cols-12 gap-4 px-5 py-2.5 items-center text-xs transition-colors group cursor-pointer',
            isCurrentTrack(track)
              ? 'bg-lofi-primary/10 text-lofi-primary font-medium'
              : 'hover:bg-lofi-card/50 text-lofi-text'
          ]"
          @dblclick="handlePlayTrack(track, index)"
        >
          <!-- Track Index / Play Icon -->
          <div class="col-span-1 flex items-center justify-center">
            <button
              @click.stop="handlePlayTrack(track, index)"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-lofi-text transition-all group-hover:bg-lofi-primary group-hover:text-lofi-bg"
            >
              <Pause
                v-if="isCurrentTrack(track) && playerStore.isPlaying"
                class="w-3.5 h-3.5 fill-current text-lofi-primary group-hover:text-lofi-bg"
              />
              <Play
                v-else
                class="w-3.5 h-3.5 fill-current text-lofi-muted group-hover:text-lofi-bg"
              />
            </button>
          </div>

          <!-- Cover Art & Title/Artist -->
          <div class="col-span-5 flex items-center gap-3 min-w-0">
            <!-- Cover Thumbnail -->
            <div class="w-10 h-10 rounded-lg overflow-hidden bg-lofi-card border border-lofi-border flex-shrink-0 flex items-center justify-center shadow-sm">
              <img
                v-if="track.coverUrl"
                :src="track.coverUrl"
                alt="Cover"
                class="w-full h-full object-cover"
              />
              <Music v-else class="w-4 h-4 text-lofi-primary opacity-50" />
            </div>

            <!-- Title & Artist -->
            <div class="min-w-0 truncate">
              <p
                :class="[
                  'truncate text-xs font-semibold',
                  isCurrentTrack(track) ? 'text-lofi-primary' : 'text-lofi-text'
                ]"
              >
                {{ track.title }}
              </p>
              <p class="text-2xs text-lofi-muted truncate mt-0.5">
                {{ track.artist }} &bull; {{ track.album || 'Single' }}
              </p>
            </div>
          </div>

          <!-- Genre Tag Selector -->
          <div class="col-span-3 relative">
            <div
              @click.stop="editingGenreTrackId = editingGenreTrackId === track.id ? null : track.id"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lofi-card border border-lofi-border text-2xs hover:border-lofi-primary/50 cursor-pointer transition-colors"
            >
              <Tag class="w-3 h-3 text-lofi-primary" />
              <span class="capitalize">{{ track.genre }}</span>
            </div>

            <!-- Genre Dropdown Menu -->
            <div
              v-if="editingGenreTrackId === track.id"
              class="absolute left-0 top-full mt-1 w-44 bg-lofi-surface border border-lofi-border rounded-xl shadow-2xl z-30 p-1.5 space-y-0.5"
            >
              <button
                v-for="g in LOFI_GENRE_PRESETS.filter((p) => p.id !== 'all')"
                :key="g.id"
                @click.stop="selectTrackGenre(track.id, g.id as LofiGenre)"
                class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-2xs text-left hover:bg-lofi-card transition-colors text-lofi-text"
              >
                <span>{{ g.icon }}</span>
                <span>{{ g.name }}</span>
              </button>
            </div>
          </div>

          <!-- Duration -->
          <div class="col-span-2 text-center font-mono text-lofi-muted text-2xs">
            {{ formatDuration(track.duration) }}
          </div>

          <!-- Actions (Favorite & Delete) -->
          <div class="col-span-1 flex items-center justify-end gap-1.5">
            <button
              @click.stop="libraryStore.toggleFavorite(track.id)"
              :class="[
                'p-1.5 rounded-lg transition-colors',
                libraryStore.favorites.includes(track.id)
                  ? 'text-lofi-pink'
                  : 'text-lofi-muted hover:text-lofi-text'
              ]"
              title="Favorite"
            >
              <Heart
                class="w-3.5 h-3.5"
                :class="{ 'fill-current': libraryStore.favorites.includes(track.id) }"
              />
            </button>

            <button
              @click.stop="libraryStore.deleteTrack(track.id)"
              class="p-1.5 rounded-lg text-lofi-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove from Library"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
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
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
