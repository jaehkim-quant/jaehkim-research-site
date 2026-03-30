"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function NewsletterSection() {
  const { t } = useTranslation();

  return (
    <section className="py-6 md:py-8">
      <div className="terminal-container">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="terminal-card overflow-hidden px-6 py-7 md:px-8 md:py-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
              <div>
                <div className="terminal-label mb-3">Newsletter Channel</div>
                <h2 className="terminal-heading text-3xl text-text-title md:text-[2.35rem]">
                  {t("home.newsletterTitle")}
                </h2>
                <p className="terminal-copy mt-4 max-w-2xl text-sm md:text-base">
                  {t("home.newsletterDesc")}
                </p>
              </div>

              <form className="grid gap-3">
                <input
                  type="email"
                  placeholder={t("home.newsletterPlaceholder")}
                  className="terminal-input"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    className="terminal-primary-button flex-1 font-label text-xs uppercase tracking-[0.22em]"
                  >
                    {t("home.newsletterButton")}
                  </button>
                  <Link
                    href="/subscribe"
                    className="terminal-outline-button font-label text-xs uppercase tracking-[0.22em]"
                  >
                    Pricing
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="terminal-card p-5">
            <div className="terminal-label mb-3">Signal Promise</div>
            <div className="space-y-4 text-sm text-text-dark">
              <p>Low-noise distribution with editorial summaries and archive links.</p>
              <p>Weekly quant notes, monthly library refreshes, and selected case dispatches.</p>
              <p>No trend-chasing blasts. Only validated releases and operating memos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
