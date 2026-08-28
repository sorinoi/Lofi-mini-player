# Planning: Note Record - JSON Database Quick Notes (`note_record`)

## 1. User Intent & Problem Statement
- **User Request:**
  > "ผมอยากให้เพิ่มอีกฟังก์ชัน ชื่อ note record โดยให้สามารถบันทึก note สั้น ๆ ได้ มีการเก็บข้อมูลเป็น file json เช่นกัน โดยเก็บข้อมูลวันที่บันทึก สามารถลบหรือแก้ไขได้ ช่วยวิเคราะห์ และเขียนแผนการพัฒนาให้หน่อยครับ"
- **Goal:**
  พัฒนาระบบ **"Note Record" (ระบบบันทึกโน้ตด่วนและไอเดีย)** ให้สามารถบันทึกข้อความสั้น ๆ หรือบันทึกช่วยจำขณะฟังเพลง Lofi โดยเก็บข้อมูลในรูปแบบไฟล์ JSON (`notes.json`) บันทึกวันที่สร้าง (`createdAt`), วันที่แก้ไข (`updatedAt`), รองรับการสร้าง/แก้ไข/ลบ (CRUD), ปักหมุดโน้ตสำคัญ, และเลือกสีการ์ดโน้ตได้

---

## 2. Technical Architecture & Database Design

### 1. JSON Storage Layer (`src/main/noteStorage.ts`)
- ตำแหน่งไฟล์: `app.getPath('userData')/notes.json`
- โครงสร้างข้อมูล Data Schema:
  ```typescript
  export type NoteColor = 'default' | 'amber' | 'emerald' | 'blue' | 'purple' | 'pink'

  export interface NoteItem {
    id: string
    title: string
    content: string
    createdAt: number
    updatedAt: number
    color: NoteColor
    pinned: boolean
    tags?: string[]
  }

  export interface NoteFileSchema {
    version: number
    lastUpdated: number
    notes: NoteItem[]
  }
  ```

### 2. IPC Channels & Preload Bridge
- `notes:load`: อ่านข้อมูลโน้ตทั้งหมดจาก `notes.json`
- `notes:save`: บันทึกข้อมูลโน้ตลง `notes.json` แบบ Atomic Write
- `notes:openFolder`: เปิดโฟลเดอร์เก็บไฟล์ `notes.json` บนเครื่องผู้ใช้

### 3. Pinia Store (`src/renderer/src/stores/note.ts`)
- State: `notes`, `isLoading`, `searchQuery`, `selectedColor`, `sortBy`
- Actions: `initNotes()`, `addNote()`, `updateNote()`, `deleteNote()`, `togglePin()`, `openStorageFolder()`

### 4. UI Components
- **`NoteView.vue`:** หน้าต่างบันทึกโน้ตเต็มจอ พร้อม Quick Add Card, Search & Color Filters, Masonry/Grid Card Layout
- **`NoteItemCard.vue`:** การ์ดแสดงผลโน้ตสไตล์ Sticky Card พร้อมปุ่ม Pin, Edit, Delete, และแสดงวันที่สร้าง/แก้ไข
- **`DockSidebar.vue` Integration:** เพิ่มแท็บสลับ `[Tasks] / [Notes]` ในแถบข้างขวา เพื่อให้จดบันทึกได้ทันทีขณะทำงาน