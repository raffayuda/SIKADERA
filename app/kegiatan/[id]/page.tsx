import { Metadata } from "next";
import { notFound } from "next/navigation";

interface Kegiatan {
  id: number;
  namaKegiatan: string;
  jenis: string | null;
  tanggal: string | null;
  jamMulai: string | null;
  jamSelesai: string | null;
  lokasi: string | null;
  mapsUrl: string | null;
  gambar: string | null;
  poster: string | null;
  deskripsi: string | null;
}

async function getKegiatan(id: string): Promise<Kegiatan | null> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/publik/kegiatan/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const kegiatan = await getKegiatan(id);
  if (!kegiatan) return { title: "Kegiatan tidak ditemukan" };

  return {
    title: `${kegiatan.namaKegiatan} — SIKADERA`,
    description: kegiatan.deskripsi?.replace(/<[^>]*>/g, "").slice(0, 160) || `Kegiatan ${kegiatan.namaKegiatan}`,
    openGraph: {
      title: kegiatan.namaKegiatan,
      description: kegiatan.deskripsi?.replace(/<[^>]*>/g, "").slice(0, 160) || undefined,
      ...(kegiatan.gambar && {
        images: [{ url: kegiatan.gambar, width: 1200, height: 630 }],
      }),
      type: "article",
    },
  };
}

export default async function KegiatanPublikPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const kegiatan = await getKegiatan(id);
  if (!kegiatan) notFound();

  const tanggal = kegiatan.tanggal
    ? new Date(kegiatan.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const waktu =
    kegiatan.jamMulai && kegiatan.jamSelesai
      ? `${kegiatan.jamMulai} — ${kegiatan.jamSelesai}`
      : kegiatan.jamMulai || null;

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-16">
      {/* Banner */}
      {kegiatan.gambar && (
        <div className="relative w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <div className="aspect-video w-full">
            <img
              src={kegiatan.gambar}
              alt={kegiatan.namaKegiatan}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent dark:from-zinc-950 dark:via-zinc-950/20 dark:to-transparent pointer-events-none" />
        </div>
      )}

      <div className="w-full px-6 sm:px-10 lg:px-16 pt-8">
        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Kolom Kiri: Konten */}
          <div className="lg:col-span-2 space-y-6">
            {/* Jenis badge */}
            {kegiatan.jenis && (
              <span className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
                {kegiatan.jenis}
              </span>
            )}

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {kegiatan.namaKegiatan}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              {tanggal && (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{tanggal}</span>
                </div>
              )}
              {waktu && (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{waktu}</span>
                </div>
              )}
              {kegiatan.lokasi && (
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {kegiatan.mapsUrl ? (
                    <a
                      href={kegiatan.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-2 decoration-zinc-300 dark:decoration-white/20 hover:text-emerald-600 dark:hover:text-emerald-300 hover:decoration-emerald-500/40 transition-colors"
                    >
                      {kegiatan.lokasi}
                    </a>
                  ) : (
                    <span>{kegiatan.lokasi}</span>
                  )}
                </div>
              )}
            </div>

            {/* Description (HTML renderer) */}
            {kegiatan.deskripsi && (
              <div className="mt-8 border-t border-zinc-200 dark:border-white/10 pt-8">
                <h2 className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-4">Tentang Kegiatan</h2>
                <div
                  className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed prose prose-zinc dark:prose-invert max-w-none prose-emerald prose-headings:text-zinc-900 dark:prose-headings:text-white prose-a:text-emerald-500 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-0.5"
                  dangerouslySetInnerHTML={{ __html: kegiatan.deskripsi }}
                />
              </div>
            )}
          </div>

          {/* Kolom Kanan: Poster */}
          <div className="space-y-6">
            {kegiatan.poster && (
              <div className="sticky top-6 overflow-hidden rounded-2xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-zinc-900/60 p-3 shadow-md">
                <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-950 aspect-[3/4]">
                  <img
                    src={kegiatan.poster}
                    alt="Poster Kegiatan"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 border-t border-zinc-200 dark:border-white/10 py-8 text-center">
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            SIKADERA — Sistem Informasi Kaderisasi DPC Dramaga
          </p>
        </div>
      </div>
    </article>
  );
}
