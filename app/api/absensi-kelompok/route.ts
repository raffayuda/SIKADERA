import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const { searchParams } = req.nextUrl;
    const kelompokId = searchParams.get("kelompok_id");
    const tanggal = searchParams.get("tanggal");

    const where: Record<string, unknown> = {};
    if (kelompokId) where.kelompokId = Number(kelompokId);
    if (tanggal) where.tanggal = new Date(tanggal);

    const absensi = await prisma.absensiKelompok.findMany({
      where,
      include: { anggota: true, kelompok: true },
      orderBy: { tanggal: "desc" },
    });

    return NextResponse.json(
      absensi.map((a) => ({
        ...a,
        id: Number(a.id),
        kelompokId: a.kelompokId !== null ? Number(a.kelompokId) : null,
        anggotaId: a.anggotaId !== null ? Number(a.anggotaId) : null,
        anggota: a.anggota ? {
          ...a.anggota,
          id: Number(a.anggota.id),
          userId: a.anggota.userId !== null ? Number(a.anggota.userId) : null,
          kelompokId: a.anggota.kelompokId !== null ? Number(a.anggota.kelompokId) : null,
        } : null,
        kelompok: a.kelompok ? {
          ...a.kelompok,
          id: Number(a.kelompok.id),
          ketuaId: a.kelompok.ketuaId !== null ? Number(a.kelompok.ketuaId) : null,
        } : null,
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
        body.map((item: { kelompokId: number; anggotaId: number; tanggal: string; status: string }) =>
          prisma.absensiKelompok.create({
            data: {
              kelompokId: Number(item.kelompokId),
              anggotaId: Number(item.anggotaId),
              tanggal: new Date(item.tanggal),
              status: item.status || "hadir",
            },
          })
        )
      );
      return NextResponse.json(results.map((r) => ({
        ...r,
        id: Number(r.id),
        kelompokId: r.kelompokId !== null ? Number(r.kelompokId) : null,
        anggotaId: r.anggotaId !== null ? Number(r.anggotaId) : null,
      })), { status: 201 });
    }

    const absensi = await prisma.absensiKelompok.create({
      data: {
        kelompokId: Number(body.kelompokId),
        anggotaId: Number(body.anggotaId),
        tanggal: new Date(body.tanggal),
        status: body.status || "hadir",
      },
    });
    return NextResponse.json({
      ...absensi,
      id: Number(absensi.id),
      kelompokId: absensi.kelompokId !== null ? Number(absensi.kelompokId) : null,
      anggotaId: absensi.anggotaId !== null ? Number(absensi.anggotaId) : null,
    }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
