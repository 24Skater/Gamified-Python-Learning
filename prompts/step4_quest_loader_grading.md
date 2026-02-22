# MVP Step 4 Prompt: Quest Loader + Grading (The Core Loop)

> Copy everything below the line into a new Cursor chat in Agent mode.

---

```
You are executing MVP Step 4: "Quest Loader + Grading (The Core Loop)" for the Code Quest Python project.

Steps 1-3 are complete: monorepo scaffolded, database migrated, auth working, Pyodide integrated with Monaco editor and terminal. The quest play screen exists at `/quest/[id]` with three-panel layout, "Run" button wired to Pyodide, and GlitchReport component built.

This step connects real quest content to the engine — loading quests from Markdown files, parsing them, displaying instructions, pre-loading starter code, running tests client-side, and submitting to FastAPI for server-side verification.

## RULES — READ BEFORE DOING ANYTHING

1. **No assumptions.** Every decision must be grounded in the specification documents listed below. If a spec doesn't cover something, use widely-accepted best practices — and cite which best practice you're following.
2. **No skipping steps.** Complete every task in order. Do not move to the next task until the current one is verified working.
3. **No scope creep.** This is ONLY Step 4 (Quest loading + grading). Do NOT build XP awards, level-up logic, leaderboard, achievements, profile page, or any gamification UI. Those are Step 5+.
4. **Follow the Quest Format Spec exactly.** All quest files must match `QUEST_FORMAT_SPEC.md` — frontmatter fields, `python starter` fence, test file structure with `user_code` fixture.
5. **Follow the UI Component Map.** Quest play screen layout, quest selection screen, and all component styling must match `UI_COMPONENT_MAP.md`.
6. **Follow the Glitch Report Spec.** Error display must match `GLITCH_REPORT_SPEC.md` — error type mapping, component structure, hint escalation.
7. **Follow the API Spec for submit endpoint.** Request/response shapes for `POST /quests/{id}/submit` must match `API_SPECIFICATION.md` Section 3 exactly.
8. **Keep working.** After each task, immediately proceed to the next. Do not stop to ask for confirmation between tasks. Only stop if you encounter an error you cannot resolve.
9. **No provider-specific Prisma attributes.** Use plain `String` for all text fields per `pdr_cursor_spec.md` Section 9.
10. **Inter-service auth.** All Next.js → FastAPI calls must include the `X-Internal-Key` header per `API_SPECIFICATION.md` Section 1 and `pdr_cursor_spec.md` Section 8. Read `INTERNAL_API_KEY` from env.

## SPECIFICATION DOCUMENTS (Your single source of truth)

Read ALL of these before writing any code:

- `@QUEST_FORMAT_SPEC.md` — THE PRIMARY REFERENCE. Read the entire file:
  - Section 1: YAML frontmatter fields (id, title, level, xp_reward, difficulty, narrative_text, tags, unlocks)
  - Section 2: `python starter` code fence convention
  - Section 3: Test suite structure + `user_code` fixture (namespace, stdout, source)
  - Section 4: Complete example — "The Guardian's Password" (quest_01.md + test_01.py)
  - Section 5: Technical implementation steps (gray-matter parsing, starter block injection, hybrid grading)
- `@pdr_cursor_spec.md` — Section 5B (Hybrid Grading — both Phase 1 client-side AND Phase 2 server-side), Section 8 (Inter-Service Architecture — X-Internal-Key, BACKEND_SECRET_KEY), Section 9 (Cursor AI rules).
- `@API_SPECIFICATION.md` — Section 2 (`GET /quests`, `GET /quests/{id}`, `POST /quests/{id}/submit`), Section 3 (submit request body, success response, failure response JSON shapes), Section 4 (Reward Logic — but do NOT implement XP/level logic yet, just return the response shape), Section 5 (rate limiting, input sanitization, inter-service auth).
- `@GLITCH_REPORT_SPEC.md` — Section 2 (component structure), Section 3 (Python error type → kid-friendly mapping table), Section 4 (hint escalation: attempt 1 vs 3 vs 5+), Section 5 (success feedback format).
- `@UI_COMPONENT_MAP.md` — Section 3 (Quest Selection / Level Map screen), Section 4 (Quest Play Screen — left panel instructions rendering), Section 8 (XP Progress Bar — placeholder only for this step).
- `@CURRICULUM_OUTLINE.md` — Section 2 Level 1 quest definitions. Use these to create the actual content files.
- `@DATA_MODEL.md` — Section 1 (QuestAttempt model — `questSlug`, `codeSubmitted`, `isCompleted`, `attemptsCount`).
- `@ENV_SPECIFICATION.md` — Section 4 (BACKEND_API_URL, INTERNAL_API_KEY), Section 6 (BACKEND_SECRET_KEY, CORS_ORIGINS).
- `@USER_FLOWS.md` — Flow 4 (Quest Completion detailed flow) for the exact UX sequence.

## TASK CHECKLIST (Execute in this exact order)

### Task 1: Create Quest Content Files
- Create the `/content/level_1/` directory with actual quest files from `CURRICULUM_OUTLINE.md` Level 1.
- At minimum, create these 2 quests (enough to test the full flow):
  - `content/level_1/quest_01.md` + `content/level_1/test_01.py` — "The Guardian's Password" (copy EXACTLY from `QUEST_FORMAT_SPEC.md` Section 4)
  - `content/level_1/quest_02.md` + `content/level_1/test_02.py` — A second quest from `CURRICULUM_OUTLINE.md` Level 1 (e.g., the `print()` quest or the next quest in the unlock chain). Write the quest content and test file following the format spec.
- Both quest `.md` files must have valid YAML frontmatter with all 8 required fields.
- Both test files must use the `user_code` fixture pattern from `QUEST_FORMAT_SPEC.md` Section 3.

### Task 2: Build the Quest Content Parser
- Create `apps/web/lib/questParser.ts` (or similar utility in the `lib/` directory).
- Install `gray-matter` in `apps/web/` for YAML frontmatter extraction.
- The parser must:
  1. Read a quest `.md` file from the filesystem (server-side only, via `fs`).
  2. Extract YAML frontmatter into a typed `QuestMeta` interface (matching all 8 fields from `QUEST_FORMAT_SPEC.md` Section 1).
  3. Extract the Markdown body (instructions).
  4. Extract the `python starter` code block separately (parse for `` ```python starter `` fence — per `QUEST_FORMAT_SPEC.md` Section 2). Return it as a separate `starterCode` string.
  5. Return `{ meta: QuestMeta, instructions: string, starterCode: string }`.
