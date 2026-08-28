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

export interface NoteStats {
  total: number
  pinned: number
}