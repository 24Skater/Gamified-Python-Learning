import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: true, message: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: true, message: "Username already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
      },
    });

    return NextResponse.json(
      { id: user.id, username: user.username },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: true, message: "Internal server error." },
      { status: 500 }
    );
  }
}
