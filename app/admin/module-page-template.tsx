"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  IconDownload,
  IconFilter,
  IconPlus,
  IconSearch,
  IconDots,
  IconEye,
} from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";

type StatusTone = "emerald" | "sky" | "amber" | "rose" | "violet" | "zinc";

type SummaryCard = {
  title: string;
  value: string;
  note: string;
  tone: StatusTone;
  icon: React.ComponentType<IconProps>;
};

type TableRowData = {
  title: string;
  subtitle: string;
  meta1: string;
  meta2: string;
  meta3: string;
  status: string;
  statusTone: StatusTone;
  progressLabel?: string;
  progressValue?: number;
};

type InsightItem = {
  title: string;
  description: string;
  tone: StatusTone;
};

type ModulePageProps = {
  activeItem: string;
  breadcrumb: string;
  title: string;
  description: string;
  primaryActionLabel: string;
  searchPlaceholder: string;
  summaryCards: SummaryCard[];
  tabs: { label: string; value: string; count: string }[];
  rows: TableRowData[];
  rightTitle: string;
  rightDescription: string;
  insights: InsightItem[];
};

function getToneClass(tone: StatusTone) {
  switch (tone) {
    case "emerald":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-300";
    case "sky":
      return "border-sky-500/20 bg-sky-500/10 text-sky-300";
    case "amber":
      return "border-amber-500/20 bg-amber-500/10 text-amber-300";
    case "rose":
      return "border-rose-500/20 bg-rose-500/10 text-rose-300";
    case "violet":
      return "border-violet-500/20 bg-violet-500/10 text-violet-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getBadgeClass(tone: StatusTone) {
  switch (tone) {
    case "emerald":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "sky":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "amber":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "rose":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    case "violet":
      return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export function ModulePageTemplate({
  activeItem,
  breadcrumb,
  title,
  description,
  primaryActionLabel,
  searchPlaceholder,
  summaryCards,
  tabs,
  rows,
  rightTitle,
  rightDescription,
  insights,
}: ModulePageProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchTab = activeTab === "all" || row.status === activeTab;
      const keyword = search.toLowerCase();

      const matchSearch =
        row.title.toLowerCase().includes(keyword) ||
        row.subtitle.toLowerCase().includes(keyword) ||
        row.meta1.toLowerCase().includes(keyword) ||
        row.meta2.toLowerCase().includes(keyword) ||
        row.meta3.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });
  }, [activeTab, rows, search]);

  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${getToneClass(
                    card.tone
                  )}`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">
                    {card.title}
                  </p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">
                    {card.value}
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    {card.note}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-8">
          <CardHeader className="p-4 pb-3">
            <div className="grid gap-3 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
              <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder={searchPlaceholder}
                />
              </div>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>Semua Wilayah</option>
                <option>Babakan</option>
                <option>Dramaga</option>
                <option>Cikarawang</option>
                <option>Ciherang</option>
              </select>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>Bulan Ini</option>
                <option>Bulan Lalu</option>
                <option>3 Bulan Terakhir</option>
              </select>

              <Button
                variant="outline"
                className="h-9 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
              >
                <IconFilter className="mr-1.5 h-3.5 w-3.5" />
                Filter
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
              <div className="flex flex-wrap gap-2 p-3">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.value;

                  return (
                    <Button
                      key={tab.value}
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveTab(tab.value)}
                      className={[
                        "h-8 rounded-xl px-3 text-xs font-medium",
                        isActive
                          ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15"
                          : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200",
                      ].join(" ")}
                    >
                      {tab.label}
                      <span className="ml-1 text-[11px] opacity-70">
                        ({tab.count})
                      </span>
                    </Button>
                  );
                })}
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3 p-3">
                {filteredRows.map((row) => (
                  <Card
                    key={`${row.title}-${row.subtitle}`}
                    className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-zinc-100">
                              {row.title}
                            </h3>

                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0 text-[10px] ${getBadgeClass(
                                row.statusTone
                              )}`}
                            >
                              {row.status}
                            </Badge>
                          </div>

                          <p className="mt-1 text-xs text-zinc-500">
                            {row.subtitle}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                          >
                            <IconEye className="mr-1.5 h-3.5 w-3.5" />
                            Detail
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                          >
                            <IconDots className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] text-zinc-500">
                            Informasi 1
                          </p>
                          <p className="mt-1 truncate text-xs font-medium text-zinc-200">
                            {row.meta1}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] text-zinc-500">
                            Informasi 2
                          </p>
                          <p className="mt-1 truncate text-xs font-medium text-zinc-200">
                            {row.meta2}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] text-zinc-500">
                            Informasi 3
                          </p>
                          <p className="mt-1 truncate text-xs font-medium text-zinc-200">
                            {row.meta3}
                          </p>
                        </div>
                      </div>

                      {typeof row.progressValue === "number" ? (
                        <div className="mt-4 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500">
                              {row.progressLabel ?? "Progress"}
                            </span>
                            <span className="font-semibold text-zinc-200">
                              {row.progressValue}%
                            </span>
                          </div>
                          <Progress
                            value={row.progressValue}
                            className="h-1.5 bg-white/5"
                          />
                        </div>
                      ) : null}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between p-3">
                <p className="text-xs text-zinc-500">
                  Menampilkan{" "}
                  <span className="text-zinc-300">
                    {filteredRows.length}
                  </span>{" "}
                  data
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-300 hover:bg-white/10"
                >
                  Lihat semua
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                {rightTitle}
              </CardTitle>
              <CardDescription className="text-xs">
                {rightDescription}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              {insights.map((insight) => (
                <div
                  key={insight.title}
                  className={`rounded-2xl border p-3 ${getToneClass(
                    insight.tone
                  )}`}
                >
                  <p className="text-xs font-medium">{insight.title}</p>
                  <p className="mt-1 text-[11px] leading-5 opacity-75">
                    {insight.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Ringkasan Cepat
              </CardTitle>
              <CardDescription className="text-xs">
                Statistik pendukung modul.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              {summaryCards.slice(0, 3).map((item) => (
                <div key={item.title} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300">{item.title}</span>
                    <span className="font-medium text-zinc-100">
                      {item.value}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(
                      Number(item.value.replace(/\D/g, "")) || 65,
                      100
                    )}
                    className="h-1.5 bg-white/5"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}