# 🎧 Lofi Music Player Desktop App

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-2B2E3A?style=for-the-badge&logo=electron&logoColor=9FEAF9)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%2F%2011%20(x64)-blue?style=for-the-badge)

**A cozy, aesthetic, and feature-packed desktop music player designed for deep focus, studying, and relaxing.**  
*แอปพลิเคชันเครื่องเล่นเพลง Lofi สไตล์มินิมอล พร้อมหน้าปัด VU Meter เต้นตามจังหวะเพลง, เสียงบรรยากาศ Ambient Mixer, ตัวจับเวลา Pomodoro, สตรีม YouTube และหน้าต่างจิ๋ว Mini-Player*

</div>

---

## ✨ Features (ฟีเจอร์เด่น)

### 📻 1. Music-Reactive 4-Mode VU Visualizers
- **Vintage Analog VU Meter:** เข็มวัดคู่สไตล์แอนะล็อกสวิงกระดิกตาม dB และแรงปะทะของเสียงเบส พร้อมไฟ Peak LED
- **Cozy Frequency Bars:** แถบความถี่อีควอไลเซอร์ไล่เฉดสีอบอุ่น นุ่มนวล สบายตา
- **Circular Waveform / Radial Pulse:** วงกลมพัลส์ตอบสนองต่อแรงเบส พร้อมระลอกคลื่นหมุนวน 360 องศา
- **Lofi Pixel / Particle Wave:** คลื่นเสียงสไตล์เรโทรพิกเซล พร้อมละอองหิ่งห้อยลอยในบรรยากาศ

### 📂 2. Local Audio Library & Metadata Parser
- รองรับไฟล์เสียงครอบคลุมทุกนามสกุล: `.mp3`, `.wav`, `.flac`, `.ogg`, `.aac`, `.m4a`, `.webm`, `.opus`
- สแกนนำเข้าไฟล์เดี่ยวหรือสแกนทั้งโฟลเดอร์แบบ Recursive
- ดึงข้อมูล ID3 อัตโนมัติ: ชื่อเพลง, ศิลปิน, อัลบั้ม, ความยาวเพลง และภาพปกอัลบั้มความละเอียดสูง
- จัดหมวดหมู่ 5 สไตล์ Lofi: *Chillhop, Synthwave, Rainy Day, Study & Focus, Sleep & Ambient*
- บันทึกคลังเพลงและรายการโปรดลงเครื่องอย่างปลอดภัยด้วย IndexedDB

### 🌧️ 3. Procedural Ambient Sound Mixer (ทำงานแบบ Offline 100%)
- ผสมเสียงบรรยากาศได้ถึง 7 มิติเสียงอย่างอิสระ:
  - 🌧️ **Rain & Thunder** (เสียงฝนตกพรำและฟ้าร้องเบาๆ)
  - 🔥 **Campfire** (เสียงกองไฟประทุอุ่นๆ)
  - 📻 **Vinyl Crackle** (เสียงแผ่นเสียงไวนิลคลาสสิก)
  - 🌲 **Forest Wind** (เสียงลมพัดผ่านแมกไม้)
  - ☕ **Coffee Shop** (เสียงบรรยากาศร้านกาแฟและผู้คน)
  - 🌊 **Ocean Waves** (เสียงคลื่นทะเลซัดสาด)
  - 🦗 **Night Crickets** (เสียงจิ้งหรีดยามค่ำคืน)
- ปรับระดับความดังแยกแต่ละช่องเสียงได้อย่างอิสระ พร้อม 5 พรีเซ็ตบรรยากาศสำเร็จรูป

### ⏱️ 4. Pomodoro Focus & Night Sleep Timers
- **Pomodoro Focus Timer:** เลือกระยะเวลาโฟกัสได้ 3 ระดับ: **`25 นาที`**, **`45 นาที`**, และ **`60 นาที`** พร้อมโหมดพักสั้น (5m) และพักยาว (15m)
- มีเสียงระฆังทิเบต **528Hz Solfeggio Chime** แจ้งเตือนอย่างนุ่มนวลเมื่อครบเวลา
- **Night Sleep Timer:** ตั้งเวลาปิดเพลงอัตโนมัติ (15m, 30m, 45m, 60m, 90m) พร้อมระบบค่อยๆ หรี่เสียง (Audio Fade-out) ในช่วง 45 วินาทีสุดท้ายก่อนปิดเพลง

