/**
 * YouTube Service
 * Handles YouTube video/stream URL parsing, metadata extraction, and YouTube IFrame Player API lifecycle.
 * Fully synchronized with AudioEngine for music-reactive VU meter animations during YouTube playback.
 */

import { audioEngine } from './audioEngine'

export interface YouTubeStreamPreset {
  id: string
  title: string
  channel: string
  videoId: string
  thumbnailUrl: string
  category: 'chill' | 'jazz' | 'synthwave' | 'study' | 'sleep'
  isLive: boolean
}

export const YOUTUBE_LOFI_PRESETS: YouTubeStreamPreset[] = [
  {
    id: 'lofigirl-study',
    title: 'Lofi Hip Hop Radio 📚 Beats to Relax / Study to',
    channel: 'Lofi Girl',
    videoId: 'jfKfPfyJRdk',
    thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    category: 'study',
    isLive: true
  },
  {
    id: 'lofigirl-sleep',
    title: 'Lofi Sleep Beats 🌙 Beats to Sleep / Chill to',
    channel: 'Lofi Girl',
    videoId: 'rUxyKA_-grg',
    thumbnailUrl: 'https://img.youtube.com/vi/rUxyKA_-grg/hqdefault.jpg',
    category: 'sleep',
    isLive: true
  },
  {
    id: 'chillhop-radio',
    title: 'Chillhop Radio ☕ Jazzy & Lofi Hip Hop Beats',
    channel: 'Chillhop Music',
    videoId: '5yx6BWlEvq4',
    thumbnailUrl: 'https://img.youtube.com/vi/5yx6BWlEvq4/hqdefault.jpg',
    category: 'jazz',
    isLive: true
  },
  {
    id: 'synthwave-radio',
    title: 'Synthwave Radio 🌆 Chill Synth / Retro Beats',
    channel: 'Lofi Girl - Synthwave',
    videoId: '4xDzrJKXOOY',
    thumbnailUrl: 'https://img.youtube.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    category: 'synthwave',
    isLive: true
  },
  {
    id: 'coffee-shop-lofi',
    title: 'Tokyo Cafe Lofi ☕ Cozy Study & Chill Sessions',
    channel: 'Coffee Shop Vibes',
    videoId: 'lP26UCnoH9s',
    thumbnailUrl: 'https://img.youtube.com/vi/lP26UCnoH9s/hqdefault.jpg',
    category: 'chill',
    isLive: false
  }
]

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

class YouTubeService {
  private player: any = null
  private isApiReady = false
  private isApiLoading = false
  private readyCallbacks: (() => void)[] = []
  private isPlayingState = false
  private currentVolume = 0.8
  private isCurrentMuted = false

  public initApi(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
        this.isApiReady = true
        resolve()
        return
      }

      this.readyCallbacks.push(resolve)

      if (!this.isApiLoading) {
        this.isApiLoading = true
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        } else {
          document.head.appendChild(tag)
        }

        window.onYouTubeIframeAPIReady = () => {
          this.isApiReady = true
          this.readyCallbacks.forEach((cb) => cb())
          this.readyCallbacks = []
        }
      }
    })
  }

  public createPlayer(
    elementId: string,
    videoId: string,
    initialVolume: number,
    initialMuted: boolean,
    onStateChange?: (state: number) => void
  ): Promise<any> {
    this.currentVolume = initialVolume
    this.isCurrentMuted = initialMuted

    return new Promise(async (resolve) => {
      await this.initApi()

      // If existing player, destroy first
      if (this.player) {
        try {
          this.player.destroy()
        } catch {}
      }

      this.player = new window.YT.Player(elementId, {
        videoId,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          controls: 1,
          enablejsapi: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3
        },
        events: {
          onReady: (event: any) => {
            if (initialMuted) {
              event.target.mute()
            } else {
              event.target.unMute()
              event.target.setVolume(Math.round(initialVolume * 100))
            }
            this.isPlayingState = true
            audioEngine.setExternalSourceState(true, this.currentVolume, this.isCurrentMuted)
            resolve(this.player)
          },
          onStateChange: (event: any) => {
            // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
            if (event.data === 1) {
              this.isPlayingState = true
              audioEngine.setExternalSourceState(true, this.currentVolume, this.isCurrentMuted)
            } else if (event.data === 2 || event.data === 0) {
              this.isPlayingState = false
              audioEngine.setExternalSourceState(false, this.currentVolume, this.isCurrentMuted)
            }

            if (onStateChange) {
              onStateChange(event.data)
            }
          }
        }
      })
    })
  }

  public setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1, volume))
    const volPercent = Math.round(this.currentVolume * 100)

    if (this.player && typeof this.player.setVolume === 'function') {
      try {
        this.player.setVolume(volPercent)
      } catch {}
    }

    audioEngine.setExternalSourceState(this.isPlayingState, this.currentVolume, this.isCurrentMuted)
  }

  public setMute(isMuted: boolean): void {
    this.isCurrentMuted = isMuted

    if (this.player) {
      try {
        if (isMuted && typeof this.player.mute === 'function') {
          this.player.mute()
        } else if (!isMuted && typeof this.player.unMute === 'function') {
          this.player.unMute()
        }
      } catch {}
    }

    audioEngine.setExternalSourceState(this.isPlayingState, this.currentVolume, this.isCurrentMuted)
  }

  public loadVideo(videoId: string): void {
    if (this.player && typeof this.player.loadVideoById === 'function') {
      try {
        this.player.loadVideoById(videoId)
        this.isPlayingState = true
        audioEngine.setExternalSourceState(true, this.currentVolume, this.isCurrentMuted)
      } catch {}
    }
  }

  public extractVideoId(urlOrId: string): string | null {
    if (!urlOrId || typeof urlOrId !== 'string') return null
    const cleaned = urlOrId.trim()

    // Direct 11-character ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
      return cleaned
    }

    // Standard watch URL: youtube.com/watch?v=...
    const watchMatch = cleaned.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
    if (watchMatch) return watchMatch[1]

    // Shortened URL: youtu.be/...
    const shortMatch = cleaned.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
    if (shortMatch) return shortMatch[1]

    // Live URL: youtube.com/live/...
    const liveMatch = cleaned.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/)
    if (liveMatch) return liveMatch[1]

    // Embed URL: youtube.com/embed/...
    const embedMatch = cleaned.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (embedMatch) return embedMatch[1]

    return null
  }

  public getThumbnailUrl(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }
}

export const youtubeService = new YouTubeService()
