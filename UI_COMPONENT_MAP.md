# UI Component Map: Code Quest Python

> Defines the component hierarchy, layout specifications, and visual design for every screen in the MVP.
> All designs follow the "hacker/cyber" RPG theme defined in `pdr_cursor_spec.md` Section 9 and `adr.md` ADR 006.

---

## 1. Design System Foundation

### Color Palette (Tailwind CSS Classes)

The visual identity is **dark mode with neon Purple/Green accents** — a "hacker terminal meets RPG" aesthetic per `pdr_cursor_spec.md` Section 9.

| Role | Tailwind Class | Hex | Usage |
|:---|:---|:---|:---|
| **Background (base)** | `gray-950` | `#030712` | Page backgrounds, full-bleed areas |
| **Background (surface)** | `gray-900` | `#111827` | Cards, panels, modals, sidebar |
| **Background (elevated)** | `gray-800` | `#1f2937` | Hover states, active panels, dropdowns |
| **Border (default)** | `gray-700` | `#374151` | Card borders, dividers, input outlines |
| **Border (subtle)** | `gray-800` | `#1f2937` | Panel separators, section dividers |
| **Text (primary)** | `gray-100` | `#f3f4f6` | Headings, body text, labels |
| **Text (secondary)** | `gray-400` | `#9ca3af` | Descriptions, timestamps, helper text |
| **Text (muted)** | `gray-500` | `#6b7280` | Placeholder text, disabled labels |
| **Accent (purple)** | `violet-500` | `#8b5cf6` | Primary buttons, active nav items, links |
| **Accent (purple hover)** | `violet-400` | `#a78bfa` | Button hover, link hover |
| **Accent (green)** | `emerald-400` | `#34d399` | XP bar fill, success states, "Run" button |
| **Accent (green glow)** | `emerald-500` | `#10b981` | XP gain animation, level-up effects |
| **Error** | `red-400` | `#f87171` | Glitch Reports, validation errors |
| **Warning** | `amber-400` | `#fbbf24` | Hint escalation, caution badges |
| **Gold** | `yellow-400` | `#facc15` | Achievement badges, gold currency display |
| **Boss** | `rose-500` | `#f43f5e` | Boss difficulty badge, Final Boss indicators |

**Glow Effects:** Neon accents use `shadow-[0_0_12px_rgba(139,92,246,0.5)]` (purple glow) and `shadow-[0_0_12px_rgba(52,211,153,0.5)]` (green glow) for interactive elements like buttons and progress bars.

### Typography

| Role | Font | Tailwind Class | Rationale |
|:---|:---|:---|:---|
| **Display / Headings** | Press Start 2P | `font-display` | Retro pixel-art aesthetic — immediately signals "this is a game" and reinforces the RPG theme. Use at `text-xl` or larger for readability. |
| **Body Text** | Inter | `font-sans` (default) | Clean, highly legible at small sizes — ideal for ages 8-14 reading instructions |
| **Code / Terminal** | JetBrains Mono | `font-mono` | Designed for code readability; distinct `0`/`O` and `1`/`l` glyphs |

**Font loading:** Use `next/font/google` for Press Start 2P and Inter. JetBrains Mono is loaded for the Monaco editor theme and terminal output. Note: Press Start 2P renders poorly below ~18px — always pair it with `text-xl` or larger. For smaller UI labels that need a game feel, fall back to Inter with `uppercase tracking-wider font-bold`.

**Scale:** Minimum body text size of `text-base` (16px) for readability by children. Headings use `text-xl` to `text-3xl`. Quest instructions use `text-lg` (18px) for comfortable reading.

### Spacing & Border Radius

| Token | Value | Usage |
|:---|:---|:---|
| Card padding | `p-4` to `p-6` | Interior spacing for all card-type components |
| Section gap | `gap-6` | Space between major layout sections |
| Element gap | `gap-3` | Space between elements within a card |
| Border radius (cards) | `rounded-xl` | All cards, modals, panels |
| Border radius (buttons) | `rounded-lg` | All interactive buttons |
| Border radius (badges) | `rounded-full` | Difficulty badges, tag pills, status indicators |
| Border radius (inputs) | `rounded-lg` | Text fields, search bars |

