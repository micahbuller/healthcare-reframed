"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/analytics");
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2F2C2C] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-[#EC7A5B] mb-3">
            Healthcare Reframed
          </p>
          <h1 className="font-mono uppercase text-3xl text-[#FFFBF7] leading-none">
            Analytics
          </h1>
          <p className="font-sans text-sm text-[#FFFBF7]/40 mt-2">
            Internal team access only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            className="w-full font-sans text-sm bg-[#FFFBF7]/8 border border-[#FFFBF7]/15 rounded-full px-6 py-4 text-[#FFFBF7] placeholder-[#FFFBF7]/30 focus:outline-none focus:border-[#EC7A5B]/50 transition-colors"
          />

          {error && (
            <p className="font-mono text-xs text-[#EC7A5B] text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full font-mono uppercase text-sm px-6 py-3 bg-[#EC7A5B] text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