### 📺 5. YouTube Music & 24/7 Live Stream Player
- เล่นเพลงจากลิงก์ YouTube ได้ทุกรูปแบบ (Watch URL, Short link, Live stream, Embed ID)
- สลับมุมมองระหว่าง **Video View (16:9)** และ **VU Visualizer View** ได้อย่างลื่นไหล
- **VU Meter ตอบสนองกับสตรีม YouTube แบบ Real-time**
- บันทึกสถานีสตรีมสด 24/7 ที่ชื่นชอบไว้ใน Bookmark

### 📱 6. Floating Mini-Player Mode (Tri-View Widget)
- ย่อขนาดหน้าต่างเป็น Widget จิ๋วขนาดกะทัดรัด (360×220 px) ลอยอยู่บนสุดของหน้าจอเสมอ (Always on Top)
- **Tri-View Switcher** กดสลับมุมมองได้ถึง 3 แบบ:
  1. 🎵 **Track View:** ปกเพลง, ชื่อเพลง, แถบความคืบหน้า และปุ่มควบคุม
  2. 📻 **VU Visualizer View:** แสดงหน้าปัด VU Meter พร้อมปุ่มเปลี่ยนรูปแบบคลื่นเสียง
  3. ⏱️ **Timer View:** หน้าปัดนาฬิกาโฟกัสขนาดใหญ่ พร้อมปุ่มเลือกเวลา 25m, 45m, 60m
- **Real-time Taskbar Countdown:** แสดงเวลานับถอยหลัง `[🎯 24:59] Lofi Player` บนแถบ Taskbar ของ Windows ตลอดเวลา แม้พับหน้าต่างลง

### 🔊 7. Centralized Master Volume & Chromium Native Audio Muting
- แถบควบคุมเสียงด้านล่างคุมระดับเสียงภาพรวมของทุกแหล่งเสียง (Local Music, Ambient Synthesizer, และ YouTube)
- ปุ่ม **Master Mute** ตัดเสียงเงียบสนิท 100% ระดับ Chromium Native Audio Engine

---

## ⌨️ Keyboard Shortcuts (คีย์ลัด)

| Shortcut Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | เล่น / หยุดเพลงชั่วคราว (Play / Pause) |
| <kbd>←</kbd> / <kbd>→</kbd> | กรอเพลง ย้อนหลัง / ไปข้างหน้า 5 วินาที (Seek ±5s) |
| <kbd>↑</kbd> / <kbd>↓</kbd> | เพิ่ม / ลดระดับเสียง Master Volume (Volume ±5%) |
| <kbd>M</kbd> | ปิด / เปิดเสียงทั้งหมด (Master Mute / Unmute) |
| <kbd>N</kbd> | เล่นเพลงถัดไป (Next Track) |
| <kbd>P</kbd> | เล่นเพลงก่อนหน้า (Previous Track) |
| *Hardware Media Keys* | รองรับปุ่มมัลติมีเดีย Play/Pause/Next บนคีย์บอร์ดและหูฟังบลูทูธ |

---

## 🚀 Download & Installation (วิธีติดตั้งและใช้งานสำหรับผู้ใช้ทั่วไป)

### ไฟล์ติดตั้งสำเร็จรูป (Installer File):
ไฟล์ตัวติดตั้งที่ผ่านการคอมไพล์แล้วจะอยู่ในโฟลเดอร์ `dist/`:
- **`dist/Lofi Player Setup 1.0.0.exe`** : ไฟล์ Setup ตัวติดตั้งสำหรับ Windows 10 / 11 (64-bit)
- **`dist/win-unpacked/LofiPlayer.exe`** : โปรแกรมแบบ Standalone Portable (ดับเบิลคลิกเปิดใช้งานได้ทันทีโดยไม่ต้องติดตั้ง)

