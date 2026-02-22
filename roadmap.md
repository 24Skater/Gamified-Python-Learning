# Project Roadmap: Code Quest Python

> High-level view of all work phases, their dependencies, and which spec documents
> drive each phase. Cross-reference with `pre_dev_checklist.md` for task-level tracking.

---

## How to Read This Roadmap

- **MVP Steps 1-5** are the core build sequence. They must be done in order.
- **Documentation items** from the checklist are mapped to the MVP step they unblock.
- **Post-MVP phases** cover polish, community, and launch readiness.
- Each item shows its **status**, **dependencies**, and **source spec**.

---

## Phase 0: Specifications & Architecture — COMPLETE

> All spec documents written and audited. No code yet.

| Item | Status | Document |
|:---|:---|:---|
| Project overview & tech stack | Done | `pdr_cursor_spec.md` |
| Architecture decisions (ADR 001-008) | Done | `adr.md` |
| API endpoint specification | Done | `API_SPECIFICATION.md` |
| Quest content format + example | Done | `QUEST_FORMAT_SPEC.md` |
| Authentication specification | Done | `auth_spec.md` |
| Database schema (7 Prisma models) | Done | `DATA_MODEL.md` |
| Environment variables specification | Done | `ENV_SPECIFICATION.md` + `.env.example` |
| Security & architecture audit | Done | `pre_dev_checklist.md` (Critical section) |
| All 10 critical audit fixes | Done | `pre_dev_checklist.md` (Critical section) |

---

## Phase 1: MVP Build (Steps 1-5)

### MVP Step 1: Scaffold the Monorepo + Tooling — COMPLETE

| What | Status | Driven By |
|:---|:---|:---|
| Initialize Git repo + `.gitignore` | Done | `pre_dev_checklist.md` Step 1 |
| Turborepo + npm workspaces (`turbo.json`, root `package.json`) | Done | `pdr_cursor_spec.md` Section 2, 4 |
| `apps/web` (Next.js 14+, App Router, TypeScript, Tailwind) | Done | `adr.md` ADR 002 |
| `apps/api` (FastAPI, `main.py`, health endpoint) | Done | `pdr_cursor_spec.md` Section 2 |
| Prisma schema installed in `prisma/schema.prisma` | Done | `DATA_MODEL.md` Section 1 |
| `.env` configured with SQLite default | Done | `ENV_SPECIFICATION.md` Section 1 |
| Root scripts: dev, build, lint, test | Done | `pre_dev_checklist.md` Step 1 |
| Placeholder directories (components, hooks, lib, routes, grading, content) | Done | `pdr_cursor_spec.md` Section 4 |
| Initial commit | Done | — |

**TDD Gate:** PASSED — `npm run dev` starts both services; lint passes.

---

### MVP Step 2: Database + Auth (The Skeleton) — COMPLETE

**Dependencies:** Step 1 complete.

| What | Status | Driven By |
|:---|:---|:---|
| Run `prisma migrate dev` → SQLite `dev.db` | Done | `DATA_MODEL.md` Section 1 |
| NextAuth config (JWT strategy, Credentials provider) | Done | `auth_spec.md` Sections 1-2, `adr.md` ADR 008 |
| `@auth/prisma-adapter` integration | Done | `auth_spec.md` Section 1 |
| Registration endpoint (`POST /api/auth/register`) | Done | `auth_spec.md` Section 3 |
| Login + Register pages (dark mode, neon accents) | Done | `pdr_cursor_spec.md` Section 9 |
| Route protection middleware | Done | `auth_spec.md` Section 4 |
| `GET /api/me` endpoint | Done | `API_SPECIFICATION.md` Section 2 |

**TDD Gate:** PASSED — Register → Login → `GET /me` returns `{ xp: 0, level: 1 }`.

---

### DOCUMENTATION CHECKPOINT — Before Step 3 — COMPLETE

> These Medium Priority checklist items have been resolved.

| Item | Blocks Step | Impact If Missing | Status |
|:---|:---|:---|:---|
| **UI Wireframes / Component Map** | Step 3 (editor layout), Step 4 (quest layout) | Agent will guess panel sizes, component hierarchy, responsive behavior | Done — `UI_COMPONENT_MAP.md` |
| **Error Handling & "Glitch Report" Format** | Step 4 (grading feedback UI) | Error display will be bare-bones; no hint escalation logic | Done — `GLITCH_REPORT_SPEC.md` |
| Curriculum Outline (Content Roadmap) | Step 4 (only need 1-2 quests for MVP) | Not blocking — "The Guardian's Password" example exists | Done — `CURRICULUM_OUTLINE.md` |
| User Stories / User Flows | Steps 3-5 (implicit in build prompts) | Not blocking — flows are defined in step prompts | Done — `USER_FLOWS.md` |

