# Plan: Windows Desktop Space Reservation (AppBar) for Dock Sidebar Mode

## 1. Goal & Architecture Overview
Enable **true desktop screen space reservation (Windows AppBar)** when the application is in **Right Sidebar Dock Mode** (`appStore.isDockMode = true`).

When Dock Mode is active:
- The app registers itself as an **Application Desktop Toolbar (AppBar)** on Windows via the Win32 `SHAppBarMessage` API.
- Windows reduces its global desktop `WorkArea` on the primary/current monitor by `340px` from the right edge.
- Other applications that are maximized or resized will respect this boundary and will **NOT overlap or slip behind** the Lofi Player Dock Sidebar.
- When exiting Dock Mode, minimizing, or quitting the app, the AppBar is safely unregistered (`ABM_REMOVE`), immediately restoring the full desktop `WorkArea`.

---

## 2. Implementation Approach: `koffi` (C-FFI for Node.js / Electron)
- We will install **`koffi`**, the fastest, most reliable prebuilt C-FFI library for Node.js and Electron on Windows (x64).
- We will create a dedicated module `src/main/appBarService.ts` to manage the Win32 AppBar lifecycle.
- We will connect `appBarService.ts` to `enterDockMode()`, `exitDockMode()`, `mainWindow.on('close')`, `app.on('before-quit')`, and multi-monitor movement events in `src/main/index.ts`.

---

## 3. Structured Implementation Phases

### Phase 1: Dependency Installation & Win32 AppBar Service Module
- Install `koffi` dependency.
- Create `src/main/appBarService.ts`:
  - Define `RECT` and `APPBARDATA` structures.
  - Bind `SHAppBarMessage` from `shell32.dll`.
  - Implement `registerAppBar(window: BrowserWindow, width: number): boolean`.
  - Implement `unregisterAppBar(window: BrowserWindow): boolean`.
  - Implement `updateAppBarPosition(window: BrowserWindow, width: number): void`.

### Phase 2: Electron Main Process Integration & Lifecycle Management
- Update `src/main/index.ts`:
  - Call `appBarService.registerAppBar` when entering Dock Mode (`enterDockMode`).
  - Call `appBarService.unregisterAppBar` when exiting Dock Mode (`exitDockMode`), minimizing window, or on window close/app quit.
  - Handle screen resolution / display bounds changes to re-adjust AppBar reservation dynamically.

### Phase 3: Verification, Typecheck & Testing Gate
- Run `npm run typecheck` to verify 0 compiler errors.
- Run `npm run build` to verify packaging and bundling with `koffi`.
- Verify desktop space reservation behavior and safe cleanup.
