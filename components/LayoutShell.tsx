"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isAdmin = pathname.startsWith("/admin");
  const hasResearchCluster =
    pathname === "/research" ||
    pathname.startsWith("/research/") ||
    pathname === "/knowledge-base" ||
    pathname.startsWith("/knowledge-base/") ||
    pathname === "/book-notes" ||
    pathname.startsWith("/book-notes/");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="terminal-page min-h-screen">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      />
      <div
        className={`transition-[padding] duration-300 ${
          sidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <main
          className={`relative z-10 flex-1 px-4 pb-12 md:px-8 lg:px-10 ${
            hasResearchCluster ? "pt-40 md:pt-36" : "pt-24 md:pt-20"
          }`}
        >
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
