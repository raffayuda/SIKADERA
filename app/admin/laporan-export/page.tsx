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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  IconArchive,
  IconChartBar,
  IconClock,
  IconDatabaseExport,
  IconDots,
  IconDownload,
  IconFileAnalytics,
  IconFileExport,
  IconFileSpreadsheet,
  IconFileText,
  IconFilter,
  IconFolderOpen,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconSettings,
  IconShieldCheck,
} from "@tabler/icons-react";

type ExportStatus = "Siap Unduh" | "Draft" | "Proses" | "Gagal";
type ExportFormat = "PDF" | "Excel" | "CSV";

type ExportDocument = {
  id: string;
  title: string;
  module: string;
  period: string;
  format: ExportFormat;
  size: string;
  generatedBy: string;
  generatedAt: string;
  rows: string;
  status: ExportStatus;
  progress: number;
};

const summaryCards = [
  {
    title: "Total Laporan",
    value: "46",
    note: "dokumen tersedia",
    icon: IconFileAnalytics,
    tone: "emerald",
  },
  {
    title: "Siap Unduh",
    value: "32",
    note: "laporan final",
    icon: IconDownload,
    tone: "sky",
  },
  {
    title: "Dalam Proses",
    value: "6",
    note: "sedang generate",
    icon: IconClock,
    tone: "amber",
  },
  {
    title: "Export Bulan Ini",
    value: "18",
    note: "file dibuat",
    icon: IconDatabaseExport,
    tone: "violet",
  },
];

const exportDocuments: ExportDocument[] = [
  {
    id: "EXP-2026-001",
    title: "Export Data Anggota",
    module: "Data & Keanggotaan",
    period: "September 2026",
    format: "Excel",
    size: "2.4 MB",
    generatedBy: "Admin DPC",
    generatedAt: "16 Sep 2026, 09:12",
    rows: "2.845 baris",
    status: "Siap Unduh",
    progress: 100,
  },
  {
    id: "EXP-2026-002",
    title: "Laporan Absensi UPA",
    module: "Pembinaan UPA",
    period: "September 2026",
    format: "PDF",
    size: "1.8 MB",
    generatedBy: "Bidang Kaderisasi",
    generatedAt: "16 Sep 2026, 10:30",
    rows: "24 kelompok",
    status: "Draft",
    progress: 72,
  },
  {
    id: "EXP-2026-003",
    title: "Rekap Keuangan DPC",
    module: "Keuangan",
    period: "September 2026",
    format: "PDF",
    size: "Menunggu",
    generatedBy: "Bendahara DPC",
    generatedAt: "16 Sep 2026, 11:05",
    rows: "1.284 transaksi",
    status: "Proses",
    progress: 48,
  },
  {
    id: "EXP-2026-004",
    title: "Export Inventaris Logistik",
    module: "Logistik",
    period: "September 2026",
    format: "Excel",
    size: "680 KB",
    generatedBy: "Admin Logistik",
    generatedAt: "15 Sep 2026, 14:45",
    rows: "126 barang",
    status: "Siap Unduh",
    progress: 100,
  },
  {
    id: "EXP-2026-005",
    title: "Rekap Peminjaman Logistik",
    module: "Logistik",
    period: "September 2026",
    format: "CSV",
    size: "420 KB",
    generatedBy: "Admin Logistik",
    generatedAt: "15 Sep 2026, 16:10",
    rows: "137 peminjaman",
    status: "Siap Unduh",
    progress: 100,
  },
  {
    id: "EXP-2026-006",
    title: "Laporan Presensi Event",
    module: "Event",
    period: "September 2026",
    format: "PDF",
    size: "-",
    generatedBy: "Admin Event",
    generatedAt: "14 Sep 2026, 20:22",
    rows: "Gagal diproses",
    status: "Gagal",
    progress: 18,
  },
];

