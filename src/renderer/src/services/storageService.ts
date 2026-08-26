import { get, set } from 'idb-keyval'
import type { Track } from '../types/track'

export interface Playlist {
  id: string
  name: string
  trackIds: string[]
  createdAt: number
}

const STORAGE_KEYS = {
  TRACKS: 'lofi_player_tracks',
  PLAYLISTS: 'lofi_player_playlists',
  FAVORITES: 'lofi_player_favorites',
  YOUTUBE_BOOKMARKS: 'lofi_player_youtube_bookmarks',
  SETTINGS: 'lofi_player_settings'
}

export const storageService = {
  // Tracks
  async getTracks(): Promise<Track[]> {
    try {
      const tracks = await get<Track[]>(STORAGE_KEYS.TRACKS)
      return tracks || []
    } catch (e) {
      console.warn('Failed to load tracks from IndexedDB:', e)
      return []
    }
  },

  async saveTracks(tracks: Track[]): Promise<void> {
    try {
      await set(STORAGE_KEYS.TRACKS, tracks)
    } catch (e) {
      console.warn('Failed to save tracks to IndexedDB:', e)
    }
  },

  // Playlists
  async getPlaylists(): Promise<Playlist[]> {
    try {
      const playlists = await get<Playlist[]>(STORAGE_KEYS.PLAYLISTS)
      return playlists || []
    } catch (e) {
      console.warn('Failed to load playlists from IndexedDB:', e)
      return []
    }
  },

  async savePlaylists(playlists: Playlist[]): Promise<void> {
    try {
      await set(STORAGE_KEYS.PLAYLISTS, playlists)
    } catch (e) {
      console.warn('Failed to save playlists to IndexedDB:', e)
    }
  },

  // Favorites
  async getFavorites(): Promise<string[]> {
    try {
      const favs = await get<string[]>(STORAGE_KEYS.FAVORITES)
      return favs || []
    } catch (e) {
      return []
    }
  },

  async saveFavorites(favs: string[]): Promise<void> {
    try {
      await set(STORAGE_KEYS.FAVORITES, favs)
    } catch (e) {
      console.warn('Failed to save favorites:', e)
    }
  },

  // YouTube Bookmarks
  async getYouTubeBookmarks(): Promise<any[]> {
    try {
      const bms = await get<any[]>(STORAGE_KEYS.YOUTUBE_BOOKMARKS)
      return bms || []
    } catch (e) {
      return []
    }
  },

  async saveYouTubeBookmarks(bookmarks: any[]): Promise<void> {
    try {
      await set(STORAGE_KEYS.YOUTUBE_BOOKMARKS, bookmarks)
    } catch (e) {
      console.warn('Failed to save bookmarks:', e)
    }
  }
}
