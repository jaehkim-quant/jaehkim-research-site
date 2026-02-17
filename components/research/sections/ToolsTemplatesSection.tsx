"use client";

import { toolsMock } from "@/lib/research/data/tools.mock";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function ToolsTemplatesSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-4">
          {t("home.toolsTitle")}
        </h2>
        <p className="text-slate-600 mb-10 max-w-2xl">{t("home.toolsDesc")}</p>
        <div className="grid gap-6 md:grid-cols-2">
          {toolsMock.map((tool) => (
            <div
              key={tool.id}
              className="p-6 rounded-xl border border-slate-200 bg-white hover:border-accent-orange/30 transition-colors"
            >
              <span className="text-xs font-medium text-accent-orange mb-2 block">
                {tool.type}
              </span>
              <h3 className="font-semibold text-slate-900 mb-2">{tool.title}</h3>
              <p className="text-sm text-slate-600">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
