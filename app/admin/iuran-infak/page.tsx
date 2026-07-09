"use client";

import { useCallback, useEffect, useState } from "react";
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
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  IconCash, IconCreditCard, IconWallet, IconAlertCircle,
  IconSearch, IconPlus, IconDots, IconEdit, IconTrash,
  IconCheck, IconX, IconCalendar,
} from "@tabler/icons-react";

// ---------- types ----------
interface Anggota { id: number; namaLengkap: string; kelompokId: number | null; }

interface JenisIuran { id: number; namaIuran: string; nominal: number; status: string; }

interface PeriodeIuran {
  id: number; jenisIuranId: number; bulan: number; tahun: number; nominal: number;
  dibuatOleh: number | null; tanggalDibuat: string;
  jenisIuran: JenisIuran | null;
  _count: { pembayaranIuran: number };
}

interface Pembayaran {
  id: number; periodeIuranId: number; anggotaId: number;
  nominalTagihan: number; nominalBayar: number | null;
  tanggalBayar: string | null; status: string;
  metodePembayaran: string | null; buktiPembayaran: string | null; catatan: string | null;
  anggota: { id: number; namaLengkap: string; userId: number | null; kelompokId: number | null } | null;
}

interface Infak {
  id: number; anggotaId: number | null; kategoriInfak: string | null;
  nominal: number; tanggal: string; tujuan: string | null;
  keterangan: string | null; bukti: string | null;
  anggota: Anggota | null;
}

interface RiwayatCicilan {
  id: number; pembayaranIuranId: number; nominal: number;
  tanggalBayar: string; metodePembayaran: string | null;
  buktiPembayaran: string | null; catatan: string | null; dibuatPada: string;
}

const fmt = (n: number) => "Rp" + n.toLocaleString("id-ID");

const formatDate = (d: string | null) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const bulanList = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    belum_bayar: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    sudah_bayar: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    terlambat: "border-rose-500/30 bg-rose-500/10 text-rose-300",
    dicicil: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  };
  const label: Record<string, string> = { belum_bayar: "Belum Bayar", sudah_bayar: "Lunas", terlambat: "Terlambat", dicicil: "Dicicil" };
  return <Badge variant="outline" className={`rounded-lg px-2 py-0 text-[10px] ${map[s] || map.belum_bayar}`}>{label[s] || s}</Badge>;
};

