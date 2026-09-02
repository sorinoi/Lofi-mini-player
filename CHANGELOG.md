# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.2] - 2026-09-02

### Added
- Added **Large Digital Focus & Sleep Clock Widget** on the bottom of the Left Navigation Sidebar in [App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue), rendering high-contrast, glowing digital countdown digits (`2xl`/`3xl` font-mono) with mode badges, a real-time progress bar, and quick pause/resume/reset controls whenever a timer session is active.
- Added Global **Toggle Collapse/Expand** capability for the Right Sidebar Workspace ([RightSidebarPanel.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/RightSidebarPanel.vue)) across all screens, with controls in [CustomTitlebar.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/CustomTitlebar.vue), the sidebar header, and floating expand triggers on both Main and YouTube views.
- Added **Bubble Flow (Rising Water Bubbles)** as the 5th audio visualizer mode ([FloatingBubbles.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/FloatingBubbles.vue)) featuring a 60fps music-reactive particle engine with frequency-mapped bubble generation (bass/mids/highs), natural buoyancy, sine wobble, glass water refraction shading, and surface pop splash effects.
- Created universal multi-mode [RightSidebarPanel.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/RightSidebarPanel.vue) featuring switchable tabs between Playlists/Stations/Queue, Focus Tasks, and Note Record with live notification badges across all screens.

### Changed
- Resolved YouTube streaming stuttering and frame drop issues:
  - Enabled Chromium hardware video decoding switches (`VaapiVideoDecoder,AcceleratedVideoDecode,AcceleratedVideoEncoder,CanvasOopRasterization`, `enable-accelerated-video-decode`, `disable-software-rasterizer`, `experimentalFeatures: true`).
  - Switched IFrame endpoint from `youtube-nocookie.com` to `https://www.youtube.com` with low-latency `playerVars` parameters.
  - Implemented background canvas visibility gating across all 5 visualizer modes to stop 60fps canvas calculation and particle updates when views are hidden.
  - Added timestamp debounce caching in [audioEngine.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/audioEngine.ts) to eliminate redundant synthetic audio calculations per frame.
  - Applied GPU layer isolation (`contain: strict;`, `transform: translateZ(0);`) to the YouTube video iframe container.
- Scaled all Audio Visualizers ([AnalogVuMeter.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/AnalogVuMeter.vue), [FrequencyBars.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/FrequencyBars.vue), [CircularPulse.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/CircularPulse.vue), [PixelWave.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/PixelWave.vue), [FloatingBubbles.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/FloatingBubbles.vue)) dynamically to fill the full height and width in Fullscreen and Maximized window modes:
  - Removed `max-h-56` (224px) restrictions from all visualizer canvases.
  - Implemented dynamic proportional gauge scaling for Analog VU meters and adaptive disc scaling for Circular Pulse.
- Optimized and smoothed **Pixel Wave** visualizer ([PixelWave.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/PixelWave.vue)):
  - Replaced raw time-domain jitter with dual-rate Exponential Moving Average (EMA) smoothing (fast attack, gentle decay) and harmonic wave blending.
  - Added gravity-decaying floating peak dots (retro equalizer caps) and faint mirrored water reflection underneath baseline.
  - Resolved canvas scaling artifacts and expanded to full responsive height.
- Unified the application layout into a **Full-Width 2-Column Split Workspace** across all main tabs (Now Playing & VU, Music Library, Ambient Mixer, YouTube Stream, Focus Tasks, Note Record).
- Removed restrictive `max-w-*` limits across all views (`VisualizerContainer.vue`, `MusicLibrary.vue`, `AmbientMixer.vue`, `TodoView.vue`, `NoteView.vue`) so views expand to fill full screen real estate.
- Added switchable mode tabs to the **Right Sidebar** in YouTube Player screen, allowing users to toggle between **Playlists & Stations**, **To-Do List**, and **Notes & Memos** with live pending task and note badges while the Left Column permanently displays the 16:9 YouTube video player.

### Changed
- Optimized YouTube playback performance and hardware video acceleration in Electron:
  - Enabled Chromium GPU switches (`enable-gpu-rasterization`, `enable-zero-copy`, `ignore-gpu-blocklist`, `enable-hardware-overlays`) for direct GPU-accelerated video decoding.
  - Disabled background and timer throttling (`backgroundThrottling: false`, `disable-background-timer-throttling`, `disable-renderer-backgrounding`) to ensure stutter-free playback across all window modes.
  - Applied CSS GPU compositing hints (`translate3d`, `will-change`, `backface-visibility`) and strict layout containment (`contain: strict`) to iframe containers.
  - Optimized ambient glow rendering behind the video player to eliminate per-frame GPU rasterization overhead during 60fps video playback.
- Optimized Notes overview cards (Total Notes, Pinned Notes, Storage) by removing bulky icon boxes and applying color-coded typography, resolving text-wrapping issues in compact sidebar and dock views.
- Optimized To-Do list status overview cards (Total Tasks, In Progress, Completed, Progress) by removing bulky icon boxes and applying color-coded typography and badges, resolving text-wrapping issues across compact sidebars and narrow windows.
- Redesigned YouTube Stream Player layout to a 2-column desktop watch interface matching the YouTube web experience:
  - **Left Column:** Dedicated primary video / visualizer player card (16:9 aspect ratio) with ambient glow, controls, and metadata underneath.
  - **Right Sidebar:** Flexible multi-mode workspace for Curated Stations/Bookmarks, To-Do task management, or Notes while watching videos.
- Refactored layout to fluid full-width (`w-full`), removing `max-w-6xl` constraints so content utilizes full screen real estate when maximized or in fullscreen.

## [1.1.1] - 2026-09-01

### Added
- YouTube Bookmarks JSON Database persistence (`youtube_bookmarks.json`) via Electron IPC with starter presets and directory shortcut.
- Right Sidebar Dock Mode with reserved Windows AppBar desktop space.
- To-Do App with JSON persistence, priorities, and timestamps.
- Note Record feature with JSON persistence, search, and timestamps.
- Floating Ghost Timer Overlay in YouTube Video View Mode.
- Native Splash Screen with cozy loading animations.

### Fixed
- Fixed YouTube bookmarks disappearing on app close/restart by resolving Electron IPC Vue reactive Proxy serialization with explicit plain JSON serialization.
- Fixed Windows Taskbar overlapping Dock Sidebar application by calculating height from `display.workArea`.
- Fixed Dock Sidebar window positioning when reserving desktop space.
- Fixed YouTube Video rendering and aspect ratio (16:9) in Dock Sidebar Mode.
- Disabled YouTube stream autoplay on application startup.
- Fixed YouTube fullscreen & cinema mode tab overlap issues.

## [1.1.0] - 2026-08-30

### Added
- Dedicated YouTube Video Screen Mode & Quad-View Mini Player.
- Custom App Icon integration (`cga-lofi.ico`).
- Mini-Player Timer Widget with dynamic Windows Taskbar countdown preview.

### Removed
- Removed AI Rate Limit & Quota Monitor module to streamline core audio experience.

## [1.0.0] - 2026-08-25

### Added
- Core Web Audio Engine with 4 music-reactive VU visualizers.
- Local Audio Import with metadata parser (`music-metadata`) and persistent IndexedDB library.
- Ambient Sound Mixer (Rain, Forest, Fire, Cafe, etc.).
- Focus & Productivity tools: Pomodoro Timer and Sleep Timer.
- YouTube Audio stream playback integration.
- Custom frameless titlebar with Window controls, Mini-Player mode, and global keyboard shortcuts.
- Windows desktop installer packaging (`electron-builder`).
