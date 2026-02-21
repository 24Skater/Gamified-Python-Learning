import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const GET = auth(async function GET(req) {
  if (!req.auth?.user) {
    return NextResponse.json(
      { error: true, message: "No active session found." },
      { status: 401 }
    );
  }

  const { id, username, xp, level, gold, streakDays, image } = req.auth.user;

  return NextResponse.json({
    id,
    username,
    xp: xp ?? 0,
    level: level ?? 1,
    gold: gold ?? 0,
    streakDays: streakDays ?? 0,
    image: image ?? null,
  });
});
