import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NoteItem, NoteColor, NoteStats } from '../types/note'

export const useNoteStore = defineStore('note', () => {
  const notes = ref<NoteItem[]>([])
  const isLoading = ref<boolean>(false)
  const searchQuery = ref<string>('')
  const selectedColor = ref<string>('all')
  const sortBy = ref<'updated' | 'newest' | 'oldest' | 'title'>('updated')
  const editingNoteId = ref<string | null>(null)

  const totalCount = computed<number>(() => notes.value.length)
  const pinnedCount = computed<number>(() => notes.value.filter((n) => n.pinned).length)

  const stats = computed<NoteStats>(() => ({
    total: totalCount.value,
    pinned: pinnedCount.value
  }))

  const filteredNotes = computed<NoteItem[]>(() => {
    let result = [...notes.value]

    // 1. Color Filter
    if (selectedColor.value !== 'all') {
      result = result.filter((n) => n.color === selectedColor.value)
    }

    // 2. Search Query Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
      )
    }

    // 3. Sorting
    result.sort((a, b) => {
      // Pinned notes always stay on top
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1
      }

      if (sortBy.value === 'updated') {
        return b.updatedAt - a.updatedAt
      } else if (sortBy.value === 'newest') {
        return b.createdAt - a.createdAt
      } else if (sortBy.value === 'oldest') {
        return a.createdAt - b.createdAt
      } else if (sortBy.value === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

    return result
  })

  const pinnedNotes = computed<NoteItem[]>(() => filteredNotes.value.filter((n) => n.pinned))
  const unpinnedNotes = computed<NoteItem[]>(() => filteredNotes.value.filter((n) => !n.pinned))

  async function initNotes(): Promise<void> {
    isLoading.value = true
    try {
      if (window.api?.loadNotes) {
        const loaded = await window.api.loadNotes()
        if (Array.isArray(loaded)) {
          notes.value = loaded
        }
      }
    } catch (e) {
      console.warn('[NoteStore] Failed to load notes from JSON file:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function persistNotes(): Promise<void> {
    try {
      if (window.api?.saveNotes) {
        const plainData = JSON.parse(JSON.stringify(notes.value))
        await window.api.saveNotes(plainData)
      }
    } catch (e) {
      console.warn('[NoteStore] Failed to save notes to JSON file:', e)
    }
  }

  async function addNote(
    title: string,
    content: string,
    color: NoteColor = 'default',
    pinned: boolean = false,
    tags: string[] = []
  ): Promise<NoteItem | null> {
    if (!title.trim() && !content.trim()) return null

    const finalTitle = title.trim() || (content.trim().split('\n')[0].substring(0, 40) || 'Untitled Note')
    const now = Date.now()

    const newNote: NoteItem = {
      id: `note-${now}-${Math.random().toString(36).substring(2, 7)}`,
      title: finalTitle,
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
      color,
      pinned,
      tags
    }

    notes.value.unshift(newNote)
    await persistNotes()
    return newNote
  }

  async function updateNote(id: string, updates: Partial<Omit<NoteItem, 'id' | 'createdAt'>>): Promise<void> {
    const item = notes.value.find((n) => n.id === id)
    if (item) {
      Object.assign(item, updates, { updatedAt: Date.now() })
      await persistNotes()
    }
  }

  async function deleteNote(id: string): Promise<void> {
    notes.value = notes.value.filter((n) => n.id !== id)
    if (editingNoteId.value === id) {
      editingNoteId.value = null
    }
    await persistNotes()
  }

  async function togglePin(id: string): Promise<void> {
    const item = notes.value.find((n) => n.id === id)
    if (item) {
      item.pinned = !item.pinned
      item.updatedAt = Date.now()
      await persistNotes()
    }
  }

  async function setNoteColor(id: string, color: NoteColor): Promise<void> {
    const item = notes.value.find((n) => n.id === id)
    if (item) {
      item.color = color
      item.updatedAt = Date.now()
      await persistNotes()
    }
  }

  async function openStorageFolder(): Promise<void> {
    if (window.api?.openNotesFolder) {
      await window.api.openNotesFolder()
    }
  }

  return {
    notes,
    isLoading,
    searchQuery,
    selectedColor,
    sortBy,
    editingNoteId,
    totalCount,
    pinnedCount,
    stats,
    filteredNotes,
    pinnedNotes,
    unpinnedNotes,
    initNotes,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    setNoteColor,
    openStorageFolder
  }
})