# MVP Step 3 Prompt: Pyodide Integration (The Engine)

> Copy everything below the line into a new Cursor chat in Agent mode.

---

```
You are executing MVP Step 3: "Pyodide Integration (The Engine)" for the Code Quest Python project.

Steps 1-2 are complete: the Turborepo monorepo is scaffolded, the database is migrated, and auth (login/register/session middleware) is working. The documentation checkpoint is also complete — UI Component Map, Curriculum Outline, User Flows, and Glitch Report Spec all exist.

## RULES — READ BEFORE DOING ANYTHING

1. **No assumptions.** Every decision must be grounded in the specification documents listed below. If a spec doesn't cover something, use widely-accepted best practices for Pyodide, Monaco Editor, and Next.js 14+ — and cite which best practice you're following.
2. **No skipping steps.** Complete every task in order. Do not move to the next task until the current one is verified working.
3. **No scope creep.** This is ONLY Step 3 (Pyodide + Editor + Terminal). Do NOT build quest loading, content parsing, grading logic, XP awards, leaderboard, or any API endpoints. Those are Steps 4-5.
4. **Follow the UI Component Map exactly.** All layout, colors, fonts, spacing, and responsive behavior must match `UI_COMPONENT_MAP.md`. Do not invent your own styling.
5. **Follow the design system.** Use the exact Tailwind classes from `UI_COMPONENT_MAP.md` Section 1 (color palette, typography, spacing). Install the fonts specified: Press Start 2P, Inter (via `next/font/google`), and JetBrains Mono.
6. **Keep working.** After each task, immediately proceed to the next. Do not stop to ask for confirmation between tasks. Only stop if you encounter an error you cannot resolve.
7. **Clean code.** TypeScript for all frontend code. Components must be modular and reusable. Per `pdr_cursor_spec.md` Section 9.

## SPECIFICATION DOCUMENTS (Your single source of truth)

Read ALL of these before writing any code:

- `@pdr_cursor_spec.md` — Section 5B (Hybrid Grading — Phase 1 client-side is what we're building), Section 9 (Cursor AI Rules — visual style, clean code).
- `@adr.md` — ADR 001 (Client-Side Python Execution via Pyodide — security, latency, offline rationale), ADR 006 (Tailwind CSS RPG theme).
- `@UI_COMPONENT_MAP.md` — THE PRIMARY REFERENCE FOR THIS STEP. Read the entire file, especially:
  - Section 1: Design System (color palette, typography with Press Start 2P / Inter / JetBrains Mono, spacing, glow effects)
  - Section 4: Quest Play Screen — Three-Panel layout (25% / 50% / 25%), top bar, bottom bar
  - Section 4 Center Panel: Monaco Editor specs (dark theme, font, features, custom theme colors)
  - Section 4 Right Panel: Terminal Output specs (font, header, stdout/stderr display, Glitch Report placeholder)
  - Section 4 Top Bar: Quest title, "Run" button (green), "Submit" button (purple, disabled for now)
  - Section 4 Bottom Bar: XP progress bar placeholder
  - Section 11: Responsive breakpoints (desktop three-panel → tablet two-panel → mobile tabs)
- `@GLITCH_REPORT_SPEC.md` — Section 2 (Glitch Report component structure) and Section 3 (error type mapping). Build the component shell — it will be fully wired in Step 4.
- `@pre_dev_checklist.md` — Step 3 task list and TDD gate.

## TASK CHECKLIST (Execute in this exact order)

### Task 1: Install Pyodide Dependencies
- Install `pyodide` (the npm package for loading the Pyodide WASM runtime) in `apps/web/`.
- Note: Pyodide is large (~15MB WASM). It must be loaded asynchronously and lazily — never block page render.
- Check the latest Pyodide npm package version and install it. Do not make up a version number.

### Task 2: Set Up the Design System
- Configure the fonts from `UI_COMPONENT_MAP.md` Section 1:
  - Load `Press Start 2P` and `Inter` via `next/font/google` in the root layout.
  - Add JetBrains Mono for the code editor and terminal (via `next/font/google` or CDN).
  - Set up the Tailwind config to reference `font-display` (Press Start 2P), `font-sans` (Inter), `font-mono` (JetBrains Mono).
- Add any custom Tailwind theme extensions needed from the design system (glow shadows, custom colors if not already in default Tailwind).
- Ensure the root layout (`apps/web/app/layout.tsx`) applies the dark mode base: `bg-gray-950 text-gray-100` on the `<body>`.

### Task 3: Create the `usePyodide` Hook
- Create `apps/web/hooks/usePyodide.ts`.
- The hook must:
  1. Lazily load the Pyodide WASM bundle on first use (not on page load).
  2. Expose a `loading` boolean (true while WASM is downloading).
  3. Expose an `error` state if loading fails.
  4. Expose a `runPython(code: string)` async function that:
     - Executes the given Python code string in the Pyodide interpreter.
     - Captures `stdout` and `stderr` separately.
     - Returns `{ stdout: string, stderr: string, success: boolean }`.
     - Enforces a timeout (10 seconds max execution per `API_SPECIFICATION.md` Section 5).
     - Catches and returns Python exceptions as `stderr` instead of crashing.
  5. Expose a `ready` boolean (true when Pyodide is loaded and ready to execute).
- The hook must be a client component hook (`"use client"`).
- Pyodide must run in the browser only — it cannot be imported in server components.

### Task 4: Build the Monaco Editor Component
- Create `apps/web/components/CodeEditor.tsx`.
- Install `@monaco-editor/react` in `apps/web/`.
- Configure per `UI_COMPONENT_MAP.md` Section 4 (Center Panel):
  - Language: `python`
  - Theme: Custom dark theme matching the design system (background: `#111827` / gray-900, foreground: `#f3f4f6` / gray-100, keywords: `#a78bfa` / violet-400, strings: `#34d399` / emerald-400, comments: `#6b7280` / gray-500).
  - Font: JetBrains Mono, minimum 14px.
  - Features: line numbers, syntax highlighting, auto-indent, bracket matching.
  - Minimap: disabled (per component map).
