"use client";

import { useState, useRef, useCallback } from "react";

const PYODIDE_VERSION = "0.29.3";
const PYODIDE_CDN_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const EXECUTION_TIMEOUT_MS = 10_000;

interface RunResult {
  stdout: string;
  stderr: string;
  success: boolean;
}

// Pyodide instance type — kept loose to avoid importing server-incompatible types
type PyodideInstance = {
  runPythonAsync: (code: string) => Promise<unknown>;
  runPython: (code: string) => unknown;
  globals: { get: (key: string) => unknown };
};

export function usePyodide() {
  const pyodideRef = useRef<PyodideInstance | null>(null);
  const loadingPromiseRef = useRef<Promise<PyodideInstance> | null>(null);

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const ensureLoaded = useCallback(async (): Promise<PyodideInstance> => {
    if (pyodideRef.current) return pyodideRef.current;

    if (loadingPromiseRef.current) return loadingPromiseRef.current;

    setLoading(true);
    setError(null);

    const promise = (async () => {
      // Dynamic import keeps Pyodide out of the server bundle
      const { loadPyodide } = await import("pyodide");
      const instance = await loadPyodide({
        indexURL: PYODIDE_CDN_URL,
      });
      pyodideRef.current = instance as unknown as PyodideInstance;
      setReady(true);
      setLoading(false);
      return pyodideRef.current;
    })();

    loadingPromiseRef.current = promise;

    try {
      return await promise;
    } catch (err) {
      loadingPromiseRef.current = null;
      setLoading(false);
      const msg = err instanceof Error ? err.message : "Failed to load Python engine";
      setError(msg);
      throw err;
    }
  }, []);

  const runPython = useCallback(
    async (code: string): Promise<RunResult> => {
      setIsRunning(true);

      try {
        const pyodide = await ensureLoaded();

        // Set up stdout/stderr capture via StringIO
        pyodide.runPython(`
import sys, io
__cq_stdout = io.StringIO()
__cq_stderr = io.StringIO()
sys.stdout = __cq_stdout
sys.stderr = __cq_stderr
`);

        // Race the user code against a timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(
            () => reject(new Error("TimeoutError")),
            EXECUTION_TIMEOUT_MS,
          );
        });

        try {
          await Promise.race([
            pyodide.runPythonAsync(code),
            timeoutPromise,
          ]);
        } catch (err) {
          const errMsg =
            err instanceof Error ? err.message : String(err);

          if (errMsg === "TimeoutError") {
            pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);
            return {
              stdout: "",
              stderr:
                "TimeoutError: Your code took too long! It might be stuck in a loop. Check your `while` condition or loop logic.",
              success: false,
            };
          }

          // Python exceptions surface here — capture whatever stdout was produced
          const stdout = pyodide.runPython(
            "__cq_stdout.getvalue()",
          ) as string;

          pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

          return { stdout: stdout ?? "", stderr: errMsg, success: false };
        }

        // Success path — read captured output
        const stdout = pyodide.runPython(
          "__cq_stdout.getvalue()",
        ) as string;
        const stderr = pyodide.runPython(
          "__cq_stderr.getvalue()",
        ) as string;

        pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

        return {
          stdout: stdout ?? "",
          stderr: stderr ?? "",
          success: !stderr,
        };
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "An unexpected error occurred";
        return { stdout: "", stderr: msg, success: false };
      } finally {
        setIsRunning(false);
      }
    },
    [ensureLoaded],
  );

  return { loading, ready, error, isRunning, runPython };
}
