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
          include: { anggota: { include: { kelompok: true } } },
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
      absensiKegiatan: kegiatan.absensiKegiatan.map((a) => ({
        ...a, id: Number(a.id), kegiatanId: Number(a.kegiatanId), anggotaId: Number(a.anggotaId),
        anggota: a.anggota ? { ...a.anggota, id: Number(a.anggota.id) } : null,
      })),
    });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
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
        lokasi: body.lokasi,
        penanggungJawab: body.penanggungJawab ? Number(body.penanggungJawab) : null,
        deskripsi: body.deskripsi,
      },
    });
    return NextResponse.json({ ...kegiatan, id: Number(kegiatan.id) });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
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
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
