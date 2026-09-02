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
    videoId: 'rFZHOHl-L8A',
    thumbnailUrl: 'https://img.youtube.com/vi/rFZHOHl-L8A/hqdefault.jpg',
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
    title: 'Chillhop Essentials Radio ☕ Jazzy & Lofi Hip Hop Beats',
    channel: 'Chillhop Music',
    videoId: 'ohrjSFplPzk',
    thumbnailUrl: 'https://img.youtube.com/vi/ohrjSFplPzk/hqdefault.jpg',
    category: 'jazz',
    isLive: true
  },
  {
    id: 'synthwave-radio',
    title: 'Synthwave Radio 🌌 Beats to Chill / Game to',
    channel: 'Lofi Girl - Synthwave',
    videoId: '4xDzrJKXOOY',
    thumbnailUrl: 'https://img.youtube.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    category: 'synthwave',
    isLive: true
  },
  {
    id: 'coffee-shop-lofi',
    title: 'Coffee Shop Radio ☕ 24/7 Lofi & Jazzy Hip-Hop Beats',
    channel: 'STEEZYASFUCK',
    videoId: 'lP26UCnoH9s',
    thumbnailUrl: 'https://img.youtube.com/vi/lP26UCnoH9s/hqdefault.jpg',
    category: 'chill',
    isLive: true
  }
]

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