const moduleExportData = [
  { module: "Anggota", value: 12 },
  { module: "UPA", value: 9 },
  { module: "Event", value: 7 },
  { module: "Keuangan", value: 10 },
  { module: "Logistik", value: 8 },
];

const moduleExportConfig = {
  value: {
    label: "Jumlah Export",
    color: "hsl(152 54% 44%)",
  },
} satisfies ChartConfig;

const formatDistribution = [
  { name: "PDF", value: 18 },
  { name: "Excel", value: 22 },
  { name: "CSV", value: 6 },
];

const formatDistributionConfig = {
  PDF: {
    label: "PDF",
    color: "hsl(0 84% 60%)",
  },
  Excel: {
    label: "Excel",
    color: "hsl(152 54% 44%)",
  },
  CSV: {
    label: "CSV",
    color: "hsl(199 89% 48%)",
  },
} satisfies ChartConfig;

const quickExportOptions = [
  {
    title: "Data Anggota",
    description: "Export anggota, jenjang, wilayah, and status kader.",
    format: "Excel",
    icon: IconFileSpreadsheet,
    tone: "emerald",
  },
  {
    title: "Absensi UPA",
    description: "Rekap kehadiran UPA per kelompok and per bulan.",
    format: "PDF",
    icon: IconFileText,
    tone: "sky",
  },
  {
    title: "Keuangan DPC",
    description: "Laporan kas masuk, kas keluar, and saldo bendahara.",
    format: "PDF",
    icon: IconChartBar,
    tone: "amber",
  },
  {
    title: "Logistik",
    description: "Daftar inventaris and histori peminjaman aset.",
    format: "Excel",
    icon: IconArchive,
    tone: "violet",
  },
];

const recentActivity = [
  {
    title: "Export Data Anggota berhasil",
    description: "2.845 baris data berhasil dibuat dalam format Excel.",
    time: "09:12",
    tone: "emerald",
  },
  {
    title: "Rekap Keuangan sedang diproses",
    description: "Sistem sedang menyusun laporan dari 1.284 transaksi.",
    time: "11:05",
    tone: "amber",
  },
  {
    title: "Laporan Presensi Event gagal",
    description: "Data presensi belum lengkap, perlu sinkronisasi ulang.",
    time: "20:22",
    tone: "rose",
  },
];

const tabs = [
  { label: "Semua", value: "all", count: "46" },
  { label: "Siap Unduh", value: "Siap Unduh", count: "32" },
  { label: "Draft", value: "Draft", count: "8" },
  { label: "Proses", value: "Proses", count: "6" },
  { label: "Gagal", value: "Gagal", count: "1" },
];

