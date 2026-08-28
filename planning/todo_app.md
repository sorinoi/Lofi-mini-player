# Planning: To-Do App with JSON Database (`todo_app`)

## 1. Requirement & User Intent
- **User Request:**
  > "ผมอยากให้มีระบบ To-do app เพิ่มเข้ามา โดยใช้ฐานข้อมูลเป็น file json สามารถให้เพิ่มรายการ ทำสถานะว่าเสร็จแล้วได้ สามารถเพิ่ม หรือลบรายการได้ ให้มีการเก็บวันที่สร้าง และวันที่เสร็จด้วย ช่วยออกแบบ และเขียนแผนการพัฒนาให้หน่อครับ"
- **Core Objectives:**
  1. เพิ่มระบบ **To-Do / Focus Task Manager** ในตัวแอป Lofi Player
  2. จัดเก็บข้อมูลแบบถาวรใน **ไฟล์ JSON (`todos.json`)** ในเครื่องของผู้ใช้ผ่าน Electron Main Process (`userData/todos.json`)
  3. เพิ่มรายการ (Add Task) พร้อมระบุระดับความสำคัญ (Priority) และหมวดหมู่ (Category)
  4. เปลี่ยนสถานะเสร็จสิ้น (Mark as Completed / Incomplete)
  5. ลบรายการ (Delete Task) และล้างรายการที่เสร็จแล้ว (Clear Completed)
  6. **บันทึกวันที่/เวลาสร้าง (`createdAt`)** และ **วันที่/เวลาที่เสร็จ (`completedAt`)** อย่างแม่นยำ พร้อมแสดงผลใน UI
  7. มีปุ่มเปิดโฟลเดอร์ไฟล์ JSON ใน Windows Explorer เพื่อให้ผู้ใช้สามารถ Backup หรือดูไฟล์ข้อมูลได้โดยตรง

---

## 2. Technical Architecture & Data Model

### Data Schema (`TodoItem`)
```typescript
export interface TodoItem {
  id: string              // e.g. "todo-1756382400000-abcd"
  text: string            // Task description
  completed: boolean      // Completion status
  createdAt: number       // Unix timestamp (ms) when created
  completedAt: number | null // Unix timestamp (ms) when completed, or null if active
  priority: 'high' | 'medium' | 'low' // Priority level
  category: 'study' | 'work' | 'personal' | 'chill' // Category tag
  notes?: string          // Optional additional details
}
```

### JSON File Format (`todos.json` on disk)
```json
{
  "version": 1,
  "lastUpdated": 1756382400000,
  "todos": [
    {
      "id": "todo-1756382400000-a1b2",
      "text": "Review Lofi code & prepare release notes",
      "completed": true,
      "createdAt": 1756380000000,
      "completedAt": 1756382400000,
      "priority": "high",
      "category": "work"
    }
  ]
}
```

---

## 3. Component & Layer Structure

```
lofi-player/
├── src/main/
│   ├── index.ts                     // IPC Handlers ('todos:load', 'todos:save', 'todos:openFolder')
│   └── todoStorage.ts               // File I/O helpers (atomic write, read, initial defaults)
├── src/preload/
│   ├── index.ts                     // Exposes loadTodos, saveTodos, openTodosFolder to window.api
│   └── index.d.ts                   // TypeScript declarations
├── src/renderer/src/
│   ├── types/todo.ts                // TodoItem interface and types
│   ├── stores/
│   │   ├── todo.ts                  // Pinia store (CRUD, filtering, counters, stats)
│   │   └── app.ts                   // Updated activeTab type to include 'todo'
│   ├── components/todo/
│   │   ├── TodoView.vue             // Main To-Do screen (Stats, Input, Filters, List, Empty State)
│   │   └── TodoItemCard.vue         // Individual task row with check, badge, timestamps, delete
│   └── App.vue                      // Sidebar tab item with live pending count badge + view container
```

---

## 4. Key UI/UX Features
- 🎨 **Cozy Lofi Design:** สไตล์ Dark Aesthetic, Card Glassmorphism, Rounded 2XL เข้ากับธีมโปรแกรม
- 📊 **Quick Task Stats:** การ์ดสถิติ Total Tasks, Pending, Completed, และ Completion Rate %
- ⏱️ **Timestamp Tracking:** แสดงวันที่/เวลาสร้าง (`Created: 28 Aug, 11:45`) และวันที่เสร็จ (`Completed: 28 Aug, 12:10`) พร้อมคำนวณเวลาที่ใช้ (e.g. `Done in 25m`)
- 🔍 **Filter & Search:** กรองตามสถานะ (`All`, `Active`, `Completed`), หมวดหมู่ (`Study`, `Work`, `Personal`, `Chill`) และช่องค้นหา
- 📁 **JSON Data Control:** ปุ่ม "Open JSON File" เปิดดูและ Backup ไฟล์ `todos.json` จาก Explorer
- 🔔 **Live Badge on Sidebar:** แสดงตัวเลขงานที่ค้างอยู่บน Sidebar ให้เห็นแบบ Real-time
