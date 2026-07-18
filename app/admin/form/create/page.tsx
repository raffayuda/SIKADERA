"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import {
  IconArrowLeft, IconPlus, IconTrash, IconGripVertical, IconChevronDown, IconPhoto,
  IconAlignLeft, IconAlignJustified, IconCircleDot, IconSquareCheck, IconSelector,
  IconUpload, IconStar, IconCalendar, IconClock,
} from "@tabler/icons-react";

interface Pertanyaan {
  id?: number;
  tipe: string;
  pertanyaan: string;
  isWajib: boolean;
  urutan: number;
  opsi: string[];
  validasi: string;
  fileMaxSize: number;
  fileFormat: string;
  scaleMin: number;
  scaleMax: number;
  scaleLabelMin: string;
  scaleLabelMax: string;
}

const emptyPertanyaan = (urutan: number): Pertanyaan => ({
  tipe: "teks",
  pertanyaan: "",
  isWajib: true,
  urutan,
  opsi: [],
  validasi: "",
  fileMaxSize: 2048,
  fileFormat: "pdf,doc,image",
  scaleMin: 1,
  scaleMax: 5,
  scaleLabelMin: "",
  scaleLabelMax: "",
});

const TIPE_LIST = [
  { value: "teks", label: "Jawaban singkat", icon: IconAlignLeft },
  { value: "textarea", label: "Paragraf", icon: IconAlignJustified },
  { value: "radio", label: "Pilihan ganda", icon: IconCircleDot },
  { value: "checkbox", label: "Kotak Centang", icon: IconSquareCheck },
  { value: "dropdown", label: "Drop-down", icon: IconChevronDown },
  { value: "file", label: "Upload file", icon: IconUpload },
  { value: "scale", label: "Skala linier", icon: IconSelector },
  { value: "rating", label: "Rating", icon: IconStar },
  { value: "date", label: "Tanggal", icon: IconCalendar },
  { value: "time", label: "Waktu", icon: IconClock },
];

