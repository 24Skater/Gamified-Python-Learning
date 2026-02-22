"""Server-side Python code execution and test grading.

Executes student code in a restricted namespace with stdout capture,
then runs the quest test suite against the resulting user_code fixture.
"""

import io
import sys
import types
from concurrent.futures import ProcessPoolExecutor, TimeoutError as FuturesTimeout
from dataclasses import dataclass, field

MAX_CODE_SIZE = 10 * 1024  # 10 KB
EXECUTION_TIMEOUT = 10  # seconds


@dataclass
class TestResult:
    test_name: str
    passed: bool
    message: str = ""


@dataclass
class GradeResult:
    passed: bool
    results: list[TestResult] = field(default_factory=list)
    error_type: str = ""
    hint: str = ""
    traceback_str: str = ""


def _execute_and_grade(code: str, test_code: str) -> dict:
    """Run student code + tests in an isolated process.

    Returns a dict so it can be pickled across process boundaries.
    """
    import re

    user_ns: dict = {}
    captured_stdout = io.StringIO()

    old_stdout = sys.stdout
    sys.stdout = captured_stdout

    try:
        exec(code, user_ns)  # noqa: S102
    except Exception as exc:
        sys.stdout = old_stdout
        return {
            "passed": False,
            "error_type": type(exc).__name__,
            "hint": str(exc),
            "traceback_str": f"{type(exc).__name__}: {exc}",
            "results": [],
        }
    finally:
        sys.stdout = old_stdout

    stdout_val = captured_stdout.getvalue()

    user_code = types.SimpleNamespace(
        namespace={k: v for k, v in user_ns.items() if not k.startswith("__")},
        stdout=stdout_val,
        source=code,
    )

    clean_test = re.sub(r"^import pytest\s*$", "", test_code, flags=re.MULTILINE)
    test_ns: dict = {}
    try:
        exec(clean_test, test_ns)  # noqa: S102
    except Exception as exc:
        return {
            "passed": False,
            "error_type": "TestLoadError",
            "hint": f"Failed to load test suite: {exc}",
            "traceback_str": f"{type(exc).__name__}: {exc}",
            "results": [],
        }

    results: list[dict] = []
    for name in sorted(test_ns):
        fn = test_ns[name]
        if name.startswith("test_") and callable(fn):
            try:
                fn(user_code)
                results.append({"test_name": name, "passed": True, "message": ""})
            except AssertionError as ae:
                results.append(
                    {"test_name": name, "passed": False, "message": str(ae)}
                )
            except Exception as ex:
                results.append(
                    {
                        "test_name": name,
                        "passed": False,
                        "message": f"{type(ex).__name__}: {ex}",
                    }
                )

    all_passed = all(r["passed"] for r in results)
    first_fail = next((r for r in results if not r["passed"]), None)

    return {
        "passed": all_passed,
        "results": results,
        "error_type": "AssertionError" if first_fail else "",
        "hint": first_fail["message"] if first_fail else "",
        "traceback_str": "",
    }


def grade_submission(code: str, test_code: str) -> GradeResult:
    """Grade a student submission with process isolation and timeout."""
    if len(code.encode("utf-8")) > MAX_CODE_SIZE:
        return GradeResult(
            passed=False,
            error_type="ValidationError",
            hint="Your code is too large! Please keep it under 10 KB.",
        )

    try:
        with ProcessPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_execute_and_grade, code, test_code)
            raw = future.result(timeout=EXECUTION_TIMEOUT)
    except FuturesTimeout:
        return GradeResult(
            passed=False,
            error_type="TimeoutError",
            hint="Your code took too long! It might be stuck in a loop.",
        )
    except Exception as exc:
        return GradeResult(
            passed=False,
            error_type=type(exc).__name__,
            hint=str(exc),
            traceback_str=f"{type(exc).__name__}: {exc}",
        )

    return GradeResult(
        passed=raw["passed"],
        results=[
            TestResult(
                test_name=r["test_name"],
                passed=r["passed"],
                message=r.get("message", ""),
            )
            for r in raw.get("results", [])
        ],
        error_type=raw.get("error_type", ""),
        hint=raw.get("hint", ""),
        traceback_str=raw.get("traceback_str", ""),
    )
