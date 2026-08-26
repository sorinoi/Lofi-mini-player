# Plan: YouTube Stream Playback & URL Resolver Fix (`planning/youtube_stream_fix.md`)

- **Associated Task:** [task/youtube_stream_fix_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/youtube_stream_fix_task.md)
- **Status:** 🟡 Awaiting User Approval

---

## 1. Problem Diagnosis & Root Causes
1. **HTTP Referer & Origin Security Checks in Electron:**
   - Electron running under `file://` sends no `Referer` or invalid origin to YouTube.
   - YouTube's embed protection automatically returns **Error 150 / 153 / Video Unavailable** for copyrighted live streams (Lofi Girl, Chillhop, etc.).
2. **Chromium Autoplay Policy Blocking:**
   - Default Electron instances enforce user gesture requirements for media with audio, preventing automatic stream start and volume unmuting.
3. **Restricted URL Parser & Inability to Resolve Channel Live Links:**
   - Regex currently only supports 11-char IDs in `v=`, `youtu.be/`, `embed/`, `live/`.
   - Cannot parse `https://youtube.com/shorts/...`, query params in varied order, or live channel handles (`https://www.youtube.com/@LofiGirl/live`, `https://www.youtube.com/@ChillhopMusic/live`).
4. **Destructive DOM Lifecycle & Silent Error Failures:**
   - In `youtubeService.ts`, when `new YT.Player` runs, it replaces the target `div` with an `iframe`. When destroyed or remounted, `player.destroy()` deletes the DOM element completely, breaking subsequent attempts.
   - Missing `onError` listener leaves the UI stuck buffering with no user feedback when a stream fails.
5. **Outdated / Dead Preset Stream IDs:**
   - `5yx6BWlEvq4` (Chillhop Radio) is offline (404). Default Lofi Girl stream IDs periodically change when streams reset.
6. **Generic Metadata:**
   - Custom links lack automatic title and channel fetching from YouTube oEmbed.

---

## 2. Structured Implementation Phases

### Phase 1: Electron Main Network Interceptor, Autoplay & Live Stream Resolver
- [ ] In `src/main/index.ts`, add `app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')`.
- [ ] Add `session.defaultSession.webRequest.onBeforeSendHeaders` to inject `Referer: https://www.youtube.com/` and `Origin: https://www.youtube.com` for all YouTube requests (`*.youtube.com`, `*.youtube-nocookie.com`, `*.googlevideo.com`, `*.ytimg.com`).
- [ ] Add `session.defaultSession.webRequest.onHeadersReceived` to remove `X-Frame-Options` and CSP frame restrictions from YouTube embed responses.
- [ ] Create `src/main/youtubeResolver.ts` with IPC handlers:
  - `youtube:resolveUrl`: Resolves standard URLs, shorts, and live channel handles (`@Channel/live`) into valid `videoId`.
  - `youtube:fetchMetadata`: Fetches real video title, author, and thumbnail via YouTube oEmbed API.
- [ ] Expose resolver APIs in `src/preload/index.ts` and `src/preload/index.d.ts`.

### Phase 2: YouTube Service Overhaul, Resilient Player & Live Presets Update
- [ ] Update `src/renderer/src/services/youtubeService.ts`:
  - Enhance `extractVideoId` with comprehensive regex for all URL types.
  - Implement non-destructive player mounting container.
  - Add full `onError` event handler (codes 2, 5, 100, 101, 150) with status callbacks.
  - Add player controls: `playVideo()`, `pauseVideo()`, `destroyPlayer()`, `setVolume()`, `setMute()`.
  - Update `YOUTUBE_LOFI_PRESETS` with currently active, verified 24/7 stream IDs and channel fallbacks.
- [ ] Update `src/renderer/src/stores/youtube.ts`:
  - Integrate automatic IPC URL resolution and oEmbed metadata fetching on `playUrl`.
  - Add error state management and loading indicators.

### Phase 3: UI Feedback, Mini-Player Sync & Verification
- [ ] Update `src/renderer/src/components/youtube/YouTubePlayer.vue`:
  - Add visual loading spinners and informative error banners when a stream is offline or restricted.
  - Fix mount/unmount lifecycle with resilient DOM container.
- [ ] Update `src/renderer/src/components/layout/MiniPlayer.vue`:
  - Fix YouTube play/pause toggle syncing with `youtubeService.playVideo()` / `pauseVideo()`.
- [ ] Update `src/renderer/index.html` CSP to whitelist all required YouTube media and script sources.
- [ ] Execute `npm run typecheck` and verify build.
