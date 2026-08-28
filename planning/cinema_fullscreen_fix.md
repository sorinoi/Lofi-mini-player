# Planning: YouTube Fullscreen & Cinema Mode Tab Overlap Fix (`cinema_fullscreen_fix`)

## 1. Problem Analysis & Root Cause
- **User Issue:** ในหน้าจอ YouTube Stream เมื่อกดเปิดแบบเต็มจอ (Cinema Mode หรือ Fullscreen) แถบด้านบน (Titlebar / Tab Headers) มีการซ้อนทับกัน (Overlapping / Clashing)
- **Root Causes:**
  1. **Stacking Context & Layout Collision in `App.vue`:**
     - เมื่ออยู่ในหน้าจอ Desktop ตัว `YouTubePlayer` ถูกกำหนดตำแหน่งแบบ `desktop-youtube-active` (absolute, top: 36px, left: 240px, z-index: 15) ซึ่งอยู่ข้างนอกแต่ซ้อนทับกับ Desktop Container (z-index: 10) ที่มี `CustomTitlebar` (z-index: 50)
     - เมื่อเปิด Cinema Mode หรือขยายหน้าต่าง ตัววิดีโอไม่ได้ขยายทับเต็มหน้าต่างทั้งจออย่างแท้จริง ทำให้ Titlebar (36px) และแถบหัวข้อของ YouTube Player ซ้อนกันที่ด้านบน
  2. **Internal Header Duplication in `YouTubePlayer.vue`:**
     - ใน Cinema Mode แถบ `Player Controls Header` (Title, Live badge, Switch to VU, Cinema button) ยังคงแสดงซ้อนกับขอบบน ทำให้เกิดการเหลื่อมล้ำกับ Titlebar หลัก

## 2. Technical Architecture & Solution
1. **Shared Cinema State in `stores/youtube.ts`:**
   - เพิ่ม `isCinemaMode = ref(false)` และ `toggleCinemaMode()` ลงใน Pinia store เพื่อให้ `App.vue` และ `YouTubePlayer.vue` ซิงค์สถานะกันอย่างสมบูรณ์
2. **True Fullscreen Cinema Overlay in `App.vue`:**
   - เมื่อ `ytStore.isCinemaMode === true`:
     - กำหนดคลาส `.cinema-video-fullscreen` ให้กับ `YouTubePlayer` (`position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 60 !important; background: #000 !important;`)
     - ปกคลุมเต็มหน้าจอ 100% เหนือ Titlebar, Sidebar และ Footer อย่างสมบูรณ์แบบ ไม่มีแถบใด ๆ ซ้อนทับ
3. **Immersive Cinema UI in `YouTubePlayer.vue`:**
   - เมื่ออยู่ใน Cinema Mode:
     - วิดีโอขยายเต็มพื้นที่ 100% ไร้ขอบ
     - แถบควบคุมบนเปลี่ยนเป็น **Minimalist Floating Top Bar** ลอยอยู่ด้านบนพร้อมปุ่ม `[🎬 Exit Cinema (Esc)]` และข้อมูลสตรีม
     - รองรับการกดปุ่ม `Escape` บนคีย์บอร์ดเพื่อออกจาก Cinema Mode
4. **HTML5 Fullscreen API Compatibility:**
   - เพิ่ม CSS `:fullscreen` ให้มี `z-index: 99999 !important;` เพื่อรองรับกรณีคลิกปุ่ม Fullscreen ในตัวเล่นของ YouTube IFrame เอง

## 3. Implementation Steps
- **Phase 1:** อัปเดต `stores/youtube.ts` เพิ่ม `isCinemaMode`
- **Phase 2:** อัปเดต `App.vue` ให้รองรับ `.cinema-video-fullscreen`
- **Phase 3:** ปรับปรุง `YouTubePlayer.vue` สำหรับโหมด Cinema แบบไร้รอยต่อ และดักจับปุ่ม `Escape`
- **Phase 4:** ตรวจสอบ Type Check (`npm run typecheck`) และคอมไพล์ตัวติดตั้ง Windows (`npm run build:win`)
