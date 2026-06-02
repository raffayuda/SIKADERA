"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  IconArrowLeft,
  IconDots,
  IconFilter,
  IconSearch,
  IconWallet,
  IconReceipt,
} from "@tabler/icons-react";

type PaymentStatus = "Lunas" | "Menunggak" | "Belum Jatuh Tempo";
type PaymentType = "Iuran Wajib" | "Infak Sukarela" | "Donasi Kegiatan";

type Payment = {
  name: string;
  memberId: string;
  village: string;
  upa: string;
  type: PaymentType;
  amount: string;
  month: string;
  method: string;
  date: string;
  status: PaymentStatus;
};

const payments: Payment[] = [
  {
    name: "Ahmad Fauzi",
    memberId: "SKD-2026-0001",
    village: "Dramaga",
    upa: "UPA Dramaga",
    type: "Iuran Wajib",
    amount: "Rp50.000",
    month: "September 2026",
    method: "Transfer",
    date: "16 Sep 2026",
    status: "Lunas",
  },
  {
    name: "Siti Nurhaliza",
    memberId: "SKD-2026-0002",
    village: "Babakan",
    upa: "UPA Babakan",
    type: "Infak Sukarela",
    amount: "Rp100.000",
    month: "September 2026",
    method: "Tunai",
    date: "16 Sep 2026",
    status: "Lunas",
  },
  {
    name: "Dedi Kurniawan",
    memberId: "SKD-2026-0003",
    village: "Cikarawang",
    upa: "UPA Cikarawang",
    type: "Iuran Wajib",
    amount: "Rp50.000",
    month: "Agustus 2026",
    method: "Belum bayar",
    date: "-",
    status: "Menunggak",
  },
  {
    name: "Nadia Putri",
    memberId: "SKD-2026-0004",
    village: "Ciherang",
    upa: "UPA Ciherang",
    type: "Donasi Kegiatan",
    amount: "Rp75.000",
    month: "September 2026",
    method: "Transfer",
    date: "15 Sep 2026",
    status: "Lunas",
  },
  {
    name: "Rizky Maulana",
    memberId: "SKD-2026-0005",
    village: "Petir",
    upa: "UPA Petir",
    type: "Iuran Wajib",
    amount: "Rp50.000",
    month: "September 2026",
    method: "Belum bayar",
    date: "-",
    status: "Menunggak",
  },
];

const tabs = [
  { label: "Semua", value: "all", count: "12" },
  { label: "Lunas", value: "Lunas", count: "10" },
  { label: "Menunggak", value: "Menunggak", count: "2" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusBadgeClass(status: PaymentStatus) {
  switch (status) {
    case "Lunas":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Menunggak":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";
    case "Belum Jatuh Tempo":
      return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

function getTypeBadgeClass(type: PaymentType) {
  switch (type) {
    case "Iuran Wajib":
      return "border-sky-500/30 bg-sky-500/10 text-sky-300";
    case "Infak Sukarela":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Donasi Kegiatan":
      return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    default:
      return "border-white/10 bg-white/5 text-zinc-300";
  }
}

export default function UpaIuranDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const groupName = (id as string)?.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") || "UPA Detail";

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchTab = activeTab === "all" || payment.status === activeTab;
      const keyword = search.toLowerCase();

      const matchSearch =
        payment.name.toLowerCase().includes(keyword) ||
        payment.memberId.toLowerCase().includes(keyword) ||
        payment.type.toLowerCase().includes(keyword) ||
        payment.status.toLowerCase().includes(keyword);

      return matchTab && matchSearch;
    });
  }, [activeTab, search]);

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" asChild className="h-8 rounded-xl px-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
          <Link href="/admin/iuran-infak">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar UPA
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="pb-3 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                <IconWallet className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-zinc-50">{groupName}</CardTitle>
              <CardDescription className="text-xs">Ringkasan Keuangan Kelompok</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold text-center">Terkumpul</p>
                  <p className="text-lg font-bold text-emerald-400">Rp1.250.000</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold text-center">Target</p>
                  <p className="text-lg font-bold text-zinc-100">Rp1.500.000</p>
                </div>
              </div>

              <Separator className="bg-white/10" />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-xs text-zinc-500">Iuran Wajib (Lunas)</p>
                  <p className="text-xs font-medium text-zinc-200">10/12 Anggota</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-zinc-500">Infak Sukarela</p>
                  <p className="text-xs font-medium text-zinc-200">Rp450.000</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-zinc-500">Tunggakan</p>
                  <p className="text-xs font-medium text-amber-400">Rp250.000</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-semibold">
                Catat Pembayaran Kelompok
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 p-4 pt-0">
              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-zinc-500">Anggota</p>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                  <option>Pilih Anggota...</option>
                  <option>Ahmad Fauzi</option>
                  <option>Siti Nurhaliza</option>
                  <option>Dedi Kurniawan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-zinc-500">Jenis</p>
                  <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                    <option>Iuran Wajib</option>
                    <option>Infak Sukarela</option>
                    <option>Donasi Kegiatan</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-zinc-500">Metode</p>
                  <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                    <option>Transfer</option>
                    <option>Tunai</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-medium text-zinc-500">Nominal</p>
                <Input
                  className="h-9 rounded-xl border-white/10 bg-zinc-950/50 text-xs text-zinc-200 placeholder:text-zinc-500"
                  placeholder="Rp0"
                />
              </div>

              <Button className="h-9 w-full rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                <IconReceipt className="mr-1.5 h-3.5 w-3.5" />
                Simpan Pembayaran
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 xl:col-span-8">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <CardHeader className="p-4 pb-3">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="grid flex-1 gap-3 xl:grid-cols-[2fr_1fr_auto]">
                  <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                    <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                    <Input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                      placeholder="Cari anggota, jenis..."
                    />
                  </div>

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

                <div className="space-y-3 p-3">
                  {filteredPayments.map((payment) => (
                    <Card
                      key={`${payment.memberId}-${payment.type}-${payment.month}`}
                      className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={`https://picsum.photos/seed/${payment.name}/64/64`}
                                alt={payment.name}
                              />
                              <AvatarFallback className="text-[10px]">
                                {getInitials(payment.name)}
                              </AvatarFallback>
                            </Avatar>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-sm font-semibold text-zinc-100">
                                  {payment.name}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(
                                    payment.status
                                  )}`}
                                >
                                  {payment.status}
                                </Badge>
                              </div>
                              <p className="mt-1 truncate text-xs text-zinc-500">
                                {payment.memberId} • {payment.village}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`rounded-lg px-2 py-0 text-[10px] ${getTypeBadgeClass(
                                payment.type
                              )}`}
                            >
                              {payment.type}
                            </Badge>

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
                            <p className="text-[10px] text-zinc-500">Nominal</p>
                            <p className="mt-1 text-xs font-semibold text-zinc-100">
                              {payment.amount}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[10px] text-zinc-500">Periode</p>
                            <p className="mt-1 text-xs font-medium text-zinc-200">
                              {payment.month}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[10px] text-zinc-500">Metode</p>
                            <p className="mt-1 text-xs font-medium text-zinc-200">
                              {payment.method}
                            </p>
                          </div>

                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="text-[10px] text-zinc-500">Tanggal</p>
                            <p className="mt-1 text-xs font-medium text-zinc-200">
                              {payment.date}
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
        </div>
      </div>
    </>
  );
}
