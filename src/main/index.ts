import { app, shell, BrowserWindow, ipcMain, dialog, Rectangle, session } from 'electron'
import { join, basename, extname } from 'path'
import { readdirSync, statSync } from 'fs'
import { createHash } from 'crypto'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import * as mm from 'music-metadata'
import { detectLocalCodexQuota } from './codexDetector'
import { fetchGitHubCopilotQuota } from './githubCopilotDetector'
import { fetchOpenAIQuota } from './openAIDetector'
import { fetchZhipuQuota } from './zhipuDetector'
import { resolveYouTubeUrl, fetchYouTubeMetadata } from './youtubeResolver'

// Disable user gesture requirement for media autoplay in Chromium
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

let mainWindow: BrowserWindow | null = null
let normalBounds: Rectangle = { x: 100, y: 100, width: 1040, height: 720 }
let isAlwaysOnTopState = false

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1040,
    height: 720,
    minWidth: 340,
    minHeight: 200,
    show: false,
    autoHideMenuBar: true,
    title: 'Lofi Player',
    frame: false, // Frameless for custom cozy titlebar
    backgroundColor: '#14161f',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false // Permits local audio streaming smoothly
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer based on electron-vite cli
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Helper: Parse ID3/Audio metadata from file
async function parseTrackMetadata(filePath: string): Promise<Record<string, unknown>> {
  const fileName = basename(filePath)
  const fallbackTitle = fileName.substring(0, fileName.lastIndexOf('.')) || fileName
  const pathHash = createHash('sha256').update(filePath).digest('hex').substring(0, 16)
  const trackId = `track-${pathHash}`

  try {
    const metadata = await mm.parseFile(filePath, { duration: true, skipCovers: false })
    let coverUrl: string | undefined

    if (metadata.common.picture && metadata.common.picture.length > 0) {
      const pic = metadata.common.picture[0]
      coverUrl = `data:${pic.format};base64,${pic.data.toString('base64')}`
    }

    return {
      id: trackId,
      title: metadata.common.title || fallbackTitle,
      artist: metadata.common.artist || 'Unknown Artist',
      album: metadata.common.album || 'Unknown Album',
      duration: metadata.format.duration ? Math.round(metadata.format.duration) : 0,
      src: filePath,
      coverUrl,
      genre: 'chillhop',
      sourceType: 'local',
      addedAt: Date.now()
    }
  } catch (err) {
    return {
      id: trackId,
      title: fallbackTitle,
      artist: 'Local Track',
      album: 'Unknown Album',
      duration: 0,
      src: filePath,
      genre: 'chillhop',
      sourceType: 'local',
      addedAt: Date.now()
    }
  }
}

// Helper: Recursively find audio files in folder
function findAudioFilesInDir(dirPath: string): string[] {
  const audioExtensions = new Set(['.mp3', '.wav', '.flac', '.ogg', '.aac', '.m4a', '.webm', '.opus'])
  const results: string[] = []

  function traverse(dir: string): void {
    try {
      const entries = readdirSync(dir)
      for (const entry of entries) {
        const fullPath = join(dir, entry)
        try {
          const stat = statSync(fullPath)
          if (stat.isDirectory()) {
            traverse(fullPath)
          } else if (stat.isFile() && audioExtensions.has(extname(entry).toLowerCase())) {
            results.push(fullPath)
          }
        } catch {
          // ignore inaccessible items
        }
      }
    } catch {
      // ignore inaccessible dir
    }
  }

  traverse(dirPath)
  return results
}

// IPC Handlers for Window Management & Frameless Controls
ipcMain.handle('window:minimize', () => {
  mainWindow?.minimize()
})

ipcMain.handle('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
    return false
  } else {
    mainWindow?.maximize()
    return true
  }
})

ipcMain.handle('window:close', () => {
  mainWindow?.close()
})

ipcMain.handle('window:isMaximized', () => {
  return mainWindow?.isMaximized() ?? false
})

ipcMain.handle('window:setAlwaysOnTop', (_, flag: boolean) => {
  isAlwaysOnTopState = flag
  mainWindow?.setAlwaysOnTop(flag)
  return flag
})

ipcMain.handle('window:setAudioMuted', (_, muted: boolean) => {
  if (mainWindow) {
    mainWindow.webContents.setAudioMuted(muted)
  }
  return muted
})

