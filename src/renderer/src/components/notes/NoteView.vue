<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  StickyNote,
  Plus,
  Search,
  FileJson,
  Pin,
  Sparkles,
  Palette,
  Check,
  Clock
} from 'lucide-vue-next'
import { useNoteStore } from '../../stores/note'
import type { NoteColor } from '../../types/note'
import NoteItemCard from './NoteItemCard.vue'

const noteStore = useNoteStore()

const newTitle = ref('')
const newContent = ref('')
const newColor = ref<NoteColor>('default')
const isPinned = ref(false)
const isExpandedInput = ref(false)

const colorsList: { key: NoteColor; label: string; dot: string }[] = [
  { key: 'default', label: 'Default', dot: 'bg-lofi-muted' },
  { key: 'amber', label: 'Amber', dot: 'bg-amber-400' },
  { key: 'emerald', label: 'Emerald', dot: 'bg-emerald-400' },
  { key: 'blue', label: 'Blue', dot: 'bg-blue-400' },
  { key: 'purple', label: 'Purple', dot: 'bg-purple-400' },
  { key: 'pink', label: 'Pink', dot: 'bg-pink-400' }
]

async function handleAddNote(): Promise<void> {
  if (!newTitle.value.trim() && !newContent.value.trim()) return

  await noteStore.addNote(
    newTitle.value.trim(),
    newContent.value.trim(),
    newColor.value,
    isPinned.value
  )

  newTitle.value = ''
  newContent.value = ''
  newColor.value = 'default'
  isPinned.value = false
  isExpandedInput.value = false
}

onMounted(() => {
  noteStore.initNotes()
})
</script>

