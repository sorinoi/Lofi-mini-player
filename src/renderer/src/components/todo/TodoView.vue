<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  CheckSquare,
  Plus,
  Search,
  Folder,
  Trash2,
  Filter,
  Flame,
  CheckCircle,
  Clock,
  BookOpen,
  Briefcase,
  User,
  Coffee,
  Sparkles,
  ArrowUpDown,
  FileJson,
  PanelRight
} from 'lucide-vue-next'
import { useTodoStore } from '../../stores/todo'
import { useAppStore } from '../../stores/app'
import type { TodoPriority, TodoCategory } from '../../types/todo'
import TodoItemCard from './TodoItemCard.vue'

const todoStore = useTodoStore()
const appStore = useAppStore()

const newText = ref('')
const newPriority = ref<TodoPriority>('medium')
const newCategory = ref<TodoCategory>('work')
const newNotes = ref('')
const isExpandedInput = ref(false)

async function handleAddTodo(): Promise<void> {
  if (!newText.value.trim()) return
  await todoStore.addTodo(
    newText.value.trim(),
    newPriority.value,
    newCategory.value,
    newNotes.value.trim()
  )
  newText.value = ''
  newNotes.value = ''
  isExpandedInput.value = false
}

async function handleDockSidebar(): Promise<void> {
  await appStore.enterDockMode()
}

onMounted(() => {
  todoStore.initTodos()
})
</script>

