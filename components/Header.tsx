"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const navKeys = [
  { href: "/", key: "home" },
  { href: "/research", key: "research" },
  { href: "/knowledge-base", key: "knowledgeBase" },
  { href: "/book-notes", key: "bookNotes" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
];

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="max-w-content mx-auto px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link
            href="/"
            className="text-lg font-semibold text-slate-900 tracking-tight hover:text-accent-orange transition-colors"
          >
            {t("siteName")}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navKeys.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "text-accent-orange"
                    : "text-slate-600 hover:text-accent-orange"
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="md:hidden py-4 border-t border-slate-200 flex flex-col gap-2">
            {navKeys.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`py-2 text-sm font-medium ${
                  pathname === item.href ? "text-accent-orange" : "text-slate-600"
                }`}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
