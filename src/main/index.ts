import { app, shell, BrowserWindow, ipcMain, dialog, Rectangle, session, screen } from 'electron'
import { join, basename, extname } from 'path'
import { readdirSync, statSync } from 'fs'
import { createHash } from 'crypto'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import * as mm from 'music-metadata'
import { resolveYouTubeUrl, fetchYouTubeMetadata } from './youtubeResolver'
import { loadTodosFromFile, saveTodosToFile, openTodosFolder, TodoItem } from './todoStorage'
import { loadNotesFromFile, saveNotesToFile, openNotesFolder, NoteItem } from './noteStorage'
import { loadYouTubeBookmarksFromFile, saveYouTubeBookmarksToFile, openYouTubeBookmarksFolder, YouTubeBookmarkItem } from './youtubeBookmarkStorage'
import { appBarService } from './appBarService'

// Chromium Hardware Acceleration & GPU Video Decoding Performance Switches
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')
app.commandLine.appendSwitch('ignore-gpu-blocklist')
app.commandLine.appendSwitch('enable-gpu-rasterization')
app.commandLine.appendSwitch('enable-zero-copy')
app.commandLine.appendSwitch('enable-hardware-overlays', 'single-fullscreen,single-on-top,underlay')
app.commandLine.appendSwitch('enable-features', 'VaapiVideoDecoder,AcceleratedVideoDecode,AcceleratedVideoEncoder,CanvasOopRasterization,PlatformHEVCDecoderSupport')
app.commandLine.appendSwitch('disable-features', 'UseChromeOSDirectVideoDecoder')
app.commandLine.appendSwitch('enable-accelerated-video-decode')
app.commandLine.appendSwitch('enable-accelerated-mjpeg-decode')
app.commandLine.appendSwitch('disable-software-rasterizer')
app.commandLine.appendSwitch('disable-background-timer-throttling')
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows')
app.commandLine.appendSwitch('disable-renderer-backgrounding')

let splashWindow: BrowserWindow | null = null
let mainWindow: BrowserWindow | null = null
let normalBounds: Rectangle = { x: 100, y: 100, width: 1040, height: 720 }
let isAlwaysOnTopState = false
let isDockModeState = false

