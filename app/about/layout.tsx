import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Jaehoon Kim — profile, experience, and current focus in family office leadership and quant research.",
  openGraph: {
    title: "About | JaehKim Research",
    description:
      "Profile and experience of Jaehoon Kim, including family office and quant research focus.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
