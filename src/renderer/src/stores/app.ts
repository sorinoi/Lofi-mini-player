import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isMiniPlayer = ref(false)
  const activeTab = ref<'player' | 'library' | 'youtube' | 'ambient' | 'settings'>('player')
  const visualizerMode = ref<'analog_vu' | 'frequency_bars' | 'circular_pulse' | 'pixel_wave'>('frequency_bars')

  function toggleMiniPlayer(): void {
    isMiniPlayer.value = !isMiniPlayer.value
  }

  function setActiveTab(tab: 'player' | 'library' | 'youtube' | 'ambient' | 'settings'): void {
    activeTab.value = tab
  }

  function setVisualizerMode(mode: 'analog_vu' | 'frequency_bars' | 'circular_pulse' | 'pixel_wave'): void {
    visualizerMode.value = mode
  }

  return {
    isMiniPlayer,
    activeTab,
    visualizerMode,
    toggleMiniPlayer,
    setActiveTab,
    setVisualizerMode
  }
})
