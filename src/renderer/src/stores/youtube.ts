import { defineStore } from 'pinia'
import { ref } from 'vue'
import { youtubeService, YOUTUBE_LOFI_PRESETS, type YouTubeStreamPreset } from '../services/youtubeService'
import { storageService } from '../services/storageService'
import { audioEngine } from '../services/audioEngine'
import { usePlayerStore } from './player'

export interface YouTubeBookmark {
  id: string
  videoId: string
  title: string
  channel: string
  thumbnailUrl: string
  addedAt: number
}

export const useYouTubeStore = defineStore('youtube', () => {
  const playerStore = usePlayerStore()

  // Default to currently active Lofi Girl 24/7 stream
  const currentVideoId = ref<string>('rFZHOHl-L8A')
  const currentTitle = ref<string>('Lofi Hip Hop Radio 📚 Beats to Relax / Study to')
  const currentChannel = ref<string>('Lofi Girl')
  const isPlaying = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const displayMode = ref<'video' | 'visualizer'>('video')
  const bookmarks = ref<YouTubeBookmark[]>([])
  const urlInput = ref<string>('')
  const isBookmarked = ref<boolean>(false)

  function checkIfBookmarked(): void {
    isBookmarked.value = bookmarks.value.some((b) => b.videoId === currentVideoId.value)
  }

  async function initBookmarks(): Promise<void> {
    const saved = await storageService.getYouTubeBookmarks()
    if (saved && saved.length > 0) {
      bookmarks.value = saved
    } else {
      // Initialize with presets as starter bookmarks
      bookmarks.value = YOUTUBE_LOFI_PRESETS.map((p) => ({
        id: p.id,
        videoId: p.videoId,
        title: p.title,
        channel: p.channel,
        thumbnailUrl: p.thumbnailUrl,
        addedAt: Date.now()
      }))
      await storageService.saveYouTubeBookmarks(bookmarks.value)
    }
    checkIfBookmarked()
  }

  function playPreset(preset: YouTubeStreamPreset): void {
    errorMessage.value = null
    isLoading.value = false

    // Pause local audio playback when YouTube starts
    playerStore.pause()

    currentVideoId.value = preset.videoId
    currentTitle.value = preset.title
    currentChannel.value = preset.channel
    isPlaying.value = true

    youtubeService.loadVideo(preset.videoId)
    audioEngine.setExternalSourceState(true, playerStore.volume, playerStore.isMuted)
    checkIfBookmarked()
  }

  async function playUrl(urlOrId: string, customTitle?: string): Promise<boolean> {
    if (!urlOrId || !urlOrId.trim()) return false

    errorMessage.value = null
    isLoading.value = true

    try {
      // 1. Try Main Process Resolver (handles @Channel/live, Shorts, and fetches oEmbed metadata)
      if (window.api?.resolveYouTubeUrl) {
        const resolved = await window.api.resolveYouTubeUrl(urlOrId.trim())
        if (resolved && resolved.success && resolved.videoId) {
          playerStore.pause()
          currentVideoId.value = resolved.videoId
          currentTitle.value = customTitle || resolved.title || `YouTube Stream (${resolved.videoId})`
          currentChannel.value = resolved.channel || 'YouTube Channel'
          isPlaying.value = true

          youtubeService.loadVideo(resolved.videoId)
          audioEngine.setExternalSourceState(true, playerStore.volume, playerStore.isMuted)
          urlInput.value = ''
          isLoading.value = false
          checkIfBookmarked()
          return true
        } else if (resolved && !resolved.success) {
          errorMessage.value = resolved.error || 'Invalid YouTube URL or Video ID.'
          isLoading.value = false
          return false
        }
      }

      // 2. Fallback to client-side regex extraction
      const videoId = youtubeService.extractVideoId(urlOrId)
      if (!videoId) {
        errorMessage.value = 'Invalid YouTube URL or Video ID. Please check the link format.'
        isLoading.value = false
        return false
      }

      playerStore.pause()
      currentVideoId.value = videoId
      currentTitle.value = customTitle || `YouTube Stream (${videoId})`
      currentChannel.value = 'YouTube Audio'
      isPlaying.value = true

      youtubeService.loadVideo(videoId)
      audioEngine.setExternalSourceState(true, playerStore.volume, playerStore.isMuted)
      urlInput.value = ''
      isLoading.value = false
      checkIfBookmarked()
      return true
    } catch (err: any) {
      console.warn('[YouTubeStore] playUrl error:', err)
      errorMessage.value = err?.message || 'Failed to process YouTube link.'
      isLoading.value = false
      return false
    }
  }

  function handlePlayerError(code: number, message: string): void {
    console.warn(`[YouTubeStore] Player error received (${code}): ${message}`)
    errorMessage.value = message
    isPlaying.value = false
    isLoading.value = false
  }

  function togglePlayPause(): void {
    if (isPlaying.value) {
      youtubeService.pauseVideo()
      isPlaying.value = false
    } else {
      youtubeService.playVideo()
      isPlaying.value = true
    }
  }

  function toggleDisplayMode(): void {
    displayMode.value = displayMode.value === 'video' ? 'visualizer' : 'video'
  }

  async function toggleBookmark(): Promise<void> {
    if (isBookmarked.value) {
      bookmarks.value = bookmarks.value.filter((b) => b.videoId !== currentVideoId.value)
    } else {
      bookmarks.value.unshift({
        id: `yt-bm-${Date.now()}`,
        videoId: currentVideoId.value,
        title: currentTitle.value,
        channel: currentChannel.value,
        thumbnailUrl: youtubeService.getThumbnailUrl(currentVideoId.value),
        addedAt: Date.now()
      })
    }
    checkIfBookmarked()
    await storageService.saveYouTubeBookmarks(bookmarks.value)
  }

  async function deleteBookmark(videoId: string): Promise<void> {
    bookmarks.value = bookmarks.value.filter((b) => b.videoId !== videoId)
    checkIfBookmarked()
    await storageService.saveYouTubeBookmarks(bookmarks.value)
  }

  function clearError(): void {
    errorMessage.value = null
  }

  return {
    currentVideoId,
    currentTitle,
    currentChannel,
    isPlaying,
    isLoading,
    errorMessage,
    displayMode,
    bookmarks,
    urlInput,
    isBookmarked,
    initBookmarks,
    playPreset,
    playUrl,
    handlePlayerError,
    togglePlayPause,
    toggleDisplayMode,
    toggleBookmark,
    deleteBookmark,
    clearError
  }
})
