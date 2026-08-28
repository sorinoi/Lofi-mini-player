import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TodoItem, TodoPriority, TodoCategory, TodoStats } from '../types/todo'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<TodoItem[]>([])
  const isLoading = ref<boolean>(false)
  const filter = ref<'all' | 'active' | 'completed'>('all')
  const searchQuery = ref<string>('')
  const selectedCategory = ref<string>('all')
  const selectedPriority = ref<string>('all')
  const sortBy = ref<'newest' | 'oldest' | 'priority'>('newest')

  const totalCount = computed<number>(() => todos.value.length)
  const pendingCount = computed<number>(() => todos.value.filter((t) => !t.completed).length)
  const completedCount = computed<number>(() => todos.value.filter((t) => t.completed).length)
  const completionRate = computed<number>(() => {
    if (totalCount.value === 0) return 0
    return Math.round((completedCount.value / totalCount.value) * 100)
  })

  const stats = computed<TodoStats>(() => ({
    total: totalCount.value,
    pending: pendingCount.value,
    completed: completedCount.value,
    completionRate: completionRate.value
  }))

  const filteredTodos = computed<TodoItem[]>(() => {
    let result = [...todos.value]

    // 1. Status Filter
    if (filter.value === 'active') {
      result = result.filter((t) => !t.completed)
    } else if (filter.value === 'completed') {
      result = result.filter((t) => t.completed)
    }

    // 2. Category Filter
    if (selectedCategory.value !== 'all') {
      result = result.filter((t) => t.category === selectedCategory.value)
    }

    // 3. Priority Filter
    if (selectedPriority.value !== 'all') {
      result = result.filter((t) => t.priority === selectedPriority.value)
    }

    // 4. Search Filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase().trim()
      result = result.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          (t.notes && t.notes.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q)
      )
    }

    // 5. Sorting
    result.sort((a, b) => {
      // Completed items always sink to bottom unless in completed-only filter
      if (filter.value === 'all' && a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }

      if (sortBy.value === 'newest') {
        return b.createdAt - a.createdAt
      } else if (sortBy.value === 'oldest') {
        return a.createdAt - b.createdAt
      } else if (sortBy.value === 'priority') {
        const pOrder: Record<TodoPriority, number> = { high: 3, medium: 2, low: 1 }
        return pOrder[b.priority] - pOrder[a.priority]
      }
      return 0
    })

    return result
  })

  async function initTodos(): Promise<void> {
    isLoading.value = true
    try {
      if (window.api?.loadTodos) {
        const loaded = await window.api.loadTodos()
        if (Array.isArray(loaded)) {
          todos.value = loaded
        }
      }
    } catch (e) {
      console.warn('[TodoStore] Failed to load todos from JSON file:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function persistTodos(): Promise<void> {
    try {
      if (window.api?.saveTodos) {
        const plainData = JSON.parse(JSON.stringify(todos.value))
        await window.api.saveTodos(plainData)
      }
    } catch (e) {
      console.warn('[TodoStore] Failed to save todos to JSON file:', e)
    }
  }

  async function addTodo(
    text: string,
    priority: TodoPriority = 'medium',
    category: TodoCategory = 'work',
    notes: string = ''
  ): Promise<TodoItem | null> {
    if (!text || !text.trim()) return null

    const newItem: TodoItem = {
      id: `todo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      completedAt: null,
      priority,
      category,
      notes: notes.trim()
    }

    todos.value.unshift(newItem)
    await persistTodos()
    return newItem
  }

  async function toggleTodo(id: string): Promise<void> {
    const item = todos.value.find((t) => t.id === id)
    if (item) {
      item.completed = !item.completed
      item.completedAt = item.completed ? Date.now() : null
      await persistTodos()
    }
  }

  async function deleteTodo(id: string): Promise<void> {
    todos.value = todos.value.filter((t) => t.id !== id)
    await persistTodos()
  }

  async function clearCompleted(): Promise<void> {
    todos.value = todos.value.filter((t) => !t.completed)
    await persistTodos()
  }

  async function editTodo(id: string, updates: Partial<TodoItem>): Promise<void> {
    const item = todos.value.find((t) => t.id === id)
    if (item) {
      Object.assign(item, updates)
      await persistTodos()
    }
  }

  async function openStorageFolder(): Promise<void> {
    if (window.api?.openTodosFolder) {
      await window.api.openTodosFolder()
    }
  }

  return {
    todos,
    isLoading,
    filter,
    searchQuery,
    selectedCategory,
    selectedPriority,
    sortBy,
    totalCount,
    pendingCount,
    completedCount,
    completionRate,
    stats,
    filteredTodos,
    initTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    editTodo,
    openStorageFolder
  }
})
