<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Maximize2,
  Minus,
  X,
  Clock,
  RotateCcw,
  Radio,
  Tv,
  Target,
  Moon,
  Pin,
  PinOff,
  CheckSquare,
  StickyNote,
  Plus,
  Trash2,
  Sparkles,
  FileJson,
  Check
} from 'lucide-vue-next'
import { useAppStore } from '../../stores/app'
import { usePlayerStore } from '../../stores/player'
import { useTimerStore } from '../../stores/timer'
import { useYouTubeStore } from '../../stores/youtube'
import { useTodoStore } from '../../stores/todo'
import { useNoteStore } from '../../stores/note'
import { youtubeService } from '../../services/youtubeService'
import type { TodoPriority, TodoCategory } from '../../types/todo'
import type { NoteColor } from '../../types/note'
import AnalogVuMeter from '../visualizers/AnalogVuMeter.vue'
import FrequencyBars from '../visualizers/FrequencyBars.vue'
import CircularPulse from '../visualizers/CircularPulse.vue'
import PixelWave from '../visualizers/PixelWave.vue'

const appStore = useAppStore()
const playerStore = usePlayerStore()
const timerStore = useTimerStore()
const ytStore = useYouTubeStore()
const todoStore = useTodoStore()
const noteStore = useNoteStore()

const isPinned = ref(true)
const dockTab = ref<'tasks' | 'notes'>('tasks')

// Quick Add Form - Tasks
const quickText = ref('')
const quickPriority = ref<TodoPriority>('medium')
const quickCategory = ref<TodoCategory>('work')
const isAddExpanded = ref(false)

// Quick Add Form - Notes
const quickNoteTitle = ref('')
const quickNoteContent = ref('')
const quickNoteColor = ref<NoteColor>('default')
const isNoteAddExpanded = ref(false)

async function handleAddQuickNote(): Promise<void> {
  if (!quickNoteTitle.value.trim() && !quickNoteContent.value.trim()) return
  await noteStore.addNote(
    quickNoteTitle.value.trim(),
    quickNoteContent.value.trim(),
    quickNoteColor.value
  )
  quickNoteTitle.value = ''
  quickNoteContent.value = ''
  quickNoteColor.value = 'default'
  isNoteAddExpanded.value = false
}

const noteColorsList: { key: NoteColor; dot: string }[] = [
  { key: 'default', dot: 'bg-lofi-muted' },
  { key: 'amber', dot: 'bg-amber-400' },
  { key: 'emerald', dot: 'bg-emerald-400' },
  { key: 'blue', dot: 'bg-blue-400' },
  { key: 'purple', dot: 'bg-purple-400' },
  { key: 'pink', dot: 'bg-pink-400' }
]

const focusPresets = [25, 45, 60]
const visualizerModes = ['analog_vu', 'frequency_bars', 'circular_pulse', 'pixel_wave'] as const

