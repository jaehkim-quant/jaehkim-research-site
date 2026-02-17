"use client";

import { MiniBadgeRow } from "../MiniBadgeRow";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function ValidationPrinciplesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-content mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4 text-center">
          {t("home.validationTitle")}
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-xl mx-auto">
          {t("home.validationDesc")}
        </p>
        <MiniBadgeRow />
      </div>
    </section>
  );
}
