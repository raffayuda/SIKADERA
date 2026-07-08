import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const kelompoks = await prisma.kelompokUpa.findMany({
      include: { _count: { select: { anggota: true } }, ketua: true },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(
      kelompoks.map((k) => ({
        ...k,
        id: Number(k.id),
        ketuaId: k.ketuaId !== null ? Number(k.ketuaId) : null,
        jumlahAnggota: k._count.anggota,
        _count: undefined,
        ketua: k.ketua ? {
          ...k.ketua,
          id: Number(k.ketua.id),
          userId: k.ketua.userId !== null ? Number(k.ketua.userId) : null,
          kelompokId: k.ketua.kelompokId !== null ? Number(k.ketua.kelompokId) : null,
        } : null,
      }))
    );
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/kelompok-upa error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const body = await req.json();
    const kelompok = await prisma.kelompokUpa.create({
      data: {
        namaKelompok: body.namaKelompok,
        ketuaId: body.ketuaId ? Number(body.ketuaId) : null,
        wilayah: body.wilayah,
        jadwalRutin: body.jadwalRutin,
        deskripsi: body.deskripsi,
      },
    });
    return NextResponse.json({
      ...kelompok,
      id: Number(kelompok.id),
      ketuaId: kelompok.ketuaId !== null ? Number(kelompok.ketuaId) : null,
    }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("POST /api/kelompok-upa error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
