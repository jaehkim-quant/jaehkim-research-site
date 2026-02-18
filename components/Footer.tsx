import Link from "next/link";
import Image from "next/image";

const socialLinks = [
  { href: "https://x.com", label: "X" },
  { href: "https://github.com", label: "GitHub" },
  { href: "https://substack.com", label: "Substack" },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="max-w-content mx-auto px-6 py-10 md:py-12">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo/Jaehkim_research_nocircle.png"
                alt="JaehKim Research"
                width={140}
                height={36}
                className="h-8 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-sm text-slate-600 mb-3">
              Privacy · Cookies | Disclaimer · Risk Disclosure
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent-orange hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div />
        </div>
      </div>
    </footer>
  );
}
