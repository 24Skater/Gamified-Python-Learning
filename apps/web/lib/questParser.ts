import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface QuestMeta {
  id: string;
  title: string;
  level: number;
  xp_reward: number;
  difficulty: "Beginner" | "Intermediate" | "Boss";
  narrative_text: string;
  tags: string[];
  unlocks: string[];
}

export interface ParsedQuest {
  meta: QuestMeta;
  instructions: string;
  starterCode: string;
}

export interface FullQuest extends ParsedQuest {
  testCode: string;
}

function resolveContentDir(): string {
  const candidates = [
    path.resolve(process.cwd(), "content"),
    path.resolve(process.cwd(), "../../content"),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(dir)) return dir;
  }
  return candidates[0];
}

const CONTENT_DIR = resolveContentDir();

const STARTER_FENCE_RE = /```python\s+starter\s*\n([\s\S]*?)```/;

function extractStarterCode(body: string): {
  starterCode: string;
  instructions: string;
} {
  const match = body.match(STARTER_FENCE_RE);
  if (!match) {
    return { starterCode: "", instructions: body };
  }
  const starterCode = match[1].trimEnd();
  const instructions = body.replace(STARTER_FENCE_RE, "").trim();
  return { starterCode, instructions };
}

function deriveTestPath(questFilePath: string): string {
  const dir = path.dirname(questFilePath);
  const base = path.basename(questFilePath);
  const testBase = base.replace(/^quest_/, "test_").replace(/\.md$/, ".py");
  return path.join(dir, testBase);
}

export function parseQuest(filePath: string): ParsedQuest {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const { starterCode, instructions } = extractStarterCode(content);

  return {
    meta: {
      id: data.id,
      title: data.title,
      level: data.level,
      xp_reward: data.xp_reward,
      difficulty: data.difficulty,
      narrative_text: data.narrative_text,
      tags: data.tags ?? [],
      unlocks: data.unlocks ?? [],
    },
    instructions,
    starterCode,
  };
}

export function getAllQuests(): QuestMeta[] {
  const quests: QuestMeta[] = [];

  if (!fs.existsSync(CONTENT_DIR)) return quests;

  const levelDirs = fs
    .readdirSync(CONTENT_DIR)
    .filter((d) => d.startsWith("level_"))
    .sort();

  for (const levelDir of levelDirs) {
    const fullDir = path.join(CONTENT_DIR, levelDir);
    if (!fs.statSync(fullDir).isDirectory()) continue;

    const questFiles = fs
      .readdirSync(fullDir)
      .filter((f) => f.startsWith("quest_") && f.endsWith(".md"))
      .sort();

    for (const questFile of questFiles) {
      const parsed = parseQuest(path.join(fullDir, questFile));
      quests.push(parsed.meta);
    }
  }

  return quests;
}

export function getQuestById(id: string): FullQuest | null {
  if (!fs.existsSync(CONTENT_DIR)) return null;

  const levelDirs = fs
    .readdirSync(CONTENT_DIR)
    .filter((d) => d.startsWith("level_"))
    .sort();

  for (const levelDir of levelDirs) {
    const fullDir = path.join(CONTENT_DIR, levelDir);
    if (!fs.statSync(fullDir).isDirectory()) continue;

    const questFiles = fs
      .readdirSync(fullDir)
      .filter((f) => f.startsWith("quest_") && f.endsWith(".md"));

    for (const questFile of questFiles) {
      const filePath = path.join(fullDir, questFile);
      const parsed = parseQuest(filePath);

      if (parsed.meta.id === id) {
        const testPath = deriveTestPath(filePath);
        const testCode = fs.existsSync(testPath)
          ? fs.readFileSync(testPath, "utf-8")
          : "";
        return { ...parsed, testCode };
      }
    }
  }

  return null;
}
