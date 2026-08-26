# Plan: Mini-Player Timer Widget & Dynamic Taskbar Countdown

- **Associated Task:** [task/mini_timer_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/mini_timer_task.md)
- **Status:** 🟡 Awaiting User Approval

---

## 1. Overview
เพิ่มขีดความสามารถให้ **Mini-Player (Floating Widget)** และแถบ **Windows Taskbar** แสดงเวลานับถอยหลังและควบคุม **Pomodoro Focus Timer (25m / 45m / 60m)** และ **Sleep Timer** ได้อย่างสมบูรณ์แบบขณะย่อหน้าต่างหรือพับจอลง Taskbar

---

## 2. Detailed Phases

### Phase 1: Dynamic Taskbar & Title Ticker
- [ ] เพิ่ม IPC handler `window:setTitle` ใน Electron Main Process ([src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts)) เพื่ออัปเดตชื่อหน้าต่างบน Windows Taskbar
- [ ] ซิงก์เวลานับถอยหลัง Pomodoro (`[🎯 24:59]`) และ Sleep Timer (`[🌙 44:30]`) ไปยัง Taskbar Title แบบ Real-time

### Phase 2: Mini-Player Dual View & Focus Clock Widget
- [ ] พัฒนา **Dual View** ใน [src/renderer/src/components/layout/MiniPlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/MiniPlayer.vue):
  1. **Music View:** หน้าจอเพลงเดิม + เพิ่มปุ่ม Badge นับถอยหลัง `🎯 24:59` กด Start/Pause ได้ทันที
  2. **Focus Clock View:** เปลี่ยนหน้าต่างจิ๋วเป็น **หน้าปัดนาฬิกาโฟกัส (Focus Clock Widget)** แสดงตัวเลขนับถอยหลังขนาดใหญ่, วงแหวน SVG Progress Ring, ปุ่มเลือกเวลา `25m / 45m / 60m`, และปุ่ม Start/Pause/Reset พร้อมแถบควบคุมเพลงด้านล่าง
- [ ] ปุ่มสลับมุมมอง Music ↔ Focus Clock ในคลิกเดียว

### Phase 3: Verification & Integration
- [ ] ทดสอบ `npm run typecheck` และ `npm run build`
- [ ] ตรวจสอบการนับเวลาในโหมด Mini และ Taskbar
