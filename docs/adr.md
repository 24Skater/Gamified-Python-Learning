# Architecture Decision Records (ADR)

---

## ADR 001: Client-Side Python Execution via Pyodide

**Status:** Accepted

**Context:** We need a way for students to write and run Python code instantly within the browser without complex local environment setup.

**Decision:** We will use Pyodide (WebAssembly-based Python distribution).

**Rationale:**

- **Security:** Code runs in the user's browser "sandbox." This prevents malicious code from affecting our servers (Remote Code Execution risk).
- **Latency:** There is no round-trip to a server to execute code, making the "Quest" feedback loop feel instantaneous.
- **Offline Capability:** Once the initial WASM bundle is loaded, students can code even with a spotty internet connection.

---

## ADR 002: Next.js App Router for Frontend

**Status:** Accepted

**Context:** The application needs to handle complex states (XP updates, code editor, terminal) while remaining SEO-friendly for open-source discovery.

**Decision:** Use Next.js 14+ with App Router.

**Rationale:**

- **Modularity:** The folder-based routing makes it easy for AI tools like Cursor to navigate "Levels" and "Components."
- **Performance:** Server Components allow us to render lesson text (Markdown) quickly while keeping the heavy Pyodide logic on the client side.

---

## ADR 003: Markdown-Driven Curriculum (Headless Content)

**Status:** Accepted

**Context:** We want the course to be open-source and easily translatable/editable by the community.

**Decision:** All lesson content and "Quests" will be stored as Markdown files (`.md`) in a dedicated `/content` directory.

**Rationale:**

- **Low Friction:** Contributors don't need database access to add a new level; they just submit a Pull Request with a new `.md` file.
- **AI Friendly:** LLMs like Cursor can easily parse Markdown to understand the context of a specific lesson.

---

## ADR 004: Database Agnosticism via Prisma ORM

**Status:** Accepted (Revised)

**Context:** To ensure the project is truly open-source friendly, we must avoid "vendor lock-in." Hard-coding a specific cloud provider like Supabase can be a major barrier for contributors who want to run the project locally or self-host on their own hardware. Users should be able to deploy this using their preferred database (SQLite for local dev, Postgres/MySQL for production, etc.).

**Decision:** Use Prisma ORM (for TypeScript) or SQLAlchemy/SQLModel (if the logic lives in Python) as the data access layer. All database configuration must be driven by environment variables.

**Rationale:**

- **Swappable Backends:** Switching from SQLite to PostgreSQL is as simple as changing the `provider` in the schema file or the `DATABASE_URL` in the environment variables.
- **Type Safety:** Provides auto-generated types for the database schema, which helps Cursor write more accurate code.
- **Ease of Setup:** New contributors can get started instantly with a local SQLite file (`dev.db`) without needing to install a database server.

---

## ADR 005: Gamification Progression Formula

**Status:** Accepted

**Context:** Levelling up must feel rewarding but progressively more challenging to prevent "XP bloat."

**Decision:** Implement a power-law progression for XP levels.

**Rationale:** The formula:

$$XP_{Required} = 100 \times (Level^{1.5})$$

ensures that:

- **Levels 1-5** are achieved quickly to hook the student.
- **Leveling slows down** as concepts get harder, encouraging deeper engagement with "Side Quests."

---

## ADR 006: Component-Driven UI with Tailwind CSS

**Status:** Accepted

**Context:** The UI needs to look like a game (dark mode, neon accents, progress bars).

**Decision:** Use Tailwind CSS with a predefined "RPG Theme" configuration.

**Rationale:**

- **Consistency:** Tailwind ensures that every "Quest Card" and "Achievement Toast" follows the same spacing and color palette.
- **Responsive Design:** Ensures the game is playable on tablets and laptops used in classrooms.

---

## ADR 007: Docker-First Development

**Status:** Proposed

**Context:** With multiple database options and a multi-service architecture (Next.js + FastAPI), setting up the environment can become "dependency hell" for new contributors.

**Decision:** Provide a `docker-compose.yml` file that orchestrates the entire development stack.

**Rationale:**

- **One-Command Setup:** Allows anyone to spin up the entire stack (Next.js + FastAPI + Postgres + Redis) with a single command: `docker-compose up`.
- **Reproducibility:** Ensures that "it works on my machine" is true for every contributor, regardless of OS or local toolchain.

---

## ADR 008: Pluggable Authentication via NextAuth.js

**Status:** Accepted

**Context:** The platform must support various deployment environments — from a local classroom server (no internet) to a global cloud deployment. For an open-source project meant to be "installed and used by anyone," the auth model needs to be as flexible as the database. We must avoid forcing users to sign up for a specific third-party service (like Auth0 or Clerk) while still making those services an option for power users.

**Decision:** Implement NextAuth.js (Auth.js) using the JWT session strategy (required for Credentials provider compatibility). The JWT is stored in an httpOnly cookie — never exposed as a Bearer header. NextAuth acts as the "Prisma of Authentication" — define one logic flow and toggle Providers (Google, GitHub, Credentials) on and off via the `.env` file. Connect to the database via `@auth/prisma-adapter`.

**Rationale:**

- **Provider Agnostic:** Easily switch between OAuth (GitHub/Google), Email/Magic Links, or "Credentials" (Username/Password) by setting environment variables.
- **Local-First Friendly:** The "Credentials Provider" allows the game to work entirely offline or on a local intranet — perfect for schools with restricted internet.
- **Privacy:** Since the project is open-source, schools can keep all user data on their own hardware rather than sending it to a third-party auth provider.
- **Guest Mode:** Users can start playing immediately using `localStorage` for progress. If they choose to create an account later, their local progress migrates to the database — removing all friction for first-time users.

**See also:** [`auth_spec.md`](auth_spec.md) for implementation details.
