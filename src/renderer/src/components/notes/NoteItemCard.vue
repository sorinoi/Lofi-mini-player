<script setup lang="ts">
import { ref } from 'vue'
import {
  Pin,
  PinOff,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  Copy,
  CheckCheck
} from 'lucide-vue-next'
import { useNoteStore } from '../../stores/note'
import type { NoteItem, NoteColor } from '../../types/note'

const props = defineProps<{
  note: NoteItem
}>()

const noteStore = useNoteStore()

const isEditing = ref(false)
const editTitle = ref(props.note.title)
const editContent = ref(props.note.content)
const editColor = ref<NoteColor>(props.note.color)
const isCopied = ref(false)

const colorThemes: Record<NoteColor, { card: string; badge: string; dot: string; name: string }> = {
  default: {
    card: 'bg-lofi-surface/85 border-lofi-border/80 hover:border-lofi-primary/40',
    badge: 'bg-lofi-card text-lofi-muted border-lofi-border',
    dot: 'bg-lofi-muted',
    name: 'Default'
  },
  amber: {
    card: 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dot: 'bg-amber-400',
    name: 'Amber'
  },
  emerald: {
    card: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dot: 'bg-emerald-400',
    name: 'Emerald'
  },
  blue: {
    card: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    dot: 'bg-blue-400',
    name: 'Blue'
  },
  purple: {
    card: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    dot: 'bg-purple-400',
    name: 'Purple'
  },
  pink: {
    card: 'bg-pink-500/10 border-pink-500/30 hover:border-pink-500/50',
    badge: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    dot: 'bg-pink-400',
    name: 'Pink'
  }
}

const colorsList: NoteColor[] = ['default', 'amber', 'emerald', 'blue', 'purple', 'pink']

function startEditing(): void {
  editTitle.value = props.note.title
  editContent.value = props.note.content
  editColor.value = props.note.color
  isEditing.value = true
}

function cancelEditing(): void {
  isEditing.value = false
}

async function saveEditing(): Promise<void> {
  if (!editTitle.value.trim() && !editContent.value.trim()) {
    isEditing.value = false
    return
  }

  await noteStore.updateNote(props.note.id, {
    title: editTitle.value.trim() || 'Untitled Note',
    content: editContent.value.trim(),
    color: editColor.value
  })
  isEditing.value = false
}

async function copyContent(): Promise<void> {
  const text = `${props.note.title}\n\n${props.note.content}`
  await navigator.clipboard.writeText(text)
  isCopied.value = true
  setTimeout(() => {
    isCopied.value = false
  }, 2000)
}

function formatFullDate(timestamp: number): string {
  const d = new Date(timestamp)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const month = months[d.getMonth()]
  const day = d.getDate()
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const mins = d.getMinutes().toString().padStart(2, '0')
  return `${month} ${day}, ${year} ${hours}:${mins}`
}
</script>

