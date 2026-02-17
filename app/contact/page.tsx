"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

type FormStatus = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const { t, tObj } = useTranslation();
  const [formPurpose, setFormPurpose] = useState("");
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const po = tObj("contact.form.purposeOptions") as Record<string, string>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: formPurpose,
          name: formName,
          email: formEmail,
          subject: formSubject,
          message: formMessage,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send");
      }

      setStatus("success");
      setFormPurpose("");
      setFormName("");
      setFormEmail("");
      setFormSubject("");
      setFormMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  };

  if (status === "success") {
    return (
      <div className="py-16 md:py-24 bg-white">
        <div className="max-w-content mx-auto px-6">
          <div className="max-w-xl mx-auto text-center py-20">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-3">
              {t("contact.successTitle")}
            </h2>
            <p className="text-slate-600 mb-8">{t("contact.successDesc")}</p>
            <button
              onClick={() => setStatus("idle")}
              className="text-sm font-medium text-accent-orange hover:underline"
            >
              {t("contact.sendAnother")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
          {t("contact.title")}
        </h1>
        <p className="text-slate-600 mb-10 max-w-2xl">{t("contact.desc")}</p>

        {status === "error" && (
          <div className="max-w-xl mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {errorMsg || t("contact.errorGeneric")}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              {t("contact.form.purpose")} <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formPurpose}
              onChange={(e) => setFormPurpose(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            >
              <option value="">{t("contact.form.purposePlaceholder")}</option>
              <option value="general">{po.general}</option>
              <option value="collaboration">{po.collaboration}</option>
              <option value="speaking">{po.speaking}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {t("contact.form.name")} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={t("contact.form.namePlaceholder")}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">
                {t("contact.form.email")} <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder={t("contact.form.emailPlaceholder")}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              {t("contact.form.subject")} <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={formSubject}
              onChange={(e) => setFormSubject(e.target.value)}
              placeholder={t("contact.form.subjectPlaceholder")}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              {t("contact.form.message")} <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formMessage}
              onChange={(e) => setFormMessage(e.target.value)}
              rows={5}
              placeholder={t("contact.form.messagePlaceholder")}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:border-transparent resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="px-6 py-3 rounded-lg bg-accent-orange text-white font-medium hover:bg-accent-orange/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sending"
              ? t("contact.form.sending")
              : t("contact.form.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
