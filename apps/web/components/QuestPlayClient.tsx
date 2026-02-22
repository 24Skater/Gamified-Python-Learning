"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Play,
  Send,
  ScrollText,
  Code2,
  Terminal as TerminalIcon,
  Zap,
  Loader2,
} from "lucide-react";
import { usePyodide } from "@/hooks/usePyodide";
import TerminalOutput from "@/components/TerminalOutput";
import GlitchReport from "@/components/GlitchReport";
import QuestSuccess from "@/components/QuestSuccess";
import { parseGlitch, type GlitchInfo } from "@/lib/errorParser";
import { runTests, type TestRunResult } from "@/lib/testRunner";
import type { QuestMeta } from "@/lib/questParser";

const CodeEditor = dynamic(() => import("@/components/CodeEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-900 text-gray-500">
      Loading editor...
    </div>
  ),
});

const DIFFICULTY_BADGE: Record<string, string> = {
  Beginner:
    "bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full",
  Intermediate:
    "bg-violet-500/20 text-violet-400 text-xs font-semibold px-2 py-0.5 rounded-full",
  Boss: "bg-rose-500/20 text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
};

interface QuestPlayClientProps {
  meta: QuestMeta;
  instructions: string;
  starterCode: string;
  testCode: string;
}

type MobileTab = "instructions" | "editor" | "terminal";

interface SubmitResponse {
  status: "success" | "fail";
  xp_earned?: number;
  level_up?: boolean;
  new_level?: number | null;
  unlocked_badges?: string[];
  feedback?: string;
  error_type?: string;
  hint?: string;
  traceback?: string;
}

