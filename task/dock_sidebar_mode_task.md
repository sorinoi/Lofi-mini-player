# Task: Right Sidebar Dock Mode for To-Do & Music (`dock_sidebar_mode`)

- **Associated Plan:** [planning/dock_sidebar_mode.md](file:///d:/Source/github/sorinoi/lofi-player/planning/dock_sidebar_mode.md)
- **Current Phase:** Phase 4 - Verification & Build Complete
- **Status:** 🟢 Completed (Installer Ready)

---

## 1. Completed Tasks
- [x] Analyzed requirements and multi-monitor screen geometry calculations for Dock mode
- [x] Initialized planning document `planning/dock_sidebar_mode.md`
- [x] Initialized task tracker `task/dock_sidebar_mode_task.md`
- [x] Integrated Quad-View Mini-Player widget (`[Track] [VU] [Timer] [Video]`) into bottom dock design
- [x] Added `window:enterDockMode`, `window:exitDockMode`, `window:toggleDockMode`, and `window:isDockMode` in `src/main/index.ts`
- [x] Exposed dock mode methods in `src/preload/index.ts` and `src/preload/index.d.ts`
- [x] Added `isDockMode`, `dockMiniPlayerView`, and toggle actions in `src/renderer/src/stores/app.ts`
- [x] Created dedicated component `src/renderer/src/components/layout/DockSidebar.vue` with:
  - Top Drag Titlebar + Window controls (Pin, Expand `[⤢]`, Minimize, Close)
  - Full-height scrollable Focus Tasks / To-Do stream with Quick-Add (Priority & Category pills) and Filters (All/Active/Done)
  - Bottom Quad-View Mini-Player widget (`Track`, `VU`, `Timer`, `Video`)
- [x] Integrated Dock trigger buttons in `CustomTitlebar.vue` and `TodoView.vue`
- [x] Added global/app keyboard shortcut <kbd>Alt</kbd> + <kbd>D</kbd> in `shortcutService.ts`
- [x] Updated `App.vue` layout to seamlessly switch into `DockSidebar` and handle adaptive video DOM mounting (`.dock-video-fixed`)
- [x] Passed `npm run typecheck` (0 errors)
- [x] Built Windows installer successfully via `npm run build:win` -> `dist/Lofi Player Setup 1.1.0.exe`

---

## 2. Next Actions
- [x] All planned tasks completed. Release ready.

---

## 3. Phase Checklist
### Phase 1: Main Process Window Bounds & Screen API
- [x] Implement `enterDockMode` & `exitDockMode` in `src/main/index.ts`
- [x] Update `src/preload/index.ts` and `src/preload/index.d.ts`

### Phase 2: App Store & State Management
- [x] Add `isDockMode` ref, `dockMiniPlayerView` ref, and toggle functions in `src/renderer/src/stores/app.ts`

### Phase 3: Dedicated DockSidebar UI Component
- [x] Create `src/renderer/src/components/layout/DockSidebar.vue`
- [x] Implement full-height scrollable To-Do stream with Quick-Add & Filters
- [x] Implement bottom Quad-View Mini-Player widget with 4 Switcher tabs (`Track`, `VU`, `Timer`, `Video`)
- [x] Add trigger buttons in `CustomTitlebar.vue` and `TodoView.vue`
- [x] Integrate into `src/renderer/src/App.vue` with adaptive video layout

### Phase 4: Verification & Build
- [x] Run `npm run typecheck`
- [x] Run `npm run build:win`
- [x] Verify window snap to right edge and smooth restore

---

## 4. Modified & Created Files
- [NEW] `planning/dock_sidebar_mode.md` - Implementation plan
- [NEW] `task/dock_sidebar_mode_task.md` - Task tracker
- [NEW] `src/renderer/src/components/layout/DockSidebar.vue` - Dedicated vertical dock sidebar with bottom mini-player
- [MOD] `src/main/index.ts` - Main process bounds calculation and docking handlers
- [MOD] `src/preload/index.ts` - Preload dock APIs
- [MOD] `src/preload/index.d.ts` - Preload type definitions
- [MOD] `src/renderer/src/stores/app.ts` - Dock mode and dock mini-player state
- [MOD] `src/renderer/src/components/layout/CustomTitlebar.vue` - Dock button
- [MOD] `src/renderer/src/components/todo/TodoView.vue` - Dock button
- [MOD] `src/renderer/src/services/shortcutService.ts` - Alt+D shortcut
- [MOD] `src/renderer/src/App.vue` - App layout integration and adaptive video view
- [MOD] `WORK_LOG.md` - Activity log and active task pointer

---

## 5. Plan & Workflow Adjustments (Changelog)
- **2026-08-28:** Designed Right Sidebar Dock Mode with multi-monitor display auto-alignment and vertical task management.
- **2026-08-28 (Adjustment):** Added Quad-View Mini-Player Widget at bottom of DockSidebar (`Track`, `VU Visualizer`, `Focus Timer`, and `Live YouTube Video`).
