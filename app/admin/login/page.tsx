"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <p className="terminal-label text-[0.68rem] text-text-dark">
          Checking session...
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("otp_username", username);
      router.push("/admin/verify");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="terminal-card p-8 md:p-10">
          <div className="terminal-label mb-3">Admin Access</div>
          <h1 className="terminal-heading text-4xl text-text-title">
            Admin Login
          </h1>
          <p className="terminal-copy mt-4 text-sm">
            JaehKim Research management terminal with OTP verification.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="username" className="terminal-label mb-2 block text-[0.66rem]">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="terminal-input"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="terminal-label mb-2 block text-[0.66rem]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="terminal-input"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <p className="rounded-sm border border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-sm text-[var(--terminal-danger)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="terminal-primary-button w-full justify-center font-label text-xs uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