function cycleVisualizerMode(): void {
  const currentIdx = visualizerModes.indexOf(appStore.visualizerMode as any)
  const nextIdx = (currentIdx + 1) % visualizerModes.length
  appStore.setVisualizerMode(visualizerModes[nextIdx])
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function togglePlayPause(): void {
  if (ytStore.isPlaying) {
    ytStore.togglePlayPause()
  } else if (playerStore.isPlaying) {
    playerStore.togglePlay()
  } else if (appStore.activeTab === 'youtube') {
    ytStore.togglePlayPause()
  } else {
    playerStore.togglePlay()
  }
}

async function handleExpand(): Promise<void> {
  await appStore.exitDockMode()
}

async function handleMinimize(): Promise<void> {
  if (window.api?.minimizeWindow) {
    await window.api.minimizeWindow()
  }
}

async function handleClose(): Promise<void> {
  if (window.api?.closeWindow) {
    await window.api.closeWindow()
  }
}

async function handleTogglePin(): Promise<void> {
  if (window.api?.toggleAlwaysOnTop) {
    isPinned.value = await window.api.toggleAlwaysOnTop()
  }
}

async function handleAddQuickTodo(): Promise<void> {
  if (!quickText.value.trim()) return
  await todoStore.addTodo(quickText.value.trim(), quickPriority.value, quickCategory.value)
  quickText.value = ''
  isAddExpanded.value = false
}

function formatShortDate(timestamp: number): string {
  const d = new Date(timestamp)
  return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
}

onMounted(async () => {
  if (window.api?.getAlwaysOnTop) {
    isPinned.value = await window.api.getAlwaysOnTop()
  }
})
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between bg-lofi-bg text-lofi-text border-l border-lofi-border shadow-2xl relative font-sans overflow-hidden select-none">
    <!-- TOP SECTION: DOCK TITLEBAR (~36px) -->
    <header class="h-9 w-full bg-lofi-surface border-b border-lofi-border flex items-center justify-between px-3 drag-region flex-shrink-0 z-30">
      <div class="flex items-center gap-1.5 no-drag text-xs font-bold text-lofi-text">
        <div class="w-4 h-4 rounded bg-lofi-primary/20 flex items-center justify-center text-lofi-primary">
          <Music class="w-2.5 h-2.5" />
        </div>
        <span class="text-2xs font-bold uppercase tracking-wider text-lofi-primary">Focus Dock</span>
      </div>

      <!-- Window Action Buttons -->
      <div class="flex items-center gap-1 no-drag text-lofi-muted">
        <!-- Pin Always On Top -->
        <button
          @click="handleTogglePin"
          :class="[
            'p-1 rounded hover:text-lofi-text transition-colors',
            isPinned ? 'text-lofi-primary bg-lofi-primary/10' : 'hover:bg-lofi-card'
          ]"
          :title="isPinned ? 'Unpin' : 'Pin Always on Top'"
        >
          <Pin v-if="isPinned" class="w-3 h-3" />
          <PinOff v-else class="w-3 h-3" />
        </button>

        <!-- Expand Back to Normal Window -->
        <button
          @click="handleExpand"
          class="p-1 rounded hover:text-lofi-text hover:bg-lofi-card transition-colors"
          title="Expand to Full Player"
        >
          <Maximize2 class="w-3 h-3 text-lofi-primary" />
        </button>

        <!-- Minimize -->
        <button
          @click="handleMinimize"
          class="p-1 rounded hover:text-lofi-text hover:bg-lofi-card transition-colors"
          title="Minimize"
        >
          <Minus class="w-3 h-3" />
        </button>

        <!-- Close -->
        <button
          @click="handleClose"
          class="p-1 rounded hover:text-white hover:bg-red-500 transition-colors"
          title="Close"
        >
          <X class="w-3 h-3" />
        </button>
      </div>
    </header>

    <!-- MIDDLE SECTION: SCROLLABLE FOCUS STREAM (Flex-1) [Tasks / Notes] -->
    <main class="flex-1 flex flex-col overflow-hidden p-3 min-h-0">
      <!-- Section Header with Mode Switcher [Tasks / Notes] -->
      <div class="flex items-center justify-between pb-2 border-b border-lofi-border/60 flex-shrink-0">
        <div class="flex items-center gap-1 bg-lofi-surface p-0.5 rounded-lg border border-lofi-border">
          <button
            @click="dockTab = 'tasks'"
            :class="[
              'px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer',
              dockTab === 'tasks' ? 'bg-lofi-card text-emerald-400 shadow-xs' : 'text-lofi-muted hover:text-lofi-text'
            ]"
          >
            <CheckSquare class="w-3 h-3" />
            <span>Tasks</span>
            <span class="text-[9px] font-mono opacity-80">({{ todoStore.pendingCount }})</span>
          </button>

          <button
            @click="dockTab = 'notes'"
            :class="[
              'px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer',
              dockTab === 'notes' ? 'bg-lofi-card text-amber-400 shadow-xs' : 'text-lofi-muted hover:text-lofi-text'
            ]"
          >
            <StickyNote class="w-3 h-3" />
            <span>Notes</span>
            <span class="text-[9px] font-mono opacity-80">({{ noteStore.totalCount }})</span>
          </button>
        </div>

        <div class="flex items-center gap-1">
          <!-- Open JSON DB Folder -->
          <button
            @click="dockTab === 'tasks' ? todoStore.openStorageFolder() : noteStore.openStorageFolder()"
            class="p-1 rounded-md text-lofi-muted hover:text-amber-400 hover:bg-lofi-card transition-colors cursor-pointer"
            :title="dockTab === 'tasks' ? 'Open todos.json file location' : 'Open notes.json file location'"
          >
            <FileJson class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- TAB 1: FOCUS TASKS STREAM -->
      <div v-if="dockTab === 'tasks'" class="flex-1 flex flex-col overflow-hidden min-h-0">
        <!-- Quick Add Input -->
        <div class="py-2 flex-shrink-0">
          <form @submit.prevent="handleAddQuickTodo" class="space-y-1.5">
            <div class="flex items-center gap-1">
              <div class="relative flex-1">
                <input
                  type="text"
                  v-model="quickText"
                  @focus="isAddExpanded = true"
                  placeholder="+ Add task (Enter to save)..."
                  class="w-full pl-2.5 pr-2 py-1.5 bg-lofi-surface border border-lofi-border rounded-lg text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-lofi-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                :disabled="!quickText.trim()"
                class="px-2 py-1.5 rounded-lg bg-lofi-primary hover:bg-lofi-primary/90 text-lofi-bg text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex-shrink-0"
              >
                <Plus class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Priority & Category Selector -->
            <div v-if="isAddExpanded || quickText.trim()" class="flex items-center justify-between gap-1 pt-1 text-[10px]">
              <!-- Priority -->
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  @click="quickPriority = 'low'"
                  :class="[
                    'px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors',
                    quickPriority === 'low' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'text-lofi-muted border-lofi-border'
                  ]"
                >
                  🟢 Low
                </button>
                <button
                  type="button"
                  @click="quickPriority = 'medium'"
                  :class="[
                    'px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors',
                    quickPriority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : 'text-lofi-muted border-lofi-border'
                  ]"
                >
                  🟡 Med
                </button>
                <button
                  type="button"
                  @click="quickPriority = 'high'"
                  :class="[
                    'px-1.5 py-0.5 rounded text-[9px] font-bold border transition-colors',
                    quickPriority === 'high' ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'text-lofi-muted border-lofi-border'
                  ]"
                >
                  🔴 High
                </button>
              </div>

              <!-- Category -->
              <select
                v-model="quickCategory"
                class="px-1.5 py-0.5 rounded bg-lofi-surface border border-lofi-border text-[9px] text-lofi-text focus:outline-none"
              >
                <option value="work">💼 Work</option>
                <option value="study">📚 Study</option>
                <option value="personal">🌿 Personal</option>
                <option value="chill">☕ Chill</option>
              </select>
            </div>
          </form>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center justify-between pb-1.5 flex-shrink-0 text-[10px]">
          <div class="flex items-center gap-1 bg-lofi-surface p-0.5 rounded-lg border border-lofi-border">
            <button
              @click="todoStore.filter = 'all'"
              :class="[
                'px-2 py-0.5 rounded text-[9px] font-semibold transition-colors',
                todoStore.filter === 'all' ? 'bg-lofi-card text-lofi-primary font-bold' : 'text-lofi-muted hover:text-lofi-text'
              ]"
            >
              All ({{ todoStore.totalCount }})
            </button>
            <button
              @click="todoStore.filter = 'active'"
              :class="[
                'px-2 py-0.5 rounded text-[9px] font-semibold transition-colors',
                todoStore.filter === 'active' ? 'bg-lofi-card text-lofi-primary font-bold' : 'text-lofi-muted hover:text-lofi-text'
              ]"
            >
              Active ({{ todoStore.pendingCount }})
            </button>
            <button
              @click="todoStore.filter = 'completed'"
              :class="[
                'px-2 py-0.5 rounded text-[9px] font-semibold transition-colors',
                todoStore.filter === 'completed' ? 'bg-lofi-card text-lofi-primary font-bold' : 'text-lofi-muted hover:text-lofi-text'
              ]"
            >
              Done ({{ todoStore.completedCount }})
            </button>
          </div>

          <button
            v-if="todoStore.completedCount > 0 && todoStore.filter === 'completed'"
            @click="todoStore.clearCompleted"
            class="text-[9px] text-red-400 hover:text-red-300 font-semibold"
          >
            Clear
          </button>
        </div>

        <!-- Scrollable Task Cards List -->
        <div class="flex-1 overflow-y-auto space-y-1.5 pr-0.5 min-h-0">
          <div
            v-for="item in todoStore.filteredTodos"
            :key="item.id"
            :class="[
              'p-2 rounded-xl border transition-all flex items-start gap-2 group',
              item.completed
                ? 'bg-lofi-surface/40 border-lofi-border/40 opacity-70'
                : item.priority === 'high'
                ? 'bg-lofi-surface/90 border-red-500/30'
                : 'bg-lofi-surface/90 border-lofi-border/70 hover:border-lofi-primary/50'
            ]"
          >
            <!-- Checkbox Toggle -->
            <button
              @click="todoStore.toggleTodo(item.id)"
              :class="[
                'w-4 h-4 rounded-md flex items-center justify-center border transition-all flex-shrink-0 mt-0.5 cursor-pointer',
                item.completed
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-lofi-border hover:border-lofi-primary bg-lofi-card'
              ]"
            >
              <Check v-if="item.completed" class="w-3 h-3 stroke-[3]" />
            </button>

            <!-- Content Details -->
            <div class="min-w-0 flex-1">
              <p
                :class="[
                  'text-xs font-medium text-lofi-text break-words leading-tight',
                  item.completed ? 'line-through text-lofi-muted' : ''
                ]"
              >
                {{ item.text }}
              </p>

              <div class="flex items-center gap-1.5 mt-1 text-[9px] text-lofi-muted flex-wrap">
                <!-- Priority Indicator -->
                <span
                  v-if="item.priority === 'high'"
                  class="px-1 py-0.2 rounded bg-red-500/15 text-red-300 font-bold border border-red-500/30"
                >
                  🔴 High
                </span>
                <span
                  v-else-if="item.priority === 'low'"
                  class="px-1 py-0.2 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                >
                  🟢 Low
                </span>

                <!-- Category Badge -->
                <span class="px-1 py-0.2 rounded bg-lofi-card border border-lofi-border">
                  {{ item.category === 'work' ? '💼 Work' : item.category === 'study' ? '📚 Study' : item.category === 'personal' ? '🌿 Personal' : '☕ Chill' }}
                </span>

                <!-- Created or Completed time -->
                <span>{{ formatShortDate(item.createdAt) }}</span>
              </div>
            </div>

            <!-- Delete Task Action Button -->
            <button
              @click="todoStore.deleteTodo(item.id)"
              class="opacity-0 group-hover:opacity-100 p-1 text-lofi-muted hover:text-red-400 transition-opacity flex-shrink-0"
              title="Delete task"
            >
              <Trash2 class="w-3 h-3" />
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-if="todoStore.filteredTodos.length === 0"
            class="py-8 px-2 text-center text-lofi-muted flex flex-col items-center justify-center gap-1 border border-dashed border-lofi-border/60 rounded-xl"
          >
            <Sparkles class="w-5 h-5 text-lofi-primary/60 mb-1" />
            <p class="text-xs font-semibold text-lofi-text">No tasks found</p>
            <p class="text-[10px] text-lofi-muted">Add a quick focus task above</p>
          </div>
        </div>
      </div>

      <!-- TAB 2: QUICK NOTES STREAM -->
      <div v-else-if="dockTab === 'notes'" class="flex-1 flex flex-col overflow-hidden min-h-0">
        <!-- Quick Add Note Input -->
        <div class="py-2 flex-shrink-0">
          <form @submit.prevent="handleAddQuickNote" class="space-y-1.5">
            <div class="flex items-center gap-1">
              <div class="relative flex-1">
                <input
                  type="text"
                  v-model="quickNoteTitle"
                  @focus="isNoteAddExpanded = true"
                  placeholder="+ Take quick note..."
                  class="w-full pl-2.5 pr-2 py-1.5 bg-lofi-surface border border-lofi-border rounded-lg text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                :disabled="!quickNoteTitle.trim() && !quickNoteContent.trim()"
                class="px-2 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-lofi-bg text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex-shrink-0"
              >
                <Plus class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Content Area & Color Dots -->
            <div v-if="isNoteAddExpanded || quickNoteTitle.trim() || quickNoteContent.trim()" class="space-y-1.5 pt-1">
              <textarea
                v-model="quickNoteContent"
                rows="2"
                placeholder="Note details..."
                class="w-full px-2 py-1.5 bg-lofi-surface border border-lofi-border rounded-lg text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-amber-400 resize-y min-h-[50px]"
              ></textarea>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <button
                    v-for="c in noteColorsList"
                    :key="c.key"
                    type="button"
                    @click="quickNoteColor = c.key"
                    :class="[
                      'w-3.5 h-3.5 rounded-full transition-transform cursor-pointer',
                      c.dot,
                      quickNoteColor === c.key ? 'scale-125 ring-2 ring-white/80' : 'hover:scale-110 opacity-70'
                    ]"
                  ></button>
                </div>

                <button
                  type="button"
                  @click="isNoteAddExpanded = false"
                  class="text-[9px] text-lofi-muted hover:text-lofi-text cursor-pointer"
                >
                  Collapse
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Scrollable Notes List -->
        <div class="flex-1 overflow-y-auto space-y-1.5 pr-0.5 min-h-0">
          <div
            v-for="note in noteStore.filteredNotes"
            :key="note.id"
            :class="[
              'p-2 rounded-xl border transition-all flex flex-col justify-between group relative overflow-hidden',
              note.color === 'amber' ? 'bg-amber-500/10 border-amber-500/30' :
              note.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' :
              note.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30' :
              note.color === 'purple' ? 'bg-purple-500/10 border-purple-500/30' :
              note.color === 'pink' ? 'bg-pink-500/10 border-pink-500/30' :
              'bg-lofi-surface/90 border-lofi-border/70',
              note.pinned ? 'ring-1 ring-amber-400/40' : ''
            ]"
          >
            <div class="flex items-start justify-between gap-1.5">
              <h4 class="text-xs font-bold text-lofi-text truncate flex-1">
                {{ note.title }}
              </h4>

              <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <!-- Pin Toggle -->
                <button
                  @click="noteStore.togglePin(note.id)"
                  :class="[
                    'p-1 rounded text-lofi-muted transition-colors cursor-pointer',
                    note.pinned ? 'text-amber-400' : 'hover:text-amber-400'
                  ]"
                >
                  <Pin class="w-3 h-3" />
                </button>

                <!-- Delete -->
                <button
                  @click="noteStore.deleteNote(note.id)"
                  class="p-1 rounded text-lofi-muted hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 class="w-3 h-3" />
                </button>
              </div>
            </div>

            <p v-if="note.content" class="text-[11px] text-lofi-muted line-clamp-2 mt-1 leading-tight whitespace-pre-wrap">
              {{ note.content }}
            </p>

            <div class="pt-1.5 mt-1 border-t border-lofi-border/30 flex items-center justify-between text-[9px] text-lofi-muted font-mono">
              <span>{{ formatShortDate(note.createdAt) }}</span>
              <span v-if="note.pinned" class="text-amber-400 font-bold">PINNED</span>
            </div>
          </div>

          <!-- Empty Notes State -->
          <div
            v-if="noteStore.filteredNotes.length === 0"
            class="py-8 px-2 text-center text-lofi-muted flex flex-col items-center justify-center gap-1 border border-dashed border-lofi-border/60 rounded-xl"
          >
            <Sparkles class="w-5 h-5 text-amber-400 mb-1" />
            <p class="text-xs font-semibold text-lofi-text">No notes recorded</p>
            <p class="text-[10px] text-lofi-muted">Write a quick note or memo above</p>
          </div>
        </div>
      </div>
    </main>

    <!-- BOTTOM SECTION: QUAD-VIEW MINI-PLAYER WIDGET (~230px FIXED) -->
    <footer class="w-full bg-lofi-surface/95 border-t border-lofi-border p-2.5 flex flex-col justify-between flex-shrink-0 z-30 shadow-inner">
      <!-- 4-Mode View Switcher Header -->
      <div class="flex items-center justify-between pb-2 mb-1 border-b border-lofi-border/50">
        <div class="flex items-center gap-0.5 bg-lofi-card p-0.5 rounded-lg border border-lofi-border w-full justify-between">
          <!-- 1. Music View -->
          <button
            @click="appStore.setDockMiniPlayerView('music')"
            :class="[
              'flex-1 px-1.5 py-0.5 rounded text-[9px] font-semibold flex items-center justify-center gap-1 transition-all',
              appStore.dockMiniPlayerView === 'music'
                ? 'bg-lofi-primary text-lofi-bg shadow-sm font-bold'
                : 'text-lofi-muted hover:text-lofi-text'
            ]"
            title="Track View"
          >
            <Music class="w-2.5 h-2.5" />
            <span>Track</span>
          </button>

          <!-- 2. VU Visualizer View -->
          <button
            @click="appStore.setDockMiniPlayerView('vu')"
            :class="[
              'flex-1 px-1.5 py-0.5 rounded text-[9px] font-semibold flex items-center justify-center gap-1 transition-all',
              appStore.dockMiniPlayerView === 'vu'
                ? 'bg-lofi-primary text-lofi-bg shadow-sm font-bold'
                : 'text-lofi-muted hover:text-lofi-text'
            ]"
            title="VU Visualizer View"
          >
            <Radio class="w-2.5 h-2.5" />
            <span>VU</span>
          </button>

          <!-- 3. Timer View -->
          <button
            @click="appStore.setDockMiniPlayerView('timer')"
            :class="[
              'flex-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold flex items-center justify-center gap-1 transition-all',
              appStore.dockMiniPlayerView === 'timer'
                ? 'bg-lofi-primary text-lofi-bg shadow-sm font-bold'
                : timerStore.isPomodoroRunning
                ? 'text-lofi-primary animate-pulse'
                : timerStore.isSleepTimerActive
                ? 'text-lofi-purple animate-pulse'
                : 'text-lofi-muted hover:text-lofi-text'
            ]"
            title="Focus Timer Widget"
          >
            <Clock class="w-2.5 h-2.5" />
            <span v-if="timerStore.isPomodoroRunning">{{ formatTime(timerStore.pomodoroSecondsLeft) }}</span>
            <span v-else-if="timerStore.isSleepTimerActive">{{ formatTime(timerStore.sleepSecondsLeft) }}</span>
            <span v-else>Timer</span>
          </button>

          <!-- 4. Video View -->
          <button
            @click="appStore.setDockMiniPlayerView('video')"
            :class="[
              'flex-1 px-1.5 py-0.5 rounded text-[9px] font-semibold flex items-center justify-center gap-1 transition-all',
              appStore.dockMiniPlayerView === 'video'
                ? 'bg-lofi-pink text-lofi-bg shadow-sm font-bold'
                : ytStore.isPlaying
                ? 'text-lofi-pink font-medium'
                : 'text-lofi-muted hover:text-lofi-text'
            ]"
            title="YouTube Live Stream View"
          >
            <Tv class="w-2.5 h-2.5" />
            <span>Video</span>
          </button>
        </div>
      </div>

      <!-- VIEW 1: TRACK VIEW -->
      <div v-if="appStore.dockMiniPlayerView === 'music'" class="space-y-2 py-0.5">
        <div class="flex items-center gap-2.5">
          <!-- Thumbnail / Cover Art -->
          <div class="relative w-12 h-12 rounded-xl overflow-hidden bg-lofi-card border border-lofi-border flex-shrink-0 flex items-center justify-center shadow-md">
            <img
              v-if="(ytStore.isPlaying || appStore.activeTab === 'youtube') && ytStore.currentVideoId"
              :src="youtubeService.getThumbnailUrl(ytStore.currentVideoId)"
              alt="YouTube Thumb"
              class="w-full h-full object-cover"
            />
            <img
              v-else-if="playerStore.currentTrack?.coverUrl"
              :src="playerStore.currentTrack.coverUrl"
              alt="Cover"
              :class="['w-full h-full object-cover', playerStore.isPlaying ? 'animate-pulse' : '']"
            />
            <Music v-else class="w-5 h-5 text-lofi-primary opacity-60" />
          </div>

          <!-- Track Info -->
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold text-lofi-text truncate">
              {{ (ytStore.isPlaying || appStore.activeTab === 'youtube') ? ytStore.currentTitle : (playerStore.currentTrack?.title || 'Ready to play') }}
            </p>
            <p class="text-[10px] text-lofi-muted truncate mt-0.5">
              {{ (ytStore.isPlaying || appStore.activeTab === 'youtube') ? ytStore.currentChannel : (playerStore.currentTrack?.artist || 'Lofi Chillout') }}
            </p>

            <!-- Progress Bar -->
            <div class="mt-1 flex items-center gap-1.5 text-[9px] text-lofi-muted font-mono">
              <span>{{ formatTime(playerStore.currentTime) }}</span>
              <div class="flex-1 h-1 bg-lofi-card rounded-full overflow-hidden">
                <div
                  class="h-full bg-lofi-primary rounded-full transition-all duration-300"
                  :style="{ width: `${playerStore.duration ? (playerStore.currentTime / playerStore.duration) * 100 : 0}%` }"
                ></div>
              </div>
              <span>{{ formatTime(playerStore.duration) }}</span>
            </div>
          </div>
        </div>

        <!-- Controls & Volume -->
        <div class="flex items-center justify-between pt-1 border-t border-lofi-border/50">
          <div class="flex items-center gap-1.5">
            <button
              @click="playerStore.prevTrack"
              class="p-1 text-lofi-muted hover:text-lofi-text transition-colors"
            >
              <SkipBack class="w-3.5 h-3.5" />
            </button>

            <button
              @click="togglePlayPause"
              class="w-7 h-7 rounded-full bg-lofi-primary text-lofi-bg flex items-center justify-center hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              <Pause v-if="playerStore.isPlaying || ytStore.isPlaying" class="w-3 h-3 fill-current" />
              <Play v-else class="w-3 h-3 fill-current ml-0.5" />
            </button>

            <button
              @click="playerStore.nextTrack"
              class="p-1 text-lofi-muted hover:text-lofi-text transition-colors"
            >
              <SkipForward class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Volume -->
          <div class="flex items-center gap-1">
            <button
              @click="playerStore.toggleMute"
              :class="[
                'p-1 transition-colors',
                playerStore.isMuted ? 'text-red-400' : 'text-lofi-muted hover:text-lofi-text'
              ]"
            >
              <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-3 h-3" />
              <Volume2 v-else class="w-3 h-3" />
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="playerStore.isMuted ? 0 : playerStore.volume"
              @input="(e) => playerStore.setVolume(Number((e.target as HTMLInputElement).value))"
              class="w-14 h-1 bg-lofi-card rounded-full appearance-none cursor-pointer accent-lofi-primary"
            />
          </div>
        </div>
      </div>

      <!-- VIEW 2: VU VISUALIZER VIEW -->
      <div v-else-if="appStore.dockMiniPlayerView === 'vu'" class="space-y-1.5 py-0.5">
        <!-- Visualizer Box -->
        <div class="w-full h-24 bg-lofi-card/70 rounded-xl border border-lofi-border/70 relative overflow-hidden flex items-center justify-center">
          <AnalogVuMeter v-if="appStore.visualizerMode === 'analog_vu'" :sensitivity="1.2" />
          <FrequencyBars v-else-if="appStore.visualizerMode === 'frequency_bars'" :sensitivity="1.2" />
          <CircularPulse v-else-if="appStore.visualizerMode === 'circular_pulse'" :sensitivity="1.2" />
          <PixelWave v-else-if="appStore.visualizerMode === 'pixel_wave'" :sensitivity="1.2" />

          <!-- Style Switcher Pill -->
          <div class="absolute top-1 right-1 flex items-center bg-lofi-bg/85 backdrop-blur-sm px-1.5 py-0.5 rounded-md border border-lofi-border/70 z-20 shadow-sm">
            <button
              @click="cycleVisualizerMode"
              class="text-[8px] font-bold text-lofi-primary hover:text-lofi-text flex items-center gap-1 transition-colors"
            >
              <Radio class="w-2 h-2" />
              <span class="capitalize">{{ appStore.visualizerMode.replace('_', ' ') }}</span>
            </button>
          </div>
        </div>

        <!-- Mini Audio Control Strip -->
        <div class="flex items-center justify-between text-[9px] pt-0.5">
          <div class="flex items-center gap-1.5 truncate flex-1 mr-2">
            <button
              @click="togglePlayPause"
              class="w-5 h-5 rounded-full bg-lofi-primary text-lofi-bg flex items-center justify-center hover:opacity-90 active:scale-95 flex-shrink-0 shadow-sm"
            >
              <Pause v-if="playerStore.isPlaying || ytStore.isPlaying" class="w-2.5 h-2.5 fill-current" />
              <Play v-else class="w-2.5 h-2.5 fill-current ml-0.2" />
            </button>
            <span class="truncate text-lofi-text font-medium">
              {{ (ytStore.isPlaying || appStore.activeTab === 'youtube') ? ytStore.currentTitle : (playerStore.currentTrack ? playerStore.currentTrack.title : 'Ready to play') }}
            </span>
          </div>

          <div class="flex items-center gap-1 flex-shrink-0">
            <button @click="playerStore.toggleMute" class="text-lofi-muted hover:text-lofi-text">
              <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-3 h-3 text-red-400" />
              <Volume2 v-else class="w-3 h-3" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="playerStore.isMuted ? 0 : playerStore.volume"
              @input="(e) => playerStore.setVolume(Number((e.target as HTMLInputElement).value))"
              class="w-12 h-1 bg-lofi-card rounded-full appearance-none cursor-pointer accent-lofi-primary"
            />
          </div>
        </div>
      </div>

      <!-- VIEW 3: FOCUS TIMER VIEW -->
      <div v-else-if="appStore.dockMiniPlayerView === 'timer'" class="space-y-1 py-0.5">
        <!-- Duration Presets & Sessions -->
        <div class="flex items-center justify-between px-0.5 text-[9px]">
          <div class="flex items-center gap-1">
            <button
              v-for="mins in focusPresets"
              :key="mins"
              @click="timerStore.setFocusMinutes(mins)"
              :class="[
                'px-1.5 py-0.5 rounded text-[9px] font-bold transition-all',
                timerStore.focusMinutes === mins
                  ? 'bg-lofi-primary text-lofi-bg shadow-sm'
                  : 'bg-lofi-card text-lofi-muted hover:text-lofi-text border border-lofi-border'
              ]"
            >
              {{ mins }}m
            </button>
          </div>

          <div class="text-[9px] text-lofi-muted font-mono flex items-center gap-1">
            <span>Done:</span>
            <span class="text-lofi-primary font-bold">{{ timerStore.completedSessions }}</span>
          </div>
        </div>

        <!-- Big Countdown Digits & Controls -->
        <div class="flex items-center justify-around py-0.5">
          <button
            @click="timerStore.resetPomodoro"
            class="p-1.5 rounded-full bg-lofi-card border border-lofi-border text-lofi-muted hover:text-lofi-text transition-colors shadow-sm"
            title="Reset Timer"
          >
            <RotateCcw class="w-3 h-3" />
          </button>

          <div class="flex flex-col items-center">
            <span class="text-2xl font-extrabold font-mono tracking-tight text-lofi-text">
              {{ formatTime(timerStore.pomodoroSecondsLeft) }}
            </span>
            <span class="text-[8px] text-lofi-muted uppercase tracking-widest">
              {{ timerStore.pomodoroMode === 'focus' ? `Focus (${timerStore.focusMinutes}m)` : 'Break' }}
            </span>
          </div>

          <button
            @click="timerStore.isPomodoroRunning ? timerStore.pausePomodoro() : timerStore.startPomodoro()"
            class="w-8 h-8 rounded-xl bg-lofi-primary text-lofi-bg flex items-center justify-center font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
          >
            <Pause v-if="timerStore.isPomodoroRunning" class="w-3.5 h-3.5 fill-current" />
            <Play v-else class="w-3.5 h-3.5 fill-current ml-0.5" />
          </button>
        </div>

        <!-- Bottom Audio Strip -->
        <div class="flex items-center justify-between text-[9px] pt-0.5 border-t border-lofi-border/50">
          <div class="flex items-center gap-1.5 truncate flex-1 mr-2">
            <button
              @click="togglePlayPause"
              class="w-4 h-4 rounded-full bg-lofi-card border border-lofi-border flex items-center justify-center text-lofi-text hover:text-lofi-primary flex-shrink-0"
            >
              <Pause v-if="playerStore.isPlaying || ytStore.isPlaying" class="w-2 h-2 fill-current" />
              <Play v-else class="w-2 h-2 fill-current ml-0.2" />
            </button>
            <span class="truncate text-lofi-muted">
              {{ (ytStore.isPlaying || appStore.activeTab === 'youtube') ? ytStore.currentTitle : (playerStore.currentTrack ? playerStore.currentTrack.title : 'Ready') }}
            </span>
          </div>

          <div class="flex items-center gap-1 flex-shrink-0">
            <button @click="playerStore.toggleMute" class="text-lofi-muted hover:text-lofi-text">
              <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-3 h-3 text-red-400" />
              <Volume2 v-else class="w-3 h-3" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="playerStore.isMuted ? 0 : playerStore.volume"
              @input="(e) => playerStore.setVolume(Number((e.target as HTMLInputElement).value))"
              class="w-12 h-1 bg-lofi-card rounded-full appearance-none cursor-pointer accent-lofi-primary"
            />
          </div>
        </div>
      </div>

      <!-- VIEW 4: LIVE YOUTUBE VIDEO VIEW -->
      <div v-else-if="appStore.dockMiniPlayerView === 'video'" class="flex flex-col justify-between h-28 relative rounded-xl overflow-hidden bg-black/60 border border-lofi-border/70 p-1.5">
        <!-- Floating Live Badge & Title -->
        <div class="flex items-center gap-1.5 z-20 pointer-events-none">
          <span class="px-1 py-0.2 rounded bg-red-600/90 text-white font-bold text-[7px] uppercase tracking-wider shadow-sm flex items-center gap-1">
            <span class="w-1 h-1 rounded-full bg-white animate-ping"></span>
            LIVE
          </span>
          <span class="text-[9px] font-semibold text-white drop-shadow-md truncate max-w-[200px]">
            {{ ytStore.currentTitle || 'YouTube Stream' }}
          </span>
        </div>

        <!-- Floating Ghost Timer Overlay -->
        <div
          v-if="timerStore.isPomodoroRunning || timerStore.isSleepTimerActive"
          class="absolute inset-0 flex items-center justify-center pointer-events-none z-15 select-none"
        >
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 backdrop-blur-[2px] border border-white/10 shadow-xl">
            <Target v-if="timerStore.isPomodoroRunning" class="w-3 h-3 text-lofi-pink/80 animate-pulse" />
            <Moon v-else-if="timerStore.isSleepTimerActive" class="w-3 h-3 text-lofi-purple/80 animate-pulse" />
            <span class="font-mono text-base font-bold tracking-wider text-white/70 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {{ timerStore.isPomodoroRunning ? formatTime(timerStore.pomodoroSecondsLeft) : formatTime(timerStore.sleepSecondsLeft) }}
            </span>
          </div>
        </div>

        <!-- Transparent Middle Frame Space for Adaptive Video Mount -->
        <div class="flex-1 w-full"></div>

        <!-- Bottom Minimal HUD -->
        <div class="flex items-center justify-between p-1 bg-black/70 backdrop-blur-md rounded-lg border border-white/10 text-[9px] z-20 shadow-md">
          <div class="flex items-center gap-1.5 truncate flex-1 mr-2">
            <button
              @click="togglePlayPause"
              class="w-4 h-4 rounded-full bg-lofi-pink text-lofi-bg flex items-center justify-center hover:opacity-90 active:scale-95 flex-shrink-0 shadow-sm"
            >
              <Pause v-if="ytStore.isPlaying" class="w-2 h-2 fill-current" />
              <Play v-else class="w-2 h-2 fill-current ml-0.2" />
            </button>
            <span class="truncate text-white/90 font-medium">
              {{ ytStore.currentChannel || 'YouTube Live' }}
            </span>
          </div>

          <div class="flex items-center gap-1 flex-shrink-0">
            <button @click="playerStore.toggleMute" class="text-white/80 hover:text-white">
              <VolumeX v-if="playerStore.isMuted || playerStore.volume === 0" class="w-3 h-3 text-red-400" />
              <Volume2 v-else class="w-3 h-3" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              :value="playerStore.isMuted ? 0 : playerStore.volume"
              @input="(e) => playerStore.setVolume(Number((e.target as HTMLInputElement).value))"
              class="w-12 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-lofi-pink"
            />
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.drag-region {
  -webkit-app-region: drag;
}
.no-drag {
  -webkit-app-region: no-drag;
}
.text-2xs {
  font-size: 0.68rem;
}
</style>