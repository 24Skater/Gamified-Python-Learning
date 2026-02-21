import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      email?: string | null;
      image?: string | null;
      xp: number;
      level: number;
      gold: number;
      streakDays: number;
    };
  }

  interface User {
    username?: string;
    xp?: number;
    level?: number;
    gold?: number;
    streakDays?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    xp: number;
    level: number;
    gold: number;
    streakDays: number;
    image: string | null;
  }
}
