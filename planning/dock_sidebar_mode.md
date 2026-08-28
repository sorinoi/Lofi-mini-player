# Planning: Right Sidebar Dock Mode for To-Do & Music (`dock_sidebar_mode`)

## 1. User Intent & Problem Statement
- **User Request:**
  > "สามารถกำหนดการแสดงผลของ application เช่น ชิดขวาของหน้าจอคอมพิวเตอร์ โดยแสดงผลเป็น แถบเล็ก ๆ เพื่อแสดงรายการ todo-list ได้หรือไม่"
  > "ช่วยปรับแผนหน่อยครับ ผมอยากให้ส่วนล่างสุดแสดงเป็นหน้าจอคล้าย ๆ กับตอนกด mini player mode ด้วย"
- **Goal:**
  พัฒนาระบบ **"Right Sidebar Dock Mode" (โหมดแถบข้างติดขอบจอขวา)** ความกว้าง ~340px สูงเต็มจอแนวตั้ง แนบชิดขอบขวาของจอคอมพิวเตอร์แบบ Always on Top โดยจัดวางเลย์เอาต์ 2 ส่วนหลัก:
  1. **พื้นที่ส่วนบน (Flex-1):** ระบบจัดการ **Focus Tasks & To-Do List** แบบ Full-Height Scrollable (เพิ่มงานด่วน, ตัวกรอง, เช็คสถานะ)
  2. **พื้นที่ส่วนล่าง (~220px):** แผงควบคุม **Dock Mini-Player Widget** แบบ Quad-View (คล้ายกับ Mini-Player Mode) สลับได้ 4 โหมด: `[Track]`, `[VU]`, `[Timer]`, และ `[Video]`

---

## 2. Technical Architecture & Window Calculations

### 1. Window Positioning in Electron Main Process (`src/main/index.ts`)
- ตรวจจับหน้าจอปัจจุบันและคำนวณพิกัดชิดขอบขวา (Multi-monitor Aware):
  ```typescript
  const currentBounds = mainWindow.getBounds()
  const display = screen.getDisplayNearestPoint({
    x: currentBounds.x + currentBounds.width / 2,
    y: currentBounds.y + currentBounds.height / 2
  })
  const { workArea } = display // เว้นขอบ Windows Taskbar อัตโนมัติ
  const DOCK_WIDTH = 340

  // คำนวณพิกัดชิดขอบขวาสุด
  const x = workArea.x + workArea.width - DOCK_WIDTH
  const y = workArea.y
  const width = DOCK_WIDTH
  const height = workArea.height
  ```
- จดจำและบันทึก `normalBounds` เพื่อคืนค่าขนาดและตำแหน่งหน้าต่างเดิมได้สมบูรณ์ 100% เมื่อออกจาก Dock Mode

### 2. IPC Channels & Preload API
- `window:enterDockMode`: ปรับ Bounds ชิดขอบจอขวา และตั้งค่า `setAlwaysOnTop(true)`
- `window:exitDockMode`: คืนค่า Bounds ปกติ และตั้งค่า `setAlwaysOnTop(false)`
- `window:toggleDockMode`: สลับสถานะเข้า/ออกจาก Dock Mode

### 3. State Management (`src/renderer/src/stores/app.ts`)
- เพิ่ม State:
  - `isDockMode = ref<boolean>(false)`
  - `dockMiniPlayerView = ref<'music' | 'vu' | 'timer' | 'video'>('music')`
- เพิ่ม Actions:
  - `toggleDockMode()`
  - `setDockMiniPlayerView(view)`

### 4. Dedicated UI Component (`src/renderer/src/components/layout/DockSidebar.vue`)

```
┌──────────────────────────────────────────────┐
│  🎵 Lofi Dock         [📌] [⤢] [-] [✕]      │  <-- Header (~36px)
├──────────────────────────────────────────────┤
│  📝 Focus Tasks (Active: 3 / Done: 5)        │
│  [ + Add a new task...                ]      │
│  [All] [Active] [Done]                       │
│  ┌────────────────────────────────────────┐  │
│  │ ☑ Fix YouTube Stream API   [Work] 🔴   │  │  <-- Scrollable To-Do Stream
│  │ ☐ Design Dock Sidebar UI   [Dev]  🟡   │  │      (Flex-1, Full-Height)
│  │ ☐ Drink Water & Stretch    [Chill]🟢   │  │
│  │ ...                                    │  │
│  └────────────────────────────────────────┘  │
├──────────────────────────────────────────────┤
│  [ Track ]  [ VU ]  [ ⏱ 24:59 ]  [ Video ]   │  <-- Quad-View Switcher Tabs
├──────────────────────────────────────────────┤
│  [Mini Cover]  Lofi Hip Hop Chill Station    │
│  ⏮   ▶⏸   ⏭   |  🔊 ━━━━━●━━━━  (70%)    │  <-- Dynamic Bottom Mini-Player
│  01:24 ━━━━━━━━━━━━━━━━━━━━━ 03:45           │      (~220px Fixed)
│  (รองรับ 4 Views: Track / VU / Timer / Video) │
└──────────────────────────────────────────────┘
```

#### รายละเอียดคอมโพเนนต์ย่อยใน Dock Mini-Player Widget:
1. **View 1: Track View:**
   - ปกอัลบั้ม / YouTube Thumbnail + ชื่อเพลง / ศิลปิน
   - ปุ่มควบคุม Play/Pause, Skip Back/Forward
   - Progress bar + Master Volume slider
2. **View 2: VU Visualizer View:**
   - Canvas แสดงผล Visualizer 4 สไตล์ (Analog VU Meter, Frequency Bars, Circular Pulse, Pixel Wave) พร้อมปุ่มคลิกสลับสไตล์
   - แถบควบคุมเสียงด่วนด้านล่าง
3. **View 3: Focus Timer View:**
   - ปุ่มลัดปรับเวลา Pomodoro (25m / 45m / 60m) + จำนวน Sessions ที่สำเร็จ
   - ตัวเลขนับถอยหลังดิจิทัลขนาดใหญ่ + ปุ่ม Start/Pause/Reset
4. **View 4: Live YouTube Video View:**
   - กรอบสตรีมวิดีโอ YouTube สดแบบปรับขนาดอัตโนมัติ
   - Floating Ghost Timer Overlay (ตัวเลขนับถอยหลังลอยโปร่งแสงกึ่งกลางวิดีโอ)
   - แถบควบคุมมินิมอล HUD ด้านล่าง

---

## 3. Entry Points & Shortcut Integration
1. **Titlebar Button:** เพิ่มปุ่ม `[📌 Dock Sidebar]` ใน `CustomTitlebar.vue`
2. **To-Do Page Button:** เพิ่มปุ่ม `[📌 Dock to Right Side]` ใน `TodoView.vue`
3. **Global / In-App Keyboard Shortcut:** <kbd>Alt</kbd> + <kbd>D</kbd> สำหรับเปิด/ปิดโหมด Dock ทันที
