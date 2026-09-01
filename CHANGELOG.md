# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added switchable mode tabs to the **Right Sidebar** in YouTube Player screen, allowing users to toggle between **Playlists & Stations**, **To-Do List**, and **Notes & Memos** with live pending task and note badges while the Left Column permanently displays the 16:9 YouTube video player.

### Changed
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
