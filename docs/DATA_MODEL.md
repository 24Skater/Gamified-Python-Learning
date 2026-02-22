# Detailed Data Model: Code Quest Python

> Implements **ADR 004: Database Agnosticism via Prisma ORM**.
> Copy the schema below into `prisma/schema.prisma`.

---

## 1. The Prisma Schema

```prisma
// This is your Prisma schema file
// IMPORTANT: Do NOT use @db.Text or any provider-specific attributes.
// Use plain String for all text fields to maintain SQLite compatibility.

datasource db {
  provider = "postgresql" // Or "sqlite" / "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// --- NEXTAUTH REQUIRED MODELS ---
// These are required by @auth/prisma-adapter. Do not remove.

model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?

  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// --- CORE USER MODEL ---

model User {
  id            String    @id @default(uuid())
  username      String    @unique
  email         String?   @unique
  emailVerified DateTime?
  image         String?

  // Gamification Stats
  xp            Int       @default(0)
  level         Int       @default(1)
  gold          Int       @default(0)
  streakDays    Int       @default(0)
  lastActive    DateTime? @default(now())

  // NextAuth Relationships
  accounts      Account[]
  sessions      Session[]

  // Game Relationships
  questAttempts QuestAttempt[]
  achievements  UserAchievement[]

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([xp(sort: Desc)])
}

// --- QUEST & PROGRESS ---

model QuestAttempt {
  id              String   @id @default(uuid())
  userId          String
  questSlug       String
  codeSubmitted   String
  isCompleted     Boolean  @default(false)
  attemptsCount   Int      @default(1)

  timeTaken       Int?

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, questSlug])
  @@index([questSlug])
}

// --- ACHIEVEMENTS & BADGES ---

model Achievement {
  id              String   @id @default(uuid())
  name            String   @unique
  description     String
  iconSlug        String
  requirementSlug String   @unique
  xpBonus         Int      @default(0)

  earnedBy        UserAchievement[]
}

model UserAchievement {
  id              String      @id @default(uuid())
  userId          String
  achievementId   String
  earnedAt        DateTime    @default(now())

  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievement     Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)

  @@unique([userId, achievementId])
}
```

---

## 2. Key Design Decisions & Constraints

### ID Strategy: UUID vs. Integer

**Decision:** UUID (`String`) for all primary keys.

**Rationale:** In open-source projects, users often merge databases or export/import data. Auto-incrementing integers (`1, 2, 3...`) lead to collisions and make API endpoints predictable (allowing people to guess User IDs). UUIDs are globally unique and more secure.

### Relationships

| Relationship | Type | Constraint | Purpose |
|:---|:---|:---|:---|
| `User` ↔ `Account` | One-to-Many | `@@unique([provider, providerAccountId])` | NextAuth: links OAuth providers (GitHub, Google) to a user. |
| `User` ↔ `Session` | One-to-Many | `sessionToken @unique` | NextAuth: server-side session storage. |
| `User` ↔ `QuestAttempt` | One-to-Many | `@@unique([userId, questSlug])` | One record per quest per user. Retaking a quest updates the existing attempt rather than creating duplicates. |
| `User` ↔ `Achievement` | Many-to-Many | Via `UserAchievement` junction table | Tracks exactly when a specific user earned a specific badge. `@@unique([userId, achievementId])` prevents duplicate awards. |

### Performance Indexes

| Index | On | Purpose |
|:---|:---|:---|
| `@@index([xp(sort: Desc)])` | `User` | Leaderboard — pull top 100 players instantly without scanning the entire table. |
| `@@index([questSlug])` | `QuestAttempt` | Lookup — fast queries like "How many kids completed the Variables quest?" |

---

## 3. Clarifying Ambiguous Fields

### `requirementSlug` (Achievement)

A string-based logic key. Instead of hard-coding achievement logic in the database, the application code checks this slug at runtime.

**Format:** `CATEGORY_CRITERIA_VALUE`

| Example Slug | Meaning |
|:---|:---|
| `QUEST_COUNT_10` | Earned after 10 completed quests. |
| `STREAK_DAYS_7` | Earned after a 7-day login streak. |
| `LEVEL_REACHED_10` | Earned when the user reaches Level 10. |

### `questSlug` (QuestAttempt)

References the `id` field in the quest Markdown frontmatter (e.g., `q1_variables_password`) instead of linking to a database Quest table.

**Why:** If a Markdown file is deleted or renamed, the database doesn't break. The curriculum lives in Git (version-controlled) while progress lives in the database — keeping them decoupled.

### `codeSubmitted` (QuestAttempt)

Stored as `String` (maps to `TEXT` in SQLite, `varchar` in Postgres). We avoid `@db.Text` to maintain cross-database compatibility per ADR 004. This allows the "Guild Master" (teacher) to review exactly what code the student wrote and help them debug.

### `image` (User)

Avatar URL string. Defaults to `null` — the frontend assigns a "Starter" avatar sprite when no custom image is set (see `auth_spec.md` Section 3).

### `timeTaken` (QuestAttempt)

Optional integer (seconds). Captured client-side from when the quest loads to when the student submits. Used for analytics and potential future "Speed Run" achievements.