export default function CreateFormPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pertanyaan" | "setelan">("pertanyaan");
  const [saving, setSaving] = useState(false);
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [warnaAksen, setWarnaAksen] = useState("#10b981");
  const [headerGambar, setHeaderGambar] = useState("");
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [limitSatuResponse, setLimitSatuResponse] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [pertanyaanList, setPertanyaanList] = useState<Pertanyaan[]>([emptyPertanyaan(0)]);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(0);

  const addPertanyaan = () => {
    setPertanyaanList((prev) => [...prev, emptyPertanyaan(prev.length)]);
    setActiveCardIndex(pertanyaanList.length);
  };

  const removePertanyaan = (index: number) => {
    setPertanyaanList((prev) => prev.filter((_, i) => i !== index).map((p, i) => ({ ...p, urutan: i })));
    if (activeCardIndex === index) setActiveCardIndex(null);
  };

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const newList = [...pertanyaanList];
    const [moved] = newList.splice(dragIndex, 1);
    newList.splice(index, 0, moved);
    setDragIndex(index);
    setPertanyaanList(newList.map((p, i) => ({ ...p, urutan: i })));
  };
  const handleDragEnd = () => setDragIndex(null);

  const updatePertanyaan = (index: number, data: Partial<Pertanyaan>) => {
    setPertanyaanList((prev) => prev.map((p, i) => (i === index ? { ...p, ...data } : p)));
  };

  const addOpsi = (index: number) => setPertanyaanList((prev) => prev.map((p, i) => (i === index ? { ...p, opsi: [...p.opsi, ""] } : p)));
  const updateOpsi = (pIndex: number, oIndex: number, value: string) => setPertanyaanList((prev) => prev.map((p, i) => (i === pIndex ? { ...p, opsi: p.opsi.map((o, j) => (j === oIndex ? value : o)) } : p)));
  const removeOpsi = (pIndex: number, oIndex: number) => setPertanyaanList((prev) => prev.map((p, i) => (i === pIndex ? { ...p, opsi: p.opsi.filter((_, j) => j !== oIndex) } : p)));

  async function handleHeaderUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeaderFile(file);
    setHeaderGambar(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!judul.trim()) { setError("Judul form wajib diisi"); return; }
    setSaving(true); setError(null);

    try {
      let headerUrl = headerGambar;
      if (headerFile) {
        const fd = new FormData();
        fd.append("file", headerFile);
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (upRes.ok) {
          const upData = await upRes.json();
          headerUrl = upData.url;
        }
      }

      const form = await api.post<{ id: number }>("/form", {
        judul, deskripsi, warnaAksen, headerGambar: headerUrl, limitSatuResponse, allowEdit,
      });

      for (const p of pertanyaanList) {
        const payload: Record<string, unknown> = {
          tipe: p.tipe,
          pertanyaan: p.pertanyaan,
          isWajib: p.isWajib,
          urutan: p.urutan,
        };
        if (["radio", "checkbox", "dropdown"].includes(p.tipe)) {
          payload.opsi = JSON.stringify(p.opsi.filter((o) => o.trim()));
        }
        if (p.validasi) payload.validasi = p.validasi;
        if (p.tipe === "file") {
          payload.fileMaxSize = p.fileMaxSize;
          payload.fileFormat = p.fileFormat;
        }
        if (["scale", "rating"].includes(p.tipe)) {
          payload.scaleMin = p.scaleMin;
          payload.scaleMax = p.scaleMax;
          payload.scaleLabelMin = p.scaleLabelMin;
          payload.scaleLabelMax = p.scaleLabelMax;
        }
        await api.post(`/form/${form.id}/pertanyaan`, payload);
      }

      router.push("/admin/form");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  const needsOpsi = (tipe: string) => ["radio", "checkbox", "dropdown"].includes(tipe);

  return (
    <div className="w-full min-h-screen bg-zinc-100 dark:bg-zinc-950 pb-16">
      {/* Top Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-white/5 sticky top-0 z-30 px-6 sm:px-10 lg:px-16 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="h-8 rounded-xl px-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
              <Link href="/admin/form">
                <IconArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-4 bg-white/10" />
            <h1 className="text-sm font-semibold text-zinc-100 truncate max-w-[200px]">{judul || "Form Tanpa Judul"}</h1>
          </div>

          {/* Tabs Menu */}
          <div className="flex items-center justify-center border-b border-white/5 sm:border-b-0">
            <button
              onClick={() => setActiveTab("pertanyaan")}
              className={`px-4 py-1.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === "pertanyaan"
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Pertanyaan
            </button>
            <button
              onClick={() => setActiveTab("setelan")}
              className={`px-4 py-1.5 text-xs font-semibold border-b-2 transition-all ${
                activeTab === "setelan"
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Setelan
            </button>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" asChild className="h-8 rounded-xl border-white/10 bg-white/5 px-4 text-xs text-zinc-300 hover:bg-white/10">
              <Link href="/admin/form">Batal</Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="h-8 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-5 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        {error && <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">{error}</div>}

        {/* -------------------- TAB 1: PERTANYAAN (BUILDER) -------------------- */}
        {activeTab === "pertanyaan" && (
          <div className="space-y-4 relative">
            {/* Header / Banner Card */}
            <div className="rounded-2xl border border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm relative group" style={{ borderTop: `6px solid ${warnaAksen}` }}>
              {headerGambar ? (
                <div className="relative h-36 w-full overflow-hidden">
                  <img src={headerGambar} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="h-8 rounded-xl bg-white/80 dark:bg-zinc-950/80 px-3 text-xs text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-medium cursor-pointer hover:bg-white dark:hover:bg-zinc-900 transition-colors">
                      Ganti Header
                      <input type="file" accept="image/*" className="hidden" onChange={handleHeaderUpload} />
                    </label>
                    <button onClick={() => setHeaderGambar("")} className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors">
                      <IconTrash className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="flex h-16 cursor-pointer items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-950/20 border-b border-dashed border-white/10 text-xs text-zinc-500 hover:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-950/30 transition-colors">
                  <IconPhoto className="h-4 w-4" />
                  Tambah Header Gambar
                  <input type="file" accept="image/*" className="hidden" onChange={handleHeaderUpload} />
                </label>
              )}
              <div className="p-6 space-y-4">
                <input
                  className="w-full border-0 border-b border-transparent bg-transparent pb-1 text-2xl font-bold text-zinc-900 dark:text-white outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors"
                  placeholder="Judul Formulir"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                />
                <textarea
                  className="w-full border-0 border-b border-transparent bg-transparent pb-1 text-sm text-zinc-500 dark:text-zinc-400 outline-none focus:border-zinc-200 dark:focus:border-zinc-800 transition-colors resize-none"
                  placeholder="Deskripsi formulir"
                  rows={2}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                />
              </div>
            </div>

            {/* List Pertanyaan */}
            <div className="space-y-4">
              {pertanyaanList.map((p, index) => {
                const isActive = activeCardIndex === index;
                const activeTipe = TIPE_LIST.find((t) => t.value === p.tipe) || TIPE_LIST[0];
                const TipeIcon = activeTipe.icon;

                return (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setActiveCardIndex(index)}
                    className={`rounded-2xl border bg-white dark:bg-zinc-900 p-5 shadow-sm transition-all relative overflow-visible ${
                      dragIndex === index ? "opacity-40" : ""
                    } ${
                      isActive
                        ? "border-l-4 border-l-emerald-500 border-white/10 dark:border-white/10"
                        : "border-white/5"
                    }`}
                  >
                    {/* Drag Handle */}
                    <div className="flex justify-center -mt-3 mb-2 cursor-grab active:cursor-grabbing" title="Geser pertanyaan">
                      <IconGripVertical className="h-4 w-4 rotate-90 text-zinc-500 dark:text-zinc-600" />
                    </div>

                    <div className="space-y-4">
                      {/* Tipe input & Hapus */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <input
                          className="flex-1 border-0 border-b border-transparent bg-transparent pb-1 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:border-zinc-200 dark:focus:border-zinc-800 transition-colors"
                          placeholder="Pertanyaan"
                          value={p.pertanyaan}
                          onChange={(e) => updatePertanyaan(index, { pertanyaan: e.target.value })}
                        />

                        {isActive && (
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Dropdown Tipe Kustom */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 rounded-xl border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950 text-xs gap-2 text-zinc-800 dark:text-zinc-200 font-medium">
                                  <TipeIcon className="h-4 w-4 text-zinc-500 shrink-0" />
                                  {activeTipe.label}
                                  <IconChevronDown className="h-3 w-3 text-zinc-500 shrink-0" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="right" className="w-56 max-h-[300px] overflow-y-auto rounded-xl">
                                {TIPE_LIST.map((t) => {
                                  const Icon = t.icon;
                                  return (
                                    <DropdownMenuItem key={t.value} onClick={() => updatePertanyaan(index, { tipe: t.value })} className="gap-2.5 text-xs">
                                      <Icon className="h-4 w-4 text-zinc-500 shrink-0" />
                                      {t.label}
                                    </DropdownMenuItem>
                                  );
                                })}
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <button
                              onClick={(e) => { e.stopPropagation(); removePertanyaan(index); }}
                              className="h-9 w-9 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors border border-white/5"
                              title="Hapus"
                            >
                              <IconTrash className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Tampilan input berdasarkan jenis */}
                      {!isActive ? (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-zinc-500 dark:text-zinc-600 italic">
                            Tipe: {activeTipe.label} {p.isWajib && "· Wajib diisi"}
                          </span>
                          {p.tipe === "date" && (
                            <span className="flex items-center gap-1 text-[10px] text-zinc-400 ml-2">
                              <IconCalendar className="h-3.5 w-3.5" />
                              Bulan, Hari, Tahun
                            </span>
                          )}
                          {p.tipe === "time" && (
                            <span className="flex items-center gap-1 text-[10px] text-zinc-400 ml-2">
                              <IconClock className="h-3.5 w-3.5" />
                              Waktu
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4 pt-2">
                          {/* Opsi untuk radio/checkbox/dropdown */}
                          {needsOpsi(p.tipe) && (
                            <div className="space-y-2 pl-2 border-l-2 border-emerald-500/30">
                              {p.opsi.map((o, oi) => (
                                <div key={oi} className="flex items-center gap-2">
                                  <span className="text-[10px] text-zinc-500 w-4">{oi + 1}.</span>
                                  <Input
                                    className="h-8 flex-1 text-xs"
                                    placeholder={`Opsi ${oi + 1}`}
                                    value={o}
                                    onChange={(e) => updateOpsi(index, oi, e.target.value)}
                                  />
                                  <button onClick={() => removeOpsi(index, oi)} className="h-6 w-6 rounded-lg text-zinc-500 hover:text-rose-400 flex items-center justify-center">
                                    <IconTrash className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button onClick={() => addOpsi(index)} className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold mt-1">
                                + Tambah opsi
                              </button>
                            </div>
                          )}

                          {/* Validasi teks */}
                          {p.tipe === "teks" && (
                            <div className="space-y-1">
                              <Label className="text-[10px] text-zinc-500">Validasi Jawaban</Label>
                              <select
                                className="h-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 px-2.5 text-[10px] text-zinc-855 dark:text-zinc-300 outline-none"
                                value={p.validasi}
                                onChange={(e) => updatePertanyaan(index, { validasi: e.target.value })}
                              >
                                <option value="">Tidak ada validasi</option>
                                <option value='{"type":"angka"}'>Angka</option>
                                <option value='{"type":"email"}'>Email</option>
                                <option value='{"type":"minLength","value":5}'>Min. 5 karakter</option>
                                <option value='{"type":"minLength","value":10}'>Min. 10 karakter</option>
                                <option value='{"type":"maxLength","value":100}'>Maks. 100 karakter</option>
                                <option value='{"type":"maxLength","value":500}'>Maks. 500 karakter</option>
                              </select>
                            </div>
                          )}

                          {/* File settings - Google Forms Style */}
                          {p.tipe === "file" && (
                            <div className="space-y-4">
                              {/* Toggle: Izinkan hanya jenis file tertentu */}
                              <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/30">
                                <div>
                                  <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Izinkan hanya jenis file tertentu</p>
                                </div>
                                <input type="checkbox" checked={!!p.fileFormat}
                                  onChange={(e) => updatePertanyaan(index, { fileFormat: e.target.checked ? "pdf,image,document" : "" })}
                                  className="rounded border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 text-emerald-500 focus:ring-emerald-500/50" />
                              </div>

                              {/* Grid File Types */}
                              {p.fileFormat && (
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    { id: "document", label: "Dokumen" },
                                    { id: "presentation", label: "Presentasi" },
                                    { id: "spreadsheet", label: "Spreadsheet" },
                                    { id: "pdf", label: "PDF" },
                                    { id: "image", label: "Gambar" },
                                    { id: "video", label: "Video" },
                                    { id: "audio", label: "Audio" },
                                  ].map((ft) => {
                                    const selected = p.fileFormat?.split(",").includes(ft.id);
                                    return (
                                      <label key={ft.id} className="flex items-center gap-1.5 p-2 rounded-lg border border-zinc-100 dark:border-white/5 cursor-pointer text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950/40">
                                        <input type="checkbox" checked={selected}
                                          onChange={() => {
                                            const current = p.fileFormat?.split(",").filter(Boolean) || [];
                                            const next = selected ? current.filter((f) => f !== ft.id) : [...current, ft.id];
                                            updatePertanyaan(index, { fileFormat: next.join(",") });
                                          }}
                                          className="rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500/50" />
                                        {ft.label}
                                      </label>
                                    );
                                  })}
                                </div>
                              )}

                              {/* Dropdown rows */}
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label className="text-[10px] text-zinc-500">Jumlah maksimum file</Label>
                                  <select className="h-8 w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 px-2 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                                    value={p.fileMaxSize > 10240 ? 10 : p.fileMaxSize > 1024 ? 5 : 1}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      const size = val === 1 ? 2048 : val === 5 ? 10240 : 102400;
                                      updatePertanyaan(index, { fileMaxSize: size });
                                    }}>
                                    <option value={1}>1 file</option>
                                    <option value={5}>5 file</option>
                                    <option value={10}>10 file</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[10px] text-zinc-500">Ukuran file maksimal</Label>
                                  <select className="h-8 w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 px-2 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                                    value={p.fileMaxSize <= 1024 ? 1024 : p.fileMaxSize <= 10240 ? 10240 : p.fileMaxSize <= 102400 ? 102400 : 1048576}
                                    onChange={(e) => updatePertanyaan(index, { fileMaxSize: Number(e.target.value) })}>
                                    <option value={1024}>1 MB</option>
                                    <option value={10240}>10 MB</option>
                                    <option value={102400}>100 MB</option>
                                    <option value={1048576}>1 GB</option>
                                  </select>
                                </div>
                              </div>

                              {/* Info bar */}
                              <div className="flex items-center gap-2 rounded-lg border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-950/20 px-3 py-2 text-[10px] text-zinc-500">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4 shrink-0">
                                  <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zM2 7l10 5 10-5M12 22V12" />
                                </svg>
                                <span>Formulir ini dapat menerima hingga {(p.fileMaxSize || 2048) >= 1024 ? `${(p.fileMaxSize || 2048) / 1024} MB` : `${p.fileMaxSize || 2048} KB`} file</span>
                                <span className="ml-auto flex items-center gap-1 cursor-pointer hover:text-emerald-400 transition-colors">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-3.5 w-3.5"><path d="M9 12h6M12 9v6"/><path d="M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z"/></svg>
                                  Lihat folder
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Scale settings (Mockup UI Google Forms) */}
                          {p.tipe === "scale" && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-xs text-zinc-650 dark:text-zinc-400">
                                <select className="h-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 px-2"
                                  value={p.scaleMin} onChange={(e) => updatePertanyaan(index, { scaleMin: Number(e.target.value) })}>
                                  <option value={0}>0</option>
                                  <option value={1}>1</option>
                                </select>
                                <span>sampai</span>
                                <select className="h-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 px-2"
                                  value={p.scaleMax} onChange={(e) => updatePertanyaan(index, { scaleMax: Number(e.target.value) })}>
                                  <option value={5}>5</option>
                                  <option value={10}>10</option>
                                </select>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label className="text-[10px] text-zinc-500">Label Min (opsional)</Label>
                                  <Input className="h-8 text-xs" placeholder="Misal: Buruk" value={p.scaleLabelMin} onChange={(e) => updatePertanyaan(index, { scaleLabelMin: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-[10px] text-zinc-500">Label Maks (opsional)</Label>
                                  <Input className="h-8 text-xs" placeholder="Misal: Sangat Baik" value={p.scaleLabelMax} onChange={(e) => updatePertanyaan(index, { scaleLabelMax: e.target.value })} />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Rating settings */}
                          {p.tipe === "rating" && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 text-xs text-zinc-650 dark:text-zinc-400">
                                <span>Skala Bintang:</span>
                                <select className="h-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 px-2"
                                  value={p.scaleMax} onChange={(e) => updatePertanyaan(index, { scaleMax: Number(e.target.value) })}>
                                  <option value={5}>5 Bintang</option>
                                  <option value={10}>10 Bintang</option>
                                </select>
                              </div>
                              <div className="flex items-center gap-1.5 py-1 text-zinc-600 dark:text-zinc-500">
                                {Array.from({ length: p.scaleMax || 5 }).map((_, i) => (
                                  <IconStar key={i} className="h-6 w-6 stroke-1.5" />
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Date/Time preview */}
                          {(p.tipe === "date" || p.tipe === "time") && (
                            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-zinc-950/30 px-3 py-2 text-xs text-zinc-500">
                              {p.tipe === "date" ? (
                                <><IconCalendar className="h-4 w-4 text-zinc-400" /> <span>Bulan, Hari, Tahun</span></>
                              ) : (
                                <><IconClock className="h-4 w-4 text-zinc-400" /> <span>Waktu</span></>
                              )}
                            </div>
                          )}

                          <Separator className="bg-zinc-200 dark:bg-white/5" />

                          <div className="flex items-center justify-end gap-3">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={p.isWajib}
                                onChange={(e) => updatePertanyaan(index, { isWajib: e.target.checked })}
                                className="rounded border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 text-emerald-500 focus:ring-emerald-500/50"
                              />
                              <span className="text-[10px] text-zinc-500 font-medium">Wajib diisi</span>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom toolbar */}
            <button
              onClick={addPertanyaan}
              className="w-full rounded-2xl border-2 border-dashed border-zinc-300 dark:border-white/10 py-4 text-xs font-semibold text-zinc-500 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2 bg-white dark:bg-zinc-900"
            >
              <IconPlus className="h-4 w-4" /> Tambah Pertanyaan
            </button>
          </div>
        )}

        {/* -------------------- TAB 2: SETELAN (SETTINGS) -------------------- */}
        {activeTab === "setelan" && (
          <div className="space-y-6">
            <Card className="rounded-2xl border border-white/5 bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader><CardTitle className="text-sm font-semibold">Tampilan & Akses</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-400">Warna Aksen</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={warnaAksen} onChange={(e) => setWarnaAksen(e.target.value)}
                      className="h-9 w-9 rounded-xl border border-white/10 bg-transparent cursor-pointer" />
                    <span className="text-[10px] text-zinc-500">{warnaAksen}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-white/5 bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader><CardTitle className="text-sm font-semibold">Batasan Tanggapan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-zinc-50 dark:bg-zinc-950/30">
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Batasi ke 1 Tanggapan</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Responden hanya bisa mengirim satu kali response.</p>
                  </div>
                  <input type="checkbox" checked={limitSatuResponse} onChange={(e) => setLimitSatuResponse(e.target.checked)}
                    className="rounded border-white/10 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/50" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-zinc-50 dark:bg-zinc-950/30">
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Izinkan Edit Response</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Membolehkan responden mengubah jawaban setelah submit.</p>
                  </div>
                  <input type="checkbox" checked={allowEdit} onChange={(e) => setAllowEdit(e.target.checked)}
                    className="rounded border-white/10 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
