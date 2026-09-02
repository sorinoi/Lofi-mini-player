# YouTube Streaming Performance & Stuttering Fix Plan

## 📌 Problem Analysis & Root Cause
Users reported that YouTube live streaming / video playback is still stuttering or lagging compared to viewing directly in a standard web browser.

### Root Causes Identified:
1. **Hidden Background Canvas Render Loops (CPU/GPU Contention):**
   - When switching to the YouTube tab, other visualizer components (`AnalogVuMeter`, `FrequencyBars`, `CircularPulse`, `PixelWave`, `FloatingBubbles`) and docked/mini player views remained active in the Vue DOM tree (`v-show="false"`).
   - Their `requestAnimationFrame` loops continued executing heavy particle physics, trigonometric math, and canvas clearing on hidden elements at 60fps, consuming significant main-thread CPU and GPU compositor resources needed for video frame decoding.
2. **AudioEngine Synthetic Audio Generator Redundant Calculations:**
   - During YouTube playback, `audioEngine.generateSyntheticAudioData()` was invoked repeatedly by every active visualizer component per frame without a timestamp debounce/cache.
3. **`youtube-nocookie.com` Live Stream CDN Limitations:**
   - Using `https://www.youtube-nocookie.com` causes restrictive live-stream DASH chunk buffering and token renewal lag compared to `https://www.youtube.com`.
4. **Missing Hardware-Accelerated Video Decoding Chromium Switches:**
   - Need dedicated Chromium flags: `VaapiVideoDecoder,AcceleratedVideoDecode,AcceleratedVideoEncoder,CanvasOopRasterization`, `enable-accelerated-video-decode`, `enable-accelerated-mjpeg-decode`, `disable-software-rasterizer`.
5. **IFrame GPU Compositor Isolation:**
   - Need `contain: strict` and dedicated layer promotion (`transform: translateZ(0)`) on the YouTube iframe and wrapper container to decouple video frame rendering from Vue DOM repaints.

---

## 🎯 Implementation Phases

### Phase 1: Main Process GPU & Video Decode Acceleration
- Configure Chromium command-line switches in [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts) with hardware-accelerated video decode features.
- Enable `experimentalFeatures: true` in `BrowserWindow` webPreferences.

### Phase 2: YouTube Service Optimization
- Switch IFrame host from `youtube-nocookie.com` to `www.youtube.com` in [src/renderer/src/services/youtubeService.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/youtubeService.ts).
- Optimize `playerVars` parameters with proper `origin`, `widget_referrer`, and `playsinline`.

### Phase 3: Background Canvas Throttling & Visibility Gating
- Add visibility checks (`canvas.offsetParent === null || canvas.clientWidth === 0`) in all visualizers:
  - [AnalogVuMeter.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/AnalogVuMeter.vue)
  - [FrequencyBars.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/FrequencyBars.vue)
  - [CircularPulse.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/CircularPulse.vue)
  - [PixelWave.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/PixelWave.vue)
  - [FloatingBubbles.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/FloatingBubbles.vue)
- Add frame-rate / timestamp cache in [src/renderer/src/services/audioEngine.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/audioEngine.ts) to prevent duplicate synthetic audio computations.

### Phase 4: IFrame Layer Isolation & GPU Compositing
- Apply `contain: strict;`, `transform: translateZ(0);`, and GPU layer hints in [src/renderer/src/components/youtube/YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue) and [src/renderer/src/App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue).

### Phase 5: Verification & Documentation
- Run `npm run typecheck` and `npm run build`.
- Update [task/youtube_stutter_fix_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_stutter_fix_task.md), [WORK_LOG.md](file:///d:/Source/github/sorinoi/lofi-player/WORK_LOG.md), and [CHANGELOG.md](file:///d:/Source/github/sorinoi/lofi-player/CHANGELOG.md).