function getToneClass(tone: string) {
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

function getStatusBadgeClass(status: ExportStatus) {
  switch (status) {
    case "Siap Unduh":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Draft":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Proses":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "Gagal":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getFormatBadgeClass(format: ExportFormat) {
  switch (format) {
    case "PDF":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    case "Excel":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "CSV":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getFormatIcon(format: ExportFormat) {
  switch (format) {
    case "PDF":
      return IconFileText;
    case "Excel":
      return IconFileSpreadsheet;
    case "CSV":
      return IconDatabaseExport;
    default:
      return IconFileExport;
  }
}

function getProgressColor(status: ExportStatus) {
  switch (status) {
    case "Siap Unduh":
      return "text-emerald-300";
    case "Draft":
      return "text-amber-300";
    case "Proses":
      return "text-sky-300";
    case "Gagal":
      return "text-rose-300";
    default:
      return "text-zinc-300";
  }
}

export default function LaporanExportPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredDocuments = useMemo(() => {
    return exportDocuments.filter((document) => {
      const matchTab = activeTab === "all" || document.status === activeTab;
      const keyword = search.toLowerCase();

      const matchSearch =
        document.id.toLowerCase().includes(keyword) ||
        document.title.toLowerCase().includes(keyword) ||
        document.module.toLowerCase().includes(keyword) ||
        document.period.toLowerCase().includes(keyword) ||
        document.format.toLowerCase().includes(keyword) ||
        document.status.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

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
          <CardHeader className="flex flex-col gap-3 p-4 pb-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Generator Laporan Cepat
              </CardTitle>
              <CardDescription className="text-xs">
                Pilih modul untuk membuat export data sesuai kebutuhan.
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              className="rounded-xl border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300"
            >
              32 laporan siap diunduh
            </Badge>
          </CardHeader>

          <CardContent className="grid grid-cols-1 gap-3 p-4 pt-0 md:grid-cols-2">
            {quickExportOptions.map((option) => {
              const Icon = option.icon;

              return (
                <Card
                  key={option.title}
                  className="group rounded-2xl border-white/10 bg-zinc-950/40 transition hover:border-emerald-500/30 hover:bg-white/[0.04]"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${getToneClass(
                          option.tone
                        )}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <Badge
                        variant="outline"
                        className={`rounded-lg px-2 py-0 text-[10px] ${getFormatBadgeClass(
                          option.format as ExportFormat
                        )}`}
                      >
                        {option.format}
                      </Badge>
                    </div>

                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-zinc-100">
                        {option.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-zinc-500">
                        {option.description}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="mt-4 h-8 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                    >
                      <IconFileExport className="mr-1.5 h-3.5 w-3.5" />
                      Generate Export
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="text-sm font-semibold">
              Format Dokumen
            </CardTitle>
            <CardDescription className="text-xs">
              Distribusi format laporan yang digunakan.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-4 pt-0">
            <div className="relative">
              <ChartContainer
                className="h-[220px] w-full"
                config={formatDistributionConfig}
              >
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        indicator="dot"
                        nameKey="name"
                      />
                    }
                  />
                  <Pie
                    data={formatDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={86}
                    strokeWidth={0}
                  >
                    {formatDistribution.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          entry.name === "PDF"
                            ? "var(--color-PDF)"
                            : entry.name === "Excel"
                              ? "var(--color-Excel)"
                              : "var(--color-CSV)"
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-semibold tracking-tight text-zinc-50">
                  46
                </p>
                <p className="text-xs text-zinc-500">Total File</p>
              </div>
            </div>

            <div className="space-y-2">
              {formatDistribution.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2"
                >
                  <span className="text-xs text-zinc-300">
                    {item.name}
                  </span>
                  <span className="text-xs font-medium text-zinc-100">
                    {item.value} file
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Cari laporan, modul, format, status..."
                />
              </div>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>Semua Modul</option>
                <option>Data & Keanggotaan</option>
                <option>Pembinaan UPA</option>
                <option>Event</option>
                <option>Keuangan</option>
                <option>Logistik</option>
              </select>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>Semua Format</option>
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
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
                {filteredDocuments.map((document) => {
                  const FormatIcon = getFormatIcon(document.format);

                  return (
                    <Card
                      key={document.id}
                      className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex min-w-0 items-start gap-3">
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${getFormatBadgeClass(
                                document.format
                              )}`}
                            >
                              <FormatIcon className="h-5 w-5" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-sm font-semibold text-zinc-100">
                                  {document.title}
                                </h3>

                                <Badge
                                  variant="outline"
                                  className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                                    document.status
                                  )}`}
                                >
                                  {document.status}
                                </Badge>
                              </div>

                              <p className="mt-1 text-xs text-zinc-500">
                                {document.id} • {document.module} •{" "}
                                {document.period}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {document.status === "Siap Unduh" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                              >
                                <IconDownload className="mr-1.5 h-3.5 w-3.5" />
                                Unduh
                              </Button>
                            ) : document.status === "Proses" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-xl border-sky-400/30 bg-sky-400/10 px-3 text-xs text-sky-200 hover:bg-sky-400/20"
                              >
                                <IconClock className="mr-1.5 h-3.5 w-3.5" />
                                Proses
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                              >
                                <IconRefresh className="mr-1.5 h-3.5 w-3.5" />
                                Generate Ulang
                              </Button>
                            )}

                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                            >
                              <IconDots className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-4">
                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[10px] text-zinc-500">
                              Format
                            </p>
                            <p className="mt-1 text-xs font-semibold text-zinc-100">
                              {document.format}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[10px] text-zinc-500">
                              Ukuran
                            </p>
                            <p className="mt-1 text-xs font-medium text-zinc-200">
                              {document.size}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[10px] text-zinc-500">
                              Isi Data
                            </p>
                            <p className="mt-1 text-xs font-medium text-zinc-200">
                              {document.rows}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[10px] text-zinc-500">
                              Dibuat Oleh
                            </p>
                            <p className="mt-1 truncate text-xs font-medium text-zinc-200">
                              {document.generatedBy}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-500">
                              Progress export • {document.generatedAt}
                            </span>
                            <span
                              className={`font-semibold ${getProgressColor(
                                document.status
                              )}`}
                            >
                              {document.progress}%
                            </span>
                          </div>

                          <Progress
                            value={document.progress}
                            className="h-1.5 bg-white/5"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Export per Modul
              </CardTitle>
              <CardDescription className="text-xs">
                Jumlah export berdasarkan modul sistem.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/35 p-4">
                <ChartContainer
                  className="h-[220px] w-full"
                  config={moduleExportConfig}
                >
                  <BarChart
                    data={moduleExportData}
                    margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
                    barCategoryGap={22}
                  >
                    <defs>
                      <linearGradient
                        id="exportBarGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(152 54% 52%)"
                          stopOpacity={0.95}
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(152 54% 34%)"
                          stopOpacity={0.35}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      vertical={false}
                      stroke="rgba(255,255,255,0.06)"
                      strokeDasharray="4 8"
                    />

                    <XAxis
                      dataKey="module"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={10}
                      fontSize={10}
                      tick={{ fill: "rgba(244,244,245,0.45)" }}
                    />

                    <YAxis hide />

                    <ChartTooltip
                      cursor={{
                        fill: "rgba(255,255,255,0.035)",
                        radius: 12,
                      }}
                      content={<ChartTooltipContent />}
                    />

                    <Bar
                      dataKey="value"
                      fill="url(#exportBarGradient)"
                      radius={[10, 10, 4, 4]}
                      maxBarSize={42}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Aktivitas Terbaru
              </CardTitle>
              <CardDescription className="text-xs">
                Riwayat proses export terakhir.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              {recentActivity.map((activity, index) => (
                <div key={activity.title}>
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${getToneClass(
                        activity.tone
                      )}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-zinc-100">
                          {activity.title}
                        </p>
                        <span className="shrink-0 text-[10px] text-zinc-500">
                          {activity.time}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  {index < recentActivity.length - 1 ? (
                    <Separator className="mt-3 bg-white/10" />
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Catatan Export
              </CardTitle>
              <CardDescription className="text-xs">
                Rekomendasi penggunaan laporan.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconShieldCheck className="h-4 w-4 text-emerald-300" />
                  <p className="text-xs font-medium text-emerald-200">
                    32 laporan siap diunduh
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Laporan final bisa langsung digunakan untuk kebutuhan
                  rapat and arsip DPC.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconClock className="h-4 w-4 text-amber-300" />
                  <p className="text-xs font-medium text-amber-200">
                    Draft perlu dilengkapi
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Beberapa laporan masih menunggu data absensi and
                  validasi transaksi.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconFolderOpen className="h-4 w-4 text-sky-300" />
                  <p className="text-xs font-medium text-sky-200">
                    Gunakan format sesuai kebutuhan
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Excel untuk analisis, PDF untuk rapat, CSV untuk
                  integrasi data.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}