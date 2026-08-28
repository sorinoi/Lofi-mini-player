export type TodoPriority = 'high' | 'medium' | 'low'
export type TodoCategory = 'study' | 'work' | 'personal' | 'chill'

export interface TodoItem {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt: number | null
  priority: TodoPriority
  category: TodoCategory
  notes?: string
}

export interface TodoStats {
  total: number
  pending: number
  completed: number
  completionRate: number
}
