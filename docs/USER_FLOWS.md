# User Stories & User Flows: Code Quest Python

> Defines every user journey through the application with exact page sequences, actions, and expected outcomes.
> Routes and access levels reference `auth_spec.md` Section 4.
> API interactions reference `API_SPECIFICATION.md` Sections 2–3.

---

## 1. Personas

### Persona 1: New Student — "Maya" (Age 10)

- **Background:** Fifth grader who has never written code. Found Code Quest through her teacher who set it up for the class.
- **Goals:** Learn what coding is, have fun, earn badges to show friends.
- **Behavior:** Explores everything, reads instructions carefully, gets frustrated if stuck for more than 2 minutes. Needs clear visual feedback and encouragement.
- **Devices:** School-issued Chromebook (1366x768) or shared iPad in the classroom.
- **Access:** Authenticated user — teacher created her account.

### Persona 2: Returning Student — "Kai" (Age 12)

- **Background:** Has completed Levels 1–2 over the past two weeks. Enjoys the RPG narrative and is competitive about the leaderboard.
- **Goals:** Finish Level 3, beat friends on the leaderboard, earn streak badges.
- **Behavior:** Skips reading instructions when confident, runs code frequently, checks leaderboard after each session.
- **Devices:** Personal laptop (1920x1080) or family tablet.
- **Access:** Authenticated user with existing progress.

### Persona 3: Teacher / "Guild Master" — "Ms. Torres"

- **Background:** Middle school computer science teacher running Code Quest as a classroom activity.
- **Goals:** Set up student accounts, monitor class progress, identify students who are stuck.
- **Behavior:** Creates accounts in batches, checks the leaderboard to see class rankings, reviews individual student profiles to see quest history and code submissions.
- **Devices:** Classroom desktop or personal laptop.
- **Access:** Authenticated user (teacher accounts are standard user accounts in v1 — admin features are post-MVP).

### Persona 4: Content Contributor — "Alex"

- **Background:** Open-source developer and Python enthusiast who wants to contribute new quests.
- **Goals:** Add a new quest to Level 3, ensure it follows the format spec, get it merged via PR.
- **Behavior:** Reads `QUEST_FORMAT_SPEC.md`, creates `.md` and `.py` test files, tests locally, submits a pull request.
- **Devices:** Development laptop with local dev environment.
- **Access:** GitHub contributor — no in-app account needed for contribution workflow.

### Persona 5: Guest Player — "Jordan" (Age 9)

- **Background:** Found Code Quest through a link shared by a friend. Wants to try it immediately without creating an account.
- **Goals:** Try a few quests, see if coding is fun, maybe create an account later.
- **Behavior:** Clicks "Play as Guest" immediately, dislikes forms and signup flows, will leave if there's too much friction.
- **Devices:** Parent's tablet or phone.
- **Access:** Guest Mode — `localStorage`-based progress (per `auth_spec.md` Section 5).

---

## 2. Core User Flows

### Flow 1: New User Registration to First Quest

**Persona:** Maya (New Student)
**Goal:** Create an account and complete the first quest.

| Step | Action | Page / Route | System Response |
|:---|:---|:---|:---|
| 1 | Opens the app | `/` (Landing page — Public) | Landing page loads with "Start Adventure" CTA and "Play as Guest" link |
| 2 | Clicks "Start Adventure" | Redirects to `/register` | Registration form renders with username, email (optional), password fields |
| 3 | Fills in username + password, clicks "Create Account" | `POST /api/auth/register` | Server creates `User` record with `xp: 0, level: 1` (per `auth_spec.md` Section 3). Auto-login via NextAuth. |
| 4 | Auto-redirected after login | `/quest` (Quest Selection — Protected) | Quest selection page loads. Level 1 quests visible. `q1_variables_password` is available (no prerequisites). All other quests show lock status based on `unlocks` chain. |
| 5 | Clicks "The Guardian's Password" quest card | `/quest/q1_variables_password` | Three-panel Quest Play screen loads (per `UI_COMPONENT_MAP.md` Section 4). Left: instructions + narrative callout. Center: Monaco editor with `python starter` code. Right: empty terminal. |
| 6 | Reads instructions in left panel | — | Student reads the narrative and mission text |
| 7 | Types code in the editor: `password = "CodeQuest2026"` | — | Code appears in Monaco editor |
| 8 | Clicks "Run" button | Pyodide executes client-side | Pyodide runs the code + subset of tests from `test_01.py`. Terminal (right panel) shows `stdout`. If tests pass: "Submit" button becomes enabled. |
| 9 | Clicks "Submit" button | `POST /api/v1/quests/{id}/submit` | Server re-verifies code (per `pdr_cursor_spec.md` Section 5B). On success, Reward Logic runs in a transaction: XP awarded, level check, badge scan. |
| 10 | Sees success feedback | Toast notification + terminal | Success toast: "+10 XP Earned!" (per `API_SPECIFICATION.md` Section 3). XP bar animates. If `level_up: true`, Level-Up modal appears (per `UI_COMPONENT_MAP.md` Section 7). |
| 11 | Returns to quest selection | `/quest` | `q1_variables_password` now shows as "Cleared". `q1_print_beacon` is now available (unlocked). |

