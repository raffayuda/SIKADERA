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
import { Cell, Pie, PieChart } from "recharts";
import {
  IconAlertTriangle,
  IconBox,
  IconBuildingWarehouse,
  IconCheck,
  IconDots,
  IconDownload,
  IconFilter,
  IconPackage,
  IconPackageExport,
  IconPlus,
  IconSearch,
  IconSettings,
  IconTool,
  IconTruckDelivery,
} from "@tabler/icons-react";

type ItemStatus = "Tersedia" | "Dipinjam" | "Rusak" | "Perbaikan";
type ItemCondition = "Baik" | "Cukup" | "Rusak";

type InventoryItem = {
  code: string;
  name: string;
  category: string;
  location: string;
  total: number;
  available: number;
  borrowed: number;
  condition: ItemCondition;
  status: ItemStatus;
  lastUpdated: string;
};

const summaryCards = [
  {
    title: "Total Barang",
    value: "126",
    note: "aset tercatat",
    icon: IconPackage,
    tone: "emerald",
  },
  {
    title: "Tersedia",
    value: "78",
    note: "siap digunakan",
    icon: IconCheck,
    tone: "sky",
  },
  {
    title: "Dipinjam",
    value: "34",
    note: "sedang digunakan",
    icon: IconPackageExport,
    tone: "amber",
  },
  {
    title: "Rusak / Perbaikan",
    value: "14",
    note: "perlu tindak lanjut",
    icon: IconAlertTriangle,
    tone: "rose",
  },
];

const inventoryItems: InventoryItem[] = [
  {
    code: "LOG-001",
    name: "Tenda Lipat 3x3",
    category: "Perlengkapan Acara",
    location: "Gudang DPC",
    total: 12,
    available: 7,
    borrowed: 5,
    condition: "Baik",
    status: "Dipinjam",
    lastUpdated: "16 Sep 2026",
  },
  {
    code: "LOG-014",
    name: "Sound System Portable",
    category: "Audio",
    location: "Gudang DPC",
    total: 4,
    available: 3,
    borrowed: 1,
    condition: "Baik",
    status: "Tersedia",
    lastUpdated: "15 Sep 2026",
  },
  {
    code: "LOG-022",
    name: "Spanduk Kegiatan",
    category: "Media Publikasi",
    location: "Sekretariat",
    total: 18,
    available: 10,
    borrowed: 4,
    condition: "Cukup",
    status: "Tersedia",
    lastUpdated: "14 Sep 2026",
  },
  {
    code: "LOG-031",
    name: "Kursi Lipat",
    category: "Perlengkapan Acara",
    location: "Gudang DPC",
    total: 80,
    available: 48,
    borrowed: 28,
    condition: "Baik",
    status: "Dipinjam",
    lastUpdated: "13 Sep 2026",
  },
  {
    code: "LOG-044",
    name: "Microphone Wireless",
    category: "Audio",
    location: "Gudang DPC",
    total: 6,
    available: 2,
    borrowed: 2,
    condition: "Rusak",
    status: "Rusak",
    lastUpdated: "12 Sep 2026",
  },
  {
    code: "LOG-052",
    name: "Proyektor",
    category: "Elektronik",
    location: "Sekretariat",
    total: 3,
    available: 1,
    borrowed: 1,
    condition: "Cukup",
    status: "Perbaikan",
    lastUpdated: "10 Sep 2026",
  },
];

const stockDistribution = [
  { name: "Tersedia", value: 78 },
  { name: "Dipinjam", value: 34 },
  { name: "Rusak", value: 10 },
  { name: "Perbaikan", value: 4 },
];

const stockDistributionConfig = {
  Tersedia: {
    label: "Tersedia",
    color: "hsl(152 54% 44%)",
  },
  Dipinjam: {
    label: "Dipinjam",
    color: "hsl(43 96% 56%)",
  },
  Rusak: {
    label: "Rusak",
    color: "hsl(0 84% 60%)",
  },
  Perbaikan: {
    label: "Perbaikan",
    color: "hsl(199 89% 48%)",
  },
} satisfies ChartConfig;

const categoryStats = [
  { name: "Perlengkapan Acara", total: 92, percentage: 73 },
  { name: "Audio", total: 10, percentage: 8 },
  { name: "Media Publikasi", total: 18, percentage: 14 },
  { name: "Elektronik", total: 6, percentage: 5 },
];

