# Error Handling & Glitch Report Format: Code Quest Python

> Defines how errors are displayed to kids — the primary learning feedback tool in the game.
> All messaging follows the encouraging educational tone defined in `pdr_cursor_spec.md` Section 9.
> API response shapes reference `API_SPECIFICATION.md` Section 3.

---

## 1. Design Philosophy

**Errors are "Glitches in the Matrix," not failures.** When a student's code doesn't work, the system treats it as a natural part of the adventure — a glitch to debug, not a mistake to feel bad about.

### Core Principles

| Principle | Rule | Rationale |
|:---|:---|:---|
| **Never punish** | Never say "Wrong," "Error," "Failed," or "Incorrect." Use "Glitch Detected," "Almost there," or "Try adjusting your spell." | Per `pdr_cursor_spec.md` Section 9: all error messages must be encouraging. Punitive language causes disengagement in children ages 8–14. |
| **Never expose raw tracebacks** | Raw Python tracebacks are always wrapped in kid-friendly language. The original traceback is available in the API response (`traceback` field) for debugging but never rendered directly in the UI. | Raw tracebacks are intimidating and meaningless to beginners. They reference file paths and line numbers from the sandbox, not the student's mental model. |
| **Guide, don't solve** | Glitch Reports hint at the problem area and type, but do not give away the answer (except at escalation tier 3 — see Section 4). | The goal is learning, not completion. Productive struggle builds understanding. |
| **Consistent RPG framing** | All feedback uses in-world language: code is "spells," errors are "glitches," tests are "checks." | Maintains immersion in "The Script-Kitten Chronicles" narrative (per `CURRICULUM_OUTLINE.md` Section 4). |
| **Immediate and local** | Glitch Reports appear instantly in the terminal panel (right panel of Quest Play screen — per `UI_COMPONENT_MAP.md` Section 4) after clicking "Run." No network round-trip needed for client-side failures. | Instant feedback is critical for engagement. Per `pdr_cursor_spec.md` Section 5B: Pyodide provides Phase 1 instant feedback. |

---

## 2. Glitch Report Component Structure

The Glitch Report renders in the **terminal panel** (right panel) of the Quest Play screen when client-side Pyodide tests fail, or when the server returns a failure response.

### Component Layout

```
┌─────────────────────────────────────────────────┐
│  🐛  GLITCH DETECTED!                           │
│  ┌─────────────────────────────────────────────┐ │
│  │ SyntaxGlitch                                │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  Your spell has a typo! Check for missing         │
│  colons, brackets, or quotes.                     │
│                                                   │
│  ┌─ Code Highlight ──────────────────────────┐   │
│  │  Line 3:  print("hello"                   │   │
│  │                         ^ Expected ')'     │   │
│  └───────────────────────────────────────────┘   │
│                                                   │
│  ✨ Adjust your spell and try again!              │
└─────────────────────────────────────────────────┘
```

### Element Breakdown

| Element | Styling | Description |
|:---|:---|:---|
| **Icon** | Lucide `Bug` icon in `text-red-400`, `w-5 h-5` | A themed bug icon — fits the "Glitch Bug" creatures from the narrative |
| **Title** | `"GLITCH DETECTED!"` in `font-display text-lg text-red-400 uppercase tracking-wider` | Never "Error" or "Wrong." Always "Glitch Detected!" |
| **Type Badge** | `bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full` | Shows the glitch category: `SyntaxGlitch`, `LogicGlitch`, `RuntimeGlitch`, or `QuestGlitch` (mapped from Python error types — see Section 3) |
| **Hint Message** | `text-gray-200 text-sm leading-relaxed` | The kid-friendly explanation. For runtime errors, uses the default message from Section 3. For test assertion failures, uses the assertion message from the test file (per `QUEST_FORMAT_SPEC.md` Section 3). |
| **Code Highlight** | `bg-gray-900 border border-gray-700 rounded-lg p-3 font-mono text-sm` with error line in `text-red-400` | If the error includes a line number, highlight that line. Show a caret (`^`) pointing to the approximate position of the error. If no line info is available, this section is omitted. |
| **Retry Prompt** | `text-violet-400 text-sm italic` | Encouraging call-to-action. Rotates between: "Adjust your spell and try again!", "You're close! Check the glitch and recast.", "Glitches are just puzzles — you've got this!" |

### Container Styling

- **Outer container:** `bg-gray-950 border border-red-500/30 rounded-xl p-4 mx-2 my-2`
- **Separator lines:** `border-t border-gray-800 my-3` between sections
- **Animation:** Slides in from below with a subtle red glow pulse on the border (`animate-pulse` for 1 cycle, then static)

---

## 3. Error Type Mapping

Maps standard Python errors to kid-friendly Glitch categories and default messages. The `error_type` field in the API failure response (`API_SPECIFICATION.md` Section 3) corresponds to the Python exception class name.

