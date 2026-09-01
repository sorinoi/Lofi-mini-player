# Planning: YouTube Bookmarks JSON Database Persistence

## 1. Problem Statement & Motivation
Currently, YouTube bookmarks in Lofi Player rely on browser IndexedDB via `idb-keyval` or in-memory state. When the application is closed or restarted, the saved bookmarks are not reliably persisted across sessions or are subject to IndexedDB isolation.

To provide a consistent, robust experience matching other native modules (such as To-Do and Notes), YouTube bookmarks need a dedicated JSON database stored directly in the Electron `userData` directory (`youtube_bookmarks.json`) managed via the Electron Main Process and IPC communication.

---

## 2. Architectural Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Renderer Process (Vue 3)                 │
│  - YouTubePlayer.vue / useYouTubeStore                      │
│  - storageService.ts (unified persistence layer)            │
└──────────────────────────────┬──────────────────────────────┘
                               │ IPC (invoke / handle)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Preload Layer                          │
│  - window.api.loadYouTubeBookmarks()                        │
│  - window.api.saveYouTubeBookmarks(bookmarks)               │
│  - window.api.openYouTubeBookmarksFolder()                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ IPC Channel
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Main Process (Electron)                   │
│  - src/main/youtubeBookmarkStorage.ts                       │
│  - Storage Location: %APPDATA%/lofi-player/youtube_bookmarks.json
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Implementation Phases

### Phase 1: Main Process Storage Layer & IPC Handlers
- Create `src/main/youtubeBookmarkStorage.ts`:
  - Define interfaces `YouTubeBookmarkItem` and `YouTubeBookmarkFileSchema`.
  - Provide default starter bookmarks (matching `YOUTUBE_LOFI_PRESETS`).
  - Implement `getYouTubeBookmarksFilePath()`, `loadYouTubeBookmarksFromFile()`, `saveYouTubeBookmarksToFile()`, and `openYouTubeBookmarksFolder()`.
- Update `src/main/index.ts`:
  - Register IPC handlers:
    - `youtube:loadBookmarks`
    - `youtube:saveBookmarks`
    - `youtube:openBookmarksFolder`

### Phase 2: Preload Bridge & TypeScript Definitions
- Update `src/preload/index.ts`:
  - Expose `loadYouTubeBookmarks`, `saveYouTubeBookmarks`, and `openYouTubeBookmarksFolder` on `window.api`.
- Update `src/preload/index.d.ts`:
  - Provide strict TypeScript types for all YouTube bookmark IPC methods.

### Phase 3: Renderer Integration & Pinia Store Synchronization
- Update `src/renderer/src/services/storageService.ts`:
  - Direct `getYouTubeBookmarks()` and `saveYouTubeBookmarks()` to use `window.api` with fallback to IndexedDB.
- Update `src/renderer/src/stores/youtube.ts`:
  - Enhance `initBookmarks()` to load from the JSON database on startup.
  - Ensure `toggleBookmark()`, `deleteBookmark()`, and any mutations save to JSON immediately.
  - Expose `openBookmarksFolder()` action.
- Update `src/renderer/src/components/youtube/YouTubePlayer.vue`:
  - Add a quick action button in the Bookmarks header to open the JSON folder in File Explorer (matching To-Do and Notes UI).

### Phase 4: Verification & Documentation
- Run `npm run typecheck` to ensure 0 TypeScript compilation errors.
- Run `npm run build` to ensure production compilation passes.
- Test saving, loading, deleting, and app restarts.
- Update `task/youtube_bookmark_persistence_task.md`, `WORK_LOG.md`, and `CHANGELOG.md`.
