# Task: Fix YouTube Stream Playback & URL Resolver (`youtube_stream_fix`)

- **Associated Plan:** [planning/youtube_stream_fix.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/planning/youtube_stream_fix.md)
- **Current Phase:** All Phases Completed 🟢
- **Status:** 🟢 Completed & Verified

---

## 1. Completed Tasks
- [x] ตรวจสอบสาเหตุเชิงลึกของปัญหา YouTube Stream ไม่ทำงาน (Electron Headers, Autoplay, URL parsing, DOM lifecycle, Dead Presets) ([planning/youtube_stream_fix.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/planning/youtube_stream_fix.md))
- [x] ทดสอบการดึงข้อมูล oEmbed และแกะ `videoId` จาก Channel Live URLs (`@Channel/live`) สำเร็จ
- [x] [Phase 1 Completed] เพิ่ม `autoplay-policy` switch ใน [src/main/index.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/index.ts)
- [x] [Phase 1 Completed] ดักจับ `onBeforeSendHeaders` และ `onHeadersReceived` ป้องกัน Error 150/153 ใน [src/main/index.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/index.ts)
- [x] [Phase 1 Completed] สร้าง IPC Resolver [src/main/youtubeResolver.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/youtubeResolver.ts) รองรับทุก URL และแกะ Canonical Live videoId
- [x] [Phase 1 Completed] เชื่อมต่อ Preload Bridge ใน [src/preload/index.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/preload/index.ts)
- [x] [Phase 2 Completed] ปรับปรุง [src/renderer/src/services/youtubeService.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/services/youtubeService.ts) ด้วย Non-destructive DOM Wrapper, `onError` listener (Error 150, 101, 100, 2), และ Methods `playVideo()` / `pauseVideo()`
- [x] [Phase 2 Completed] อัปเดต Presets ใน `YOUTUBE_LOFI_PRESETS` เป็น Live Stream IDs ที่เปิดใช้งานอยู่จริง (Lofi Girl Study `rFZHOHl-L8A`, Sleep `rUxyKA_-grg`, Chillhop `ohrjSFplPzk`, Synthwave `4xDzrJKXOOY`, STEEZY Cafe `lP26UCnoH9s`)
- [x] [Phase 2 Completed] ปรับปรุง Pinia Store [src/renderer/src/stores/youtube.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/stores/youtube.ts) เชื่อมต่อ Resolver, Error handling, และ Loading state
- [x] [Phase 3 Completed] ปรับปรุง [src/renderer/src/components/youtube/YouTubePlayer.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/components/youtube/YouTubePlayer.vue) เพิ่ม DOM Wrapper, Loading indicator และ Error Alert Banner
- [x] [Phase 3 Completed] ปรับปรุง [src/renderer/src/components/layout/MiniPlayer.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/components/layout/MiniPlayer.vue), [App.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/App.vue) และ [shortcutService.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/services/shortcutService.ts) ให้ Play/Pause ซิงค์สมบูรณ์
- [x] [Phase 3 Completed] ปรับปรุง CSP ใน [src/renderer/index.html](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/index.html)
- [x] [Phase 3 Completed] แก้ไข Error 152: ปรับแต่ง `onBeforeSendHeaders` ไม่ให้ spoof `Origin`/`Referer` ในโหมด Dev และใช้ `host: 'https://www.youtube-nocookie.com'`
- [x] [Phase 3 Completed] แก้ไข YouTube หยุดเล่นเมื่อเข้า Mini Player Mode: ใช้ Persistent DOM Mounting (.invisible-player) เพื่อไม่ให้ Vue ทำลาย iframe และไม่ให้ Chromium ตัดเสียง
- [x] [Phase 3 Completed] รัน `npm run typecheck` และ `npm run build` ผ่าน 100% (0 errors)

---

## 2. Next Actions (Upcoming Tasks)
- [x] ทุกเฟสเสร็จสมบูรณ์ พร้อมส่งมอบงานและรายงานแก่ผู้ใช้

---

## 3. Phase Checklist
### Phase 1: Electron Main Network Interceptor, Autoplay & Live Stream Resolver
- [x] เพิ่ม `autoplay-policy` ใน Chromium switches
- [x] ดักจับ `onBeforeSendHeaders` เพื่อแทรก `Referer` และ `Origin` ของ `youtube.com`
- [x] ดักจับ `onHeadersReceived` เพื่อปลดล็อก Frame embedding
- [x] สร้าง `src/main/youtubeResolver.ts` สำหรับ Resolve URL ทุกรูปแบบและดึง oEmbed metadata
- [x] เชื่อมต่อ Preload API ใน `src/preload/index.ts` และ `src/preload/index.d.ts`

### Phase 2: YouTube Service Overhaul, Resilient Player & Live Presets Update
- [x] ปรับปรุง regex ใน `youtubeService.ts` ให้ครอบคลุมทุก URL format
- [x] ป้องกันการทำลาย DOM Element (#youtube-player-element) เมื่อ destroy/re-create
- [x] เพิ่ม `onError` listener เพื่อแจ้งเตือนข้อผิดพลาด (Error 150, 101, 100, 2)
- [x] เพิ่ม methods ควบคุม: `playVideo()`, `pauseVideo()`, `destroyPlayer()`
- [x] อัปเดต Presets ใน `YOUTUBE_LOFI_PRESETS` ด้วย Live Stream ID ที่ใช้งานได้จริง
- [x] เชื่อมต่อ Auto-metadata & Channel title ใน `stores/youtube.ts`

### Phase 3: UI Feedback, Mini-Player Sync & Verification
- [x] เพิ่ม Loading / Buffering Spinner และ Error Alert ใน `YouTubePlayer.vue`
- [x] เชื่อม Play/Pause ใน `MiniPlayer.vue` กับ YouTube Service ให้ทำงานสมบูรณ์
- [x] ตรวจสอบ CSP ใน `src/renderer/index.html`
- [x] รัน `npm run typecheck` และคอมไพล์ทดสอบ

---

## 4. Modified & Created Files
- [NEW] `src/main/youtubeResolver.ts` - IPC handlers สำหรับ resolve link และ metadata
- [MOD] `src/main/index.ts` - เพิ่ม header injection & autoplay switch
- [MOD] `src/preload/index.ts` - Expose `resolveYouTubeUrl` และ `fetchYouTubeMetadata`
- [MOD] `src/preload/index.d.ts` - Type definitions สำหรับ preload APIs
- [MOD] `src/renderer/src/services/youtubeService.ts` - Full overhaul for resilient lifecycle & error handling
- [MOD] `src/renderer/src/stores/youtube.ts` - Auto metadata sync & error states
- [MOD] `src/renderer/src/components/youtube/YouTubePlayer.vue` - Non-destructive DOM container & UI error states
- [MOD] `src/renderer/src/components/layout/MiniPlayer.vue` - YouTube play/pause control sync
- [MOD] `src/renderer/index.html` - CSP adjustments

---

## 5. Plan & Workflow Adjustments (Changelog)
- **[2026-08-26]:** วินิจฉัยพบปัญหา Error 150 จาก Referer header, DOM element destruction, และ Channel Live URLs ที่ไม่มี videoId จึงวางแผนปรับปรุงทั้ง Main Process และ Renderer ให้รองรับสมบูรณ์ 100%
