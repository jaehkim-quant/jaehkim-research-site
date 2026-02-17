import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with JaehKim Research for collaboration, advisory, speaking inquiries, or general questions.",
  openGraph: {
    title: "Contact | JaehKim Research",
    description:
      "Get in touch for collaboration, advisory, or speaking inquiries.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
