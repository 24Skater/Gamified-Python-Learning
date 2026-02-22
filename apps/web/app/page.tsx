import Link from "next/link";
import { Play, LogIn, UserPlus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-2xl space-y-8 text-center">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl leading-relaxed sm:text-4xl">
            <span className="text-violet-400">Code</span>{" "}
            <span className="text-emerald-400">Quest</span>
          </h1>
          <p className="font-display text-xs tracking-wider text-gray-400 sm:text-sm">
            Python
          </p>
        </div>

        {/* Tagline */}
        <p className="mx-auto max-w-md text-lg leading-relaxed text-gray-300">
          Learn Python by completing quests, defeating glitches, and leveling up
          your coding skills.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/login"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-500 px-6 py-3 font-semibold text-white shadow-neon-purple transition hover:bg-violet-400 sm:w-auto"
          >
            <LogIn className="h-4 w-4" />
            Start Adventure
          </Link>
          <Link
            href="/register"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-6 py-3 font-semibold text-gray-100 transition hover:bg-gray-700 sm:w-auto"
          >
            <UserPlus className="h-4 w-4" />
            Create Account
          </Link>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 gap-4 pt-8 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
            <div className="mb-2 flex justify-center">
              <Play className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-100">
              Code in the Browser
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              Write and run Python instantly — no setup needed.
            </p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
            <div className="mb-2 flex justify-center">
              <span className="text-xl">&#x2694;&#xFE0F;</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-100">
              RPG Quests
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              Each coding challenge is a quest in The Script-Kitten Chronicles.
            </p>
          </div>
          <div className="rounded-xl border border-gray-700 bg-gray-900 p-4">
            <div className="mb-2 flex justify-center">
              <span className="text-xl">&#x2B50;</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-100">
              Earn XP &amp; Level Up
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              Gain experience, unlock badges, and climb the leaderboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
