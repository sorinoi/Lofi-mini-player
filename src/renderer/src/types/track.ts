export type LofiGenre =
  | 'chillhop'
  | 'synthwave'
  | 'rainy'
  | 'study'
  | 'sleep'
  | 'custom'

export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  duration: number // in seconds
  src: string // file path or URL
  coverUrl?: string
  genre: LofiGenre
  sourceType: 'local' | 'youtube' | 'radio'
  addedAt: number
}

export type RepeatMode = 'off' | 'all' | 'one'

export interface LofiGenrePreset {
  id: LofiGenre | 'all'
  name: string
  icon: string
  description: string
  color: string
}

export const LOFI_GENRE_PRESETS: LofiGenrePreset[] = [
  { id: 'all', name: 'All Tracks', icon: '🎵', description: 'Complete Music Collection', color: '#c0caf5' },
  { id: 'chillhop', name: 'Chillhop / Jazzhop', icon: '☕', description: 'Smooth beats and jazz chords', color: '#ff9e64' },
  { id: 'synthwave', name: 'Synthwave / Retro', icon: '🌆', description: '80s analog nostalgia & neon dreams', color: '#f7768e' },
  { id: 'rainy', name: 'Rainy Day', icon: '🌧️', description: 'Cozy, melancholic rainy day vibes', color: '#7aa2f7' },
  { id: 'study', name: 'Study & Deep Focus', icon: '📖', description: 'Calm beats without distracting vocals', color: '#9ece6a' },
  { id: 'sleep', name: 'Sleep & Ambient', icon: '🌙', description: 'Slow, peaceful and soothing drones', color: '#bb9af7' }
]