- Props interface:
  - `initialCode?: string` — pre-loaded code (for `python starter` blocks in Step 4).
  - `onChange?: (code: string) => void` — callback when code changes.
  - `readOnly?: boolean` — for displaying submitted code later.
- The component must be client-side only (`"use client"` with dynamic import `ssr: false`).

### Task 5: Build the Terminal Output Component
- Create `apps/web/components/TerminalOutput.tsx`.
- Configure per `UI_COMPONENT_MAP.md` Section 4 (Right Panel):
  - Font: JetBrains Mono, `text-sm`, `text-gray-300` on `bg-gray-950`.
  - Header: "Terminal" label with a terminal icon (use Lucide `Terminal` icon — install `lucide-react` if not already present).
  - Scrollable output area for `stdout` lines.
  - `stderr` lines displayed in `text-red-400`.
  - A clear button to reset the terminal.
- Props interface:
  - `stdout: string` — standard output from Pyodide.
  - `stderr: string` — error output from Pyodide.
  - `isRunning: boolean` — shows a loading/spinner indicator while code executes.
- Build a **Glitch Report shell component** (`apps/web/components/GlitchReport.tsx`):
  - Per `GLITCH_REPORT_SPEC.md` Section 2: Icon, "Glitch Detected!" title, type badge, hint message, retry prompt.
  - For now, accept props: `errorType: string`, `hint: string`, `category: string`.
  - The actual error mapping logic (Section 3 of Glitch Report Spec) will be wired in Step 4 — just build the visual component now.

