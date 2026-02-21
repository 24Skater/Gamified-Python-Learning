# Curriculum Outline: Code Quest Python

> Maps out the full quest progression, narrative arc, and badge definitions for "The Script-Kitten Chronicles."
> All quest IDs follow the format defined in `QUEST_FORMAT_SPEC.md` Section 1.
> XP rewards follow the tiers defined in `pdr_cursor_spec.md` Section 5A.

---

## 1. Level Structure Overview

| Metric | Value |
|:---|:---|
| Total levels | 5 |
| Quests per level | 5 regular + 1 Final Boss = 6 per level |
| Total quests | 30 |
| Difficulty curve | Each level introduces one core Python concept with increasing complexity |
| Target audience | Ages 8–14, no prior coding experience assumed |

**XP Reward Tiers** (from `pdr_cursor_spec.md` Section 5A):

| Quest Difficulty | XP Reward | Description |
|:---|:---|:---|
| Beginner (Syntax Fix) | 10 XP | Simple variable assignment, `print()`, fixing typos |
| Intermediate (Logic Quest) | 50 XP | Multi-step logic, conditionals, loops, function design |
| Boss | 200 XP + Badge | Level capstone project combining all concepts from the level |

**Progression formula** (from `adr.md` ADR 005): `XP_Required = 100 × (Level^1.5)`. Levels 1–3 are achieved quickly to keep young learners engaged; Levels 4–5 require more quests, encouraging exploration.

---

## 2. Level-by-Level Breakdown

### Level 1: "Booting the System" — `print()`, Variables, Strings

> **Story beat:** Script-Kitten wakes up in a corrupted digital world. Basic systems are offline. The kitten must restore power by writing simple Python spells.

| # | Quest ID | Title | Difficulty | XP | Tags | Unlocks | Narrative Hook |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 1 | `q1_variables_password` | The Guardian's Password | Beginner | 10 | `variables`, `strings` | `q1_print_beacon` | The Guardian Robot blocks the gate. It needs a password stored in a variable. |
| 2 | `q1_print_beacon` | Lighting the Beacon | Beginner | 10 | `print`, `strings` | `q1_strings_signal` | The emergency beacon is dark. Use `print()` to send a signal to the network. |
| 3 | `q1_strings_signal` | Decoding the Signal | Beginner | 10 | `strings`, `concatenation` | `q1_variables_inventory` | A garbled message arrives. Combine string fragments to decode the signal. |
| 4 | `q1_variables_inventory` | Inventory Check | Intermediate | 50 | `variables`, `integers`, `strings` | `q1_math_power` | The supply terminal needs an inventory count. Create variables for items and quantities. |
| 5 | `q1_math_power` | Power Calibration | Intermediate | 50 | `math`, `variables`, `operators` | `q1_boss_reboot` | The power grid needs math calculations to balance the energy flow. |
| 6 | `q1_boss_reboot` | **BOSS: System Reboot** | Boss | 200 | `print`, `variables`, `strings`, `math` | `q2_bool_scanner` | Combine everything: variables, strings, math, and print to reboot the central system. |

---

### Level 2: "Scanning for Glitches" — Conditionals, Comparisons, Booleans

> **Story beat:** The system is online but infected with Glitch Bugs. Script-Kitten must learn to detect and classify glitches using conditional logic.

| # | Quest ID | Title | Difficulty | XP | Tags | Unlocks | Narrative Hook |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 1 | `q2_bool_scanner` | The Bug Scanner | Beginner | 10 | `booleans`, `comparisons` | `q2_if_gate` | Build a scanner that identifies True/False readings from corrupted data. |
| 2 | `q2_if_gate` | The Logic Gate | Beginner | 10 | `if`, `else` | `q2_elif_classifier` | A security gate only opens when the right condition is met. Write an `if` check. |
| 3 | `q2_elif_classifier` | Glitch Classifier | Intermediate | 50 | `if`, `elif`, `else` | `q2_nested_maze` | Sort detected glitches into categories: harmless, warning, or critical. |
| 4 | `q2_nested_maze` | The Maze of Mirrors | Intermediate | 50 | `nested if`, `and`, `or` | `q2_comparison_alarm` | Navigate a maze where each fork requires a nested condition check. |
| 5 | `q2_comparison_alarm` | Alarm System | Intermediate | 50 | `comparisons`, `booleans`, `if` | `q2_boss_firewall` | Program the alarm to trigger only when specific compound conditions are true. |
| 6 | `q2_boss_firewall` | **BOSS: The Firewall** | Boss | 200 | `if`, `elif`, `else`, `booleans`, `comparisons` | `q3_for_patrol` | Build a firewall that inspects incoming data and blocks threats using conditional logic. |

