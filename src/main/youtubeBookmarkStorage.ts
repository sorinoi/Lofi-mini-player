import { app, shell } from 'electron'
import { join } from 'path'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'

export interface YouTubeBookmarkItem {
  id: string
  videoId: string
  title: string
  channel: string
  thumbnailUrl: string
  addedAt: number
}

export interface YouTubeBookmarkFileSchema {
  version: number
  lastUpdated: number
  bookmarks: YouTubeBookmarkItem[]
}

const DEFAULT_STARTER_BOOKMARKS: YouTubeBookmarkItem[] = [
  {
    id: 'lofigirl-study',
    title: 'Lofi Hip Hop Radio 📚 Beats to Relax / Study to',
    channel: 'Lofi Girl',
    videoId: 'rFZHOHl-L8A',
    thumbnailUrl: 'https://img.youtube.com/vi/rFZHOHl-L8A/hqdefault.jpg',
    addedAt: Date.now() - 3600000
  },
  {
    id: 'lofigirl-sleep',
    title: 'Lofi Sleep Beats 🌙 Beats to Sleep / Chill to',
    channel: 'Lofi Girl',
    videoId: 'rUxyKA_-grg',
    thumbnailUrl: 'https://img.youtube.com/vi/rUxyKA_-grg/hqdefault.jpg',
    addedAt: Date.now() - 3000000
  },
  {
    id: 'chillhop-radio',
    title: 'Chillhop Essentials Radio ☕ Jazzy & Lofi Hip Hop Beats',
    channel: 'Chillhop Music',
    videoId: 'ohrjSFplPzk',
    thumbnailUrl: 'https://img.youtube.com/vi/ohrjSFplPzk/hqdefault.jpg',
    addedAt: Date.now() - 2400000
  },
  {
    id: 'synthwave-radio',
    title: 'Synthwave Radio 🌌 Beats to Chill / Game to',
    channel: 'Lofi Girl - Synthwave',
    videoId: '4xDzrJKXOOY',
    thumbnailUrl: 'https://img.youtube.com/vi/4xDzrJKXOOY/hqdefault.jpg',
    addedAt: Date.now() - 1800000
  },
  {
    id: 'coffee-shop-lofi',
    title: 'Coffee Shop Radio ☕ 24/7 Lofi & Jazzy Hip-Hop Beats',
    channel: 'STEEZYASFUCK',
    videoId: 'lP26UCnoH9s',
    thumbnailUrl: 'https://img.youtube.com/vi/lP26UCnoH9s/hqdefault.jpg',
    addedAt: Date.now() - 1200000
  },
  {
    id: 'tokyo-night-lofi',
    title: 'Tokyo Night Drive 🚗 Japanese Lofi Hip Hop Mix',
    channel: 'Chill with Taiki',
    videoId: '9FvvbVI5rYA',
    thumbnailUrl: 'https://img.youtube.com/vi/9FvvbVI5rYA/hqdefault.jpg',
    addedAt: Date.now() - 600000
  }
]

export function getYouTubeBookmarksFilePath(): string {
  const userDataPath = app.getPath('userData')
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath, { recursive: true })
  }
  return join(userDataPath, 'youtube_bookmarks.json')
}

export function loadYouTubeBookmarksFromFile(): YouTubeBookmarkItem[] {
  try {
    const filePath = getYouTubeBookmarksFilePath()
    if (!existsSync(filePath)) {
      const initialData: YouTubeBookmarkFileSchema = {
        version: 1,
        lastUpdated: Date.now(),
        bookmarks: DEFAULT_STARTER_BOOKMARKS
      }
      writeFileSync(filePath, JSON.stringify(initialData, null, 2), 'utf-8')
      return DEFAULT_STARTER_BOOKMARKS
    }

    const content = readFileSync(filePath, 'utf-8')
    if (!content.trim()) {
      return []
    }

    const parsed: YouTubeBookmarkFileSchema = JSON.parse(content)
    return Array.isArray(parsed.bookmarks) ? parsed.bookmarks : []
  } catch (error) {
    console.error('[youtubeBookmarkStorage] Failed to load bookmarks from file:', error)
    return []
  }
}

export function saveYouTubeBookmarksToFile(bookmarks: YouTubeBookmarkItem[]): boolean {
  try {
    const filePath = getYouTubeBookmarksFilePath()
    const data: YouTubeBookmarkFileSchema = {
      version: 1,
      lastUpdated: Date.now(),
      bookmarks
    }
    writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('[youtubeBookmarkStorage] Failed to save bookmarks to file:', error)
    return false
  }
}

export function openYouTubeBookmarksFolder(): void {
  try {
    const filePath = getYouTubeBookmarksFilePath()
    if (existsSync(filePath)) {
      shell.showItemInFolder(filePath)
    } else {
      shell.openPath(app.getPath('userData'))
    }
  } catch (error) {
    console.error('[youtubeBookmarkStorage] Failed to open bookmarks folder:', error)
  }
}
