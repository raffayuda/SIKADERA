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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    IconAlertTriangle,
    IconCalendarDue,
    IconCheck,
    IconClock,
    IconDots,
    IconDownload,
    IconFilter,
    IconPackageExport,
    IconPlus,
    IconRefresh,
    IconSearch,
    IconTruckDelivery,
    IconUserCheck,
    IconX,
} from "@tabler/icons-react";

type LoanStatus = "Menunggu" | "Disetujui" | "Dipinjam" | "Dikembalikan" | "Terlambat";

type LoanItem = {
    id: string;
    borrower: string;
    borrowerType: string;
    village: string;
    item: string;
    amount: string;
    requestDate: string;
    borrowDate: string;
    dueDate: string;
    approvedBy: string;
    purpose: string;
    status: LoanStatus;
    progress: number;
};

const summaryCards = [
    {
        title: "Peminjaman Aktif",
        value: "34",
        note: "barang sedang digunakan",
        icon: IconPackageExport,
        tone: "amber",
    },
    {
        title: "Menunggu Approval",
        value: "8",
        note: "permintaan baru",
        icon: IconClock,
        tone: "sky",
    },
    {
        title: "Dikembalikan",
        value: "92",
        note: "bulan ini",
        icon: IconCheck,
        tone: "emerald",
    },
    {
        title: "Terlambat",
        value: "3",
        note: "perlu follow-up",
        icon: IconAlertTriangle,
        tone: "rose",
    },
];

const loanItems: LoanItem[] = [
    {
        id: "LOAN-2026-001",
        borrower: "UPA Babakan",
        borrowerType: "Kelompok UPA",
        village: "Babakan",
        item: "Tenda Lipat 3x3",
        amount: "2 unit",
        requestDate: "14 Sep 2026",
        borrowDate: "16 Sep 2026",
        dueDate: "28 Sep 2026",
        approvedBy: "Admin Logistik",
        purpose: "Kajian dan bakti sosial wilayah Babakan",
        status: "Dipinjam",
        progress: 62,
    },
    {
        id: "LOAN-2026-002",
        borrower: "DPRa Dramaga",
        borrowerType: "DPRa",
        village: "Dramaga",
        item: "Sound System Portable",
        amount: "1 unit",
        requestDate: "15 Sep 2026",
        borrowDate: "17 Sep 2026",
        dueDate: "25 Sep 2026",
        approvedBy: "Admin Logistik",
        purpose: "Rapat koordinasi dan kajian terbuka",
        status: "Dipinjam",
        progress: 78,
    },
    {
        id: "LOAN-2026-003",
        borrower: "Panitia Bakti Sosial",
        borrowerType: "Panitia Event",
        village: "Dramaga",
        item: "Kursi Lipat",
        amount: "40 unit",
        requestDate: "10 Sep 2026",
        borrowDate: "12 Sep 2026",
        dueDate: "24 Sep 2026",
        approvedBy: "Bendahara Logistik",
        purpose: "Kegiatan bakti sosial DPC Dramaga",
        status: "Terlambat",
        progress: 100,
    },
    {
        id: "LOAN-2026-004",
        borrower: "UPA Cikarawang",
        borrowerType: "Kelompok UPA",
        village: "Cikarawang",
        item: "Proyektor",
        amount: "1 unit",
        requestDate: "17 Sep 2026",
        borrowDate: "-",
        dueDate: "-",
        approvedBy: "-",
        purpose: "Presentasi materi pembinaan anggota",
        status: "Menunggu",
        progress: 25,
    },
    {
        id: "LOAN-2026-005",
        borrower: "DPRa Ciherang",
        borrowerType: "DPRa",
        village: "Ciherang",
        item: "Spanduk Kegiatan",
        amount: "3 unit",
        requestDate: "13 Sep 2026",
        borrowDate: "14 Sep 2026",
        dueDate: "18 Sep 2026",
        approvedBy: "Admin Logistik",
        purpose: "Publikasi acara kajian wilayah",
        status: "Dikembalikan",
        progress: 100,
    },
];

const loanTrendData = [
    { month: "Apr", aktif: 18, kembali: 46 },
    { month: "Mei", aktif: 21, kembali: 52 },
    { month: "Jun", aktif: 25, kembali: 58 },
    { month: "Jul", aktif: 29, kembali: 64 },
    { month: "Agu", aktif: 31, kembali: 71 },
    { month: "Sep", aktif: 34, kembali: 92 },
];

const loanTrendConfig = {
  aktif: {
    label: "Peminjaman Aktif",
    color: "hsl(43 96% 56%)",
  },
  kembali: {
    label: "Dikembalikan",
    color: "hsl(152 54% 44%)",
  },
} satisfies ChartConfig;

