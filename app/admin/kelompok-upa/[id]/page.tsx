"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { QRCodeSVG } from "qrcode.react";
import { api } from "@/lib/api";
import {
  IconArrowLeft,
  IconCalendarEvent,
  IconClock,
  IconMapPin,
  IconUser,
  IconUsers,
  IconInfoCircle,
  IconCalendarMonth,
  IconCheck,
  IconX,
  IconMinus,
  IconPlus,
  IconEdit,
  IconTrash,
  IconClipboardCheck,
  IconDots,
  IconCalendar,
  IconListDetails,
  IconChevronLeft,
  IconChevronRight,
  IconCircle,
  IconQrcode,
} from "@tabler/icons-react";

interface UserData {
  id: number;
  email: string;
  role: string;
}

interface AnggotaData {
  id: number;
  namaLengkap: string;
  nik: string | null;
  noHp: string | null;
  status: string;
  user: UserData | null;
}

interface JadwalData {
  id: number;
  kelompokId: number;
  hari: string | null;
  waktu: string | null;
  tempat: string | null;
  mapsUrl: string | null;
  aktivitas: string | null;
}

interface AbsensiData {
  id: number;
  tanggal: string;
  status: string;
  anggota: {
    id: number;
    namaLengkap: string;
    user: { email: string } | null;
  } | null;
}

interface KelompokDetail {
  id: number;
  namaKelompok: string;
  ketuaId: number | null;
  wilayah: string | null;
  jadwalRutin: string | null;
  deskripsi: string | null;
  ketua: (AnggotaData & { user: UserData | null }) | null;
  anggota: AnggotaData[];
  jadwalUpa: JadwalData[];
  absensiKelompok: AbsensiData[];
}

interface JadwalForm {
  hari: string;
  waktu: string;
  tempat: string;
  mapsUrl: string;
  aktivitas: string;
}

const emptyJadwalForm: JadwalForm = {
  hari: "Senin",
  waktu: "",
  tempat: "",
  mapsUrl: "",
  aktivitas: "",
};

const HARI = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"];

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "aktif": return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "tidak_aktif": return "border-rose-500/30 bg-rose-500/10 text-rose-300";
    default: return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
  }
}

function formatStatus(status: string) {
  switch (status) {
    case "aktif": return "Aktif";
    case "tidak_aktif": return "Non Aktif";
    default: return status;
  }
}

function getGoogleMapsEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");

    // Already an embed URL
    if (host === "maps.google.com" && u.pathname.startsWith("/maps/embed/")) return url;

    const params = u.searchParams;

    // Format: https://www.google.com/maps/place/... or /maps/place/...
    if (host === "google.com" && u.pathname.startsWith("/maps/place/")) {
      const place = u.pathname.replace("/maps/place/", "").replace(/\/.*$/, "");
      if (place) return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
    }

    // Format: https://maps.google.com/?q=... or ?ll=...
    if (host === "maps.google.com" || host === "google.com") {
      const q = params.get("q");
      if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
      const ll = params.get("ll");
      if (ll) return `https://maps.google.com/maps?q=${ll}&output=embed`;
    }

    // Format: https://maps.app.goo.gl/...
    if (host === "maps.app.goo.gl" || host === "goo.gl") {
      return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
    }

    // Last resort: use the full URL as query
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`;
  } catch {
    // Invalid URL - user might have pasted just an address
    if (url.trim().length > 3) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(url.trim())}&output=embed`;
    }
    return null;
  }
}

function formatAbsensi(status: string) {
  switch (status) {
    case "hadir": return { label: "Hadir", icon: IconCheck, class: "text-emerald-300" };
    case "izin": return { label: "Izin", icon: IconClock, class: "text-amber-300" };
    case "sakit": return { label: "Sakit", icon: IconX, class: "text-amber-300" };
    case "tidak_hadir": return { label: "Tidak Hadir", icon: IconX, class: "text-rose-300" };
    default: return { label: status, icon: IconMinus, class: "text-zinc-400" };
  }
}

