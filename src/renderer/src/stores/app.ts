import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const isMiniPlayer = ref(false)
  const miniPlayerView = ref<'music' | 'vu' | 'timer' | 'video'>('music')
  const isDockMode = ref(false)
  const dockMiniPlayerView = ref<'music' | 'vu' | 'timer' | 'video'>('music')
  const activeTab = ref<'player' | 'library' | 'youtube' | 'ambient' | 'todo' | 'notes' | 'settings'>('player')
  const visualizerMode = ref<'analog_vu' | 'frequency_bars' | 'circular_pulse' | 'pixel_wave'>('frequency_bars')

  async function toggleMiniPlayer(): Promise<void> {
    if (!isMiniPlayer.value) {
      if (isDockMode.value) {
        isDockMode.value = false
      }
      isMiniPlayer.value = true
      if (window.api?.enterMiniMode) {
        await window.api.enterMiniMode()
      }
    } else {
      isMiniPlayer.value = false
      if (window.api?.exitMiniMode) {
        await window.api.exitMiniMode()
      }
    }
  }

  function setMiniPlayerView(view: 'music' | 'vu' | 'timer' | 'video'): void {
    miniPlayerView.value = view
  }

  async function enterDockMode(): Promise<void> {
    if (isMiniPlayer.value) {
      isMiniPlayer.value = false
    }
    isDockMode.value = true
    if (window.api?.enterDockMode) {
      await window.api.enterDockMode()
    }
  }

  async function exitDockMode(): Promise<void> {
    isDockMode.value = false
    if (window.api?.exitDockMode) {
      await window.api.exitDockMode()
    }
  }

  async function toggleDockMode(): Promise<void> {
    if (isDockMode.value) {
      await exitDockMode()
    } else {
      await enterDockMode()
    }
  }

  function setDockMiniPlayerView(view: 'music' | 'vu' | 'timer' | 'video'): void {
    dockMiniPlayerView.value = view
  }

  function setActiveTab(tab: 'player' | 'library' | 'youtube' | 'ambient' | 'todo' | 'notes' | 'settings'): void {
    activeTab.value = tab
  }

  function setVisualizerMode(mode: 'analog_vu' | 'frequency_bars' | 'circular_pulse' | 'pixel_wave'): void {
    visualizerMode.value = mode
  }

  return {
    isMiniPlayer,
    miniPlayerView,
    isDockMode,
    dockMiniPlayerView,
    activeTab,
    visualizerMode,
    toggleMiniPlayer,
    setMiniPlayerView,
    enterDockMode,
    exitDockMode,
    toggleDockMode,
    setDockMiniPlayerView,
    setActiveTab,
    setVisualizerMode
  }
})
