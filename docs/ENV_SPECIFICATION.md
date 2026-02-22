# Environment Variables Specification

> All configuration is driven by a single `.env` file at the project root.
> Copy `.env.example` to `.env` and fill in the values for your environment.

---

## 1. Database Configuration (Prisma / SQLModel)

The `DATABASE_URL` determines which database Prisma connects to. The agnostic nature of the project is defined here — Cursor will use this value to determine which Prisma provider to initialize.

| Database | `DATABASE_URL` Value | Use Case |
|:---|:---|:---|
| SQLite | `file:./dev.db` | Local dev. No server install required — perfect for a kid running the project on their own laptop. |
| PostgreSQL | `postgresql://user:password@localhost:5432/codequest?schema=public` | Production. The standard for hosting a "Global Leaderboard" for a school or community. |
| MySQL | `mysql://user:password@localhost:3306/codequest` | Alternative production option for MySQL/MariaDB environments. |

---

## 2. Authentication (NextAuth.js)

| Variable | Required | Description |
|:---|:---|:---|
| `NEXTAUTH_SECRET` | Yes | Encrypts session tokens. Generate via `openssl rand -base64 32`. If missing, the app will crash in production for security reasons. |
| `NEXTAUTH_URL` | Yes | The canonical URL of the Next.js app (e.g., `http://localhost:3000`). |

---

## 3. Auth Providers (Feature Flags)

Toggle login methods on/off without code changes. See `auth_spec.md` for full provider details.

| Variable | Default | Description |
|:---|:---|:---|
| `ENABLE_CREDENTIALS_AUTH` | `true` | Enables username/password login. Crucial for schools running the game without complex OAuth setup. |
| `ENABLE_GUEST_MODE` | `true` | If `true`, the frontend allows students to skip login and save progress to `localStorage`. |
| `GITHUB_ID` / `GITHUB_SECRET` | — | Optional. Set both to enable GitHub OAuth login. |
| `GOOGLE_ID` / `GOOGLE_SECRET` | — | Optional. Set both to enable Google OAuth login. |

---

## 4. API Connectivity

| Variable | Default | Description |
|:---|:---|:---|
| `BACKEND_API_URL` | `http://localhost:8000/api/v1` | Used by the Next.js **server** to talk to the FastAPI grading engine. Not exposed to the browser. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3000/api` | `NEXT_PUBLIC_` prefix makes it accessible in the browser. Allows frontend components to know where to send "Submit Code" requests. |
| `INTERNAL_API_KEY` | — | Shared secret sent as `X-Internal-Key` header on all Next.js → FastAPI requests. FastAPI rejects any request without a valid key. Generate via `openssl rand -hex 32`. |

---

## 5. Feature Flags & Game Settings

Using feature flags allows the app to behave like a "Swiss Army Knife" — adjust behavior without redeploying.

| Variable | Default | Description |
|:---|:---|:---|
| `NEXT_PUBLIC_DEBUG_MODE` | `false` | Shows debug info in the code terminal when `true`. |
| `NEXT_PUBLIC_XP_MULTIPLIER` | `1` | Global XP multiplier. Set to `2` for a "Double XP Weekend" event — no redeploy needed. |
| `NEXT_PUBLIC_MAINTENANCE_MODE` | `false` | When `true`, shows a maintenance page and disables quest submissions. |

---

## 6. Backend Specific (FastAPI)

| Variable | Required | Description |
|:---|:---|:---|
| `BACKEND_SECRET_KEY` | Yes | Secret for internal backend JWT validation. Must differ from `NEXTAUTH_SECRET`. |
| `CORS_ORIGINS` | Yes | Comma-separated list of allowed origins (e.g., `http://localhost:3000,https://yourdomain.com`). |

---

## 7. Optional Services

For sending magic links or email notifications. Only required if the Magic Link auth provider is enabled.

| Variable | Required | Description |
|:---|:---|:---|
| `SMTP_HOST` | No | SMTP server hostname (e.g., `smtp.mailtrap.io`). |
| `SMTP_PORT` | No | SMTP server port (e.g., `2525`). |
| `SMTP_USER` | No | SMTP authentication username. |
| `SMTP_PASS` | No | SMTP authentication password. |
