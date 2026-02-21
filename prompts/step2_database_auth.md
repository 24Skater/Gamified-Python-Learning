# MVP Step 2 Prompt: Database + Auth (The Skeleton)

> Copy everything below the line into a new Cursor chat in Agent mode.

---

```
You are executing MVP Step 2: "Database + Auth (The Skeleton)" for the Code Quest Python project.

Step 1 (scaffold) is complete. The monorepo is set up with `apps/web` (Next.js) and `apps/api` (FastAPI), Prisma is installed, and `.env` is configured with SQLite.

## RULES — READ BEFORE DOING ANYTHING

1. **No assumptions.** Every decision must be grounded in the specification documents listed below. If a spec doesn't cover something, use widely-accepted best practices for NextAuth.js v5 (Auth.js), Prisma, and Next.js 14+ App Router — and cite which best practice you're following.
2. **No skipping steps.** Complete every task in order. Do not move to the next task until the current one is verified working.
3. **No scope creep.** This is ONLY Step 2 (Database + Auth). Do NOT build Pyodide integration, code editors, quest parsing, gamification UI, leaderboards, or any game logic. Those are Steps 3-5.
4. **No invented config.** Use exact variable names and values from `.env.example` and `ENV_SPECIFICATION.md`. Do not rename variables or invent new ones.
5. **No provider-specific Prisma attributes.** Per `pdr_cursor_spec.md` Section 9: Do NOT use `@db.Text`. Use plain `String` for all text fields.
6. **Follow the auth spec exactly.** Session strategy is JWT (not database sessions) per `auth_spec.md` Section 1 and `adr.md` ADR 008. The Credentials provider REQUIRES JWT strategy.
7. **Keep working.** After each task, immediately proceed to the next. Do not stop to ask for confirmation between tasks. Only stop if you encounter an error you cannot resolve.
8. **Visual style.** Per `pdr_cursor_spec.md` Section 9: Dark mode aesthetic with neon accents (Purple/Green). All pages must follow this theme, including login/register.

## SPECIFICATION DOCUMENTS (Your single source of truth)

Read ALL of these before writing any code:

- `@pdr_cursor_spec.md` — Section 6 (Database Schema overview), Section 8 (Inter-Service Architecture), Section 9 (Cursor AI Rules).
- `@adr.md` — ADR 004 (Prisma ORM), ADR 008 (Pluggable Auth via NextAuth.js — JWT strategy, httpOnly cookie).
- `@DATA_MODEL.md` — Section 1: The COMPLETE Prisma schema. The schema should already exist in `prisma/schema.prisma` from Step 1. Verify it matches DATA_MODEL.md exactly before migrating.
- `@auth_spec.md` — THE PRIMARY REFERENCE FOR THIS STEP. Read the entire file:
  - Section 1: Engine (next-auth, @auth/prisma-adapter, JWT strategy)
  - Section 2: Auth modes (only implement Credentials for now — `ENABLE_CREDENTIALS_AUTH=true`)
  - Section 3: User schema integration (first login creates User with level:1, xp:0)
  - Section 4: Middleware protection (route table — which routes are public vs. protected)
  - Section 5: Guest Mode — do NOT implement Guest Mode yet. Only build authenticated flow. Guest Mode is deferred.
  - Section 6: Auth-related env vars
- `@API_SPECIFICATION.md` — Section 1 (General Principles for auth flow: httpOnly JWT cookie → X-Internal-Key proxy), Section 2 (the `GET /me` endpoint).
- `@ENV_SPECIFICATION.md` — Section 2 (NEXTAUTH_SECRET, NEXTAUTH_URL), Section 3 (ENABLE_CREDENTIALS_AUTH), Section 4 (BACKEND_API_URL, NEXT_PUBLIC_API_URL, INTERNAL_API_KEY), Section 6 (BACKEND_SECRET_KEY).
- `@.env.example` — Existing env template with all values.

## TASK CHECKLIST (Execute in this exact order)

### Task 1: Verify and Migrate the Prisma Schema
- Verify `prisma/schema.prisma` matches `DATA_MODEL.md` Section 1 exactly (7 models: Account, Session, VerificationToken, User, QuestAttempt, Achievement, UserAchievement).
- Ensure the datasource provider is set to `"sqlite"` and url is `env("DATABASE_URL")`.
- Run `npx prisma migrate dev --name init` to create the SQLite database (`dev.db`).
- Run `npx prisma generate` to generate the Prisma Client.
- Verify the migration succeeded and `dev.db` exists.

### Task 2: Install Auth Dependencies
- In `apps/web/`, install: `next-auth`, `@auth/prisma-adapter`, `bcryptjs` (for password hashing), and their TypeScript types where needed.
- Do NOT install any OAuth-specific packages — only Credentials provider is needed for Step 2.

### Task 3: Configure NextAuth
- Create the NextAuth configuration file (route handler) following Next.js App Router conventions.
- Configure per `auth_spec.md` Section 1:
  - Adapter: `@auth/prisma-adapter` connected to the Prisma client.
  - Session strategy: `"jwt"` (NOT `"database"`).
  - Secret: reads from `NEXTAUTH_SECRET` env var.
- Configure the Credentials provider:
  - Accept `username` and `password` fields.
  - On sign-in: look up user by username, verify password hash with bcryptjs.
  - The authorize function must return the user object or null.
- Add JWT and session callbacks to include `id`, `username`, `xp`, `level`, and `gold` in the session object so `GET /me` can return gamification data without an extra DB query.
- Do NOT add GitHub, Google, or Email providers. Only Credentials.

### Task 4: Build Registration Endpoint
- Create a Next.js API route: `POST /api/auth/register`
- Request body: `{ username: string, password: string }`
- Logic:
  1. Validate that username is unique (query Prisma).
  2. Hash the password with bcryptjs (minimum 10 salt rounds).
  3. Create a new `User` record with Prisma. The schema defaults handle `xp: 0`, `level: 1`, `gold: 0`.
  4. Return `201` with `{ id, username }` on success.
  5. Return `409` if username already exists.
  6. Return `400` if validation fails.
- Use Zod for request body validation.
- NEVER store passwords in plain text.

### Task 5: Build Login and Register Pages
- Create `/login` page at `apps/web/app/login/page.tsx`:
  - Dark mode UI per `pdr_cursor_spec.md` Section 9 (dark background, neon Purple/Green accents).
  - Form with `username` and `password` fields.
  - "Login" button that calls NextAuth's `signIn("credentials", ...)`.
  - Link to "Create Account" that navigates to `/register`.
- Create `/register` page at `apps/web/app/register/page.tsx`:
  - Same dark mode styling.
  - Form with `username`, `password`, and `confirm password` fields.
  - On submit: call `POST /api/auth/register`, then auto-login via `signIn("credentials", ...)`.
  - Link back to "Already have an account? Login".
- Both pages must be accessible without authentication (public routes per `auth_spec.md` Section 4).

### Task 6: Implement Session Middleware
- Create Next.js middleware (`apps/web/middleware.ts`) that enforces the route protection table from `auth_spec.md` Section 4:
  - Public (no redirect): `/`, `/leaderboard`, `/login`, `/register`
  - Protected (redirect to `/login` if no session): `/quest/**`, `/profile/**`
  - `/api/**` routes (except `/api/auth/**`): return `401` JSON if no valid session token.
- Use NextAuth's `auth()` or `getToken()` to check session in middleware.

### Task 7: Build the `/me` API Route
- Create a Next.js API route: `GET /api/me`
- This is a Next.js server-side route (not FastAPI) — it reads the session from the JWT cookie and returns user data.
- Response shape (per `API_SPECIFICATION.md` Section 2):
  ```json
  {
    "id": "uuid",
    "username": "string",
    "xp": 0,
    "level": 1,
    "gold": 0,
    "streakDays": 0,
    "image": null
  }
  ```
- If no session, return `401` with the standard error format from `API_SPECIFICATION.md` Section 1:
  ```json
  {
    "error": true,
    "message": "No active session found."
  }
  ```

### Task 8: Verify TDD Gate
- Test the full flow manually or with a script:
  1. `POST /api/auth/register` with `{ username: "testplayer", password: "quest123" }` → 201
  2. `POST /api/auth/callback/credentials` (NextAuth sign-in) with same creds → session cookie set
  3. `GET /api/me` with session cookie → returns `{ username: "testplayer", xp: 0, level: 1 }`
- Confirm that hitting `GET /api/me` WITHOUT a session returns `401`.
- Confirm that hitting `/quest/anything` without a session redirects to `/login`.
- If any test fails, fix the issue before proceeding.

### Task 9: Commit
- Stage all new and modified files.
- Create a commit with message: "feat: add database migration, NextAuth credentials auth, login/register pages, and /me endpoint"
- Do NOT push to any remote.

## WHAT IS EXPLICITLY OUT OF SCOPE FOR STEP 2

Do NOT build any of these — they belong to later steps:
- Guest Mode (Step 2 is authenticated-only; Guest Mode will be layered on later)
- OAuth providers (GitHub, Google) — only Credentials for now
- Pyodide / code editor / terminal (Step 3)
- Quest loading / content parsing (Step 4)
- XP awards / level-up logic / leaderboard (Step 5)
- FastAPI grading endpoints (Step 4-5)
- Any UI beyond login/register pages

## WHEN YOU ARE DONE

Report back with:
1. Confirmation that `prisma migrate dev` succeeded and `dev.db` was created.
2. Confirmation that register → login → `GET /me` returns the correct user data.
3. Confirmation that protected routes redirect unauthenticated users.
4. Any deviations from the spec and why they were necessary.
```
