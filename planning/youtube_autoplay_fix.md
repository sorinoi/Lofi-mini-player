# Implementation Plan: Disable YouTube Autoplay on App Startup

## 1. Problem Overview
When the application starts up, the YouTube Player component (`YouTubePlayer.vue`) initializes the YouTube IFrame Player with `autoplay: 1` and calls `event.target.playVideo()` on ready. As a result, the first curated station (e.g. Lofi Girl) starts playing automatically without user interaction.
The user requested that YouTube streams must NOT play automatically upon opening the app, and should only play when the user explicitly clicks on a station in the list.

## 2. Planned Changes

### Phase 1: Service & Player Configuration (`youtubeService.ts`)
- Add `autoPlay: boolean = false` parameter to `youtubeService.createPlayer`.
- Set `playerVars.autoplay = autoPlay ? 1 : 0`.
- In `onReady` event handler, conditionally call `event.target.playVideo()` and enable `isPlayingState` / `audioEngine` state only when `autoPlay` is true.
- If `autoPlay` is false, maintain idle/paused state (`isPlayingState = false`, `audioEngine.setExternalSourceState(false, ...)`).
- Ensure `loadVideo()` passes `autoPlay: true` when recreating the player upon a user request to load a video.

### Phase 2: Component Integration (`YouTubePlayer.vue`)
- Update `mountYouTubePlayer()` to pass `false` as `autoPlay` during initial mount.
- Update the active station card highlight condition in the template to `ytStore.isPlaying && ytStore.currentVideoId === station.videoId` so the first item does not appear actively playing on startup before being clicked.

### Phase 3: Verification & Type Check
- Run `npm run typecheck` to ensure full TypeScript compliance with 0 errors.
- Verify building process.
