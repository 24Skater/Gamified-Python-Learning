# 🕹️ Technical PDR: Code Quest Python (AI-Ready Spec)

## 1. Project Overview
**Goal:** An open-source, gamified web application to teach kids Python.
**Target Audience:** Ages 8–14.
**Core Hook:** A narrative RPG called "The Script-Kitten Chronicles" where coding challenges are "Quests" that repair a virtual world.

---

## 2. Technical Stack (Recommended)
* **Frontend:** Next.js (App Router) + Tailwind CSS + Lucide Icons (for RPG-style UI).
* **Backend:** FastAPI (Python) - *Essential to use Python for the backend of a Python course.*
* **Python Execution:** Pyodide (Runs Python code in the browser for instant feedback).
* **Database:** Database-agnostic via Prisma ORM (Next.js) / SQLModel (FastAPI). Defaults to SQLite for local dev; supports PostgreSQL, MySQL in production.
* **Testing/Validation:** Pytest-style test suites per quest (graded via hybrid client/server flow).
* **Monorepo:** Turborepo with npm workspaces to orchestrate `apps/web` and `apps/api`.

---

## 3. Database Strategy (Agnostic)
* **Abstraction:** Use Prisma (Next.js) or SQLModel (FastAPI).
* **Configuration:** All database settings must be loaded via Environment Variables (`.env`).
* **Default:** Default to **SQLite** for zero-config local development.
* **Compatibility:** Ensure migrations and schemas are compatible with:
    * SQLite (Local)
    * PostgreSQL (Production / Self-hosted)
    * MySQL / MariaDB

---

## 4. Directory Structure
```text
code-quest-python/
├── apps/
│   ├── web/                # Next.js Frontend
│   │   ├── components/     # UI: QuestCard, Leaderboard, Terminal
│   │   ├── hooks/          # usePyodide, useGameState
│   │   └── lib/            # Utilities: quest parser, auth config
│   └── api/                # FastAPI Backend
│       ├── main.py
│       ├── routes/         # auth, users, quests, achievements
│       └── grading/        # Server-side re-verification of submissions
├── content/                # Global Quest Repository
│   ├── level_1/
│   │   ├── quest_01.md     # Lesson text + starter code
│   │   └── test_01.py      # Test cases for validation
├── prisma/                 # Prisma schema & migrations
│   └── schema.prisma       # Includes NextAuth + Game models
├── turbo.json              # Turborepo pipeline config
├── package.json            # Root workspace config (npm workspaces)
├── docker-compose.yml      # One-command dev environment setup
├── .env.example            # Template for all config (see ENV_SPECIFICATION.md)
├── .gitignore              # Excludes .env, node_modules, dev.db, __pycache__
└── README.md
```

---

## 5. Core Logic & Gamification Rules

### A. Progression Logic

**XP Formula:**

$$XP_{Required} = 100 \times (Level^{1.5})$$

**Reward Tiers:**

| Action | XP Reward |
|---|---|
| Syntax Fix | 10 XP |
| Logic Quest | 50 XP |
| Final Boss (Project) | 200 XP + Badge |

### B. Validation Workflow (Hybrid Grading)

The grading architecture uses a **two-phase hybrid** approach: client-side for instant feedback, server-side for trusted XP awards.

**Phase 1 — Client-Side (Instant Feedback via Pyodide):**

1. User writes code in the browser editor (Monaco).
2. `usePyodide` hook executes the student's code locally in the WASM sandbox.
3. Pyodide runs a subset of tests from `content/level_x/test_x.py` for immediate pass/fail feedback.
4. **If Failed:** Display a "Glitch Report" (friendly error message) instantly — no network round-trip.

**Phase 2 — Server-Side (Trusted XP Award via FastAPI):**

5. **If Passed client-side:** The frontend sends the code to `POST /api/v1/quests/{id}/submit`.
6. FastAPI re-verifies the code against the full test suite in a sandboxed environment.
7. On verified pass, the Reward Logic runs inside a **database transaction**: Verify → Calculate XP → Check Level → Badge Scan.
8. Response includes XP earned, level-up status, and any unlocked badges.

