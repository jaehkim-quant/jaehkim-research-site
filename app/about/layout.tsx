import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About JaehKim Research — investment philosophy, research principles, backtest methodology, validation framework, and ethics disclosure.",
  openGraph: {
    title: "About | JaehKim Research",
    description:
      "Investment philosophy, research principles, and validation methodology.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
