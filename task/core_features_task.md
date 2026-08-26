# Task: Core Features Development (`core_features`)

- **Associated Plan:** [planning/core_features.md](file:///d:/Source/github/sorinoi/lofi-player/planning/core_features.md)
- **Current Phase:** All Core Feature Phases (1-5) Completed 🟢
- **Status:** 🟢 Completed (Standby for User Instructions)

---

## 1. Completed Tasks
- [x] Created Requirement Document ([REQUIREMENT.md](file:///d:/Source/github/sorinoi/lofi-player/REQUIREMENT.md))
- [x] Structured Feature Development Plan ([planning/core_features.md](file:///d:/Source/github/sorinoi/lofi-player/planning/core_features.md))
- [x] Built Web Audio Engine Service with `AudioContext` & `AnalyserNode` ([src/renderer/src/services/audioEngine.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/audioEngine.ts))
- [x] Developed 4 Canvas Visualizers (Classic Analog VU, Cozy Frequency Bars, Circular Pulse, Pixel Wave)
- [x] Implemented native audio file & folder import with `music-metadata` parser in Electron Main Process
- [x] Built persistent IndexedDB database service using `idb-keyval` ([src/renderer/src/services/storageService.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/storageService.ts))
- [x] Created `useLibraryStore` for search, multi-genre filtering, sorting, and favorites ([src/renderer/src/stores/library.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/stores/library.ts))
- [x] Built Music Library UI component ([src/renderer/src/components/library/MusicLibrary.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/library/MusicLibrary.vue))
- [x] Built Procedural Web Audio Ambient Sound Synthesizer ([src/renderer/src/services/ambientSynthesizer.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/ambientSynthesizer.ts))
- [x] Built Ambient Sound Mixer view ([src/renderer/src/components/ambient/AmbientMixer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/ambient/AmbientMixer.vue))
- [x] Built Pomodoro (25m, 45m, 60m) & Sleep Timer Modal ([src/renderer/src/components/timers/TimerModal.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/timers/TimerModal.vue))
- [x] Built YouTube Player Component with dual view modes (**Video Mode** & **VU Visualizer Mode**) ([src/renderer/src/components/youtube/YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue))
- [x] Configured Frameless BrowserWindow & Window Controls IPC ([src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts))
- [x] Built Custom Frameless Titlebar ([src/renderer/src/components/layout/CustomTitlebar.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/CustomTitlebar.vue)) with Drag Region and Pin (Always on Top)
- [x] Built Floating Mini-Player Mode Component ([src/renderer/src/components/layout/MiniPlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/MiniPlayer.vue)) with Dual View (Music View & Focus Clock Widget)
- [x] Built Real-time Windows Taskbar Title Countdown Synchronization
- [x] Implemented Centralized Master Volume & Chromium Native Audio Muting
- [x] Built Global/Local Keyboard Shortcuts & Media Session Service ([src/renderer/src/services/shortcutService.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/shortcutService.ts))
- [x] Verified full typecheck (`npm run typecheck`) and production build (`npm run build`) with 0 errors

---

## 2. Next Actions
- [ ] Standby for further feature requests, UI adjustments, or explicit packaging instructions from the user.

---

## 3. Phase Checklist

### Phase 1: Web Audio Engine & 4 Music-Reactive VU Visualizers (🟢 Completed)
- [x] Setup Web Audio API Context & AnalyserNode in Vue/Pinia
- [x] Build Classic Analog VU Meter component
- [x] Build Cozy Frequency Bars component
- [x] Build Circular Waveform component
- [x] Build Lofi Pixel / Particle Wave component
- [x] Build Visualizer Container & Mode Selector

### Phase 2: Local Audio Import, Metadata Parser & Persistent Library (🟢 Completed)
- [x] Electron native file/folder picker IPC with recursive directory scanner
- [x] Audio metadata & cover art extractor (`music-metadata`)
- [x] IndexedDB persistent library storage (`idb-keyval`)
- [x] Lofi genre categories & custom playlist tagging
- [x] Library UI with search, sorting, and inline playback

### Phase 3: Ambient Sound Mixer, Pomodoro & Sleep Timers (🟢 Completed)
- [x] Multi-channel ambient audio synthesizer (Rain, Fire, Cafe, Vinyl, Forest, Waves, Crickets)
- [x] Soundscape presets (Rainy Cafe, Campfire Night, Deep Focus, Coastal Haven, Vintage Bedroom)
- [x] Pomodoro Focus Timer (25m, 45m, 60m) with chime alert
- [x] Sleep Timer with gradual 45-second audio fade-out & auto-pause

### Phase 4: YouTube Music & Video Integration (🟢 Completed)
- [x] YouTube URL parser (handles `youtube.com/watch?v=`, `youtu.be/`, `live`, and embeds)
- [x] YouTube IFrame API integration with video/visualizer sync
- [x] Seamless Video View / Visualizer View switcher
- [x] Curated 24/7 Lofi Live Stream channels & user custom bookmarks

### Phase 5: Custom Titlebar, Mini-Player & Global Shortcuts (🟢 Completed)
- [x] Frameless window controls IPC (Minimize, Maximize, Close, Always on Top)
- [x] Custom Titlebar with drag region and live playing track ticker
- [x] Mini-Player floating widget mode (Dual View: Music & Focus Clock Widget)
- [x] Real-time taskbar countdown synchronization
- [x] Centralized Master Volume & Chromium Native Audio Muting
- [x] Global/Local keyboard shortcuts (Space, Arrow keys, M, N, P) & OS Media Session keys

---

## 4. Modified & Created Files
- [MOD] `planning/core_features.md` - Adjusted plan structure (removed Phase 6, converted packaging to on-demand)
- [MOD] `src/main/index.ts` - Native window controls, audio mute, and taskbar title IPC
- [MOD] `src/preload/index.ts` - Context bridge APIs
- [MOD] `src/renderer/src/stores/player.ts` - Master volume & mute synchronization
- [MOD] `src/renderer/src/stores/timer.ts` - Taskbar title sync and focus duration options
- [MOD] `src/renderer/src/components/layout/MiniPlayer.vue` - Dual View mini player with Focus Clock widget
- [MOD] `src/renderer/src/components/layout/CustomTitlebar.vue` - Custom frameless titlebar
- [MOD] `src/renderer/src/components/youtube/YouTubePlayer.vue` - YouTube streaming with dual view
- [MOD] `src/renderer/src/components/ambient/AmbientMixer.vue` - Ambient sound mixer
- [MOD] `src/renderer/src/components/library/MusicLibrary.vue` - Music library
- [MOD] `src/renderer/src/App.vue` - Root application integration

---

## 5. Plan & Workflow Adjustments (Changelog)
- **2026-08-26:** Added **VU Visualizer View Mode to Mini-Player (Tri-View Switcher)**: Users can now switch the floating Mini-Player between **Track View**, **VU Visualizer View** (with instant in-canvas style switching), and **Focus Clock Timer View**.
- **2026-08-26:** Fixed **Track ID Collision Bug**: Resolved issue where importing multiple tracks in a batch generated identical IDs due to common folder path base64 prefixes, causing all songs to show as "Playing" simultaneously. Implemented deterministic SHA-256 path hashing and automatic IndexedDB duplicate sanitization.
- **2026-08-26:** Added full **Audio-Reactive VU Meter Visualizer support for YouTube Playback**: All 4 visualizer modes (Classic Analog VU, Cozy Bars, Radial Pulse, Pixel Wave) now dynamically react with authentic Lofi groove and beat bounce while playing YouTube streams.
- **2026-08-26:** Adjusted master development plan: **Removed Phase 6 from sequential pipeline** as requested by the user. Packaging into `.exe` distribution installer will only be performed on-demand when explicitly instructed.
- **2026-08-26:** All core features (Phases 1 through 5) are 100% complete and operational.
