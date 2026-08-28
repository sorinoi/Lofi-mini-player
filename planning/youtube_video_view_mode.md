# Design & Implementation Plan: Dedicated YouTube Video Screen Mode (`planning/youtube_video_view_mode.md`)

## 1. Background & Problem Statement
Currently in the application:
1. In the **Mini-Player Widget** (360×220 px), there are only 3 views (*Track*, *VU*, *Timer*). When YouTube stream is playing, it only displays a static thumbnail without the actual live video stream.
2. In the **Main Desktop Player**, when on the *Now Playing & VU* tab or other tabs, the YouTube video is hidden off-screen (audio continues playing in background). Users want an instant, one-click button/mode to display and focus exclusively on the YouTube video stream without clunky navigation.

---

## 2. Proposed Architecture & Feature Design

### Feature 1: Mini-Player Quad-View Widget (`MiniPlayer.vue`)
- Extend `currentMiniView` from 3 views (`music` | `vu` | `timer`) to 4 views:
  `music` | `vu` | `timer` | `video`
- When `video` mode is selected in the Mini-Player:
  - The live YouTube iframe video is rendered directly inside the compact floating window (360×220 px).
  - Overlay floating hover controls (Play/Pause, Mute/Volume slider, Expand back to desktop).
  - Enables true Picture-in-Picture (Always on Top) YouTube Lofi streaming while working or studying.

### Feature 2: Dedicated Video Screen Button & Quick-Switch Navigation (`App.vue` & `CustomTitlebar.vue`)
- **Bottom Bar / Now Playing Quick Action Button:** When YouTube is active/playing, display a dedicated `"📺 Show YouTube Video"` button next to the visualizer and track info. Clicking it instantly switches to the YouTube view mode.
- **Pure Video / Cinema Mode Button in YouTube Tab (`YouTubePlayer.vue`):** Add a "Cinema / Full Focus Mode" toggle that collapses the sidebar/footer into a minimalist, borderless video theater screen.

---

## 3. Implementation Phases

### Phase 1: Store & State Management Updates
- Update [src/renderer/src/stores/app.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/stores/app.ts) and [src/renderer/src/stores/youtube.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/stores/youtube.ts) to support dedicated video view states and seamless iframe container parenting.

### Phase 2: Mini-Player Quad-View & Live Video Stream Integration
- Update [src/renderer/src/components/layout/MiniPlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/MiniPlayer.vue):
  - Add `Video` button in header view switcher.
  - Mount/Reparent YouTube player cleanly or sync viewport when switching between Mini Video mode and Main Video mode.
  - Implement smooth hover HUD controls for Mini Video mode.

### Phase 3: Main UI Quick-Switch Button & Cinema Mode
- Update [src/renderer/src/App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue):
  - Add Quick-Switch Video button in Now Playing tab and Bottom Player Bar.
- Update [src/renderer/src/components/youtube/YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue):
  - Add Theater/Cinema mode toggle button.

### Phase 4: Verification & Build Packaging
- Run `npm run typecheck` (0 errors).
- Run `npm run build` and `npm run build:win`.
- Verify smooth transition between all modes without video reloads or audio interruption.
