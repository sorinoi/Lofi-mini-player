# Task: Right Sidebar Dock Mode for To-Do & Music (`dock_sidebar_mode`)

- **Associated Plan:** [planning/dock_sidebar_mode.md](file:///d:/Source/github/sorinoi/lofi-player/planning/dock_sidebar_mode.md)
- **Current Phase:** Phase 1 - Architecture & Design Approval
- **Status:** 🟡 Pending User Approval

---

## 1. Completed Tasks
- [x] Analyzed requirements and multi-monitor screen geometry calculations for Dock mode
- [x] Initialized planning document `planning/dock_sidebar_mode.md`
- [x] Initialized task tracker `task/dock_sidebar_mode_task.md`

---

## 2. Next Actions (Upcoming Tasks)
- [ ] Add `window:enterDockMode` and `window:exitDockMode` in `src/main/index.ts`
- [ ] Expose dock mode methods in `src/preload/index.ts` and `src/preload/index.d.ts`
- [ ] Add `isDockMode` and `toggleDockMode` in `src/renderer/src/stores/app.ts`
- [ ] Create dedicated component `src/renderer/src/components/layout/DockSidebar.vue`
- [ ] Integrate Dock trigger buttons in `CustomTitlebar.vue` and `TodoView.vue`
- [ ] Update `App.vue` layout to seamlessly switch into `DockSidebar`
- [ ] Run `npm run typecheck` and `npm run build:win`

---

## 3. Phase Checklist
### Phase 1: Main Process Window Bounds & Screen API
- [ ] Implement `enterDockRightMode` & `exitDockRightMode` in `src/main/index.ts`
- [ ] Update `src/preload/index.ts` and `src/preload/index.d.ts`

### Phase 2: App Store & State Management
- [ ] Add `isDockMode` ref and toggle function in `src/renderer/src/stores/app.ts`

### Phase 3: Dedicated DockSidebar UI Component
- [ ] Create `src/renderer/src/components/layout/DockSidebar.vue`
- [ ] Add compact music player header, timer pill, and full-height scrollable To-Do stream
- [ ] Add trigger buttons in `CustomTitlebar.vue` and `TodoView.vue`
- [ ] Integrate into `src/renderer/src/App.vue`

### Phase 4: Verification & Build
- [ ] Run `npm run typecheck`
- [ ] Run `npm run build:win`
- [ ] Verify window snap to right edge and smooth restore

---

## 4. Modified & Created Files
- [NEW] `planning/dock_sidebar_mode.md` - Implementation plan
- [NEW] `task/dock_sidebar_mode_task.md` - Task tracker
- [NEW] `src/renderer/src/components/layout/DockSidebar.vue` - Dedicated vertical dock sidebar
- [MOD] `src/main/index.ts` - Main process bounds calculation and docking handlers
- [MOD] `src/preload/index.ts` - Preload dock APIs
- [MOD] `src/preload/index.d.ts` - Preload type definitions
- [MOD] `src/renderer/src/stores/app.ts` - Dock mode state
- [MOD] `src/renderer/src/components/layout/CustomTitlebar.vue` - Dock button
- [MOD] `src/renderer/src/components/todo/TodoView.vue` - Dock button
- [MOD] `src/renderer/src/App.vue` - App layout integration
- [MOD] `WORK_LOG.md` - Activity log and active task pointer

---

## 5. Plan & Workflow Adjustments (Changelog)
- **2026-08-28:** Designed Right Sidebar Dock Mode with multi-monitor display auto-alignment and vertical task management.
