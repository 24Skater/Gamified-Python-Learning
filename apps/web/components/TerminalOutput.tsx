"use client";

import { useEffect, useRef } from "react";
import { Terminal, Trash2, Loader2 } from "lucide-react";

interface TerminalOutputProps {
  stdout: string;
  stderr: string;
  isRunning: boolean;
  pyodideLoading: boolean;
  onClear: () => void;
}

export default function TerminalOutput({
  stdout,
  stderr,
  isRunning,
  pyodideLoading,
  onClear,
}: TerminalOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [stdout, stderr]);

  const hasOutput = stdout || stderr;

  return (
    <div className="flex h-full flex-col bg-gray-950 font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
        <div className="flex items-center gap-2 text-gray-400">
          <Terminal className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Terminal
          </span>
        </div>
        <button
          onClick={onClear}
          className="rounded p-1 text-gray-500 transition hover:bg-gray-800 hover:text-gray-300"
          title="Clear terminal"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Output area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-700"
      >
        {pyodideLoading && (
          <div className="flex items-center gap-2 text-violet-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading Python engine...</span>
          </div>
        )}

        {isRunning && !pyodideLoading && (
          <div className="flex items-center gap-2 text-emerald-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Running...</span>
          </div>
        )}

        {!isRunning && !pyodideLoading && !hasOutput && (
          <p className="text-gray-600 italic">
            Click &quot;Run&quot; to see output here.
          </p>
        )}

        {stdout && (
          <pre className="whitespace-pre-wrap text-gray-300">{stdout}</pre>
        )}

        {stderr && (
          <pre className="mt-2 whitespace-pre-wrap text-red-400">{stderr}</pre>
        )}
      </div>
    </div>
  );
}
