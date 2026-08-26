# Project Setup & Initialization Plan (`planning/init_project.md`)

This plan outlines the step-by-step setup of the **Lofi Music Player Desktop App** according to the technical requirements in [TECH_STACK.md](file:///d:/Source/github/sorinoi/lofi-player/TECH_STACK.md).

---

## 🎯 Goal
Scaffold a modern, lightweight, and robust desktop application boilerplate using **Electron**, **Vite**, **Vue 3**, **Tailwind CSS**, **Pinia**, and **Howler.js**.

---

## 📅 Structured Phases

### Phase 1: Electron + Vite + Vue 3 Core Boilerplate
- **Objectives:**
  - Initialize project configuration in `package.json` (scripts, electron-builder metadata).
  - Install Electron, Vite, Vue 3, `@vitejs/plugin-vue`, and `@electron-toolkit` packages.
  - Setup the standard 3-tier architecture:
    - `src/main/` — Electron main process (window creation, lifecycle).
    - `src/preload/` — Secure context bridge.
    - `src/renderer/` — Vue 3 application entrypoint and root component.
  - Setup `electron.vite.config.mjs` and `tsconfig.json` (or jsconfig).
- **Verification:** Run `npm run build` to ensure main, preload, and renderer bundles build with zero errors.

### Phase 2: Styling & UI Setup (Tailwind CSS, Lucide Icons & Pinia)
- **Objectives:**
  - Install and configure `tailwindcss`, `postcss`, `autoprefixer`.
  - Install `pinia` for centralized state management.
  - Install `lucide-vue-next` for UI icons.
  - Setup base theme and cozy color palette in `tailwind.config.js` & `src/renderer/src/assets/main.css`.
  - Wire up Pinia in `src/renderer/src/main.ts`.
- **Verification:** Build test and verify Tailwind utility classes render properly.

### Phase 3: Audio Engine & IPC Bridge Initialization
- **Objectives:**
  - Install `howler` and `@types/howler`.
  - Setup IPC handlers in `src/main` and bridge APIs in `src/preload` for window controls (minimize, maximize, close) and native file dialogs.
  - Scaffold the initial Pinia audio store (`usePlayerStore`).
- **Verification:** Run full build verification and sanity check.