const activeLoans = [
  {
    borrower: "UPA Babakan",
    item: "Tenda Lipat 3x3",
    amount: "2 unit",
    due: "28 Sep 2026",
    status: "Aktif",
  },
  {
    borrower: "DPRa Dramaga",
    item: "Sound System Portable",
    amount: "1 unit",
    due: "25 Sep 2026",
    status: "Aktif",
  },
  {
    borrower: "Panitia Bakti Sosial",
    item: "Kursi Lipat",
    amount: "40 unit",
    due: "24 Sep 2026",
    status: "Terlambat",
  },
];

const tabs = [
  { label: "Semua", value: "all", count: "126" },
  { label: "Tersedia", value: "Tersedia", count: "78" },
  { label: "Dipinjam", value: "Dipinjam", count: "34" },
  { label: "Rusak", value: "Rusak", count: "10" },
  { label: "Perbaikan", value: "Perbaikan", count: "4" },
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
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getStatusBadgeClass(status: ItemStatus) {
  switch (status) {
    case "Tersedia":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Dipinjam":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Rusak":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    case "Perbaikan":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getConditionBadgeClass(condition: ItemCondition) {
  switch (condition) {
    case "Baik":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Cukup":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Rusak":
      return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getStockPercentage(item: InventoryItem) {
  if (item.total === 0) return 0;
  return Math.round((item.available / item.total) * 100);
}

export default function InventarisLogistikPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredItems = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchTab = activeTab === "all" || item.status === activeTab;
      const keyword = search.toLowerCase();

      const matchSearch =
        item.name.toLowerCase().includes(keyword) ||
        item.code.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.location.toLowerCase().includes(keyword) ||
        item.status.toLowerCase().includes(keyword);

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
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-5">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="text-sm font-semibold">
              Distribusi Stok Barang
            </CardTitle>
            <CardDescription className="text-xs">
              Komposisi status inventaris logistik saat ini.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-4 pt-0">
            <div className="relative">
              <ChartContainer
                className="h-[230px] w-full"
                config={stockDistributionConfig}
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
                    data={stockDistribution}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={64}
                    outerRadius={88}
                    strokeWidth={0}
                  >
                    {stockDistribution.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          entry.name === "Tersedia"
                            ? "var(--color-Tersedia)"
                            : entry.name === "Dipinjam"
                              ? "var(--color-Dipinjam)"
                              : entry.name === "Rusak"
                                ? "var(--color-Rusak)"
                                : "var(--color-Perbaikan)"
                        }
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-semibold tracking-tight text-zinc-50">
                  126
                </p>
                <p className="text-xs text-zinc-500">Total Barang</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {stockDistribution.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-white/10 bg-zinc-950/40 px-3 py-2"
                >
                  <p className="text-[10px] text-zinc-500">
                    {item.name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-100">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-7">
          <CardHeader className="p-4 pb-3">
            <CardTitle className="text-sm font-semibold">
              Kategori Inventaris
            </CardTitle>
            <CardDescription className="text-xs">
              Sebaran barang berdasarkan kategori logistik.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-4 pt-0">
            {categoryStats.map((category) => (
              <div
                key={category.name}
                className="rounded-2xl border border-white/10 bg-zinc-950/40 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300">
                      <IconBox className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-100">
                        {category.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {category.total} barang tercatat
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="rounded-lg border-white/10 bg-white/5 px-2 py-0 text-[10px] text-zinc-300"
                  >
                    {category.percentage}%
                  </Badge>
                </div>

                <div className="mt-3">
                  <Progress
                    value={category.percentage}
                    className="h-1.5 bg-white/5"
                  />
                </div>
              </div>
            ))}
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
                  placeholder="Cari kode, nama barang, kategori, lokasi..."
                />
              </div>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>Semua Kategori</option>
                <option>Perlengkapan Acara</option>
                <option>Audio</option>
                <option>Elektronik</option>
                <option>Media Publikasi</option>
              </select>

              <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                <option>Semua Lokasi</option>
                <option>Gudang DPC</option>
                <option>Sekretariat</option>
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

              <div className="grid grid-cols-1 gap-3 p-3 lg:grid-cols-2">
                {filteredItems.map((item) => (
                  <Card
                    key={item.code}
                    className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300">
                            <IconPackage className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-sm font-semibold text-zinc-100">
                                {item.name}
                              </h3>

                              <Badge
                                variant="outline"
                                className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </Badge>
                            </div>

                            <p className="mt-1 text-xs text-zinc-500">
                              {item.code} • {item.category}
                            </p>
                          </div>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 shrink-0 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                        >
                          <IconDots className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                          <p className="text-[10px] text-zinc-500">
                            Total
                          </p>
                          <p className="text-sm font-semibold text-zinc-100">
                            {item.total}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                          <p className="text-[10px] text-zinc-500">
                            Tersedia
                          </p>
                          <p className="text-sm font-semibold text-emerald-300">
                            {item.available}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                          <p className="text-[10px] text-zinc-500">
                            Dipinjam
                          </p>
                          <p className="text-sm font-semibold text-amber-300">
                            {item.borrowed}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500">
                            Ketersediaan stok
                          </span>
                          <span className="font-semibold text-zinc-200">
                            {getStockPercentage(item)}%
                          </span>
                        </div>

                        <Progress
                          value={getStockPercentage(item)}
                          className="h-1.5 bg-white/5"
                        />
                      </div>

                      <Separator className="my-4 bg-white/10" />

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] text-zinc-500">
                            Lokasi
                          </p>
                          <p className="truncate text-xs font-medium text-zinc-200">
                            {item.location}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`rounded-lg px-2 py-0 text-[10px] ${getConditionBadgeClass(
                              item.condition
                            )}`}
                          >
                            {item.condition}
                          </Badge>

                          <p className="text-[10px] text-zinc-500">
                            Update {item.lastUpdated}
                          </p>
                        </div>
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
                Tambah Inventaris Cepat
              </CardTitle>
              <CardDescription className="text-xs">
                Input barang baru ke gudang logistik.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-zinc-500">
                  Nama Barang
                </p>
                <Input
                  className="h-9 rounded-xl border-white/10 bg-zinc-950/50 text-xs text-zinc-200 placeholder:text-zinc-500"
                  placeholder="Contoh: Tenda Lipat 3x3"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-zinc-500">
                    Kategori
                  </p>
                  <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                    <option>Perlengkapan Acara</option>
                    <option>Audio</option>
                    <option>Elektronik</option>
                    <option>Media Publikasi</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-zinc-500">
                    Jumlah
                  </p>
                  <Input
                    className="h-9 rounded-xl border-white/10 bg-zinc-950/50 text-xs text-zinc-200 placeholder:text-zinc-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-zinc-500">
                  Lokasi Penyimpanan
                </p>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                  <option>Gudang DPC</option>
                  <option>Sekretariat</option>
                </select>
              </div>

              <Button className="h-9 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                <IconPlus className="mr-1.5 h-3.5 w-3.5" />
                Simpan Barang
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Peminjaman Aktif
              </CardTitle>
              <CardDescription className="text-xs">
                Barang yang sedang dipinjam.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              {activeLoans.map((loan, index) => (
                <div key={`${loan.borrower}-${loan.item}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-zinc-100">
                        {loan.item}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        {loan.borrower} • {loan.amount}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        Tenggat: {loan.due}
                      </p>
                    </div>

                    <Badge
                      variant="outline"
                      className={
                        loan.status === "Terlambat"
                          ? "shrink-0 rounded-lg border-rose-500/30 bg-rose-500/10 px-2 py-0 text-[10px] text-rose-300"
                          : "shrink-0 rounded-lg border-amber-500/30 bg-amber-500/10 px-2 py-0 text-[10px] text-amber-300"
                      }
                    >
                      {loan.status}
                    </Badge>
                  </div>

                  {index < activeLoans.length - 1 ? (
                    <Separator className="mt-3 bg-white/10" />
                  ) : null}
                </div>
              ))}

              <Button
                variant="outline"
                className="h-9 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
              >
                <IconTruckDelivery className="mr-1.5 h-3.5 w-3.5" />
                Kelola Peminjaman
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Catatan Logistik
              </CardTitle>
              <CardDescription className="text-xs">
                Rekomendasi pengelolaan aset.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconBuildingWarehouse className="h-4 w-4 text-emerald-300" />
                  <p className="text-xs font-medium text-emerald-200">
                    Stok utama masih aman
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Sebagian besar perlengkapan acara masih tersedia dan
                  siap digunakan.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconSettings className="h-4 w-4 text-amber-300" />
                  <p className="text-xs font-medium text-amber-200">
                    Perlu monitoring peminjaman
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Ada barang yang mendekati tenggat pengembalian.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3">
                <div className="flex items-center gap-2">
                  <IconTool className="h-4 w-4 text-rose-300" />
                  <p className="text-xs font-medium text-rose-200">
                    Barang rusak perlu ditindaklanjuti
                  </p>
                </div>
                <p className="mt-1 text-[11px] leading-5 text-rose-100/70">
                  Microphone wireless dan beberapa spanduk perlu
                  diperiksa kembali.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}