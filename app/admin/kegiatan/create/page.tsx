"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconArrowLeft, IconCalendarEvent, IconClock, IconMapPin,
  IconUpload, IconTrash, IconPhoto,
} from "@tabler/icons-react";
import RichTextEditor from "@/components/rich-text-editor";

export default function CreateKegiatanPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    jenis: "",
    tanggal: "",
    jamMulai: "",
    jamSelesai: "",
    lokasi: "",
    mapsUrl: "",
    deskripsi: "",
  });
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  const [gambarPreview, setGambarPreview] = useState<string | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "poster") {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "banner") {
      setGambarFile(file);
      setGambarPreview(URL.createObjectURL(file));
    } else {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  }

  function handleRemoveFile(type: "banner" | "poster") {
    if (type === "banner") {
      setGambarFile(null);
      if (gambarPreview) URL.revokeObjectURL(gambarPreview);
      setGambarPreview(null);
    } else {
      setPosterFile(null);
      if (posterPreview) URL.revokeObjectURL(posterPreview);
      setPosterPreview(null);
    }
  }

  async function handleSave() {
    if (!formData.namaKegiatan) {
      setError("Nama kegiatan wajib diisi");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      let gambarUrl = "";
      let posterUrl = "";

      // Upload Banner
      if (gambarFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", gambarFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          gambarUrl = uploadData.url;
        }
      }

      // Upload Poster
      if (posterFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", posterFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadForm });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          posterUrl = uploadData.url;
        }
      }

      const payload = { ...formData, gambar: gambarUrl, poster: posterUrl };
      const res = await fetch("/api/kegiatan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push("/admin/kegiatan");
      } else {
        const err = await res.json().catch(() => ({ error: "Gagal menyimpan" }));
        setError(err.error || "Gagal menyimpan");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full px-6 sm:px-10 lg:px-16 pb-12">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" asChild className="h-8 rounded-xl px-2 text-zinc-400 hover:text-zinc-100 hover:bg-white/5">
          <Link href="/admin/kegiatan">
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="h-9 rounded-xl border-white/10 bg-white/5 px-4 text-xs text-zinc-300 hover:bg-white/10">
            <Link href="/admin/kegiatan">Batal</Link>
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="h-9 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-5 text-xs font-medium text-emerald-100 hover:bg-emerald-400/25"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Banner Gambar */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/60">
        {gambarPreview ? (
          <div className="relative">
            <img src={gambarPreview} alt="Banner" className="h-48 sm:h-64 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
            <button
              onClick={() => handleRemoveFile("banner")}
              className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
            >
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center h-48 sm:h-64 gap-2 text-zinc-500 hover:text-zinc-400 hover:bg-white/[0.02] transition-colors">
            <IconPhoto className="h-8 w-8" />
            <div className="text-center">
              <p className="text-xs font-semibold">Upload Banner Kegiatan (Horizontal)</p>
              <p className="text-[10px] text-zinc-600 mt-0.5">Rasio disarankan 16:9 atau lebar</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "banner")} />
          </label>
        )}
      </div>

      {/* Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Utama (Kiri) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Judul & Jenis */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Nama Kegiatan</Label>
              <input
                className="w-full border-0 border-b border-white/10 bg-transparent pb-2 text-xl font-bold text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500/50 transition-colors"
                placeholder="Nama kegiatan..."
                value={formData.namaKegiatan}
                onChange={(e) => setFormData({ ...formData, namaKegiatan: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Jenis Kegiatan</Label>
              <select
                className="h-9 w-full max-w-xs rounded-xl border border-white/10 bg-zinc-950 px-3 text-xs text-zinc-300 outline-none focus:border-emerald-500/50"
                value={formData.jenis}
                onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
              >
                <option value="">Pilih Jenis</option>
                <option value="Internal">Internal</option>
                <option value="Publik">Publik</option>
              </select>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Tanggal</Label>
              <div className="relative">
                <IconCalendarEvent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="date"
                  className="h-10 pl-10 text-xs"
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Waktu Mulai</Label>
              <div className="relative">
                <IconClock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="time"
                  className="h-10 pl-10 text-xs"
                  value={formData.jamMulai}
                  onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Waktu Selesai</Label>
              <Input
                type="time"
                className="h-10 text-xs"
                value={formData.jamSelesai}
                onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-400">Lokasi</Label>
              <div className="relative">
                <IconMapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  className="h-10 pl-10 text-xs"
                  placeholder="Lokasi kegiatan"
                  value={formData.lokasi}
                  onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
                />
              </div>
            </div>
            <div className="sm:col-span-2 space-y-1.5">
              <Label className="text-xs text-zinc-400">Link Google Maps <span className="text-zinc-600">(opsional)</span></Label>
              <Input
                className="h-10 text-xs"
                placeholder="https://maps.google.com/..."
                value={formData.mapsUrl}
                onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
              />
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* Deskripsi (RichTextEditor) */}
          <div className="space-y-1.5">
            <Label className="text-xs text-zinc-400">Detail Kegiatan</Label>
            <RichTextEditor
              value={formData.deskripsi}
              placeholder="Tulis konten detail kegiatan di sini..."
              onChange={(html) => setFormData({ ...formData, deskripsi: html })}
            />
          </div>
        </div>

        {/* Kolom Sidebar (Kanan) */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-white/10 bg-zinc-900/60 sticky top-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Poster Kegiatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-zinc-950 aspect-[3/4] flex items-center justify-center">
                {posterPreview ? (
                  <div className="relative w-full h-full">
                    <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleRemoveFile("poster")}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                    >
                      <IconTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center w-full h-full p-4 gap-2 text-zinc-500 hover:text-zinc-400 hover:bg-white/[0.01] transition-colors text-center">
                    <IconPhoto className="h-7 w-7" />
                    <p className="text-[11px] font-medium">Upload Poster (Vertikal)</p>
                    <p className="text-[9px] text-zinc-600 leading-tight">Mendukung file JPG, PNG. Rasio vertikal 3:4 atau A4.</p>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e, "poster")} />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
