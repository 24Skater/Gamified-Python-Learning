# Pre-Development Checklist

> Track what documentation, decisions, and fixes are needed before writing code.
> Mark items as they are completed: `[ ]` → `[x]`

---

## CRITICAL — Audit Fixes (Must Resolve Before First Commit)

> Identified during the architecture/security audit. These fix contradictions,
> missing pieces, and security gaps across the existing specs.

- [x] **Resolve grading architecture (client vs. server)** — `pdr_cursor_spec.md`
  - ~~PDR, API Spec, and Quest Format Spec contradicted each other~~ → Hybrid grading: Pyodide for instant client-side feedback, FastAPI re-verification before awarding XP. PDR Section 5B rewritten.

- [x] **Add NextAuth required models to Prisma schema** — `DATA_MODEL.md`
  - ~~Missing `Account`, `Session`, `VerificationToken`~~ → Added all 3 models + `accounts`/`sessions`/`emailVerified` on `User`.

- [x] **Resolve auth strategy contradiction (Sessions vs. JWT)** — `auth_spec.md`, `API_SPECIFICATION.md`, `adr.md`
  - ~~`auth_spec.md` said "Database sessions (not JWT)"~~ → Changed to "JWT session strategy" with explanation of Credentials provider requirement.
  - ~~`API_SPECIFICATION.md` said "Bearer Token (JWT)"~~ → Replaced with accurate proxy pattern (httpOnly cookie → `X-Internal-Key` + signed payload).
  - ~~`adr.md` ADR 008 said "Database Session strategy"~~ → Corrected to "JWT session strategy."

- [x] **Create `.gitignore`** — `.gitignore`
  - ~~No `.gitignore` existed~~ → Created with exclusions for `.env`, `node_modules/`, `*.db`, `__pycache__/`, `.next/`, `dist/`, `.turbo/`, IDE files, OS files.

- [x] **Fix `@db.Text` for SQLite compatibility** — `DATA_MODEL.md`
  - ~~`@db.Text` on `codeSubmitted` broke SQLite~~ → Replaced with plain `String` on all text fields. Added schema comment about avoiding provider-specific attributes.

- [x] **Define monorepo tooling** — `pdr_cursor_spec.md` (done)
  - ~~PDR updated~~ → Turborepo with npm workspaces.
  - Actual `turbo.json` and root `package.json` will be created during MVP Step 1 scaffold.

- [x] **Add inter-service auth (Next.js ↔ FastAPI)** — `ENV_SPECIFICATION.md`, `.env.example`, `API_SPECIFICATION.md`
  - ~~No inter-service auth defined~~ → Added `INTERNAL_API_KEY` to env spec and `.env.example`. API spec updated with `X-Internal-Key` header requirement and `403` rejection rule.

- [x] **Wrap Reward Logic in a database transaction** — `API_SPECIFICATION.md`
  - ~~Reward Logic had no transaction guard~~ → Section 4 now mandates `Prisma.$transaction()` with rollback on failure.

- [x] **Fix env var naming inconsistency** — `auth_spec.md`
  - ~~`ENABLE_CREDENTIALS` in auth spec vs. `ENABLE_CREDENTIALS_AUTH` in .env.example~~ → Standardized to `ENABLE_CREDENTIALS_AUTH` everywhere (table + env block).

- [x] **Align PDR Section 6 table names with Prisma models** — `pdr_cursor_spec.md`
  - ~~`profiles`/`quests_completed`/`achievements`~~ → `User`, `QuestAttempt`, `Achievement`, `UserAchievement` + NextAuth models.

---

## High Priority — Spec Documents (All Complete)

- [x] **Authentication Strategy (ADR 008)** — `adr.md` + `auth_spec.md`
  - ~~Auth provider choice~~ → NextAuth.js with pluggable providers via `.env`
  - ~~Session management approach~~ → JWT strategy (required for Credentials provider)
  - ~~Whether anonymous/guest play is supported~~ → Yes, Guest Mode via `localStorage` with account migration

