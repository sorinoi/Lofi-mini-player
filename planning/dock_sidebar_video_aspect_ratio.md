# Plan: Adjust Dock Sidebar YouTube Video Height to 16:9 Aspect Ratio

## 1. Requirement & Problem Analysis
- In **Right Sidebar Dock Mode** (`appStore.isDockMode = true`), the dock window width is fixed at `340px`.
- The footer container padding is `p-2.5` (10px on each side), yielding an inner width of `320px` (`340px - 20px`).
- The previous video height was fixed at `h-28` (`112px`), which caused the standard 16:9 YouTube video stream to be letterboxed / squished horizontally (an aspect ratio of ~2.85:1 instead of 16:9).
- **Target Goal:** Increase the video height in Dock Sidebar mode to `180px` to achieve the true 16:9 widescreen ratio (`320px × 180px`) matching the width of the dock sidebar screen mode.

---

## 2. Implementation Phases

### Phase 1: Planning & Task Setup
- Create plan document `planning/dock_sidebar_video_aspect_ratio.md` and task tracker `task/dock_sidebar_video_aspect_ratio_task.md`.
- Register active task pointer in `WORK_LOG.md`.

### Phase 2: Dimension Updates in CSS & Component Layout
- Update `src/renderer/src/App.vue`:
  - Adjust `.dock-video-fixed` CSS `height` from `112px` to `180px`.
- Update `src/renderer/src/components/layout/DockSidebar.vue`:
  - Adjust View 4 video placeholder container class from `h-28` to `h-[180px]`.
- Verify `src/renderer/src/components/youtube/YouTubePlayer.vue`:
  - Ensure overlay HUD, Ghost Timer, and video iframe fill and align with the `180px` 16:9 container.

### Phase 3: Verification & Quality Gate
- Run `npm run typecheck` to ensure 0 TypeScript / Vue errors.
- Run `npm run build` to confirm build integrity.
- Update task log and work log.
