# API Specification: Code Quest Python

---

## 1. General Principles

* **Base URL:** `/api/v1`
* **Format:** JSON
* **Auth (Browser → Next.js):** httpOnly JWT cookie managed by NextAuth. The browser never sees a raw token.
* **Auth (Next.js → FastAPI):** Next.js API routes proxy requests to FastAPI with an `X-Internal-Key` header (value from `INTERNAL_API_KEY` env var) and the user's identity in a signed payload using `BACKEND_SECRET_KEY`. FastAPI validates both before processing.
* **Error Handling:** Standard HTTP status codes (`400`, `401`, `403`, `404`, `500`) with a `detail` body:

```json
{
  "error": true,
  "message": "The glitch was found in..."
}
```

---

## 2. Endpoints Summary

### User & Profile

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/me` | Get current user's XP, Level, and Progress. |
| `PATCH` | `/me/avatar` | Update user's avatar / cosmetics. |
| `GET` | `/leaderboard` | Get top players (paginated). |

### Quests & Curriculum

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/quests` | List all available quest nodes (the Skill Tree). |
| `GET` | `/quests/{id}` | Get specific quest details & starter code. |
| `POST` | `/quests/{id}/submit` | Submit code for grading and XP reward. |

### Achievements

| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/achievements` | List all possible badges. |
| `GET` | `/me/achievements` | List badges earned by the current user. |

---

## 3. Key Endpoint Deep Dives

### `POST /quests/{id}/submit` — The Grading Engine (Server-Side Re-Verification)

This is the most critical endpoint. It receives the student's code after it has already passed client-side Pyodide grading (see `pdr_cursor_spec.md` Section 5B). The backend re-verifies the code against the full test suite before awarding XP.

**Request Body:**

```json
{
  "quest_id": "string",
  "code": "string",
  "language_version": "3.11"
}
```

**Response (Success):**

```json
{
  "status": "success",
  "xp_earned": 50,
  "level_up": true,
  "new_level": 5,
  "unlocked_badges": ["LoopMaster"],
  "feedback": "Great job! You used a for-loop perfectly."
}
```

**Response (Failure / Glitch):**

```json
{
  "status": "fail",
  "error_type": "SyntaxError",
  "hint": "Check your colon (:) at the end of the 'if' statement.",
  "traceback": "..."
}
```

---

## 4. Database Interaction Logic

When the backend processes a successful quest submission, it must perform the following **Reward Logic** wrapped in a **single database transaction** (`Prisma.$transaction()`) to prevent race conditions:

1. **Verify:** Ensure the user hasn't already earned XP for this quest (prevent double-farming).
2. **Calculate:** Add XP to user profile.
3. **Check Level:** If `current_xp >= xp_required_for_next_level`, trigger a level-up event.
4. **Badge Scan:** Check if the submission meets requirements for any new achievements.

> **Transaction requirement:** If any step fails, all changes must roll back. This prevents partial state (e.g., XP awarded but badge missed, or double XP from concurrent requests).

---

## 5. Security & Rate Limiting

To prevent "XP Scripting" (users spamming the API with correct answers):

* **Rate Limiting:** Maximum 5 submissions per minute per user. For Guest Mode users (no server identity), rate limit by IP address as a fallback.
* **Input Sanitization:** The backend re-runs student code in a sandboxed environment. Code must be size-limited (max 10KB) and execution time-limited (max 10 seconds).
* **Inter-Service Auth:** All requests from Next.js to FastAPI must include a valid `X-Internal-Key` header. Requests without it are rejected with `403`.
* **CORS:** Restricted to the frontend domain via `CORS_ORIGINS` env var.

---

## 6. Instructions for Cursor

When building the API, follow these guidelines:

* **Pydantic Models:** Use Pydantic for all request/response schemas to ensure strict data validation.
* **Modular Routes:** Separate logic into `/routers/users.py`, `/routers/quests.py`, etc.
* **Self-Documenting:** Ensure FastAPI's Swagger UI (`/docs`) is descriptive so other open-source contributors can test the API easily.
