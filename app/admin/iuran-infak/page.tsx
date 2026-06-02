"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  IconAlertCircle,
  IconCash,
  IconChevronRight,
  IconCreditCard,
  IconDots,
  IconFilter,
  IconSearch,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";

interface UpaFinancialSummary {
  id: string;
  name: string;
  mentor: string;
  village: string;
  totalMembers: number;
  paidMembers: number;
  totalCollected: string;
  targetAmount: string;
  status: "Lancar" | "Perlu Follow Up";
}

const summaryCards = [
  {
    title: "Total Masuk",
    value: "Rp48.392.740",
    note: "+12.6% dari bulan lalu",
    icon: IconWallet,
    tone: "emerald",
  },
  {
    title: "Iuran Wajib",
    value: "Rp32.150.000",
    note: "1.842 anggota lunas",
    icon: IconCreditCard,
    tone: "sky",
  },
  {
    title: "Infak Sukarela",
    value: "Rp11.842.740",
    note: "naik dari bulan lalu",
    icon: IconCash,
    tone: "emerald",
  },
  {
    title: "Menunggak",
    value: "823",
    note: "anggota belum bayar",
    icon: IconAlertCircle,
    tone: "amber",
  },
];

const upaGroups: UpaFinancialSummary[] = [
  {
    id: "upa-babakan",
    name: "UPA Babakan",
    mentor: "Ust. Hamdan",
    village: "Babakan",
    totalMembers: 12,
    paidMembers: 10,
    totalCollected: "Rp1.250.000",
    targetAmount: "Rp1.500.000",
    status: "Lancar",
  },
  {
    id: "upa-dramaga",
    name: "UPA Dramaga",
    mentor: "Ust. Farid",
    village: "Dramaga",
    totalMembers: 10,
    paidMembers: 6,
    totalCollected: "Rp850.000",
    targetAmount: "Rp1.200.000",
    status: "Perlu Follow Up",
  },
  {
    id: "upa-cikarawang",
    name: "UPA Cikarawang",
    mentor: "Ust. Anwar",
    village: "Cikarawang",
    totalMembers: 8,
    paidMembers: 8,
    totalCollected: "Rp1.100.000",
    targetAmount: "Rp1.100.000",
    status: "Lancar",
  },
  {
    id: "upa-ciherang",
    name: "UPA Ciherang",
    mentor: "Ust. Ibrahim",
    village: "Ciherang",
    totalMembers: 15,
    paidMembers: 9,
    totalCollected: "Rp950.000",
    targetAmount: "Rp1.800.000",
    status: "Perlu Follow Up",
  },
];

const monthlyIncomeData = [
  { month: "Apr", value: 31.2 },
  { month: "Mei", value: 36.8 },
  { month: "Jun", value: 39.5 },
  { month: "Jul", value: 41.7 },
  { month: "Agu", value: 43.1 },
  { month: "Sep", value: 48.4 },
];

const monthlyIncomeConfig = {
  value: {
    label: "Kas masuk",
    color: "hsl(152 54% 44%)",
  },
} satisfies ChartConfig;

const overdueMembers = [
  {
    name: "Rizky Maulana",
    village: "Petir",
    months: "2 bulan",
    amount: "Rp100.000",
  },
  {
    name: "Dedi Kurniawan",
    village: "Cikarawang",
    months: "1 bulan",
    amount: "Rp50.000",
  },
  {
    name: "Maya Sari",
    village: "Cihideung Udik",
    months: "3 bulan",
    amount: "Rp150.000",
  },
];

const tabs = [
  { label: "Semua", value: "all", count: "24" },
  { label: "Lancar", value: "Lancar", count: "18" },
  { label: "Perlu Follow Up", value: "Perlu Follow Up", count: "6" },
];

