# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
