"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {  
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/lib/context/sidebar-context";
import {
  IconLayoutDashboard,
  IconUsers,
  IconUsersGroup,
  IconFileAnalytics,
  IconCalendar,
  IconQrcode,
  IconWallet,
  IconChartBar,
  IconPackage,
  IconPackageExport,
  IconFileExport,
  IconSearch,
  IconX,
  IconUser,
  IconLogout,
  type IconProps,
} from "@tabler/icons-react";

// ... (getMenuIcon and Navigation items remain the same)
const getMenuIcon = (label: string): React.ComponentType<IconProps> => {
  switch (label) {
    case "Dashboard":
      return IconLayoutDashboard;
    case "Anggota & Kader":
      return IconUsers;
    case "Kelompok UPA":
      return IconUsersGroup;
    case "Rapor Keaktifan":
      return IconFileAnalytics;
    case "Kegiatan":
      return IconCalendar;
    case "Absensi Kegiatan":
      return IconQrcode;
    case "Laporan":
      return IconFileAnalytics;
    case "Iuran & Infak":
      return IconWallet;
    case "Laporan Keuangan":
      return IconChartBar;
    case "Inventaris Logistik":
      return IconPackage;
    case "Peminjaman Logistik":
      return IconPackageExport;
    case "Laporan & Export":
      return IconFileExport;
    case "Profile Settings":
      return IconUser;
    default:
      return IconLayoutDashboard;
  }
};

export interface NavigationItem {
  label: string;
  href: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

const defaultNavSections: NavigationSection[] = [
  {
    title: "Dashboard",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
      },
    ],
  },
  {
    title: "Data & Keanggotaan",
    items: [
      {
        label: "Anggota & Kader",
        href: "/admin/anggota",
      },
    ],
  },
  {
    title: "Pembinaan UPA",
    items: [
      {
        label: "Kelompok UPA",
        href: "/admin/kelompok-upa",
      },
      {
        label: "Rapor Keaktifan",
        href: "/admin/rapor-keaktifan",
      },
    ],
  },
  {
    title: "Kegiatan",
    items: [
      {
        label: "Kegiatan",
        href: "/admin/kegiatan",
      },
      {
        label: "Absensi Kegiatan",
        href: "/admin/absensi-kegiatan",
      },
    ],
  },
  {
    title: "Keuangan",
    items: [
      {
        label: "Iuran & Infak",
        href: "/admin/iuran-infak",
      },
      {
        label: "Laporan Keuangan",
        href: "/admin/laporan-keuangan",
      },
    ],
  },
  {
    title: "Logistik",
    items: [
      {
        label: "Inventaris Logistik",
        href: "/admin/inventaris-logistik",
      },
      {
        label: "Peminjaman Logistik",
        href: "/admin/peminjaman-logistik",
      },
    ],
  },
  {
    title: "Laporan",
    items: [
      {
        label: "Laporan",
        href: "/admin/laporan",
      },
      {
        label: "Laporan & Export",
        href: "/admin/laporan-export",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Profile Settings",
        href: "/admin/profile",
      },
    ],
  },
];

export interface SidebarProps {
  activeItem?: string;
  onItemSelect?: (label: string) => void;
  sections?: NavigationSection[];
  className?: string;
}

