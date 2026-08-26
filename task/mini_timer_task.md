# Task: Mini-Player Timer Widget & Dynamic Taskbar Countdown (`mini_timer`)

- **Associated Plan:** [planning/mini_timer.md](file:///d:/Source/github/sorinoi/lofi-player/planning/mini_timer.md)
- **Current Phase:** All Phases Completed 🟢
- **Status:** 🟢 Completed

---

## 1. Completed Tasks
- [x] ออกแบบโครงสร้างแผนการพัฒนา Mini-Player Timer & Taskbar Ticker ([planning/mini_timer.md](file:///d:/Source/github/sorinoi/lofi-player/planning/mini_timer.md))
- [x] เพิ่ม IPC handler `window:setTitle` ใน [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts) เพื่ออัปเดตชื่อ Taskbar ในระบบ Windows
- [x] พัฒนาระบบซิงก์เวลานับถอยหลัง Pomodoro และ Sleep Timer ขึ้น Windows Taskbar แบบ Real-time ใน [src/renderer/src/stores/timer.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/stores/timer.ts)
- [x] พัฒนา Dual View ใน [src/renderer/src/components/layout/MiniPlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/MiniPlayer.vue):
  - **Music View:** ปกอัลบั้ม, ชื่อเพลง, แถบเวลา, ปุ่มเล่น, พร้อมป้ายเวลานับถอยหลังที่กดสลับมุมมองได้
  - **Focus Clock Widget View:** หน้าปัดนาฬิกาโฟกัสขนาดใหญ่, ปุ่มเลือกเวลา 25m / 45m / 60m, ปุ่ม Start/Pause/Reset, ตัวนับเซสชัน, และแถบเพลงมินิด้านล่าง
- [x] ผ่านการทดสอบ `npm run typecheck` และ `npm run build` สมบูรณ์ 100% (0 errors, 0 warnings)

---

## 2. Next Actions
- [ ] สลับกลับไปยัง Master Task `core_features` เพื่อดำเนินการ **Phase 6: Performance Optimization & Distribution Packaging** (สร้างตัวติดตั้ง `.exe`)

---

## 3. Phase Checklist

### Phase 1: Dynamic Taskbar & Title Ticker (🟢 Completed)
- [x] Electron `window:setTitle` IPC handler
- [x] Preload API bridge `window.api.setWindowTitle`
- [x] Real-time synchronization of Pomodoro & Sleep countdowns to Taskbar

### Phase 2: Mini-Player Dual View & Focus Clock Widget (🟢 Completed)
- [x] Compact interactive Timer badge on Mini-Player Header
- [x] Focus Clock Widget view mode with large digital digits and 25/45/60m presets
- [x] Instant toggle button between Music View and Focus Clock View
- [x] Compact audio playback strip inside Focus Clock Widget

### Phase 3: Verification & Integration (🟢 Completed)
- [x] Verification: `npm run typecheck` & `npm run build` succeed with 0 errors

---

## 4. Modified & Created Files
- [MOD] `src/main/index.ts` - Added `window:setTitle` IPC handler
- [MOD] `src/preload/index.ts` - Exposed `setWindowTitle` API
- [MOD] `src/renderer/src/stores/timer.ts` - Added real-time Taskbar and document title synchronization
- [MOD] `src/renderer/src/components/layout/MiniPlayer.vue` - Implemented Dual View (Music View & Focus Clock Widget)

---

## 5. Plan & Workflow Adjustments (Changelog)
- **2026-08-26:** Completed all phases of Mini-Player Timer Widget & Dynamic Taskbar Countdown.
