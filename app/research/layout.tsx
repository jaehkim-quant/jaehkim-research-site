import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Browse quant research papers on factor investing, backtesting, risk management, portfolio optimization, and market structure analysis.",
  openGraph: {
    title: "Research | JaehKim Research",
    description:
      "Browse quant research papers on factor investing, backtesting, risk management, and portfolio optimization.",
  },
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
