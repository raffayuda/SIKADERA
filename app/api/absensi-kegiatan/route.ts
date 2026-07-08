import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const { searchParams } = req.nextUrl;
    const kegiatanId = searchParams.get("kegiatan_id");

    const where: Record<string, unknown> = {};
    if (kegiatanId) where.kegiatanId = Number(kegiatanId);

    const absensi = await prisma.absensiKegiatan.findMany({
      where,
      include: { anggota: true, kegiatan: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(
      absensi.map((a) => ({
        ...a, id: Number(a.id), kegiatanId: Number(a.kegiatanId), anggotaId: Number(a.anggotaId),
        anggota: a.anggota ? { ...a.anggota, id: Number(a.anggota.id) } : null,
        kegiatan: a.kegiatan ? { ...a.kegiatan, id: Number(a.kegiatan.id) } : null,
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

    if (Array.isArray(body)) {
      const results = await prisma.$transaction(
        body.map((item: { kegiatanId: number; anggotaId: number; status: string }) =>
          prisma.absensiKegiatan.create({
            data: {
              kegiatanId: Number(item.kegiatanId),
              anggotaId: Number(item.anggotaId),
              status: item.status || "hadir",
            },
          })
        )
      );
      return NextResponse.json(results.map((r) => ({ ...r, id: Number(r.id) })), { status: 201 });
    }

    const absensi = await prisma.absensiKegiatan.create({
      data: {
        kegiatanId: Number(body.kegiatanId),
        anggotaId: Number(body.anggotaId),
        status: body.status || "hadir",
      },
    });
    return NextResponse.json({ ...absensi, id: Number(absensi.id) }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