**Minimum to proceed to Step 3:** UI Component Map + Glitch Report format.
**Can defer to post-MVP:** Full curriculum outline + formal user stories.

---

### MVP Step 3: Pyodide Integration (The Engine) — COMPLETE

**Dependencies:** Step 2 complete. UI Component Map complete.

| What | Status | Driven By |
|:---|:---|:---|
| `usePyodide` hook (load WASM, expose `runPython`) | Done | `pdr_cursor_spec.md` Section 5B, `adr.md` ADR 001 |
| Monaco code editor component | Done | `UI_COMPONENT_MAP.md` Section 4 |
| Terminal output + GlitchReport component | Done | `UI_COMPONENT_MAP.md` Section 4, `GLITCH_REPORT_SPEC.md` |
| Three-panel quest play screen layout (responsive) | Done | `UI_COMPONENT_MAP.md` Sections 4, 11 |
| Wire "Run" button → Pyodide → Terminal | Done | `pdr_cursor_spec.md` Section 5B |

**TDD Gate:** PASSED — `print("hello")` → terminal shows `hello`. Errors render GlitchReport.

---

### MVP Step 4: Quest Loader + Grading (The Core Loop) — NEXT UP

**Dependencies:** Step 3 complete. Glitch Report format needed.

| What | Status | Driven By |
|:---|:---|:---|
| `gray-matter` + custom `python starter` parser | Pending | `QUEST_FORMAT_SPEC.md` Sections 1-2, 5 |
| `GET /quests` and `GET /quests/{id}` endpoints | Pending | `API_SPECIFICATION.md` Section 2 |
| Three-panel Quest Layout (Instructions / Editor / Terminal) | Pending | `pdr_cursor_spec.md` Section 7, UI Component Map |
| `user_code` test fixture (Pyodide + FastAPI runners) | Pending | `QUEST_FORMAT_SPEC.md` Section 3 |
| Client-side Pyodide grading (Phase 1 of hybrid) | Pending | `pdr_cursor_spec.md` Section 5B |
| Server-side FastAPI re-verification (Phase 2 of hybrid) | Pending | `pdr_cursor_spec.md` Section 5B, `API_SPECIFICATION.md` Section 3 |
| Glitch Report error display component | Pending | Glitch Report format spec (to be created) |
| Example quest: "The Guardian's Password" in `/content` | Pending | `QUEST_FORMAT_SPEC.md` Section 4 |

**TDD Gate:** Load quest → type `password = "CodeQuest2026"` → submit → see success.

---

### MVP Step 5: XP + Level-Up (The Reward) — Blocked by Step 4

**Dependencies:** Step 4 complete.

| What | Status | Driven By |
|:---|:---|:---|
| `POST /quests/{id}/submit` with Reward Logic | Pending | `API_SPECIFICATION.md` Sections 3-4 |
| Reward Logic in `Prisma.$transaction()` | Pending | `API_SPECIFICATION.md` Section 4, `pdr_cursor_spec.md` Section 9 |
| XP progress bar component | Pending | `adr.md` ADR 005 (XP formula), UI Component Map |
| "Level Up" toast notification | Pending | `pdr_cursor_spec.md` Section 7 |
| Full submit flow: client grade → API → XP update → UI feedback | Pending | `pdr_cursor_spec.md` Section 5B |

**TDD Gate:** Complete 2 quests → XP bar updates → level-up toast triggers.

**MVP COMPLETE after this step.** A kid can register, log in, open a quest, write Python, get graded, and earn XP.

---

## Phase 2: Polish & Game Features (Post-MVP)

> Requires a working MVP (Steps 1-5 complete). Order is flexible.