export default function QuestPlayClient({
  meta,
  instructions,
  starterCode,
  testCode,
}: QuestPlayClientProps) {
  const [code, setCode] = useState(starterCode);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [glitch, setGlitch] = useState<GlitchInfo | null>(null);
  const [testsPassed, setTestsPassed] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("editor");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);

  const { loading, isRunning, runPython } = usePyodide();

  const handleRun = useCallback(async () => {
    setStdout("");
    setStderr("");
    setGlitch(null);
    setTestsPassed(false);
    setSubmitResult(null);

    const result = await runPython(code);

    if (!result.success && result.stderr) {
      setStdout(result.stdout);
      setStderr(result.stderr);
      setGlitch(parseGlitch(result.stderr));
      return;
    }

    setStdout(result.stdout);

    const testResult: TestRunResult = await runTests(code, testCode, runPython);

    if (testResult.passed) {
      setTestsPassed(true);
      setStdout(
        (prev) =>
          prev +
          (prev ? "\n" : "") +
          "──────────────────────────\n" +
          "All tests passed! You may now submit.\n"
      );
    } else {
      const failedTest = testResult.results.find((r) => !r.passed);
      if (failedTest?.message) {
        const glitchInfo: GlitchInfo = {
          errorType: "AssertionError",
          category: "QuestGlitch",
          hint: failedTest.message,
        };
        setGlitch(glitchInfo);
      }
      setStdout(
        (prev) =>
          prev +
          (prev ? "\n" : "") +
          "──────────────────────────\n" +
          `Tests: ${testResult.results.filter((r) => r.passed).length}/${testResult.results.length} passed\n`
      );
    }
  }, [code, testCode, runPython]);

  const handleSubmit = useCallback(async () => {
    if (!testsPassed || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch(`/api/quests/${meta.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quest_id: meta.id,
          code,
          language_version: "3.11",
        }),
      });
      const data: SubmitResponse = await res.json();
      setSubmitResult(data);

      if (data.status === "fail" && data.hint) {
        setGlitch({
          errorType: data.error_type ?? "ServerError",
          category: "QuestGlitch",
          hint: data.hint,
        });
      }
    } catch {
      setGlitch({
        errorType: "NetworkError",
        category: "RuntimeGlitch",
        hint: "Connection lost! Your code is safe — try submitting again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [testsPassed, isSubmitting, meta.id, code]);

  const handleClear = useCallback(() => {
    setStdout("");
    setStderr("");
    setGlitch(null);
    setSubmitResult(null);
  }, []);

  const runDisabled = loading || isRunning;
  const submitDisabled = !testsPassed || isSubmitting || isRunning;

  const terminalPanel = (
    <>
      <TerminalOutput
        stdout={stdout}
        stderr={stderr}
        isRunning={isRunning}
        pyodideLoading={loading}
        onClear={handleClear}
      />
      {submitResult?.status === "success" ? (
        <QuestSuccess
          xpEarned={submitResult.xp_earned ?? 0}
          feedback={submitResult.feedback ?? "Quest Complete!"}
          questId={meta.id}
        />
      ) : (
        glitch && (
          <GlitchReport
            errorType={glitch.errorType}
            hint={glitch.hint}
            category={glitch.category}
          />
        )
      )}
    </>
  );

  const instructionsPanel = (
    <InstructionsPanel
      narrativeText={meta.narrative_text}
      instructions={instructions}
    />
  );

  return (
    <div className="flex h-screen flex-col bg-gray-950">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-gray-700 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDrawerOpen((o) => !o)}
            className="hidden rounded-lg border border-gray-700 p-2 text-gray-400 transition hover:bg-gray-800 hover:text-gray-200 md:block lg:hidden"
            title="Toggle instructions"
          >
            <ScrollText className="h-4 w-4" />
          </button>
          <h1 className="font-display text-sm text-gray-100 lg:text-lg">
            {meta.title}
          </h1>
          <span className={DIFFICULTY_BADGE[meta.difficulty] ?? ""}>
            {meta.difficulty}
          </span>
          <span className="hidden items-center gap-1 font-mono text-sm text-emerald-400 sm:flex">
            <Zap className="h-3.5 w-3.5" />
            {meta.xp_reward} XP
          </span>
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
            onClick={handleSubmit}
            disabled={submitDisabled}
            title={testsPassed ? "Submit for verification" : "Pass all tests first!"}
            className={`flex items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 font-semibold text-white transition ${
              submitDisabled
                ? "cursor-not-allowed opacity-50"
                : "shadow-neon-purple hover:bg-violet-400"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {isSubmitting ? "Submitting..." : "Submit"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
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

      {/* Main Content */}
      <div className="relative flex-1 overflow-hidden">
        {drawerOpen && (
          <>
            <div
              className="absolute inset-0 z-20 bg-black/50 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute inset-y-0 left-0 z-30 w-80 overflow-y-auto border-r border-gray-700 bg-gray-900 p-6 shadow-xl lg:hidden">
              {instructionsPanel}
            </div>
          </>
        )}

        {/* Desktop: three-panel */}
        <div className="hidden h-full lg:grid lg:grid-cols-[1fr_2fr_1fr]">
          <div className="overflow-y-auto border-r border-gray-700 bg-gray-900 p-6">
            {instructionsPanel}
          </div>
          <div className="overflow-hidden">
            <CodeEditor initialCode={starterCode} onChange={setCode} />
          </div>
          <div className="border-l border-gray-700">{terminalPanel}</div>
        </div>

        {/* Tablet: two-panel */}
        <div className="hidden h-full md:grid md:grid-cols-2 lg:hidden">
          <div className="overflow-hidden">
            <CodeEditor initialCode={starterCode} onChange={setCode} />
          </div>
          <div className="border-l border-gray-700">{terminalPanel}</div>
        </div>

        {/* Mobile: single panel via tabs */}
        <div className="h-full md:hidden">
          {mobileTab === "instructions" && (
            <div className="h-full overflow-y-auto bg-gray-900 p-4">
              {instructionsPanel}
            </div>
          )}
          {mobileTab === "editor" && (
            <div className="h-full overflow-hidden">
              <CodeEditor initialCode={starterCode} onChange={setCode} />
            </div>
          )}
          {mobileTab === "terminal" && (
            <div className="h-full">{terminalPanel}</div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-900 px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="font-display text-xs text-violet-400">Lv.{meta.level}</span>
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

      {/* Mobile: sticky Run/Submit bar */}
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
          onClick={handleSubmit}
          disabled={submitDisabled}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg bg-violet-500 py-3 font-semibold text-white transition ${
            submitDisabled
              ? "cursor-not-allowed opacity-50"
              : "shadow-neon-purple hover:bg-violet-400"
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
}

function InstructionsPanel({
  narrativeText,
  instructions,
}: {
  narrativeText: string;
  instructions: string;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-r-lg border-l-4 border-violet-500 bg-violet-500/10 p-4 italic text-gray-200">
        {narrativeText}
      </div>
      <div className="prose-quest text-lg leading-relaxed text-gray-300">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="mb-3 mt-6 font-display text-xl text-gray-100">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-2 mt-5 font-display text-lg text-gray-100">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 mt-4 text-base font-semibold text-gray-100">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-3 text-base leading-relaxed text-gray-300">
                {children}
              </p>
            ),
            ol: ({ children }) => (
              <ol className="mb-3 list-decimal pl-6 text-base text-gray-300">
                {children}
              </ol>
            ),
            ul: ({ children }) => (
              <ul className="mb-3 list-disc pl-6 text-base text-gray-300">
                {children}
              </ul>
            ),
            li: ({ children }) => <li className="mb-1">{children}</li>,
            code: ({ className, children, ...props }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) {
                return (
                  <code
                    className="block overflow-x-auto rounded-lg border border-gray-700 bg-gray-900 p-3 font-mono text-sm text-emerald-400"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              return (
                <code
                  className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-sm text-emerald-400"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre: ({ children }) => <pre className="mb-3">{children}</pre>,
            strong: ({ children }) => (
              <strong className="font-semibold text-gray-100">{children}</strong>
            ),
          }}
        >
          {instructions}
        </ReactMarkdown>
      </div>
    </div>
  );
}