<template>
  <div class="w-full h-full flex flex-col p-6 overflow-y-auto space-y-6 select-none">
    <!-- Header Section (Title, Subtitle & Open JSON Database Button) -->
    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-lofi-text flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-sm">
            <StickyNote class="w-5 h-5" />
          </div>
          <span>Note Record & Memos</span>
        </h2>
        <p class="text-xs text-lofi-muted mt-1">
          Capture fleeting thoughts, study summaries, and inspirations alongside cozy lofi tracks
        </p>
      </div>

      <!-- Action Button: Open JSON Database Folder -->
      <button
        @click="noteStore.openStorageFolder"
        class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lofi-surface/80 hover:bg-lofi-card text-lofi-text text-xs font-semibold border border-lofi-border transition-all shadow-sm active:scale-95 cursor-pointer group"
        title="Open notes.json file location on disk for backup or manual editing"
      >
        <FileJson class="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
        <span>Open JSON File</span>
      </button>
    </div>

    <!-- Quick Stats Cards Bar -->
    <div class="grid grid-cols-3 gap-3">
      <!-- Total Notes Card -->
      <div class="p-3 rounded-2xl bg-lofi-surface/60 border border-lofi-border/70 flex flex-col justify-between backdrop-blur-xs">
        <span class="text-2xs font-bold uppercase tracking-wider text-lofi-muted truncate">Total Notes</span>
        <span class="text-xl font-black text-lofi-text mt-1">{{ noteStore.totalCount }}</span>
      </div>

      <!-- Pinned Notes Card -->
      <div class="p-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col justify-between backdrop-blur-xs">
        <span class="text-2xs font-bold uppercase tracking-wider text-amber-400/90 truncate">Pinned Notes</span>
        <span class="text-xl font-black text-amber-400 mt-1">{{ noteStore.pinnedCount }}</span>
      </div>

      <!-- Database Status Card -->
      <div class="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col justify-between backdrop-blur-xs">
        <span class="text-2xs font-bold uppercase tracking-wider text-emerald-400/90 truncate">Storage</span>
        <span class="text-xs font-bold text-emerald-400 font-mono mt-1 truncate">notes.json (Synced)</span>
      </div>
    </div>

    <!-- Quick Add Note Card -->
    <div class="p-4 rounded-2xl bg-lofi-surface/90 border border-lofi-border shadow-xl backdrop-blur-md space-y-3">
      <form @submit.prevent="handleAddNote" class="space-y-3">
        <!-- Title Input Bar -->
        <div class="flex items-center gap-2">
          <div class="relative flex-1">
            <Plus class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
            <input
              type="text"
              v-model="newTitle"
              @focus="isExpandedInput = true"
              placeholder="Take a quick note or title (e.g. Project Idea, Study Formula)..."
              class="w-full pl-10 pr-4 py-2.5 bg-lofi-card/80 border border-lofi-border rounded-xl text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-amber-400 transition-all"
            />
          </div>

          <button
            type="submit"
            :disabled="!newTitle.trim() && !newContent.trim()"
            class="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-lofi-bg text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus class="w-4 h-4 stroke-[2.5]" />
            <span>Add Note</span>
          </button>
        </div>

        <!-- Expanded Content Textarea & Color Palette -->
        <div v-if="isExpandedInput || newTitle.trim() || newContent.trim()" class="space-y-3 animate-fadeIn">
          <textarea
            v-model="newContent"
            rows="3"
            placeholder="Write your thoughts, code snippet, or memo details here..."
            class="w-full px-3.5 py-2.5 bg-lofi-card/60 border border-lofi-border rounded-xl text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-amber-400 resize-y min-h-[75px]"
          ></textarea>

          <!-- Palette & Pin Selector Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-lofi-border/50 text-xs">
            <!-- Color Picker -->
            <div class="flex items-center gap-2">
              <span class="text-2xs font-semibold text-lofi-muted uppercase flex items-center gap-1">
                <Palette class="w-3 h-3 text-lofi-muted" />
                <span>Card Color:</span>
              </span>

              <div class="flex items-center gap-1.5">
                <button
                  v-for="c in colorsList"
                  :key="c.key"
                  type="button"
                  @click="newColor = c.key"
                  :class="[
                    'w-5 h-5 rounded-full transition-transform cursor-pointer flex items-center justify-center',
                    c.dot,
                    newColor === c.key ? 'scale-125 ring-2 ring-white/80' : 'hover:scale-110 opacity-70'
                  ]"
                  :title="c.label"
                ></button>
              </div>
            </div>

            <!-- Pin Toggle -->
            <button
              type="button"
              @click="isPinned = !isPinned"
              :class="[
                'flex items-center gap-1.5 px-3 py-1 rounded-lg text-2xs font-semibold border transition-colors cursor-pointer',
                isPinned
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                  : 'bg-lofi-card text-lofi-muted border-lofi-border hover:text-lofi-text'
              ]"
            >
              <Pin class="w-3 h-3" />
              <span>{{ isPinned ? 'Pinned to Top' : 'Pin Note' }}</span>
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
      <!-- Search Input -->
      <div class="relative w-full sm:w-72">
        <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-lofi-muted" />
        <input
          type="text"
          v-model="noteStore.searchQuery"
          placeholder="Search note titles or content..."
          class="w-full pl-8 pr-3 py-1.5 bg-lofi-surface border border-lofi-border rounded-xl text-xs text-lofi-text placeholder-lofi-muted focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>

      <!-- Right Controls: Color Filter & Sort -->
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <!-- Color Filter -->
        <select
          v-model="noteStore.selectedColor"
          class="px-3 py-1.5 rounded-xl bg-lofi-surface border border-lofi-border text-xs text-lofi-text focus:outline-none cursor-pointer"
        >
          <option value="all">All Colors</option>
          <option value="default">Default</option>
          <option value="amber">Amber</option>
          <option value="emerald">Emerald</option>
          <option value="blue">Blue</option>
          <option value="purple">Purple</option>
          <option value="pink">Pink</option>
        </select>

        <!-- Sort Filter -->
        <select
          v-model="noteStore.sortBy"
          class="px-3 py-1.5 rounded-xl bg-lofi-surface border border-lofi-border text-xs text-lofi-text focus:outline-none cursor-pointer"
        >
          <option value="updated">🕒 Recently Edited</option>
          <option value="newest">📅 Newest Created</option>
          <option value="oldest">⏳ Oldest Created</option>
          <option value="title">🔤 Title (A-Z)</option>
        </select>
      </div>
    </div>

    <!-- Notes Grid Section -->
    <div class="space-y-6">
      <!-- 1. Pinned Notes Section -->
      <div v-if="noteStore.pinnedNotes.length > 0" class="space-y-3">
        <div class="flex items-center gap-2 text-xs font-bold text-amber-400">
          <Pin class="w-3.5 h-3.5" />
          <span>PINNED NOTES</span>
          <span class="text-2xs font-mono text-lofi-muted">({{ noteStore.pinnedNotes.length }})</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NoteItemCard
            v-for="note in noteStore.pinnedNotes"
            :key="note.id"
            :note="note"
          />
        </div>
      </div>

      <!-- 2. Other / All Notes Section -->
      <div v-if="noteStore.unpinnedNotes.length > 0" class="space-y-3">
        <div v-if="noteStore.pinnedNotes.length > 0" class="flex items-center gap-2 text-xs font-bold text-lofi-muted">
          <StickyNote class="w-3.5 h-3.5" />
          <span>OTHER NOTES</span>
          <span class="text-2xs font-mono">({{ noteStore.unpinnedNotes.length }})</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NoteItemCard
            v-for="note in noteStore.unpinnedNotes"
            :key="note.id"
            :note="note"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="noteStore.filteredNotes.length === 0"
        class="py-16 px-4 rounded-3xl bg-lofi-surface/40 border border-dashed border-lofi-border text-center flex flex-col items-center justify-center gap-3"
      >
        <div class="w-12 h-12 rounded-2xl bg-lofi-card flex items-center justify-center text-amber-400 border border-lofi-border/60">
          <Sparkles class="w-6 h-6" />
        </div>
        <div>
          <h4 class="text-sm font-bold text-lofi-text">
            {{ noteStore.searchQuery ? 'No notes match your search' : 'No notes recorded yet' }}
          </h4>
          <p class="text-xs text-lofi-muted mt-1">
            {{ noteStore.searchQuery ? 'Try adjusting your search terms or filters.' : 'Use the box above to write down your thoughts or study reminders.' }}
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