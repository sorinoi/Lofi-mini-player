# Core Features Development Plan (`planning/core_features.md`)

This comprehensive plan covers the development of all functional and UX requirements defined in [REQUIREMENT.md](file:///d:/Source/github/sorinoi/lofi-player/REQUIREMENT.md) for the **Lofi Music Player Desktop App**.

---

## 🎯 Master Objective
Transform the base boilerplate into a feature-rich, high-performance, and cozy Lofi Music Player desktop application supporting local music playback with real-time audio-reactive VU visualizers, YouTube streaming, ambient sound mixing, focus timers, and a compact floating mini-player with taskbar synchronization.

---

## 📅 Core Implementation Phases (100% Completed)

### Phase 1: Web Audio Engine & 4 Music-Reactive VU Visualizers (🟢 Completed)
- Built core audio pipeline with Web Audio API (`AudioContext`, `AnalyserNode`, `GainNode`).
- Implemented real-time frequency and time-domain level extraction.
- Developed 4 distinct canvas visualizer modes:
  1. 📻 **Classic Analog VU Meter:** Dual vintage meter needles + peak LEDs.
  2. 📊 **Cozy Frequency Bars:** Smooth rounded equalizer spectrum with warm gradients.
  3. 💫 **Circular Waveform / Radial Pulse:** Bass-reactive pulsing circular wave.
  4. ✨ **Lofi Pixel / Particle Wave:** Retro pixelated waveform with ambient floating particles.

---

### Phase 2: Local Audio Import, Metadata Parser & Persistent Library (🟢 Completed)
- Native file/folder picker IPC with recursive directory scanning.
- ID3 metadata & album cover art extraction via `music-metadata`.
- Persistent local library database using IndexedDB (`idb-keyval`).
- 5 Lofi genre categories (Chillhop, Synthwave, Rainy Day, Study/Focus, Sleep/Ambient) + search and sorting.

---

### Phase 3: Ambient Sound Mixer, Pomodoro & Sleep Timers (🟢 Completed)
- Procedural Web Audio synthesis for 7 organic ambient sound channels (Rain, Campfire, Vinyl, Forest Wind, Coffee Shop, Ocean Waves, Night Crickets) + 528Hz Solfeggio chime alert.
- Independent ambient channel volume sliders + 5 curated soundscape presets.
- Pomodoro Focus Timer with 3 duration presets: **25m, 45m, 60m** + Short/Long break modes.
- Sleep Timer with smooth 45-second audio fade-out and auto-pause.

---

### Phase 4: YouTube Music & Video Integration (🟢 Completed)
- Universal YouTube URL parser supporting watch links, share links, live streams, and embeds.
- Official YouTube IFrame Player API integration with programmatic control.
- Dual display mode: **Video View (16:9)** ↔ **VU Visualizer View** with seamless background audio playback (`v-show`).
- 5 Curated 24/7 Lofi Live Stream stations + custom persistent bookmarks.

---

### Phase 5: Custom Titlebar, Mini-Player & Global Shortcuts (🟢 Completed)
- Frameless window controls IPC (Minimize, Maximize, Close, Always on Top).
- Custom titlebar with draggable region and live playing track ticker.
- Mini-Player Mode (360×220) with **Dual View**:
  - *Music View:* Compact player with active countdown badge.
  - *Focus Clock Widget:* Large digital countdown, 25m/45m/60m presets, session counter, and mini audio strip.
- Real-time taskbar countdown synchronization (`[🎯 24:59] Lofi Player`).
- Centralized Master Volume & Chromium Native Audio Muting across all audio engines.
- Keyboard shortcuts (`Space`, `←`, `→`, `↑`, `↓`, `M`, `N`, `P`) and Hardware Media Session API support.

---

## 📦 On-Demand Packaging Stage (Deferred / Standby)
> [!NOTE]
> **Packaging into `.exe` Installer** is detached from the active roadmap and will be performed only upon explicit user instruction after all feature adjustments are finalized.
