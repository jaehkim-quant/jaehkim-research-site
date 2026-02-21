import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/useTranslation";
import { LayoutShell } from "@/components/LayoutShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jaehkim-research.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JaehKim Research — Quant Research & Investment Insights",
    template: "%s | JaehKim Research",
  },
  description:
    "Reproducible, verified, risk-focused quant research. Data-driven insights for individual investors and fellow researchers.",
  keywords: [
    "quant research",
    "quantitative finance",
    "factor investing",
    "backtesting",
    "risk management",
    "investment research",
    "portfolio optimization",
    "퀀트",
    "투자 리서치",
    "팩터 투자",
  ],
  authors: [{ name: "JaehKim" }],
  creator: "JaehKim",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "JaehKim Research",
    title: "JaehKim Research — Quant Research & Investment Insights",
    description:
      "Reproducible, verified, risk-focused quant research. Data-driven insights for individual investors and fellow researchers.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "JaehKim Research",
    description:
      "Reproducible, verified, risk-focused quant research.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "4UxoVOLA8TFgpiYbTzlynU_s9vtacrTe_qglcJQQErM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body
        className="font-sans antialiased bg-white text-slate-800"
        style={{ fontFamily: "Pretendard, Inter, sans-serif" }}
      >
        <LanguageProvider>
          <LayoutShell>{children}</LayoutShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
