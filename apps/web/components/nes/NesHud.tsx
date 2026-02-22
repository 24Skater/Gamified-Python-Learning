"use client";

interface NesHudProps {
  hearts?: number;
  maxHearts?: number;
  xp?: number;
  xpMax?: number;
  level?: number;
  coins?: number;
}

function Hearts({ count, max }: { count: number; max: number }) {
  return (
    <span
      className="flex items-center gap-1"
      aria-label={`${count} of ${max} lives`}
    >
      {Array.from({ length: max }, (_, i) => (
        <i
          key={i}
          className={`nes-icon heart ${i >= count ? "is-empty" : ""}`}
          style={{ transform: "scale(0.5)", transformOrigin: "left center" }}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function NesHud({
  hearts = 3,
  maxHearts = 3,
  xp = 0,
  xpMax = 100,
  level = 1,
  coins = 0,
}: NesHudProps) {
  return (
    <div
      className="nes-container is-dark"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "var(--nes-space-3)",
        padding: "var(--nes-space-2) var(--nes-space-3)",
        fontFamily: "var(--nes-font-display)",
        fontSize: "var(--nes-text-xs)",
      }}
    >
      {/* Hearts */}
      <div className="flex items-center gap-2">
        <Hearts count={hearts} max={maxHearts} />
      </div>

      {/* Level */}
      <div style={{ color: "var(--nes-warning)" }}>
        <span aria-label={`Level ${level}`}>LV {level}</span>
      </div>

      {/* XP bar */}
      <div className="flex items-center gap-2" style={{ minWidth: 120 }}>
        <span style={{ color: "var(--nes-primary)" }}>XP</span>
        <progress
          className="nes-progress is-primary"
          value={xp}
          max={xpMax}
          style={{ height: 16, flexGrow: 1 }}
          aria-label={`XP: ${xp} of ${xpMax}`}
        />
        <span style={{ color: "var(--nes-muted)" }}>
          {xp}/{xpMax}
        </span>
      </div>

      {/* Coins */}
      <div
        className="flex items-center gap-1"
        style={{ color: "var(--nes-warning)" }}
      >
        <i
          className="nes-icon coin"
          style={{ transform: "scale(0.5)", transformOrigin: "left center" }}
          aria-hidden="true"
        />
        <span aria-label={`${coins} coins`}>{coins}</span>
      </div>
    </div>
  );
}
