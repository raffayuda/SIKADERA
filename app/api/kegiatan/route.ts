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
        penanggungJawab: k.penanggungJawab ? Number(k.penanggungJawab) : null,
        jumlahPeserta: k._count.absensiKegiatan,
        _count: undefined,
      }))
    );
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/kegiatan error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
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
        jamMulai: body.jamMulai,
        jamSelesai: body.jamSelesai,
        lokasi: body.lokasi,
        mapsUrl: body.mapsUrl,
        gambar: body.gambar,
        penanggungJawab: body.penanggungJawab ? Number(body.penanggungJawab) : null,
        deskripsi: body.deskripsi,
      },
    });
    return NextResponse.json({ ...kegiatan, id: Number(kegiatan.id), penanggungJawab: kegiatan.penanggungJawab ? Number(kegiatan.penanggungJawab) : null }, { status: 201 });
  } catch (error) {
    if (String(error).includes("NEXT_REDIRECT")) throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("POST /api/kegiatan error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