### Common UI Patterns

**Buttons:**

| Variant | Classes | Usage |
|:---|:---|:---|
| Primary | `bg-violet-500 hover:bg-violet-400 text-white rounded-lg px-6 py-2 font-semibold` | "Start Adventure", "Submit", navigation CTAs |
| Secondary | `bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 rounded-lg px-6 py-2` | "Cancel", "Back", secondary actions |
| Success | `bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg px-6 py-2 font-semibold` | "Run Code" button |
| Danger | `bg-red-500 hover:bg-red-400 text-white rounded-lg px-4 py-2` | Destructive actions (rare in a kids' app) |

**Cards:** `bg-gray-900 border border-gray-700 rounded-xl p-4` with optional `hover:border-violet-500/50` for interactive cards.

**Input Fields:** `bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-gray-100 placeholder:text-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500`

**Badges (Difficulty):**

| Difficulty | Classes |
|:---|:---|
| Beginner | `bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full` |
| Intermediate | `bg-violet-500/20 text-violet-400 text-xs font-semibold px-2 py-0.5 rounded-full` |
| Boss | `bg-rose-500/20 text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider` |

**Progress Bars:** `bg-gray-800 rounded-full h-3` container with `bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full h-3 transition-all duration-700` fill.

---

## 2. Layout: Login / Register (Existing — Reference)

> These pages exist from MVP Step 2. Documented here for pattern consistency.

**Route:** `/login`, `/register`
**Access:** Public (per `auth_spec.md` Section 4)

**Layout:**
- Full-page centered layout on `gray-950` background
- Single card (`bg-gray-900 border border-gray-700 rounded-xl p-8`) centered vertically and horizontally, `max-w-md`
- Game logo / title at top of card using `font-display` (Orbitron), `text-violet-400`
- Form fields use the standard input pattern defined in Section 1
- "Start Adventure" / "Enter the Code" primary button at bottom
- Link to toggle between Login and Register below the card
- "Play as Guest" tertiary link below the form (per `auth_spec.md` Section 5)
- Only enabled auth providers are rendered (per `auth_spec.md` Section 2)

**Responsive:** Card remains centered at all breakpoints; padding adjusts on mobile (`p-6` → `p-4`).

---

## 3. Layout: Quest Selection / Level Map Screen

**Route:** `/quest`
**Access:** Protected — requires session or Guest Mode (per `auth_spec.md` Section 4)

### Structure

- **Top navigation bar:** Logo (left), nav links (Quest Map, Leaderboard), user avatar + username + level badge (right). On guest mode, show "Save Progress" button instead of profile info.
- **Page header:** "Quest Map" title (`font-display`), current level indicator, XP progress bar (see Section 8).
- **Level groups:** Quests organized by level folders (`content/level_1/`, `content/level_2/`, etc.) displayed as collapsible sections.

### Quest Cards (Grid Layout)

Quests are displayed in a **responsive grid**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`.

Each quest card shows data from the quest frontmatter fields (per `QUEST_FORMAT_SPEC.md` Section 1):

| Element | Source | Display |
|:---|:---|:---|
| Title | `title` | Card heading, `text-lg font-semibold text-gray-100` |
| Difficulty | `difficulty` | Badge in top-right corner (Beginner / Intermediate / Boss — see badge classes in Section 1) |
| XP Reward | `xp_reward` | `"⚡ {xp_reward} XP"` in `text-emerald-400 font-mono text-sm` |
| Tags | `tags` | Pill badges: `bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full` |
| Narrative hook | `narrative_text` | One-line preview, `text-gray-400 text-sm line-clamp-2` |

### Quest Status Indicators

Status is determined by cross-referencing `QuestAttempt.isCompleted` with the `unlocks` dependency chain from frontmatter.

| Status | Visual Treatment |
|:---|:---|
| **Completed** | Green checkmark overlay, `border-emerald-500/50`, reduced opacity (`opacity-75`), "Cleared" badge |
| **Available** | Default card style, `hover:border-violet-500/50`, clickable, subtle purple glow on hover |
| **Locked** | `opacity-40`, padlock icon overlay (Lucide `Lock`), `cursor-not-allowed`, tooltip: "Complete {prerequisite quest title} to unlock" |

### Unlock Chain Visualization

The `unlocks` field from quest frontmatter creates a dependency graph. For MVP, this is represented by:
- Level section headers that collapse/expand
- Locked quest cards showing which prerequisite is needed
- A subtle connecting line or arrow between quest cards within a level group (CSS `border-l-2 border-dashed border-gray-700` on a vertical timeline within each level)

> **Best practice (educational UI for children):** Visible progress paths increase motivation. The "skill tree" pattern is familiar to kids from games and provides a clear sense of progression. Full interactive skill tree visualization is deferred to Post-MVP (see `roadmap.md` Phase 2).

---

## 4. Layout: Quest Play Screen (Three-Panel)

**Route:** `/quest/{id}`
**Access:** Protected — requires session or Guest Mode (per `auth_spec.md` Section 4)

This is the **core game screen** where students read instructions, write code, and see results.

### Panel Layout (Desktop)

```
┌──────────────────────────────────────────────────────────────────┐
│  Top Bar: Quest Title  |  Difficulty Badge  |  ⚡ XP  |  [Run] [Submit]  │
├──────────────┬────────────────────────┬──────────────────────────┤
│              │                        │                          │
│  Instructions│     Code Editor        │      Terminal            │
│  (Left)      │     (Center)           │      (Right)             │
│  25%         │     50%                │      25%                 │
│              │                        │                          │
├──────────────┴────────────────────────┴──────────────────────────┤
│  Bottom Bar: XP Progress Bar  |  Level indicator                │
└──────────────────────────────────────────────────────────────────┘
```

**Proportions:** `25% / 50% / 25%` using CSS Grid: `grid grid-cols-[1fr_2fr_1fr]`.

**Panel dividers:** Resizable via drag handles (`cursor-col-resize`) with `border-r border-gray-700` separators.

### Top Bar

- **Quest title:** `font-display text-lg text-gray-100`
- **Difficulty badge:** Uses the badge classes from Section 1
- **XP reward:** `"⚡ {xp_reward} XP"` in `text-emerald-400 font-mono`
- **"Run" button:** Success variant (green). Executes code via Pyodide client-side (Phase 1 grading — `pdr_cursor_spec.md` Section 5B).
- **"Submit" button:** Primary variant (purple). Sends code to server for re-verification (Phase 2 grading). **Disabled until client-side tests pass.** Shows tooltip: "Pass all tests first!" when disabled.

### Left Panel — Instructions

- **Content:** Rendered Markdown from the quest `.md` body (parsed by `gray-matter` — `QUEST_FORMAT_SPEC.md` Section 5).
- **Narrative box:** The `narrative_text` field displayed in a styled callout box at the top: `bg-violet-500/10 border-l-4 border-violet-500 p-4 rounded-r-lg text-gray-200 italic`. This sets the RPG scene before the technical instructions.
- **Scrollable:** `overflow-y-auto` with custom scrollbar (`scrollbar-thin scrollbar-thumb-gray-700`).
- **Code examples:** Regular `` ```python `` blocks rendered with syntax highlighting (read-only, not the starter code).
- **Typography:** `text-lg leading-relaxed` for instruction body to ensure readability for ages 8-14.

### Center Panel — Code Editor

- **Engine:** Monaco Editor with dark theme (matches `gray-900` surface).
- **Initial content:** The `` ```python starter `` block from the quest file, pre-loaded (per `QUEST_FORMAT_SPEC.md` Section 2).
- **Font:** JetBrains Mono, `14px` minimum.
- **Features:** Line numbers, syntax highlighting, auto-indent, bracket matching.
- **Theme:** Custom Monaco theme matching the design system colors (background: `gray-900`, foreground: `gray-100`, keywords: `violet-400`, strings: `emerald-400`, comments: `gray-500`).

### Right Panel — Terminal Output

- **Font:** JetBrains Mono, `text-sm`, `text-gray-300` on `bg-gray-950`.
- **Header:** "Terminal" label with a blinking cursor icon (Lucide `Terminal`).
- **Output:** Shows `stdout` / `stderr` from Pyodide execution.
- **Glitch Reports:** When client-side tests fail, the Glitch Report component renders here (see `GLITCH_REPORT_SPEC.md` for full specification).
- **Success feedback:** When tests pass, success component renders here (see `GLITCH_REPORT_SPEC.md` Section 5).
- **Scrollable:** `overflow-y-auto`, auto-scrolls to bottom on new output.
- **Clear button:** Small "Clear" button in the terminal header to reset output.

### Bottom Bar

- **XP progress bar** (see Section 8): Shows current XP / XP needed for next level.
- **Level indicator:** `"Level {n}"` badge in `text-violet-400 font-display text-sm`.
- **Hidden for Guest Mode users** — replaced with "Playing as Guest — Save Progress?" link.

---

## 5. Layout: Profile / XP Dashboard

**Route:** `/profile`
**Access:** Protected — requires authenticated session, no Guest Mode (per `auth_spec.md` Section 4)

### Structure

Two-column layout on desktop (`grid grid-cols-[1fr_2fr] gap-6`), single column on mobile.

### Left Column — Player Card

A tall card displaying the player's identity and stats. All fields from the `User` model (`DATA_MODEL.md` Section 1):

| Element | Source Field | Display |
|:---|:---|:---|
| Avatar | `image` (or default sprite if `null`) | Circular, `w-24 h-24 rounded-full border-2 border-violet-500` |
| Username | `username` | `font-display text-2xl text-gray-100` |
| Level | `level` | Large badge: `bg-violet-500/20 text-violet-400 font-display text-lg px-3 py-1 rounded-lg` |
| XP Bar | `xp`, `level` | Full-width XP progress bar (Section 8) with numeric label: `"{xp} / {xp_required} XP"` |
| Gold | `gold` | `"🪙 {gold} Gold"` in `text-yellow-400` |
| Streak | `streakDays` | `"🔥 {streakDays} Day Streak"` in `text-amber-400` |
| Member since | `createdAt` | `text-gray-500 text-sm` |

### Right Column — Activity & Achievements

**Quest History tab:**
- List of completed quests from `QuestAttempt` records where `isCompleted: true`
- Each row: quest title, XP earned, time taken, `attemptsCount`, date completed
- Code preview: Expandable `<details>` showing `codeSubmitted` in a syntax-highlighted block (JetBrains Mono, read-only)

**Achievements tab:**
- Grid of earned badges from `UserAchievement` records: `grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3`
- Each badge: icon (`iconSlug` from `Achievement` model), name, `earnedAt` date
- Earned badges: full color with subtle glow
- Unearned badges: `opacity-30 grayscale`, with tooltip showing `description` and requirements

---

## 6. Layout: Leaderboard

**Route:** `/leaderboard`
**Access:** Public — read-only (per `auth_spec.md` Section 4)

### Structure

Centered content area, `max-w-4xl mx-auto`.

### Leaderboard Table

Powered by `GET /api/v1/leaderboard` (paginated — per `API_SPECIFICATION.md` Section 2).

| Column | Source | Display |
|:---|:---|:---|
| Rank | Computed from position | `font-mono text-gray-400`. Top 3 use special icons: 🥇 🥈 🥉 |
| Avatar | `image` | `w-8 h-8 rounded-full` |
| Username | `username` | `font-semibold text-gray-100` |
| Level | `level` | Level badge (small): `bg-violet-500/20 text-violet-400 text-xs px-2 py-0.5 rounded-full` |
| Total XP | `xp` | `text-emerald-400 font-mono` |

**Table styling:** `bg-gray-900 rounded-xl border border-gray-700`. Rows alternate between `bg-gray-900` and `bg-gray-800/50`. Current user's row highlighted with `bg-violet-500/10 border-l-2 border-violet-500`.

### Pagination

- "Load More" button at the bottom (preferred over numbered pages for simplicity)
- Default page size: 25 players
- Shows total player count above the table

### Filter (Optional Enhancement)

- Level filter dropdown: "All Levels", "Level 1", "Level 2", etc.
- Positioned above the table, right-aligned

> **Note:** Guest Mode users do not appear on the leaderboard (per `auth_spec.md` Section 5). The leaderboard page is still viewable by guests as a motivation tool.

---

## 7. Component: Level-Up Celebration Modal

**Trigger:** `level_up: true` in the `POST /quests/{id}/submit` response (per `API_SPECIFICATION.md` Section 3).

### Visual Design

- **Overlay:** Full-screen backdrop, `bg-black/70 backdrop-blur-sm`, `z-50`
- **Modal:** Centered card, `bg-gray-900 border border-violet-500 rounded-xl p-8 max-w-md`, with animated purple glow border (`shadow-[0_0_30px_rgba(139,92,246,0.6)]`)

### Content

| Element | Description |
|:---|:---|
| **Header animation** | Particle/confetti burst effect — green and purple particles emanating from center. Conveys excitement and achievement. |
| **Title** | `"LEVEL UP!"` in `font-display text-4xl text-violet-400` with a pulsing glow animation |
| **New level** | `"Level {new_level}"` from API response, large display number in `font-display text-6xl text-emerald-400` |
| **Message** | Encouraging text: `"Your skills are growing stronger, Adventurer!"` in `text-gray-200 text-lg` |
| **Unlocked badges** | If `unlocked_badges` array is non-empty, show each badge with icon and name in a horizontal row |
| **Dismiss button** | `"Continue Adventure →"` primary button. Returns to quest selection or loads the next quest. |

### Animation Vibe

> **Best practice (game design for children):** Level-up moments are critical reward signals. The celebration should feel earned and exciting — think RPG victory screens. Use a combination of: confetti particle burst (2-3 seconds), scale-up animation on the level number, and a brief screen shake or glow pulse. Sound effect support is a future enhancement.

### Dismiss Behavior

- Auto-dismiss after 8 seconds if no interaction
- Click outside modal or press Escape to dismiss
- "Continue" button navigates to quest selection (`/quest`) with the next available quest highlighted

---

## 8. Component: XP Progress Bar

**Appears on:** Quest Play Screen (bottom bar — Section 4), Profile Dashboard (Section 5), Quest Selection (header — Section 3).

### Formula Reference

XP required for next level: `XP_Required = 100 × (Level^1.5)` (from `adr.md` ADR 005).

| Level | XP Required | Cumulative |
|:---|:---|:---|
| 1 → 2 | 100 | 100 |
| 2 → 3 | 283 | 383 |
| 3 → 4 | 520 | 903 |
| 4 → 5 | 800 | 1,703 |
| 5 → 6 | 1,118 | 2,821 |

### Visual Design

```
┌──────────────────────────────────────────────┐
│ ████████████████░░░░░░░░░░  340 / 520 XP     │
└──────────────────────────────────────────────┘
```

- **Container:** `bg-gray-800 rounded-full h-3 w-full`
- **Fill:** `bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full h-3`, width calculated as `(current_xp_in_level / xp_required) × 100%`
- **Label:** `"{current_xp} / {xp_required} XP"` in `text-gray-400 text-sm font-mono` positioned above or to the right of the bar
- **Animation:** On XP gain, the fill width transitions smoothly (`transition-all duration-700 ease-out`). For large gains, the bar fills with a brief green glow pulse.
- **Level badge:** Small `"Lv.{n}"` indicator to the left of the bar in `text-violet-400 font-display text-xs`

### Overflow Behavior

When a user earns enough XP to level up, the bar fills to 100%, pauses briefly (300ms), then resets to the new level's progress. This triggers the Level-Up Celebration Modal (Section 7) simultaneously.

---

## 9. Component: Toast Notifications

**Used for:** XP earned, badge unlocked, level up (brief), errors, info messages.

### Position & Behavior

- **Position:** Bottom-right corner, `fixed bottom-4 right-4 z-40`
- **Stack:** Multiple toasts stack vertically with `gap-2`, newest on top
- **Auto-dismiss:** 5 seconds for success/info, 8 seconds for achievements, manual dismiss for errors
- **Animation:** Slide in from right (`translate-x-full → translate-x-0`), fade out on dismiss
- **Maximum visible:** 3 toasts at once; older toasts are dismissed when a 4th arrives

### Toast Types

| Type | Border Accent | Icon | Use Case |
|:---|:---|:---|:---|
| **Success** | `border-l-4 border-emerald-400` | Lucide `CheckCircle` in `text-emerald-400` | XP earned, quest completed |
| **Info** | `border-l-4 border-violet-400` | Lucide `Info` in `text-violet-400` | System messages, hints |
| **Error** | `border-l-4 border-red-400` | Lucide `AlertTriangle` in `text-red-400` | Submission errors, network issues |
| **Achievement** | `border-l-4 border-yellow-400` | Badge icon in `text-yellow-400` | Badge unlocked, milestone reached |

### Toast Structure

```
┌───┬──────────────────────────────────┬───┐
│ ● │  ⚡ +50 XP Earned!               │ ✕ │
│   │  "The Guardian's Password"       │   │
└───┴──────────────────────────────────┴───┘
```

- **Container:** `bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg min-w-[300px] max-w-[400px]`
- **Icon area:** Left-aligned, `w-8` column
- **Content:** Title in `text-gray-100 font-semibold text-sm`, description in `text-gray-400 text-xs`
- **Dismiss:** Small `✕` button, `text-gray-500 hover:text-gray-300`

---

## 10. Responsive Breakpoints

Per `adr.md` ADR 006, the game must be playable on tablets and laptops used in classrooms.

> **Best practice (educational UI for children ages 8-14):** Kids in classrooms primarily use tablets (iPads, Chromebooks) and shared laptops. Touch targets must be at least 44px. Font sizes must remain readable. The code editor is the most critical element — never shrink it below usable size.

### Breakpoint Definitions

| Breakpoint | Tailwind | Width | Target Devices |
|:---|:---|:---|:---|
| Mobile | default | < 768px | Phones (limited support — code editing on phone is poor UX) |
| Tablet | `md:` | 768px – 1023px | iPads, Chromebooks, small laptops |
| Desktop | `lg:` | 1024px – 1279px | Standard laptops, classroom desktops |
| Wide | `xl:` | 1280px+ | External monitors, teacher displays |

### Quest Play Screen Adaptation (Most Critical)

| Breakpoint | Layout | Behavior |
|:---|:---|:---|
| **Desktop** (1024px+) | Three-panel side-by-side: `25% / 50% / 25%` | Full experience as designed in Section 4 |
| **Tablet** (768px – 1023px) | Two-panel: `50% / 50%` (editor + terminal). Instructions accessible via a slide-out drawer (hamburger toggle in top bar). | Editor and terminal share the screen. Instructions panel slides in from left as an overlay when the "Instructions" button is tapped. |
| **Mobile** (< 768px) | Single panel with tab navigation: `[Instructions] [Editor] [Terminal]` tabs at top. Only one panel visible at a time. | Tab-based switching. Editor tab is the default view. "Run" and "Submit" buttons float at the bottom as a sticky bar (`fixed bottom-0`). |

### Other Screen Adaptations

| Screen | Tablet (768px+) | Mobile (< 768px) |
|:---|:---|:---|
| Quest Selection | 2-column grid | Single column list |
| Profile Dashboard | Single column (stats above, history below) | Single column, compact cards |
| Leaderboard | Full table | Simplified cards (rank + name + XP per card) |
| Login / Register | Centered card, `max-w-md` | Full-width card, reduced padding |
| Navigation | Horizontal top bar | Hamburger menu with slide-out drawer |

### Touch Target Requirements

All interactive elements must meet minimum `44px × 44px` touch targets per WCAG 2.5.5 (AAA). This is especially important for:
- "Run" and "Submit" buttons on the Quest Play screen
- Quest cards on the selection screen
- Tab switches on mobile Quest Play layout
- Toast dismiss buttons
