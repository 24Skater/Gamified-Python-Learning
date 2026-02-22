import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL ?? "http://localhost:8000/api/v1";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? "";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Authentication required." },
      { status: 401 },
    );
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const backendRes = await fetch(`${BACKEND_API_URL}/quests/${id}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": INTERNAL_API_KEY,
      },
      body: JSON.stringify({
        quest_id: body.quest_id ?? id,
        code: body.code,
        language_version: body.language_version ?? "3.11",
        user_id: session.user.id,
      }),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json(
      {
        status: "fail",
        error_type: "NetworkError",
        hint: "Could not reach the grading server. Please try again.",
        traceback: "",
      },
      { status: 502 },
    );
  }
}
