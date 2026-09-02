# Plan: Bubble Flow (Rising Water Bubbles) Visualizer Mode

## 📌 Problem Overview & Objectives
ปัจจุบันโปรแกรมมีโหมดแสดงผล Visualizer 4 รูปแบบ (Analog VU, Frequency Bars, Circular Pulse, Pixel Wave) ผู้ใช้ต้องการเพิ่มโหมด Visualizer ใหม่ลำดับที่ 5 ในรูปแบบ **การปล่อยฟองน้ำลอยจากด้านล่างขึ้นสู่ด้านบน (Rising Water Bubbles)** โดยขนาด ความเร็ว จำนวน และการกระจายตัวของฟองน้ำจะตอบสนองต่อจังหวะดนตรีและความถี่เสียงคล้ายกับ Frequency Bars พร้อมการสุ่มตำแหน่งการผุดอย่างเป็นธรรมชาติ

**เป้าหมาย:**
1. พัฒนาคอมโพเนนต์ `FloatingBubbles.vue` จำลองระบบอนุภาคฟองน้ำ (Bubble Particle Engine) ตอบสนองความถี่เสียงแบบเรียลไทม์ (Bass/Mids/Highs)
2. วาดฟองน้ำสไตล์ Lofi ที่มีความลึก มิติแสงสะท้อน แสงนีออนพาสเทล และเอฟเฟกต์การแตกผิวน้ำ (Surface Pop)
3. ผูกเข้ากับระบบสลับโหมดของแอปทั้งในหน้าหลัก (VisualizerContainer), Mini-Player, และ Right Sidebar Dock

---

## 🏗️ Phased Execution Plan

### Phase 1: Develop FloatingBubbles Canvas Component
- สร้าง `src/renderer/src/components/visualizers/FloatingBubbles.vue`:
  - Particle Pool จัดการฟองน้ำ (X, Y, Radius, TargetRadius, VelocityY, WobblePhase, Color, Life, Opacity, Shimmer)
  - Music Frequency Binding:
    - Bass (Sub & Kick): ปล่อยฟองน้ำขนาดใหญ่ฝั่งซ้าย-กลาง ลอยช้าๆ สั่นตามจังหวะ
    - Mids (Chords & Snare): ปล่อยฟองน้ำขนาดกลางตรงกลาง
    - Highs (Vinyl & Hats): ปล่อยฟองน้ำเล็กฝั่งขวา ลอยเร็วระยิบระยับ
  - Surface Pop Particle System: ละอองน้ำกระจายเมื่อฟองน้ำลอยถึงผิวน้ำด้านบน
  - Idle Drift Animation: ลอยฟองน้ำอย่างนุ่มนวลเมื่อหยุดเพลง

### Phase 2: Update App Store & Type Definitions
- อัปเดต `src/renderer/src/stores/app.ts`:
  - เพิ่ม `'floating_bubbles'` ใน Type ของ `visualizerMode`

### Phase 3: Integrate with VisualizerContainer, MiniPlayer & DockSidebar
- เพิ่มตัวเลือกใน `VisualizerContainer.vue` พร้อมไอคอน `Droplets`
- เพิ่มการวนลูปสลับโหมดและการเรนเดอร์ใน `MiniPlayer.vue` และ `DockSidebar.vue`

### Phase 4: Verification, TypeCheck & Build Check
- ตรวจสอบความถูกต้องด้วย `npm run typecheck`
- คอมไพล์โปรเจกต์ด้วย `npm run build`

---

## 📁 Impacted Files
- [NEW] `src/renderer/src/components/visualizers/FloatingBubbles.vue`
- `src/renderer/src/stores/app.ts`
- `src/renderer/src/components/visualizers/VisualizerContainer.vue`
- `src/renderer/src/components/layout/MiniPlayer.vue`
- `src/renderer/src/components/layout/DockSidebar.vue`
