import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storageService, type Playlist } from '../services/storageService'
import type { Track, LofiGenre } from '../types/track'

export const useLibraryStore = defineStore('library', () => {
  const tracks = ref<Track[]>([])
  const playlists = ref<Playlist[]>([])
  const favorites = ref<string[]>([])
  const searchQuery = ref<string>('')
  const selectedGenre = ref<LofiGenre | 'all'>('all')
  const sortBy = ref<'addedAt' | 'title' | 'artist' | 'duration'>('addedAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')
  const isLoading = ref<boolean>(false)

  // Filtered & Sorted Tracks
  const filteredTracks = computed<Track[]>(() => {
    let list = [...tracks.value]

    // 1. Filter by Genre
    if (selectedGenre.value !== 'all') {
      list = list.filter((t) => t.genre === selectedGenre.value)
    }

    // 2. Filter by Search Query
    if (searchQuery.value.trim() !== '') {
      const q = searchQuery.value.toLowerCase().trim()
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          (t.album && t.album.toLowerCase().includes(q))
      )
    }

    // 3. Sort
    list.sort((a, b) => {
      let comparison = 0
      if (sortBy.value === 'title') {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy.value === 'artist') {
        comparison = a.artist.localeCompare(b.artist)
      } else if (sortBy.value === 'duration') {
        comparison = a.duration - b.duration
      } else {
        comparison = a.addedAt - b.addedAt
      }
      return sortOrder.value === 'asc' ? comparison : -comparison
    })

    return list
  })

  async function initLibrary(): Promise<void> {
    isLoading.value = true
    try {
      const savedTracks = await storageService.getTracks()
      // Sanitize and ensure 100% unique IDs across all stored tracks
      const seenIds = new Set<string>()
      let hasDuplicates = false
      const sanitized = savedTracks.map((t, idx) => {
        if (!t.id || seenIds.has(t.id)) {
          t.id = `track-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
          hasDuplicates = true
        }
        seenIds.add(t.id)
        return t
      })
      tracks.value = sanitized
      if (hasDuplicates) {
        await storageService.saveTracks(sanitized)
      }

      const savedPlaylists = await storageService.getPlaylists()
      playlists.value = savedPlaylists
      const savedFavs = await storageService.getFavorites()
      favorites.value = savedFavs
    } finally {
      isLoading.value = false
    }
  }

  async function importFiles(): Promise<Track[]> {
    if (!window.api?.openAndParseAudioFiles) return []
    isLoading.value = true
    try {
      const newTracks: Track[] = await window.api.openAndParseAudioFiles()
      if (newTracks.length > 0) {
        // Prevent duplicate file paths
        const existingPaths = new Set(tracks.value.map((t) => t.src))
        const uniqueNew = newTracks.filter((t) => !existingPaths.has(t.src))

        tracks.value.unshift(...uniqueNew)
        await storageService.saveTracks(tracks.value)
        return uniqueNew
      }
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function importFolder(): Promise<Track[]> {
    if (!window.api?.openAndParseAudioFolder) return []
    isLoading.value = true
    try {
      const newTracks: Track[] = await window.api.openAndParseAudioFolder()
      if (newTracks.length > 0) {
        const existingPaths = new Set(tracks.value.map((t) => t.src))
        const uniqueNew = newTracks.filter((t) => !existingPaths.has(t.src))

        tracks.value.unshift(...uniqueNew)
        await storageService.saveTracks(tracks.value)
        return uniqueNew
      }
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function updateTrackGenre(trackId: string, genre: LofiGenre): Promise<void> {
    const track = tracks.value.find((t) => t.id === trackId)
    if (track) {
      track.genre = genre
      await storageService.saveTracks(tracks.value)
    }
  }

  async function deleteTrack(trackId: string): Promise<void> {
    tracks.value = tracks.value.filter((t) => t.id !== trackId)
    favorites.value = favorites.value.filter((id) => id !== trackId)
    await storageService.saveTracks(tracks.value)
    await storageService.saveFavorites(favorites.value)
  }

  async function toggleFavorite(trackId: string): Promise<void> {
    if (favorites.value.includes(trackId)) {
      favorites.value = favorites.value.filter((id) => id !== trackId)
    } else {
      favorites.value.push(trackId)
    }
    await storageService.saveFavorites(favorites.value)
  }

  return {
    tracks,
    playlists,
    favorites,
    searchQuery,
    selectedGenre,
    sortBy,
    sortOrder,
    isLoading,
    filteredTracks,
    initLibrary,
    importFiles,
    importFolder,
    updateTrackGenre,
    deleteTrack,
    toggleFavorite
  }
})
