# Software Requirements Specification (SRS) - Lofi Music Player

This document outlines the functional and non-functional requirements for the **Lofi Music Player Desktop Application**.

---

## 1. Core Functional Requirements

### 1.1 Local Audio Import & Persistent Music Library
- **Universal Format Support:** Support importing and decoding all standard audio formats, including `.mp3`, `.wav`, `.flac`, `.ogg`, `.aac`, `.m4a`, and `.webm`.
- **Metadata Extraction:** Automatically extract ID3/audio metadata (Title, Artist, Album, Duration, embedded Cover Art).
- **Persistent Library Storage:** Save imported tracks, play counts, and metadata locally (using persistent storage such as IndexedDB or JSON-based local storage) so the library remains intact across app restarts.
- **Library Management:** Add single files or entire folders, delete tracks, search by keyword, and sort by title, artist, or date added.

### 1.2 Lofi Genre & Mood Categorization
- **Preset Lofi Categories:** Built-in categorization for popular Lofi sub-genres and moods, including:
  - ☕ *Chillhop / Jazzhop*
  - 🌆 *Synthwave / Retrowave*
  - 🌧️ *Rainy Day / Melancholy Lofi*
  - 📖 *Study & Deep Focus*
  - 🌙 *Sleep & Ambient*
- **Custom Tagging & Playlists:** Ability for users to create custom playlists, assign custom tags/genres, and filter library tracks by category.

### 1.3 YouTube Music & Video Integration
- **YouTube Link Playback:** Accept valid YouTube URLs (video / playlist links) to stream audio with synchronized video rendering.
- **Embedded Video Display Area:** Seamless toggle between Video View and Visualizer View in the main display container.
- **Playback Controls for Stream:** Unified play, pause, seek, and volume control integrated with the app's player bar.

### 1.4 Dynamic Music-Reactive Animations & VU Meters
When playing local audio without video, the display dynamically renders real-time audio-reactive visualizers powered by the **Web Audio API (`AnalyserNode`)**:
- **Selectable Visualizer Styles (4 Modes):**
  1. **Classic Analog VU Meter:** Dual vintage VU meters with bouncing analog needles and peak LED indicators.
  2. **Cozy Frequency Bars (Equalizer):** Smooth, rounded frequency spectrum bar visualizer with gradient coloring.
  3. **Circular Waveform / Radial Pulse:** Breathing circular audio wave that pulses and expands to bass frequencies.
  4. **Lofi Pixel / Particle Wave:** Retro pixel-art style waveform with floating ambient dust particles.
- **Customization:** Option to adjust sensitivity, smoothing, and color themes for visualizers.

### 1.5 Advanced Audio & Playback Controls
- **Master Playback Controls:** Play, Pause, Next, Previous, Fast-Forward/Rewind, Scrubbing progress bar with timestamp.
- **Playback Modes:** Sequential, Loop All, Loop One, and Smart Shuffle.
- **Volume & Gain Control:** Master volume slider, mute toggle, and smooth volume fading on track transitions.
- **Background Ambient Sound Mixer:** Independent multi-channel volume sliders for ambient sounds (Rain, Vinyl Crackle, Campfire, Coffee Shop, Forest Wind).

### 1.6 Window Sizing & Mini-Player Mode
- **Dual Display Modes:**
  - **Full Experience Mode:** Complete interface with library, playlists, ambient mixer, visualizer/video, and timers (default: 960x670, resizable).
  - **Mini Player Mode (Compact Floating Widget):** Ultra-minimal floating widget showing only current track, album art/VU preview, play/pause controls, and volume.
- **Always-on-Top (Pip-style):** Option to pin the Mini Player on top of other desktop windows while studying or working.
- **Responsive Layout:** Smooth layout adaptation across various window dimensions.

---

## 2. Recommended Additional Features (Enhanced UX)

### 2.1 Productivity & Focus Tools
- **Pomodoro Focus Timer:** Configurable Work/Break intervals (e.g., 25m focus / 5m break) with gentle chime notifications.
- **Sleep Timer:** Countdown timer (15m, 30m, 45m, 60m, or custom) that smoothly fades out audio and pauses playback or puts app to sleep.

### 2.2 Aesthetic & Cozy UI Customization
- **Theme Palette Selection:** Cozy themes (e.g., Tokyo Night, Warm Sunset, Matcha Green, Lavender Dreams, Cyber Lofi).
- **Background Media:** Support for animated looping GIF or MP4 backgrounds with adjustable overlay opacity.

### 2.3 System Integration & Accessibility
- **Global & Local Keyboard Shortcuts:** Space (Play/Pause), Left/Right (Seek), Up/Down (Volume), Media Keys (`MediaPlayPause`, `MediaNextTrack`, `MediaPreviousTrack`).
- **Native OS Media Notifications:** Display currently playing track metadata on track change.
- **Offline First:** Full offline capability for all local playback, ambient sounds, and visualizer features.

---

## 3. Non-Functional Requirements
- **Performance & Low Resource Usage:** Electron renderer audio processing must maintain low CPU and memory footprint (< 150MB RAM typical usage).
- **Latency-Free Audio:** Instant audio response using Web Audio API buffer scheduling.
- **Cross-Platform Compatibility:** Native build support for Windows 10/11 (`.exe`), macOS (`.dmg`), and Linux (`.deb`).
