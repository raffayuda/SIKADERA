import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const kegiatan = await prisma.kegiatan.findMany({
      include: { _count: { select: { absensiKegiatan: true } } },
      orderBy: { tanggal: "desc" },
    });
    return NextResponse.json(
      kegiatan.map((k) => ({
        ...k,
        id: Number(k.id),
        jumlahPeserta: k._count.absensiKegiatan,
        _count: undefined,
      }))
    );
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const body = await req.json();
    const kegiatan = await prisma.kegiatan.create({
      data: {
        namaKegiatan: body.namaKegiatan,
        jenis: body.jenis,
        tanggal: body.tanggal ? new Date(body.tanggal) : null,
        lokasi: body.lokasi,
        penanggungJawab: body.penanggungJawab ? Number(body.penanggungJawab) : null,
        deskripsi: body.deskripsi,
      },
    });
    return NextResponse.json({ ...kegiatan, id: Number(kegiatan.id) }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
