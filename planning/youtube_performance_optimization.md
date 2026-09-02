# Plan: YouTube Playback Performance & Hardware Acceleration Optimization

## 📌 Problem Overview & Objectives
เมื่อเปิดเล่นวิดีโอหรือสตรีมสด YouTube ในโปรแกรม พบอาการกระตุก / เฟรมเรตตก (Stuttering & Frame Drop) ต่างจากการเปิดรับชมผ่านเว็บเบราว์เซอร์อย่าง Google Chrome โดยตรง สาเหตุหลักเกิดจาก:
1. **ขาดการกำหนดค่า GPU Hardware Acceleration & Video Decoding Flags** ใน Electron Main Process ทำให้ Chromium อาจตกไปใช้ Software CPU Decoding หรือไม่เปิดใช้ GPU Rasterization
2. **Chromium Background & Occlusion Throttling** ทำการจำกัดรอบประมวลผล (Throttling) เมื่อหน้าต่างแอปถูกบังหรือย่อ
3. **CSS Compositing Overhead & Heavy Blur Effects** การใช้เอฟเฟกต์ CSS `backdrop-blur` และ Glow elements รอบกรอบ IFrame วิดีโอ ทำให้เกิดการ Repaint และเพิ่มภาระ GPU Compositor
4. **Visualizer / Math Animation Cycles** ที่อาจยังคงประมวลผลแม้ขณะรับชมวิดีโอ

**เป้าหมาย:** ปรับแต่งระบบให้สามารถเล่นวิดีโอและสตรีมสด YouTube ได้ลื่นไหล เต็มเฟรมเรต 60fps เทียบเท่าเว็บเบราว์เซอร์หลัก พร้อมรักษาการทำงานของโหมดต่างๆ (Watch 2-Column, Cinema, Mini-Player, Dock Sidebar) ไว้อย่างสมบูรณ์

---

## 🏗️ Phased Execution Plan

### Phase 1: Electron Main Process GPU & Video Acceleration Flags
- เพิ่ม Chromium Command Line Switches ใน `src/main/index.ts` เพื่อเปิดใช้งาน Hardware Acceleration เต็มรูปแบบ:
  - `enable-gpu-rasterization` (ใช้ GPU ในการเรนเดอร์กราฟิก)
  - `enable-zero-copy` (ส่งข้อมูลเฟรมวิดีโอเข้า GPU memory โดยตรงไม่ผ่าน CPU RAM ซ้ำซ้อน)
  - `ignore-gpu-blocklist` (ข้ามการแบนการ์ดจอบางรุ่นของ Chromium เพื่อบังคับใช้ Hardware Acceleration)
  - `enable-hardware-overlays` (แยก Overlay Layer สำหรับวิดีโอ)
  - `disable-background-timer-throttling` & `disable-renderer-backgrounding` (ป้องกันเสียง/วิดีโอกระตุกเมื่อสลับหน้าต่าง)

### Phase 2: Renderer & IFrame GPU Compositing Optimization
- ปรับแต่ง CSS Layer Compositing สำหรับ `#youtube-player-element` และ `#youtube-player-element-wrapper`:
  - เพิ่ม Hardware Acceleration CSS hints: `transform: translate3d(0, 0, 0)`, `will-change: transform`, `backface-visibility: hidden`
  - ปรับปรุงการจัดวาง `.invisible-player` ให้ใช้ `contain: strict` เพื่อแยก Render Tree ไม่ให้เกิด Layout Thrashing เมื่อสลับหน้าจอ
  - ปรับแต่ง Ambient Glow Effect และ Backdrop Blur รอบวิดีโอใน `YouTubePlayer.vue` ให้มีน้ำหนักเบาลงเพื่อลดภาระ Repaint ของ GPU

### Phase 3: Resource & Animation Throttling During Video Playback
- ตรวจสอบและควบคุมการทำงานของ Visualizers (Analog VU, Frequency Bars, Wave) และ Audio Engine:
  - หยุดการคำนวณและ Loop `requestAnimationFrame` เมื่ออยู่ในโหมดแสดงผลวิดีโอ (`displayMode === 'video'` หรือ `isPureVideoMode`)
  - คืนรอบประมวลผลของ CPU/GPU ให้กับตัวถอดรหัสวิดีโอ 100%

### Phase 4: Verification, Build & TypeCheck
- ตรวจสอบความถูกต้องของ Type definitions ด้วย `npm run typecheck`
- รันการคอมไพล์โปรเจกต์ด้วย `npm run build`
- ทดสอบการเล่น YouTube สตรีมสด (เช่น Lofi Girl, Chillhop) ทั้งใน Desktop Watch Mode, Cinema Mode, Mini Player และ Right Sidebar Dock Mode

---

## 📁 Impacted Files
- `src/main/index.ts` (Phase 1)
- `src/renderer/src/components/youtube/YouTubePlayer.vue` (Phase 2 & 3)
- `src/renderer/src/App.vue` (Phase 2)
- `src/renderer/src/components/visualizers/AnalogVuMeter.vue` (Phase 3)
- `src/renderer/src/services/youtubeService.ts` (Phase 2)