---

### Flow 2: Returning User Login to Continue Progress

**Persona:** Kai (Returning Student)
**Goal:** Log in and continue from where they left off.

| Step | Action | Page / Route | System Response |
|:---|:---|:---|:---|
| 1 | Opens the app | `/` (Landing page) | Landing page with "Login" and "Start Adventure" buttons |
| 2 | Clicks "Login" | `/login` (Public) | Login form renders with username/password fields |
| 3 | Enters credentials, clicks "Enter the Code" | `POST /api/auth/signin` | NextAuth validates credentials, creates JWT session cookie |
| 4 | Auto-redirected after login | `/quest` (Quest Selection) | Quest selection loads. Completed quests shown as "Cleared" (green check, reduced opacity). Next available quest is highlighted with a subtle glow. |
| 5 | Clicks the next available quest | `/quest/{id}` | Quest Play screen loads with fresh editor |
| 6 | Completes the quest (Run → Submit) | Standard quest completion flow | XP toast, progress bar update, badge check |
| 7 | Checks leaderboard | `/leaderboard` (Public) | Leaderboard table loads. Kai's row is highlighted. Rank reflects new XP total. |

---

### Flow 3: Guest Mode Play to Account Creation

**Persona:** Jordan (Guest Player)
**Reference:** `auth_spec.md` Section 5

| Step | Action | Page / Route | System Response |
|:---|:---|:---|:---|
| 1 | Opens the app | `/` (Landing page) | Landing page with "Play as Guest" link |
| 2 | Clicks "Play as Guest" | `/quest` (Quest Selection) | App creates a `localStorage` guest profile: `{ guest_id: UUID, xp: 0, current_level: 1, quests_completed: [] }`. Quest selection loads in guest mode. Nav bar shows "Guest" label + "Save Progress" button instead of profile info. |
| 3 | Selects and completes quests | `/quest/{id}` | **Client-side grading only** (Pyodide Phase 1 — no server round-trip). XP calculated and stored in `localStorage`. Terminal shows Glitch Reports or success feedback identical to authenticated mode. |
| 4 | Sees XP accumulate | Toast notifications | Success toast shows "+10 XP Earned!" with note: "Progress saved locally." |
| 5 | Tries to access profile | Clicks profile link | Redirected to `/register` with message: "Create an account to save your progress and see your full profile!" (per `auth_spec.md` Section 4–5) |
| 6 | Clicks "Save Progress" in nav bar | `/register` | Registration form loads with a banner: "Your guest progress ({xp} XP, {n} quests) will be saved to your new account!" |
| 7 | Fills in form, creates account | `POST /api/auth/register` | Server creates `User` record. On first authenticated session, the app detects `localStorage` guest data. Guest progress (XP, completed quests) is written to the database. `localStorage` guest data is cleared. |
| 8 | Continues as authenticated user | `/quest` | All previously completed quests show as "Cleared". XP and level reflect migrated progress. User now appears on leaderboard. |

**Guest Mode Limitations:**
- No leaderboard appearance (per `auth_spec.md` Section 5)
- No `/profile` access
- Progress is device-specific and lost if browser data is cleared
- No server-side re-verification — relies entirely on Pyodide client-side grading

---

### Flow 4: Quest Completion (Detailed)