ipcMain.handle('window:setTitle', (_, title: string) => {
  if (mainWindow) {
    mainWindow.setTitle(title)
  }
  return title
})

ipcMain.handle('window:getAlwaysOnTop', () => {
  return isAlwaysOnTopState
})

ipcMain.handle('window:toggleAlwaysOnTop', () => {
  isAlwaysOnTopState = !isAlwaysOnTopState
  mainWindow?.setAlwaysOnTop(isAlwaysOnTopState)
  return isAlwaysOnTopState
})

ipcMain.handle('window:enterMiniMode', () => {
  if (mainWindow) {
    if (!mainWindow.isMaximized()) {
      normalBounds = mainWindow.getBounds()
    }
    mainWindow.setSize(360, 220)
    mainWindow.setAlwaysOnTop(true)
    isAlwaysOnTopState = true
  }
  return true
})

ipcMain.handle('window:exitMiniMode', () => {
  if (mainWindow) {
    mainWindow.setSize(normalBounds.width || 1040, normalBounds.height || 720)
    mainWindow.center()
    mainWindow.setAlwaysOnTop(false)
    isAlwaysOnTopState = false
  }
  return false
})

// IPC Handlers for Audio File & Folder Import + Metadata Parsing
ipcMain.handle('dialog:openAndParseAudioFiles', async () => {
  if (!mainWindow) return []
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Audio Files',
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Audio Files',
        extensions: ['mp3', 'wav', 'flac', 'ogg', 'aac', 'm4a', 'webm', 'opus']
      },
      { name: 'All Files', extensions: ['*'] }
    ]
  })

  if (result.canceled || result.filePaths.length === 0) return []

  const tracks = await Promise.all(result.filePaths.map((fp) => parseTrackMetadata(fp)))
  return tracks
})

