# Planning: Floating Ghost Timer in Video Mode (`floating_ghost_timer`)

## 1. Requirement & Background
- **User Request:** เมื่อมีการตั้งเวลาการทำงาน (Pomodoro Focus หรือ Sleep Timer) ในขณะที่เปิดดูวิดีโอ (โหมด Video ทั้งใน Mini-Player และ Desktop YouTube / Cinema Mode) ต้องการให้มีตัวเลขนาฬิกาลอยอยู่บนหน้าจอวิดีโอแบบจาง ๆ โปร่งแสง สไตล์ Ambient HUD เพื่อให้ทราบเวลาที่เหลืออยู่โดยไม่รบกวนสมาธิและภาพวิดีโอ

## 2. Technical Architecture & Design Decisions
1. **Data Source:**
   - ใช้ `timerStore` จาก `src/renderer/src/stores/timer.ts`:
     - `timerStore.isPomodoroRunning` -> `timerStore.pomodoroSecondsLeft` + `timerStore.pomodoroMode`
     - `timerStore.isSleepTimerActive` -> `timerStore.sleepSecondsLeft`
2. **Visual & Styling Design:**
   - **Opacity & Tone:** `text-white/40` - `text-white/45` พร้อมพื้นหลังกระจกฝ้าแบบเบามาก `bg-black/25` - `bg-black/30 backdrop-blur-xs`
   - **Typography:** `font-mono tracking-widest` ให้ความรู้สึกนาฬิกาดิจิทัล Minimalist Lofi
   - **Icons:** ไอคอน `Target` (🎯 Focus) หรือ `Moon` (🌙 Sleep) แบบ Semi-transparent กะพริบเบา ๆ
   - **Interactivity:** `pointer-events-none` ทำให้คลิกทะลุได้ 100% ไม่บดบังปุ่มควบคุมของวิดีโอ
3. **Integration Points:**
   - **Mini-Player (`MiniPlayer.vue`):** ลอยตรงกึ่งกลางหน้าจอวิดีโอเมื่อเลือกโหมด `Video`
   - **Desktop Player (`YouTubePlayer.vue`):** ลอยอยู่มุมขวาบนของ Video Container ทั้งในโหมดมาตรฐานและ Cinema Mode

## 3. Implementation Steps
- **Phase 1:** เพิ่ม Floating Ghost Timer Overlay ใน `MiniPlayer.vue` (View 4: Video View)
- **Phase 2:** เพิ่ม Floating Ghost Timer Overlay ใน `YouTubePlayer.vue` (บน Video Embed Display Area)
- **Phase 3:** ตรวจสอบ Type Check (`npm run typecheck`) และคอมไพล์ตัวติดตั้ง Windows (`npm run build:win`)
