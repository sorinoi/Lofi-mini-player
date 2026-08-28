import { app, shell } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt: number | null
  priority: 'high' | 'medium' | 'low'
  category: 'study' | 'work' | 'personal' | 'chill'
  notes?: string
}

export interface TodoFileSchema {
  version: number
  lastUpdated: number
  todos: TodoItem[]
}

const DEFAULT_STARTER_TODOS: TodoItem[] = [
  {
    id: `todo-${Date.now()}-1`,
    text: 'Listen to cozy lofi beats & start deep focus',
    completed: true,
    createdAt: Date.now() - 3600000,
    completedAt: Date.now() - 1800000,
    priority: 'medium',
    category: 'chill',
    notes: 'Welcome to Lofi Focus Tasks!'
  },
  {
    id: `todo-${Date.now()}-2`,
    text: 'Complete 25-minute Pomodoro focus session',
    completed: false,
    createdAt: Date.now() - 1200000,
    completedAt: null,
    priority: 'high',
    category: 'study',
    notes: 'Set the Pomodoro timer in the bottom bar or mini player.'
  },
  {
    id: `todo-${Date.now()}-3`,
    text: 'Mix campfire and rain ambient sounds for relaxing work',
    completed: false,
    createdAt: Date.now() - 600000,
    completedAt: null,
    priority: 'low',
    category: 'work',
    notes: 'Switch to Ambient Mixer tab.'
  }
]

export function getTodosFilePath(): string {
  const userDataPath = app.getPath('userData')
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath, { recursive: true })
  }
  return join(userDataPath, 'todos.json')
}

export function loadTodosFromFile(): TodoItem[] {
  try {
    const filePath = getTodosFilePath()
    if (!existsSync(filePath)) {
      // Create initial default file
      const initialData: TodoFileSchema = {
        version: 1,
        lastUpdated: Date.now(),
        todos: DEFAULT_STARTER_TODOS
      }
      writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf-8')
      return DEFAULT_STARTER_TODOS
    }

    const content = readFileSync(filePath, 'utf-8')
    if (!content.trim()) {
      return []
    }

    const parsed: TodoFileSchema = JSON.parse(content)
    return Array.isArray(parsed.todos) ? parsed.todos : []
  } catch (error) {
    console.error('[todoStorage] Failed to load todos from file:', error)
    return []
  }
}

export function saveTodosToFile(todos: TodoItem[]): boolean {
  try {
    const filePath = getTodosFilePath()
    const data: TodoFileSchema = {
      version: 1,
      lastUpdated: Date.now(),
      todos
    }
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('[todoStorage] Failed to save todos to file:', error)
    return false
  }
}

export function openTodosFolder(): void {
  try {
    const filePath = getTodosFilePath()
    if (existsSync(filePath)) {
      shell.showItemInFolder(filePath)
    } else {
      shell.openPath(app.getPath('userData'))
    }
  } catch (error) {
    console.error('[todoStorage] Failed to open folder:', error)
  }
}
