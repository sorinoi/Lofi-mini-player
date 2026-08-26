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

  const currentVideoId = ref<string>('jfKfPfyJRdk') // Default to Lofi Girl
  const currentTitle = ref<string>('Lofi Hip Hop Radio - Beats to Relax/Study to')
  const currentChannel = ref<string>('Lofi Girl')
  const isPlaying = ref<boolean>(false)
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

  function playUrl(urlOrId: string, customTitle?: string): boolean {
    const videoId = youtubeService.extractVideoId(urlOrId)
    if (!videoId) return false

    playerStore.pause()
    currentVideoId.value = videoId
    currentTitle.value = customTitle || `YouTube Stream (${videoId})`
    currentChannel.value = 'YouTube Audio'
    isPlaying.value = true
    youtubeService.loadVideo(videoId)
    audioEngine.setExternalSourceState(true, playerStore.volume, playerStore.isMuted)
    urlInput.value = ''
    checkIfBookmarked()
    return true
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

  return {
    currentVideoId,
    currentTitle,
    currentChannel,
    isPlaying,
    displayMode,
    bookmarks,
    urlInput,
    isBookmarked,
    initBookmarks,
    playPreset,
    playUrl,
    toggleDisplayMode,
    toggleBookmark,
    deleteBookmark
  }
})
