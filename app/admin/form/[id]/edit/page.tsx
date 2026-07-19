"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api";
import {
  IconArrowLeft, IconPlus, IconTrash, IconEye, IconShare, IconDownload,
  IconGripVertical, IconCheck, IconX, IconChevronDown, IconPhoto,
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

interface Jawaban {
  id: number;
  pertanyaanId: number;
  jawaban: string | null;
  pertanyaan: { id: number; tipe: string; pertanyaan: string };
}

interface ResponseData {
  id: number;
  respondenNama: string | null;
  respondenEmail: string | null;
  createdAt: string;
  jawaban: Jawaban[];
}

interface FormDetail {
  judul: string;
  jumlahResponse: number;
  pertanyaan: Pertanyaan[];
}

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

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export default function EditFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"pertanyaan" | "jawaban" | "setelan">("pertanyaan");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  // const [warnaAksen, setWarnaAksen] = useState("#10b981");
  const [headerGambar, setHeaderGambar] = useState("");
  const [headerFile, setHeaderFile] = useState<File | null>(null);
  const [limitSatuResponse, setLimitSatuResponse] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const [status, setStatus] = useState("aktif");
  const [pertanyaanList, setPertanyaanList] = useState<Pertanyaan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  // Response states
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [responseSearch, setResponseSearch] = useState("");
  const [selectedResponse, setSelectedResponse] = useState<ResponseData | null>(null);
  const [responseTab, setResponseTab] = useState<"table" | "chart">("table");

  const loadData = useCallback(async () => {
    try {
      const [form, resList] = await Promise.all([
        api.get<any>(`/form/${id}`),
        api.get<ResponseData[]>(`/form/${id}/response`),
      ]);
      setJudul(form.judul);
      setDeskripsi(form.deskripsi || "");
      // setWarnaAksen(form.warnaAksen || "#10b981");
      setHeaderGambar(form.headerGambar || "");
      setLimitSatuResponse(form.limitSatuResponse || false);
      setAllowEdit(form.allowEdit || false);
      setStatus(form.status || "aktif");
      setPertanyaanList(form.pertanyaan.map((p: any) => ({
        ...p,
        validasi: p.validasi || "",
        fileMaxSize: p.fileMaxSize || 2048,
        fileFormat: p.fileFormat || "pdf,doc,image",
        scaleMin: p.scaleMin ?? 1,
        scaleMax: p.scaleMax ?? 5,
        scaleLabelMin: p.scaleLabelMin || "",
        scaleLabelMax: p.scaleLabelMax || "",
        opsi: p.opsi ? JSON.parse(p.opsi) : [],
      })));
      setResponses(resList);
    } catch {
      setError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addPertanyaan = () => {
    setPertanyaanList((prev) => [...prev, {
      tipe: "teks", pertanyaan: "", isWajib: true, urutan: prev.length, opsi: [], validasi: "",
      fileMaxSize: 2048, fileFormat: "pdf,doc,image", scaleMin: 1, scaleMax: 5, scaleLabelMin: "", scaleLabelMax: ""
    }]);
    setActiveCardIndex(pertanyaanList.length);
  };

  const removePertanyaan = async (index: number) => {
    const p = pertanyaanList[index];
    if (p.id) {
      try { await api.delete(`/form/${id}/pertanyaan/${p.id}`); } catch {}
    }
    setPertanyaanList((prev) => prev.filter((_, i) => i !== index).map((x, i) => ({ ...x, urutan: i })));
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
  const updateOpsi = (pi: number, oi: number, v: string) => setPertanyaanList((prev) => prev.map((p, i) => (i === pi ? { ...p, opsi: p.opsi.map((o, j) => (j === oi ? v : o)) } : p)));
  const removeOpsi = (pi: number, oi: number) => setPertanyaanList((prev) => prev.map((p, i) => (i === pi ? { ...p, opsi: p.opsi.filter((_, j) => j !== oi) } : p)));

  async function handleHeaderUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setHeaderFile(file);
    setHeaderGambar(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!judul.trim()) { setError("Judul wajib diisi"); return; }
    setSaving(true); setError(null);
    try {
      let headerUrl = headerGambar;
      if (headerFile) {
        const fd = new FormData();
        fd.append("file", headerFile);
        const up = await fetch("/api/upload", { method: "POST", body: fd });
        if (up.ok) headerUrl = (await up.json()).url;
      }
      await api.put(`/form/${id}`, {
        judul, deskripsi, headerGambar: headerUrl, limitSatuResponse, allowEdit, status,
      });
      for (const p of pertanyaanList) {
        const payload: Record<string, unknown> = {
          tipe: p.tipe, pertanyaan: p.pertanyaan, isWajib: p.isWajib, urutan: p.urutan
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
        if (p.id) await api.put(`/form/${id}/pertanyaan/${p.id}`, payload);
        else await api.post(`/form/${id}/pertanyaan`, payload);
      }
      router.push("/admin/form");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  const needsOpsi = (t: string) => ["radio", "checkbox", "dropdown"].includes(t);

  const getSummary = (pertanyaanId: number, tipe: string) => {
    const jawabanList = responses.flatMap((r) => r.jawaban.filter((j) => j.pertanyaanId === pertanyaanId && j.jawaban));
    if (["radio", "dropdown"].includes(tipe)) {
      const counts: Record<string, number> = {};
      jawabanList.forEach((j) => { counts[j.jawaban!] = (counts[j.jawaban!] || 0) + 1; });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }
    if (["scale", "rating"].includes(tipe)) {
      const counts: Record<string, number> = {};
      jawabanList.forEach((j) => { counts[j.jawaban!] = (counts[j.jawaban!] || 0) + 1; });
      return Object.entries(counts).sort((a, b) => Number(a[0]) - Number(b[0])).map(([name, value]) => ({ name, value }));
    }
    if (tipe === "checkbox") {
      const counts: Record<string, number> = {};
      jawabanList.forEach((j) => {
        j.jawaban!.split(",").map((v) => v.trim()).filter(Boolean).forEach((v) => {
          counts[v] = (counts[v] || 0) + 1;
        });
      });
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }
    return jawabanList.map((j) => j.jawaban!);
  };

  const filteredResponses = responses.filter((r) =>
    !responseSearch ||
    r.respondenNama?.toLowerCase().includes(responseSearch.toLowerCase()) ||
    r.respondenEmail?.toLowerCase().includes(responseSearch.toLowerCase())
  );

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
          <div className="flex items-center justify-center">
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
              onClick={() => setActiveTab("jawaban")}
              className={`px-4 py-1.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === "jawaban"
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Jawaban
              {responses.length > 0 && (
                <span className="h-4 px-1 rounded bg-zinc-850 text-[9px] font-bold text-zinc-300">
                  {responses.length}
                </span>
              )}
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
              className="h-8 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-4 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25"
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
            <div className="rounded-2xl border border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm relative group">
              {headerGambar ? (
                <div className="relative h-36 w-full overflow-hidden">
                  <img src={headerGambar} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <label className="h-8 rounded-xl bg-white/80 dark:bg-zinc-950/80 px-3 text-xs text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-medium cursor-pointer hover:bg-white dark:hover:bg-zinc-900 transition-colors">
                      Ganti Header
                      <input type="file" accept="image/*" className="hidden" onChange={handleHeaderUpload} />
                    </label>
                    <button onClick={() => setHeaderGambar("")} className="h-8 w-8 rounded-xl bg-rose-500/80 text-white flex items-center justify-center hover:bg-rose-500 transition-colors">
                      <IconTrash className="h-4 w-4" />
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
                        ? "border-l-4 border-l-emerald-500 border-white/10 dark:border-white/10 z-20"
                        : "border-white/5 z-10"
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
                                className="h-8 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950 px-2.5 text-[10px] text-zinc-850 dark:text-zinc-300 outline-none"
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

                              {/* Grid File Types - only when toggle is active */}
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
                                <span className="ml-auto text-zig-400 flex items-center gap-1 cursor-pointer hover:text-emerald-400 transition-colors">
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

        {/* -------------------- TAB 2: JAWABAN (RESPONSES) -------------------- */}
        {activeTab === "jawaban" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-white/5">
              <div className="text-xs text-zinc-500">Total {responses.length} response</div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => window.open(`/api/form/${id}/export`, "_blank")}
                  className="h-8 rounded-xl px-3 text-[10px] text-zinc-400 hover:text-zinc-200">
                  <IconDownload className="mr-1 h-3.5 w-3.5" /> Export CSV
                </Button>
                <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-950 p-0.5">
                  <button onClick={() => setResponseTab("table")} className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-colors ${responseTab === "table" ? "bg-emerald-500/15 text-emerald-300" : "text-zinc-500"}`}>Table</button>
                  <button onClick={() => setResponseTab("chart")} className={`px-2 py-1 text-[9px] font-bold rounded-lg transition-colors ${responseTab === "chart" ? "bg-emerald-500/15 text-emerald-300" : "text-zinc-500"}`}>Summary</button>
                </div>
              </div>
            </div>

            {responseTab === "table" ? (
              <div className="space-y-3">
                <div className="flex h-9 items-center gap-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900/60 px-3">
                  <input className="h-full w-full border-0 bg-transparent text-xs text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 outline-none" placeholder="Cari responden..." value={responseSearch} onChange={(e) => setResponseSearch(e.target.value)} />
                </div>

                {filteredResponses.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-white/5">Belum ada response</p>
                ) : (
                  filteredResponses.map((r) => (
                    <div key={r.id} className="rounded-xl border border-white/5 bg-white dark:bg-zinc-900 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/80 transition-colors cursor-pointer" onClick={() => setSelectedResponse(r)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{r.respondenNama || "Anonim"}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            {r.respondenEmail && <span>{r.respondenEmail} · </span>}
                            {new Date(r.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <IconEye className="h-4 w-4 text-zinc-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              /* Rekap charts */
              <div className="space-y-4">
                {responses.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-8 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-white/5">Belum ada data</p>
                ) : (
                  pertanyaanList.filter((p) => p.tipe !== "file").map((p) => {
                    if (!p.id) return null;
                    const data = getSummary(p.id, p.tipe);
                    return (
                      <div key={p.id} className="rounded-2xl border border-white/5 bg-white dark:bg-zinc-900 p-5 shadow-sm">
                        <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mb-4">{p.pertanyaan}</p>
                        {["radio", "dropdown"].includes(p.tipe) && Array.isArray(data) && data.length > 0 && (
                          <div className="flex items-center gap-6 flex-wrap">
                            <ResponsiveContainer width={200} height={160}>
                              <PieChart>
                                <Pie data={data as any} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55} label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}>
                                  {(data as any).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
                              {(data as any).map((d: any, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                  <span>{d.name}: {d.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {["scale", "rating"].includes(p.tipe) && Array.isArray(data) && data.length > 0 && (
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={data as any}>
                              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#71717a" }} />
                              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} />
                              <ChartTooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11, color: "#e4e4e7" }} />
                              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                        {p.tipe === "checkbox" && Array.isArray(data) && data.length > 0 && (
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={data as any} layout="vertical">
                              <XAxis type="number" tick={{ fontSize: 11, fill: "#71717a" }} />
                              <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 10, fill: "#71717a" }} />
                              <ChartTooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11, color: "#e4e4e7" }} />
                              <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                        {["teks", "textarea", "date", "time"].includes(p.tipe) && Array.isArray(data) && (
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {(data as string[]).map((j, i) => (
                              <p key={i} className="text-[11px] text-zinc-600 dark:text-zinc-400 border-b border-zinc-100 dark:border-white/5 pb-1 last:border-0">{j}</p>
                            ))}
                          </div>
                        )}
                        {Array.isArray(data) && data.length === 0 && <p className="text-[10px] text-zinc-500 italic">Belum ada jawaban</p>}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* -------------------- TAB 3: SETELAN (SETTINGS) -------------------- */}
        {activeTab === "setelan" && (
          <div className="space-y-6">
            <Card className="rounded-2xl border border-white/5 bg-white dark:bg-zinc-900 shadow-sm">
              <CardHeader><CardTitle className="text-sm font-semibold">Batasan Tanggapan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-zinc-50 dark:bg-zinc-950/30">
                  <div>
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Menerima Tanggapan</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Nyalakan/matikan pengisian formulir.</p>
                  </div>
                  <input type="checkbox" checked={status === "aktif"} onChange={(e) => setStatus(e.target.checked ? "aktif" : "ditutup")}
                    className="rounded border-white/10 bg-zinc-950 text-emerald-500 focus:ring-emerald-500/50" />
                </div>

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

      {/* Detail Response Dialog */}
      <Dialog open={selectedResponse !== null} onOpenChange={(o) => { if (!o) setSelectedResponse(null); }}>
        <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Detail Response</DialogTitle></DialogHeader>
          <div className="space-y-3.5 py-2">
            {selectedResponse?.jawaban.map((j) => (
              <div key={j.id} className="rounded-xl border border-white/5 bg-zinc-50 dark:bg-zinc-900/60 p-3.5">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">{j.pertanyaan.pertanyaan}</p>
                {j.pertanyaan.tipe === "file" && j.jawaban ? (
                  <div className="mt-1 rounded-xl overflow-hidden border border-white/10 bg-zinc-950 max-w-[200px]">
                    <img src={j.jawaban} alt="Upload" className="w-full h-auto object-cover" />
                    <a href={j.jawaban} target="_blank" rel="noopener noreferrer" className="block text-center text-[10px] text-emerald-400 hover:text-emerald-300 py-1.5 underline underline-offset-2">
                      Lihat file
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed">{j.jawaban || <span className="text-zinc-500 italic">Tidak diisi</span>}</p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setSelectedResponse(null)}>Tutup</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
