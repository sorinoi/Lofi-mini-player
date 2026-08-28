# Plan: Fix Dock Sidebar Window Positioning in Reserved AppBar Space (Iteration 2)

## 1. Root Cause Analysis
1. **Coordinate Source (`bounds` vs `workArea`):**
   - The previous code used `workArea` to calculate `targetX`. When Windows Explorer reduces the `workArea` to reserve space for the AppBar, `workArea.width` decreases, causing `targetX` to be calculated inside the shrunken work area (or shifted left) instead of at the true right edge of the monitor (`bounds.x + bounds.width - width`).
   - Using `display.bounds` guarantees consistent coordinates relative to the full screen resolution (`3440 x 1440`).

2. **Electron Asynchronous Unmaximize & Message Queue Conflict:**
   - Calling `mainWindow.unmaximize()` triggers an asynchronous OS restore event that overwrites immediate bounds changes with `normalBounds`.
   - Applying bounds both immediately and via staggered retries (`50ms`, `150ms`) guarantees the window remains firmly anchored to `(targetX, targetY)` once the OS unmaximize cycle completes.

3. **Window Constraints:**
   - Temporarily setting `window.setMinimumSize(100, 100)` prevents Chromium window manager from clamping the 340px dock width.

---

## 2. Implementation Solution

### `src/main/appBarService.ts`
- Use `display.bounds` for screen edge calculation (`targetX = bounds.x + bounds.width - width`, `targetY = bounds.y`, `targetHeight = bounds.height`).
- Apply `window.setMinimumSize(100, 100)`.
- Use repeated staggered bounds setting (`setImmediate`, `50ms`, `150ms`) to overcome unmaximize race conditions.

### `src/main/index.ts`
- In `enterDockMode()`, ensure `unmaximize()` and `registerAppBar` coordinate reliably.
- In `exitDockMode()`, restore `window.setMinimumSize(340, 200)`.

---

## 3. Verification
- `npm run typecheck`
- `npm run build`
- `npm run build:win`