> **Why hybrid?** Client-side grading gives kids instant feedback (critical for engagement). Server-side re-verification prevents XP manipulation and ensures leaderboard integrity. Guest Mode users only get Phase 1 (client-side); XP is stored in `localStorage` until they create an account.

---

## 6. Database Schema

> Full Prisma schema with field types and constraints: see `DATA_MODEL.md`.

### Game Models

| Model | Key Fields |
|:---|:---|
| `User` | `id` (UUID), `username`, `email?`, `xp`, `level`, `gold`, `streakDays`, `lastActive` |
| `QuestAttempt` | `id` (UUID), `userId`, `questSlug`, `codeSubmitted`, `isCompleted`, `attemptsCount`, `timeTaken?` |
| `Achievement` | `id` (UUID), `name`, `description`, `iconSlug`, `requirementSlug`, `xpBonus` |
| `UserAchievement` | `id` (UUID), `userId`, `achievementId`, `earnedAt` |

### NextAuth Required Models

| Model | Purpose |
|:---|:---|
| `Account` | Stores OAuth provider link (GitHub, Google, etc.) per user. |
| `Session` | Server-side session storage (httpOnly cookie maps to this). |
| `VerificationToken` | For Magic Link / email verification flows. |

---

## 7. Phase-by-Phase Implementation (For Cursor)

### Phase 1: The Foundation

- Scaffold Turborepo monorepo with `apps/web` (Next.js) and `apps/api` (FastAPI).
- Create `.gitignore` (exclude `.env`, `node_modules/`, `dev.db`, `__pycache__/`, `.next/`).
- Write complete Prisma schema (Game models + NextAuth models), run `prisma migrate dev`.
- Configure NextAuth with Credentials provider + `@auth/prisma-adapter`.
- Integrate Pyodide to execute `print("Hello World")` in the browser console.
- Create the quest Markdown parser (`gray-matter` + custom `python starter` extractor) to render `content/` files.

### Phase 2: The Quest Engine

- Build the three-panel "Quest Layout": Instructions (left), Code Editor (center), Terminal (right).
- Implement hybrid grading: Pyodide client-side for instant feedback, `POST /quests/{id}/submit` for server-side re-verification.
- Build the `gray-matter` + custom `python starter` parser for quest content files.

### Phase 3: Gamification Layer

- Implement the full Reward Logic inside a database transaction (Verify → XP → Level → Badge).
- Build the XP progress bar and "Level Up" toast notification system.
- Implement the Global Leaderboard component (`GET /leaderboard`).

---

## 8. Inter-Service Architecture

The Next.js frontend and FastAPI backend are separate services that communicate over HTTP.

* **Frontend → Backend:** Next.js server-side routes call `BACKEND_API_URL` (e.g., `http://localhost:8000/api/v1`). These calls are authenticated with a shared `INTERNAL_API_KEY` header — never exposed to the browser.
* **Browser → Frontend API:** Browser components call `NEXT_PUBLIC_API_URL` (e.g., `/api`). Next.js API routes proxy to FastAPI after validating the user's session cookie.
* **Auth Flow:** NextAuth uses JWT session strategy (required for Credentials provider compatibility). The Next.js server creates a short-lived internal token signed with `BACKEND_SECRET_KEY` when proxying requests to FastAPI. FastAPI validates this token before processing.

---

## 9. Instructions for Cursor AI

When using this file with Cursor (`@pdr_cursor_spec.md`), follow these rules:

- **Hybrid Grading:** Use Pyodide for client-side instant feedback. Server-side re-verification via FastAPI before awarding XP. Never trust client-reported pass/fail for database writes.
- **Visual Style:** Use a "Dark Mode" aesthetic with neon accents (Purple/Green) to mimic a "hacker/cyber" RPG feel.
- **Educational Tone:** Ensure all error messages are encouraging. Never say "Wrong"; say "Glitch Detected! Try adjusting your spell."
- **Clean Code:** Use TypeScript for the frontend and PEP 8 standards for the backend.
- **Transactions:** All XP/Level/Badge updates must be wrapped in a single database transaction to prevent race conditions.
- **SQLite Compatibility:** Do not use `@db.Text` or any provider-specific Prisma attributes. Use plain `String` for all text fields to maintain database agnosticism.