- [x] **API Specification (Endpoints)** — `API_SPECIFICATION.md`
  - ~~Full route map for FastAPI backend~~ → 9 endpoints across Users, Quests, Achievements
  - ~~Request/response shapes and status codes~~ → JSON schemas for submit request, success, and failure responses
  - ~~Error response format~~ → Standardized `{ error, message }` body with HTTP status codes

- [x] **Quest Content Format Specification** — `QUEST_FORMAT_SPEC.md`
  - ~~Required frontmatter fields~~ → 8 YAML fields defined (`id`, `title`, `level`, `xp_reward`, `difficulty`, `narrative_text`, `tags`, `unlocks`)
  - ~~How starter code is embedded~~ → `` ```python starter `` fence distinguishes editable code from examples
  - ~~`tests_x.py` structure~~ → Pytest with descriptive names and "Glitch Hint" assertion messages
  - ~~At least one complete example~~ → "The Guardian's Password" (`quest_01.md` + `test_01.py`)

- [x] **Detailed Data Model (Prisma / SQLModel Schema)** — `DATA_MODEL.md`
  - ~~Column types, constraints, and defaults~~ → Full Prisma schema with 7 models (4 Game: `User`, `QuestAttempt`, `Achievement`, `UserAchievement` + 3 NextAuth: `Account`, `Session`, `VerificationToken`)
  - ~~Foreign key relationships~~ → One-to-Many (User→QuestAttempt, User→Account, User→Session) + Many-to-Many (User↔Achievement via junction table)
  - ~~Indexes for performance-critical queries~~ → `xp DESC` for leaderboard, `questSlug` for lookups
  - ~~Clarify ambiguous fields~~ → `requirementSlug` format, UUID rationale, `questSlug` decoupling, `codeSubmitted` as `String` (no `@db.Text` for SQLite compatibility)

- [x] **Environment Variables Specification (`.env.example`)** — `ENV_SPECIFICATION.md` + `.env.example`
  - ~~`DATABASE_URL` with examples~~ → SQLite, PostgreSQL, MySQL examples with use-case descriptions
  - ~~Auth secrets~~ → `NEXTAUTH_SECRET` + `BACKEND_SECRET_KEY` with generation instructions
  - ~~`API_BASE_URL`, `NEXT_PUBLIC_API_URL`~~ → Both defined with server-side vs. browser-side distinction + `INTERNAL_API_KEY` for inter-service auth
  - ~~Feature flags or optional service keys~~ → Guest Mode, XP Multiplier, Debug Mode, Maintenance Mode, SMTP

---

## Medium Priority — Needed Before Phase 2

- [ ] **UI Wireframes or Component Map**
  - Quest selection / level map screen
  - Quest play screen (narrative panel, code editor, terminal — three-panel layout)
  - Profile / XP dashboard
  - Leaderboard view
  - Level-up celebration modal
  - RPG narrative presentation style (dialogue boxes, scrolling text, character sprites)

- [ ] **Curriculum Outline (Content Roadmap)**
  - Total number of levels and quests per level
  - Python concepts mapped to levels (e.g., Level 1 = `print`/variables, Level 2 = conditionals, Level 3 = loops)
  - "Final Boss" project description for each level
  - Narrative arc for "The Script-Kitten Chronicles"

- [ ] **User Stories / User Flows**
  - New user: homepage → sign up → Level 1 Quest 1 → complete → XP toast → next quest
  - Returning user: log in → dashboard with progress → continue from last quest
  - Leaderboard viewer: view rankings → filter by level
  - Content contributor: fork → add quest `.md` + test → submit PR

- [ ] **Error Handling & "Glitch Report" Format**
  - How Python tracebacks map to kid-friendly messages
  - Hint tiers (first attempt = vague hint, third attempt = stronger hint?)
  - Glitch Report UI component design

---

## Lower Priority — Needed Before Launch / Contributors Join

- [ ] **Testing Strategy**
  - Unit tests for API routes (Pytest)
  - Component tests for frontend (Vitest / React Testing Library)
  - E2E tests (Playwright)
  - Pyodide integration testing approach

- [ ] **Docker Compose Service Definitions**
  - Services, ports, volumes, health checks
  - Hot-reload configuration for dev
  - Finalize ADR 007 status from "Proposed" → "Accepted"

- [ ] **Contributing Guide (`CONTRIBUTING.md`)**
  - Git branching strategy (trunk-based, feature branches)
  - PR template and review process
  - Code style rules (ESLint config, Ruff/Black for Python)
  - Step-by-step guide: "How to add a new quest"

- [ ] **Accessibility & Internationalization**
  - Accessibility standards for target audience (ages 8–14, screen readers, learning differences)
  - Whether i18n is in scope for v1
  - If so, translation workflow for Markdown content

- [ ] **Deployment Guide**
  - Target platforms (Vercel for Next.js, Railway/Fly.io for FastAPI)
  - CI/CD pipeline definition (GitHub Actions)
  - Environment-specific `DATABASE_URL` switching

---

## First 5 Steps: MVP Implementation Plan

> After the critical audit fixes are resolved, build in this order.
> Each step has a **TDD gate** — a test that must pass before moving on.

### Step 1: Scaffold the Monorepo + Tooling — COMPLETE

- [x] Initialize Git repo, create `.gitignore`
- [x] Set up Turborepo with `apps/web` (Next.js) and `apps/api` (FastAPI)
- [x] Add root scripts: `dev`, `build`, `lint`, `test`
- [x] Copy `.env.example` → `.env`, configure SQLite default
- **TDD gate:** PASSED — `npm run dev` starts both services; `npm run lint` passes

### Step 2: Database + Auth (The Skeleton) — COMPLETE

- [x] Write complete Prisma schema (Game models + NextAuth models) in `prisma/schema.prisma`
- [x] Run `prisma migrate dev` to generate SQLite `dev.db`
- [x] Configure NextAuth with Credentials provider (JWT strategy)
- [x] Build login page, session middleware, and `/me` API route
- **TDD gate:** PASSED — register → login → `GET /me` returns user with `xp: 0, level: 1`

### Step 3: Pyodide Integration (The Engine)

- [ ] Create the `usePyodide` hook (loads WASM bundle, exposes `runPython(code)`)
- [ ] Build minimal code editor (Monaco) + output terminal component
- [ ] Wire "Run" button to execute code via Pyodide and display `stdout`/`stderr`
- **TDD gate:** Component test — type `print("hello")` → terminal shows `hello`

### Step 4: Quest Loader + Grading (The Core Loop)

- [ ] Build `gray-matter` + custom parser for quest `.md` files (frontmatter, body, `python starter` block)
- [ ] Create `GET /quests` and `GET /quests/{id}` endpoints (reads from `/content`)
- [ ] Build three-panel Quest Layout: Instructions | Editor | Terminal
- [ ] Implement hybrid grading flow (Pyodide client-side → FastAPI server-side verification)
- **TDD gate:** Load "The Guardian's Password" → type `password = "CodeQuest2026"` → submit → see success response

### Step 5: XP + Level-Up (The Reward)

- [ ] Implement `POST /quests/{id}/submit` with full Reward Logic inside `$transaction`
- [ ] Build XP progress bar and "Level Up" toast notification
- [ ] Wire the full submit flow: client grade → API call → XP update → UI feedback
- **TDD gate:** Complete 2 quests → XP bar reflects total → level threshold triggers level-up toast

---

## Quick Reference: Document → What It Unblocks

| Document | Unblocks |
|:---|:---|
| Audit critical fixes | Safe first commit, working auth, correct architecture |
| Auth ADR (008) | User flows, session management, all protected routes |
| API route spec | FastAPI backend scaffolding |
| Quest format spec + example | Content pipeline, grading engine, contributor workflow |
| Detailed data model | Prisma/SQLModel schema, migrations |
| `.env.example` with docs | Local dev setup for any contributor |
| Curriculum outline | Entire `content/` directory structure |
| UI wireframes / component map | Frontend component architecture |
