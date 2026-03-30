import type { Metadata } from "next";
import { Inter, Public_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/useTranslation";
import { LayoutShell } from "@/components/LayoutShell";
import { resolveSiteUrl } from "@/lib/site";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme";

const SITE_URL = resolveSiteUrl();
const themeInitScript = `(() => {
  const key = "${THEME_STORAGE_KEY}";
  try {
    const saved = window.localStorage.getItem(key);
    const theme = saved === "light" || saved === "dark" ? saved : "${DEFAULT_THEME}";
    document.documentElement.dataset.theme = theme;
  } catch {
    document.documentElement.dataset.theme = "${DEFAULT_THEME}";
  }
})();`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

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
    <html
      lang="ko"
      suppressHydrationWarning
      data-theme={DEFAULT_THEME}
      className={`${inter.variable} ${publicSans.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <meta name="color-scheme" content="dark light" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body style={{ fontFamily: "Pretendard, var(--font-inter), sans-serif" }}>
        <LanguageProvider>
          <LayoutShell>{children}</LayoutShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
