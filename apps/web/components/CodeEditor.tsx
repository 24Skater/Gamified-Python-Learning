"use client";

import { useRef, useCallback } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  initialCode?: string;
  onChange?: (code: string) => void;
  readOnly?: boolean;
}

const CODE_QUEST_THEME = "code-quest-dark";

export default function CodeEditor({
  initialCode = "",
  onChange,
  readOnly = false,
}: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = useCallback(
    (editorInstance, monaco) => {
      editorRef.current = editorInstance;

      monaco.editor.defineTheme(CODE_QUEST_THEME, {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "keyword", foreground: "a78bfa" },
          { token: "string", foreground: "34d399" },
          { token: "string.escape", foreground: "34d399" },
          { token: "comment", foreground: "6b7280", fontStyle: "italic" },
          { token: "number", foreground: "fbbf24" },
          { token: "type", foreground: "38bdf8" },
          { token: "delimiter", foreground: "9ca3af" },
          { token: "identifier", foreground: "f3f4f6" },
        ],
        colors: {
          "editor.background": "#111827",
          "editor.foreground": "#f3f4f6",
          "editor.lineHighlightBackground": "#1f293780",
          "editor.selectionBackground": "#8b5cf640",
          "editorCursor.foreground": "#a78bfa",
          "editorLineNumber.foreground": "#6b7280",
          "editorLineNumber.activeForeground": "#a78bfa",
          "editor.selectionHighlightBackground": "#8b5cf620",
          "editorBracketMatch.background": "#8b5cf630",
          "editorBracketMatch.border": "#8b5cf680",
        },
      });

      monaco.editor.setTheme(CODE_QUEST_THEME);
    },
    [],
  );

  const handleChange = useCallback(
    (value: string | undefined) => {
      onChange?.(value ?? "");
    },
    [onChange],
  );

  return (
    <Editor
      defaultLanguage="python"
      defaultValue={initialCode}
      theme={CODE_QUEST_THEME}
      onChange={handleChange}
      onMount={handleMount}
      options={{
        readOnly,
        fontSize: 14,
        fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
        minimap: { enabled: false },
        lineNumbers: "on",
        bracketPairColorization: { enabled: true },
        autoIndent: "full",
        tabSize: 4,
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: "line",
        smoothScrolling: true,
        cursorBlinking: "smooth",
        wordWrap: "on",
      }}
    />
  );
}
