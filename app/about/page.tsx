"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

type AboutProfile = {
  name: string;
  role: string;
  location: string;
  photoAlt: string;
  photoFallback: string;
  photoSrc: string;
  linkedinUrl: string;
  linkedinLabel: string;
};

type TimelineItem = {
  period: string;
  role: string;
  org: string;
  desc: string;
};

export default function AboutPage() {
  const { t, tArray, tObj } = useTranslation();
  const [imageError, setImageError] = useState(false);

  const profile = tObj("about.profile") as AboutProfile;
  const summaryItems = tArray("about.summaryItems");
  const highlights = tArray("about.highlights");
  const focusItems = tArray("about.focusItems");
  const timelineItems = Object.values(
    tObj("about.timelineItems") as Record<string, TimelineItem>
  );

  return (
    <div className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-content mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">
            {t("about.title")}
          </h1>
          <p className="text-slate-600">{t("about.subtitle")}</p>
        </div>

        <section className="grid gap-8 lg:grid-cols-[300px_1fr] mb-16">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              {!imageError && profile.photoSrc ? (
                <Image
                  src={profile.photoSrc}
                  alt={profile.photoAlt}
                  width={480}
                  height={600}
                  className="h-full w-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-4xl font-semibold text-slate-400">
                  {profile.photoFallback}
                </span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              {profile.name}
            </h2>
            <p className="text-lg text-slate-700 mt-1">{profile.role}</p>
            <p className="text-sm text-slate-500 mt-2">{profile.location}</p>

            <div className="mt-6 space-y-3 text-slate-600 leading-relaxed">
              {summaryItems.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>

            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-6 text-sm font-medium text-accent-orange hover:underline"
            >
              {profile.linkedinLabel}
            </a>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">
            {t("about.highlightsTitle")}
          </h3>
          <ul className="grid gap-4 md:grid-cols-3">
            {highlights.map((item, index) => (
              <li
                key={index}
                className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-700 leading-relaxed"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">
            {t("about.timelineTitle")}
          </h3>
          <div className="space-y-4">
            {timelineItems.map((item) => (
              <article
                key={`${item.period}-${item.role}`}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <p className="text-sm text-slate-500 mb-2">{item.period}</p>
                <h4 className="text-lg font-semibold text-slate-900">
                  {item.role}
                </h4>
                <p className="text-sm text-slate-600 mb-3">{item.org}</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">
            {t("about.focusTitle")}
          </h3>
          <ul className="space-y-2 text-slate-700">
            {focusItems.map((item, index) => (
              <li key={index}>• {item}</li>
            ))}
          </ul>
        </section>

        <p className="text-slate-600">
          {t("about.contactPrefix")}{" "}
          <Link
            href="/contact"
            className="font-medium text-accent-orange hover:underline"
          >
            {t("about.contactPage")}
          </Link>{" "}
          {t("about.contactSuffix")}
        </p>
      </div>
    </div>
  );
}