### วิธีติดตั้ง:
1. ดับเบิลคลิกที่ไฟล์ **`Lofi Player Setup 1.0.0.exe`**
2. เลือกโฟลเดอร์ปลายทางที่ต้องการติดตั้ง แล้วกด **Install**
3. โปรแกรมจะสร้าง Shortcut ไอคอนบน Desktop และ Start Menu พร้อมเปิดใช้งานทันที

---

## 💻 Developer Guide (ขั้นตอนสำหรับนักพัฒนา)

### ข้อกำหนดเบื้องต้น (Prerequisites):
- **Node.js** : เวอร์ชัน `v18.0.0` หรือสูงกว่า ([ดาวน์โหลด Node.js](https://nodejs.org/))
- **npm** : มาพร้อมกับ Node.js
- **Git** : สำหรับโคลนโปรเจกต์ ([ดาวน์โหลด Git](https://git-scm.com/))

---

### 1. โคลนโปรเจกต์และติดตั้ง Dependencies (Clone & Install)

```bash
# โคลนโปรเจกต์ลงเครื่อง
git clone https://github.com/sorinoi/lofi-player.git

# เข้าสู่โฟลเดอร์โปรเจกต์
cd lofi-player

# ติดตั้ง Node modules ทั้งหมด
npm install
```

---

### 2. รันโปรแกรมในโหมด Development (Run Dev Mode)

คำสั่งนี้จะเปิด Hot-Module-Replacement (HMR) สำหรับการพัฒนาและทดสอบสด:

```bash
npm run dev
```

---

### 3. ตรวจสอบความถูกต้องของ Type (Typecheck)

```bash
npm run typecheck
```

---

### 4. ขั้นตอนการ Build โปรแกรมสำหรับโปรดักชัน (Production Build)

#### 4.1. คอมไพล์ Source Code ของ Renderer, Main และ Preload:
```bash
npm run build
```

#### 4.2. สั่ง Packaging สร้างไฟล์ติดตั้ง `.exe` สำหรับ Windows:
```bash
npm run build:win
```

> 🎉 เมื่อรันเสร็จสมบูรณ์ ไฟล์ติดตั้ง **`Lofi Player Setup 1.0.0.exe`** จะถูกสร้างขึ้นมาในโฟลเดอร์ **`dist/`** พร้อมแจกจ่ายใช้งานจริงครับ!

---

## 📂 Project Structure (โครงสร้างโปรเจกต์)

```
lofi-player/
├── dist/                      # โฟลเดอร์ผลลัพธ์ไฟล์ติดตั้ง (.exe)
│   ├── Lofi Player Setup 1.0.0.exe
│   └── win-unpacked/
├── src/
│   ├── main/                  # Electron Main Process (IPC, Dialogs, Window Bounds)
│   │   └── index.ts
│   ├── preload/               # Electron Preload Bridge (ContextBridge APIs)
│   │   ├── index.ts
│   │   └── index.d.ts
│   └── renderer/              # Vue 3 Frontend UI
│       ├── src/
│       │   ├── components/
│       │   │   ├── ambient/     # Ambient Sound Mixer UI
│       │   │   ├── layout/      # Custom Titlebar & Mini-Player
│       │   │   ├── library/     # Music Library & ID3 Tag UI
│       │   │   ├── timers/      # Pomodoro & Sleep Timer Modals
│       │   │   ├── visualizers/ # 4-Mode Canvas VU Visualizers
│       │   │   └── youtube/     # YouTube Stream Player
│       │   ├── services/        # Web Audio Engine, Synthesizers, Storage
│       │   ├── stores/          # Pinia State Management
│       │   ├── types/           # TypeScript Interface Definitions
│       │   ├── App.vue          # Master Layout & Tab Router
│       │   └── main.ts
│       └── index.html
├── electron-builder.yml       # การตั้งค่า Packaging สำหรับ Windows
├── package.json
├── tailwind.config.mjs
└── tsconfig.json
```

---

## 📄 License & Credits

- Developed with ❤️ by **sorinoi**
- Audio Engine powered by **Web Audio API** & **Howler.js**
- Icons by **Lucide Icons**
- Designed for lofi lovers, coders, and students worldwide 🍵📖✨
