"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  IconClipboardCheck, IconCalendarEvent, IconSearch, IconPlus,
  IconUserCheck, IconUserX, IconClock,
} from "@tabler/icons-react";

interface Anggota {
  id: number; namaLengkap: string; nik: string; kelompokId: number;
}

interface Absensi {
  id: number; kelompokId: number; anggotaId: number; tanggal: string; status: string;
  anggota?: Anggota;
}

interface Kelompok {
  id: number; namaKelompok: string; wilayah: string;
}

export default function AbsensiKelompokPage() {
  const [kelompoks, setKelompoks] = useState<Kelompok[]>([]);
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [absensiList, setAbsensiList] = useState<Absensi[]>([]);
  const [selectedKelompok, setSelectedKelompok] = useState<string>("");
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchKelompoks = useCallback(async () => {
    try { const res = await fetch("/api/kelompok-upa"); if (res.ok) setKelompoks(await res.json()); } catch {}
  }, []);

  const fetchAbsensi = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (selectedKelompok) params.set("kelompok_id", selectedKelompok);
      if (tanggal) params.set("tanggal", tanggal);
      const res = await fetch(`/api/absensi-kelompok?${params}`);
      if (res.ok) setAbsensiList(await res.json());
    } catch {}
  }, [selectedKelompok, tanggal]);

  const fetchAnggotaByKelompok = async (kelompokId: string) => {
    try {
      const res = await fetch(`/api/anggota?kelompok_id=${kelompokId}`);
      if (res.ok) setAnggotaList(await res.json());
    } catch {}
  };

  useEffect(() => {
    fetchKelompoks();
    fetchAbsensi();
  }, [fetchKelompoks, fetchAbsensi]);

  const handleKelompokChange = (val: string) => {
    setSelectedKelompok(val);
    if (val) fetchAnggotaByKelompok(val);
  };

  const handleBulkAbsensi = async () => {
    if (!selectedKelompok || !tanggal) return;
    const records = anggotaList.map((a) => ({
      kelompokId: Number(selectedKelompok),
      anggotaId: a.id,
      tanggal,
      status: "hadir",
    }));
    try {
      const res = await fetch("/api/absensi-kelompok", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(records),
      });
      if (res.ok) { setIsFormOpen(false); fetchAbsensi(); }
    } catch {}
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/absensi-kelompok/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
      });
      fetchAbsensi();
    } catch {}
  };

  const filtered = absensiList.filter((a) =>
    !selectedKelompok || a.kelompokId === Number(selectedKelompok)
  );

  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <IconClipboardCheck className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-zinc-400">Total Absensi</p>
              <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{filtered.length}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <CardHeader className="p-4 pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="grid flex-1 gap-3 xl:grid-cols-[1fr_1fr_auto]">
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-zinc-500">Kelompok UPA</p>
                <select value={selectedKelompok} onChange={(e) => handleKelompokChange(e.target.value)}
                  className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                  <option value="">Semua Kelompok</option>
                  {kelompoks.map((k) => (
                    <option key={k.id} value={k.id}>{k.namaKelompok}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-medium text-zinc-500">Tanggal</p>
                <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                  className="h-9 rounded-xl border-white/10 bg-zinc-950/50 text-xs text-zinc-200" />
              </div>
              <Button onClick={() => setIsFormOpen(true)}
                className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                <IconPlus className="mr-1.5 h-3.5 w-3.5" /> Catat Absensi
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
            <div className="p-3 text-center" />
            <Separator className="bg-white/10" />
            <div className="space-y-2 p-3">
              {filtered.map((a) => (
                <div key={a.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-900/50 p-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-100">{a.anggota?.namaLengkap || "-"}</p>
                    <p className="text-[11px] text-zinc-500">{a.tanggal}</p>
                  </div>
                  <Badge variant="outline"
                    className={`rounded-lg px-2 py-0 text-[10px] ${
                      a.status === "hadir" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" :
                      a.status === "izin" ? "border-sky-500/30 bg-sky-500/10 text-sky-300" :
                      a.status === "sakit" ? "border-amber-500/30 bg-amber-500/10 text-amber-300" :
                      "border-rose-500/30 bg-rose-500/10 text-rose-300"
                    }`}>
                    {a.status}
                  </Badge>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-xs text-zinc-500">Belum ada data absensi</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Catat Absensi Kelompok</DialogTitle>
            <DialogDescription>Pilih kelompok dan tanggal untuk mencatat kehadiran.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Kelompok</Label>
              <select value={selectedKelompok} onChange={(e) => handleKelompokChange(e.target.value)}
                className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none">
                <option value="">Pilih Kelompok</option>
                {kelompoks.map((k) => (
                  <option key={k.id} value={k.id}>{k.namaKelompok}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Tanggal</Label>
              <Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                className="col-span-3 h-9" />
            </div>
            {anggotaList.length > 0 && (
              <div className="col-span-4 max-h-40 overflow-y-auto rounded-xl border border-white/10 bg-zinc-950/40 p-2">
                <p className="mb-2 text-[10px] font-medium text-zinc-500">Anggota akan dicatat hadir:</p>
                {anggotaList.map((a) => (
                  <p key={a.id} className="text-xs text-zinc-300 py-0.5">• {a.namaLengkap}</p>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button>
            <Button onClick={handleBulkAbsensi}>Simpan Semua</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
