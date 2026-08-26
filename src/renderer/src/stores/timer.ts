import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ambientSynth } from '../services/ambientSynthesizer'
import { usePlayerStore } from './player'
import { useAmbientStore } from './ambient'

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak'

function formatTimerDigits(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60)
  const s = totalSecs % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export const useTimerStore = defineStore('timer', () => {
  const playerStore = usePlayerStore()
  const ambientStore = useAmbientStore()

  // --- Pomodoro State ---
  const pomodoroMode = ref<PomodoroMode>('focus')
  const focusMinutes = ref(25)
  const shortBreakMinutes = ref(5)
  const longBreakMinutes = ref(15)

  const isPomodoroRunning = ref(false)
  const pomodoroSecondsLeft = ref(25 * 60)
  const completedSessions = ref(0)
  let pomodoroInterval: number | null = null

  // --- Sleep Timer State ---
  const isSleepTimerActive = ref(false)
  const sleepTotalSeconds = ref(0)
  const sleepSecondsLeft = ref(0)
  const initialMasterVolume = ref(0.8)
  let sleepInterval: number | null = null

  const pomodoroProgress = computed(() => {
    let total = focusMinutes.value * 60
    if (pomodoroMode.value === 'shortBreak') total = shortBreakMinutes.value * 60
    else if (pomodoroMode.value === 'longBreak') total = longBreakMinutes.value * 60

    return Math.max(0, Math.min(100, ((total - pomodoroSecondsLeft.value) / total) * 100))
  })

  const sleepProgress = computed(() => {
    if (!isSleepTimerActive.value || sleepTotalSeconds.value === 0) return 0
    return Math.max(
      0,
      Math.min(
        100,
        ((sleepTotalSeconds.value - sleepSecondsLeft.value) / sleepTotalSeconds.value) * 100
      )
    )
  })

  // Synchronize Taskbar & Window Title dynamically
  function updateAppTitle(): void {
    let title = 'Lofi Player'
    if (isPomodoroRunning.value) {
      const icon = pomodoroMode.value === 'focus' ? '🎯' : '☕'
      title = `[${icon} ${formatTimerDigits(pomodoroSecondsLeft.value)}] Lofi Player`
    } else if (isSleepTimerActive.value) {
      title = `[🌙 ${formatTimerDigits(sleepSecondsLeft.value)}] Lofi Player`
    } else if (playerStore.currentTrack && playerStore.isPlaying) {
      title = `▶ ${playerStore.currentTrack.title} - Lofi Player`
    }

    document.title = title
    if (window.api?.setWindowTitle) {
      window.api.setWindowTitle(title)
    }
  }

  // --- Pomodoro Actions ---
  function setFocusMinutes(mins: number): void {
    focusMinutes.value = mins
    if (pomodoroMode.value === 'focus' && !isPomodoroRunning.value) {
      pomodoroSecondsLeft.value = mins * 60
    }
    updateAppTitle()
  }

  function setPomodoroMode(mode: PomodoroMode): void {
    pomodoroMode.value = mode
    pausePomodoro()
    if (mode === 'focus') pomodoroSecondsLeft.value = focusMinutes.value * 60
    else if (mode === 'shortBreak') pomodoroSecondsLeft.value = shortBreakMinutes.value * 60
    else if (mode === 'longBreak') pomodoroSecondsLeft.value = longBreakMinutes.value * 60
    updateAppTitle()
  }

  function startPomodoro(): void {
    if (isPomodoroRunning.value) return

    isPomodoroRunning.value = true
    stopPomodoroInterval()
    updateAppTitle()

    pomodoroInterval = window.setInterval(() => {
      if (pomodoroSecondsLeft.value > 0) {
        pomodoroSecondsLeft.value--
        updateAppTitle()
      } else {
        handlePomodoroComplete()
      }
    }, 1000)
  }

  function pausePomodoro(): void {
    isPomodoroRunning.value = false
    stopPomodoroInterval()
    updateAppTitle()
  }

  function resetPomodoro(): void {
    pausePomodoro()
    setPomodoroMode(pomodoroMode.value)
  }

  function stopPomodoroInterval(): void {
    if (pomodoroInterval) {
      clearInterval(pomodoroInterval)
      pomodoroInterval = null
    }
  }

  function handlePomodoroComplete(): void {
    pausePomodoro()
    ambientSynth.playChime()

    if (pomodoroMode.value === 'focus') {
      completedSessions.value++
      // If 4 sessions done, suggest long break
      if (completedSessions.value % 4 === 0) {
        setPomodoroMode('longBreak')
      } else {
        setPomodoroMode('shortBreak')
      }
    } else {
      setPomodoroMode('focus')
    }
  }

  // --- Sleep Timer Actions ---
  function startSleepTimer(minutes: number): void {
    cancelSleepTimer()

    isSleepTimerActive.value = true
    sleepTotalSeconds.value = minutes * 60
    sleepSecondsLeft.value = minutes * 60
    initialMasterVolume.value = playerStore.volume
    updateAppTitle()

    sleepInterval = window.setInterval(() => {
      if (sleepSecondsLeft.value > 0) {
        sleepSecondsLeft.value--
        updateAppTitle()

        // In last 45 seconds, gradually fade out volume
        if (sleepSecondsLeft.value <= 45) {
          const fadeRatio = sleepSecondsLeft.value / 45
          playerStore.setVolume(initialMasterVolume.value * fadeRatio)
        }
      } else {
        handleSleepTimerEnd()
      }
    }, 1000)
  }

  function cancelSleepTimer(): void {
    if (isSleepTimerActive.value) {
      isSleepTimerActive.value = false
      if (sleepSecondsLeft.value <= 45) {
        playerStore.setVolume(initialMasterVolume.value)
      }
    }
    sleepSecondsLeft.value = 0
    sleepTotalSeconds.value = 0
    if (sleepInterval) {
      clearInterval(sleepInterval)
      sleepInterval = null
    }
    updateAppTitle()
  }

  function handleSleepTimerEnd(): void {
    cancelSleepTimer()
    playerStore.pause()
    ambientStore.stopAll()
    playerStore.setVolume(initialMasterVolume.value)
  }

  return {
    pomodoroMode,
    focusMinutes,
    shortBreakMinutes,
    longBreakMinutes,
    isPomodoroRunning,
    pomodoroSecondsLeft,
    completedSessions,
    pomodoroProgress,
    isSleepTimerActive,
    sleepTotalSeconds,
    sleepSecondsLeft,
    sleepProgress,
    setFocusMinutes,
    setPomodoroMode,
    startPomodoro,
    pausePomodoro,
    resetPomodoro,
    startSleepTimer,
    cancelSleepTimer,
    updateAppTitle
  }
})
