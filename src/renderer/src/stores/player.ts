import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { audioEngine } from '../services/audioEngine'
import { ambientSynth } from '../services/ambientSynthesizer'
import { youtubeService } from '../services/youtubeService'
import type { Track, RepeatMode } from '../types/track'

export const usePlayerStore = defineStore('player', () => {
  // Playback state
  const playlist = ref<Track[]>([])
  const currentIndex = ref<number>(-1)
  const isPlaying = ref<boolean>(false)
  const volume = ref<number>(0.8) // Master Volume: 0.0 to 1.0
  const isMuted = ref<boolean>(false) // Master Mute: mute all audio across app
  const currentTime = ref<number>(0)
  const duration = ref<number>(0)
  const repeatMode = ref<RepeatMode>('all')
  const isShuffled = ref<boolean>(false)

  // Native Audio Element for low-latency Web Audio API analyser pipeline
  let audioEl: HTMLAudioElement | null = null

  // Broadcast volume & mute commands to YouTube IFrames & Electron Native WebContents
  function syncExternalMedia(vol: number, muted: boolean): void {
    // 1. Electron Native Chromium Audio Mixer Mute (Guarantees 100% total system mute)
    if (window.api?.setAudioMuted) {
      window.api.setAudioMuted(muted)
    }

    // 2. Direct YouTube API control
    youtubeService.setVolume(vol)
    youtubeService.setMute(muted)

    // 3. PostMessage fallback for any embedded iframes
    const iframes = document.querySelectorAll('iframe')
    iframes.forEach((frame) => {
      try {
        frame.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: muted ? 'mute' : 'unMute',
            args: []
          }),
          '*'
        )
        frame.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'setVolume',
            args: [Math.round((muted ? 0 : vol) * 100)]
          }),
          '*'
        )
      } catch (err) {
        console.warn('Failed to sync iframe volume:', err)
      }
    })
  }

  function getAudioElement(): HTMLAudioElement {
    if (!audioEl) {
      audioEl = new Audio()
      audioEl.crossOrigin = 'anonymous'

      // Hook with Web Audio API Analyser
      audioEngine.init(audioEl)

      audioEl.addEventListener('timeupdate', () => {
        if (audioEl) {
          currentTime.value = audioEl.currentTime
        }
      })

      audioEl.addEventListener('loadedmetadata', () => {
        if (audioEl) {
          duration.value = audioEl.duration || 0
        }
      })

      audioEl.addEventListener('play', () => {
        isPlaying.value = true
        audioEngine.resume()
      })

      audioEl.addEventListener('pause', () => {
        isPlaying.value = false
      })

      audioEl.addEventListener('ended', () => {
        handleTrackEnd()
      })

      audioEl.addEventListener('error', (e) => {
        console.warn('Audio playback error:', e)
        isPlaying.value = false
      })
    }
    return audioEl
  }

  const currentTrack = computed<Track | null>(() => {
    if (currentIndex.value >= 0 && currentIndex.value < playlist.value.length) {
      return playlist.value[currentIndex.value]
    }
    return null
  })

  function playTrack(trackIndex: number): void {
    if (trackIndex < 0 || trackIndex >= playlist.value.length) return

    currentIndex.value = trackIndex
    const track = playlist.value[trackIndex]
    const el = getAudioElement()

    const audioSrc =
      track.src.startsWith('http') || track.src.startsWith('blob:') || track.src.startsWith('file:')
        ? track.src
        : `file:///${track.src.replace(/\\/g, '/')}`

    el.src = audioSrc
    el.volume = isMuted.value ? 0 : volume.value
    audioEngine.setExternalSourceState(false, volume.value, isMuted.value)
    el.play()
      .then(() => {
        isPlaying.value = true
        audioEngine.resume()
      })
      .catch((err) => {
        console.warn('Play was prevented or interrupted:', err)
      })
  }

  function togglePlay(): void {
    const el = getAudioElement()

    if (!el.src || el.src === '' || currentIndex.value === -1) {
      if (playlist.value.length > 0) {
        playTrack(0)
      }
      return
    }

    if (isPlaying.value) {
      el.pause()
    } else {
      el.play().catch(console.warn)
      audioEngine.resume()
    }
  }

  function pause(): void {
    if (audioEl && isPlaying.value) {
      audioEl.pause()
    }
  }

  function seek(seconds: number): void {
    const el = getAudioElement()
    if (el) {
      el.currentTime = seconds
      currentTime.value = seconds
    }
  }

  // Centralized Master Volume: controls local player, ambient synth, and YouTube
  function setVolume(newVolume: number): void {
    volume.value = Math.max(0, Math.min(1, newVolume))
    const effectiveVol = isMuted.value ? 0 : volume.value

    const el = getAudioElement()
    if (el) {
      el.volume = effectiveVol
    }

    ambientSynth.setMasterVolume(volume.value)
    ambientSynth.setMasterMute(isMuted.value)
    syncExternalMedia(volume.value, isMuted.value)
  }

  // Centralized Master Mute: immediately silences ALL audio sources natively
  function toggleMute(): void {
    isMuted.value = !isMuted.value
    const effectiveVol = isMuted.value ? 0 : volume.value

    const el = getAudioElement()
    if (el) {
      el.volume = effectiveVol
    }

    ambientSynth.setMasterMute(isMuted.value)
    syncExternalMedia(volume.value, isMuted.value)
  }

  function nextTrack(): void {
    if (playlist.value.length === 0) return

    if (isShuffled.value) {
      const nextIdx = Math.floor(Math.random() * playlist.value.length)
      playTrack(nextIdx)
      return
    }

    let nextIdx = currentIndex.value + 1
    if (nextIdx >= playlist.value.length) {
      if (repeatMode.value === 'all') {
        nextIdx = 0
      } else {
        return
      }
    }
    playTrack(nextIdx)
  }

  function prevTrack(): void {
    if (playlist.value.length === 0) return

    if (currentTime.value > 3) {
      seek(0)
      return
    }

    let prevIdx = currentIndex.value - 1
    if (prevIdx < 0) {
      prevIdx = playlist.value.length - 1
    }
    playTrack(prevIdx)
  }

  function handleTrackEnd(): void {
    if (repeatMode.value === 'one') {
      seek(0)
      getAudioElement().play().catch(console.warn)
    } else {
      nextTrack()
    }
  }

  function toggleRepeat(): void {
    if (repeatMode.value === 'off') repeatMode.value = 'all'
    else if (repeatMode.value === 'all') repeatMode.value = 'one'
    else repeatMode.value = 'off'
  }

  function toggleShuffle(): void {
    isShuffled.value = !isShuffled.value
  }

  function addTracks(tracks: Track[]): void {
    playlist.value.push(...tracks)
  }

  return {
    playlist,
    currentIndex,
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    duration,
    repeatMode,
    isShuffled,
    playTrack,
    togglePlay,
    pause,
    seek,
    setVolume,
    toggleMute,
    nextTrack,
    prevTrack,
    toggleRepeat,
    toggleShuffle,
    addTracks,
    syncExternalMedia
  }
})
