# Analyze Project Cards Video Demo

> **Workspace:** f:\@Projects\portfolio\htdocs

---

**User**

previously last week we have introduced video demo on projects cards analyzed it just analyzed no need to do code right now just analyzed than i will give you task

**Assistant**

Let me explore the project structure and analyze the video demo implementation on project cards.

## Analysis of Video Demo Feature on Project Cards

I've thoroughly analyzed the video demo implementation across the codebase. Here's a complete breakdown:

---

### 1. Overview

The video demo feature allows users to watch project video demos directly in a styled modal overlay. It's implemented on **2 pages** with **2 projects currently having videos**:

| Page | Project | Video Source |
|------|---------|-------------|
| [index.html](file:///f:/@Projects/portfolio/htdocs/index.html#L467-L484) | JobPortal System | `video/JobPortal.mp4` |
| [index.html](file:///f:/@Projects/portfolio/htdocs/index.html#L523-L525) | Ecommerce Platform | `video/Emart.mp4` |
| [project.html](file:///f:/@Projects/portfolio/htdocs/project.html#L70-L72) | JobPortal System | `video/JobPortal.mp4` |
| [project.html](file:///f:/@Projects/portfolio/htdocs/project.html#L74-L77) | Ecommerce Platform | `video/Emart.mp4` |

---

### 2. File Locations & Structure

**HTML Modals (2 instances)**:
- [index.html L652-L666](file:///f:/@Projects/portfolio/htdocs/index.html#L652-L666) — IDs: `videoModal`, `videoModalPlayer`, `videoModalTitleText`
- [project.html L120-L134](file:///f:/@Projects/portfolio/htdocs/project.html#L120-L134) — IDs: `videoModal`, `pVideoModalPlayer`, `pVideoModalTitleText` (prefixed to avoid conflicts)

**JavaScript Logic (2 duplicated copies)**:
- [main.js L407-L628](file:///f:/@Projects/portfolio/htdocs/main.js#L407-L628) — For index.html
- [project.html L141-L346](file:///f:/@Projects/portfolio/htdocs/project.html#L141-L346) — Inline IIFE for project.html (same logic with `p*` variable prefixes)

**CSS Styling**:
- [style.css L840-L1049](file:///f:/@Projects/portfolio/htdocs/style.css#L840-L1049) — Video button, modal overlay, responsive breakpoints, native media control overrides

---

### 3. Core Features

#### A. Video Modal Behavior
- Opens with scale-in animation + opacity fade (0.3s cubic-bezier)
- Background has `backdrop-filter: blur(6px)`
- Modal box has animated glow (`@keyframes modalGlow`) pulsing every 3s
- Body scroll locked when open (`overflow: hidden`)
- Close methods: × button, click outside, Escape key
- On open: video auto-focuses and auto-plays after 150-200ms delay
- On close: pauses, resets to `currentTime = 0`, clears `<source>` src, calls `load()`

#### B. Custom Keyboard Controls (SEEK_STEP = 5 seconds)
| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` / `→` | Seek ±5s |
| `↑` / `↓` | Volume ±10% |
| `F` / `f` | Toggle Fullscreen |
| `M` / `m` | Toggle Mute |
| `Esc` | Close Modal |

Global listener catches arrow/space keys even when focus is **outside** the video element (capturing phase, `true`).

#### C. Zone-Aware Click + Drag Seeking (Critical Design)

The bottom of the video is divided into 3 zones based on `bottomRatio` (distance from bottom / total height):

| Zone | Range | Behavior |
|------|-------|----------|
| **Native Bar** | 0% – 18% | Left alone — native timeline controls must be preserved; `preventDefault` NOT called here |
| **Custom Click** | 18% – 35% | Click → jump to X-position time; drag also works here |
| **Non-seek** | 35% – 100% | No interception — normal click/play behavior |

Key variables (from [main.js L521-L524](file:///f:/@Projects/portfolio/htdocs/main.js#L521-L524)):
```
DRAG_ZONE_MAX   = 0.35
NATIVE_BAR_MAX  = 0.18
CUSTOM_CLICK_MIN = 0.18
CUSTOM_CLICK_MAX = 0.35
```

#### D. Drag vs Click Discrimination
- `seekMoved` flag + mouse delta threshold of **3px** (dx or dy)
- If movement > 3px during mousedown→mouseup → treated as drag, click handler is skipped
- During drag: video pauses if was playing, cursor changes to `ew-resize` (`.is-seeking` class)
- On mouseup: resumes play if was playing before

#### E. Mobile Touch Support
- `touchstart` → `touchmove` → `touchend` cycle with same zone checks
- `preventDefault()` on touch events to block scroll interference (`passive: false`)
- Same drag logic: pause during seek, resume after

#### F. Native Shadow-DOM Controls (CSS)
[style.css L994-L1025](file:///f:/@Projects/portfolio/htdocs/style.css#L994-L1025) uses `::-webkit-media-controls-*` pseudo-selectors with `pointer-events: auto !important` to ensure Chrome's native timeline/buttons receive clicks correctly.

---

### 4. Known Engineering Constraints (from project_memory)

1. **HTTP Range Requests required**: Video seeking won't work with Python's `http.server` — use `npx http-server`, Flask, Apache, or Nginx instead
2. **Native exclusion ≥18%**: Must not call `preventDefault()` in bottom 18% or Chrome's native seek breaks
3. **3px delta for seekMoved**: Distinguishes accidental drags from intentional clicks

---

### 5. Notable Observations / Potential Issues

**⚠️ Code Duplication**: The video modal logic (~220 lines) is **identically duplicated** between main.js and project.html's inline script (only variable prefixes differ). This violates DRY — any future fix must be applied in both places.

**⚠️ Inconsistent setTimeout delays**: index.html uses 200ms ([main.js L425](file:///f:/@Projects/portfolio/htdocs/main.js#L425)) before play, project.html uses 150ms ([project.html L159](file:///f:/@Projects/portfolio/htdocs/project.html#L159)).

**⚠️ No `video/` folder visible**: The `images/` folder exists but I don't see a `video/` directory in the workspace listing — confirming actual video files (JobPortal.mp4, Emart.mp4) may need to be placed there.

---

✅ Analysis complete. Ready for your task whenever you give it!

---

