# Project: Lofi Music Player Desktop App

## Tech Stack & Architecture
- **Desktop Framework:** Electron (via `electron-vite` boilerplates)
- **Frontend Framework:** Vue 3 (Composition API with `<script setup>`)
- **Build Tool:** Vite
- **Language:** JavaScript (or TypeScript)
- **State Management:** Pinia (for handling playlist, track index, playback state, and settings)
- **Styling:** Tailwind CSS (for crafting a minimalist, cozy Lofi UI)
- **Icons:** Lucide Vue Next
- **Audio Engine:** Howler.js (or Web Audio API for audio control and visualizer)
- **Packaging/Distribution:** electron-builder (to build `.exe`, `.dmg`, or `.deb`)

## Core Features
1. Cozy Lofi UI with animated/looping background support (GIF/Video/Canvas)
2. Audio controls: Play, Pause, Next, Previous, Shuffle, Repeat, Volume slider
3. Background Ambient Sound Mixer (Rain, Campfire, Vinyl Crackle, Cafe sounds)
4. Sleep Timer / Pomodoro Focus Timer
5. Local audio playback support + Web Lofi Radio streaming support