**Persona:** Any authenticated user
**Reference:** `pdr_cursor_spec.md` Section 5B, `API_SPECIFICATION.md` Section 3, `GLITCH_REPORT_SPEC.md`

| Step | Action | System Response |
|:---|:---|:---|
| 1 | User is on the Quest Play screen (`/quest/{id}`) | Three-panel layout loaded. Instructions (left), editor with starter code (center), empty terminal (right). |
| 2 | Reads instructions and narrative in the left panel | — |
| 3 | Writes or modifies code in the Monaco editor (center panel) | — |
| 4 | Clicks **"Run"** button | **Phase 1 (Client-Side):** Pyodide executes the student's code in the browser WASM sandbox. Tests from `test_x.py` run against the code via the `user_code` fixture (`QUEST_FORMAT_SPEC.md` Section 3). |
| 5a | **If tests fail:** | Terminal (right panel) displays a **Glitch Report** (per `GLITCH_REPORT_SPEC.md`): error category, kid-friendly message, hint, retry prompt. "Submit" button remains disabled. |
| 5b | Student fixes code and clicks "Run" again | Repeat from Step 4. `attemptsCount` increments. Hint escalation triggers at attempts 3 and 5+ (per `GLITCH_REPORT_SPEC.md` Section 4). |
| 6 | **If tests pass:** | Terminal shows pass confirmation. **"Submit" button becomes enabled** (purple glow appears). |
| 7 | Clicks **"Submit"** button | **Phase 2 (Server-Side):** Code sent to `POST /api/v1/quests/{id}/submit`. FastAPI re-verifies against the full test suite in a sandboxed environment. |
| 8a | **Server verification passes:** | Reward Logic executes in a database transaction: (1) Check for duplicate submission → (2) Award XP → (3) Check level-up → (4) Scan for badge unlocks. Response: `{ status: "success", xp_earned, level_up, new_level, unlocked_badges, feedback }` |
| 8b | **Server verification fails:** | Response: `{ status: "fail", error_type, hint, traceback }`. Glitch Report displayed in terminal. (This is rare if client-side and server-side runners are consistent.) |
| 9 | Success feedback renders | **XP toast:** "+{xp_earned} XP Earned!" with quest title. **XP bar:** Animated fill increase. **Badges:** If `unlocked_badges` is non-empty, achievement toasts appear. |
| 10 | **If `level_up: true`:** | **Level-Up Celebration Modal** appears (per `UI_COMPONENT_MAP.md` Section 7): confetti, new level display, congratulatory message, any unlocked badges. |
| 11 | User dismisses modal or clicks "Continue Adventure" | Navigates to `/quest`. Completed quest shows as "Cleared". Next unlocked quest is highlighted. |

---

### Flow 5: Leaderboard Viewing

**Persona:** Any user (public route)
**Reference:** `auth_spec.md` Section 4, `API_SPECIFICATION.md` Section 2

| Step | Action | Page / Route | System Response |
|:---|:---|:---|:---|
| 1 | Clicks "Leaderboard" in navigation | `/leaderboard` (Public) | Page loads. `GET /api/v1/leaderboard` fetches first page of ranked players (default 25 per page). |
| 2 | Views ranked players | — | Table displays: rank, avatar, username, level badge, total XP (per `UI_COMPONENT_MAP.md` Section 6). Top 3 have medal icons. |
| 3 | If authenticated: sees own row highlighted | — | Current user's row has a purple left border highlight. If not in top 25, a "Your rank: #{n}" indicator appears above the table. |
| 4 | Scrolls to bottom, clicks "Load More" | `GET /api/v1/leaderboard?page=2` | Next 25 players appended to the table. |
| 5 | (Optional) Filters by level | Selects level from dropdown | Table re-fetches with level filter parameter. |

**Guest Mode:** Leaderboard is viewable but the guest's own rank is not shown (guests are not on the leaderboard — per `auth_spec.md` Section 5). A motivational banner appears: "Create an account to join the leaderboard!"

---

### Flow 6: Content Contributor Adding a Quest

**Persona:** Alex (Content Contributor)
**Reference:** `QUEST_FORMAT_SPEC.md` Sections 1–4

