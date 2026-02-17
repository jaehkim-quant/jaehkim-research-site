"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

export function NewsletterSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-xl mx-auto p-8 rounded-2xl border-2 border-slate-200 bg-slate-50 text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            {t("home.newsletterTitle")}
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            {t("home.newsletterDesc")}
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t("home.newsletterPlaceholder")}
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-accent-orange text-white font-medium hover:bg-accent-orange/90 transition-colors shrink-0"
            >
              {t("home.newsletterButton")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
