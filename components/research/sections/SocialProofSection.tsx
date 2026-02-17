"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

export function SocialProofSection() {
  const { t } = useTranslation();
  const stats = [
    { value: "12+", label: t("home.socialProof.notes") },
    { value: "8", label: t("home.socialProof.templates") },
    { value: "1.2K", label: t("home.socialProof.subscribers") },
  ];

  return (
    <section className="py-10 border-y border-slate-200 bg-slate-50">
      <div className="max-w-content mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-12 md:gap-20">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl md:text-3xl font-bold text-accent-orange">
                {value}
              </p>
              <p className="text-sm text-slate-600 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