| Item | Dependencies | Driven By | Status |
|:---|:---|:---|:---|
| **Guest Mode** (localStorage play + account migration) | Steps 2 + 4 | `auth_spec.md` Section 5 | Pending |
| **OAuth Providers** (GitHub, Google login) | Step 2 | `auth_spec.md` Section 2, `ENV_SPECIFICATION.md` Section 3 | Pending |
| **Global Leaderboard** component + `GET /leaderboard` | Step 5 | `API_SPECIFICATION.md` Section 2, `pdr_cursor_spec.md` Section 7 | Pending |
| **Achievement / Badge system** + `GET /achievements` | Step 5 | `DATA_MODEL.md` (Achievement, UserAchievement models) | Pending |
| **Profile page** (`/profile`) with XP, badges, history | Steps 2 + 5 | `auth_spec.md` Section 4 | Pending |
| **Avatar selector** + `PATCH /me/avatar` | Step 2 | `API_SPECIFICATION.md` Section 2 | Pending |
| **Streak tracking** (`streakDays` update logic) | Step 5 | `DATA_MODEL.md` (`streakDays` field — logic TBD) | Pending |
| **Full curriculum** (Levels 1-5+ with multiple quests) | Step 4 | Curriculum Outline (to be created) | Pending |
| **"Skill Tree"** quest map UI | Steps 4 + 5 | UI Component Map, `QUEST_FORMAT_SPEC.md` (`unlocks` field) | Pending |
| **XP Multiplier events** ("Double XP Weekend") | Step 5 | `ENV_SPECIFICATION.md` (`NEXT_PUBLIC_XP_MULTIPLIER`) | Pending |
| **Magic Link auth** (passwordless login) | Step 2 | `auth_spec.md` Section 2, `ENV_SPECIFICATION.md` Section 7 | Pending |

---

## Phase 3: DevOps & Community Readiness

> Needed before public launch or accepting external contributors.

| Item | Blocking | Driven By | Status |
|:---|:---|:---|:---|
| **Docker Compose** (full stack in one command) | Contributor onboarding | `adr.md` ADR 007, `pdr_cursor_spec.md` Section 4 | Pending |
| **CI/CD Pipeline** (GitHub Actions: lint + test + build) | PR quality | `pre_dev_checklist.md` (Lower Priority) | Pending |
| **Testing Strategy** (unit, component, E2E, Pyodide) | Code quality | `pre_dev_checklist.md` (Lower Priority) | Pending |
| **Contributing Guide** (`CONTRIBUTING.md`) | External PRs | `pre_dev_checklist.md` (Lower Priority) | Pending |
| **Deployment Guide** (Vercel + Railway/Fly.io) | Production release | `pre_dev_checklist.md` (Lower Priority) | Pending |
| **Accessibility audit** (ages 8-14, screen readers) | Inclusive launch | `pre_dev_checklist.md` (Lower Priority) | Pending |
| **i18n decision** (in scope for v1 or deferred?) | Community translations | `pre_dev_checklist.md` (Lower Priority) | Pending |

---

## Visual Timeline

```
PHASE 0 (Done)        PHASE 1 (MVP Build)                            PHASE 2           PHASE 3
──────────────   ──────────────────────────────────────────────   ──────────────   ──────────────
 Specs & Audit    Step1 → Step2 → [Docs] → Step3 → Step4 → Step5   Game Features    DevOps & Launch
                  DONE     NEXT    ▲         │        │       │
                                   │         │        │       │
                              UI Component   │     Quests     XP
                              Map + Glitch   │     + Grading  + Rewards
                              Report Format  │
                                           Pyodide
                                           + Editor
```

---

## Document Index

| File | Purpose | Phase |
|:---|:---|:---|
| `pdr_cursor_spec.md` | Master technical spec — stack, architecture, Cursor rules | 0 |
| `adr.md` | Architecture Decision Records (ADR 001-008) | 0 |
| `API_SPECIFICATION.md` | REST API endpoints, auth flow, rate limiting | 0 |
| `QUEST_FORMAT_SPEC.md` | Quest `.md` format, test structure, `user_code` fixture | 0 |
| `auth_spec.md` | NextAuth config, providers, middleware, Guest Mode | 0 |
| `DATA_MODEL.md` | Full Prisma schema (7 models) with field docs | 0 |
| `ENV_SPECIFICATION.md` | All environment variables with descriptions | 0 |
| `.env.example` | Copy-and-go env template for contributors | 0 |
| `pre_dev_checklist.md` | Task tracker with checkboxes + MVP build plan | 0 |
| `roadmap.md` | This file — high-level phased dependency map | 0 |
| `UI_COMPONENT_MAP.md` | Design system, screen layouts, component specs, responsive breakpoints | Docs Checkpoint |
| `CURRICULUM_OUTLINE.md` | 5 levels × 6 quests, narrative arc, badge definitions | Docs Checkpoint |
| `USER_FLOWS.md` | Personas, 6 core user flows, error/edge case flows | Docs Checkpoint |
| `GLITCH_REPORT_SPEC.md` | Error type mapping, hint escalation, success feedback, guest mode | Docs Checkpoint |
