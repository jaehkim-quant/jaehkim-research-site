"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function CTAButtons() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-4">
      <Link
        href="/research"
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent-orange text-white font-medium hover:bg-accent-orange/90 transition-colors"
      >
        {t("home.ctaResearch")}
      </Link>
      <Link
        href="/contact"
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 font-medium hover:border-accent-orange hover:text-accent-orange transition-colors"
      >
        {t("home.ctaContact")}
      </Link>
    </div>
  );
}