export default function UpaDetailPage() {
  const { id } = useParams();
  const kelompokId = Number(id);
  const [data, setData] = useState<KelompokDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Jadwal CRUD
  const [selectedJadwal, setSelectedJadwal] = useState<JadwalData | null>(null);
  const [isJadwalAddOpen, setIsJadwalAddOpen] = useState(false);
  const [isJadwalEditOpen, setIsJadwalEditOpen] = useState(false);
  const [isJadwalDeleteOpen, setIsJadwalDeleteOpen] = useState(false);
  const [jadwalForm, setJadwalForm] = useState<JadwalForm>(emptyJadwalForm);
  const [jadwalSaving, setJadwalSaving] = useState(false);

  // Absensi dialog
  const [isAbsensiOpen, setIsAbsensiOpen] = useState(false);
  const [absensiTanggal, setAbsensiTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [absensiData, setAbsensiData] = useState<Record<number, string>>({});
  const [absensiSaving, setAbsensiSaving] = useState(false);

  // QR generator dialog
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [qrTanggal, setQrTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [qrTimer, setQrTimer] = useState(60);
  const [qrStamp, setQrStamp] = useState(Date.now());

  async function loadData() {
    setLoading(true);
    try {
      const res = await api.get<KelompokDetail>(`/kelompok-upa/${kelompokId}`);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (kelompokId) loadData();
  }, [kelompokId]);

  // QR timer: refresh QR code only when 60s expires
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

  // Jadwal CRUD handlers
  async function handleAddJadwal() {
    setJadwalSaving(true);
    try {
      await api.post("/jadwal-upa", { ...jadwalForm, kelompokId });
      setIsJadwalAddOpen(false);
      setJadwalForm(emptyJadwalForm);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menambah jadwal");
    } finally {
      setJadwalSaving(false);
    }
  }

  async function handleEditJadwal() {
    if (!selectedJadwal) return;
    setJadwalSaving(true);
    try {
      await api.put(`/jadwal-upa/${selectedJadwal.id}`, jadwalForm);
      setIsJadwalEditOpen(false);
      setSelectedJadwal(null);
      setJadwalForm(emptyJadwalForm);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengupdate jadwal");
    } finally {
      setJadwalSaving(false);
    }
  }

  async function handleDeleteJadwal() {
    if (!selectedJadwal) return;
    try {
      await api.delete(`/jadwal-upa/${selectedJadwal.id}`);
      setIsJadwalDeleteOpen(false);
      setSelectedJadwal(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus jadwal");
    }
  }

  function openEditJadwal(jadwal: JadwalData) {
    setSelectedJadwal(jadwal);
    setJadwalForm({
      hari: jadwal.hari || "Senin",
      waktu: jadwal.waktu || "",
      tempat: jadwal.tempat || "",
      mapsUrl: jadwal.mapsUrl || "",
      aktivitas: jadwal.aktivitas || "",
    });
    setIsJadwalEditOpen(true);
  }

  function openDeleteJadwal(jadwal: JadwalData) {
    setSelectedJadwal(jadwal);
    setIsJadwalDeleteOpen(true);
  }

  // Absensi handlers
  function openAbsensi(jadwal: JadwalData) {
    setAbsensiTanggal(new Date().toISOString().split("T")[0]);
    const init: Record<number, string> = {};
    if (data) {
      for (const a of data.anggota) {
        init[a.id] = "hadir";
      }
    }
    setAbsensiData(init);
    setIsAbsensiOpen(true);
  }

  function openQrGenerator(jadwal: JadwalData) {
    setQrTanggal(new Date().toISOString().split("T")[0]);
    setQrTimer(60);
    setQrStamp(Date.now());
    setIsQrOpen(true);
  }

  async function handleSaveAbsensi() {
    if (!data) return;
    setAbsensiSaving(true);
    try {
      const records = Object.entries(absensiData).map(([anggotaId, status]) => ({
        kelompokId,
        anggotaId: Number(anggotaId),
        tanggal: absensiTanggal,
        status,
      }));
      await api.post("/absensi-kelompok", records);
      setIsAbsensiOpen(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan absensi");
    } finally {
      setAbsensiSaving(false);
    }
  }

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-xl bg-white/5" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-4 space-y-4">
            <Skeleton className="h-64 rounded-2xl bg-white/5" />
            <Skeleton className="h-40 rounded-2xl bg-white/5" />
          </div>
          <div className="xl:col-span-8 space-y-4">
            <Skeleton className="h-64 rounded-2xl bg-white/5" />
            <Skeleton className="h-48 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <IconInfoCircle className="mb-3 h-10 w-10 text-rose-400" />
        <p className="text-sm text-zinc-400">{error || "Data tidak ditemukan"}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/admin/kelompok-upa">Kembali</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" asChild className="h-8 rounded-xl px-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
          <Link href="/admin/kelompok-upa">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Left: Info */}
        <div className="space-y-4 xl:col-span-4">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
            <CardHeader className="pb-3 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                <IconUsers className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-bold text-zinc-50">{data.namaKelompok}</CardTitle>
              {data.wilayah && <CardDescription className="text-xs">{data.wilayah}</CardDescription>}
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <Separator className="bg-white/10" />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                    <IconUser className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-500 uppercase font-semibold">Ketua</p>
                    <p className="truncate text-sm font-medium text-zinc-200">
                      {data.ketua ? data.ketua.namaLengkap : "Belum ditentukan"}
                    </p>
                  </div>
                </div>
                {data.jadwalRutin && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400">
                      <IconCalendarEvent className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-zinc-500 uppercase font-semibold">Jadwal Rutin</p>
                      <p className="truncate text-sm font-medium text-zinc-200">{data.jadwalRutin}</p>
                    </div>
                  </div>
                )}
              </div>
              {data.deskripsi && (
                <><Separator className="bg-white/10" /><p className="text-xs text-zinc-400 leading-relaxed">{data.deskripsi}</p></>
              )}
              <Separator className="bg-white/10" />
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Anggota</p>
                  <p className="text-xl font-bold text-zinc-100">{data.anggota.length}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold">Pertemuan</p>
                  <p className="text-xl font-bold text-zinc-100">{data.absensiKelompok.length}</p>
                </div>
              </div>
              {data.absensiKelompok.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-[10px] text-zinc-500 uppercase font-semibold mb-2">Pertemuan Terakhir</p>
                  <p className="text-xs text-zinc-300">
                    {new Date(data.absensiKelompok[0].tanggal).toLocaleDateString("id-ID", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Jadwal UPA with CRUD */}
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 overflow-visible">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Jadwal UPA</CardTitle>
                  <CardDescription className="text-xs">Jadwal kegiatan kelompok.</CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => { setJadwalForm(emptyJadwalForm); setIsJadwalAddOpen(true); }}
                  className="h-7 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-2.5 text-[10px] font-medium text-emerald-100 hover:bg-emerald-400/25"
                >
                  <IconPlus className="mr-1 h-3 w-3" />
                  Tambah
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {data.jadwalUpa.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">Belum ada jadwal</p>
              ) : (
                data.jadwalUpa.map((j) => (
                  <div key={j.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-xs">
                          <IconCalendarMonth className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span className="font-semibold text-zinc-100">{j.hari || "-"}</span>
                          {j.waktu && <span className="text-zinc-400">• {j.waktu}</span>}
                        </div>
                        {j.tempat && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-zinc-500">
                            <IconMapPin className="h-3 w-3 shrink-0" />
                            {j.mapsUrl ? (
                              <a href={j.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors underline underline-offset-2 decoration-white/10">
                                {j.tempat}
                              </a>
                            ) : <span>{j.tempat}</span>}
                          </div>
                        )}
                        {j.aktivitas && (
                          <p className="mt-1 text-[10px] text-zinc-400">{j.aktivitas}</p>
                        )}
                        {j.mapsUrl && (
                          <div className="mt-1.5">
                            <a href={j.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors underline underline-offset-2 decoration-emerald-500/30">
                              <IconMapPin className="h-3 w-3" />
                              Buka di Google Maps
                            </a>
                          </div>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-6 w-6 shrink-0 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-white/5">
                            <IconDots className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="right" sideOffset={4}>
                          <DropdownMenuItem onClick={() => openAbsensi(j)}>
                            <IconClipboardCheck className="mr-2 h-3.5 w-3.5" />
                            Input Manual
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openQrGenerator(j)}>
                            <IconQrcode className="mr-2 h-3.5 w-3.5" />
                            Generate QR
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEditJadwal(j)}>
                            <IconEdit className="mr-2 h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => openDeleteJadwal(j)}>
                            <IconTrash className="mr-2 h-3.5 w-3.5" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Anggota + Absensi */}
        <div className="space-y-4 xl:col-span-8">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-zinc-50">Daftar Anggota</CardTitle>
              <CardDescription className="text-xs">{data.anggota.length} orang anggota</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-white/5 hover:bg-white/5">
                      <TableHead className="text-xs text-zinc-300">Nama</TableHead>
                      <TableHead className="text-xs text-zinc-300">NIK</TableHead>
                      <TableHead className="text-xs text-zinc-300">No. HP</TableHead>
                      <TableHead className="text-xs text-zinc-300">Email</TableHead>
                      <TableHead className="text-xs text-zinc-300 text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.anggota.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-xs text-zinc-500">
                          Belum ada anggota dalam kelompok ini
                        </TableCell>
                      </TableRow>
                    ) : (
                      data.anggota.map((member) => (
                        <TableRow key={member.id} className="border-white/10 hover:bg-white/[0.03]">
                          <TableCell className="py-2.5">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-7 w-7 text-[10px]">
                                <AvatarImage src={`https://picsum.photos/seed/${member.namaLengkap}/64/64`} />
                                <AvatarFallback>{member.namaLengkap.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium text-zinc-200">{member.namaLengkap}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-2.5 text-xs text-zinc-400">{member.nik || "-"}</TableCell>
                          <TableCell className="py-2.5 text-xs text-zinc-400">{member.noHp || "-"}</TableCell>
                          <TableCell className="py-2.5 text-xs text-zinc-400">{member.user?.email || "-"}</TableCell>
                          <TableCell className="py-2.5 text-center">
                            <Badge variant="outline" className={`rounded-lg px-2 py-0 text-[10px] ${getStatusBadgeClass(member.status)}`}>
                              {formatStatus(member.status)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Riwayat Absensi */}
          <AbsensiSection absensiList={data.absensiKelompok} anggotaList={data.anggota} />
        </div>
      </div>

      {/* Add Jadwal Dialog */}
      <Dialog open={isJadwalAddOpen} onOpenChange={setIsJadwalAddOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal UPA</DialogTitle>
            <DialogDescription>Buat jadwal kegiatan baru.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Hari</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={jadwalForm.hari} onChange={(e) => setJadwalForm({ ...jadwalForm, hari: e.target.value })}>
                  {HARI.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Waktu</Label>
                <Input className="h-9 text-xs" placeholder="19:30" value={jadwalForm.waktu} onChange={(e) => setJadwalForm({ ...jadwalForm, waktu: e.target.value })} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-zinc-400">Tempat</Label>
                <Input className="h-9 text-xs" placeholder="Lokasi kegiatan" value={jadwalForm.tempat} onChange={(e) => setJadwalForm({ ...jadwalForm, tempat: e.target.value })} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-zinc-400">Google Maps URL <span className="text-zinc-600">(opsional)</span></Label>
                <Input className="h-9 text-xs" placeholder="https://maps.google.com/?q=..." value={jadwalForm.mapsUrl} onChange={(e) => setJadwalForm({ ...jadwalForm, mapsUrl: e.target.value })} />
                <p className="text-[9px] text-zinc-600">Link Google Maps lokasi kegiatan</p>
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-zinc-400">Aktivitas</Label>
                <textarea className="min-h-[60px] w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-emerald-500/50 resize-y" placeholder="Materi / kegiatan" value={jadwalForm.aktivitas} onChange={(e) => setJadwalForm({ ...jadwalForm, aktivitas: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJadwalAddOpen(false)} disabled={jadwalSaving}>Batal</Button>
            <Button onClick={handleAddJadwal} disabled={jadwalSaving}>{jadwalSaving ? "Menyimpan..." : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Jadwal Dialog */}
      <Dialog open={isJadwalEditOpen} onOpenChange={setIsJadwalEditOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Edit Jadwal UPA</DialogTitle>
            <DialogDescription>Perbarui jadwal kegiatan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Hari</Label>
                <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50" value={jadwalForm.hari} onChange={(e) => setJadwalForm({ ...jadwalForm, hari: e.target.value })}>
                  {HARI.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-zinc-400">Waktu</Label>
                <Input className="h-9 text-xs" value={jadwalForm.waktu} onChange={(e) => setJadwalForm({ ...jadwalForm, waktu: e.target.value })} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-zinc-400">Tempat</Label>
                <Input className="h-9 text-xs" value={jadwalForm.tempat} onChange={(e) => setJadwalForm({ ...jadwalForm, tempat: e.target.value })} />
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-zinc-400">Google Maps URL <span className="text-zinc-600">(opsional)</span></Label>
                <Input className="h-9 text-xs" placeholder="https://maps.google.com/?q=..." value={jadwalForm.mapsUrl} onChange={(e) => setJadwalForm({ ...jadwalForm, mapsUrl: e.target.value })} />
                <p className="text-[9px] text-zinc-600">Link Google Maps lokasi kegiatan</p>
              </div>
              <div className="space-y-1.5 col-span-2">
                <Label className="text-xs text-zinc-400">Aktivitas</Label>
                <textarea className="min-h-[60px] w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-emerald-500/50 resize-y" value={jadwalForm.aktivitas} onChange={(e) => setJadwalForm({ ...jadwalForm, aktivitas: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsJadwalEditOpen(false)} disabled={jadwalSaving}>Batal</Button>
            <Button onClick={handleEditJadwal} disabled={jadwalSaving}>{jadwalSaving ? "Menyimpan..." : "Simpan Perubahan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Jadwal Dialog */}
      <Dialog open={isJadwalDeleteOpen} onOpenChange={setIsJadwalDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-rose-400">Hapus Jadwal</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus jadwal <strong>{selectedJadwal?.hari} {selectedJadwal?.waktu}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsJadwalDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDeleteJadwal} className="bg-rose-500 hover:bg-rose-600">Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Absensi Dialog */}
      <Dialog open={isAbsensiOpen} onOpenChange={setIsAbsensiOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Buat Absensi</DialogTitle>
            <DialogDescription>Catat kehadiran anggota pada pertemuan ini.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Tanggal Pertemuan</Label>
              <Input className="h-9 text-xs" type="date" value={absensiTanggal} onChange={(e) => setAbsensiTanggal(e.target.value)} />
            </div>
            <Separator className="bg-white/10" />
            <p className="text-[11px] font-medium text-zinc-500">Daftar Anggota</p>
            <div className="space-y-2">
              {data.anggota.length === 0 ? (
                <p className="text-xs text-zinc-500 py-4 text-center">Tidak ada anggota dalam kelompok ini</p>
              ) : (
                data.anggota.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-7 w-7 text-[10px]">
                        <AvatarImage src={`https://picsum.photos/seed/${member.namaLengkap}/64/64`} />
                        <AvatarFallback>{member.namaLengkap.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-zinc-200 truncate">{member.namaLengkap}</span>
                    </div>
                    <select
                      className="h-8 w-[120px] shrink-0 rounded-xl border border-white/10 bg-zinc-950 px-2 text-[10px] text-zinc-300 outline-none focus:border-emerald-500/50"
                      value={absensiData[member.id] || "hadir"}
                      onChange={(e) => setAbsensiData({ ...absensiData, [member.id]: e.target.value })}
                    >
                      <option value="hadir">Hadir</option>
                      <option value="izin">Izin</option>
                      <option value="sakit">Sakit</option>
                      <option value="tidak_hadir">Tidak Hadir</option>
                    </select>
                  </div>
                ))
              )}
            </div>
            <Separator className="bg-white/10" />
            <div className="text-center">
              <p className="text-[10px] font-medium text-zinc-500 mb-2">QR Code Absensi</p>
              <div className="inline-flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white p-3">
                <QRCodeSVG
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/absen?kelompok=${kelompokId}&tanggal=${absensiTanggal}`}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#111111"
                  level="M"
                />
                <p className="text-[8px] text-zinc-400 max-w-[140px] leading-tight">Scan untuk absensi mandiri</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAbsensiOpen(false)} disabled={absensiSaving}>Batal</Button>
            <Button onClick={handleSaveAbsensi} disabled={absensiSaving || data.anggota.length === 0}>
              {absensiSaving ? "Menyimpan..." : "Simpan Absensi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Generator Dialog */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Generate QR Absensi</DialogTitle>
            <DialogDescription>QR code berubah setiap 60 detik untuk keamanan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-center">
            <div className="space-y-1.5 text-left">
              <Label className="text-xs text-zinc-400">Tanggal Pertemuan</Label>
              <Input className="h-9 text-xs" type="date" value={qrTanggal} onChange={(e) => { setQrTanggal(e.target.value); setQrTimer(60); setQrStamp(Date.now()); }} />
            </div>
            <Separator className="bg-white/10" />
            <div className="inline-flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white p-4">
              <QRCodeSVG
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/absen?kelompok=${kelompokId}&tanggal=${qrTanggal}&t=${qrStamp}`}
                size={180}
                bgColor="#ffffff"
                fgColor="#111111"
                level="M"
              />
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

function MapsPreview({ mapsUrl, height = 160, className = "" }: { mapsUrl: string; height?: number; className?: string }) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mapsUrl) { setEmbedUrl(null); return; }
    const u = getGoogleMapsEmbedUrl(mapsUrl);
    if (u) { setEmbedUrl(u); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/resolve-url?url=${encodeURIComponent(mapsUrl)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.resolved) {
          setEmbedUrl(getGoogleMapsEmbedUrl(d.resolved));
        } else {
          setEmbedUrl(`https://maps.google.com/maps?q=${encodeURIComponent(mapsUrl)}&output=embed`);
        }
      })
      .catch(() => setEmbedUrl(`https://maps.google.com/maps?q=${encodeURIComponent(mapsUrl)}&output=embed`))
      .finally(() => setLoading(false));
  }, [mapsUrl]);

  if (!mapsUrl) return null;
  if (loading) return <div className={`${className} rounded-xl border border-white/10 bg-zinc-950/30 p-4 text-center`}>
    <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
    <p className="mt-1 text-[10px] text-zinc-500">Memuat peta...</p>
  </div>;
  if (!embedUrl) return <div className={`${className} rounded-xl border border-dashed border-white/10 bg-zinc-950/30 p-4 text-center`}>
    <IconMapPin className="mx-auto h-5 w-5 text-zinc-600 mb-1" />
    <p className="text-[10px] text-zinc-500">Masukkan URL Google Maps yang valid untuk melihat preview</p>
  </div>;
  return <div className={`${className} rounded-xl overflow-hidden border border-white/10`}>
    <iframe
      src={embedUrl}
      width="100%"
      height={height}
      style={{ border: 0, filter: "invert(0.9) hue-rotate(180deg)" }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Preview Google Maps"
    />
  </div>;
}

function AbsensiSection({ absensiList }: { absensiList: AbsensiData[]; anggotaList: AnggotaData[] }) {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");
  const [detailDate, setDetailDate] = useState<string | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return { month: now.getMonth(), year: now.getFullYear() };
  });

  const grouped = useMemo(() => {
    const map = new Map<string, AbsensiData[]>();
    for (const abs of absensiList) {
      const key = abs.tanggal.split("T")[0];
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(abs);
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]));
  }, [absensiList]);

  const detailAbsensi = detailDate
    ? (absensiList.filter((a) => a.tanggal.startsWith(detailDate)))
    : [];

  function getAttendanceStats(dateKey: string) {
    const records = absensiList.filter((a) => a.tanggal.startsWith(dateKey));
    const hadir = records.filter((r) => r.status === "hadir").length;
    const izin = records.filter((r) => r.status === "izin" || r.status === "sakit").length;
    const alpha = records.filter((r) => r.status === "tidak_hadir").length;
    return { total: records.length, hadir, izin, alpha };
  }

  function calendarDays() {
    const { month, year } = calendarMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }

  const datesWithAbsensi = new Set(absensiList.map((a) => a.tanggal.split("T")[0]));

  const monthLabel = new Date(calendarMonth.year, calendarMonth.month).toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  if (absensiList.length === 0) {
    return (
      <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-zinc-50">Riwayat Absensi</CardTitle>
          <CardDescription className="text-xs">Catatan kehadiran pertemuan kelompok.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-zinc-500 py-8 text-center">Belum ada absensi</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-zinc-50">Riwayat Absensi</CardTitle>
              <CardDescription className="text-xs">Catatan kehadiran pertemuan kelompok.</CardDescription>
            </div>
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950 p-0.5">
              <button onClick={() => setViewMode("calendar")} className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] transition-colors ${viewMode === "calendar" ? "bg-emerald-500/15 text-emerald-300" : "text-zinc-500 hover:text-zinc-300"}`}>
                <IconCalendar className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setViewMode("list")} className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] transition-colors ${viewMode === "list" ? "bg-emerald-500/15 text-emerald-300" : "text-zinc-500 hover:text-zinc-300"}`}>
                <IconListDetails className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {viewMode === "calendar" ? (
            <>
              {/* Calendar nav */}
              <div className="flex items-center justify-between px-1">
                <button onClick={() => {
                  const m = calendarMonth.month - 1;
                  if (m < 0) setCalendarMonth({ month: 11, year: calendarMonth.year - 1 });
                  else setCalendarMonth({ month: m, year: calendarMonth.year });
                }} className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors">
                  <IconChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-sm font-bold text-zinc-100 tracking-tight">{monthLabel}</span>
                <button onClick={() => {
                  const m = calendarMonth.month + 1;
                  if (m > 11) setCalendarMonth({ month: 0, year: calendarMonth.year + 1 });
                  else setCalendarMonth({ month: m, year: calendarMonth.year });
                }} className="flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors">
                  <IconChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Calendar grid */}
              <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-3">
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((h) => (
                    <div key={h} className="text-[9px] font-semibold text-zinc-600 uppercase tracking-wider py-1">{h}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {calendarDays().map((day, i) => {
                    if (day === null) return <div key={`e-${i}`} />;
                    const dateStr = `${calendarMonth.year}-${String(calendarMonth.month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const hasAbsensi = datesWithAbsensi.has(dateStr);
                    const stats = hasAbsensi ? getAttendanceStats(dateStr) : null;
                    const isToday = dateStr === new Date().toISOString().split("T")[0];
                    return (
                      <button key={dateStr} onClick={() => hasAbsensi && setDetailDate(dateStr)} disabled={!hasAbsensi} className={`relative flex flex-col items-center justify-center rounded-xl py-2 text-xs transition-all duration-150 ${hasAbsensi ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default"}`}>
                        {/* Background layers */}
                        {hasAbsensi && (
                          <div className="absolute inset-1 rounded-xl bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.08)]" />
                        )}
                        {isToday && hasAbsensi && (
                          <div className="absolute inset-0 rounded-xl ring-1 ring-emerald-400/40 ring-offset-1 ring-offset-zinc-900" />
                        )}
                        {/* Day number */}
                        <span className={`relative z-10 font-semibold ${hasAbsensi ? "text-emerald-200" : isToday ? "text-zinc-400" : "text-zinc-600"}`}>
                          {day}
                        </span>
                        {/* Dot indicator */}
                        <div className="relative z-10 flex items-center gap-0.5 mt-0.5 h-1.5">
                          {hasAbsensi && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-emerald-400" />
                              <span className={`h-1 w-1 rounded-full ${stats!.hadir >= stats!.total * 0.8 ? "bg-emerald-400" : "bg-amber-400"}`} />
                              {stats!.alpha > 0 && <span className="h-1 w-1 rounded-full bg-rose-400/60" />}
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-4 text-[9px] text-zinc-500 pt-1">
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Hadir</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> Izin/Sakit</span>
                <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-rose-400/60" /> Alpha</span>
              </div>
            </>
          ) : (
            /* List view */
            <div className="space-y-2">
              {grouped.map(([dateKey, records]) => {
                const { total, hadir } = getAttendanceStats(dateKey);
                const d = new Date(dateKey + "T00:00:00");
                const isToday = dateKey === new Date().toISOString().split("T")[0];
                const label = d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
                return (
                  <button key={dateKey} onClick={() => setDetailDate(dateKey)} className="w-full flex items-center gap-3 rounded-xl border border-white/[0.06] bg-gradient-to-r from-white/[0.03] to-transparent p-3 text-left hover:from-emerald-500/5 hover:border-emerald-500/20 transition-all duration-150 group">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${isToday ? "border-emerald-500/30 bg-emerald-500/10" : "border-white/10 bg-zinc-950/50"}`}>
                      <span className={`text-xs font-bold ${isToday ? "text-emerald-300" : "text-zinc-400"}`}>{d.getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-100 group-hover:text-emerald-200 transition-colors">{label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-emerald-400">&#9679; {hadir}</span>
                        <span className="text-[10px] text-zinc-600">/</span>
                        <span className="text-[10px] text-zinc-500">{total} anggota</span>
                      </div>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconChevronRight className="h-4 w-4 text-emerald-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Absensi Modal */}
      <Dialog open={detailDate !== null} onOpenChange={(o) => { if (!o) setDetailDate(null); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>
              {detailDate && new Date(detailDate + "T00:00:00").toLocaleDateString("id-ID", {
                weekday: "long", day: "numeric", month: "long", year: "numeric",
              })}
            </DialogTitle>
            <DialogDescription>Daftar kehadiran anggota pada pertemuan ini.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {detailAbsensi.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">Tidak ada data</p>
            ) : (
              <>
                {/* Summary bar */}
                <div className="flex gap-2 mb-4">
                  {(() => {
                    const h = detailAbsensi.filter((a) => a.status === "hadir").length;
                    const i = detailAbsensi.filter((a) => a.status === "izin" || a.status === "sakit").length;
                    const a = detailAbsensi.filter((a) => a.status === "tidak_hadir").length;
                    return (
                      <>
                        <div className="flex-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-center">
                          <p className="text-lg font-bold text-emerald-300">{h}</p>
                          <p className="text-[9px] text-emerald-400/70 uppercase tracking-wider">Hadir</p>
                        </div>
                        <div className="flex-1 rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 text-center">
                          <p className="text-lg font-bold text-amber-300">{i}</p>
                          <p className="text-[9px] text-amber-400/70 uppercase tracking-wider">Izin/Sakit</p>
                        </div>
                        <div className="flex-1 rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-center">
                          <p className="text-lg font-bold text-rose-300">{a}</p>
                          <p className="text-[9px] text-rose-400/70 uppercase tracking-wider">Alpha</p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {detailAbsensi.map((abs) => {
                  const fmt = formatAbsensi(abs.status);
                  const Icon = fmt.icon;
                  return (
                    <div key={abs.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="h-7 w-7 text-[8px]">
                          <AvatarImage src={`https://picsum.photos/seed/${abs.anggota?.namaLengkap || abs.id}/48/48`} />
                          <AvatarFallback>{abs.anggota?.namaLengkap?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-zinc-200 truncate">{abs.anggota?.namaLengkap || "Unknown"}</span>
                      </div>
                      <span className={`text-[10px] font-semibold shrink-0 px-2 py-0.5 rounded-full ${fmt.class} bg-current/5`}>
                        <Icon className="inline h-3 w-3 mr-0.5" />
                        {fmt.label}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailDate(null)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
