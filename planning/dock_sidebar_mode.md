# Planning: Right Sidebar Dock Mode for To-Do & Music (`dock_sidebar_mode`)

## 1. User Intent & Problem Statement
- **User Request:**
  > "Ask: สามารถกำหนดการแสดงผลของ application เช่น ชิดขวาของหน้าจอคอมพิวเตอร์ โดยแสดงผลเป็น แถบเล็ก ๆ เพื่อแสดงรายการ todo-list ได้หรือไม่"
  > "ช่วยวิเคราะห์และเขียนแผนให้หน่อยครับ"
- **Goal:**
  พัฒนาระบบ **"Right Sidebar Dock Mode" (โหมดแถบข้างติดขอบจอขวา)** ให้ Lofi Player สามารถย่อและตรึงหน้าต่างเป็นแถบแนวตั้ง Slim Sidebar (ความกว้าง ~340px สูงเต็มจอแนวตั้ง) แนบชิดขอบขวาของจอคอมพิวเตอร์แบบ Always on Top เพื่อให้ผู้ใช้สามารถดูและจัดการ To-Do List พร้อมฟังเพลง Lofi ในขณะที่ใช้พื้นที่จอฝั่งซ้ายทำงานอื่น (เช่น เขียนโค้ด, พิมพ์งาน, ท่องเว็บ) ได้อย่างราบรื่น

---

## 2. Technical Architecture & Calculations

### 1. Window Positioning in Electron Main Process (`screen` API)
- ดึงข้อมูลความละเอียดและพื้นที่ใช้งานจริงของจอภาพปัจจุบัน (Multi-monitor Aware):
  ```typescript
  const currentBounds = mainWindow.getBounds()
  const display = screen.getDisplayNearestPoint({
    x: currentBounds.x + currentBounds.width / 2,
    y: currentBounds.y + currentBounds.height / 2
  })
  const { workArea } = display // เว้นขอบ Windows Taskbar ให้อัตโนมัติ
  const DOCK_WIDTH = 340

  // คำนวณพิกัดชิดขอบขวาสุด
  const x = workArea.x + workArea.width - DOCK_WIDTH
  const y = workArea.y
  const width = DOCK_WIDTH
  const height = workArea.height
  ```
- บันทึก `normalBounds` ก่อนเข้าสู่ Dock Mode เพื่อคืนค่าตำแหน่งเดิมได้อย่างแม่นยำ 100% เมื่อกดขยายกลับเป็นหน้าต่างปกติ

### 2. IPC Channels & Preload Bridge
- `window:enterDockMode`: คำนวณพิกัดชิดขอบขวา, ปรับขนาดหน้าต่าง และเปิด `setAlwaysOnTop(true)`
- `window:exitDockMode`: คืนค่าขนาดและพิกัดเดิมจาก `normalBounds`
- `window:toggleDockMode`: สลับสถานะระหว่างหน้าต่างปกติกับ Sidebar Dock Mode

### 3. State Management in `stores/app.ts`
- `isDockMode = ref<boolean>(false)`
- `toggleDockMode()`

### 4. Dedicated UI Component (`src/renderer/src/components/layout/DockSidebar.vue`)
- **Header Section (Titlebar `h-9`):**
  - โลโก้ Lofi Player & ชื่อโหมด `Focus Dock`
  - ปุ่ม Pin Always on Top
  - ปุ่ม `[⤢ Expand]` ขยายกลับสู่หน้าต่างปกติ
  - ปุ่ม Minimize & Close
- **Compact Music & Timer Controller:**
  - แสดงสถานะเพลงที่กำลังเล่น (Local Audio / YouTube Stream)
  - ปุ่ม Play/Pause, Next Track, Volume Bar
  - ตัวเลขนับถอยหลัง Pomodoro Focus / Sleep Timer แบบเรียลไทม์
- **To-Do Stream (ความสูงยืดหยุ่น เลื่อนได้แบบอิสระ):**
  - การ์ดสรุปจำนวนงาน: `Active (X)` • `Completed (Y)`
  - ช่อง **Quick Add Task** พร้อมปุ่มเลือกความสำคัญ (🔴 🟡 🟢) และหมวดหมู่ (💼 📚 🌿 ☕)
  - แถบสลับตัวกรอง `All`, `Active`, `Done`
  - รายการงานแบบกระชับ (Compact Task Rows) พร้อม Checkbox, ขีดฆ่า, Badge หมวดหมู่, และวันที่สร้าง/วันที่เสร็จ
- **Bottom Toolbar:**
  - ปุ่มขยายกลับหน้าต่างปกติ
  - ปุ่มเปิดดูไฟล์ฐานข้อมูล JSON (`todos.json`)

---

## 3. Trigger & Entry Points
1. **Titlebar Action Button:** เพิ่มปุ่ม **`[📌 Dock Sidebar]`** (ไอคอน `PanelRight`) ที่มุมขวาบนของแถบ CustomTitlebar
2. **To-Do Tab Action Button:** เพิ่มปุ่ม **`[📌 Dock to Screen Side]`** ในหน้าจอ Focus Tasks (TodoView)
3. **Keyboard Shortcut:** กด <kbd>Alt</kbd> + <kbd>D</kbd> หรือ <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> เพื่อสลับเข้า/ออกจาก Dock Mode ทันที