<template>
  <div
    :class="[
      'p-4 rounded-2xl border transition-all flex flex-col justify-between group shadow-sm relative overflow-hidden backdrop-blur-xs',
      colorThemes[note.color]?.card || colorThemes.default.card,
      note.pinned ? 'ring-1 ring-amber-400/40' : ''
    ]"
  >
    <!-- EDITING STATE -->
    <div v-if="isEditing" class="space-y-3">
      <!-- Title Input -->
      <input
        type="text"
        v-model="editTitle"
        placeholder="Note Title..."
        class="w-full px-3 py-1.5 bg-lofi-card/80 border border-lofi-border rounded-xl text-xs font-bold text-lofi-text focus:outline-none focus:border-lofi-primary"
      />

      <!-- Content Textarea -->
      <textarea
        v-model="editContent"
        rows="4"
        placeholder="Note Content..."
        class="w-full px-3 py-2 bg-lofi-card/80 border border-lofi-border rounded-xl text-xs text-lofi-text focus:outline-none focus:border-lofi-primary resize-y min-h-[90px]"
        @keydown.ctrl.enter="saveEditing"
        @keydown.esc="cancelEditing"
      ></textarea>

      <!-- Color Palette & Action Buttons -->
      <div class="flex items-center justify-between pt-1">
        <!-- Color Picker -->
        <div class="flex items-center gap-1.5">
          <button
            v-for="c in colorsList"
            :key="c"
            type="button"
            @click="editColor = c"
            :class="[
              'w-4 h-4 rounded-full transition-transform cursor-pointer flex items-center justify-center',
              colorThemes[c].dot,
              editColor === c ? 'scale-125 ring-2 ring-white/60' : 'hover:scale-110 opacity-70'
            ]"
            :title="colorThemes[c].name"
          ></button>
        </div>

        <!-- Save / Cancel -->
        <div class="flex items-center gap-1.5">
          <button
            @click="cancelEditing"
            class="px-2.5 py-1 rounded-lg text-2xs text-lofi-muted hover:text-lofi-text hover:bg-lofi-card transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            @click="saveEditing"
            class="px-3 py-1 rounded-lg bg-lofi-primary text-lofi-bg text-2xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
          >
            <Check class="w-3 h-3" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>

    <!-- NORMAL DISPLAY STATE -->
    <div v-else class="flex flex-col justify-between h-full space-y-3">
      <!-- Top Bar: Title & Action Icons -->
      <div>
        <div class="flex items-start justify-between gap-2">
          <h3 class="text-sm font-bold text-lofi-text leading-snug break-words flex-1">
            {{ note.title }}
          </h3>

          <!-- Action Buttons Bar -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <!-- Pin Button -->
            <button
              @click="noteStore.togglePin(note.id)"
              :class="[
                'p-1.5 rounded-lg transition-colors cursor-pointer',
                note.pinned
                  ? 'text-amber-400 bg-amber-400/10'
                  : 'text-lofi-muted hover:text-amber-400 hover:bg-lofi-card'
              ]"
              :title="note.pinned ? 'Unpin Note' : 'Pin Note'"
            >
              <Pin class="w-3.5 h-3.5" />
            </button>

            <!-- Copy Button -->
            <button
              @click="copyContent"
              class="p-1.5 rounded-lg text-lofi-muted hover:text-lofi-text hover:bg-lofi-card transition-colors cursor-pointer"
              title="Copy note content"
            >
              <CheckCheck v-if="isCopied" class="w-3.5 h-3.5 text-emerald-400" />
              <Copy v-else class="w-3.5 h-3.5" />
            </button>

            <!-- Edit Button -->
            <button
              @click="startEditing"
              class="p-1.5 rounded-lg text-lofi-muted hover:text-lofi-primary hover:bg-lofi-card transition-colors cursor-pointer"
              title="Edit note"
            >
              <Edit2 class="w-3.5 h-3.5" />
            </button>

            <!-- Delete Button -->
            <button
              @click="noteStore.deleteNote(note.id)"
              class="p-1.5 rounded-lg text-lofi-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Delete note"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Note Content Body -->
        <p class="text-xs text-lofi-muted mt-2 whitespace-pre-wrap break-words leading-relaxed">
          {{ note.content }}
        </p>
      </div>

      <!-- Bottom Metadata & Timestamps -->
      <div class="pt-2 border-t border-lofi-border/40 flex items-center justify-between text-[10px] text-lofi-muted font-mono">
        <div class="flex items-center gap-1">
          <Clock class="w-3 h-3 text-lofi-muted/70" />
          <span>{{ formatFullDate(note.createdAt) }}</span>
        </div>

        <span
          v-if="note.updatedAt > note.createdAt + 1000"
          class="text-[9px] text-lofi-primary/80"
          :title="`Last edited: ${formatFullDate(note.updatedAt)}`"
        >
          (Edited)
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-2xs {
  font-size: 0.68rem;
}
</style>