# Implementation Plan - Custom App Icon Integration (`planning/app_icon_customization.md`)

## 1. Objective
Integrate the user-provided `cga-lofi.ico` into the Lofi Player Desktop application so that the custom icon is applied across:
- The compiled Windows Installer (`dist/Lofi Player Setup 1.0.0.exe`)
- The standalone executable (`dist/win-unpacked/LofiPlayer.exe`)
- Windows Desktop / Start Menu shortcuts
- The Electron runtime window & Taskbar

---

## 2. Target Files & Resources
- **Source Icon:** `cga-lofi.ico` (Root workspace)
- **Destination Resources:**
  - `build/icon.ico` (for electron-builder)
  - `resources/icon.ico` (for runtime BrowserWindow & packaging assets)
- **Configuration & Source Files:**
  - [electron-builder.yml](file:///d:/Source/github/sorinoi/lofi-player/electron-builder.yml): Configure `win.icon`
  - [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts): Configure `icon` in `BrowserWindow` options

---

## 3. Implementation Phases

### Phase 1: Resource Setup & Configuration
- Create `build/` and `resources/` directories if needed.
- Copy `cga-lofi.ico` to `build/icon.ico` and `resources/icon.ico`.
- Update `electron-builder.yml` to specify `icon: build/icon.ico`.
- Update `src/main/index.ts` to supply `icon: join(__dirname, '../../resources/icon.ico')` to `BrowserWindow`.

### Phase 2: Build & Packaging Verification
- Execute `npm run typecheck` to verify zero TypeScript errors.
- Execute `npm run build:win` to package the executable and generate the new installer.
- Verify that `dist/Lofi Player Setup 1.0.0.exe` and `dist/win-unpacked/LofiPlayer.exe` are built successfully with the new icon.

### Phase 3: Task Completion & Work Log Update
- Update [task/app_icon_customization_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/app_icon_customization_task.md) and [WORK_LOG.md](file:///d:/Source/github/sorinoi/lofi-player/WORK_LOG.md).
