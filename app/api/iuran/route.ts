import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const { searchParams } = req.nextUrl;
    const anggotaId = searchParams.get("anggota_id");
    const jenis = searchParams.get("jenis");

    const where: Record<string, unknown> = {};
    if (anggotaId) where.anggotaId = Number(anggotaId);
    if (jenis) where.jenis = jenis;

    const iuran = await prisma.iuran.findMany({
      where,
      include: { anggota: true },
      orderBy: { tanggal: "desc" },
    });

    return NextResponse.json(
      iuran.map((i) => ({
        ...i, id: Number(i.id), anggotaId: Number(i.anggotaId),
        anggota: i.anggota ? { ...i.anggota, id: Number(i.anggota.id) } : null,
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
    const iuran = await prisma.iuran.create({
      data: {
        anggotaId: Number(body.anggotaId),
        jenis: body.jenis || "iuran",
        nominal: Number(body.nominal),
        tanggal: body.tanggal ? new Date(body.tanggal) : new Date(),
        status: body.status || "belum_lunas",
        keterangan: body.keterangan,
      },
    });
    return NextResponse.json({ ...iuran, id: Number(iuran.id) }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
