# Plan: YouTube Full-Width Layout Optimization for Fullscreen & Maximized Displays

## 1. Overview & Problem Statement
Currently, in the standard YouTube Stream Player view (`YouTubePlayer.vue`), the main root container is constrained by `max-w-6xl mx-auto` (`max-width: 1152px; margin-left: auto; margin-right: auto`).
When the application is maximized or viewed on large / ultra-wide screens (e.g. 1080p, 1440p, 4K), the content remains centered in a 1152px box, leaving substantial empty space on both the left and right margins.

The objective is to make the YouTube view fluid and take full advantage of the entire available screen real estate when maximized, ensuring the video player, header, curated presets, and bookmarks grid expand cleanly and responsively across the entire area.

---

## 2. Proposed Changes & Implementation Phases

### Phase 1: YouTube Full-Width Container & Responsive Grid Refactor
- **File:** `src/renderer/src/components/youtube/YouTubePlayer.vue`
- **Actions:**
  1. Remove `max-w-6xl mx-auto` from the main container in `YouTubePlayer.vue`, replacing it with `w-full` with fluid padding (`p-4 md:p-6 lg:p-8`).
  2. Optimize the main player card and 16:9 video container to scale smoothly across wide viewports.
  3. Update the Curated Stations grid layout (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`) so cards distribute evenly across the full width without unnecessary blank gaps.
  4. Update the Saved Bookmarks grid layout (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`) to utilize full width effectively.
  5. Refine header flex layout and search/URL input sizing to look modern and proportional in wide view.

### Phase 2: Verification & Documentation
- **Actions:**
  1. Execute `npm run typecheck` to confirm 0 TypeScript / Vue template errors.
  2. Execute `npm run build` to confirm clean Electron production bundle compilation.
  3. Update `task/youtube_fullscreen_fullwidth_task.md` with completed phases.
  4. Update `WORK_LOG.md` and `CHANGELOG.md` (`## [Unreleased]`).

---

## 3. Verification Plan
- **Typecheck:** `npm run typecheck`
- **Build:** `npm run build`