- Create a `getAllQuests()` function that scans `/content/level_*/quest_*.md` and returns an array of `QuestMeta` objects (for the quest selection screen).
- Create a `getQuestById(id: string)` function that finds and parses the quest with the matching frontmatter `id`.

### Task 3: Build the Quest Selection Screen
- Create `apps/web/app/quest/page.tsx` (the `/quest` route — quest listing).
- Per `UI_COMPONENT_MAP.md` Section 3:
  - Display all available quests grouped by level.
  - Each quest renders as a Quest Card showing: title, difficulty badge, xp_reward, tags.
  - Cards link to `/quest/{id}` (the quest play screen).
  - Visual indicators: available quests are clickable with neon border, locked quests are dimmed (based on `unlocks` chain — for MVP, show all quests as available).
- This is a protected route (middleware from Step 2 handles auth).
- Use the `getAllQuests()` function from the parser.

### Task 4: Wire Quest Content to the Play Screen
- Update `apps/web/app/quest/[id]/page.tsx` to load real quest data:
  - Use `getQuestById(params.id)` to load the quest (server-side).
  - **Left panel:** Render the `instructions` Markdown as HTML (use `react-markdown` or a similar library — install it). Style the rendered Markdown to match the dark theme.
  - **Center panel:** Pass `starterCode` to the `CodeEditor` component as `initialCode`.
  - **Top bar:** Display the quest `title`, `difficulty` badge (color per UI Component Map), and `xp_reward`.
- The "Run" button continues to work as built in Step 3 (Pyodide executes the code, terminal shows output).

### Task 5: Build the Client-Side Test Runner (Pyodide)
- This is the core of Phase 1 grading per `pdr_cursor_spec.md` Section 5B.
- Create `apps/web/lib/testRunner.ts` (or extend the `usePyodide` hook).
- The client-side test runner must:
  1. Take the student's code and the test file content (read from `/content/level_x/test_xx.py`).
  2. Execute the student's code in Pyodide to capture the `namespace` (all defined variables/functions) and `stdout`.
  3. Construct the `user_code` fixture object: `{ namespace, stdout, source }` — matching `QUEST_FORMAT_SPEC.md` Section 3.
  4. Run each test function from the test file against the `user_code` fixture.
  5. Return results: `{ passed: boolean, results: Array<{ testName: string, passed: boolean, message?: string }> }`.
- On failure: extract the assertion message and error type, then pass them to the `GlitchReport` component.
- On success: show a success message in the terminal and **enable the "Submit" button**.
- Wire the error type mapping from `GLITCH_REPORT_SPEC.md` Section 3 into the GlitchReport component (the component shell exists from Step 3 — now populate it with real data).

