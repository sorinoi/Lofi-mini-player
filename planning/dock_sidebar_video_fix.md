# Plan: Fix YouTube Video Rendering in Right Sidebar Dock Mode

## 1. Problem Summary & Root Cause Analysis
When the user enters **Right Sidebar Dock Mode** (`appStore.isDockMode = true`) and switches the bottom mini-player widget to the **Video** view (`appStore.dockMiniPlayerView = 'video'`), the YouTube video is not displayed.

### Root Causes:
1. **Stacking Context & Z-Index Conflict (`App.vue`):**
   - The `DockSidebar` overlay container in `App.vue` has `z-index: 50` and opaque background colors (`bg-lofi-bg` and `bg-lofi-surface/95`).
   - The `.dock-video-fixed` CSS class applied to the persistent `<YouTubePlayer />` container had `z-index: 35`.
   - Because `z-index: 35` is lower than the DockSidebar container (`z-index: 50`), the video is rendered behind the DockSidebar's opaque background and completely hidden.
2. **Missing Dock Video Mode Detection in `YouTubePlayer.vue`:**
   - `YouTubePlayer.vue` contains desktop-specific UI elements (Title header, URL input, 24/7 curated presets grid, bookmarks list, and a min-height 360px video container).
   - In `YouTubePlayer.vue`, condition checks were only handling `(appStore.isMiniPlayer && appStore.miniPlayerView === 'video') || ytStore.isCinemaMode`, completely omitting `(appStore.isDockMode && appStore.dockMiniPlayerView === 'video')`.
   - As a result, even if positioned, `YouTubePlayer.vue` was attempting to render the entire desktop UI layout and hid the video container if `ytStore.displayMode` was not set to `'video'`.
3. **HUD Controls & Overlay Alignment:**
   - In `DockSidebar.vue`, the video slot rendered duplicate HUD controls behind which the video was meant to sit, but because of stacking contexts, overlaying controls and the video iframe directly inside `YouTubePlayer.vue` with `z-55` on `.dock-video-fixed` provides seamless, pixel-perfect rendering and interaction.

---

## 2. Structured Implementation Phases

### Phase 1: Planning, Task Initialization & Core Video Layering Fix
- Create `planning/dock_sidebar_video_fix.md` and `task/dock_sidebar_video_fix_task.md`.
- Update `WORK_LOG.md` Active Task Pointer.
- Update `src/renderer/src/App.vue`:
  - Increase `.dock-video-fixed` `z-index` from `35` to `55` (so it cleanly overlays the DockSidebar placeholder slot).
  - Ensure adaptive class switching between `.dock-video-fixed` and `.invisible-player` when changing views in Dock Mode.

### Phase 2: YouTubePlayer & DockSidebar Component Refinement
- Update `src/renderer/src/components/youtube/YouTubePlayer.vue`:
  - Define `isPureVideoMode` and `isDockVideoMode` computed properties.
  - Apply pure video styles and hide desktop-only controls/headers when in dock video mode.
  - Add dock video mode HUD overlay (Live badge, Title, Ghost Timer, Play/Pause, Channel info, Master volume slider, Mute).
  - Ensure video container takes full 100% width/height of the 112px dock video slot.
- Update `src/renderer/src/components/layout/DockSidebar.vue`:
  - Simplify the `dockMiniPlayerView === 'video'` slot to serve as the exact dimension placeholder (`h-28 rounded-xl`) for the overlay mount.

### Phase 3: Verification, Typecheck & Testing Gate
- Run `npm run typecheck` to verify 0 TypeScript/Vue compiler errors.
- Verify smooth transitions between Track, VU, Timer, and Video views in Dock Mode.
- Verify uninterrupted audio playback when switching tabs and expanding/docking the window.
- Verify Windows build readiness.
