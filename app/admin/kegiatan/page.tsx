"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { QRCodeSVG } from "qrcode.react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  IconCalendarEvent, IconUsers, IconMapPin, IconDots, IconEdit, IconTrash,
  IconSearch, IconPlus, IconLayoutGrid, IconList, IconCheck, IconMap,
  IconClock, IconPhoto, IconQrcode, IconUpload, IconCamera, IconShare,
} from "@tabler/icons-react";

interface AbsensiItem {
  id: number;
  kegiatanId: number;
  anggotaId: number;
  status: string;
  anggota: { id: number; namaLengkap: string } | null;
}

interface Kegiatan {
  id: number;
  namaKegiatan: string;
  jenis: string;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  lokasi: string;
  mapsUrl: string;
  gambar: string;
  penanggungJawab: number;
  deskripsi: string;
  jumlahPeserta: number;
  absensiKegiatan?: AbsensiItem[];
}

export default function KegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingKegiatan, setEditingKegiatan] = useState<Kegiatan | null>(null);
  const [formData, setFormData] = useState({
    namaKegiatan: "", jenis: "", tanggal: "", jamMulai: "", jamSelesai: "",
    lokasi: "", mapsUrl: "", deskripsi: "",
  });
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedKegiatan, setSelectedKegiatan] = useState<Kegiatan | null>(null);

  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [attendanceKegiatan, setAttendanceKegiatan] = useState<Kegiatan | null>(null);
  const [attendanceAnggota, setAttendanceAnggota] = useState<{ id: number; namaLengkap: string; status: string; absensiId: number | null }[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceSaving, setAttendanceSaving] = useState(false);

  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrKegiatan, setQrKegiatan] = useState<Kegiatan | null>(null);
  const [qrTanggal, setQrTanggal] = useState("");
  const [qrStamp, setQrStamp] = useState(Date.now());
  const [qrTimer, setQrTimer] = useState(60);

  // QR Scanner
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scanKegiatan, setScanKegiatan] = useState<Kegiatan | null>(null);
  const [scanStatus, setScanStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [scannedNames, setScannedNames] = useState<{ id: number; nama: string }[]>([]);
  const [scannedIds, setScannedIds] = useState<Set<number>>(new Set());
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isQrOpen) return;
    setQrTimer(60);
    setQrStamp(Date.now());
    const interval = setInterval(() => {
      setQrTimer((prev) => {
        if (prev <= 1) {
          setQrStamp(Date.now());
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isQrOpen, qrTanggal]);

  const fetchKegiatan = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/kegiatan");
      if (res.ok) {
        const data = await res.json();
        const enriched = await Promise.all(
          data.map(async (k: Kegiatan) => {
            const detailRes = await fetch(`/api/kegiatan/${k.id}`);
            if (detailRes.ok) {
              const detail = await detailRes.json();
              return { ...k, absensiKegiatan: detail.absensiKegiatan };
            }
            return k;
          })
        );
        setKegiatanList(enriched);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKegiatan(); }, [fetchKegiatan]);

  const filtered = kegiatanList.filter((k) =>
    k.namaKegiatan.toLowerCase().includes(search.toLowerCase()) ||
    (k.lokasi && k.lokasi.toLowerCase().includes(search.toLowerCase()))
  );

  const resetForm = () => {
    setFormData({
      namaKegiatan: "", jenis: "", tanggal: "", jamMulai: "", jamSelesai: "",
      lokasi: "", mapsUrl: "", deskripsi: "",
    });
    setGambarFile(null);
    setEditingKegiatan(null);
  };

  const openCreateForm = () => { resetForm(); setIsFormOpen(true); };

  const openEditForm = (k: Kegiatan) => {
    setEditingKegiatan(k);
    setFormData({
      namaKegiatan: k.namaKegiatan,
      jenis: k.jenis || "",
      tanggal: k.tanggal ? k.tanggal.split("T")[0] : "",
      jamMulai: k.jamMulai || "",
      jamSelesai: k.jamSelesai || "",
      lokasi: k.lokasi || "",
      mapsUrl: k.mapsUrl || "",
      deskripsi: k.deskripsi || "",
    });
    setGambarFile(null);
    setIsFormOpen(true);
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      let gambarUrl = editingKegiatan?.gambar || "";

      if (gambarFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", gambarFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          gambarUrl = uploadData.url;
        }
      }

      const payload = { ...formData, gambar: gambarUrl };
      const url = editingKegiatan ? `/api/kegiatan/${editingKegiatan.id}` : "/api/kegiatan";
      const method = editingKegiatan ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setIsFormOpen(false);
        resetForm();
        fetchKegiatan();
      }
    } catch {} finally {
      setUploading(false);
    }
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

  const openAttendance = async (k: Kegiatan) => {
    setAttendanceKegiatan(k);
    setAttendanceAnggota([]);
    setAttendanceLoading(true);
    setAttendanceSaving(false);

    try {
      const [anggotaRes] = await Promise.all([
        fetch("/api/anggota"),
      ]);
      const allAnggota = anggotaRes.ok ? await anggotaRes.json() : [];

      const absensi = k.absensiKegiatan || [];
      const merged = allAnggota.map((a: { id: number; namaLengkap: string }) => {
        const existing = absensi.find((ab: AbsensiItem) => ab.anggotaId === a.id);
        return {
          id: a.id,
          namaLengkap: a.namaLengkap,
          status: existing ? existing.status : "",
          absensiId: existing ? existing.id : null,
        };
      });
      setAttendanceAnggota(merged);
    } catch {}

    setAttendanceLoading(false);
    setIsAttendanceOpen(true);
  };

  const handleAttendanceStatusChange = (id: number, status: string) => {
    setAttendanceAnggota((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleSaveAttendance = async () => {
    if (!attendanceKegiatan) return;
    setAttendanceSaving(true);

    for (const a of attendanceAnggota) {
      if (!a.status) continue;
      try {
        if (a.absensiId) {
          await fetch(`/api/absensi-kegiatan/${a.absensiId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: a.status }),
          });
        } else {
          await fetch("/api/absensi-kegiatan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kegiatanId: attendanceKegiatan.id,
              anggotaId: a.id,
              status: a.status,
            }),
          });
        }
      } catch {}
    }

    setAttendanceSaving(false);
    setIsAttendanceOpen(false);
    setAttendanceKegiatan(null);
    fetchKegiatan();
  };

  const openQr = (k: Kegiatan) => {
    setQrKegiatan(k);
    const tgl = k.tanggal ? k.tanggal.split("T")[0] : new Date().toISOString().split("T")[0];
    setQrTanggal(tgl);
    setQrStamp(Date.now());
    setQrTimer(60);
    setIsQrOpen(true);
  };

  const openScanner = (k: Kegiatan) => {
    setScanKegiatan(k);
    setScanStatus(null);
    setScannedIds(new Set());
    setScannedNames([]);
    setIsScanOpen(true);
  };

  const handleQrScan = useCallback(async (result: string) => {
    if (!scanKegiatan) return;
    try {
      let anggotaId: number | null = null;
      let tanggal: string | null = null;

      if (result.includes("?")) {
        const url = new URL(result.startsWith("http") ? result : `https://dummy${result}`);
        const aid = url.searchParams.get("anggota_id") || url.searchParams.get("anggota");
        if (aid) anggotaId = Number(aid);
        tanggal = url.searchParams.get("tanggal") || null;
      } else if (!isNaN(Number(result))) {
        anggotaId = Number(result);
      }

      if (anggotaId && !isNaN(anggotaId) && tanggal) {
        if (scannedIds.has(anggotaId)) {
          setScanStatus({ type: "success", message: `Sudah absen sebelumnya` });
          return;
        }

        const res = await fetch("/api/absensi-kegiatan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kegiatanId: scanKegiatan.id,
            anggotaId,
            status: "hadir",
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setScanStatus({ type: "error", message: errData.error || "Gagal absen" });
          return;
        }

        setScannedIds((prev) => new Set(prev).add(anggotaId));
        setScannedNames((prev) => [...prev, { id: anggotaId, nama: "Anggota" }]);
        setScanStatus({ type: "success", message: `Anggota — Hadir!` });
      } else {
        setScanStatus({ type: "error", message: "QR tidak dikenal" });
      }
    } catch {
      setScanStatus({ type: "error", message: "QR tidak valid" });
    }

    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    scanTimeoutRef.current = setTimeout(() => setScanStatus(null), 3000);
  }, [scanKegiatan, scannedIds]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const getStatusCount = (k: Kegiatan, status: string) => {
    return k.absensiKegiatan?.filter((a) => a.status === status).length || 0;
  };

  if (loading && kegiatanList.length === 0) {
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
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-52 w-full rounded-2xl bg-white/5" />
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
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300">
              <IconUsers className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-zinc-400">Total Terabsen</p>
              <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">
                {kegiatanList.reduce((sum, k) => sum + (k.jumlahPeserta || 0), 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
              <IconPhoto className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-zinc-400">Dengan Gambar</p>
              <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">
                {kegiatanList.filter((k) => k.gambar).length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300">
              <IconMap className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-zinc-400">Dengan Maps</p>
              <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">
                {kegiatanList.filter((k) => k.mapsUrl).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
        <CardHeader className="p-4 pb-3">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="grid flex-1 gap-3 xl:grid-cols-[1.4fr_0.8fr_auto_auto]">
              <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)}
                  className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0"
                  placeholder="Cari kegiatan..." />
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950/50 p-0.5">
                <Button size="sm" variant="ghost"
                  onClick={() => setViewMode("card")}
                  className={`h-7 w-7 rounded-lg p-0 ${viewMode === "card" ? "bg-white/10 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"}`}>
                  <IconLayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost"
                  onClick={() => setViewMode("table")}
                  className={`h-7 w-7 rounded-lg p-0 ${viewMode === "table" ? "bg-white/10 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"}`}>
                  <IconList className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Link href="/admin/kegiatan/create">
                <Button className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                  <IconPlus className="mr-1.5 h-3.5 w-3.5" /> Tambah Kegiatan
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {viewMode === "card" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((k) => (
                <Card key={k.id} className="group flex flex-col overflow-hidden rounded-2xl border-white/10 bg-zinc-900/50 transition hover:bg-zinc-900/80">
                  <div className="relative h-44 shrink-0 overflow-hidden bg-zinc-800">
                    {k.gambar ? (
                      <img src={k.gambar} alt={k.namaKegiatan}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = ""; (e.target as HTMLImageElement).style.display = "none"; }} />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <IconPhoto className="h-10 w-10 text-zinc-700" />
                      </div>
                    )}
                    <div className="absolute right-2 top-2">
                      <Badge variant="outline" className="rounded-lg border-sky-500/30 bg-sky-500/10 px-2 py-0 text-[10px] text-sky-300">
                        {k.jenis || "Internal"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-zinc-100">{k.namaKegiatan}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost"
                            className="h-7 w-7 shrink-0 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-zinc-100">
                            <IconDots className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="right">
                          <DropdownMenuItem onClick={() => window.location.href = `/admin/kegiatan/${k.id}/edit`}>
                            <IconEdit className="mr-2 h-3.5 w-3.5" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedKegiatan(k); setIsDeleteOpen(true); }}>
                            <IconTrash className="mr-2 h-3.5 w-3.5" /> Hapus
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            const url = `${window.location.origin}/kegiatan/${k.id}`;
                            navigator.clipboard.writeText(url);
                            const el = document.createElement("div");
                            el.className = "fixed bottom-4 right-4 z-50 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 shadow-lg";
                            el.textContent = "Link disalin!";
                            document.body.appendChild(el);
                            setTimeout(() => el.remove(), 2000);
                          }}>
                            <IconShare className="mr-2 h-3.5 w-3.5" /> Salin Link Publik
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {(() => {
                      const clean = k.deskripsi?.replace(/<[^>]*>/g, "").slice(0, 120) || "";
                      return clean ? <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{clean}</p> : null;
                    })()}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <IconCalendarEvent className="h-3 w-3" /> Tanggal
                        </div>
                        <p className="mt-0.5 text-[11px] font-medium text-zinc-200">
                          {formatDate(k.tanggal)}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <IconClock className="h-3 w-3" /> Waktu
                        </div>
                        <p className="mt-0.5 text-[11px] font-medium text-zinc-200">
                          {k.jamMulai || "-"}
                        </p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <IconMapPin className="h-3 w-3" /> Lokasi
                        </div>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-zinc-200">
                          {k.lokasi || "-"}
                        </p>
                        {k.mapsUrl && (
                          <a href={k.mapsUrl} target="_blank" rel="noopener noreferrer"
                            className="mt-0.5 inline-flex items-center gap-0.5 text-[9px] text-emerald-400 hover:text-emerald-300">
                            <IconMap className="h-2.5 w-2.5" /> Maps
                          </a>
                        )}
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-2.5">
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                          <IconUsers className="h-3 w-3" /> Hadir
                        </div>
                        <p className="mt-0.5 text-[11px] font-medium text-zinc-200">
                          {getStatusCount(k, "hadir")}/{k.jumlahPeserta}
                        </p>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <Button onClick={() => openAttendance(k)} size="sm"
                        className="flex-1 h-8 rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-[10px] font-medium text-emerald-100 hover:bg-emerald-400/25">
                        <IconCheck className="mr-1 h-3 w-3" /> Absensi
                      </Button>
                      <Button onClick={() => openQr(k)} size="sm" variant="ghost"
                        className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                        title="Generate QR">
                        <IconQrcode className="h-3.5 w-3.5" />
                      </Button>
                      <Button onClick={() => openScanner(k)} size="sm" variant="ghost"
                        className="h-8 w-8 rounded-xl text-zinc-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                        title="Scan QR">
                        <IconCamera className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filtered.length === 0 && (
                <div className="col-span-full py-16 text-center text-xs text-zinc-500">Tidak ada kegiatan ditemukan</div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-zinc-400">Kegiatan</TableHead>
                    <TableHead className="text-zinc-400">Jenis</TableHead>
                    <TableHead className="text-zinc-400">Tanggal</TableHead>
                    <TableHead className="text-zinc-400">Lokasi</TableHead>
                    <TableHead className="text-center text-zinc-400">Hadir</TableHead>
                    <TableHead className="text-center text-zinc-400">QR</TableHead>
                    <TableHead className="text-right text-zinc-400">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((k) => (
                    <TableRow key={k.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                            {k.gambar ? (
                              <img src={k.gambar} alt="" className="h-full w-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <IconPhoto className="h-4 w-4 text-zinc-600" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-zinc-200">{k.namaKegiatan}</p>
                            {(() => {
                              const clean = k.deskripsi?.replace(/<[^>]*>/g, "").slice(0, 80) || "";
                              return clean ? <p className="truncate text-[11px] text-zinc-500">{clean}</p> : null;
                            })()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className="rounded-lg border-sky-500/30 bg-sky-500/10 px-2 py-0 text-[10px] text-sky-300">
                          {k.jenis || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-xs text-zinc-300">{formatDate(k.tanggal)}</TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-zinc-300">{k.lokasi || "-"}</span>
                          {k.mapsUrl && (
                            <a href={k.mapsUrl} target="_blank" rel="noopener noreferrer"
                              className="text-emerald-400 hover:text-emerald-300">
                              <IconMap className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-center text-xs text-zinc-300">
                        {getStatusCount(k, "hadir")}/{k.jumlahPeserta}
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <button onClick={() => openQr(k)} className="text-zinc-500 hover:text-zinc-200">
                          <IconQrcode className="mx-auto h-4 w-4" />
                        </button>
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openAttendance(k)}
                            className="h-7 rounded-lg px-2 text-[10px] text-emerald-400 hover:bg-emerald-500/10">
                            <IconCheck className="h-3 w-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost"
                                className="h-7 w-7 rounded-lg text-zinc-400 hover:bg-white/5">
                                <IconDots className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="right">
                              <DropdownMenuItem onClick={() => window.location.href = `/admin/kegiatan/${k.id}/edit`}>
                                <IconEdit className="mr-2 h-3.5 w-3.5" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedKegiatan(k); setIsDeleteOpen(true); }}>
                                <IconTrash className="mr-2 h-3.5 w-3.5" /> Hapus
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                const url = `${window.location.origin}/kegiatan/${k.id}`;
                                navigator.clipboard.writeText(url);
                                const el = document.createElement("div");
                                el.className = "fixed bottom-4 right-4 z-50 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300 shadow-lg";
                                el.textContent = "Link disalin!";
                                document.body.appendChild(el);
                                setTimeout(() => el.remove(), 2000);
                              }}>
                                <IconShare className="mr-2 h-3.5 w-3.5" /> Salin Link Publik
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filtered.length === 0 && (
                <p className="py-12 text-center text-xs text-zinc-500">Tidak ada kegiatan ditemukan</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) resetForm(); setIsFormOpen(open); }}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingKegiatan ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}</DialogTitle>
            <DialogDescription>
              {editingKegiatan ? "Ubah data kegiatan di bawah ini." : "Lengkapi data kegiatan di bawah ini."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Nama Kegiatan</Label>
                <Input className="h-9 text-xs" value={formData.namaKegiatan}
                  onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Jenis</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                  value={formData.jenis} onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}>
                  <option value="">Pilih Jenis</option>
                  <option value="Internal">Internal</option>
                  <option value="Publik">Publik</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Tanggal</Label>
                <Input type="date" className="h-9 text-xs" value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Jam Mulai</Label>
                <Input type="time" className="h-9 text-xs" value={formData.jamMulai}
                  onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Jam Selesai</Label>
                <Input type="time" className="h-9 text-xs" value={formData.jamSelesai}
                  onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Lokasi</Label>
                <Input className="h-9 text-xs" value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Link Google Maps <span className="text-zinc-600">(opsional)</span></Label>
              <Input className="h-9 text-xs" value={formData.mapsUrl} placeholder="https://maps.google.com/..."
                onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Gambar <span className="text-zinc-600">(opsional)</span></Label>
              <label className="flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-400 hover:border-white/20">
                <IconUpload className="h-4 w-4" />
                {gambarFile ? gambarFile.name : "Pilih file gambar..."}
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => setGambarFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            {(gambarFile || editingKegiatan?.gambar) && (
              <div className="overflow-hidden rounded-xl border border-white/10">
                <img
                  src={gambarFile ? URL.createObjectURL(gambarFile) : editingKegiatan?.gambar || ""}
                  alt="Preview"
                  className="h-32 w-full object-cover" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Deskripsi</Label>
              <textarea className="min-h-[80px] w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-emerald-500/50 resize-y"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { resetForm(); setIsFormOpen(false); }}>Batal</Button>
            <Button onClick={handleSave} disabled={uploading}>{uploading ? "Mengupload..." : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
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

      {/* Attendance Dialog */}
      <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Absensi Kegiatan</DialogTitle>
            <DialogDescription>
              Catat kehadiran untuk <strong>{attendanceKegiatan?.namaKegiatan}</strong> pada {attendanceKegiatan && formatDate(attendanceKegiatan.tanggal)}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {attendanceLoading ? (
              <p className="py-8 text-center text-xs text-zinc-500">Memuat data anggota...</p>
            ) : attendanceAnggota.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-500">Tidak ada anggota ditemukan</p>
            ) : (
              attendanceAnggota.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                  <span className="text-xs font-medium text-zinc-200">{a.namaLengkap}</span>
                  <select
                    className="h-8 w-[130px] shrink-0 rounded-xl border border-white/10 bg-zinc-950 px-2 text-[10px] text-zinc-300 outline-none focus:border-emerald-500/50"
                    value={a.status}
                    onChange={(e) => handleAttendanceStatusChange(a.id, e.target.value)}>
                    <option value="">Belum diisi</option>
                    <option value="hadir">Hadir</option>
                    <option value="izin">Izin</option>
                    <option value="sakit">Sakit</option>
                    <option value="tidak_hadir">Tidak Hadir</option>
                  </select>
                </div>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAttendanceOpen(false)}>Batal</Button>
            <Button onClick={handleSaveAttendance} disabled={attendanceSaving}
              className="bg-emerald-500 hover:bg-emerald-600 text-white">
              {attendanceSaving ? "Menyimpan..." : "Simpan Absensi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Scanner Dialog */}
      <Dialog open={isScanOpen} onOpenChange={setIsScanOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Scan QR Absensi</DialogTitle>
            <DialogDescription>
              Arahkan kamera ke QR yang sudah di-generate untuk <strong>{scanKegiatan?.namaKegiatan}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
              <Scanner
                onScan={(detectedCodes) => {
                  const code = detectedCodes?.[0]?.rawValue;
                  if (code) handleQrScan(code);
                }}
                styles={{ container: { borderRadius: 0 } }}
                allowMultiple={false}
                scanDelay={1000}
              />
            </div>
            {scanStatus && (
              <div className={`rounded-xl border p-3 text-center text-xs ${
                scanStatus.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-300"
              }`}>
                {scanStatus.message}
              </div>
            )}
            {scannedNames.length > 0 && (
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-[10px] text-zinc-500 font-semibold mb-2">Telah Absen ({scannedNames.length})</p>
                <div className="flex flex-wrap gap-1.5">
                  {scannedNames.map((s) => (
                    <Badge key={s.id} variant="outline" className="rounded-lg border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-[9px]">
                      {s.nama}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScanOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Dialog */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>QR Code Absensi</DialogTitle>
            <DialogDescription>
              Scan untuk absen mandiri kegiatan <strong>{qrKegiatan?.namaKegiatan}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-center">
            <div className="space-y-1.5 text-left">
              <Label className="text-xs text-zinc-400">Tanggal Kegiatan</Label>
              <Input className="h-9 text-xs" type="date" value={qrTanggal}
                onChange={(e) => { setQrTanggal(e.target.value); setQrTimer(60); setQrStamp(Date.now()); }} />
            </div>
            <Separator className="bg-white/10" />
            <div className="inline-flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white p-4">
              <QRCodeSVG
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/absen?kegiatan=${qrKegiatan?.id}&tanggal=${qrTanggal}&t=${qrStamp}`}
                size={180}
                bgColor="#ffffff"
                fgColor="#111111"
                level="M" />
              <p className="text-[8px] text-zinc-400 max-w-[180px] leading-tight">Scan untuk absen mandiri</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-500/30 text-xs font-bold text-emerald-300">
                {qrTimer}
              </div>
              <span className="text-[10px] text-zinc-500">detik tersisa</span>
            </div>
            <p className="text-[9px] text-zinc-600 leading-relaxed">
              QR code diperbarui otomatis setiap 60 detik. Screenshot QR tidak akan berlaku setelah expired.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsQrOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