export function getYouTubeErrorMessage(errorCode: number): string {
  switch (errorCode) {
    case 2:
      return 'Invalid YouTube Video ID or URL parameters.'
    case 5:
      return 'HTML5 playback error. Please try again.'
    case 100:
      return 'Video not found, ended, or has been removed.'
    case 101:
    case 150:
    case 152:
      return 'Embedding restricted by owner or region. Please try another stream or station.'
    default:
      return `YouTube playback error (${errorCode}).`
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
  private currentElementId = 'youtube-player-element'

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

  /**
   * Ensures the target DOM element exists, recreating it inside a wrapper container if needed.
   */
  private ensureTargetElement(elementId: string): HTMLElement | null {
    let target = document.getElementById(elementId)
    if (!target) {
      const wrapper = document.getElementById(`${elementId}-wrapper`)
      if (wrapper) {
        target = document.createElement('div')
        target.id = elementId
        target.className = 'w-full h-full'
        wrapper.appendChild(target)
      }
    }
    return target
  }

  public createPlayer(
    elementId: string,
    videoId: string,
    initialVolume: number,
    initialMuted: boolean,
    autoPlay: boolean = false,
    onStateChange?: (state: number) => void,
    onError?: (code: number, message: string) => void
  ): Promise<any> {
    this.currentElementId = elementId
    this.currentVolume = initialVolume
    this.isCurrentMuted = initialMuted

    return new Promise(async (resolve) => {
      await this.initApi()

      // Cleanly destroy prior instance
      if (this.player) {
        try {
          this.player.destroy()
        } catch {}
        this.player = null
      }

      // Guarantee target element presence in DOM
      const targetEl = this.ensureTargetElement(elementId)
      if (!targetEl) {
        console.warn(`[YouTubeService] DOM element #${elementId} not found`)
        resolve(null)
        return
      }

      const isFileProtocol =
        typeof window !== 'undefined' &&
        (window.location.protocol === 'file:' || !window.location.origin || window.location.origin === 'null')
      const effectiveOrigin = isFileProtocol ? 'https://localhost' : window.location.origin

      try {
        this.player = new window.YT.Player(elementId, {
          host: 'https://www.youtube.com',
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: autoPlay ? 1 : 0,
            controls: 1,
            enablejsapi: 1,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            origin: effectiveOrigin,
            widget_referrer: effectiveOrigin,
            playsinline: 1,
            disablekb: 0
          },
          events: {
            onReady: (event: any) => {
              if (initialMuted) {
                try {
                  event.target.mute()
                } catch {}
              } else {
                try {
                  event.target.unMute()
                  event.target.setVolume(Math.round(initialVolume * 100))
                } catch {}
              }

              if (autoPlay) {
                try {
                  event.target.playVideo()
                } catch {}
                this.isPlayingState = true
                audioEngine.setExternalSourceState(true, this.currentVolume, this.isCurrentMuted)
              } else {
                this.isPlayingState = false
                audioEngine.setExternalSourceState(false, this.currentVolume, this.isCurrentMuted)
              }

              resolve(this.player)
            },
            onStateChange: (event: any) => {
              // 1: PLAYING, 2: PAUSED, 0: ENDED, 3: BUFFERING
              if (event.data === 1 || event.data === 3) {
                this.isPlayingState = true
                audioEngine.setExternalSourceState(true, this.currentVolume, this.isCurrentMuted)
              } else if (event.data === 2 || event.data === 0) {
                this.isPlayingState = false
                audioEngine.setExternalSourceState(false, this.currentVolume, this.isCurrentMuted)
              }

              if (onStateChange) {
                onStateChange(event.data)
              }
            },
            onError: (event: any) => {
              const code = event.data as number
              const message = getYouTubeErrorMessage(code)
              console.warn(`[YouTubeService] Player error (${code}):`, message)
              this.isPlayingState = false
              audioEngine.setExternalSourceState(false, this.currentVolume, this.isCurrentMuted)

              if (onError) {
                onError(code, message)
              }
            }
          }
        })
      } catch (err) {
        console.error('[YouTubeService] Failed to construct YT.Player:', err)
        resolve(null)
      }
    })
  }

  public playVideo(): void {
    if (this.player && typeof this.player.playVideo === 'function') {
      try {
        this.player.playVideo()
        this.isPlayingState = true
        audioEngine.setExternalSourceState(true, this.currentVolume, this.isCurrentMuted)
      } catch (e) {
        console.warn('[YouTubeService] playVideo error:', e)
      }
    }
  }

  public pauseVideo(): void {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      try {
        this.player.pauseVideo()
        this.isPlayingState = false
        audioEngine.setExternalSourceState(false, this.currentVolume, this.isCurrentMuted)
      } catch (e) {
        console.warn('[YouTubeService] pauseVideo error:', e)
      }
    }
  }

  public destroyPlayer(): void {
    if (this.player) {
      try {
        this.player.destroy()
      } catch {}
      this.player = null
    }
    this.isPlayingState = false
    audioEngine.setExternalSourceState(false, this.currentVolume, this.isCurrentMuted)
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
        return
      } catch (e) {
        console.warn('[YouTubeService] loadVideoById error, attempting recreation:', e)
      }
    }

    // If player wasn't initialized or failed, recreate it
    this.createPlayer(
      this.currentElementId,
      videoId,
      this.currentVolume,
      this.isCurrentMuted,
      true
    )
  }

  public extractVideoId(urlOrId: string): string | null {
    if (!urlOrId || typeof urlOrId !== 'string') return null
    const cleaned = urlOrId.trim()

    // 1. Direct 11-character ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleaned)) {
      return cleaned
    }

    // 2. Standard watch URL (watch?v=... with any query param order)
    const watchMatch = cleaned.match(/(?:youtube\.com|m\.youtube\.com|music\.youtube\.com)\/watch\?(?:[^&]*&)*v=([a-zA-Z0-9_-]{11})/)
    if (watchMatch) return watchMatch[1]

    // 3. Shortened URL (youtu.be/...)
    const shortMatch = cleaned.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
    if (shortMatch) return shortMatch[1]

    // 4. Live URL (youtube.com/live/...)
    const liveMatch = cleaned.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/)
    if (liveMatch) return liveMatch[1]

    // 5. Shorts URL (youtube.com/shorts/...)
    const shortsMatch = cleaned.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/)
    if (shortsMatch) return shortsMatch[1]

    // 6. Embed URL (youtube.com/embed/...)
    const embedMatch = cleaned.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
    if (embedMatch) return embedMatch[1]

    // 7. General fallback regex for ?v= anywhere in URL
    const genericV = cleaned.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
    if (genericV) return genericV[1]

    return null
  }

  public getThumbnailUrl(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
  }

  public get isPlaying(): boolean {
    return this.isPlayingState
  }
}

export const youtubeService = new YouTubeService()
