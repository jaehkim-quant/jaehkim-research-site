import { Suspense } from "react";
import { Sidebar } from "./_components/Sidebar";

export default function MarketMonitorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1480px] flex-col gap-4 xl:flex-row xl:items-start xl:gap-6">
      <Suspense
        fallback={
          <div className="terminal-card hidden h-[320px] w-14 shrink-0 xl:block" />
        }
      >
        <Sidebar />
      </Suspense>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
