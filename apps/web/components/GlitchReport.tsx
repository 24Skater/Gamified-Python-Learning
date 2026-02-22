"use client";

import { Bug } from "lucide-react";

interface GlitchReportProps {
  errorType: string;
  hint: string;
  category: string;
}

const RETRY_PROMPTS = [
  "Adjust your spell and try again!",
  "You\u2019re close! Check the glitch and recast.",
  "Glitches are just puzzles \u2014 you\u2019ve got this!",
  "Every coder hits glitches. Keep going!",
  "Debug like a hero \u2014 try once more!",
];

function getRetryPrompt(): string {
  return RETRY_PROMPTS[Math.floor(Math.random() * RETRY_PROMPTS.length)];
}

const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  SyntaxGlitch:
    "bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full",
  LogicGlitch:
    "bg-amber-500/20 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full",
  RuntimeGlitch:
    "bg-red-500/20 text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full",
  QuestGlitch:
    "bg-violet-500/20 text-violet-400 text-xs font-semibold px-2 py-0.5 rounded-full",
};

export default function GlitchReport({
  errorType,
  hint,
  category,
}: GlitchReportProps) {
  const badgeClasses =
    CATEGORY_BADGE_CLASSES[category] ?? CATEGORY_BADGE_CLASSES.RuntimeGlitch;

  return (
    <div className="mx-2 my-2 animate-[slideUp_0.3s_ease-out] rounded-xl border border-red-500/30 bg-gray-950 p-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Bug className="h-5 w-5 text-red-400" />
        <h3 className="font-display text-lg uppercase tracking-wider text-red-400">
          Glitch Detected!
        </h3>
      </div>

      {/* Type badge */}
      <div className="mt-3">
        <span className={badgeClasses}>{category}</span>
        {errorType !== category && (
          <span className="ml-2 text-xs text-gray-500">{errorType}</span>
        )}
      </div>

      {/* Separator */}
      <div className="my-3 border-t border-gray-800" />

      {/* Hint message */}
      <p className="text-sm leading-relaxed text-gray-200">{hint}</p>

      {/* Separator */}
      <div className="my-3 border-t border-gray-800" />

      {/* Retry prompt */}
      <p className="text-sm italic text-violet-400">
        {"\u2728"} {getRetryPrompt()}
      </p>
    </div>
  );
}
