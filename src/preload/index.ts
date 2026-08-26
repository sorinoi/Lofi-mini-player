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
  setWindowSize: (width: number, height: number): Promise<void> => ipcRenderer.invoke('window:setSize', width, height),

  // File Picker Dialogs & Audio Metadata Parsing
  openAudioFiles: (): Promise<string[]> => ipcRenderer.invoke('dialog:openAudioFiles'),
  openAudioFolder: (): Promise<string[]> => ipcRenderer.invoke('dialog:openAudioFolder'),
  openAndParseAudioFiles: (): Promise<any[]> => ipcRenderer.invoke('dialog:openAndParseAudioFiles'),
  openAndParseAudioFolder: (): Promise<any[]> => ipcRenderer.invoke('dialog:openAndParseAudioFolder'),
  parseFilePaths: (filePaths: string[]): Promise<any[]> => ipcRenderer.invoke('metadata:parseFilePaths', filePaths),

  // Codex / AI Subscription Rate Limit & Quota Monitor
  fetchQuotaUsage: (payload: { provider: string; token?: string; customUrl?: string }): Promise<any> =>
    ipcRenderer.invoke('quota:fetchUsage', payload),
  detectLocalCodex: (): Promise<any> => ipcRenderer.invoke('quota:detectLocalCodex')
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
