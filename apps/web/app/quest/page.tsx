import Link from "next/link";
import { Zap, Lock, Swords } from "lucide-react";
import { getAllQuests, type QuestMeta } from "@/lib/questParser";

const DIFFICULTY_BADGE: Record<string, string> = {
  Beginner:
    "bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full",
  Intermediate:
    "bg-violet-500/20 text-violet-400 text-xs font-semibold px-2 py-0.5 rounded-full",
  Boss: "bg-rose-500/20 text-rose-400 text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
};

function QuestCard({ quest }: { quest: QuestMeta }) {
  return (
    <Link
      href={`/quest/${quest.id}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-gray-700 bg-gray-900 p-4 transition hover:border-violet-500/50 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)]"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-100 group-hover:text-violet-300 transition">
          {quest.title}
        </h3>
        <span className={DIFFICULTY_BADGE[quest.difficulty] ?? DIFFICULTY_BADGE.Beginner}>
          {quest.difficulty}
        </span>
      </div>

      <p className="text-sm text-gray-400 line-clamp-2">{quest.narrative_text}</p>

      <div className="mt-auto flex items-center justify-between">
        <span className="flex items-center gap-1 font-mono text-sm text-emerald-400">
          <Zap className="h-3.5 w-3.5" />
          {quest.xp_reward} XP
        </span>
        <div className="flex flex-wrap gap-1">
          {quest.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function QuestSelectionPage() {
  const quests = getAllQuests();

  const grouped = quests.reduce<Record<number, QuestMeta[]>>((acc, q) => {
    (acc[q.level] ??= []).push(q);
    return acc;
  }, {});

  const levels = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Swords className="h-6 w-6 text-violet-400" />
            <h1 className="font-display text-xl text-violet-400">Quest Map</h1>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-700 hover:text-gray-100"
          >
            Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {levels.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <Lock className="h-12 w-12 text-gray-600" />
            <p className="text-lg text-gray-500">No quests available yet.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {levels.map((level) => (
              <section key={level}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-display text-sm text-violet-400">
                    Level {level}
                  </span>
                  <div className="h-px flex-1 bg-gray-800" />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {grouped[level].map((quest) => (
                    <QuestCard key={quest.id} quest={quest} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
