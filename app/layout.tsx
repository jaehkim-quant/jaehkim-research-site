import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/useTranslation";
import { LayoutShell } from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "JaehKim Research",
  description:
    "Reproducible, verified, risk-focused quant research. Data-driven insights for individual investors and fellow researchers.",
  openGraph: {
    title: "JaehKim Research",
    description:
      "Reproducible, verified, risk-focused quant research. Data-driven insights for individual investors and fellow researchers.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=localStorage.getItem("locale");if(l==="ko"||l==="en"){document.documentElement.lang=l;document.documentElement.setAttribute("data-locale",l);}})()`,
          }}
        />
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
