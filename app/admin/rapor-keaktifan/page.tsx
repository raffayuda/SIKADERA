"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import {
  IconUsers,
  IconUserCheck,
  IconUserPause,
  IconChartBar,
  IconTrendingUp,
  IconAlertCircle,
  IconSearch,
  IconRefresh,
  IconArrowRight,
  IconPercentage,
} from "@tabler/icons-react";

interface KelompokWithStats {
  id: number;
  namaKelompok: string;
  wilayah: string | null;
  jumlahAnggota: number;
  aktif: number;
  totalPertemuan: number;
  rataKehadiran: number;
}

export default function RaporKeaktifanPage() {
  const [data, setData] = useState<KelompokWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  async function fetchData() {
    setLoading(true);
    try {
      const kelompok = await api.get<KelompokWithStats[]>("/kelompok-upa");
      const enriched = await Promise.all(
        kelompok.map(async (k) => {
          try {
            const detail = await api.get<{
              anggota: { id: number; status: string }[];
              absensiKelompok: { status: string }[];
            }>(`/kelompok-upa/${k.id}`);
            const aktif = detail.anggota.filter((a) => a.status === "aktif").length;
            const totalPertemuan = detail.absensiKelompok.length;
            const hadir = detail.absensiKelompok.filter((a) => a.status === "hadir").length;
            const rataKehadiran = totalPertemuan > 0 ? Math.round((hadir / totalPertemuan) * 100) : 0;
            return { ...k, aktif, totalPertemuan, rataKehadiran };
          } catch {
            return { ...k, aktif: 0, totalPertemuan: 0, rataKehadiran: 0 };
          }
        })
      );
      setData(enriched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const kw = search.toLowerCase();
    return data.filter(
      (k) =>
        k.namaKelompok.toLowerCase().includes(kw) ||
        (k.wilayah && k.wilayah.toLowerCase().includes(kw))
    );
  }, [data, search]);

  const totalAnggota = data.reduce((s, k) => s + k.jumlahAnggota, 0);
  const totalAktif = data.reduce((s, k) => s + k.aktif, 0);
  const totalPertemuan = data.reduce((s, k) => s + k.totalPertemuan, 0);
  const rataRata = data.length > 0 ? Math.round(data.reduce((s, k) => s + k.rataKehadiran, 0) / data.length) : 0;
  const perluPerhatian = data.filter((k) => k.rataKehadiran < 60).length;

  const summaryCards = [
    { title: "Rata-rata Keaktifan", value: `${rataRata}%`, note: "seluruh kelompok", icon: IconChartBar, tone: "emerald" },
    { title: "Kader Aktif", value: String(totalAktif), note: `dari ${totalAnggota} anggota`, icon: IconUserCheck, tone: "sky" },
    { title: "Total Pertemuan", value: String(totalPertemuan), note: "tercatat", icon: IconTrendingUp, tone: "emerald" },
    { title: "Perlu Perhatian", value: String(perluPerhatian), note: "kelompok < 60%", icon: IconAlertCircle, tone: "amber" },
  ];

  if (loading && data.length === 0) {
    return (
      <>
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-2xl border-white/10 bg-zinc-900/60">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-2xl bg-white/5" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20 bg-white/5" />
                    <Skeleton className="h-5 w-12 bg-white/5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
          <CardContent className="p-4">
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl bg-white/5" />
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title} className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
                  card.tone === "emerald" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" :
                  card.tone === "sky" ? "border-sky-500/20 bg-sky-500/10 text-sky-300" :
                  "border-amber-500/20 bg-amber-500/10 text-amber-300"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">{card.title}</p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{card.value}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{card.note}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 w-full max-w-sm focus-within:border-emerald-500/40">
              <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                placeholder="Cari kelompok atau wilayah..."
              />
            </div>
            <Button variant="outline" onClick={fetchData} className="h-9 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10">
              <IconRefresh className="mr-1.5 h-3.5 w-3.5" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <IconChartBar className="mb-3 h-10 w-10 text-zinc-600" />
                <p className="text-sm font-medium text-zinc-400">Tidak ada data</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 bg-emerald-500/10 hover:bg-emerald-500/10">
                    <TableHead className="h-10 text-xs text-zinc-300">Kelompok</TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300">Wilayah</TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300 text-center">Anggota</TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300 text-center">Aktif</TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300 text-center">Pertemuan</TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300 text-center">Kehadiran</TableHead>
                    <TableHead className="h-10 text-xs text-zinc-300 text-center">Status</TableHead>
                    <TableHead className="h-10 text-right text-xs text-zinc-300">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((k) => (
                    <TableRow key={k.id} className="border-white/10 hover:bg-white/[0.03]">
                      <TableCell className="min-w-[160px] py-2.5">
                        <p className="text-xs font-semibold text-zinc-100">{k.namaKelompok}</p>
                      </TableCell>
                      <TableCell className="py-2.5 text-xs text-zinc-400">{k.wilayah || "-"}</TableCell>
                      <TableCell className="py-2.5 text-center text-xs text-zinc-300">{k.jumlahAnggota}</TableCell>
                      <TableCell className="py-2.5 text-center text-xs text-emerald-400">{k.aktif}</TableCell>
                      <TableCell className="py-2.5 text-center text-xs text-zinc-300">{k.totalPertemuan}</TableCell>
                      <TableCell className="py-2.5 text-center">
                        <span className={`text-xs font-semibold ${
                          k.rataKehadiran >= 75 ? "text-emerald-400" : k.rataKehadiran >= 60 ? "text-amber-400" : "text-rose-400"
                        }`}>
                          {k.rataKehadiran}%
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 text-center">
                        <Badge variant="outline" className={`rounded-lg px-2 py-0 text-[10px] ${
                          k.rataKehadiran >= 75 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" :
                          k.rataKehadiran >= 60 ? "border-amber-500/30 bg-amber-500/10 text-amber-300" :
                          "border-rose-500/30 bg-rose-500/10 text-rose-300"
                        }`}>
                          {k.rataKehadiran >= 75 ? "Aktif" : k.rataKehadiran >= 60 ? "Kurang" : "Rendah"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2.5 text-right">
                        <Button variant="ghost" size="sm" asChild className="h-8 rounded-xl text-xs text-zinc-400 hover:text-zinc-100">
                          <Link href={`/admin/kelompok-upa/${k.id}`}>
                            Detail
                            <IconArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <Separator className="bg-white/10" />
            <div className="p-3 text-xs text-zinc-500">
              Menampilkan <span className="text-zinc-300">{filtered.length}</span> kelompok
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
