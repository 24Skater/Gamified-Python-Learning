"use client";

import Link from "next/link";
import { Star, ArrowRight, Map } from "lucide-react";

interface QuestSuccessProps {
  xpEarned: number;
  feedback: string;
  questId: string;
}

export default function QuestSuccess({
  xpEarned,
  feedback,
  questId,
}: QuestSuccessProps) {
  return (
    <div className="mx-2 my-2 animate-[slideUp_0.3s_ease-out] rounded-xl border border-emerald-500/30 bg-gray-950 p-6">
      <div className="flex items-center gap-2">
        <Star className="h-6 w-6 text-emerald-400" />
        <h3 className="font-display text-xl uppercase tracking-wider text-emerald-400">
          Quest Complete!
        </h3>
      </div>

      <div className="my-3 border-t border-gray-800" />

      <p className="text-base italic text-gray-200">{feedback}</p>

      <div className="my-3 border-t border-gray-800" />

      <div className="flex items-center gap-2">
        <span className="font-display text-2xl text-emerald-400">
          +{xpEarned} XP
        </span>
      </div>

      <div className="my-3 border-t border-gray-800" />

      <div className="flex items-center gap-3">
        <Link
          href="/quest"
          className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-700 hover:text-gray-100"
        >
          <Map className="h-4 w-4" />
          Quest Map
        </Link>
      </div>
    </div>
  );
}
