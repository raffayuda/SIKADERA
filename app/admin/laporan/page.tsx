"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  IconUsers, IconUsersGroup, IconCalendarEvent, IconWallet,
  IconPackage, IconChartBar, IconDownload,
} from "@tabler/icons-react";

interface LaporanData {
  anggota: { total: number; aktif: number; nonAktif: number };
  kelompok: { total: number };
  kegiatan: { total: number };
  keuangan: { totalIuran: number; totalInfak: number; iuranBelumLunas: number };
  logistik: { total: number; dipinjam: number };
}

export default function LaporanPage() {
  const [data, setData] = useState<LaporanData | null>(null);

  useEffect(() => {
    fetch("/api/laporan").then((r) => r.ok && r.json()).then((d) => setData(d)).catch(() => {});
  }, []);

  const formatRp = (n: number) => `Rp${n.toLocaleString("id-ID")}`;

  const sections = [
    {
      title: "Laporan Anggota",
      icon: IconUsers,
      items: data ? [
        { label: "Total Anggota", value: data.anggota.total.toString() },
        { label: "Anggota Aktif", value: data.anggota.aktif.toString() },
        { label: "Anggota Non Aktif", value: data.anggota.nonAktif.toString() },
      ] : [],
    },
    {
      title: "Laporan Pembinaan",
      icon: IconUsersGroup,
      items: data ? [
        { label: "Total Kelompok UPA", value: data.kelompok.total.toString() },
        { label: "Total Kegiatan", value: data.kegiatan.total.toString() },
      ] : [],
    },
    {
      title: "Laporan Keuangan",
      icon: IconWallet,
      items: data ? [
        { label: "Total Iuran Lunas", value: formatRp(data.keuangan.totalIuran) },
        { label: "Total Infak", value: formatRp(data.keuangan.totalInfak) },
        { label: "Iuran Belum Lunas", value: data.keuangan.iuranBelumLunas.toString() + " anggota" },
      ] : [],
    },
    {
      title: "Laporan Logistik",
      icon: IconPackage,
      items: data ? [
        { label: "Total Barang", value: data.logistik.total.toString() },
        { label: "Dipinjam", value: data.logistik.dipinjam.toString() },
      ] : [],
    },
  ];

  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <IconChartBar className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-zinc-400">Total Laporan</p>
              <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{sections.length} Modul</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}
              className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">{section.title}</CardTitle>
                    <CardDescription className="text-xs">Ringkasan data organisasi</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                {section.items.map((item, idx) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400">{item.label}</span>
                      <span className="text-xs font-semibold text-zinc-100">{item.value}</span>
                    </div>
                    {idx < section.items.length - 1 && <Separator className="mt-3 bg-white/10" />}
                  </div>
                ))}
                <Button variant="outline"
                  className="mt-2 h-8 w-full rounded-xl border-white/10 bg-white/5 text-xs text-zinc-200 hover:bg-white/10">
                  <IconDownload className="mr-1.5 h-3.5 w-3.5" /> Export Laporan
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </>
  );
}
