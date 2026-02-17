import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Notes",
  description:
    "Key takeaways, personal notes, and summaries from books on finance, investing, economics, and quantitative analysis.",
  openGraph: {
    title: "Book Notes | JaehKim Research",
    description:
      "Key takeaways and summaries from books on finance, investing, and quantitative analysis.",
  },
};

export default function BookNotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
