# Plan: Subscription Rate Limit & Quota Monitor (`planning/rate_limit_monitor.md`)

- **Associated Task:** [task/rate_limit_monitor_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/rate_limit_monitor_task.md)
- **Status:** 🟡 Awaiting User Approval

---

## 1. Overview
พัฒนาระบบ **Subscription Rate Limit & Quota Monitor** สำหรับเชื่อมต่อและตรวจสอบโควต้าการใช้งาน AI Subscription (เช่น Codex / ChatGPT / Copilot) แสดงสถานะ % โควต้าที่เหลือ, จำนวนข้อความ/รีเควสต์, และเวลานับถอยหลัง Reset รอบถัดไปบน Titlebar, Sidebar และ Mini-Player

---

## 2. Structured Implementation Phases

### Phase 1: Electron Main IPC & Secure Fetch Gateway
- [ ] เพิ่ม IPC handler `quota:fetchUsage` ใน Electron Main Process เพื่อส่ง Authenticated Request ข้าม CORS
- [ ] พัฒนาฟังก์ชันคำนวณ % โควต้าและเวลา Reset
- [ ] เชื่อมต่อ Preload API bridge `window.api.fetchQuota`

### Phase 2: Quota Store & Settings Modal
- [ ] สร้าง `useQuotaStore` (Pinia) สำหรับจัดการ Token, % โควต้า, เวลานับถอยหลัง, และ Auto-polling (ทุก 3-5 นาที)
- [ ] สร้างคอมโพเนนต์ `QuotaModal.vue` สำหรับใส่ Token, ทดสอบการเชื่อมต่อ (Test Connection), และแดชบอร์ดสรุปสถิติ

### Phase 3: UI Indicators (Titlebar & Mini-Player) & Verification
- [ ] เพิ่มปุ่ม Indicator `⚡ Quota` บน Custom Titlebar
- [ ] เพิ่มแถบแสดงสถานะบนโหมด Mini-Player
- [ ] ตรวจสอบความถูกต้องด้วย `npm run typecheck` และ `npm run build`