<template>
  <div class="w-full h-full flex flex-col p-6 overflow-y-auto max-w-6xl mx-auto space-y-6 select-none">
    <!-- Header Section (Title, Subtitle & Action Buttons) -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-lofi-text flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-lofi-primary/20 flex items-center justify-center text-lofi-primary shadow-sm">
            <CheckSquare class="w-5 h-5" />
          </div>
          <span>Focus Tasks & To-Do</span>
        </h2>
        <p class="text-xs text-lofi-muted mt-1">
          Organize your goals, study sessions, and daily routines while relaxing to lofi music
        </p>
      </div>

      <!-- Action Buttons: Dock Sidebar & Open JSON Database Folder -->
      <div class="flex items-center gap-2">
        <button
          @click="handleDockSidebar"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-all shadow-sm active:scale-95 cursor-pointer group"
          title="Dock tasks to the right side of the screen (Alt+D)"
        >
          <PanelRight class="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span>Dock to Right Side</span>
        </button>

        <button
          @click="todoStore.openStorageFolder"
          class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lofi-surface/80 hover:bg-lofi-card text-lofi-text text-xs font-semibold border border-lofi-border transition-all shadow-sm active:scale-95 cursor-pointer group"
          title="Open todos.json file location on disk for backup or manual editing"
        >
          <FileJson class="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Open JSON File</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <!-- Total Tasks Card -->
      <div class="p-3.5 rounded-2xl bg-lofi-surface/60 border border-lofi-border/70 flex items-center gap-3 backdrop-blur-xs">
        <div class="w-9 h-9 rounded-xl bg-lofi-card flex items-center justify-center text-lofi-text border border-lofi-border/50 flex-shrink-0">
          <CheckSquare class="w-4.5 h-4.5 text-lofi-primary" />
        </div>
        <div>
          <p class="text-2xs text-lofi-muted uppercase font-bold tracking-wider">Total Tasks</p>
          <p class="text-lg font-bold text-lofi-text">{{ todoStore.totalCount }}</p>
        </div>
      </div>

      <!-- Pending Tasks Card -->
      <div class="p-3.5 rounded-2xl bg-lofi-surface/60 border border-lofi-border/70 flex items-center gap-3 backdrop-blur-xs">
        <div class="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20 flex-shrink-0">
          <Clock class="w-4.5 h-4.5 animate-pulse" />
        </div>
        <div>
          <p class="text-2xs text-lofi-muted uppercase font-bold tracking-wider">In Progress</p>
          <p class="text-lg font-bold text-amber-400">{{ todoStore.pendingCount }}</p>
        </div>
      </div>

      <!-- Completed Tasks Card -->
      <div class="p-3.5 rounded-2xl bg-lofi-surface/60 border border-lofi-border/70 flex items-center gap-3 backdrop-blur-xs">
        <div class="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 flex-shrink-0">
          <CheckCircle class="w-4.5 h-4.5" />
        </div>
        <div>
          <p class="text-2xs text-lofi-muted uppercase font-bold tracking-wider">Completed</p>
          <p class="text-lg font-bold text-emerald-400">{{ todoStore.completedCount }}</p>
        </div>
      </div>

      <!-- Completion Rate Card -->
      <div class="p-3.5 rounded-2xl bg-lofi-surface/60 border border-lofi-border/70 flex flex-col justify-between backdrop-blur-xs">
        <div class="flex items-center justify-between">
          <span class="text-2xs text-lofi-muted uppercase font-bold tracking-wider">Progress</span>
          <span class="text-xs font-bold text-lofi-primary">{{ todoStore.completionRate }}%</span>
        </div>
        <div class="w-full h-2 rounded-full bg-lofi-card border border-lofi-border/50 overflow-hidden mt-2">
          <div
            class="h-full bg-gradient-to-r from-lofi-primary to-emerald-400 transition-all duration-500 rounded-full"
            :style="{ width: `${todoStore.completionRate}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Quick Add Task Input Card -->
    <div class="p-4 rounded-2xl bg-lofi-surface/90 border border-lofi-border shadow-xl backdrop-blur-md space-y-3">
      <form @submit.prevent="handleAddTodo" class="space-y-3">
        <!-- Main Title Input Bar -->
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <Plus class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-lofi-primary" />
            <input
              type="text"
              v-model="newText"
              @focus="isExpandedInput = true"
              placeholder="Add a new focus task (e.g. Study 30 mins, Write notes)..."
              class="w-full pl-10 pr-4 py-2.5 bg-lofi-card/80 border border-lofi-border rounded-xl text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-lofi-primary transition-all"
            />
          </div>
          <button
            type="submit"
            :disabled="!newText.trim()"
            class="px-4 py-2.5 rounded-xl bg-lofi-primary hover:bg-lofi-primary/90 text-lofi-bg text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus class="w-4 h-4 stroke-[2.5]" />
            <span>Add Task</span>
          </button>
        </div>

        <!-- Expanded Options (Priority, Category & Notes) -->
        <div v-if="isExpandedInput || newText.trim()" class="pt-2 border-t border-lofi-border/50 flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <!-- Priority Selector Pills -->
          <div class="flex items-center gap-1.5">
            <span class="text-2xs font-semibold text-lofi-muted uppercase mr-1">Priority:</span>
            <button
              type="button"
              @click="newPriority = 'low'"
              :class="[
                'px-2.5 py-1 rounded-lg text-2xs font-semibold border transition-all cursor-pointer',
                newPriority === 'low'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
              ]"
            >
              🟢 Low
            </button>
            <button
              type="button"
              @click="newPriority = 'medium'"
              :class="[
                'px-2.5 py-1 rounded-lg text-2xs font-semibold border transition-all cursor-pointer',
                newPriority === 'medium'
                  ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                  : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
              ]"
            >
              🟡 Medium
            </button>
            <button
              type="button"
              @click="newPriority = 'high'"
              :class="[
                'px-2.5 py-1 rounded-lg text-2xs font-semibold border transition-all cursor-pointer',
                newPriority === 'high'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
              ]"
            >
              🔴 High
            </button>
          </div>

          <!-- Category Selector Pills -->
          <div class="flex items-center gap-1.5">
            <span class="text-2xs font-semibold text-lofi-muted uppercase mr-1">Category:</span>
            <button
              type="button"
              @click="newCategory = 'work'"
              :class="[
                'px-2.5 py-1 rounded-lg text-2xs font-semibold border transition-all cursor-pointer flex items-center gap-1',
                newCategory === 'work'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
              ]"
            >
              <Briefcase class="w-3 h-3" />
              <span>Work</span>
            </button>
            <button
              type="button"
              @click="newCategory = 'study'"
              :class="[
                'px-2.5 py-1 rounded-lg text-2xs font-semibold border transition-all cursor-pointer flex items-center gap-1',
                newCategory === 'study'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
              ]"
            >
              <BookOpen class="w-3 h-3" />
              <span>Study</span>
            </button>
            <button
              type="button"
              @click="newCategory = 'personal'"
              :class="[
                'px-2.5 py-1 rounded-lg text-2xs font-semibold border transition-all cursor-pointer flex items-center gap-1',
                newCategory === 'personal'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
              ]"
            >
              <User class="w-3 h-3" />
              <span>Personal</span>
            </button>
            <button
              type="button"
              @click="newCategory = 'chill'"
              :class="[
                'px-2.5 py-1 rounded-lg text-2xs font-semibold border transition-all cursor-pointer flex items-center gap-1',
                newCategory === 'chill'
                  ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                  : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
              ]"
            >
              <Coffee class="w-3 h-3" />
              <span>Chill</span>
            </button>
          </div>
        </div>

        <!-- Optional Extra Notes Input -->
        <div v-if="isExpandedInput || newNotes.trim()" class="animate-fadeIn">
          <input
            type="text"
            v-model="newNotes"
            placeholder="Add optional notes, link, or sub-details..."
            class="w-full px-3 py-1.5 bg-lofi-card/50 border border-lofi-border/70 rounded-xl text-2xs text-lofi-text placeholder-lofi-muted/60 focus:outline-none focus:border-lofi-primary/50"
          />
        </div>
      </form>
    </div>

    <!-- Filter Toolbar & Search Bar -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-2">
      <!-- Status Filter Tabs (All, Active, Completed) -->
      <div class="flex items-center p-1 rounded-xl bg-lofi-surface border border-lofi-border">
        <button
          @click="todoStore.filter = 'all'"
          :class="[
            'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            todoStore.filter === 'all'
              ? 'bg-lofi-card text-lofi-primary shadow-xs border border-lofi-border'
              : 'text-lofi-muted hover:text-lofi-text'
          ]"
        >
          All ({{ todoStore.totalCount }})
        </button>
        <button
          @click="todoStore.filter = 'active'"
          :class="[
            'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            todoStore.filter === 'active'
              ? 'bg-lofi-card text-lofi-primary shadow-xs border border-lofi-border'
              : 'text-lofi-muted hover:text-lofi-text'
          ]"
        >
          Active ({{ todoStore.pendingCount }})
        </button>
        <button
          @click="todoStore.filter = 'completed'"
          :class="[
            'px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer',
            todoStore.filter === 'completed'
              ? 'bg-lofi-card text-lofi-primary shadow-xs border border-lofi-border'
              : 'text-lofi-muted hover:text-lofi-text'
          ]"
        >
          Completed ({{ todoStore.completedCount }})
        </button>
      </div>

      <!-- Right Controls: Category Filter, Sort & Search -->
      <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <!-- Category Dropdown Filter -->
        <select
          v-model="todoStore.selectedCategory"
          class="px-3 py-1.5 rounded-xl bg-lofi-surface border border-lofi-border text-xs text-lofi-text focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="work">💼 Work</option>
          <option value="study">📚 Study</option>
          <option value="personal">🌿 Personal</option>
          <option value="chill">☕ Chill</option>
        </select>

        <!-- Sort By Dropdown -->
        <select
          v-model="todoStore.sortBy"
          class="px-3 py-1.5 rounded-xl bg-lofi-surface border border-lofi-border text-xs text-lofi-text focus:outline-none cursor-pointer"
        >
          <option value="newest">🕒 Newest First</option>
          <option value="oldest">⏳ Oldest First</option>
          <option value="priority">🔥 High Priority</option>
        </select>

        <!-- Search Input Bar -->
        <div class="relative min-w-[160px] flex-1 sm:flex-initial">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-lofi-muted" />
          <input
            type="text"
            v-model="todoStore.searchQuery"
            placeholder="Search tasks..."
            class="w-full pl-8 pr-3 py-1.5 bg-lofi-surface border border-lofi-border rounded-xl text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-lofi-primary transition-colors"
          />
        </div>

        <!-- Clear Completed Button -->
        <button
          v-if="todoStore.completedCount > 0"
          @click="todoStore.clearCompleted"
          class="px-3 py-1.5 rounded-xl bg-lofi-surface hover:bg-red-500/15 text-lofi-muted hover:text-red-300 border border-lofi-border text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          title="Remove all completed tasks"
        >
          <Trash2 class="w-3.5 h-3.5" />
          <span>Clear Done</span>
        </button>
      </div>
    </div>

    <!-- Task Items List -->
    <div class="space-y-2.5">
      <TodoItemCard
        v-for="item in todoStore.filteredTodos"
        :key="item.id"
        :todo="item"
      />

      <!-- Empty State -->
      <div
        v-if="todoStore.filteredTodos.length === 0"
        class="py-12 px-4 rounded-3xl bg-lofi-surface/40 border border-dashed border-lofi-border text-center flex flex-col items-center justify-center gap-3"
      >
        <div class="w-12 h-12 rounded-2xl bg-lofi-card flex items-center justify-center text-lofi-primary border border-lofi-border/60">
          <Sparkles v-if="todoStore.filter === 'completed'" class="w-6 h-6 text-amber-400" />
          <CheckSquare v-else class="w-6 h-6 text-lofi-primary/60" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-lofi-text">
            {{
              todoStore.filter === 'completed'
                ? 'No completed tasks yet'
                : todoStore.searchQuery
                ? 'No tasks match your search'
                : 'No active focus tasks'
            }}
          </h4>
          <p class="text-xs text-lofi-muted mt-0.5">
            {{
              todoStore.filter === 'completed'
                ? 'Mark your tasks as done to see them here.'
                : 'Add a new task above to stay on track.'
            }}
          </p>
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
