"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";

const adminNav = [
  { href: "/admin", label: "Posts", code: "01" },
  { href: "/admin/series", label: "Series", code: "02" },
  { href: "/admin/inquiries", label: "Inquiries", code: "03" },
  { href: "/admin/comments", label: "Comments", code: "04" },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/verify";

  if (isAuthPage) {
    return <div className="terminal-page min-h-screen">{children}</div>;
  }

  const active = adminNav.find((item) => isActive(pathname, item.href)) ?? adminNav[0];

  return (
    <div className="terminal-page min-h-screen">
      <aside className="terminal-glass fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border lg:flex">
        <div className="px-6 py-7">
          <div className="terminal-label mb-3">Ops Terminal</div>
          <Link href="/admin" className="terminal-title text-2xl text-accent-orange">
            ADMIN CORE
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-text-dark">
            Content, series, inquiries, and comment operations for JaehKim Research.
          </p>
        </div>

        <nav className="flex-1 px-3">
          <div className="space-y-1">
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-r-sm px-4 py-3 ${
                  isActive(pathname, item.href)
                    ? "border-l-[3px] border-accent-orange bg-white/5 text-accent-orange"
                    : "border-l-[3px] border-transparent text-text-dark hover:bg-white/5 hover:text-text-title"
                }`}
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="terminal-label text-[0.6rem] text-current/70">
                  {item.code}
                </span>
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-border px-4 py-5">
          <div className="terminal-label mb-3">Utilities</div>
          <div className="space-y-2">
            <Link
              href="/"
              prefetch={false}
              className="terminal-outline-button w-full justify-between px-4 py-3 text-sm"
            >
              <span>View Site</span>
              <span className="terminal-number text-xs">↗</span>
            </Link>
            {session && (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="terminal-outline-button w-full justify-between px-4 py-3 text-sm"
              >
                <span>Logout</span>
                <span className="terminal-number text-xs">×</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="terminal-glass sticky top-0 z-30 border-b border-border">
          <div className="terminal-container flex items-center justify-between gap-4 px-4 py-3 md:px-8">
            <div>
              <div className="terminal-label mb-1">Operator Screen</div>
              <div className="terminal-heading text-xl text-text-title">
                {active.label}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link
                href="/"
                prefetch={false}
                className="terminal-outline-button px-4 py-2 text-sm lg:hidden"
              >
                View Site
              </Link>
              {session && (
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="terminal-outline-button px-4 py-2 text-sm lg:hidden"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>
        <main className="terminal-container px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
