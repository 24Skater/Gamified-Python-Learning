"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Play, Send, ScrollText, Code2, Terminal as TerminalIcon } from "lucide-react";
import { usePyodide } from "@/hooks/usePyodide";
import TerminalOutput from "@/components/TerminalOutput";
import GlitchReport from "@/components/GlitchReport";
import { parseGlitch, type GlitchInfo } from "@/lib/errorParser";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-900 text-gray-500">
      Loading editor...
    </div>
  ),
});

const DEFAULT_CODE = `# Write your Python code here\nprint("Hello, World!")`;

type MobileTab = "instructions" | "editor" | "terminal";

export default function QuestPlayPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [glitch, setGlitch] = useState<GlitchInfo | null>(null);
  const [mobileTab, setMobileTab] = useState<MobileTab>("editor");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { loading, ready, isRunning, runPython } = usePyodide();

  const handleRun = useCallback(async () => {
    setStdout("");
    setStderr("");
    setGlitch(null);

    const result = await runPython(code);

    setStdout(result.stdout);
    setStderr(result.stderr);

    if (!result.success && result.stderr) {
      setGlitch(parseGlitch(result.stderr));
    }
  }, [code, runPython]);

  const handleClear = useCallback(() => {
    setStdout("");
    setStderr("");
    setGlitch(null);
  }, []);

  const runDisabled = loading || isRunning;

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      {/* ──── Top Bar ──── */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Tablet: drawer toggle for instructions */}
          <button
            onClick={() => setDrawerOpen((o) => !o)}
            className="hidden rounded-lg border border-gray-700 p-2 text-gray-400 transition hover:bg-gray-800 hover:text-gray-200 md:block lg:hidden"
            title="Toggle instructions"
          >
            <ScrollText className="h-4 w-4" />
          </button>
          <h1 className="font-display text-sm text-gray-100 lg:text-lg">
            Quest Loading...
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={runDisabled}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-white shadow-neon-green transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="h-4 w-4" />
            <span className="hidden sm:inline">
              {loading ? "Loading..." : isRunning ? "Running..." : "Run"}
            </span>
          </button>
          <button
            disabled
            title="Pass all tests first!"
            className="flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white opacity-50 cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Submit</span>
          </button>
        </div>
      </div>

      {/* ──── Mobile Tab Bar ──── */}
      <div className="flex border-b border-gray-700 md:hidden">
        {(
          [
            { id: "instructions" as const, label: "Instructions", icon: ScrollText },
            { id: "editor" as const, label: "Editor", icon: Code2 },
            { id: "terminal" as const, label: "Terminal", icon: TerminalIcon },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMobileTab(id)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition ${
              mobileTab === id
                ? "border-b-2 border-violet-500 text-violet-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* ──── Main Content ──── */}
      <div className="relative flex-1 overflow-hidden">
        {/* Tablet slide-out drawer */}
        {drawerOpen && (
          <>
            <div
              className="absolute inset-0 z-20 bg-black/50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 z-30 w-80 overflow-y-auto border-r border-gray-700 bg-gray-900 p-6 shadow-xl lg:hidden">
              <InstructionsPanel />
            </div>
          </>
        )}

        {/* ─── Desktop: three-panel ─── */}
        <div className="hidden h-full lg:grid lg:grid-cols-[1fr_2fr_1fr]">
          <div className="overflow-y-auto border-r border-gray-700 bg-gray-900 p-6">
            <InstructionsPanel />
          </div>
          <div className="overflow-hidden">
            <CodeEditor initialCode={DEFAULT_CODE} onChange={setCode} />
          </div>
          <div className="border-l border-gray-700">
            <TerminalOutput
              stdout={stdout}
              stderr={stderr}
              isRunning={isRunning}
              pyodideLoading={loading}
              onClear={handleClear}
            />
            {glitch && (
              <GlitchReport
                errorType={glitch.errorType}
                hint={glitch.hint}
                category={glitch.category}
              />
            )}
          </div>
        </div>

        {/* ─── Tablet: two-panel ─── */}
        <div className="hidden h-full md:grid md:grid-cols-2 lg:hidden">
          <div className="overflow-hidden">
            <CodeEditor initialCode={DEFAULT_CODE} onChange={setCode} />
          </div>
          <div className="border-l border-gray-700">
            <TerminalOutput
              stdout={stdout}
              stderr={stderr}
              isRunning={isRunning}
              pyodideLoading={loading}
              onClear={handleClear}
            />
            {glitch && (
              <GlitchReport
                errorType={glitch.errorType}
                hint={glitch.hint}
                category={glitch.category}
              />
            )}
          </div>
        </div>

        {/* ─── Mobile: single panel via tabs ─── */}
        <div className="h-full md:hidden">
          {mobileTab === "instructions" && (
            <div className="h-full overflow-y-auto bg-gray-900 p-4">
              <InstructionsPanel />
            </div>
          )}
          {mobileTab === "editor" && (
            <div className="h-full overflow-hidden">
              <CodeEditor initialCode={DEFAULT_CODE} onChange={setCode} />
            </div>
          )}
          {mobileTab === "terminal" && (
            <div className="h-full">
              <TerminalOutput
                stdout={stdout}
                stderr={stderr}
                isRunning={isRunning}
                pyodideLoading={loading}
                onClear={handleClear}
              />
              {glitch && (
                <GlitchReport
                  errorType={glitch.errorType}
                  hint={glitch.hint}
                  category={glitch.category}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ──── Bottom Bar ──── */}
      <div className="border-t border-gray-700 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-display text-xs text-violet-400">Lv.1</span>
          <div className="flex-1">
            <div className="h-3 rounded-full bg-gray-800">
              <div
                className="h-3 rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
                style={{ width: "0%" }}
              />
            </div>
          </div>
          <span className="font-mono text-xs text-gray-400">0 / 100 XP</span>
        </div>
      </div>

      {/* ──── Mobile: sticky Run/Submit bar ──── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-center gap-3 border-t border-gray-700 bg-gray-900 px-4 py-3 md:hidden">
        <button
          onClick={handleRun}
          disabled={runDisabled}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-semibold text-white shadow-neon-green transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {loading ? "Loading..." : isRunning ? "Running..." : "Run"}
        </button>
        <button
          disabled
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-500 py-3 font-semibold text-white opacity-50 cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          Submit
        </button>
      </div>
    </div>
  );
}

function InstructionsPanel() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-base text-gray-100">Instructions</h2>
      <div className="rounded-r-lg border-l-4 border-violet-500 bg-violet-500/10 p-4 italic text-gray-200">
        Your quest instructions will appear here once quest content is loaded in
        Step 4.
      </div>
      <p className="text-lg leading-relaxed text-gray-400">
        Instructions will load here. For now, use the editor to write Python
        code and click <strong className="text-emerald-400">Run</strong> to
        execute it.
      </p>
    </div>
  );
}
