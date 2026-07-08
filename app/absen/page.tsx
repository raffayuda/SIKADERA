"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconCircleCheck, IconCircleX, IconCamera } from "@tabler/icons-react";

function AbsenForm() {
  const searchParams = useSearchParams();
  const kelompokId = searchParams.get("kelompok");
  const tanggal = searchParams.get("tanggal");

  const [anggotaList, setAnggotaList] = useState<{ id: number; namaLengkap: string; sudahAbsen: boolean }[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!kelompokId || !tanggal) return;
    fetch(`/api/absen?kelompok_id=${kelompokId}&tanggal=${tanggal}`)
      .then((r) => r.json())
      .then((data) => {
        setAnggotaList(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("Gagal memuat data");
        setLoading(false);
      });
  }, [kelompokId, tanggal]);

  async function handleAbsen(anggotaId: number) {
    setSubmitting(anggotaId);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/absen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kelompok_id: kelompokId, tanggal, anggota_id: anggotaId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Absen berhasil!`);
        setAnggotaList((prev) => prev.map((a) => (a.id === anggotaId ? { ...a, sudahAbsen: true } : a)));
      } else {
        setError(data.error || "Gagal absen");
      }
    } catch {
      setError("Terjadi kesalahan");
    } finally {
      setSubmitting(null);
    }
  }

  if (!kelompokId || !tanggal) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
        <Card className="w-full max-w-sm rounded-2xl border-white/10 bg-zinc-900/60 text-center">
          <CardContent className="p-8">
            <IconCircleX className="mx-auto h-10 w-10 text-rose-400 mb-3" />
            <p className="text-sm text-zinc-400">Link absensi tidak valid</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filtered = anggotaList.filter((a) =>
    a.namaLengkap.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-950 p-4 pt-12">
      <Card className="w-full max-w-md rounded-2xl border-white/10 bg-zinc-900/60">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
            <IconCamera className="h-6 w-6" />
          </div>
          <CardTitle className="text-lg text-zinc-50">Absensi Mandiri</CardTitle>
          <CardDescription className="text-xs">
            {new Date(tanggal + "T00:00:00").toLocaleDateString("id-ID", {
              weekday: "long", day: "numeric", month: "long", year: "numeric",
            })}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-2">
          {tanggal && (
            <div className="flex h-8 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/50 px-3">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-full w-full border-0 bg-transparent text-xs text-zinc-200 placeholder:text-zinc-500 outline-none"
                placeholder="Cari nama..."
              />
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[10px] text-rose-300 text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[10px] text-emerald-300 text-center">
              {success}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
              <p className="mt-2 text-[10px] text-zinc-500">Memuat data...</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-xs text-zinc-500 py-8">Anggota tidak ditemukan</p>
          ) : (
            <div className="space-y-1.5 max-h-[50vh] overflow-y-auto">
              {filtered.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <span className="text-xs text-zinc-200">{a.namaLengkap}</span>
                  {a.sudahAbsen ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                      <IconCircleCheck className="h-3.5 w-3.5" />
                      Hadir
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      disabled={submitting === a.id}
                      onClick={() => handleAbsen(a.id)}
                      className="h-7 rounded-xl border border-emerald-400/40 bg-emerald-400/15 px-3 text-[10px] font-medium text-emerald-100 hover:bg-emerald-400/25"
                    >
                      {submitting === a.id ? "..." : "Absen"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AbsenPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
      </div>
    }>
      <AbsenForm />
    </Suspense>
  );
}
