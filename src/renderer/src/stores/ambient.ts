import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ambientSynth, type AmbientSoundType } from '../services/ambientSynthesizer'

export interface AmbientTrack {
  id: AmbientSoundType
  name: string
  icon: string
  volume: number // 0.0 to 1.0
  isPlaying: boolean
  description: string
  color: string
}

export interface SoundscapePreset {
  id: string
  name: string
  icon: string
  description: string
  tracks: Partial<Record<AmbientSoundType, number>>
}

export const SOUNDSCAPE_PRESETS: SoundscapePreset[] = [
  {
    id: 'rainy_cafe',
    name: 'Rainy Cafe',
    icon: '☕',
    description: 'Gentle rain tapping on cafe windows with quiet murmur',
    tracks: { rain: 0.6, cafe: 0.45, vinyl: 0.25 }
  },
  {
    id: 'campfire_night',
    name: 'Campfire Night',
    icon: '🔥',
    description: 'Warm crackling embers under starry nocturnal skies',
    tracks: { fire: 0.65, crickets: 0.4, wind: 0.25 }
  },
  {
    id: 'deep_focus',
    name: 'Deep Study Flow',
    icon: '🌧️',
    description: 'Continuous soothing rainfall with gentle breeze',
    tracks: { rain: 0.55, wind: 0.35 }
  },
  {
    id: 'ocean_breeze',
    name: 'Coastal Haven',
    icon: '🌊',
    description: 'Slow rhythmic waves crashing with ocean breeze',
    tracks: { waves: 0.7, wind: 0.3 }
  },
  {
    id: 'vintage_room',
    name: 'Vintage Bedroom',
    icon: '📻',
    description: 'Authentic 33rpm vinyl record noise and hiss',
    tracks: { vinyl: 0.55, rain: 0.3 }
  }
]

export const useAmbientStore = defineStore('ambient', () => {
  const isMasterMuted = ref(false)

  const soundList = ref<AmbientTrack[]>([
    {
      id: 'rain',
      name: 'Rainfall',
      icon: '🌧️',
      volume: 0.5,
      isPlaying: false,
      description: 'Soothing rain and gentle droplets',
      color: '#7aa2f7'
    },
    {
      id: 'fire',
      name: 'Campfire',
      icon: '🔥',
      volume: 0.5,
      isPlaying: false,
      description: 'Cozy fireplace crackles and sparks',
      color: '#ff9e64'
    },
    {
      id: 'vinyl',
      name: 'Vinyl Crackle',
      icon: '📻',
      volume: 0.4,
      isPlaying: false,
      description: 'Vintage 33 RPM needle noise and warm hiss',
      color: '#bb9af7'
    },
    {
      id: 'wind',
      name: 'Forest Wind',
      icon: '🌲',
      volume: 0.4,
      isPlaying: false,
      description: 'Gentle breeze swaying through trees',
      color: '#9ece6a'
    },
    {
      id: 'cafe',
      name: 'Coffee Shop',
      icon: '☕',
      volume: 0.4,
      isPlaying: false,
      description: 'Atmospheric chatter and mug clinks',
      color: '#e0af68'
    },
    {
      id: 'waves',
      name: 'Ocean Waves',
      icon: '🌊',
      volume: 0.5,
      isPlaying: false,
      description: 'Rolling tides and soothing water swells',
      color: '#2ac3de'
    },
    {
      id: 'crickets',
      name: 'Night Crickets',
      icon: '🌙',
      volume: 0.35,
      isPlaying: false,
      description: 'Peaceful nocturnal summer ambiance',
      color: '#f7768e'
    }
  ])

  const activeCount = computed(() => {
    return isMasterMuted.value ? 0 : soundList.value.filter((s) => s.isPlaying).length
  })

  function toggleSound(id: AmbientSoundType): void {
    const track = soundList.value.find((s) => s.id === id)
    if (track) {
      track.isPlaying = !track.isPlaying
      updateSynthesizer(track)
    }
  }

  function setVolume(id: AmbientSoundType, volume: number): void {
    const track = soundList.value.find((s) => s.id === id)
    if (track) {
      track.volume = Math.max(0, Math.min(1, volume))
      if (!track.isPlaying && volume > 0) {
        track.isPlaying = true
      }
      updateSynthesizer(track)
    }
  }

  function updateSynthesizer(track: AmbientTrack): void {
    const effectivePlaying = !isMasterMuted.value && track.isPlaying
    ambientSynth.setChannelState(track.id, effectivePlaying, track.volume)
  }

  function toggleMasterMute(): void {
    isMasterMuted.value = !isMasterMuted.value
    soundList.value.forEach((track) => updateSynthesizer(track))
  }

  function applyPreset(preset: SoundscapePreset): void {
    soundList.value.forEach((track) => {
      if (preset.tracks[track.id] !== undefined) {
        track.isPlaying = true
        track.volume = preset.tracks[track.id]!
      } else {
        track.isPlaying = false
      }
      updateSynthesizer(track)
    })
  }

  function stopAll(): void {
    soundList.value.forEach((track) => {
      track.isPlaying = false
      updateSynthesizer(track)
    })
  }

  return {
    soundList,
    isMasterMuted,
    activeCount,
    toggleSound,
    setVolume,
    toggleMasterMute,
    applyPreset,
    stopAll
  }
})
