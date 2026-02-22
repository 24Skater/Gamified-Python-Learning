# Authentication Specification (Open-Source Friendly)

> Implements **ADR 008: Pluggable Authentication via NextAuth.js**.
> Auth providers are toggled on/off via environment variables — no code changes required.

---

## 1. Primary Engine

* **Library:** `next-auth` (Auth.js)
* **Adapter:** `@auth/prisma-adapter` (connects auth to the database-agnostic Prisma layer)
* **Session Strategy:** JWT sessions — required for Credentials provider compatibility. The JWT is stored in an httpOnly cookie (not a Bearer header). Session data is encoded in the token and validated server-side on each request.

---

## 2. Supported Auth Modes (Configurable via `.env`)

The app checks for environment variables at startup to enable/disable providers:

| Mode | Trigger Variable(s) | Use Case |
|:---|:---|:---|
| **Local / Offline** | `ENABLE_CREDENTIALS_AUTH=true` | Private schools, offline labs, local dev. |
| **Social (OAuth)** | `GITHUB_ID` + `GITHUB_SECRET`, `GOOGLE_ID` + `GOOGLE_SECRET` | Public web deployments, community servers. |
| **Magic Links** | `EMAIL_SERVER`, `EMAIL_FROM` | Passwordless login for older kids / parents. |

**Rules:**

* If no OAuth or Email variables are set, the app defaults to Credentials-only mode.
* Multiple modes can be active simultaneously (e.g., Credentials + GitHub).
* The login page dynamically renders only the enabled providers.

---

## 3. User Schema Integration

When a user logs in for the first time, the system must:

1. Create a `User` record in the database (via Prisma adapter).
2. Initialize `level: 1` and `xp: 0` (these are schema defaults — see `DATA_MODEL.md`).
3. Assign a default "Starter" avatar (frontend handles this when `image` is `null`).
4. If the user was previously in Guest Mode, migrate their `localStorage` progress to the new database record.

---

## 4. Middleware Protection

| Route Pattern | Access Level |
|:---|:---|
| `/` (Landing page) | Public |
| `/leaderboard` | Public (read-only) |
| `/login`, `/register` | Public |
| `/quest/**` | Protected — requires session or Guest Mode |
| `/profile/**` | Protected — requires session (no Guest Mode) |
| `/api/**` | Protected — requires valid session token |

* If no session exists and the route is protected, redirect to `/login`.
* Guest Mode users accessing `/profile/**` are prompted to create an account.

---

## 5. Guest Mode (No Account Required)

**Purpose:** Remove all friction for first-time users. Kids can start playing immediately without creating an account.

**How it works:**

1. User clicks "Play as Guest" on the landing/login page.
2. A temporary player profile is stored in `localStorage`:
   - `guest_id` (generated UUID)
   - `current_level`
   - `xp`
   - `quests_completed[]`
3. Guest users can access all `/quest/**` routes and play normally.
4. Progress is persisted in `localStorage` across browser sessions.

**Account Migration Flow:**

1. Guest user clicks "Save Progress" or "Create Account."
2. User completes sign-up via any enabled auth provider.
3. On first authenticated session, the app detects `localStorage` guest data.
4. Guest progress is written to the database under the new `User` record.
5. `localStorage` guest data is cleared.

**Limitations:**

* Guest progress is device-specific and lost if browser data is cleared.
* Guest users cannot appear on the public leaderboard.
* Guest users cannot access `/profile/**` pages.

---

## 6. Environment Variables (Auth-Related)

```env
# Required
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Credentials Provider (default for local/offline)
ENABLE_CREDENTIALS_AUTH=true

# OAuth Providers (optional — add to enable)
# GITHUB_ID=""
# GITHUB_SECRET=""
# GOOGLE_ID=""
# GOOGLE_SECRET=""

# Magic Link Provider (optional — add to enable)
# EMAIL_SERVER="smtp://user:pass@smtp.example.com:587"
# EMAIL_FROM="noreply@codequest.dev"
```
