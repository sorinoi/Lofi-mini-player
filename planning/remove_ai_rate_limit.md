# Plan: Clean Removal of AI Rate Limit & Quota Monitor (`planning/remove_ai_rate_limit.md`)

- **Associated Task:** [task/remove_ai_rate_limit_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/remove_ai_rate_limit_task.md)
- **Status:** 🟢 Completed & Verified

---

## 1. Overview
ดำเนินการนำฟีเจอร์ **Codex & AI Subscription Rate Limit / Quota Monitor** ออกจากโปรเจกต์ Lofi Player อย่างสะอาดและสมบูรณ์ ทั้งในส่วน Electron Main Process (Detector & IPC handlers), Preload APIs, Pinia Store, Vue Components, UI Buttons/Badges และเอกสารประกอบ เพื่อคืนความเรียบง่ายและเป็นระเบียบให้กับตัวแอปพลิเคชัน

---

## 2. Structured Implementation Phases

### Phase 1: Main Process & Preload API Cleanup
- [x] ลบไฟล์ Backend Detectors: `src/main/codexDetector.ts`, `src/main/githubCopilotDetector.ts`, `src/main/openAIDetector.ts`, `src/main/zhipuDetector.ts`
- [x] ลบ IPC Handlers `quota:detectLocalCodex` และ `quota:fetchUsage` ออกจาก `src/main/index.ts`
- [x] ลบ ContextBridge APIs `fetchQuotaUsage` และ `detectLocalCodex` ออกจาก `src/preload/index.ts`

### Phase 2: Frontend Components, Store & UI Integration Cleanup
- [x] ลบ Pinia Store `src/renderer/src/stores/quota.ts`
- [x] ลบคอมโพเนนต์ `src/renderer/src/components/quota/QuotaModal.vue` และลบโฟลเดอร์ `src/renderer/src/components/quota`
- [x] ปรับปรุง `src/renderer/src/components/layout/CustomTitlebar.vue` (ลบ Badge โควต้าและ Zap icon)
- [x] ปรับปรุง `src/renderer/src/components/layout/MiniPlayer.vue` (ลบ Mini Quota Badge และฟังก์ชัน openQuotaModal)
- [x] ปรับปรุง `src/renderer/src/App.vue` (ลบ Sidebar AI Rate Limit Button, QuotaModal container, และการ initQuota)

### Phase 3: Documentation, Type Checking & Build Verification
- [x] ปรับปรุง `README.md` โดยตัดส่วนที่ 8 (Codex & AI Rate Limit Monitor) ออก
- [x] รัน `npm run typecheck` (`typecheck:node` และ `typecheck:web`) ตรวจสอบความถูกต้องว่าปราศจาก TypeScript/Vue Error 100%
- [x] รัน `npm run build` ยืนยันการคอมไพล์สำเร็จ
