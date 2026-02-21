# Quest Content Format Specification

All quests are stored in the `/content` directory, organized by level folders. Each quest consists of two files:

* **`quest_x.md`** — The narrative, instructions, and starter code.
* **`test_x.py`** — The hidden test suite that validates the student's solution.

---

## 1. Frontmatter Requirements (YAML)

Every `.md` file must start with a YAML frontmatter block. This metadata is used by the frontend to render the Skill Tree and the XP system.

| Field | Type | Description |
|:---|:---|:---|
| `id` | String | Unique identifier (e.g., `var_01`). |
| `title` | String | The name of the quest. |
| `level` | Integer | The recommended player level. |
| `xp_reward` | Integer | XP granted upon first successful completion. |
| `difficulty` | String | `Beginner`, `Intermediate`, or `Boss`. |
| `narrative_text` | String | A short "hook" to set the scene. |
| `tags` | List | Keywords like `variables`, `strings`, `math`. |
| `unlocks` | List | IDs of quests that become available after this one. |

---

## 2. Starter Code Embedding

Starter code must be wrapped in a standard Markdown code block with the identifier `` ```python starter ``. This allows the parser to distinguish between "Example Code" (regular `` ```python ``) and the "Initial Code" that appears in the student's editor.

````markdown
```python starter
# Write your code below!
variable_name = "Change me!"
```
````

---

## 3. The Test Suite (`test_x.py`)

Tests are written in standard Python using `pytest` or `unittest`.

* **Accessibility:** Use descriptive test function names.
* **Feedback:** Use the assertion message to provide "Glitch Hints" for the student.

### The `user_code` Fixture

All test functions receive a custom `user_code` fixture that provides access to the student's executed code:

* **`user_code.namespace`** — A dictionary of all variables and functions the student's code defined (similar to Python's `globals()` after running the code).
* **`user_code.stdout`** — Captured `print()` output as a string.
* **`user_code.source`** — The raw source code the student submitted.

This fixture is provided by the project's custom test runner (both the Pyodide client-side runner and the FastAPI server-side runner must implement it identically).

---

## 4. Complete Example: "The Guardian's Password"

### `content/level_1/quest_01.md`

````markdown
---
id: q1_variables_password
title: The Guardian's Password
level: 1
xp_reward: 100
difficulty: Beginner
narrative_text: "The gate to the Whispering Woods is locked. The Guardian Robot requires a specific password stored in a variable to let you pass."
tags: ["variables", "strings"]
unlocks: ["q2_logic_gate"]
---

### The Mission
The Guardian Robot is looking for a variable named `password`.
It needs to be a **string** and its value must be exactly `"CodeQuest2026"`.

### Instructions
1. Create a variable called `password`.
2. Assign it the value `"CodeQuest2026"`.
3. Ensure the capitalization is exact!

```python starter
# The Guardian stares at you...
# Define your password variable below:

```
````

### `content/level_1/test_01.py`

```python
import pytest


def test_variable_exists(user_code):
    """Check if the student defined the variable 'password'."""
    assert "password" in user_code.namespace, \
        "Glitch! The Guardian can't find a variable named 'password'. Did you check your spelling?"


def test_variable_value(user_code):
    """Check if the password value is correct."""
    expected = "CodeQuest2026"
    actual = user_code.namespace.get("password")

    assert actual == expected, \
        f"Access Denied! Your password was '{actual}', but the Guardian is looking for '{expected}'."


def test_is_string(user_code):
    """Ensure the student used a string, not an integer or other type."""
    actual = user_code.namespace.get("password")
    assert isinstance(actual, str), \
        "The Guardian is confused. Passwords must be text (strings), so make sure to use quote marks!"
```

---

## 5. Technical Implementation for Cursor

When the system loads a quest:

1. **Frontend:** Parse the `.md` file using `gray-matter` to extract YAML frontmatter and Markdown body.
2. **Frontend:** Display the Markdown body in the "Instructions" pane.
3. **Frontend:** Inject the `` ```python starter `` block into the Monaco Editor as editable initial code.
4. **Client-Side (Pyodide):** When "Run" is clicked, Pyodide executes the student's code and runs a subset of tests for instant pass/fail feedback.
5. **Server-Side (FastAPI):** When client-side tests pass, the code is sent to `POST /api/v1/quests/{id}/submit` for trusted re-verification before XP is awarded (see `API_SPECIFICATION.md` and `pdr_cursor_spec.md` Section 5B).