function createSplashWindow(): void {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 320,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    center: true,
    icon: join(__dirname, '../../resources/icon.ico'),
    webPreferences: {
      sandbox: false
    }
  })

  splashWindow.loadFile(join(__dirname, '../../resources/splash.html'))

  splashWindow.once('ready-to-show', () => {
    splashWindow?.show()
  })
}

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
    icon: join(__dirname, '../../resources/icon.ico'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false, // Permits local audio streaming smoothly
      backgroundThrottling: false, // Keep media and timer playback smooth across all modes
      experimentalFeatures: true
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('restore', () => {
    if (isDockModeState && mainWindow) {
      appBarService.registerAppBar(mainWindow, 340)
    }
  })

  mainWindow.on('close', () => {
    if (isDockModeState && mainWindow) {
      appBarService.unregisterAppBar(mainWindow)
    }
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
  if (isDockModeState && mainWindow) {
    appBarService.unregisterAppBar(mainWindow)
  }
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
  if (isDockModeState && mainWindow) {
    appBarService.unregisterAppBar(mainWindow)
  }
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

function enterDockMode(): boolean {
  if (mainWindow) {
    if (!isDockModeState) {
      if (mainWindow.isMaximized()) {
        normalBounds = mainWindow.getNormalBounds ? mainWindow.getNormalBounds() : mainWindow.getBounds()
        mainWindow.unmaximize()
      } else {
        normalBounds = mainWindow.getBounds()
      }
    }
    const DOCK_WIDTH = 340
    mainWindow.setMinimumSize(100, 100)
    const registered = appBarService.registerAppBar(mainWindow, DOCK_WIDTH)
    if (!registered) {
      // Fallback positioning if AppBar registration fails (e.g. non-Windows)
      const currentBounds = mainWindow.getBounds()
      const display = screen.getDisplayNearestPoint({
        x: currentBounds.x + currentBounds.width / 2,
        y: currentBounds.y + currentBounds.height / 2
      })
      const { bounds, workArea } = display
      mainWindow.setBounds({
        x: Math.round(bounds.x + bounds.width - DOCK_WIDTH),
        y: Math.round(workArea.y),
        width: DOCK_WIDTH,
        height: Math.round(workArea.height)
      })
    }
    mainWindow.setAlwaysOnTop(true)
    isAlwaysOnTopState = true
    isDockModeState = true
  }
  return true
}

function exitDockMode(): boolean {
  if (mainWindow) {
    if (isDockModeState) {
      appBarService.unregisterAppBar(mainWindow)
    }
    isDockModeState = false
    mainWindow.setMinimumSize(340, 200)
    mainWindow.setBounds({
      x: normalBounds.x,
      y: normalBounds.y,
      width: normalBounds.width || 1040,
      height: normalBounds.height || 720
    })
    mainWindow.setAlwaysOnTop(false)
    isAlwaysOnTopState = false
  }
  return false
}

function toggleDockMode(): boolean {
  if (isDockModeState) {
    return exitDockMode()
  } else {
    return enterDockMode()
  }
}

ipcMain.handle('window:enterMiniMode', () => {
  if (mainWindow) {
    if (!isDockModeState && !mainWindow.isMaximized()) {
      normalBounds = mainWindow.getBounds()
    }
    if (isDockModeState) {
      appBarService.unregisterAppBar(mainWindow)
    }
    isDockModeState = false
    mainWindow.setSize(360, 220)
    mainWindow.setAlwaysOnTop(true)
    isAlwaysOnTopState = true
  }
  return true
})

ipcMain.handle('window:exitMiniMode', () => {
  if (mainWindow) {
    isDockModeState = false
    mainWindow.setSize(normalBounds.width || 1040, normalBounds.height || 720)
    mainWindow.center()
    mainWindow.setAlwaysOnTop(false)
    isAlwaysOnTopState = false
  }
  return false
})

ipcMain.handle('window:enterDockMode', () => {
  return enterDockMode()
})

ipcMain.handle('window:exitDockMode', () => {
  return exitDockMode()
})

ipcMain.handle('window:toggleDockMode', () => {
  return toggleDockMode()
})

ipcMain.handle('window:isDockMode', () => {
  return isDockModeState
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



// IPC Handlers for YouTube Stream URL Resolution & Metadata
ipcMain.handle('youtube:resolveUrl', async (_, input: string) => {
  return await resolveYouTubeUrl(input)
})

ipcMain.handle('youtube:fetchMetadata', async (_, videoId: string) => {
  return await fetchYouTubeMetadata(videoId)
})

// IPC Handlers for JSON-based To-Do / Focus Task Manager
ipcMain.handle('todos:load', async () => {
  return loadTodosFromFile()
})

ipcMain.handle('todos:save', async (_, todos: TodoItem[]) => {
  return saveTodosToFile(todos)
})

ipcMain.handle('todos:openFolder', async () => {
  openTodosFolder()
})

// IPC Handlers for JSON-based Note Record / Quick Notes
ipcMain.handle('notes:load', async () => {
  return loadNotesFromFile()
})

ipcMain.handle('notes:save', async (_, notes: NoteItem[]) => {
  return saveNotesToFile(notes)
})

ipcMain.handle('notes:openFolder', async () => {
  openNotesFolder()
})

// IPC Handlers for JSON-based YouTube Bookmarks
ipcMain.handle('youtube:loadBookmarks', async () => {
  return loadYouTubeBookmarksFromFile()
})

ipcMain.handle('youtube:saveBookmarks', async (_, bookmarks: YouTubeBookmarkItem[]) => {
  return saveYouTubeBookmarksToFile(bookmarks)
})

ipcMain.handle('youtube:openBookmarksFolder', async () => {
  openYouTubeBookmarksFolder()
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

  // 1. Create and show Splash Window immediately
  createSplashWindow()

  // 2. Initialize Main Window in background
  createWindow()

  // 3. Guarantee minimum 3-second splash duration and ensure mainWindow is ready
  const minTimer = new Promise<void>((resolve) => setTimeout(resolve, 3000))
  const mainReady = new Promise<void>((resolve) => {
    if (!mainWindow) {
      resolve()
      return
    }
    if (mainWindow.isVisible()) {
      resolve()
      return
    }
    mainWindow.once('ready-to-show', () => resolve())
  })

  Promise.all([minTimer, mainReady]).then(() => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.webContents
        .executeJavaScript("document.body.classList.add('fade-out');")
        .catch(() => {})
      setTimeout(() => {
        if (splashWindow && !splashWindow.isDestroyed()) {
          splashWindow.close()
          splashWindow = null
        }
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show()
          mainWindow.focus()
        }
      }, 300)
    } else {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.show()
        mainWindow.focus()
      }
    }
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
      mainWindow?.once('ready-to-show', () => {
        mainWindow?.show()
      })
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  if (isDockModeState && mainWindow && !mainWindow.isDestroyed()) {
    appBarService.unregisterAppBar(mainWindow)
  }
})
