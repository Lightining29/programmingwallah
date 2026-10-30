# Project Audit: macOS Web Operating System
**Audit Date:** 2026-10-30
**Platform:** Modern Web Browser (React 18, Vite 5, Tailwind CSS, Monaco Editor, Lucide Icons, IndexedDB POSIX VFS)

---

## 1. Architecture Overview
* **Frontend Architecture:** Single Page Application (SPA) with a dedicated desktop environment rendered at `/macos` via [`frontend/src/pages/macos/MacOSDesktop.jsx`](file:///c:/Users/brayw/Downloads/kindergarten.worktrees/frontend/src/pages/macos/MacOSDesktop.jsx). Supported by modular apps (`FinderApp`, `TerminalApp`, `AppStoreApp`, `ActivityMonitorApp`).
* **Backend Architecture:** Node.js Express server (`backend/server.js`) providing API endpoints for authentication, file handling, course catalogs, and isolated code execution (`/api/ide/execute`, `/api/ide/command`, `/api/ide/ai`).
* **Database & Persistence:**
  * Client-side: IndexedDB POSIX Virtual File System (`macOS_VFS_DB`), LocalStorage for user preferences and window geometry.
  * Server-side: MongoDB / SQLite for website databases.
* **Authentication:** JWT & bcrypt in backend for user sessions; macOS lockscreen simulation with user credentials.

---

## 2. Component Inventory & Health Assessment

| Component | Current State | Classification | Deficiencies Identified | Planned Remediation |
|---|---|---|---|---|
| **Context Menu System** | Inline `contextMenu` state with incomplete dismiss logic | **Partially Working** | Does not close when clicking empty desktop; clicks outside menu do not trigger dismiss; no Dock or Safari tab context menus | Centralized `ContextMenuManager` with global `pointerdown` capture, ref checks, escape key handling, viewport clamping, and Dock/tab menu triggers |
| **Window Management** | Window dragging & resizing in `MacOSDesktop.jsx` and `Window.jsx` | **Partially Working** | Window positions not persisted across reloads; double-click titlebar inconsistently triggers maximize; window snapping needs full left/right support | Centralized `WindowManager` with local storage persistence, double-click header toggle, 50% left/right snap, and z-index stack |
| **Safari Browser** | Mock search query cards & static template | **Broken / Missing Real Browser** | Cannot navigate real websites; no iframe embedding error handling; no URL validation; no bookmarks toolbar; no browsing history; no downloads | Rebuild with `BrowserEngine` & `BrowserTabManager`: URL parser, https prefix, iframe sandbox with X-Frame-Options fallback, bookmarks, history, downloads, start page |
| **Desktop Widgets** | Decorative widgets in Notification Center | **Partially Working** | Widgets not placeable directly on desktop; no Widget Gallery; cannot resize between small/medium/large; lacks interactive clocks/calculators | macOS Sonoma/Sequoia style Widget System: drag & drop desktop placement, gallery modal, interactive widgets (Clock, Weather, Calendar, Notes, Calculator, Battery, Pomodoro) |
| **Virtual File System** | IndexedDB POSIX VFS (`vfs.js`) | **Working** | Seeded with standard folders; supports mkdir, readFile, writeFile, delete, move, rename | Integrate context menus, Finder previewing, and drag-and-drop file uploads |
| **Finder App** | Multi-view file explorer (`FinderApp.jsx`) | **Working** | Grid & list views, directory tree traversal, file deletion to Trash | Enhance file context menus, Quick Look preview modal, and trash restore |
| **VS Code Web IDE** | Monaco Editor + real native execution backend | **Working** | OpenJDK 27 & Python 3.12 real compiler runs, interactive terminal input, problems tab | Keep stable, preserve pitch-black theme, and enhance editor tab interactions |
| **App Store & .webapp** | Package catalogue (`AppStoreApp.jsx`) | **Working** | Displays installable applications, updates VFS registry | Ensure installed apps automatically appear in Launchpad, Applications folder, and Dock |
| **Dock & Menu Bar** | Persistent dock and translucent top menu bar | **Working** | Menu bar has Apple logo, contextual app items, status icons | Add Dock right-click menus, running dot indicators, and Notification Center trigger |
| **Spotlight & Launchpad** | Search & application drawer modals | **Working** | Cmd+Space launches Spotlight; F4 launches Launchpad | Enhance search index to search bookmarks, history, and VFS files |

---

## 3. Summary of Core Issues & Priority Order
1. **Critical:** Context menu dismiss bugs (must close on any outside click, desktop click, escape, or app switch).
2. **Critical:** Safari browser navigation engine (real URL navigation, iframe embedding with X-Frame-Options fallback banner, tabs, history, bookmarks).
3. **High:** Desktop Widget System & Widget Gallery (Sonoma/Sequoia style interactive desktop widgets with size switching and persistence).
4. **Medium:** Window Manager enhancements (persistence, snapping, double-click title bar maximize).
