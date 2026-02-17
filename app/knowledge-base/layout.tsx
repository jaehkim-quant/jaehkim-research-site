import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description:
    "Curated series on university subjects, financial engineering, portfolio theory, and foundational quantitative topics.",
  openGraph: {
    title: "Knowledge Base | JaehKim Research",
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
