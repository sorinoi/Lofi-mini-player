import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isMiniPlayer = ref(false)
  const miniPlayerView = ref<'music' | 'vu' | 'timer' | 'video'>('music')
  const activeTab = ref<'player' | 'library' | 'youtube' | 'ambient' | 'todo' | 'settings'>('player')
  const visualizerMode = ref<'analog_vu' | 'frequency_bars' | 'circular_pulse' | 'pixel_wave'>('frequency_bars')

  function toggleMiniPlayer(): void {
    isMiniPlayer.value = !isMiniPlayer.value
  }

  function setMiniPlayerView(view: 'music' | 'vu' | 'timer' | 'video'): void {
    miniPlayerView.value = view
  }

  function setActiveTab(tab: 'player' | 'library' | 'youtube' | 'ambient' | 'todo' | 'settings'): void {
    activeTab.value = tab
  }

  function setVisualizerMode(mode: 'analog_vu' | 'frequency_bars' | 'circular_pulse' | 'pixel_wave'): void {
    visualizerMode.value = mode
  }

  return {
    isMiniPlayer,
    miniPlayerView,
    activeTab,
    visualizerMode,
    toggleMiniPlayer,
    setMiniPlayerView,
    setActiveTab,
    setVisualizerMode
  }
})