function getInitials(name: string) {
  return name
    .replace("Ust.", "")
    .trim()
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
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "Lancar":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Perlu Follow Up":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export default function IuranInfakPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    return upaGroups.filter((group) => {
      const matchTab = activeTab === "all" || group.status === activeTab;
      const keyword = search.toLowerCase();

      const matchSearch =
        group.name.toLowerCase().includes(keyword) ||
        group.mentor.toLowerCase().includes(keyword) ||
        group.village.toLowerCase().includes(keyword);

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
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-12">
          <CardHeader className="flex flex-col gap-3 p-4 pb-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                Arus Kas Masuk
              </CardTitle>
              <CardDescription className="text-xs">
                Tren pemasukan iuran, infak, dan donasi dalam 6 bulan terakhir.
              </CardDescription>
            </div>

            <Badge
              variant="outline"
              className="rounded-xl border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300"
            >
              <IconTrendingUp className="mr-1 h-3.5 w-3.5" />
              +12.6%
            </Badge>
          </CardHeader>

          <CardContent className="p-4 pt-0">
            <ChartContainer
              className="h-[200px] w-full"
              config={monthlyIncomeConfig}
            >
              <AreaChart
                data={monthlyIncomeData}
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
                  dataKey="value"
                  type="monotone"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  fill="var(--color-value)"
                  fillOpacity={0.18}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-8">
          <CardHeader className="p-4 pb-3">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="grid flex-1 gap-3 xl:grid-cols-[1.4fr_0.8fr_0.8fr_auto]">
                <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                  <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                    placeholder="Cari kelompok, murabbi, desa..."
                  />
                </div>

                <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                  <option>Semua Desa</option>
                  <option>Babakan</option>
                  <option>Dramaga</option>
                  <option>Cikarawang</option>
                  <option>Ciherang</option>
                </select>

                <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                  <option>September 2026</option>
                  <option>Agustus 2026</option>
                  <option>Juli 2026</option>
                </select>

                <Button
                  variant="outline"
                  className="h-9 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10"
                >
                  <IconFilter className="mr-1.5 h-3.5 w-3.5" />
                  Filter
                </Button>
              </div>
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
                {filteredGroups.map((group) => (
                  <Card
                    key={group.id}
                    className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-sm font-semibold text-zinc-100">
                              {group.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                                group.status
                              )}`}
                            >
                              {group.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-zinc-500">
                            {group.village} • {group.totalMembers} Anggota
                          </p>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 shrink-0 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                        >
                          <IconDots className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={`https://picsum.photos/seed/${group.mentor}/64/64`}
                            alt={group.mentor}
                          />
                          <AvatarFallback className="text-[10px]">
                            {getInitials(group.mentor)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-zinc-100">
                            {group.mentor}
                          </p>
                          <p className="truncate text-[11px] text-zinc-500">
                            Murabbi
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                          <p className="text-[10px] text-zinc-500">
                            Terkumpul
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-emerald-400">
                            {group.totalCollected}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
                          <p className="text-[10px] text-zinc-500">
                            Target
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-zinc-300">
                            {group.targetAmount}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500">
                            Ketepatan Pembayaran
                          </span>
                          <span className="font-medium text-zinc-300">
                            {group.paidMembers}/{group.totalMembers} Anggota
                          </span>
                        </div>
                        <Progress
                          value={(group.paidMembers / group.totalMembers) * 100}
                          className="h-1.5 bg-white/5"
                        />
                      </div>

                      <Separator className="my-4 bg-white/10" />

                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                      >
                        <Link href={`/admin/iuran-infak/${group.id}`}>
                          Detail Keuangan
                          <IconChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between p-3">
                <p className="text-xs text-zinc-500">
                  Menampilkan{" "}
                  <span className="text-zinc-300">
                    {filteredGroups.length}
                  </span>{" "}
                  dari <span className="text-zinc-300">24</span> kelompok
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
                Tunggakan Prioritas
              </CardTitle>
              <CardDescription className="text-xs">
                Anggota yang perlu segera di-follow up.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              {overdueMembers.map((member, index) => (
                <div key={member.name}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-zinc-100">
                        {member.name}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        {member.village} • {member.months}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold text-amber-300">
                        {member.amount}
                      </p>
                      <p className="mt-1 text-[10px] text-zinc-500">
                        tunggakan
                      </p>
                    </div>
                  </div>

                  {index < overdueMembers.length - 1 ? (
                    <Separator className="mt-3 bg-white/10" />
                  ) : null}
                </div>
              ))}

              <Button
                variant="outline"
                className="h-9 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
              >
                Kirim Pengingat
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Catatan Bendahara
              </CardTitle>
              <CardDescription className="text-xs">
                Ringkasan kondisi pembayaran bulan ini.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                <p className="text-xs font-medium text-emerald-200">
                  Infak sukarela meningkat
                </p>
                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                  Kenaikan pemasukan infak berasal dari kegiatan sosial
                  dan donasi kader aktif.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="text-xs font-medium text-amber-200">
                  823 anggota menunggak
                </p>
                <p className="mt-1 text-[11px] leading-5 text-amber-100/70">
                  Perlu koordinasi dengan murabbi and koordinator UPA
                  untuk follow-up pembayaran.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
