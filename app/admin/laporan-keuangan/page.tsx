"use client";

import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Area,
  AreaChart,
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
  IconArrowDownRight,
  IconArrowUpRight,
  IconCash,
  IconChartBar,
  IconChecks,
  IconClock,
  IconDots,
  IconDownload,
  IconFileAnalytics,
  IconFileExport,
  IconFilter,
  IconPlus,
  IconReceipt,
  IconSearch,
  IconShieldCheck,
  IconWallet,
} from "@tabler/icons-react";

type ReportStatus = "Final" | "Draft" | "Review";
type TransactionType = "Pemasukan" | "Pengeluaran";

type FinanceReport = {
  title: string;
  period: string;
  income: string;
  expense: string;
  balance: string;
  transactionCount: number;
  createdBy: string;
  status: ReportStatus;
  progress: number;
};

type Transaction = {
  title: string;
  code: string;
  category: string;
  type: TransactionType;
  amount: string;
  date: string;
  source: string;
  status: "Terverifikasi" | "Menunggu";
};

const summaryCards = [
  {
    title: "Saldo Kas DPC",
    value: "Rp126.850.000",
    note: "+8.2% dari bulan lalu",
    icon: IconWallet,
    tone: "emerald",
  },
  {
    title: "Kas Masuk",
    value: "Rp48.392.740",
    note: "September 2026",
    icon: IconArrowUpRight,
    tone: "sky",
  },
  {
    title: "Kas Keluar",
    value: "Rp21.740.000",
    note: "operasional & kegiatan",
    icon: IconArrowDownRight,
    tone: "amber",
  },
  {
    title: "Laporan Final",
    value: "8",
    note: "dokumen siap unduh",
    icon: IconShieldCheck,
    tone: "violet",
  },
];

const cashflowData = [
  { month: "Apr", masuk: 31.2, keluar: 18.5 },
  { month: "Mei", masuk: 36.8, keluar: 20.4 },
  { month: "Jun", masuk: 39.5, keluar: 23.2 },
  { month: "Jul", masuk: 41.7, keluar: 19.8 },
  { month: "Agu", masuk: 43.1, keluar: 22.7 },
  { month: "Sep", masuk: 48.4, keluar: 21.7 },
];

const cashflowConfig = {
  masuk: {
    label: "Kas Masuk",
    color: "hsl(152 54% 44%)",
  },
  keluar: {
    label: "Kas Keluar",
    color: "hsl(43 96% 56%)",
  },
} satisfies ChartConfig;

const categoryData = [
  { name: "Iuran Wajib", value: 32.1 },
  { name: "Infak Sukarela", value: 11.8 },
  { name: "Donasi Kegiatan", value: 4.4 },
];

const categoryConfig = {
  "Iuran Wajib": {
    label: "Iuran Wajib",
    color: "hsl(199 89% 48%)",
  },
  "Infak Sukarela": {
    label: "Infak Sukarela",
    color: "hsl(152 54% 44%)",
  },
  "Donasi Kegiatan": {
    label: "Donasi Kegiatan",
    color: "hsl(262 83% 58%)",
  },
} satisfies ChartConfig;

const expenseBreakdownData = [
  { name: "Logistik", value: 8.4 },
  { name: "Event", value: 6.2 },
  { name: "Operasional", value: 4.8 },
  { name: "Sosial", value: 2.3 },
];

const reports: FinanceReport[] = [
  {
    title: "Laporan Keuangan September",
    period: "01 - 30 Sep 2026",
    income: "Rp48.392.740",
    expense: "Rp21.740.000",
    balance: "Rp26.652.740",
    transactionCount: 1284,
    createdBy: "Bendahara DPC",
    status: "Draft",
    progress: 76,
  },
  {
    title: "Laporan Keuangan Agustus",
    period: "01 - 31 Agu 2026",
    income: "Rp43.100.000",
    expense: "Rp22.700.000",
    balance: "Rp20.400.000",
    transactionCount: 1102,
    createdBy: "Bendahara DPC",
    status: "Final",
    progress: 100,
  },
  {
    title: "Audit Kas Bakti Sosial",
    period: "20 - 28 Sep 2026",
    income: "Rp12.500.000",
    expense: "Rp8.250.000",
    balance: "Rp4.250.000",
    transactionCount: 84,
    createdBy: "Tim Kegiatan",
    status: "Review",
    progress: 62,
  },
];