---

### Level 3: "Patrol Loops" — `for`, `while`, `range()`

> **Story beat:** Glitch Bugs are multiplying. Script-Kitten needs to automate patrols using loops to scan entire sectors of the digital world.

| # | Quest ID | Title | Difficulty | XP | Tags | Unlocks | Narrative Hook |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 1 | `q3_for_patrol` | Sector Patrol | Beginner | 10 | `for`, `range` | `q3_while_guard` | Use a `for` loop to patrol all 10 sectors of the network grid. |
| 2 | `q3_while_guard` | The Guard Loop | Beginner | 10 | `while`, `booleans` | `q3_range_radar` | A guard must watch the gate `while` the threat level is high. |
| 3 | `q3_range_radar` | Radar Sweep | Intermediate | 50 | `for`, `range`, `conditionals` | `q3_nested_grid` | Sweep through frequencies using `range()` and flag any anomalies with conditionals. |
| 4 | `q3_nested_grid` | Grid Search | Intermediate | 50 | `nested loops`, `for` | `q3_break_escape` | Search a 2D grid for hidden glitch eggs using nested `for` loops. |
| 5 | `q3_break_escape` | Emergency Escape | Intermediate | 50 | `while`, `break`, `continue` | `q3_boss_swarm` | Navigate an escape route — `break` out when you find the exit, `continue` past dead ends. |
| 6 | `q3_boss_swarm` | **BOSS: The Glitch Swarm** | Boss | 200 | `for`, `while`, `range`, `break`, `conditionals` | `q4_func_spell` | Write a patrol bot that scans, classifies, and eliminates an entire swarm of glitches. |

---

### Level 4: "Crafting Spells" — Functions, Parameters, Return Values

> **Story beat:** Script-Kitten discovers the Spell Library — where reusable code spells are stored. Learning to craft functions lets the kitten build powerful, reusable tools.

| # | Quest ID | Title | Difficulty | XP | Tags | Unlocks | Narrative Hook |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 1 | `q4_func_spell` | Your First Spell | Beginner | 10 | `def`, `functions` | `q4_params_potion` | Create your first function — a spell that greets anyone by name. |
| 2 | `q4_params_potion` | Potion Mixer | Beginner | 10 | `parameters`, `arguments` | `q4_return_treasure` | Write a function that takes ingredient parameters and mixes a potion. |
| 3 | `q4_return_treasure` | Treasure Calculator | Intermediate | 50 | `return`, `functions`, `math` | `q4_multi_tools` | Build a function that calculates treasure value and `return`s the result. |
| 4 | `q4_multi_tools` | The Multi-Tool | Intermediate | 50 | `multiple functions`, `calling functions` | `q4_default_shield` | Craft multiple small functions that work together — a toolkit for the kitten. |
| 5 | `q4_default_shield` | Shield Generator | Intermediate | 50 | `default parameters`, `conditionals`, `functions` | `q4_boss_spellbook` | Create a shield function with default power settings that can be customized. |
| 6 | `q4_boss_spellbook` | **BOSS: The Spell Book** | Boss | 200 | `functions`, `parameters`, `return`, `conditionals`, `loops` | `q5_list_inventory` | Build a complete spell book — a collection of functions that solve a multi-part challenge. |

---

### Level 5: "The Final Compile" — Lists, Data Structures, Capstone

> **Story beat:** The Source Code — the heart of the digital world — is shattered into fragments stored in lists. Script-Kitten must master data structures to reassemble the code and save the world.

| # | Quest ID | Title | Difficulty | XP | Tags | Unlocks | Narrative Hook |
|:---|:---|:---|:---|:---|:---|:---|:---|
| 1 | `q5_list_inventory` | Fragment Collector | Beginner | 10 | `lists`, `indexing` | `q5_list_methods` | Collect code fragments into a list and access them by index. |
| 2 | `q5_list_methods` | The Sorting Hat | Beginner | 10 | `lists`, `append`, `sort`, `len` | `q5_list_loops` | Use list methods to organize the collected fragments in the right order. |
| 3 | `q5_list_loops` | Fragment Assembly | Intermediate | 50 | `lists`, `for loops`, `conditionals` | `q5_list_functions` | Loop through the fragment list, filter out corrupted pieces, and build the sequence. |
| 4 | `q5_list_functions` | The Analyzer | Intermediate | 50 | `lists`, `functions`, `return` | `q5_dict_database` | Write functions that analyze lists — find the min, max, sum, and average of data. |
| 5 | `q5_dict_database` | The Data Vault | Intermediate | 50 | `dictionaries`, `key-value` | `q5_boss_source_code` | Store fragment metadata in dictionaries — each fragment has a name, sector, and status. |
| 6 | `q5_boss_source_code` | **BOSS: Recompile the Source Code** | Boss | 200 | `lists`, `dictionaries`, `functions`, `loops`, `conditionals` | — | The final challenge: use everything you've learned to reassemble and recompile the Source Code, saving the digital world. |

