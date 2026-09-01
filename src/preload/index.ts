import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs exposed to Vue renderer
export const api = {
  // Window Management & Frameless Controls
  minimizeWindow: (): Promise<void> => ipcRenderer.invoke('window:minimize'),
  maximizeWindow: (): Promise<boolean> => ipcRenderer.invoke('window:maximize'),
  closeWindow: (): Promise<void> => ipcRenderer.invoke('window:close'),
  isWindowMaximized: (): Promise<boolean> => ipcRenderer.invoke('window:isMaximized'),
  setAlwaysOnTop: (flag: boolean): Promise<boolean> => ipcRenderer.invoke('window:setAlwaysOnTop', flag),
  getAlwaysOnTop: (): Promise<boolean> => ipcRenderer.invoke('window:getAlwaysOnTop'),
  toggleAlwaysOnTop: (): Promise<boolean> => ipcRenderer.invoke('window:toggleAlwaysOnTop'),
  setAudioMuted: (muted: boolean): Promise<boolean> => ipcRenderer.invoke('window:setAudioMuted', muted),
  setWindowTitle: (title: string): Promise<string> => ipcRenderer.invoke('window:setTitle', title),
  enterMiniMode: (): Promise<boolean> => ipcRenderer.invoke('window:enterMiniMode'),
  exitMiniMode: (): Promise<boolean> => ipcRenderer.invoke('window:exitMiniMode'),
  enterDockMode: (): Promise<boolean> => ipcRenderer.invoke('window:enterDockMode'),
  exitDockMode: (): Promise<boolean> => ipcRenderer.invoke('window:exitDockMode'),
  toggleDockMode: (): Promise<boolean> => ipcRenderer.invoke('window:toggleDockMode'),
  isDockMode: (): Promise<boolean> => ipcRenderer.invoke('window:isDockMode'),
  setWindowSize: (width: number, height: number): Promise<void> => ipcRenderer.invoke('window:setSize', width, height),

  // File Picker Dialogs & Audio Metadata Parsing
  openAudioFiles: (): Promise<string[]> => ipcRenderer.invoke('dialog:openAudioFiles'),
  openAudioFolder: (): Promise<string[]> => ipcRenderer.invoke('dialog:openAudioFolder'),
  openAndParseAudioFiles: (): Promise<any[]> => ipcRenderer.invoke('dialog:openAndParseAudioFiles'),
  openAndParseAudioFolder: (): Promise<any[]> => ipcRenderer.invoke('dialog:openAndParseAudioFolder'),
  parseFilePaths: (filePaths: string[]): Promise<any[]> => ipcRenderer.invoke('metadata:parseFilePaths', filePaths),

  // YouTube Stream URL Resolution & Metadata
  resolveYouTubeUrl: (input: string): Promise<any> => ipcRenderer.invoke('youtube:resolveUrl', input),
  fetchYouTubeMetadata: (videoId: string): Promise<any> => ipcRenderer.invoke('youtube:fetchMetadata', videoId),

  // JSON-based To-Do / Focus Task Manager
  loadTodos: (): Promise<any[]> => ipcRenderer.invoke('todos:load'),
  saveTodos: (todos: any[]): Promise<boolean> => ipcRenderer.invoke('todos:save', todos),
  openTodosFolder: (): Promise<void> => ipcRenderer.invoke('todos:openFolder'),

  // JSON-based Note Record / Quick Notes
  loadNotes: (): Promise<any[]> => ipcRenderer.invoke('notes:load'),
  saveNotes: (notes: any[]): Promise<boolean> => ipcRenderer.invoke('notes:save', notes),
  openNotesFolder: (): Promise<void> => ipcRenderer.invoke('notes:openFolder'),

  // JSON-based YouTube Bookmarks
  loadYouTubeBookmarks: (): Promise<any[]> => ipcRenderer.invoke('youtube:loadBookmarks'),
  saveYouTubeBookmarks: (bookmarks: any[]): Promise<boolean> => ipcRenderer.invoke('youtube:saveBookmarks', bookmarks),
  openYouTubeBookmarksFolder: (): Promise<void> => ipcRenderer.invoke('youtube:openBookmarksFolder')
}

export type IElectronAPI = typeof api

// Use `contextBridge` APIs to expose Electron APIs to renderer
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