| Python Error | Glitch Category | Default Kid-Friendly Message |
|:---|:---|:---|
| `SyntaxError` | SyntaxGlitch | "Your spell has a typo! Check for missing colons, brackets, or quotes." |
| `IndentationError` | SyntaxGlitch | "Your code alignment is off. Python is picky about spaces — make sure each line starts in the right place!" |
| `NameError` | SyntaxGlitch | "The system doesn't recognize that word. Did you spell your variable or function name correctly?" |
| `TypeError` | LogicGlitch | "You're mixing up types! Make sure you're using the right kind of data (text vs. number, for example)." |
| `IndexError` | LogicGlitch | "You tried to reach something that doesn't exist! Check your list positions — remember, they start at 0." |
| `ValueError` | LogicGlitch | "The value doesn't look right. Double-check what you're passing in." |
| `KeyError` | LogicGlitch | "That key doesn't exist in the dictionary. Check your key names — spelling and capitalization matter!" |
| `AttributeError` | LogicGlitch | "That object doesn't have that ability. Check your method names — did you use the right one?" |
| `ZeroDivisionError` | RuntimeGlitch | "Dividing by zero creates a black hole! Make sure your divisor isn't zero." |
| `RecursionError` | RuntimeGlitch | "Infinite loop detected! Your spell is casting itself forever. Check your loop or function for a missing exit condition." |
| `TimeoutError` (Pyodide) | RuntimeGlitch | "Your code took too long! It might be stuck in a loop. Check your `while` condition or loop logic." |
| `MemoryError` | RuntimeGlitch | "Your code used too much memory! Try simplifying your approach — smaller lists, fewer variables." |
| Assertion failure (from test) | QuestGlitch | *(Uses the assertion message from the test file directly — see below)* |
| Unknown / other | RuntimeGlitch | "An unexpected glitch occurred! Try a different approach, or check your code for anything unusual." |

### QuestGlitch — Test Assertion Messages

When a test assertion fails, the message comes directly from the test file's assertion string (per `QUEST_FORMAT_SPEC.md` Section 3). For example:

```python
assert "password" in user_code.namespace, \
    "Glitch! The Guardian can't find a variable named 'password'. Did you check your spelling?"
```

The Glitch Report displays:
- **Type Badge:** `QuestGlitch`
- **Hint Message:** "Glitch! The Guardian can't find a variable named 'password'. Did you check your spelling?"

This allows quest authors to write context-specific, narrative-appropriate error messages as part of the quest content.

---

## 4. Hint Escalation System

Hints become progressively more helpful as the student struggles. Attempt count is tracked via the `attemptsCount` field in the `QuestAttempt` model (`DATA_MODEL.md` Section 1). For Guest Mode users, attempt count is tracked in `localStorage`.

### Escalation Tiers

| Attempt | Tier | Behavior |
|:---|:---|:---|
| **1** | Standard | Show the Glitch Report with error type + default kid-friendly message (Section 3). No additional hints. |
| **2** | Standard | Same as Attempt 1. Let the student try again with the same information — avoid overwhelming with too much help too soon. |
| **3** | Hint | Show the standard Glitch Report **plus** an additional **"Hint"** section below. The hint is more specific: it references the relevant test's assertion message (QuestGlitch) or provides a more targeted suggestion based on the error type. |
| **4** | Hint | Same as Attempt 3 — hint remains visible. |
| **5+** | Help Offered | Show the Glitch Report + Hint **plus** a **"Need Help?"** button. Clicking it reveals a partial solution: pseudocode or a code skeleton showing the structure of the answer without giving away the exact values. |

### Hint Section Component

Appears below the main Glitch Report after Attempt 3:

```
┌─────────────────────────────────────────────────┐
│  💡 HINT                                         │
│                                                   │
│  The Guardian is looking for a specific variable  │
│  name. Check the instructions panel — it tells    │
│  you exactly what the variable should be called.  │
└─────────────────────────────────────────────────┘
```

- **Container:** `bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mt-3`
- **Icon:** Lucide `Lightbulb` in `text-amber-400`
- **Label:** `"HINT"` in `text-amber-400 font-semibold text-xs uppercase tracking-wider`
- **Text:** `text-gray-200 text-sm`

### "Need Help?" Section Component

Appears after Attempt 5:

```
┌─────────────────────────────────────────────────┐
│  🆘 NEED HELP?                                   │
│  [Show me a clue]                                 │
│                                                   │
│  (Revealed on click:)                             │
│  Here's the shape of the spell:                   │
│                                                   │
│    ________ = "____________"                       │
│                                                   │
│  Fill in the variable name and value from the     │
│  instructions!                                    │
└─────────────────────────────────────────────────┘
```

- **Container:** `bg-violet-500/10 border border-violet-500/30 rounded-lg p-3 mt-3`
- **Button:** `"Show me a clue"` — secondary button style. Content is hidden until clicked (progressive disclosure).
- **Partial solution format:** Pseudocode or a code skeleton using underscores for blanks. Never reveals the complete answer.

