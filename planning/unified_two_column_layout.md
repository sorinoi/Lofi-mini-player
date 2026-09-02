# Plan: Unified Full-Width 2-Column Layout Across All Functions

## 📌 Problem Overview & Objectives
ปัจจุบันบางหน้าจอในโปรแกรม (เช่น Now Playing & VU, Music Library, Ambient Mixer, To-Do, Notes) ยังถูกจำกัดความกว้างด้วย `max-w-2xl`, `max-w-5xl`, `max-w-6xl` และแสดงผลแบบคอลัมน์เดียวเดี่ยวๆ ในขณะที่หน้าจอ YouTube Stream Player ได้รับการปรับปรุงเป็นแบบ 2-Column Desktop Watch Layout (มีวิดีโออยู่ฝั่งซ้าย และมี Sidebar สลับโหมด Playlists, Tasks, Notes อยู่ฝั่งขวา)

**เป้าหมาย:**
1. ปรับปรุงทุกหน้าจอให้แสดงผลแบบ **Full-Width (เต็มพื้นที่)** เมื่อเปิดแบบเต็มจอหรือขยายหน้าต่าง
2. จัดโครงสร้างเป็น **2-Column Split Layout** ในทุกฟังก์ชัน:
   - **Left Column (Primary Workspace):** แสดงหน้าจอหลักตามแท็บที่เลือก (Now Playing & VU, Music Library, Ambient Mixer, YouTube Stream, Focus Tasks, Note Record)
   - **Right Column (Universal Right Sidebar):** แสดงแถบเครื่องมืออเนกประสงค์ที่สลับโหมดได้ตลอดเวลา (Playlists / Queue / Stations, Focus Tasks To-Do, Note Record Memos)

---

## 🏗️ Phased Execution Plan

### Phase 1: Full-Width Layout Expansion for Individual Views
- ปลดล็อกข้อจำกัดขนาดความกว้างคงที่ (`max-w-*`) และจัด Responsive Grid ให้ยืดหยุ่นเต็มพื้นที่:
  - `src/renderer/src/components/visualizers/VisualizerContainer.vue` (ลบ `max-w-2xl` -> `w-full`)
  - `src/renderer/src/components/library/MusicLibrary.vue` (ลบ `max-w-6xl mx-auto` -> `w-full`)
  - `src/renderer/src/components/ambient/AmbientMixer.vue` (ลบ `max-w-5xl mx-auto` -> `w-full`)
  - `src/renderer/src/components/todo/TodoView.vue` (ลบ `max-w-6xl mx-auto` -> `w-full`)
  - `src/renderer/src/components/notes/NoteView.vue` (ลบ `max-w-6xl mx-auto` -> `w-full`)

### Phase 2: Universal Right Sidebar Workspace Panel
- สร้างหรือปรับปรุงคอมโพเนนต์ Right Sidebar ให้รองรับการทำงานร่วมกับทุกแท็บ:
  - Mode 1: **Playlists & Stations / Queue** (แสดง YouTube Curated/Bookmarks เมื่ออยู่ในโหมด YouTube หรือสตรีมสด และแสดง Local Music Queue / Playlist เมื่อฟังเพลงปกติ)
  - Mode 2: **Focus Tasks** (แสดง `TodoView` แบบกะทัดรัดพร้อม Badge งานคงค้าง)
  - Mode 3: **Note Record** (แสดง `NoteView` แบบกะทัดรัดพร้อม Badge จำนวนโน้ต)

### Phase 3: Main Shell Integration (`App.vue` & `YouTubePlayer.vue`)
- จัดโครงสร้าง Main Content Area ใน `App.vue` ให้เป็น 2-Column Split Layout (`flex flex-col lg:flex-row gap-6 p-6 w-full`)
- เชื่อมต่อการสลับโหมดและจัดการพื้นที่ให้เข้ากันได้กับ Cinema Mode, Mini-Player Mode และ Dock Sidebar Mode

### Phase 4: Verification, TypeCheck & Build Check
- รัน `npm run typecheck` และ `npm run build`
- ทดสอบการสลับทุกแท็บและสลับโหมดใน Sidebar ขวา

---

## 📁 Impacted Files
- `src/renderer/src/components/visualizers/VisualizerContainer.vue`
- `src/renderer/src/components/library/MusicLibrary.vue`
- `src/renderer/src/components/ambient/AmbientMixer.vue`
- `src/renderer/src/components/todo/TodoView.vue`
- `src/renderer/src/components/notes/NoteView.vue`
- `src/renderer/src/components/youtube/YouTubePlayer.vue`
- `src/renderer/src/App.vue`