export function Sidebar({
  activeItem,
  onItemSelect,
  sections = defaultNavSections,
  className = "",
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobileOpen, setIsMobileOpen, isCollapsed } = useSidebar();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-zinc-950/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside
        className={`fixed left-0 top-0 z-[70] flex h-screen flex-col border-r border-white/10 bg-zinc-950/90 px-4 py-5 backdrop-blur-xl transition-all duration-300 lg:z-50 ${
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-72"} ${className}`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between lg:block">
          <Link href="/admin/dashboard" className={`mb-5 flex items-center gap-3 ${isCollapsed ? "lg:justify-center" : ""}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-900/70 text-xs font-semibold text-zinc-200">
              SK
            </div>

            <div className={`min-w-0 transition-all duration-300 ${isCollapsed ? "lg:hidden" : "lg:block"}`}>
              <p className="truncate text-sm font-semibold tracking-tight text-zinc-100">
                SIKADERA
              </p>
              <p className="truncate text-xs text-zinc-500">DPC Dramaga</p>
            </div>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="mb-5 h-8 w-8 text-zinc-500 hover:text-zinc-200 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          >
            <IconX className="h-5 w-5" />
          </Button>
        </div>

        {/* Search */}
        <div className={`mb-5 space-y-2 transition-all duration-300 ${isCollapsed ? "lg:opacity-0 lg:h-0 lg:overflow-hidden lg:mb-0" : "opacity-100"}`}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Search
          </p>

          <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/60 px-3 transition-colors focus-within:border-emerald-500/50">
            <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />

            <Input
              className="h-7 min-w-0 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
              placeholder="Cari data..."
            />

            <Badge
              variant="outline"
              className="shrink-0 rounded-md border-white/10 px-1.5 py-0 text-[10px] font-medium text-zinc-400"
            >
              Ctrl K
            </Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-4 pr-1 [mask-image:linear-gradient(to_bottom,transparent,black_18px,black_calc(100%-18px),transparent)]">
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.title} className="space-y-1.5">
                <p className={`px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 transition-all duration-300 ${isCollapsed ? "lg:opacity-0 lg:h-0 lg:overflow-hidden" : "opacity-100"}`}>
                  {section.title}
                </p>

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const IconComponent = getMenuIcon(item.label);

                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`) ||
                      activeItem === item.label;

                    return (
                      <Button
                        key={item.href}
                        asChild
                        size="sm"
                        variant="ghost"
                        className={`group h-9 w-full justify-start gap-2.5 rounded-xl px-2.5 text-xs font-medium transition-all ${
                          isActive
                            ? "bg-white/10 text-zinc-50 hover:bg-white/10"
                            : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                        } ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}
                        onClick={() => onItemSelect?.(item.label)}
                        title={isCollapsed ? item.label : ""}
                      >
                        <Link href={item.href} className="flex items-center">
                          <IconComponent
                            className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                              isActive
                                ? "text-emerald-400"
                                : "text-zinc-500 group-hover:text-zinc-400"
                            } ${isCollapsed ? "lg:mx-auto" : ""}`}
                          />

                          <span className={`truncate transition-all duration-300 ${isCollapsed ? "lg:hidden" : "lg:block ml-2.5"}`}>
                            {item.label}
                          </span>
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Admin Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`mt-auto h-auto w-full justify-start rounded-2xl border border-white/10 bg-zinc-900/40 p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all hover:bg-white/[0.05] focus-visible:ring-0 ${
                isCollapsed ? "lg:h-12 lg:w-12 lg:p-0 lg:justify-center lg:mx-auto" : ""
              }`}
            >
              <div className={`flex items-center gap-3 ${isCollapsed ? "lg:justify-center" : ""}`}>
                <Avatar className="h-8 w-8 shrink-0 rounded-xl border border-white/10 shadow-sm">
                  <AvatarImage
                    src="https://picsum.photos/seed/admin/64/64"
                    alt="Admin DPC"
                  />
                  <AvatarFallback className="bg-emerald-500/10 text-[10px] font-bold text-emerald-400">
                    AD
                  </AvatarFallback>
                </Avatar>

                <div className={`min-w-0 text-left transition-all duration-300 ${isCollapsed ? "lg:hidden" : "lg:block"}`}>
                  <p className="truncate text-xs font-semibold text-zinc-100">
                    Admin DPC
                  </p>
                  <p className="truncate text-[10px] font-medium text-zinc-500">
                    Super Admin
                  </p>
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side={isCollapsed ? "right" : "top"}
            className="w-56 rounded-2xl border-white/10 bg-zinc-950/90 p-1.5 shadow-2xl backdrop-blur-xl"
            sideOffset={isCollapsed ? 16 : 12}
          >
            <Link href="/admin/profile">
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-zinc-300 transition-colors focus:bg-white/5 focus:text-zinc-50">
                <IconUser className="h-4 w-4 text-zinc-500" />
                Profile Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator className="mx-1 my-1 bg-white/5" />
            <DropdownMenuItem onClick={handleLogout} className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 transition-colors focus:bg-rose-500/10 focus:text-rose-300">
              <IconLogout className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>
    </>
  );
}