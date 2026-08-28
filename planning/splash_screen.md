# Implementation Plan - Native Splash Screen with 3s Minimum Loading (`planning/splash_screen.md`)

## 1. Objective
Implement a smooth, cozy Native Dual-Window Splash Screen (Approach 1) for Lofi Player that launches instantly on startup, displays the user-provided `splash.png`, animated cozy Lofi loading elements, dynamic status text, and guarantees a minimum 3-second display duration before smoothly transitioning to the main application window.

---

## 2. Architecture & Design Specifications

### 2.1. Splash Window Properties
- **Size:** 480 × 320 px (or responsive card centered on screen)
- **Style:** Frameless (`frame: false`), transparent / rounded corners (`transparent: true`, `backgroundColor: '#14161f'`), centered (`center: true`), non-resizable, `alwaysOnTop: true`
- **Icon:** `resources/icon.ico`

### 2.2. Visual & UX Elements (`resources/splash.html`)
- **Background Banner / Artwork:** `splash.png` featured as a backdrop with smooth vignette / blur / glow overlay matching the app's dark cozy aesthetic (`#14161f`).
- **App Title & Branding:** `Lofi Player` with subtle glow and version `v1.0.0`.
- **Lofi Animated Equalizer Bars:** 5–7 cozy pastel equalizer bars pulsing rhythmically.
- **Dynamic Status Messages (Rotates every 900ms):**
  1. ☕ *Brewing fresh coffee...*
  2. 📼 *Tuning cassette tape & vinyl needle...*
  3. 🌧️ *Setting up rain & ambient sounds...*
  4. 🎧 *Ready for focus...*
- **Progress Bar:** Smooth 3-second animated gradient progress bar (`0% -> 100%`).
- **Fade-out Transition:** CSS opacity transition applied during the final 300ms before window destruction.

### 2.3. Dual-Window Lifecycle & Synchronization (`src/main/index.ts`)
- `createSplashWindow()` creates and shows `splashWindow` immediately upon `app.whenReady()`.
- `createWindow()` initializes `mainWindow` in background with `show: false`.
- Synchronize using `Promise.all`:
  ```ts
  const minTimer = new Promise((resolve) => setTimeout(resolve, 3000))
  const windowReady = new Promise<void>((resolve) => {
    mainWindow?.once('ready-to-show', () => resolve())
  })
  await Promise.all([minTimer, windowReady])
  ```
- Trigger graceful close on `splashWindow`, then `mainWindow.show()` and `mainWindow.focus()`.

---

## 3. Implementation Phases

### Phase 1: Resource Setup & Splash Screen UI
- Copy `splash.png` to `resources/splash.png`.
- Create `resources/splash.html` with self-contained CSS animations, equalizer bars, progress animation, dynamic status text, and modern dark Lofi theme.

### Phase 2: Main Process Window Lifecycle & Timing Integration
- Update [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts):
  - Add `createSplashWindow()` and lifecycle management.
  - Implement minimum 3-second timer + `ready-to-show` synchronization.
  - Seamlessly hand off focus from `splashWindow` to `mainWindow`.

### Phase 3: Verification & Packaging
- Run `npm run typecheck` to ensure 0 TypeScript errors.
- Run `npm run build` and `npm run build:win` to package the executable.
- Verify packaging and check output in `dist/`.

### Phase 4: Final Documentation & Status Update
- Update [task/splash_screen_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/splash_screen_task.md) and [WORK_LOG.md](file:///d:/Source/github/sorinoi/lofi-player/WORK_LOG.md).
