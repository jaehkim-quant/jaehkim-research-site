"use client";

import Image from "next/image";
import { CTAButtons } from "../CTAButtons";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <div className="max-w-2xl">
          <div className="mb-8">
            <Image
              src="/logo/Jaehkim_research_nocircle.png"
              alt="JaehKim Research"
              width={320}
              height={80}
              className="h-14 md:h-16 w-auto"
              priority
            />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight leading-tight mb-6">
            {t("home.heroTitle")}
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed mb-8">
            {t("home.heroDesc")}
          </p>
          <CTAButtons />
        </div>
      </div>
    </section>
  );
}