### Task 6: Build the Server-Side Grading Endpoint (FastAPI)
- In `apps/api/`, create the `POST /api/v1/quests/{id}/submit` endpoint.
- Per `API_SPECIFICATION.md` Section 3:
  - Request body: `{ quest_id: string, code: string, language_version: string }`
  - Validate the `X-Internal-Key` header matches `INTERNAL_API_KEY` env var. Return `403` if missing/invalid.
  - Load the test file for the given quest from `/content/`.
  - Execute the student's code in a sandboxed Python environment (use `exec()` with a restricted `globals` dict, or a subprocess with timeout).
  - Run the tests against the executed code.
  - **If tests pass:** Return the success response shape from `API_SPECIFICATION.md` Section 3. For now, return `xp_earned` from the quest frontmatter's `xp_reward`, `level_up: false`, `new_level: null`, `unlocked_badges: []`. (Actual XP/level logic is Step 5.)
  - **If tests fail:** Return the failure response shape with `error_type`, `hint` (from assertion message), and `traceback`.
- Apply rate limiting: max 5 submissions per minute per user (per `API_SPECIFICATION.md` Section 5).
- Apply input sanitization: max 10KB code size, max 10 seconds execution time.

### Task 7: Wire the "Submit" Button
- In the quest play screen, the "Submit" button (currently disabled) should:
  1. Only be enabled after client-side tests pass.
  2. On click: send the code to `POST /api/v1/quests/{id}/submit` via the Next.js API proxy (Next.js adds the `X-Internal-Key` header — the browser never sees it).
  3. Show a loading state while waiting for the server response.
  4. On server success: display the success feedback per `GLITCH_REPORT_SPEC.md` Section 5 (checkmark icon, "Quest Complete!" title, XP earned).
  5. On server failure: display the server's Glitch Report (this is the "re-verification caught a cheat" case — rare but possible).
- Create the Next.js API proxy route (`apps/web/app/api/quests/[id]/submit/route.ts`) that:
  - Reads the user's session (JWT cookie).
  - Forwards the request to FastAPI at `BACKEND_API_URL` with `X-Internal-Key` header and user identity.
  - Returns the FastAPI response to the browser.

### Task 8: Verify TDD Gate
- Start the dev servers (`npm run dev`).
- Log in with a test account.
- Navigate to `/quest` — verify quest selection screen shows at least 2 quests.
- Click "The Guardian's Password" quest.
- Verify: left panel shows instructions, editor has starter code pre-loaded.
- Type: `password = "CodeQuest2026"`
- Click "Run" — verify: terminal shows pass, "Submit" button becomes enabled.
- Click "Submit" — verify: server returns success response, "Quest Complete!" feedback displays.
- Go back, try with wrong code: `password = "wrong"`
- Click "Run" — verify: GlitchReport displays with the assertion message from the test file.
- Verify: "Submit" button remains disabled when client-side tests fail.
- If any test fails, fix the issue before proceeding.

### Task 9: Commit
- Stage all new and modified files.
- Commit with message: "feat: add quest content loading, client-side Pyodide grading, server-side re-verification, and quest selection screen"
- Do NOT push to any remote.

## WHAT IS EXPLICITLY OUT OF SCOPE FOR STEP 4

Do NOT build any of these — they belong to later steps:
- Actual XP calculation / writing XP to the database (Step 5 — the submit endpoint returns `xp_earned` but does NOT write it to the DB yet)
- Level-up detection / Reward Logic transaction (Step 5)
- XP progress bar with real data (Step 5)
- Level-Up celebration modal (Step 5)
- Achievement / badge awarding (Step 5+)
- Leaderboard (Post-MVP)
- Profile page (Post-MVP)
- Guest Mode (Post-MVP)
- Quest unlock chain enforcement (Post-MVP — for MVP, all quests are accessible)
- Hint escalation tracking by attempt count (Post-MVP — build the UI but don't persist attempt count yet)

## WHEN YOU ARE DONE

Report back with:
1. Confirmation that quest content files exist in `/content/level_1/` with valid frontmatter.
2. Confirmation that the quest selection screen lists quests from the content files.
3. Confirmation that quest play screen loads instructions, starter code, and test suite.
4. Confirmation that "Run" executes tests client-side with correct pass/fail feedback.
5. Confirmation that "Submit" sends code to FastAPI and returns success/failure.
6. Confirmation that GlitchReport renders with mapped error types from the spec.
7. Any deviations from the spec and why they were necessary.
```
