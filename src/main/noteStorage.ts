import { app, shell } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'

export type NoteColor = 'default' | 'amber' | 'emerald' | 'blue' | 'purple' | 'pink'

export interface NoteItem {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  color: NoteColor
  pinned: boolean
  tags?: string[]
}

export interface NoteFileSchema {
  version: number
  lastUpdated: number
  notes: NoteItem[]
}

const DEFAULT_STARTER_NOTES: NoteItem[] = [
  {
    id: `note-${Date.now()}-1`,
    title: '🎵 Welcome to Note Record',
    content: 'Jot down quick ideas, learning highlights, or reminders while chilling with lofi music. All notes are auto-saved to your local JSON database.',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    color: 'amber',
    pinned: true,
    tags: ['welcome', 'guide']
  },
  {
    id: `note-${Date.now()}-2`,
    title: '💡 Favorite Lofi Ambient Mix',
    content: 'Rain 60% + Campfire 40% + Cafe Chatter 25% creates the ultimate rainy afternoon coffee shop atmosphere.',
    createdAt: Date.now() - 1800000,
    updatedAt: Date.now() - 1800000,
    color: 'emerald',
    pinned: false,
    tags: ['ambient', 'recipe']
  }
]

export function getNotesFilePath(): string {
  const userDataPath = app.getPath('userData')
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath, { recursive: true })
  }
  return join(userDataPath, 'notes.json')
}

export function loadNotesFromFile(): NoteItem[] {
  try {
    const filePath = getNotesFilePath()
    if (!existsSync(filePath)) {
      const initialData: NoteFileSchema = {
        version: 1,
        lastUpdated: Date.now(),
        notes: DEFAULT_STARTER_NOTES
      }
      writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf-8')
      return DEFAULT_STARTER_NOTES
    }

    const content = readFileSync(filePath, 'utf-8')
    if (!content.trim()) {
      return []
    }

    const parsed: NoteFileSchema = JSON.parse(content)
    return Array.isArray(parsed.notes) ? parsed.notes : []
  } catch (error) {
    console.error('[noteStorage] Failed to load notes from file:', error)
    return []
  }
}

export function saveNotesToFile(notes: NoteItem[]): boolean {
  try {
    const filePath = getNotesFilePath()
    const data: NoteFileSchema = {
      version: 1,
      lastUpdated: Date.now(),
      notes
    }
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('[noteStorage] Failed to save notes to file:', error)
    return false
  }
}

export function openNotesFolder(): void {
  try {
    const filePath = getNotesFilePath()
    if (existsSync(filePath)) {
      shell.showItemInFolder(filePath)
    } else {
      shell.openPath(app.getPath('userData'))
    }
  } catch (error) {
    console.error('[noteStorage] Failed to open notes folder:', error)
  }
}