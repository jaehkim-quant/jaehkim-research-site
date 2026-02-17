"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function AboutPage() {
  const { t, tArray, tObj } = useTranslation();

  const backtestKeys = [
    "lookahead",
    "survivorship",
    "rebalance",
    "slippage",
  ] as const;
  const mt = tObj("evidence.metricsTable") as Record<string, string>;
  const at = tObj("evidence.assumptionsTable") as Record<string, string>;

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
          {t("about.title")}
        </h1>

        {/* Introduction */}
        <section className="mb-16 max-w-2xl">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            {t("about.introTitle")}
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            {t("about.introDesc")}
          </p>
          <ul className="space-y-2 text-slate-600">
            {tArray("about.introItems").map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </section>

        {/* Ethics / Conflict / Disclaimer */}
        <section className="mb-16 max-w-2xl">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            {t("about.ethicsTitle")}
          </h2>
          <div className="space-y-4 text-slate-600">
            {tArray("about.ethicsItems").map((item, i) => (
              <p key={i}>{item}</p>
            ))}
          </div>
        </section>

        {/* ── Evidence & Validation (통합) ── */}
        <div className="border-t border-slate-200 pt-16 mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-2">
            {t("evidence.title")}
          </h2>
          <p className="text-slate-600 mb-12 max-w-2xl">
            {t("evidence.desc")}
          </p>

          {/* Backtest Principles */}
          <section className="mb-16">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              {t("evidence.backtestTitle")}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {backtestKeys.map((key) => {
                const item = tObj(`evidence.backtestItems.${key}`) as {
                  title: string;
                  desc: string;
                };
                return (
                  <div
                    key={key}
                    className="p-6 rounded-xl border border-slate-200 bg-slate-50"
                  >
                    <h4 className="font-semibold text-slate-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Validation Framework */}
          <section className="mb-16">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              {t("evidence.validationTitle")}
            </h3>
            <ul className="space-y-3 text-slate-600">
              {tArray("evidence.validationItems").map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </section>

          {/* Performance Metric Standards */}
          <section className="mb-16">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              {t("evidence.metricsTitle")}
            </h3>
            <p className="text-slate-600 mb-4">{t("evidence.metricsDesc")}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 p-3 text-left font-semibold">
                      {mt.metric}
                    </th>
                    <th className="border border-slate-200 p-3 text-left font-semibold">
                      {mt.description}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [mt.mdd, mt.mddDesc],
                    [mt.sharpe, mt.sharpeDesc],
                    [mt.sortino, mt.sortinoDesc],
                    [mt.calmar, mt.calmarDesc],
                    [mt.turnover, mt.turnoverDesc],
                  ].map(([metric, desc]) => (
                    <tr key={metric}>
                      <td className="border border-slate-200 p-3 font-medium text-slate-900">
                        {metric}
                      </td>
                      <td className="border border-slate-200 p-3 text-slate-600">
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Assumptions Table */}
          <section className="mb-16">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">
              {t("evidence.assumptionsTitle")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-200 p-3 text-left font-semibold">
                      {at.item}
                    </th>
                    <th className="border border-slate-200 p-3 text-left font-semibold">
                      {at.default}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [at.dataRange, at.dataRangeVal],
                    [at.universe, at.universeVal],
                    [at.rebalance, at.rebalanceVal],
                    [at.costs, at.costsVal],
                    [at.slippage, at.slippageVal],
                    [at.execution, at.executionVal],
                  ].map(([item, val]) => (
                    <tr key={item}>
                      <td className="border border-slate-200 p-3 font-medium text-slate-900">
                        {item}
                      </td>
                      <td className="border border-slate-200 p-3 text-slate-600">
                        {val}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <p className="text-slate-600">
          {t("about.contactLink")}{" "}
          <Link
            href="/contact"
            className="font-medium text-accent-orange hover:underline"
          >
            {t("about.contactPage")}
          </Link>{" "}
          {t("about.contactPageLink")}
        </p>
      </div>
    </div>
  );
}
