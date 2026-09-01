# Work Log - Lofi Music Player Desktop App

บันทึกการทำงานและติดตามความคืบหน้าการพัฒนาโปรเจกต์ Lofi Music Player

---

## 🎯 Active Task Pointer
- **Current Task:** None (All planned tasks completed)
- **Task File:** [task/note_status_typography_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/note_status_typography_task.md)
- **Current Status:** 🟢 Completed & Ready (Note View Status Cards Typography & Layout Optimization)

---

## 📌 Project Overview & Goals
- **Project:** Lofi Music Player Desktop App (v1.1.1)
- **Tech Stack:** Electron, Vue 3, Vite, Tailwind CSS, Pinia, Howler.js / Web Audio API, koffi, electron-builder
- **Status:** 🟢 Released (Version 1.1.1 Ready)

---

## 🎯 Milestones & Task Checklist

### Completed Tasks
- [x] Initial Requirements Specification ([REQUIREMENT.md](file:///d:/Source/github/sorinoi/lofi-player/REQUIREMENT.md)) & Tech Stack ([TECH_STACK.md](file:///d:/Source/github/sorinoi/lofi-player/TECH_STACK.md))
- [x] Project Operating Rules & Protocols ([RULE.md](file:///d:/Source/github/sorinoi/lofi-player/RULE.md))
- [x] Project Initialization & Setup Boilerplate ([planning/init_project.md](file:///d:/Source/github/sorinoi/lofi-player/planning/init_project.md) / [task/init_project_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/init_project_task.md))
- [x] **Core Features Phase 1:** Web Audio Engine & 4 Music-Reactive VU Visualizers ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Core Features Phase 2:** Local Audio Import, Metadata Parser & Persistent Library ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Core Features Phase 3:** Ambient Sound Mixer, Pomodoro & Sleep Timers ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Core Features Phase 4:** YouTube Music & Video Integration ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Core Features Phase 5:** Custom Titlebar, Mini-Player & Global Shortcuts ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Sub-Feature 1:** Mini-Player Timer Widget & Dynamic Taskbar Countdown ([task/mini_timer_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/mini_timer_task.md))
- [x] **Packaging & Distribution:** Build `.exe` installer & Complete `README.md` ([task/core_features_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/core_features_task.md))
- [x] **Sub-Feature 2:** Subscription Codex & AI Rate Limit / Quota Monitor ([task/rate_limit_monitor_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/rate_limit_monitor_task.md))
- [x] **Sub-Feature 3:** YouTube Stream Playback & Live URL Resolver Fix ([task/youtube_stream_fix_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/youtube_stream_fix_task.md))
- [x] **Feature Removal:** Clean Removal of AI Rate Limit & Quota Monitor ([task/remove_ai_rate_limit_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/remove_ai_rate_limit_task.md))
- [x] **App Branding:** Custom App Icon Integration with `cga-lofi.ico` ([task/app_icon_customization_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/app_icon_customization_task.md))
- [x] **UI/UX Enhancement:** Native Splash Screen with 3s Minimum Loading & Cozy Animations ([task/splash_screen_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/splash_screen_task.md))
- [x] **Video Feature:** Dedicated YouTube Video Screen Mode & Quad-View Mini Player ([task/youtube_video_view_mode_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_video_view_mode_task.md))
- [x] **Sub-Feature 4:** Floating Ghost Timer Overlay in Video Mode ([task/floating_ghost_timer_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/floating_ghost_timer_task.md))
- [x] **Bug Fix:** YouTube Fullscreen & Cinema Mode Tab Overlap Fix ([task/cinema_fullscreen_fix_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/cinema_fullscreen_fix_task.md))
- [x] **Release 1.1.0:** Version Bump to 1.1.0 & Windows Build
- [x] **Feature Addition:** To-Do App with JSON Database & Timestamps ([task/todo_app_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/todo_app_task.md))
- [x] **Feature Addition:** Right Sidebar Dock Mode for To-Do & Music ([task/dock_sidebar_mode_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/dock_sidebar_mode_task.md))
- [x] **Feature Addition:** Note Record with JSON Database & Timestamps ([task/note_record_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/note_record_task.md))
- [x] **Bug Fix:** Disable YouTube Autoplay on App Startup ([task/youtube_autoplay_fix_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_autoplay_fix_task.md))
- [x] **Bug Fix:** Fix YouTube Video Rendering in Right Sidebar Dock Mode ([task/dock_sidebar_video_fix_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/dock_sidebar_video_fix_task.md))
- [x] **UI/UX Enhancement:** Adjust Dock Sidebar YouTube Video Height to 16:9 Aspect Ratio ([task/dock_sidebar_video_aspect_ratio_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/dock_sidebar_video_aspect_ratio_task.md))
- [x] **Desktop Integration:** Windows Desktop Space Reservation (AppBar) for Dock Sidebar Mode ([task/appbar_screen_reservation_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/appbar_screen_reservation_task.md))
- [x] **Bug Fix:** Fix Dock Sidebar Window Positioning in Reserved AppBar Space ([task/dock_sidebar_position_fix_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/dock_sidebar_position_fix_task.md))
- [x] **Bug Fix:** Fix Windows Taskbar Overlapping Dock Sidebar Application ([task/dock_sidebar_taskbar_overlap_fix_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/dock_sidebar_taskbar_overlap_fix_task.md))
- [x] **Data Persistence:** YouTube Bookmarks JSON Database Persistence ([task/youtube_bookmark_persistence_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_bookmark_persistence_task.md))
- [x] **UI/UX Enhancement:** YouTube Full-Width Layout for Fullscreen / Maximized Displays ([task/youtube_fullscreen_fullwidth_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_fullscreen_fullwidth_task.md))
- [x] **UI/UX Redesign:** YouTube Watch-Style 2-Column Desktop Layout ([task/youtube_watch_layout_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_watch_layout_task.md))
- [x] **Feature Addition:** YouTube Right Sidebar Switchable Modes (Playlists, To-Do, Notes) ([task/youtube_right_sidebar_modes_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_right_sidebar_modes_task.md))
- [x] **UI/UX Enhancement:** Todo View Status Cards Typography & Layout Optimization ([task/todo_status_typography_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/todo_status_typography_task.md))
- [x] **UI/UX Enhancement:** Note View Status Cards Typography & Layout Optimization ([task/note_status_typography_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/note_status_typography_task.md))

---

## 📝 Activity & Changelog

### [2026-09-01] - Task 26: Note View Status Cards Typography & Layout Optimization
- **Task Tracker:** [task/note_status_typography_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/note_status_typography_task.md)
- **Task Summary:** ปรับปรุงการแสดงผลการ์ดสรุปสถานะของ Notes (Total Notes, Pinned Notes, Storage) โดยนำกล่องไอคอนขนาดใหญ่ออก และจัดวางด้วยตัวอักษรและตัวเลขสีที่คมชัด เพื่อแก้ปัญหาข้อความขึ้นบรรทัดใหม่/ตัวหนังสือตกเมื่อแสดงใน Sidebar หรือหน้าต่างขนาดกะทัดรัด
- **Details:**
  - นำกล่องไอคอนออกจาก Quick Stats Cards ใน [src/renderer/src/components/notes/NoteView.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/notes/NoteView.vue)
  - ปรับใช้ Color-Coded Typography: Total Notes (สีกลาง/ขาว), Pinned Notes (สีเหลืองอำพัน Amber), และ Storage (สีเขียวมรกต Emerald)
  - ผ่านการทดสอบ Typecheck (`npm run typecheck`) สำเร็จ 100% (0 errors)
  - ผ่านการทดสอบ Build โปรเจกต์ (`npm run build`) สำเร็จ 100% (0 errors)

---

## 📝 Activity & Changelog

### [2026-09-01] - Task 25: Todo View Status Cards Typography & Layout Optimization
- **Task Tracker:** [task/todo_status_typography_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/todo_status_typography_task.md)
- **Task Summary:** ปรับปรุงการแสดงผลการ์ดสรุปสถานะของ To-Do List (Total Tasks, In Progress, Completed, Progress) โดยนำกล่องไอคอนขนาดใหญ่ออก และจัดวางด้วยตัวอักษรและตัวเลขสีที่คมชัด เพื่อแก้ปัญหาข้อความขึ้นบรรทัดใหม่/ตัวหนังสือตกเมื่อแสดงใน Sidebar หรือหน้าจอขนาดกะทัดรัด
- **Details:**
  - นำกล่องไอคอนออกจาก Quick Stats Cards ใน [src/renderer/src/components/todo/TodoView.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/todo/TodoView.vue)
  - ปรับใช้ Color-Coded Typography: Total (สีกลาง/ขาว), In Progress (สีส้มอำพัน Amber), Completed (สีเขียวมรกต Emerald), และ Progress (สีหลัก Cyan/Pink)
  - เพิ่ม `whitespace-nowrap flex-shrink-0` ใน [src/renderer/src/components/todo/TodoItemCard.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/todo/TodoItemCard.vue) ป้องกันข้อความใน Badge หักบรรทัด
  - ผ่านการทดสอบ Typecheck (`npm run typecheck`) สำเร็จ 100% (0 errors)
  - ผ่านการทดสอบ Build โปรเจกต์ (`npm run build`) สำเร็จ 100% (0 errors)

---

## 📝 Activity & Changelog

### [2026-09-01] - Task 24: YouTube Right Sidebar Switchable Modes (Playlists, To-Do, Notes)
- **Task Tracker:** [task/youtube_right_sidebar_modes_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_right_sidebar_modes_task.md)
- **Task Summary:** ปรับปรุงเลย์เอาต์หน้าจอ YouTube Stream Player โดยคงการแสดงผลเครื่องเล่นวิดีโอ 16:9 ขนาดใหญ่ไว้ที่ฝั่งซ้ายอย่างต่อเนื่อง และย้ายระบบสลับโหมดไปยัง Sidebar ฝั่งขวา เพื่อให้ผู้ใช้สามารถเลือกดูได้ระหว่าง **Playlists & Stations**, **To-Do List**, หรือ **Notes & Memos** ขณะรับชมวิดีโอ
- **Details:**
  - กำหนดให้ฝั่งซ้ายแสดงเครื่องเล่นวิดีโอ 16:9 และ VU Visualizer พร้อมแผงควบคุมและข้อมูลสตรีมตลอดเวลา
  - ย้าย Tab Pills ไปยัง Sidebar ฝั่งขวา (`lg:w-[420px] xl:w-[480px] 2xl:w-[540px]`) สำหรับสลับ 3 โหมดพร้อม Badge แจ้งเตือน
  - ฝังคอมโพเนนต์ [src/renderer/src/components/todo/TodoView.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/todo/TodoView.vue) และ [src/renderer/src/components/notes/NoteView.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/notes/NoteView.vue) ภายใน Sidebar ฝั่งขวา
  - ผ่านการทดสอบ Typecheck (`npm run typecheck`) สำเร็จ 100% (0 errors)
  - ผ่านการทดสอบ Build โปรเจกต์ (`npm run build`) สำเร็จ 100% (0 errors)

---

## 📝 Activity & Changelog

### [2026-09-01] - Task 23: YouTube Left Panel Switchable Modes (Player, To-Do, Notes)
- **Task Tracker:** [task/youtube_left_panel_modes_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_left_panel_modes_task.md)
- **Task Summary:** เพิ่มฟังก์ชันสลับโหมดการแสดงผลของพื้นที่ฝั่งซ้ายในหน้า YouTube Stream Player ให้ผู้ใช้สามารถเลือกดูได้ระหว่าง **Video & Visualizer**, **Focus To-Do**, หรือ **Notes & Memos** โดยที่เสียงสตรีม YouTube ยังคงเล่นต่อเนื่องไม่มีสะดุด
- **Details:**
  - เพิ่ม Tab Pills Switcher สำหรับสลับโหมด 3 โหมดพร้อม Badge แสดงจำนวนงานคงค้างและจำนวนโน้ต
  - ฝังคอมโพเนนต์ [src/renderer/src/components/todo/TodoView.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/todo/TodoView.vue) และ [src/renderer/src/components/notes/NoteView.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/notes/NoteView.vue) ในฝั่งซ้าย
  - ใช้คลาส `.invisible-player` ซ่อน IFrame ไว้เบื้องหลังอย่างต่อเนื่องเมื่อผู้ใช้สลับไปใช้งาน To-Do หรือ Notes เพื่อไม่ให้เสียงเพลงหยุด
  - เพิ่มแถบควบคุมเสียงขนาดกะทัดรัด (Mini Audio HUD) พร้อมปุ่ม Play/Pause ในโหมด To-Do และ Notes
  - ผ่านการทดสอบ Typecheck (`npm run typecheck`) สำเร็จ 100% (0 errors)
  - ผ่านการทดสอบ Build โปรเจกต์ (`npm run build`) สำเร็จ 100% (0 errors)

---

## 📝 Activity & Changelog

### [2026-09-01] - Task 22: YouTube Watch-Style 2-Column Desktop Layout
- **Task Tracker:** [task/youtube_watch_layout_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_watch_layout_task.md)
- **Task Summary:** ปรับปรุงเลย์เอาต์หน้าจอ YouTube Stream Player ให้เป็นรูปแบบ 2 คอลัมน์สไตล์ YouTube Watch Page โดยแสดงเครื่องเล่นวิดีโอขนาดใหญ่ไว้ฝั่งซ้าย และย้าย Playlist (Curated Stations และ Saved Bookmarks) ไปไว้ใน Sidebar ฝั่งขวา
- **Details:**
  - ปรับปรุง [src/renderer/src/components/youtube/YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue) จัดโครงสร้างแบบ 2 คอลัมน์ (`flex flex-col lg:flex-row gap-6`)
  - ย้ายแถบข้อมูลและปุ่มควบคุมเครื่องเล่น (Title, Channel, Mode Switcher, Cinema, Bookmark) ไว้ใต้กรอบวิดีโอ 16:9 ในฝั่งซ้าย
  - จัดการแสดงผลสถานีแนะนำ (Curated Stations) และบุ๊กมาร์ก (Saved Bookmarks) เป็นการ์ดแนวนอนขนาดกะทัดรัดเรียงเป็นคิวใน Sidebar ฝั่งขวา
  - รักษาสถานะ DOM ของ `#youtube-player-element` ไม่ให้เกิดการ Reload หรือตัดขาดเสียงเมื่อสลับโหมด
  - ผ่านการทดสอบ Typecheck (`npm run typecheck`) สำเร็จ 100% (0 errors)
  - ผ่านการทดสอบ Build โปรเจกต์ (`npm run build`) สำเร็จ 100% (0 errors)

---

## 📝 Activity & Changelog

### [2026-09-01] - Task 21: YouTube Full-Width Layout for Fullscreen / Maximized Displays
- **Plan Document:** [planning/youtube_fullscreen_fullwidth.md](file:///d:/Source/github/sorinoi/lofi-player/planning/youtube_fullscreen_fullwidth.md)
- **Task Tracker:** [task/youtube_fullscreen_fullwidth_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_fullscreen_fullwidth_task.md)
- **Task Summary:** ปรับปรุงเลย์เอาต์หน้าจอ YouTube Stream Player ให้แสดงผลเต็มความกว้างของหน้าจอ (Full-Width) เมื่อเปิดในโหมดเต็มจอ หรือขยายหน้าต่างแบบ Maximized โดยปลดล็อกข้อจำกัด `max-w-6xl mx-auto` และปรับ Responsive Grid ให้รองรับการแสดงผลสูงสุด 6 คอลัมน์
- **Details:**
  - ปรับปรุง [src/renderer/src/components/youtube/YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue) ใช้คลาส `w-full` พร้อมจัดระยะขอบแบบยืดหยุ่น
  - ขยาย Grid ของ Curated 24/7 Lofi Stations และ Saved Bookmarks เป็น `sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`
  - ปรับขนาดช่องค้นหาและวางลิงก์ YouTube เป็น `max-w-xl`
  - ผ่านการทดสอบ Typecheck (`npm run typecheck`) สำเร็จ 100% (0 errors)
  - ผ่านการทดสอบ Build โปรเจกต์ (`npm run build`) สำเร็จ 100% (0 errors)

---

## 📝 Activity & Changelog

### [2026-09-01] - Task 20: YouTube Bookmarks JSON Database Persistence
- **Plan Document:** [planning/youtube_bookmark_persistence.md](file:///d:/Source/github/sorinoi/lofi-player/planning/youtube_bookmark_persistence.md)
- **Task Tracker:** [task/youtube_bookmark_persistence_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_bookmark_persistence_task.md)
- **Task Summary:** พัฒนาระบบบันทึก YouTube Bookmarks ลงในฐานข้อมูลไฟล์ JSON (`%APPDATA%/lofi-player/youtube_bookmarks.json`) ผ่าน Electron Main Process IPC แก้ปัญหาบุ๊กมาร์กหายเมื่อปิดและเปิดโปรแกรมใหม่
- **Details:**
  - สร้างโมดูล [src/main/youtubeBookmarkStorage.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/youtubeBookmarkStorage.ts) รองรับการโหลด/บันทึกไฟล์ JSON และเปิดโฟลเดอร์ใน Explorer
  - ลงทะเบียน IPC Handlers (`youtube:loadBookmarks`, `youtube:saveBookmarks`, `youtube:openBookmarksFolder`) ใน [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts)
  - เชื่อมต่อ Preload Bridge [src/preload/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/preload/index.ts)
  - อัปเดต [src/renderer/src/services/storageService.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/storageService.ts) และ [src/renderer/src/stores/youtube.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/stores/youtube.ts) ให้ซิงค์สถานะกับไฟล์ JSON แบบทันที
  - เพิ่มปุ่ม "Open JSON File" ใน [src/renderer/src/components/youtube/YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue)
  - เพิ่มการโหลดบุ๊กมาร์กตั้งแต่เริ่มแอปใน [src/renderer/src/App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue)
  - ผ่านการทดสอบ Typecheck (`npm run typecheck`) และ Build (`npm run build`) สำเร็จ 100% (0 errors)

### [2026-08-30] - Task 19: Fix Windows Taskbar Overlapping Dock Sidebar Application
- **Plan Document:** [planning/dock_sidebar_taskbar_overlap_fix.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/planning/dock_sidebar_taskbar_overlap_fix.md)
- **Task Tracker:** [task/dock_sidebar_taskbar_overlap_fix_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/dock_sidebar_taskbar_overlap_fix_task.md)
- **Task Summary:** แก้ไขปัญหา Windows Taskbar ด้านล่างทับแอปพลิเคชันในโหมด Dock Sidebar ทำให้มองไม่เห็นปุ่มควบคุมเสียง (Play/Pause, Volume, Seek) และวิดีโอ YouTube โดยปรับปรุงการคำนวณความสูงและพิกัดแกน Y จาก `display.workArea` แทนที่ความละเอียดเต็มจอ `display.bounds`
- **Details:**
  - ปรับปรุง [src/main/appBarService.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/appBarService.ts) โดยคำนวณ `targetY = Math.round(workArea.y)` และ `targetHeight = Math.round(workArea.height)` เพื่อให้ความสูงของหน้าต่างหยุดพอดีที่ขอบบนของ Windows Taskbar
  - อัปเดตพิกัด `rc.top` และ `rc.bottom` ในการส่ง Win32 AppBar Message (`ABM_QUERYPOS` / `ABM_SETPOS`) ให้จองพื้นที่เฉพาะส่วน `workArea` ไม่ล้นลงไปในพื้นที่ของ Taskbar
  - ปรับปรุง Fallback Positioning ใน [src/main/index.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/index.ts) ให้ใช้ `workArea.y` และ `workArea.height`
  - ผ่านการทดสอบ Type Check `npm run typecheck` สำเร็จ 100% (0 errors)
  - คอมไพล์โปรเจกต์ `npm run build` สำเร็จ 100% (0 errors)
  - คอมไพล์และ Packaging ตัวติดตั้ง Windows `npm run build:win` สร้างไฟล์ `dist/Lofi Player Setup 1.1.0.exe` สำเร็จ 100% (0 errors)

### [2026-08-28] - Task 18: Fix Dock Sidebar Window Positioning in Reserved AppBar Space
- **Plan Document:** [planning/dock_sidebar_position_fix.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/planning/dock_sidebar_position_fix.md)
- **Task Tracker:** [task/dock_sidebar_position_fix_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/dock_sidebar_position_fix_task.md)
- **Task Summary:** แก้ไขปัญหาหน้าต่าง Lofi Player ไม่กระโดดไปอยู่ในพื้นที่ด้านขวาสุดที่จองไว้ โดยปรับปรุงการคำนวณพิกัดจากความละเอียดเต็มจอ `display.bounds` (`bounds.x + bounds.width - width`), เพิ่มการสั่ง Native Win32 `SetWindowPos` พร้อมระบบ Staggered Retries ป้องกัน Race Condition จากการ `unmaximize()`, และผ่อนปรน `setMinimumSize(100, 100)` ในโหมด Dock
- **Details:**
  - ปรับปรุง [src/main/appBarService.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/appBarService.ts) ใช้ `display.bounds` เพื่ออ้างอิงขอบจอขวาสุดที่แท้จริง (`targetX = bounds.x + bounds.width - width`, `targetHeight = bounds.height`)
  - เพิ่มระบบ Staggered Retries (`immediate`, `60ms`, `180ms`) ในการเรียก `SetWindowPos` และ `window.setBounds` เพื่อป้องกัน OS Restore Event ของ `unmaximize()` เขียนทับพิกัด
  - ปรับปรุง [src/main/index.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/index.ts) ปรับ `setMinimumSize(100, 100)` เมื่อเข้า Dock Mode และคืนค่า `setMinimumSize(340, 200)` เมื่อออกจาก Dock Mode
  - ผ่านการทดสอบ Type Check `npm run typecheck` สำเร็จ 100% (0 errors)
  - คอมไพล์โปรเจกต์ `npm run build` สำเร็จ 100% (0 errors)
  - คอมไพล์และ Packaging ตัวติดตั้ง Windows `npm run build:win` สำเร็จ 100%

### [2026-08-28] - Task 17: Windows Desktop Space Reservation (AppBar) for Dock Sidebar Mode
- **Plan Document:** [planning/appbar_screen_reservation.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/planning/appbar_screen_reservation.md)
- **Task Tracker:** [task/appbar_screen_reservation_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/appbar_screen_reservation_task.md)
- **Task Summary:** พัฒนาระบบจองพื้นที่หน้าจอเดสก์ท็อป Windows (AppBar) ผ่านไลบรารี `koffi` C-FFI เมื่อเข้าสู่โหมด Right Sidebar Dock Mode เพื่อไม่ให้แอปพลิเคชันอื่นที่เปิดเต็มจอขยายมาทับหรือแทรกไปด้านหลัง Sidebar
- **Details:**
  - ติดตั้งไลบรารี `koffi` (Fast & Modern C-FFI for Node.js / Electron)
  - สร้างโมดูล [src/main/appBarService.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/appBarService.ts) ผูก Win32 API `SHAppBarMessage` จาก `shell32.dll` (`ABM_NEW`, `ABM_QUERYPOS`, `ABM_SETPOS`, `ABM_ACTIVATE`, `ABM_REMOVE`)
  - เชื่อมต่อการจองพื้นที่ใน [src/main/index.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/index.ts) เมื่อเข้าสู่โหมด `enterDockMode()` (ลด WorkArea ทางขวา 340px)
  - เพิ่มระบบ Safe Cleanup อัตโนมัติเมื่อออกจาก Dock Mode (`exitDockMode()`), ย่อหน้าต่าง (`window:minimize`), สลับไป Mini Player (`window:enterMiniMode`), ปิดหน้าต่าง (`window:close`) และก่อนปิดแอป (`app.on('before-quit')`) คืนค่า WorkArea สู่ปกติ 100%
  - ผ่านการทดสอบ Type Check `npm run typecheck` สำเร็จ 100% (0 errors)
  - คอมไพล์โปรเจกต์ `npm run build` สำเร็จ 100% (0 errors)
  - คอมไพล์และ Packaging ตัวติดตั้ง Windows `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.1.0.exe`** สำเร็จ 100%

### [2026-08-28] - Task 16: Adjust Dock Sidebar YouTube Video Height to 16:9 Aspect Ratio
- **Plan Document:** [planning/dock_sidebar_video_aspect_ratio.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/planning/dock_sidebar_video_aspect_ratio.md)
- **Task Tracker:** [task/dock_sidebar_video_aspect_ratio_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/dock_sidebar_video_aspect_ratio_task.md)
- **Task Summary:** ปรับขนาดความสูงของหน้าจอวิดีโอ YouTube ในโหมด Right Sidebar Dock Mode จากเดิม 112px เป็น 180px เพื่อให้อัตราส่วนของภาพพอดีกับความกว้างหน้าต่าง (320px × 180px = 16:9 Widescreen)
- **Details:**
  - ปรับความสูงของคลาส `.dock-video-fixed` ใน [src/renderer/src/App.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/App.vue) เป็น `180px`
  - ปรับความสูงของกล่อง Placeholder View 4 ใน [src/renderer/src/components/layout/DockSidebar.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/components/layout/DockSidebar.vue) เป็น `h-[180px]`
  - ผ่านการทดสอบ Type Check `npm run typecheck` สำเร็จ 100% (0 errors)
  - คอมไพล์โปรเจกต์ `npm run build` สำเร็จ 100% (0 errors)

### [2026-08-28] - Task 15: Fix YouTube Video Rendering in Right Sidebar Dock Mode
- **Plan Document:** [planning/dock_sidebar_video_fix.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/planning/dock_sidebar_video_fix.md)
- **Task Tracker:** [task/dock_sidebar_video_fix_task.md](file:///e:/Source/github/sorinoi/Lofi-mini-player/task/dock_sidebar_video_fix_task.md)
- **Task Summary:** แก้ไขปัญหาภาพสตรีมสด YouTube ไม่แสดงผลเมื่อเปิดใช้งาน Right Sidebar Dock Mode และเลือกมุมมอง Video ในแถบ Mini-Player ด้านล่าง
- **Details:**
  - ปรับค่า `z-index` ของคลาส `.dock-video-fixed` ใน [src/renderer/src/App.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/App.vue) จาก `35` เป็น `55` เพื่อให้อยู่เหนือพื้นหลังทึบของหน้าต่าง DockSidebar
  - ปรับปรุง [src/renderer/src/components/youtube/YouTubePlayer.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/components/youtube/YouTubePlayer.vue) เพิ่ม Computed Properties `isPureVideoMode` และ `isDockVideoMode`
  - ซ่อนองค์ประกอบ Desktop (Header, Search, Preset Grid, Bookmarks) เมื่ออยู่ในโหมด Dock Video
  - เพิ่ม Minimalist HUD Overlay ใน [YouTubePlayer.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/components/youtube/YouTubePlayer.vue) สำหรับโหมด Dock Video (ป้าย LIVE, ชื่อสตรีม, ตัวเลขนับถอยหลัง Ghost Timer, ปุ่ม Play/Pause, ชื่อช่อง, แถบปรับเสียง Master Volume, ปุ่ม Mute)
  - ปรับปรุง View 4 ใน [src/renderer/src/components/layout/DockSidebar.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/components/layout/DockSidebar.vue) ให้เป็นกล่อง Placeholder สำหรับ Overlay ของ `.dock-video-fixed`
  - ผ่านการทดสอบ Type Check `npm run typecheck` สำเร็จ 100% (0 errors)
  - คอมไพล์โปรเจกต์ `npm run build` สำเร็จ 100% (0 errors)

### [2026-08-28] - Task 14: Disable YouTube Autoplay on App Startup
- **Plan Document:** [planning/youtube_autoplay_fix.md](file:///d:/Source/github/sorinoi/lofi-player/planning/youtube_autoplay_fix.md)
- **Task Tracker:** [task/youtube_autoplay_fix_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/youtube_autoplay_fix_task.md)
- **Task Summary:** ปรับปรุงระบบ YouTube Player ไม่ให้เล่นเพลงหรือสตรีมสดรายการแรกใน Curated List โดยอัตโนมัติเมื่อเปิดโปรแกรม โดยจะเล่นต่อเมื่อผู้ใช้กดคลิกเลือกรายการด้วยตนเองเท่านั้น
- **Details:**
  - เพิ่มพารามิเตอร์ `autoPlay: boolean = false` ในฟังก์ชัน `createPlayer` ใน [src/renderer/src/services/youtubeService.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/youtubeService.ts)
  - ปรับค่า `playerVars.autoplay = autoPlay ? 1 : 0` และใน `onReady` hook จะไม่สั่ง `event.target.playVideo()` หรือเปิดการทำงานของ `audioEngine` หาก `autoPlay` เป็น `false`
  - ปรับปรุง [src/renderer/src/components/youtube/YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue) ใน `mountYouTubePlayer()` ให้ส่ง `autoPlay = false` ขณะเริ่มต้น Mount
  - ปรับเงื่อนไข Active Card Highlight ของ Curated Stations และ Bookmarks ให้ตรวจสอบ `ytStore.isPlaying && ytStore.currentVideoId === station.videoId` เพื่อไม่ให้แสดงกรอบกำลังเล่นก่อนที่ผู้ใช้จะคลิก
  - ผ่านการทดสอบ Type Check `npm run typecheck` สำเร็จ 100% (0 errors)
  - คอมไพล์โปรเจกต์ `npm run build` และ Packaging สำเร็จ 100%

### [2026-08-28] - Task 13: Note Record with JSON Database & Timestamps
- **Plan Document:** [planning/note_record.md](file:///d:/Source/github/sorinoi/lofi-player/planning/note_record.md)
- **Task Tracker:** [task/note_record_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/note_record_task.md)
- **Task Summary:** พัฒนาระบบ **Note Record** สำหรับบันทึกข้อความสั้น/บันทึกช่วยจำ จัดเก็บลงไฟล์ JSON (`notes.json`) บันทึกวันที่สร้างและวันที่แก้ไข รองรับการสร้าง แก้ไข ลบ (CRUD), ปักหมุดโน้ต, เลือกสีการ์ด (Color Tags), เชื่อมต่อกับเมนูหลักและ Right Sidebar Dock Mode
- **Details:**
  - สร้างโมดูล [src/main/noteStorage.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/noteStorage.ts) จัดการ I/O ไฟล์ `notes.json` ใน `app.getPath('userData')` แบบ Atomic Write และลงทะเบียน IPC Handlers (`notes:load`, `notes:save`, `notes:openFolder`) ใน [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts)
  - เพิ่ม Preload ContextBridge APIs (`loadNotes`, `saveNotes`, `openNotesFolder`) ใน [src/preload/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/preload/index.ts)
  - ประกาศ Type Definitions ใน [src/renderer/src/types/note.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/types/note.ts) และสร้าง Pinia Store ใน [src/renderer/src/stores/note.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/stores/note.ts) รองรับ Full CRUD, ค้นหาแบบ Real-time, กรองสีการ์ด และจัดเรียง
  - สร้าง UI Components [NoteItemCard.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/notes/NoteItemCard.vue) (การ์ดโน้ตสไตล์ Cozy พร้อมปุ่ม Pin, Edit, Delete, Copy, Timestamp) และ [NoteView.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/notes/NoteView.vue) (หน้าต่างจัดการโน้ตเต็มจอ พร้อมแถบสถิติ, Quick Add Card, Search & Filter Toolbar, Grid)
  - เพิ่มแท็บ **Note Record** ใน Sidebar Navigation ของ [App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue) พร้อม Badge แสดงจำนวนโน้ตทั้งหมด
  - เพิ่มแท็บสลับ `[Tasks] / [Notes]` ในแถบ [DockSidebar.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/DockSidebar.vue) ให้จดโน้ตได้ทันทีในโหมด Right Sidebar Dock
  - ผ่านการทดสอบ Type Check `npm run typecheck` สำเร็จ 100% (0 errors)
  - คอมไพล์ตัวติดตั้ง Windows สำเร็จ 100% ผ่าน `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.1.0.exe`** เรียบร้อย

### [2026-08-26] - Task 3: YouTube Stream Playback & Live Resolver Fix
- **Task:** แก้ไขปัญหาการ Stream YouTube จากลิงก์, ช่องสด และการเล่นต่อเนื่องใน Mini Player Mode
- **Details:**
  - เพิ่ม `session.webRequest.onBeforeSendHeaders` จัดการ `Referer` สำหรับ packaged app และ dev environment ป้องกัน YouTube Error 150/152/153
  - เพิ่ม `--autoplay-policy=no-user-gesture-required` ให้ Chromium เล่นเสียง/วิดีโออัตโนมัติ
  - พัฒนา [src/main/youtubeResolver.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/main/youtubeResolver.ts) รองรับการแกะ `videoId` จากทุกรูปแบบ (Watch, Shorts, Live, Embed, YouTu.be) รวมถึงช่องสด `@Channel/live` (เช่น `@LofiGirl/live`, `@ChillhopMusic/live`)
  - ดึง Metadata (Title, Channel Name, Thumbnail) ผ่าน YouTube oEmbed อัตโนมัติ
  - ปรับปรุง [src/renderer/src/services/youtubeService.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/services/youtubeService.ts) ป้องกันปัญหา DOM Node หาย และดักจับ `onError` (2, 5, 100, 101, 150, 152)
  - ปรับปรุง [App.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/App.vue) และ [YouTubePlayer.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/components/youtube/YouTubePlayer.vue) โดยเปลี่ยนจาก `v-if`/`v-else` และ `display: none` มาเป็น Persistent DOM Mounting ด้วยคลาส `.invisible-player` ทำให้ออดิโอ YouTube เล่นต่อเนื่องแบบไม่มีสะดุดเมื่อย่อเป็น **Mini Player Mode** หรือเมื่อสลับแท็บ
  - อัปเดต Presets ใน `YOUTUBE_LOFI_PRESETS` เป็น Live Streams ปัจจุบัน
  - ซิงค์ระบบ Play/Pause ใน [MiniPlayer.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/components/layout/MiniPlayer.vue), [App.vue](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/App.vue) และ [shortcutService.ts](file:///e:/Source/github/sorinoi/Lofi-mini-player/src/renderer/src/services/shortcutService.ts)
  - ผ่านการทดสอบ `npm run typecheck` และ `npm run build` สำเร็จ 100%

### [2026-08-26] - Task 2: Subscription Codex & AI Rate Limit
- **Task:** พัฒนาระบบ Subscription Rate Limit & Quota Monitor (อ่านจาก Local Codex CLI โดยตรง)
- **Details:**
  - พัฒนา [codexDetector.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/codexDetector.ts) ให้อ่านและตรวจจับสถานะจาก `~/.codex/auth.json`, `~/.codex/config.toml` และประวัติเซสชันใน `session_index.jsonl` ได้โดยตรง 100%
  - ดึงข้อมูล Account Email (`sorinoi11@gmail.com`), Subscription Plan (`ChatGPT Plus`), Active Model (`cx/gpt-5.5` via `9Router`), และคำนวณโควต้า 3-Hour Rolling Window แบบ Real-time อัตโนมัติ โดยผู้ใช้**ไม่ต้องก๊อปปี้ Token มาใส่เองอีกต่อไป (Zero-Configuration)**
  - อัปเดตหน้าต่าง [QuotaModal.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/quota/QuotaModal.vue), Titlebar Badge, และ Mini-Player
  - ผ่านการทดสอบ `npm run typecheck` และคอมไพล์ Windows Installer `.exe` สำเร็จ 100% (0 errors)


### [2026-08-27] - Fix: Automated Electron Binary Installer & Postinstall Auto-Repair
- **Task:** ป้องกันปัญหา `Error: Electron uninstall` / Missing executable binary เมื่อรัน `npm install` ใหม่
- **Details:**
  - สร้าง [scripts/ensure-electron.js](file:///d:/Source/github/sorinoi/Lofi-mini-player/scripts/ensure-electron.js) สำหรับตรวจสอบสถานะของ Electron binary อัตโนมัติ หากพบว่ายังไม่ได้ extract หรือขาด `path.txt` ระบบจะทำการแตกไฟล์จาก Cache ด้วย `tar` / `PowerShell` และสร้าง `path.txt` ให้ทันที
  - ผูกสคริปต์เข้ากับ `postinstall` ใน [package.json](file:///d:/Source/github/sorinoi/Lofi-mini-player/package.json) ทำให้เมื่อรัน `npm install` หรือ `git pull` แล้ว install ใหม่ ระบบจะซ่อมแซมและเตรียมความพร้อมให้อัตโนมัติ 100%

  ### [2026-08-27] - Task 4: Clean Removal of AI Rate Limit & Quota Monitor
- **Task:** ดำเนินการถอดถอนฟีเจอร์ AI Rate Limit Bar และ Quota Monitor ออกจากโค้ดเบสทั้งหมดอย่างสะอาดและสมบูรณ์
- **Details:**
  - ลบไฟล์ Backend Detectors: `codexDetector.ts`, `githubCopilotDetector.ts`, `openAIDetector.ts`, `zhipuDetector.ts`
  - ลบ IPC Handlers `quota:detectLocalCodex` และ `quota:fetchUsage` ใน `src/main/index.ts`
  - ลบ Preload ContextBridge APIs ใน `src/preload/index.ts`
  - ลบ Pinia Store `src/renderer/src/stores/quota.ts`
  - ลบคอมโพเนนต์ `src/renderer/src/components/quota/QuotaModal.vue` และโฟลเดอร์ `quota/`
  - ลบ Quota Badge และไอคอน Zap ใน `CustomTitlebar.vue`, `MiniPlayer.vue` และ `App.vue`
  - อัปเดต `README.md` ตัด Section 8 ออก
  - ผ่านการทดสอบ `npm run typecheck` (Node + Web) และ `npm run build` สำเร็จ 100% (0 errors)

### [2026-08-28] - Task 12: Right Sidebar Dock Mode for To-Do & Music
- **Plan Document:** [planning/dock_sidebar_mode.md](file:///d:/Source/github/sorinoi/lofi-player/planning/dock_sidebar_mode.md)
- **Task Tracker:** [task/dock_sidebar_mode_task.md](file:///d:/Source/github/sorinoi/lofi-player/task/dock_sidebar_mode_task.md)
- **Task Summary:** พัฒนาระบบแถบข้างติดขอบจอขวา (Right Sidebar Dock Mode) ความกว้าง ~340px สูงเต็มจอ สำหรับเปิด Focus Tasks To-Do List (ส่วนบน) ควบคู่กับแผงควบคุมเพลง Lofi แบบ **Quad-View Mini-Player Widget** (ส่วนล่าง ~220px: Track / VU / Timer / Video)
- **Details:**
  - เพิ่มการคำนวณตำแหน่งจอภาพ `workArea` ผ่าน Electron `screen` API ใน [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts) สำหรับแนบหน้าต่างชิดขอบขวาสุด (`x = workArea.x + workArea.width - 340`, `y = workArea.y`), ตั้ง Always on Top, และคืนค่า `normalBounds` ได้อย่างแม่นยำ 100%
  - เพิ่ม Preload contextBridge APIs (`enterDockMode`, `exitDockMode`, `toggleDockMode`, `isDockMode`) ใน [src/preload/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/preload/index.ts)
  - เพิ่ม `isDockMode`, `dockMiniPlayerView` และ Actions ใน Pinia store [src/renderer/src/stores/app.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/stores/app.ts)
  - สร้างคอมโพเนนต์ [DockSidebar.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/DockSidebar.vue) รวม Drag Titlebar, ตัวจัดการ To-Do เต็มจอ, และแผง Mini-Player ด้านล่างที่สลับได้ 4 มุมมอง (`Track`, `VU Meter`, `Focus Timer`, `YouTube Video Stream`)
  - เพิ่มปุ่ม Dock Mode บน Titlebar ([CustomTitlebar.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/CustomTitlebar.vue)) และหน้า To-Do ([TodoView.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/todo/TodoView.vue))
  - เพิ่มคีย์ลัดระดับสากล <kbd>Alt</kbd> + <kbd>D</kbd> ใน [shortcutService.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/services/shortcutService.ts)
  - รองรับการแสดงผลวิดีโอแบบ Adaptive ในโหมด Dock ด้วย `.dock-video-fixed` ใน [App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue)
  - ผ่านการทดสอบ Type Check `npm run typecheck` สำเร็จ 100% (0 errors)
  - คอมไพล์ตัวติดตั้ง Windows สำเร็จ 100% ผ่าน `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.1.0.exe`** เรียบร้อย

### [2026-08-28] - Task 11: To-Do App with JSON Database
- **Task:** พัฒนาระบบ **Focus Tasks & To-Do** จัดเก็บข้อมูลในไฟล์ JSON บนเครื่องผู้ใช้ พร้อมบันทึกวันที่สร้างและวันที่เสร็จ
- **Details:**
  - สร้างโมดูล [todoStorage.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/todoStorage.ts) ใน Main Process บันทึกและอ่านไฟล์ `todos.json` ใน `app.getPath('userData')` แบบ Atomic Write และฟอร์แมต JSON สวยงาม
  - เพิ่ม IPC Handlers (`todos:load`, `todos:save`, `todos:openFolder`) ใน [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts) และเปิดช่องทางผ่าน Preload Bridge
  - สร้าง Pinia Store [stores/todo.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/stores/todo.ts) รองรับ CRUD, กรองสถานะ (`All`, `Active`, `Completed`), กรองหมวดหมู่ (`Study`, `Work`, `Personal`, `Chill`), กรองระดับความสำคัญ (`High`, `Medium`, `Low`), ค้นหาข้อความ และคำนวณสถิติ
  - สร้าง UI Component [TodoView.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/todo/TodoView.vue) และ [TodoItemCard.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/todo/TodoItemCard.vue) พร้อมการ์ดสถิติ, หลอด Progress Bar, ตัวเลขนับถอยหลังระยะเวลาที่ใช้ทำงาน (`Done in ...`), และปุ่มเปิดดูไฟล์ JSON
  - เพิ่มแท็บ **Focus Tasks** ใน Sidebar ของ [App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue) พร้อม Badge แสดงจำนวนงานค้าง (Pending Count) แบบ Real-time
  - ผ่านการทดสอบ Type Check `npm run typecheck` (0 errors)
  - คอมไพล์ตัวติดตั้ง Windows สำเร็จ 100% ผ่าน `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.1.0.exe`** เรียบร้อย

### [2026-08-28] - Task 10: Version 1.1.0 Release
- **Task:** ปรับเปลี่ยนเลขเวอร์ชันโปรแกรมเป็น **v1.1.0** และคอมไพล์ตัวติดตั้งใหม่
- **Details:**
  - อัปเดต `version: 1.1.0` ใน [package.json](file:///d:/Source/github/sorinoi/lofi-player/package.json) และ [package-lock.json](file:///d:/Source/github/sorinoi/lofi-player/package-lock.json)
  - อัปเดต Badge บนหน้าจอ Splash Screen ใน [resources/splash.html](file:///d:/Source/github/sorinoi/lofi-player/resources/splash.html) และ `build/splash.html` เป็น `v1.1.0`
  - อัปเดตเอกสารประกอบการใช้งาน [README.md](file:///d:/Source/github/sorinoi/lofi-player/README.md) รองรับฟีเจอร์ใหม่ Quad-View Mini Player, Cinema Mode และ Ghost Timer
  - ผ่านการตรวจสอบ Type Check (`npm run typecheck` 0 errors)
  - คอมไพล์ตัวติดตั้ง Windows สำเร็จ 100% ผ่าน `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.1.0.exe`** เรียบร้อย

### [2026-08-28] - Task 9: YouTube Fullscreen & Cinema Mode Tab Overlap Fix
- **Task:** แก้ไขปัญหาแถบ Titlebar และส่วนควบคุมวิดีโอซ้อนทับกันเมื่อเปิดวิดีโอแบบเต็มจอ (Cinema Mode / Fullscreen)
- **Details:**
  - เพิ่ม `isCinemaMode` และ `toggleCinemaMode()` ใน [stores/youtube.ts](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/stores/youtube.ts) เพื่อให้ทุก Component ซิงค์สถานะเดียวกัน
  - เพิ่มคลาส `.cinema-video-fullscreen` ใน [App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue) กำหนด `position: fixed; inset: 0; z-index: 60; width: 100vw; height: 100vh;` ขยายวิดีโอคลุมเต็มหน้าต่างแบบ 100% เหนือ Titlebar, Sidebar และ Footer ไม่มีการทับซ้อนของแถบใด ๆ
  - ปรับปรุง [YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue) ใน Cinema Mode ให้มี **Floating Minimalist Top Bar** โปร่งแสง พร้อมปุ่ม `[🎬 Exit Cinema]` และดักจับปุ่ม `Escape` บนคีย์บอร์ดเพื่อออกจากโหมดเต็มจอ
  - เพิ่ม CSS `:fullscreen { z-index: 99999 !important; }` ป้องกันการชนกันของ HTML5 Fullscreen API
  - ผ่านการทดสอบ `npm run typecheck` (0 errors)
  - คอมไพล์ตัวติดตั้ง Windows สำเร็จ 100% ผ่าน `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.0.0.exe`** เรียบร้อย

### [2026-08-28] - Task 8: Floating Ghost Timer in Video Mode
- **Task:** พัฒนาระบบตัวเลขนับถอยหลังโปร่งแสง (Floating Ghost Timer) ลอยเหนือหน้าจอวิดีโอ YouTube ทั้งใน Mini-Player และ Desktop Cinema Mode
- **Details:**
  - เพิ่ม Ghost Timer Overlay ใน [MiniPlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/MiniPlayer.vue) (View 4: Video View) แสดงตัวเลขนับถอยหลังแบบโปร่งแสง (`opacity: 50%`) พร้อมการ์ดกระจกฝ้าอ่อน `bg-black/35 backdrop-blur-[2px]` กึ่งกลางหน้าจอจิ๋ว
  - เพิ่ม Ghost Timer Overlay ใน [YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue) ลอยอยู่ที่มุมขวาบนของหน้าจอวิดีโอทั้งในโหมดมาตรฐานและ Cinema Mode
  - รองรับทั้ง **Pomodoro Focus Timer** (🎯 `Focus Session` / `Break Time`) และ **Sleep Timer** (🌙 `Sleep Countdown`) ซ่อนตัวอัตโนมัติเมื่อหยุดจับเวลา
  - กำหนดเป็น `pointer-events-none` คลิกทะลุได้ 100% ไม่บดบังวิดีโอ
  - ผ่านการทดสอบ `npm run typecheck` (0 errors)
  - คอมไพล์ตัวติดตั้ง Windows สำเร็จ 100% ผ่าน `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.0.0.exe`** เรียบร้อย

### [2026-08-28] - Task 7: Dedicated YouTube Video Screen Mode & Quad-View Mini Player
- **Task:** พัฒนาระบบปุ่มและโหมดแสดงหน้าจอ YouTube Video โดยเฉพาะ ทั้งในหน้าต่างหลักและ Floating Mini-Player
- **Details:**
  - อัปเกรด [MiniPlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/layout/MiniPlayer.vue) เป็น **Quad-View Widget** (`[Track] [VU] [Timer] [Video]`) พร้อมแสดงผลสตรีมวิดีโอสดจริงในหน้าต่างจิ๋ว 360×220 px และ Floating HUD Overlay
  - เพิ่มปุ่ม **`📺 Video Screen`** ที่แถบควบคุมด้านล่าง (Footer) และปุ่ม **`[📺 Watch Video Stream]`** ใน Now Playing Header ใน [App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue)
  - เพิ่มโหมด **`[🎬 Cinema Mode]`** ใน [YouTubePlayer.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/components/youtube/YouTubePlayer.vue) สำหรับโฟกัสหน้าจอวิดีโอแบบไร้สิ่งรบกวน
  - ปรับโครงสร้าง DOM ใน [App.vue](file:///d:/Source/github/sorinoi/lofi-player/src/renderer/src/App.vue) โดยย้าย `<YouTubePlayer />` ออกมาเป็น Top-level Adaptive Component ควบคุมด้วยคลาส `.mini-video-fixed` (เมื่ออยู่ในโหมด Mini Player Video) และ `.desktop-youtube-active` (เมื่ออยู่ในหน้า Desktop) เพื่อไม่ให้วิดีโอถูกคลาส `.invisible-player` ของ Desktop Container บดบัง
  - ผ่านการทดสอบ `npm run typecheck` (0 errors)
  - คอมไพล์ตัวติดตั้ง Windows สำเร็จ 100% ผ่าน `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.0.0.exe`** เรียบร้อย

### [2026-08-28] - Task 6: Native Splash Screen Integration
- **Task:** พัฒนาระบบ Native Dual-Window Splash Screen พร้อมภาพ `splash.png`, แอนิเมชัน Equalizer/Progress Bar และการันตีเวลาแสดงผลอย่างน้อย 3 วินาที
- **Details:**
  - สำเนา `splash.png` ไปยัง `resources/splash.png` และ `build/splash.png`
  - สร้างหน้า UI [resources/splash.html](file:///d:/Source/github/sorinoi/lofi-player/resources/splash.html) ดีไซน์ Cozy Card, Animated Equalizer Bars, Sleek Progress Bar, Dynamic Status Text ("Brewing coffee...", "Calibrating tape...", "Mixing ambient...") และ Fade-out Transition
  - เพิ่มฟังก์ชัน `createSplashWindow()` และใช้ `Promise.all` ซิงค์เวลาระหว่าง Timer 3 วินาที กับ Event `ready-to-show` ของ `mainWindow` ใน [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts)
  - ผ่านการทดสอบ `npm run typecheck` (0 errors)
  - คอมไพล์ตัวติดตั้ง Windows สำเร็จ 100% ผ่าน `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.0.0.exe`** เรียบร้อย

### [2026-08-28] - Task 5: Custom App Icon Integration
- **Task:** ติดตั้งและผูกไอคอน `cga-lofi.ico` เข้ากับระบบ Build ของ Electron และหน้าต่างโปรแกรม
- **Details:**
  - สำเนา `cga-lofi.ico` ไปยัง `build/icon.ico` และ `resources/icon.ico`
  - ตั้งค่า `win.icon` และ `buildResources` ใน [electron-builder.yml](file:///d:/Source/github/sorinoi/lofi-player/electron-builder.yml)
  - กำหนด `icon: join(__dirname, '../../resources/icon.ico')` ให้กับ `BrowserWindow` ใน [src/main/index.ts](file:///d:/Source/github/sorinoi/lofi-player/src/main/index.ts)
  - ผ่านการทดสอบ `npm run typecheck` (0 errors)
  - คอมไพล์และสร้างตัวติดตั้ง Windows สำเร็จ 100% ผ่าน `npm run build:win` ได้ไฟล์ **`dist/Lofi Player Setup 1.0.0.exe`** ที่มีไอคอนใหม่เรียบร้อย

