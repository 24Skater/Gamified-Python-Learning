<div align="center">

# ⚔️ Code Quest Python

### *The Script-Kitten Chronicles*

**A gamified RPG web app that teaches kids Python through epic quests.**

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<br />

[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)
[![Open Source Love](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=flat-square)]()
[![Ages 8-14](https://img.shields.io/badge/ages-8--14-blueviolet?style=flat-square)]()

<br />

<img src="https://img.shields.io/badge/%E2%9A%94%EF%B8%8F_Write_Code._%F0%9F%90%B1_Save_Kittens._%F0%9F%8F%86_Level_Up.-8B5CF6?style=for-the-badge" alt="Write Code. Save Kittens. Level Up." />

<br />
<br />

[Getting Started](#-getting-started) · [How It Works](#-how-it-works) · [Tech Stack](#%EF%B8%8F-tech-stack) · [Project Structure](#-project-structure) · [Contributing](#-contributing)

</div>

<br />

---

<br />

## 🎮 What is Code Quest Python?

> *"The Glitch has corrupted the Digital Kingdom! Only a young coder can write the Python spells to restore it..."*

**Code Quest Python** is an open-source web application that teaches kids (ages 8–14) how to program in Python through an RPG-style narrative called **The Script-Kitten Chronicles**. Instead of boring exercises, students complete **Quests** — coding challenges wrapped in a story where every line of code repairs a broken virtual world.

<br />

<div align="center">
<table>
<tr>
<td align="center" width="33%">

### 🧩 Learn by Doing
Write real Python code in a browser-based editor with **instant feedback** — no setup required.

</td>
<td align="center" width="33%">

### ⚡ Instant Feedback
Code runs **in the browser** via Pyodide (WebAssembly). See results the moment you click "Run."

</td>
<td align="center" width="33%">

### 🏆 Gamified Progress
Earn **XP**, level up, unlock **badges**, climb the **leaderboard**, and show off your coding skills.

</td>
</tr>
</table>
</div>

<br />

## 🔮 How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                        THE QUEST LOOP                               │
│                                                                     │
│   📖 Read Quest ──▶ ✍️ Write Code ──▶ ▶️ Run (Pyodide) ──┐        │
│        │                                                  │        │
│        │              ┌──────────────────────────────────  │        │
│        │              │                                    ▼        │
│        │         ❌ Fail                            ✅ Pass         │
│        │     "Glitch Detected!                  Submit to Server    │
│        │      Try again..."                          │              │
│        │              │                              ▼              │
│        │              └─────────┐          🏅 Earn XP + Badges     │
│        │                        │                    │              │
│        ▼                        │                    ▼              │
│   🔄 Retry with hints          │           📈 Level Up!            │
│                                 │                    │              │
│                                 └────────────────────▶ Next Quest   │
└─────────────────────────────────────────────────────────────────────┘
```

**Hybrid Grading** — the best of both worlds:

| Phase | Where | Why |
|:------|:------|:----|
| **Phase 1** — Instant Feedback | 🖥️ Client (Pyodide/WASM) | Zero latency. Kids see results immediately. No network required. |
| **Phase 2** — Trusted Verification | ☁️ Server (FastAPI) | Prevents XP cheating. Awards XP, levels, and badges securely. |

<br />

## 🏗️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | ![Next.js](https://img.shields.io/badge/-Next.js-000?style=flat-square&logo=next.js) ![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white) | App Router, Server Components, RPG-themed dark UI |
| **Backend** | ![FastAPI](https://img.shields.io/badge/-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white) | REST API, server-side grading, XP logic |
| **Python Runner** | ![WebAssembly](https://img.shields.io/badge/-Pyodide/WASM-654FF0?style=flat-square&logo=webassembly&logoColor=white) | In-browser Python execution for instant feedback |
| **Database** | ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white) ![SQLite](https://img.shields.io/badge/-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white) | Database-agnostic ORM. SQLite (dev) / PostgreSQL (prod) |
| **Auth** | ![NextAuth](https://img.shields.io/badge/-NextAuth.js-000?style=flat-square&logo=next.js) | JWT sessions, OAuth, Credentials, Guest Mode |
| **Monorepo** | ![Turborepo](https://img.shields.io/badge/-Turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white) | Orchestrates web + api workspaces |

</div>

<br />

## 📁 Project Structure

```
code-quest-python/
├── apps/
│   ├── web/                    # 🌐 Next.js Frontend (App Router + Tailwind)
│   │   ├── app/                #    Routes & layouts
│   │   ├── components/         #    UI: QuestCard, Leaderboard, Terminal
│   │   ├── hooks/              #    usePyodide, useGameState
│   │   └── lib/                #    Utilities: quest parser, auth config
│   │
│   └── api/                    # ⚡ FastAPI Backend (Python)
│       ├── main.py             #    App entry point + CORS
│       ├── routes/             #    auth, users, quests, achievements
│       └── grading/            #    Server-side code verification
│
├── content/                    # 📖 Quest Repository (Markdown + Python tests)
│   └── level_1/                #    Level 1 quests
│
├── prisma/                     # 🗃️ Database Schema & Migrations
│   └── schema.prisma           #    7 models (User, Quest, Achievements, Auth)
│
├── turbo.json                  #    Turborepo pipeline config
├── package.json                #    Root workspace config
├── .env.example                #    Environment variable template
└── .gitignore
```

<br />

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|:-----|:--------|
| **Node.js** | 18+ |
| **Python** | 3.11+ |
| **npm** | 9+ |

### 1. Clone the repo

```bash
git clone https://github.com/24Skater/Gamified-Python-Learning.git
cd Gamified-Python-Learning
```

### 2. Install dependencies

```bash
# JavaScript / TypeScript (installs all workspaces)
npm install

# Python (FastAPI backend)
pip install -r apps/api/requirements.txt
```

### 3. Set up environment

```bash
# Copy the env template
cp .env.example .env

# The defaults work out of the box (SQLite, localhost ports)
```

### 4. Start development servers

```bash
npm run dev
```

This starts **both** servers simultaneously via Turborepo:

| Service | URL | Description |
|:--------|:----|:------------|
| **Frontend** | [http://localhost:3000](http://localhost:3000) | Next.js app |
| **API** | [http://localhost:8000](http://localhost:8000) | FastAPI backend |
| **API Docs** | [http://localhost:8000/docs](http://localhost:8000/docs) | Swagger UI |
| **Health Check** | [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health) | `{"status": "ok"}` |

<br />

## 📜 Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start all dev servers (Next.js + FastAPI) |
| `npm run build` | Build all workspaces |
| `npm run lint` | Run ESLint across the project |
| `npm run test` | Run test suites |

<br />

## 🎯 Gamification System

<div align="center">

```
         ┌──────────────────────────────────────────────┐
         │              XP PROGRESSION                   │
         │                                               │
         │   XP Required = 100 × (Level ^ 1.5)          │
         │                                               │
         │   Level 1 ──▶  100 XP    (⚡ Quick wins)     │
         │   Level 5 ──▶ 1,118 XP   (📚 Deeper quests) │
         │   Level 10 ──▶ 3,162 XP  (🏆 Mastery)       │
         └──────────────────────────────────────────────┘
```

</div>

| Action | XP Reward | Description |
|:-------|:----------|:------------|
| 🔧 **Syntax Fix** | 10 XP | Fix a small bug in existing code |
| 🧩 **Logic Quest** | 50 XP | Solve a coding challenge |
| 🐉 **Final Boss** | 200 XP + Badge | Complete a level's capstone project |

<br />

## 🗄️ Database

The project uses **Prisma ORM** for database-agnostic data access. Switch databases by changing one environment variable:

| Database | `DATABASE_URL` | Use Case |
|:---------|:---------------|:---------|
| **SQLite** | `file:./dev.db` | Local development (default, zero-config) |
| **PostgreSQL** | `postgresql://user:pass@localhost:5432/codequest` | Production / self-hosted |
| **MySQL** | `mysql://user:pass@localhost:3306/codequest` | Alternative production |

**Models:** `User` · `Account` · `Session` · `VerificationToken` · `QuestAttempt` · `Achievement` · `UserAchievement`

<br />

## 🔐 Authentication

Authentication is powered by **NextAuth.js** with pluggable providers — toggle login methods via environment variables, no code changes:

| Mode | How to Enable | Use Case |
|:-----|:--------------|:---------|
| 🔑 **Username/Password** | `ENABLE_CREDENTIALS_AUTH=true` | Schools, offline labs, local dev |
| 🐙 **GitHub OAuth** | Set `GITHUB_ID` + `GITHUB_SECRET` | Public web deployments |
| 🔵 **Google OAuth** | Set `GOOGLE_ID` + `GOOGLE_SECRET` | Community servers |
| 👻 **Guest Mode** | `ENABLE_GUEST_MODE=true` | Zero-friction start, progress in localStorage |

<br />

## 🤝 Contributing

We welcome contributions from developers, educators, and students! Whether you're adding a new quest, fixing a bug, or improving the UI — every PR helps a kid learn to code.

```bash
# 1. Fork the repo
# 2. Create your feature branch
git checkout -b feature/amazing-quest

# 3. Make your changes & commit
git commit -m "feat: add new quest for loops level"

# 4. Push and open a PR
git push origin feature/amazing-quest
```

### Ways to Contribute

| Area | Description |
|:-----|:------------|
| 📝 **Add Quests** | Write new `.md` quest files + `test_*.py` test suites in `/content` |
| 🎨 **Improve UI** | Make the RPG interface more engaging and accessible |
| 🐛 **Fix Bugs** | Check the issues tab for open bugs |
| 🌍 **Translate** | Help make quests available in other languages |
| 📚 **Documentation** | Improve guides, examples, and onboarding |

<br />

## 📝 Spec Documents

> These files are the single source of truth for all design decisions.

| Document | What It Covers |
|:---------|:---------------|
| [`pdr_cursor_spec.md`](pdr_cursor_spec.md) | Master technical spec — stack, architecture, game rules |
| [`DATA_MODEL.md`](DATA_MODEL.md) | Complete Prisma schema with all 7 models |
| [`API_SPECIFICATION.md`](API_SPECIFICATION.md) | FastAPI endpoints, request/response shapes |
| [`QUEST_FORMAT_SPEC.md`](QUEST_FORMAT_SPEC.md) | Quest Markdown format + test suite structure |
| [`ENV_SPECIFICATION.md`](ENV_SPECIFICATION.md) | All environment variables with descriptions |
| [`auth_spec.md`](auth_spec.md) | NextAuth.js configuration + Guest Mode |
| [`adr.md`](adr.md) | Architecture Decision Records (8 ADRs) |

<br />

## 🗺️ Roadmap

- [x] **Step 1** — Scaffold monorepo + tooling
- [ ] **Step 2** — Database migrations + NextAuth setup
- [ ] **Step 3** — Pyodide integration (in-browser Python)
- [ ] **Step 4** — Quest loader + hybrid grading engine
- [ ] **Step 5** — XP system + level-up rewards

<br />

---

<div align="center">

**Built with ❤️ for young coders everywhere.**

*Code Quest Python is open-source software.*

<br />

[![GitHub Stars](https://img.shields.io/github/stars/24Skater/Gamified-Python-Learning?style=social)](https://github.com/24Skater/Gamified-Python-Learning/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/24Skater/Gamified-Python-Learning?style=social)](https://github.com/24Skater/Gamified-Python-Learning/network/members)

</div>
