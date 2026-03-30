import Link from "next/link";

const footerLinks = [
  { href: "/research", label: "Library" },
  { href: "/market-monitor", label: "Market Monitor" },
  { href: "/trading", label: "Trading" },
  { href: "/investing", label: "Investing" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/80 px-4 py-6 md:px-8 lg:px-10">
      <div className="terminal-container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs text-text-dark">
          <span className="terminal-label text-[0.64rem]">Jaehkim Research Grid</span>
          <span className="hidden text-text-dark/60 md:inline">|</span>
          <span>Restricted access styling. Public access permitted.</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-text-dark">
          <span className="terminal-number text-accent-orange">SYSTEM READY</span>
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="terminal-label text-[0.64rem] text-text-dark hover:text-text-title"
            >
              {link.label}
            </Link>
          ))}
          <span className="text-text-dark/60">
            © {new Date().getFullYear()} JaehKim Research
          </span>
        </div>
      </div>
    </footer>
  );
}
