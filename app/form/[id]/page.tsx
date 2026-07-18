"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconCircleCheck, IconAlertTriangle, IconUpload } from "@tabler/icons-react";

interface PertanyaanData {
  id: number; tipe: string; pertanyaan: string; isWajib: boolean; urutan: number;
  opsi: string | null; validasi: string | null;
  fileMaxSize: number | null; fileFormat: string | null;
  scaleMin: number | null; scaleMax: number | null;
  scaleLabelMin: string | null; scaleLabelMax: string | null;
}

interface FormData {
  judul: string; deskripsi: string | null;
  warnaAksen: string; headerGambar: string | null;
  limitSatuResponse: boolean; allowEdit: boolean;
  pertanyaan: PertanyaanData[];
}

function generateUniqueId(): string {
  return "resp_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
}

export default function IsiFormPage() {
  const { id } = useParams();
  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false); const [submitting, setSubmitting] = useState(false);
  const [respondenNama, setRespondenNama] = useState(""); const [respondenEmail, setRespondenEmail] = useState("");
  const [jawaban, setJawaban] = useState<Record<number, string | string[]>>({});
  const [files, setFiles] = useState<Record<number, File | null>>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uniqueId] = useState(generateUniqueId);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        // Check local storage for limit
        if (typeof window !== "undefined") {
          const submittedForms = JSON.parse(localStorage.getItem("submittedForms") || "[]");
          if (submittedForms.includes(id)) setAlreadySubmitted(true);
        }
        const res = await fetch(`/api/publik/form/${id}`);
        if (!res.ok) { const d = await res.json(); setError(d.error || "Form tidak tersedia"); return; }
        setForm(await res.json());
      } catch { setError("Gagal memuat form"); } finally { setLoading(false); }
    }
    load();
  }, [id]);

  const getJ = (pid: number) => jawaban[pid] as string || "";
  const getCb = (pid: number) => (jawaban[pid] as string[]) || [];
  const setJ = (pid: number, v: string | string[]) => setJawaban((prev) => ({ ...prev, [pid]: v }));
  const toggleCb = (pid: number, opsi: string) => {
    const cur = getCb(pid);
    setJ(pid, cur.includes(opsi) ? cur.filter((v) => v !== opsi) : [...cur, opsi]);
  };

  const handleSubmit = useCallback(async () => {
    setValidationError(null);
    if (!form) return;
    for (const p of form.pertanyaan) {
      if (p.isWajib) {
        const j = jawaban[p.id];
        if (p.tipe === "file" && !files[p.id]) { setValidationError(`"${p.pertanyaan}" wajib diisi`); return; }
        if (!j || (Array.isArray(j) && j.length === 0) || (!Array.isArray(j) && !j.trim())) {
          setValidationError(`"${p.pertanyaan}" wajib diisi`); return;
        }
      }
      // Client validation for teks
      if (p.tipe === "teks" && p.validasi) {
        try {
          const rule = JSON.parse(p.validasi);
          const val = getJ(p.id);
          if (!val) continue;
          if (rule.type === "angka" && isNaN(Number(val))) { setValidationError(`"${p.pertanyaan}" harus berupa angka`); return; }
          if (rule.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setValidationError(`"${p.pertanyaan}" harus email valid`); return; }
          if (rule.type === "minLength" && val.length < Number(rule.value)) { setValidationError(`"${p.pertanyaan}" minimal ${rule.value} karakter`); return; }
          if (rule.type === "maxLength" && val.length > Number(rule.value)) { setValidationError(`"${p.pertanyaan}" maksimal ${rule.value} karakter`); return; }
        } catch {}
      }
    }

    setSubmitting(true);
    try {
      // Upload files first
      const uploads: Record<number, string> = {};
      for (const [pid, file] of Object.entries(files)) {
        if (!file) continue;
        const fd = new FormData(); fd.append("file", file);
        const upRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (upRes.ok) { uploads[Number(pid)] = (await upRes.json()).url; }
      }

      const body: Record<string, unknown> = {
        respondenNama: respondenNama || null, respondenEmail: respondenEmail || null, uniqueId,
        jawaban: Object.entries(jawaban).map(([pid, value]) => ({
          pertanyaanId: Number(pid),
          jawaban: uploads[Number(pid)] || (Array.isArray(value) ? value.join(", ") : value),
        })),
      };

      // Add file-only answers
      for (const [pid] of Object.entries(files)) {
        if (!jawaban[Number(pid)] && uploads[Number(pid)]) {
          (body.jawaban as any[]).push({ pertanyaanId: Number(pid), jawaban: uploads[Number(pid)] });
        }
      }

      const res = await fetch(`/api/form/${id}/response`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (res.ok) {
        setSubmitted(true);
        if (typeof window !== "undefined") {
          const submittedForms: string[] = JSON.parse(localStorage.getItem("submittedForms") || "[]");
          submittedForms.push(id as string);
          localStorage.setItem("submittedForms", JSON.stringify(submittedForms));
        }
      } else { const d = await res.json(); setValidationError(d.error || "Gagal mengirim"); }
    } catch { setValidationError("Terjadi kesalahan"); } finally { setSubmitting(false); }
  }, [form, jawaban, files, respondenNama, respondenEmail, id, uniqueId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center p-4"><div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center p-4"><div className="text-center max-w-sm"><IconAlertTriangle className="mx-auto h-10 w-10 text-rose-400 mb-3" /><p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{error}</p></div></div>;
  if (alreadySubmitted) return <div className="min-h-screen flex items-center justify-center p-4"><div className="text-center max-w-sm"><IconAlertTriangle className="mx-auto h-10 w-10 text-amber-400 mb-3" /><p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Anda sudah mengirim response</p></div></div>;
  if (submitted) return <div className="min-h-screen flex items-center justify-center p-4"><div className="text-center max-w-sm"><IconCircleCheck className="mx-auto h-12 w-12 text-emerald-400 mb-4" /><h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Terima Kasih!</h1><p className="text-sm text-zinc-500 dark:text-zinc-400">Response Anda sudah tercatat.</p></div></div>;

  const aksen = form?.warnaAksen || "#10b981";

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header dengan theme */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/60 p-6 mb-6" style={{ borderTopColor: aksen, borderTopWidth: 3 }}>
          {form?.headerGambar && <img src={form.headerGambar} alt="" className="w-full h-32 object-cover rounded-xl mb-4" />}
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">{form?.judul}</h1>
          {form?.deskripsi && <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{form.deskripsi}</p>}
        </div>

        {/* Data Responden */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/60 p-6 mb-6 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Data Responden</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label className="text-xs text-zinc-500">Nama <span className="text-zinc-400">(opsional)</span></Label><Input className="h-10 text-xs" placeholder="Nama Anda" value={respondenNama} onChange={(e) => setRespondenNama(e.target.value)} /></div>
            <div className="space-y-1.5"><Label className="text-xs text-zinc-500">Email <span className="text-zinc-400">(opsional)</span></Label><Input className="h-10 text-xs" type="email" placeholder="email@contoh.com" value={respondenEmail} onChange={(e) => setRespondenEmail(e.target.value)} /></div>
          </div>
        </div>

        {/* Pertanyaan */}
        <div className="rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/60 p-6 mb-6 space-y-6">
          {form?.pertanyaan.map((p, index) => (
            <div key={p.id}>
              {index > 0 && <Separator className="mb-6 bg-zinc-200 dark:bg-white/10" />}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {p.pertanyaan}{p.isWajib && <span className="text-rose-400 ml-1">*</span>}
                </Label>

                {/* Teks Pendek */}
                {p.tipe === "teks" && (
                  <Input className="h-10 text-sm" placeholder="Jawaban..." value={getJ(p.id)} onChange={(e) => setJ(p.id, e.target.value)}
                    style={{ borderColor: p.validasi ? aksen : undefined }} />
                )}

                {/* Paragraf */}
                {p.tipe === "textarea" && (
                  <textarea className="min-h-[100px] w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-200 outline-none focus:border-emerald-500/50 resize-y" placeholder="Jawaban..." value={getJ(p.id)} onChange={(e) => setJ(p.id, e.target.value)} />
                )}

                {/* Radio */}
                {p.tipe === "radio" && p.opsi && JSON.parse(p.opsi).map((o: string, oi: number) => (
                  <label key={oi} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                    <input type="radio" name={`q-${p.id}`} value={o} checked={getJ(p.id) === o} onChange={(e) => setJ(p.id, e.target.value)}
                      className="text-emerald-500 focus:ring-emerald-500/50" style={{ accentColor: aksen }} />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{o}</span>
                  </label>
                ))}

                {/* Checkbox */}
                {p.tipe === "checkbox" && p.opsi && JSON.parse(p.opsi).map((o: string, oi: number) => (
                  <label key={oi} className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                    <input type="checkbox" value={o} checked={getCb(p.id).includes(o)} onChange={() => toggleCb(p.id, o)}
                      className="rounded text-emerald-500 focus:ring-emerald-500/50" style={{ accentColor: aksen }} />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{o}</span>
                  </label>
                ))}

                {/* Dropdown */}
                {p.tipe === "dropdown" && p.opsi && (
                  <select className="h-10 w-full rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 px-3 text-sm text-zinc-900 dark:text-zinc-300 outline-none focus:border-emerald-500/50"
                    value={getJ(p.id)} onChange={(e) => setJ(p.id, e.target.value)}>
                    <option value="">Pilih...</option>
                    {JSON.parse(p.opsi).map((o: string, oi: number) => <option key={oi} value={o}>{o}</option>)}
                  </select>
                )}

                {/* File Upload */}
                {p.tipe === "file" && (
                  <div className="space-y-3">
                    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-950/20 p-6 text-center hover:border-emerald-500/30 transition-colors cursor-pointer"
                      onClick={() => document.getElementById(`file-${p.id}`)?.click()}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10 text-zinc-400">
                        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zM2 7l10 5 10-5M12 22V12" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                          {files[p.id]?.name || "Tambahkan file"}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {p.fileFormat ? `Jenis: ${p.fileFormat.split(",").map((f: string) => f.trim()).join(", ")}` : "Semua jenis file"}
                          {p.fileMaxSize ? ` (hingga ${(p.fileMaxSize || 2048) >= 1024 ? `${(p.fileMaxSize || 2048) / 1024} MB` : `${p.fileMaxSize || 2048} KB`})` : ""}
                        </p>
                      </div>
                      <input id={`file-${p.id}`} type="file" className="hidden" multiple
                        onChange={(e) => {
                          const selectedFiles = e.target.files;
                          if (selectedFiles && selectedFiles.length > 0) {
                            setFiles((prev) => ({ ...prev, [p.id]: selectedFiles[0] }));
                          }
                        }} />
                    </div>
                    {files[p.id] && (
                      <div className="flex items-center justify-between rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6 text-emerald-500 shrink-0">
                            <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zM2 7l10 5 10-5M12 22V12" />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{files[p.id]?.name}</p>
                            <p className="text-[10px] text-zinc-500">{files[p.id] && `${(files[p.id]!.size / 1024).toFixed(1)} KB`}</p>
                          </div>
                        </div>
                        <button onClick={() => setFiles((prev) => ({ ...prev, [p.id]: null }))}
                          className="h-7 w-7 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Scale */}
                {p.tipe === "scale" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      {p.scaleLabelMin && <span className="text-[10px] text-zinc-500">{p.scaleLabelMin}</span>}
                      <div className="flex items-center gap-1">
                        {Array.from({ length: (p.scaleMax || 5) - (p.scaleMin || 1) + 1 }, (_, i) => (p.scaleMin || 1) + i).map((n) => (
                          <button key={n} type="button" onClick={() => setJ(p.id, String(n))}
                            className={`h-10 w-10 rounded-xl text-xs font-semibold border transition-all ${
                              getJ(p.id) === String(n)
                                ? "text-white shadow-md scale-105"
                                : "text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5"
                            }`}
                            style={getJ(p.id) === String(n) ? { backgroundColor: aksen, borderColor: aksen } : {}}>
                            {n}
                          </button>
                        ))}
                      </div>
                      {p.scaleLabelMax && <span className="text-[10px] text-zinc-500">{p.scaleLabelMax}</span>}
                    </div>
                    <div className="flex justify-between text-[10px] text-zinc-400 px-1">
                      <span>{p.scaleMin}</span><span>{p.scaleMax}</span>
                    </div>
                  </div>
                )}

                {/* Rating */}
                {p.tipe === "rating" && (
                  <div className="flex items-center gap-2 py-1">
                    {Array.from({ length: p.scaleMax || 5 }).map((_, i) => {
                      const starValue = i + 1;
                      const active = Number(getJ(p.id)) >= starValue;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setJ(p.id, String(starValue))}
                          className="transition-transform active:scale-90"
                          style={{ color: active ? aksen : "#71717a" }}
                        >
                          <svg
                            className="h-7 w-7"
                            fill={active ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.48 3.499c.195-.386.748-.386.943 0l2.368 4.675 5.156.746c.427.062.597.587.288.887L16.48 13.43l1.1 5.123c.092.428-.359.754-.737.551l-4.597-2.414-4.597 2.414c-.378.203-.83-.123-.73-.551l1.1-5.123L3.02 10.807c-.309-.3-.139-.825.288-.887l5.156-.746L11.48 3.5z"
                            />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Date */}
                {p.tipe === "date" && (
                  <Input type="date" className="h-10 text-sm" value={getJ(p.id)} onChange={(e) => setJ(p.id, e.target.value)} />
                )}

                {/* Time */}
                {p.tipe === "time" && (
                  <Input type="time" className="h-10 text-sm" value={getJ(p.id)} onChange={(e) => setJ(p.id, e.target.value)} />
                )}
              </div>
            </div>
          ))}
        </div>

        {validationError && <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-400">{validationError}</div>}

        <Button onClick={handleSubmit} disabled={submitting}
          className="w-full h-11 rounded-xl text-sm font-semibold text-white border-0"
          style={{ backgroundColor: aksen }}>
          {submitting ? "Mengirim..." : "Kirim"}
        </Button>

        <p className="mt-4 text-center text-[10px] text-zinc-400">SIKADERA — Sistem Informasi Kaderisasi DPC Dramaga</p>
      </div>
    </div>
  );
}