const upcomingReturns = [
    {
        item: "Sound System Portable",
        borrower: "DPRa Dramaga",
        dueDate: "25 Sep 2026",
        status: "Besok",
    },
    {
        item: "Tenda Lipat 3x3",
        borrower: "UPA Babakan",
        dueDate: "28 Sep 2026",
        status: "3 hari lagi",
    },
    {
        item: "Kursi Lipat",
        borrower: "Panitia Bakti Sosial",
        dueDate: "24 Sep 2026",
        status: "Terlambat",
    },
];

const tabs = [
    { label: "Semua", value: "all", count: "137" },
    { label: "Menunggu", value: "Menunggu", count: "8" },
    { label: "Dipinjam", value: "Dipinjam", count: "34" },
    { label: "Dikembalikan", value: "Dikembalikan", count: "92" },
    { label: "Terlambat", value: "Terlambat", count: "3" },
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
        default:
            return "border-white/10 bg-white/5 text-zinc-300";
    }
}

function getStatusBadgeClass(status: LoanStatus) {
    switch (status) {
        case "Menunggu":
            return "border-sky-500/30 bg-sky-500/10 text-sky-300";
        case "Disetujui":
            return "border-violet-500/30 bg-violet-500/10 text-violet-300";
        case "Dipinjam":
            return "border-amber-500/30 bg-amber-500/10 text-amber-300";
        case "Dikembalikan":
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
        case "Terlambat":
            return "border-rose-500/30 bg-rose-500/10 text-rose-300";
        default:
            return "border-white/10 bg-white/5 text-zinc-300";
    }
}

function getProgressColor(status: LoanStatus) {
    switch (status) {
        case "Terlambat":
            return "text-rose-300";
        case "Dikembalikan":
            return "text-emerald-300";
        case "Menunggu":
            return "text-sky-300";
        default:
            return "text-amber-300";
    }
}

