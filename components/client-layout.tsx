"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useSidebar } from "@/lib/context/sidebar-context";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  const pathname = usePathname();

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isPublicPage = pathname.startsWith("/kegiatan/");

  if (isAuthPage || isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative isolate min-h-[100dvh] overflow-x-hidden">
      {/* Gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_12%_10%,rgba(16,185,129,0.1),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_85%_0%,rgba(244,244,245,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/50 via-zinc-100/90 to-zinc-100 dark:from-zinc-950/20 dark:via-zinc-950/70 dark:to-zinc-950" />
      </div>

      <div
        className={`min-h-[100dvh] transition-all duration-300 ${
          isCollapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        <Sidebar />
        <Navbar />

        <main className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-5 pb-10 md:pt-[152px] pt-[198px]">
          {children}
        </main>
      </div>
    </div>
  );
}
