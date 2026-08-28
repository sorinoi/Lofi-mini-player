/**
 * AppBar Service for Windows Desktop Screen Reservation
 * Wraps Windows Shell32 SHAppBarMessage API & User32 SetWindowPos using Koffi C-FFI
 */

import { BrowserWindow, screen } from 'electron'

// Win32 AppBar Constants
const ABM_NEW = 0x00000000
const ABM_REMOVE = 0x00000001
const ABM_QUERYPOS = 0x00000002
const ABM_SETPOS = 0x00000003
const ABM_ACTIVATE = 0x00000006
const ABE_RIGHT = 2

// Win32 SetWindowPos Constants
const HWND_TOPMOST = -1
const SWP_SHOWWINDOW = 0x0040
const SWP_FRAMECHANGED = 0x0020
const SWP_NOACTIVATE = 0x0010

interface Rect {
  left: number
  top: number
  right: number
  bottom: number
}

interface AppBarData {
  cbSize: number
  hWnd: number | bigint
  uCallbackMessage: number
  uEdge: number
  rc: Rect
  lParam: number | bigint
}

class AppBarService {
  private isRegisteredState = false
  private koffiInstance: any = null
  private SHAppBarMessage: any = null
  private SetWindowPos: any = null
  private APPBARDATA_TYPE: any = null
  private isInitialized = false

  constructor() {
    this.initNativeBindings()
  }

  private initNativeBindings(): void {
    if (process.platform !== 'win32') return

    try {
      // Dynamic require so non-Windows platforms don't fail
      const koffi = require('koffi')
      this.koffiInstance = koffi

      const RECT = koffi.struct('RECT', {
        left: 'long',
        top: 'long',
        right: 'long',
        bottom: 'long'
      })

      this.APPBARDATA_TYPE = koffi.struct('APPBARDATA', {
        cbSize: 'uint32',
        hWnd: 'intptr_t',
        uCallbackMessage: 'uint32',
        uEdge: 'uint32',
        rc: RECT,
        lParam: 'intptr_t'
      })

      const shell32 = koffi.load('shell32.dll')
      this.SHAppBarMessage = shell32.func(
        'uintptr_t __stdcall SHAppBarMessage(uint32 dwMessage, _Inout_ APPBARDATA *pData)'
      )

      const user32 = koffi.load('user32.dll')
      this.SetWindowPos = user32.func(
        'bool __stdcall SetWindowPos(intptr_t hWnd, intptr_t hWndInsertAfter, int X, int Y, int cx, int cy, uint32 uFlags)'
      )

      this.isInitialized = true
    } catch (err) {
      console.warn('[AppBarService] Failed to initialize koffi native bindings:', err)
      this.isInitialized = false
    }
  }

  private getHwnd(window: BrowserWindow): any {
    if (!this.koffiInstance) return 0
    const hwndBuf = window.getNativeWindowHandle()
    try {
      return this.koffiInstance.decode(hwndBuf, 'intptr_t')
    } catch {
      return process.arch === 'x64' ? hwndBuf.readBigInt64LE() : hwndBuf.readInt32LE()
    }
  }

  /**
   * Registers the window as a Windows AppBar, claims screen space on the right edge,
   * and forces the window to move into the newly reserved space.
   */
  public registerAppBar(window: BrowserWindow, width: number = 340): boolean {
    if (!this.isInitialized || !window || window.isDestroyed()) {
      return false
    }

    try {
      const hwnd = this.getHwnd(window)
      const currentBounds = window.getBounds()
      const display = screen.getDisplayNearestPoint({
        x: currentBounds.x + currentBounds.width / 2,
        y: currentBounds.y + currentBounds.height / 2
      })
      const { bounds } = display

      const targetX = Math.round(bounds.x + bounds.width - width)
      const targetY = Math.round(bounds.y)
      const targetWidth = Math.round(width)
      const targetHeight = Math.round(bounds.height)

      const abd: AppBarData = {
        cbSize: this.koffiInstance.sizeof(this.APPBARDATA_TYPE),
        hWnd: hwnd,
        uCallbackMessage: 0,
        uEdge: ABE_RIGHT,
        rc: {
          left: targetX,
          top: targetY,
          right: targetX + targetWidth,
          bottom: targetY + targetHeight
        },
        lParam: 0
      }

      // 1. Register AppBar if not registered
      if (!this.isRegisteredState) {
        this.SHAppBarMessage(ABM_NEW, abd)
        this.isRegisteredState = true
      }

      // 2. Query suitable position & size
      this.SHAppBarMessage(ABM_QUERYPOS, abd)

      // Ensure exact requested width and coordinates on right edge
      abd.rc.left = targetX
      abd.rc.top = targetY
      abd.rc.right = targetX + targetWidth
      abd.rc.bottom = targetY + targetHeight

      // 3. Set position (locks and reserves desktop space on Windows Explorer)
      this.SHAppBarMessage(ABM_SETPOS, abd)

      // 4. Activate AppBar
      this.SHAppBarMessage(ABM_ACTIVATE, abd)

      // 5. Position window reliably (immediate + staggered retries to overcome unmaximize race condition)
      const applyBounds = (): void => {
        if (!window || window.isDestroyed()) return
        try {
          window.setMinimumSize(100, 100)
          if (this.SetWindowPos) {
            this.SetWindowPos(
              hwnd,
              HWND_TOPMOST,
              targetX,
              targetY,
              targetWidth,
              targetHeight,
              SWP_SHOWWINDOW | SWP_FRAMECHANGED | SWP_NOACTIVATE
            )
          }
          window.setBounds({
            x: targetX,
            y: targetY,
            width: targetWidth,
            height: targetHeight
          })
        } catch {
          // ignore disposed window error
        }
      }

      applyBounds()
      setTimeout(applyBounds, 60)
      setTimeout(applyBounds, 180)

      return true
    } catch (err) {
      console.warn('[AppBarService] Error registering AppBar:', err)
      return false
    }
  }

  /**
   * Unregisters the AppBar and restores the full Windows Desktop workArea.
   */
  public unregisterAppBar(window: BrowserWindow): boolean {
    if (!this.isInitialized || !this.isRegisteredState || !window || window.isDestroyed()) {
      this.isRegisteredState = false
      return false
    }

    try {
      const hwnd = this.getHwnd(window)
      const abd: AppBarData = {
        cbSize: this.koffiInstance.sizeof(this.APPBARDATA_TYPE),
        hWnd: hwnd,
        uCallbackMessage: 0,
        uEdge: ABE_RIGHT,
        rc: { left: 0, top: 0, right: 0, bottom: 0 },
        lParam: 0
      }

      this.SHAppBarMessage(ABM_REMOVE, abd)
      this.isRegisteredState = false
      return true
    } catch (err) {
      console.warn('[AppBarService] Error unregistering AppBar:', err)
      this.isRegisteredState = false
      return false
    }
  }

  public get isRegistered(): boolean {
    return this.isRegisteredState
  }
}

export const appBarService = new AppBarService()
