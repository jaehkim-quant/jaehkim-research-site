"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminVerifyPage() {
  const router = useRouter();
  const { status } = useSession();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/admin");
      return;
    }

    if (status === "loading") return;

    const username = sessionStorage.getItem("otp_username");
    if (!username) {
      router.replace("/admin/login");
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

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = code.join("");
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setError("");
    setLoading(true);

    const username = sessionStorage.getItem("otp_username");
    if (!username) {
      router.replace("/admin/login");
      return;
    }

    const result = await signIn("otp-login", {
      username,
      otpCode,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid or expired code. Please try again.");
      setLoading(false);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      return;
    }

    sessionStorage.removeItem("otp_username");
    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="terminal-card p-8 md:p-10">
          <div className="terminal-label mb-3">Verification Gate</div>
          <h1 className="terminal-heading text-4xl text-text-title">
            Verify Code
          </h1>
          <p className="terminal-copy mt-4 text-sm">
            Enter the 6-digit code sent to your email to unlock the operator terminal.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="h-14 w-12 rounded-sm border border-border bg-white/4 text-center text-xl font-semibold text-text-title focus:outline-none focus:ring-0"
                />
              ))}
            </div>

            {error && (
              <p className="rounded-sm border border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] px-4 py-3 text-center text-sm text-[var(--terminal-danger)]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="terminal-primary-button w-full justify-center font-label text-xs uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/login")}
              className="terminal-outline-button w-full justify-center text-sm"
            >
              Back to login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
