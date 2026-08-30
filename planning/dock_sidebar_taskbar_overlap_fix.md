# Plan: Fix Windows Taskbar Overlapping Dock Sidebar Application (`planning/dock_sidebar_taskbar_overlap_fix.md`)

## 1. Problem Statement & Root Cause Analysis
- **Problem:** When activating **Dock Sidebar Mode** on Windows, the Windows Taskbar (at the bottom of the screen) overlaps the bottom part of the application. As a result, the bottom footer containing the audio playback controls (Play/Pause, Seek, Volume) and the mini YouTube video player (`.dock-video-fixed`) are partially obscured or covered by the Windows Taskbar.
- **Root Cause:**
  1. In `src/main/appBarService.ts` and `src/main/index.ts`, the vertical dimensions for Dock Mode were set using `bounds.y` and `bounds.height` (the full physical monitor resolution, e.g. `1080px`), instead of `display.workArea.y` and `display.workArea.height` (e.g. `1032px` on 1080p with a 48px taskbar).
  2. Because the window height was set to `bounds.height` (1080px), the bottom of the window extended underneath the Windows Taskbar.
  3. Win32 `SHAppBarMessage` (`ABM_QUERYPOS` / `ABM_SETPOS`) was sent `rc.bottom = targetY + bounds.height`, which forced the AppBar reservation to extend across the taskbar boundary, allowing the taskbar Z-order to overlay the application footer.

## 2. Proposed Solution
1. **Vertical Bounds Adjustment (`workArea` for Height & Y-coordinate):**
   - Use `display.workArea.y` for `targetY`.
   - Use `display.workArea.height` for `targetHeight`.
   - Keep `targetX = Math.round(bounds.x + bounds.width - width)` to ensure the window remains pinned to the true right edge of the monitor.
2. **Win32 AppBar Message Alignment:**
   - Update `APPBARDATA` in `appBarService.ts` to register `rc.top = targetY` and `rc.bottom = targetY + targetHeight`, reserving only the available vertical workArea above the Taskbar.
   - Position the native window via `SetWindowPos` and `setBounds` with `targetHeight = workArea.height`.
3. **Fallback Position Sync:**
   - Update the non-Windows / fallback branch in `src/main/index.ts` to use `workArea.y` and `workArea.height` for consistent behavior.

## 3. Phase Breakdown
- **Phase 1: Planning & Setup**
  - Create plan in `planning/dock_sidebar_taskbar_overlap_fix.md`
  - Create task tracker in `task/dock_sidebar_taskbar_overlap_fix_task.md`
  - Update `WORK_LOG.md` with Active Task Pointer
- **Phase 2: Code Implementation**
  - Update `src/main/appBarService.ts` to calculate `targetY` and `targetHeight` using `display.workArea`
  - Update fallback positioning in `src/main/index.ts`
- **Phase 3: Verification & Build**
  - Run `npm run typecheck`
  - Run `npm run build`
  - Verify layout integrity and report to user
