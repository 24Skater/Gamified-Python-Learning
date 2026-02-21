"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-neon-purple">Code</span>{" "}
            <span className="text-neon-green">Quest</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Enter your credentials to continue your adventure
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card-bg border border-input-border rounded-xl p-8 space-y-6 shadow-lg shadow-neon-purple/5"
        >
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-300 text-sm rounded-lg p-3 text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent transition"
              placeholder="your-username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-input-border bg-input-bg px-4 py-3 text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-neon-purple py-3 px-4 font-semibold text-white hover:bg-neon-purple/80 focus:outline-none focus:ring-2 focus:ring-neon-purple focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-neon-green hover:underline font-medium">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