---

## 3. Final Boss Projects

Each level's Boss quest is a capstone project that combines all concepts taught in that level. Boss quests award 200 XP and a unique badge.

| Level | Boss Quest ID | Title | Badge Name | `requirementSlug` | `iconSlug` | Description |
|:---|:---|:---|:---|:---|:---|:---|
| 1 | `q1_boss_reboot` | System Reboot | System Architect | `BOSS_LEVEL_1` | `trophy-reboot` | Awarded for rebooting the central system using variables, strings, and math. |
| 2 | `q2_boss_firewall` | The Firewall | Firewall Builder | `BOSS_LEVEL_2` | `trophy-firewall` | Awarded for building the firewall using conditional logic. |
| 3 | `q3_boss_swarm` | The Glitch Swarm | Swarm Slayer | `BOSS_LEVEL_3` | `trophy-swarm` | Awarded for eliminating the glitch swarm using loops and automation. |
| 4 | `q4_boss_spellbook` | The Spell Book | Spell Crafter | `BOSS_LEVEL_4` | `trophy-spellbook` | Awarded for completing the spell book using functions and parameters. |
| 5 | `q5_boss_source_code` | Recompile the Source Code | World Saver | `BOSS_LEVEL_5` | `trophy-source` | Awarded for saving the digital world using lists, dicts, functions, and loops. |

**Boss Badge `xpBonus`:** Each Boss badge grants an additional `50 XP` bonus on top of the 200 XP quest reward.

---

## 4. Narrative Arc: "The Script-Kitten Chronicles"

### Synopsis

In a digital world called **Codexia**, a catastrophic glitch has corrupted the Source Code that keeps everything running. You play as **Script-Kitten** — a small but clever AI cat who was the last program compiled before the crash. Guided by the wise (and slightly glitchy) **Guardian Robot**, Script-Kitten must learn the language of the ancients — Python — to repair the world one quest at a time.

### Characters

| Character | Role | Description |
|:---|:---|:---|
| **Script-Kitten** | The Player | A curious, determined AI kitten. Small but mighty. Speaks in encouraging, can-do phrases. Represents the student's avatar in the story. |
| **Guardian Robot** | Mentor / Quest Giver | An ancient security bot who guards the gates between sectors. Damaged by the glitch, it speaks in fragmented riddles but always guides the kitten in the right direction. Appears in Level 1 quests and reappears at boss fights. |
| **Glitch Bugs** | Antagonists | Small, mischievous creatures born from corrupted code. They appear as visual errors, scrambled data, and broken logic. Each level's bugs are themed to the Python concept being taught. |
| **The Compiler** | Final Boss / Narrator | The mysterious entity that once compiled the Source Code. Its voice narrates story beats between levels. It is neither friend nor foe — it simply enforces the rules of the code. |

### Per-Level Story Beats

| Level | Story Beat | Setting |
|:---|:---|:---|
| **1: Booting the System** | Script-Kitten wakes up in a dark, offline world. The Guardian Robot is at the main gate, barely functional. Together they restore basic systems — power, communication, inventory — using variables and print statements. | The Boot Sector — a dim, industrial server room slowly flickering to life. |
| **2: Scanning for Glitches** | The system is online but crawling with Glitch Bugs. The Guardian teaches the kitten to think logically — to classify, sort, and decide. The kitten builds its first real tool: a conditional scanner. | The Detection Grid — a neon-lit scanning station full of monitors and data feeds. |
| **3: Patrol Loops** | The Glitch Bugs are multiplying faster than the kitten can fix them one-by-one. The Guardian reveals the power of loops — automating patrols to scan entire sectors at once. | The Outer Sectors — vast digital landscapes that stretch in repeating patterns. |
| **4: Crafting Spells** | Deep in the system, Script-Kitten discovers the Spell Library — an ancient repository of reusable code. Here, the kitten learns to define functions: portable, powerful spells that can be invoked anywhere. | The Spell Library — a majestic hall of floating code scrolls and glowing function orbs. |
| **5: The Final Compile** | The Source Code is found — shattered into fragments scattered across data structures. Script-Kitten must use everything learned to collect, organize, analyze, and reassemble the code. The Compiler awakens for the final test. | The Core — the pulsing heart of Codexia, a cathedral of raw data streams and crystallized logic. |

