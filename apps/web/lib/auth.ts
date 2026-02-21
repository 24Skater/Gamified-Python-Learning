import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { username: credentials.username as string },
        });

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          username: user.username,
          email: user.email,
          image: user.image,
          xp: user.xp,
          level: user.level,
          gold: user.gold,
          streakDays: user.streakDays,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as Record<string, unknown>).username as string;
        token.xp = (user as Record<string, unknown>).xp as number;
        token.level = (user as Record<string, unknown>).level as number;
        token.gold = (user as Record<string, unknown>).gold as number;
        token.streakDays = (user as Record<string, unknown>).streakDays as number;
        token.image = user.image ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.xp = token.xp as number;
        session.user.level = token.level as number;
        session.user.gold = token.gold as number;
        session.user.streakDays = token.streakDays as number;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
});
