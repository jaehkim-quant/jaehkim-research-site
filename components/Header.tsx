"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

type PrimaryNavKind =
  | "terminal"
  | "library"
  | "market"
  | "trading"
  | "investing";

const researchClusterNav = [
  { href: "/research", key: "research", label: "Research" },
  { href: "/knowledge-base", key: "knowledgeBase", label: "Knowledge" },
  { href: "/book-notes", key: "bookNotes", label: "Book" },
] as const;

const primaryNav = [
  { href: "/", label: "Terminal", code: "01", kind: "terminal" },
  { href: "/research", label: "Library", code: "02", kind: "library" },
  {
    href: "/market-monitor",
    label: "Market Monitor",
    code: "03",
    kind: "market",
  },
  { href: "/trading", label: "Trading", code: "04", kind: "trading" },
  {
    href: "/investing",
    label: "Investing",
    code: "05",
    kind: "investing",
  },
] as const;

const channelSlots: Array<{ label: string; kind: "x" | "threads" }> = [
  {
    label: "X",
    kind: "x",
  },
  {
    label: "Threads",
    kind: "threads",
  },
];

function ChannelIcon({ kind }: { kind: "x" | "threads" }) {
  if (kind === "x") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 fill-current"
      >
        <path d="M18.244 2H21.308L14.608 9.658L22.49 20H16.318L11.484 13.741L6.007 20H2.94L10.106 11.809L2.545 2H8.873L13.243 7.72L18.244 2ZM17.169 18.196H18.867L7.95 3.709H6.128L17.169 18.196Z" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.8 8.3c-.3-1.6-1.5-2.8-3.8-2.8c-2.9 0-4.8 2-4.8 5.5c0 3.6 1.7 6.6 5.6 6.6c2.9 0 4.6-1.7 4.6-4.1c0-2.1-1.3-3.3-3.6-3.3H11" />
      <path d="M12.1 10.2c3.1 0 5.3 1.5 5.3 4.6c0 2.7-2.2 5.4-6.3 5.4c-4.8 0-7.9-3.4-7.9-8.6c0-5.3 3.2-8.8 8.4-8.8c3.8 0 6.3 1.8 7.1 5" />
    </svg>
  );
}

