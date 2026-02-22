export interface TestResult {
  testName: string;
  passed: boolean;
  message?: string;
}

export interface TestRunResult {
  passed: boolean;
  results: TestResult[];
}

type RunPythonFn = (code: string) => Promise<{
  stdout: string;
  stderr: string;
  success: boolean;
}>;

/**
 * Runs the quest test suite against student code inside the Pyodide runtime.
 *
 * Flow:
 * 1. Execute the student's code to capture its namespace and stdout.
 * 2. Build a `user_code` fixture (SimpleNamespace with namespace, stdout, source).
 * 3. Load the test file, discover test_* functions, run each with user_code.
 * 4. Return structured pass/fail results.
 */
export async function runTests(
  studentCode: string,
  testCode: string,
  runPython: RunPythonFn,
): Promise<TestRunResult> {
  const escapedCode = JSON.stringify(studentCode);
  const escapedTestCode = JSON.stringify(
    testCode.replace(/^import pytest\s*$/gm, ""),
  );

  const runnerScript = `
import json, types, sys, io

# ── Step 1: Execute student code to capture namespace & stdout ──
__cq_ns__ = {}
__cq_out__ = io.StringIO()
__old_stdout__ = sys.stdout
sys.stdout = __cq_out__

try:
    exec(${escapedCode}, __cq_ns__)
except Exception as __cq_exec_err__:
    sys.stdout = __old_stdout__
    print(json.dumps({
        "passed": False,
        "results": [{
            "testName": "__exec__",
            "passed": False,
            "message": f"{type(__cq_exec_err__).__name__}: {str(__cq_exec_err__)}"
        }]
    }))
else:
    sys.stdout = __old_stdout__
    __cq_stdout_val__ = __cq_out__.getvalue()

    # ── Step 2: Build user_code fixture ──
    user_code = types.SimpleNamespace(
        namespace={k: v for k, v in __cq_ns__.items() if not k.startswith("__")},
        stdout=__cq_stdout_val__,
        source=${escapedCode}
    )

    # ── Step 3: Load and run tests ──
    __test_ns__ = {}
    exec(${escapedTestCode}, __test_ns__)

    __results__ = []
    for __name__, __fn__ in sorted(__test_ns__.items()):
        if __name__.startswith("test_") and callable(__fn__):
            try:
                __fn__(user_code)
                __results__.append({"testName": __name__, "passed": True})
            except AssertionError as __ae__:
                __results__.append({"testName": __name__, "passed": False, "message": str(__ae__)})
            except Exception as __ex__:
                __results__.append({"testName": __name__, "passed": False, "message": f"{type(__ex__).__name__}: {str(__ex__)}"})

    print(json.dumps({
        "passed": all(__r__["passed"] for __r__ in __results__),
        "results": __results__
    }))
`;

  const result = await runPython(runnerScript);

  try {
    const output = result.stdout.trim();
    const lastLine = output.split("\n").pop() ?? "";
    return JSON.parse(lastLine) as TestRunResult;
  } catch {
    return {
      passed: false,
      results: [
        {
          testName: "__runner__",
          passed: false,
          message: result.stderr || "Test runner failed to produce results.",
        },
      ],
    };
  }
}
