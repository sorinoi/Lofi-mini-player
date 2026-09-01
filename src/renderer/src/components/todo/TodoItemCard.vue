<script setup lang="ts">
import { ref } from 'vue'
import {
  Check,
  Trash2,
  Edit3,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Briefcase,
  User,
  Coffee,
  AlertCircle
} from 'lucide-vue-next'
import type { TodoItem, TodoPriority, TodoCategory } from '../../types/todo'
import { useTodoStore } from '../../stores/todo'

const props = defineProps<{
  todo: TodoItem
}>()

const todoStore = useTodoStore()
const isEditing = ref(false)
const editText = ref(props.todo.text)
const editNotes = ref(props.todo.notes || '')
const editPriority = ref<TodoPriority>(props.todo.priority)
const editCategory = ref<TodoCategory>(props.todo.category)

function formatDateTime(timestamp: number | null): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function calculateDuration(created: number, completed: number | null): string {
  if (!completed || completed <= created) return ''
  const diffMs = completed - created
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return '< 1 min'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  if (hours < 24) {
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`
  }
  const days = Math.floor(hours / 24)
  return `${days}d`
}

function handleSaveEdit(): void {
  if (!editText.value.trim()) return
  todoStore.editTodo(props.todo.id, {
    text: editText.value.trim(),
    notes: editNotes.value.trim(),
    priority: editPriority.value,
    category: editCategory.value
  })
  isEditing.value = false
}

function handleCancelEdit(): void {
  editText.value = props.todo.text
  editNotes.value = props.todo.notes || ''
  editPriority.value = props.todo.priority
  editCategory.value = props.todo.category
  isEditing.value = false
}
</script>

<template>
  <div
    :class="[
      'group relative p-4 rounded-2xl border transition-all duration-200',
      todo.completed
        ? 'bg-lofi-surface/40 border-lofi-border/40 opacity-75'
        : 'bg-lofi-surface/80 hover:bg-lofi-card border-lofi-border shadow-md hover:shadow-lg'
    ]"
  >
    <!-- Normal View Mode -->
    <div v-if="!isEditing" class="flex items-start gap-3.5">
      <!-- Custom Checkbox Button -->
      <button
        @click="todoStore.toggleTodo(todo.id)"
        :class="[
          'w-6 h-6 mt-0.5 rounded-lg flex items-center justify-center border transition-all flex-shrink-0 cursor-pointer active:scale-90',
          todo.completed
            ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
            : 'border-lofi-border/80 hover:border-lofi-primary hover:bg-lofi-primary/10 text-transparent'
        ]"
        :title="todo.completed ? 'Mark as Incomplete' : 'Mark as Completed'"
      >
        <Check class="w-3.5 h-3.5 stroke-[3]" />
      </button>

      <!-- Task Details -->
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <!-- Category Badge -->
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-2xs font-semibold flex items-center gap-1 border whitespace-nowrap flex-shrink-0',
              todo.category === 'study'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                : todo.category === 'work'
                ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                : todo.category === 'personal'
                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                : 'bg-pink-500/15 text-pink-300 border-pink-500/30'
            ]"
          >
            <BookOpen v-if="todo.category === 'study'" class="w-2.5 h-2.5" />
            <Briefcase v-else-if="todo.category === 'work'" class="w-2.5 h-2.5" />
            <User v-else-if="todo.category === 'personal'" class="w-2.5 h-2.5" />
            <Coffee v-else class="w-2.5 h-2.5" />
            <span class="capitalize">{{ todo.category }}</span>
          </span>

          <!-- Priority Badge -->
          <span
            :class="[
              'px-2 py-0.5 rounded-full text-2xs font-semibold flex items-center gap-1 border whitespace-nowrap flex-shrink-0',
              todo.priority === 'high'
                ? 'bg-red-500/15 text-red-300 border-red-500/30'
                : todo.priority === 'medium'
                ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30'
                : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            ]"
          >
            <span
              :class="[
                'w-1.5 h-1.5 rounded-full',
                todo.priority === 'high' ? 'bg-red-400' : todo.priority === 'medium' ? 'bg-yellow-400' : 'bg-emerald-400'
              ]"
            ></span>
            <span class="capitalize">{{ todo.priority }}</span>
          </span>

          <!-- Done in Duration Badge -->
          <span
            v-if="todo.completed && todo.completedAt"
            class="px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1 whitespace-nowrap flex-shrink-0"
            title="Time taken to complete"
          >
            <Clock class="w-2.5 h-2.5" />
            <span>Done in {{ calculateDuration(todo.createdAt, todo.completedAt) }}</span>
          </span>
        </div>

        <!-- Task Text -->
        <h4
          :class="[
            'text-sm font-medium leading-relaxed break-words transition-all',
            todo.completed ? 'line-through text-lofi-muted' : 'text-lofi-text'
          ]"
        >
          {{ todo.text }}
        </h4>

        <!-- Notes (if any) -->
        <p v-if="todo.notes" class="text-xs text-lofi-muted/80 mt-1 break-words bg-lofi-surface/60 p-2 rounded-xl border border-lofi-border/30">
          {{ todo.notes }}
        </p>

        <!-- Timestamps Footer -->
        <div class="flex flex-wrap items-center gap-3 mt-2.5 text-2xs text-lofi-muted/70">
          <div class="flex items-center gap-1" title="Creation Date">
            <Calendar class="w-3 h-3 text-lofi-muted" />
            <span>Created: {{ formatDateTime(todo.createdAt) }}</span>
          </div>

          <div v-if="todo.completed && todo.completedAt" class="flex items-center gap-1 text-emerald-400/80" title="Completion Date">
            <CheckCircle2 class="w-3 h-3 text-emerald-400" />
            <span>Completed: {{ formatDateTime(todo.completedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons (Edit, Delete) -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click="isEditing = true"
          class="p-1.5 rounded-lg text-lofi-muted hover:text-lofi-text hover:bg-lofi-surface transition-colors cursor-pointer"
          title="Edit Task"
        >
          <Edit3 class="w-3.5 h-3.5" />
        </button>

        <button
          @click="todoStore.deleteTodo(todo.id)"
          class="p-1.5 rounded-lg text-lofi-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          title="Delete Task"
        >
          <Trash2 class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Edit Mode Form -->
    <div v-else class="space-y-3">
      <div>
        <label class="text-2xs font-semibold text-lofi-muted uppercase">Task Name</label>
        <input
          type="text"
          v-model="editText"
          @keydown.enter="handleSaveEdit"
          class="w-full mt-1 px-3 py-2 bg-lofi-surface border border-lofi-primary/50 rounded-xl text-xs text-lofi-text focus:outline-none focus:border-lofi-primary"
          placeholder="Task title..."
          autofocus
        />
      </div>

      <div>
        <label class="text-2xs font-semibold text-lofi-muted uppercase">Notes (Optional)</label>
        <textarea
          v-model="editNotes"
          rows="2"
          class="w-full mt-1 px-3 py-1.5 bg-lofi-surface border border-lofi-border rounded-xl text-xs text-lofi-text focus:outline-none focus:border-lofi-primary resize-none"
          placeholder="Add extra notes..."
        ></textarea>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div class="flex items-center gap-3">
          <!-- Priority select -->
          <div class="flex items-center gap-1 text-2xs">
            <span class="text-lofi-muted font-medium">Priority:</span>
            <select
              v-model="editPriority"
              class="px-2 py-1 rounded-lg bg-lofi-surface border border-lofi-border text-xs text-lofi-text focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <!-- Category select -->
          <div class="flex items-center gap-1 text-2xs">
            <span class="text-lofi-muted font-medium">Category:</span>
            <select
              v-model="editCategory"
              class="px-2 py-1 rounded-lg bg-lofi-surface border border-lofi-border text-xs text-lofi-text focus:outline-none"
            >
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="personal">Personal</option>
              <option value="chill">Chill</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="handleCancelEdit"
            class="px-3 py-1.5 rounded-xl bg-lofi-surface hover:bg-lofi-card text-lofi-muted text-xs font-semibold border border-lofi-border transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="handleSaveEdit"
            :disabled="!editText.trim()"
            class="px-3 py-1.5 rounded-xl bg-lofi-primary hover:bg-lofi-primary/90 text-lofi-bg text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            Save Changes
          </button>
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
