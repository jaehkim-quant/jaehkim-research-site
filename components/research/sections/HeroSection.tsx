"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";

const pulseItems = [
  { label: "Research Nodes", value: "12" },
  { label: "Signal Window", value: "07:00 KST" },
  { label: "Archive Sync", value: "Live" },
];

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="pb-6">
      <div className="terminal-container">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_360px]">
          <div className="terminal-card relative overflow-hidden px-6 py-8 md:px-10 md:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,160,40,0.22),transparent_32%),radial-gradient(circle_at_15%_18%,rgba(169,205,255,0.12),transparent_22%)]" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="relative z-10 max-w-4xl">
              <span className="terminal-kicker mb-5">Core Terminal</span>
              <h1 className="terminal-title max-w-4xl text-5xl leading-[0.92] text-text-title md:text-6xl xl:text-7xl">
                {t("home.heroTitle")}
              </h1>
              <p className="terminal-copy mt-6 max-w-2xl text-base md:text-lg">
                {t("home.heroDesc")}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="terminal-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="terminal-label">Market Pulse</div>
                  <h2 className="terminal-heading mt-3 text-2xl text-text-title">
                    Terminal Analysis Grid
                  </h2>
                </div>
                <span className="terminal-badge terminal-badge-amber">Live</span>
              </div>
              <div className="mt-6 space-y-4">
                {pulseItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-end justify-between gap-4"
                  >
                    <span className="terminal-label text-[0.62rem]">
                      {item.label}
                    </span>
                    <span className="terminal-number text-sm text-text-title">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="terminal-card p-5">
              <div className="terminal-label">Mission Log</div>
              <p className="terminal-copy mt-3 text-sm">
                Precision-engineered public research with a terminal-grade
                information density, mapped for fast reading on desktop and
                mobile.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <Link
                  href="/subscribe"
                  className="terminal-outline-button justify-between px-4 py-3 text-sm"
                >
                  <span>Morning Alpha</span>
                  <span className="terminal-number text-xs">↗</span>
                </Link>
                <Link
                  href="/case-studies"
                  className="terminal-outline-button justify-between px-4 py-3 text-sm"
                >
                  <span>Case Studies</span>
                  <span className="terminal-number text-xs">↗</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
