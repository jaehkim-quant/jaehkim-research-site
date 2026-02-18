"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionProvider, useSession, signOut } from "next-auth/react";

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/verify";

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-lg font-bold text-slate-900"
            >
              Admin
            </Link>
            <Link
              href="/admin"
              className={`text-sm font-medium ${
                pathname === "/admin"
                  ? "text-orange-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Posts
            </Link>
            <Link
              href="/admin/posts/new"
              className={`text-sm font-medium ${
                pathname === "/admin/posts/new"
                  ? "text-orange-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              New Post
            </Link>
            <Link
              href="/admin/series"
              className={`text-sm font-medium ${
                pathname?.startsWith("/admin/series")
                  ? "text-orange-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Series
            </Link>
            <Link
              href="/admin/inquiries"
              className={`text-sm font-medium ${
                pathname === "/admin/inquiries"
                  ? "text-orange-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Inquiries
            </Link>
            <Link
              href="/admin/comments"
              className={`text-sm font-medium ${
                pathname === "/admin/comments"
                  ? "text-orange-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Comments
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              View Site
            </Link>
            {session && (
              <button
                onClick={() => signOut({ callbackUrl: "/admin/login" })}
                className="text-sm text-slate-500 hover:text-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
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
