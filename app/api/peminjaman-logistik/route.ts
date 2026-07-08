import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireRole("admin", "pembimbing");
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const peminjaman = await prisma.peminjamanLogistik.findMany({
      where,
      include: { anggota: true, logistik: true },
      orderBy: { tanggalPinjam: "desc" },
    });

    return NextResponse.json(
      peminjaman.map((p) => ({
        ...p, id: Number(p.id), anggotaId: Number(p.anggotaId), logistikId: Number(p.logistikId),
        anggota: p.anggota ? { ...p.anggota, id: Number(p.anggota.id) } : null,
        logistik: p.logistik ? { ...p.logistik, id: Number(p.logistik.id) } : null,
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
    const peminjaman = await prisma.peminjamanLogistik.create({
      data: {
        anggotaId: Number(body.anggotaId),
        logistikId: Number(body.logistikId),
        jumlahPinjam: Number(body.jumlahPinjam),
        tanggalPinjam: body.tanggalPinjam ? new Date(body.tanggalPinjam) : new Date(),
        tanggalKembali: body.tanggalKembali ? new Date(body.tanggalKembali) : null,
        status: body.status || "dipinjam",
      },
    });
    return NextResponse.json({ ...peminjaman, id: Number(peminjaman.id) }, { status: 201 });
  } catch (error) {
    if ((error as { code?: string }).code === "NEXT_REDIRECT") throw error;
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}