| Step | Action | Details |
|:---|:---|:---|
| 1 | Forks the repository on GitHub | Standard GitHub fork workflow |
| 2 | Clones the fork locally | `git clone` + `npm install` + set up `.env` from `.env.example` |
| 3 | Creates the quest Markdown file | File: `content/level_{x}/quest_{xx}.md`. Includes YAML frontmatter with all required fields (`id`, `title`, `level`, `xp_reward`, `difficulty`, `narrative_text`, `tags`, `unlocks`) + Markdown body with instructions + `` ```python starter `` block. |
| 4 | Creates the test file | File: `content/level_{x}/test_{xx}.py`. Pytest functions using the `user_code` fixture. Tests check `user_code.namespace`, `user_code.stdout`, and/or `user_code.source`. Assertion messages use kid-friendly "Glitch" language. |
| 5 | Tests locally | Runs the dev server (`npm run dev`), navigates to the new quest, writes the expected solution, clicks "Run" to verify Pyodide grading works. |
| 6 | Commits and pushes to fork | Standard Git commit workflow |
| 7 | Opens a Pull Request | PR description explains the quest, its learning objectives, its position in the unlock chain, and any narrative context. |
| 8 | PR review and merge | Maintainers review for format compliance, test quality, age-appropriateness, and narrative consistency. On merge, the quest becomes available in the app. |

---

## 3. Error / Edge Case Flows

### Empty Code Submission

| Trigger | Response |
|:---|:---|
| User clicks "Run" with an empty or whitespace-only editor | Pyodide detects no executable code. Terminal shows Glitch Report: **"No Code Detected"** — "Your spell is blank! Write some Python code in the editor, then try again." "Run" proceeds but tests fail immediately. "Submit" remains disabled. |

### Infinite Loop / Long-Running Code

| Trigger | Response |
|:---|:---|
| User's code enters an infinite loop (`while True: pass`) | Pyodide execution has a timeout limit (10 seconds — per `API_SPECIFICATION.md` Section 5). On timeout, execution is killed. Terminal shows Glitch Report: **RuntimeGlitch** — "Your code took too long! It might be stuck in a loop. Check your `while` condition." |

### Syntax Error in Student Code

| Trigger | Response |
|:---|:---|
| User's code has a Python syntax error (missing colon, unmatched quote, etc.) | Pyodide catches `SyntaxError` before tests even run. Terminal shows Glitch Report: **SyntaxGlitch** — kid-friendly message mapped from error type (see `GLITCH_REPORT_SPEC.md` Section 3). Code line is highlighted if possible. |

### Guest Accessing `/profile`

| Trigger | Response |
|:---|:---|
| Guest Mode user clicks "Profile" or navigates to `/profile` | Middleware detects no authenticated session (per `auth_spec.md` Section 4). User is redirected to `/register` with a message: "Create an account to save your progress and view your profile!" Guest `localStorage` XP/progress data is preserved. |

### Re-Submitting a Completed Quest

| Trigger | Response |
|:---|:---|
| Authenticated user opens and re-submits a quest they already completed | Server detects existing `QuestAttempt` record where `isCompleted: true` (per `API_SPECIFICATION.md` Section 4). Response returns the original XP earned with `xp_earned: 0` (no double-farming). Toast: "You've already cleared this quest! No additional XP awarded." The `codeSubmitted` field is updated with the new code for portfolio purposes. |

### Session Expires Mid-Quest

| Trigger | Response |
|:---|:---|
| User's JWT session expires while on the Quest Play screen | On next API call (e.g., clicking "Submit"), the server returns `401 Unauthorized`. Middleware redirects to `/login`. After successful re-login, user is returned to the quest they were working on. **Unsaved code in the editor is lost** — a future enhancement could auto-save to `localStorage`. |

### Network Error During Submission

| Trigger | Response |
|:---|:---|
| "Submit" is clicked but the server is unreachable (network down, server error) | Fetch call fails or returns `500`. Error toast: "Connection lost! Your code is safe — try submitting again in a moment." "Submit" button re-enables for retry. The student's code remains in the editor. |

### Maintenance Mode Active

| Trigger | Response |
|:---|:---|
| `NEXT_PUBLIC_MAINTENANCE_MODE=true` in environment (per `ENV_SPECIFICATION.md` Section 5) | All pages show a maintenance overlay: "Code Quest is undergoing maintenance. We'll be back soon!" Quest submissions are disabled. Leaderboard and landing page remain viewable in read-only mode. |