ipcMain.handle('dialog:openAndParseAudioFolder', async () => {
  if (!mainWindow) return []
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Select Music Folder',
    properties: ['openDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) return []

  const folderPath = result.filePaths[0]
  const allAudioFiles = findAudioFilesInDir(folderPath)
  const tracks = await Promise.all(allAudioFiles.map((fp) => parseTrackMetadata(fp)))
  return tracks
})

ipcMain.handle('metadata:parseFilePaths', async (_, filePaths: string[]) => {
  return await Promise.all(filePaths.map((fp) => parseTrackMetadata(fp)))
})

// IPC Handler: Codex / AI Subscription Rate Limit & Quota Monitor
ipcMain.handle('quota:detectLocalCodex', async () => {
  return detectLocalCodexQuota()
})

ipcMain.handle('quota:fetchUsage', async (_, payload: { provider: string; token?: string; customUrl?: string }) => {
  const { provider, token, customUrl } = payload || {}

  // 1. Local Codex CLI Direct Auto-Detection Mode
  if (provider === 'local_codex' || provider === 'codex_cli' || (!provider && !token)) {
    const localCodex = detectLocalCodexQuota()
    if (localCodex.isLocalCliDetected) {
      return localCodex
    }
  }

  // 2. Demo Simulation Mode
  if (provider === 'demo' || !token || token.trim() === '') {
    const now = Date.now()
    const windowMs = 3 * 60 * 60 * 1000 // Standard 3-hour Codex/GPT window
    const currentWindowStart = Math.floor(now / windowMs) * windowMs
    const resetTimestamp = currentWindowStart + windowMs
    const elapsedMs = now - currentWindowStart
    const usedFraction = (elapsedMs / windowMs) * 0.7 + 0.15
    const usedPercentage = Math.round(Math.min(100, Math.max(0, usedFraction * 100)))
    const totalRequests = 80
    const remainingRequests = Math.round(totalRequests * (1 - usedPercentage / 100))

    const minsLeft = Math.max(1, Math.round((resetTimestamp - now) / 60000))
    const hours = Math.floor(minsLeft / 60)
    const mins = minsLeft % 60
    const resetTimeText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

    return {
      success: true,
      provider: 'demo',
      usedPercentage,
      remainingRequests,
      totalRequests,
      resetTimeText,
      resetTimestamp,
      statusMessage: 'Demo Simulation Active',
      lastUpdated: now
    }
  }

  try {
    let url = 'https://api.openai.com/v1/models'
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token.trim()}`,
      'User-Agent': 'LofiPlayer-CodexMonitor/1.0'
    }

    if (provider === 'copilot') {
      return await fetchGitHubCopilotQuota(token || '')
    }

    if (provider === 'openai_api') {
      return await fetchOpenAIQuota(token || '')
    }

    if (provider === 'zhipu' || provider === 'glm') {
      return await fetchZhipuQuota(token || '')
    }

    if (provider === 'custom' && customUrl) {
      url = customUrl
    } else if (provider === 'codex_subscription') {
      if (!token.startsWith('sk-')) {
        url = 'https://chatgpt.com/backend-api/models'
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers
    })

    const remainingReqHeader = response.headers.get('x-ratelimit-remaining-requests')
    const limitReqHeader = response.headers.get('x-ratelimit-limit-requests')
    const resetReqHeader = response.headers.get('x-ratelimit-reset-requests')
    const remainingTokHeader = response.headers.get('x-ratelimit-remaining-tokens')
    const limitTokHeader = response.headers.get('x-ratelimit-limit-tokens')

    const now = Date.now()

    if (response.ok || remainingReqHeader) {
      const remainingReq = remainingReqHeader ? parseInt(remainingReqHeader, 10) : 45
      const totalReq = limitReqHeader ? parseInt(limitReqHeader, 10) : 80
      const usedPct = Math.min(100, Math.max(0, Math.round(((totalReq - remainingReq) / (totalReq || 1)) * 100)))

      let resetTimeText = '3h 00m'
      let resetTimestamp = now + 3 * 3600 * 1000
      if (resetReqHeader) {
        resetTimeText = resetReqHeader
      }

      return {
        success: true,
        provider,
        usedPercentage: usedPct,
        remainingRequests: remainingReq,
        totalRequests: totalReq,
        remainingTokens: remainingTokHeader ? parseInt(remainingTokHeader, 10) : undefined,
        totalTokens: limitTokHeader ? parseInt(limitTokHeader, 10) : undefined,
        resetTimeText,
        resetTimestamp,
        statusMessage: 'Connected & Synced',
        lastUpdated: now
      }
    } else {
      const errText = await response.text().catch(() => '')
      return {
        success: false,
        provider,
        usedPercentage: 0,
        remainingRequests: 0,
        totalRequests: 0,
        resetTimeText: '--',
        resetTimestamp: now,
        statusMessage: `HTTP ${response.status}: ${response.statusText || errText || 'Unauthorized or invalid token'}`,
        lastUpdated: now
      }
    }
  } catch (err: any) {
    return {
      success: false,
      provider,
      usedPercentage: 0,
      remainingRequests: 0,
      totalRequests: 0,
      resetTimeText: '--',
      resetTimestamp: Date.now(),
      statusMessage: err?.message || 'Connection failed',
      lastUpdated: Date.now()
    }
  }
})

// IPC Handlers for YouTube Stream URL Resolution & Metadata
ipcMain.handle('youtube:resolveUrl', async (_, input: string) => {
  return await resolveYouTubeUrl(input)
})

ipcMain.handle('youtube:fetchMetadata', async (_, videoId: string) => {
  return await fetchYouTubeMetadata(videoId)
})

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron.lofiplayer')

  // Prevent YouTube embed blocking in Electron packaged app while preserving standard dev origins
  session.defaultSession.webRequest.onBeforeSendHeaders(
    {
      urls: [
        '*://*.youtube.com/*',
        '*://*.youtube-nocookie.com/*',
        '*://*.googlevideo.com/*',
        '*://*.ytimg.com/*'
      ]
    },
    (details, callback) => {
      const requestHeaders = { ...details.requestHeaders }
      const currentReferer = requestHeaders['Referer'] || requestHeaders['referer'] || ''

      // In production (file://) or if Referer is missing, provide standard origin
      if (!currentReferer || currentReferer.startsWith('file:') || currentReferer === 'null') {
        requestHeaders['Referer'] = 'https://localhost/'
      }

      callback({ requestHeaders })
    }
  )

  // Remove restrictive frame headers from YouTube responses
  session.defaultSession.webRequest.onHeadersReceived(
    {
      urls: ['*://*.youtube.com/*', '*://*.youtube-nocookie.com/*']
    },
    (details, callback) => {
      const responseHeaders = { ...details.responseHeaders }
      delete responseHeaders['x-frame-options']
      delete responseHeaders['X-Frame-Options']
      delete responseHeaders['frame-options']
      callback({ responseHeaders })
    }
  )

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window, { escToCloseWindow: false, zoom: false })
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
