"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconDownload, IconPlus, IconMenu2 } from "@tabler/icons-react";
import { getRouteMetadata } from "@/lib/navigation";
import { useSidebar } from "@/lib/context/sidebar-context";
import { ThemeToggle } from "@/components/theme-toggle";

export interface NavbarProps {
  title?: string;
  breadcrumb?: string;
  description?: string;
  dateRange?: string;
  className?: string;
  onExportClick?: () => void;
  onCreateReportClick?: () => void;
}

export function Navbar({
  title,
  breadcrumb,
  description,
  dateRange = "21 Agu 2026 - 17 Sep 2026",
  className = "",
  onExportClick,
  onCreateReportClick,
}: NavbarProps) {
  const pathname = usePathname();
  const metadata = getRouteMetadata(pathname);
  const { toggleMobile, toggleDesktop, isCollapsed } = useSidebar();

  const displayTitle = title ?? metadata.title;
  const displayBreadcrumb = breadcrumb ?? metadata.breadcrumb;
  const displayDescription = description ?? metadata.description;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 border-b border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl transition-all duration-300 ${
        isCollapsed ? "lg:left-20" : "lg:left-72"
      } ${className}`}
    >
      <div className="border-b border-zinc-200 dark:border-white/5 bg-zinc-50/40 dark:bg-zinc-950/40 px-5 py-2 flex justify-end items-center h-12">
        <ThemeToggle />
      </div>

      <div className="mx-auto flex md:h-[88px] h-[120px] w-full max-w-[1400px] flex-col justify-center gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            onClick={() => {
              if (window.innerWidth < 1024) {
                toggleMobile();
              } else {
                toggleDesktop();
              }
            }}
          >
            <IconMenu2 className="h-5 w-5" />
          </Button>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              {displayBreadcrumb}
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-[22px]">
              {displayTitle}
            </h1>

            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-500 lg:text-[13px]">
              {displayDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className="h-8 rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-100/50 dark:bg-zinc-900/60 px-3 text-[11px] font-medium text-zinc-600 dark:text-zinc-300"
            variant="outline"
          >
            {dateRange}
          </Badge>

          <Button
            className="h-8 rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-white/5 px-3 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-white/10"
            size="sm"
            variant="outline"
            onClick={onExportClick}
          >
            <IconDownload className="mr-1.5 h-3.5 w-3.5 text-zinc-500 dark:text-zinc-400" />
            Export
          </Button>

          <Button
            className="h-8 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-3 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25"
            size="sm"
            onClick={onCreateReportClick}
          >
            <IconPlus className="mr-1.5 h-3.5 w-3.5" />
            Buat Laporan
          </Button>
        </div>
      </div>
    </header>
  );
}