// ========== PAGE ==========
export default function IuranInfakPage() {
  const [tab, setTab] = useState<"iuran" | "infak">("iuran");

  // --- Shared ---
  const [anggotaList, setAnggotaList] = useState<Anggota[]>([]);
  const [search, setSearch] = useState("");

  // --- Iuran state ---
  const [loading, setLoading] = useState(true);
  const [jenisList, setJenisList] = useState<JenisIuran[]>([]);
  const [periodeList, setPeriodeList] = useState<PeriodeIuran[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<PeriodeIuran | null>(null);
  const [pembayaranList, setPembayaranList] = useState<Pembayaran[]>([]);
  const [loadingPembayaran, setLoadingPembayaran] = useState(false);

  // --- Infak state ---
  const [infakList, setInfakList] = useState<Infak[]>([]);
  const [loadingInfak, setLoadingInfak] = useState(true);

  // --- Form state ---
  const [openJenis, setOpenJenis] = useState(false);
  const [openPeriode, setOpenPeriode] = useState(false);
  const [openBayar, setOpenBayar] = useState(false);
  const [openInfakForm, setOpenInfakForm] = useState(false);

  const [jenisForm, setJenisForm] = useState({ namaIuran: "", nominal: "" });
  const [periodeForm, setPeriodeForm] = useState({ jenisIuranId: "", bulan: String(new Date().getMonth() + 1), tahun: String(new Date().getFullYear()), nominal: "" });
  const [bayarForm, setBayarForm] = useState({ nominalBayar: "", tanggalBayar: new Date().toISOString().split("T")[0], metodePembayaran: "tunai", catatan: "" });
  const [selectedBayar, setSelectedBayar] = useState<Pembayaran | null>(null);
  const [cicilanList, setCicilanList] = useState<RiwayatCicilan[]>([]);
  const [loadingCicilan, setLoadingCicilan] = useState(false);
  const [infakForm, setInfakForm] = useState({ anggotaId: "", kategoriInfak: "", nominal: "", tanggal: new Date().toISOString().split("T")[0], tujuan: "", keterangan: "" });
  const [buktiFile, setBuktiFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);

  const fetchAnggota = useCallback(async () => {
    try { const r = await fetch("/api/anggota"); if (r.ok) setAnggotaList(await r.json()); } catch {}
  }, []);

  // --- Fetch iuran data ---
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [jr, pr] = await Promise.all([fetch("/api/jenis-iuran"), fetch("/api/periode-iuran")]);
        if (jr.ok) setJenisList(await jr.json());
        if (pr.ok) { const list = await pr.json(); setPeriodeList(list); if (list.length > 0) setSelectedPeriode(list[list.length - 1]); }
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const fetchPembayaran = useCallback(async (periodeId: number) => {
    setLoadingPembayaran(true);
    try {
      const r = await fetch(`/api/periode-iuran/${periodeId}`);
      if (r.ok) setPembayaranList(await r.json());
    } catch {} finally { setLoadingPembayaran(false); }
  }, []);

  useEffect(() => {
    if (selectedPeriode) fetchPembayaran(selectedPeriode.id);
  }, [selectedPeriode, fetchPembayaran]);

  const fetchCicilan = useCallback(async (pembayaranId: number) => {
    setLoadingCicilan(true);
    try {
      const r = await fetch(`/api/pembayaran-iuran/${pembayaranId}`);
      if (r.ok) setCicilanList(await r.json());
    } catch {} finally { setLoadingCicilan(false); }
  }, []);

  // --- Fetch infak data ---
  useEffect(() => {
    if (tab !== "infak") return;
    (async () => {
      setLoadingInfak(true);
      try { const r = await fetch("/api/infak"); if (r.ok) setInfakList(await r.json()); } catch {} finally { setLoadingInfak(false); }
    })();
  }, [tab]);

  // --- Iuran computed ---
  const p = selectedPeriode;
  const totalTagihan = pembayaranList.reduce((s, x) => s + x.nominalTagihan, 0);
  const sudahBayar = pembayaranList.filter((x) => x.status === "sudah_bayar");
  const dicicil = pembayaranList.filter((x) => x.status === "dicicil");
  const totalMasuk = pembayaranList.reduce((s, x) => s + (x.nominalBayar || 0), 0);
  const belumBayarCount = pembayaranList.filter((x) => x.status === "belum_bayar").length;

  // --- Infak computed ---
  const infakTotal = infakList.reduce((s, i) => s + i.nominal, 0);
  const infakBulanIni = infakList
    .filter((i) => i.tanggal && new Date(i.tanggal).getMonth() === new Date().getMonth())
    .reduce((s, i) => s + i.nominal, 0);
  const filteredPembayaran = pembayaranList.filter((x) => {
    const kw = search.toLowerCase();
    return !kw || x.anggota?.namaLengkap.toLowerCase().includes(kw);
  });
  const filteredInfak = infakList.filter((i) => {
    const kw = search.toLowerCase();
    return !kw || i.anggota?.namaLengkap.toLowerCase().includes(kw) || i.kategoriInfak?.toLowerCase().includes(kw) || i.tujuan?.toLowerCase().includes(kw);
  });

  // --- Handlers ---
  async function handleSaveJenis() {
    setSaving(true);
    try {
      await fetch("/api/jenis-iuran", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(jenisForm) });
      setOpenJenis(false); setJenisForm({ namaIuran: "", nominal: "" });
      const r = await fetch("/api/jenis-iuran"); if (r.ok) setJenisList(await r.json());
    } catch {} finally { setSaving(false); }
  }

  async function handleSavePeriode() {
    setSaving(true);
    try {
      const payload = { ...periodeForm, nominal: Number(periodeForm.nominal) };
      await fetch("/api/periode-iuran", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setOpenPeriode(false);
      const r = await fetch("/api/periode-iuran"); if (r.ok) { const list = await r.json(); setPeriodeList(list); if (list.length > 0) setSelectedPeriode(list[list.length - 1]); }
    } catch {} finally { setSaving(false); }
  }

  async function handleAddCicilan() {
    if (!selectedBayar) return;
    const nominal = Number(bayarForm.nominalBayar);
    if (nominal <= 0) return;
    setSaving(true);
    try {
      let buktiUrl = "";
      if (buktiFile) {
        const fd = new FormData(); fd.append("file", buktiFile);
        const ur = await fetch("/api/upload", { method: "POST", body: fd });
        if (ur.ok) { const uj = await ur.json(); buktiUrl = uj.url; }
      }
      await fetch(`/api/pembayaran-iuran/${selectedBayar.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bayarForm, nominal, buktiPembayaran: buktiUrl || undefined }),
      });
      setBayarForm({ nominalBayar: "", tanggalBayar: new Date().toISOString().split("T")[0], metodePembayaran: "tunai", catatan: "" });
      setBuktiFile(null);
      fetchCicilan(selectedBayar.id);
      if (selectedPeriode) fetchPembayaran(selectedPeriode.id);
      const r = await fetch("/api/periode-iuran"); if (r.ok) setPeriodeList(await r.json());
    } catch {} finally { setSaving(false); }
  }

  async function handleSaveInfak() {
    setSaving(true);
    try {
      let buktiUrl = "";
      if (buktiFile) {
        const fd = new FormData(); fd.append("file", buktiFile);
        const ur = await fetch("/api/upload", { method: "POST", body: fd });
        if (ur.ok) { const uj = await ur.json(); buktiUrl = uj.url; }
      }
      await fetch("/api/infak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...infakForm, nominal: Number(infakForm.nominal), bukti: buktiUrl || undefined }),
      });
      setOpenInfakForm(false);
      setInfakForm({ anggotaId: "", kategoriInfak: "", nominal: "", tanggal: new Date().toISOString().split("T")[0], tujuan: "", keterangan: "" });
      setBuktiFile(null);
      const r = await fetch("/api/infak"); if (r.ok) setInfakList(await r.json());
    } catch {} finally { setSaving(false); }
  }

  // ====== SKELETON ======
  if (loading && periodeList.length === 0 && infakList.length === 0) {
    return (
      <>
        <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="rounded-2xl border-white/10 bg-zinc-900/60">
              <CardContent className="p-4"><div className="flex items-center gap-4"><Skeleton className="h-10 w-10 rounded-2xl bg-white/5" /><div className="space-y-2"><Skeleton className="h-3 w-20 bg-white/5" /><Skeleton className="h-5 w-16 bg-white/5" /></div></div></CardContent>
            </Card>
          ))}
        </section>
        <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
          <CardContent className="p-4"><div className="space-y-3">{[...Array(4)].map((_, i) => (<Skeleton key={i} className="h-12 w-full rounded-xl bg-white/5" />))}</div></CardContent>
        </Card>
      </>
    );
  }

  // ====== RENDER ======
  return (
    <>
      {/* TABS */}
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/40 p-1 w-fit">
        {(["iuran", "infak"] as const).map((t) => (
          <button key={t} onClick={() => { setTab(t); setSearch(""); }}
            className={`px-4 py-1.5 text-xs font-medium rounded-xl transition-all ${tab === t ? "bg-white/10 text-zinc-100 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>
            {t === "iuran" ? "Iuran Anggota" : "Infak"}
          </button>
        ))}
      </div>

      {/* ============ IURAN TAB ============ */}
      {tab === "iuran" && (
        <>
          <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Card className="rounded-2xl border-white/10 bg-zinc-900/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"><IconWallet className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">Total Target</p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{p ? fmt(totalTagihan) : "-"}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{p ? `${pembayaranList.length} anggota wajib bayar` : "Pilih periode"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"><IconCheck className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">Sudah Bayar</p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{p ? sudahBayar.length : "-"}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{p ? `${fmt(totalMasuk)} terkumpul` : ""}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-300"><IconX className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">Belum Bayar</p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{p ? belumBayarCount : "-"}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{p ? `${dicicil.length} dicicil, ${Math.round((sudahBayar.length / pembayaranList.length) * 100)}% lunas` : ""}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300"><IconCalendar className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">Total Periode</p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{periodeList.length}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">periode iuran tersedia</p>
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
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0" placeholder="Cari anggota..." />
                  </div>
                  <select
                    value={selectedPeriode?.id || ""}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedPeriode(periodeList.find((p) => p.id === id) || null);
                    }}
                    className="h-9 rounded-xl border border-white/10 bg-zinc-950/50 px-3 text-xs text-zinc-300 outline-none">
                    <option value="">Pilih Periode</option>
                    {periodeList.map((p) => (
                      <option key={p.id} value={p.id}>{p.jenisIuran?.namaIuran || "Iuran"} — {bulanList[p.bulan - 1]} {p.tahun}</option>
                    ))}
                  </select>
                  <Button onClick={() => { setOpenPeriode(true); fetchAnggota(); }}
                    className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                    <IconPlus className="mr-1.5 h-3.5 w-3.5" /> Periode Baru
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {!selectedPeriode ? (
                <div className="py-16 text-center">
                  <IconCalendar className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
                  <p className="text-xs text-zinc-500">Pilih periode iuran untuk melihat detail pembayaran anggota</p>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-zinc-950/40 p-4">
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{selectedPeriode.jenisIuran?.namaIuran} — {bulanList[selectedPeriode.bulan - 1]} {selectedPeriode.tahun}</p>
                      <p className="text-xs text-zinc-500">Nominal: {fmt(selectedPeriode.nominal)} | Total tagihan: {fmt(totalTagihan)} | Terkumpul: {fmt(totalMasuk)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <ProgressBar value={sudahBayar.length} max={pembayaranList.length} />
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-zinc-400">Anggota</TableHead>
                          <TableHead className="text-zinc-400">Nominal</TableHead>
                          <TableHead className="text-zinc-400">Status</TableHead>
                          <TableHead className="text-zinc-400">Tanggal Bayar</TableHead>
                          <TableHead className="text-zinc-400">Metode</TableHead>
                          <TableHead className="text-right text-zinc-400">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loadingPembayaran ? (
                          <TableRow><TableCell colSpan={6} className="py-8 text-center text-xs text-zinc-500">Memuat data...</TableCell></TableRow>
                        ) : filteredPembayaran.length === 0 ? (
                          <TableRow><TableCell colSpan={6} className="py-8 text-center text-xs text-zinc-500">Tidak ada data</TableCell></TableRow>
                        ) : filteredPembayaran.map((x) => (
                          <TableRow key={x.id} className="border-white/10 hover:bg-white/5">
                            <TableCell className="py-3 text-xs font-medium text-zinc-200">{x.anggota?.namaLengkap || `#${x.anggotaId}`}</TableCell>
                            <TableCell className="py-3 text-xs text-zinc-300">{fmt(x.nominalTagihan)}</TableCell>
                            <TableCell className="py-3">{statusBadge(x.status)}</TableCell>
                            <TableCell className="py-3 text-xs text-zinc-300">{formatDate(x.tanggalBayar)}</TableCell>
                            <TableCell className="py-3 text-xs text-zinc-400">{x.metodePembayaran || "-"}</TableCell>
                            <TableCell className="py-3 text-right">
                              {x.status === "sudah_bayar" ? (
                                <Button size="sm" variant="ghost" onClick={() => { setSelectedBayar(x); setCicilanList([]); fetchCicilan(x.id); setOpenBayar(true); setBayarForm({ ...bayarForm, nominalBayar: String(x.nominalTagihan) }); }}
                                  className="h-7 rounded-lg px-2 text-[10px] text-zinc-400 hover:bg-white/5">
                                  <IconCash className="mr-1 h-3 w-3" /> Riwayat
                                </Button>
                              ) : (
                                <Button size="sm" variant="ghost" onClick={() => { setSelectedBayar(x); setCicilanList([]); fetchCicilan(x.id); setOpenBayar(true); setBayarForm({ ...bayarForm, nominalBayar: String(x.nominalTagihan) }); }}
                                  className="h-7 rounded-lg px-2 text-[10px] text-emerald-400 hover:bg-emerald-500/10">
                                  <IconCash className="mr-1 h-3 w-3" /> Bayar
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* ============ INFAK TAB ============ */}
      {tab === "infak" && (
        <>
          <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300"><IconCash className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">Total Infak Masuk</p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{fmt(infakTotal)}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10 text-sky-300"><IconCreditCard className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">Jumlah Transaksi</p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{infakList.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300"><IconCalendar className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-medium text-zinc-400">Bulan Ini</p>
                  <p className="mt-1 truncate text-xl font-semibold tracking-tight text-zinc-50">{fmt(infakBulanIni)}</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Card className="rounded-2xl border-white/10 bg-zinc-900/60">
            <CardHeader className="p-4 pb-3">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="grid flex-1 gap-3 xl:grid-cols-[1.4fr_auto]">
                  <div className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3 focus-within:border-emerald-500/40">
                    <IconSearch className="h-4 w-4 shrink-0 text-zinc-500" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 border-0 bg-transparent px-0 text-xs text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0" placeholder="Cari donatur, kategori..." />
                  </div>
                  <Button onClick={() => { setOpenInfakForm(true); fetchAnggota(); }}
                    className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25">
                    <IconPlus className="mr-1.5 h-3.5 w-3.5" /> Catat Infak
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/40">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-zinc-400">Donatur</TableHead>
                      <TableHead className="text-zinc-400">Kategori</TableHead>
                      <TableHead className="text-zinc-400">Nominal</TableHead>
                      <TableHead className="text-zinc-400">Tanggal</TableHead>
                      <TableHead className="text-zinc-400">Tujuan</TableHead>
                      <TableHead className="text-zinc-400">Keterangan</TableHead>
                      <TableHead className="text-right text-zinc-400">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingInfak ? (
                      <TableRow><TableCell colSpan={7} className="py-8 text-center text-xs text-zinc-500">Memuat data...</TableCell></TableRow>
                    ) : filteredInfak.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="py-8 text-center text-xs text-zinc-500">Belum ada infak</TableCell></TableRow>
                    ) : filteredInfak.map((i) => (
                      <TableRow key={i.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="py-3 text-xs font-medium text-zinc-200">{i.anggota?.namaLengkap || "-"}</TableCell>
                        <TableCell className="py-3"><Badge variant="outline" className="rounded-lg border-emerald-500/30 bg-emerald-500/10 px-2 py-0 text-[10px] text-emerald-300">{i.kategoriInfak || "Infak"}</Badge></TableCell>
                        <TableCell className="py-3 text-xs font-semibold text-zinc-100">{fmt(i.nominal)}</TableCell>
                        <TableCell className="py-3 text-xs text-zinc-300">{formatDate(i.tanggal)}</TableCell>
                        <TableCell className="py-3 text-xs text-zinc-300 max-w-[140px] truncate">{i.tujuan || "-"}</TableCell>
                        <TableCell className="py-3 text-xs text-zinc-500 max-w-[120px] truncate">{i.keterangan || "-"}</TableCell>
                        <TableCell className="py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg text-zinc-400 hover:bg-white/5"><IconDots className="h-3.5 w-3.5" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="right">
                              <DropdownMenuItem onClick={async () => { await fetch(`/api/infak/${i.id}`, { method: "DELETE" }); const r = await fetch("/api/infak"); if (r.ok) setInfakList(await r.json()); }}>
                                <IconTrash className="mr-2 h-3.5 w-3.5" /> Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* ===== DIALOG: Tambah Jenis Iuran ===== */}
      <Dialog open={openJenis} onOpenChange={setOpenJenis}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader><DialogTitle>Tambah Jenis Iuran</DialogTitle><DialogDescription>Buat jenis pembayaran iuran baru.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Nama Iuran</Label>
              <Input className="col-span-3 h-9" value={jenisForm.namaIuran} onChange={(e) => setJenisForm({ ...jenisForm, namaIuran: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Nominal (Rp)</Label>
              <Input type="number" className="col-span-3 h-9" value={jenisForm.nominal} onChange={(e) => setJenisForm({ ...jenisForm, nominal: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenJenis(false)}>Batal</Button>
            <Button onClick={handleSaveJenis} disabled={saving}>{saving ? "..." : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: Periode Baru ===== */}
      <Dialog open={openPeriode} onOpenChange={setOpenPeriode}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Buat Periode Iuran Baru</DialogTitle><DialogDescription>Sistem akan otomatis membuat tagihan untuk semua anggota aktif.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Jenis Iuran</Label>
              <div className="col-span-3 flex gap-2">
                <select className="flex-1 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
                  value={periodeForm.jenisIuranId} onChange={(e) => {
                    const j = jenisList.find((j) => j.id === Number(e.target.value));
                    setPeriodeForm({ ...periodeForm, jenisIuranId: e.target.value, nominal: j ? String(j.nominal) : "" });
                  }}>
                  <option value="">Pilih Jenis</option>
                  {jenisList.map((j) => (<option key={j.id} value={j.id}>{j.namaIuran} ({fmt(j.nominal)})</option>))}
                </select>
                <button type="button" onClick={() => { setOpenPeriode(false); setTimeout(() => setOpenJenis(true), 100); }}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-400/15 text-emerald-100 hover:bg-emerald-400/25 transition-all">
                  <IconPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Bulan</Label>
              <select className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none"
                value={periodeForm.bulan} onChange={(e) => setPeriodeForm({ ...periodeForm, bulan: e.target.value })}>
                {bulanList.map((b, i) => (<option key={i} value={i + 1}>{b}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Tahun</Label>
              <Input type="number" className="col-span-3 h-9" value={periodeForm.tahun} onChange={(e) => setPeriodeForm({ ...periodeForm, tahun: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Nominal (Rp)</Label>
              <Input type="number" className="col-span-3 h-9" value={periodeForm.nominal} onChange={(e) => setPeriodeForm({ ...periodeForm, nominal: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenPeriode(false)}>Batal</Button>
            <Button onClick={handleSavePeriode} disabled={saving}>{saving ? "Menyimpan..." : "Buat Periode"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: Bayar Iuran ===== */}
      <Dialog open={openBayar} onOpenChange={(v) => { if (!v) { setCicilanList([]); setBuktiFile(null); } setOpenBayar(v); }}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader><DialogTitle>Pembayaran Iuran</DialogTitle>
            <DialogDescription>An. <strong>{selectedBayar?.anggota?.namaLengkap}</strong></DialogDescription>
          </DialogHeader>
          {selectedBayar && (
            <>
              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-zinc-950/60 p-3 text-xs">
                <div className="flex-1 text-center">
                  <p className="text-zinc-500">Tagihan</p>
                  <p className="mt-0.5 font-semibold text-zinc-100">{fmt(selectedBayar.nominalTagihan)}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex-1 text-center">
                  <p className="text-zinc-500">Terbayar</p>
                  <p className="mt-0.5 font-semibold text-emerald-300">{fmt(selectedBayar.nominalBayar || 0)}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex-1 text-center">
                  <p className="text-zinc-500">Sisa</p>
                  <p className="mt-0.5 font-semibold text-amber-300">{fmt(Math.max(0, selectedBayar.nominalTagihan - (selectedBayar.nominalBayar || 0)))}</p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div className="flex-1 text-center">
                  <p className="text-zinc-500">Status</p>
                  <p className="mt-0.5">{statusBadge(selectedBayar.status)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-medium text-zinc-400">Riwayat Cicilan</p>
                <div className="rounded-xl border border-white/10 bg-zinc-950/40">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-zinc-500">#</TableHead>
                        <TableHead className="text-zinc-500">Tanggal</TableHead>
                        <TableHead className="text-zinc-500">Nominal</TableHead>
                        <TableHead className="text-zinc-500">Metode</TableHead>
                        <TableHead className="text-zinc-500">Catatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingCicilan ? (
                        <TableRow><TableCell colSpan={5} className="py-4 text-center text-xs text-zinc-500">Memuat...</TableCell></TableRow>
                      ) : cicilanList.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="py-4 text-center text-xs text-zinc-500">Belum ada cicilan</TableCell></TableRow>
                      ) : cicilanList.map((c, i) => (
                        <TableRow key={c.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="py-2 text-xs text-zinc-500">{i + 1}</TableCell>
                          <TableCell className="py-2 text-xs text-zinc-300">{formatDate(c.tanggalBayar)}</TableCell>
                          <TableCell className="py-2 text-xs font-medium text-zinc-100">{fmt(c.nominal)}</TableCell>
                          <TableCell className="py-2 text-xs text-zinc-400">{c.metodePembayaran || "-"}</TableCell>
                          <TableCell className="py-2 text-xs text-zinc-500 max-w-[100px] truncate">{c.catatan || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="space-y-3">
                <p className="text-[11px] font-medium text-zinc-400">Tambah Cicilan</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-zinc-500">Nominal</Label>
                    <Input type="number" className="h-9" value={bayarForm.nominalBayar} onChange={(e) => setBayarForm({ ...bayarForm, nominalBayar: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-zinc-500">Tanggal</Label>
                    <Input type="date" className="h-9" value={bayarForm.tanggalBayar} onChange={(e) => setBayarForm({ ...bayarForm, tanggalBayar: e.target.value })} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-zinc-500">Metode</Label>
                    <select className="h-9 w-full rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none" value={bayarForm.metodePembayaran} onChange={(e) => setBayarForm({ ...bayarForm, metodePembayaran: e.target.value })}>
                      <option value="tunai">Tunai</option>
                      <option value="transfer">Transfer</option>
                      <option value="qris">QRIS</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-zinc-500">Bukti</Label>
                    <label className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-400 hover:border-white/20">
                      <IconCash className="h-4 w-4 shrink-0" />{buktiFile ? buktiFile.name : "Upload..."}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => setBuktiFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-zinc-500">Catatan</Label>
                  <Input className="h-9" value={bayarForm.catatan} onChange={(e) => setBayarForm({ ...bayarForm, catatan: e.target.value })} />
                </div>
              </div>
            </>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpenBayar(false); setCicilanList([]); setBuktiFile(null); }}>Tutup</Button>
            <Button onClick={handleAddCicilan} disabled={saving}>{saving ? "Menyimpan..." : "Tambah Cicilan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: Infak ===== */}
      <Dialog open={openInfakForm} onOpenChange={setOpenInfakForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Catat Infak</DialogTitle><DialogDescription>Pencatatan donasi/infak sukarela.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Donatur</Label>
              <select className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none" value={infakForm.anggotaId} onChange={(e) => setInfakForm({ ...infakForm, anggotaId: e.target.value })}>
                <option value="">Pilih Anggota</option>
                {anggotaList.map((a) => (<option key={a.id} value={a.id}>{a.namaLengkap}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Kategori</Label>
              <select className="col-span-3 h-9 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none" value={infakForm.kategoriInfak} onChange={(e) => setInfakForm({ ...infakForm, kategoriInfak: e.target.value })}>
                <option value="">Pilih</option>
                <option value="Umum">Umum</option>
                <option value="Kegiatan">Kegiatan</option>
                <option value="Sosial">Sosial</option>
                <option value="Santunan">Santunan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Nominal (Rp)</Label>
              <Input type="number" className="col-span-3 h-9" value={infakForm.nominal} onChange={(e) => setInfakForm({ ...infakForm, nominal: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Tanggal</Label>
              <Input type="date" className="col-span-3 h-9" value={infakForm.tanggal} onChange={(e) => setInfakForm({ ...infakForm, tanggal: e.target.value })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Tujuan</Label>
              <Input className="col-span-3 h-9" value={infakForm.tujuan} onChange={(e) => setInfakForm({ ...infakForm, tujuan: e.target.value })} placeholder="Contoh: Santunan Anak Yatim" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Bukti</Label>
              <div className="col-span-3">
                <label className="flex h-9 w-full cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-400 hover:border-white/20">
                  <IconCash className="h-4 w-4" />{buktiFile ? buktiFile.name : "Upload bukti..."}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setBuktiFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Keterangan</Label>
              <Input className="col-span-3 h-9" value={infakForm.keterangan} onChange={(e) => setInfakForm({ ...infakForm, keterangan: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpenInfakForm(false); setBuktiFile(null); }}>Batal</Button>
            <Button onClick={handleSaveInfak} disabled={saving}>{saving ? "Menyimpan..." : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-medium text-zinc-300">{value}/{max}</span>
    </div>
  );
}
