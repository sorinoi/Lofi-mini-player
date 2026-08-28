import { usePlayerStore } from '../stores/player'
import { useYouTubeStore } from '../stores/youtube'
import { useAppStore } from '../stores/app'
import { youtubeService } from './youtubeService'
import { audioEngine } from './audioEngine'

export function setupKeyboardShortcuts(): () => void {
  const playerStore = usePlayerStore()
  const ytStore = useYouTubeStore()
  const appStore = useAppStore()

  function togglePlayPause(): void {
    if (ytStore.isPlaying) {
      ytStore.togglePlayPause()
    } else if (playerStore.isPlaying) {
      playerStore.togglePlay()
    } else {
      playerStore.togglePlay()
    }
  }

  function handleKeyDown(e: KeyboardEvent): void {
    // Check Alt+D globally for Dock Sidebar toggle
    if (e.altKey && e.code === 'KeyD') {
      e.preventDefault()
      appStore.toggleDockMode()
      return
    }

    // Ignore other keystrokes when the user is actively typing in form inputs
    const target = e.target as HTMLElement | null
    if (
      target &&
      (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
    ) {
      return
    }

    switch (e.code) {
      case 'Space':
        e.preventDefault()
        togglePlayPause()
        break
      case 'ArrowLeft':
        e.preventDefault()
        playerStore.seek(Math.max(0, playerStore.currentTime - 5))
        break
      case 'ArrowRight':
        e.preventDefault()
        playerStore.seek(Math.min(playerStore.duration || 0, playerStore.currentTime + 5))
        break
      case 'ArrowUp':
        e.preventDefault()
        playerStore.setVolume(playerStore.volume + 0.05)
        break
      case 'ArrowDown':
        e.preventDefault()
        playerStore.setVolume(playerStore.volume - 0.05)
        break
      case 'KeyM':
        e.preventDefault()
        playerStore.toggleMute()
        break
      case 'KeyN':
        e.preventDefault()
        playerStore.nextTrack()
        break
      case 'KeyP':
        e.preventDefault()
        playerStore.prevTrack()
        break
    }
  }

  // Setup OS Media Session API (Hardware media keys on keyboard/headphones)
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => togglePlayPause())
    navigator.mediaSession.setActionHandler('pause', () => togglePlayPause())
    navigator.mediaSession.setActionHandler('previoustrack', () => playerStore.prevTrack())
    navigator.mediaSession.setActionHandler('nexttrack', () => playerStore.nextTrack())
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        playerStore.seek(details.seekTime)
      }
    })
  }

  window.addEventListener('keydown', handleKeyDown)

  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
}