> **Best practice (educational scaffolding for children):** The Hint Escalation System implements a "gradual release of responsibility" model common in educational technology. Young learners (ages 8–14) benefit from productive struggle but disengage after repeated failure without guidance. The 3-attempt threshold balances challenge with support. The "Need Help?" option at Attempt 5 prevents frustration-driven quitting — the primary cause of drop-off in kids' coding platforms.

---

## 5. Success Feedback Format

When code passes all tests (client-side via Pyodide, then confirmed server-side via `POST /quests/{id}/submit`), the success feedback replaces the terminal content.

### Success Response Fields

From `API_SPECIFICATION.md` Section 3:

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

### Success Component Layout

```
┌─────────────────────────────────────────────────┐
│  ⭐  QUEST COMPLETE!                             │
│                                                   │
│  "Great job! You used a for-loop perfectly."      │
│                                                   │
│  ┌────────────────────────────────┐               │
│  │  ⚡ +50 XP                     │               │
│  │  ████████████████░░░░  340/520 │               │
│  └────────────────────────────────┘               │
│                                                   │
│  🏆 Badge Unlocked: LoopMaster                    │
│                                                   │
│  [ Next Quest → ]  [ Back to Quest Map ]          │
└─────────────────────────────────────────────────┘
```

### Element Breakdown

| Element | Styling | Source |
|:---|:---|:---|
| **Icon** | Lucide `Star` or `Trophy` in `text-emerald-400`, `w-6 h-6` | Themed success icon |
| **Title** | `"QUEST COMPLETE!"` in `font-display text-xl text-emerald-400 uppercase` | Static text, or the `feedback` string from the API response if it starts with a title-like phrase |
| **Feedback message** | `text-gray-200 text-base italic` | The `feedback` field from the API success response |
| **XP animation** | Animated counter that ticks up from 0 to `xp_earned` over 1.5 seconds. `text-emerald-400 font-display text-2xl` | `xp_earned` from API response |
| **XP progress bar** | Mini version of the XP bar (per `UI_COMPONENT_MAP.md` Section 8) showing the fill animation | Calculated from current XP + `xp_earned` vs. `XP_Required` for next level |
| **Badge notification** | Badge icon + name, `text-yellow-400 font-semibold`. Only shown if `unlocked_badges` is non-empty. | `unlocked_badges` array from API response |
| **Level-Up trigger** | If `level_up: true`, the Level-Up Celebration Modal fires (per `UI_COMPONENT_MAP.md` Section 7) **after** the success component has been visible for 2 seconds. | `level_up` and `new_level` from API response |
| **Action buttons** | "Next Quest" (primary — navigates to next unlocked quest) and "Back to Quest Map" (secondary — navigates to `/quest`) | — |

### Container Styling

- **Outer container:** `bg-gray-950 border border-emerald-500/30 rounded-xl p-6 mx-2 my-2`
- **Animation:** Slides in from below with a green glow pulse on the border
- **Confetti:** Small particle burst (green + purple) on initial render — lighter than the Level-Up modal animation

---

## 6. Guest Mode Error Handling

**Reference:** `auth_spec.md` Section 5, `pdr_cursor_spec.md` Section 5B

Guest Mode users receive **client-side grading only** (Pyodide Phase 1). There is no server round-trip for quest submission.

### What's Identical

| Feature | Behavior |
|:---|:---|
| Glitch Reports | Rendered identically. Error type mapping (Section 3), hint messages, and component styling are the same. |
| Hint Escalation | Works identically. Attempt count is tracked in `localStorage` per quest. |
| Code execution | Pyodide runs the same tests. The `user_code` fixture works the same way. |
| Success component layout | Same visual design — icon, title, feedback message, XP animation. |

### What's Different

| Feature | Authenticated User | Guest Mode User |
|:---|:---|:---|
| **XP persistence** | Server-side (database) | `localStorage` only |
| **Success toast note** | "Quest Complete!" | "Quest Complete! Progress saved locally." |
| **Badge unlocks** | Checked server-side during Reward Logic transaction | Checked client-side against local quest completion count (simplified — only quest milestone badges) |
| **Level-Up modal** | Triggered by `level_up: true` from server | Triggered by client-side XP calculation against `XP_Required` formula |
| **Server verification** | Phase 2 re-verification before XP award | No server verification — XP awarded based on client-side test pass |
| **Leaderboard impact** | XP contributes to leaderboard ranking | No leaderboard entry (per `auth_spec.md` Section 5) |
| **"Submit" button** | Sends code to server | Saves completion to `localStorage` directly (button label: "Save Progress" instead of "Submit") |
| **Prompt to create account** | — | After every 3rd quest completion, a non-blocking banner appears: "Create an account to save your progress to the cloud and join the leaderboard!" |
