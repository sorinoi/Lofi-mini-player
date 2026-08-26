<script setup lang="ts">
import { ref } from 'vue'
import {
  X,
  Target,
  Moon,
  Play,
  Pause,
  RotateCcw,
  Bell
} from 'lucide-vue-next'
import { useTimerStore } from '../../stores/timer'
import { ambientSynth } from '../../services/ambientSynthesizer'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const timerStore = useTimerStore()
const activeTab = ref<'pomodoro' | 'sleep'>('pomodoro')

function formatSeconds(totalSecs: number): string {
  const m = Math.floor(totalSecs / 60)
  const s = totalSecs % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const focusDurationOptions = [25, 45, 60]
const sleepPresets = [15, 30, 45, 60, 90]
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="w-full max-w-md bg-lofi-surface border border-lofi-border rounded-3xl p-6 shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-150">
      <!-- Close Button -->
      <button
        @click="emit('close')"
        class="absolute top-5 right-5 p-1.5 rounded-full text-lofi-muted hover:text-lofi-text hover:bg-lofi-card transition-colors"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Top Tab Switcher -->
      <div class="flex items-center justify-center gap-1.5 p-1 bg-lofi-card/70 border border-lofi-border/60 rounded-2xl mb-5 self-center">
        <button
          @click="activeTab = 'pomodoro'"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'pomodoro'
              ? 'bg-lofi-primary text-lofi-bg shadow-md'
              : 'text-lofi-muted hover:text-lofi-text'
          ]"
        >
          <Target class="w-3.5 h-3.5" />
          <span>Pomodoro Focus</span>
        </button>

        <button
          @click="activeTab = 'sleep'"
          :class="[
            'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
            activeTab === 'sleep'
              ? 'bg-lofi-purple text-lofi-bg shadow-md'
              : 'text-lofi-muted hover:text-lofi-text'
          ]"
        >
          <Moon class="w-3.5 h-3.5" />
          <span>Sleep Timer</span>
        </button>
      </div>

      <!-- TAB 1: POMODORO TIMER -->
      <div v-if="activeTab === 'pomodoro'" class="flex flex-col items-center">
        <!-- Main Mode Switcher Pills -->
        <div class="flex items-center gap-2 mb-3">
          <button
            @click="timerStore.setPomodoroMode('focus')"
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold border transition-all',
              timerStore.pomodoroMode === 'focus'
                ? 'bg-lofi-card text-lofi-primary border-lofi-primary/60 shadow-sm'
                : 'bg-lofi-surface text-lofi-muted border-lofi-border hover:text-lofi-text'
            ]"
          >
            🎯 Focus ({{ timerStore.focusMinutes }}m)
          </button>

          <button
            @click="timerStore.setPomodoroMode('shortBreak')"
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold border transition-all',
              timerStore.pomodoroMode === 'shortBreak'
                ? 'bg-lofi-card text-lofi-green border-lofi-green/60 shadow-sm'
                : 'bg-lofi-surface text-lofi-muted border-lofi-border hover:text-lofi-text'
            ]"
          >
            ☕ Short Break ({{ timerStore.shortBreakMinutes }}m)
          </button>

          <button
            @click="timerStore.setPomodoroMode('longBreak')"
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold border transition-all',
              timerStore.pomodoroMode === 'longBreak'
                ? 'bg-lofi-card text-lofi-accent border-lofi-accent/60 shadow-sm'
                : 'bg-lofi-surface text-lofi-muted border-lofi-border hover:text-lofi-text'
            ]"
          >
            🌴 Long Break ({{ timerStore.longBreakMinutes }}m)
          </button>
        </div>

        <!-- 3 Focus Options: 25m, 45m, 60m -->
        <div
          v-if="timerStore.pomodoroMode === 'focus'"
          class="flex items-center gap-1.5 p-1 bg-lofi-surface border border-lofi-border/70 rounded-xl mb-5"
        >
          <span class="text-2xs text-lofi-muted px-2 font-medium">Focus Target:</span>
          <button
            v-for="mins in focusDurationOptions"
            :key="mins"
            @click="timerStore.setFocusMinutes(mins)"
            :class="[
              'px-3 py-1 rounded-lg text-xs font-bold transition-all',
              timerStore.focusMinutes === mins
                ? 'bg-lofi-primary text-lofi-bg shadow-sm'
                : 'text-lofi-muted hover:text-lofi-text hover:bg-lofi-card'
            ]"
          >
            {{ mins }}m
          </button>
        </div>
        <div v-else class="h-4"></div>

        <!-- Big Countdown Clock Ring -->
        <div class="relative w-48 h-48 flex items-center justify-center mb-6">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <!-- Background Ring -->
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#24283b"
              stroke-width="6"
              fill="transparent"
            />
            <!-- Progress Ring -->
            <circle
              cx="50"
              cy="50"
              r="44"
              :stroke="timerStore.pomodoroMode === 'focus' ? '#ff9e64' : '#9ece6a'"
              stroke-width="6"
              stroke-linecap="round"
              fill="transparent"
              stroke-dasharray="276.46"
              :stroke-dashoffset="276.46 - (276.46 * timerStore.pomodoroProgress) / 100"
              class="transition-all duration-500 ease-linear"
            />
          </svg>

          <!-- Digital Time Inside Ring -->
          <div class="absolute flex flex-col items-center">
            <span class="text-4xl font-extrabold font-mono tracking-tight text-lofi-text">
              {{ formatSeconds(timerStore.pomodoroSecondsLeft) }}
            </span>
            <span class="text-2xs text-lofi-muted uppercase tracking-widest mt-1">
              {{ timerStore.pomodoroMode === 'focus' ? `Deep Work (${timerStore.focusMinutes}m)` : 'Break Time' }}
            </span>
          </div>
        </div>

        <!-- Pomodoro Action Buttons -->
        <div class="flex items-center gap-4 mb-6">
          <button
            @click="timerStore.resetPomodoro"
            class="p-3 rounded-full bg-lofi-card border border-lofi-border text-lofi-muted hover:text-lofi-text transition-colors shadow-sm"
            title="Reset"
          >
            <RotateCcw class="w-4 h-4" />
          </button>

          <button
            @click="timerStore.isPomodoroRunning ? timerStore.pausePomodoro() : timerStore.startPomodoro()"
            class="px-8 py-3.5 rounded-2xl bg-lofi-primary text-lofi-bg font-extrabold text-sm flex items-center gap-2 shadow-lg hover:opacity-90 active:scale-95 transition-all"
          >
            <Pause v-if="timerStore.isPomodoroRunning" class="w-4 h-4 fill-current" />
            <Play v-else class="w-4 h-4 fill-current ml-0.5" />
            <span>{{ timerStore.isPomodoroRunning ? 'PAUSE' : 'START FOCUS' }}</span>
          </button>

          <button
            @click="ambientSynth.playChime()"
            class="p-3 rounded-full bg-lofi-card border border-lofi-border text-lofi-muted hover:text-lofi-text transition-colors shadow-sm"
            title="Preview Bell Chime"
          >
            <Bell class="w-4 h-4" />
          </button>
        </div>

        <!-- Session Progress Indicator -->
        <div class="flex items-center gap-2 text-2xs text-lofi-muted">
          <span>Sessions:</span>
          <div class="flex items-center gap-1">
            <span
              v-for="i in 4"
              :key="i"
              :class="[
                'w-2.5 h-2.5 rounded-full border transition-all',
                (timerStore.completedSessions % 4) >= i
                  ? 'bg-lofi-primary border-lofi-primary'
                  : 'bg-lofi-card border-lofi-border'
              ]"
            ></span>
          </div>
          <span class="ml-1 text-lofi-text font-bold">({{ timerStore.completedSessions }} completed)</span>
        </div>
      </div>

      <!-- TAB 2: SLEEP TIMER -->
      <div v-else class="flex flex-col items-center text-center">
        <!-- Icon & Status -->
        <div class="w-14 h-14 rounded-2xl bg-lofi-purple/20 border border-lofi-purple/40 flex items-center justify-center text-lofi-purple mb-4 shadow-inner">
          <Moon class="w-7 h-7" />
        </div>

        <h3 class="text-base font-bold text-lofi-text mb-1">Night Sleep Timer</h3>
        <p class="text-xs text-lofi-muted max-w-xs mb-6">
          Set a countdown timer. Audio will gently fade out in the last 45 seconds before stopping completely.
        </p>

        <!-- Active Timer Display -->
        <div
          v-if="timerStore.isSleepTimerActive"
          class="w-full bg-lofi-card/80 border border-lofi-border rounded-2xl p-5 mb-6 flex flex-col items-center"
        >
          <div class="text-2xs uppercase tracking-widest text-lofi-purple font-semibold mb-1 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-lofi-purple animate-ping"></span>
            <span>Sleep Timer Running</span>
          </div>
          <span class="text-3xl font-extrabold font-mono text-lofi-text mb-3">
            {{ formatSeconds(timerStore.sleepSecondsLeft) }}
          </span>

          <!-- Progress Bar -->
          <div class="w-full h-1.5 bg-lofi-surface rounded-full overflow-hidden mb-4">
            <div
              class="h-full bg-lofi-purple rounded-full transition-all duration-1000"
              :style="{ width: `${timerStore.sleepProgress}%` }"
            ></div>
          </div>

          <button
            @click="timerStore.cancelSleepTimer"
            class="px-4 py-1.5 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs font-semibold border border-red-500/30 transition-colors"
          >
            Cancel Sleep Timer
          </button>
        </div>

        <!-- Preset Selection Chips -->
        <div v-else class="w-full space-y-3 mb-6">
          <div class="text-xs font-semibold text-lofi-muted text-left">Select Duration:</div>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="mins in sleepPresets"
              :key="mins"
              @click="timerStore.startSleepTimer(mins)"
              class="py-2.5 px-2 rounded-xl bg-lofi-card hover:bg-lofi-border text-lofi-text text-xs font-bold border border-lofi-border hover:border-lofi-purple/60 transition-all active:scale-95 shadow-sm"
            >
              {{ mins }}m
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-2xs {
  font-size: 0.68rem;
}
</style>