export default function PeminjamanLogistikPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [search, setSearch] = useState("");

    const filteredLoans = useMemo(() => {
        return loanItems.filter((loan) => {
            const matchTab = activeTab === "all" || loan.status === activeTab;
            const keyword = search.toLowerCase();

            const matchSearch =
                loan.id.toLowerCase().includes(keyword) ||
                loan.borrower.toLowerCase().includes(keyword) ||
                loan.borrowerType.toLowerCase().includes(keyword) ||
                loan.village.toLowerCase().includes(keyword) ||
                loan.item.toLowerCase().includes(keyword) ||
                loan.status.toLowerCase().includes(keyword);

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
                <Card className="rounded-2xl border-white/10 bg-zinc-900/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-8">
                    <CardHeader className="flex flex-col gap-3 p-4 pb-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <CardTitle className="text-sm font-semibold">
                                Tren Peminjaman Logistik
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Perbandingan barang dipinjam and dikembalikan dalam 6 bulan.
                            </CardDescription>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="hidden items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 md:flex">
                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-amber-300/80" />
                                    <span className="text-[11px] text-zinc-400">Aktif</span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
                                    <span className="text-[11px] text-zinc-400">Dikembalikan</span>
                                </div>
                            </div>

                            <Badge
                                variant="outline"
                                className="rounded-xl border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] text-amber-200"
                            >
                                3 item terlambat kembali
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 pt-0">
                        <div className="rounded-2xl border border-white/10 bg-zinc-950/35 p-4">
                            <ChartContainer className="h-[270px] w-full" config={loanTrendConfig}>
                                <BarChart
                                    data={loanTrendData}
                                    margin={{ top: 12, right: 8, left: 8, bottom: 0 }}
                                    barGap={8}
                                    barCategoryGap={28}
                                >
                                    <defs>
                                        <linearGradient id="loanActiveGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="hsl(43 96% 62%)" stopOpacity={0.95} />
                                            <stop offset="100%" stopColor="hsl(43 96% 48%)" stopOpacity={0.35} />
                                        </linearGradient>

                                        <linearGradient id="loanReturnGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="hsl(152 54% 52%)" stopOpacity={0.95} />
                                            <stop offset="100%" stopColor="hsl(152 54% 36%)" stopOpacity={0.35} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        vertical={false}
                                        stroke="rgba(255,255,255,0.06)"
                                        strokeDasharray="4 8"
                                    />

                                    <XAxis
                                        dataKey="month"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        fontSize={11}
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
                                        dataKey="aktif"
                                        fill="url(#loanActiveGradient)"
                                        radius={[10, 10, 4, 4]}
                                        maxBarSize={42}
                                    />

                                    <Bar
                                        dataKey="kembali"
                                        fill="url(#loanReturnGradient)"
                                        radius={[10, 10, 4, 4]}
                                        maxBarSize={42}
                                    />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:col-span-4">
                    <CardHeader className="p-4 pb-3">
                        <CardTitle className="text-sm font-semibold">
                            Pengembalian Terdekat
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Daftar barang yang mendekati tenggat.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-3 p-4 pt-0">
                        {upcomingReturns.map((item, index) => (
                            <div key={`${item.item}-${item.borrower}`}>
                                <div className="flex items-start gap-3">
                                    <div
                                        className={[
                                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border",
                                            item.status === "Terlambat"
                                                ? "border-rose-500/20 bg-rose-500/10 text-rose-300"
                                                : "border-amber-500/20 bg-amber-500/10 text-amber-300",
                                        ].join(" ")}
                                    >
                                        <IconCalendarDue className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-xs font-semibold text-zinc-100">
                                                    {item.item}
                                                </p>
                                                <p className="mt-1 text-[11px] text-zinc-500">
                                                    {item.borrower}
                                                </p>
                                                <p className="mt-1 text-[11px] text-zinc-500">
                                                    Tenggat: {item.dueDate}
                                                </p>
                                            </div>

                                            <Badge
                                                variant="outline"
                                                className={
                                                    item.status === "Terlambat"
                                                        ? "rounded-lg border-rose-500/30 bg-rose-500/10 px-2 py-0 text-[10px] text-rose-300"
                                                        : "rounded-lg border-amber-500/30 bg-amber-500/10 px-2 py-0 text-[10px] text-amber-300"
                                                }
                                            >
                                                {item.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {index < upcomingReturns.length - 1 ? (
                                    <Separator className="mt-3 bg-white/10" />
                                ) : null}
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            className="h-9 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10"
                        >
                            <IconTruckDelivery className="mr-1.5 h-3.5 w-3.5" />
                            Lihat Semua Tenggat
                        </Button>
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
                                    placeholder="Cari ID, peminjam, barang, desa, status..."
                                />
                            </div>

                            <select className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                                <option>Semua Peminjam</option>
                                <option>Kelompok UPA</option>
                                <option>DPRa</option>
                                <option>Panitia Event</option>
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
                                {filteredLoans.map((loan) => (
                                    <Card
                                        key={loan.id}
                                        className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage
                                                            src={`https://picsum.photos/seed/${loan.borrower}/64/64`}
                                                            alt={loan.borrower}
                                                        />
                                                        <AvatarFallback className="text-[10px]">
                                                            {getInitials(loan.borrower)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div className="min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="truncate text-sm font-semibold text-zinc-100">
                                                                {loan.borrower}
                                                            </h3>

                                                            <Badge
                                                                variant="outline"
                                                                className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                                                                    loan.status
                                                                )}`}
                                                            >
                                                                {loan.status}
                                                            </Badge>
                                                        </div>

                                                        <p className="mt-1 text-xs text-zinc-500">
                                                            {loan.id} • {loan.borrowerType} •{" "}
                                                            {loan.village}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {loan.status === "Menunggu" ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                className="h-8 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-3 text-xs text-emerald-100 hover:bg-emerald-400/25"
                                                            >
                                                                <IconUserCheck className="mr-1.5 h-3.5 w-3.5" />
                                                                Approve
                                                            </Button>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 rounded-xl border-rose-400/40 bg-rose-400/10 px-3 text-xs text-rose-200 hover:bg-rose-400/20"
                                                            >
                                                                <IconX className="mr-1.5 h-3.5 w-3.5" />
                                                                Tolak
                                                            </Button>
                                                        </>
                                                    ) : null}

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
                                                        Barang
                                                    </p>
                                                    <p className="mt-1 truncate text-xs font-semibold text-zinc-100">
                                                        {loan.item}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                                    <p className="text-[10px] text-zinc-500">
                                                        Jumlah
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-zinc-200">
                                                        {loan.amount}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                                    <p className="text-[10px] text-zinc-500">
                                                        Tanggal Pinjam
                                                    </p>
                                                    <p className="mt-1 text-xs font-medium text-zinc-200">
                                                        {loan.borrowDate}
                                                    </p>
                                                </div>

                                                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                                                    <p className="text-[10px] text-zinc-500">
                                                        Tenggat Kembali
                                                    </p>
                                                    <p
                                                        className={[
                                                            "mt-1 text-xs font-medium",
                                                            loan.status === "Terlambat"
                                                                ? "text-rose-300"
                                                                : "text-zinc-200",
                                                        ].join(" ")}
                                                    >
                                                        {loan.dueDate}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                                                <p className="text-[10px] text-zinc-500">
                                                    Keperluan
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-zinc-300">
                                                    {loan.purpose}
                                                </p>
                                            </div>

                                            <div className="mt-4 space-y-1.5">
                                                <div className="flex items-center justify-between text-[11px]">
                                                    <span className="text-zinc-500">
                                                        Progress peminjaman
                                                    </span>
                                                    <span
                                                        className={`font-semibold ${getProgressColor(
                                                            loan.status
                                                        )}`}
                                                    >
                                                        {loan.progress}%
                                                    </span>
                                                </div>

                                                <Progress
                                                    value={loan.progress}
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
                                Form Peminjaman Cepat
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Input pengajuan peminjaman logistik baru.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3 p-4 pt-0">
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-medium text-zinc-500">
                                    Peminjam
                                </p>
                                <Input
                                    className="h-9 rounded-xl border-white/10 bg-zinc-950/50 text-xs text-zinc-200 placeholder:text-zinc-500"
                                    placeholder="Nama kader / UPA / DPRa"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-medium text-zinc-500">
                                        Barang
                                    </p>
                                    <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                                        <option>Tenda Lipat 3x3</option>
                                        <option>Sound System</option>
                                        <option>Kursi Lipat</option>
                                        <option>Proyektor</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-medium text-zinc-500">
                                        Jumlah
                                    </p>
                                    <Input
                                        className="h-9 rounded-xl border-white/10 bg-zinc-950/50 text-xs text-zinc-200 placeholder:text-zinc-500"
                                        placeholder="0 unit"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-medium text-zinc-500">
                                        Tanggal Pinjam
                                    </p>
                                    <Input
                                        type="date"
                                        className="h-9 rounded-xl border-white/10 bg-zinc-950/50 text-xs text-zinc-200"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-medium text-zinc-500">
                                        Tanggal Kembali
                                    </p>
                                    <Input
                                        type="date"
                                        className="h-9 rounded-xl border-white/10 bg-zinc-950/50 text-xs text-zinc-200"
                                    />
                                </div>
                            </div>

                            <Button className="h-9 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                                <IconPlus className="mr-1.5 h-3.5 w-3.5" />
                                Simpan Pengajuan
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <CardHeader className="p-4 pb-3">
                            <CardTitle className="text-sm font-semibold">
                                Alur Peminjaman
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Status proses dari pengajuan hingga pengembalian.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4 p-4 pt-0">
                            {[
                                {
                                    title: "Pengajuan",
                                    desc: "Peminjam mengisi kebutuhan barang.",
                                    tone: "sky",
                                },
                                {
                                    title: "Approval",
                                    desc: "Admin memeriksa stok and menyetujui.",
                                    tone: "amber",
                                },
                                {
                                    title: "Dipinjam",
                                    desc: "Barang keluar and tenggat dicatat.",
                                    tone: "violet",
                                },
                                {
                                    title: "Dikembalikan",
                                    desc: "Barang dicek kembali ke gudang.",
                                    tone: "emerald",
                                },
                            ].map((step, index) => (
                                <div key={step.title} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div
                                            className={[
                                                "flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-semibold",
                                                getToneClass(step.tone),
                                            ].join(" ")}
                                        >
                                            {index + 1}
                                        </div>
                                        {index < 3 ? (
                                            <div className="my-1 h-7 w-px bg-white/10" />
                                        ) : null}
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-zinc-100">
                                            {step.title}
                                        </p>
                                        <p className="mt-1 text-[11px] leading-5 text-zinc-500">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                        <CardHeader className="p-4 pb-3">
                            <CardTitle className="text-sm font-semibold">
                                Catatan Logistik
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Rekomendasi tindak lanjut.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3 p-4 pt-0">
                            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3">
                                <p className="text-xs font-medium text-rose-200">
                                    3 barang terlambat kembali
                                </p>
                                <p className="mt-1 text-[11px] leading-5 text-rose-100/70">
                                    Segera follow-up PIC peminjam agar stok bisa digunakan
                                    untuk agenda berikutnya.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
                                <p className="text-xs font-medium text-amber-200">
                                    8 pengajuan menunggu approval
                                </p>
                                <p className="mt-1 text-[11px] leading-5 text-amber-100/70">
                                    Pastikan admin memeriksa stok sebelum menyetujui
                                    permintaan.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
                                <p className="text-xs font-medium text-emerald-200">
                                    92 peminjaman selesai
                                </p>
                                <p className="mt-1 text-[11px] leading-5 text-emerald-100/70">
                                    Mayoritas peminjaman bulan ini sudah dikembalikan dengan
                                    baik.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </>
    );
}