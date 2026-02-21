# Documentation Checkpoint Prompt: Medium Priority Items

> Copy everything below the line into a new Cursor chat in Agent mode.
> This creates the 4 design documents needed before MVP Steps 3-5.

---

```
You are creating the Medium Priority design documents for the Code Quest Python project. These are the documentation checkpoint items identified in `@roadmap.md` and `@pre_dev_checklist.md` that must exist before MVP Steps 3-5 can begin.

MVP Steps 1-2 are complete. The monorepo is scaffolded, the database is migrated, and auth (login/register) is working.

## RULES — READ BEFORE DOING ANYTHING

1. **No assumptions.** Every design decision must be grounded in the existing spec documents listed below. Where specs are silent, use best practices for educational UIs for children (ages 8-14), accessible web design, and RPG game interfaces — and cite which best practice you're following.
2. **No code.** This task produces ONLY Markdown documentation files. Do not write any TypeScript, Python, CSS, or configuration. Do not modify any existing code files.
3. **Follow existing style.** Match the formatting conventions of existing spec files (headings, tables, horizontal rules between sections, bold labels).
4. **Reference existing specs.** Cross-link to `pdr_cursor_spec.md`, `QUEST_FORMAT_SPEC.md`, `API_SPECIFICATION.md`, `auth_spec.md`, and `adr.md` where relevant — use relative links and section numbers.
5. **Keep working.** Create all 4 documents in sequence. Do not stop between documents.
6. **Visual theme.** Per `pdr_cursor_spec.md` Section 9: Dark mode with neon Purple/Green accents, "hacker/cyber" RPG feel. All UI descriptions must follow this theme.
7. **Educational tone.** Per `pdr_cursor_spec.md` Section 9: All error messages and UI copy must be encouraging. Never say "Wrong"; say "Glitch Detected! Try adjusting your spell."

## SPECIFICATION DOCUMENTS (Your single source of truth)

Read ALL of these before writing anything:

- `@pdr_cursor_spec.md` — Section 5 (Gamification Rules + Hybrid Grading), Section 7 (Phases), Section 9 (Cursor AI Rules — visual style, tone).
- `@adr.md` — ADR 005 (XP progression formula), ADR 006 (Tailwind CSS RPG theme).
- `@API_SPECIFICATION.md` — Section 2 (all endpoints), Section 3 (submit response shapes — success + failure JSON).
- `@QUEST_FORMAT_SPEC.md` — Section 1 (frontmatter fields), Section 2 (starter code embedding), Section 3 (test suite + `user_code` fixture), Section 4 (complete example quest).
- `@auth_spec.md` — Section 4 (route protection table), Section 5 (Guest Mode — for user flow docs).
- `@DATA_MODEL.md` — Section 1 (Prisma schema — all field names for profile/XP display), Section 3 (requirementSlug format for achievements).
- `@ENV_SPECIFICATION.md` — Section 5 (feature flags: XP multiplier, debug mode, maintenance mode).
- `@roadmap.md` — Documentation Checkpoint section (the 4 items being created).
- `@pre_dev_checklist.md` — Medium Priority section (the 4 items with their sub-requirements).

## DOCUMENT 1: UI Component Map — `UI_COMPONENT_MAP.md`

Create this file at the project root. It must define the component hierarchy, layout specifications, and visual design for every screen the MVP needs.

### Required Sections:

#### 1. Design System Foundation
- Color palette: exact Tailwind color classes for the dark mode + neon theme (background, surfaces, borders, text, accent purple, accent green, error red, warning amber)
- Typography: font choices (the PDR mentions "hacker/cyber" — specify a monospace for code, a display font for headings, a readable font for body text)
- Spacing scale and border radius conventions
- Common UI patterns: cards, buttons (primary/secondary/danger), input fields, badges, progress bars, toast notifications

#### 2. Layout: Login / Register (Already Built — Document for Reference)
- Describe the existing dark mode login/register pages for consistency reference
- Note: these exist from Step 2 — this section just documents the pattern

#### 3. Layout: Quest Selection / Level Map Screen
- How quests are displayed (grid, list, skill tree?)
- Quest card component: shows `title`, `difficulty`, `xp_reward`, `tags`, lock/unlock status (from `unlocks` field in frontmatter)
- Level grouping: quests grouped by level folders (`content/level_1/`, `content/level_2/`, etc.)
- Visual indicators for: completed, available, locked
- How the `unlocks` dependency chain is visualized

#### 4. Layout: Quest Play Screen (Three-Panel — Most Critical)
- This is the core game screen. Define exact panel proportions and responsive behavior:
  - **Left panel (Instructions):** Rendered Markdown from quest `.md` body. Shows `narrative_text`, mission, and instructions. Scrollable.
  - **Center panel (Code Editor):** Monaco editor with the `python starter` block pre-loaded. Dark theme. Line numbers. Syntax highlighting.
  - **Right panel (Terminal):** Shows `stdout`/`stderr` from Pyodide execution. Monospace font. Shows Glitch Reports on failure.
- Panel proportions (desktop): specify percentages or fractions (e.g., 25% / 50% / 25%)
- Responsive behavior: what happens on tablet? On mobile? (stack vertically? hide instructions?)
- Top bar: shows quest title, XP reward, difficulty badge, "Run" button, "Submit" button
- Bottom bar (optional): XP progress bar, current level

#### 5. Layout: Profile / XP Dashboard
- Displays: username, avatar, level, XP bar (current XP / XP to next level per ADR 005 formula), gold, streakDays
- Quest history: list of completed quests with `codeSubmitted` preview
- Achievements/badges earned (grid of icons)
- Note: this is a protected route — authenticated users only (per `auth_spec.md` Section 4)

#### 6. Layout: Leaderboard
- Public route (per `auth_spec.md` Section 4)
- Table: rank, username, avatar, level, total XP
- Pagination (per `API_SPECIFICATION.md` Section 2: `GET /leaderboard` is paginated)
- Filter by level (optional)

#### 7. Component: Level-Up Celebration Modal
- Triggered when `level_up: true` in submit response
- Fullscreen overlay or centered modal
- Shows: new level number, congratulatory message, any unlocked badges
- Animated (confetti, glow, particle effects — describe the vibe, not the implementation)
- Dismisses to return to quest screen or next quest

#### 8. Component: XP Progress Bar
- Shows current XP / XP needed for next level
- Formula reference: `XP_Required = 100 × (Level^1.5)` (from `adr.md` ADR 005)
- Animated fill on XP gain
- Color: neon green gradient
- Appears on: quest play screen (bottom), profile dashboard

#### 9. Component: Toast Notifications
- Used for: XP earned, badge unlocked, level up, errors
- Position: top-right or bottom-right
- Auto-dismiss after 5 seconds
- Types: success (green), info (purple), error (red), achievement (gold)

#### 10. Responsive Breakpoints
- Desktop: full three-panel layout
- Tablet (768px-1024px): describe adaptation
- Mobile (<768px): describe adaptation (this is important — kids use tablets in classrooms)

---

## DOCUMENT 2: Curriculum Outline — `CURRICULUM_OUTLINE.md`

Create this file at the project root. It maps out the full quest progression for the game.

### Required Sections:

#### 1. Level Structure Overview
- Define the total number of levels for v1 (recommend 5 levels)
- Quests per level (recommend 4-6 quests + 1 "Final Boss" project per level)
- Total quest count

#### 2. Level-by-Level Breakdown
For each level, define:
- **Python concepts taught** (mapped to age-appropriate progression for 8-14 year olds)
- **Quest titles and IDs** (using the `id` format from `QUEST_FORMAT_SPEC.md`: `q{level}_{topic}_{name}`)
- **XP rewards per quest** (using the reward tiers from `pdr_cursor_spec.md` Section 5A: Syntax Fix = 10 XP, Logic Quest = 50 XP, Final Boss = 200 XP + Badge)
- **Difficulty rating** (Beginner, Intermediate, or Boss — per `QUEST_FORMAT_SPEC.md` frontmatter)
- **Unlock chain** (which quests unlock which — using the `unlocks` frontmatter field)
- **Narrative hook** (one-line story beat for each quest, fitting "The Script-Kitten Chronicles")

Recommended progression:
- Level 1: `print()`, variables, strings
- Level 2: Conditionals (`if`/`else`), comparisons, booleans
- Level 3: Loops (`for`, `while`), `range()`
- Level 4: Functions, parameters, return values
- Level 5: Lists, basic data structures, Final Boss project

#### 3. Final Boss Projects
- One per level
- These are larger challenges that combine all concepts from the level
- Worth 200 XP + unlock a unique Badge (per `pdr_cursor_spec.md` Section 5A)
- Define the badge name and `requirementSlug` (using format from `DATA_MODEL.md` Section 3)

#### 4. Narrative Arc: "The Script-Kitten Chronicles"
- Brief story synopsis for the overall game
- Per-level story beats (what's happening in the virtual world at each level)
- Character descriptions (the Script-Kitten, the Guardian Robot from the example quest, any recurring NPCs)
- How the narrative appears in quests (via `narrative_text` frontmatter field)

#### 5. Achievement / Badge Definitions
- List all planned badges with:
  - `name`, `description`, `iconSlug`, `requirementSlug` (matching `DATA_MODEL.md` Achievement model)
  - `xpBonus` for earning the badge
- Categories: quest completion, streak, level milestones, speed runs, Boss completion

---

## DOCUMENT 3: User Stories / User Flows — `USER_FLOWS.md`

Create this file at the project root. It defines every user journey through the app.

### Required Sections:

#### 1. Personas
- **New Student (age 10):** First time coding, found the game through a teacher or friend.
- **Returning Student (age 12):** Has completed a few levels, coming back to continue.
- **Teacher / "Guild Master":** Sets up accounts for a class, monitors progress.
- **Content Contributor:** Open-source developer adding new quests via PR.
- **Guest Player:** Wants to try without creating an account (per `auth_spec.md` Section 5).

#### 2. Core User Flows (Step-by-Step)
For each flow, define the exact page sequence, actions, and expected outcomes:

**Flow 1: New User Registration → First Quest**
- Landing page (`/`) → Click "Start Adventure" → `/register` → Fill form → Auto-login → Quest selection (`/quest`) → Click Level 1 Quest 1 → Quest play screen (`/quest/{id}`) → Write code → Run (Pyodide) → See output → Submit → XP toast → Return to quest selection

**Flow 2: Returning User Login → Continue Progress**
- Landing page → Click "Login" → `/login` → Enter credentials → Redirect to quest selection → Completed quests shown as "cleared" → Next available quest highlighted → Continue playing

**Flow 3: Guest Mode Play → Account Creation**
- Landing page → Click "Play as Guest" → Quest selection (localStorage mode) → Complete quests → XP saved locally → Click "Save Progress" → `/register` → Create account → localStorage migrated to database → Continue as authenticated user
- Reference: `auth_spec.md` Section 5 for full Guest Mode spec

**Flow 4: Quest Completion (Detailed)**
- Quest play screen → Read instructions (left panel) → Write code in editor (center panel) → Click "Run" → Pyodide executes → Output in terminal (right panel) → If fail: Glitch Report appears → Fix code → Run again → If pass: "Submit" button enables → Click "Submit" → Server-side verification → Success response → XP toast + progress bar animation → If level up: celebration modal → Return to quest selection or next quest

**Flow 5: Leaderboard Viewing**
- Any page → Click "Leaderboard" in nav → `/leaderboard` (public) → See ranked players → Paginate → Filter by level (optional)

**Flow 6: Content Contributor Adding a Quest**
- Fork repo → Create `content/level_x/quest_xx.md` with YAML frontmatter + instructions + `python starter` block → Create `content/level_x/test_xx.py` with pytest tests using `user_code` fixture → Test locally → Submit PR → Review → Merge
- Reference: `QUEST_FORMAT_SPEC.md` for format, `CONTRIBUTING.md` (future) for PR process

#### 3. Error / Edge Case Flows
- User submits empty code → Glitch Report: "No code detected"
- User submits code that crashes (infinite loop, syntax error) → Pyodide timeout → friendly error
- User tries to access `/profile` as guest → Redirect to `/register` with "Save your progress" message
- User tries to re-submit already-completed quest → Server returns existing XP (no double-farming per `API_SPECIFICATION.md` Section 4)
- Session expires mid-quest → Middleware redirects to `/login` → After re-login, return to quest

---

## DOCUMENT 4: Error Handling & Glitch Report Format — `GLITCH_REPORT_SPEC.md`

Create this file at the project root. This is the spec for how errors are displayed to kids.

### Required Sections:

#### 1. Design Philosophy
- Errors are "Glitches in the Matrix," not failures
- The tone is always encouraging (per `pdr_cursor_spec.md` Section 9)
- Never show raw Python tracebacks directly — always wrap in kid-friendly language
- The Glitch Report is the primary learning tool — it should guide, not punish

#### 2. Glitch Report Component Structure
Define the UI component that appears in the terminal panel when code fails:
- **Icon:** A themed icon (bug, glitch, warning — fits the cyber RPG aesthetic)
- **Title:** "Glitch Detected!" (never "Error" or "Wrong")
- **Type Badge:** Shows the error category (SyntaxGlitch, LogicGlitch, RuntimeGlitch — mapped from Python error types)
- **Hint Message:** The kid-friendly explanation (from the test assertion message in `test_x.py` — see `QUEST_FORMAT_SPEC.md` Section 3)
- **Code Highlight:** If possible, highlight the line where the issue is
- **Retry Prompt:** Encouraging call-to-action ("Adjust your spell and try again!")

#### 3. Error Type Mapping
Map standard Python errors to kid-friendly categories and default messages:

| Python Error | Glitch Category | Default Kid-Friendly Message |
|:---|:---|:---|
| `SyntaxError` | SyntaxGlitch | "Your spell has a typo! Check for missing colons, brackets, or quotes." |
| `NameError` | SyntaxGlitch | "The system doesn't recognize that word. Did you spell your variable name correctly?" |
| `TypeError` | LogicGlitch | "You're mixing up types! Make sure you're using the right kind of data." |
| `IndexError` | LogicGlitch | "You tried to reach something that doesn't exist! Check your list positions." |
| `ValueError` | LogicGlitch | "The value doesn't look right. Double-check what you're passing in." |
| `ZeroDivisionError` | RuntimeGlitch | "Dividing by zero creates a black hole! Make sure your divisor isn't zero." |
| `IndentationError` | SyntaxGlitch | "Your code alignment is off. Python is picky about spaces!" |
| `AttributeError` | LogicGlitch | "That object doesn't have that ability. Check your method names." |
| `RecursionError` | RuntimeGlitch | "Infinite loop detected! Your spell is casting itself forever." |
| `TimeoutError` (Pyodide) | RuntimeGlitch | "Your code took too long! It might be stuck in a loop." |
| Assertion failure (from test) | QuestGlitch | *(Use the assertion message from the test file directly)* |

#### 4. Hint Escalation System
Define whether hints get more specific on repeated attempts:

- **Attempt 1:** Show the Glitch Report with the error type + default message.
- **Attempt 2:** Same as Attempt 1 (no change — let the kid try again).
- **Attempt 3:** Show an additional "Hint" section below the Glitch Report with a more specific clue derived from the test assertion message.
- **Attempt 5+:** Show a "Need Help?" button that reveals a partial solution or pseudocode.

Track attempt count via `attemptsCount` field in the `QuestAttempt` model (see `DATA_MODEL.md`).

#### 5. Success Feedback Format
When code passes (per `API_SPECIFICATION.md` Section 3 success response):
- **Icon:** Checkmark, star, or trophy (themed)
- **Title:** "Quest Complete!" or the `feedback` string from the API response
- **XP Animation:** Show `xp_earned` with animated counter
- **Badge Toast:** If `unlocked_badges` is non-empty, show badge notification
- **Level-Up:** If `level_up: true`, trigger the Level-Up celebration modal (see `UI_COMPONENT_MAP.md`)
- **Next Action:** Button to proceed to next quest or return to quest selection

#### 6. Guest Mode Error Handling
- Guest Mode users only get client-side (Pyodide) grading — no server round-trip
- Glitch Reports work identically for guests
- Success feedback shows XP earned but notes "Progress saved locally" instead of server confirmation
- Reference: `auth_spec.md` Section 5, `pdr_cursor_spec.md` Section 5B

---

## AFTER ALL 4 DOCUMENTS ARE CREATED

1. Update `@pre_dev_checklist.md` — mark all 4 Medium Priority items as `[x]` complete with file references.
2. Update `@roadmap.md` — change the Documentation Checkpoint status items from "Pending" to "Done".
3. Report back with a summary of what was created and any decisions you made where the specs were silent.
```
