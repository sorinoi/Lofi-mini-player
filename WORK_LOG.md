# Work Log - Lofi Music Player Desktop App

บันทึกการทำงานและติดตามความคืบหน้าการพัฒนาโปรเจกต์ Lofi Music Player

---

## 🎯 Active Task Pointer
- **Current Task:** Core Features Development (`core_features`)
- **Task File:** [task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md)
- **Current Status:** All Core Features (Phases 1-5) Completed 🟢 (Standby for User Instructions / Testing)

---

## 📌 Project Overview & Goals
- **Project:** Lofi Music Player Desktop App
- **Tech Stack:** Electron, Vue 3, Vite, Tailwind CSS, Pinia, Howler.js / Web Audio API
- **Status:** 🟢 All Functional Requirements Completed (Packaging on Standby)

---

## 🎯 Milestones & Task Checklist

### Completed Core Features ([planning/core_features.md](file:///d:/Source/github/sorinoi/lofi-player/planning/core_features.md))
- [x] Initial Requirements Specification ([REQUIREMENT.md](file:///d:/Source/github/sorinoi/lofi-player/REQUIREMENT.md)) & Tech Stack ([TECH_STACK.md](file:///d:/Source/github/sorinoi/lofi-player/TECH_STACK.md))
- [x] Project Operating Rules & Protocols ([RULE.md](file:///d:/Source/github/sorinoi/lofi-player/RULE.md))
- [x] Project Initialization & Setup Boilerplate ([planning/init_project.md](file:///d:/Source/github/sorinoi/lofi-player/planning/init_project.md) / [task/init_project_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/init_project_task.md))
- [x] **Phase 1:** Web Audio Engine & 4 Music-Reactive VU Visualizers ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Phase 2:** Local Audio Import, Metadata Parser & Persistent Library ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Phase 3:** Ambient Sound Mixer, Pomodoro & Sleep Timers ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Phase 4:** YouTube Music & Video Integration ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Phase 5:** Custom Titlebar, Mini-Player & Global Shortcuts ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Sub-Feature:** Mini-Player Timer Widget & Dynamic Taskbar Countdown ([task/mini_timer_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/mini_timer_task.md))

### Standby Stage (On-Demand)
- [ ] **Packaging & Distribution:** Build `.exe` installer (รอคำสั่งจากผู้ใช้เมื่อทดสอบเสร็จสมบูรณ์)

---

## 📝 Activity & Changelog

### [2026-08-26]
- **Task:** ปรับแผนงานหลักตามคำสั่งของผู้ใช้
- **Details:**
  - **ตัด Phase 6 (Packaging) ออกจากแผนงานหลักแบบ Sequential** โดยจะดำเนินการทำตัวติดตั้ง `.exe` ก็ต่อเมื่อโปรเจกต์เสร็จสมบูรณ์และรอคำสั่งจากผู้ใช้เท่านั้น
  - ฟังก์ชันการทำงานทั้งหมดตามข้อกำหนด (Phases 1-5) เสร็จสมบูรณ์ 100% พร้อมเปิดทดสอบใช้งานในโหมด Development
  - **แก้ไขสาเหตุที่ VU Meter ไม่ขยับตอนเล่น YouTube (Root Cause Fix):**
    1. ปรับแก้ทั้ง 4 Visualizer components ([AnalogVuMeter.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/AnalogVuMeter.vue), [FrequencyBars.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/FrequencyBars.vue), [CircularPulse.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/CircularPulse.vue), [PixelWave.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/visualizers/PixelWave.vue)) ให้ตรวจสอบสถานะเล่นจากทั้ง `playerStore.isPlaying` และ `ytStore.isPlaying`
    2. ปรับโครงสร้างแท็บใน [App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue) จาก `v-if` เป็น `v-show` เพื่อให้ YouTube เล่นต่อเนื่องเบื้องหลังได้ตลอดเวลาขณะสลับมาดูหน้าแรก (Now Playing VU Visualizer)
    3. เชื่อมต่อ `onStateChange` ของ YouTube API ให้ส่งสัญญาณเปิด/ปิดคลื่นเสียงมาที่ `audioEngine` โดยตรง
    4. เพิ่มระบบ Canvas Dynamic Auto-Resize ให้ปรับขนาดอัตโนมัติตามความกว้างของหน้าจอ
  - **แก้ไขปัญหาทุกเพลงขึ้นสถานะกำลังเล่นพร้อมกัน (Track ID Collision Bugfix):**
    - แก้ไขฟังก์ชัน `parseTrackMetadata` ใน Electron Main Process ให้สร้าง Unique ID จากการทำ SHA-256 Hash ของ `filePath` แต่ละไฟล์ แทนการใช้ Substring Base64 + Timestamp เดิมที่ทำให้ทุกไฟล์ในโฟลเดอร์เดียวกันได้ ID ซ้ำกันทั้งหมด
    - เพิ่มระบบ Auto-Sanitize ใน `initLibrary()` เพื่อสแกนและแก้ไข ID ของเพลงเก่าที่เคยบันทึกไว้ใน IndexedDB ให้ไม่ซ้ำกันโดยอัตโนมัติ
    - ปรับปรุง `isCurrentTrack()` ใน [MusicLibrary.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/library/MusicLibrary.vue) ให้ระบุตัวเพลงที่กำลังเล่นได้อย่างแม่นยำ 100%
  - **เพิ่มโหมดแสดง VU Visualizer ใน Mini-Player (Tri-View Mini Mode):**
    - พัฒนาให้หน้าต่างจิ๋ว Mini Player (360x220) สามารถสลับมุมมองได้ถึง 3 โหมด:
      1. 🎵 **Track View:** ปกเพลง, ชื่อเพลง, แถบเวลา, ปุ่มเล่นเพลง และระดับเสียง
      2. 📻 **VU Visualizer View:** หน้าปัดเข็ม Analog VU / Frequency Bars / Circular Pulse / Pixel Wave เต้นตามเพลง พร้อมปุ่มกดเปลี่ยนรูปแบบ Visualizer บนหน้าต่างจิ๋วได้ทันที
      3. ⏱️ **Timer View:** หน้าปัดนาฬิกาจับเวลาโฟกัสขนาดใหญ่ พร้อมตัวเลือก 25m, 45m, 60m
  - ผ่านการทดสอบ `npm run typecheck` และ `npm run build` สมบูรณ์ 100% (0 errors, 0 warnings)
