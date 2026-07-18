import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const kegiatan = await prisma.kegiatan.findUnique({
      where: { id: BigInt(id) },
      include: {
        absensiKegiatan: {
          include: { anggota: true },
          orderBy: { id: "asc" },
        },
      },
    });
    if (!kegiatan) {
      return NextResponse.json({ error: "Kegiatan tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json({
      ...kegiatan,
      id: Number(kegiatan.id),
      penanggungJawab: kegiatan.penanggungJawab ? Number(kegiatan.penanggungJawab) : null,
      absensiKegiatan: kegiatan.absensiKegiatan.map((a) => ({
        ...a, id: Number(a.id), kegiatanId: Number(a.kegiatanId), anggotaId: Number(a.anggotaId),
        anggota: a.anggota ? {
          ...a.anggota,
          id: Number(a.anggota.id),
          userId: a.anggota.userId ? Number(a.anggota.userId) : null,
          kelompokId: a.anggota.kelompokId ? Number(a.anggota.kelompokId) : null,
        } : null,
      })),
    });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/kegiatan/[id] error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin", "pembimbing");
    const { id } = await params;
    const body = await req.json();
    const kegiatan = await prisma.kegiatan.update({
      where: { id: BigInt(id) },
      data: {
        namaKegiatan: body.namaKegiatan,
        jenis: body.jenis,
        tanggal: body.tanggal ? new Date(body.tanggal) : null,
        jamMulai: body.jamMulai,
        jamSelesai: body.jamSelesai,
        lokasi: body.lokasi,
        mapsUrl: body.mapsUrl,
        gambar: body.gambar,
        poster: body.poster || null,
        penanggungJawab: body.penanggungJawab ? Number(body.penanggungJawab) : null,
        deskripsi: body.deskripsi,
      },
    });
    return NextResponse.json({ ...kegiatan, id: Number(kegiatan.id), penanggungJawab: kegiatan.penanggungJawab ? Number(kegiatan.penanggungJawab) : null });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("admin");
    const { id } = await params;
    await prisma.kegiatan.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