### Task 6: Build the Quest Play Screen Layout
- Create `apps/web/app/quest/[id]/page.tsx`.
- This is the three-panel layout per `UI_COMPONENT_MAP.md` Section 4:
  - **Left panel (25%):** Placeholder for instructions. Show "Instructions will load here" with the correct styling (scrollable, `bg-gray-900`, padded). This will be wired to quest content in Step 4.
  - **Center panel (50%):** The `CodeEditor` component. Pre-load with a placeholder: `# Write your Python code here\nprint("Hello, World!")`.
  - **Right panel (25%):** The `TerminalOutput` component.
- **Top bar:** Per `UI_COMPONENT_MAP.md` Section 4:
  - Quest title placeholder: "Quest Loading..."
  - "Run" button (green/emerald accent, per design system). Clicking it takes the code from the editor, runs it through `usePyodide`, and displays the result in the terminal.
  - "Submit" button (purple/violet accent). **Disabled for Step 3** — will be wired to the grading API in Step 4.
- **Bottom bar:** XP progress bar placeholder (empty bar with correct styling from `UI_COMPONENT_MAP.md` Section 8 — it will be populated with real data in Step 5).
- This page must be a **protected route** (the middleware from Step 2 already handles this — users must be logged in).
- Implement responsive behavior per `UI_COMPONENT_MAP.md` Section 11:
  - Desktop (1024px+): three-panel side-by-side 25% / 50% / 25%.
  - Tablet (768px-1023px): two-panel 50%/50% (editor + terminal), instructions as a slide-out drawer.
  - Mobile (<768px): tab navigation — [Instructions] [Editor] [Terminal] — one panel visible at a time.

### Task 7: Wire Run Button → Pyodide → Terminal
- When the "Run" button is clicked:
  1. Get the current code from the `CodeEditor` component.
  2. Set `isRunning: true` on the terminal.
  3. Call `usePyodide().runPython(code)`.
  4. Display `stdout` in the terminal (green/gray text).
  5. If `stderr` is non-empty, display it in `text-red-400` AND render the `GlitchReport` component with a basic error parse (extract the Python error type from the last line of the traceback).
  6. Set `isRunning: false`.
- The "Run" button should be disabled while Pyodide is loading (`loading` state) or while code is running (`isRunning`).
- Show a loading state in the terminal while Pyodide WASM is downloading for the first time ("Loading Python engine...").

### Task 8: Verify TDD Gate
- Start the dev server (`npm run dev`).
- Navigate to `/login`, log in with a test account.
- Navigate to `/quest/test` (or any quest ID — content doesn't matter yet, just the layout).
- In the code editor, type: `print("hello")`
- Click "Run".
- Verify: The terminal shows `hello`.
- Type code with an error: `print(1/0)`
- Click "Run".
- Verify: The terminal shows a `ZeroDivisionError` in red, and the GlitchReport component renders.
- Test responsive: resize the browser to tablet and mobile widths to confirm layout adapts.
- If any test fails, fix the issue before proceeding.

### Task 9: Commit
- Stage all new and modified files.
- Commit with message: "feat: add Pyodide integration, Monaco editor, terminal output, and quest play screen layout"
- Do NOT push to any remote.

## WHAT IS EXPLICITLY OUT OF SCOPE FOR STEP 3

Do NOT build any of these — they belong to later steps:
- Quest content loading / Markdown parsing (Step 4)
- The `python starter` block extraction from quest files (Step 4)
- Client-side test execution / grading (Step 4)
- Server-side re-verification / `POST /quests/{id}/submit` (Step 4)
- The "Submit" button functionality (Step 4 — build the button, but keep it disabled)
- XP calculation / Reward Logic / level-up (Step 5)
- Leaderboard, profile page, achievements (Step 5+)
- Guest Mode (Post-MVP)
- Quest selection / level map screen (Step 4 will add basic quest listing)

## WHEN YOU ARE DONE

Report back with:
1. Confirmation that Pyodide loads successfully in the browser.
2. Confirmation that `print("hello")` in the editor produces `hello` in the terminal.
3. Confirmation that Python errors display in red with the GlitchReport component.
4. Confirmation that responsive layout works at desktop, tablet, and mobile widths.
5. Any deviations from the spec and why they were necessary.
```