function PrimaryNavIcon({ kind }: { kind: PrimaryNavKind }) {
  const className = "h-5 w-5 fill-none stroke-current";
  const commonProps = {
    "aria-hidden": true,
    className,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };

  if (kind === "terminal") {
    return (
      <svg {...commonProps}>
        <rect x="3.5" y="5" width="17" height="12.5" rx="2" />
        <path d="M7.5 20h9" />
        <path d="m8.2 9.2 2.2 2.2-2.2 2.2" />
        <path d="M12.8 13.6h3" />
      </svg>
    );
  }

  if (kind === "library") {
    return (
      <svg {...commonProps}>
        <path d="M5 6.5h11.5a2 2 0 0 1 2 2V19H7a2 2 0 0 0-2 2Z" />
        <path d="M7 6.5v14.5" />
        <path d="M10.5 10.5h5" />
        <path d="M10.5 13.8h4.2" />
      </svg>
    );
  }

  if (kind === "market") {
    return (
      <svg {...commonProps}>
        <path d="M4.5 18.5h15" />
        <path d="M6 15.5 9.5 12l3 2.6 5-6" />
        <path d="m16.8 8.6 1.7.1-.2 1.7" />
      </svg>
    );
  }

  if (kind === "trading") {
    return (
      <svg {...commonProps}>
        <path d="M7 6v12" />
        <path d="M12 4v16" />
        <path d="M17 7v10" />
        <rect x="5.7" y="9" width="2.6" height="4.5" rx="1" />
        <rect x="10.7" y="6.5" width="2.6" height="6.5" rx="1" />
        <rect x="15.7" y="11" width="2.6" height="3.8" rx="1" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M12 4.5v15" />
      <path d="M5 12h14" />
      <circle cx="12" cy="12" r="6.5" />
      <path d="M9.2 9.8h5.6" />
    </svg>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isResearchClusterPath(pathname: string) {
  return researchClusterNav.some((item) => isActive(pathname, item.href));
}

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasResearchCluster = isResearchClusterPath(pathname);

  const activeNav =
    primaryNav.find((item) =>
      item.href === "/research"
        ? hasResearchCluster
        : isActive(pathname, item.href),
    ) ?? primaryNav[0];

  const activeResearchNav =
    researchClusterNav.find((item) => isActive(pathname, item.href)) ??
    researchClusterNav[0];

  const activeTerminalTitle = hasResearchCluster
    ? activeResearchNav.label
    : activeNav.label;

  const navLinkClass = (href: string) =>
    (href === "/research" ? hasResearchCluster : isActive(pathname, href))
      ? "border-l-[3px] border-accent-orange bg-white/5 text-accent-orange"
      : "border-l-[3px] border-transparent text-text-dark hover:bg-white/5 hover:text-text-title";

  return (
    <>
      <aside
        className={`terminal-glass fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border transition-[width] duration-300 md:flex ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className={sidebarCollapsed ? "px-3 py-5" : "px-6 py-7"}>
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!sidebarCollapsed && <div className="terminal-label">Terminal v5.0</div>}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="terminal-outline-button h-9 w-9 p-0"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="terminal-number text-sm">
                {sidebarCollapsed ? "→" : "←"}
              </span>
            </button>
          </div>

          <div
            className={
              sidebarCollapsed
                ? "mt-5 flex justify-center"
                : "mt-4"
            }
          >
            <Link
              href="/"
              className={`terminal-title text-accent-orange ${
                sidebarCollapsed ? "text-[1.1rem]" : "text-[1.45rem]"
              }`}
              title="JAEHKIM RESEARCH"
            >
              {sidebarCollapsed ? "JR" : "JAEHKIM RESEARCH"}
            </Link>
          </div>

          {!sidebarCollapsed && (
            <p className="mt-3 max-w-[12rem] text-sm leading-relaxed text-text-dark">
              퀀트 노트, 모델, 아카이브, 운영 워크플로를 한 화면에서
              연결하는 글로벌 리서치 터미널입니다.
            </p>
          )}
        </div>

        <nav className={`flex-1 ${sidebarCollapsed ? "px-2" : "px-3"}`}>
          <div className="space-y-1">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={
                  sidebarCollapsed
                    ? `flex flex-col items-center gap-2 rounded-sm px-2 py-3 ${
                        (item.href === "/research"
                          ? hasResearchCluster
                          : isActive(pathname, item.href))
                          ? "bg-white/6 text-accent-orange ring-1 ring-inset ring-accent-orange/30"
                          : "text-text-dark hover:bg-white/5 hover:text-text-title"
                      }`
                    : `flex items-center justify-between rounded-r-sm px-4 py-3 ${navLinkClass(
                        item.href,
                      )}`
                }
              >
                {sidebarCollapsed ? (
                  <>
                    <PrimaryNavIcon kind={item.kind} />
                    <span className="terminal-label text-[0.6rem] text-current/80">
                      {item.code}
                    </span>
                    <span className="sr-only">{item.label}</span>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-medium text-current">{item.label}</div>
                    <span className="font-label text-xs uppercase tracking-[0.25em] text-current/70">
                      {item.code}
                    </span>
                  </>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {!sidebarCollapsed ? (
          <div className="px-4 pb-4">
            <Link
              href="/research"
              className="terminal-primary-button w-full font-label text-xs uppercase tracking-[0.22em]"
            >
              Open Library
            </Link>
          </div>
        ) : (
          <div className="px-2 pb-4">
            <Link
              href="/research"
              title="Open Library"
              className="terminal-primary-button h-11 w-full p-0"
            >
              <PrimaryNavIcon kind="library" />
              <span className="sr-only">Open Library</span>
            </Link>
          </div>
        )}

        <div
          className={`border-t border-border ${
            sidebarCollapsed ? "px-2 py-4" : "px-4 py-5"
          }`}
        >
          {!sidebarCollapsed && (
            <div className="terminal-label mb-3 text-accent-orange">Channels</div>
          )}
          <div className={`grid gap-2 ${sidebarCollapsed ? "grid-cols-1" : "grid-cols-2"}`}>
            {channelSlots.map((item) => (
              <div
                key={item.label}
                className={`terminal-surface flex items-center rounded-sm text-text-dark transition-colors hover:bg-white/8 hover:text-text-title ${
                  sidebarCollapsed
                    ? "justify-center px-2 py-3"
                    : "flex-col gap-3 px-3 py-4"
                }`}
                title={item.label}
              >
                <ChannelIcon kind={item.kind} />
                {!sidebarCollapsed && (
                  <div className="terminal-label text-[0.62rem] text-current">
                    {item.label}
                  </div>
                )}
                {sidebarCollapsed && <span className="sr-only">{item.label}</span>}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <header
        className={`terminal-glass fixed inset-x-0 top-0 z-50 border-b border-border transition-[left] duration-300 ${
          sidebarCollapsed ? "md:left-20" : "md:left-64"
        }`}
      >
        <div className="terminal-container flex items-center justify-between gap-4 px-4 py-3 md:px-8 lg:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="terminal-outline-button px-3 py-2 md:hidden"
              aria-label="Toggle menu"
            >
              <span className="font-label text-xs uppercase tracking-[0.2em]">
                Menu
              </span>
            </button>

            <div className="min-w-0">
              <div className="terminal-label">Active Terminal</div>
              <div className="terminal-heading truncate text-base text-text-title">
                {activeTerminalTitle}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
          </div>
        </div>

        {hasResearchCluster && (
          <div className="border-t border-border/80">
            <div className="terminal-container px-4 py-4 md:px-8 lg:px-10">
              <div className="flex min-w-0 items-center gap-4 overflow-x-auto border-l border-accent-orange/50 pl-4">
                <div className="terminal-label shrink-0 text-accent-orange">
                  Library Sections
                </div>
                <div className="h-5 w-px shrink-0 bg-white/10" />
                <div className="flex min-w-max items-center gap-2">
                  {researchClusterNav.map((item) => {
                    const selected = isActive(pathname, item.href);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={
                          selected
                            ? "rounded-sm border border-accent-orange/35 bg-accent-orange/10 px-4 py-2 font-label text-xs uppercase tracking-[0.18em] text-accent-orange"
                            : "rounded-sm border border-transparent px-4 py-2 font-label text-xs uppercase tracking-[0.18em] text-text-dark hover:border-border hover:bg-white/[0.03] hover:text-text-title"
                        }
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden">
          <div className="terminal-glass absolute inset-y-0 left-0 w-[86vw] max-w-sm border-r border-border p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="terminal-label">Mobile Terminal</div>
                <Link
                  href="/"
                  className="terminal-title mt-2 block text-2xl text-accent-orange"
                  onClick={() => setMobileOpen(false)}
                >
                  JAEHKIM RESEARCH
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="terminal-outline-button px-3 py-2"
              >
                <span className="font-label text-xs uppercase tracking-[0.2em]">
                  Close
                </span>
              </button>
            </div>

            <div className="mt-8 space-y-2">
              {primaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-sm px-4 py-3 ${navLinkClass(item.href)}`}
                >
                  <div className="text-sm font-medium text-current">{item.label}</div>
                </Link>
              ))}
            </div>

            {hasResearchCluster && (
              <>
                <div className="terminal-divider my-6" />

                <div>
                  <div className="terminal-label mb-3 text-accent-orange">
                    Library Sections
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {researchClusterNav.map((item) => {
                      const selected = isActive(pathname, item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={
                            selected
                              ? "terminal-primary-button px-3 py-3 font-label text-[0.68rem] uppercase tracking-[0.18em]"
                              : "terminal-outline-button px-3 py-3 font-label text-[0.68rem] uppercase tracking-[0.18em]"
                          }
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div className="terminal-divider my-6" />

            <div>
              <div className="terminal-label mb-3 text-accent-orange">Channels</div>
              <div className="grid grid-cols-2 gap-2">
              {channelSlots.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-3 rounded-sm bg-white/4 px-4 py-4 text-sm text-text-dark"
                >
                  <ChannelIcon kind={item.kind} />
                  <div className="terminal-label text-[0.62rem] text-current">
                    {item.label}
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
