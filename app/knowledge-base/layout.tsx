import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge",
  description:
    "Curated series on university subjects, financial engineering, portfolio theory, and foundational quantitative topics.",
  openGraph: {
    title: "Knowledge | JaehKim Research",
    description:
      "Curated series on university subjects and foundational quantitative topics.",
  },
};

export default function KnowledgeBaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