### How Narrative Appears in Quests

- **`narrative_text` field:** Each quest's YAML frontmatter includes a `narrative_text` string (per `QUEST_FORMAT_SPEC.md` Section 1). This is displayed in the Instructions panel as a styled callout box (per `UI_COMPONENT_MAP.md` Section 4) to set the RPG scene before the technical instructions.
- **Quest body:** The Markdown body of each quest weaves the technical instructions into the narrative (e.g., "The Guardian needs you to store the password in a variable").
- **Test assertion messages:** Failure messages use in-world language (e.g., "Glitch! The Guardian can't find a variable named 'password'" — per `QUEST_FORMAT_SPEC.md` Section 3).

---

## 5. Achievement / Badge Definitions

All badges use the `Achievement` model fields from `DATA_MODEL.md` Section 1: `name`, `description`, `iconSlug`, `requirementSlug`, `xpBonus`.

The `requirementSlug` follows the `CATEGORY_CRITERIA_VALUE` format from `DATA_MODEL.md` Section 3.

### Boss Completion Badges

| Name | Description | `iconSlug` | `requirementSlug` | `xpBonus` |
|:---|:---|:---|:---|:---|
| System Architect | Rebooted the central system | `trophy-reboot` | `BOSS_LEVEL_1` | 50 |
| Firewall Builder | Built the security firewall | `trophy-firewall` | `BOSS_LEVEL_2` | 50 |
| Swarm Slayer | Eliminated the Glitch Swarm | `trophy-swarm` | `BOSS_LEVEL_3` | 50 |
| Spell Crafter | Completed the Spell Book | `trophy-spellbook` | `BOSS_LEVEL_4` | 50 |
| World Saver | Recompiled the Source Code and saved Codexia | `trophy-source` | `BOSS_LEVEL_5` | 50 |

### Quest Milestone Badges

| Name | Description | `iconSlug` | `requirementSlug` | `xpBonus` |
|:---|:---|:---|:---|:---|
| First Steps | Completed your first quest | `badge-first` | `QUEST_COUNT_1` | 10 |
| Getting Started | Completed 5 quests | `badge-five` | `QUEST_COUNT_5` | 25 |
| Adventurer | Completed 10 quests | `badge-ten` | `QUEST_COUNT_10` | 50 |
| Quest Master | Completed 20 quests | `badge-twenty` | `QUEST_COUNT_20` | 75 |
| Legend of Codexia | Completed all 30 quests | `badge-all` | `QUEST_COUNT_30` | 200 |

### Streak Badges

| Name | Description | `iconSlug` | `requirementSlug` | `xpBonus` |
|:---|:---|:---|:---|:---|
| On a Roll | Maintained a 3-day streak | `streak-three` | `STREAK_DAYS_3` | 15 |
| Dedicated Coder | Maintained a 7-day streak | `streak-seven` | `STREAK_DAYS_7` | 30 |
| Unstoppable | Maintained a 14-day streak | `streak-fourteen` | `STREAK_DAYS_14` | 50 |
| Marathon Runner | Maintained a 30-day streak | `streak-thirty` | `STREAK_DAYS_30` | 100 |

### Level Milestone Badges

| Name | Description | `iconSlug` | `requirementSlug` | `xpBonus` |
|:---|:---|:---|:---|:---|
| Apprentice | Reached Level 2 | `level-two` | `LEVEL_REACHED_2` | 10 |
| Coder | Reached Level 3 | `level-three` | `LEVEL_REACHED_3` | 25 |
| Hacker | Reached Level 5 | `level-five` | `LEVEL_REACHED_5` | 50 |
| Elite | Reached Level 8 | `level-eight` | `LEVEL_REACHED_8` | 75 |
| Grandmaster | Reached Level 10 | `level-ten` | `LEVEL_REACHED_10` | 100 |

### Speed Run Badges

| Name | Description | `iconSlug` | `requirementSlug` | `xpBonus` |
|:---|:---|:---|:---|:---|
| Quick Fix | Completed a quest in under 60 seconds | `speed-one` | `SPEED_SECONDS_60` | 15 |
| Lightning Coder | Completed a quest in under 30 seconds | `speed-half` | `SPEED_SECONDS_30` | 30 |

**Total badges:** 22 (5 Boss + 5 Quest Milestone + 4 Streak + 5 Level Milestone + 2 Speed Run + 1 completion).

> **Note:** Speed Run badges use the `timeTaken` field from the `QuestAttempt` model (`DATA_MODEL.md`). The timer starts when the quest loads and ends when the student clicks "Submit."
