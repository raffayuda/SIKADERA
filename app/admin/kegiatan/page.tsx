"use client";

import { useEffect, useState } from "react";
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconCalendarEvent, IconUsers, IconMapPin, IconDots, IconEdit, IconTrash, IconSearch, IconFilter, IconPlus, IconEye,
} from "@tabler/icons-react";

interface Kegiatan {
  id: number;
  namaKegiatan: string;
  jenis: string;
  tanggal: string;
  lokasi: string;
  penanggungJawab: number;
  deskripsi: string;
  jumlahPeserta: number;
}

export default function KegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedKegiatan, setSelectedKegiatan] = useState<Kegiatan | null>(null);
  const [formData, setFormData] = useState({
    namaKegiatan: "", jenis: "", tanggal: "", lokasi: "", deskripsi: "",
  });

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const fetchKegiatan = async () => {
    try {
      const res = await fetch("/api/kegiatan");
      if (res.ok) setKegiatanList(await res.json());
    } catch {}
  };

  const filtered = kegiatanList.filter((k) =>
    k.namaKegiatan.toLowerCase().includes(search.toLowerCase()) ||
    k.lokasi?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async () => {
    try {
      const res = await fetch("/api/kegiatan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsFormOpen(false);
        setFormData({ namaKegiatan: "", jenis: "", tanggal: "", lokasi: "", deskripsi: "" });
        fetchKegiatan();
      }
    } catch {}
  };

  const handleDelete = async () => {
    if (!selectedKegiatan) return;
    try {
      await fetch(`/api/kegiatan/${selectedKegiatan.id}`, { method: "DELETE" });
      setIsDeleteOpen(false);
      setSelectedKegiatan(null);
      fetchKegiatan();
    } catch {}
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
              <IconCalendarEvent className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-zinc-400">Total Kegiatan</p>
              <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{kegiatanList.length}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <CardHeader className="p-4 pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="grid flex-1 gap-3 xl:grid-cols-[1.4fr_0.8fr_auto]">
              <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                  className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="Cari kegiatan..." />
              </div>
              <Button variant="outline"
                className="h-9 rounded-xl border-white/10 bg-white/5 px-3 text-xs text-zinc-200 hover:bg-white/10">
                <IconFilter className="mr-1.5 h-3.5 w-3.5" /> Filter
              </Button>
              <Button onClick={() => setIsFormOpen(true)}
                className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                <IconPlus className="mr-1.5 h-3.5 w-3.5" /> Tambah Kegiatan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            {filtered.map((k) => (
              <Card key={k.id} className="rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-white/[0.04]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-zinc-100">{k.namaKegiatan}</h3>
                        <Badge variant="outline" className="rounded-lg border-sky-500/30 bg-sky-500/10 px-2 py-0 text-[10px] text-sky-300">
                          {k.jenis || "Internal"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-zinc-500">{k.deskripsi}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost"
                          className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-100">
                          <IconDots className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="right">
                        <DropdownMenuItem onClick={() => { setSelectedKegiatan(k); setIsDeleteOpen(true); }}>
                          <IconTrash className="mr-2 h-3.5 w-3.5" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <IconCalendarEvent className="h-3.5 w-3.5" /> Tanggal
                      </div>
                      <p className="mt-1 truncate text-xs font-medium text-zinc-200">{k.tanggal || "-"}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <IconMapPin className="h-3.5 w-3.5" /> Lokasi
                      </div>
                      <p className="mt-1 truncate text-xs font-medium text-zinc-200">{k.lokasi || "-"}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                        <IconUsers className="h-3.5 w-3.5" /> Peserta
                      </div>
                      <p className="mt-1 text-xs font-medium text-zinc-200">{k.jumlahPeserta} peserta</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Kegiatan Baru</DialogTitle>
            <DialogDescription>Lengkapi data kegiatan di bawah ini.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Nama Kegiatan</Label>
              <Input className="col-span-3 h-9" value={formData.namaKegiatan}
                onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Jenis</Label>
              <select className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
                value={formData.jenis} onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}>
                <option value="">Pilih Jenis</option>
                <option value="Internal">Internal</option>
                <option value="Publik">Publik</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Tanggal</Label>
              <Input type="date" className="col-span-3 h-9" value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Lokasi</Label>
              <Input className="col-span-3 h-9" value={formData.lokasi}
                onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Deskripsi</Label>
              <Input className="col-span-3 h-9" value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-rose-400">Hapus Kegiatan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{selectedKegiatan?.namaKegiatan}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