const transactions: Transaction[] = [
  {
    title: "Iuran Wajib September",
    code: "TRX-2026-0921",
    category: "Iuran Wajib",
    type: "Pemasukan",
    amount: "Rp50.000",
    date: "16 Sep 2026",
    source: "Ahmad Fauzi",
    status: "Terverifikasi",
  },
  {
    title: "Infak Sukarela",
    code: "TRX-2026-0922",
    category: "Infak Sukarela",
    type: "Pemasukan",
    amount: "Rp100.000",
    date: "16 Sep 2026",
    source: "Siti Nurhaliza",
    status: "Terverifikasi",
  },
  {
    title: "Pembelian Konsumsi Rapat",
    code: "TRX-2026-0923",
    category: "Operasional",
    type: "Pengeluaran",
    amount: "Rp450.000",
    date: "15 Sep 2026",
    source: "Sekretariat DPC",
    status: "Terverifikasi",
  },
  {
    title: "Sewa Sound System",
    code: "TRX-2026-0924",
    category: "Logistik",
    type: "Pengeluaran",
    amount: "Rp1.200.000",
    date: "15 Sep 2026",
    source: "Event Bakti Sosial",
    status: "Menunggu",
  },
];

const tabs = [
  { label: "Semua", value: "all", count: "24" },
  { label: "Final", value: "Final", count: "8" },
  { label: "Draft", value: "Draft", count: "11" },
  { label: "Review", value: "Review", count: "5" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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

function getStatusBadgeClass(status: ReportStatus) {
  switch (status) {
    case "Final":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Draft":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Review":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getTransactionBadgeClass(type: TransactionType) {
  switch (type) {
    case "Pemasukan":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Pengeluaran":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export default function LaporanKeuanganPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchTab = activeTab === "all" || report.status === activeTab;
      const keyword = search.toLowerCase();

      const matchSearch =
        report.title.toLowerCase().includes(keyword) ||
        report.period.toLowerCase().includes(keyword) ||
        report.createdBy.toLowerCase().includes(keyword) ||
        report.status.toLowerCase().includes(keyword);

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
                Arus Kas DPC
              </CardTitle>
              <CardDescription className="text-xs">
                Perbandingan kas masuk and kas keluar selama 6 bulan.
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              className="rounded-xl border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300"
            >
              Saldo positif Rp26.652.740
            </Badge>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <ChartContainer className="h-[280px] w-full" config={cashflowConfig}>
              <AreaChart
                data={cashflowData}
                margin={{ left: 4, right: 4, top: 10, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="rgba(255,255,255,0.08)"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  fontSize={11}
                />
                <YAxis hide />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="masuk"
                  type="monotone"
                  stroke="var(--color-masuk)"
                  strokeWidth={2}
                  fill="var(--color-masuk)"
                  fillOpacity={0.18}
                />
                <Area
                  dataKey="keluar"
                  type="monotone"
                  stroke="var(--color-keluar)"
                  strokeWidth={2}
                  fill="var(--color-keluar)"
                  fillOpacity={0.12}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="text-sm font-semibold">
              Sumber Kas Masuk
            </CardTitle>
            <CardDescription className="text-xs">
              Komposisi pemasukan bulan ini.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-4 pt-0">
            <div className="relative">
              <ChartContainer className="h-[220px] w-full" config={categoryConfig}>
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
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={86}
                    strokeWidth={0}
                  >
                    {categoryData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          entry.name === "Iuran Wajib"
                            ? "#3b82f6"
                            : entry.name === "Infak Sukarela"
                              ? "#10b981"
                              : "#8b5cf6"
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-semibold tracking-tight text-zinc-50">
                  48.4jt
                </p>
                <p className="text-xs text-zinc-500">Kas Masuk</p>
              </div>
            </div>

            <div className="space-y-2">
              {categoryData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2"
                >
                  <span className="text-xs text-zinc-300">
                    {item.name}
                  </span>
                  <span className="text-xs font-medium text-zinc-100">
                    Rp{item.value}jt
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
                  placeholder="Cari laporan, periode, pembuat, atau status..."
                />
              </div>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>Semua Periode</option>
                <option>September 2026</option>
                <option>Agustus 2026</option>
                <option>Juli 2026</option>
              </select>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>Semua Status</option>
                <option>Final</option>
                <option>Draft</option>
                <option>Review</option>
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
                {filteredReports.map((report) => (
                  <Card
                    key={report.title}
                    className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-zinc-100">
                              {report.title}
                            </h3>

                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                                report.status
                              )}`}
                            >
                              {report.status}
                            </Badge>
                          </div>

                          <p className="mt-1 text-xs text-zinc-500">
                            {report.period} • {report.createdBy}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                          >
                            <IconDownload className="mr-1.5 h-3.5 w-3.5" />
                            Unduh
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

                      <div className="mt-4 grid gap-3 md:grid-cols-4">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] text-zinc-500">
                            Kas Masuk
                          </p>
                          <p className="mt-1 text-xs font-semibold text-emerald-300">
                            {report.income}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] text-zinc-500">
                            Kas Keluar
                          </p>
                          <p className="mt-1 text-xs font-semibold text-amber-300">
                            {report.expense}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] text-zinc-500">
                            Saldo Bersih
                          </p>
                          <p className="mt-1 text-xs font-semibold text-zinc-100">
                            {report.balance}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-[10px] text-zinc-500">
                            Transaksi
                          </p>
                          <p className="mt-1 text-xs font-semibold text-zinc-100">
                            {report.transactionCount} data
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500">
                            Kelengkapan laporan
                          </span>
                          <span className="font-semibold text-zinc-200">
                            {report.progress}%
                          </span>
                        </div>
                        <Progress
                          value={report.progress}
                          className="h-1.5 bg-white/5"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Breakdown Pengeluaran
              </CardTitle>
              <CardDescription className="text-xs">
                Pengeluaran berdasarkan kategori.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              <ChartContainer className="h-[220px] w-full" config={cashflowConfig}>
                <BarChart
                  data={expenseBreakdownData}
                  margin={{ top: 10, right: 4, left: 4, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(255,255,255,0.08)"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={10}
                  />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    fill="var(--color-keluar)"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Transaksi Terbaru
              </CardTitle>
              <CardDescription className="text-xs">
                Aktivitas keuangan terakhir.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              {transactions.map((transaction, index) => (
                <div key={transaction.code}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className={[
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border",
                            transaction.type === "Pemasukan"
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                              : "border-amber-500/20 bg-amber-500/10 text-amber-300",
                          ].join(" ")}
                        >
                          {transaction.type === "Pemasukan" ? (
                            <IconArrowUpRight className="h-4 w-4" />
                          ) : (
                            <IconArrowDownRight className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-zinc-100">
                            {transaction.title}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                            {transaction.source} • {transaction.date}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={
                          transaction.type === "Pemasukan"
                            ? "text-xs font-semibold text-emerald-300"
                            : "text-xs font-semibold text-amber-300"
                        }
                      >
                        {transaction.amount}
                      </p>
                      <Badge
                        variant="outline"
                        className={`mt-1 rounded-lg px-2 py-0 text-[10px] ${getTransactionBadgeClass(
                          transaction.type
                        )}`}
                      >
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>

                  {index < transactions.length - 1 ? (
                    <Separator className="mt-3 bg-white/10" />
                  ) : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Catatan Audit
              </CardTitle>
              <CardDescription className="text-xs">
                Status validasi laporan bendahara.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconChecks className="h-4 w-4 text-emerald-300" />
                  <p className="text-xs font-medium text-emerald-200">
                    8 laporan sudah final
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Laporan final dapat langsung diunduh untuk kebutuhan
                  rapat DPC.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconClock className="h-4 w-4 text-amber-300" />
                  <p className="text-xs font-medium text-amber-200">
                    September masih draft
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Perlu validasi transaksi pengeluaran sebelum laporan
                  dijadikan final.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconFileExport className="h-4 w-4 text-sky-300" />
                  <p className="text-xs font-medium text-sky-200">
                    Export Excel & PDF
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Gunakan format Excel untuk audit detail and PDF untuk
                  laporan rapat.
                </p>
              </div>

              <Button className="h-9 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                <IconFileAnalytics className="mr-1.5 h-3.5 w-3.5" />
                Review Laporan Bulan Ini
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}